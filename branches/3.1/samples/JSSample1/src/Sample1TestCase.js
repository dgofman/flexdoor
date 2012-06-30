function Sample1TestCase(){
	this.init("SampleApp", "Inspect Views");
	this.include("mx.containers::Panel",
				 "mx.containers::TitleWindow",
				 "mx.controls::DataGrid",
				 "mx.collections::ListCollectionView",
				 "mx.events::ListEvent");
}
Sample1TestCase.prototype = new FlexDoor(Sample1TestCase);

Sample1TestCase.prototype.setUpBeforeClass = function(event){
	this.view = $TitleWindow.Get(this.app.find("sampleView"));
};

Sample1TestCase.prototype.tearDownAfterClass = function(event){
	this.view = null;
};

/**
 * Any setup before executing "every" test in this
 * class should be done in this method.
 */
Sample1TestCase.prototype.setUp = function(event){
	this.dataGrid = this.view.find("dataGrid");
};

/**
 * Any cleanup after executing "every" test in this
 * class should be done in this method.
 */
Sample1TestCase.prototype.tearDown = function(event){
	this.dataGrid = null;
};

Sample1TestCase.prototype.test_1 = function(event) {
	var view = null;
	var extectedType = "mx.containers::TitleWindow";

	//Get instance by extend class type
	view = $TitleWindow.Get(this.app.getChildByType(extectedType));

	Assert.assertTrue(Container.Is(view));
	Assert.assertTrue($Panel.Is(view));
	Assert.assertTrue($TitleWindow.Is(view));
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
	var rowIndex = 0;
	var dataGrid = $DataGrid.Get(this.dataGrid);
	dataGrid.selectedIndex(rowIndex);

	//Pass rowIndex as argument for the next test function 
	return rowIndex;
};

Sample1TestCase.prototype.test_3 = function(event, rowIndex) {
	this.sync(event, 1000, 10000); //Delay next function call and setting timeout
	var dataGrid = $DataGrid.Get(this.dataGrid);
	var columnIndex = 1;
	rowIndex++;
	dataGrid.selectedIndex(rowIndex, function(value){
		//Override Change event to itemClick
		Assert.assertEquals(rowIndex, value);
		dataGrid.fireEvent($ListEvent.Create($ListEvent.ITEM_CLICK, rowIndex, columnIndex));
	});

	var dataProvider = $ListCollectionView.Get(dataGrid.dataProvider());
	Assert.assertEquals(dataProvider.source.length, 5);

	//Pass multiple arguments to the next test function 
	return new ARGS(dataGrid, dataProvider);
};

Sample1TestCase.prototype.test_4 = function(event, dataGrid, dataProvider) {
	var item = dataProvider.getItemAt(0);
	Assert.assertEquals(item, 1);

	dataProvider.addItemAt("NEW ROW", 2);
	var rowIndex = dataProvider.getItemIndex("NEW ROW");
	Assert.assertEquals(rowIndex, 2);
};