package
{
	import flash.display.Loader;
	import flash.display.Stage;
	import flash.events.Event;
	import flash.events.KeyboardEvent;
	import flash.events.MouseEvent;
	import flash.events.TimerEvent;
	import flash.text.TextField;
	import flash.utils.Timer;
	import flash.utils.clearInterval;
	import flash.utils.describeType;
	import flash.utils.getQualifiedClassName;
	import flash.utils.setInterval;
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
		private var _openTestCaseLoader:Boolean;

		private var _classMap:Object;
		private var _uiComponent:Class;
		private var _dispatchEventHook:Function;
		private var _lastSpyComponent:*;

		private var _loader:Loader;
		private var _content:*;
		private var _stage:Stage;

		private var _queueMap:Object;
		private var _queueList:Array;
		private var _queueInterval:Number;

		[Embed(source="../FlexDoorRunner/flexdoor.swf", mimeType="application/octet-stream")]
		private var _flexdoorSWF:Class;

		private var _excludeEvents:Object = {
			
		};

		public function FlexDoorUtil(flexDoor:FlexDoor, application:*, openTestCaseLoader:Boolean){
			_flexDoor = flexDoor;
			_application = application;
			_openTestCaseLoader = openTestCaseLoader;

			_queueMap = {};
			_queueList = [];

			_loader = new Loader(); 
			_loader.loadBytes(new _flexdoorSWF()); 
			_loader.contentLoaderInfo.addEventListener(Event.COMPLETE, onComplete);
			application.systemManager.addChild(_loader);

			_uiComponent = _flexDoor.getClassByName("mx.core::UIComponent");
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

		private function clear():void{
			_lastSpyComponent = null;
			_queueMap = {};
			_queueList = [];
		}

		private function mouseMoveEventHandler(event:MouseEvent):void{
			if(_lastSpyComponent != event.target){
				_lastSpyComponent = event.target;
				getComponentInfo(_lastSpyComponent, [], {});
			}
		}

		public function spyObjects(enable:Boolean):void{
			if(_stage != null){
				_stage.removeEventListener(MouseEvent.MOUSE_MOVE, mouseMoveEventHandler);
				if(enable == true)
					_stage.addEventListener(MouseEvent.MOUSE_MOVE, mouseMoveEventHandler);
			}
		}

		public function stopSpyEvents():void{
			_uiComponent.mx_internal::dispatchEventHook = _dispatchEventHook;
			clearInterval(_queueInterval);
		}

		public function startSpyEvents():void{
			if(_content != null){
				_uiComponent.mx_internal::dispatchEventHook = function(event:Event, uicomponent:*):void{
					var eventKey:String = getQualifiedClassName(event) + '_' + event.type;
					if(_excludeEvents[eventKey] == true) return;
					var uniqKey:String =  eventKey + '_' + uicomponent.toString();
					if(_queueMap[uniqKey] == null){
						_queueList.unshift({event:event, uicomponent:uicomponent});
						_queueMap[uniqKey] = true; //do not add the same event types
					}
				}
				clearInterval(_queueInterval);
				_queueInterval = setInterval(readQueue, 100);
			}
		}


		private function readQueue():void{
			if(_queueList.length > 0){
				var queue:Object = _queueList.pop();
				var event:Event = queue.event;
				var uicomponent:* = queue.uicomponent;
				var uniqKey:String = getQualifiedClassName(event) + '_' + event.type + '_' + uicomponent.toString();
				delete _queueMap[uniqKey];
			
				var components:Array = [];
				var includes:Object = {};
				var eventType:XML = describeType(event);
				includes[eventType.@name.toString()] = 0;

				getComponentInfo(uicomponent, components, includes);

				if(components.length > 0){
					var uid:String = (uicomponent.hasOwnProperty("uid") ? uicomponent.uid : uicomponent.toString());
					_content.addNewEvent({event:JSClasses.eventInfo(event), uid:uid});
				}
			};
		}

		private function getComponentInfo(uicomponent:*, components:Array, includes:Object):void{
			var uniqNames:Object = {};

			function getInfo(c:*, childRef:*=null, childId:String=null):String{
				if(c != _application && c != _application.systemManager){
					var type:XML = describeType(c);
					var extendsClass:XMLList = <></>;
					extendsClass += new XML('<extendsClass type="' + type.@name.toString() + '"/>') + type.extendsClass;
					for(var i:uint = 0; i < extendsClass.length(); i++){
						var pckgName:String = extendsClass[i].@type.toString();
						if(pckgName == "mx.controls::ToolTip") return null;
						var alias:String = _classMap[pckgName];
						if(alias != null){
							if(pckgName.indexOf("mx.core::") != 0) //skip mx.core namespace 
								includes[pckgName] = alias;
							var variableName:String = (c.hasOwnProperty('id') && c.id != null ? c.id : c.name);
							if(uniqNames[variableName] == null){
								uniqNames[variableName] = 0;
							}else{
								uniqNames[variableName] += 1;
								variableName += '$' + uniqNames[variableName]; //attach index for repeating variable names
							}
							var parent:* = c.parent;
							if(c.hasOwnProperty('id') && c.id != null){
								//Try to find a parent reference by id
								while(parent != null){
									if( parent.hasOwnProperty(c.id) &&
										parent[c.id] == c){
										break;
									}
									parent = parent.parent;
								}
							}
							if(parent == null)
								parent = c.parent;
							var parentName:String = getInfo(parent);
							if(parentName == null){ //probably is systemManager child
								components.push('var ' + variableName + ' = this.app.getPopupWindow("' + type.@name.toString() + '");');
							}else{
								try{
									if(c.id != null && parent[c.id]){
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
			}
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

					_stage = _loader.stage;
					_stage.addEventListener(KeyboardEvent.KEY_DOWN, onKeyDownEventHanlder);
					_content.x = (_stage.stageWidth - _content.width) / 2;
					_content.y = (_stage.stageHeight - _content.height) / 2;
					_content.addEventListener("close", spyEventHandler);
					_content.addEventListener("clear", spyEventHandler);
					_content.addEventListener("startSpyEvents", spyEventHandler);
					_content.addEventListener("stopSpyEvents", spyEventHandler);
					_content.addEventListener("startSpyObjects", spyEventHandler);
					_content.addEventListener("stopSpyObjects", spyEventHandler);

					if(_openTestCaseLoader == true){
						_content.openTestCases();
					}else{
						_content.initialized();
					}
				}
			};
			var timer:Timer = new Timer(100);
			timer.addEventListener(TimerEvent.TIMER, handleTimer);
			timer.start();
		}

		private function spyEventHandler(event:Event):void{
			switch(event.type){
				case "startSpyEvents":
					startSpyEvents();
					break;
				case "stopSpyEvents":
					stopSpyEvents();
					break;
				case "startSpyObjects":
					spyObjects(true);
					break;
				case "stopSpyObjects":
					spyObjects(false);
					break;
				case "clear":
					clear();
					break;
				case "close":
					clear();
					stopSpyEvents();
					spyObjects(false);
					break;
			}
		}

		private function onKeyDownEventHanlder(event:KeyboardEvent):void{
			if(event.ctrlKey && event.altKey){
				switch(String.fromCharCode(event.charCode).toUpperCase()){
					case 'A':
						_content.openAdvanced();
						break;
					case 'C':
						_content.clearAll();
						break;
					case 'L':
						_content.closeWindow();
						break;
					case 'E':
						_content.spyEvents();
						break;
					case 'O':
						_content.spyObjects();
						break;
					case 'S':
						_content.saveAdvancedSettings();
						break;
					case 'T':
						_content.openTestCases();
						break;
				}
			}
		}

		public function openInspector():void{
			_content.openInspector();
		}
	}
}