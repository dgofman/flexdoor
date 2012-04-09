function Sample4TestCase(){
	this.init("SampleApp", "FlexDoor Sample 4");
	this.include("mx.containers::TitleWindow",
				 "mx.controls::DataGrid",
				 "mx.collections::ListCollectionView",
				 "mx.events::CollectionEvent");
}
Sample4TestCase.prototype = new FlexDoor(Sample4TestCase);

Sample4TestCase.prototype.setUpBeforeClass = function(){
	this.view = $TitleWindow.Get(this.app.find("sampleView"));
};

Sample4TestCase.prototype.tearDownAfterClass = function(){
	this.view = null;
};

Sample4TestCase.prototype.setUp = function(){
	this.dataGrid = this.view.find("dataGrid");
};

Sample4TestCase.prototype.tearDown = function(){
	this.dataGrid = null;
};

Sample4TestCase.prototype.test_1 = function(event) {
	var dataGrid = $DataGrid.Get(this.dataGrid);
	var dataProvider = $ListCollectionView.Get(dataGrid.dataProvider());
	var eventType = "CollectionChangeType";

	var changeHandler = function(e){
		dataProvider.removeEventListener($CollectionEvent.COLLECTION_CHANGE, changeHandler);

		//Validate changeHandler is not attached to DataGrid 
		Sample4TestCase.addNewItem(dataProvider);

		this.dispatchEvent(eventType); //Goto next test
	};
	dataProvider.addEventListener($CollectionEvent.COLLECTION_CHANGE, changeHandler, this);

	TestEvent.Get(event).type = eventType;

	//Trigger changeHandler listener
	this.callLater(Sample4TestCase.addNewItem, 1000, dataProvider);
};

Sample4TestCase.prototype.test_2 = function(event) {
	var dataGrid = $DataGrid.Get(this.dataGrid);
	var dataProvider = $ListCollectionView.Get(dataGrid.dataProvider());

	var handler = dataProvider.createFunctionByName(Sample4TestCase, "dataGridChangeHandler");
	dataProvider.addEventListener($CollectionEvent.COLLECTION_CHANGE, handler);

	TestEvent.Get(event).type = $CollectionEvent.COLLECTION_CHANGE;
	
	//Trigger changeHandler listener
	this.callLater(Sample4TestCase.addNewItem, 1000, dataProvider);
};

Sample4TestCase.prototype.test_3 = function(event) {
	alert("DONE!");
};

Sample4TestCase.dataGridChangeHandler = function(event){
	var dataProvider = $ListCollectionView.Get(System.deserialize(event.currentTarget));
	dataProvider.removeEventListener($CollectionEvent.COLLECTION_CHANGE, Sample4TestCase.dataGridChangeHandler);

	//Validate changeHandler is not attached to DataGrid 
	Sample4TestCase.addNewItem(dataProvider);

	this.prototype.dispatchEvent($CollectionEvent.COLLECTION_CHANGE); //Goto next test
};

Sample4TestCase.addNewItem = function(dataProvider) {
	dataProvider.addItem("ITEM=" + new Date().toLocaleString());
};