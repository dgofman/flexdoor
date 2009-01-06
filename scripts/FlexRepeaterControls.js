var FlexRepeaterControls = new function(){

	//Public
	this.tests;
	this.currentTestIndex = 0;
	
	this.run = function(){
		initilize(this, "Run Flex Explorer Repeater Controls");

		this.tests = [
			testRepeaterInit
		];
		runNextTest(FlexRepeaterControls);
	}
	
	//Test Repeater BEGIN
	function testRepeaterInit(){
		Utils.log("testRepeaterInit");
		openNode(nodes, "Repeater");
		waitOnLoad(this, testRepeater);
	}
	
	function testRepeater(app, panel){
		Utils.log("testRepeater");
		var repeater = app.rp();
		var dataProvider = repeater.dataProvider();
		dataProvider.removeItemAt(0);
		repeater.dataProvider(dataProvider);
		Utils.pause(500);
		repeater.dataProvider([9,8,7,6,5,4,3,2,1]);
		Utils.pause(500);
		runNextTest(FlexRepeaterControls);
	}
	//Test Repeater END
};
