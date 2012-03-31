/**
 * @author David Gofman
 */
 
function Static() {
	throw new Error("DO NOT CREATE THIS OBJECT");
}

//Static API's and Variables
Static.CLASSES = [];
Static.LOADING = {};
Static.LOAD_DELAY;
Static.INIT_PHASE = 0;

Static.getFlash = function(flashPlayerId){
	if(navigator.appName.indexOf ("Microsoft") != -1) {
		return window[flashPlayerId];
	}else{
		return document[flashPlayerId];
	}
};

Static.find = function(parent, id, index, visibleOnly){
	var flash = Application.application.flash;
	var object = flash.find(parent.refId, id, index, visibleOnly);
	return Static.objectToClass(object, parent);
};

Static.getChildByName = function(parent, name){
	var flash = Application.application.flash;
	var object = flash.getChildByName(parent.refId, name);
	return Static.objectToClass(object, parent);
};

Static.getChildByType = function(parent, classType, index, visibleOnly){
	var flash = Application.application.flash;
	var object = flash.getChildByType(parent.refId, classType, index, visibleOnly);
	return Static.objectToClass(object, parent);
};

Static.setter = function(comp, command, value){
	var flash = Application.application.flash;
	flash.setter(comp.refId, command, value);
};

Static.getter = function(comp, command){
	var flash = Application.application.flash;
	return flash.getter(comp.refId, command);
};

Static.objectToClass = function(object, parent){
	for(var i = 0; object.extendTypes.length; i++){
		var extendType = object.extendTypes[i];
		var className = extendType.split("::")[1];
		if(typeof(window[className]) == "function"){
			var classType = window[className];
			var component = new classType(classType, classType.className, extendType);
			if(component instanceof UIComponent)
				component.initialize(object, parent);
			return component;
		}
	}
	return object;
};

Static.trace = function(message, level) {
	if(level == undefined)
		level = "log";
	if(window['console'] != undefined)
		window['console'][level](message);
};

Static.startTestCase = function(index){
	Static.testCaseIndex = index;
	if(FlexDoor.CLASSES.length > index)
		new FlexDoor.CLASSES[index]();
};

Static.loadQUnit = function(){
	var index = 0;
	function loadHandler(){
		if(++index == 3)
			Static.doTestLoader();
	};
	FlexDoor.include("jquery-ui", "automation-js/jquery-ui-1.8.16.custom.min.js", loadHandler);
	FlexDoor.include("qunit-ui", "automation-js/qunit.js", loadHandler);
	FlexDoor.include("qunit-css", "automation-js/qunit.css", loadHandler, true);
};

Static.doTestLoader = function(){
	$(document.body).append($("<div id='draggable' style='width: 600px; height: 450px; padding: 0.5em; position:absolute; top:0;right:0;display:none;'>" +
							"<h1 id='qunit-header'>Test Runner</h1>" + 
							"<h2 id='qunit-banner'></h2>" +
							"<div id='qunit-testrunner-toolbar'></div>" + 
							"<h2 id='qunit-userAgent'></h2>" +
							"<ol id='qunit-tests'></ol>" +
							"<input type='submit' name='runTest' id='runTest' value='Run Tests'/></div>"));

	$("#draggable").draggable();
	$("#draggable").show();

	$('#runTest').click( function() {
		Static.startTestCase(0);
	});
	
	if(QUnit.config.autostart == undefined){
		QUnit.load();
	}
};