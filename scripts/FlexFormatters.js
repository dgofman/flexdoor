var FlexFormatters = new function(){

	//Public
	this.tests;
	this.currentTestIndex = 0;
	
	this.run = function(){
		initilize(this, "Run Flex Explorer Formatters");

		this.tests = [
			testCurrencyFormatterInit,
			testDateFormatterInit,
			testFormatterInit,
			testNumberFormatterInit,
			testPhoneFormatterInit,
			testSwitchSymbolFormatterInit,
			testZipCodeFormatterInit
		];
		runNextTest(FlexFormatters);
	}
	
	function validateItems(list, panel, field, formattedField){
		var FlexEventRef = FD.getRef("flash.events.MouseEvent");
		var event = FD.create(FlexEventRef, ["click"]);
		var form = getChild(panel, "mx.containers::Form");
		var formItem = getChild(form, "mx.containers::FormItem", 2);
		var button = getChild(formItem, "mx.controls::Button");
		for(var i = 0; i < list.length; i++){
			field.text(list[i]);
			doEvent(button, event);
			var errorString = field.errorString();
			if(errorString && errorString.length > 0){
				Utils.warn(list[i] + ": " + errorString);
			}else{
				Utils.info(list[i] + ": " + formattedField.text());
			}
		}
	}
	
	//Test CurrencyFormatter BEGIN
	function testCurrencyFormatterInit(){
		Utils.log("testCurrencyFormatterInit");
		openNode(nodes, "CurrencyFormatter");
		waitOnLoad(this, testCurrencyFormatter);
	}
	
	function testCurrencyFormatter(app, panel){
		Utils.log("testCurrencyFormatter");
		var list = ["", "$5", "5"];
		validateItems(list, panel, app.priceUS(), app.formattedUSPrice());
		runNextTest(FlexFormatters);
	}
	//Test CurrencyFormatter END
	
	//Test DateFormatter BEGIN
	function testDateFormatterInit(){
		Utils.log("testDateFormatterInit");
		openNode(nodes, "DateFormatter");
		waitOnLoad(this, testDateFormatter);
	}
	
	function testDateFormatter(app, panel){
		Utils.log("testDateFormatter");
		var list = ["", "02292009", "02/29/2009", "02/29/2008"];
		validateItems(list, panel, app.dob(), app.formattedDate());
		runNextTest(FlexFormatters);
	}
	//Test DateFormatter END
	
	//Test Formatter BEGIN
	function testFormatterInit(){
		Utils.log("testFormatterInit");
		openNode(nodes, "Formatter");
		waitOnLoad(this, testFormatter);
	}
	
	function testFormatter(app, panel){
		Utils.log("testFormatter");
		var list = ["", "ABC", "123.456.789", "123.456"];
		validateItems(list, panel, app.inputVal(), app.formattedNumber());
		runNextTest(FlexFormatters);
	}
	//Test Formatter END
	
	//Test NumberFormatter BEGIN
	function testNumberFormatterInit(){
		Utils.log("testNumberFormatterInit");
		openNode(nodes, "NumberFormatter");
		waitOnLoad(this, testNumberFormatter);
	}
	
	function testNumberFormatter(app, panel){
		Utils.log("testNumberFormatter");
		var list = ["", "ABC", "123.456.789", "123.456789", "123"];
		validateItems(list, panel, app.inputVal(), app.formattedNumber());
		runNextTest(FlexFormatters);
	}
	//Test NumberFormatter END
	
	//Test PhoneFormatter BEGIN
	function testPhoneFormatterInit(){
		Utils.log("testPhoneFormatterInit");
		openNode(nodes, "PhoneFormatter");
		waitOnLoad(this, testPhoneFormatter);
	}
	
	function testPhoneFormatter(app, panel){
		Utils.log("testPhoneFormatter");
		var list = ["", "PHONE-ID", "7466343", "8007466343"];
		validateItems(list, panel, app.phone(), app.formattedPhone());
		runNextTest(FlexFormatters);
	}
	//Test PhoneFormatter END
	
	//Test SwitchSymbolFormatter BEGIN
	function testSwitchSymbolFormatterInit(){
		Utils.log("testSwitchSymbolFormatterInit");
		openNode(nodes, "SwitchSymbolFormatter");
		waitOnLoad(this, testSwitchSymbolFormatter);
	}
	
	function testSwitchSymbolFormatter(app, panel){
		Utils.log("testSwitchSymbolFormatter");
		var list = ["", "000000000", "123", "12-34-567", "123456789"];
		var FlexEventRef = FD.getRef("flash.events.MouseEvent");
		var event = FD.create(FlexEventRef, ["click"]);
		var scNum = app.scNum();
		var formattedSCNumber = app.formattedSCNumber();
		var button = getChild(panel, "mx.controls::Button");
		for(var i = 0; i < list.length; i++){
			scNum.text(list[i]);
			doEvent(button, event);
			var errorString = scNum.errorString();
			if(errorString && errorString.length > 0){
				Utils.warn(list[i] + ": " + errorString);
			}else{
				Utils.info(list[i] + ": " + formattedSCNumber.text());
			}
		}
		runNextTest(FlexFormatters);
	}
	//Test SwitchSymbolFormatter END
	
	//Test ZipCodeFormatter BEGIN
	function testZipCodeFormatterInit(){
		Utils.log("testZipCodeFormatterInit");
		openNode(nodes, "ZipCodeFormatter");
		waitOnLoad(this, testZipCodeFormatter);
	}
	
	function testZipCodeFormatter(app, panel){
		Utils.log("testZipCodeFormatter");
		var list = ["", "C1A 8V7", "9404", "940432809"];
		validateItems(list, panel, app.zip(), app.formattedZipcode());
		runNextTest(FlexFormatters);
	}
	//Test ZipCodeFormatter END
}
