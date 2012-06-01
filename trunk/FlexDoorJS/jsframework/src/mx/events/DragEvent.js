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

function mx_events_DragEvent(classType, extendType) 
{
	/* extendType - mx.events::DragEvent */
	UIComponent.call(this, classType, extendType);

	this.Initialize = function(object){
		flash_events_Event.prototype.Initialize(object);
		this.dragInitiator = this.ref.dragInitiator;
		this.dragSource = this.ref.dragSource;
		this.action = this.ref.action;
	};
}

mx_events_DragEvent.prototype.Import = function(){
	return ["flash.events::MouseEvent"];
};
mx_events_DragEvent.prototype.Extends = function(){
	mx_events_DragEvent.prototype = new flash_events_MouseEvent(mx_events_DragEvent);
};
mx_events_DragEvent.Get = function(o){
	var ref = this;
	ref = UIComponent.Get(o, mx_events_DragEvent);
	return ref;
};

function $DragEvent() {}
$DragEvent.Get = mx_events_DragEvent.Get;
$DragEvent.Is = function(target) { return target instanceof mx_events_DragEvent; };
$DragEvent.Create = function(type, action, dragInitiator, dragSource, ctrlKey, altKey, shiftKey, bubbles, cancelable){
	return System.create("mx.events::DragEvent", 
			$Event.Params(type, bubbles, cancelable, dragInitiator, dragSource, action, ctrlKey, altKey, shiftKey));
};

$DragEvent.DRAG_COMPLETE = "dragComplete";
$DragEvent.DRAG_DROP = "dragDrop";
$DragEvent.DRAG_ENTER = "dragEnter";
$DragEvent.DRAG_EXIT = "dragExit";
$DragEvent.DRAG_OVER = "dragOver";
$DragEvent.DRAG_START = "dragStart";