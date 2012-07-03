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

/**
 * The UIComponent class is the base class for all visual components,
 * both interactive and noninteractive.
 *
 * An interactive component can participate in tabbing and other kinds of
 * keyboard focus manipulation, accept low-level events like keyboard and
 * mouse input, and be disabled so that it does not receive keyboard and
 * mouse input.
 * This is in contrast to noninteractive components, like Label and
 * ProgressBar, which simply display contents and are not manipulated by
 * the user.
 * The UIComponent class is not used as an MXML tag, but is used as a base
 * class for other classes.
 */
function UIComponent(classType)
{
	if(classType == undefined)
		throw new Error("Class Type is undefined");

	/* extendType - mx.core::UIComponent */
	EventDispatcher.call(this, classType);

	/**
	 * @property {String} accessibilityDescription
	 *
	 * A convenience accessor for the description property
	 * in this UIComponent's accessibilityProperties object.
	 *
	 * The getter simply returns accessibilityProperties.description,
	 * or "" if accessibilityProperties is null.
	 * The setter first checks whether accessibilityProperties is null,
	 * and if it is, sets it to a new AccessibilityProperties instance.
	 * Then it sets accessibilityProperties.description.
	 */
	this.accessibilityDescription = function(){ /* getter and setter */
		return this.property("accessibilityDescription", arguments);
	};

	/**
	 * @property {Boolean} accessibilityEnabled
	 *
	 * A convenience accessor for the silent property
	 * in this UIComponent's accessibilityProperties object.
	 *
	 * Note that accessibilityEnabled has the opposite sense from silent;
	 * accessibilityEnabled is true
	 * when silent is false.
	 *
	 * The getter simply returns accessibilityProperties.silent,
	 * or true if accessibilityProperties is null.
	 * The setter first checks whether accessibilityProperties is null,
	 * and if it is, sets it to a new AccessibilityProperties instance.
	 * Then it sets accessibilityProperties.silent.
	 */
	this.accessibilityEnabled = function(){ /* getter and setter */
		return this.property("accessibilityEnabled", arguments);
	};

	/**
	 * @property {String} accessibilityName
	 *
	 * A convenience accessor for the name property
	 * in this UIComponent's accessibilityProperties object.
	 *
	 * The getter simply returns accessibilityProperties.name,
	 * or "" if accessibilityProperties is null.
	 * The setter first checks whether accessibilityProperties is null,
	 * and if it is, sets it to a new AccessibilityProperties instance.
	 * Then it sets accessibilityProperties.name.
	 */
	this.accessibilityName = function(){ /* getter and setter */
		return this.property("accessibilityName", arguments);
	};

	/**
	 * @property {String} accessibilityShortcut
	 *
	 * A convenience accessor for the shortcut property
	 * in this UIComponent's accessibilityProperties object.
	 *
	 * The getter simply returns accessibilityProperties.shortcut,
	 * or "" if accessibilityProperties is null.
	 * The setter first checks whether accessibilityProperties is null,
	 * and if it is, sets it to a new AccessibilityProperties instance.
	 * Then it sets accessibilityProperties.shortcut.
	 */
	this.accessibilityShortcut = function(){ /* getter and setter */
		return this.property("accessibilityShortcut", arguments);
	};

	/**
	 * @property {Array} activeEffects
	 *
	 * The list of effects that are currently playing on the component,
	 * as an Array of EffectInstance instances.
	 * @readonly
	 */
	this.activeEffects = function(){
		return this.getter("activeEffects");
	};

	/**
	 * @property {Object} alpha
	 *
	 * The UIComponent class is the base class for all visual components,
	 * both interactive and noninteractive.
	 *
	 * An interactive component can participate in tabbing and other kinds of
	 * keyboard focus manipulation, accept low-level events like keyboard and
	 * mouse input, and be disabled so that it does not receive keyboard and
	 * mouse input.
	 * This is in contrast to noninteractive components, like Label and
	 * ProgressBar, which simply display contents and are not manipulated by
	 * the user.
	 * The UIComponent class is not used as an MXML tag, but is used as a base
	 * class for other classes.
	 */
	this.alpha = function(){ /* getter and setter */
		return this.property("alpha", arguments);
	};

	/**
	 * @property {Object} automationDelegate
	 *
	 * The delegate object that handles the automation-related functionality.
	 */
	this.automationDelegate = function(){ /* getter and setter */
		return this.property("automationDelegate", arguments);
	};

	/**
	 * @property {Boolean} automationEnabled
	 *
	 * True if this component is enabled for automation, false
	 * otherwise.
	 * @readonly
	 */
	this.automationEnabled = function(){
		return this.getter("automationEnabled");
	};

	/**
	 * @property {String} automationName
	 *
	 * Name that can be used as an identifier for this object.
	 */
	this.automationName = function(){ /* getter and setter */
		return this.property("automationName", arguments);
	};

	/**
	 * @property {DisplayObjectContainer} automationOwner
	 *
	 * The owner of this component for automation purposes.
	 * @readonly
	 */
	this.automationOwner = function(){
		return this.getter("automationOwner");
	};

	/**
	 * @property {DisplayObjectContainer} automationParent
	 *
	 * The parent of this component for automation purposes.
	 * @readonly
	 */
	this.automationParent = function(){
		return this.getter("automationParent");
	};

	/**
	 * @property {Object} automationTabularData
	 *
	 * An implementation of the IAutomationTabularData interface, which
	 * can be used to retrieve the data.
	 * @readonly
	 */
	this.automationTabularData = function(){
		return this.getter("automationTabularData");
	};

	/**
	 * @property {Array} automationValue
	 *
	 * This value generally corresponds to the rendered appearance of the
	 * object and should be usable for correlating the identifier with
	 * the object as it appears visually within the application.
	 * @readonly
	 */
	this.automationValue = function(){
		return this.getter("automationValue");
	};

	/**
	 * @property {Boolean} automationVisible
	 *
	 * True if this component is visible for automation, false
	 * otherwise.
	 * @readonly
	 */
	this.automationVisible = function(){
		return this.getter("automationVisible");
	};

	/**
	 * @property {Object} baseline
	 *
	 * For components, this layout constraint property is a
	 * facade on top of the similarly-named style. To set
	 * the property to its default value of undefined,
	 * use the @Clear() directive in MXML or the undefined
	 * value in ActionScript code. For example, in MXML code,
	 * baseline.s2="@Clear()" unsets the baseline
	 * constraint in state s2. Or in ActionScript code,
	 * button.baseline = undefined unsets the baseline
	 * constraint on button.
	 *
	 *
	 * The vertical distance in pixels from the anchor target to
	 * the control's baseline position.
	 *
	 * By default the anchor target is the top edge of the container's
	 * content area. In layouts with advanced constraints, the target can be
	 * a constraint row.
	 *
	 * Setting the property to a number or to a numerical string like "10"
	 * specifies use of the default anchor target.
	 *
	 * To specify an anchor target, set the property value to a string in the format:
	 * "anchorTargetName:value". For example, "row1:10".
	 */
	this.baseline = function(){ /* getter and setter */
		return this.property("baseline", arguments);
	};

	/**
	 * @property {Number} baselinePosition
	 *
	 *
	 * The y-coordinate of the baseline
	 * of the first line of text of the component.
	 *
	 * This property is used to implement
	 * the baseline constraint style.
	 * It is also used to align the label of a FormItem
	 * with the controls in the FormItem.
	 * @readonly
	 */
	this.baselinePosition = function(){
		return this.getter("baselinePosition");
	};

	this.blendMode = function(){ /* getter and setter */
		return this.property("blendMode");
	};

	/**
	 * @property {Object} bottom
	 *
	 * For components, this layout constraint property is a
	 * facade on top of the similarly-named style. To set
	 * the property to its default value of undefined,
	 * use the @Clear() directive in MXML or the undefined
	 * value in ActionScript code. For example, in MXML code,
	 * bottom.s2="@Clear()" unsets the bottom
	 * constraint in state s2. Or in ActionScript code,
	 * button.bottom = undefined unsets the bottom
	 * constraint on button.
	 *
	 *
	 * The vertical distance in pixels from the bottom edge of the component to the
	 * anchor target's bottom edge.
	 *
	 * By default the anchor target is the container's content area. In layouts
	 * with advanced constraints, the target can be a constraint row.
	 *
	 * Setting the property to a number or to a numerical string like "10"
	 * specifies use of the default anchor target.
	 *
	 * To specify an anchor target, set the property value to a string in the format:
	 * "anchorTargetName:value". For example, "row1:10".
	 */
	this.bottom = function(){ /* getter and setter */
		return this.property("bottom");
	};
	this.cacheAsBitmap = function(value){
		return this.setter("cacheAsBitmap", value);
	};

	/**
	 * @property {Boolean} cacheHeuristic
	 *
	 * Used by Flex to suggest bitmap caching for the object.
	 * If cachePolicy is UIComponentCachePolicy.AUTO,
	 * then cacheHeuristic
	 * is used to control the object's cacheAsBitmap property.
	 * @writeonly
	 */
	this.cacheHeuristic = function(value){
		return this.setter("cacheHeuristic", value);
	};

	/**
	 * @property {String} cachePolicy
	 *
	 * Specifies the bitmap caching policy for this object.
	 * Possible values in MXML are "on",
	 * "off" and
	 * "auto" (default).
	 *
	 * Possible values in ActionScript are UIComponentCachePolicy.ON,
	 * UIComponentCachePolicy.OFF and
	 * UIComponentCachePolicy.AUTO (default).
	 *
	 * A value of UIComponentCachePolicy.ON means that
	 * the object is always cached as a bitmap.</li><li>A value of UIComponentCachePolicy.OFF means that
	 * the object is never cached as a bitmap.</li><li>A value of UIComponentCachePolicy.AUTO means that
	 * the framework uses heuristics to decide whether the object should
	 * be cached as a bitmap.
	 */
	this.cachePolicy = function(){ /* getter and setter */
		return this.property("cachePolicy", arguments);
	};

	/**
	 * @property {String} className
	 *
	 * The name of this instance's class, such as "Button".
	 *
	 * This string does not include the package name.
	 * If you need the package name as well, call the
	 * getQualifiedClassName() method in the flash.utils package.
	 * It returns a string such as "mx.controls::Button".
	 * @readonly
	 */
	this.className = function(){
		return this.getter("className");
	};

	/**
	 * @property {Number} contentMouseX
	 *
	 * Returns the <i>x</i> position of the mouse, in the content coordinate system.
	 * Content coordinates specify a pixel position relative to the upper left
	 * corner of the component's content, and include all of the component's
	 * content area, including any regions that are currently clipped and must
	 * be accessed by scrolling the component.
	 * @readonly
	 */
	this.contentMouseX = function(){
		return this.getter("contentMouseX");
	};

	/**
	 * @property {Number} contentMouseY
	 *
	 * Returns the <i>y</i> position of the mouse, in the content coordinate system.
	 * Content coordinates specify a pixel position relative to the upper left
	 * corner of the component's content, and include all of the component's
	 * content area, including any regions that are currently clipped and must
	 * be accessed by scrolling the component.
	 * @readonly
	 */
	this.contentMouseY = function(){
		return this.getter("contentMouseY");
	};

	/**
	 * @property {String} currentState
	 *
	 * The current view state of the component.
	 * Set to "" or null to reset
	 * the component back to its base state.
	 *
	 * When you use this property to set a component's state,
	 * Flex applies any transition you have defined.
	 * You can also use the setCurrentState() method to set the
	 * current state; this method can optionally change states without
	 * applying a transition.
	 */
	this.currentState = function(){ /* getter and setter */
		return this.property("currentState", arguments);
	};

	/**
	 * @property {Number} depth
	 *
	 *
	 * Determines the order in which items inside of containers
	 * are rendered.
	 * Spark containers order their items based on their
	 * depth property, with the lowest depth in the back,
	 * and the higher in the front.
	 * Items with the same depth value appear in the order
	 * they are added to the container.
	 */
	this.depth = function(){ /* getter and setter */
		return this.property("depth", arguments);
	};

	/**
	 * @property {UIComponentDescriptor} descriptor
	 *
	 * Reference to the UIComponentDescriptor, if any, that was used
	 * by the createComponentFromDescriptor() method to create this
	 * UIComponent instance. If this UIComponent instance
	 * was not created from a descriptor, this property is null.
	 */
	this.descriptor = function(){ /* getter and setter */
		return this.property("descriptor", arguments);
	};

	/**
	 * @property {DesignLayer} designLayer
	 *
	 * Specifies the optional DesignLayer instance associated with this visual
	 * element.
	 *
	 * When a DesignLayer is assigned, a visual element must consider the
	 * visibility and alpha of its parent layer when ultimately committing its
	 * own effective visibility or alpha to its backing DisplayObject
	 * (if applicable).
	 *
	 * A visual element must listen for layerPropertyChange
	 * notifications from the associated layer parent.  When the
	 * effectiveAlpha or effectiveVisibility of the
	 * layer changes, the element must then compute its own effective visibility
	 * (or alpha) and apply it accordingly.
	 */
	this.designLayer = function(){ /* getter and setter */
		return this.property("designLayer", arguments);
	};

	/**
	 * @property {Object} document
	 *
	 * A reference to the document object associated with this UIComponent.
	 * A document object is an Object at the top of the hierarchy of a
	 * Flex application, MXML component, or AS component.
	 */
	this.document = function(){ /* getter and setter */
		return this.property("document", arguments);
	};

	/**
	 * @property {Boolean} doubleClickEnabled
	 *
	 * Specifies whether the UIComponent object receives doubleClick events.
	 * The default value is false, which means that the UIComponent object
	 * does not receive doubleClick events.
	 *
	 * The mouseEnabled property must also be set to true,
	 * its default value, for the object to receive doubleClick events.
	 * @writeonly
	 */
	this.doubleClickEnabled = function(){ /* getter and setter */
		return this.property("doubleClickEnabled", arguments);
	};

	/**
	 * @property {Boolean} enabled
	 *
	 * Whether the component can accept user interaction. After setting the enabled
	 * property to false, some components still respond to mouse interactions such
	 * as mouseOver. As a result, to fully disable UIComponents,
	 * you should also set the value of the mouseEnabled property to false.
	 * If you set the enabled property to false
	 * for a container, Flex dims the color of the container and of all
	 * of its children, and blocks user input to the container
	 * and to all of its children.
	 */
	this.enabled = function(){ /* getter and setter */
		return this.property("enabled", arguments);
	};

	/**
	 * @property {String} errorString
	 *
	 * The text that displayed by a component's error tip when a
	 * component is monitored by a Validator and validation fails.
	 *
	 * You can use the errorString property to show a
	 * validation error for a component, without actually using a validator class.
	 * When you write a String value to the errorString property,
	 * Flex draws a red border around the component to indicate the validation error,
	 * and the String appears in a tooltip as the validation error message when you move
	 * the mouse over the component, just as if a validator detected a validation error.
	 *
	 * To clear the validation error, write an empty String, "",
	 * to the errorString property.
	 *
	 * Note that writing a value to the errorString property
	 * does not trigger the valid or invalid events; it only changes the border
	 * color and displays the validation error message.
	 */
	this.errorString = function(){ /* getter and setter */
		return this.property("errorString", arguments);
	};

	/**
	 * @property {Number} explicitHeight
	 *
	 * Number that specifies the explicit height of the component,
	 * in pixels, in the component's coordinates.
	 *
	 * This value is used by the container in calculating
	 * the size and position of the component.
	 * It is not used by the component itself in determining
	 * its default size.
	 * Thus this property may not have any effect if parented by
	 * Container, or containers that don't factor in
	 * this property.
	 * Because the value is in component coordinates,
	 * the true explicitHeight with respect to its parent
	 * is affected by the scaleY property.
	 * Setting the height property also sets this property to
	 * the specified height value.
	 */
	this.explicitHeight = function(){ /* getter and setter */
		return this.property("explicitHeight", arguments);
	};

	/**
	 * @property {Number} explicitMaxHeight
	 *
	 * The maximum recommended height of the component to be considered
	 * by the parent during layout. This value is in the
	 * component's coordinates, in pixels.
	 *
	 * Application developers typically do not set the explicitMaxHeight property. Instead, they
	 * set the value of the maxHeight property, which sets the explicitMaxHeight property. The
	 * value of maxHeight does not change.
	 *
	 * At layout time, if maxHeight was explicitly set by the application developer, then
	 * the value of explicitMaxHeight is used. Otherwise, the default value for maxHeight
	 * is used.
	 *
	 * This value is used by the container in calculating
	 * the size and position of the component.
	 * It is not used by the component itself in determining
	 * its default size.
	 * Thus this property may not have any effect if parented by
	 * Container, or containers that don't factor in
	 * this property.
	 * Because the value is in component coordinates,
	 * the true maxHeight with respect to its parent
	 * is affected by the scaleY property.
	 * Some components have no theoretical limit to their height.
	 * In those cases their maxHeight is set to
	 * UIComponent.DEFAULT_MAX_HEIGHT.
	 */
	this.explicitMaxHeight = function(){ /* getter and setter */
		return this.property("explicitMaxHeight", arguments);
	};

	/**
	 * @property {Number} explicitMaxWidth
	 *
	 * The maximum recommended width of the component to be considered
	 * by the parent during layout. This value is in the
	 * component's coordinates, in pixels.
	 *
	 * Application developers typically do not set the explicitMaxWidth property. Instead, they
	 * set the value of the maxWidth property, which sets the explicitMaxWidth property. The
	 * value of maxWidth does not change.
	 *
	 * At layout time, if maxWidth was explicitly set by the application developer, then
	 * the value of explicitMaxWidth is used. Otherwise, the default value for maxWidth
	 * is used.
	 *
	 * This value is used by the container in calculating
	 * the size and position of the component.
	 * It is not used by the component itself in determining
	 * its default size.
	 * Thus this property may not have any effect if parented by
	 * Container, or containers that don't factor in
	 * this property.
	 * Because the value is in component coordinates,
	 * the true maxWidth with respect to its parent
	 * is affected by the scaleX property.
	 * Some components have no theoretical limit to their width.
	 * In those cases their maxWidth is set to
	 * UIComponent.DEFAULT_MAX_WIDTH.
	 */
	this.explicitMaxWidth = function(){ /* getter and setter */
		return this.property("explicitMaxWidth", arguments);
	};

	/**
	 * @property {Number} explicitMinHeight
	 *
	 * The minimum recommended height of the component to be considered
	 * by the parent during layout. This value is in the
	 * component's coordinates, in pixels.
	 *
	 * Application developers typically do not set the explicitMinHeight property. Instead, they
	 * set the value of the minHeight property, which sets the explicitMinHeight property. The
	 * value of minHeight does not change.
	 *
	 * At layout time, if minHeight was explicitly set by the application developer, then
	 * the value of explicitMinHeight is used. Otherwise, the value of measuredMinHeight
	 * is used.
	 *
	 * This value is used by the container in calculating
	 * the size and position of the component.
	 * It is not used by the component itself in determining
	 * its default size.
	 * Thus this property may not have any effect if parented by
	 * Container, or containers that don't factor in
	 * this property.
	 * Because the value is in component coordinates,
	 * the true minHeight with respect to its parent
	 * is affected by the scaleY property.
	 */
	this.explicitMinHeight = function(){ /* getter and setter */
		return this.property("explicitMinHeight", arguments);
	};

	/**
	 * @property {Number} explicitMinWidth
	 *
	 * The minimum recommended width of the component to be considered
	 * by the parent during layout. This value is in the
	 * component's coordinates, in pixels.
	 *
	 * Application developers typically do not set the explicitMinWidth property. Instead, they
	 * set the value of the minWidth property, which sets the explicitMinWidth property. The
	 * value of minWidth does not change.
	 *
	 * At layout time, if minWidth was explicitly set by the application developer, then
	 * the value of explicitMinWidth is used. Otherwise, the value of measuredMinWidth
	 * is used.
	 *
	 * This value is used by the container in calculating
	 * the size and position of the component.
	 * It is not used by the component itself in determining
	 * its default size.
	 * Thus this property may not have any effect if parented by
	 * Container, or containers that don't factor in
	 * this property.
	 * Because the value is in component coordinates,
	 * the true minWidth with respect to its parent
	 * is affected by the scaleX property.
	 */
	this.explicitMinWidth = function(){ /* getter and setter */
		return this.property("explicitMinWidth", arguments);
	};

	/**
	 * @property {Number} explicitWidth
	 *
	 * Number that specifies the explicit width of the component,
	 * in pixels, in the component's coordinates.
	 *
	 * This value is used by the container in calculating
	 * the size and position of the component.
	 * It is not used by the component itself in determining
	 * its default size.
	 * Thus this property may not have any effect if parented by
	 * Container, or containers that don't factor in
	 * this property.
	 * Because the value is in component coordinates,
	 * the true explicitWidth with respect to its parent
	 * is affected by the scaleX property.
	 * Setting the width property also sets this property to
	 * the specified width value.
	 */
	this.explicitWidth = function(){ /* getter and setter */
		return this.property("explicitWidth", arguments);
	};


	this.filters = function(){ /* getter and setter */
		return this.property("filters", arguments);
	};

	/**
	 * @property {IFlexContextMenu} flexContextMenu
	 *
	 * The context menu for this UIComponent.
	 */
	this.flexContextMenu = function(){ /* getter and setter */
		return this.property("flexContextMenu", arguments);
	};

	/**
	 * @property {Boolean} focusEnabled
	 *
	 * Indicates whether the component can receive focus when tabbed to.
	 * You can set focusEnabled to false
	 * when a UIComponent is used as a subcomponent of another component
	 * so that the outer component becomes the focusable entity.
	 * If this property is false, focus is transferred to
	 * the first parent that has focusEnable
	 * set to true.
	 *
	 * The default value is true, except for the
	 * spark.components.Scroller component.
	 * For that component, the default value is false.
	 */
	this.focusEnabled = function(){ /* getter and setter */
		return this.property("focusEnabled", arguments);
	};

	/**
	 * @property {IFocusManager} focusManager
	 *
	 * Gets the FocusManager that controls focus for this component
	 * and its peers.
	 * Each popup has its own focus loop and therefore its own instance
	 * of a FocusManager.
	 * To make sure you're talking to the right one, use this method.
	 */
	this.focusManager = function(){ /* getter and setter */
		return this.property("focusManager", arguments);
	};

	/**
	 * @property {Sprite} focusPane
	 *
	 * The focus pane associated with this object.
	 * An object has a focus pane when one of its children has focus.
	 */
	this.focusPane = function(){ /* getter and setter */
		return this.property("focusPane", arguments);
	};

	/**
	 * @property {Boolean} hasFocusableChildren
	 *
	 * A flag that indicates whether child objects can receive focus.
	 *
	 * <b>Note: </b>This property is similar to the tabChildren property
	 * used by Flash Player.
	 * Use the hasFocusableChildren property with Flex applications.
	 * Do not use the tabChildren property.
	 *
	 * This property is usually false because most components
	 * either receive focus themselves or delegate focus to a single
	 * internal sub-component and appear as if the component has
	 * received focus.
	 * For example, a TextInput control contains a focusable
	 * child RichEditableText control, but while the RichEditableText
	 * sub-component actually receives focus, it appears as if the
	 * TextInput has focus. TextInput sets hasFocusableChildren
	 * to false because TextInput is considered the
	 * component that has focus. Its internal structure is an
	 * abstraction.
	 *
	 * Usually only navigator components, such as TabNavigator and
	 * Accordion, have this flag set to true because they
	 * receive focus on Tab but focus goes to components in the child
	 * containers on further Tabs.
	 *
	 * The default value is false, except for the
	 * spark.components.Scroller component.
	 * For that component, the default value is true.
	 */
	this.hasFocusableChildren = function(){ /* getter and setter */
		return this.property("hasFocusableChildren", arguments);
	};

	/**
	 * @property {Boolean} hasLayoutMatrix3D
	 *
	 *
	 * Contains true if the element has 3D Matrix.
	 *
	 * Use hasLayoutMatrix3D instead of calling and examining the
	 * return value of getLayoutMatrix3D() because that method returns a valid
	 * matrix even when the element is in 2D.
	 * @readonly
	 */
	this.hasLayoutMatrix3D = function(){
		return this.getter("hasLayoutMatrix3D");
	};

	/**
	 * @property {Number} height
	 *
	 * Number that specifies the height of the component, in pixels,
	 * in the parent's coordinates.
	 * The default value is 0, but this property contains the actual component
	 * height after Flex completes sizing the components in your application.
	 *
	 * Note: You can specify a percentage value in the MXML
	 * height attribute, such as height="100%",
	 * but you cannot use a percentage value for the height
	 * property in ActionScript;
	 * use the percentHeight property instead.
	 *
	 * Setting this property causes a resize event to be dispatched.
	 * See the resize event for details on when
	 * this event is dispatched.
	 * @writeonly
	 */
	this.height = function(){ /* getter and setter */
		return this.property("height", arguments);
	};

	/**
	 * @property {Object} horizontalCenter
	 *
	 * For components, this layout constraint property is a
	 * facade on top of the similarly-named style. To set
	 * the property to its default value of undefined,
	 * use the @Clear() directive in MXML or the undefined
	 * value in ActionScript code. For example, in MXML code,
	 * horizontalCenter.s2="@Clear()" unsets the
	 * horizontalCenter
	 * constraint in state s2. Or in ActionScript code,
	 * button.horizontalCenter = undefined unsets the
	 * horizontalCenter constraint on button.
	 *
	 *
	 * The horizontal distance in pixels from the center of the component to the
	 * center of the anchor target's content area.
	 */
	this.horizontalCenter = function(){ /* getter and setter */
		return this.property("horizontalCenter", arguments);
	};

	/**
	 * @property {String} id
	 *
	 * ID of the component. This value becomes the instance name of the object
	 * and should not contain any white space or special characters. Each component
	 * throughout an application should have a unique id.
	 *
	 * If your application is going to be tested by third party tools, give each component
	 * a meaningful id. Testing tools use ids to represent the control in their scripts and
	 * having a meaningful name can make scripts more readable. For example, set the
	 * value of a button to submit_button rather than b1 or button1.
	 */
	this.id = function(){ /* getter and setter */
		return this.property("id", arguments);
	};

	/**
	 * @property {Boolean} includeInLayout
	 *
	 * Specifies whether this component is included in the layout of the
	 * parent container.
	 * If true, the object is included in its parent container's
	 * layout and is sized and positioned by its parent container as per its layout rules.
	 * If false, the object size and position are not affected by its parent container's
	 * layout.
	 */
	this.includeInLayout = function(){ /* getter and setter */
		return this.property("includeInLayout", arguments);
	};

	/**
	 * @property {Object} inheritingStyles
	 *
	 * The beginning of this component's chain of inheriting styles.
	 * The getStyle() method simply accesses
	 * inheritingStyles[styleName] to search the entire
	 * prototype-linked chain.
	 * This object is set up by initProtoChain().
	 * Developers typically never need to access this property directly.
	 */
	this.inheritingStyles = function(){ /* getter and setter */
		return this.property("inheritingStyles", arguments);
	};

	/**
	 * @property {Boolean} initialized
	 *
	 * A flag that determines if an object has been through all three phases
	 * of layout: commitment, measurement, and layout (provided that any were required).
	 */
	this.initialized = function(){ /* getter and setter */
		return this.property("initialized", arguments);
	};

	/**
	 * @property {int} instanceIndex
	 *
	 * The index of a repeated component.
	 * If the component is not within a Repeater, the value is -1.
	 * @readonly
	 */
	this.instanceIndex = function(){
		return this.getter("instanceIndex");
	};

	/**
	 * @property {Array} instanceIndices
	 *
	 * An Array containing the indices required to reference
	 * this UIComponent object from its parent document.
	 * The Array is empty unless this UIComponent object is within one or more Repeaters.
	 * The first element corresponds to the outermost Repeater.
	 * For example, if the id is "b" and instanceIndices is [2,4],
	 * you would reference it on the parent document as b[2][4].
	 */
	this.instanceIndices = function(){ /* getter and setter */
		return this.property("instanceIndices", arguments);
	};

	/**
	 * @property {Boolean} is3D
	 *
	 *
	 * Contains true when the element is in 3D.
	 * The element can be in 3D either because
	 * it has 3D transform properties or it has 3D post layout transform offsets or both.
	 * @readonly
	 */
	this.is3D = function(){
		return this.getter("is3D");
	};

	/**
	 * @property {Boolean} isDocument
	 *
	 * Contains true if this UIComponent instance is a document object.
	 * That means it is at the top of the hierarchy of a Flex
	 * application, MXML component, or ActionScript component.
	 * @readonly
	 */
	this.isDocument = function(){
		return this.getter("isDocument");
	};

	/**
	 * @property {Boolean} isPopUp
	 *
	 * Set to true by the PopUpManager to indicate
	 * that component has been popped up.
	 */
	this.isPopUp = function(){ /* getter and setter */
		return this.property("isPopUp", arguments);
	};

	/**
	 * @property {} layoutDirection
	 *
	 * The UIComponent class is the base class for all visual components,
	 * both interactive and noninteractive.
	 *
	 * An interactive component can participate in tabbing and other kinds of
	 * keyboard focus manipulation, accept low-level events like keyboard and
	 * mouse input, and be disabled so that it does not receive keyboard and
	 * mouse input.
	 * This is in contrast to noninteractive components, like Label and
	 * ProgressBar, which simply display contents and are not manipulated by
	 * the user.
	 * The UIComponent class is not used as an MXML tag, but is used as a base
	 * class for other classes.
	 */
	this.layoutDirection = function(){ /* getter and setter */
		return this.property("layoutDirection", arguments);
	};

	/**
	 * @property {Matrix3D} layoutMatrix3D
	 *
	 * The transform matrix that is used to calculate a component's layout
	 * relative to its siblings. This matrix is defined by the component's
	 * 3D properties (which include the 2D properties such as x,
	 * y, rotation, scaleX,
	 * scaleY, transformX, and
	 * transformY, as well as rotationX,
	 * rotationY, scaleZ, z, and
	 * transformZ.
	 * @writeonly
	 */
	this.layoutMatrix3D = function(value){
		return this.setter("layoutMatrix3D", value);
	};

	/**
	 * @property {Object} left
	 *
	 * For components, this layout constraint property is a
	 * facade on top of the similarly-named style. To set
	 * a state-specific value of the property in MXML to its default
	 * value of undefined,
	 * use the @Clear() directive. For example, in MXML code,
	 * left.s2="@Clear()" unsets the left
	 * constraint in state s2. Or in ActionScript code,
	 * button.left = undefined unsets the left
	 * constraint on button.
	 *
	 *
	 * The horizontal distance in pixels from the left edge of the component to the
	 * anchor target's left edge.
	 *
	 * By default the anchor target is the container's content area. In layouts
	 * with advanced constraints, the target can be a constraint column.
	 *
	 * Setting the property to a number or to a numerical string like "10"
	 * specifies use of the default anchor target.
	 *
	 * To specify an anchor target, set the property value to a string in the format
	 * "anchorTargetName:value". For example, "col1:10".
	 */
	this.left = function(){ /* getter and setter */
		return this.property("left", arguments);
	};

	/**
	 * @property {Boolean} maintainProjectionCenter
	 *
	 * When true, the component keeps its projection matrix centered on the
	 * middle of its bounding box.  If no projection matrix is defined on the
	 * component, one is added automatically.
	 */
	this.maintainProjectionCenter = function(){ /* getter and setter */
		return this.property("maintainProjectionCenter", arguments);
	};

	/**
	 * @property {Number} maxHeight
	 *
	 * The maximum recommended height of the component to be considered
	 * by the parent during layout. This value is in the
	 * component's coordinates, in pixels. The default value of this property is
	 * set by the component developer.
	 *
	 * The component developer uses this property to set an upper limit on the
	 * height of the component.
	 *
	 * If the application developer overrides the default value of maxHeight,
	 * the new value is stored in explicitMaxHeight. The default value of maxHeight
	 * does not change. As a result, at layout time, if
	 * maxHeight was explicitly set by the application developer, then the value of
	 * explicitMaxHeight is used for the component's maximum recommended height.
	 * If maxHeight is not set explicitly by the user, then the default value is used.
	 *
	 * This value is used by the container in calculating
	 * the size and position of the component.
	 * It is not used by the component itself in determining
	 * its default size.
	 *
	 * Thus this property may not have any effect if parented by
	 * Container, or containers that don't factor in
	 * this property.
	 * Because the value is in component coordinates,
	 * the true maxHeight with respect to its parent
	 * is affected by the scaleY property.
	 * Some components have no theoretical limit to their height.
	 * In those cases their maxHeight is set to
	 * UIComponent.DEFAULT_MAX_HEIGHT.
	 */
	this.maxHeight = function(){ /* getter and setter */
		return this.property("maxHeight", arguments);
	};

	/**
	 * @property {Number} maxWidth
	 *
	 * The maximum recommended width of the component to be considered
	 * by the parent during layout. This value is in the
	 * component's coordinates, in pixels. The default value of this property is
	 * set by the component developer.
	 *
	 * The component developer uses this property to set an upper limit on the
	 * width of the component.
	 *
	 * If the application developer overrides the default value of maxWidth,
	 * the new value is stored in explicitMaxWidth. The default value of maxWidth
	 * does not change. As a result, at layout time, if
	 * maxWidth was explicitly set by the application developer, then the value of
	 * explicitMaxWidth is used for the component's maximum recommended width.
	 * If maxWidth is not set explicitly by the user, then the default value is used.
	 *
	 * This value is used by the container in calculating
	 * the size and position of the component.
	 * It is not used by the component itself in determining
	 * its default size.
	 * Thus this property may not have any effect if parented by
	 * Container, or containers that don't factor in
	 * this property.
	 * Because the value is in component coordinates,
	 * the true maxWidth with respect to its parent
	 * is affected by the scaleX property.
	 * Some components have no theoretical limit to their width.
	 * In those cases their maxWidth is set to
	 * UIComponent.DEFAULT_MAX_WIDTH.
	 */
	this.maxWidth = function(){ /* getter and setter */
		return this.property("maxWidth", arguments);
	};

	/**
	 * @property {Number} measuredHeight
	 *
	 * The default height of the component, in pixels.
	 * This value is set by the measure() method.
	 */
	this.measuredHeight = function(){ /* getter and setter */
		return this.property("measuredHeight", arguments);
	};

	/**
	 * @property {Number} measuredMinHeight
	 *
	 * The default minimum height of the component, in pixels.
	 * This value is set by the measure() method.
	 */
	this.measuredMinHeight = function(){ /* getter and setter */
		return this.property("measuredMinHeight", arguments);
	};

	/**
	 * @property {Number} measuredMinWidth
	 *
	 * The default minimum width of the component, in pixels.
	 * This value is set by the measure() method.
	 */
	this.measuredMinWidth = function(){ /* getter and setter */
		return this.property("measuredMinWidth", arguments);
	};

	/**
	 * @property {Number} measuredWidth
	 *
	 * The default width of the component, in pixels.
	 * This value is set by the measure() method.
	 */
	this.measuredWidth = function(){ /* getter and setter */
		return this.property("measuredWidth", arguments);
	};

	/**
	 * @property {Number} minHeight
	 *
	 * The minimum recommended height of the component to be considered
	 * by the parent during layout. This value is in the
	 * component's coordinates, in pixels. The default value depends on
	 * the component's implementation.
	 *
	 * If the application developer sets the value of minHeight,
	 * the new value is stored in explicitMinHeight. The default value of minHeight
	 * does not change. As a result, at layout time, if
	 * minHeight was explicitly set by the application developer, then the value of
	 * explicitMinHeight is used for the component's minimum recommended height.
	 * If minHeight is not set explicitly by the application developer, then the value of
	 * measuredMinHeight is used.
	 *
	 * This value is used by the container in calculating
	 * the size and position of the component.
	 * It is not used by the component itself in determining
	 * its default size.
	 * Thus this property may not have any effect if parented by
	 * Container, or containers that don't factor in
	 * this property.
	 * Because the value is in component coordinates,
	 * the true minHeight with respect to its parent
	 * is affected by the scaleY property.
	 */
	this.minHeight = function(){ /* getter and setter */
		return this.property("minHeight", arguments);
	};

	/**
	 * @property {Number} minWidth
	 *
	 * The minimum recommended width of the component to be considered
	 * by the parent during layout. This value is in the
	 * component's coordinates, in pixels. The default value depends on
	 * the component's implementation.
	 *
	 * If the application developer sets the value of minWidth,
	 * the new value is stored in explicitMinWidth. The default value of minWidth
	 * does not change. As a result, at layout time, if
	 * minWidth was explicitly set by the application developer, then the value of
	 * explicitMinWidth is used for the component's minimum recommended width.
	 * If minWidth is not set explicitly by the application developer, then the value of
	 * measuredMinWidth is used.
	 *
	 * This value is used by the container in calculating
	 * the size and position of the component.
	 * It is not used by the component itself in determining
	 * its default size.
	 * Thus this property may not have any effect if parented by
	 * Container, or containers that don't factor in
	 * this property.
	 * Because the value is in component coordinates,
	 * the true minWidth with respect to its parent
	 * is affected by the scaleX property.
	 */
	this.minWidth = function(){ /* getter and setter */
		return this.property("minWidth", arguments);
	};

	/**
	 * @property {IFlexModuleFactory} moduleFactory
	 *
	 * A module factory is used as context for using embedded fonts and for
	 * finding the style manager that controls the styles for this
	 * component.
	 */
	this.moduleFactory = function(){ /* getter and setter */
		return this.property("moduleFactory", arguments);
	};

	/**
	 * @property {Boolean} mouseFocusEnabled
	 *
	 * Whether you can receive focus when clicked on.
	 * If false, focus is transferred to
	 * the first parent that is mouseFocusEnable
	 * set to true.
	 * For example, you can set this property to false
	 * on a Button control so that you can use the Tab key to move focus
	 * to the control, but not have the control get focus when you click on it.
	 */
	this.mouseFocusEnabled = function(){ /* getter and setter */
		return this.property("mouseFocusEnabled", arguments);
	};

	this.mouseX = function(){
		return this.getter("mouseX");
	};

	this.mouseY = function(){
		return this.getter("mouseY");
	};

	/**
	 * @property {int} nestLevel
	 *
	 * Depth of this object in the containment hierarchy.
	 * This number is used by the measurement and layout code.
	 * The value is 0 if this component is not on the DisplayList.
	 */
	this.nestLevel = function(){ /* getter and setter */
		return this.property("nestLevel", arguments);
	};

	/**
	 * @property {Object} nonInheritingStyles
	 *
	 * The beginning of this component's chain of non-inheriting styles.
	 * The getStyle() method simply accesses
	 * nonInheritingStyles[styleName] to search the entire
	 * prototype-linked chain.
	 * This object is set up by initProtoChain().
	 * Developers typically never need to access this property directly.
	 */
	this.nonInheritingStyles = function(){ /* getter and setter */
		return this.property("nonInheritingStyles", arguments);
	};

	/**
	 * @property {int} numAutomationChildren
	 *
	 *
	 * The number of automation children this container has.
	 * This sum should not include any composite children, though
	 * it does include those children not significant within the
	 * automation hierarchy.
	 * @readonly
	 */
	this.numAutomationChildren = function(){
		return this.getter("numAutomationChildren");
	};

	/**
	 * @property {DisplayObjectContainer} owner
	 *
	 * The owner of this IVisualElement object.
	 * By default, it is the parent of this IVisualElement object.
	 * However, if this IVisualElement object is a child component that is
	 * popped up by its parent, such as the drop-down list of a ComboBox control,
	 * the owner is the component that popped up this IVisualElement object.
	 *
	 * This property is not managed by Flex, but by each component.
	 * Therefore, if you use the PopUpManger.createPopUp() or
	 * PopUpManger.addPopUp() method to pop up a child component,
	 * you should set the owner property of the child component
	 * to the component that popped it up.
	 */
	this.owner = function(){ /* getter and setter */
		return this.property("owner", arguments);
	};

	/**
	 * @property {DisplayObjectContainer} parent
	 *
	 * The parent container or component for this component.
	 * Only visual elements should have a parent property.
	 * Non-visual items should use another property to reference
	 * the object to which they belong.
	 * By convention, non-visual objects use an owner
	 * property to reference the object to which they belong.
	 * @readonly
	 */
	this.parent = function(){
		return this.getter("parent");
	};

	/**
	 * @property {Object} parentApplication
	 *
	 * A reference to the Application object that contains this UIComponent
	 * instance.
	 * This Application object might exist in a SWFLoader control in another
	 * Application, and so on, creating a chain of Application objects that
	 * can be walked using parentApplication.
	 *
	 * The parentApplication property of an Application is never itself;
	 * it is either the Application into which it was loaded or null
	 * (for the top-level Application).
	 *
	 * Walking the application chain using the parentApplication
	 * property is similar to walking the document chain using the
	 * parentDocument property.
	 * You can access the top-level application using the
	 * application property of the Application class.
	 * @readonly
	 */
	this.parentApplication = function(){
		return this.getter("parentApplication");
	};

	/**
	 * @property {Object} parentDocument
	 *
	 * A reference to the parent document object for this UIComponent.
	 * A document object is a UIComponent at the top of the hierarchy
	 * of a Flex application, MXML component, or AS component.
	 *
	 * For the Application object, the parentDocument
	 * property is null.
	 * This property  is useful in MXML scripts to go up a level
	 * in the chain of document objects.
	 * It can be used to walk this chain using
	 * parentDocument.parentDocument, and so on.
	 *
	 * It is typed as Object so that authors can access properties
	 * and methods on ancestor document objects without casting.
	 * @readonly
	 */
	this.parentDocument = function(){
		return this.getter("parentDocument");
	};

	/**
	 * @property {Number} percentHeight
	 *
	 * Specifies the height of a component as a percentage
	 * of its parent's size. Allowed values are 0-100. The default value is NaN.
	 * Setting the height or explicitHeight properties
	 * resets this property to NaN.
	 *
	 * This property returns a numeric value only if the property was
	 * previously set; it does not reflect the exact size of the component
	 * in percent.
	 */
	this.percentHeight = function(){ /* getter and setter */
		return this.property("percentHeight", arguments);
	};

	/**
	 * @property {Number} percentWidth
	 *
	 * Specifies the width of a component as a percentage
	 * of its parent's size. Allowed values are 0-100. The default value is NaN.
	 * Setting the width or explicitWidth properties
	 * resets this property to NaN.
	 *
	 * This property returns a numeric value only if the property was
	 * previously set; it does not reflect the exact size of the component
	 * in percent.
	 */
	this.percentWidth = function(){ /* getter and setter */
		return this.property("percentWidth", arguments);
	};

	/**
	 * @property {mx.geom:TransformOffsets} postLayoutTransformOffsets
	 *
	 * Defines a set of adjustments that can be applied to the object's
	 * transform in a way that is invisible to its parent's layout.
	 *
	 * For example, if you want a layout to adjust for an object
	 * that is rotated 90 degrees, set the object's
	 * rotation property. If you want the layout to <i>not</i>
	 * adjust for the object being rotated,
	 * set its postLayoutTransformOffsets.rotationZ property.
	 */
	this.postLayoutTransformOffsets = function(){ /* getter and setter */
		return this.property("postLayoutTransformOffsets", arguments);
	};

	/**
	 * @property {Boolean} processedDescriptors
	 *
	 * Set to true after immediate or deferred child creation,
	 * depending on which one happens. For a Container object, it is set
	 * to true at the end of
	 * the createComponentsFromDescriptors() method,
	 * meaning after the Container object creates its children from its child descriptors.
	 *
	 * For example, if an Accordion container uses deferred instantiation,
	 * the processedDescriptors property for the second pane of
	 * the Accordion container does not become true until after
	 * the user navigates to that pane and the pane creates its children.
	 * But, if the Accordion had set the creationPolicy property
	 * to "all", the processedDescriptors property
	 * for its second pane is set to true during application startup.
	 *
	 * For classes that are not containers, which do not have descriptors,
	 * it is set to true after the createChildren()
	 * method creates any internal component children.
	 */
	this.processedDescriptors = function(){ /* getter and setter */
		return this.property("processedDescriptors", arguments);
	};

	/**
	 * @property {IRepeater} repeater
	 *
	 * A reference to the Repeater object
	 * in the parent document that produced this UIComponent.
	 * Use this property, rather than the repeaters property,
	 * when the UIComponent is created by a single Repeater object.
	 * Use the repeaters property when this UIComponent is created
	 * by nested Repeater objects.
	 *
	 * The property is set to null when this UIComponent
	 * is not created by a Repeater.
	 * @readonly
	 */
	this.repeater = function(){
		return this.getter("repeater");
	};

	/**
	 * @property {int} repeaterIndex
	 *
	 * The index of the item in the data provider
	 * of the Repeater that produced this UIComponent.
	 * Use this property, rather than the repeaterIndices property,
	 * when the UIComponent is created by a single Repeater object.
	 * Use the repeaterIndices property when this UIComponent is created
	 * by nested Repeater objects.
	 *
	 * This property is set to -1 when this UIComponent is
	 * not created by a Repeater.
	 * @readonly
	 */
	this.repeaterIndex = function(){
		return this.getter("repeaterIndex");
	};

	/**
	 * @property {Array} repeaterIndices
	 *
	 * An Array containing the indices of the items in the data provider
	 * of the Repeaters in the parent document that produced this UIComponent.
	 * The Array is empty unless this UIComponent is within one or more Repeaters.
	 *
	 * The first element in the Array corresponds to the outermost Repeater.
	 * For example, if repeaterIndices is [2,4] it means that the
	 * outer repeater used item dataProvider[2] and the inner repeater
	 * used item dataProvider[4].
	 *
	 * Note that this property differs from the instanceIndices property
	 * if the startingIndex property of any of the Repeaters is not 0.
	 * For example, even if a Repeater starts at dataProvider[4],
	 * the document reference of the first repeated object is b[0], not b[4].
	 */
	this.repeaterIndices = function(){ /* getter and setter */
		return this.property("repeaterIndices", arguments);
	};

	/**
	 * @property {Array} repeaters
	 *
	 * An Array containing references to the Repeater objects
	 * in the parent document that produced this UIComponent.
	 * The Array is empty unless this UIComponent is within
	 * one or more Repeaters.
	 * The first element corresponds to the outermost Repeater object.
	 */
	this.repeaters = function(){ /* getter and setter */
		return this.property("repeaters", arguments);
	};

	/**
	 * @property {Object} right
	 *
	 * For components, this layout constraint property is a
	 * facade on top of the similarly-named style. To set
	 * the property to its default value of undefined,
	 * use the @Clear() directive in MXML or the undefined
	 * value in ActionScript code. For example, in MXML code,
	 * right.s2="@Clear()" unsets the right
	 * constraint in state s2. Or in ActionScript code,
	 * button.right = undefined unsets the right
	 * constraint on button.
	 *
	 *
	 * The horizontal distance in pixels from the right edge of the component to the
	 * anchor target's right edge.
	 *
	 * By default the anchor target is the container's content area. In layouts
	 * with advanced constraints, the target can be a constraint column.
	 *
	 * Setting the property to a number or to a numerical string like "10"
	 * specifies use of the default anchor target.
	 *
	 * To specify an anchor target, set the property value to a string in the format
	 * "anchorTargetName:value". For example, "col1:10".
	 */
	this.right = function(){ /* getter and setter */
		return this.property("right", arguments);
	};

	/**
	 * @property {Number} rotation
	 *
	 * Indicates the rotation of the DisplayObject instance, in degrees, from its original orientation. Values from 0 to 180 represent
	 * clockwise rotation; values from 0 to -180 represent counterclockwise rotation. Values outside this range are added to or
	 * subtracted from 360 to obtain a value within the range. For example, the statement my_video.rotation = 450 is the
	 * same as  my_video.rotation = 90.
	 */
	this.rotation = function(){ /* getter and setter */
		return this.property("rotation", arguments);
	};

	/**
	 * @property {Number} rotationX
	 *
	 * Indicates the x-axis rotation of the DisplayObject instance, in degrees, from its original orientation
	 * relative to the 3D parent container. Values from 0 to 180 represent clockwise rotation; values
	 * from 0 to -180 represent counterclockwise rotation. Values outside this range are added to or subtracted from
	 * 360 to obtain a value within the range.
	 *
	 * This property is ignored during calculation by any of Flex's 2D layouts.
	 */
	this.rotationX = function(){ /* getter and setter */
		return this.property("rotationX", arguments);
	};

	/**
	 * @property {Number} rotationY
	 *
	 * Indicates the y-axis rotation of the DisplayObject instance, in degrees, from its original orientation
	 * relative to the 3D parent container. Values from 0 to 180 represent clockwise rotation; values
	 * from 0 to -180 represent counterclockwise rotation. Values outside this range are added to or subtracted from
	 * 360 to obtain a value within the range.
	 *
	 * This property is ignored during calculation by any of Flex's 2D layouts.
	 */
	this.rotationY = function(){ /* getter and setter */
		return this.property("rotationY", arguments);
	};

	/**
	 * @property {Number} rotationZ
	 *
	 *
	 * Indicates the z-axis rotation of the DisplayObject instance, in degrees, from its original orientation relative to the 3D parent container. Values from 0 to 180 represent
	 * clockwise rotation; values from 0 to -180 represent counterclockwise rotation. Values outside this range are added to or
	 * subtracted from 360 to obtain a value within the range.
	 */
	this.rotationZ = function(){ /* getter and setter */
		return this.property("rotationZ", arguments);
	};

	/**
	 * @property {Number} scaleX
	 *
	 * Number that specifies the horizontal scaling factor.
	 *
	 * The default value is 1.0, which means that the object
	 * is not scaled.
	 * A scaleX of 2.0 means the object has been
	 * magnified by a factor of 2, and a scaleX of 0.5
	 * means the object has been reduced by a factor of 2.
	 *
	 * A value of 0.0 is an invalid value.
	 * Rather than setting it to 0.0, set it to a small value, or set
	 * the visible property to false to hide the component.
	 */
	this.scaleX = function(){ /* getter and setter */
		return this.property("scaleX", arguments);
	};

	/**
	 * @property {Number} scaleY
	 *
	 * Number that specifies the vertical scaling factor.
	 *
	 * The default value is 1.0, which means that the object
	 * is not scaled.
	 * A scaleY of 2.0 means the object has been
	 * magnified by a factor of 2, and a scaleY of 0.5
	 * means the object has been reduced by a factor of 2.
	 *
	 * A value of 0.0 is an invalid value.
	 * Rather than setting it to 0.0, set it to a small value, or set
	 * the visible property to false to hide the component.
	 */
	this.scaleY = function(){ /* getter and setter */
		return this.property("scaleY", arguments);
	};

	/**
	 * @property {Number} scaleZ
	 *
	 * Number that specifies the scaling factor along the z axis.
	 *
	 * A scaling along the z axis does not affect a typical component, which lies flat
	 * in the z=0 plane.  components with children that have 3D transforms applied, or
	 * components with a non-zero transformZ, is affected.
	 *
	 * The default value is 1.0, which means that the object
	 * is not scaled.
	 */
	this.scaleZ = function(){ /* getter and setter */
		return this.property("scaleZ", arguments);
	};

	/**
	 * @property {Rectangle} screen
	 *
	 * Returns an object that contains the size and position of the base
	 * drawing surface for this object.
	 * @readonly
	 */
	this.screen = function(){
		return this.getter("screen");
	};

	/**
	 * @property {Boolean} showInAutomationHierarchy
	 *
	 *
	 * A flag that determines if an automation object
	 * shows in the automation hierarchy.
	 * Children of containers that are not visible in the hierarchy
	 * appear as children of the next highest visible parent.
	 * Typically containers used for layout, such as boxes and Canvas,
	 * do not appear in the hierarchy.
	 *
	 * Some controls force their children to appear
	 * in the hierarchy when appropriate.
	 * For example a List will always force item renderers,
	 * including boxes, to appear in the hierarchy.
	 * Implementers must support setting this property
	 * to true.
	 */
	this.showInAutomationHierarchy = function(){ /* getter and setter */
		return this.property("showInAutomationHierarchy", arguments);
	};

	/**
	 * @property {Array} states
	 *
	 * The view states that are defined for this component.
	 * You can specify the states property only on the root
	 * of the application or on the root tag of an MXML component.
	 * The compiler generates an error if you specify it on any other control.
	 */
	this.states = function(){ /* getter and setter */
		return this.property("states", arguments);
	};

	/**
	 * @property {CSSStyleDeclaration} styleDeclaration
	 *
	 * Storage for the inline inheriting styles on this object.
	 * This CSSStyleDeclaration is created the first time that
	 * the setStyle() method
	 * is called on this component to set an inheriting style.
	 * Developers typically never need to access this property directly.
	 */
	this.styleDeclaration = function(){ /* getter and setter */
		return this.property("styleDeclaration", arguments);
	};

	/**
	 * @property {IStyleManager2} styleManager
	 *
	 * Returns the StyleManager instance used by this component.
	 * @readonly
	 */
	this.styleManager = function(){
		return this.getter("styleManager");
	};

	/**
	 * @property {Object} styleName
	 *
	 * The class style used by this component. This can be a String, CSSStyleDeclaration
	 * or an IStyleClient.
	 *
	 * If this is a String, it is the name of one or more whitespace delimited class
	 * declarations in an &lt;fx:Style&gt; tag or CSS file. You do not include the period
	 * in the styleName. For example, if you have a class style named ".bigText",
	 * set the styleName property to "bigText" (no period).
	 *
	 * If this is an IStyleClient (typically a UIComponent), all styles in the
	 * styleName object are used by this component.
	 */
	this.styleName = function(){ /* getter and setter */
		return this.property("styleName", arguments);
	};

	/**
	 * @property {IAdvancedStyleClient} styleParent
	 *
	 * A component's parent is used to evaluate descendant selectors. A parent
	 * must also be an IAdvancedStyleClient to participate in advanced style
	 * declarations.
	 */
	this.styleParent = function(){ /* getter and setter */
		return this.property("styleParent", arguments);
	};

	/**
	 * @property {ISystemManager} systemManager
	 *
	 * Returns the SystemManager object used by this component.
	 */
	this.systemManager = function(){ /* getter and setter */
		return this.property("systemManager", arguments);
	};

	/**
	 * @property {Boolean} tabFocusEnabled
	 *
	 * A flag that indicates whether this object can receive focus
	 * via the TAB key
	 *
	 * This is similar to the tabEnabled property
	 * used by the Flash Player.
	 *
	 * This is usually true for components that
	 * handle keyboard input, but some components in controlbars
	 * have them set to false because they should not steal
	 * focus from another component like an editor.
	 */
	this.tabFocusEnabled = function(){ /* getter and setter */
		return this.property("tabFocusEnabled", arguments);
	};

	this.tabIndex = function(){ /* getter and setter */
		return this.property("tabIndex", arguments);
	};

	/**
	 * @property {String} toolTip
	 *
	 * Text to display in the ToolTip.
	 */
	this.toolTip = function(){ /* getter and setter */
		return this.property("toolTip", arguments);
	};

	/**
	 * @property {Object} top
	 *
	 * For components, this layout constraint property is a
	 * facade on top of the similarly-named style. To set
	 * the property to its default value of undefined,
	 * use the @Clear() directive in MXML or the undefined
	 * value in ActionScript code. For example, in MXML code,
	 * top.s2="@Clear()" unsets the top
	 * constraint in state s2. Or in ActionScript code,
	 * button.top = undefined unsets the top
	 * constraint on button.
	 *
	 *
	 * The vertical distance in pixels from the top edge of the component to the
	 * anchor target's top edge.
	 *
	 * By default the anchor target is the container's content area. In layouts
	 * with advanced constraints, the target can be a constraint row.
	 *
	 * Setting the property to a number or to a numerical string like "10"
	 * specifies use of the default anchor target.
	 *
	 * To specify an anchor target, set the property value to a string in the format
	 * "anchorTargetName:value". For example, "row1:10".
	 */
	this.top = function(){ /* getter and setter */
		return this.property("top", arguments);
	};

	/**
	 * @property {flash.geom:Transform} transform
	 *
	 * An object with properties pertaining to a display object's matrix, color transform,
	 * and pixel bounds.  The specific properties &mdash; matrix, colorTransform, and three read-only
	 * properties (concatenatedMatrix, concatenatedColorTransform, and pixelBounds) &mdash;
	 * are described in the entry for the Transform class.
	 *
	 * Each of the transform object's properties is itself an object.  This concept is
	 * important because the only way to set new values for the matrix or colorTransform
	 * objects is to create a new object and copy that object into the transform.matrix or
	 * transform.colorTransform property.
	 *
	 * For example, to increase the tx value of a display object's matrix, you must make a copy
	 * of the entire matrix object, then copy the new object into the matrix property of the
	 * transform object:
	 *
	 * var myMatrix:Matrix = myUIComponentObject.transform.matrix;
	 * myMatrix.tx += 10;
	 * myUIComponent.transform.matrix = myMatrix;
	 *
	 * You cannot directly set the tx property. The following code has no effect on myUIComponent:
	 *
	 * myUIComponent.transform.matrix.tx += 10;
	 *
	 * Note that for UIComponent, unlike DisplayObject, the transform
	 * keeps the matrix and matrix3D values in sync and matrix3D is not null
	 * even when the component itself has no 3D properties set.  Developers should use the is3D property
	 * to check if the component has 3D propertis set.  If the component has 3D properties, the transform's
	 * matrix3D should be used instead of transform's matrix.
	 * @writeonly
	 */
	this.transform = function(){ /* getter and setter */
		return this.property("transform", arguments);
	};

	/**
	 * @property {Number} transformX
	 *
	 * Sets the x coordinate for the transform center of the component.
	 *
	 * When this component is the target of a Spark transform effect,
	 * you can override this property by setting
	 * the AnimateTransform.autoCenterTransform property.
	 * If autoCenterTransform is false, the transform
	 * center is determined by the transformX,
	 * transformY, and transformZ properties
	 * of the effect target.
	 * If autoCenterTransform is true,
	 * the effect occurs around the center of the target,
	 * (width/2, height/2).
	 *
	 * Setting this property on the Spark effect class
	 * overrides the setting on the target component.
	 */
	this.transformX = function(){ /* getter and setter */
		return this.property("transformX", arguments);
	};

	/**
	 * @property {Number} transformY
	 *
	 * Sets the y coordinate for the transform center of the component.
	 *
	 * When this component is the target of a Spark transform effect,
	 * you can override this property by setting
	 * the AnimateTransform.autoCenterTransform property.
	 * If autoCenterTransform is false, the transform
	 * center is determined by the transformX,
	 * transformY, and transformZ properties
	 * of the effect target.
	 * If autoCenterTransform is true,
	 * the effect occurs around the center of the target,
	 * (width/2, height/2).
	 *
	 * Seeting this property on the Spark effect class
	 * overrides the setting on the target component.
	 */
	this.transformY = function(){ /* getter and setter */
		return this.property("transformY", arguments);
	};

	/**
	 * @property {Number} transformZ
	 *
	 * Sets the z coordinate for the transform center of the component.
	 *
	 * When this component is the target of a Spark transform effect,
	 * you can override this property by setting
	 * the AnimateTransform.autoCenterTransform property.
	 * If autoCenterTransform is false, the transform
	 * center is determined by the transformX,
	 * transformY, and transformZ properties
	 * of the effect target.
	 * If autoCenterTransform is true,
	 * the effect occurs around the center of the target,
	 * (width/2, height/2).
	 *
	 * Seeting this property on the Spark effect class
	 * overrides the setting on the target component.
	 */
	this.transformZ = function(){ /* getter and setter */
		return this.property("transformZ", arguments);
	};

	/**
	 * @property {Array} transitions
	 *
	 * An Array of Transition objects, where each Transition object defines a
	 * set of effects to play when a view state change occurs.
	 */
	this.transitions = function(){ /* getter and setter */
		return this.property("transitions", arguments);
	};

	/**
	 * @property {Array} tweeningProperties
	 *
	 * Array of properties that are currently being tweened on this object.
	 *
	 * Used to alert the EffectManager that certain properties of this object
	 * are being tweened, so that the EffectManger doesn't attempt to animate
	 * the same properties.
	 */
	this.tweeningProperties = function(){ /* getter and setter */
		return this.property("tweeningProperties", arguments);
	};

	/**
	 * @property {String} uid
	 *
	 * A unique identifier for the object.
	 * Flex data-driven controls, including all controls that are
	 * subclasses of List class, use a UID to track data provider items.
	 *
	 * Flex can automatically create and manage UIDs.
	 * However, there are circumstances when you must supply your own
	 * uid property by implementing the IUID interface,
	 * or when supplying your own uid property improves processing efficiency.
	 * UIDs do not need to be universally unique for most uses in Flex.
	 * One exception is for messages sent by data services.
	 */
	this.uid = function(){ /* getter and setter */
		return this.property("uid", arguments);
	};

	/**
	 * @property {Boolean} updateCompletePendingFlag
	 *
	 * A flag that determines if an object has been through all three phases
	 * of layout validation (provided that any were required).
	 */
	this.updateCompletePendingFlag = function(){ /* getter and setter */
		return this.property("updateCompletePendingFlag", arguments);
	};

	/**
	 * @property {String} validationSubField
	 *
	 * Used by a validator to associate a subfield with this component.
	 */
	this.validationSubField = function(){ /* getter and setter */
		return this.property("validationSubField", arguments);
	};

	/**
	 * @property {Object} verticalCenter
	 *
	 * For components, this layout constraint property is a
	 * facade on top of the similarly-named style. To set
	 * the property to its default value of undefined,
	 * use the @Clear() directive in MXML or the undefined
	 * value in ActionScript code. For example, in MXML code,
	 * verticalCenter.s2="@Clear()" unsets the verticalCenter
	 * constraint in state s2. Or in ActionScript code,
	 * button.verticalCenter = undefined unsets the verticalCenter
	 * constraint on button.
	 *
	 *
	 * The vertical distance in pixels from the center of the component to the
	 * center of the anchor target's content area.
	 */
	this.verticalCenter = function(){ /* getter and setter */
		return this.property("verticalCenter", arguments);
	};

	/**
	 * @property {Boolean} visible
	 *
	 * Whether or not the display object is visible.
	 * Display objects that are not visible are disabled.
	 * For example, if visible=false for an InteractiveObject instance,
	 * it cannot be clicked.
	 *
	 * When setting to true, the object dispatches
	 * a show event.
	 * When setting to false, the object dispatches
	 * a hide event.
	 * In either case the children of the object does not emit a
	 * show or hide event unless the object
	 * has specifically written an implementation to do so.
	 */
	this.visible = function(){ /* getter and setter */
		return this.property("visible", arguments);
	};

	/**
	 * @property {Number} width
	 *
	 * Number that specifies the width of the component, in pixels,
	 * in the parent's coordinates.
	 * The default value is 0, but this property contains the actual component
	 * width after Flex completes sizing the components in your application.
	 *
	 * Note: You can specify a percentage value in the MXML
	 * width attribute, such as width="100%",
	 * but you cannot use a percentage value in the width
	 * property in ActionScript.
	 * Use the percentWidth property instead.
	 *
	 * Setting this property causes a resize event to
	 * be dispatched.
	 * See the resize event for details on when
	 * this event is dispatched.
	 */
	this.width = function(){ /* getter and setter */
		return this.property("width", arguments);
	};

	/**
	 * @property {Number} x
	 *
	 * Number that specifies the component's horizontal position,
	 * in pixels, within its parent container.
	 *
	 * Setting this property directly or calling move()
	 * has no effect -- or only a temporary effect -- if the
	 * component is parented by a layout container such as HBox, Grid,
	 * or Form, because the layout calculations of those containers
	 * set the x position to the results of the calculation.
	 * However, the x property must almost always be set
	 * when the parent is a Canvas or other absolute-positioning
	 * container because the default value is 0.
	 */
	this.x = function(){ /* getter and setter */
		return this.property("x", arguments);
	};

	/**
	 * @property {Number} y
	 *
	 * Number that specifies the component's vertical position,
	 * in pixels, within its parent container.
	 *
	 * Setting this property directly or calling move()
	 * has no effect -- or only a temporary effect -- if the
	 * component is parented by a layout container such as HBox, Grid,
	 * or Form, because the layout calculations of those containers
	 * set the x position to the results of the calculation.
	 * However, the x property must almost always be set
	 * when the parent is a Canvas or other absolute-positioning
	 * container because the default value is 0.
	 */
	this.y = function(){ /* getter and setter */
		return this.property("y", arguments);
	};

	/**
	 * @property {Number} z
	 *
	 *
	 * Indicates the z coordinate position along the z-axis of the DisplayObject
	 * instance relative to the 3D parent container. The z property is used for
	 * 3D coordinates, not screen or pixel coordinates.
	 * When you set a z property for a display object to something other than the default
	 * value of 0, a corresponding Matrix3D object is automatically created. for adjusting a
	 * display object's position and orientation
	 * in three dimensions. When working with the z-axis,
	 * the existing behavior of x and y properties changes from screen or pixel coordinates to
	 * positions relative to the 3D parent container.
	 * For example, a child of the _root  at position x = 100, y = 100, z = 200
	 * is not drawn at pixel location (100,100). The child is drawn wherever the 3D projection
	 * calculation puts it. The calculation  */
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

UIComponent.prototype = new EventDispatcher(mx_core_UIComponent);
UIComponent.Get = function(o, classType){
	var ref = this;
	if(classType == undefined) classType = UIComponent;
	ref = EventDispatcher.Get(o, classType);
	return ref;
};
UIComponent.Is = function(target) { return target instanceof UIComponent; };

function mx_core_UIComponent(){};