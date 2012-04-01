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

function FlexDoor(testCaseType, autoStart)
{
	testCaseType.prototype.constructor = testCaseType;
	FlexDoor.TEST_CASES.push(testCaseType);
	FlexDoor.autoStart = autoStart;
};

FlexDoor.prototype.toString = function() {
	return this.moduleName;
};

FlexDoor.prototype.init = function(flashPlayerId, testCaseTitle)
{
	var flash =  Static.getFlash(flashPlayerId);
	if(flash == undefined)
		throw new Error("You must provide a valid Flash Player Object ID");

	var object = flash.application();
	var extendType = object.extendTypes[1];

	Application.prototype.Extends();
	this.app = new Application(Application, extendType, flash);
	this.app.Initialize(object, flash);
	var i = this.app.numChildren();

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
		for(var cls in FlexDoor.LOAD_FILES)
			return; //wait when all classes loaded
		var testCase = FlexDoor.TEST_CASES[Static.testCaseIndex];
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
			if(classType && classType.prototype.Import != undefined){
				var importFiles = classType.prototype.Import();
				Static.log("Class: " + cls + ". Total dependencies: " + importFiles.length);

				instance.include.apply(instance, importFiles);
			}else{
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
FlexDoor.TEST_CASES = [];
FlexDoor.LOAD_FILES = {};
FlexDoor.TIME_INTERVAL;
FlexDoor.INIT_PHASE = 0;

if(FlexDoor.LIB_PATH == undefined){
	var scripts = document.getElementsByTagName("script");
	for(var i = 0; i < scripts.length; i++){
		var src = scripts[i].src;
		if(src.indexOf("FlexDoor.js") != -1){
			FlexDoor.LIB_PATH = src.split("core")[0];
			break;
		}
	}
}

FlexDoor.include = function(cls, src, callback, css) {
	if(cls != null && typeof(window[cls]) == "function"){
		callback();
	}else if(!(FlexDoor.LOAD_FILES[cls] instanceof Array)){
		FlexDoor.LOAD_FILES[cls] = [callback];

		var obj, elm;
		var isOpera = typeof(opera) != "undefined" && opera.toString() == "[object Opera]";
		var isXULChrome = true;

		if(src.indexOf('.js') != -1 || src.indexOf('.css') != -1){
			src = FlexDoor.LIB_PATH + src;
		}else{
			src = FlexDoor.LIB_PATH + src.replace(/\./g, '/') + ".js";
		}

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
			delete FlexDoor.LOAD_FILES[cls];
			callback();
		}else{
			var onJsLoaded = function(){
				var cls = arguments.callee.prototype.cls;
				var callbacks = FlexDoor.LOAD_FILES[cls];
				delete FlexDoor.LOAD_FILES[cls];
				Static.log("Loaded class: " + cls + ". Total callback functions: " + callbacks.length);
	
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
		FlexDoor.LOAD_FILES[cls].push(callback);
	}
	
	//Validate if all classes are loaded
	clearInterval(FlexDoor.TIME_INTERVAL);
	FlexDoor.TIME_INTERVAL = setInterval(function(files){
		for(var className in files){
			Static.warn("Class not loaded: " + className);
		}
		clearInterval(FlexDoor.TIME_INTERVAL);
	}, 5000, FlexDoor.LOAD_FILES);
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
		"core::Static",
		"core::Assert",
		"events::FunctionEvent",
		"events::EventDispatcher",
		"core::UIComponent",
		"core::Container",
		"core::Application"
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