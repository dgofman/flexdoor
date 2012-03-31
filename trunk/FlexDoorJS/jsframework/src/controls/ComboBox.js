/**
 * @author David Gofman
 */
 
function ComboBox(classType, className, extendType) 
{
	UIComponent.call(this, classType, className, extendType);
	this.dropdown = new List(List, "org.flexdoor.controls::List");
}

ComboBox.prototype.initialize = function(object, parent){
	UIComponent.prototype.initialize.call(this, object, parent);
	UIComponent.prototype.initialize.call(this.dropdown, object, parent);
};

ComboBox.prototype = new UIComponent(ComboBox, "org.flexdoor.controls::ComboBox");
ComboBox.prototype.Get = function(){ return this; };
ComboBox.prototype.required = function(){
	return ["org.flexdoor.controls::List"];
};

//Class Functions
ComboBox.prototype.open = function(){
	this.app.doFlexUiEvent('Open', this.monkeyId, 'automationName', [null], '', '', '10', '1000', false);
};

ComboBox.prototype.selectedItem = function(value){
	this.dropdown.selectedItem(value);
};