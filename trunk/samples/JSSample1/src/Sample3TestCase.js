function Sample3TestCase(){
	this.init("SampleApp", "FlexDoor Sample 3");
	this.include("mx.containers::TitleWindow",
				 "mx.controls::DataGrid",
				 "mx.collections::ListCollectionView");
}
Sample3TestCase.prototype = new FlexDoor(Sample3TestCase);

Sample3TestCase.prototype.setUpBeforeClass = function(){
	this.view = $TitleWindow.Get(this.app.find("sampleView"));
};

Sample3TestCase.prototype.tearDownAfterClass = function(){
	this.view = null;
};

Sample3TestCase.prototype.setUp = function(){
	this.dataGrid = this.view.find("dataGrid");
};

Sample3TestCase.prototype.tearDown = function(){
	this.dataGrid = null;
};

Sample3TestCase.prototype.test_1 = function(event) {
	var dataGrid = $DataGrid.Get(this.dataGrid);
	var dataProvider = $ListCollectionView.Get(dataGrid.getDataProvider());

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
	TestEvent.Get(event).addItems({dataProvider:dataProvider});
};

Sample3TestCase.prototype.test_2 = function(event) {
	var dataProvider = $ListCollectionView.Get(event.getItem('dataProvider'));
	var dataGrid = $DataGrid.Get(this.dataGrid);
	
	//Find item renderer
	var itemRenderer = null;
	var findItem = "3";
	dataProvider.setSearchFunction(function(item){
		if(itemRenderer == null && item == findItem){
			var itemRenderer = $DataGridItemRenderer.Get(dataGrid.itemToItemRenderer(item));
			Assert.assertTrue(renderer != null);
			Assert.assertEquals(findItem, itemRenderer.getData());
		}
		return true;
	});

	TestEvent.Get(event).addItems({dataProvider:dataProvider});
};

Sample3TestCase.prototype.test_3 = function(event) {
	var dataProvider = $ListCollectionView.Get(event.getItem('dataProvider'));

	//Filter and remove item
	var findItem = "NEW ROW";
	dataProvider.setFilterFunction(function(item){
		if(item == findItem)
			return false;
		return true;
	});
	dataProvider.refresh();

	TestEvent.Get(event).delay = 1000;
};