/**
 * FlexDoor Automation Library
 *
 * Copyright � 2012 David Gofman.
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
 
function mx_collections_HierarchicalCollectionView() 
{
	this.filterFunction = function(value){
		return this.property("filterFunction", this.createFunction(value));
	};

	this.refresh = function(){
		return this.execute("refresh");
	};

	this.setSearchFunction = function(func){
		Static.setSearchFunction(this, func);
	};
}

mx_collections_HierarchicalCollectionView.prototype = new EventDispatcher();
mx_collections_HierarchicalCollectionView.prototype.toString = function() {
	return (this.source ? this.source.toString() : []);
};
mx_collections_HierarchicalCollectionView.prototype.Initialize = function(object, parent){
	EventDispatcher.prototype.Initialize.call(this, object, parent);
	this.source = object.ref.source;
	if(this.source != null)
		this.hierarchicalData = this.source.source;
	if(this.hierarchicalData != null)
		this.collection = this.hierarchicalData.source;
};
mx_collections_HierarchicalCollectionView.Get = function(o){
	var ref = this;
	ref = UIComponent.Get(o, mx_collections_HierarchicalCollectionView);
	return ref;
};

function $HierarchicalCollectionView() {}
$HierarchicalCollectionView.Get = mx_collections_HierarchicalCollectionView.Get;