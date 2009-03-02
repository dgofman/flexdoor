var FlexContainers = new function(){

	//Public
	this.tests;
	this.currentTestIndex = 0;
	
	this.run = function(){
		initilize(this, "Run Flex Explorer Containers");
		
		this.tests = [
			testApplicationInit,
			testAccordionInit,
			testApplicationControlBarInit,
			testBoxInit,
			testCanvasInit,
			testControlBarInit,
			testDividedBoxInit,
			testFormInit,
			testGridInit,
			testHBoxInit,
			testHDividedBoxInit,
			testPanelInit,
			testTabNavigatorInit,
			testTileInit,
			testTitleWindowInit,
			testVBoxInit,
			testVDividedBoxInit,
			testViewStackInit
		];
		runNextTest(FlexContainers);
	}
	
	//Test Application BEGIN
	function testApplicationInit(){
		Utils.log("testApplicationInit");
		openNode(nodes, "Application");
		waitOnLoad(this, testApplication);
	}
	
	function testApplication(app, panel){
		Utils.log("testApplication");
		var controlBar = app.controlBar();
		var MouseEventRef = FD.getRef("flash.events.MouseEvent");
		var event = FD.create(MouseEventRef, ["click"]);
		doEvent(getChild(controlBar, "mx.controls::Button", 0), event);
		Utils.info(app.getStyle("backgroundGradientColors"));
		doEvent(getChild(controlBar, "mx.controls::Button", 1), event);
		Utils.info(app.getStyle("backgroundGradientColors"));
		runNextTest(FlexContainers);
	}
	//Test Application END
	
	//Test Accordion BEGIN
	function testAccordionInit(){
		Utils.log("testAccordionInit");
		openNode(nodes, "Accordion");
		waitOnLoad(this, testAccordion);
	}
	
	function testAccordion(app, panel){
		Utils.log("testAccordion");
		var control = app.accordion();
		var hBox = getChild(panel, "mx.containers::HBox");
		var MouseEventRef = FD.getRef("flash.events.MouseEvent");
		var event = FD.create(MouseEventRef, ["click"]);
		var numChildren = control.numChildren();
		for(var i = numChildren - 1; i >= 0; i--){
			doEvent(getChild(hBox, "mx.controls::Button", i), event);
			var child = control.selectedChild();
			Utils.info("Title: " + child.label());
			Utils.info("Label: " + getChild(child, "mx.controls::Label").text());
		}
		var headerButton = control.getHeaderAt(1);
		doEvent(headerButton, event);
		runNextTest(FlexContainers);
	}
	//Test Accordion END
	
	//Test ApplicationControlBar BEGIN
	function testApplicationControlBarInit(){
		Utils.log("testApplicationControlBarInit");
		openNode(nodes, "ApplicationControlBar");
		waitOnLoad(this, testApplicationControlBar);
	}
	
	function testApplicationControlBar(app, panel){
		Utils.log("testApplicationControlBar");
		var MouseEventRef = FD.getRef("flash.events.MouseEvent");
		var KeyboardEventRef = FD.getRef("flash.events.KeyboardEvent");
		var event1 = FD.create(MouseEventRef, ["mouseDown"]);
		var event2 = FD.create(MouseEventRef, ["mouseOver"]);
		var event3 = FD.create(KeyboardEventRef, ["keyDown", true, false, 0, 13]); //13 - Keyboard.ENTER
		var event4 = FD.create(MouseEventRef, ["click"]);
		var controlBar1 = app.controlBar();
		var menuBar = getChild(controlBar1, "mx.controls::MenuBar");
    	var menuBarItems = menuBar.menuBarItems();
		for(var i = 0; i < menuBarItems.length; i++){
    		var item = FD.getRef(menuBarItems, i);
    		var data = item.data();
    		if(data.value && data.value.length > 0)
    			Utils.info(data.value);
    		if(data && data.hasChildNodes()){
    			item.dispatchEvent(event2); //Activate menu
    			doEvent(item, event1); //Create and show popup menu
    			var menu = menuBar.getMenuAt(i);
    			if(menu && menu.indexToItemRenderer(0) != null){
    				menu.selectedIndex(0);
    				menu.dispatchEvent(event3);
    			}
    		}
		}
		var controlBar2 = getChild(app, "mx.containers::ApplicationControlBar");
		var textInput = getChild(controlBar2, "mx.controls::TextInput");
		textInput.text("Search");
		doEvent(getChild(controlBar2, "mx.controls::Button"), event4);
		runNextTest(FlexContainers);
	}
	//Test ApplicationControlBar END
	
	//Test Box BEGIN
	function testBoxInit(){
		Utils.log("testBoxInit");
		openNode(nodes, "Box");
		waitOnLoad(this, testBox);
	}
	
	function testBox(app, panel){
		Utils.log("testBox");
		var box1 = getChild(panel, "mx.containers::Box", 0);
		var box2 = getChild(panel, "mx.containers::Box", 1);
		box1.direction("horizontal");
		box2.direction("vertical");
		Utils.pause(500);
		runNextTest(FlexContainers);
	}
	//Test Box END
	
	//Test Canvas BEGIN
	function testCanvasInit(){
		Utils.log("testCanvasInit");
		openNode(nodes, "Canvas");
		waitOnLoad(this, testCanvas);
	}
	
	function testCanvas(app, panel){
		Utils.log("testCanvas");
		var canvas = getChild(panel, "mx.containers::Canvas");
		var numChildren = canvas.numChildren();
		var width = canvas.width();
		var height = canvas.height();
		for(var i = 0; i < numChildren; i++){
			var child = canvas.getChildAt(i);
			if(child.__TYPE__ == "mx.containers::VBox"){
				child.setStyle("right", Math.floor(Math.random() * (width - 75)));
				child.setStyle("bottom", Math.floor(Math.random() * (height - 75)));
			}else{
				child.x(Math.floor(Math.random() * (width - 100)));
				child.y(Math.floor(Math.random() * (height - 25)));
			}
		}
		Utils.pause(500);
		runNextTest(FlexContainers);
	}
	//Test Canvas END
	
	//Test ControlBar BEGIN
	function testControlBarInit(){
		Utils.log("testControlBarInit");
		openNode(nodes, "ControlBar");
		waitOnLoad(this, testControlBar);
	}
	
	function testControlBar(app, panel){
		Utils.log("testControlBar");
		var controlBar = getChild(panel.rawChildren(), "mx.containers::ControlBar");
		controlBar.direction("vertical");
		panel.setStyle("cornerRadius", 20);
		Utils.pause(500);
		runNextTest(FlexContainers);
	}
	//Test ControlBar END
	
	//Test DividedBox BEGIN
	function testDividedBoxInit(){
		Utils.log("testDividedBoxInit");
		openNode(nodes, "DividedBox");
		waitOnLoad(this, testDividedBox);
	}
	
	function testDividedBox(app, panel){
		Utils.log("testDividedBox");
		var dividedBox = getChild(panel, "mx.containers::DividedBox");
		var panel = getChild(dividedBox, "mx.containers::Panel");
		panel.percentWidth(75);
		Utils.pause(500);
		dividedBox.direction("vertical");
		panel.height(80);
		Utils.pause(500);
		runNextTest(FlexContainers);
	}
	//Test DividedBox END
	
	//Test Form BEGIN
	function testFormInit(){
		Utils.log("testFormInit");
		openNode(nodes, "Form, FormHeading, FormItem");
		waitOnLoad(this, testForm);
	}
	
	function testForm(app, panel){
		Utils.log("testForm");
		var form = getChild(panel, "mx.containers::Form");
		var numChildren = form.numChildren();
		for(var i = 0; i < numChildren; i++){
			var child = form.getChildAt(i);
			if(child.__TYPE__ == "mx.containers::FormItem"){
				var textInput = getChild(child, "mx.controls::TextInput");
				textInput.text(child.label());
				var error = textInput.errorString();
				if(error != "")
					Utils.warn(error);
			}
		}
		Utils.pause(500);
		runNextTest(FlexContainers);
	}
	//Test Form END
	
	//Test Grid BEGIN
	function testGridInit(){
		Utils.log("testGridInit");
		openNode(nodes, "Grid, GridItem, GridRow");
		waitOnLoad(this, testGrid);
	}
	
	function testGrid(app, panel){
		Utils.log("testGrid");
		var grid = getChild(panel, "mx.containers::Grid");
		for(var r = 0; r < 3; r++){
			var row = getChild(grid, "mx.containers::GridRow", r);
			for(var c = 0; c < 3; c++){
				var item = getChild(row, "mx.containers::GridItem", c);
				if(r == c) item.colSpan(2);
			}
		}
		grid.invalidateSize();
		Utils.pause(500);
		for(var r = 0; r < 2; r++){
			var row = getChild(grid, "mx.containers::GridRow", r);
			for(var c = 0; c < 3; c++){
				var item = getChild(row, "mx.containers::GridItem", c);
				if(r == c) item.rowSpan(3 - c);
			}
		}
		grid.invalidateSize();
		Utils.pause(500);
		runNextTest(FlexContainers);
	}
	//Test Grid END
	
	//Test HBox BEGIN
	function testHBoxInit(){
		Utils.log("testHBoxInit");
		openNode(nodes, "HBox");
		waitOnLoad(this, testHBox);
	}
	
	function testHBox(app, panel){
		Utils.log("testHBox");
		var hBox = getChild(panel, "mx.containers::HBox");
		hBox.percentWidth(100);
		hBox.setStyle("horizontalAlign", "center");
		Utils.pause(500);
		runNextTest(FlexContainers);
	}
	//Test HBox END
	
	//Test HDividedBox BEGIN
	function testHDividedBoxInit(){
		Utils.log("testHDividedBoxInit");
		openNode(nodes, "HDividedBox");
		waitOnLoad(this, testHDividedBox);
	}
	
	function testHDividedBox(app, panel){
		Utils.log("testHDividedBox");
		var divided = getChild(panel, "mx.containers::HDividedBox");
		var canvas = getChild(divided, "mx.containers::Canvas");
		canvas.percentWidth(25);
		Utils.info("canvas width: " + canvas.width());
		Utils.pause(500);
		runNextTest(FlexContainers);
	}
	//Test HDividedBox END
	
	//Test Panel BEGIN
	function testPanelInit(){
		Utils.log("testPanelInit");
		openNode(nodes, "Panel");
		waitOnLoad(this, testPanel);
	}
	
	function testPanel(app, panel){
		Utils.log("testPanel");
		panel.setStyle("cornerRadius", 20);
		
		var MouseEventRef = FD.getRef("flash.events.MouseEvent");
		var event = FD.create(MouseEventRef, ["click"]);
		doEvent(getChild(panel, "mx.controls::Button"), event);
		runNextTest(FlexContainers);
	}
	//Test Panel END
	
	//Test TabNavigator BEGIN
	function testTabNavigatorInit(){
		Utils.log("testTabNavigatorInit");
		openNode(nodes, "TabNavigator");
		waitOnLoad(this, testTabNavigator);
	}
	
	function testTabNavigator(app, panel){
		Utils.log("testTabNavigator");
		var MouseEventRef = FD.getRef("flash.events.MouseEvent");
		var event = FD.create(MouseEventRef, ["click"]);
		var tn = app.tn();
		var hBox = getChild(panel, "mx.containers::HBox");
		var numChildren = hBox.numChildren();
		for(var i = numChildren - 1; i >= 0; i--){
			var child = hBox.getChildAt(i);
			doEvent(child, event);
		}
		tn.getChildAt(2).enabled(false);
		tn.removeChildAt(1);
		Utils.pause(500);
		runNextTest(FlexContainers);
	}
	//Test TabNavigator END
	
	//Test Tile BEGIN
	function testTileInit(){
		Utils.log("testTileInit");
		openNode(nodes, "Tile");
		waitOnLoad(this, testTile);
	}
	
	function testTile(app, panel){
		Utils.log("testTile");
		var tile = getChild(panel, "mx.containers::Tile");
		var numChildren = tile.numChildren();
		for(var i = 0; i < numChildren; i++){
			var button = tile.getChildAt(i);
			button.width(40);
		}
		Utils.pause(500);
		tile.direction("vertical");
		Utils.pause(500);
		runNextTest(FlexContainers);
	}
	//Test Tile END
	
	//Test TitleWindow BEGIN
	function testTitleWindowInit(){
		Utils.log("testTitleWindowInit");
		openNode(nodes, "TitleWindow");
		waitOnLoad(this, testTitleWindow);
	}
	
	function testTitleWindow(app, panel){
		Utils.log("testTitleWindow");
		var button = app.myButton();
		var MouseEventRef = FD.getRef("flash.events.MouseEvent");
		var event = FD.create(MouseEventRef, ["click"]);
		doEvent(button, event);
		var sysManager = flexApp.systemManager();
		var login = getChild(sysManager, "SimpleTitleWindowExample");
		var hBox = getChild(login, "mx.containers::HBox", 1);
		login.userName().text("User Name");
		doEvent(getChild(hBox, "mx.controls::Button"), event);
		Utils.info(app.returnedName().text());
		runNextTest(FlexContainers);
	}
	//Test TitleWindow END
	
	//Test VBox BEGIN
	function testVBoxInit(){
		Utils.log("testVBoxInit");
		openNode(nodes, "VBox");
		waitOnLoad(this, testVBox);
	}
	
	function testVBox(app, panel){
		Utils.log("testVBox");
		var vBox = getChild(panel, "mx.containers::VBox");
		vBox.percentHeight(100);
		vBox.setStyle("verticalAlign", "middle");
		Utils.pause(500);
		runNextTest(FlexContainers);
	}
	//Test VBox END
	
	//Test VDividedBox BEGIN
	function testVDividedBoxInit(){
		Utils.log("testVDividedBoxInit");
		openNode(nodes, "VDividedBox");
		waitOnLoad(this, testVDividedBox);
	}
	
	function testVDividedBox(app, panel){
		Utils.log("testVDividedBox");
		var divided = getChild(panel, "mx.containers::VDividedBox");
		var canvas = getChild(divided, "mx.containers::Canvas");
		canvas.percentHeight(25);
		Utils.info("canvas height: " + canvas.height());
		Utils.pause(500);
		runNextTest(FlexContainers);
	}
	//Test VDividedBox END
	
	//Test ViewStack BEGIN
	function testViewStackInit(){
		Utils.log("testViewStackInit");
		openNode(nodes, "ViewStack");
		waitOnLoad(this, testViewStack);
	}
	
	function testViewStack(app, panel){
		Utils.log("testViewStack");
		var MouseEventRef = FD.getRef("flash.events.MouseEvent");
		var event = FD.create(MouseEventRef, ["click"]);
		var vs = app.myViewStack();
		var hBox = getChild(panel, "mx.containers::HBox");
		var numChildren = hBox.numChildren();
		for(var i = numChildren - 1; i >= 0; i--){
			var child = hBox.getChildAt(i);
			doEvent(child, event);
			Utils.info(vs.selectedChild().label());
		}
		vs.selectedIndex(1);
		Utils.info(vs.selectedChild().label());
		Utils.pause(500);
		runNextTest(FlexContainers);
	}
	//Test ViewStack END
};
