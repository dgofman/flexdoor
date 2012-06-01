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

function UIComponent(classType) 
{
	if(classType == undefined)
		throw new Error("Class Type is undefined");

	/* extendType - mx.core::UIComponent */
	EventDispatcher.call(this, classType);

	this.accessibilityDescription = function(){ /* getter and setter */
		return this.property("accessibilityDescription", arguments);
	};
	
	this.accessibilityEnabled = function(){ /* getter and setter */
		return this.property("accessibilityEnabled", arguments);
	};
	
	this.accessibilityName = function(){ /* getter and setter */
		return this.property("accessibilityName", arguments);
	};
	
	this.accessibilityShortcut = function(){ /* getter and setter */
		return this.property("accessibilityShortcut", arguments);
	};

	this.activeEffects = function(){
		return this.getter("activeEffects");
	};
	
	this.alpha = function(){ /* getter and setter */
		return this.property("alpha", arguments);
	};
	
	this.automationDelegate = function(){ /* getter and setter */
		return this.property("automationDelegate", arguments);
	};

	this.automationEnabled = function(){
		return this.getter("automationEnabled");
	};

	this.automationName = function(){ /* getter and setter */
		return this.property("automationName", arguments);
	};
	
	this.automationOwner = function(){
		return this.getter("automationOwner");
	};

	this.automationParent = function(){
		return this.getter("automationParent");
	};

	this.automationTabularData = function(){
		return this.getter("automationTabularData");
	};
	
	this.automationValue = function(){
		return this.getter("automationValue");
	};
	
	this.automationVisible = function(){
		return this.getter("automationVisible");
	};
	
	this.baseline = function(){ /* getter and setter */
		return this.property("baseline", arguments);
	};
	
	this.baselinePosition = function(){
		return this.getter("baselinePosition");
	};

	this.blendMode = function(){ /* getter and setter */
		return this.property("blendMode");
	};
	
	this.bottom = function(){ /* getter and setter */
		return this.property("bottom");
	};
	
	this.cacheAsBitmap = function(value){
		return this.setter("cacheAsBitmap", value);
	};
	
	this.cacheHeuristic = function(value){
		return this.setter("cacheHeuristic", value);
	};
	
	this.cachePolicy = function(){ /* getter and setter */
		return this.property("cachePolicy", arguments);
	};
	
	this.className = function(){
		return this.getter("className");
	};
	
	this.contentMouseX = function(){
		return this.getter("contentMouseX");
	};
	
	this.contentMouseY = function(){
		return this.getter("contentMouseY");
	};
	
	this.currentState = function(){ /* getter and setter */
		return this.property("currentState", arguments);
	};
	
	this.depth = function(){ /* getter and setter */
		return this.property("depth", arguments);
	};
	
	this.depth = function(){ /* getter and setter */
		return this.property("depth", arguments);
	};
	
	this.descriptor = function(){ /* getter and setter */
		return this.property("descriptor", arguments);
	};
	
	this.designLayer = function(){ /* getter and setter */
		return this.property("designLayer", arguments);
	};
	
	this.document = function(){ /* getter and setter */
		return this.property("document", arguments);
	};
	
	this.doubleClickEnabled = function(){ /* getter and setter */
		return this.property("doubleClickEnabled", arguments);
	};
	
	this.enabled = function(){ /* getter and setter */
		return this.property("enabled", arguments);
	};

	this.errorString = function(){ /* getter and setter */
		return this.property("errorString", arguments);
	};
	
	this.explicitHeight = function(){ /* getter and setter */
		return this.property("explicitHeight", arguments);
	};
	
	this.explicitMaxHeight = function(){ /* getter and setter */
		return this.property("explicitMaxHeight", arguments);
	};
	
	this.explicitMaxWidth = function(){ /* getter and setter */
		return this.property("explicitMaxWidth", arguments);
	};
	
	this.explicitMinHeight = function(){ /* getter and setter */
		return this.property("explicitMinHeight", arguments);
	};
	
	this.explicitMinWidth = function(){ /* getter and setter */
		return this.property("explicitMinWidth", arguments);
	};
	
	this.explicitWidth = function(){ /* getter and setter */
		return this.property("explicitWidth", arguments);
	};
	
	this.filters = function(){ /* getter and setter */
		return this.property("filters", arguments);
	};
	
	this.flexContextMenu = function(){ /* getter and setter */
		return this.property("flexContextMenu", arguments);
	};
	
	this.focusEnabled = function(){ /* getter and setter */
		return this.property("focusEnabled", arguments);
	};
	
	this.focusManager = function(){ /* getter and setter */
		return this.property("focusManager", arguments);
	};
	
	this.focusPane = function(){ /* getter and setter */
		return this.property("focusPane", arguments);
	};
		
	this.hasFocusableChildren = function(){ /* getter and setter */
		return this.property("hasFocusableChildren", arguments);
	};
	
	this.hasLayoutMatrix3D = function(){
		return this.getter("hasLayoutMatrix3D");
	};
	
	this.height = function(){ /* getter and setter */
		return this.property("height", arguments);
	};
	
	this.horizontalCenter = function(){ /* getter and setter */
		return this.property("horizontalCenter", arguments);
	};
	
	this.id = function(){ /* getter and setter */
		return this.property("id", arguments);
	};
	
	this.includeInLayout = function(){ /* getter and setter */
		return this.property("includeInLayout", arguments);
	};
	
	this.inheritingStyles = function(){ /* getter and setter */
		return this.property("inheritingStyles", arguments);
	};
	
	this.initialized = function(){ /* getter and setter */
		return this.property("initialized", arguments);
	};
	
	this.instanceIndex = function(){
		return this.getter("instanceIndex");
	};
	
	this.instanceIndices = function(){ /* getter and setter */
		return this.property("instanceIndices", arguments);
	};
	
	this.is3D = function(){
		return this.getter("is3D");
	};
	
	this.isDocument = function(){
		return this.getter("isDocument");
	};
	
	this.isPopUp = function(){ /* getter and setter */
		return this.property("isPopUp", arguments);
	};
	
	this.layoutDirection = function(){ /* getter and setter */
		return this.property("layoutDirection", arguments);
	};
	
	this.layoutMatrix3D = function(value){
		return this.setter("layoutMatrix3D", value);
	};
	
	this.left = function(){ /* getter and setter */
		return this.property("left", arguments);
	};
	
	this.maintainProjectionCenter = function(){ /* getter and setter */
		return this.property("maintainProjectionCenter", arguments);
	};
	
	this.maxHeight = function(){ /* getter and setter */
		return this.property("maxHeight", arguments);
	};
	
	this.maxWidth = function(){ /* getter and setter */
		return this.property("maxWidth", arguments);
	};
	
	this.measuredHeight = function(){ /* getter and setter */
		return this.property("measuredHeight", arguments);
	};
	
	this.measuredMinHeight = function(){ /* getter and setter */
		return this.property("measuredMinHeight", arguments);
	};
	
	this.measuredMinWidth = function(){ /* getter and setter */
		return this.property("measuredMinWidth", arguments);
	};
	
	this.measuredWidth = function(){ /* getter and setter */
		return this.property("measuredWidth", arguments);
	};
	
	this.minHeight = function(){ /* getter and setter */
		return this.property("minHeight", arguments);
	};
	
	this.minWidth = function(){ /* getter and setter */
		return this.property("minWidth", arguments);
	};
	
	this.moduleFactory = function(){ /* getter and setter */
		return this.property("moduleFactory", arguments);
	};
	
	this.mouseFocusEnabled = function(){ /* getter and setter */
		return this.property("mouseFocusEnabled", arguments);
	};
	
	this.mouseX = function(){
		return this.getter("mouseX");
	};
	
	this.mouseY = function(){
		return this.getter("mouseY");
	};
	
	this.nestLevel = function(){ /* getter and setter */
		return this.property("nestLevel", arguments);
	};
	
	this.nonInheritingStyles = function(){ /* getter and setter */
		return this.property("nonInheritingStyles", arguments);
	};
	
	this.numAutomationChildren = function(){
		return this.getter("numAutomationChildren");
	};
	
	this.owner = function(){ /* getter and setter */
		return this.property("owner", arguments);
	};
	
	this.parent = function(){
		return this.getter("parent");
	};
	
	this.parentApplication = function(){
		return this.getter("parentApplication");
	};
	
	this.parentDocument = function(){
		return this.getter("parentDocument");
	};
	
	this.percentHeight = function(){ /* getter and setter */
		return this.property("percentHeight", arguments);
	};
	
	this.percentWidth = function(){ /* getter and setter */
		return this.property("percentWidth", arguments);
	};
	
	this.postLayoutTransformOffsets = function(){ /* getter and setter */
		return this.property("postLayoutTransformOffsets", arguments);
	};
	
	this.processedDescriptors = function(){ /* getter and setter */
		return this.property("processedDescriptors", arguments);
	};
	
	this.repeater = function(){
		return this.getter("repeater");
	};
	
	this.repeaterIndex = function(){
		return this.getter("repeaterIndex");
	};
	
	this.repeaterIndices = function(){ /* getter and setter */
		return this.property("repeaterIndices", arguments);
	};
	
	this.repeaters = function(){ /* getter and setter */
		return this.property("repeaters", arguments);
	};
	
	this.right = function(){ /* getter and setter */
		return this.property("right", arguments);
	};
	
	this.rotation = function(){ /* getter and setter */
		return this.property("rotation", arguments);
	};
	
	this.rotationX = function(){ /* getter and setter */
		return this.property("rotationX", arguments);
	};
	
	this.rotationY = function(){ /* getter and setter */
		return this.property("rotationY", arguments);
	};
	
	this.rotationZ = function(){ /* getter and setter */
		return this.property("rotationZ", arguments);
	};
	
	this.scaleX = function(){ /* getter and setter */
		return this.property("scaleX", arguments);
	};
	
	this.scaleY = function(){ /* getter and setter */
		return this.property("scaleY", arguments);
	};
	
	this.scaleZ = function(){ /* getter and setter */
		return this.property("scaleZ", arguments);
	};
	
	this.screen = function(){
		return this.getter("screen");
	};
	
	this.showInAutomationHierarchy = function(){ /* getter and setter */
		return this.property("showInAutomationHierarchy", arguments);
	};
	
	this.states = function(){ /* getter and setter */
		return this.property("states", arguments);
	};
	
	this.styleDeclaration = function(){ /* getter and setter */
		return this.property("styleDeclaration", arguments);
	};
	
	this.styleManager = function(){
		return this.getter("styleManager");
	};
	
	this.styleName = function(){ /* getter and setter */
		return this.property("styleName", arguments);
	};
	
	this.styleParent = function(){ /* getter and setter */
		return this.property("styleParent", arguments);
	};
	
	this.systemManager = function(){ /* getter and setter */
		return this.property("systemManager", arguments);
	};
	
	this.tabFocusEnabled = function(){ /* getter and setter */
		return this.property("tabFocusEnabled", arguments);
	};
	
	this.tabIndex = function(){ /* getter and setter */
		return this.property("tabIndex", arguments);
	};

	this.toolTip = function(){ /* getter and setter */
		return this.property("toolTip", arguments);
	};
	
	this.top = function(){ /* getter and setter */
		return this.property("top", arguments);
	};
	
	this.transform = function(){ /* getter and setter */
		return this.property("transform", arguments);
	};
	
	this.transformX = function(){ /* getter and setter */
		return this.property("transformX", arguments);
	};
	
	this.transformY = function(){ /* getter and setter */
		return this.property("transformY", arguments);
	};
	
	this.transformZ = function(){ /* getter and setter */
		return this.property("transformZ", arguments);
	};
	
	this.transitions = function(){ /* getter and setter */
		return this.property("transitions", arguments);
	};
	
	this.tweeningProperties = function(){ /* getter and setter */
		return this.property("tweeningProperties", arguments);
	};
	
	this.uid = function(){ /* getter and setter */
		return this.property("uid", arguments);
	};
	
	this.updateCompletePendingFlag = function(){ /* getter and setter */
		return this.property("updateCompletePendingFlag", arguments);
	};
	
	this.validationSubField = function(){ /* getter and setter */
		return this.property("validationSubField", arguments);
	};
	
	this.verticalCenter = function(){ /* getter and setter */
		return this.property("verticalCenter", arguments);
	};
	
	this.visible = function(){ /* getter and setter */
		return this.property("visible", arguments);
	};
	
	this.width = function(){ /* getter and setter */
		return this.property("width", arguments);
	};
	
	this.x = function(){ /* getter and setter */
		return this.property("x", arguments);
	};
	
	this.y = function(){ /* getter and setter */
		return this.property("y", arguments);
	};
	
	this.z = function(){ /* getter and setter */
		return this.property("z", arguments);
	};
	
	//API's
	this.contentToGlobal = function(point){
		return this.execute("contentToGlobal", point);
	};
	
	this.contentToLocal = function(point){
		return this.execute("contentToLocal", point);
	};
	
	this.drawFocus = function(isFocused){
		this.execute("drawFocus", isFocused);
	};
	
	this.drawRoundRect = function(x, y, w, h, r, c, alpha, rot, gradient, ratios, hole){
		this.execute("drawRoundRect", x, y, w, h, r, c, alpha, rot, gradient, ratios, hole);
	};
	
	this.executeBindings = function(recurse){
		this.execute("executeBindings", recurse);
	};
	
	this.getAutomationChildAt = function(index){
		return this.execute("getAutomationChildAt", index);
	};
	
	this.getAutomationChildren = function(){
		return this.execute("getAutomationChildren");
	};
	
	this.getClassStyleDeclarations = function(){
		return this.execute("getClassStyleDeclarations");
	};
	
	this.getConstraintValue = function(){
		return this.execute("getConstraintValue");
	};
	
	this.getFocus = function(){
		return this.execute("getFocus");
	};
	
	this.getRepeaterItem = function(whichRepeater){
		if(whichRepeater === undefined) whichRepeater = -1;
		return this.execute("getRepeaterItem", whichRepeater);
	};
	
	this.getStyle = function(styleProp){
		return this.execute("getStyle", styleProp);
	};
	
	this.globalToContent = function(point){
		return this.execute("globalToContent", point);
	};
	
	this.hasState = function(stateName){
		return this.execute("hasState", stateName);
	};
	
	this.initialize = function(){
		this.execute("initialize");
	};
	
	this.invalidateDisplayList = function(){
		this.execute("invalidateDisplayList");
	};
	
	this.invalidateLayering = function(){
		this.execute("invalidateLayering");
	};
	
	this.invalidateLayoutDirection = function(){
		this.execute("invalidateLayoutDirection");
	};
	
	this.invalidateProperties = function(){
		this.execute("invalidateProperties");
	};
	
	this.invalidateSize = function(){
		this.execute("invalidateSize");
	};
	
	this.localToContent = function(point){
		return this.execute("localToContent", point);
	};
	
	this.matchesCSSState = function(cssState){
		return this.execute("matchesCSSState", cssState);
	};
	
	this.matchesCSSType = function(cssType){
		return this.execute("matchesCSSType", cssType);
	};
	
	this.measureHTMLText = function(htmlText){
		return this.execute("measureHTMLText", htmlText);
	};
	
	this.measureText = function(text){
		return this.execute("measureText", text);
	};
	
	this.move = function(x, y){
		this.execute("move", x, y);
	};
	
	this.notifyStyleChangeInChildren = function(stylePropy, recursive){
		this.execute("notifyStyleChangeInChildren", styleProp, recursive);
	};
	
	this.owns = function(child){
		return this.execute("owns", child);
	};
	
	this.regenerateStyleCache = function(recursive){
		this.execute("regenerateStyleCache", recursive);
	};
	
	this.registerEffects = function(effects){
		this.execute("registerEffects", effects);
	};
	
	this.setActualSize = function(w, h){
		this.execute("setActualSize", w, h);
	};
	
	this.setChildIndex = function(child, newIndex){
		this.execute("setChildIndex", child, newIndex);
	};
	
	this.setConstraintValue = function(constraintName, value){
		this.execute("setConstraintValue", constraintName, value);
	};
	
	this.setCurrentState = function(stateName, playTransition){
		if(playTransition === undefined) playTransition = true;
		this.execute("setCurrentState", stateName, playTransition);
	};
	
	this.setFocus = function(){
		this.execute("setFocus");
	};
	
	this.setStyle = function(styleProp, newValue){
		this.execute("setStyle", styleProp, newValue);
	};
	
	this.setVisible = function(value, noEvent){
		if(noEvent === undefined) noEvent = false;
		this.execute("setVisible", value, noEvent);
	};
	
	this.stopDrag = function(){
		this.execute("stopDrag");
	};
	
	this.styleChanged = function(styleProp){
		this.execute("styleChanged", styleProp);
	};
	
	this.stylesInitialized = function(){
		this.execute("stylesInitialized");
	};
	
	this.validateDisplayList = function(){
		this.execute("validateDisplayList");
	};
	
	this.validateNow = function(){
		this.execute("validateNow");
	};
	
	this.validateProperties = function(){
		this.execute("validateProperties");
	};
	
	this.validateSize = function(recursive){
		if(recursive === undefined) recursive = false;
		this.execute("validateSize", recursive);
	};
	
	this.validationResultHandler = function(event){
		this.execute("validationResultHandler", event);
	};
	
	this.verticalGradientMatrix = function(x, y, width, height){
		return this.execute("verticalGradientMatrix", x, y, width, height);
	};
}

UIComponent.prototype = new EventDispatcher();
UIComponent.Get = function(o, classType){
	var ref = this;
	if(classType == undefined) classType = UIComponent;
	ref = EventDispatcher.Get(o, classType);
	return ref;
};
UIComponent.Is = function(target) { return target instanceof UIComponent; };

function mx_core_UIComponent(){};