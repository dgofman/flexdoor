package
{
	import fl.controls.listClasses.CellRenderer;
	import fl.controls.listClasses.ICellRenderer;
	import fl.core.InvalidationType;
	import flash.display.Sprite;

	public class GridRowCellRenderer extends CellRenderer implements ICellRenderer{

		private var _color:Number;

		public function GridRowCellRenderer():void {
			super();
			setStyle("selectedOverSkin", CellRenderer_selectedUpSkin);
		}

		override public function set data(value:Object):void {
			super.data = value;
			if(value != null){
				if(!isNaN(value.errors) && value.errors > 0){
					_color = 0xF58878;
				}else if(!isNaN(value.passed) && value.passed > 0){
					_color = 0xCCFF99;
				}else{
					_color = 0xFFFFFF;
				}
			}
			invalidate(InvalidationType.STATE);
		}
		
		override protected function drawBackground():void {
			var rectangle = new Sprite();
			rectangle.graphics.beginFill(_color, 1);
			rectangle.graphics.drawRect(0, 0, 100, 20);
			rectangle.graphics.endFill();
			setStyle("upSkin", rectangle);
			setStyle("overSkin", rectangle);
			super.drawBackground();
		}
	}
}