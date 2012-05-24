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
	import fl.events.ListEvent;
	import flash.events.FocusEvent;
	import fl.data.DataProvider;
	import fl.controls.dataGridClasses.DataGridColumn;
	import flash.net.SharedObject;
	import flash.utils.clearInterval;
	import flash.utils.setInterval;
	import flash.events.IOErrorEvent;

	public class ScriptLoaderView extends MovieClip
	{
		private var _runner:FlexDoorRunner;
		private var _loadFile:FileReferenceList;
		private var _testCases:Array;
		private var _selectedKeys:Object;
		private var _validateInterval:Number;
		
		private var _startTime:Date;

		private static const EMPTY_COLOR:Number = 0x999999;

		public function ScriptLoaderView(){
			super();

			overlay_mc.alpha = .1;
			overlay_mc.visible = false;

			var dgc1:DataGridColumn = new DataGridColumn("include");
			dgc1.headerText = "";
			dgc1.width = 25;
			dgc1.cellRenderer = CheckBoxCellRenderer;
			dgc1.resizable = false;
			dgc1.sortable = false;
			var dgc2:DataGridColumn = new DataGridColumn("jsFile");
			dgc2.headerText = "TestCases";
			dgc2.sortable = false;
			var dgc3:DataGridColumn = new DataGridColumn("testName");
			dgc3.headerText = "Tests";
			dgc3.sortable = false;
			var dgc4:DataGridColumn = new DataGridColumn("state");
			dgc4.headerText = "  ?";
			dgc4.width = 35;
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
				if(play_pause_btn.selected == true){
					event.preventDefault();
					return;
				}

				var dataField:String = testcases_dg.columns[event.columnIndex].dataField;
				if(dataField == "include")
					updateItem(event.item, event.item["include"]);
						
				if(event.item["testName"] == null){
					var items:Array;
					var dp:DataProvider = testcases_dg.dataProvider;
					if(dataField == "up" && event.item.index > 0){
						items = _testCases.splice(event.item.index, 1);
						_testCases.splice(event.item.index - 1, 0, items[0]);
						invalidateDataGrid();
					}else if(dataField == "down" && event.item.index < dp.length - 1){
						items = _testCases.splice(event.item.index, 1);
						_testCases.splice(event.item.index + 1, 0, items[0]);
						invalidateDataGrid();
					}else if(dataField == "delete"){
						items = _testCases.splice(event.item.index, 1);
						invalidateDataGrid();
					}else if(dataField == "include"){
						for(var i:uint = 0; i < dp.length; i++){
							var item:Object = dp.getItemAt(i);
							if(item["jsFile"] == event.item["jsFile"])
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
			remote_rb.selected = (so.data.remoteAccess == true);

			play_pause_btn.setStyle("upIcon", "PlayButtonNormal");
			play_pause_btn.setStyle("downIcon", "PlayButtonDown");
			play_pause_btn.setStyle("overIcon", "PlayButtonOver");
			play_pause_btn.setStyle("disabledIcon", "PlayButtonDisabled");

			play_pause_btn.setStyle("selectedUpIcon", "PauseButtonNormal");
			play_pause_btn.setStyle("selectedDownIcon", "PauseButtonDown");
			play_pause_btn.setStyle("selectedOverIcon", "PauseButtonOver");
			play_pause_btn.setStyle("selectedDisabledIcon", "PauseButtonDisabled");

			stop_btn.setStyle("upIcon", "StopButtonNormal");
			stop_btn.setStyle("downIcon", "StopButtonDown");
			stop_btn.setStyle("overIcon", "StopButtonOver");
			stop_btn.setStyle("disabledIcon", "StopButtonDisabled");

			_runner.initButton(open_testcases_btn, openTestCases, "Open TestCases");
			_runner.initButton(load_testcases_btn, loadTestCases, "Load TestCases");
			_runner.initButton(play_pause_btn, playPauseTestCases, "Play/Pause TestCases Ctrl+Alt+P");
			_runner.initButton(stop_btn, stopTestCases, "Stop TestCases Ctrl+Alt+S");
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
			load_testcases_btn.enabled = false;
			stop_btn.enabled = false;
			play_pause_btn.enabled = false;
			play_pause_btn.selected = false;
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

		private function isValidProtocol(value:String):Boolean{
			return (value.indexOf("http") != -1 || value.indexOf("file:///") != -1);
		}

		private function openTestCases(event:MouseEvent=null):void{
			play_pause_btn.enabled = false;
			stop_btn.enabled = false;

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
				if(format.color != EMPTY_COLOR && isValidProtocol(location_cmb.value)){
					var uri:String = location_cmb.value.substring(0, location_cmb.value.lastIndexOf("/") + 1);
					var request:URLRequest = new URLRequest(); 
					request.url = location_cmb.value;
					request.method = URLRequestMethod.GET; 

					var urlLoader:URLLoader = new URLLoader();
					urlLoader.dataFormat = URLLoaderDataFormat.TEXT;
					urlLoader.addEventListener(Event.COMPLETE, onComplete);
					urlLoader.addEventListener(IOErrorEvent.IO_ERROR, errorHandler);
					urlLoader.load(request);

					var testcases:Array = null;
					var index:uint = 0;
					function onComplete(e:Event) {
						e.currentTarget.removeEventListener(Event.COMPLETE, onComplete);
						e.currentTarget.removeEventListener(IOErrorEvent.IO_ERROR, errorHandler);
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

		private function errorHandler(e:IOErrorEvent):void {
			e.currentTarget.removeEventListener(IOErrorEvent.IO_ERROR, errorHandler);
			_runner.alertView.error(e.text);
		}

		private function onFileRefHandler(event:Event):void{
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

		private function parseJSFile(jsFile:String, script:String):void{
			var regExp:RegExp = /(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm;
			script = script.replace(regExp, "");

			var testCaseName:String = jsFile.split(".js")[0];
			var tests:Array = script.split(".prototype.test_");
			for(var t:uint = 1; t < tests.length; t++)
				tests[t] = 'test_' + tests[t].split(" ")[0];
			_testCases.push({jsFile:jsFile, testCaseName:testCaseName, tests:tests, script:script});
		}

		private function invalidateDataGrid():void{
			var dp:DataProvider = new DataProvider();
			for(var i:uint = 0; i < _testCases.length; i++){
				var testcase:Object = _testCases[i];
				dp.addItem(initItem({jsFile:testcase.jsFile, testCaseName:testcase.testCaseName, data:testcase.script, tests:testcase.tests, index:i}));
				for(var t:uint = 1; t < testcase.tests.length; t++){
					dp.addItem(initItem({jsFile:testcase.jsFile, testCaseName:testcase.testCaseName, testName:testcase.tests[t], testIndex:t - 1}));
				}
			}
			testcases_dg.dataProvider = dp;
			load_testcases_btn.enabled = (_testCases.length > 0);
		}

		private function initItem(item:Object):Object{
			item["include"] = (_selectedKeys[item.jsFile + "::" + item.testName] != false);
			return item;
		}

		private function updateItem(item:Object, value:Boolean):void{
			_selectedKeys[item.jsFile + "::" + item.testName] = value;
		}

		private function loadTestCases(event:MouseEvent=null):void{
			load_testcases_btn.enabled = false;
			var format = location_cmb.getStyle("textFormat") as TextFormat;
			var so:SharedObject = _runner.so;
			if(isValidProtocol(location_cmb.value) && location_cmb.dataProvider is DataProvider){
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

			externalCall("reset");
			var attachJsScript:Function = function(index:uint):void{
				if(index < _testCases.length){
					var testcase:Object = _testCases[index];
					if(_selectedKeys[testcase.testCaseName + "::undefined"] != false){
						if(format.color != EMPTY_COLOR && remote_rb.selected){
							var uri:String = location_cmb.value.substring(0, location_cmb.value.lastIndexOf("/") + 1);
							trace(uri);
							externalCall("createScript", testcase.testCaseName, uri + testcase.jsFile);
							attachJsScript(index + 1);
						}else if(format.color != EMPTY_COLOR && isValidProtocol(location_cmb.value)){
							var url:String = location_cmb.value + "?fileName=" + testcase.jsFile; 
							exportToJs(url, testcase.script, function(){
								externalCall("createScript", testcase.jsFile, url);
								attachJsScript(index + 1);
							});
						}else{
							externalCall("createScript", testcase.jsFile, null, testcase.script);
							attachJsScript(index + 1);
						}
					}
				}else{
					clearInterval(_validateInterval);
					_validateInterval = setInterval(initialized, 500);
				}
			};
			attachJsScript(0);
		}

		public function playPauseTestCases(event:MouseEvent=null):void{
			if(_startTime == null)
				_startTime = new Date();
			if(event == null)
				play_pause_btn.selected = !play_pause_btn.selected;
			if(play_pause_btn.enabled && play_pause_btn.selected == true){
				var testCaseName:String = getNextTestCase();
				if(testCaseName != null){
					overlay_mc.visible = true;
					externalCall("run", testCaseName);
					return;
				}
			}
			play_pause_btn.selected = false;
		}

		public function stopTestCases(event:MouseEvent=null):void{
			if(stop_btn.enabled){
				overlay_mc.visible = false;
				play_pause_btn.selected = false;
				testcases_dg.selectedIndex = -1;

				var tests:uint = 0;
				var passed:uint = 0;
				var failed:uint = 0;
				var dp:DataProvider = testcases_dg.dataProvider;
				for(var i:uint = 0; i < dp.length; i++){
					var item:Object = dp.getItemAt(i);
					if(item["testName"] != null && item["include"] != false){
						if(item.errors != undefined)
							failed += item.errors;
						if(item.passed != undefined)
							passed += item.passed;
						tests++;
					}
					
				}
				_runner.alertView.finish(
						"<b>Completed in</b> " + Number(new Date().time - _startTime.time) + " milliseconds<br>" +
						tests + " <b>tests</b> of " + passed + " <b>passed</b>, " + failed + " <b>failed</b>");
				_startTime = null;
			}
		}

		private function initialized(){
			var pendingJS:uint = externalCall("getPendingJS");
			if(pendingJS == 0){
				clearInterval(_validateInterval);
				play_pause_btn.enabled = true;
				stop_btn.enabled = true;
				_runner.initialized();
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
			if(column.dataField == "state" && data.errors != undefined && data.passed != undefined){
				return data.errors + "/" + data.passed;
			}
			return (data[column.dataField] != null ? data[column.dataField] : "");
		}

		public function assertResult(error:Boolean, message:String):void{
			var dp:DataProvider = testcases_dg.dataProvider;
			var item:Object = testcases_dg.selectedItem;
			if(item != null){
				if(item.errors == undefined)
					item.errors = 0;
				if(item.passed == undefined)
					item.passed = 0;
					
				item[error ? 'errors' : 'passed']++;
				if(item.toolTip == null)
					item.toolTip = message;
				else
					item.toolTip += ' <br><br> ' + message;
				
				dp.replaceItem(item, testcases_dg.selectedItem);
			}
		}

		public function getNextTestCase():String{
			if(play_pause_btn.selected == true){
				var dp:DataProvider = testcases_dg.dataProvider;
				if(testcases_dg.selectedIndex < 0)
					testcases_dg.selectedIndex = 0;

				for(var i:uint = testcases_dg.selectedIndex; i < dp.length -1; i++){
					var item:Object = dp.getItemAt(i);
					if(item["testName"] != null && item["include"] != false){
						testcases_dg.selectedIndex = i;
						return item["testCaseName"];
					}
				}
				stopTestCases();
			}
			return null; //pause testcases
		}

		public function getTestIndex(index:uint, testCaseName:String):int{
			if(play_pause_btn.selected == false)
				return -1; //pause tests

			var newIndex:int = index + 1;
			if(index == 0 && testcases_dg.selectedItem != null){
				newIndex = testcases_dg.selectedItem["testIndex"]; //get selected test index
			}else{
				var dp:DataProvider = testcases_dg.dataProvider;
				for(var i:uint = testcases_dg.selectedIndex + 1; i < dp.length; i++){
					testcases_dg.selectedIndex = i;
					var item:Object = testcases_dg.selectedItem;
					if(item["testCaseName"] == testCaseName && item["testName"] != null && item["include"] != false){
						testcases_dg.verticalScrollPosition = ((i - 5) * testcases_dg.rowHeight);
						newIndex = item["testIndex"];  //returns next available test index
						break;
					}else if(item["testCaseName"] != testCaseName){
						break;
					}
				}
			}
			if(testcases_dg.selectedItem != null){
				delete testcases_dg.selectedItem.errors;
				delete testcases_dg.selectedItem.passed;
			}
			return newIndex;
		}

		private function externalCall(command:String, ...params):uint{
			_runner.externalCall.apply(_runner, [command].concat(params));
			return 0;
		}
	}
}