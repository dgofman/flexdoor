package
{
	import flash.display.Sprite;
	import flash.display.Stage;
	import flash.events.DataEvent;
	import flash.events.KeyboardEvent;
	import flash.events.MouseEvent;
	import flash.external.ExternalInterface;
	import flash.filters.DropShadowFilter;
	import flash.text.TextField;
	import flash.ui.Keyboard;
	import flash.utils.clearInterval;
	import flash.utils.describeType;
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
		
		public function FlexDoorUtil(flexDoor:FlexDoor, application:*){
			_flexDoor = flexDoor;
			_application = application;
			_application.stage.addEventListener(KeyboardEvent.KEY_UP, keyHandler);
			if(ExternalInterface.available){
				ExternalInterface.addCallback("js_topInfo", js_topInfo);
			}
			_flexDoor.addEventListener(FlexDoor.INITIALIZED, dataEventHandler);
			_flexDoor.addEventListener(FlexDoor.ERROR, dataEventHandler);
		}
		
		public function dataEventHandler(event:DataEvent):void{
			var stage:Stage = _application.stage;
			if(event.type == FlexDoor.ERROR){
				showMessage(event.data, stage);
			}else if(FlexDoor.INITIALIZED){
				showMessage("<b>FlexDoor, Version: " + FlexDoor.VERSION + "</b><br/>" +
							"Author: David Gofman<br/>" +
							"Press <b>Ctrl+Shift+Insert</b> for more options",
							stage);
				_textField.x = (stage.stageWidth - _textField.width) / 2;
				_textField.y = (stage.stageHeight - _textField.height) / 2;
				setTimeout(removeMessage, 3000);
			}
		}
		
		public static function showMessage(message:String, parent:*, maxWidth:Number=NaN, visible:Boolean=true):void{
			if(_textField != null)
				removeMessage();
			var canvas:Sprite = new Sprite();
			_textField = new TextField();
			_textField.background = true;
			_textField.selectable = true;
			_textField.border     = true;
			_textField.multiline  = true;
			_textField.autoSize   = "left";
			_textField.filters = [new DropShadowFilter(4, 45, 0x000000, 1, 10, 10, 1.5)];
			_textField.wordWrap = !isNaN(maxWidth);
			_textField.width    = maxWidth;
			_textField.htmlText	= message;
			_textField.visible = visible;
			parent.stage.addChild(_textField);
		}
		
		public static function removeMessage():void{
			if(_textField != null){
				_textField.parent.removeChild(_textField);
				_textField = null;
			}
		}
		
		public function keyHandler(event:KeyboardEvent):void {
			var stage:Stage = _application.stage;
			if(event.ctrlKey && event.shiftKey && event.keyCode == Keyboard.INSERT){
				stage.removeEventListener(MouseEvent.MOUSE_MOVE, mouseHandler);
				showMessage("<b>FlexDoor Version: " + FlexDoor.VERSION + "</b> <br/>" +
							"<li>Space - Run / Suspend Window Inspector </li>" + 
							"<li>Ctrl+Shift+Insert  - Open help menu</li>" + 
							"<li>Press ESC - Close help menu / Interrupt script</li>",
							stage);
				_textField.x = (stage.stageWidth - _textField.width) / 2;
				_textField.y = (stage.stageHeight - _textField.height) / 2;
			}else if(event.ctrlKey && event.shiftKey && event.keyCode == Keyboard.DELETE){
		     	_flexDoor.removeEventListener(MouseEvent.MOUSE_MOVE, mouseHandler);
		     	removeMessage();
			}else if(_textField && event.keyCode == Keyboard.SPACE){
				if(_flexDoor.hasEventListener(MouseEvent.MOUSE_MOVE) == false){
					_flexDoor.addEventListener(MouseEvent.MOUSE_MOVE, mouseHandler);
					showMessage("", stage, 360, false);
				  	mouseHandler(new MouseEvent(MouseEvent.CLICK));
				 }else{
					_flexDoor.removeEventListener(MouseEvent.MOUSE_MOVE, mouseHandler);
				 }
			}else if(_textField && (event.keyCode == 109 || event.keyCode == 189)){ //"-"
				_flexDoor.removeEventListener(MouseEvent.MOUSE_MOVE, mouseHandler);
				_topChildIndex--;
			   	mouseHandler();
			}else if(_textField && (event.keyCode == 107 || event.keyCode == 187)){ //"+"
				_flexDoor.removeEventListener(MouseEvent.MOUSE_MOVE, mouseHandler);
				_topChildIndex++;
			   	mouseHandler();
			}else if(_textField && _topChildren && (event.ctrlKey || event.altKey) && event.keyCode == 68){ //"D"
				ExternalInterface.call("parent.FlexDoor.openProperties()");
			   	_flexDoor.removeEventListener(MouseEvent.MOUSE_MOVE, mouseHandler);
			}else if(event.keyCode == Keyboard.ESCAPE){
				_topChildren = null;
				if(!_textField) //Terminate execution of javascript scripts
			   		ExternalInterface.call("parent.FlexDoor.exit");
			   	removeMessage();
			}
	    }
	    
	    private function getTopChildren():Array{
	    	var stage:Stage = _application.stage;
			var topChildren:Array = [];
			var objRefs:Object = {};
			function top(obj:*):void{
				if(objRefs[obj] != null)
					return;
				objRefs[obj] = obj;
				function find(parent:*):Boolean{
					try{
						if(parent && parent.numChildren){
							for(var i:uint = 0; i < parent.numChildren; i++){
								var child:* = parent.getChildAt(i);
								if(obj == _application.systemManager && child.name == "mouseCatcher"){
									continue;//We can skip mouseCatcher - mx.core::FlexSprite
								}
								if(child.hitTestPoint(stage.mouseX, stage.mouseY)){
									try{
										if(child.visible == true){
											for(var c:int = topChildren.length - 1; c >= 0; c--){
												if(topChildren[c] == child.parent || topChildren[c] == child){
													topChildren.splice(c, 1);
												}
											}
											topChildren.push(child);
											top(child);
										}
									}catch(e:Error){}
								}
							}
						}
					}catch(e:Error){}
					return false;
				};
				try{ 
					if(find(obj) == true)
						return;
				}catch(e:Error){}
				find(obj.rawChildren)
			};
			top(_application.systemManager);
			return topChildren;
	    }
	    
	    /*
	    	1 - By Index
	    	2 - By Name
	    	3 - By Reference
	    */
	    private function getChildInfo(childRef:*, viewId:int):Object{
	   		if(childRef != null){
				var childrenList:Array = [];
				var accessorList:Array = [];
				var child:* = childRef;
				while(child != null && child.parent != null && 
					child != _application && child != _application.systemManager){
					if(viewId == 3){
						findPathByAccessors(child, accessorList);
					}
					try{
						if(child.parent.hasOwnProperty(child.id)){
							name = child.id;
							childrenList.push(child.id + '()');
							child = child.parent;
							continue;
						}
					}catch(e:Error){};
					if(child.parent){
						var name:String = null;
						if(viewId != 1 && child.name.indexOf("UIComponent") != 0){
							if(child.parent.getChildByName(child.name) != null){
								name = child.name;
								childrenList.push('getChildByName("' + name + '")');
							}else if(child.parent.rawChildren && child.parent.rawChildren.getChildByName &&
									 child.parent.rawChildren.getChildByName(child.name)){
								name = child.name;
								childrenList.push('rawChildren().getChildByName("' + name + '")');
							}
						}
						if(name == null){
							if(child.parent.getChildByName(child.name) == null){
								childrenList.push('rawChildren().getChildAt(' +
									child.parent.rawChildren.getChildIndex(child) + ')');
							}else{
								childrenList.push('getChildAt(' +child.parent.getChildIndex(child) + ')');
							}
						}
						child = child.parent;
					}
				}
				if(child == _application.systemManager){
					childrenList.push('FlexDoor.getApp().systemManager()');
				}else{
					childrenList.push('FlexDoor.getApp()');
				}
			}
	    	return {children:childrenList.reverse(), accessors:accessorList.reverse()};
	    }
	    
	    private function findPathByAccessors(child:*, accessorList:Array):String{
	    	var path:String = null;
			var parent:* = child.parent;
			while(parent){
				var xml:XML = describeType(parent);
				var accessors:XMLList = xml.accessor;
		        for(var i:uint = 0; i < accessors.length(); i++){
		        	var name:String = accessors[i].@name;
		        	/*try{ //Wait resolving Adobe bug https://bugs.adobe.com/jira/browse/FP-905
		        		var field:* = parent.mx_internal::[name]; 
		        		if(field == child){
		        			var childInfo1:Object = getChildInfo(parent, 2);
			        		path = childInfo1.children.join('.');
			        		accessorList.push('FlexDoor.getRef("' + path + '", "' + name + '"');
			        		return name;
		        		}
		        	}catch(e:Error){};*/
		        	try{
			        	if(parent[name] == child){
			        		var childInfo2:Object = getChildInfo(parent, 2);
			        		path = childInfo2.children.join('.');
			        		accessorList.push(path + '.' + name + '()');
			        		return name;
						}
					}catch(e:Error){};
		        }
				parent = parent.parent;
			}
			accessorList.push(path);
			return null;
	    }

		private function mouseHandler(event:MouseEvent=null):void{
			var stage:Stage = _application.stage;
			clearInterval(_delayInterval);
			if(event != null && _textField) {//do reset index on Mouse Move 
				_topChildIndex = 0;
				_topChildren = null;
			}
			function doLater():void{
 				clearInterval(_delayInterval);
				if(_topChildren == null) _topChildren = getTopChildren();
				if(!(_topChildren is Array) || _topChildren.length == 0) return;
				if(_topChildIndex > _topChildren.length - 1) _topChildIndex = 0;
				if(_topChildIndex < 0) _topChildIndex = _topChildren.length - 1;
				var childInfo:Object = getChildInfo(_topChildren[_topChildIndex], 1);
				if(_textField != null && childInfo != null && childInfo.children){
					_textField.htmlText =  '<b>Stage mouseX: </b><i>' + stage.mouseX + '</i>  <b>mouseY: </b><i>' + stage.mouseY + '</i><br/><br/>';
					_textField.htmlText += '<b>Get child by index:</b><br/><i>' + childInfo.children.join('.') + '</i>';
					childInfo = getChildInfo(_topChildren[_topChildIndex], 2);
					_textField.htmlText += '<br/><b>Get child by name:</b><br/>' + childInfo.children.join('.');
					_textField.htmlText += '<p align="right"><font color="#0000ff"><a href="javascript:parent.FlexDoor.openProperties()"><u>D</u>etails</a></font></p>';
					_textField.htmlText += '<b>Top children index:</b> ' + (_topChildIndex + 1) + ' <b>of</b> ' + _topChildren.length + '  <i>(use "+" or "-" keys to change index)</i>';
					
					_textField.x = stage.mouseX + 10;
					_textField.y = stage.mouseY + 10;
					if(_textField.x + _textField.width > stage.stageWidth)
						_textField.x = stage.stageWidth - _textField.width - 10;
					if(_textField.y + _textField.height > stage.stageHeight)
						_textField.y = stage.stageHeight - _textField.height - 10;
					_textField.visible = true;
				}
			};
			_delayInterval = setInterval(doLater, 10);
		}
		
		private function js_topInfo():Array{
			if(!_topChildren || _topChildren.length == 0){
				return null;
			}else{
				var topChild:* = _topChildren[_topChildIndex];
				var childInfo:Object = getChildInfo(topChild, 3);
			   	return null; //[_flexDoor.serialize(topChild, true), childInfo.children, childInfo.accessors];
			}
		}
	}
}