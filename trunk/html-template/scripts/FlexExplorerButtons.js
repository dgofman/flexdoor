var FlexExplorerButtons = new function(){

	//Public
	this.tests;
	this.currentTestIndex = 0;
	
	this.run = function(){
		initilize(this, "Run Flex Explorer Buttons");

		this.tests = [
			testButtonInit,
			testButtonBarInit,
			testCheckBoxInit,
			testLinkBarInit,
			testLinkButtonInit,
			testPopUpButtonInit,
			testRadioButtonInit,
			testRadioButtonGroupInit,
			testToggleButtonBarInit
		];
		runNextTest(FlexExplorerButtons);
	}
	
	//Test Button BEGIN
	function testButtonInit(){
		Utils.log("testButtonInit");
		openNode(nodes, "Button");
		waitOnLoad(this, testButton);
	}
	
	function testButton(app, panel){
		Utils.log("testButton");
		var vBox = getChild(panel, "mx.containers::VBox");
		var MouseEventRef = FD.getRef("flash.events.MouseEvent");
		var event = FD.create(MouseEventRef, ["click"]);
		doEvent(getChild(vBox, "mx.controls::Button", 0), event);
		doEvent(getChild(vBox, "mx.controls::Button", 1), event);
		doEvent(getChild(vBox, "mx.controls::Button", 2), event);
		runNextTest(FlexExplorerButtons);
	}
	//Test Button END
	
	//Test ButtonBar BEGIN
	function testButtonBarInit(){
		Utils.log("testButtonBarInit");
		openNode(nodes, "ButtonBar");
		waitOnLoad(this, testButtonBar);
	}
	
	function testButtonBar(app, panel){
		Utils.log("testButtonBar");
		var control = getChild(panel, "mx.controls::ButtonBar");
		doChildIndexEvent(control, 0);
		doChildIndexEvent(control, 1);
		doChildIndexEvent(control, 2);
		doChildIndexEvent(control, 3);
		runNextTest(FlexExplorerButtons);
	}
	//Test ButtonBar END
	
	//Test CheckBox BEGIN
	function testCheckBoxInit(){
		Utils.log("testCheckBoxInit");
		openNode(nodes, "CheckBox");
		waitOnLoad(this, testCheckBox);
	}
	
	function testCheckBox(app, panel){
		Utils.log("testCheckBox");
		var MouseEventRef = FD.getRef("flash.events.MouseEvent");
		var event = FD.create(MouseEventRef, ["click"]);
		var vBox1 = getChild(panel, "mx.containers::VBox", 0);
		var vBox2 = getChild(panel, "mx.containers::VBox", 1);
		var textArea = app.cartItems();
		doEvent(getChild(vBox1, "mx.controls::CheckBox", 0), event);
		Utils.info(textArea.text());
		doEvent(getChild(vBox1, "mx.controls::CheckBox", 1), event);
		Utils.info(textArea.text());
		doEvent(getChild(vBox1, "mx.controls::CheckBox", 2), event);
		Utils.info(textArea.text());
		doEvent(getChild(vBox2, "mx.controls::CheckBox", 0), event);
		closeAlertWindow();
		doEvent(getChild(vBox2, "mx.controls::CheckBox", 0), event);
		closeAlertWindow();
		runNextTest(FlexExplorerButtons);
	}
	//Test CheckBox END
	
	//Test LinkBar BEGIN
	function testLinkBarInit(){
		Utils.log("testLinkBarInit");
		openNode(nodes, "LinkBar");
		waitOnLoad(this, testLinkBar);
	}
	
	function testLinkBar(app, panel){
		Utils.log("testLinkBar");
		var control = getChild(panel, "mx.controls::LinkBar");
		var viewStack = app.myViewStack();
		doChildIndexEvent(control, 2);
		Utils.info(viewStack.selectedChild().getChildAt(0).text()); //Canvas->Label
		doChildIndexEvent(control, 1);
		Utils.info(viewStack.selectedChild().getChildAt(0).text()); //Canvas->Label
		doChildIndexEvent(control, 0);
		Utils.info(viewStack.selectedChild().getChildAt(0).text()); //Canvas->Label
		runNextTest(FlexExplorerButtons);
	}
	//Test LinkBar END
	
	//Test LinkButton BEGIN
	function testLinkButtonInit(){
		Utils.log("testLinkButtonInit");
		openNode(nodes, "LinkButton");
		waitOnLoad(this, testLinkButton);
	}
	
	function testLinkButton(app, panel){
		Utils.log("testLinkButton");
		var control = getChild(panel, "mx.controls::LinkButton");
		var MouseEventRef = FD.getRef("flash.events.MouseEvent");
		var event = FD.create(MouseEventRef, ["click"]);
		doEvent(control, event);
		closeAlertWindow();
		runNextTest(FlexExplorerButtons);
	}
	//Test LinkButton END
	
	//Test PopUpButton BEGIN
	function testPopUpButtonInit(){
		Utils.log("testPopUpButtonInit");
		openNode(nodes, "PopUpButton");
		waitOnLoad(this, testPopUpButton);
	}
	
	function testPopUpButton(app, panel){
		Utils.log("testPopUpButton");
		var control = getChild(panel, "mx.controls::PopUpButton");
		var popUpMenu = control.popUp();
		var textArea = app.popTypeB();
		var dataProvider = popUpMenu.dataProvider();
		control.open();
		Utils.pause(1000);
		doMenuEvent(popUpMenu, 2);
		Utils.info(textArea.text());
		control.open();
		Utils.pause(1000);
		doMenuEvent(popUpMenu, 1);
		Utils.info(textArea.text());
		control.open();
		Utils.pause(1000);
		doMenuEvent(popUpMenu, 0);
		Utils.info(textArea.text());
		runNextTest(FlexExplorerButtons);
	}
	//Test PopUpButton END
	
	//Test RadioButton BEGIN
	function testRadioButtonInit(){
		Utils.log("testRadioButtonInit");
		openNode(nodes, "RadioButton");
		waitOnLoad(this, testRadioButton);
	}
	
	function testRadioButton(app, panel){
		Utils.log("testRadioButton");
		var checkAnswerBtn = getChild(panel, "mx.controls::Button");
		var MouseEventRef = FD.getRef("flash.events.MouseEvent");
		var event = FD.create(MouseEventRef, ["click"]);
		doEvent(getChild(panel, "mx.controls::RadioButton", 0), event, false);
		doEvent(checkAnswerBtn, event);
		closeAlertWindow();
		doEvent(getChild(panel, "mx.controls::RadioButton", 1), event, false);
		doEvent(checkAnswerBtn, event);
		closeAlertWindow();
		doEvent(getChild(panel, "mx.controls::RadioButton", 2), event, false);
		doEvent(checkAnswerBtn, event);
		closeAlertWindow();
		doEvent(getChild(panel, "mx.controls::RadioButton", 3), event, false);
		doEvent(checkAnswerBtn, event);
		closeAlertWindow();
		runNextTest(FlexExplorerButtons);
	}
	//Test RadioButton END
	
	//Test RadioButtonGroup BEGIN
	function testRadioButtonGroupInit(){
		Utils.log("testRadioButtonGroupInit");
		openNode(nodes, "RadioButtonGroup");
		waitOnLoad(this, testRadioButtonGroup);
	}
	
	function testRadioButtonGroup(app, panel){
		Utils.log("testRadioButtonGroup");
		var cardtype = app.cardtype();
		var MouseEventRef = FD.getRef("flash.events.MouseEvent");
		var event = FD.create(MouseEventRef, ["click"]);
		var numRadioButtons = cardtype.numRadioButtons();
		for(var i = 0; i < numRadioButtons; i++){
			doEvent(cardtype.getRadioButtonAt(i), event);
			closeAlertWindow();
		}
		runNextTest(FlexExplorerButtons);
	}
	//Test RadioButtonGroup END
	
	//Test ToggleButtonBar BEGIN
	function testToggleButtonBarInit(){
		Utils.log("testToggleButtonBarInit");
		openNode(nodes, "ToggleButtonBar");
		waitOnLoad(this, testToggleButtonBar);
	}
	
	function testToggleButtonBar(app, panel){
		Utils.log("testToggleButtonBar");
		var control = getChild(panel, "mx.controls::ToggleButtonBar");
		var textArea = app.myTA();
		var numChildren = control.numChildren();
		for(var i = numChildren - 1; i >= 0; i--){
			doChildIndexEvent(control, i);
			Utils.info(textArea.text());
		}
		runNextTest(FlexExplorerButtons);
	}
	//Test ToggleButtonBar END
};
