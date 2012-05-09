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

function flash_events_MouseEvent(classType, extendType) 
{
	/* extendType - flash.events::MouseEvent */
	UIComponent.call(this, classType, extendType);
}

flash_events_MouseEvent.prototype.Import = function(){
	return ["flash.events::Event"];
};
flash_events_MouseEvent.prototype.Extends = function(){
	flash_events_MouseEvent.prototype = new flash_events_Event(flash_events_MouseEvent);
};
flash_events_MouseEvent.Get = function(o){
	var ref = this;
	ref = UIComponent.Get(o, flash_events_MouseEvent);
	return ref;
};

function $MouseEvent() {}
$MouseEvent.Get = flash_events_MouseEvent.Get;
$MouseEvent.Is = function(target) { return target instanceof flash_events_MouseEvent; };
$MouseEvent.Create = function(type, bubbles, cancelable, buttonDown, relatedObject,
									localX, localY, ctrlKey, altKey, shiftKey, delta){
	if(bubbles == undefined) bubbles = true;
	if(ctrlKey == undefined) ctrlKey = false;
	if(altKey == undefined) altKey = false;
	if(shiftKey == undefined) shiftKey = false;
	if(buttonDown == undefined) buttonDown = false;
	if(delta == undefined) delta = 0;
	return System.create("flash.events::MouseEvent", 
			$Event.Params(type, bubbles, cancelable, localX, localY, 
					relatedObject, ctrlKey, altKey, shiftKey, buttonDown, delta));
};

$MouseEvent.CLICK = "click";
$MouseEvent.DOUBLE_CLICK = "doubleClick";
$MouseEvent.MOUSE_DOWN = "mouseDown";
$MouseEvent.MOUSE_MOVE = "mouseMove";
$MouseEvent.MOUSE_OUT = "mouseOut";
$MouseEvent.MOUSE_OVER = "mouseOver";
$MouseEvent.MOUSE_UP = "mouseUp";
$MouseEvent.ROLL_OUT = "rollOut";
$MouseEvent.ROLL_OVER = "rollOver";