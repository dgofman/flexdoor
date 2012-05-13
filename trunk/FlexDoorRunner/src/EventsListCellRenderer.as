package {
	import fl.controls.listClasses.CellRenderer;
	import fl.controls.listClasses.ICellRenderer;
	import fl.events.ListEvent;
	import flash.display.Sprite;
	import flash.events.MouseEvent;
	import flash.system.System;

	public class EventsListCellRenderer extends CellRenderer implements ICellRenderer{

		[Embed("../assets/filter.swf")]
		public static const filterSWF:Class;

		[Embed("../assets/copy.swf")]
		public static const copySWF:Class;

		private var _filter:Sprite;
		private var _copy:Sprite;
		
		public function EventsListCellRenderer(){
			super();
			mouseChildren = true;
			setStyle("textPadding", 40);
		}

		override protected function configUI():void {
			super.configUI();
			_filter = new filterSWF();
			_filter.x = 2;
			_filter.y = 3;
			_filter.buttonMode = true;
			_filter.addEventListener(MouseEvent.CLICK, excludeEvent, false, 0, true);
			_filter.addEventListener(MouseEvent.ROLL_OVER, onMouseEventHandler, false, 0, true);
			_filter.addEventListener(MouseEvent.ROLL_OUT, onMouseEventHandler, false, 0, true);
			addChild(_filter);
			
			_copy = new copySWF();
			_copy.x = 21;
			_copy.y = 2;
			_copy.buttonMode = true;
			_copy.addEventListener(MouseEvent.CLICK, on_copyToClipboard, false, 0, true);
			_copy.addEventListener(MouseEvent.ROLL_OVER, onMouseEventHandler, false, 0, true);
			_copy.addEventListener(MouseEvent.ROLL_OUT, onMouseEventHandler, false, 0, true);
			addChild(_copy);
		}

		private function excludeEvent(event:MouseEvent):void{
			listData.owner.dispatchEvent(new ListEvent(ListEvent.ITEM_CLICK, false, false, _listData.column, _listData.row, _listData.index, null));
		}

		private function on_copyToClipboard(event:MouseEvent):void{
			System.setClipboard(data.event);
		}
		
		private function onMouseEventHandler(event:MouseEvent):void{
			if(event.type == MouseEvent.ROLL_OVER){
				var item:Object = data;
				if(event.target == _filter){
					item = _filter;
				}else if(event.target == _copy){
					item = _copy;
				}
				listData.owner.dispatchEvent(new ListEvent(ListEvent.ITEM_ROLL_OVER, false, false, _listData.column, _listData.row, _listData.index, item));
			}else{
				listData.owner.dispatchEvent(new ListEvent(ListEvent.ITEM_ROLL_OUT));
			}
		}

		override protected function drawBackground():void {
			if (_listData.index % 2 == 0) {
				setStyle("upSkin", CellRenderer_upSkin);
			} else {
				setStyle("upSkin", CellRenderer_upSkinGray);
			}
			super.drawBackground();
		}
	}
}