var FlexChartEffects = new function(){

	//Public
	this.tests;
	this.currentTestIndex = 0;
	
	this.run = function(){
		initilize(this, "Run Flex Explorer Chart Effects");

		this.tests = [
			testSeriesInterpolateInit,
			testSeriesSlideInit,
			testSeriesZoomInit
		];
		runNextTest(FlexChartEffects);
	}
	
	function testEffects(panel){
		var hBox = getChild(panel, "mx.containers::HBox");
		var MouseEventRef = FD.getRef("flash.events.MouseEvent");
		var event = FD.create(MouseEventRef, ["click"]);
		var numChildren = hBox.numChildren();
		for(var i = numChildren - 1; i >= 0; i--){
			doEvent(getChild(hBox, "mx.controls::RadioButton", i), event, true, 2000);
		}
	}
	
	//Test SeriesInterpolate BEGIN
	function testSeriesInterpolateInit(){
		Utils.log("testSeriesInterpolateInit");
		openNode(nodes, "SeriesInterpolate");
		waitOnLoad(this, testSeriesInterpolate);
	}
	
	function testSeriesInterpolate(app, panel){
		Utils.log("testSeriesInterpolate");
		testEffects(panel);
		runNextTest(FlexChartEffects);
	}
	//Test SeriesInterpolate END
	
	//Test SeriesSlide BEGIN
	function testSeriesSlideInit(){
		Utils.log("testSeriesSlideInit");
		openNode(nodes, "SeriesSlide");
		waitOnLoad(this, testSeriesSlide);
	}
	
	function testSeriesSlide(app, panel){
		Utils.log("testSeriesSlide");
		testEffects(panel);
		runNextTest(FlexChartEffects);
	}
	//Test SeriesSlide END
	
	//Test SeriesZoom BEGIN
	function testSeriesZoomInit(){
		Utils.log("testSeriesZoomInit");
		openNode(nodes, "SeriesZoom");
		waitOnLoad(this, testSeriesZoom);
	}
	
	function testSeriesZoom(app, panel){
		Utils.log("testSeriesZoom");
		testEffects(panel);
		runNextTest(FlexChartEffects);
	}
	//Test SeriesZoom END
};
