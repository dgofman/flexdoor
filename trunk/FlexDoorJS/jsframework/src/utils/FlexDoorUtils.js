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

function FlexDoorUtils() {
}

FlexDoorUtils.prototype.findIndexInListCollectionView = FlexDoorUtils.findIndexInListCollectionView;
FlexDoorUtils.prototype.createItemEditRenderer = FlexDoorUtils.createItemEditRenderer;
FlexDoorUtils.prototype.attachCollectionChangeEvent = FlexDoorUtils.attachCollectionChangeEvent;

/**
 * Required include: mx.collections::ListCollectionView
 * 
 *  Returns the index of the item if it is in the list such that 
 *      item[key1][key2] == value or item[key] == value or item = value. 
 *
 *  @param collection - A ListCollectionView object.
 *  
 *  @param key - key with which the specified value is to be associated. If key is null than
 *  collection item will be comparing by value. The array of keys represents multiple level of nested keys.
 *
 *  @param value - value to be associated with the specified key. 
 *  
 *  returns: the index of the  occurrence of the specified object in this list; returns -1 if the object is not found.
 */
FlexDoorUtils.findIndexInListCollectionView = function(collection, key, value){
	var dataProvider = $ListCollectionView.Get(collection);
	for(var rowIndex = 0; rowIndex < dataProvider.source.length; rowIndex++){
		var item = dataProvider.source[rowIndex];
		if(typeof(key) == "string" && item[key] == value){
			return rowIndex;
		}else if(key instanceof Array){
			for(var i = 0; i < key.length; i++)
				item = item[key[i]];
		}
		if(item == value)
			return rowIndex;
	}
	return -1;
};

/**
 * Required include: mx.events::DataGridEvent
 * 
 *  Create an itemEditor instance in the grid editable column.
 * 
 *  @param testCase - A Test Case instance extended from a FlexDoor class.
 *  
 *  @param grid - DataGrid or AdvancedDataGrid reference.
 *
 *  @param rowIndex - The 0-based index of the row, including rows scrolled off the top.
 *
 *  @param colIndex - The 0-based index of the column, including columns scrolled off the left.
 *  
 *  @param callBack - The call back function executed as soon as editInstance is initialized. 
 *  
 *  @param eventType - Asynchronous test case an event types (Optional)
 */
FlexDoorUtils.createItemEditRenderer = function(testCase, grid, rowIndex, columnIndex, callBack, eventType){
	testCase.fireEvent(grid, $DataGridEvent.Create($DataGridEvent.ITEM_EDIT_BEGINNING, rowIndex, columnIndex));

	var columns = grid.columns();
	Assert.assertTrue(columns != null);
	Assert.assertTrue(columns.length > columnIndex);
	var dataField = columns[columnIndex].ref.dataField;

	testCase.waitFor(function(){
		var itemEditor = grid.itemEditorInstance();
		var itemRenderer = grid.indicesToItemRenderer(rowIndex, columnIndex);
		if(itemEditor == null || itemRenderer == null)
			return false;

		callBack.apply(testCase, [itemEditor]);//call test function
		testCase.fireEvent(grid, $DataGridEvent.Create($DataGridEvent.ITEM_EDIT_END, rowIndex, columnIndex, 
				DataGridEventReason.OTHER, dataField, itemRenderer));
		if(eventType != undefined)
			testCase.dispatchEvent(eventType);
		return true;
	}, 100, 10000);
};

/**
 * Required include: mx.events::CollectionEvent
 * 
 * Attach the COLLECTION_CHANGE event type for dataProvider or grid objects
 * 
 *  @param testCase - A Test Case instance extended from a FlexDoor class.
 *  
 *  @param grid - DataGrid or AdvancedDataGrid reference.
 *  
 *  @param callBack - The call back function executed as soon as CollectionEvent triggered. 
 *  
 *  @param attachToDataGrid - indicator, if true addEventListener for data grid otherwise to collection list
 */
FlexDoorUtils.attachCollectionChangeEvent = function(testCase, grid, callBack, attachToDataGrid){
	var target = (attachToDataGrid == true ? grid : grid.dataProvider());
	var changeHandler = function(e){
		if(callBack.apply(testCase, [e.kind])){
			target.removeEventListener($CollectionEvent.COLLECTION_CHANGE, changeHandler);
			testCase.dispatchEvent($CollectionEvent.COLLECTION_CHANGE);
		}
	};
	target.addEventListener($CollectionEvent.COLLECTION_CHANGE, changeHandler, this);
};