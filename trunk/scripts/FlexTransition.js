var FlexTransition = new function(){

	//Public
	this.tests;
	this.currentTestIndex = 0;
	
	this.run = function(){
		initilize(this, "Run Flex Explorer Transitions");

		this.tests = [
			testTransitionInit
		];
		runNextTest(FlexTransition);
	}
	
	//Test Transition BEGIN
	function testTransitionInit(){
		Utils.log("testTransitionInit");
		openNode(nodes, "Transition");
		waitOnLoad(this, testTransition);
	}
	
	function testTransition(app, panel){
		Utils.log("testTransition");
		var FlexEventRef = FD.getRef("flash.events.MouseEvent");
		var event = FD.create(FlexEventRef, ["click"]);
		var form = getChild(panel, "mx.containers::Form");
		var username = getChild(getChild(form, "mx.containers::FormItem", 0), "mx.controls::TextInput");
		var password = getChild(getChild(form, "mx.containers::FormItem", 1), "mx.controls::TextInput");
		username.text("username");
		password.text("password");
		doEvent(app.registerLink(), event);
		var confirm = getChild(getChild(form, "mx.containers::FormItem", 2), "mx.controls::TextInput");
		confirm.text("confirm");
		runNextTest(FlexTransition);
	}
	//Test Transition END
};
