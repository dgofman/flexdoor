function Sample2TestCase(){
	this.init("SampleApp", "FlexDoor Sample 2");
	this.include("mx.containers::TitleWindow",
				 "mx.controls::Alert",
				 "mx.controls::Button",
				 "spark.components::Button");

	this.CLOSE_TYPE = "AlertCloseType";
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
	//Run next test asynchronously and set timeout to 5 seconds
	TestEvent.Get(event).set({type:this.CLOSE_TYPE, timeout:5000});
	this.callLater(this.closePopupWindow, 1000);
};

Sample2TestCase.prototype.test_2 = function(event) {
	var view = $TitleWindow.Get(this.view);
	var buttonBox =  Container.Get(view.find("buttonBox"));
	//Get Halo Button by type and cast using MX alias '$'
	var halo_btn = $Button.Get(buttonBox.getChildByType("mx.controls::Button", 1));
	halo_btn.click();
	TestEvent.Get(event).set({type:this.CLOSE_TYPE, timeout:5000, items:{"box":buttonBox}});
	this.callLater(this.closePopupWindow, 1000);
};

Sample2TestCase.prototype.test_3 = function(event) {
	var buttonBox =  Container.Get(event.getItem("box"));
	//Get Spark Button by type and cast using Spark alias '$$'
	var spark_btn = $$Button.Get(buttonBox.getChildByType("spark.components::Button", 0));
	spark_btn.click();
	TestEvent.Get(event).set({type:this.CLOSE_TYPE, timeout:5000});
	this.callLater(this.closePopupWindow, 1000);
};

Sample2TestCase.prototype.closePopupWindow = function(event){
	var alertWindow = $Alert.Get(this.app.getPopupWindow("mx.controls::Alert"));
	var ok = $Button.Get(alertWindow.buttonOK());
	ok.click();
	this.dispatchEvent(this.CLOSE_TYPE);
};