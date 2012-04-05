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
 
function mx_collections_ListCollectionView(source) 
{
	this.source = source;
}

mx_collections_ListCollectionView.prototype = new EventDispatcher();
mx_collections_ListCollectionView.prototype.toString = function() {
	return (this.source ? this.source.toString() : []);
};
mx_collections_ListCollectionView.prototype.Initialize = function(object, parent){
	EventDispatcher.prototype.Initialize.call(this, object, parent);
	this.source = object.ref.source;
};
mx_collections_ListCollectionView.Get = function(o){
	var ref = this;
	ref = UIComponent.Get(o, mx_collections_ListCollectionView);
	return ref;
};

mx_collections_ListCollectionView.prototype.contains = function(item){
	return this.execute("contains", item);
};

mx_collections_ListCollectionView.prototype.refresh = function(){
	return this.execute("refresh");
};

mx_collections_ListCollectionView.prototype.getItemAt = function(value){
	return this.execute("getItemAt", value);
};

mx_collections_ListCollectionView.prototype.setItemAt = function(item, index){
	return this.execute("setItemAt", item, index);
};

mx_collections_ListCollectionView.prototype.addItem = function(item){
	this.execute("addItem", item);
};

mx_collections_ListCollectionView.prototype.addItemAt = function(item, index){
	this.execute("addItemAt", item, index);
};

mx_collections_ListCollectionView.prototype.getItemIndex = function(item){
	return this.execute("getItemIndex", item);
};

function $ListCollectionView() {}
$ListCollectionView.Get = mx_collections_ListCollectionView.Get;