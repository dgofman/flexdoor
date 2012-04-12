/**
 * FlexDoor Automation Library
 *
 * Copyright � 2012 David Gofman.
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

function TestEvent(order) 
{
	this.order = order;
	this.nextOrder = order + 1;
	this.delay = FlexDoor.TEST_DELAY_INTERVAL;
	this.items = null;
	this.functionName = null;
	this.timeout = TestEvent.TIMEOUT;
	this.type = TestEvent.NEXT_TYPE;
}
TestEvent.NEXT_TYPE = "NextTypeEvent";
TestEvent.TIMEOUT = 120000; //Two minutes

TestEvent.prototype.toString = function() {
	return "fd::TestEvent";
};

TestEvent.Get = function(o){
	var ref = this;
	ref = UIComponent.Get(o, TestEvent);
	return ref;
};

TestEvent.prototype.addItems = function(items) {
	this.items = items;
};

TestEvent.prototype.getItem = function(name) {
	if(this.items instanceof Object)
		return this.items[name];
	return null;
};

TestEvent.prototype.set = function(params) {
	for(var name in params)
		this[name] = params[name];
};

fd_TestEvent = function(){}