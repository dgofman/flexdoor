function Sample2TestCase(){
	this.init("SampleApp", "FlexDoor Sample 2");
	this.include("mx.containers::TitleWindow",
				 "mx.controls::Alert",
				 "mx.controls::Button",
				 "spark.components::Button");
}
Sample2TestCase.prototype = new FlexDoor(Sample2TestCase/*, true*/);

Sample2TestCase.prototype.setUpBeforeClass = function(){
	this.view = $TitleWindow.Get(this.app.find("sampleView"));
};

Sample2TestCase.prototype.tearDownAfterClass = function(){
	this.view = null;
};

Sample2TestCase.prototype.test_1 = function(event) {
	var view = $TitleWindow.Get(this.view);
	var add_btn = $Button.Get(view.find("add_btn"));
	add_btn.click();
	this.closePopupWindow();
	return new FunctionEvent(null, 1000);
};

Sample2TestCase.prototype.test_2 = function(event) {
	var view = $TitleWindow.Get(this.view);
	var buttonBox =  Container.Get(view.find("buttonBox"));
	//Get Halo Button by type and cast using MX alias '$'
	var halo_btn = $Button.Get(buttonBox.getChildByType("mx.controls::Button", 1));
	halo_btn.click();
	this.closePopupWindow();
	return new FunctionEvent({"box":buttonBox}, 1000);
};

Sample2TestCase.prototype.test_3 = function(event) {
	var buttonBox =  Container.Get(event.getItem("box"));
	//Get Spark Button by type and cast using Spark alias '$$'
	var spark_btn = $$Button.Get(buttonBox.getChildByType("spark.components::Button", 0));
	spark_btn.click();
};

Sample2TestCase.prototype.closePopupWindow = function(){
	var systemManager = EventDispatcher.Get(this.app.getSystemManager());
	var alertWindow = $Alert.Get(systemManager.getChildByType("mx.controls::Alert"));
	var ok = $Button.Get(alertWindow.buttonOK());
	ok.click();
	this.closePopupWindow();
};