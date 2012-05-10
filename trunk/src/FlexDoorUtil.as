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

		public function FlexDoorUtil(flexDoor:FlexDoor, application:*){
			_flexDoor = flexDoor;
			_application = application;

			_queueMap = {};
			_queueList = [];

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

			_loader = new Loader(); 
			_loader.loadBytes(new _flexdoorSWF()); 
			_loader.contentLoaderInfo.addEventListener(Event.COMPLETE, onComplete);
			application.systemManager.cursorChildren.addChild(_loader);
		}

		private function clear():void{
			_lastSpyComponent = null;
			_queueMap = {};
			_queueList = [];
		}

		private function mouseMoveEventHandler(event:MouseEvent):void{
			if(_lastSpyComponent != event.target){
				_lastSpyComponent = event.target;
				getComponentInfo(_lastSpyComponent, [], [], {});
			}
		}

		public function inspectObjects(active:Boolean):void{
			if(_stage != null){
				_stage.removeEventListener(MouseEvent.MOUSE_MOVE, mouseMoveEventHandler);
				if(active == true)
					_stage.addEventListener(MouseEvent.MOUSE_MOVE, mouseMoveEventHandler);
			}
		}

		public function inspectEvents(active:Boolean):void{
			if(_content != null){
				clearInterval(_queueInterval);
				if(active == true){
					_uiComponent.mx_internal::dispatchEventHook = function(event:Event, uicomponent:*):void{
						var eventKey:String = getQualifiedClassName(event) + '_' + event.type;
						if(_excludeEvents[eventKey] == true) return;
						var uniqKey:String =  eventKey + '_' + uicomponent.toString();
						if(_queueMap[uniqKey] == null){
							_queueList.unshift({event:event, uicomponent:uicomponent});
							_queueMap[uniqKey] = true; //do not add the same event types
						}
					}
					_queueInterval = setInterval(readQueue, 100);
				}else{
					_uiComponent.mx_internal::dispatchEventHook = _dispatchEventHook;
				}
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
				var locators:Array = [];
				var includes:Object = {};
				var eventType:XML = describeType(event);
				includes[eventType.@name.toString()] = 0;

				getComponentInfo(uicomponent, components, locators, includes);

				if(components.length > 0){
					var uid:String = (uicomponent.hasOwnProperty("uid") ? uicomponent.uid : uicomponent.toString());
					_content.addNewEvent({event:JSClasses.eventInfo(event), uid:uid});
				}
			};
		}

		private function getComponentInfo(uicomponent:*, components:Array, locators:Array, includes:Object):void{
			var uniqNames:Object = {};
			var locatorType:String = "";

			function getInfo(c:*, childRef:*=null, childId:String=null):String{
				var classType:String;
				var visibleCount:int; 
				if(c != _application && c != _application.systemManager){
					var type:XML = describeType(c);
					var extendsClass:XMLList = <></>;
					var listData:XMLList = type.implementsInterface.(@type == "mx.controls.listClasses::IDropInListItemRenderer");
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
							var parentName:String;
							if(listData.length() > 0 && c.listData != null){
								parentName = getInfo(c.owner);
								locatorType = '<font color="#7F0055">var</font> ' + variableName + ' = ' + alias + '.Get(locator);';
								components.push('<font color="#7F0055">var</font> ' + variableName + ' = ' + alias + '.Get(' + parentName + '.indicesToItemRenderer(' + c.listData.rowIndex + ', ' + c.listData.columnIndex + '));');
								locators.push(':' + c.listData.rowIndex + ',' + c.listData.columnIndex);
								return variableName;
							}
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
							parentName = getInfo(parent);
							if(parentName == null){ //probably is systemManager child
								classType = type.@name.toString();
								visibleCount = findIndexByClassType(c, "numElements", "getElementAt", classType);
								if(visibleCount == -1)
									visibleCount = findIndexByClassType(c, "numChildren", "getChildAt", classType);
								locators.push('!');
								if(visibleCount > 0){
									components.push('<font color="#7F0055">var</font> ' + variableName + ' = <font color="#7F0055">this</font>.app.getPopupWindow("' + classType + '", ' + visibleCount + ');');
									locators.push('#' + classType + ',' + visibleCount);
								}else{
									components.push('<font color="#7F0055">var</font> ' + variableName + ' = <font color="#7F0055">this</font>.app.getPopupWindow("' + classType + '");');
									locators.push('#' + classType);
								}
							}else{
								locatorType = '<font color="#7F0055">var</font> ' + variableName + ' = ' + alias + '.Get(locator);';
								try{
									if(c.id != null && parent[c.id]){
										if(parent[c.id] is Array){
											for(var j:uint = 0; j < parent[c.id].length; j++){
												if(parent[c.id][j] == c){
													components.push('<font color="#7F0055">var</font> ' + variableName + ' = ' + alias + '.Get(' + parentName + '.find("' + c.id + '", ' + j + '));');
													locators.push(c.id + "," + j);
													break;
												}
											}
										}else{
											components.push('<font color="#7F0055">var</font> ' + variableName + ' = ' + alias + '.Get(' + parentName + '.find("' + c.id + '"));');
											locators.push(c.id);
										}
										return variableName;
									}
								}catch(e:Error){};
								
								classType = type.@base.toString();
								visibleCount = findIndexByClassType(c, "numElements", "getElementAt", classType);
								if(visibleCount == -1)
									visibleCount = findIndexByClassType(c, "numChildren", "getChildAt", classType);
								
								if(visibleCount != -1){
									if(visibleCount > 0){
										components.push('<font color="#7F0055">var</font> ' + variableName + ' = ' + alias + '.Get(' + parentName + '.getChildByType("' + classType + '", ' + visibleCount + '));');
										locators.push('#' + classType + ',' + visibleCount);
									}else{
										components.push('<font color="#7F0055">var</font> ' + variableName + ' = ' + alias + '.Get(' + parentName + '.getChildByType("' + classType + '"));');
										locators.push('#' + classType);
									}
									return variableName;
								}
								
								components.push('<font color="#7F0055">var</font> ' + variableName + ' = ' + alias + '.Get(' + parentName + '.getChildByName("' + c.name + '"));');
								locators.push('@' + c.name);
							}
							return variableName;
						}
					}
				}else if(c == _application){
					return '<font color="#7F0055">this</font>.app';
				}
				return null;
			};
			getInfo(uicomponent);

			if(components.length > 0){
				var code:String = '<font color="#3F7F5F">//' + uicomponent.toString() + '</font>\n\n' +
								  '<font color="#7F0055">var</font> locator = Locator.Get("/' + locators.join('/') + '");\n' + locatorType + '\n\n';
				var packages:Array = [];
				for(var pckg:String in includes)
					packages.push('<font color="#2A00FF">"' + pckg + '"</font>');
				if(packages.length > 0)
					code += '<font color="#7F0055">this</font>.include(\n' + packages.join(',\n') + ');\n\n'; 
				code += components.join('\n');
				
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
					_content.addEventListener(ContentEvent.CONTENT_TYPE, contentEventHandler);

					_content.openTestCases();
				}
			};
			var timer:Timer = new Timer(100);
			timer.addEventListener(TimerEvent.TIMER, handleTimer);
			timer.start();
		}

		private function contentEventHandler(event:ContentEvent):void{
			switch(event.kind){
				case ContentEvent.EVENTS_KIND:
					inspectEvents(event.state);
					break;
				case ContentEvent.OBJECTS_KIND:
					inspectObjects(event.state);
					break;
				case ContentEvent.CLEAR_KIND:
					clear();
					break;
				case ContentEvent.CLOSE_KIND:
					clear();
					inspectEvents(false);
					inspectObjects(false);
					break;
			}
		}

		private function onKeyDownEventHanlder(event:KeyboardEvent):void{
			if(event.ctrlKey && event.altKey){
				switch(String.fromCharCode(event.charCode).toUpperCase()){
					case 'O':
						_content.inspectObjects();
						break;
					case 'E':
						_content.inspectEvents();
						break;
					case 'C':
						_content.clearAll();
						break;
					case 'P':
						_content.playPauseTestCases();
						break;
					case 'S':
						_content.stopTestCases();
						break;
				}
			}
		}

		public function openInspector():void{
			_content.openInspector();
		}

		public function assertResult(error:Boolean, message:String):void{
			_content.assertResult(error, message);
		}

		public function getNextTestCase():String{
			return _content.getNextTestCase();
		}

		public function getTestIndex(index:uint, testCaseName:String):int{
			return _content.getTestIndex(index, testCaseName);
		}
	}
}