function Sample2TestCase(){
	this.init("SampleApp", "FlexDoor Sample 2");
	this.include("mx.containers::TitleWindow",
				 "mx.controls::Alert",
				 "mx.controls::Button",
				 "spark.components::Button");
}
Sample2TestCase.prototype = new FlexDoor(Sample2TestCase);

Sample2TestCase.prototype.setUpBeforeClass = function(event){
	this.view = $TitleWindow.Get(this.app.find("sampleView"));
};

Sample2TestCase.prototype.tearDownAfterClass = function(event){
	this.view = null;
};

Sample2TestCase.prototype.test_1 = function(event) {
	this.async(event, 500, 5000);
	var view = $TitleWindow.Get(this.view);
	var add_btn = $Button.Get(view.find("add_btn"));
	add_btn.click();
	//Run next test asynchronously and set timeout to 5 seconds
	this.callLater(this.closePopupWindow, 1000, event);
};

Sample2TestCase.prototype.test_2 = function(event) {
	this.async(event, 500, 5000);
	var view = $TitleWindow.Get(this.view);
	var buttonBox =  Container.Get(view.find("buttonBox"));
	//Get Halo Button by type and cast using MX alias '$'
	var halo_btn = $Button.Get(buttonBox.getChildByType("mx.controls::Button", 1));
	halo_btn.click();
	this.callLater(this.closePopupWindow, 1000, event);
	return buttonBox;
};

Sample2TestCase.prototype.test_3 = function(event, buttonBox) {
	this.async(event, 500, 5000);
	//Get Spark Button by type and cast using Spark alias '$$'
	var spark_btn = $$Button.Get(buttonBox.getChildByType("spark.components::Button", 0));
	spark_btn.click();
	this.callLater(this.closePopupWindow, 1000);
};

Sample2TestCase.prototype.closePopupWindow = function(event){
	var alertWindow = $Alert.Get(this.app.getPopupWindow("mx.controls::Alert"));
	var ok = $Button.Get(alertWindow.buttonOK());
	ok.click();
	this.callNextTest();
};