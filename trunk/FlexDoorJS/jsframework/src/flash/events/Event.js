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

function flash_events_Event(classType, extendType) 
{
	/* extendType - flash.events::Event */
	UIComponent.call(this, classType, extendType);

	this.destory = function(){
		System.releaseIds([this.refId]);
	};
}
flash_events_Event.prototype = new Object();

flash_events_Event.prototype.Initialize = function(object){
	this.refId = object.refId;
	this.type = object.ref.type;
	this.target = object.target;
	this.currentTarget = object.currentTarget;
	this.ref = object.ref;
	this.extendTypes = object.extendTypes;
};
flash_events_Event.Get = function(o){
	var ref = this;
	ref = UIComponent.Get(o, flash_events_Event);
	return ref;
};

function $Event() {}
$Event.Get = flash_events_Event.Get;
$Event.Params = function(type, bubbles, cancelable){
	if(bubbles == undefined) bubbles = false;
	if(cancelable == undefined) cancelable = false;
	return System.getParams(arguments, 0, true);
};
$Event.Create = function(type, bubbles, cancelable){
	return System.create("flash.events::Event",
			$Event.Params(type, bubbles, cancelable));
};