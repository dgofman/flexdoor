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

function System() {
    throw new Error("DO NOT CREATE THIS OBJECT");
}

//Static API's and Variables
System.CLASSES = [];
System.LOADING = {};
System.LOAD_DELAY;
System.INIT_PHASE = 0;
System.TIMERS = {};

System.getFlash = function(flashPlayerId){
    if(document.embeds && document.embeds[flashPlayerId]){ //FireFox, Chrome, Opera
        return document.embeds[flashPlayerId];
    }else if(window.document[flashPlayerId]){ //IE
        return window.document[flashPlayerId];
    }else{ //Others
        return document.getElementById(flashPlayerId);
    }
};

System.delegate = function(target, func, arrayParams){
    var f = function() {
        return func.apply(target, arrayParams);
    };
    f.func = func;
    return f;
};

System.getParams = function(args, index, isSerializable){
    if(index == undefined) index = 0;
    var params = [];
    if(args.length > index){
        for(var i = index; i < args.length; i++){
            if(isSerializable == true){
                params.push(System.serialize(args[i]));
            }else{
                params.push(args[i]);
            }
        }
    }
    return params;
};

System.timer = function(timeInterval, func, delay){
    if(timeInterval == undefined){
        System.TIMERS[timeInterval = setInterval(function(){
            if(System.TIMERS && System.TIMERS[timeInterval] != undefined)
                func();
        }, delay)] = new Date();
        return timeInterval;
    }else{
        clearInterval(timeInterval);
        delete System.TIMERS[timeInterval];
    }
};

System.killTimers = function(){
    for(var timeInterval in System.TIMERS)
        clearInterval(timeInterval);
    System.TIMERS = {};
};

System.callLater = function(target, func, delay, params){
    if(delay == undefined) delay = TestEvent.TEST_DELAY;
    var timer = System.timer(null, function(){
        System.timer(timer);
        func.apply(target, params);
    }, delay);
};

System.waitFor = function(target, func, delay, timeout, params){
    if(delay == undefined) delay = TestEvent.TEST_DELAY;
    if(timeout == undefined) timeout = TestEvent.TIMEOUT;
    var timer1 = System.timer(null, function(){
        if(func.apply(target, params) == true){
            System.timer(timer1);
            System.timer(timer2);
        }
    }, delay);
    var timer2 = System.timer(null, function(){
        System.timer(timer1);
        System.timer(timer2);
        throw new Error("Timeout!!!");
    }, timeout);
};

System.getLocator = function(refId, path){
    return System.call(function(flash){
        return flash.getLocator(refId, path);
    });
};

System.findById = function(refId, keepRef){
    return System.call(function(flash){
        return flash.findById(refId);
    });
};

System.find = function(parent, id, index, visibleOnly, keepRef){
    return System.call(function(flash){
        return flash.find(parent._refId, id, index, visibleOnly, keepRef);
    });
};

System.getClass = function(className){
    return System.call(function(flash){
        return flash.getClass(className);
    });
};

System.getChildByName = function(parent, name, keepRef){
    return System.call(function(flash){
        return flash.getChildByName(parent._refId, name, keepRef);
    });
};

System.getChildByType = function(parent, classType, index, visibleOnly, keepRef){
    return System.call(function(flash){
        return flash.getChildByType(parent._refId, classType, index, visibleOnly, keepRef);
    });
};

System.setter = function(target, command, value){
    System.call(function(flash){
        return flash.setter(target._refId, command, value);
    });
};

System.getter = function(target, command, keepRef){
    return System.call(function(flash){
        return flash.getter(target._refId, command, keepRef);
    });
};

System.execute = function(target, command, values, keepRef){
    if(values != null && !(values instanceof Array)) values = [values];
    return System.call(function(flash){
        return flash.execute(target._refId, command, values, keepRef);
    });
};

System.refValue = function(refId, keys, value, keepRef){
    return System.call(function(flash){
        return flash.refValue(refId, keys, value, keepRef);
    });
};

System.create = function(extendType, args){
    if(args != null && !(args instanceof Array)) args = [args];
    return System.call(function(flash){
        return flash.create(extendType, args);
    });
};

System.createFunction = function(classType, functionName, keepRef){
    return System.call(function(flash){
        return flash.createFunction(classType, functionName, keepRef);
    });
};

System.call = function(handler, deserialize){
    try{
        var flash = Application.application.flash;
        var object = handler(flash);
        if(deserialize != false)
            return System.deserialize(object);
        return object;
    }catch(e){
        Assert.fail(e.message);
        System.info(System.call.caller.arguments);
        System.error(System.call.caller.toString());
        throw e;
    }
};


//type is optional get any event types if type is undefined
//listenerId - is not remove event dispatcher hook
System.dispatchEventHook = function(target, listenerId, type){
    System.call(function(flash){
        return flash.dispatchEventHook(target._refId, listenerId, type);
    });
};

System.addEventListener = function(target, type, listenerId, useWeakReference, useCapture, priority){
    System.call(function(flash){
        return flash.addEventListener(target._refId, type, listenerId, useWeakReference, useCapture, priority);
    });
};

System.removeEventListener = function(target, type, listenerId, useCapture){
    System.call(function(flash){
        return flash.removeEventListener(target._refId, type, listenerId, useCapture);
    });
};

System.dispatchEvent = function(target, event){
    return System.call(function(flash){
        return flash.dispatchEvent(target._refId, event._refId);
    });
};

System.refIds = function(){
    return System.call(function(flash){
        return flash.refIds();
    }, false);
};

System.releaseIds = function(ids, except, isFunction){
    if(except == undefined) except = false;
    return System.call(function(flash){
        return flash.releaseIds(ids, except, isFunction);
    }, false);
};

System.releaseItems = function(){
    var ids = [];
    for(var i = 0; i < arguments.length; i++)
        ids.push(arguments[i]._refId);
    return System.releaseIds(ids);
};

System.setFunctionProperty = function(target, command, args){
    if(args.length > 0){
        var func = target.createFunction.apply(target, args);
        target.setter(command, func);
        return func;
    }else{
        return target.getter(command);
    }
};

System.setSearchFunction = function(collection, func){
    var filterFunc = collection.filterFunction();
    if(filterFunc != null)
        filterFunc = $Function.Get(filterFunc);
    var asFunction = $Function.Get(collection.createFunction(func));
    collection.filterFunction(asFunction);
    collection.refresh();

    //return original filter function
    collection.filterFunction(filterFunc);
    collection.refresh();

    asFunction.destroy();
    if(filterFunc != null)
        filterFunc.destroy();
};

System.serialize = function(object){
    var serialize = "FLEXDOOR_SERIALIZE";
    if(object instanceof fd_Function){
        return [serialize, fd_System.FUNCTION, object._refId];
    }else if(object instanceof fd_System.Class){
        return [serialize, fd_System.CLASS, object._refId];
    }else if(object instanceof EventDispatcher ||
             object instanceof flash_events_Event){
        return [serialize, fd_System.ANY, object._refId];
    }
    return object;
};

System.deserialize = function(params, parent){
    if(!(params instanceof Array))
        Assert.fail("Invalid the deserializable argument");
    var type   = params[0];
    var object = params[1];
    switch(type){
        case fd_System.NULL:
        case fd_System.PRIMITIVE:
            return object;
        case fd_System.OBJECT:
            return System.json(object);
        case fd_System.REFERENCE:
            return object.refId;
        case fd_System.CLASS:
            return new fd_System.Class(object);
        case fd_System.FUNCTION:
            return new fd_Function(object);
        case fd_System.ERROR:
            var classType = FlexDoor.classType(object.extendTypes[0]);
            if(classType == null) classType = Error;
            Assert.fail(object.message);
            throw new classType(object.message);
            break;
        case fd_System.ARRAY:
            for(var i = 0; i < object.length; i++)
                object[i].ref = System.json(object[i].ref);
            return object;
        case fd_System.EVENT:
        case fd_System.ANY:
            for(var i = 0; object.extendTypes.length; i++){
                var extendType = object.extendTypes[i];
                if(extendType == "Object"){
                    var ref = System.json(object.ref);
                    if(typeof(ref) == "object"){
                        ref.__params__ = params;
                        return ref;
                    }
                    break;
                }
                var pair = extendType.split("::");
                var className = pair[0];
                if(pair.length == 2)
                    className = pair[1];
                var classType = FlexDoor.classType(extendType);
                if(classType != undefined && classType.prototype != undefined){
                    if(classType.prototype.Extends != undefined &&
                     !(classType.prototype instanceof UIComponent)){
                        classType.prototype.Extends();
                    }
                    var component = new classType(classType);
                    if(component instanceof EventDispatcher ||
                        component.Initialize instanceof Function){
                        object.ref = System.json(object.ref);
                        component.Initialize(object, parent);
                    }
                    return component;
                }
            }
        default:
            Assert.fail("Invalid serialization type");
    }
    return object;
};

System.json = function(value){
    var json = jQuery.parseJSON(value);
    return (typeof(json) == "object" ? json : value);
};

System.fireEvent = function(target, event){
    var result = target.dispatchEvent(event);
    event.destory();
    return result;
};

System.log = function(message) {
    System.trace(message, "log");
};
System.warn = function(message) {
    System.trace(message, "warn");
};
System.info = function(message) {
    System.trace(message, "info");
};
System.error = function(message) {
    System.trace(message, "error");
};
System.trace = function(message, level) {
    if(level == undefined)
        level = "log";
    if(window['console'] != undefined)
        window['console'][level](message);
};

function fd_System(){};
fd_System.Class = function(object){
    this._refId = object.refId;
};
fd_System.NULL      = 0;
fd_System.ERROR     = 1;
fd_System.PRIMITIVE = 2;
fd_System.OBJECT    = 3;
fd_System.ARRAY     = 4;
fd_System.EVENT     = 5;
fd_System.CLASS     = 6;
fd_System.FUNCTION  = 7;
fd_System.REFERENCE = 8;
fd_System.ANY       = 9;