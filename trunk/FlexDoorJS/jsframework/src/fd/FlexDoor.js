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

function FlexDoor(testCaseType)
{
	this.events = [];

	testCaseType.prototype.constructor = testCaseType;
	FlexDoor.TEST_CASES.push(testCaseType);
};

FlexDoor.prototype.toString = function() {
	return this.moduleName;
};

FlexDoor.prototype.addEventListener = function(type, callback){
	this.events[type] = this.events[type] || [];
	if(this.events[type]) {
		var params = [callback].concat(System.getParams(arguments, 2));
		this.events[type].push(this.delegate.apply(this, params));
	}
};

FlexDoor.prototype.removeEventListener = function(type, callback){
	if (this.events[type]) {
		var listeners = this.events[type];
		for (var i = listeners.length - 1; i >= 0; --i){
			if (listeners[i] == callback || listeners[i].func == callback) {
				listeners.splice(i, 1);
				if(listeners.length == 0)
					delete this.events[type];
				return true;
			}
		}
	}
	return false;
};

FlexDoor.prototype.dispatchEvent = function(type){
	if (this.events[type]) {
		var listeners = this.events[type];
		var len = listeners.length;
		while(len--) {
			listeners[len](this);
		}
	}
};

FlexDoor.prototype.fireEvent = function(target, event){
	return System.fireEvent(target, event);
};

FlexDoor.prototype.delegate = function(func){
	return System.delegate(this, func, System.getParams(arguments, 1));
};

FlexDoor.prototype.callLater = function(func, delay){
	System.callLater(this, func, delay, System.getParams(arguments, 2));
};

FlexDoor.prototype.waitFor = function(func, delay, timeout){
	System.waitFor(this, func, delay, timeout, System.getParams(arguments, 2));
};

FlexDoor.prototype.callNextTest = function(testCaseTestEventType){
	if(testCaseTestEventType == undefined) testCaseTestEventType = TestEvent.ASYNCHRONOUS; 
	this.dispatchEvent(testCaseTestEventType);
};

FlexDoor.prototype.init = function(flashPlayerId, testCaseTitle)
{
	var flash =  System.getFlash(flashPlayerId);
	if(flash == undefined)
		throw new Error("You must provide a valid Flash Player Object ID");

	Application.prototype.Extends();
	var appObject = flash.application();
	this.app = new Application(Application, appObject.extendTypes[1], flash);
	this.app.Initialize(appObject, flash);

	var sysObject = flash.systemManager();
	var systemManager = new EventDispatcher();
	systemManager.Initialize(sysObject, this.app);
	this.app.systemManager = systemManager;
};

FlexDoor.prototype.include = function() {
	var testCase = this;
	var refIds = null;
	var testCaseType = FlexDoor.TEST_CASES[System.testCaseIndex];

	var runTestCase = function(){
		refIds = System.refIds();

		if(testCase instanceof testCaseType.prototype.constructor){
			var tests = [];
			for(var name in testCaseType.prototype){
				if(name.indexOf("test_") == 0 && typeof(testCase[name]) == "function")
					tests.push(name);
			}

			var runTest = function(testEvent){
				if(testEvent.order < tests.length){
					var callStartTestCaseListener = function(){
						startTestCaseListener(testEvent);
					};
					setTimeout(callStartTestCaseListener, testEvent.delay);
				}else{
					if(testCaseType.prototype.tearDownAfterClass != undefined){
						testCase["tearDownAfterClass"].call(testCase);
						System.releaseIds();
					}
					//Run Next TestCase
					System.startTestCase(System.testCaseIndex + 1);
				}
			};

			var startTestCaseListener = function(testEvent){
				var releaseRefId = [].concat(refIds); //clone exisitng ids

				//Execute Test
				try{
					if(testCaseType.prototype.setUp != undefined)
						testCase["setUp"].call(testCase, testEvent);

					testEvent.addAsyncEventListener = function(eventType){
						//call finalizeFunction after dispatchEvent
						testCase.addEventListener(eventType, finalizeFunction, testEvent, releaseRefId);
					};
					testCase[testEvent.functionName].call(testCase, testEvent);

					//Set timeout interval
					if(testEvent.timeout <= testEvent.delay + 100)
						testEvent.timeout = testEvent.delay + 100;

					//call finalizeFunction by timeout
					clearInterval(testCase.interval);
					testCase.interval = setInterval(testCase.delegate(finalizeFunction, testEvent), testEvent.timeout);

					//execute finalizeFunction by exist from a test
					if(testEvent.type == TestEvent.SYNCHRONOUS){
						finalizeFunction(testEvent, releaseRefId);
					}
				}catch(e){
					if(e.fileName != undefined && e.lineNumber != undefined){
						Assert.fail(e.fileName + '#' + e.lineNumber + '\n' + e.message);
						System.error(e);
					}else{
						Assert.fail(e.message);
						System.error(e.message);
					}
					finalizeFunction(testEvent, releaseRefId);
				}
			};

			var finalizeFunction = function(testEvent, releaseRefId){
				testCase.removeEventListener(testEvent.type, finalizeFunction);

				var nextTestEvent = new TestEvent(tests, testEvent.nextOrder);
				nextTestEvent.delay = testEvent.delay;
				nextTestEvent.items = testEvent.items;

				if(testCase.interval != undefined){
					clearInterval(testCase.interval);
					testCase.interval = undefined;
				}

				if(releaseRefId != undefined){
					for(var name in testEvent.items){
						var item = testEvent.items[name];
						if(item instanceof EventDispatcher)
							releaseRefId.push(item.refId);
					}
					System.releaseIds(releaseRefId, true);
				}else{
					Assert.fail("Test timed out: " + testEvent.functionName);
					System.warn("Test timed out: " + testEvent.functionName);
				}

				if(testCaseType.prototype.tearDown != undefined)
					testCase["tearDown"].call(testCase, nextTestEvent);

				//Run Next Test
				runTest(nextTestEvent);
			};

			if(tests.length > 0){
				var testEvent = new TestEvent(tests, 0);
				if(testCaseType.prototype.setUpBeforeClass != undefined){
					testCase["setUpBeforeClass"].call(testCase, testEvent);
					refIds = System.refIds();
				}
				System.trace(System.getNextTest(-1));
				runTest(testEvent);
			}
		};
	};

	FlexDoor.includeAll(testCase, arguments, runTestCase);
};

FlexDoor.includeAll = function(instance, files, callback) {
	var index = 0;

	var validateAllClasses = function(){
		for(var cls in FlexDoor.LOAD_FILES)
			return; //wait when all classes loaded
		callback.apply(instance);
	};

	var length = files.length;
	for(var i = 0; i < length; i++){
		var file = files[i];
		if(file == undefined){
			length--;
			continue;
		}

		var pair = file.split("::");
		var onClassLoaded = function(){
			var className = arguments.callee.prototype.name;
			var classType = FlexDoor.classType(className);
			if(classType && classType.prototype.Import != undefined){
				var importFiles = classType.prototype.Import();
				if(window["System"])
					System.info("Class: " + className + ". Total dependencies: " + importFiles.length);
				FlexDoor.includeAll(instance, importFiles, validateAllClasses);
			}else{
				index++;
			}
			if(index == length){
				clearInterval(FlexDoor.TIME_INTERVAL);
				FlexDoor.TIME_INTERVAL = setInterval(function(){
					clearInterval(FlexDoor.TIME_INTERVAL);
					validateAllClasses();
					
					//Validate if all classes are loaded
					FlexDoor.TIME_INTERVAL = setInterval(function(files){
						for(var className in files){
							System.warn("Class not loaded: " + className);
						}
						clearInterval(FlexDoor.TIME_INTERVAL);
					}, 15000, FlexDoor.LOAD_FILES);
				}, 500);
			}
		};
		onClassLoaded.prototype.name = files[i];
		FlexDoor.include(FlexDoor.toClassName(pair), pair[0] + "." + pair[1], onClassLoaded);
	}
};

FlexDoor.classType = function(className) {
	var pair = className.split("::");
	if(pair.length < 2)
		return window[className];
	if(pair[0] == "mx.core" || pair[0] == "fd")
		return window[pair[1]];
	var packageClassName = FlexDoor.toClassName(pair);
	return window[packageClassName];
};

FlexDoor.toClassName = function(pair) {
	return pair.join("_").split(".").join("_");
};

//Static API's and Variables
FlexDoor.TEST_CASES = [];
FlexDoor.LOAD_FILES = {};
FlexDoor.TIME_INTERVAL;
FlexDoor.INIT_PHASE = 0;
FlexDoor.TEST_DELAY_INTERVAL = 100;
FlexDoor.AUTO_START = false;

if(FlexDoor.LIB_PATH == undefined){
	var scripts = document.getElementsByTagName("script");
	for(var i = 0; i < scripts.length; i++){
		var src = scripts[i].src;
		if(src.indexOf("FlexDoor.js") != -1){
			FlexDoor.LIB_PATH = src.split("fd")[0];
			break;
		}
	}
}

FlexDoor.include = function(cls, src, callback) {
	if(cls != null && typeof(window[cls]) == "function"){
		if(callback != undefined)
			callback();
	}else if(!(FlexDoor.LOAD_FILES[cls] instanceof Array)){
		if(callback != undefined)
			FlexDoor.LOAD_FILES[cls] = [callback];

		var isOpera = typeof(opera) != "undefined" && opera.toString() == "[object Opera]";

		if(src.indexOf('.js') != -1){
			src = FlexDoor.LIB_PATH + src;
		}else{
			src = FlexDoor.LIB_PATH + src.replace(/\./g, '/') + ".js";
		}

		var jsLoadHandler = function(){
			var cls = arguments.callee.prototype.cls;
			if(window[cls] != undefined){
				var script = arguments.callee.prototype.script;
				var callbacks = FlexDoor.LOAD_FILES[cls];
				delete FlexDoor.LOAD_FILES[cls];
				if(callbacks != undefined){
					if(window["System"])
						System.log("Loaded class: " + cls + ". Total callback functions: " + callbacks.length);

					if (script.attachEvent && !isOpera) {
						script.detachEvent("onreadystatechange", jsLoadHandler);
					} else {
						script.removeEventListener("load", jsLoadHandler, false);
					}

					for(var i = 0; i < callbacks.length; i++)
						callbacks[i]();
				}
			}else{
				setTimeout(jsLoadHandler, 50);
			}
		};
		jsLoadHandler.prototype.cls = cls;
		FlexDoor.addScriptToHead(cls, src, null, jsLoadHandler);
	}else{
		if(callback != undefined)
			FlexDoor.LOAD_FILES[cls].push(callback);
	}
};

FlexDoor.dispatchEvent = function(eventType, param, autostart){
	if(eventType == "initialized"){
		FlexDoor.VERSION = param;
		FlexDoor.AUTO_START = autostart;
		FlexDoor.INIT_PHASE++;
		FlexDoor.run();
	}
};

FlexDoor.run = function(){
	if(FlexDoor.INIT_PHASE >= 2){	
		System.startTestCase(0);
	}
};

FlexDoor.reset = function(){
	FlexDoor.pendingJS = 0;
	FlexDoor.TEST_CASES = [];
};
FlexDoor.getPendingJS = function(){
	return FlexDoor.pendingJS;
};
FlexDoor.createScript = function(id, url, text){
	var jsLoadHandler;
	if(text == undefined){
		jsLoadHandler = function(){
			FlexDoor.pendingJS--;
			var script = arguments.callee.prototype.script;
			if (script.attachEvent && !isOpera) {
				script.detachEvent("onreadystatechange", jsLoadHandler);
			} else {
				script.removeEventListener("load", jsLoadHandler, false);
			}
		};
		FlexDoor.pendingJS++;
	}
	FlexDoor.addScriptToHead(id, url, text, jsLoadHandler);
};

FlexDoor.addScriptToHead = function(id, src, text, listener){
	var head = document.getElementsByTagName('head').item(0);
	if(head == undefined)
		throw new Error("Cannot get instance of HTML header");

	var script = document.createElement("script");
	script.setAttribute("type", "text/javascript");
	script.id = id;
	if(text == undefined){
		script.src =  src;
	}else{
		script.text = text;
	}

	if(listener instanceof Function){
		listener.prototype.script = script;
		if (script.attachEvent && !isOpera) {
			script.attachEvent("onreadystatechange", listener);
		} else {
			script.addEventListener("load", listener, false);
		}
	}

	if(id != undefined){
		for(var i = 0; i < head.children.length; i++){
			var elm = head.children[i];
			if(elm.type == "text/javascript" && elm.id == id){
				head.replaceChild(script, elm);
				return script;
			}
		}
	}

	head.appendChild(script);
	return script;
};

//Loading depended libraries

FlexDoor.include("jQuery", "jquery/jquery-latest.js", function(){
	FlexDoor.includeAll(this, [
		"fd::System",
		"fd::Assert",
		"fd::TestEvent",
		"fd::Function",
		"fd::EventDispatcher",
		"flash.events::Event"], 
		function(){
			FlexDoor.includeAll(this, [
				"mx.core::UIComponent",
				"mx.core::Container",
				"mx.core::Application",
				"mx.core::UITextField"],
				function(){
					$(document).ready(function(){
						FlexDoor.INIT_PHASE++;
						FlexDoor.run();
					});
				}
			);
		}
	);
});
