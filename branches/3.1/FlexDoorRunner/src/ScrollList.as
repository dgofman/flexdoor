package
{
	import fl.controls.List;
	import fl.controls.listClasses.CellRenderer;
	import fl.controls.ScrollBar;

	public class ScrollList extends List
	{
		public function ScrollList(){
			super();
			useFixedHorizontalScrolling = false;
		}
		
		override protected function draw():void{
			var maxWidth:uint = 0;
			var maxHeight:uint = 0
			var renderer:CellRenderer = getDisplayObjectInstance(getStyleValue("cellRenderer")) as CellRenderer;
			if(renderer != null){
				var textPadding:Number = Number(getStyle("textPadding"));
				for(var i = 0; i < dataProvider.length; i++){
					var label:String = itemToLabel(dataProvider.getItemAt(i));
					renderer.textField.text = label;
					maxWidth = Math.max(maxWidth, renderer.textField.textWidth + textPadding * 2);
					maxHeight += renderer.height;
				}
			}
			contentWidth = maxWidth + (maxHeight > height ? ScrollBar.WIDTH : 0);
			if(contentWidth > maxHorizontalScrollPosition)
				maxHorizontalScrollPosition = contentWidth;
			super.draw();
		}

		override protected function drawList():void {
			_horizontalScrollPosition = 0;
			super.drawList();
		}
	}
}