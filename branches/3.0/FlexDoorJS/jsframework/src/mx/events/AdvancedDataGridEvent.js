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

function mx_events_AdvancedDataGridEvent(classType, extendType) 
{
	/* extendType - mx.events::AdvancedDataGridEvent */
	UIComponent.call(this, classType, extendType);

	this.Initialize = function(object){
		flash_events_Event.prototype.Initialize(object);
		this.columnIndex = this.ref.columnIndex;
		this.rowIndex = this.ref.rowIndex;
		this.reason = this.ref.reason;
		this.itemRenderer = this.ref.itemRenderer;
		this.multiColumnSort = this.ref.multiColumnSort;
		this.removeColumnFromSort = this.ref.removeColumnFromSort;
		this.item = this.ref.item;
		this.triggerEvent = this.ref.triggerEvent;
		this. headerPart = this.ref.headerPart;
	};
}

mx_events_AdvancedDataGridEvent.prototype.Import = function(){
	return ["flash.events::Event"];
};
mx_events_AdvancedDataGridEvent.prototype.Extends = function(){
	mx_events_AdvancedDataGridEvent.prototype = new flash_events_Event(mx_events_AdvancedDataGridEvent);
};
mx_events_AdvancedDataGridEvent.Get = function(o){
	var ref = this;
	ref = UIComponent.Get(o, mx_events_AdvancedDataGridEvent);
	return ref;
};

function $AdvancedDataGridEvent() {}
$AdvancedDataGridEvent.Get = mx_events_AdvancedDataGridEvent.Get;
$AdvancedDataGridEvent.Is = function(target) { return target instanceof mx_events_AdvancedDataGridEvent; };
$AdvancedDataGridEvent.Create = function(type, rowIndex, columnIndex, dataField, reason, itemRenderer, item, localX,
										multiColumnSort, removeColumnFromSort, triggerEvent, headerPart, bubbles, cancelable){
	if(columnIndex == undefined) columnIndex = -1;
	if(rowIndex == undefined) rowIndex = -1;
	return System.create("mx.events::AdvancedDataGridEvent", 
			$Event.Params(type, bubbles, cancelable, columnIndex, dataField, rowIndex, reason, itemRenderer, localX, 
					multiColumnSort, removeColumnFromSort, item, triggerEvent, headerPart));
};

$AdvancedDataGridEvent.ITEM_CLOSE = "itemClose";
$AdvancedDataGridEvent.ITEM_EDIT_BEGIN = "itemEditBegin";
$AdvancedDataGridEvent.ITEM_EDIT_END = "itemEditEnd";
$AdvancedDataGridEvent.ITEM_FOCUS_IN = "itemFocusIn";
$AdvancedDataGridEvent.ITEM_FOCUS_OUT = "itemFocusOut";
$AdvancedDataGridEvent.ITEM_EDIT_BEGINNING = "itemEditBeginning";
$AdvancedDataGridEvent.ITEM_OPEN = "itemOpen";
$AdvancedDataGridEvent.ITEM_OPENING = "itemOpening";
$AdvancedDataGridEvent.COLUMN_STRETCH = "columnStretch";
$AdvancedDataGridEvent.HEADER_DRAG_OUTSIDE = "headerDragOutside";
$AdvancedDataGridEvent.HEADER_DROP_OUTSIDE = "headerDropOutside";
$AdvancedDataGridEvent.HEADER_RELEASE = "headerRelease";
$AdvancedDataGridEvent.SORT = "sort";

AdvancedDataGridEventReason = {};
AdvancedDataGridEventReason.CANCELLED = "cancelled";
AdvancedDataGridEventReason.OTHER = "other";
AdvancedDataGridEventReason.NEW_COLUMN = "newColumn";
AdvancedDataGridEventReason.NEW_ROW = "newRow";