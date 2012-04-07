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

function Assert() 
{
}

Assert.prototype.assertEquals = function(actual, expected, message) {
	Assert.assertEquals(actual, expected, message);
};
Assert.prototype.assertType = function(uiComponent, expectedType, message) {
	Assert.assertType(uiComponent, expectedType, message);
};
Assert.prototype.assertTrue = function(expected, message) {
	Assert.assertTrue(expected, message);
};
Assert.prototype.fail = function(message) {
	Assert.fail(message);
};

//Static Functions
Assert.assertEquals = function(actual, expected, message) {
	if(FlexDoor.AUTO_START != true){
		equal(actual, expected, message);
	}else{
		var error = (actual != expected);
		Static.trace(
				(message != undefined ? message : (error ? "failed" : "okay")) +
				" - Expected: " + expected +
				(error ? ", Result: " + actual : ""), 
				(error ? "warn" : "log"));
	}
};

Assert.assertTrue = function(actual, message) {
	Assert.assertEquals(actual, true, message);
};

Assert.assertType = function(uiComponent, expectedType, message) {
	if(typeof(expectedType) == "string")
		Assert.assertEquals(uiComponent.toString(), expectedType, message);
	else 
		Assert.assertEquals(uiComponent instanceof expectedType, message);
};

Assert.fail = function(message) {
	if(FlexDoor.AUTO_START != true){
		ok(false, message);
	}else{
		Static.error(message);
	}
};
