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

function mx_events_ListEvent(classType, extendType) 
{
	/* extendType - mx.events::ListEvent */
	UIComponent.call(this, classType, extendType);

	this.Initialize = function(object){
		flash_events_Event.prototype.Initialize(object);
		this.kind = this.ref.kind;
		this.columnIndex = this.ref.columnIndex;
		this.rowIndex = this.ref.rowIndex;
		this.reason = this.ref.reason;
		this.itemRenderer = this.ref.itemRenderer;
	};
}

mx_events_ListEvent.prototype.Import = function(){
	return ["flash.events::Event"];
};
mx_events_ListEvent.prototype.Extends = function(){
	mx_events_ListEvent.prototype = new flash_events_Event(mx_events_ListEvent);
};
mx_events_ListEvent.Get = function(o){
	var ref = this;
	ref = UIComponent.Get(o, mx_events_ListEvent);
	return ref;
};

function $ListEvent() {}
$ListEvent.Get = mx_events_ListEvent.Get;
$ListEvent.Create = function(type, columnIndex, rowIndex, itemRenderer, reason, bubbles, cancelable){
	if(columnIndex == undefined) columnIndex = -1;
	if(rowIndex == undefined) rowIndex = -1;
	return System.create("mx.events::ListEvent", 
			$Event.Params(type, bubbles, cancelable, columnIndex, rowIndex, reason, itemRenderer));
};

$ListEvent.CHANGE = "change";
$ListEvent.ITEM_EDIT_BEGIN = "itemEditBegin";
$ListEvent.ITEM_EDIT_END = "itemEditEnd";
$ListEvent.ITEM_FOCUS_IN = "itemFocusIn";
$ListEvent.ITEM_FOCUS_OUT = "itemFocusOut";
$ListEvent.ITEM_EDIT_BEGINNING = "itemEditBeginning";
$ListEvent.ITEM_CLICK = "itemClick";
$ListEvent.ITEM_DOUBLE_CLICK = "itemDoubleClick";
$ListEvent.ITEM_ROLL_OUT = "itemRollOut";
$ListEvent.ITEM_ROLL_OVER = "itemRollOver";