/**
 * @author David Gofman
 */
 
function List(classType, className, extendType) 
{
	UIComponent.call(this, classType, className, extendType);
}

List.prototype = new UIComponent(List, "org.flexdoor.controls::List");
List.prototype.Get = function(){ return this; };

//Class Functions
List.prototype.setSelectedIndex = function(value){
	this.setter("selectedIndex", value);
};
List.prototype.getSelectedIndex = function(){
	return this.getter("selectedIndex");
};
