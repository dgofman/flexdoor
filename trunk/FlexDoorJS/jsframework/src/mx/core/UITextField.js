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

function UITextField(classType, extendType) 
{
	UIComponent.call(this, classType, extendType);

	this.enableIME = function() {
		return this.getter("enableIME");
	};
	
	this.htmlText = function() { /* getter and setter */
		return this.property("htmlText", arguments, function(value){
			this.fireEvent($Event.Create($Event.CHANGE));
		});
	};
	
	this.ignorePadding = function(){ /* getter and setter */
		return this.property("ignorePadding", arguments);
	};
	
	this.imeMode = function(){ /* getter and setter */
		return this.property("imeMode", arguments);
	};
	
	this.nonZeroTextHeight = function() {
		return this.getter("nonZeroTextHeight");
	};
	
	this.text = function() { /* getter and setter */
		return this.property("text", arguments, function(value){
			this.fireEvent($Event.Create($Event.CHANGE));
		});
	};
	
	this.textColor = function(){ /* getter and setter */
		return this.property("textColor", arguments);
	};
	
	this.textHeight = function(){ /* getter and setter */
		return this.property("textHeight", arguments);
	};
	
	this.textWidth = function(){ /* getter and setter */
		return this.property("textWidth", arguments);
	};
	
	this.textInteractionMode = function(){ /* getter and setter */
		return this.property("textInteractionMode", arguments);
	};
	
	//API's
	this.getTextStyles = function() {
		return this.execute("getTextStyles");
	};
	
	this.getUITextFormat = function() {
		return this.execute("getUITextFormat");
	};
	
	this.insertXMLText = function(beginIndex, endIndex, richText, pasting) {
		if(pasting === undefined) pasting = false;
		this.execute("insertXMLText", beginIndex, endIndex, richText, pasting);
	};
	
	this.replaceText = function(beginIndex, endIndex, newText) {
		this.execute("replaceText", beginIndex, endIndex, newText);
	};
	
	this.setColor = function(color) {
		this.execute("setColor", color);
	};
	
	this.setTextFormat = function(format, beginIndex, endIndex) {
		if(beginIndex === undefined) beginIndex = -1;
		if(endIndex === undefined) endIndex = -1;
		this.execute("setTextFormat", format, beginIndex, endIndex);
	};
	
	this.truncateToFit = function(truncationIndicator) {
		return this.execute("truncateToFit", truncationIndicator);
	};
}

UITextField.prototype.Extends = function(){
	UITextField.prototype = new UIComponent(UITextField);
};
UITextField.Get = function(o){
	var ref = this;
	ref = UIComponent.Get(o, UITextField);
	return ref;
};
UITextField.Is = function(target) { return target instanceof UITextField; };

function mx_core_UITextField(){};