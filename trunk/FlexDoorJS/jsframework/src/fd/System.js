/**
 * FlexDoor Automation Library
 *
 * Copyright © 2012 David Gofman.
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

function System() {
	throw new Error("DO NOT CREATE THIS OBJECT");
}

//Static API's and Variables
System.CLASSES = [];
System.LOADING = {};
System.LOAD_DELAY;
System.INIT_PHASE = 0;

System.getFlash = function(flashPlayerId){
	if(document.embeds && document.embeds[flashPlayerId]){ //FireFox, Chrome, Opera
		return document.embeds[flashPlayerId]; 
	}else if(window.document[flashPlayerId]){ //IE
		return window.document[flashPlayerId];
	}else{ //Others
		return document.getElementById(flashPlayerId);
	}
};

System.delegate = function(target, func, arrayParams){
	var f = function() { 
		return func.apply(target, arrayParams);
	};
	f.func = func;
	return f;
};

System.getParams = function(args, index, isSerializable){
	if(index == undefined) index = 0;
	var params = [];
	if(args.length > index){
		for(var i = index; i < args.length; i++){
			if(isSerializable == true){
				params.push(System.serialize(args[i]));
			}else{
				params.push(args[i]);
			}
		}
	}
	return params;
};

System.callLater = function(target, func, delay, params){
	if(delay == undefined) delay = FlexDoor.TEST_DELAY_INTERVAL;
	setTimeout(function(){ func.apply(target, params); }, delay);
};

System.waitFor = function(target, func, delay, timeout, params){
	if(delay == undefined) delay = FlexDoor.TEST_DELAY_INTERVAL;
	var interval1 = setInterval(function(){ 
		if(func.apply(target, params) == true){
			clearInterval(interval1);
			clearInterval(interval2);
		}	
	}, delay);
	var interval2 = setInterval(function(){
		clearInterval(interval1);
		clearInterval(interval2);
		throw new Error("Timeout!!!");
	}, timeout);
};

System.find = function(parent, id, index, visibleOnly, includeRef){
	includeRef = (includeRef == undefined ? true : includeRef);
	var flash = Application.application.flash;
	var object = flash.find(parent.refId, id, index, visibleOnly, includeRef);
	return System.deserialize(object, parent);
};

System.findById = function(refId, includeRef){
	includeRef = (includeRef == undefined ? true : includeRef);
	var flash = Application.application.flash;
	var object = flash.findById(refId);
	return System.deserialize(object, includeRef);
};

System.getClass = function(className){
	var flash = Application.application.flash;
	var object = flash.getClass(className);
	return System.deserialize(object);
};

System.getChildByName = function(parent, name, includeRef){
	includeRef = (includeRef == undefined ? true : includeRef);
	var flash = Application.application.flash;
	var object = flash.getChildByName(parent.refId, name, includeRef);
	return System.deserialize(object, parent);
};

System.getChildByType = function(parent, classType, index, visibleOnly, includeRef){
	includeRef = (includeRef == undefined ? true : includeRef);
	var flash = Application.application.flash;
	var object = flash.getChildByType(parent.refId, classType, index, visibleOnly, includeRef);
	return System.deserialize(object, parent);
};

System.setter = function(target, command, value){
	var flash = Application.application.flash;
	flash.setter(target.refId, command, value);
};

System.getter = function(target, command, includeRef){
	includeRef = (includeRef == undefined ? true : includeRef);
	var flash = Application.application.flash;
	var object = flash.getter(target.refId, command, includeRef);
	return System.deserialize(object);
};

System.execute = function(target, command, values){
	if(values != null && !(values instanceof Array)) values = [values];
	var flash = Application.application.flash;
	var object = flash.execute(target.refId, command, values);
	return System.deserialize(object);
};

System.create = function(extendType, args){
	if(args != null && !(args instanceof Array)) args = [args];
	var flash = Application.application.flash;
	var object = flash.create(extendType, args);
	return System.deserialize(object);
};

System.addEventListener = function(target, type, listenerId, useWeakReference, useCapture, priority){
	var flash = Application.application.flash;
	flash.addEventListener(target.refId, type, listenerId, useWeakReference, useCapture, priority);
};

System.removeEventListener = function(target, type, listenerId, useCapture){
	var flash = Application.application.flash;
	flash.removeEventListener(target.refId, type, listenerId, useCapture);
};

System.dispatchEvent = function(target, event){
	var flash = Application.application.flash;
	return flash.dispatchEvent(target.refId, event.refId);
};

System.refIds = function(){
	var flash = Application.application.flash;
	return flash.refIds();
};

System.releaseIds = function(ids, except){
	if(except == undefined) except = false;
	var flash = Application.application.flash;
	return flash.releaseIds(ids, except);
};

System.releaseItems = function(){
	var ids = [];
	for(var i = 0; i < arguments.length; i++)
		ids.push(arguments[i].refId);
	return System.releaseIds(ids);
};

System.setSearchFunction = function(collection, func){
	var filterFunc = collection.filterFunction();
	if(filterFunc != null)
		filterFunc = $Function.Get(filterFunc);
	var asFunction = $Function.Get(collection.createFunction(func));
	collection.filterFunction(asFunction);
	collection.refresh();

	//return original filter function
	collection.filterFunction(filterFunc);
	collection.refresh();

	asFunction.destroy();
	if(filterFunc != null)
		filterFunc.destroy();
};

System.createFunction = function(classType, functionName){
	var flash = Application.application.flash;
	var object = flash.createFunction(classType, functionName);
	return System.deserialize(object);
};

System.serialize = function(object){
	if( object instanceof fd_Function ){
		return {type:"FUNCTION_TYPE", refId:object.refId};
	}else if( object instanceof EventDispatcher ||
		object instanceof flash_events_Event || 
		(object != undefined && typeof(object) == "object" && 
			!isNaN(object.refId) && object.extendTypes instanceof Array)){
		return {type:"CLASS_TYPE", refId:object.refId};
	}else{
		return object;
	}
};

System.deserialize = function(object, parent){
	if(object != null && object["extendTypes"] != undefined){
		for(var i = 0; object.extendTypes.length; i++){
			var extendType = object.extendTypes[i];
			if(extendType == "Function")
				return new fd_Function(object);
			if(extendType == "Object")
				return isNaN(object.refId) ? object.ref : object;
			var pair = extendType.split("::");
			var className = pair[0];
			if(pair.length == 2)
				className = pair[1];
			if(className == "Error"){
				System.warn(object.stackTrace);
				var classType = FlexDoor.classType(object.extendTypes[1]);
				if(classType == null) classType = Error;
				throw new classType(object.message);
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

System.fireEvent = function(target, event){
	var result = target.dispatchEvent(event);
	event.destory();
	return result;
};

System.log = function(message) {
	System.trace(message, "log");
};
System.warn = function(message) {
	System.trace(message, "warn");
};
System.info = function(message) {
	System.trace(message, "info");
};
System.error = function(message) {
	System.trace(message, "error");
};
System.trace = function(message, level) {
	if(level == undefined)
		level = "log";
	if(window['console'] != undefined)
		window['console'][level](message);
};

System.startTestCase = function(index){
	System.testCaseIndex = index;
	if(FlexDoor.TEST_CASES.length > index){
		new FlexDoor.TEST_CASES[index]();
	}else{
		module("DONE");
		test("Finished at: " +new Date().toLocaleString(), function(){});
	}
};

System.loadQUnit = function(){
	var index = 0;
	function assetsLoadHandler(){
		if(++index == 2)
			System.doTestLoader();
	};
	FlexDoor.include("QUnit", "qunit.js", assetsLoadHandler);
	FlexDoor.include("jQueryUI", "jquery/jquery.ui.js", assetsLoadHandler);

	if (document.createStyleSheet){
		document.createStyleSheet('http://code.jquery.com/qunit/qunit-git.css'); 
	}else{
		$('head').append('<link rel="stylesheet" href="http://code.jquery.com/qunit/qunit-git.css" type="text/css"/>');
	}
};

System.doTestLoader = function(){
	$(document.body).append($("<div id='draggable' style='width: 600px; padding: 0.5em; position:absolute; top:0;right:0;display:none;'>" +
							"<h1 id='qunit-header'>FlexDoor v" + FlexDoor.VERSION + "</h1>" +
							"<h5 id='qunit-banner'></h5>" +
							"<div id='qunit-testrunner-toolbar'></div>" + 
							"<div align='center' style='background-color:#eee'>" + 
							"<input id='runTest' type='button' value='Run Tests'/>&nbsp;" +
							"<h2 id='qunit-userAgent'></h2>" +
							"<ol id='qunit-tests'></ol></div>"));

	QUnit.load();

	$("#draggable").show();
	$("#draggable").draggable();

	$("#runTest").click( function() {
		System.startTestCase(0);
	});
};
fd_System = function(){};