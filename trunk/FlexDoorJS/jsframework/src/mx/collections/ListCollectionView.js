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
 
function mx_collections_ListCollectionView(classType) 
{
	/* extendType - mx.collections::ListCollectionView */
	EventDispatcher.call(this, classType);

	this.contains = function(item){
		return this.execute("contains", item);
	};

	this.refresh = function(){
		return this.execute("refresh");
	};

	this.getItemAt = function(value){
		return this.execute("getItemAt", value);
	};

	this.setItemAt = function(item, index){
		return this.execute("setItemAt", item, index);
	};

	this.addItem = function(item){
		this.execute("addItem", item);
	};

	this.addItemAt = function(item, index){
		this.execute("addItemAt", item, index);
	};

	this.getItemIndex = function(item){
		return this.execute("getItemIndex", item);
	};

	this.filterFunction = function(){ /* getter and setter */
		return this.property("filterFunction", 
				arguments.length ? [this.createFunction.apply(this, arguments)] : null);
	};

	this.setSearchFunction = function(func){
		System.setSearchFunction(this, func);
	};
}

mx_collections_ListCollectionView.prototype = new EventDispatcher(mx_collections_ListCollectionView);
mx_collections_ListCollectionView.prototype.toString = function() {
	return (this.source ? this.source.toString() : []);
};
mx_collections_ListCollectionView.prototype.Initialize = function(object, parent){
	EventDispatcher.prototype.Initialize.call(this, object, parent);
	if(object.ref != undefined && typeof(object.ref) == "object"){
		this.source = object.ref.source;
		this.length = (this.source instanceof Array ? this.source.length : 0);
	}
};
mx_collections_ListCollectionView.Get = function(o){
	var ref = this;
	ref = UIComponent.Get(o, mx_collections_ListCollectionView);
	return ref;
};

function $ListCollectionView() {}
$ListCollectionView.Get = mx_collections_ListCollectionView.Get;
$ListCollectionView.Is = function(target) { return target instanceof mx_collections_ListCollectionView; };