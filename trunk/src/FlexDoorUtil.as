package
{
	import flash.display.Loader;
	import flash.display.Stage;
	import flash.events.Event;
	import flash.events.TimerEvent;
	import flash.text.TextField;
	import flash.utils.Timer;
	import flash.utils.describeType;
	import flash.utils.setTimeout;
	
	import mx.core.mx_internal;

	use namespace mx_internal;

	public class FlexDoorUtil
	{
		private static var _flexDoor:FlexDoor;
		private static var _textField:TextField;

		private var _topChildren:Array;
		private var _topChildIndex:Number;
		private var _delayInterval:Number;
		private var _application:*;

		private var _classMap:Object;
		private var _uiComponent:Class;
		private var _dispatchEventHook:Function;

		[Embed(source="../fla/flexdoor.swf", mimeType="application/octet-stream")]
		private var _flexdoorSWF:Class;
		private var _loader:Loader;
		private var _content:*;

		private var _eventsMap:Object;

		public function FlexDoorUtil(flexDoor:FlexDoor, application:*){
			_flexDoor = flexDoor;
			_application = application;

			_eventsMap = {};

			_loader = new Loader(); 
			_loader.loadBytes(new _flexdoorSWF()); 
			_loader.contentLoaderInfo.addEventListener(Event.COMPLETE, onComplete);
			application.systemManager.addChild(_loader);

			try{
				_uiComponent = _flexDoor.js_class("mx.core::UIComponent", false) as Class;
			}catch(e:Error){}
			if(_uiComponent == null)
				throw new Error("UIComponent is undefined");

			_dispatchEventHook = _uiComponent.mx_internal::dispatchEventHook;

			_classMap = {}
			for(var i:uint = 0; i < JSClasses.list.length; i++){
				var jsClass:String = JSClasses.list[i];
				var lastIndex:uint = jsClass.lastIndexOf('.');
				var pckgName:String = jsClass.substring(0, lastIndex);
				var className:String = jsClass.substring(lastIndex + 1);
				for(var a:uint = 0; a < JSClasses.aliases.length; a++){
					var o:Object = JSClasses.aliases[a];
					if(pckgName.indexOf(o.prefix) == 0){
						_classMap[pckgName + '::' + className] = o.alias + className;
						break;
					}
				}
			}
		}

		public function stopSpy():void{
			_uiComponent.mx_internal::dispatchEventHook = _dispatchEventHook;
		}

		public function runSpy():void{
			_uiComponent.mx_internal::dispatchEventHook = function(event:Event, uicomponent:*):void{
				if(_content == null) return;
				var eventType:XML = describeType(event);
				var uniqKey:String = eventType.@name.toString() + '_' + event.type + '_' + uicomponent.uid;
				if(_eventsMap[uniqKey] != null) return;
				_eventsMap[uniqKey] = true; //do not add the same event types

				_uiComponent.mx_internal::dispatchEventHook = null;
				setTimeout(runSpy, 100); //enable dispatchEventHook after 100 milliseconds

				var components:Array = [];
				var includes:Object = {};
				var uniqNames:Object = {};
				includes[eventType.@name.toString()] = 0;

				function getInfo(c:*):String{
					if(c != _application && c != _application.systemManager){
						var type:XML = describeType(c);
						var extendsClass:XMLList = <></>;
						extendsClass += new XML('<extendsClass type="' + type.@name.toString() + '"/>') + type.extendsClass;
						for(var i:uint = 0; i < extendsClass.length(); i++){
							var pckgName:String = extendsClass[i].@type.toString();
							if(pckgName == "mx.controls::ToolTip") return null;
							var alias:String = _classMap[pckgName];
							if(alias != null){
								includes[pckgName] = alias;
								var variableName:String = (c.id != null ? c.id : c.name);
								if(uniqNames[variableName] == null){
									uniqNames[variableName] = 0;
								}else{
									uniqNames[variableName] += 1;
									variableName += '$' + uniqNames[variableName]; //attach index for repeating variable names
								}
								var parentName:String = getInfo(c.parent);
								if(parentName == null){ //probably is systemManager child
									components.push('var ' + variableName + ' = this.app.getPopupWindow("' + type.@name.toString() + '");');
								}else{
									try{
										if(c.id != null && c.parent[c.id]){
											components.push('var ' + variableName + ' = ' + alias + '.Get(' + parentName + '.find("' + c.id + '"));');
											return variableName;
										}
									}catch(e:Error){};

									var classType:String = type.@base.toString();
									var visibleCount:int = findIndexByClassType(c, "numElements", "getElementAt", classType);
									if(visibleCount == -1)
										visibleCount = findIndexByClassType(c, "numChildren", "getChildAt", classType);

									if(visibleCount != -1){
										components.push('var ' + variableName + ' = ' + alias + '.Get(' + parentName + '.getChildByType("' + classType + '", ' + visibleCount + '));');
										return variableName;
									}

									components.push('var ' + variableName + ' = ' + alias + '.Get(' + parentName + '.getChildByName("' + c.name + '"));');
								}
								return variableName;
							}
						}
					}else if(c == _application){
						return 'this.app';
					}
					return null;
				};
				getInfo(uicomponent);

				if(components.length > 0){
					var code:String = null;
					for(var pckg:String in includes){
						if(code == null){
							code = '//' + uicomponent.toString() + '\n\nthis.include(\n';
						}else{
							code += ',\n';
						}
						code += '"' + pckg + '"';
					}
					code += ');\n\n' + components.join('\n');

					var uid:String = (uicomponent.hasOwnProperty("uid") ? uicomponent.uid : uicomponent.toString());
					_content.addComponent({name:uicomponent.name, uid:uid, code:code});
					_content.addNewEvent({event:JSClasses.eventInfo(event), uid:uid});
				}
			};
		}

		private function findIndexByClassType(target:*, numName:String, funName:String, classType:String):int{
			if( target.parent.hasOwnProperty(numName) && 
				target.parent.hasOwnProperty(funName) && 
				target.parent[funName] is Function){
				var visibleCount:uint = 0;
				var length:uint = target.parent[numName];
				var func:Function = target.parent[funName];

				for(var i:uint = 0; i < length; i++){
					var child:* = func(i);
					if(child.visible != true)
						continue;
					if(child == target){
						return visibleCount;
					}else{
						var childType:XML = describeType(child);
						if( childType.@base.toString() == classType || 
							childType.@name.toString() == classType){
							visibleCount++;
						}
					}
				}
			}
			return -1;
		}

		private function onComplete(event:Event):void{
			event.target.removeEventListener(Event.COMPLETE, onComplete);

			function handleTimer(event:TimerEvent):void{
				_content = _loader.content;
				if(_content && _content.numChildren > 0) {
					event.target.addEventListener(TimerEvent.TIMER, handleTimer);
					event.target.stop();

					var stage:Stage = _application.stage;
					_content.x = (stage.stageWidth - _content.width) / 2;
					_content.y = (stage.stageHeight - _content.height) / 2;
					_content.addEventListener("close", spyEventHandler);
					_content.addEventListener("clear", spyEventHandler);
					_content.addEventListener("start", spyEventHandler);
					_content.addEventListener("stop", spyEventHandler);
				}
			};
			var timer:Timer = new Timer(100);
			timer.addEventListener(TimerEvent.TIMER, handleTimer);
			timer.start();
		}

		private function spyEventHandler(event:Event):void{
			switch(event.type){
				case "start":
					runSpy();
					break;
				case "stop":
					stopSpy();
					break;
				case "clear":
				case "close":
					_eventsMap = {};
					break;
			}
		}

		public function showContent():void{
			_content.visible = true;
		}
	}
}