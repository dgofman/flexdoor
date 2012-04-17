package {

	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.display.Sprite;

	public class FlexDoorSpy extends Sprite
	{
		public var basicView:BasicView;
		public var advancedView:AdvancedView;

		public function FlexDoorSpy(){
			super();
			this.visible = false;
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

			close_top_btn.addEventListener(MouseEvent.CLICK, closeWindow);
			close_top_btn.useHandCursor = true;

			bg_mc.addEventListener(MouseEvent.MOUSE_DOWN, dragEventHandler);
			bg_mc.addEventListener(MouseEvent.MOUSE_UP, dragEventHandler);
		}

		public function saveAdvancedSettings():void{
			advancedView.saveAdvancedSettings();
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
			dispatchEvent(new Event("close"));
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