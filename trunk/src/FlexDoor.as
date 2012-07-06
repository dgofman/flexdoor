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

package
{
	import flash.display.DisplayObject;
	import flash.display.DisplayObjectContainer;
	import flash.display.Loader;
	import flash.display.MovieClip;
	import flash.display.Sprite;
	import flash.display.StageAlign;
	import flash.display.StageQuality;
	import flash.display.StageScaleMode;
	import flash.events.DataEvent;
	import flash.events.Event;
	import flash.events.EventDispatcher;
	import flash.events.SecurityErrorEvent;
	import flash.events.TimerEvent;
	import flash.external.ExternalInterface;
	import flash.net.URLRequest;
	import flash.net.URLVariables;
	import flash.system.ApplicationDomain;
	import flash.system.LoaderContext;
	import flash.system.Security;
	import flash.system.SecurityDomain;
	import flash.utils.Dictionary;
	import flash.utils.Timer;
	import flash.utils.describeType;
	import flash.utils.flash_proxy;
	import flash.utils.getDefinitionByName;

	import mx.core.mx_internal;
	import mx.events.FlexEvent;

	use namespace flash_proxy;
	use namespace mx_internal;

	[Mixin]
	[SWF(backgroundColor="#FFFFFF")]
	public class FlexDoor extends Sprite
	{
		private static const SKIP:String = "SKIP";

		private static const NULL:uint      = 0;
		private static const ERROR:uint     = 1;
		private static const PRIMITIVE:uint = 2;
		private static const OBJECT:uint    = 3;
		private static const ARRAY:uint     = 4;
		private static const EVENT:uint     = 5;
		private static const CLASS:uint     = 6;
		private static const FUNCTION:uint  = 7;
		private static const REFERENCE:uint = 8;
		private static const ANY:uint       = 9;


		protected var _application:*;
		protected var _loader:Loader;

		protected var _refMap:Dictionary;
		protected var _src:String;
		protected var _timer:Timer;
		protected var _jsFunction:*;
		protected var _fdUtil:FlexDoorUtil;

		protected var _dispatchEventHook:Function;

		protected static var isRuntimeLoader:Boolean = false;

		public function FlexDoor(application:*=null){
			Security.allowDomain("*");
			Security.allowInsecureDomain("*");
			_refMap = new Dictionary();
			if(application != null){
				_application = application;
				ready();
			}else{
				isRuntimeLoader = true;
				runtimeFlexDoorLoader();
			}
		}

		public static function init(systemManager:EventDispatcher):void {
			if(isRuntimeLoader == false)
				systemManager.addEventListener(FlexEvent.APPLICATION_COMPLETE, onApplicationComplete);
		}

		public function getClassByName(classType:String):Class{
			if(_loader != null)
				return _loader.contentLoaderInfo.applicationDomain.getDefinition(classType) as Class;
			return getDefinitionByName(classType) as Class;
		}

		protected static function onApplicationComplete(event:FlexEvent):void{
			event.currentTarget.removeEventListener(FlexEvent.APPLICATION_COMPLETE, onApplicationComplete);
			new FlexDoor(event.currentTarget.application);
		}

		protected function runtimeFlexDoorLoader():void {
			stage.scaleMode = StageScaleMode.NO_SCALE;
			stage.align = StageAlign.TOP_LEFT;
			stage.quality = StageQuality.BEST;
			stage.addEventListener(Event.RESIZE, onResize);
			onResize();

			_loader = new Loader();
			_loader.contentLoaderInfo.addEventListener(Event.COMPLETE, onCompleteHandler);
			_loader.contentLoaderInfo.addEventListener(SecurityErrorEvent.SECURITY_ERROR, securityErrorHandler);
			try{
				loadContent(new LoaderContext(false, null, SecurityDomain.currentDomain));
			}catch(error:Error){
				loadContent(new LoaderContext(false, new ApplicationDomain()));
			}
		}

		protected function ready():void{
			if(ExternalInterface.available){
				ExternalInterface.addCallback("refIds", js_refIds);
				ExternalInterface.addCallback("releaseIds", js_releaseIds);
				ExternalInterface.addCallback("application", js_application);
				ExternalInterface.addCallback("systemManager", js_systemManager);
				ExternalInterface.addCallback("findById", js_findById);
				ExternalInterface.addCallback("find", js_find);
				ExternalInterface.addCallback("getClass", js_class);
				ExternalInterface.addCallback("getChildByName", js_childByName);
				ExternalInterface.addCallback("getChildByType", js_childByType);
				ExternalInterface.addCallback("getLocator", js_locator);
				ExternalInterface.addCallback("setter", js_setter);
				ExternalInterface.addCallback("getter", js_getter);
				ExternalInterface.addCallback("execute", js_execute);
				ExternalInterface.addCallback("refValue", js_refValue);
				ExternalInterface.addCallback("create",  js_create);
				ExternalInterface.addCallback("createFunction",  js_createFunction);
				ExternalInterface.addCallback("eventArguments",  js_eventArguments);
				ExternalInterface.addCallback("dispatchEventHook", js_dispatchEventHook);
				ExternalInterface.addCallback("addEventListener", js_addEventListener);
				ExternalInterface.addCallback("removeEventListener", js_removeEventListener);
				ExternalInterface.addCallback("dispatchEvent", js_dispatchEvent);
				ExternalInterface.addCallback("assertResult", js_assertResult);
				ExternalInterface.addCallback("getNextTestCase", js_getNextTestCase);
				ExternalInterface.addCallback("getTestIndex", js_getTestIndex);

				var isFlexDoor:Boolean = ExternalInterface.call("eval", "parent['FlexDoor'] instanceof Function");
				if(isFlexDoor == false){
					addJavaScript("https://flexdoor.googlecode.com/svn/trunk/FlexDoorJS/jsframework/src/fd/FlexDoor.js");
					addJavaScript("https://flexdoor.googlecode.com/svn/trunk/FlexDoorJS/jsframework/src/utils/FlexDoorUtils.js");
				}

				if(isFlexDoor == true){
					ExternalInterface.call("parent.FlexDoor.dispatchEvent", "initialized", true);
				}else{
					_fdUtil = new FlexDoorUtil(this, _application);
				}

				_application.loaderInfo.uncaughtErrorEvents.addEventListener("uncaughtError", uncaughtErrorHandler);
			}
		}

		protected function uncaughtErrorHandler(event:Event):void{
			serializeError(event["error"]); //UncaughtErrorEvent.UNCAUGHT_ERROR
		}

		protected function addJavaScript(src:String):void{
			ExternalInterface.call("new function(){" +
				"var head = document.getElementsByTagName('head').item(0);" +
				"var script = document.createElement('script');" +
				"script.setAttribute('type', 'text/javascript');" +
				"script.src = '" + src + "';" +
				"head.appendChild(script);" +
				"}()");
		}

		protected function onResize(event:Event=null):void {
			if(_application){
				_application.width = stage.stageWidth;
				_application.height = stage.stageHeight;
			}
			if(event != null)
				ExternalInterface.call("parent.FlexDoor.dispatchEvent", Event.RESIZE);
		}

		protected function loadContent(context:LoaderContext):void{
			try{
				_src = loaderInfo.parameters["__src__"];
				if(_src && _src.lastIndexOf('?__src__=') != -1) //FlexDoor reloaded
					_src = _src.substring(_src.lastIndexOf('?__src__=') + 9);

				if(_src != null){
					var request:URLRequest = new URLRequest(_src);
					var variables:URLVariables = new URLVariables();
					for(var name:String in loaderInfo.parameters){
						if(name != "__src__")
							variables[name] = loaderInfo.parameters[name];
					}
					request.data = variables;
					_loader.load(request, context);
				}else{
					dispatchEvent(new DataEvent(DataEvent.DATA, false, false, "Error: Missing 'src' parameter"));
				}
			}catch(e:SecurityError){
				securityErrorHandler(e);
			}
		}

		protected function securityErrorHandler(event:Object):void{
			_loader.contentLoaderInfo.removeEventListener(SecurityErrorEvent.SECURITY_ERROR, securityErrorHandler);
			loadContent(new LoaderContext(false, new ApplicationDomain()));
		}

		protected function onCompleteHandler(event:Event):void {
			event.target.removeEventListener(Event.COMPLETE, onCompleteHandler);
			addChild(_loader);
			_timer = new Timer(100);
			_timer.addEventListener(TimerEvent.TIMER, handleTimer)
			_timer.start();
		}

		protected function handleTimer(event:TimerEvent):void {
			var content:MovieClip = _loader.content as MovieClip;
			if(content && content.currentFrame == 2 && content.numChildren > 0) {
				_timer.stop();
				_application = Object(_loader.content).application;
				onResize();
				ready();
			}
		}

		protected function js_refIds():Array{
			var ids:Array = [];
			for(var id:* in _refMap)
				ids.push(id);
			return ids;
		}

		protected function js_releaseIds(ids:Array=null, except:Boolean = false, isFunction:Boolean = false):void{
			var newMap:Dictionary = new Dictionary();
			var id:*;
			if(ids == null || ids.length == 0){
				for(id in _refMap){
					if(removeReferences(id, isFunction) == false)
						newMap[id] = _refMap[id];
				}
				_refMap = newMap;
			}else{
				if(except == false){
					for(var i:uint = 0; i < ids.length; i++){
						if(removeReferences(ids[i], isFunction))
							delete _refMap[ids[i]];
					}
				}else{
					for(id in _refMap){
						if(ids.indexOf(id) != -1){
							newMap[id] = _refMap[id];
						}else{
							if(removeReferences(id, isFunction) == false)
								newMap[id] = _refMap[id];
						}
					}
					_refMap = newMap;
				}
			}
		}

		protected function removeReferences(id:uint, isFunction:Boolean):Boolean{
			var item:Object = _refMap[id];
			if(item && item.outType == FUNCTION){
				if(isFunction == false) return false;
				if(item.target != null)
					item.target.removeEventListener(item.type, item.ref);
			}
			return true;
		}

		protected function js_application():Object{
			return serialize(_application);
		}

		protected function js_systemManager():Object{
			return serialize(_application.systemManager);
		}

		protected function js_findById(refId:Number, keepRef:Boolean=false):Object{
			try{
				return serialize(getRef(refId), keepRef);
			}catch(e:Error){
				return serialize(e);
			}
			return null;
		}

		/**
		 *  Locator /id
		 */
		protected function js_find(refId:Number, id:String, index:uint, visibleOnly:Boolean, keepRef:Boolean=false):*{
			try{
				var target:* = getRef(refId);
				var o:* = target[id];
				var visibleCount:uint = 0;
				if(o is Array){
					for(var i:uint = 0; i < o.length; i++){
						if(visibleOnly == true && o[i].visible != true)
							continue;
						if(visibleCount == index)
							return serialize(o[i], keepRef);
						visibleCount++;
					}
					return serialize(o[0], keepRef);
				}
				return serialize(o, keepRef);
			}catch(e:Error){
				return serialize(e);
			}
		}

		/**
		 *  Locator /@name
		 */
		protected function js_childByName(refId:Number, name:String, keepRef:Boolean=false):*{
			try{
				var target:DisplayObjectContainer = getRef(refId);
				return serialize(target.getChildByName(name), keepRef);
			}catch(e:Error){
				return serialize(e);
			}
		}

		/**
		 *  Locator /#type:index
		 */
		protected function js_childByType(refId:Number, classType:String, index:uint, visibleOnly:Boolean, keepRef:Boolean=false):*{
			try{
				var target:* = getRef(refId);
				var child:* = findChildByClassType(target, "numElements", "getElementAt", classType, index, visibleOnly);
				if(child == null)
					child = findChildByClassType(target, "numChildren", "getChildAt", classType, index, visibleOnly);
				return serialize(child, keepRef);
			}catch(e:Error){
				return serialize(e);
			}
		}

		protected function js_locator(refId:*, path:String):Object{
			var pair:Array;
			var items:Array = path.split('/');
			var child:* = _application;
			if(refId != null)
				child = getRef(refId);
			for(var i:uint = 1; i < items.length; i++){
				var item:String = items[i];
				try{
					switch(item.charAt(0)){
						case '!': //systemManager
							child = child.systemManager;
							break;
						case '#': //by type
							pair = item.substring(1).split(',');
							var index:uint = pair.length == 1 ? 0 : pair[1];
							var component:* = findChildByClassType(child, "numElements", "getElementAt", pair[0], index, true);
							if(component == null)
								component = findChildByClassType(child, "numChildren", "getChildAt", pair[0], index, true);
							if(component == null)
								return serialize(new Error("Property " + items[i] + " not found on " + items[i - 1] + " and there is no default value."), false);
							child = component;
							break;
						case '@': //by name
							child = child.getChildByName(item.substring(1));
							break;
						case ':': //itemRenderer
							pair = item.substring(1).split(',');
							child = child.mx_internal::indicesToItemRenderer(pair[0], pair[1]);
							break;
						default: //by id
							pair = item.split(',');
							child = child[pair[0]];
							if(child is Array)
								child = (pair.length == 1 ? child[0] : child[pair[1]]);
							break;
					}
				}catch(e:Error){
					return serialize(e);
				}
			}
			return serialize(child);
		}

		protected function findChildByClassType(target:*, numName:String, funName:String,
											  classType:String, index:uint, visibleOnly:Boolean):*{
			if( target.hasOwnProperty(numName) &&
				target.hasOwnProperty(funName) &&
				target[funName] is Function){
				var visibleCount:uint = 0;
				var length:uint = target[numName];
				var func:Function = target[funName];

				for(var i:uint = 0; i < length; i++){
					var child:* = func(i);
					if(visibleOnly == true && child.visible != true)
						continue;
					var type:XML = describeType(child);
					if( type.@base.toString() == classType ||
						type.@name.toString() == classType){
						if(visibleCount == index)
							return child;
						visibleCount++;
					}
				}
			}
			return null;
		}

		/**
		 *  Locator /+command
		 */
		protected function js_setter(refId:Number, command:String, value:*):Object{
			try{
				var target:Object = getRef(refId);
				if(validateCommand(target, command)){
					var actualValue:* = deserialize(value);
					target[command] = actualValue;
				}
			}catch(e:Error){
				return serialize(e);
			}
			return serialize(null);
		}

		/**
		 *  Locator /-command
		 */
		protected function js_getter(refId:Number, command:String, keepRef:Boolean=false):*{
			try{
				var target:Object = getRef(refId);
				if(validateCommand(target, command))
					return serialize(target[command], keepRef);
				return serialize(new Error("Error 1011: Reference or command is invalid: " + target + "::" + command), false);
			}catch(e:Error){
				return serialize(e);
			}
		}

		protected function js_execute(refId:Number, command:String, values:Array, keepRef:Boolean=false):*{
			try{
				var target:* = getRef(refId);
				var pair:Array = command.split("::");
				if(validateCommand(target, (pair.length == 2 ? pair[1] : pair[0]))){
					try{
						var ret:*;
						var func:Function = getFunction(target, pair);
						if(values != null && values.length > 0){
							ret = func.apply(target, deserializeAll(values));
						}else{
							ret = func();
						}
						return serialize(ret, keepRef);
					}catch(e:Error){
						return serialize(e);
					}
				}
				return serialize(new Error("Error 1012: Cannot execute a command: " + target + "::" + command), false);
			}catch(e:Error){
				return serialize(e);
			}
		}

		protected function js_refValue(refId:Number, keys:Array, keepRef:Boolean=false):*{
			try{
				var target:* = getRef(refId);
				for(var i:uint = 0; i < keys.length; i++){
					try{
						target = target[keys[i]];
					}catch(e:Error){
						return serialize(e);
					}
				}
				return serialize(target, keepRef);
			}catch(e:Error){
				return serialize(e);
			}
		}

		protected function getFunction(target:*, pair:Array):Function{
			if(pair.length == 2){
				switch(pair[0]){
					case "mx_internal":
						return target.mx_internal::[pair[1]];
					case "flash_proxy":
						return target.flash_proxy::[pair[1]];
				}
			}
			return target[pair[0]];
		}

		public function js_class(className:String, isSerialize:Boolean=true):Object{
			var classRef:Class;
			try{
				classRef = getDefinitionByName(className) as Class;
			}catch(e:Error){
				try{
					classRef = _application.loaderInfo.applicationDomain.getDefinition(className);
				}catch(refError:ReferenceError){}
				try{
					var moduleManager:* = _application.loaderInfo.applicationDomain.getDefinition("mx.modules::ModuleManager");
					var obj:* = moduleManager.getAssociatedFactory(className); //FlexModuleFactory
					if(obj != null)
						classRef = obj.getDefinitionByName(className);
				}catch(refError:ReferenceError){}
			}
			if(isSerialize == true)
				return serialize(classRef);
			return classRef;
		}

		protected function js_create(className:String, args:Array):*{
			try{
				var classRef:Class = js_class(className, false) as Class;
				if(classRef != null){
					var obj:* = create(classRef, deserializeAll(args));
					return serialize(obj);
				}
			}catch(e:Error){
				return serialize(e);
			}
		}

		protected function js_createFunction(className:String, functionName:String, keepRef:Boolean=false):Object{
			var handler:Function;
			handler = function(event:*=null):*{
				if(event is Event)
					Event(event).preventDefault();
				var className:String = arguments.callee.prototype.className;
				var functionName:String = arguments.callee.prototype.functionName;
				var listenerId:uint = arguments.callee.prototype.listenerId;
				if(_refMap[listenerId] == null) return;

				var refEvent:Object = _refMap[listenerId];
				if(refEvent.isEventListener == true){
					refEvent.arguments = arguments;
					refEvent.keepRef = keepRef;
					refEvent.className = className;
					refEvent.functionName = functionName;
					ExternalInterface.call("parent.FlexDoor.executeFunction", className, functionName, null, listenerId);
				}else{
					var args:Array = serializeAll(arguments, keepRef);
					var result:* = ExternalInterface.call("parent.FlexDoor.executeFunction",
													className, functionName, (args.length == 1 ? args[0] : args));
					return result;
				}
			};
			var obj:Object = serialize(handler);
			handler.prototype.className = className;
			handler.prototype.functionName = functionName;
			handler.prototype.listenerId = obj[1].refId;
			return obj;
		}

		protected function js_eventArguments(listenerId:uint, className:String, functionName:String):Object{
			var refEvent:Object = _refMap[listenerId];
			if(refEvent != null && refEvent.className == className && refEvent.functionName == functionName){
				var args:Array = serializeAll(refEvent.arguments, refEvent.keepRef);
				return (args.length == 1 ? args[0] : args);
			}else{
				return null;
			}
		}

		protected function js_dispatchEventHook(refId:Number=NaN, listenerRef:Array=null, type:String=null):Object{
			var uiComponent:* = getClassByName("mx.core::UIComponent");
			if(uiComponent != null){
				if(isNaN(refId) && listenerRef == null){
					uiComponent.mx_internal::dispatchEventHook = _dispatchEventHook;
				}else{
					try{
						var target:* = getRef(refId);
						var listener:Function = deserialize(listenerRef);
						_dispatchEventHook = uiComponent.mx_internal::dispatchEventHook;
						uiComponent.mx_internal::dispatchEventHook = function(event:Event, uicomponent:*):void{
							if(target == uicomponent){
								if(type == null || type == event.type)
									listener(serialize(event, false));
							}
						};
					}catch(e:Error){
						return serialize(e);
					}
				}
			}
			return serialize(null);
		}

		protected function js_addEventListener(refId:Number, type:String, listenerRef:Array,
											   useWeakReference:Boolean, useCapture:Boolean, priority:int):Object{
			try{
				var target:Object = getRef(refId);
				var listener:Function = deserialize(listenerRef);
				var listenerId:uint = listenerRef[2];
				_refMap[listenerId].isEventListener = true;
				_refMap[listenerId].type = type;
				_refMap[listenerId].target = target;
				target.addEventListener(type, listener, useCapture, priority, useWeakReference);
			}catch(e:Error){
				return serialize(e);
			}
			return serialize(null);
		}

		protected function js_removeEventListener(refId:Number, type:String, listenerId:uint, useCapture:Boolean):Object{
			try{
				var target:Object = getRef(refId);
				var listener:Function = getRef(listenerId);
				if(target && listener is Function)
					target.removeEventListener(type, listener, useCapture);
			}catch(e:Error){
				return serialize(e);
			}
			return serialize(null);
		}

		protected function js_dispatchEvent(refId:Number, eventRefId:uint):Object{
			var result:Boolean = false;
			try{
				var target:Object = getRef(refId);
				var event:Event =  getRef(eventRefId);
				result = target.dispatchEvent(event);
			}catch(e:Error){
				return serialize(e);
			}
			return serialize(result);
		}

		protected function js_assertResult(error:Boolean, message:String):void{
			_fdUtil.assertResult(error, message);
		}

		protected function js_getNextTestCase():String{
			return _fdUtil.getNextTestCase();
		}

		protected function js_getTestIndex(index:uint, testCaseName:String):int{
			return _fdUtil.getTestIndex(index, testCaseName);
		}

		protected function serializeError(e:Error):Object{
			trace(e.getStackTrace());
			if(_fdUtil != null)
				_fdUtil.assertResult(true, e.toString());
			return serialize(e);
		}

		protected function getRef(id:uint):*{
			if(_refMap[id] == null)
				throw new Error("The reference id is invalid or object was destroyed.");
			return _refMap[id].ref;
		}

		protected function serialize(ref:Object, keepRef:Boolean=false):Array{
			if(ref == null) return [NULL, null];

			var id:*;
			//validate if object already exists
			for(id in _refMap){
				var cacheRef:* = _refMap[id];
				if(cacheRef.ref == ref)
					return [cacheRef.outType, cacheRef.out];
			}

			var out:Object = {};
			var outType:uint;
			if(keepRef == true){
				outType = REFERENCE;
			}else if(ref is Error){
				out.extendTypes = [ref.name];
				out.errorID = ref.errorID;
				out.message = ref.message;
				out.stackTrace = Error(ref).getStackTrace();
				return [ERROR, out];
			}else if(ref is Function){
				outType = FUNCTION;
			}else if(ref is Array){
				var array:Array = [];
				for(var j:uint = 0; j < ref.length; j++)
					array[j] = serialize(ref[j])[1];
				return [ARRAY, array];
			}else if(typeof(ref) != "object"){
				return [PRIMITIVE, ref]; //Number, uint, int, String, Boolean
			}else if(ref is Class){
				outType = CLASS;
			}else{
				if(ref is Event){
					outType = EVENT;
					out.target = serialize(ref.target);
					out.currentTarget = serialize(ref.currentTarget);
					out.type = ref.type;
				}else{
					outType = ANY;
					if(ref.hasOwnProperty('id'))
						out.id = ref.id;
					if(ref.hasOwnProperty('name'))
						out.name = ref.name;
				}

				var type:XML = describeType(ref);
				var proxyMap:Dictionary = new Dictionary();
				var extendTypes:Array = [type.@name.toString()];
				for(var i:uint = 0; i < type.extendsClass.length(); i++)
					extendTypes.push(type.extendsClass[i].@type.toString());

				if(extendTypes.length < 2 || extendTypes[0] == "Object"){
					var proxy:* = createProxyObject(ref, proxyMap);
					return [OBJECT, proxy];
				}

				out.extendTypes = extendTypes;
				out.ref = createProxyObject(ref, proxyMap);
			}

			//get next available id
			for(id = 0; id < uint.MAX_VALUE; id++){
				if(_refMap[id] == null)
					break;
			}
			out.refId = id;
			_refMap[id] = {ref:ref, outType:outType, out:out};
			return [outType, out];
		}

		protected function serializeAll(params:*, keepRef:Boolean=false):Array{
			var args:Array = [params];
			if(params is Array){
				for(var i:uint = 0; i < params.length; i++)
					args[i] = serialize(params[i], keepRef);
			}
			return args;
		}

		protected function deserialize(ref:Object):*{
			if(ref is Array && ref.length == 3 && ref[0] == "FLEXDOOR_SERIALIZE"){
				var type:uint = ref[1];
				var arg:*  = ref[2];
				switch(type){
					case ANY:
					case CLASS:
					case FUNCTION:
						return getRef(arg);
					default:
						return arg;
				}
			}
			return ref;
		}

		protected function deserializeAll(params:Array):Array{
			if(params is Array){
				for(var i:uint = 0; i < params.length; i++)
					params[i] = deserialize(params[i]);
			}
			return params;
		}

		protected function createProxyObject(ref:*, proxyMap:Dictionary, includeNamespaces:Boolean=false):*{
			if(ref is DisplayObject)
				return '"' + DisplayObject(ref).toString() + '"';
			if(ref == null || typeof(ref) != "object"){
				if(ref is String){
					ref = String(ref).split(/\\/).join('\\\\\\\\');
					ref = String(ref).replace(/"/g, '\\\\"');
					ref = String(ref).replace(/\r\n|\n|\r/g, '\\\\n').replace(/\t/g, '\\\\t');
				}
				return ref is String || ref is Function || isNaN(ref) || ref == undefined ? '"' + ref + '"' : ref;
			}

			if(proxyMap[ref] != null)
				return proxyMap[ref];
			proxyMap[ref] = SKIP; //do not repeat already defined references

			var value:*, proxy:*;
			var out:Array = [];
			var array:Array = [];
			var classInfo:XML = describeType(ref);
			var isDict:Boolean  = (classInfo.@name.toString() == "flash.utils::Dictionary");
			var dynamic:Boolean = (classInfo.@isDynamic.toString() == "true");
			if(isDict || dynamic){
				for(var key:* in ref){
					value = ref[key];
					if(value is Array){
						for(var i:uint = 0; i < value.length; i++){
							proxy = createProxyObject(value[i], proxyMap);
							if(proxy != SKIP)
								array.push(toJson(proxy));
						}
						out.push('"' + key + '":[' + array.join(', ') + ']');
					}else{
						proxy = createProxyObject(value, proxyMap);
						if(proxy != SKIP)
							out.push('"' + key + '":' + toJson(proxy));
					}
				}
			}else{
				var properties:XMLList;
				if (typeof(ref) == "xml"){
					properties = ref.attributes();
				}else{
					properties = classInfo..accessor.(@access != "writeonly") + classInfo..variable;
				}

				for(var p:uint = 0; p < properties.length(); p++){
					var item:XML = properties[p];
					var uri:String = item.@uri.toString();
					if(uri.length == 0 || includeNamespaces){ //ignore http://www.adobe.com/2006/flex/mx/internal
						value = ref[item.@name];
						if(value is Array){
							array = [];
							for(var j:uint = 0; j < value.length; j++){
								proxy = createProxyObject(value[j], proxyMap);
								if(proxy != SKIP)
									array.push(toJson(proxy));
							}
							out.push('"' + item.@name + '":[' + array.join(', ') + ']');
						}else{
							proxy = createProxyObject(value, proxyMap);
							if(proxy != SKIP)
								out.push('"' + item.@name + '":' + toJson(proxy));
						}
					}
				}
			}
			return proxyMap[ref] = '{' + out.join(', ') + '}';
		}

		protected function toJson(proxy:*):*{
			return proxy is Array ? '[' + proxy.join(', ') + ']' : proxy;
		}

		protected function validateCommand(object:*, command:String):Boolean{
			return (object.hasOwnProperty(command) || object[command] !== undefined);
		}

		protected function create(classRef:Class, args:Array):*{
			switch(args.length)
			{
				case 0:
					return new classRef();
				case 1:
					return new classRef(args[0]);
				case 2:
					return new classRef(args[0], args[1]);
				case 3:
					return new classRef(args[0], args[1], args[2]);
				case 4:
					return new classRef(args[0], args[1], args[2], args[3]);
				case 5:
					return new classRef(args[0], args[1], args[2], args[3], args[4]);
				case 6:
					return new classRef(args[0], args[1], args[2], args[3], args[4], args[5]);
				case 7:
					return new classRef(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
				case 8:
					return new classRef(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7]);
				case 9:
					return new classRef(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8]);
				case 10:
					return new classRef(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9]);
				case 11:
					return new classRef(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9], args[10]);
				case 12:
					return new classRef(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9], args[10], args[11]);
				case 13:
					return new classRef(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9], args[10], args[11], args[12]);
				case 14:
					return new classRef(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9], args[10], args[11], args[12], args[13]);
				case 15:
					return new classRef(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9], args[10], args[11], args[12], args[13], args[14]);
			}
		}
	}
}