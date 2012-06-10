function Sample5TestCase(){
	this.init("SampleApp", "Using Locator and ItemRenderer");
	this.include("mx.controls::DataGrid", "mx.controls.dataGridClasses::DataGridItemRenderer");
}
Sample5TestCase.prototype = new FlexDoor(Sample5TestCase);

Sample5TestCase.prototype.test_1 = function(event) {
	var locator1 = Locator.Get("/sampleView,0", "/dataGrid", "/:2,1"); //Path concatenation locator
	var itemRenderer1 = $DataGridItemRenderer.Get(locator1);

	var locator2 = new Locator("/sampleView,1"); //Define a locator path
	var dataGrid = $DataGrid.Get(Locator.Get(locator2, "/dataGrid")); //Get component by Locator + path
	var itemRenderer2 = $DataGridItemRenderer.Get(Locator.Get(dataGrid, "/:2,1")); //Get component by parent component + path
	
	Assert.assertEquals(itemRenderer1.text(), itemRenderer2.text());
};

Sample5TestCase.prototype.test_2 = function(event) {
	var source = $DataGrid.Get(Locator.Get("/sampleView,0/dataGrid"));
	var target = $DataGrid.Get(Locator.Get("/sampleView,1/dataGrid"));
	source.dragAndDropIndices(target, [2,3,4], 2);
};