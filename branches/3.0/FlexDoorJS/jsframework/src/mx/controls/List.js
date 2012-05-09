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

function mx_controls_List(classType, extendType) 
{
	/* extendType - mx.controls::List */
	UIComponent.call(this, classType, extendType);

	this.indexToItemRenderer = function(index){
		return this.execute("indexToItemRenderer", index);
	};

	this.itemToItemRenderer = function(item){
		return this.execute("itemToItemRenderer", item);
	};

	this.indicesToItemRenderer = function(row, col){
		return this.execute("mx_internal::indicesToItemRenderer", row, col);
	};

	this.selectedIndex = function(){  /* getter and setter */
		return this.property("selectedIndex", arguments, function(value){
			this.fireEvent($ListEvent.Create($ListEvent.CHANGE, value, 0, this.indexToItemRenderer(value)));
		});
	};

	this.selectedItem = function(){  /* getter and setter */
		return this.property("selectedItem", arguments, function(value){
			var rowIndex = this.selectedIndex();
			this.fireEvent($ListEvent.Create($ListEvent.CHANGE, rowIndex, 0, this.indexToItemRenderer(rowIndex)));
		});
	};

	this.dataProvider = function(){ /* getter and setter */
		return this.property("dataProvider", arguments);
	};
}

mx_controls_List.prototype.Import = function(){
	return ["mx.events::ListEvent"];
};
mx_controls_List.prototype.Extends = function(){
	mx_controls_List.prototype = new UIComponent(mx_controls_List);
};
mx_controls_List.Get = function(o){
	var ref = this;
	ref = UIComponent.Get(o, mx_controls_List);
	return ref;
};

function $List() {}
$List.Get = mx_controls_List.Get;
$List.Is = function(target) { return target instanceof mx_controls_List; };