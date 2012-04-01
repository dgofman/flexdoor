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
	
	[Mixin]
	[SWF(backgroundColor="#FFFFFF")]
	public class FlexDoor extends Sprite
	{
		private var _application:*;
		private var _loader:Loader;
		
		private var _refMap:Dictionary;
		private var _src:String;
		private var _timer:Timer;
		
		public static const VERSION:String     = "3.0";
		public static const INITIALIZED:String = "initialized";
		
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
				ExternalInterface.addCallback("application", js_application);
				ExternalInterface.addCallback("find", js_find);
				ExternalInterface.addCallback("getChildByName", js_childByName);
				ExternalInterface.addCallback("getChildByType", js_childByType);
				ExternalInterface.addCallback("setter", js_setter);
				ExternalInterface.addCallback("getter", js_getter);
				
				
				
				/*ExternalInterface.addCallback("js_app",     js_application);
				ExternalInterface.addCallback("js_call",    js_call);	
				ExternalInterface.addCallback("js_release", js_release);
				ExternalInterface.addCallback("js_node",    js_node);
				ExternalInterface.addCallback("js_root",    js_root);
				ExternalInterface.addCallback("js_event",   js_event);
				ExternalInterface.addCallback("js_base64",  js_base64);
				ExternalInterface.addCallback("js_memory",  js_memory);
				ExternalInterface.addCallback("js_create",  js_create);*/
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
		
		protected function js_application():Object{
			return serialize(_application);
		}
		
		protected function js_find(refId:uint, id:String, index:uint, visibleOnly:Boolean):*{
			try{
				var o:* = _refMap[refId][id];
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
		
		protected function js_childByName(refId:uint, name:String):Object{
			var parent:DisplayObjectContainer = _refMap[refId];
			return serialize(parent.getChildByName(name));
		}
		
		protected function js_childByType(refId:uint, classType:String, index:uint, visibleOnly:Boolean):Object{
			var parent:DisplayObjectContainer = _refMap[refId];
			var visibleCount:uint = 0;
			for(var i:uint = 0; i < parent.numChildren; i++){
				var child:DisplayObject = parent.getChildAt(i);
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
		
		protected function js_setter(refId:uint, command:String, value:*):void{
			var parent:Object = _refMap[refId];
			if(parent.hasOwnProperty(command))
				parent[command] = value;
		}
		
		protected function js_getter(refId:uint, command:String):*{
			var parent:Object = _refMap[refId];
			if(parent.hasOwnProperty(command))
				return parent[command];
			return null;
		}
		
		protected function serialize(ref:Object):Object{
			if(ref == null) return null;
			var out:Object = {};
			if(ref.hasOwnProperty('id'))
				out.id = ref.id;
			if(ref.hasOwnProperty('name'))
				out.name = ref.name;
			if(ref is Error){
				out.error = Error(ref).message;
				out.stackTrace = Error(ref).getStackTrace();
			}
			var type:XML = describeType(ref);
			var extendTypes:Array = [type.@name.toString()];
			for(var i:uint = 0; i < type.extendsClass.length(); i++)
				extendTypes.push(type.extendsClass[i].@type.toString());
			out.extendTypes = extendTypes;
			
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
	}
}