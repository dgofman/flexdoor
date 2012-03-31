/**
 * @author David Gofman
 */
 
function Assert() 
{
}

Assert.prototype.assertEquals = function(actual, expected, message) {
	Assert.assertEquals(actual, expected, message);
};
Assert.prototype.assertTrue = function(expected, message) {
	Assert.assertTrue(expected, message);
};
Assert.prototype.fail = function(message) {
	Assert.fail(message);
};

//Static Functions
Assert.assertEquals = function(actual, expected, message) {
	if(FlexDoor.autoStart != true){
		equal(actual, expected, message);
	}else{
		var error = (actual != expected);
		FDGlobal.trace(
				(message != undefined ? message : (error ? "failed" : "okay")) +
				" - Expected: " + expected +
				(error ? ", Result: " + actual : ""), 
				(error ? "warn" : "log"));
	}
};

Assert.assertTrue = function(actual, message) {
	if(FlexDoor.autoStart != true){
		ok(actual, message);
	}else{
		Assert.assertEquals(actual, true, message);
	}
};

Assert.fail = function(message) {
	if(FlexDoor.autoStart != true){
		ok(false, message);
	}else{
		FDGlobal.trace(message, "error");
	}
};
