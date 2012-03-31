/**
 * @author David Gofman
 */
 
function TextInput(classType, className, extendType) 
{
	UIComponent.call(this, classType, className, extendType);
}

TextInput.prototype = new UIComponent(TextInput, "org.flexdoor.controls::TextInput");
TextInput.prototype.Get = function(){ return this; };

//Class Functions
TextInput.prototype.setText = function(value){
	this.setter("text", value);
};