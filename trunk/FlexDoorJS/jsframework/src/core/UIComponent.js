/**
 * @author David Gofman
 */
 
function UIComponent(classType, className, extendType) 
{
	if(classType == undefined)
		debugger;
	classType.className = className;
	classType.prototype.constructor = classType;
	classType.prototype.toString  = function(){
		return className;
	};
	classType.prototype.type  = function(){
		return extendType;
	};
	classType.Get = function(o){ 
		if(o instanceof classType){
			return o; 
		}else{
			throw new Error("TypeError: Error #101: Type Coercion failed: cannot convert " + o.toString() + " to " + className);
		}
	};
}

UIComponent.prototype = new EventDispatcher();
UIComponent.prototype.Get = function(){ return this; };
UIComponent.Get = function(o){ return o; };

UIComponent.prototype.initialize = function(object, parent){
	this.id = object.id;
	this.name = object.name;
	this.refId = object.refId;
	this.classTypes = object.extendTypes;
	this.parent = parent;
};

//Class Functions
UIComponent.prototype.find = function(id, index, visibleOnly) {
	if(index == undefined) index = 0;
	if(visibleOnly == undefined) visibleOnly = true;
	return Static.find(this, id, index, visibleOnly);
};

UIComponent.prototype.getChildByName = function(name) {
	return Static.getChildByName(this, name);
};

UIComponent.prototype.getChildByType = function(classType, index, visibleOnly) {
	if(index == undefined) index = 0;
	if(visibleOnly == undefined) visibleOnly = true;
	return Static.getChildByType(this, classType, index, visibleOnly);
};

UIComponent.prototype.setter = function(command, value){
	Static.setter(this, command, value);
};

UIComponent.prototype.getter = function(command){
	Static.getter(this, command);
};