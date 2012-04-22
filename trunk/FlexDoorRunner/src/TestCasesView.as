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
	import flash.net.SharedObject;
	import fl.data.DataProvider;
	import fl.controls.dataGridClasses.DataGridColumn;

	public class TestCasesView extends MovieClip
	{
		private var _helper:FlexDoorHelper;
		private var _testcasesList:DataProvider;
		private var _loadFile:FileReferenceList;
		private var _testCases:Array;
		private var _selectedKeys:Object;
		private var _so:SharedObject;

		public function TestCasesView(){
			super();

			_so = SharedObject.getLocal("flexdoor");

			if(_so.data.remoteLocation != null){
				location_txt.text = _so.data.remoteLocation;

				if(remote_rb.selected)
					loadTestCases();
			}else{
				location_txt.text = "";
			}
			
			if(_so.data.selectedKeys != null){
				_selectedKeys = _so.data.selectedKeys;
			}else{
				_selectedKeys = {};
			}
			
			remote_rb.selected = (_so.data.remoteAccess != false);
			local_rb.selected = !remote_rb.selected;

			var dgc1:DataGridColumn = new DataGridColumn("include");
			dgc1.headerText = "";
			dgc1.width = 25;
			dgc1.cellRenderer = CheckBoxCellRenderer;
			dgc1.resizable = false;
			var dgc2:DataGridColumn = new DataGridColumn("jsName");
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
							if(item["jsName"] == event.item["jsName"])
								updateItem(item, (item["include"] = event.item["include"]));
						}
					}
				}
			});
		}

		public function init(helper:FlexDoorHelper){
			_helper = helper;

			_helper.initButton(load_testcases_btn, loadTestCases, "Load TestCases");
			_helper.initButton(run_testcases_btn, runTestCases, "Run TestCases");
			local_rb.addEventListener(Event.CHANGE, radioButtonChangeHandler);
			remote_rb.addEventListener(Event.CHANGE, radioButtonChangeHandler);

			var format:TextFormat = new TextFormat();
			format.size = 12;
			format.font = "Arial";
			location_txt.setStyle("textFormat", format);

			location_txt.addEventListener(FocusEvent.FOCUS_IN, onFocusEventHandler);
			location_txt.addEventListener(FocusEvent.FOCUS_OUT, onFocusEventHandler);

			location_txt.dispatchEvent(new FocusEvent(FocusEvent.FOCUS_OUT));
		}

		private function radioButtonChangeHandler(event:Event):void{
			if(remote_rb.selected){
				location_txt.text = "http://domain/properties.txt";
			}else{
				location_txt.text = "http://domain/FlexDoorProxyServlet (Optional)";
			}
		}

		private function onFocusEventHandler(event:FocusEvent):void{
			var format = event.currentTarget.getStyle("textFormat") as TextFormat;
			if(event.type == FocusEvent.FOCUS_OUT){
				if(event.currentTarget.text.length == 0){
					radioButtonChangeHandler(event);
					format.color = 0x999999;
				}
			}else{
				if(format.color == 0x999999){
					event.currentTarget.text = "";
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
				if(location_txt.text.indexOf("http") != -1 && location_txt.text.indexOf("/properties.txt") != -1){
					var uri:String = location_txt.text.substring(0, location_txt.text.indexOf("properties.txt"));
					var request:URLRequest = new URLRequest(); 
					request.url = location_txt.text;
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
			_so.data.remoteLocation = location_txt.text;
			_so.data.selectedKeys = _selectedKeys;
			_so.data.remoteAccess = remote_rb.selected;
			_so.flush();

			var attachJsScript:Function = function(index:uint):void{
				if(index < _testCases.length){
					var testcase:Object = _testCases[index];
					if(_selectedKeys[testcase.name + "::undefined"] != false){
						if(location_txt.text.indexOf("http") != -1){
							var url:String = location_txt.text + "?fileName=" + testcase.name; 
							exportToJs(url, testcase.script, function(){
								ExternalInterface.call("parent.FlexDoor.createScript", url);
								attachJsScript(index + 1);
							});
						}else{
							ExternalInterface.call("parent.FlexDoor.createScript", testcase.name, testcase.script);
							attachJsScript(index + 1);
						}
					}
				}else{
					_helper.initialized();
				}
			};
			attachJsScript(0);
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
			return (data[column.dataField] != null ? data[column.dataField] : "");
		}
	}
}