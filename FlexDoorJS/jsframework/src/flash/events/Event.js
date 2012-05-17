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
		System.releaseIds([this._refId]);
	};
}
flash_events_Event.prototype = new Object();

flash_events_Event.prototype.Initialize = function(object){
	this._refId = object.refId;
	this._extendTypes = object.extendTypes;
	this.type = object.ref.type;
	this.target = object.target;
	this.currentTarget = object.currentTarget;
	this.ref = object.ref;
};
flash_events_Event.Get = function(o){
	var ref = this;
	ref = UIComponent.Get(o, flash_events_Event);
	return ref;
};

function $Event() {}
$Event.Get = flash_events_Event.Get;
$Event.Is = function(target) { return target instanceof flash_events_Event; };
$Event.Params = function(type, bubbles, cancelable){
	if(bubbles == undefined) bubbles = false;
	if(cancelable == undefined) cancelable = false;
	return [type, bubbles, cancelable].concat(System.getParams(arguments, 3, true));
};
$Event.Create = function(type, bubbles, cancelable){
	return System.create("flash.events::Event",
			$Event.Params(type, bubbles, cancelable));
};

$Event.ACTIVATE = "activate";
$Event.ADDED = "added";
$Event.ADDED_TO_STAGE = "addedToStage";
$Event.CANCEL = "cancel";
$Event.CHANGE = "change";
$Event.CLEAR = "clear";
$Event.CLOSE = "close";
$Event.CLOSING = "closing";
$Event.COMPLETE = "complete";
$Event.CONNECT = "connect";
$Event.CONTEXT3D_CREATE = "context3DCreate";
$Event.COPY = "copy";
$Event.CUT = "cut";
$Event.DEACTIVATE = "deactivate";
$Event.DISPLAYING = "displaying";
$Event.ENTER_FRAME = "enterFrame";
$Event.EXIT_FRAME = "exitFrame";
$Event.EXITING = "exiting";
$Event.FRAME_CONSTRUCTED = "frameConstructed";
$Event.FULLSCREEN = "fullScreen";
$Event.HTML_BOUNDS_CHANGE = "htmlBoundsChange";
$Event.HTML_DOM_INITIALIZE = "htmlDOMInitialize";
$Event.HTML_RENDER = "htmlRender";
$Event.INIT = "init";
$Event.LOCATION_CHANGE = "locationChange";
$Event.MOUSE_LEAVE = "mouseLeave";
$Event.NETWORK_CHANGE = "networkChange";
$Event.OPEN = "open";
$Event.PASTE = "paste";
$Event.REMOVED = "removed";
$Event.REMOVED_FROM_STAGE = "removedFromStage";
$Event.RENDER = "render";
$Event.RESIZE = "resize";
$Event.SCROLL = "scroll";
$Event.SELECT = "select";
$Event.SELECT_ALL = "selectAll";
$Event.SOUND_COMPLETE = "soundComplete";
$Event.STANDARD_ERROR_CLOSE = "standardErrorClose";
$Event.STANDARD_INPUT_CLOSE = "standardInputClose";
$Event.STANDARD_OUTPUT_CLOSE = "standardOutputClose";
$Event.TAB_CHILDREN_CHANGE = "tabChildrenChange";
$Event.TAB_ENABLED_CHANGE = "tabEnabledChange";
$Event.TAB_INDEX_CHANGE = "tabIndexChange";
$Event.TEXT_INTERACTION_MODE_CHANGE = "textInteractionModeChange";
$Event.UNLOAD = "unload";
$Event.USER_IDLE = "userIdle";
$Event.USER_PRESENT = "userPresent";
