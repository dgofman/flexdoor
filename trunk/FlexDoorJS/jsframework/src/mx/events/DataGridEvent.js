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

function mx_events_DataGridEvent(classType, extendType) 
{
	/* extendType - mx.events::DataGridEvent */
	UIComponent.call(this, classType, extendType);

	this.Initialize = function(object){
		flash_events_Event.prototype.Initialize(object);
		this.columnIndex = this.ref.columnIndex;
		this.rowIndex = this.ref.rowIndex;
		this.reason = this.ref.reason;
		this.itemRenderer = this.ref.itemRenderer;
	};
}

mx_events_DataGridEvent.prototype.Import = function(){
	return ["flash.events::Event"];
};
mx_events_DataGridEvent.prototype.Extends = function(){
	mx_events_DataGridEvent.prototype = new flash_events_Event(mx_events_DataGridEvent);
};
mx_events_DataGridEvent.Get = function(o){
	var ref = this;
	ref = UIComponent.Get(o, mx_events_DataGridEvent);
	return ref;
};

function $DataGridEvent() {}
$DataGridEvent.Get = mx_events_DataGridEvent.Get;
$DataGridEvent.Create = function(type, rowIndex, columnIndex, reason, dataField, itemRenderer, localX, bubbles, cancelable){
	if(columnIndex == undefined) columnIndex = -1;
	if(rowIndex == undefined) rowIndex = -1;
	return System.create("mx.events::DataGridEvent", 
			$Event.Params(type, bubbles, cancelable, columnIndex, dataField, rowIndex, reason, itemRenderer, localX));
};

$DataGridEvent.ITEM_EDIT_BEGIN = "itemEditBegin";
$DataGridEvent.ITEM_EDIT_END = "itemEditEnd";
$DataGridEvent.ITEM_FOCUS_IN = "itemFocusIn";
$DataGridEvent.ITEM_FOCUS_OUT = "itemFocusOut";
$DataGridEvent.ITEM_EDIT_BEGINNING = "itemEditBeginning";
$DataGridEvent.ITEM_EDITOR_CREATE = "itemEditorCreate";
$DataGridEvent.COLUMN_STRETCH = "columnStretch";
$DataGridEvent.HEADER_RELEASE = "headerRelease";

DataGridEventReason = {};
DataGridEventReason.CANCELLED = "cancelled";
DataGridEventReason.OTHER = "other";
DataGridEventReason.NEW_COLUMN = "newColumn";
DataGridEventReason.NEW_ROW = "newRow";