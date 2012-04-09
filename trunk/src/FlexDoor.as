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
	import flash.display.Loader;
	import flash.display.MovieClip;
	import flash.display.Sprite;
	import flash.display.StageAlign;
	import flash.display.StageQuality;
	import flash.display.StageScaleMode;
	import flash.events.DataEvent;
	import flash.events.Event;
	import flash.events.SecurityErrorEvent;
	import flash.events.TimerEvent;
	import flash.external.ExternalInterface;
	import flash.net.URLRequest;
	import flash.net.URLVariables;
	import flash.system.ApplicationDomain;
	import flash.system.LoaderContext;
	import flash.system.Security;
	import flash.system.SecurityDomain;
	import flash.utils.Timer;
	
	import mx.core.mx_internal;

	use namespace mx_internal;

	import mx.events.FlexEvent;
	import flash.utils.setTimeout;
	import flash.xml.XMLDocument;
	import flash.utils.getDefinitionByName;
	import flash.utils.describeType;

	import flash.xml.XMLNode;
	import flash.utils.getQualifiedClassName;
	import flash.utils.Dictionary;
	import flash.display.DisplayObjectContainer;
	import mx.core.UIComponent;
	import flash.display.DisplayObject;
	import flash.events.EventDispatcher;

	[Mixin]
	[SWF(backgroundColor="#FFFFFF")]
	public class FlexDoor extends Sprite
	{
		private var _application:*;
		private var _loader:Loader;

		private var _refMap:Dictionary;
		private var _src:String;
		private var _timer:Timer;
		private var _jsFunction:*;

		public static const VERSION:String     = "3.0";
		public static const INITIALIZED:String = "initialized";
		public static const ERROR:String       = "error";

		public function FlexDoor(application:*){
			Security.allowDomain("*");
			Security.allowInsecureDomain("*");
			_refMap = new Dictionary();
			if(application != null){
				_application = application;
				ready();
			}else{
				runtimeFlexDoorLoader();
			}
		}

		public static function init(systemManager:Object):void {
			systemManager.addEventListener(FlexEvent.APPLICATION_COMPLETE, onApplicationComplete);
		}

		private static function onApplicationComplete(event:FlexEvent):void{
			event.currentTarget.removeEventListener(FlexEvent.APPLICATION_COMPLETE, onApplicationComplete);
			new FlexDoor(event.currentTarget.application);
		}

		private function runtimeFlexDoorLoader():void {
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

		public function ready():void{
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
				ExternalInterface.addCallback("create",  js_create);
				ExternalInterface.addCallback("createFunction",  js_createFunction);
				ExternalInterface.addCallback("addEventListener", js_addEventListener);
				ExternalInterface.addCallback("removeEventListener", js_removeEventListener);
				ExternalInterface.addCallback("dispatchEvent", js_dispatchEvent);
				dispatchJsEvent(INITIALIZED);
			}
			dispatchEvent(new DataEvent(INITIALIZED, false, false, _application.name));
		}

		private function dispatchJsEvent(eventType:String):void{
			var doLater:Function = function():void{
				ExternalInterface.call("parent.FlexDoor.dispatchEvent", eventType);
			};
			setTimeout(doLater, 500);
		}

		protected function onResize(event:Event=null):void {
			if(_application){
				_application.width = stage.stageWidth;
				_application.height = stage.stageHeight;
			}
			if(event != null)
				dispatchJsEvent(event.type);
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
						if(name != "__src__" && name != "__frameRate__")
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
				var frameRate:Number  = loaderInfo.parameters["__frameRate__"];
				stage.frameRate = isNaN(frameRate) ? _application.stage.frameRate : frameRate;
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

		protected function js_findById(refId:Number):Object{
			return serialize(_refMap[refId]);
		}

		protected function js_find(refId:Number, id:String, index:uint, visibleOnly:Boolean):*{
			try{
				var target:* = _refMap[refId];
				var o:* = target[id];
				var visibleCount:uint = 0;
				if(o is Array){
					for(var i:uint = 0; i < o.length; i++){
						if(visibleOnly == true && o[i].visible != true)
							continue;
						if(visibleCount == index)
							return serialize(o[i]);
						visibleCount++;
					}
					return serialize(o[0]);
				}
				return serialize(o);
			}catch(e:Error){ 
				return serialize(e);
			}
		}

		protected function js_childByName(refId:Number, name:String):Object{
			var target:DisplayObjectContainer = _refMap[refId];
			return serialize(target.getChildByName(name));
		}

		protected function js_childByType(refId:Number, classType:String, index:uint, visibleOnly:Boolean):Object{
			var target:DisplayObjectContainer = _refMap[refId];
			var visibleCount:uint = 0;
			for(var i:uint = 0; i < target.numChildren; i++){
				var child:DisplayObject = target.getChildAt(i);
				if(visibleOnly == true && child.visible != true)
					continue;
				var type:XML = describeType(child);
				if( type.@base.toString() == classType || 
					type.@name.toString() == classType){
					if(visibleCount == index)
						return serialize(child);
					visibleCount++;
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

		protected function js_getter(refId:Number, command:String):*{
			var target:Object = _refMap[refId];
			if(validateCommand(target, command))
				return serialize(target[command]);
			return null;
		}

		protected function js_execute(refId:Number, command:String, values:Array):Object{
			var target:Object = _refMap[refId];
			if(validateCommand(target, command)){
				try{
					var ret:*;
					if(values != null && values.length > 0){
						ret = target[command].apply(target, deserializeAll(values));
					}else{
						ret = target[command]();
					}
					return serialize(ret);
				}catch(e:Error){
					return serialize(e);
				}
			}
			return null;
		}

		protected function js_class(className:String, isSerialize:Boolean=true):Object{
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
				for(var i:uint = 0; i < arguments.length; i++)
					arguments[i] = serialize(arguments[i]);
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

		public function deserializeAll(params:Array):Array{
			if(params is Array){
				for(var i:uint = 0; i < params.length; i++)
					params[i] = deserialize(params[i]);
			}
			return params;
		}

		public function deserialize(ref:*):*{
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

		protected function serialize(ref:Object):Object{
			if(ref == null) return null;
			var out:Object = {};
			if(ref is Error){
				out.extendTypes = ["Error", ref.name];
				out.errorID = ref.errorID;
				out.message = ref.message;
				out.stackTrace = Error(ref).getStackTrace();
				return out;
			}else if(ref is Array){
				for(var a:uint = 0; a < ref.length; a++)
					ref[a] = serialize(ref[a]);
				return ref;
			}else if(!(ref is Function) && (typeof(ref) != "object")){
				return ref; //Number, uint, int, String, Boolean
			}else{
				if(ref is Event){
					out.target = serialize(ref.target);
					out.currentTarget = serialize(ref.currentTarget);
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
					if(!(ref is DisplayObject)) //if not low level of ui components
						out.ref = ref;
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

		protected function validateCommand(object:*, command:String):Boolean{
			if(object == null){
				serialize(new Error("The reference id is invalid or object was destroyed."));
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
			}
		}
	}
}