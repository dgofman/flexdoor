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

function UIComponent(classType, extendType) 
{
	if(classType == undefined)
		throw new Error("Class Type is undefined");

	classType.FLEX_TYPE = extendType;
	classType.prototype.constructor = classType;
	classType.prototype.toString  = function(){
		return extendType;
	};
}

UIComponent.prototype = new EventDispatcher();
UIComponent.Get = function(o, classType){
	if(o instanceof classType){
		return o; 
	}else{
		throw new Error("TypeError: Error #101: Type Coercion failed: cannot convert " + o.toString() + " to " + classType.FLEX_TYPE);
	}
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
	return Static.getter(this, command);
};

UIComponent.prototype.execute = function(command){
	var params = [];
	for(var i = 1; i < arguments.length; i++)
		params.push(arguments[i]);
	return Static.execute(this, command, params);
};

UIComponent.prototype.create = function(className){
	var params = [];
	for(var i = 1; i < arguments.length; i++)
		params.push(arguments[i]);
	return Static.create(className, params);
};

UIComponent.prototype.dispatch = function(event){
	return Static.dispatch(this, event);
};