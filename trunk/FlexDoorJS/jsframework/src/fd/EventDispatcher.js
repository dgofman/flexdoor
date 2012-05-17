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
	this._id = object.id;
	this._name = object.name;
	this._refId = object.refId;
	this._extendTypes = object.extendTypes;
	this._parent = parent;
	this.ref = object.ref;
};
EventDispatcher.prototype.toString = function() {
	return "flash.events::EventDispatcher";
};


//Class Functions
EventDispatcher.Get = function(o, classType){
	var ref = this;
	if(o == undefined)
		Assert.fail("TypeError: Error #101: Cannot access a property or method of a null object reference");
	if( (classType != undefined && o instanceof classType) || o instanceof EventDispatcher ){
		ref = o;
	}else{
		Assert.fail("TypeError: Error #102: Type Coercion failed: cannot convert " + o.toString() + " to " + classType.FLEX_TYPE);
	}
	return ref;
};
EventDispatcher.Is = function(target) { return target instanceof EventDispatcher; };

EventDispatcher.prototype.fireEvent = function(event){
	System.fireEvent(this, event);
};

EventDispatcher.prototype.property = function(command, args, postEventFunction){
	if(args != undefined && args.length > 0){
		var value = args[0]; //setter arguments
		this.setter(command, value);
		if(args[1] instanceof Function){
			args[1].apply(this, [value]);
		}else if(postEventFunction instanceof Function){
			postEventFunction.apply(this, [value]);
		}
	}else{
		return this.getter(command);
	}
};

EventDispatcher.prototype.find = function(id, index, visibleOnly) {
	if(index == undefined) index = 0;
	if(visibleOnly == undefined) visibleOnly = true;
	return System.find(this, id, index, visibleOnly);
};

EventDispatcher.prototype.findById = function(refId) {
	return System.findById(refId);
};

EventDispatcher.prototype.getChildByName = function(name) {
	return System.getChildByName(this, name);
};

EventDispatcher.prototype.getChildByType = function(classType, index, visibleOnly) {
	if(index == undefined) index = 0;
	if(visibleOnly == undefined) visibleOnly = true;
	return System.getChildByType(this, classType, index, visibleOnly);
};

EventDispatcher.prototype.setter = function(command, value){
	System.setter(this, command, this.serialize(value));
};

EventDispatcher.prototype.getter = function(command){
	return System.getter(this, command);
};

EventDispatcher.prototype.execute = function(command){
	return System.execute(this, command, System.getParams(arguments, 1, true));
};

EventDispatcher.prototype.refValue = function(refObject){
	return System.refValue(refObject, System.getParams(arguments, 1));
};

EventDispatcher.prototype.create = function(className){
	return System.create(className, System.getParams(arguments, 1, true));
};

EventDispatcher.prototype.createFunctionByName = function(classType, functionName){
	if( classType instanceof Function && 
		classType[functionName] instanceof Function){
		//Create ActionScript function and map to JS function via ExternalInterface
		var className = classType.toString().match(/function\s*(\w+)/)[1];
		var func = $Function.Get(System.createFunction(className, functionName));
		func.Initialize(classType, functionName);
		classType[functionName].refFunc = func;
		return func;
	}
};

EventDispatcher.prototype.createFunction = function(){
	var listener = undefined;
	if(arguments.length > 0)
		listener = arguments[0];

	if(listener instanceof Function){
		var classType = EventDispatcher;
		var functionName = "FunctionHandler" + new Date().getTime();
		classType[functionName] = listener;
		return this.createFunctionByName(classType, functionName);
	}
	return listener;
};

EventDispatcher.prototype.dispatchEventHook = function(listener, target, type){
	var asFunction = null;
	if(listener instanceof fd_Function){
		asFunction = listener;
	}else{
		asFunction = this.createFunction(function(event){
			listener.apply(target, [System.deserialize(event)]);
		});
	}
	System.dispatchEventHook(this, this.serialize(asFunction), type);
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
				arguments[i] = System.deserialize(arguments[i], this);
			listener.refFunc = asFunction;
			listener.apply(target, arguments);
		});
	}
	asFunction._isEventListener = true;
	System.addEventListener(this, type, this.serialize(asFunction), useCapture, priority, useWeakReference);
};

EventDispatcher.prototype.removeEventListener = function(type, listener, useCapture){
	if(listener instanceof Function && listener.refFunc instanceof fd_Function){
		if(useCapture == undefined) useCapture = false;
		var func = $Function.Get(listener.refFunc);
		System.removeEventListener(this, type, func._refId, useCapture);
		func.destroy();
	}
};

EventDispatcher.prototype.dispatchEvent = function(event){
	return System.dispatchEvent(this, event);
};

EventDispatcher.prototype.serialize = function(object){
	return System.serialize(object);
};

function fd_EventDispatcher(){};
function flash_events_EventDispatcher(){};
flash_events_EventDispatcher.prototype = new EventDispatcher();