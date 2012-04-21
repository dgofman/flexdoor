package {

	import flash.net.FileFilter;
	import flash.net.FileReferenceList;
	import flash.net.FileReference;
	import flash.display.MovieClip;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.external.ExternalInterface;
	import fl.events.ListEvent;
	import fl.data.DataProvider;
	import fl.controls.dataGridClasses.DataGridColumn;

	public class TestCasesView extends MovieClip
	{
		private var _helper:FlexDoorHelper;
		private var _testcasesList:DataProvider;
		private var _loadFile:FileReferenceList;
		private var _testCases:Array;
		private var _selectedKeys:Object;

		public function TestCasesView(){
			super();

			var dgc1:DataGridColumn = new DataGridColumn("include");
			dgc1.headerText = "";
			dgc1.width = 25;
			dgc1.cellRenderer = CheckBoxCellRenderer;
			dgc1.resizable = false;
			var dgc2:DataGridColumn = new DataGridColumn("testCaseName");
			dgc2.headerText = "TestCases";
			var dgc3:DataGridColumn = new DataGridColumn("testName");
			dgc3.headerText = "Tests";
			var dgc4:DataGridColumn = new DataGridColumn("up");
			dgc4.headerText = "";
			dgc4.width = 25;
			dgc4.resizable = false;
			var dgc5:DataGridColumn = new DataGridColumn("down");
			dgc5.headerText = "";
			dgc5.width = 25;
			dgc5.resizable = false;
			var dgc6:DataGridColumn = new DataGridColumn("delete");
			dgc6.headerText = "";
			dgc6.width = 25;
			dgc6.resizable = false;

			testcases_dg.columns = [dgc1, dgc2, dgc3, dgc4, dgc5, dgc6];

			testcases_dg.labelFunction = columnLabelFunction;
			testcases_dg.addEventListener(ListEvent.ITEM_CLICK, function(event:ListEvent):void
			{
				var dataField:String = testcases_dg.columns[event.columnIndex].dataField;
				if(dataField == "include")
					updateItem(event.item, event.item["include"]);
						
				if(event.item["testName"] == null){
					var items:Array;
					if(dataField == "up" && event.item.index > 0){
						items = _testCases.splice(event.item.index, 1);
						_testCases.splice(event.item.index - 1, 0, items[0]);
						invalidateDataGrid();
					}else if(dataField == "down" && event.item.index < _testcasesList.length - 1){
						items = _testCases.splice(event.item.index, 1);
						_testCases.splice(event.item.index + 1, 0, items[0]);
						invalidateDataGrid();
					}else if(dataField == "delete"){
						items = _testCases.splice(event.item.index, 1);
						invalidateDataGrid();
					}else if(dataField == "include"){
						for(var i:uint = 0; i < _testcasesList.length; i++){
							var item:Object = _testcasesList.getItemAt(i);
							if(item["testCaseName"] == event.item["testCaseName"])
								updateItem(item, (item["include"] = event.item["include"]));
						}
					}
				}
			});
		}

		public function init(helper:FlexDoorHelper){
			_helper = helper;

			_helper.initButton(load_testcases_btn, openDialog, "Load TestCases  Ctrl+Alt+T");
			_helper.initButton(run_testcases_btn, runTestCases, "Run TestCases  Ctrl+Alt+R");
		}

		public function openDialog(event:MouseEvent=null):void{
			_loadFile = new FileReferenceList();
			_loadFile.addEventListener(Event.SELECT, onFileRefHandler);
			_loadFile.addEventListener(Event.CANCEL, onFileRefHandler);
			var fileFilter:FileFilter = new FileFilter("TestCases: (*.js)", "*.js");
			try{
				_loadFile.browse([fileFilter]);
			}catch (ex:Error){
				trace("Exception: " + ex.toString());
			}
		}

		public function onFileRefHandler(event:Event):void{
			event.currentTarget.removeEventListener(Event.SELECT, onFileRefHandler);
			event.currentTarget.removeEventListener(Event.CANCEL, onFileRefHandler);
			if(event.type == Event.SELECT){
				var fr:FileReference;
				var fileList:Array = event.target.fileList;
				_testCases = [];
				_selectedKeys = {};
				function onFileComplete(event:Event=null):void{
					if(event != null){
						event.currentTarget.removeEventListener(Event.SELECT, onFileComplete);
						fr = event.currentTarget as FileReference;
						var script:String= fr.data.readMultiByte(fr.data.length, "gb2312");
						var tests:Array = script.split(".prototype.test_");
						for(var t:uint = 1; t < tests.length; t++)
							tests[t] = 'test_' + tests[t].split(" ")[0];
						_testCases.push({name:fr.name, tests:tests, script:script});
					}
					if(fileList.length > 0){
						fr = fileList.shift() as FileReference;
						fr.addEventListener(Event.COMPLETE, onFileComplete);
						fr.load();
					}else{
						invalidateDataGrid();
					}
				};
				onFileComplete();
			}
		}

		private function invalidateDataGrid():void{
			_testcasesList = new DataProvider();
			for(var i:uint = 0; i < _testCases.length; i++){
				var testcase:Object = _testCases[i];
				_testcasesList.addItem(initItem({testCaseName:testcase.name, data:testcase.script, index:i}));
				for(var t:uint = 1; t < testcase.tests.length; t++){
					_testcasesList.addItem(initItem({testCaseName:testcase.name, testName:testcase.tests[t]}));
				}
			}
			testcases_dg.dataProvider = _testcasesList;
			run_testcases_btn.enabled = (_testCases.length > 0);
		}

		private function initItem(item:Object):Object{
			item["include"] = (_selectedKeys[item.testCaseName + "::" + item.testName] != false);
			return item;
		}

		private function updateItem(item:Object, value:Boolean):void{
			_selectedKeys[item.testCaseName + "::" + item.testName] = value;
		}

		public function runTestCases(event:MouseEvent=null):void{
			for(var i:uint = 0; i < _testCases.length; i++){
				var testcase:Object = _testCases[i];
				if(_selectedKeys[testcase.name + "::undefined"] != false){
					var tests:Array = [];
					for(var t:uint = 1; t < testcase.tests.length; t++){
						var testName:String = testcase.tests[t];
						if(_selectedKeys[testcase.name + "::" + testName] != false){
							tests.push(testName);
						}
					}
					ExternalInterface.call("parent.FlexDoor.createScript", testcase.script, tests);
				}
			}
			_helper.initialized();
		}

		private function columnLabelFunction(data:Object, column:DataGridColumn):String {
			if(data["testName"] == null){
				if(data.index > 0 && column.dataField == "up"){
					return "↑";
				}else if(data.index < _testCases.length - 1 && column.dataField == "down"){
					return "↓";
				}else if(column.dataField == "delete"){
					return "X";
				}
			}
			return (data[column.dataField] != null ? data[column.dataField] : "");
		}
	}
}