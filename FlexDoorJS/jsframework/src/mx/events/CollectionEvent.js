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

function mx_events_CollectionEvent(classType) 
{
	/* extendType - mx.events::CollectionEvent */
	flash_events_Event.call(this, classType);

	this.Initialize = function(object){
		flash_events_Event.prototype.Initialize.call(this, object);
		this.kind = this.ref.kind;
	};
}

mx_events_CollectionEvent.prototype.Import = function(){
	return ["flash.events::Event"];
};
mx_events_CollectionEvent.prototype.Extends = function(){
	mx_events_CollectionEvent.prototype = new flash_events_Event(mx_events_CollectionEvent);
};
mx_events_CollectionEvent.Get = function(o){
	var ref = this;
	ref = UIComponent.Get(o, mx_events_CollectionEvent);
	return ref;
};

function $CollectionEvent() {}
$CollectionEvent.Get = mx_events_CollectionEvent.Get;
$CollectionEvent.Is = function(target) { return target instanceof mx_events_CollectionEvent; };
$CollectionEvent.Create = function(type, kind, location, oldLocation, items, bubbles, cancelable){
	if(location == undefined) location = -1;
	if(oldLocation == undefined) oldLocation = -1;
	return System.create("mx.events::CollectionEvent",
						$Event.Params(type, bubbles, cancelable, kind, location, oldLocation, items));
};
$CollectionEvent.COLLECTION_CHANGE = "collectionChange";

var CollectionEventKind = {};
CollectionEventKind.ADD = "add";
CollectionEventKind.MOVE = "move";
CollectionEventKind.REFRESH = "refresh";
CollectionEventKind.REMOVE = "remove";
CollectionEventKind.REPLACE = "replace";
CollectionEventKind.EXPAND = "expand";
CollectionEventKind.RESET = "reset";
CollectionEventKind.UPDATE = "update";