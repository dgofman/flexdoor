var FlexValidators = new function(){

	//Public
	this.tests;
	this.currentTestIndex = 0;
	
	this.run = function(){
		initilize(this, "Run Flex Explorer Validators");

		this.tests = [
			testCreditCardValidatorInit,
			testCurrencyValidatorInit,
			testDateValidatorInit,
			testEmailValidatorInit,
			testNumberValidatorInit,
			testPhoneNumberValidatorInit,
			testRegExpValidatorInit,
			testSocialSecurityValidatorInit,
			testStringValidatorInit,
			testValidatorInit,
			testZipCodeValidatorInit
		];
		runNextTest(FlexValidators);
	}
	
	//Test CreditCardValidator BEGIN
	function testCreditCardValidatorInit(){
		Utils.log("testCreditCardValidatorInit");
		openNode(nodes, "CreditCardValidator");
		waitOnLoad(this, testCreditCardValidator);
	}
	
	function testCreditCardValidator(app, panel){
		Utils.log("testCreditCardValidator");
		var FlexEventRef = FD.getRef("flash.events.MouseEvent");
		var event = FD.create(FlexEventRef, ["click"]);
		var cardTypeCombo = app.cardTypeCombo();
		var cardNumberInput = app.cardNumberInput();
		var button = app.myButton();
		var items = cardTypeCombo.dataProvider().toArray();
		for(var i = 0; i < items.length; i++){
			var data = FlexDoor.getRef(items[i], "data");
			var creditCardNumber = null;
			var invalidCardNumber = String(Math.random()).substring(2, 18);
			switch(data){
				case "American Express":
					creditCardNumber = "343434343434343";
					break;
				case "Diners Club":
					creditCardNumber = "30130130130130";
					break;
				case "Discover":
					creditCardNumber = "6011-1106-6011-1106";
					break;
				case "MasterCard":
					creditCardNumber = "5454-5454-5454-5454";
					break;
				case "Visa":
					creditCardNumber = "4321-1234-4321-1234";
					break;
			}
			cardTypeCombo.selectedIndex(i);
			cardNumberInput.text(invalidCardNumber); //Invalid Number
			doEvent(button, event);
			Utils.log(data + " (" + invalidCardNumber + ") : " + cardNumberInput.errorString());
			cardNumberInput.text(creditCardNumber);
			doEvent(button, event);
			Utils.assert(data + ": invalid credit card - " + creditCardNumber, cardNumberInput.errorString().length == 0);
			closeAlertWindow();
		}
		runNextTest(FlexValidators);
	}
	//Test CreditCardValidator END
	
	//Test CurrencyValidator BEGIN
	function testCurrencyValidatorInit(){
		Utils.log("testCurrencyValidatorInit");
		openNode(nodes, "CurrencyValidator");
		waitOnLoad(this, testCurrencyValidator);
	}
	
	function testCurrencyValidator(app, panel){
		Utils.log("testCurrencyValidator");
		var FlexEventRef = FD.getRef("flash.events.MouseEvent");
		var event = FD.create(FlexEventRef, ["click"]);
		var priceUS = app.priceUS();
		var button = app.myButton();
		var list = ["", "€100.00", "$100.000", "$100.00"];
		for(var i = 0; i < list.length; i++){
			priceUS.text(list[i]);
			doEvent(button, event);
			var errorString = priceUS.errorString();
			if(errorString && errorString.length > 0){
				Utils.warn(list[i] + ": " + errorString);
			}else{
				closeAlertWindow();
			}
		}
		runNextTest(FlexValidators);
	}
	//Test CurrencyValidator END
	
	//Test DateValidator BEGIN
	function testDateValidatorInit(){
		Utils.log("testDateValidatorInit");
		openNode(nodes, "DateValidator");
		waitOnLoad(this, testDateValidator);
	}
	
	function testDateValidator(app, panel){
		Utils.log("testDateValidator");
		var FlexEventRef = FD.getRef("flash.events.MouseEvent");
		var event = FD.create(FlexEventRef, ["click"]);
		var dob = app.dob();
		var button = app.myButton();
		var list = ["", "29.02.2009", "02/29/09", "02/29/2009", "02/29/2008"];
		for(var i = 0; i < list.length; i++){
			dob.text(list[i]);
			doEvent(button, event);
			var errorString = dob.errorString();
			if(errorString && errorString.length > 0){
				Utils.warn(list[i] + ": " + errorString);
			}else{
				closeAlertWindow();
			}
		}
		runNextTest(FlexValidators);
	}
	//Test DateValidator END
	
	//Test EmailValidator BEGIN
	function testEmailValidatorInit(){
		Utils.log("testEmailValidatorInit");
		openNode(nodes, "EmailValidator");
		waitOnLoad(this, testEmailValidator);
	}
	
	function testEmailValidator(app, panel){
		Utils.log("testEmailValidator");
		var FlexEventRef = FD.getRef("flash.events.MouseEvent");
		var event = FD.create(FlexEventRef, ["click"]);
		var email = app.email();
		var button = app.myButton();
		var list = ["", "david.gofman", "david@gofman", "david@gofman.", "dgofman@gmail.com"];
		for(var i = 0; i < list.length; i++){
			email.text(list[i]);
			doEvent(button, event);
			var errorString = email.errorString();
			if(errorString && errorString.length > 0){
				Utils.warn(list[i] + ": " + errorString);
			}else{
				closeAlertWindow();
			}
		}
		runNextTest(FlexValidators);
	}
	//Test EmailValidator END
	
	//Test NumberValidator BEGIN
	function testNumberValidatorInit(){
		Utils.log("testNumberValidatorInit");
		openNode(nodes, "NumberValidator");
		waitOnLoad(this, testNumberValidator);
	}
	
	function testNumberValidator(app, panel){
		Utils.log("testNumberValidator");
		var FlexEventRef = FD.getRef("flash.events.MouseEvent");
		var event = FD.create(FlexEventRef, ["click"]);
		var age = app.age();
		var button = app.myButton();
		var list = ["", "-1850", "1850", "18.50", "18", "50"];
		for(var i = 0; i < list.length; i++){
			age.text(list[i]);
			doEvent(button, event);
			var errorString = age.errorString();
			if(errorString && errorString.length > 0){
				Utils.warn(list[i] + ": " + errorString);
			}else{
				closeAlertWindow();
			}
		}
		runNextTest(FlexValidators);
	}
	//Test NumberValidator END
	
	//Test PhoneNumberValidator BEGIN
	function testPhoneNumberValidatorInit(){
		Utils.log("testPhoneNumberValidatorInit");
		openNode(nodes, "PhoneNumberValidator");
		waitOnLoad(this, testPhoneNumberValidator);
	}
	
	function testPhoneNumberValidator(app, panel){
		Utils.log("testPhoneNumberValidator");
		var FlexEventRef = FD.getRef("flash.events.MouseEvent");
		var event = FD.create(FlexEventRef, ["click"]);
		var phone = app.phone();
		var button = app.myButton();
		var list = ["", "PHONE-ID", "746-6343", "1-800-746-6343"];
		for(var i = 0; i < list.length; i++){
			phone.text(list[i]);
			doEvent(button, event);
			var errorString = phone.errorString();
			if(errorString && errorString.length > 0){
				Utils.warn(list[i] + ": " + errorString);
			}else{
				closeAlertWindow();
			}
		}
		runNextTest(FlexValidators);
	}
	//Test PhoneNumberValidator END
	
	//Test RegExpValidator BEGIN
	function testRegExpValidatorInit(){
		Utils.log("testRegExpValidatorInit");
		openNode(nodes, "RegExpValidator");
		waitOnLoad(this, testRegExpValidator);
	}
	
	function testRegExpValidator(app, panel){
		Utils.log("testRegExpValidator");
		var FlexEventRef = FD.getRef("flash.events.MouseEvent");
		var event = FD.create(FlexEventRef, ["click"]);
		var regex_text = app.regex_text();
		var regex = app.regex();
		var reResults = app.reResults();
		var button = app.myButton();
		var list = ["A-Z", "[A-Z]", "[A-Z]\\d", "[A-Z].\\d", "[A-Z].*\\d"];
		for(var i = 0; i < list.length; i++){
			regex.text(list[i]);
			doEvent(button, event);
			var errorString = regex_text.errorString();
			if(errorString && errorString.length > 0){
				Utils.warn(list[i] + ": " + errorString);
			}else{
				Utils.info(list[i] + ": " + reResults.text());
			}
		}
		runNextTest(FlexValidators);
	}
	//Test RegExpValidator END
	
	//Test SocialSecurityValidator BEGIN
	function testSocialSecurityValidatorInit(){
		Utils.log("testSocialSecurityValidatorInit");
		openNode(nodes, "SocialSecurityValidator");
		waitOnLoad(this, testSocialSecurityValidator);
	}
	
	function testSocialSecurityValidator(app, panel){
		Utils.log("testSocialSecurityValidator");
		var FlexEventRef = FD.getRef("flash.events.MouseEvent");
		var event = FD.create(FlexEventRef, ["click"]);
		var ssn = app.ssn();
		var button = app.myButton();
		var list = ["", "000-00-0000", "1234567890", "123.45.6789", "123-45-6789"];
		for(var i = 0; i < list.length; i++){
			ssn.text(list[i]);
			doEvent(button, event);
			var errorString = ssn.errorString();
			if(errorString && errorString.length > 0){
				Utils.warn(list[i] + ": " + errorString);
			}else{
				closeAlertWindow();
			}
		}
		runNextTest(FlexValidators);
	}
	//Test SocialSecurityValidator END
	
	//Test StringValidator BEGIN
	function testStringValidatorInit(){
		Utils.log("testStringValidatorInit");
		openNode(nodes, "StringValidator");
		waitOnLoad(this, testStringValidator);
	}
	
	function testStringValidator(app, panel){
		Utils.log("testStringValidator");
		var FlexEventRef = FD.getRef("flash.events.MouseEvent");
		var event = FD.create(FlexEventRef, ["click"]);
		var fname = app.fname();
		var button = app.myButton();
		var list = ["", "DG", "David Gofman (dgofman@gmail.com)", "David Gofman"];
		for(var i = 0; i < list.length; i++){
			fname.text(list[i]);
			doEvent(button, event);
			var errorString = fname.errorString();
			if(errorString && errorString.length > 0){
				Utils.warn(list[i] + ": " + errorString);
			}else{
				closeAlertWindow();
			}
		}
		runNextTest(FlexValidators);
	}
	//Test StringValidator END
	
	//Test Validator BEGIN
	function testValidatorInit(){
		Utils.log("testValidatorInit");
		openNode(nodes, "Validator");
		waitOnLoad(this, testValidator);
	}
	
	function testValidator(app, panel){
		Utils.log("testValidator");
		var FlexEventRef = FD.getRef("flash.events.MouseEvent");
		var event = FD.create(FlexEventRef, ["click"]);
		var fname = app.fname();
		var email = app.email();
		var button = app.submitButton();
		var list = ["", "David Gofman"];
		for(var i = 0; i < list.length; i++){
			fname.text(list[i]);
			fname.setFocus();
			email.text("dgofman@gmail.com");
			email.setFocus();
			if(button.enabled())
				doEvent(button, event);
			var errorString = fname.errorString();
			if(errorString && errorString.length > 0){
				Utils.warn(list[i] + ": " + errorString);
			}else{
				closeAlertWindow();
			}
		}
		runNextTest(FlexValidators);
	}
	//Test Validator END
	
	//Test ZipCodeValidator BEGIN
	function testZipCodeValidatorInit(){
		Utils.log("testZipCodeValidatorInit");
		openNode(nodes, "ZipCodeValidator");
		waitOnLoad(this, testZipCodeValidator);
	}
	
	function testZipCodeValidator(app, panel){
		Utils.log("testZipCodeValidator");
		var FlexEventRef = FD.getRef("flash.events.MouseEvent");
		var event = FD.create(FlexEventRef, ["click"]);
		var zip = app.zip();
		var button = app.myButton();
		var list = ["", "C1A+8V7", "C1A 8V7", "94043-ABCD", "94043-2809"];
		for(var i = 0; i < list.length; i++){
			zip.text(list[i]);
			doEvent(button, event);
			var errorString = zip.errorString();
			if(errorString && errorString.length > 0){
				Utils.warn(list[i] + ": " + errorString);
			}else{
				closeAlertWindow();
			}
		}
		runNextTest(FlexValidators);
	}
	//Test ZipCodeValidator END
};