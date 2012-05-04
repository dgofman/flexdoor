﻿package {

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

	public class ScriptLoaderView extends MovieClip
	{
		private var _runner:FlexDoorRunner;
		private var _loadFile:FileReferenceList;
		private var _testCases:Array;
		private var _selectedKeys:Object;
		private var _validateInterval:Number;

		private static const EMPTY_COLOR:Number = 0x999999;

		public function ScriptLoaderView(){
			super();

			overlay_mc.alpha = .01;
			overlay_mc.visible = false;

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
			dgc4.resizable = false;
			dgc4.editable = false;
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
			_runner.initButton(play_pause_btn, playPauseTestCases, "Run/Pause TestCases");
			_runner.initButton(stop_btn, stopTestCases, "Stop TestCases");
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
			var dp:DataProvider = new DataProvider();
			for(var i:uint = 0; i < _testCases.length; i++){
				var testcase:Object = _testCases[i];
				dp.addItem(initItem({jsName:testcase.name, data:testcase.script, tests:testcase.tests, index:i}));
				for(var t:uint = 1; t < testcase.tests.length; t++){
					dp.addItem(initItem({jsName:testcase.name, testName:testcase.tests[t], testIndex:t - 1}));
				}
			}
			testcases_dg.dataProvider = dp;
			load_testcases_btn.enabled = (_testCases.length > 0);
		}

		private function initItem(item:Object):Object{
			item["include"] = (_selectedKeys[item.jsName + "::" + item.testName] != false);
			return item;
		}

		private function updateItem(item:Object, value:Boolean):void{
			_selectedKeys[item.jsName + "::" + item.testName] = value;
		}

		public function loadTestCases(event:MouseEvent=null):void{
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
					if(_selectedKeys[testcase.name + "::undefined"] != false){
						if(format.color != EMPTY_COLOR && remote_rb.selected){
							var uri:String = location_cmb.value.substring(0, location_cmb.value.indexOf("properties.txt"));
							externalCall("createScript", testcase.name, uri + testcase.name);
							attachJsScript(index + 1);
						}else if(format.color != EMPTY_COLOR && isValidProtocol(location_cmb.value)){
							var url:String = location_cmb.value + "?fileName=" + testcase.name; 
							exportToJs(url, testcase.script, function(){
								externalCall("createScript", testcase.name, url);
								attachJsScript(index + 1);
							});
						}else{
							externalCall("createScript", testcase.name, null, testcase.script);
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

		private function playPauseTestCases(event:MouseEvent=null):void{
			if(play_pause_btn.selected == true){
				var testCaseName:String = getNextTestCase();
				if(testCaseName != null){
					overlay_mc.visible = true;
					externalCall("run", testCaseName);
					return;
				}
			}
			play_pause_btn.selected = false;
		}

		private function stopTestCases(event:MouseEvent=null):void{
			overlay_mc.visible = false;
			play_pause_btn.selected = false;
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
			if(column.dataField == "state" && data.errors != undefined && data.success != undefined){
				return data.errors + "/" + data.success;
			}
			return (data[column.dataField] != null ? data[column.dataField] : "");
		}

		public function assertResult(error:Boolean, message:String):void{
			var dp:DataProvider = testcases_dg.dataProvider;
			var item:Object = testcases_dg.selectedItem;
			if(item != null){
				if(item.errors == undefined)
					item.errors = 0;
				if(item.success == undefined)
					item.success = 0;
					
				item[error ? 'errors' : 'success']++;
				if(item.toolTip == null)
					item.toolTip = message;
				else
					item.toolTip += '\n\n' + message;
				
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
						return item["jsName"].split(".js")[0]
					}
				}
				stopTestCases();
			}
			return null; //pause testcases
		}

		public function getTestIndex(index:uint):int{
			if(play_pause_btn.selected == false)
				return -1; //pause tests

			if(index == 0 && testcases_dg.selectedItem != null){
				return testcases_dg.selectedItem["testIndex"]; //get selected test index
			}
			var dp:DataProvider = testcases_dg.dataProvider;
			for(var i:uint = testcases_dg.selectedIndex + 1; i < dp.length; i++){
				testcases_dg.selectedIndex = i;
				var item:Object = testcases_dg.selectedItem;
				if(item["testName"] != null && item["include"] != false){
					testcases_dg.verticalScrollPosition = ((i - 1) * testcases_dg.rowHeight);
					return item["testIndex"];  //returns next available test index
				}
			}
			return index + 1;
		}

		private function externalCall(command:String, ...params):uint{
			_runner.externalCall.apply(_runner, [command].concat(params));
			return 0;
		}
	}
}