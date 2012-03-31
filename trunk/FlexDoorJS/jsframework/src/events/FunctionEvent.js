/**
 * @author David Gofman
 */
 
function FunctionEvent(prop) 
{
	this.reset();
	for(var name in prop)
		this[name] = prop[name];
}
FunctionEvent.TEST_DELAY = 500;

FunctionEvent.prototype.toString = function() {
	return "org.flexdoor.events::FunctionEvent";
};

FunctionEvent.prototype.reset = function(){
	this.delay = FunctionEvent.TEST_DELAY;
};