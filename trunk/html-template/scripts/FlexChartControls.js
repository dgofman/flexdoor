var FlexChartControls = new function(){

	//Public
	this.tests;
	this.currentTestIndex = 0;
	
	this.run = function(){
		initilize(this, "Run Flex Explorer Chart Controls");

		this.tests = [
			testAreaChartInit,
			testAxisRendererInit,
			testBarChartInit,
			testBubbleChartInit,
			testCandlestickChartInit,
			testCategoryAxisInit,
			testColumnChartInit,
			testDateTimeAxisInit,
			testGridLinesInit,
			testHLOCChartInit,
			testLegendInit,
			testLinearAxisInit,
			testLineChartInit,
			testLogAxisInit,
			testPieChartInit,
			testPlotChartInit
		];
		runNextTest(FlexChartControls);
	}
	
	//Test AreaChart BEGIN
	function testAreaChartInit(){
		Utils.log("testAreaChartInit");
		openNode(nodes, "AreaChart");
		waitOnLoad(this, testAreaChart);
	}
	
	function testAreaChart(app, panel){
		Utils.log("testAreaChart");
		getChartInfo(app.Areachart(), "areaFill");
		runNextTest(FlexChartControls);
	}
	//Test AreaChart END
	
	//Test AxisRenderer BEGIN
	function testAxisRendererInit(){
		Utils.log("testAxisRendererInit");
		openNode(nodes, "AxisRenderer");
		waitOnLoad(this, testAxisRenderer);
	}
	
	function testAxisRenderer(app, panel){
		Utils.log("testAxisRenderer");
		getHLOCChartInfo(app.hlocchart());
		runNextTest(FlexChartControls);
	}
	//Test AxisRenderer END
	
	//Test BarChart BEGIN
	function testBarChartInit(){
		Utils.log("testBarChartInit");
		openNode(nodes, "BarChart");
		waitOnLoad(this, testBarChart);
	}
	
	function testBarChart(app, panel){
		Utils.log("testBarChart");
		getChartInfo(app.bar(), "fill", "verticalAxis");
		runNextTest(FlexChartControls);
	}
	//Test BarChart END
	
	//Test BubbleChart BEGIN
	function testBubbleChartInit(){
		Utils.log("testBubbleChartInit");
		openNode(nodes, "BubbleChart");
		waitOnLoad(this, testBubbleChart);
	}
	
	function testBubbleChart(app, panel){
		Utils.log("testBubbleChart");
      	getBubbleChartInfo(app.bubblechart());
		runNextTest(FlexChartControls);
	}
	//Test BubbleChart END
	
	//Test CandlestickChart BEGIN
	function testCandlestickChartInit(){
		Utils.log("testCandlestickChartInit");
		openNode(nodes, "CandlestickChart");
		waitOnLoad(this, testCandlestickChart);
	}
	
	function testCandlestickChart(app, panel){
		Utils.log("testCandlestickChart");
		getHLOCChartInfo(app.candlestickchart());
		runNextTest(FlexChartControls);
	}
	//Test CandlestickChart END
	
	//Test CategoryAxis BEGIN
	function testCategoryAxisInit(){
		Utils.log("testCategoryAxisInit");
		openNode(nodes, "CategoryAxis");
		waitOnLoad(this, testCategoryAxis);
	}
	
	function testCategoryAxis(app, panel){
		Utils.log("testCategoryAxis");
		getHLOCChartInfo(app.hlocchart());
		runNextTest(FlexChartControls);
	}
	//Test CategoryAxis END
	
	//Test ColumnChart BEGIN
	function testColumnChartInit(){
		Utils.log("testColumnChartInit");
		openNode(nodes, "ColumnChart");
		waitOnLoad(this, testColumnChart);
	}
	
	function testColumnChart(app, panel){
		Utils.log("testColumnChart");
		getChartInfo(app.column(), "fill");
		runNextTest(FlexChartControls);
	}
	//Test ColumnChart END
	
	//Test DateTimeAxis BEGIN
	function testDateTimeAxisInit(){
		Utils.log("testDateTimeAxisInit");
		openNode(nodes, "DateTimeAxis");
		waitOnLoad(this, testDateTimeAxis);
	}
	
	function testDateTimeAxis(app, panel){
		Utils.log("testDateTimeAxis");
      	getDateTimeAxisInfo(app.mychart());
		runNextTest(FlexChartControls);
	}
	//Test DateTimeAxis END
	
	//Test GridLines BEGIN
	function testGridLinesInit(){
		Utils.log("testGridLinesInit");
		openNode(nodes, "GridLines");
		waitOnLoad(this, testGridLines);
	}
	
	function testGridLines(app, panel){
		Utils.log("testGridLines");
		getChartInfo(app.linechart(), "lineStroke");
		runNextTest(FlexChartControls);
	}
	//Test GridLines END
	
	//Test HLOCChart BEGIN
	function testHLOCChartInit(){
		Utils.log("testHLOCChartInit");
		openNode(nodes, "HLOCChart");
		waitOnLoad(this, testHLOCChart);
	}
	
	function testHLOCChart(app, panel){
		Utils.log("testHLOCChart");
		getHLOCChartInfo(app.hlocchart());
		runNextTest(FlexChartControls);
	}
	//Test HLOCChart END
	
	//Test Legend BEGIN
	function testLegendInit(){
		Utils.log("testLegendInit");
		openNode(nodes, "Legend");
		waitOnLoad(this, testLegend);
	}
	
	function testLegend(app, panel){
		Utils.log("testLegend");
		getLegendInfo(app.plot(), "fill", true);
		runNextTest(FlexChartControls);
	}
	//Test Legend END
	
	//Test LinearAxis BEGIN
	function testLinearAxisInit(){
		Utils.log("testLinearAxisInit");
		openNode(nodes, "LinearAxis");
		waitOnLoad(this, testLinearAxis);
	}
	
	function testLinearAxis(app, panel){
		Utils.log("testLinearAxis");
		getHLOCChartInfo(app.hlocchart());
		runNextTest(FlexChartControls);
	}
	//Test LinearAxis END
	
	//Test LineChart BEGIN
	function testLineChartInit(){
		Utils.log("testLineChartInit");
		openNode(nodes, "LineChart");
		waitOnLoad(this, testLineChart);
	}
	
	function testLineChart(app, panel){
		Utils.log("testLineChart");
		getChartInfo(app.linechart(), "lineStroke");
		runNextTest(FlexChartControls);
	}
	//Test LineChart END
	
	//Test LogAxis BEGIN
	function testLogAxisInit(){
		Utils.log("testLogAxisInit");
		openNode(nodes, "LogAxis");
		waitOnLoad(this, testLogAxis);
	}
	
	function testLogAxis(app, panel){
		Utils.log("testLogAxis");
		getChartInfo(app.linechart(), "lineStroke");
		runNextTest(FlexChartControls);
	}
	//Test LogAxis END
	
	//Test PieChart BEGIN
	function testPieChartInit(){
		Utils.log("testPieChartInit");
		openNode(nodes, "PieChart");
		waitOnLoad(this, testPieChart);
	}
	
	function testPieChart(app, panel){
		Utils.log("testPieChart");
      	getPieChatInfo(app.chart());
		runNextTest(FlexChartControls);
	}
	//Test PieChart END
	
	//Test PlotChart BEGIN
	function testPlotChartInit(){
		Utils.log("testPlotChartInit");
		openNode(nodes, "PlotChart");
		waitOnLoad(this, testPlotChart);
	}
	
	function testPlotChart(app, panel){
		Utils.log("testPlotChart");
		getPlotChartInfo(app.plot());
		runNextTest(FlexChartControls);
	}
	//Test PlotChart END
};
