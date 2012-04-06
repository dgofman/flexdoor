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
	this.events = [];
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

EventDispatcher.prototype.addEventListener = function(event, callback){
	this.events[event] = this.events[event] || [];
	if(this.events[event]) {
		this.events[event].push(callback);
	}
};

EventDispatcher.prototype.removeEventListener = function(event, callback){
	if (this.events[event]) {
		var listeners = this.events[event];
		for (var i = listeners.length - 1; i >= 0; --i){
			if (listeners[i] == callback) {
				listeners.splice(i, 1);
				return true;
			}
		}
	}
	return false;
};

EventDispatcher.prototype.dispatchEvent = function(event){
	if (this.events[event]) {
		var listeners = this.events[event], len = listeners.length;
		while(len--) {
			listeners[len](this);
		}
	}
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

EventDispatcher.prototype.dispatch = function(eventId){
	return Static.dispatch(this, eventId);
};

EventDispatcher.prototype.serialize = function(object){
	if( object instanceof Function ){
		EventDispatcher.FunctionHandler = object;
		return {type:"FUNCTION_TYPE", refId:object.refId};
	}else if( object instanceof EventDispatcher ||
		object instanceof flash_events_Event){
		return {type:"CLASS_TYPE", refId:object.refId};
	}else{
		return object;
	}
};

EventDispatcher.FunctionHandler = null;