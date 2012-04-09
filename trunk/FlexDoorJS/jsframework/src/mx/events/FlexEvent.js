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

function mx_events_FlexEvent(classType, extendType) 
{
	/* extendType - mx.events::FlexEvent */
	UIComponent.call(this, classType, extendType);

	this.Initialize = function(object){
		flash_events_Event.prototype.Initialize(object);
		this.kind = this.ref.kind;
	};
}

mx_events_FlexEvent.prototype.Import = function(){
	return ["flash.events::Event"];
};
mx_events_FlexEvent.prototype.Extends = function(){
	mx_events_FlexEvent.prototype = new flash_events_Event(mx_events_FlexEvent);
};
mx_events_FlexEvent.Get = function(o){
	var ref = this;
	ref = UIComponent.Get(o, mx_events_FlexEvent);
	return ref;
};

function $FlexEvent() {}
$FlexEvent.Get = mx_events_FlexEvent.Get;
$FlexEvent.Create = function(type){
	return System.create("mx.events::FlexEvent", type);
};
$FlexEvent.COLLECTION_CHANGE = "collectionChange";

$FlexEvent.ADD = "add";
$FlexEvent.ADD_FOCUS_MANAGER = "addFocusManager";
$FlexEvent.APPLICATION_COMPLETE = "applicationComplete";
$FlexEvent.BUTTON_DOWN = "buttonDown";
$FlexEvent.BACK_KEY_PRESSED = "backKeyPressed";
$FlexEvent.CHANGE_END = "changeEnd";
$FlexEvent.CHANGE_START = "changeStart";
$FlexEvent.CHANGING = "changing";
$FlexEvent.CREATION_COMPLETE = "creationComplete";
$FlexEvent.CONTENT_CREATION_COMPLETE = "contentCreationComplete";
$FlexEvent.CURSOR_UPDATE = "cursorUpdate";
$FlexEvent.DATA_CHANGE = "dataChange";
$FlexEvent.ENTER = "enter";
$FlexEvent.ENTER_FRAME = "flexEventEnterFrame";
$FlexEvent.ENTER_STATE = "enterState";
$FlexEvent.EXIT_STATE = "exitState";
$FlexEvent.FLEX_WINDOW_ACTIVATE = "flexWindowActivate";
$FlexEvent.FLEX_WINDOW_DEACTIVATE = "flexWindowDeactivate";
$FlexEvent.HIDE = "hide";
$FlexEvent.IDLE = "idle";
$FlexEvent.INIT_COMPLETE = "initComplete";
$FlexEvent.INIT_PROGRESS = "initProgress";
$FlexEvent.INITIALIZE = "initialize";
$FlexEvent.INVALID = "invalid";
$FlexEvent.LOADING = "loading";
$FlexEvent.MENU_KEY_PRESSED = "menuKeyPressed";
$FlexEvent.MUTED_CHANGE = "mutedChange";
$FlexEvent.NAVIGATOR_STATE_LOADING = "navigatorStateLoading";
$FlexEvent.NAVIGATOR_STATE_SAVING = "navigatorStateSaving";
$FlexEvent.NEW_CHILD_APPLICATION = "newChildApplication";
$FlexEvent.PREINITIALIZE = "preinitialize";
$FlexEvent.PRELOADER_DONE = "preloaderDone";
$FlexEvent.PRELOADER_DOC_FRAME_READY = "preloaderDocFrameReady";
$FlexEvent.READY = "ready";
$FlexEvent.RENDER = "flexEventRender";
$FlexEvent.REMOVE = "remove";
$FlexEvent.REPEAT = "repeat";
$FlexEvent.REPEAT_END = "repeatEnd";
$FlexEvent.REPEAT_START = "repeatStart";
$FlexEvent.SELECTION_CHANGE = "selectionChange";
$FlexEvent.SHOW = "show";
$FlexEvent.STATE_CHANGE_COMPLETE = "stateChangeComplete";
$FlexEvent.STATE_CHANGE_INTERRUPTED = "stateChangeInterrupted";
$FlexEvent.TRANSFORM_CHANGE = "transformChange";
$FlexEvent.TRANSITION_START = "transitionStart";
$FlexEvent.TRANSITION_END = "transitionEnd";
$FlexEvent.UPDATE_COMPLETE = "updateComplete";
$FlexEvent.URL_CHANGED = "urlChanged";
$FlexEvent.VALID = "valid";
$FlexEvent.VALUE_COMMIT = "valueCommit";