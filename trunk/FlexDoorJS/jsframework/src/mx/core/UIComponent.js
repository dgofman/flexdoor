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

	this.visible = function(value){
		return this.property("visible", value);
	};

	this.includeInLayout = function(value){
		return this.property("includeInLayout", value);
	};

	this.fireEvent = function(event, value, returnValue){
		if(value !== undefined) System.fireEvent(this, event);
		return returnValue;
	};
}

UIComponent.prototype = new EventDispatcher();
UIComponent.Get = function(o, classType){
	if(o == undefined)
		throw new Error("TypeError: Error #101: Cannot access a property or method of a null object reference");
	if(classType == undefined)
		classType = UIComponent;
	if(o instanceof classType){
		return o; 
	}else{
		throw new Error("TypeError: Error #102: Type Coercion failed: cannot convert " + o.toString() + " to " + classType.FLEX_TYPE);
	}
};