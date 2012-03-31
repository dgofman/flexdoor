/**
 * @author David Gofman
 */
 
function EventDispatcher() 
{
	this.events = [];
}

EventDispatcher.prototype.toString = function() {
	return "org.flexdoor.events::EventDispatcher";
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