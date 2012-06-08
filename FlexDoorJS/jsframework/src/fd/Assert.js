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

function Assert() {
}
Assert.CLASS_NAME = "Assert";

//Static Functions
Assert.assertEquals = function(actual, expected, message) {
	var error = (actual != expected);
	var str1 = (error ? (message != undefined ? message : "failed") : "okay");
	var str2 =	" - Expected: " + expected + (error ? ", Result: " + actual : "");

	if(FlexDoor.AUTO_START != true){
		var flash = Application.application.flash;
		flash.assertResult(error, '<font color="#' + (error ? 'C80000' : '008000') + '">' + str1 + '</font>' + str2);
		if(error == true)
			System.warn(str1 + str2);
	}else{
		System.trace(str1 + str2, error ? "warn" : "log");
	}

	if(error && FlexDoor.BREAKPOINT) debugger;
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
		var flash = Application.application.flash;
		flash.assertResult(true, message);
	}
	System.error(message);
	if(FlexDoor.BREAKPOINT) debugger;
};

function fd_Assert(){};