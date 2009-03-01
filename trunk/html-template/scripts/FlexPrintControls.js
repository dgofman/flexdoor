var FlexPrintControls = new function(){

	//Public
	this.tests;
	this.currentTestIndex = 0;
	
	this.run = function(){
		initilize(this, "Run Flex Explorer Print Controls");

		this.tests = [
			testPrintInit
		];
		runNextTest(FlexPrintControls);
	}
	
	//Test Print BEGIN
	function testPrintInit(){
		Utils.log("testPrintInit");
		openNode(nodes, "FlexPrintJob, PrintDataGrid");
		waitOnLoad(this, testPrint);
	}
	
	function testPrint(app, panel){
		Utils.log("testPrint");
		var numDataItems = 60;
		var MouseEventRef = FD.getRef("flash.events.MouseEvent");
		var event = FD.create(MouseEventRef, ["click"]);
		app.dataItems().text(numDataItems);
		doEvent(app.setDP(), event);
		//doEvent(app.printDG(), event);
		
		var thePrintViewRef = FD.getRef("FormPrintView");
		var thePrintView = FD.create(thePrintViewRef);
		FD.addEventListener("creationComplete", onRowCountChanged, thePrintView);
		flexApp.systemManager().addChild(thePrintView);
		thePrintView.visible(false);
		thePrintView.width(588);
		thePrintView.height(768);
		thePrintView.prodTotal(app.prodTotal());
		thePrintView.myDataGrid().dataProvider(app.myDataGrid().dataProvider());
	}
	
	function onRowCountChanged(event){
		Utils.warn("Encoding page images will take some time, please wait...");
		var thePrintView = event.target();
		var dataGrid = thePrintView.myDataGrid();
		var PNGEncoderRef = FD.getRef("mx.utils.PNGEncoder");
		var base64Encoder = FD.create(FD.getRef("mx.utils.Base64Encoder"));
		var bitmapData = FD.create(FD.getRef("flash.display.BitmapData"), [thePrintView.width(),  thePrintView.height()]);
		var pageNumber = 1;
		do{
			var validNextPage = dataGrid.validNextPage();
			if(!validNextPage){
				if(pageNumber > 1){
					thePrintView.showPage("last");
		        }else{
		            thePrintView.showPage("single");
		        }
			}else{
		    	if(pageNumber == 1){
		        	thePrintView.showPage("first");
		     	}else{
		     		thePrintView.showPage("middle");
		     	}
			}
			bitmapData.draw(thePrintView);
			base64Encoder.encodeBytes(PNGEncoderRef.encode(bitmapData));
			var base64Str = base64Encoder.flush().replace(/\n/g, '');
			Utils.log("Page " + pageNumber + ": data:image/png;base64," + base64Str);
			thePrintView.pageNumber(pageNumber++);
		    dataGrid.nextPage();
		}while(validNextPage);
		flexApp.systemManager().removeChild(thePrintView);
		runNextTest(FlexPrintControls);
	}
	//Test Print END
};
