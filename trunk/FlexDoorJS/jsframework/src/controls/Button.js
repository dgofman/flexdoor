/**
 * @author David Gofman
 */
 
function Button(classType, className, extendType) 
{
	UIComponent.call(this, classType, className, extendType);
}

Button.prototype = new UIComponent(Button, "org.flexdoor.controls::Button");
Button.prototype.Get = function(){ return this; };

//Class Functions
Button.prototype.click = function(){
	this.app.doFlexUiEvent('Click', this.monkeyId, 'automationName', [],'', '', '10', '1000', false);
};
