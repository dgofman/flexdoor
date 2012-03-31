/**
 * @author David Gofman
 */

function Panel(classType, className, extendType) 
{
	UIComponent.call(this, classType, className, extendType);
}

Panel.prototype = new Container(Panel, "org.flexdoor.containers::Panel");
Panel.prototype.Get = function(){ return this; };

//Class Functions
Panel.prototype.setTitle = function(value) {
	this.setter("title", value);
};

Panel.prototype.getTitle = function() {
	return this.getter("title");
};