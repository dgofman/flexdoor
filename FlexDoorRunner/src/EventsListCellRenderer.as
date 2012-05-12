package {
	import fl.controls.listClasses.CellRenderer;
	import fl.controls.listClasses.ICellRenderer;
	import flash.display.Sprite;
	import flash.events.MouseEvent;
	import flash.events.DataEvent;
	import flash.system.System;

	public class EventsListCellRenderer extends CellRenderer implements ICellRenderer{

		[Embed("../assets/filter.swf")]
		private const _filterSWF:Class;

		[Embed("../assets/copy.swf")]
		private const _copySWF:Class;

		public function EventsListCellRenderer(){
			super();
			mouseChildren = true;
			setStyle("textPadding", 40);
		}

		override protected function configUI():void {
			super.configUI();
			var filter:Sprite = new _filterSWF();
			filter.x = 2;
			filter.y = 3;
			filter.buttonMode = true;
			filter.addEventListener(MouseEvent.CLICK, excludeEvent, false, 0, true);
			addChild(filter);
			
			var copy:Sprite = new _copySWF();
			copy.x = 21;
			copy.y = 2;
			copy.buttonMode = true;
			copy.addEventListener(MouseEvent.CLICK, onCopyToClipboard, false, 0, true);
			addChild(copy);
		}

		private function excludeEvent(event:MouseEvent):void{
			listData.owner.dispatchEvent(new DataEvent(DataEvent.DATA, false, false, String(listData.index)));
		}

		private function onCopyToClipboard(event:MouseEvent):void{
			System.setClipboard(data.event);
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