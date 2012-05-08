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

function TestEvent(tests, order) 
{
	this.tests = tests;
	this.order = order;
	this.nextOrder = order + 1;
	this.delay = FlexDoor.TEST_DELAY_INTERVAL;
	this.functionName = tests[order];
	this.timeout = TestEvent.TIMEOUT;
	this.type = TestEvent.SYNCHRONOUS;
	this.testArgs = null;
	this.nextTestArgs = null;
}
TestEvent.SYNCHRONOUS  = "synchronous";
TestEvent.ASYNCHRONOUS = "asynchronous"; 
TestEvent.TIMEOUT = 120000; //Two minutes

TestEvent.prototype.toString = function() {
	return "fd::TestEvent";
};

TestEvent.Get = function(o){
	var ref = this;
	ref = UIComponent.Get(o, TestEvent);
	return ref;
};

TestEvent.prototype.setEventType = function(type) {
	if(type != undefined){
		if(type != this.type && type != TestEvent.SYNCHRONOUS)
			this.addAsyncEventListener(type);
		this.type = type;
	}
};

TestEvent.prototype.set = function(params) {
	this.setEventType(params.type);
	for(var name in params){
		if(params[name] != undefined)
			this[name] = params[name];
	}
};

function fd_TestEvent(){};

function ARGS(){
	this.source = [];
	for(var i = 0; i < arguments.length; i++)
		this.source[i] = arguments[i];
}