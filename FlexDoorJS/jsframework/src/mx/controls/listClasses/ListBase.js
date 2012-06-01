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

function mx_controls_listClasses_ListBase(classType, extendType) 
{
	/* extendType - mx.controls.listClasses::ListBase */
	UIComponent.call(this, classType, extendType);

	this.dragMoveEnabled = function(){ /* getter and setter */
		return this.property("dragMoveEnabled", arguments);
	};

	this.selectedIndices = function(){  /* getter and setter */
		return this.property("selectedIndices", arguments, function(value){
			this.fireEvent($ListEvent.Create($ListEvent.CHANGE, value, 0, this.indexToItemRenderer(value)));
		});
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
	
	//API's
	this.dragAndDropIndices = function(target, indices, action, dropIndex){
		System.dragAndDropIndices(this, target, indices, action, dropIndex);
	};
}

mx_controls_listClasses_ListBase.prototype.Extends = function(){
	mx_controls_listClasses_ListBase.prototype = new UIComponent(mx_controls_listClasses_ListBase);
};
mx_controls_listClasses_ListBase.prototype.Import = function(){
	return ["mx.events::ListEvent", "mx.events::DragEvent", "mx.managers::DragManager"];
};
mx_controls_listClasses_ListBase.Get = function(o){
	var ref = this;
	ref = UIComponent.Get(o, mx_controls_listClasses_ListBase);
	return ref;
};

function $ListBase() {}
$ListBase.Get = mx_controls_listClasses_ListBase.Get;
$ListBase.Is = function(target) { return target instanceof mx_controls_listClasses_ListBase; };