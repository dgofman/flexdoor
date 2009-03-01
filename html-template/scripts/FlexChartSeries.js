var FlexChartSeries = new function(){

	//Public
	this.tests;
	this.currentTestIndex = 0;
	
	this.run = function(){
		initilize(this, "Run Flex Explorer Chart Series");

		this.tests = [
			testAreaSeriesInit,
			testBarSeriesInit,
			testBubbleSeriesInit,
			testCandlestickSeriesInit,
			testColumnSeriesInit,
			testHLOCSeriesInit,
			testLineSeriesInit,
			testPieSeriesInit,
			testPlotSeriesInit
		];
		runNextTest(FlexChartSeries);
	}
	
	//Test AreaSeries BEGIN
	function testAreaSeriesInit(){
		Utils.log("testAreaSeriesInit");
		openNode(nodes, "AreaSeries");
		waitOnLoad(this, testAreaSeries);
	}
	
	function testAreaSeries(app, panel){
		Utils.log("testAreaSeries");
		getChartInfo(app.Areachart(), "areaFill");
		runNextTest(FlexChartSeries);
	}
	//Test AreaSeries END
	
	//Test BarSeries BEGIN
	function testBarSeriesInit(){
		Utils.log("testBarSeriesInit");
		openNode(nodes, "BarSeries");
		waitOnLoad(this, testBarSeries);
	}
	
	function testBarSeries(app, panel){
		Utils.log("testBarSeries");
		getChartInfo(app.bar(), "fill", "verticalAxis");
		runNextTest(FlexChartSeries);
	}
	//Test BarSeries END
	
	//Test BubbleSeries BEGIN
	function testBubbleSeriesInit(){
		Utils.log("testBubbleSeriesInit");
		openNode(nodes, "BubbleSeries");
		waitOnLoad(this, testBubbleSeries);
	}
	
	function testBubbleSeries(app, panel){
		Utils.log("testBubbleSeries");
      	getBubbleChartInfo(app.bubblechart());
		runNextTest(FlexChartSeries);
	}
	//Test BubbleSeries END
	
	//Test CandlestickSeries BEGIN
	function testCandlestickSeriesInit(){
		Utils.log("testCandlestickSeriesInit");
		openNode(nodes, "CandlestickSeries");
		waitOnLoad(this, testCandlestickSeries);
	}
	
	function testCandlestickSeries(app, panel){
		Utils.log("testCandlestickSeries");
		getHLOCChartInfo(app.candlestickchart());
		runNextTest(FlexChartSeries);
	}
	//Test CandlestickSeries END
	
	//Test ColumnSeries BEGIN
	function testColumnSeriesInit(){
		Utils.log("testColumnSeriesInit");
		openNode(nodes, "ColumnSeries");
		waitOnLoad(this, testColumnSeries);
	}
	
	function testColumnSeries(app, panel){
		Utils.log("testColumnSeries");
		getChartInfo(app.column(), "fill");
		runNextTest(FlexChartSeries);
	}
	//Test ColumnSeries END
	
	//Test HLOCSeries BEGIN
	function testHLOCSeriesInit(){
		Utils.log("testHLOCSeriesInit");
		openNode(nodes, "HLOCSeries");
		waitOnLoad(this, testHLOCSeries);
	}
	
	function testHLOCSeries(app, panel){
		Utils.log("testHLOCSeries");
		getHLOCChartInfo(app.hlocchart());
		runNextTest(FlexChartSeries);
	}
	//Test HLOCSeries END
	
	//Test LineSeries BEGIN
	function testLineSeriesInit(){
		Utils.log("testLineSeriesInit");
		openNode(nodes, "LineSeries");
		waitOnLoad(this, testLineSeries);
	}
	
	function testLineSeries(app, panel){
		Utils.log("testLineSeries");
		getChartInfo(app.linechart(), "lineStroke");
		runNextTest(FlexChartSeries);
	}
	//Test LineSeries END
	
	//Test PieSeries BEGIN
	function testPieSeriesInit(){
		Utils.log("testPieSeriesInit");
		openNode(nodes, "PieSeries");
		waitOnLoad(this, testPieSeries);
	}
	
	function testPieSeries(app, panel){
		Utils.log("testPieSeries");
      	getPieChatInfo(app.chart());
		runNextTest(FlexChartSeries);
	}
	//Test PieSeries END
	
	//Test PlotSeries BEGIN
	function testPlotSeriesInit(){
		Utils.log("testPlotSeriesInit");
		openNode(nodes, "PlotSeries");
		waitOnLoad(this, testPlotSeries);
	}
	
	function testPlotSeries(app, panel){
		Utils.log("testPlotSeries");
		getPlotChartInfo(app.plot());
		runNextTest(FlexChartSeries);
	}
	//Test PlotSeries END
};
