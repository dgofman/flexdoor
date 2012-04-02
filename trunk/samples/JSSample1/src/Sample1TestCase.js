function Sample1TestCase(){
	this.init("SampleApp", "FlexDoor Sample 1");
	this.include("containers::Panel",
				 "controls::DataGrid");
}
Sample1TestCase.prototype = new FlexDoor(Sample1TestCase/*, true*/);

Sample1TestCase.prototype.setUpBeforeClass = function(){
	this.view = Panel.Get(this.app.find("sampleView"));
};

Sample1TestCase.prototype.tearDownAfterClass = function(){
	this.view = null;
};

/**
 * Any setup before executing "every" test in this
 * class should be done in this method.
 */
Sample1TestCase.prototype.setUp = function(){
	this.dataGrid = this.view.find("dataGrid");
};

/**
 * Any cleanup after executing "every" test in this
 * class should be done in this method.
 */
Sample1TestCase.prototype.tearDown = function(){
	this.dataGrid = null;
};

Sample1TestCase.prototype.test_1 = function(event) {
	var view = null;
	var extectedType = "mx.containers::Panel";

	//Get instance by extend class type
	view = Panel.Get(this.app.getChildByType("mx.containers::TitleWindow"));

	Assert.assertTrue(view instanceof Container);
	Assert.assertTrue(view instanceof Panel);
	Assert.assertType(view, extectedType);

	//Get instance by class name type
	view = Panel.Get(this.app.getChildByType("SampleView"));
	Assert.assertType(view, extectedType);

	//Get first view by name
	view = Panel.Get(this.app.getChildByName("sampleView0"));
	Assert.assertType(view, extectedType);

	//Get second view by name
	view = Panel.Get(this.app.getChildByName("sampleView1"));
	Assert.assertType(view, extectedType);

	//Get first view by id (default index is ZERO)
	view = Panel.Get(this.app.find("sampleView"));
	Assert.assertType(view, extectedType);

	//Get second view by id
	view = Panel.Get(this.app.find("sampleView", 1));
	Assert.assertType(view, extectedType);
};

Sample1TestCase.prototype.test_2 = function(event) {
	var dataGrid = DataGrid.Get(this.dataGrid);
	dataGrid.setSelectedIndex(0);
};

Sample1TestCase.prototype.test_3 = function(event) {
	var dataGrid = DataGrid.Get(this.dataGrid);
	dataGrid.setSelectedIndex(1);

	//Pass local dropDownList object to the next test function 
	//Set delay before selecting an item
	//return new FunctionEvent({delay:500, dropDownList:dropDownList});
};
/*
Sample1TestCase.prototype.test_4 = function(event) {
	event.dropDownList.selectedItem("Work");

	var addButton = Button.Get(view.find("Add"));
	addButton.click();
};*/
