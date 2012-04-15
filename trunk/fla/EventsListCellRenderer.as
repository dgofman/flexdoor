package {
	import fl.controls.listClasses.CellRenderer;
	import fl.controls.listClasses.ICellRenderer;
	import flash.display.Sprite;
	import flash.events.MouseEvent;
	import flash.system.System;

	public class EventsListCellRenderer extends CellRenderer implements ICellRenderer{

		[Embed("copy.swf")]
		private const _copySWF:Class;

		public function EventsListCellRenderer(){
			super();
			mouseChildren = true;
			setStyle("textPadding", 20);
		}

		override protected function configUI():void {
			super.configUI();
			var copy:Sprite = new _copySWF();
			copy.x = 2;
			copy.y = 2;
			copy.buttonMode = true;
			copy.addEventListener(MouseEvent.CLICK, onCopyToClipboard, false, 0, true);
			addChild(copy);
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