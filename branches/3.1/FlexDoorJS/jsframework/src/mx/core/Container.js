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

function Container(classType) 
{
	UIComponent.call(this, classType);

	this.autoLayout = function(){ /* getter and setter */
		return this.property("autoLayout", arguments);
	};
	
	this.borderMetrics = function() {
		return this.getter("borderMetrics");
	};
	
	this.childDescriptors = function() {
		return this.getter("childDescriptors");
	};
	
	this.clipContent = function(){ /* getter and setter */
		return this.property("clipContent", arguments);
	};
	
	this.creatingContentPane = function(){ /* getter and setter */
		return this.property("creatingContentPane", arguments);
	};
	
	this.creationIndex = function(){ /* getter and setter */
		return this.property("creationIndex", arguments);
	};
	
	this.creationPolicy = function(){ /* getter and setter */
		return this.property("creationPolicy", arguments);
	};
	
	this.data = function(){ /* getter and setter */
		return this.property("data", arguments);
	};
	
	this.defaultButton = function(){ /* getter and setter */
		return this.property("defaultButton", arguments);
	};
	
	this.deferredContentCreated = function() {
		return this.getter("deferredContentCreated");
	};
	
	this.horizontalLineScrollSize = function() { /* getter and setter */
		return this.property("horizontalLineScrollSize", arguments);
	};
	
	this.horizontalPageScrollSize = function() { /* getter and setter */
		return this.property("horizontalPageScrollSize", arguments);
	};
	
	this.horizontalScrollBar = function() { /* getter and setter */
		return this.property("horizontalScrollBar", arguments);
	};
	
	this.horizontalScrollPolicy = function() { /* getter and setter */
		return this.property("horizontalScrollPolicy", arguments);
	};
	
	this.horizontalScrollPosition = function() { /* getter and setter */
		return this.property("horizontalScrollPosition", arguments);
	};
	
	this.icon = function() { /* getter and setter */
		return this.property("icon", arguments);
	};
	
	this.label = function() { /* getter and setter */
		return this.property("label", arguments);
	};
	
	this.maxHorizontalScrollPosition = function() {
		this.getter("maxHorizontalScrollPosition");
	};
	
	this.maxVerticalScrollPosition = function() {
		this.getter("maxVerticalScrollPosition");
	};
	
	this.moduleFactory = function(moduleFactory) {
		this.setter("moduleFactory", moduleFactory);
	};
	
	this.numChildren = function() {
		return this.getter("numChildren");
	};
	
	this.numElements = function() {
		return this.getter("numElements");
	};
	
	this.rawChildren = function() {
		return this.getter("rawChildren");
	};
	
	this.verticalLineScrollSize = function() { /* getter and setter */
		return this.property("verticalLineScrollSize", arguments);
	};
	
	this.verticalPageScrollSize = function() { /* getter and setter */
		return this.property("verticalPageScrollSize", arguments);
	};
	
	this.verticalScrollBar = function() { /* getter and setter */
		return this.property("verticalScrollBar", arguments);
	};
	
	this.verticalScrollPolicy = function() { /* getter and setter */
		return this.property("verticalScrollPolicy", arguments);
	};
	
	this.verticalScrollPosition = function() { /* getter and setter */
		return this.property("verticalScrollPosition", arguments);
	};
	
	this.viewMetrics = function() {
		return this.getter("viewMetrics");
	};
	
	this.viewMetricsAndPadding = function() {
		return this.getter("viewMetricsAndPadding");
	};
	
	//API's
	this.getChildAt = function(index) {
		return this.execute("getChildAt", index);
	};
	
	this.getChildIndex = function(child) {
		return this.execute("getChildIndex", child);
	};
	
	this.getChildren = function() {
		return this.execute("getChildren");
	};
	
	this.getElementAt = function(index) {
		return this.execute("getElementAt", index);
	};
	
	this.getElementIndex = function(element) {
		return this.execute("getElementIndex", element);
	};
	
	this.removeAllChildren = function() {
		this.execute("removeAllChildren");
	};
	
	this.removeAllElements = function() {
		this.execute("removeAllElements");
	};
	
	this.removeChild = function(child) {
		return this.execute("removeChild", child);
	};
	
	this.removeChildAt = function(index) {
		return this.execute("removeChildAt", index);
	};
	
	this.removeElement = function(element) {
		return this.execute("removeElement", element);
	};
	
	this.removeElementAt = function(index) {
		return this.execute("removeElementAt", index);
	};
	
	this.setElementIndex = function(element, index) {
		return this.execute("setElementIndex", element, index);
	};
	
	this.swapElements = function(element1, element2) {
		this.execute("swapElements", element1, element2);
	};
	
	this.swapElementsAt = function(index1, index2) {
		this.execute("swapElementsAt", index1, index2);
	};
}

Container.prototype.Extends = function(){
	Container.prototype = new UIComponent(mx_core_Container);
};
Container.Get = function(o){
	var ref = this;
	ref = UIComponent.Get(o, Container);
	return ref;
};
Container.Is = function(target) { return target instanceof Container; };

function mx_core_Container(){};