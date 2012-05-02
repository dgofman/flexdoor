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

function mx_controls_DataGrid(classType, extendType) 
{
	/* extendType - mx.controls::DataGrid */
	UIComponent.call(this, classType, extendType);
	
	this.columns = function(){ /* getter and setter */
		return this.property("columns", arguments);
	};

	this.lockedColumnCount = function(){ /* getter and setter */
		return this.property("lockedColumnCount", arguments);
	};

	this.createItemEditor = function(colIndex, rowIndex){
		return this.execute("createItemEditor", colIndex, rowIndex);
	};

	this.editedItemRenderer = function(){
		return this.getter("editedItemRenderer");
	};

	this.itemEditorInstance = function(){
		return this.getter("itemEditorInstance");
	};

	this.rendererArray = function(){
		return this.getter("rendererArray");
	};

	this.dataGridLockedColumns = function(){
		return this.getter("dataGridLockedColumns");
	};

	this.indicesToItemRenderer = function(row, col /* skipAdvanced */){
		if(arguments.length < 3){
			var lockedColumns = this.lockedColumnCount();
			if(lockedColumns > 0){ //calculate a columnIndex
				if(col < lockedColumns){
					var listBaseContentHolder = this.dataGridLockedColumns();
					var listItems = System.getter(listBaseContentHolder, "listItems");
					var renderer = System.deserialize(listItems[row][col]);
					return renderer;
				}else{
					col -= lockedColumns;
				}
			}
		}
		return this.execute("mx_internal::indicesToItemRenderer", row, col);
	};
}

mx_controls_DataGrid.prototype.Import = function(){
	return ["mx.controls::List"];
};
mx_controls_DataGrid.prototype.Extends = function(){
	mx_controls_List.prototype.Extends();
	mx_controls_DataGrid.prototype = new mx_controls_List(mx_controls_DataGrid);
};
mx_controls_DataGrid.Get = function(o){
	var ref = this;
	ref = UIComponent.Get(o, mx_controls_DataGrid);
	return ref;
};

function $DataGrid() {}
$DataGrid.Get = mx_controls_DataGrid.Get;
$DataGrid.Is = function(target) { return target instanceof mx_controls_DataGrid; };