package
{
	import flash.display.Loader;
	import flash.display.Stage;
	import flash.events.Event;
	import flash.events.TimerEvent;
	import flash.text.TextField;
	import flash.utils.Timer;
	import flash.utils.describeType;
	import flash.utils.getDefinitionByName;
	
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

		[Embed(source="../fla/flexdoor.swf", mimeType="application/octet-stream")]
		private var _flexdoorSWF:Class;
		private var _loader:Loader;
		private var _content:*;

		public function FlexDoorUtil(flexDoor:FlexDoor, application:*){
			_flexDoor = flexDoor;
			_application = application;

			_loader = new Loader(); 
			_loader.loadBytes(new _flexdoorSWF()); 
			_loader.contentLoaderInfo.addEventListener(Event.COMPLETE, onComplete);
			application.systemManager.addChild(_loader);

			var uiComponent:Class = null;
			try{
				uiComponent = getDefinitionByName("mx.core::UIComponent") as Class;
			}catch(e:Error){}
			if(uiComponent == null)
				return;

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

			uiComponent.mx_internal::dispatchEventHook = function(event:Event, uicomponent:*):void{
				if(_content == null) return;
				var components:Array = [];
				var eventType:XML = describeType(event);
				var includes:Object = {};
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
								var variableName:String = c.name;
								if(includes[pckgName] == null){
									includes[pckgName] = 0;
								}else{
									includes[pckgName] += 1;
									variableName += '$' + includes[pckgName]; //attach index for repeating variable names
								}
								var parentName:String = getInfo(c.parent);
								if(parentName == null){ //probably is systemManager child
									components.push('var ' + variableName + ' = this.app.getPopupWindow("' + type.@name.toString() + '");');
								}else{
									components.push('var ' + variableName + ' = ' + alias + '.Get(' + parentName + '.find("' + c.name + '"));');
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
							code = 'this.include(\n';
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
				}
			};
			var timer:Timer = new Timer(100);
			timer.addEventListener(TimerEvent.TIMER, handleTimer);
			timer.start();
		}
	}
}