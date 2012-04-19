package
{
	import flash.events.MouseEvent;
	import fl.controls.CheckBox; 
	import fl.controls.listClasses.ICellRenderer;
	import fl.controls.listClasses.ListData;

	public class CheckBoxCellRenderer extends CheckBox implements ICellRenderer 
	{
		public var _listData:ListData;
		public var _data:Object;

		public function CheckBoxCellRenderer(){
			super();
			this.label = "";
			addEventListener(MouseEvent.CLICK, clickHandler);
		}
		
		public function set data(value:Object):void { 
			_data = value;
			selected = (_data && _data["on"]);
		} 
		public function get data():Object { 
			return _data; 
		}

		public function set listData(value:ListData):void { 
			_listData = value; 
		} 
		public function get listData():ListData { 
			return _listData; 
		} 

		private function clickHandler(event:MouseEvent){
			data = {on:selected};
		}
	}
}