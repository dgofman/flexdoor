function Sample1TestCase(){
	this.init("SampleApp", "FlexDoor Sample 1");
	this.include("mx.containers::Panel",
				 "mx.containers::TitleWindow",
				 "mx.controls::DataGrid",
				 "mx.collections::ListCollectionView");
}
Sample1TestCase.prototype = new FlexDoor(Sample1TestCase/*, true*/);

Sample1TestCase.prototype.setUpBeforeClass = function(){
	this.view = $TitleWindow.Get(this.app.find("sampleView"));
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
	var extectedType = "mx.containers::TitleWindow";

	//Get instance by extend class type
	view = $TitleWindow.Get(this.app.getChildByType(extectedType));

	Assert.assertTrue(view instanceof Container);
	Assert.assertTrue(view instanceof mx_containers_Panel);
	Assert.assertTrue(view instanceof mx_containers_TitleWindow);
	Assert.assertType(view, extectedType);

	//Get instance by class name type
	view = $TitleWindow.Get(this.app.getChildByType("SampleView"));
	Assert.assertType(view, extectedType);

	//Get first view by name
	view = $TitleWindow.Get(this.app.getChildByName("sampleView0"));
	Assert.assertType(view, extectedType);

	//Get second view by name
	view = $TitleWindow.Get(this.app.getChildByName("sampleView1"));
	Assert.assertType(view, extectedType);

	//Get first view by id (default index is ZERO)
	view = $TitleWindow.Get(this.app.find("sampleView"));
	Assert.assertType(view, extectedType);

	//Get second view by id
	view = $TitleWindow.Get(this.app.find("sampleView", 1));
	Assert.assertType(view, extectedType);
	
	//Casting using parent type
	view = $Panel.Get(this.app.find("sampleView"));
	Assert.assertType(view, extectedType);
	Assert.assertTrue(view.toString() == extectedType);
	Assert.assertTrue(view.toString() != "mx.containers::Panel");
};

Sample1TestCase.prototype.test_2 = function(event) {
	var dataGrid = $DataGrid.Get(this.dataGrid);
	dataGrid.setSelectedIndex(0);
};

Sample1TestCase.prototype.test_3 = function(event) {
	var dataGrid = $DataGrid.Get(this.dataGrid);
	dataGrid.setSelectedItem(2);

	var dataProvider = dataGrid.getDataProvider();
	Assert.assertEquals(dataProvider.source.length, 5);

	//Pass local dataGrid object to the next test function 
	//Increase a delay before calling a new function
	return new FunctionEvent({dataProvider:dataProvider}, 500);
};

Sample1TestCase.prototype.test_4 = function(event) {
	var dataProvider = $ListCollectionView.Get(event.getItem('dataProvider'));
	var item = dataProvider.getItemAt(0);
	Assert.assertEquals(item, 1);

	dataProvider.addItemAt("NEW ROW", 2);
	var rowIndex = dataProvider.getItemIndex("NEW ROW");
	Assert.assertEquals(rowIndex, 2);
};