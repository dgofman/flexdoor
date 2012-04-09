/**
 * FlexDoor Automation Library
 *
 * Copyright � 2012 David Gofman.
 *   Permission is granted to copy, and distribute verbatim copies
 *   of this license document, but changing it is not allowed.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS 'AS IS' 
 * AND ANY EXPRESSED OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT
 * OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
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

Static.delegate = function(target, func, params){
	var f = function() { 
		return func.apply(target, params);
	};
	f.func = func;
	return f;
};

Static.callLater = function(target, func, delay, params){
	if(delay == undefined) delay = FlexDoor.TEST_DELAY_INTERVAL;
	setTimeout(function(){ func.apply(target, params); }, delay);
};

Static.find = function(parent, id, index, visibleOnly){
	var flash = Application.application.flash;
	var object = flash.find(parent.refId, id, index, visibleOnly);
	return Static.deserialize(object, parent);
};

Static.findById = function(refId){
	var flash = Application.application.flash;
	var object = flash.findById(refId);
	return Static.deserialize(object);
};

Static.getChildByName = function(parent, name){
	var flash = Application.application.flash;
	var object = flash.getChildByName(parent.refId, name);
	return Static.deserialize(object, parent);
};

Static.getChildByType = function(parent, classType, index, visibleOnly){
	var flash = Application.application.flash;
	var object = flash.getChildByType(parent.refId, classType, index, visibleOnly);
	return Static.deserialize(object, parent);
};

Static.setter = function(target, command, value){
	var flash = Application.application.flash;
	flash.setter(target.refId, command, value);
};

Static.getter = function(target, command){
	var flash = Application.application.flash;
	return Static.deserialize(flash.getter(target.refId, command));
};

Static.execute = function(target, command, values){
	if(values != null && !(values instanceof Array)) values = [values];
	var flash = Application.application.flash;
	return Static.deserialize(flash.execute(target.refId, command, values));
};

Static.create = function(extendType, args){
	if(args != null && !(args instanceof Array)) args = [args];
	var flash = Application.application.flash;
	return Static.deserialize(flash.create(extendType, args));
};

Static.addEventListener = function(target, type, listenerId, useWeakReference, useCapture, priority){
	var flash = Application.application.flash;
	flash.addEventListener(target.refId, type, listenerId, useWeakReference, useCapture, priority);
};

Static.removeEventListener = function(target, type, listenerId, useCapture){
	var flash = Application.application.flash;
	flash.removeEventListener(target.refId, type, listenerId, useCapture);
};

Static.dispatchEvent = function(target, event){
	var flash = Application.application.flash;
	return flash.dispatchEvent(target.refId, event.refId);
};

Static.refIds = function(){
	var flash = Application.application.flash;
	return flash.refIds();
};

Static.releaseIds = function(ids, except){
	if(except == undefined) except = false;
	var flash = Application.application.flash;
	return flash.releaseIds(ids, except);
};

Static.filterFunction = function(collection, func){
	var filterFunc = collection.getFilterFunction();
	if(filterFunc != null)
		filterFunc = $Function.Get(filterFunc);
	var asFunction = $Function.Get(collection.createFunction(func));
	collection.setFilterFunction(asFunction);
	collection.refresh();

	//return original filter function
	collection.setFilterFunction(filterFunc);
	collection.refresh();

	asFunction.destroy();
	if( filterFunc != null)
		filterFunc.destroy();
};

Static.createFunction = function(classType, functionName){
	var flash = Application.application.flash;
	return Static.deserialize(flash.createFunction(classType, functionName));
};

Static.serialize = function(object){
	if( object instanceof fd_Function ){
		return {type:"FUNCTION_TYPE", refId:object.refId};
	}else if( object instanceof EventDispatcher ||
		object instanceof flash_events_Event){
		return {type:"CLASS_TYPE", refId:object.refId};
	}else{
		return object;
	}
};

Static.deserialize = function(object, parent){
	if(object != null && object["extendTypes"] != undefined){
		for(var i = 0; object.extendTypes.length; i++){
			var extendType = object.extendTypes[i];
			if(extendType == "Function")
				return new fd_Function(object);
			if(extendType == "Object")
				return object.ref;
			var pair = extendType.split("::");
			var className = pair[0];
			if(pair.length == 2)
				className = pair[1];
			if(className == "ReferenceError" || className == "Error"){
				Static.warn(object.stackTrace);
				throw new ReferenceError(object.message);
			}
			var classType = FlexDoor.classType(extendType);
			if(classType != undefined){
				if(classType.prototype.Extends != undefined &&
				 !(classType.prototype instanceof UIComponent)){
					classType.prototype.Extends();
				}
				var component = new classType(classType, extendType);
				if(component instanceof EventDispatcher ||
					component.Initialize instanceof Function){
					component.Initialize(object, parent);
				}
				return component;
			}
		}
	}
	return object;
};

Static.log = function(message) {
	Static.trace(message, "log");
};
Static.warn = function(message) {
	Static.trace(message, "warn");
};
Static.info = function(message) {
	Static.trace(message, "info");
};
Static.error = function(message) {
	Static.trace(message, "error");
};
Static.trace = function(message, level) {
	if(level == undefined)
		level = "log";
	if(window['console'] != undefined)
		window['console'][level](message);
};

Static.startTestCase = function(index){
	Static.testCaseIndex = index;
	if(FlexDoor.TEST_CASES.length > index)
		new FlexDoor.TEST_CASES[index]();
};

Static.loadQUnit = function(){
	var index = 0;
	function loadHandler(){
		if(++index == 3)
			Static.doTestLoader();
	};
	FlexDoor.include("jquery-ui", "jquery/jquery.ui.js", loadHandler);
	FlexDoor.include("qunit-js", "qunit.js", loadHandler);
	FlexDoor.include("qunit-css", "qunit.css", loadHandler);
};

Static.doTestLoader = function(){
	$(document.body).append($("<div id='draggable' style='width: 600px; height: 450px; padding: 0.5em; position:absolute; top:0;right:0;display:none;'>" +
							"<h1 id='qunit-header'>Test Runner</h1>" + 
							"<h2 id='qunit-banner'></h2>" +
							"<div id='qunit-testrunner-toolbar'></div>" + 
							"<div align='center' style='background-color:#eee'>" + 
							"<input id='runTest' type='button' value='Run Tests'/></div>" + 
							"<h2 id='qunit-userAgent'></h2>" +
							"<ol id='qunit-tests'></ol></div>"));

	$("#draggable").draggable();
	$("#draggable").show();

	$('#runTest').click( function() {
		Static.startTestCase(0);
	});
	
	if(QUnit.config.autostart == undefined){
		QUnit.load();
	}
};