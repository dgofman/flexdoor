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