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
	import flash.utils.setTimeout;
	
	import mx.core.mx_internal;
	import mx.events.FlexEvent;

	use namespace flash_proxy;
	use namespace mx_internal;

	[Mixin]
	[SWF(backgroundColor="#FFFFFF")]
	public class FlexDoor extends Sprite
	{
		protected var _application:*;
		protected var _loader:Loader;

		protected var _refMap:Dictionary;
		protected var _src:String;
		protected var _timer:Timer;
		protected var _jsFunction:*;
		protected var _fdUtil:FlexDoorUtil;

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
				ExternalInterface.addCallback("find", js_find);
				ExternalInterface.addCallback("findById", js_findById);
				ExternalInterface.addCallback("getClass", js_class);
				ExternalInterface.addCallback("getChildByName", js_childByName);
				ExternalInterface.addCallback("getChildByType", js_childByType);
				ExternalInterface.addCallback("setter", js_setter);
				ExternalInterface.addCallback("getter", js_getter);
				ExternalInterface.addCallback("execute", js_execute);
				ExternalInterface.addCallback("refValue", js_refValue);
				ExternalInterface.addCallback("create",  js_create);
				ExternalInterface.addCallback("createFunction",  js_createFunction);
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
			}
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

		protected function js_releaseIds(ids:Array=null, except:Boolean = false):void{
			var newMap:Dictionary = new Dictionary();
			if(ids == null || ids.length == 0){
				_refMap = newMap;
			}else{
				if(except == false){
					for(var i:uint = 0; i < ids.length; i++)
						delete _refMap[ids[i]];
				}else{
					for(var id:* in _refMap){
						if(ids.indexOf(id) != -1){
							newMap[id] = _refMap[id];
						}
					}
					_refMap = newMap;
				}
			}
		}

		protected function js_application():Object{
			return serialize(_application);
		}

		protected function js_systemManager():Object{
			return serialize(_application.systemManager);
		}

		protected function js_findById(refId:Number, includeRef:Boolean=true):Object{
			return serialize(_refMap[refId], includeRef);
		}

		protected function js_find(refId:Number, id:String, index:uint, visibleOnly:Boolean, includeRef:Boolean=true):*{
			try{
				var target:* = _refMap[refId];
				var o:* = target[id];
				var visibleCount:uint = 0;
				if(o is Array){
					for(var i:uint = 0; i < o.length; i++){
						if(visibleOnly == true && o[i].visible != true)
							continue;
						if(visibleCount == index)
							return serialize(o[i], includeRef);
						visibleCount++;
					}
					return serialize(o[0], includeRef);
				}
				return serialize(o, includeRef);
			}catch(e:Error){ 
				return js_childByName(refId, id, includeRef);
			}
		}

		protected function js_childByName(refId:Number, name:String, includeRef:Boolean=true):Object{
			var target:DisplayObjectContainer = _refMap[refId];
			return serialize(target.getChildByName(name), includeRef);
		}

		protected function js_childByType(refId:Number, classType:String, index:uint, visibleOnly:Boolean, includeRef:Boolean=true):Object{
			var target:* = _refMap[refId];
			var child:* = findChildByClassType(target, "numElements", "getElementAt", classType, index, visibleOnly);
			if(child == null)
				child = findChildByClassType(target, "numChildren", "getChildAt", classType, index, visibleOnly);
			return serialize(child, includeRef);
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

		protected function js_setter(refId:Number, command:String, value:*):void{
			var target:Object = _refMap[refId];
			if(validateCommand(target, command)){
				var actualValue:* = deserialize(value);
				target[command] = actualValue;
			}
		}

		protected function js_getter(refId:Number, command:String, includeRef:Boolean=true):*{
			var target:Object = _refMap[refId];
			if(validateCommand(target, command))
				return serialize(target[command], includeRef);
			return null;
		}

		protected function js_execute(refId:Number, command:String, values:Array, includeRef:Boolean=true):Object{
			var target:* = _refMap[refId];
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
					return serialize(ret, includeRef);
				}catch(e:Error){
					return serialize(e, false);
				}
			}
			return null;
		}

		protected function js_refValue(refId:Number, keys:Array, includeRef:Boolean=true):Object{
			var target:* = _refMap[refId];
			for(var i:uint = 0; i < keys.length; i++){
				try{
					target = target[keys[i]];
				}catch(e:Error){
					return serialize(e, false);
				}
			}
			return serialize(target, includeRef);
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

		protected function js_create(className:String, args:Array):Object{
			var classRef:Class = js_class(className, false) as Class;
			if(classRef != null){
				var obj:* = create(classRef, deserializeAll(args));
				return serialize(obj);
			}
			return null;
		}

		protected function js_createFunction(className:String, functionName:String):Object{
			var handler:Function;
			handler = function():*{
				var listenerId:Number = arguments.callee.prototype.listenerId;
				var jsName:String = arguments.callee.prototype.jsName;
				serializeAll(arguments);
				var args:* = (arguments.length == 1 ? arguments[0] : arguments);
				var result:* = ExternalInterface.call("parent." + jsName, args);
				return result;
			};
			var obj:Object = serialize(handler);
			handler.prototype.jsName = className + '.' + functionName;
			handler.prototype.listenerId = obj.refId;
			return obj;
		}

		protected function js_addEventListener(refId:Number, type:String, listenerRef:Object, 
											   useWeakReference:Boolean, useCapture:Boolean, priority:int):void{
			var target:Object = _refMap[refId];
			var listener:Function = deserialize(listenerRef);
			target.addEventListener(type, listener, useCapture, priority, true);
		}

		protected function js_removeEventListener(refId:Number, type:String, listenerId:uint, useCapture:Boolean):void{
			var target:Object = _refMap[refId];
			var listener:Function = _refMap[listenerId];
			if(target && listener is Function)
				target.removeEventListener(type, listener, useCapture);
		}

		protected function js_dispatchEvent(refId:Number, eventRefId:uint):Boolean{
			var target:Object = _refMap[refId];
			var event:Event = _refMap[eventRefId];
			if(target && event != null)
				return EventDispatcher(target).dispatchEvent(event);
			return false;
		}

		protected function js_assertResult(error:Boolean, message:String):void{
			_fdUtil.assertResult(error, message);
		}

		protected function js_getNextTestCase():String{
			return _fdUtil.getNextTestCase();
		}

		protected function js_getTestIndex(index:uint):int{
			return _fdUtil.getTestIndex(index);
		}

		protected function deserializeAll(params:Array):Array{
			if(params is Array){
				for(var i:uint = 0; i < params.length; i++)
					params[i] = deserialize(params[i]);
			}
			return params;
		}

		protected function deserialize(ref:*):*{
			if(ref is Object && Object(ref).hasOwnProperty("type")
							 && Object(ref).hasOwnProperty("refId")){
				if(ref.type == "CLASS_TYPE"){
					return _refMap[ref.refId];
				}else if(ref.type == "FUNCTION_TYPE"){
					return _refMap[ref.refId];
				}
			}
			return ref;
		}

		protected function serializeAll(params:*):*{
			if(params is Array){
				for(var i:uint = 0; i < params.length; i++)
					params[i] = serialize(params[i]);
			}
			return params;
		}

		protected function serialize(ref:Object, includeRef:Boolean=true):Object{
			if(ref == null) return null;
			var out:Object = {};
			if(ref is Error){
				out.extendTypes = ["Error", ref.name];
				out.errorID = ref.errorID;
				out.message = ref.message;
				out.stackTrace = Error(ref).getStackTrace();
				return out;
			}else if(ref is Array){
				if(includeRef == true){
					for(var a:uint = 0; a < ref.length; a++)
						ref[a] = serialize(ref[a], includeRef);
					return ref;
				}
			}else if(!(ref is Function) && (typeof(ref) != "object")){
				return ref; //Number, uint, int, String, Boolean
			}else{
				if(ref is Event){
					out.target = serialize(ref.target, includeRef);
					out.currentTarget = serialize(ref.currentTarget, includeRef);
					out.type = ref.type;
				}else{
					if(ref.hasOwnProperty('id'))
						out.id = ref.id;
					if(ref.hasOwnProperty('name'))
						out.name = ref.name;
				}
				
				if(!(ref is Class)){
					var type:XML = describeType(ref);
					var extendTypes:Array = [type.@name.toString()];
					for(var i:uint = 0; i < type.extendsClass.length(); i++)
						extendTypes.push(type.extendsClass[i].@type.toString());
	
					if(extendTypes.length < 2 || extendTypes[0] == "Object")
						return ref;
	
					out.extendTypes = extendTypes;
					if(includeRef == true)
						out.ref = createProxyObject(ref);
				}
			}

			var id:*;
			//validate if object already exists
			for(id  in _refMap){
				if(_refMap[id] == ref){
					out.refId = id;
					return out;
				}
			}

			//get next available id
			for(id = 0; id < uint.MAX_VALUE; id++){
				if(_refMap[id] == null)
					break;
			}
			out.refId = id;
			_refMap[id] = ref;
			return out;
		}
		
		protected function createProxyObject(ref:*, includeNamespaces:Boolean=false):*{
			if(ref is DisplayObject)
				return DisplayObject(ref).toString();
			if(ref == null || typeof(ref) != "object")
				return ref;

			var value:*;
			var out:Object = {};
			var classInfo:XML = describeType(ref);
			var isDict:Boolean  = (classInfo.@name.toString() == "flash.utils::Dictionary");
			var dynamic:Boolean = (classInfo.@isDynamic.toString() == "true");
			if(isDict || dynamic){
				for(var key:* in ref){
					if(key != "mx_internal_uid"){
						value = ref[key];
						if(value is Array){
							out[key] = [];
							for(var i:uint = 0; i < value.length; i++)
								out[key][i] = createProxyObject(value[i]);
						}else{
							out[key] = createProxyObject(value);
						}
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
							out[item.@name] = [];
							for(var j:uint = 0; j < value.length; j++)
								out[item.@name][j] = createProxyObject(value[j]);
						}else{
							out[item.@name] = createProxyObject(value);
						}
					}
				}
			}
			return out;
		}

		protected function validateCommand(object:*, command:String):Boolean{
			if(object == null){
				serialize(new Error("The reference id is invalid or object was destroyed."), false);
			}else if(object.hasOwnProperty(command) || object[command]){
				return true;
			}
			return false;
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