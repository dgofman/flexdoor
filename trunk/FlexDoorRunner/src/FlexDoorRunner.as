package {

	import fl.controls.Button;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.display.MovieClip;
	import flash.net.SharedObject;
	import flash.utils.clearInterval;
	import flash.utils.setInterval;
	import flash.external.ExternalInterface;

	public class FlexDoorRunner extends MovieClip
	{
		public static const VERSION:String = "3.0";

		public var views:MovieClip;
		public var tooltipDelayInterval:Number;

		private var inspectorView:InspectorView;
		private var advancedView:AdvancedView;
		private var scriptLoaderView:ScriptLoaderView;

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
			button.useHandCursor = true;
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
				ExternalInterface.call("parent.FlexDoor.dispatchEvent", "initialized", VERSION);
			}
		}

		public function get so():SharedObject{
			return _so;
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

		public function addNewEvent(item){
			inspectorView.addNewEvent(item);
		}

		public function addComponent(item){
			inspectorView.addComponent(item);
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
			clearInterval(tooltipDelayInterval);
			if(event != null && event.type == MouseEvent.ROLL_OVER){
				tooltipDelayInterval = setInterval(function():void{
					mouseMoveButtonHandler(event);
					tooltip_lbl.text = " " + event.currentTarget.getStyle("toolTip") + " ";
					tooltip_lbl.visible = true;
					stage.addEventListener(MouseEvent.MOUSE_MOVE, mouseMoveButtonHandler);
				}, 500);
			}else{
				tooltip_lbl.visible = false;
				stage.removeEventListener(MouseEvent.MOUSE_MOVE, mouseMoveButtonHandler);
			}
		}

		private function mouseMoveButtonHandler(event:MouseEvent=null):void{
			clearInterval(tooltipDelayInterval);
			var x:Number = Math.max(0, mouseX - tooltip_lbl.width / 2);
			tooltip_lbl.x = Math.min(x, stage.stageWidth - tooltip_lbl.width);
			tooltip_lbl.y = mouseY + (event.target.y > 30 ? -25 : 25);
		}

		private function dragEventHandler(event:MouseEvent):void{
			if(event.type == MouseEvent.MOUSE_DOWN && stage.hitTestObject(bg_mc)){
				this.startDrag();
			}else{
				this.stopDrag();
			}
		}
	}
}