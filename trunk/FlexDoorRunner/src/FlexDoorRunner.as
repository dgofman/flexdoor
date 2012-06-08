package {

	import fl.controls.Button;
	import fl.controls.TextArea;
	import flash.events.Event;
	import fl.events.ListEvent;
	import flash.events.MouseEvent;
	import flash.display.MovieClip;
	import flash.net.SharedObject;
	import flash.utils.clearInterval;
	import flash.utils.setInterval;
	import flash.external.ExternalInterface;
	import fl.data.DataProvider;
	import flash.utils.setTimeout;
	import flash.text.TextField;
	import flash.geom.Point;
	import flash.events.KeyboardEvent;
	import flash.ui.Keyboard;

	public class FlexDoorRunner extends MovieClip
	{
		public var views:MovieClip;

		private var inspectorView:InspectorView;
		private var propertiesView:PropertiesView;
		private var eventFilterView:EventFilterView;
		private var scriptLoaderView:ScriptLoaderView;
		
		private var _tooltipDelayInterval:Number;
		private var _isInitialized:Boolean;
		private var _so:SharedObject;

		[Embed("../assets/about.png")]  private const _aboutPNG:Class;
		[Embed("../assets/filter.swf")] private const _filterSWF:Class;
		[Embed("../assets/folder.swf")] private const _folderSWF:Class;
		[Embed("../assets/target.swf")] private const _targetSWF:Class;
		[Embed("../assets/minimize.swf")] private const _minimizeSWF:Class;
		[Embed("../assets/restore.swf")]  private const _restoreSWF:Class;
		[Embed("../assets/properties.swf")] private const _propSWF:Class;

		private var _tooltip_ta:TextArea;
		private var _tooltip_lbl:TextField;
		private var _tooltip_help:TextField;
		
		private var _targetButton:Button;
		private var _filterButton:Button;
		private var _folderButton:Button;
		private var _minimizeButton:Button;

		public function FlexDoorRunner(){
			super();

			_so = SharedObject.getLocal("flexdoorRunner");

			inspectorView = views.inspectorView;
			propertiesView = views.propertiesView;
			eventFilterView = views.eventFilterView;
			scriptLoaderView = views.scriptLoaderView;

			if(loaderInfo.url == null || loaderInfo.url.indexOf("file:///") == -1){
				this.visible = false;
			}else{
				openScripts();
			}
			visibleViews(true);
			init();
		}

		protected function init():void{
			inspectorView.init(this);
			propertiesView.init(this);
			eventFilterView.init(this);
			scriptLoaderView.init(this);
			alertView.init(this);

			complete_lbl.mouseEnabled = false;

			//inspector_mc.mouseEnabled = false;
			//inspector_mc.mouseChildren = false;
			inspector_mc.visible = false;
			
			tooltip_mc.mouseEnabled = false;
			tooltip_mc.mouseChildren = false;
			tooltip_mc.visible = false;

			_tooltip_ta = tooltip_mc.tooltip_ta;
			_tooltip_ta.visible = false;

			_tooltip_help = tooltip_mc.tooltip_help;
			_tooltip_help.border = true;
			_tooltip_help.borderColor = 0xCCCCCC;
			_tooltip_help.background = true;
			_tooltip_help.backgroundColor = 0xF5EE77;

			_tooltip_lbl = tooltip_mc.tooltip_lbl;
			_tooltip_lbl.border = true;
			_tooltip_lbl.borderColor = 0xCCCCCC;
			_tooltip_lbl.background = true;
			_tooltip_lbl.backgroundColor = 0xF5EE77;

			tooltip_mc.tooltip_hidden.autoSize = "left";
			tooltip_mc.tooltip_hidden.visible = false;

			views.inspector_btn.setStyle("icon", _targetSWF);
			initButton(views.inspector_btn, openInspector, "Inspect Components and Events");
			views.properties_btn.setStyle("icon", _propSWF);
			initButton(views.properties_btn, openProperties, "Component Properties");
			views.advanced_btn.setStyle("icon", _filterSWF);
			initButton(views.advanced_btn, openFilters, "Filter Events");
			views.testcases_btn.setStyle("icon", _folderSWF);
			initButton(views.testcases_btn, openScripts, "Load Scripts");
			views.minimize_btn.setStyle("icon", _minimizeSWF);
			initButton(views.minimize_btn, minimizeWindow, "Minimize");
			views.about_btn.setStyle("icon", _aboutPNG);
			initButton(views.about_btn, aboutView, "About");

			restore_btn.addEventListener(MouseEvent.CLICK, restoreWindow);
			restoreWindow()

			bg_mc.addEventListener(MouseEvent.MOUSE_DOWN, dragEventHandler);
		}

		private function onKeyUpEventHanlder(event:KeyboardEvent):void{
			if(event.keyCode == Keyboard.F2)
				toolTipHelper();
		}

		public function initButton(button:*, eventHandler, toolTip:String=null):void{
			if(eventHandler != null)
				button.addEventListener(MouseEvent.CLICK, eventHandler);
			if(toolTip != null){
				attachToolTip(button, toolTip);
			}
		}

		public function initialized():void{
			if(_isInitialized == false){
				_isInitialized = true;
				externalCall("dispatchEvent", "initialized", false);
			}
		}

		public function get so():SharedObject{
			return _so;
		}

		public function toArray(dp:DataProvider, key:String=null):Array{
			var items:Array = [];
			for(var i:uint = 0; i < dp.length; i++){
				var item:Object = dp.getItemAt(i);
				if(key == null)
					items.push(item);
				else
					items.push(item[key]);
			}
			return items;
		}

		public function get targetPoint():Point{
			var t:MovieClip = inspectorView.target_mc;
			var x:Number = t.x - ((inspector_mc.width - t.width) / 2);
			var y:Number = t.y + t.height;
			return new Point(x + (t.mouseX - inspector_mc.width / 2), y + (t.mouseY - inspector_mc.height / 2));
		}

		public function clearAll():void{
			inspectorView.clearAll();
		}

		public function inspectEvents():void{
			inspectorView.inspectEventsHandler();
		}

		public function liveDragHandler():void{
			inspectorView.liveDragHandler();
		}

		public function addNewEvent(item:Object):void{
			inspectorView.addNewEvent(item);
		}
		
		public function addComponent(item:Object):void{
			inspectorView.addComponent(item);
		}

		public function playPauseTestCases():void{
			scriptLoaderView.playPauseTestCases();
		}

		public function stopTestCases():void{
			scriptLoaderView.stopTestCases();
		}

		public function assertResult(error:Boolean, message:String):void{
			scriptLoaderView.assertResult(error, message);
		}

		public function getNextTestCase():String{
			return scriptLoaderView.getNextTestCase();
		}

		public function getTestIndex(index:uint, testCaseName:String):int{
			return scriptLoaderView.getTestIndex(index, testCaseName);
		}
		
		public function getExcludeEvents():Object{
			return eventFilterView.getExcludeEvents();
		}
		
		public function addtExcludeEvent(event:String, type:String):void{
			eventFilterView.addtExcludeEvent(event, type);
		}

		private function changeView(currentView:MovieClip):void{
			inspectorView.visible = (currentView == inspectorView);
			propertiesView.visible = (currentView == propertiesView);
			eventFilterView.visible = (currentView == eventFilterView);
			scriptLoaderView.visible = (currentView == scriptLoaderView);
			this.visible = true;
		}

		public function openInspector(event:MouseEvent=null):void{
			changeView(inspectorView);
		}

		public function openProperties(event:MouseEvent=null):void{
			changeView(propertiesView);
			propertiesView.reset();
			propertiesView.components_lst.dataProvider = inspectorView.components_lst.dataProvider;
			propertiesView.components_lst.selectedIndex = inspectorView.components_lst.selectedIndex;
			propertiesView.updateProperties(inspectorView.components_lst.selectedItem);
		}

		public function openFilters(event:MouseEvent=null):void{
			changeView(eventFilterView);
		}

		public function openScripts(event:MouseEvent=null):void{
			changeView(scriptLoaderView);
		}

		public function toolTipHelper(event:MouseEvent=null):void{
			tooltip_mc.mouseEnabled = tooltip_mc.mouseChildren = (event == null);
			if(event != null){
				_tooltip_ta.visible = false;
				tooltip_mc.visible = false;
				stage.removeEventListener(MouseEvent.CLICK, toolTipHelper);
			}else{			
				clearInterval(_tooltipDelayInterval);
				_tooltip_ta.htmlText = _tooltip_lbl.htmlText;
				_tooltip_ta.width = _tooltip_lbl.width + 18; //18 - scrollbar
				_tooltip_ta.height = _tooltip_lbl.height + _tooltip_help.height;
				_tooltip_ta.visible = true;
				_tooltip_lbl.visible = false;
				_tooltip_help.visible = false;
				stage.addEventListener(MouseEvent.CLICK, toolTipHelper);
				stage.removeEventListener(MouseEvent.MOUSE_MOVE, mouseMoveListHandler);
				stage.removeEventListener(MouseEvent.MOUSE_MOVE, mouseMoveToolTipHandler);
				stage.removeEventListener(KeyboardEvent.KEY_UP, onKeyUpEventHanlder);
			}
		}

		private function aboutView(event:MouseEvent):void{
			alertView.about();
		}

		private function minimizeWindow(event:MouseEvent=null):void{
			scaleX = .2;
			scaleY = .05;
			complete_lbl.scaleX = 20;
			complete_lbl.scaleY = 20;
			alertView.visible = false;
			visibleViews(false);
		}

		private function restoreWindow(event:MouseEvent=null):void{
			scaleX = 1;
			scaleY = 1;
			complete_lbl.visible = false;
			alertView.visible = alertView.enabled;
			visibleViews(true);
		}

		private function visibleViews(b:Boolean):void{
			views.visible = b;
			restore_btn.visible = !b;
		}

		public function attachToolTip(clip:*, toolTip:String, autoHide:Boolean=true):void{
			clip.buttonMode = true;
			clip.useHandCursor = true;
			clip.addEventListener(MouseEvent.ROLL_OVER, function(event:MouseEvent){
				showTooltip(event, true, mouseMoveToolTipHandler, function():String{
					return toolTip;
			}, autoHide)});
			clip.addEventListener(MouseEvent.ROLL_OUT, function(event:MouseEvent):void{
				showTooltip(event, false, mouseMoveToolTipHandler);
			});
		}

		private function mouseMoveToolTipHandler(event:MouseEvent):void{
			clearInterval(_tooltipDelayInterval);
			var x:Number = Math.max(0, mouseX - _tooltip_lbl.width / 2);
			var y:Number = (event.target.y > 30 ? mouseY - _tooltip_lbl.height - 5 :  mouseY + event.target.height + 3);
			tooltip_mc.x = Math.min(x, stage.stageWidth - _tooltip_lbl.width);
			tooltip_mc.y = y;
		}

		public function showListTooltip(event:ListEvent):void{
			showTooltip(event, event.type == ListEvent.ITEM_ROLL_OVER, mouseMoveListHandler, function():String{
				if(event.item is EventsListCellRenderer.filterSWF)
					return "Exclude Event";
				if(event.item is EventsListCellRenderer.copySWF)
					return "Copy to Clipboard";
				return event.item[event.target.labelField];
			}, false);
		}

		public function showDataGridTooltip(event:ListEvent):void{
			showTooltip(event, event.type == ListEvent.ITEM_ROLL_OVER, mouseMoveListHandler, function():String{
				if(event.item["testName"] == null){
					switch(event.columnIndex){
						case 4:
							return "Move Up TestCase";
						case 5:
							return "Move Down TestCase";
						case 6:
							return "Delete TestCase";
					}
				}
				return (event.item.toolTip ? event.item.toolTip : "");
			}, false);
		}
		
		private function mouseMoveListHandler(event:Event=null):void{
			clearInterval(_tooltipDelayInterval);
			tooltip_mc.x = Math.min(mouseX + 15, stage.stageWidth - _tooltip_lbl.width);
			tooltip_mc.y = Math.min(mouseY + 15, stage.stageHeight - _tooltip_lbl.height);
		}
		
		private function showTooltip(event:Event, isOver:Boolean, mouseEventHandler:Function, toolTipHandler:Function=null, autoHide:Boolean=true):void{
			if(_tooltip_ta.visible == true) return; //wait when user close a focus tip
			
			clearInterval(_tooltipDelayInterval);
			if(isOver){
				_tooltipDelayInterval = setInterval(function():void{
					clearInterval(_tooltipDelayInterval);

					_tooltip_lbl.htmlText = " " + toolTipHandler() + " ";
					tooltip_mc.tooltip_hidden.text = _tooltip_lbl.text;

					if(_tooltip_lbl.text != "  "){
						mouseEventHandler(event);
						
						var limit:uint = 195;
						var h:uint = Math.min(limit, tooltip_mc.tooltip_hidden.height);
						var w:uint = tooltip_mc.tooltip_hidden.width;
						
						_tooltip_lbl.width = w;
						_tooltip_lbl.height = h;
						_tooltip_lbl.visible = true;
						
						if(_tooltip_lbl.height == limit){
							_tooltip_help.y = h;
							_tooltip_help.width = w;
							_tooltip_help.visible = true;
							stage.addEventListener(KeyboardEvent.KEY_UP, onKeyUpEventHanlder);
						}else{
							_tooltip_help.visible = false;
						}
						tooltip_mc.visible = true;
						stage.addEventListener(MouseEvent.MOUSE_MOVE, mouseEventHandler);
						if(autoHide)
							_tooltipDelayInterval = setInterval(showTooltip, 1500, event, false, mouseEventHandler);
					}
				}, 500);
			}else{
				tooltip_mc.visible = false;
				stage.removeEventListener(MouseEvent.MOUSE_MOVE, mouseEventHandler);
			}
		}

		private function dragEventHandler(event:MouseEvent):void{
			if(stage.hitTestObject(bg_mc)){
				if(event.type == MouseEvent.MOUSE_DOWN){
					inspectorView.live_drag_ckb.selected = false;
					bg_mc.addEventListener(MouseEvent.MOUSE_UP, dragEventHandler);
					stage.addEventListener(MouseEvent.MOUSE_MOVE, dragEventHandler);
					dispatchEvent(new ContentEvent(ContentEvent.LIVE_DRAG_KIND, false));
					this.startDrag();
				}
				if(event.type != MouseEvent.MOUSE_UP)
					return;
			}
			this.stopDrag();
			bg_mc.removeEventListener(MouseEvent.MOUSE_UP, dragEventHandler);
			stage.removeEventListener(MouseEvent.MOUSE_MOVE, dragEventHandler);
		}
		
		public function externalCall(command:String, ...params):void{
			if(loaderInfo.url == null || loaderInfo.url.indexOf("file:///") == -1 || 
										 loaderInfo.url.indexOf("[[DYNAMIC]]") != -1){
				ExternalInterface.call("parent.FlexDoor.externalCall", command, params);
			}
		}
	}
}