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
System.TIMERS = {};

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

System.timer = function(timeInterval, func, delay){
	if(timeInterval == undefined){
		System.TIMERS[timeInterval = setInterval(function(){
			if(System.TIMERS[timeInterval] != undefined)
				func();
		}, delay)] = new Date();
		return timeInterval;
	}else{
		clearInterval(timeInterval);
		delete System.TIMERS[timeInterval];
	}
};

System.killTimers = function(){
	for(var timeInterval in System.TIMERS)
		clearInterval(timeInterval);
	System.TIMERS = {};
};

System.callLater = function(target, func, delay, params){
	if(delay == undefined) delay = TestEvent.TEST_DELAY;
	var timer = System.timer(null, function(){
		System.timer(timer);
		func.apply(target, params);
	}, delay);
};

System.waitFor = function(target, func, delay, timeout, params){
	if(delay == undefined) delay = TestEvent.TEST_DELAY;
	var timer1 = System.timer(null, function(){ 
		if(func.apply(target, params) == true){
			System.timer(timer1);
			System.timer(timer2);
		}	
	}, delay);
	var timer2 = System.timer(null, function(){
		System.timer(interval1);
		System.timer(interval2);
		throw new Error("Timeout!!!");
	}, timeout);
};

System.getLocator = function(path){
	var flash = Application.application.flash;
	var object = flash.getLocator(path);
	return System.deserialize(object);
};

System.findById = function(refId, includeRef){
	includeRef = (includeRef == undefined ? true : includeRef);
	var flash = Application.application.flash;
	var object = flash.findById(refId);
	return System.deserialize(object, includeRef);
};

System.find = function(parent, id, index, visibleOnly, includeRef){
	includeRef = (includeRef == undefined ? true : includeRef);
	var flash = Application.application.flash;
	var object = flash.find(parent._refId, id, index, visibleOnly, includeRef);
	return System.deserialize(object, parent);
};

System.getClass = function(className){
	var flash = Application.application.flash;
	var object = flash.getClass(className);
	return System.deserialize(object);
};

System.getChildByName = function(parent, name, includeRef){
	includeRef = (includeRef == undefined ? true : includeRef);
	var flash = Application.application.flash;
	var object = flash.getChildByName(parent._refId, name, includeRef);
	return System.deserialize(object, parent);
};

System.getChildByType = function(parent, classType, index, visibleOnly, includeRef){
	includeRef = (includeRef == undefined ? true : includeRef);
	var flash = Application.application.flash;
	var object = flash.getChildByType(parent._refId, classType, index, visibleOnly, includeRef);
	return System.deserialize(object, parent);
};

System.setter = function(target, command, value){
	var flash = Application.application.flash;
	flash.setter(target._refId, command, value);
};

System.getter = function(target, command, includeRef){
	includeRef = (includeRef == undefined ? true : includeRef);
	var flash = Application.application.flash;
	var object = flash.getter(target._refId, command, includeRef);
	return System.deserialize(object);
};

System.execute = function(target, command, values, includeRef){
	includeRef = (includeRef == undefined ? true : includeRef);
	if(values != null && !(values instanceof Array)) values = [values];
	var flash = Application.application.flash;
	var object = flash.execute(target._refId, command, values, includeRef);
	return System.deserialize(object);
};

System.refValue = function(target, keys, includeRef){
	includeRef = (includeRef == undefined ? true : includeRef);
	var flash = Application.application.flash;
	var object = flash.refValue(target._refId, keys, includeRef);
	return System.deserialize(object);
};

System.create = function(extendType, args){
	if(args != null && !(args instanceof Array)) args = [args];
	var flash = Application.application.flash;
	var object = flash.create(extendType, args);
	return System.deserialize(object);
};

//type is optional get any event types if type is undefined
//listenerId - is not remove event dispatcher hook
System.dispatchEventHook = function(target, listenerId, type){
	var flash = Application.application.flash;
	flash.dispatchEventHook(target._refId, listenerId, type);
};

System.addEventListener = function(target, type, listenerId, useWeakReference, useCapture, priority){
	var flash = Application.application.flash;
	flash.addEventListener(target._refId, type, listenerId, useWeakReference, useCapture, priority);
};

System.removeEventListener = function(target, type, listenerId, useCapture){
	var flash = Application.application.flash;
	flash.removeEventListener(target._refId, type, listenerId, useCapture);
};

System.dispatchEvent = function(target, event){
	var flash = Application.application.flash;
	return flash.dispatchEvent(target._refId, event._refId);
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
		ids.push(arguments[i]._refId);
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
		return {type:"FUNCTION_TYPE", refId:object._refId};
	}else if( object instanceof EventDispatcher ||
		object instanceof flash_events_Event || 
		(object != undefined && typeof(object) == "object" && 
			!isNaN(object._refId) && object._extendTypes instanceof Array)){
		return {type:"CLASS_TYPE", refId:object._refId};
	}else{
		return object;
	}
};

System.deserialize = function(object, parent){
	if(object != null && object["extendTypes"] instanceof Array){
		for(var i = 0; object.extendTypes.length; i++){
			var extendType = object.extendTypes[i];
			if(extendType == "Function")
				return new fd_Function(object);
			if(extendType == "Object")
				return isNaN(object._refId) ? System.json(object.ref) : object;
			var pair = extendType.split("::");
			var className = pair[0];
			if(pair.length == 2)
				className = pair[1];
			if(className == "Error"){
				Assert.fail(object.stackTrace);
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
					object.ref = System.json(object.ref);
					component.Initialize(object, parent);
				}
				return component;
			}
		}
	}else if(object instanceof Array){
		for(var i = 0; i < object.length; i++)
			object[i].ref = System.json(object[i].ref);
	}
	return object;
};

System.json = function(value){
	var json = jQuery.parseJSON(value);
	return (typeof(json) == "object" ? json : value);
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

function fd_System(){};