var FlexExplorerMenuControls = new function(){

	//Public
	this.tests;
	this.currentTestIndex = 0;
	
	this.run = function(){
		initilize(this, "Run Flex Explorer Menu Controls");

		this.tests = [
			testMenuInit,
			testMenuBarInit,
			testPopUpMenuButtonInit
		];
		runNextTest(FlexExplorerMenuControls);
	}
	
	//Test Menu BEGIN
	function testMenuInit(){
		Utils.log("testMenuInit");
		openNode(nodes, "Menu");
		waitOnLoad(this, testMenu);
	}
	
	function testMenu(app, panel){
		Utils.log("testMenu");
		var button = app.mybutton();
		var MouseEventRef = FD.getRef("flash.events.MouseEvent");
		var event = FD.create(MouseEventRef, ["click"]);
		doEvent(button, event);
		var menu = getChild(flexApp.systemManager(), "mx.controls::Menu");
		var total = menu.dataProvider().length();
		var index = total - 1; //Last row
		selectMenuByIndex(menu, index);
		runNextTest(FlexExplorerMenuControls);
	}
	
	function selectMenuByIndex(menu, index, menuBar){
        menu.selectedIndex(index);
        doMenuEvent(menu, index, "label", "itemClick", menuBar);
        closeAlertWindow();
        FD.getRef(menu, "hideAllMenus");
	}
	//Test Menu END
	
	//Test MenuBar BEGIN
	function testMenuBarInit(){
		Utils.log("testMenuBarInit");
		openNode(nodes, "MenuBar");
		waitOnLoad(this, testMenuBar);
	}
	
	function testMenuBar(app, panel){
		Utils.log("testMenuBar");
		var MouseEventRef = FD.getRef("flash.events.MouseEvent");
		var mouseDownEvent = FD.create(MouseEventRef, ["mouseDown"]);
		var mouseOverEvent = FD.create(MouseEventRef, ["mouseOver"]);
		var control = getChild(panel, "mx.controls::MenuBar");
    	var menuBarItems = control.menuBarItems();
    	for(var i = 0; i < menuBarItems.length; i++){
    		var item = FD.getRef(menuBarItems, i);
    		var data = item.data();
    		Utils.info(data.value);
    		if(data && data.hasChildNodes()){
    			item.dispatchEvent(mouseOverEvent); //Activate menu
    			item.dispatchEvent(mouseDownEvent);//Create and show popup menu
    			var menu = control.getMenuAt(i);
    			var menuItems = FD.getRef(menu, "rendererArray");
    			if(menuItems.length > 0){
    				var index = menuItems.length - 1;
    				var menuItem = menuItems[index][0];
    				var menuData = menuItem.data();
    				if(menuData.firstChild().hasChildNodes()){ //Sub Menu
    					menuItem.dispatchEvent(mouseOverEvent);
    					FD.getRef(menu, "openSubMenu", menuItem, false); //Execute mx::openSubMenu, false - skip return reference
    					Utils.pause(500); //Wait menu effect
    					selectMenuByIndex(menuItem.menu(), 0, control);
    				}else{
    					selectMenuByIndex(menu, index, control);
    				}
    			}
    			control.selectedIndex(-1);
    		}
    	}
		runNextTest(FlexExplorerMenuControls);
	}
	//Test MenuBar END
	
	//Test PopUpMenuButton BEGIN
	function testPopUpMenuButtonInit(){
		Utils.log("testPopUpMenuButtonInit");
		openNode(nodes, "PopUpMenuButton");
		waitOnLoad(this, testPopUpMenuButton);
	}
	
	function testPopUpMenuButton(app, panel){
		Utils.log("testPopUpMenuButton");
		var MouseEventRef = FD.getRef("flash.events.MouseEvent");
		var event = FD.create(MouseEventRef, ["mouseDown"]);
		var control = getChild(panel, "mx.controls::PopUpMenuButton");
		var total = control.dataProvider().length();		
		for(var i = 0; i < total; i++){
			control.open();
			var menu = FD.getRef(control, "getPopUp");
			menu.selectedIndex(i);
			Utils.pause(500);
			selectMenuByIndex(menu, i);
		}
		runNextTest(FlexExplorerMenuControls);
	}
	//Test PopUpMenuButton END
};
