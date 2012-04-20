package
{
	import flash.events.MouseEvent;
	import fl.controls.CheckBox; 
	import fl.controls.DataGrid;
	import fl.controls.listClasses.ICellRenderer;
	import fl.controls.listClasses.ListData;

	public class CheckBoxCellRenderer extends CheckBox implements ICellRenderer 
	{
		private var _listData:ListData;
		private var _data:Object;
		private var _dataField:String;
		private var _isSelected:Boolean;

		public function CheckBoxCellRenderer(){
			super();
			this.label = "";
			addEventListener(MouseEvent.CLICK, clickHandler);
		}
		
		public function set data(value:Object):void { 
			_data = value;
			validateValue();
		} 
		public function get data():Object { 
			return _data; 
		}

		public function set listData(value:ListData):void { 
			_dataField = DataGrid(value.owner).columns[value.column].dataField;
			_listData = value; 
			validateValue();
		}
		public function get listData():ListData { 
			return _listData; 
		} 

		override public function get selected():Boolean{
			return _isSelected;
		}

		private function validateValue():void{
			if(_data != null && _dataField != null)
				_isSelected = (_data[_dataField] == true);
		}

		private function clickHandler(event:MouseEvent){
			_data[_dataField] = !_isSelected;
		}
	}
}