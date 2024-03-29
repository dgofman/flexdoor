function Sample3TestCase(){
	this.init("SampleApp", "DataGrid Search and Filtering");
	this.include("mx.containers::TitleWindow",
				 "mx.controls::DataGrid",
				 "mx.collections::ListCollectionView");
}
Sample3TestCase.prototype = new FlexDoor(Sample3TestCase);

Sample3TestCase.prototype.setUpBeforeClass = function(event){
	this.view = $TitleWindow.Get(this.app.find("sampleView"));
};

Sample3TestCase.prototype.tearDownAfterClass = function(event){
	this.view = null;
};

Sample3TestCase.prototype.setUp = function(event){
	this.dataGrid = this.view.find("dataGrid");
};

Sample3TestCase.prototype.tearDown = function(event){
	this.dataGrid = null;
};

Sample3TestCase.prototype.test_1 = function(event) {
	var dataGrid = $DataGrid.Get(this.dataGrid);
	var dataProvider = $ListCollectionView.Get(dataGrid.dataProvider());

	var findItem = "3";
	var findIndex = -1;
	//Find item in dataProvider
	for(var i = 0; i < dataProvider.source.length; i++){
		var item = dataProvider.source[i];
		if(item == findItem){
			findIndex = i;
			break;
		}
	}
	Assert.assertTrue(findIndex != -1);
	return dataProvider;
};

Sample3TestCase.prototype.test_2 = function(event, dataProvider) {
	var dataGrid = $DataGrid.Get(this.dataGrid);
	
	//Find item renderer
	var itemRenderer = null;
	var findItem = "3";
	dataProvider.setSearchFunction(function(item){
		if(itemRenderer == null && item == findItem){
			itemRenderer = $DataGridItemRenderer.Get(dataGrid.itemToItemRenderer(item));
			Assert.assertTrue(renderer != null);
			Assert.assertEquals(findItem, itemRenderer.data());
		}
		return true;
	});

	return dataProvider;
};

Sample3TestCase.prototype.test_3 = function(event, dataProvider) {
	this.sync(event, 1000);

	//Remove item using filterFunction
	var findItem = "NEW ROW";
	dataProvider.filterFunction(function(item){
		if(item == findItem)
			return false;
		return true;
	});
	dataProvider.refresh();
};