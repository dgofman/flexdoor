package {

	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.display.Sprite;
	import flash.net.SharedObject;
	import flash.utils.clearInterval;
	import flash.utils.setInterval;
	import flash.external.ExternalInterface;

	public class FlexDoorRunner extends Sprite
	{
		public var inspectorView:InspectorView;
		public var advancedView:AdvancedView;
		public var testcases:TestCasesView;
		public var tooltipDelayInterval:Number;

		private var _isInitialized:Boolean;
		private var _so:SharedObject;

		public static const VERSION:String = "3.0";

		public function FlexDoorRunner(){
			super();
			_so = SharedObject.getLocal("flexdoorRunner");
			_isInitialized = false;
			openTestCases();
			if(loaderInfo.url == null || loaderInfo.url.indexOf("file:///") == -1)
				this.visible = false;
			init();
		}

		protected function init():void{
			inspectorView.init(this);
			advancedView.init(this);
			testcases.init(this);

			tooltip_lbl.autoSize = "left";
			tooltip_lbl.border = true;
			tooltip_lbl.borderColor = 0xCCCCCC;
			tooltip_lbl.background = true;
			tooltip_lbl.backgroundColor = 0xF5EE77;
			tooltip_lbl.visible = false;

			initButton(close_top_btn, closeWindow, null);

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
			testcases.visible = false;
			advancedView.visible = false;
			inspectorView.visible = true;
			this.visible = true;
		}

		public function openAdvanced(event:MouseEvent=null):void{
			testcases.visible = false;
			inspectorView.visible = false;
			advancedView.visible = true;
			this.visible = true;
		}

		public function openTestCases(event:MouseEvent=null):void{
			inspectorView.visible = false;
			advancedView.visible = false;
			testcases.visible = true;
			this.visible = true;
		}

		public function closeWindow(event:MouseEvent=null):void{
			visible = false;
			inspectorView.spy_objects_ckb.selected = true;
			inspectorView.spy_events_ckb.selected = false;
			advancedView.reset();
			dispatchEvent(new Event("close"));
		}

		public function showButtonTooltip(event:MouseEvent):void{
			clearInterval(tooltipDelayInterval);
			if(event.type == MouseEvent.ROLL_OVER){
				tooltipDelayInterval = setInterval(function():void{
					mouseMoveButtonHandler();
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
			tooltip_lbl.x = mouseX - tooltip_lbl.width / 2;
			tooltip_lbl.y = mouseY - 25;
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