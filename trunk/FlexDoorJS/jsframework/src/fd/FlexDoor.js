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

	if(testCaseTitle == undefined)
		testCaseTitle = flashPlayerId;

	if(testCaseTitle != undefined &&
		FlexDoor.AUTO_START != true){
		module(testCaseTitle);
	}
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

			//Initialize for first function the event argument
			var testEvent = new TestEvent(0);

			var runTest = function(){
				if(testEvent.order < tests.length){
					testEvent.functionName = tests[testEvent.order];

					if(FlexDoor.AUTO_START == true){
						setTimeout(startTestCaseListener, testEvent.delay);
					}else{
						setTimeout(function(){
								test(testEvent.functionName, startTestCaseListener);
						}, testEvent.delay);
					}
				}else{
					if(testCaseType.prototype.tearDownAfterClass != undefined){
						testCase["tearDownAfterClass"].call(testCase, "tearDownAfterClass");
						System.releaseIds();
					}
					//Run Next TestCase
					System.startTestCase(System.testCaseIndex + 1);
				}
			};

			var startTestCaseListener = function(){
				var releaseRefId = [].concat(refIds); //clone exisitng ids

				//Execute Test
				try{
					if(testCaseType.prototype.setUp != undefined)
						testCase["setUp"].call(testCase, "setUp");
					testCase[testEvent.functionName].call(testCase, testEvent);

					//Set timeout interval
					if(testEvent.timeout <= testEvent.delay + 100)
						testEvent.timeout = testEvent.delay + 100;
					testCase.interval = setInterval(System.delegate(testCase, finalizeFunction), testEvent.timeout);

					if(testEvent.type == TestEvent.NEXT_TYPE){
						finalizeFunction(releaseRefId);
					}else{
						testCase.addEventListener(testEvent.type, finalizeFunction, releaseRefId);
					}
				}catch(e){
					if(e.fileName != undefined && e.lineNumber != undefined){
						Assert.fail(e.fileName + '#' + e.lineNumber + '\n' + e.message);
						System.error(e);
					}else{
						Assert.fail(e.message);
						System.error(e.message);
					}

					if(window["QUnit"] && QUnit.config.notrycatch)
						debugger;

					finalizeFunction(releaseRefId);
				}
			};

			var finalizeFunction = function(releaseRefId){
				testCase.removeEventListener(testEvent.type, finalizeFunction);

				var nextTestEvent = new TestEvent(testEvent.nextOrder);
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

					Assert.assertTrue(true, "ok succeeds");
				}else{
					System.warn("Test timed out: " + testEvent.functionName);
				}

				if(testCaseType.prototype.tearDown != undefined)
					testCase["tearDown"].call(testCase, "tearDown");

				//Run Next Test
				testEvent = nextTestEvent;
				runTest();
			};

			if(tests.length > 0){
				if(testCaseType.prototype.setUpBeforeClass != undefined){
					testCase["setUpBeforeClass"].call(testCase, "setUpBeforeClass");
					refIds = System.refIds();
				}
				runTest();
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

if(window.location.search.indexOf("autoStart=true") != -1)
	FlexDoor.AUTO_START = true;

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

		var elm = document.getElementsByTagName('head').item(0);
		if(elm == undefined)
			throw new Error("Cannot get instance of HTML element");

		var obj = document.createElement('script');
		obj.type = 'text/javascript';
		obj.src = src;

		var onJsLoaded = function(){
			var cls = arguments.callee.prototype.cls;
			if(window[cls] != undefined){
				var obj = arguments.callee.prototype.obj;
				var callbacks = FlexDoor.LOAD_FILES[cls];
				delete FlexDoor.LOAD_FILES[cls];
				if(callbacks != undefined){
					if(window["System"])
						System.log("Loaded class: " + cls + ". Total callback functions: " + callbacks.length);

					if (obj.attachEvent && !isOpera) {
						obj.detachEvent("onreadystatechange", onJsLoaded);
					} else {
						obj.removeEventListener("load", onJsLoaded, false);
					}

					for(var i = 0; i < callbacks.length; i++)
						callbacks[i]();
				}
			}else{
				setTimeout(onJsLoaded, 50);
			}
		};
		onJsLoaded.prototype.cls = cls;
		onJsLoaded.prototype.obj = obj;

		if (obj.attachEvent && !isOpera) {
			obj.attachEvent("onreadystatechange", onJsLoaded);
		} else {
			obj.addEventListener("load", onJsLoaded, false);
		}

		elm.appendChild(obj);
	}else{
		if(callback != undefined)
			FlexDoor.LOAD_FILES[cls].push(callback);
	}
};

FlexDoor.dispatchEvent = function(eventType, param){
	if(eventType == "initialized"){
		FlexDoor.VERSION = param;
		FlexDoor.run();
	}
};

FlexDoor.run = function(){
	if(++FlexDoor.INIT_PHASE == 2){
		if(FlexDoor.AUTO_START == true){
			System.startTestCase(0);
		}else{
			System.loadQUnit();
		}
	}
};

//Loading depended libraries

FlexDoor.include("jQuery", "jquery/jquery-latest.js", function(){
	$(document).ready(function(){
		FlexDoor.includeAll(this, [
			"fd::System",
			"fd::Assert",
			"fd::TestEvent",
			"fd::Function",
			"fd::EventDispatcher",
			"flash.events::Event",], 
			function(){
				FlexDoor.includeAll(this, [
					"mx.core::UIComponent",
					"mx.core::Container",
					"mx.core::Application"],
					function(){
						FlexDoor.run();
					}
				);
			}
		);
	});
});
