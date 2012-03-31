/**
 * @author David Gofman
 */

function FlexDoor(classType, autoStart)
{
	classType.prototype.constructor = classType;
	FlexDoor.CLASSES.push(classType);
	FlexDoor.autoStart = autoStart;
};

FlexDoor.prototype.toString = function() {
	return this.moduleName;
};

FlexDoor.prototype.init = function(flashPlayerId, testCaseTitle)
{
	if(flashPlayerId == undefined)
		throw new Error("You must provide a Flash Player Object ID");

	this.app = new Application(flashPlayerId);
	Application.application = this.app;

	if(testCaseTitle == undefined)
		testCaseTitle = flashPlayerId;

	if(testCaseTitle != undefined &&
		FlexDoor.autoStart != true){
		module(testCaseTitle);
	}
};

FlexDoor.prototype.include = function() {
	var instance = this;
	var files = arguments; //Function arguments: list of include classes
	var index = 0;

	var validateAllClasses = function(src){
		for(var cls in FlexDoor.LOADING)
			return; //wait when all classes loaded
		var testCase = FlexDoor.CLASSES[Static.testCaseIndex];
		if(instance instanceof testCase.prototype.constructor){
			var tests = [];
			for(var name in testCase.prototype){
				if(name.indexOf("test_") == 0 && typeof(instance[name]) == "function")
					tests.push(name);
			}

			//Initialize for first function the event argument
			var funcEvent = new FunctionEvent({order:0, delay:0});

			var runTest = function(){
				if(funcEvent.order < tests.length){
					funcEvent.name = tests[funcEvent.order]; //Set test-function name

					if(FlexDoor.autoStart == true){
						setTimeout(testListener, funcEvent.delay);
					}else{
						setTimeout(function(){
								test(funcEvent.name, testListener);
						}, funcEvent.delay);
					}
				}else{
					//Run Next TestCase
					Static.startTestCase(Static.testCaseIndex + 1);
				}
			};

			var testListener = function(){
				var order = funcEvent.order;

				//Execute Test
				try{
					var fe = instance[funcEvent.name].call(instance, funcEvent);
					if(fe instanceof FunctionEvent){
						funcEvent = fe;
					}else{
						funcEvent.reset();
					}
					Assert.assertTrue(funcEvent instanceof FunctionEvent, "ok succeeds");
				}catch(e){
					Assert.fail(e.message);
				}

				if(funcEvent.order == undefined || funcEvent.order <= order)
					funcEvent.order = order + 1;

				//Run Next Test
				runTest();
			};
			runTest();
		}
	};

	for(var i = 0; i < files.length; i++){
		var params = files[i].split("::");
		var onClassLoaded = function(){
			var cls = arguments.callee.prototype.cls;
			var className = arguments.callee.prototype.name;
			var classType = window[cls];
			if(classType.prototype.required != undefined){
				var depedFiles = classType.prototype.required();
				Static.trace("Class: " + cls + ". Total dependencies: " + depedFiles.length);

				instance.include.apply(instance, depedFiles);
			}else{
				if(classType.prototype.super != undefined){
					var superClassType = classType.prototype.super();
					classType.prototype = new superClassType(classType, className);
				}
				index++;
			}
			if(index == files.length)
				validateAllClasses();
		};
		onClassLoaded.prototype.cls = params[1];
		onClassLoaded.prototype.name = files[i];
		FlexDoor.include(params[1], params[0] + "." + params[1], onClassLoaded);
	}
};

//Static API's and Variables
FlexDoor.CLASSES = [];
FlexDoor.LOADING = {};
FlexDoor.LOAD_DELAY;
FlexDoor.INIT_PHASE = 0;

FlexDoor.include = function(cls, src, callback, css) {
	if(cls != null && typeof(window[cls]) == "function"){
		callback();
	}else if(!(FlexDoor.LOADING[cls] instanceof Array)){
		FlexDoor.LOADING[cls] = [callback];

		var obj, elm;
		var isOpera = typeof(opera) != "undefined" && opera.toString() == "[object Opera]";
		var isXULChrome = true;

		if(src.indexOf('automation-js/') != 0)
			src = "automation-js/" + src.replace(/\./g, '/') + ".js";

		try {
			// check if this is a standard HTML page or a different document (e.g. XUL)
			// if that is undefined, then catch() will be executed
			var dummy = document.body.innerHTML;
			isXULChrome = false;
		} catch(e) {}


		if(!isXULChrome) {
			elm = document.getElementsByTagName('head').item(0);
		}else{
			//top/root XUL elements are: window, dialog, overlay, wizard, prefwindow, page, wizard
			if ((elm = document.getElementsByTagName('window')[0]) || 
				(elm = document.getElementsByTagName('page')[0]) || 
				(elm = document.getElementsByTagName('dialog')[0]) || 
				(elm = document.getElementsByTagName('overlay')[0]) || 
				(elm = document.getElementsByTagName('wizard')[0])) {
				elm = document.getElementsByTagName('prefwindow')[0];
			}
		}

		if(elm == undefined)
			throw new Error("Cannot get instance of HTML element");

		if(!isXULChrome) {
			obj = document.createElement(css ? 'link' : 'script');
			obj.type = css ? 'text/css' : 'text/javascript';
			if(css){
				obj.href = src;
				obj.rel = 'stylesheet';
			}else{
				obj.src = src;
				obj.defer = true;
			}
		} else {
			obj = document.createElementNS('http://www.w3.org/1999/xhtml', css ? 'html:link' : 'html:script');
			obj.setAttribute('type', css ? 'text/css' : 'text/javascript');
			if(css){
				obj.setAttribute('href', src);
				obj.setAttribute('rel', 'stylesheet');
			}else{
				obj.setAttribute('src', src);
				obj.setAttribute('defer', 'true');
			}
		}
		
		if(css){
			delete FlexDoor.LOADING[cls];
			callback();
		}else{
			var onJsLoaded = function(){
				var cls = arguments.callee.prototype.cls;
				var callbacks = FlexDoor.LOADING[cls];
				delete FlexDoor.LOADING[cls];
				Static.trace("Loaded class: " + cls + ". Total callback functions: " + callbacks.length);
	
				for(var i = 0; i < callbacks.length; i++)
					callbacks[i]();
			};
			onJsLoaded.prototype.cls = cls;
	
			if (obj.attachEvent && !isOpera) {
				obj.attachEvent("onreadystatechange", onJsLoaded);
			} else {
				obj.addEventListener("load", onJsLoaded, false);
			}
		}

		elm.appendChild(obj);
	}else{
		FlexDoor.LOADING[cls].push(callback);
	}
	
	//Validate if all classes are loaded
	clearInterval(FlexDoor.LOAD_DELAY);
	FlexDoor.LOAD_DELAY = setInterval(function(){
		for(var cls in FlexDoor.LOADING){
			Static.trace("Class not loaded: " + cls, "warn");
		}
		clearInterval(FlexDoor.LOAD_DELAY);
	}, 5000);
};

FlexDoor.dispatchEvent = function(eventType){
	if(eventType == "initialized"){
		FlexDoor.run();
	}
};

FlexDoor.run = function(){
	if(++FlexDoor.INIT_PHASE == 2){
		if(FlexDoor.autoStart == true){
			Static.startTestCase(0);
		}else{
			Static.loadQUnit();
		}
	}
};

//Loading depended libraries

$(document).ready(function(){
	var initClassLibs = [
		"org.flexdoor.core::Static",
		"org.flexdoor.core::Assert",
		"org.flexdoor.events::FunctionEvent",
		"org.flexdoor.events::EventDispatcher",
		"org.flexdoor.core::UIComponent",
		"org.flexdoor.core::Container",
		"org.flexdoor.core::Application"
	];
	
	var libIndex = 0;
	var onLoadLibs = function(){
		if(++libIndex == initClassLibs.length){
			FlexDoor.run();
		}
	};
	for(var i = 0; i < initClassLibs.length; i++){
		var params = initClassLibs[i].split("::");
		FlexDoor.include(params[1], params[0] + "." + params[1], onLoadLibs);
	}
});