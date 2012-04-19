package {

	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.display.Sprite;
	import flash.utils.clearInterval;
	import flash.utils.setInterval;

	public class FlexDoorSpy extends Sprite
	{
		public var basicView:BasicView;
		public var advancedView:AdvancedView;
		public var tooltipDelayInterval:Number;

		public function FlexDoorSpy(){
			super();
			//this.visible = false;
			openBasic();
			init();
		}

		protected function init():void{
			basicView.init(this);
			advancedView.init(this);

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

		public function open():void{
			openBasic();
			this.visible = true;
		}

		public function saveAdvancedSettings():void{
			advancedView.saveSettings();
		}

		public function clearAll():void{
			basicView.clearAll();
		}

		public function spyEvents():void{
			basicView.spyEventsHandler();
		}

		public function spyObjects():void{
			basicView.spyObjectsHandler();
		}

		public function addNewEvent(item){
			basicView.addNewEvent(item);
		}

		public function addComponent(item){
			basicView.addComponent(item);
		}

		public function openBasic(event:MouseEvent=null):void{
			advancedView.visible = false;
			basicView.visible = true;
		}

		public function openAdvanced(event:MouseEvent=null):void{
			basicView.visible = false;
			advancedView.visible = true;
		}

		public function closeWindow(event:MouseEvent=null):void{
			visible = false;
			basicView.spy_objects_ckb.selected = true;
			basicView.spy_events_ckb.selected = false;
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