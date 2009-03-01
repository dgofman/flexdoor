var FlexTextControls = new function(){

	//Public
	this.tests;
	this.currentTestIndex = 0;
	
	this.run = function(){
		initilize(this, "Run Flex Explorer Text Controls");

		this.tests = [
			testLabelInit,
		 	testRichTextEditorInit,
		 	testTextInit,
		 	testTextAreaInit,
			testTextInputInit
		];
		runNextTest(FlexTextControls);
	}
	
	//Test Label BEGIN
	function testLabelInit(){
		Utils.log("testLabelInit");
		openNode(nodes, "Label");
		waitOnLoad(this, testLabel);
	}
	
	function testLabel(app, panel){
		Utils.log("testLabel");
		var label = app.simpleLabel();
		var MouseEventRef = FD.getRef("flash.events.MouseEvent");
		var event = FD.create(MouseEventRef, ["click"]);
		for(var i = 0; i < 2; i++){
			var button = getChild(panel, "mx.controls::Button", i);
			doEvent(button, event);
			Utils.info(label.htmlText());
		}
		runNextTest(FlexTextControls);
	}
	//Test Label END
	
	//Test RichTextEditor BEGIN
	function testRichTextEditorInit(){
		Utils.log("testRichTextEditorInit");
		openNode(nodes, "RichTextEditor");
		waitOnLoad(this, testRichTextEditor);
	}
	
	function testRichTextEditor(app, panel){
		Utils.log("testRichTextEditor");
		var hBox = getChild(app, "mx.containers::HBox");
		var FlexEventRef = FD.getRef("mx.events.FlexEvent");
		var MouseEventRef = FD.getRef("flash.events.MouseEvent");
		var event1 = FD.create(MouseEventRef, ["click"]);
		var event2 = FD.create(FlexEventRef, ["enter"]);
		var event3 = FD.create(FlexEventRef, ["buttonDown"]);
		var rte = app.rte();
		var textArea = rte.textArea();
		var fontFamilyCombo = rte.fontFamilyCombo();
		var fontSizeCombo = rte.fontSizeCombo();
		var colorPicker = rte.colorPicker();
		var linkTextInput = rte.linkTextInput();
		var alignButtons = rte.alignButtons();
		var bulletButton = rte.bulletButton();
		
		doEvent(getChild(hBox, "mx.controls::Button", 0), event1);
		
		textArea.selectionBeginIndex(20);
		textArea.selectionEndIndex(34);
		doEvent(rte.boldButton(), event1);
		doEvent(rte.italicButton(), event1);
		doEvent(rte.underlineButton(), event1);
		linkTextInput.text("http://livedocs.adobe.com/flex/3/html/help.html?content=textcontrols_10.html");
    	linkTextInput.dispatchEvent(event2);

		var numChildren = alignButtons.numChildren();
		for(var i = numChildren - 1; i >= 0; i--)
			doChildIndexEvent(alignButtons, i);
    	doEvent(bulletButton, event1);
    	
    	fontFamilyCombo.selectedIndex(4);
		fontFamilyCombo.dispatchEvent(event2);
		fontSizeCombo.selectedIndex(8);
		fontSizeCombo.dispatchEvent(event2);
		
		var downArrowButton = FD.getRef(colorPicker, 'downArrowButton');
		downArrowButton.dispatchEvent(event3);
		colorPicker.selectedColor(0x0000FF);
		colorPicker.close();
    	
    	doEvent(getChild(hBox, "mx.controls::Button", 1), event1);
    	
		runNextTest(FlexTextControls);
	}
	//Test RichTextEditor END
	
	//Test Text BEGIN
	function testTextInit(){
		Utils.log("testTextInit");
		openNode(nodes, "Text");
		waitOnLoad(this, testText);
	}
	
	function testText(app, panel){
		Utils.log("testText");
		var text1 = getChild(panel, "mx.controls::Text", 0);
		var text2 = getChild(panel, "mx.controls::Text", 1);
		var temp = text1.text();
		text1.htmlText(text2.htmlText());
		text2.text(temp);
		Utils.pause(500);
		runNextTest(FlexTextControls);
	}
	//Test Text END
	
	//Test TextArea BEGIN
	function testTextAreaInit(){
		Utils.log("testTextAreaInit");
		openNode(nodes, "TextArea");
		waitOnLoad(this, testTextArea);
	}
	
	function testTextArea(app, panel){
		Utils.log("testTextArea");
		var textArea1 = getChild(panel, "mx.controls::TextArea", 0);
		var textArea2 = getChild(panel, "mx.controls::TextArea", 1);
		var text = textArea1.text().split(" ").join("\n");
		textArea1.text(text);
		var text = textArea2.htmlText().replace(/\s|(<.+?\/\w+>)/g, "$1<br>");
		textArea2.htmlText(text);
		Utils.pause(500);
		runNextTest(FlexTextControls);
	}
	//Test TextArea END
	
	//Test TextInput BEGIN
	function testTextInputInit(){
		Utils.log("testTextInputInit");
		openNode(nodes, "TextInput");
		waitOnLoad(this, testTextInput);
	}
	
	function testTextInput(app, panel){
		Utils.log("testTextInput");
		var MouseEventRef = FD.getRef("flash.events.MouseEvent");
		var event = FD.create(MouseEventRef, ["click"]);
		doEvent(getChild(panel, "mx.controls::Button"), event);
		Utils.assert("src.text and dest.text", app.src().text(), app.dest().text());
		runNextTest(FlexTextControls);
	}
	//Test TextInput END
};
