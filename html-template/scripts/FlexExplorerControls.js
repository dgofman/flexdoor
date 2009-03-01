var FlexExplorerControls = new function(){

	//Public
	this.tests;
	this.currentTestIndex = 0;
	
	this.run = function(){
		initilize(this, "Run Flex Explorer Controls");

		this.tests = [
			testAlertInit,
			testColorPickerInit,
			testComboBoxInit,
			testDataGridInit,
			testHorizontalListInit,
			testHRuleInit,
			testHScrollBarInit,
			testHSliderInit,
			testListInit,
			testNumericStepperInit,
			testProgressBarInit,
			testSpacerInit,
			testTabBarInit,
			testTileListInit,
			testTreeInit,
			testVRuleInit,
			testVScrollBarInit,
			testVSliderInit
		];
		runNextTest(FlexExplorerControls);
	}

	//Test Alert Dialogs BEGIN
	function testAlertInit(){
		Utils.log("testAlertInit");
		openNode(nodes, "Alert");
		waitOnLoad(this, testAlert);
	}
	
	function testAlert(app, panel){
		Utils.log("testAlert");
		var MouseEventRef = FD.getRef("flash.events.MouseEvent");
		var event = FD.create(MouseEventRef, ["click"]);
		doEvent(getChild(panel, "mx.controls::Button", 0), event);
		closeAlertWindow();
		doEvent(getChild(panel, "mx.controls::Button", 1), event);
		closeAlertWindow();
		doEvent(getChild(panel, "mx.controls::Button", 2), event);
		closeAlertWindow();
		runNextTest(FlexExplorerControls);
	}
	//Test Alert Dialogs END
	
	//Test ColorPicker BEGIN
	function testColorPickerInit(){
		Utils.log("testColorPickerInit");
		openNode(nodes, "ColorPicker");
		waitOnLoad(this, testColorPicker);
	}
	
	function testColorPicker(app, panel){
		Utils.log("testColorPicker");
		var FlexEventRef = FD.getRef("mx.events.FlexEvent");
		var event = FD.create(FlexEventRef, ["buttonDown"]);
		var control = getChild(panel, "mx.controls::ColorPicker");
		var colors = [0xFF0000, 0x00FF00, 0x0000FF]; //Red, Green, Blue
		var downArrowButton = FD.getRef(control, 'downArrowButton');
		downArrowButton.dispatchEvent(event);
		for(var c = 0; c < colors.length; c++){
			control.selectedColor(colors[c]);
			Utils.pause(PAUSE_INTERVAL);
		}
		control.close();
		runNextTest(FlexExplorerControls, 2000);
	}
	//Test ColorPicker END
	
	//Test ComboBox BEGIN
	function testComboBoxInit(){
		Utils.log("testComboBoxInit");
		openNode(nodes, "ComboBox");
		waitOnLoad(this, testComboBox);
	}
	
	function testComboBox(app, panel){
		Utils.log("testComboBox");
		var FlexEventRef = FD.getRef("mx.events.FlexEvent");
		var event = FD.create(FlexEventRef, ["buttonDown"]);
		var control = getChild(panel, "mx.controls::ComboBox");
		var textInput = FD.getRef(control, 'getTextInput');
		var dp = control.dataProvider();
		var rows = dp.length();
		var downArrowButton = FD.getRef(control, 'downArrowButton');
		control.selectedIndex(-1);
		for(var r = 0; r < rows; r++){
			doEvent(downArrowButton, event);
			control.dropdown().selectedIndex(r);
			control.close();
			Utils.info("ComboBox text=" + textInput.text());
			Utils.pause(500);
		}
		var item = dp.getItemAt(1);
		doEvent(downArrowButton, event);
		control.dropdown().selectedItem(item);
		control.close();
		Utils.pause(500);
		runNextTest(FlexExplorerControls);
	}
	//Test ComboBox END
	
	//Test DataGrid BEGIN
	function testDataGridInit(){
		Utils.log("testDataGridInit");
		openNode(nodes, "DataGrid");
		waitOnLoad(this, testDataGrid);
	}
	
	function testDataGrid(app, panel){
		Utils.log("testDataGrid");
		var control = getChild(panel, "mx.controls::DataGrid");
		var dp = control.dataProvider();
		var rows = dp.length();
		var rowCount = (parseInt(flexVersion) < 3 ? control.rowCount() - 1 : control.rowCount());
		for(var r = 0; r < rows; r++){
			control.selectedIndex(r);
			if(r > (control.verticalScrollPosition() + rowCount - 1)){
				control.verticalScrollPosition(r - rowCount + 1);
			}
			var columns = control.columns();
			for(var c = 0; c < columns.length; c++){
				var dataGridColumn = columns[c];
				var item = control.selectedItem();
				var dataField = FD.getRef(dataGridColumn, "dataField");
				var rootNode  = FD.stringToXML(item.value);
				var value = Utils.getElementsByTagName(rootNode, dataField);
				Utils.info("Row=" + r + ", " + dataField + "=" + value.firstChild.nodeValue);
			}
			Utils.pause(PAUSE_INTERVAL);
		}
		runNextTest(FlexExplorerControls);
	}
	//Test DataGrid END
	
	//Test HorizontalList BEGIN
	function testHorizontalListInit(){
		Utils.log("testHorizontalListInit");
		openNode(nodes, "HorizontalList");
		waitOnLoad(this, testHorizontalList);
	}
	
	function testHorizontalList(app, panel){
		Utils.log("testHorizontalList");
		var control = getChild(panel, "mx.controls::HorizontalList");
		for(var h = 1; h < control.maxHorizontalScrollPosition(); h++){
			control.horizontalScrollPosition(h);
		}
		Utils.pause(PAUSE_INTERVAL);
		runNextTest(FlexExplorerControls);
	}
	//Test HorizontalList END
	
	//Test HRule BEGIN
	function testHRuleInit(){
		Utils.log("testHRuleInit");
		openNode(nodes, "HRule");
		waitOnLoad(this, testHRule);
	}
	
	function testHRule(app, panel){
		Utils.log("testHRule");
		var control = getChild(panel, "mx.controls::HRule");
		var repeatCount = 5;
		var MouseEventRef = FD.getRef("flash.events.MouseEvent");
		var event = FD.create(MouseEventRef, ["rollOver", true, false, control.x(), control.y()]);
		var interval = setInterval(function(){
			control.dispatchEvent(event);
			if(--repeatCount < 0){
				clearInterval(interval);
				runNextTest(FlexExplorerControls);
			}
		}, 1000);
	}
	//Test HRule END
	
	//Test HScrollBar BEGIN
	function testHScrollBarInit(){
		Utils.log("testHScrollBarInit");
		openNode(nodes, "HScrollBar");
		waitOnLoad(this, testHScrollBar);
	}
	
	function testHScrollBar(app, panel){
		Utils.log("testHScrollBar");
		var ScrollEventRef = FD.getRef("mx.events.ScrollEvent");
		var event = FD.create(ScrollEventRef, ["scroll"]);
		var control = getChild(panel, "mx.controls::HScrollBar");
		var positions = [100, 300, 500, 700];
		for(var h = 0; h < positions.length; h++){
			control.scrollPosition(positions[h]);
			doEvent(control, event);
		}
		runNextTest(FlexExplorerControls);
	}
	//Test HScrollBar END
	
	//Test HSlider BEGIN
	function testHSliderInit(){
		Utils.log("testHSliderInit");
		openNode(nodes, "HSlider");
		waitOnLoad(this, testHSlider);
	}
	
	function testHSlider(app, panel){
		Utils.log("testHSlider");
		var control = getChild(panel, "mx.controls::HSlider");
		var positions = [80, 60, 40, 20];
		for(var h = 0; h < positions.length; h++){
			control.setThumbValueAt(0, positions[h]);
			Utils.pause(PAUSE_INTERVAL);
		}
		runNextTest(FlexExplorerControls);
	}
	//Test HSlider END
	
	//Test List BEGIN
	function testListInit(){
		Utils.log("testListInit");
		openNode(nodes, "List");
		waitOnLoad(this, testList);
	}
	
	function testList(app, panel){
		Utils.log("testList");
		var ListEventRef = FD.getRef("mx.events.ListEvent");
		var event = FD.create(ListEventRef, ["change"]);
		var control = getChild(panel, "mx.controls::List");
		var rows = control.dataProvider().length();
		var rowCount = control.rowCount() - 1;
		for(var r = 0; r < rows; r++){
			control.selectedIndex(r);
			Utils.info("Row=" + r + ", value=" + control.value());
			doEvent(control, event);
		}
		runNextTest(FlexExplorerControls);
	}
	//Test List END
	
	//Test NumericStepper BEGIN
	function testNumericStepperInit(){
		Utils.log("testNumericStepperInit");
		openNode(nodes, "NumericStepper");
		waitOnLoad(this, testNumericStepper);
	}
	
	function testNumericStepper(app, panel){
		Utils.log("testNumericStepper");
		var FlexEventRef = FD.getRef("mx.events.FlexEvent");
		var event = FD.create(FlexEventRef, ["buttonDown"]);
		var stepper1 = getChild(panel, "mx.controls::NumericStepper", 0);
		var inputField = FD.getRef(stepper1, 'inputField');
		for(var n = 2; n < 10; n += 2){
			stepper1.value(n);
			Utils.info("inputField=" + inputField.text());
			Utils.pause(PAUSE_INTERVAL);
		}
		var stepper2 = getChild(panel, "mx.controls::NumericStepper", 1);
		var nextButton = FD.getRef(stepper2, 'nextButton');
		var prevButton = FD.getRef(stepper2, 'prevButton');
		var inputField = FD.getRef(stepper2, 'inputField');
		for(var n = 0; n < 5; n++){
			doEvent(nextButton, event);
			Utils.info("inputField=" + inputField.text());
		}
		doEvent(prevButton, event);
		Utils.info("inputField=" + inputField.text());
		runNextTest(FlexExplorerControls);
	}
	//Test NumericStepper END
	
	//Test ProgressBar BEGIN
	function testProgressBarInit(){
		Utils.log("testProgressBarInit");
		openNode(nodes, "ProgressBar");
		waitOnLoad(this, testProgressBar);
	}
	
	function testProgressBar(app, panel){
		Utils.log("testProgressBar");
		var control = getChild(panel, "mx.controls::ProgressBar");
		control.setProgress(80, 100);
		Utils.info("Value=" + control.value());
		Utils.pause(PAUSE_INTERVAL);
		runNextTest(FlexExplorerControls);
	}
	//Test ProgressBar END
	
	//Test Spacer BEGIN
	function testSpacerInit(){
		Utils.log("testSpacerInit");
		openNode(nodes, "Spacer");
		waitOnLoad(this, testSpacer);
	}
	
	function testSpacer(app, panel){
		Utils.log("testSpacer");
		var hBox = getChild(panel, "mx.containers::HBox");
		var control = getChild(hBox, "mx.controls::Spacer");
		control.width(20);
		Utils.pause(PAUSE_INTERVAL);
		runNextTest(FlexExplorerControls);
	}
	//Test Spacer END
	
	//Test TabBar BEGIN
	function testTabBarInit(){
		Utils.log("testTabBarInit");
		openNode(nodes, "TabBar");
		waitOnLoad(this, testTabBar);
	}
	
	function testTabBar(app, panel){
		Utils.log("testTabBar");
		var control = getChild(panel, "mx.controls::TabBar");
		var textArea = app.forClick();
		doChildIndexEvent(control, 2);
		Utils.info(textArea.text());
		doChildIndexEvent(control, 1);
		Utils.info(textArea.text());
		doChildIndexEvent(control, 0);
		Utils.info(textArea.text());
		runNextTest(FlexExplorerControls);
	}
	//Test TabBar END
	
	//Test TileList BEGIN
	function testTileListInit(){
		Utils.log("testTileListInit");
		openNode(nodes, "TileList");
		waitOnLoad(this, testTileList);
	}
	
	function testTileList(app, panel){
		Utils.log("testTileList");
		var control = getChild(panel, "mx.controls::TileList");
		for(var v = 1; v <= control.maxVerticalScrollPosition(); v++){
			control.verticalScrollPosition(v);
			Utils.pause(PAUSE_INTERVAL);
		}
		runNextTest(FlexExplorerControls);
	}
	//Test TileList END
	
	//Test Tree BEGIN
	function testTreeInit(){
		Utils.log("testTreeInit");
		openNode(nodes, "Tree");
		waitOnLoad(this, testTree);
	}
	
	function testTree(app, panel){
		Utils.log("testTree");
		var ListEventRef = FlexDoor.getRef("mx.events.ListEvent");
		var event = FlexDoor.create(ListEventRef, ["change"]);
		var divBox  = getChild(panel,  "mx.containers::HDividedBox");
		var control = getChild(divBox, "mx.controls::Tree");
		var treeData = control.dataProvider().getItemAt(0);
		var nodeMailBox = treeData.firstChild();
		var items = nodeMailBox.childNodes();
		var item = FD.getXmlRef(treeData, items[1]);
		control.expandItem(item, true);
		//Get HTMLDocument and Select by node
		var doc = FD.stringToXML(item.value);
		var children = doc.getElementsByTagName("node");
		var child1 = getNodeByAttribute(children, "Personal", "label");
		control.selectedItem(child1); //<node label="Personal"/>
		doEvent(control, event);
		//Get flash.xml.XMLNode and Select by node
		var child2 = item.firstChild().childNodes()[0]; //<node label="Professional"/>
		var doc = FD.stringToXML(child2.value);
		control.selectedItem(doc);
		doEvent(control, event);
		//Expend All Nodes
		control.expandChildrenOf(treeData, true);
		//Select by index
		control.selectedIndex(1); //<node label="Marketing"/>
		doEvent(control, event);
		//Select by path
		selectTreeNodeByPath(control, "Mail Box/Inbox/Product Management");
		doEvent(control, event);
		runNextTest(FlexExplorerControls);
	}
	
	function selectTreeNodeByPath(control, path, attributeName, delimiter){
		var dataDescriptor = control.dataDescriptor();
		var dataProvider = control.dataProvider();
		var root = dataProvider.getItemAt(0);
		var item = root;
		if(attributeName == undefined)
			attributeName = "label";
		if(delimiter == undefined)
			delimiter = "/";
		if(item && item.__TYPE__ == "flash.xml::XMLDocument")
			item = FD.stringToXML(item.value);
		else if(typeof(item) == "string")
			item = FD.stringToXML(item);
		if(!item){
			Utils.warn("selectTreeNodeByPath -> Item is null");
		}else{
			var labels = path.split(delimiter);
			for(var i = 0; i < labels.length; i++){
				var label = labels[i];
				item = getNodeByAttribute(item, label, attributeName);
				if(item){
					if(dataDescriptor.isBranch(item)){
						var itemRef = FlexDoor.getXmlRef(root, item);
						control.expandItem(itemRef, true);
						FlexDoor.release(itemRef);
						item = item.childNodes;
					}
				}else{
					Utils.warn("selectTreeNodeByPath -> Item:'" + item + "' not found in the path: " + path);
					break;
				}
			}
			if(item)
				control.selectedItem(item);
		}
		FlexDoor.release(root);
		FlexDoor.release(dataProvider);
		FlexDoor.release(dataDescriptor);
	}
	
	//Test Tree END
	
	//Test VRule BEGIN
	function testVRuleInit(){
		Utils.log("testVRuleInit");
		openNode(nodes, "VRule");
		waitOnLoad(this, testVRule);
	}
	
	function testVRule(app, panel){
		Utils.log("testVRule");
		var control = getChild(panel, "mx.controls::VRule");
		var repeatCount = 5;
		var MouseEventRef = FD.getRef("flash.events.MouseEvent");
		var event = FD.create(MouseEventRef, ["rollOver", true, false, control.x(), control.y()]);
		var interval = setInterval(function(){
			control.dispatchEvent(event);
			if(--repeatCount < 0){
				clearInterval(interval);
				runNextTest(FlexExplorerControls);
			}
		}, 1000);
	}
	//Test VRule END
	
	//Test VScrollBar BEGIN
	function testVScrollBarInit(){
		Utils.log("testVScrollBarInit");
		openNode(nodes, "VScrollBar");
		waitOnLoad(this, testVScrollBar);
	}
	
	function testVScrollBar(app, panel){
		Utils.log("testVScrollBar");
		var ScrollEventRef = FD.getRef("mx.events.ScrollEvent");
		var event = FD.create(ScrollEventRef, ["scroll"]);
		var control = getChild(panel, "mx.controls::VScrollBar");
		var positions = [200, 400, 600];
		for(var v = 0; v < positions.length; v++){
			control.scrollPosition(positions[v]);
			doEvent(control, event);
		}
		runNextTest(FlexExplorerControls);
	}
	//Test VScrollBar END
	
	//Test VSlider BEGIN
	function testVSliderInit(){
		Utils.log("testVSliderInit");
		openNode(nodes, "VSlider");
		waitOnLoad(this, testVSlider);
	}
	
	function testVSlider(app, panel){
		Utils.log("testVSlider");
		var vBox = getChild(panel, "mx.containers::VBox");
		var control = getChild(vBox, "mx.controls::VSlider");
		var positions = [80, 60, 40, 20];
		for(var v = 0; v < positions.length; v++){
			control.setThumbValueAt(0, positions[v]);
			Utils.pause(PAUSE_INTERVAL);
		}
		runNextTest(FlexExplorerControls);
	}
	//Test VSlider END
};
