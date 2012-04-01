function Sample1TestCase(){
	this.init("SampleApp", "FlexDoor Sample 1");
	this.include("controls::Button",
				 "controls::TextInput",
				 "controls::ComboBox",
				 "containers::Panel",
				 "controls::DataGrid");
}
Sample1TestCase.prototype = new FlexDoor(Sample1TestCase/*, true*/);

Sample1TestCase.prototype.setUp = function(){
	var view = null;
	/*view = Panel.Get(this.app.getChildByType("mx.containers::TitleWindow"));
	Assert.assertEquals(view.type(), "mx.containers::Panel", "Test");

	view = Panel.Get(this.app.getChildByType("MonkeyView"));
	Assert.assertEquals(view.type(), "mx.containers::Panel");

	view = Panel.Get(this.app.getChildByName("monkeyViewName"));
	Assert.assertEquals(view.type(), "mx.containers::Panel");
*/

	view = Panel.Get(this.app.find("sampleView"));
	Assert.assertType(view, "mx.containers::Panel");

	view.setTitle("Test 1");

	var dataGrid = DataGrid.Get(view.find("dataGrid"));
	Assert.assertType(dataGrid, "mx.controls::DataGrid");
	dataGrid.setSelectedIndex(2);
};

Sample1TestCase.prototype.tearDown = function(){
	this.view = null;
};

Sample1TestCase.prototype.test_1 = function(event) {
	var view = this.setUp(); //Remove
	/*
	dataGrid = UIComponent.Get(this.app.find("dataGrid"));
	dataGrid.setter("selectedIndex", 1);

	var inNameTextField = TextInput.Get(this.view.find("inName"));
	inNameTextField.setText("Mike Wells");

	var inPhoneTextField = TextInput.Get(this.view.find("inPhone"));
	inPhoneTextField.setText("2058213928");*/
};

Sample1TestCase.prototype.test_2 = function(event) {
	/*var view = this.setUp(); //Remove
	var dropDownList = ComboBox.Get(this.view.find("inType"));
	dropDownList.open();

	//Pass local dropDownList object to the next test function 
	//Set delay before selecting an item
	return new FunctionEvent({delay:500, dropDownList:dropDownList});*/
};
/*
Sample1TestCase.prototype.test_3 = function(event) {
	event.dropDownList.selectedItem("Work");

	var addButton = Button.Get(view.find("Add"));
	addButton.click();
};*/
