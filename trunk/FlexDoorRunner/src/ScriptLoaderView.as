package {

	import flash.net.FileFilter;
	import flash.net.FileReferenceList;
	import flash.net.FileReference;
	import flash.utils.ByteArray;
	import flash.text.TextFormat ;
	import flash.net.URLLoader; 
	import flash.net.URLLoaderDataFormat; 
	import flash.net.URLRequest; 
	import flash.net.URLRequestMethod; 

	import flash.display.MovieClip;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.external.ExternalInterface;
	import fl.events.ListEvent;
	import flash.events.FocusEvent;
	import fl.data.DataProvider;
	import fl.controls.dataGridClasses.DataGridColumn;
	import flash.net.SharedObject;
	import flash.utils.clearInterval;
	import flash.utils.setInterval;

	public class ScriptLoaderView extends MovieClip
	{
		private var _runner:FlexDoorRunner;
		private var _testcasesList:DataProvider;
		private var _loadFile:FileReferenceList;
		private var _testCases:Array;
		private var _selectedKeys:Object;
		private var _validateInterval:Number;
		private var _activeTestItem:Object;

		private static const EMPTY_COLOR:Number = 0x999999;

		public function ScriptLoaderView(){
			super();

			var dgc1:DataGridColumn = new DataGridColumn("include");
			dgc1.headerText = "";
			dgc1.width = 25;
			dgc1.cellRenderer = CheckBoxCellRenderer;
			dgc1.resizable = false;
			dgc1.sortable = false;
			var dgc2:DataGridColumn = new DataGridColumn("jsName");
			dgc2.headerText = "TestCases";
			dgc2.sortable = false;
			var dgc3:DataGridColumn = new DataGridColumn("testName");
			dgc3.headerText = "Tests";
			dgc3.sortable = false;
			var dgc4:DataGridColumn = new DataGridColumn("state");
			dgc4.headerText = " ?";
			dgc4.width = 30;
			dgc4.sortable = false;
			var dgc5:DataGridColumn = new DataGridColumn("up");
			dgc5.headerText = " ↑";
			dgc5.width = 25;
			dgc5.resizable = false;
			dgc5.sortable = false;
			var dgc6:DataGridColumn = new DataGridColumn("down");
			dgc6.headerText = " ↓";
			dgc6.width = 25;
			dgc6.resizable = false;
			dgc6.sortable = false;
			var dgc7:DataGridColumn = new DataGridColumn("delete");
			dgc7.headerText = " X";
			dgc7.width = 25;
			dgc7.resizable = false;
			dgc7.sortable = false;

			testcases_dg.setStyle("cellRenderer", GridRowCellRenderer);
			testcases_dg.columns = [dgc1, dgc2, dgc3, dgc4, dgc5, dgc6, dgc7];

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
							if(item["jsName"] == event.item["jsName"])
								updateItem(item, (item["include"] = event.item["include"]));
						}
					}
				}
			});
		}

		public function init(runner:FlexDoorRunner){
			_runner = runner;

			testcases_dg.addEventListener(ListEvent.ITEM_ROLL_OVER, _runner.showDataGridTooltip);
			testcases_dg.addEventListener(ListEvent.ITEM_ROLL_OUT, _runner.showDataGridTooltip);

			var format:TextFormat = new TextFormat();
			format.size = 11;
			format.font = "Arial";
			format.color = EMPTY_COLOR;
			location_cmb.setStyle("textFormat", format);
			location_cmb.textField.setStyle("textFormat", format);

			var so:SharedObject = _runner.so;
			if(so.data.remoteLocation is Array){
				location_cmb.dataProvider = new DataProvider(so.data.remoteLocation);
				location_cmb.selectedIndex = so.data.locationIndex;
				location_cmb.text = so.data.remoteLocation[so.data.locationIndex];
				format.color = 0x000000;
			}
			
			if(so.data.selectedKeys != null){
				_selectedKeys = so.data.selectedKeys;
			}else{
				_selectedKeys = {};
			}
			
			local_rb.selected = (so.data.remoteAccess == false);
			remote_rb.selected = !local_rb.selected;

			_runner.initButton(load_testcases_btn, loadTestCases, "Load TestCases");
			_runner.initButton(run_testcases_btn, runTestCases, "Run TestCases");
			local_rb.addEventListener(Event.CHANGE, radioButtonChangeHandler);
			remote_rb.addEventListener(Event.CHANGE, radioButtonChangeHandler);

			location_cmb.addEventListener(FocusEvent.FOCUS_IN, onFocusEventHandler);
			location_cmb.addEventListener(FocusEvent.FOCUS_OUT, onFocusEventHandler);

			location_cmb.dispatchEvent(new FocusEvent(FocusEvent.FOCUS_OUT));
		}
		

		private function radioButtonChangeHandler(event:Event):void{
			var format = location_cmb.getStyle("textFormat") as TextFormat;
			format.color = EMPTY_COLOR;
			testcases_dg.dataProvider = new DataProvider();
			run_testcases_btn.enabled = false;
			location_cmb.selectedIndex = -1;
			location_cmb.dropdown.dispatchEvent(new Event(Event.CHANGE));

			if(remote_rb.selected){
				location_cmb.prompt = "http://domain/properties.txt";
			}else{
				location_cmb.prompt = "http://domain/flexDoorProxy (Optional)";
			}
		}

		private function onFocusEventHandler(event:FocusEvent):void{
			var format = event.currentTarget.getStyle("textFormat") as TextFormat;
			if(event.type == FocusEvent.FOCUS_OUT){
				if(location_cmb.text.length == 0){
					radioButtonChangeHandler(event);
				}
			}else{
				if(format.color == EMPTY_COLOR){
					location_cmb.text = "";
					location_cmb.prompt = "";
					format.color = 0x000000;
				}
			}
		}

		private function loadTestCases(event:MouseEvent=null):void{
			if(local_rb.selected){
				_loadFile = new FileReferenceList();
				_loadFile.addEventListener(Event.SELECT, onFileRefHandler);
				_loadFile.addEventListener(Event.CANCEL, onFileRefHandler);
				var fileFilter:FileFilter = new FileFilter("TestCases: (*.js)", "*.js");
				try{
					_loadFile.browse([fileFilter]);
				}catch (ex:Error){
					trace("Exception: " + ex.toString());
				}
			}else{
				var format = location_cmb.getStyle("textFormat") as TextFormat;
				if(format.color != EMPTY_COLOR && location_cmb.value.indexOf("http") != -1 && location_cmb.value.indexOf("/properties.txt") != -1){
					var uri:String = location_cmb.value.substring(0, location_cmb.value.indexOf("properties.txt"));
					var request:URLRequest = new URLRequest(); 
					request.url = location_cmb.value;
					request.method = URLRequestMethod.GET; 

					var urlLoader:URLLoader = new URLLoader();
					urlLoader.dataFormat = URLLoaderDataFormat.TEXT;
					urlLoader.addEventListener(Event.COMPLETE, onComplete);
					urlLoader.load(request);

					var testcases:Array = null;
					var index:uint = 0;
					function onComplete(e:Event) {
						e.currentTarget.removeEventListener(Event.COMPLETE, onComplete);
						var data:String = String(e.currentTarget.data);
						if(testcases == null){
							_testCases = [];
							testcases = [];
							var lines:Array = data.split('\n');
							for(var i:uint = 0; i < lines.length; i++){
								var line:String = lines[i];
								if(line.indexOf('#') != 0)
									testcases.push(line);
							}
						}else{
							parseJSFile(testcases[index++], data);
						}

						if(index < testcases.length){
							request.url = uri + testcases[index];
							urlLoader.addEventListener(Event.COMPLETE, onComplete);
							urlLoader.load(request);
						}else{
							invalidateDataGrid();
						}
					};
				}
			}
		}

		public function onFileRefHandler(event:Event):void{
			event.currentTarget.removeEventListener(Event.SELECT, onFileRefHandler);
			event.currentTarget.removeEventListener(Event.CANCEL, onFileRefHandler);
			if(event.type == Event.SELECT){
				var fr:FileReference;
				var fileList:Array = event.target.fileList;
				_testCases = [];
				function onFileComplete(event:Event=null):void{
					if(event != null){
						event.currentTarget.removeEventListener(Event.SELECT, onFileComplete);
						fr = event.currentTarget as FileReference;
						var script:String= fr.data.readMultiByte(fr.data.length, "gb2312");
						parseJSFile(fr.name, script);
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

		private function parseJSFile(jsName:String, script:String):void{
			var tests:Array = script.split(".prototype.test_");
			for(var t:uint = 1; t < tests.length; t++)
				tests[t] = 'test_' + tests[t].split(" ")[0];
			_testCases.push({name:jsName, tests:tests, script:script});
		}

		private function invalidateDataGrid():void{
			_testcasesList = new DataProvider();
			for(var i:uint = 0; i < _testCases.length; i++){
				var testcase:Object = _testCases[i];
				_testcasesList.addItem(initItem({jsName:testcase.name, data:testcase.script, index:i}));
				for(var t:uint = 1; t < testcase.tests.length; t++){
					_testcasesList.addItem(initItem({jsName:testcase.name, testName:testcase.tests[t]}));
				}
			}
			testcases_dg.dataProvider = _testcasesList;
			run_testcases_btn.enabled = (_testCases.length > 0);
		}

		private function initItem(item:Object):Object{
			item["include"] = (_selectedKeys[item.jsName + "::" + item.testName] != false);
			return item;
		}

		private function updateItem(item:Object, value:Boolean):void{
			_selectedKeys[item.jsName + "::" + item.testName] = value;
		}

		public function runTestCases(event:MouseEvent=null):void{
			var format = location_cmb.getStyle("textFormat") as TextFormat;
			var so:SharedObject = _runner.so;
			if(location_cmb.value.indexOf("http") != -1 && location_cmb.dataProvider is DataProvider){
				var items:Array = _runner.toArray(location_cmb.dataProvider, "label");
				var index:int = items.indexOf(location_cmb.value);
				if(index == -1){
					index = 0;
					items.unshift(location_cmb.value);
					location_cmb.dataProvider.addItemAt({label:location_cmb.value}, 0);
				}
				so.data.remoteLocation = items;
				so.data.locationIndex = index;
			}else{
				so.data.remoteLocation = null;
				so.data.locationIndex = -1;
			}
			so.data.selectedKeys = _selectedKeys;
			so.data.remoteAccess = remote_rb.selected;
			so.flush();

			ExternalInterface.call("parent.FlexDoor.reset");
			var attachJsScript:Function = function(index:uint):void{
				if(index < _testCases.length){
					var testcase:Object = _testCases[index];
					if(_selectedKeys[testcase.name + "::undefined"] != false){
						if(format.color != EMPTY_COLOR && remote_rb.selected){
							var uri:String = location_cmb.value.substring(0, location_cmb.value.indexOf("properties.txt"));
							ExternalInterface.call("parent.FlexDoor.createScript", testcase.name, uri + testcase.name);
							attachJsScript(index + 1);
						}else if(format.color != EMPTY_COLOR && location_cmb.value.indexOf("http") != -1){
							var url:String = location_cmb.value + "?fileName=" + testcase.name; 
							exportToJs(url, testcase.script, function(){
								ExternalInterface.call("parent.FlexDoor.createScript", testcase.name, url);
								attachJsScript(index + 1);
							});
						}else{
							ExternalInterface.call("parent.FlexDoor.createScript", testcase.name, null, testcase.script);
							attachJsScript(index + 1);
						}
					}
				}else{
					clearInterval(_validateInterval);
					_validateInterval = setInterval(runJSScripts, 500);
				}
			};
			attachJsScript(0);
		}

		private function runJSScripts(){
			var pendingJS:uint = ExternalInterface.call("parent.FlexDoor.getPendingJS");
			if(pendingJS == 0){
				clearInterval(_validateInterval);
				_runner.initialized(false);
			}
		}

		private function exportToJs(url:String, script:String, callBack:Function):void{
			var bytes:ByteArray = new ByteArray();
			bytes.writeUTF(script);

			var request:URLRequest = new URLRequest(); 
			request.url = url;
			request.method = URLRequestMethod.POST; 
			request.contentType = "application/octet-stream";
			request.data = bytes; 
			
			var onComplete:Function = function(event:Event):void{
				event.currentTarget.removeEventListener(Event.COMPLETE, onComplete);
				callBack();
			};
			var urlLoader:URLLoader = new URLLoader();
			urlLoader.dataFormat = URLLoaderDataFormat.BINARY; 
			urlLoader.addEventListener(Event.COMPLETE, onComplete);
			urlLoader.load(request); 
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
			if(column.dataField == "state" && data.errors != undefined && data.success != undefined){
				return data.errors + "/" + data.success;
			}
			return (data[column.dataField] != null ? data[column.dataField] : "");
		}

		public function assertResult(error:Boolean, message:String):void{
			testcases_dg.selectedIndex++;
			_activeTestItem = testcases_dg.selectedItem;
			if(_activeTestItem != null){
				if(_activeTestItem.errors == undefined)
					_activeTestItem.errors = 0;
				if(_activeTestItem.success == undefined)
					_activeTestItem.success = 0;
					
				_activeTestItem[error ? 'errors' : 'success']++;
				if(_activeTestItem.toolTip == null)
					_activeTestItem.toolTip = message;
				else
					_activeTestItem.toolTip += '\n\n' + message;
				
			}
		}
	}
}