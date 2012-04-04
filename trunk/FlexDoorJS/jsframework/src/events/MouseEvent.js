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

function MouseEvent(classType, extendType) 
{
	UIComponent.call(this, classType, extendType);
}

MouseEvent.prototype.Import = function(){
	return ["events::Event"];
};
MouseEvent.prototype.Extends = function(){
	MouseEvent.prototype = new Event(MouseEvent);
};
MouseEvent.Get = function(o){
	var ref = this;
	ref = UIComponent.Get(o, MouseEvent);
	return ref;
};

MouseEvent.TYPE = "flash.events::MouseEvent";
MouseEvent.CLICK = "click";
MouseEvent.DOUBLE_CLICK = "doubleClick";
MouseEvent.MOUSE_DOWN = "mouseDown";
MouseEvent.MOUSE_MOVE = "mouseMove";
MouseEvent.MOUSE_OUT = "mouseOut";
MouseEvent.MOUSE_OVER = "mouseOver";
MouseEvent.MOUSE_UP = "mouseUp";
MouseEvent.ROLL_OUT = "rollOut";
MouseEvent.ROLL_OVER = "rollOver";