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

function Locator(path) {
	this.path = path;
}
Locator.CLASS_NAME = "Locator";

Locator.prototype = new EventDispatcher();
Locator.Get = function(){
	var ref = this;

	var refId = null;
	var value = arguments[0];
	if(value instanceof Locator){
		value = value.path;
	}else if(value instanceof EventDispatcher){
		refId = value._refId;
		value = "";
	}else if(value.charAt(0) != "/"){
		value = "/" + value;
	}

	for(var i = 1; i < arguments.length; i++){
		var path = arguments[i];
		value += (path.charAt(0) == '/' ? path : '/' + path);
	}
	this.path = value;
	ref = System.getLocator(refId, this.path);

	return ref;
};

function fd_Locator(){};