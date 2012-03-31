var FlexExplorerDateControls = new function(){

	//Public
	this.tests;
	this.currentTestIndex = 0;
	
	this.run = function(){
		initilize(this, "Run Flex Explorer Date Controls");

		this.tests = [
			testDateChooserInit,
			testDateFieldInit
		];
		runNextTest(FlexExplorerDateControls);
	}
	
	//Test DateChooser BEGIN
	function testDateChooserInit(){
		Utils.log("testDateChooserInit");
		openNode(nodes, "DateChooser");
		waitOnLoad(this, testDateChooser);
	}
	
	function testDateChooser(app, panel){
		Utils.log("testDateChooser");
		
		testDateChooserEvents(app.dateChooser1());
		Utils.info(app.selection().text());
		
		testDateChooserMethods(app.dateChooser2());
		var hBox  = getChild(panel, "mx.containers::HBox");
		var vBox  = getChild(hBox,  "mx.containers::VBox", 1);
		var label = getChild(vBox,  "mx.controls::Label", 1);
		Utils.info(label.text());
		
		runNextTest(FlexExplorerDateControls);
	}	
	
	function testDateChooserEvents(dateChooser){
		var FlexEventRef = FD.getRef("mx.events.FlexEvent");
		var event = FD.create(FlexEventRef, ["buttonDown"]);
		var month_tf = FD.getRef(dateChooser, "monthDisplay");
		var year_tf  = FD.getRef(dateChooser, "yearDisplay");
		doEvent(FD.getRef(dateChooser, "upYearButton"), event);
		Utils.info(month_tf.text() + '-' + year_tf.text());
		doEvent(FD.getRef(dateChooser, "downYearButton"), event);
		Utils.info(month_tf.text() + '-' + year_tf.text());
		doEvent(FD.getRef(dateChooser, "fwdMonthButton"), event);
		Utils.info(month_tf.text() + '-' + year_tf.text());
		doEvent(FD.getRef(dateChooser, "backMonthButton"), event);
		Utils.info(month_tf.text() + '-' + year_tf.text());
		
		var calendarLayout = FD.getRef(dateChooser, "dateGrid");
		var width = calendarLayout.width();
		var height = calendarLayout.height();
		var MouseEventRef = FD.getRef("flash.events.MouseEvent");
		var event = FD.create(MouseEventRef, ["mouseUp", false, false, width / 2, height / 2]);
		doEvent(calendarLayout, event);
	}
		
	function testDateChooserMethods(dateChooser){	
		var DateRef = FD.getRef("Date");
		var date = FD.create(DateRef, [2006, 5, 2]); //June 2 2006
		dateChooser.selectedDate(date); 
		Utils.pause(PAUSE_INTERVAL);
	}
	//Test DateChooser END
	
	//Test DateField BEGIN
	function testDateFieldInit(){
		Utils.log("testDateFieldInit");
		openNode(nodes, "DateField");
		waitOnLoad(this, testDateField);
	}
	
	function testDateField(app, panel){
		Utils.log("testDateField");
		var FlexEventRef = FD.getRef("mx.events.FlexEvent");
		var event = FD.create(FlexEventRef, ["buttonDown"]);
		var dateField1 = app.dateField1();
		var downArrowButton = FD.getRef(dateField1, 'downArrowButton');
		doEvent(downArrowButton, event);
		var dateChooser = getChild(FlexDoor.getApp().systemManager(), "mx.controls::DateChooser");
		testDateChooserEvents(dateChooser);
		Utils.info(app.selection().text());
		
		var dateField2 = app.dateField2();
		testDateChooserMethods(dateField2);
		var label = getChild(panel, "mx.controls::Label", 4);
		Utils.info(label.text());
		
		runNextTest(FlexExplorerDateControls);
	}
	//Test DateField END
};
