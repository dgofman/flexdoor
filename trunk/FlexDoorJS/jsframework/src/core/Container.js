/**
 * @author David Gofman
 */

function Container(classType, className, extendType) 
{
	UIComponent.call(this, classType, className, extendType);
}

Container.prototype = new UIComponent(Container, "org.flexdoor.core::Container");
Container.prototype.Get = function(){ return this; };

//Class Functions
Container.prototype.numChildren = function() {
	return FDGlobal.find("numChildren");
};