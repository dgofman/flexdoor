package
{
	import fl.core.InvalidationType;
	import fl.controls.listClasses.ICellRenderer;
	import fl.controls.listClasses.ListData;
	import fl.containers.UILoader;
	import flash.display.Sprite;

	public class IconCellRenderer extends UILoader implements ICellRenderer{

		private var _data:Object;
		private var _listData:ListData;
		private var _background:Sprite;
		
		public function IconCellRenderer():void {
			super();
		}

		public function get data():Object{
			return _data;
		}
		public function set data(value:Object):void{
			_data = value;
			if(_background){
				removeChild(_background);
				_background = null;
			}
			if(value != null){
				if(!isNaN(value.passed) && value.passed > 0){
					_background = new Sprite();
					_background.graphics.beginFill(0xCCFF99, 1);
					_background.graphics.drawRect(0, 0, 100, 20);
					_background.graphics.endFill();
					addChildAt(_background, 0);
				}
				source = value.icon;
			}else{
				source = null;
			}
		}
		
		public function get listData():ListData{
			return _listData;
		}
		public function set listData(value:ListData):void {
			_listData = value;
		}

		public function get selected():Boolean{
			return false;
		}		
		public function set selected(value:Boolean):void{}
		public function setMouseState(state:String):void{}

		override protected function draw():void {
			if (_background && isInvalid(InvalidationType.SIZE)) {
				_background.width = width;
				_background.height = height;
			}
			validate(); // because we're not calling super.draw
		}
	}
}