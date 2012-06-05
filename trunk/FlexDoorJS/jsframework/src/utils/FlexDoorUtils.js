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

FlexDoorUtils.prototype.findIndexInArray = FlexDoorUtils.findIndexInArray;
FlexDoorUtils.prototype.findIndexInListCollectionView = FlexDoorUtils.findIndexInListCollectionView;
FlexDoorUtils.prototype.createItemEditRenderer = FlexDoorUtils.createItemEditRenderer;
FlexDoorUtils.prototype.attachCollectionChangeEvent = FlexDoorUtils.attachCollectionChangeEvent;
FlexDoorUtils.prototype.getColumnIndex = FlexDoorUtils.getColumnIndex;

/**
 * 
 *  Returns the index of the item if it is in the list such that 
 *	  item[key1][key2] == value or item[key] == value or item = value. 
 *
 *  @param collection - An array.
 *  
 *  @param key - key with which the specified value is to be associated. If key is null than
 *  collection item will be comparing by value. The array of keys represents multiple level of nested keys.
 *
 *  @param value - value to be associated with the specified key. 
 *  
 *  returns: the index of the  occurrence of the specified object in this list; returns -1 if the object is not found.
 */
FlexDoorUtils.findIndexInArray = function(source, key, value){
	for(var rowIndex = 0; rowIndex < source.length; rowIndex++){
		var item = source[rowIndex];
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
 *  Returns the index of the item if it is in the list such that 
 *	  item[key1][key2] == value or item[key] == value or item = value. 
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
	return FlexDoorUtils.findIndexInArray(collection.source, key, value);
};

/**
 * Required include: mx.events::DataGridEvent or mx.events::AdvancedDataGridEvent
 * 
 *  Create an itemEditor instance in the grid editable column.
 *
 *  Note: is asynchronous function set TestCase type to TestEvent.ASYNCHRONOUS
 * 
 *  @param testCase - A Test Case instance extended from a FlexDoor class.
 *  
 *  @param grid - DataGrid or AdvancedDataGrid reference.
 *
 *  @param rowIndex - The 0-based index of the row, including rows scrolled off the top.
 *
 *  @param colIndex - The 0-based index of the column, including columns scrolled off the left.
 *  
 *  @param preEventCallBack - The call back function executed as soon as editInstance is initialized. 
 *  
 *  @param postEventCallBack - The call back function executed after ITEM_EDIT_END event (Optional)
 */
FlexDoorUtils.createItemEditRenderer = function(testCase, grid, rowIndex, columnIndex, preEventCallBack, postEventCallBack){
	var columns = grid.columns();
	Assert.assertTrue(columns != null);
	Assert.assertTrue(columns.length > columnIndex);
	var dataField = columns[columnIndex].ref.dataField;
	var itemRenderer = grid.indicesToItemRenderer(rowIndex, columnIndex);
	
	if(grid._extendTypes.indexOf("mx.controls::AdvancedDataGrid") != -1){
		testCase.fireEvent(grid, $AdvancedDataGridEvent.Create($AdvancedDataGridEvent.ITEM_EDIT_BEGINNING, rowIndex, columnIndex, 
																				dataField, null, itemRenderer));
	}else{
		testCase.fireEvent(grid, $DataGridEvent.Create($DataGridEvent.ITEM_EDIT_BEGINNING, rowIndex, columnIndex,
																				dataField, null, itemRenderer));
	}

	testCase.waitFor(function(){
		var itemEditor = grid.itemEditorInstance();
		if(itemEditor == null)
			return false;

		preEventCallBack.apply(testCase, [itemEditor]);//call test function

		if(grid._extendTypes.indexOf("mx.controls::AdvancedDataGrid") != -1){
			testCase.fireEvent(grid, $AdvancedDataGridEvent.Create($AdvancedDataGridEvent.ITEM_EDIT_END, rowIndex, columnIndex, 
																		dataField, AdvancedDataGridEventReason.OTHER, itemRenderer));
		}else{
			testCase.fireEvent(grid, $DataGridEvent.Create($DataGridEvent.ITEM_EDIT_END, rowIndex, columnIndex, 
																		dataField, DataGridEventReason.OTHER, itemRenderer));
		}

		if(postEventCallBack != undefined)
			postEventCallBack.apply(testCase);
		return true;
	}, 100, 10000);
};

/**
 * Required include: mx.events::CollectionEvent
 * 
 * Attach the COLLECTION_CHANGE event type for dataProvider or grid objects
 * 
 *  Note: is asynchronous function set TestCase type to TestEvent.ASYNCHRONOUS
 *  
 *  @param testCase - A Test Case instance extended from a FlexDoor class.
 *  
 *  @param grid - DataGrid or AdvancedDataGrid reference.
 *
 *  @param preEventCallBack - The call back function executed as soon as CollectionEvent triggered and 
 *                    passing the <code>CollectionEventKind</code>. See: CollectionEvent::CollectionEventKind (Optional)
 *
 *  @param postEventCallBack - The call back function executed after removing CollectionEvent.COLLECTION_CHANGE event listener (Optional)
 *
 */
FlexDoorUtils.attachCollectionChangeEvent = function(testCase, grid, preEventCallBack, postEventCallBack){
	var dataProvider = grid.dataProvider();
	var changeHandler = function(e){
		if(preEventCallBack == undefined){
			preEventCallBack = function(kind){
				System.log("CollectionEventKind=" + kind);
				return (kind != CollectionEventKind.EXPAND);
			};
		}
		if(preEventCallBack.apply(testCase, [e.kind])){
			System.removeEventListener(grid, $CollectionEvent.COLLECTION_CHANGE, changeHandler._refId);
			System.removeEventListener(dataProvider, $CollectionEvent.COLLECTION_CHANGE, changeHandler._refId);
			testCase.dispatchEvent($CollectionEvent.COLLECTION_CHANGE);

			if(postEventCallBack != undefined){
				postEventCallBack.apply(testCase);
			}else{
				testCase.callNextTest();
			}
		}
	};
	grid.addEventListener($CollectionEvent.COLLECTION_CHANGE, changeHandler, this);
	dataProvider.addEventListener($CollectionEvent.COLLECTION_CHANGE, changeHandler, this);
};

/**
 * Find the columnIndex in DataGrid columns
 *
 *  @param grid - DataGrid or AdvancedDataGrid reference.
 *  
 *  @param value - value to be associated with the specified key.
 *
 *  @param key - key with which the specified value is to be associated. If key is undefined than key equals to <code>dataField</code>
 */

FlexDoorUtils.getColumnIndex = function(grid, value, key){
	if(key == undefined) key = "dataField";
	var columns = grid.columns();
	if(columns instanceof Array){
		for(var  i = 0; i < columns.length; i++){
			if(columns[i]["ref"] != undefined && columns[i].ref[key] == value)
				return i;
		}
	}
	return -1;
};

/**
 * The method used to compare items of Objects represents as Hashmap
 * 
 *  @param source - The first items.
 *  
 *  @param target - The seconds items.
 *  
 *  @param errorList - List of invalid results. 
 *  
 *  @param exclude - List of the ignore keys
 */
FlexDoorUtils.compareObjects = function(source, target, errorList, exclude){
	var eMap = {};
	if(exclude instanceof Array){
		for(var i = 0; i < exclude.length; i++)
			eMap[exclude[i]] = true;
	}
	for(var name in source){
		if(name == undefined || eMap[name] == true)
			continue;
		var value1 = source[name];
		var value2 = target[name];
		if( value1 != undefined && value2 != undefined &&
			typeof(value1) == "object" && 
			typeof(value2) == "object"){
			FlexDoorUtils.compareObjects(value1, value2, errorList, exclude);
		}else{
			if(String(value1) != String(value2)){
				errorList.push({name:name, source:value1, target:value2});
			}
		}
	}	
};