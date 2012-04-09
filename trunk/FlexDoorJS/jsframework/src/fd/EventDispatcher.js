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

function EventDispatcher() 
{
}

EventDispatcher.prototype.Extends = function() {};
EventDispatcher.prototype.Initialize = function(object, parent){
	this.id = object.id;
	this.name = object.name;
	this.refId = object.refId;
	this.extendTypes = object.extendTypes;
	this.parent = parent;
};
EventDispatcher.prototype.toString = function() {
	return "flash.events::EventDispatcher";
};


//Class Functions
EventDispatcher.Get = function(o, classType){
	var ref = this;
	ref = UIComponent.Get(o, EventDispatcher);
	return ref;
};

EventDispatcher.prototype.find = function(id, index, visibleOnly) {
	if(index == undefined) index = 0;
	if(visibleOnly == undefined) visibleOnly = true;
	return Static.find(this, id, index, visibleOnly);
};

EventDispatcher.prototype.findById = function(refId) {
	return Static.findById(refId);
};

EventDispatcher.prototype.getChildByName = function(name) {
	return Static.getChildByName(this, name);
};

EventDispatcher.prototype.getChildByType = function(classType, index, visibleOnly) {
	if(index == undefined) index = 0;
	if(visibleOnly == undefined) visibleOnly = true;
	return Static.getChildByType(this, classType, index, visibleOnly);
};

EventDispatcher.prototype.setter = function(command, value){
	Static.setter(this, command, this.serialize(value));
};

EventDispatcher.prototype.getter = function(command){
	return Static.getter(this, command);
};

EventDispatcher.prototype.property = function(command, value){
	if(value === undefined){
		return this.getter(command);
	}else{
		this.setter(command, value);
	}
};

EventDispatcher.prototype.execute = function(command){
	var params = [];
	for(var i = 1; i < arguments.length; i++)
		params.push(this.serialize(arguments[i]));
	return Static.execute(this, command, params);
};

EventDispatcher.prototype.create = function(className){
	var params = [];
	for(var i = 1; i < arguments.length; i++)
		params.push(this.serialize(arguments[i]));
	return Static.create(className, params);
};

EventDispatcher.prototype.createFunctionByName = function(classType, functionName){
	if( classType instanceof Function && 
		classType[functionName] instanceof Function){
		//Create ActionScript function and map to JS function via ExternalInterface
		var className = classType.toString().match(/function\s*(\w+)/)[1];
		var func = $Function.Get(Static.createFunction(className, functionName));
		func.Initialize(classType, functionName);
		classType[functionName].refFunc = func;
		return func;
	}
};

EventDispatcher.prototype.createFunction = function(listener){
	if(listener != undefined && listener instanceof Function){
		var classType = EventDispatcher;
		var functionName = "FunctionHandler" + new Date().getTime();
		classType[functionName] = listener;
		return this.createFunctionByName(classType, functionName);
	}
	return listener;
};

EventDispatcher.prototype.addEventListener = function(type, listener, target, useWeakReference, useCapture, priority){
	var asFunction = null;
	if(useWeakReference == undefined) useWeakReference = false;
	if(useCapture == undefined) useCapture = false;
	if(priority == undefined) priority = 0;
	if(listener instanceof fd_Function){
		asFunction = listener;
	}else{
		asFunction = this.createFunction(function(){
			for(var i = 0; i < arguments.length; i++)
				arguments[i] = Static.deserialize(arguments[i], this);
			listener.refFunc = asFunction;
			listener.apply(target, arguments);
		});
	}
	Static.addEventListener(this, type, this.serialize(asFunction), useCapture, priority, useWeakReference);
};

EventDispatcher.prototype.removeEventListener = function(type, listener, useCapture){
	if(listener instanceof Function && listener.refFunc instanceof fd_Function){
		if(useCapture == undefined) useCapture = false;
		var func = $Function.Get(listener.refFunc);
		Static.removeEventListener(this, type, func.refId, useCapture);
		func.destroy();
	}
};

EventDispatcher.prototype.dispatchEvent = function(eventId){
	return Static.dispatchEvent(this, eventId);
};

EventDispatcher.prototype.serialize = function(object){
	return Static.serialize(object);
};