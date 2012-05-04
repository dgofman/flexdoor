package {

	import fl.controls.Button;
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

	public class FlexDoorRunner extends MovieClip
	{
		public var views:MovieClip;

		private var inspectorView:InspectorView;
		private var advancedView:AdvancedView;
		private var scriptLoaderView:ScriptLoaderView;

		private var _tooltipDelayInterval:Number;
		private var _isInitialized:Boolean;
		private var _so:SharedObject;

		[Embed("../assets/filter.swf")] private const _filterSWF:Class;
		[Embed("../assets/folder.swf")] private const _folderSWF:Class;
		[Embed("../assets/target.swf")] private const _targetSWF:Class;
		[Embed("../assets/minimize.swf")] private const _minimizeSWF:Class;
		[Embed("../assets/restore.swf")]  private const _restoreSWF:Class;

		private var _targetButton:Button;
		private var _filterButton:Button;
		private var _folderButton:Button;
		private var _minimizeButton:Button;

		public function FlexDoorRunner(){
			super();

			_so = SharedObject.getLocal("flexdoorRunner");

			inspectorView = views.inspectorView;
			advancedView = views.advancedView;
			scriptLoaderView = views.scriptLoaderView;

			visibleViews(true);
			openTestCases();

			if(loaderInfo.url == null || loaderInfo.url.indexOf("file:///") == -1)
				this.visible = false;
			init();
		}

		protected function init():void{
			inspectorView.init(this);
			advancedView.init(this);
			scriptLoaderView.init(this);

			tooltip_lbl.autoSize = "left";
			tooltip_lbl.border = true;
			tooltip_lbl.borderColor = 0xCCCCCC;
			tooltip_lbl.background = true;
			tooltip_lbl.backgroundColor = 0xF5EE77;
			tooltip_lbl.visible = false;

			views.inspector_btn.setStyle("icon", _targetSWF);
			initButton(views.inspector_btn, openInspector, "Inspector  Ctrl+Alt+I");
			views.advanced_btn.setStyle("icon", _filterSWF);
			initButton(views.advanced_btn, openAdvanced, "Filter  Ctrl+Alt+F");
			views.testcases_btn.setStyle("icon", _folderSWF);
			initButton(views.testcases_btn, openTestCases, "Loader  Ctrl+Alt+L");
			views.minimize_btn.setStyle("icon", _minimizeSWF);
			initButton(views.minimize_btn, minimizeWindow, "Minimize");

			restore_btn.addEventListener(MouseEvent.CLICK, restoreWindow);
			restore_btn.visible = false;

			bg_mc.addEventListener(MouseEvent.MOUSE_DOWN, dragEventHandler);
			bg_mc.addEventListener(MouseEvent.MOUSE_UP, dragEventHandler);
		}

		public function initButton(button:*, eventHandler, toolTip:String):void{
			button.buttonMode = true;
			button.useHandCursor = true;
			if(eventHandler != null)
				button.addEventListener(MouseEvent.CLICK, eventHandler);
			if(toolTip != null){
				button.setStyle("toolTip", toolTip);
				button.addEventListener(MouseEvent.ROLL_OVER, showButtonTooltip);
				button.addEventListener(MouseEvent.ROLL_OUT, showButtonTooltip);
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

		public function toArray(dp:DataProvider, key:String="label"):Array{
			var items:Array = [];
			for(var i:uint = 0; i < dp.length; i++){
				var item:Object = dp.getItemAt(i);
				items.push(item[key]);
			}
			return items;
		}

		public function saveAdvancedSettings():void{
			advancedView.saveSettings();
		}

		public function clearAll():void{
			inspectorView.clearAll();
		}

		public function spyEvents():void{
			inspectorView.spyEventsHandler();
		}

		public function spyObjects():void{
			inspectorView.spyObjectsHandler();
		}

		public function addNewEvent(item:Object):void{
			inspectorView.addNewEvent(item);
		}

		public function addComponent(item:Object):void{
			inspectorView.addComponent(item);
		}

		public function assertResult(error:Boolean, message:String):void{
			scriptLoaderView.assertResult(error, message);
		}

		public function getNextTestCase():String{
			return scriptLoaderView.getNextTestCase();
		}

		public function getTestIndex(index:uint):int{
			return scriptLoaderView.getTestIndex(index);
		}

		public function openInspector(event:MouseEvent=null):void{
			scriptLoaderView.visible = false;
			advancedView.visible = false;
			inspectorView.visible = true;
			this.visible = true;
		}

		public function openAdvanced(event:MouseEvent=null):void{
			scriptLoaderView.visible = false;
			inspectorView.visible = false;
			advancedView.visible = true;
			this.visible = true;
		}

		public function openTestCases(event:MouseEvent=null):void{
			inspectorView.visible = false;
			advancedView.visible = false;
			scriptLoaderView.visible = true;
			this.visible = true;
		}
		
		private function minimizeWindow(event:MouseEvent=null):void{
			showButtonTooltip();
			scaleX = .2;
			scaleY = .05;
			visibleViews(false);
		}

		private function restoreWindow(event:MouseEvent):void{
			scaleX = 1;
			scaleY = 1;
			visibleViews(true);
		}

		private function visibleViews(b:Boolean):void{
			views.visible = b;
			restore_btn.visible = !b;
		}

		public function showButtonTooltip(event:MouseEvent=null):void{
			var isOver:Boolean = (event != null && event.type == MouseEvent.ROLL_OVER);
			showTooltip(event, isOver, mouseMoveButtonHandler, function():void{
				tooltip_lbl.text = " " + event.currentTarget.getStyle("toolTip") + " ";
			});
		}

		private function mouseMoveButtonHandler(event:MouseEvent):void{
			clearInterval(_tooltipDelayInterval);
			var x:Number = Math.max(0, mouseX - tooltip_lbl.width / 2);
			tooltip_lbl.x = Math.min(x, stage.stageWidth - tooltip_lbl.width);
			tooltip_lbl.y = mouseY + (event.target.y > 30 ? -25 : 25);
		}

		public function showListTooltip(event:ListEvent):void{
			showTooltip(event, event.type == ListEvent.ITEM_ROLL_OVER, mouseMoveListHandler, function():void{
				tooltip_lbl.text = " " + event.item[event.target.labelField] + " ";
			}, false);
		}

		private function mouseMoveListHandler(event:Event=null):void{
			clearInterval(_tooltipDelayInterval);
			tooltip_lbl.x = Math.min(mouseX + 15, stage.stageWidth - tooltip_lbl.width);
			tooltip_lbl.y = Math.min(mouseY + 15, stage.stageHeight - tooltip_lbl.height);
		}

		public function showDataGridTooltip(event:ListEvent):void{
			showTooltip(event, event.type == ListEvent.ITEM_ROLL_OVER, mouseMoveListHandler, function():void{
				switch(event.columnIndex){
					case 4:
						tooltip_lbl.text = "Move Up TestCase";
						break;
					case 5:
						tooltip_lbl.text = "Move Down TestCase";
						break;
					case 6:
						tooltip_lbl.text = "Delete TestCase";
						break;
					default:
						tooltip_lbl.text = (event.item.toolTip ? event.item.toolTip : "");
				}
			}, false);
		}
		
		private function showTooltip(event:Event, isOver:Boolean, mouseEventHandler:Function, toolTipHandler:Function=null, autoHide:Boolean=true):void{
			clearInterval(_tooltipDelayInterval);
			if(isOver){
				_tooltipDelayInterval = setInterval(function():void{
					mouseEventHandler(event);
					toolTipHandler();
					if(tooltip_lbl.text != ""){
						tooltip_lbl.visible = true;
						stage.addEventListener(MouseEvent.MOUSE_MOVE, mouseEventHandler);
						if(autoHide)
							setTimeout(showTooltip, 1500, event, false, mouseEventHandler);
					}
				}, 500);
			}else{
				tooltip_lbl.visible = false;
				stage.removeEventListener(MouseEvent.MOUSE_MOVE, mouseEventHandler);
			}
		}

		private function dragEventHandler(event:MouseEvent):void{
			if(event.type == MouseEvent.MOUSE_DOWN && stage.hitTestObject(bg_mc)){
				this.startDrag();
			}else{
				this.stopDrag();
			}
		}
		
		public function externalCall(command:String, ...params):void{
			if(loaderInfo.url == null || loaderInfo.url.indexOf("file:///") == -1)
				ExternalInterface.call("parent.FlexDoor.externalCall", command, params);
		}
	}
}