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

function mx_events_MenuEvent(classType, extendType) 
{
	/* extendType - mx.events::MenuEvent */
	UIComponent.call(this, classType, extendType);

	this.Initialize = function(object){
		flash_events_Event.prototype.Initialize(object);
		this.menuBar = this.ref.menuBar;
		this.menu = this.ref.menu;
		this.item = this.ref.item;
		this.label = this.ref.label;
		this.index = this.ref.index;
		this.itemRenderer = this.ref.itemRenderer;        
	};
}

mx_events_MenuEvent.prototype.Import = function(){
	return ["flash.events::Event"];
};
mx_events_MenuEvent.prototype.Extends = function(){
	mx_events_MenuEvent.prototype = new flash_events_Event(mx_events_MenuEvent);
};
mx_events_MenuEvent.Get = function(o){
	var ref = this;
	ref = UIComponent.Get(o, mx_events_MenuEvent);
	return ref;
};

function $MenuEvent() {}
$MenuEvent.Get = mx_events_MenuEvent.Get;
$MenuEvent.Is = function(target) { return target instanceof mx_events_MenuEvent; };
$MenuEvent.Create = function(type, index, itemRenderer, item, label, menuBar, menu, bubbles, cancelable){
	if(index == undefined) index = -1;
	return System.create("mx.events::MenuEvent", 
			$Event.Params(type, bubbles, cancelable, menuBar, menu, item, itemRenderer, label, index));
};

$MenuEvent.CHANGE = "change";
$MenuEvent.ITEM_CLICK = "itemClick";
$MenuEvent.MENU_HIDE = "menuHide";
$MenuEvent.ITEM_ROLL_OUT = "itemRollOut";
$MenuEvent.ITEM_ROLL_OVER = "itemRollOver";
$MenuEvent.MENU_SHOW = "menuShow";