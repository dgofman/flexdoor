var FlexDoor = new function(){

	//public
	this.INITIALIZED = "initialized";
	this.RESIZE		 = "resize";

	this.XML_ELEMENT_NODE_TYPE  = 1;
	this.XML_DOCUMENT_NODE_TYPE = 9;

	this.TYPE_IS_GETTER;
	this.TYPE_IS_TRAVERSE;

	var pauseWindowW = 255;
	var pauseWindowH = 105;

	this.pauseUrl     = "Pause.html";
	this.pauseWindowX = window.screen.width  - pauseWindowW;
	this.pauseWindowY = window.screen.height - pauseWindowH;
	this.pauseWindowDelay;

	this.showRefInfo = true;
	this.asDocs = [
		{prefix:"mx", baseURL:"http://livedocs.adobe.com/flex/3/langref/"},
		{prefix:"flash", baseURL:"http://livedocs.adobe.com/flex/3/langref/"}
	];

	this.replace = function(id, parent, swfPath, flashvars){
		try{
			var obj = getMovie(id, parent);
			
			if(!swfPath) swfPath = "FlexDoor.swf";
			src = obj.src; //FireFox
			if(!src || !src.length)
				src = obj.movie; //IE
			if(!flashvars){
				flashvars = obj.getAttribute("flashvars"); //FireFox
				if(!flashvars || !flashvars.length){
					var params = obj.getElementsByTagName("param"); //IE
					for(var i = 0; i < params.length; i++){
						if(params[i].getAttribute("name").toLowerCase() == "flashvars"){
							flashvars = params[i].getAttribute("value"); //IE
							break;
						}
					}
				}
			}

			if(src.charAt(0) == '/'){
				src = document.location.protocol + "//"+ document.location.host + src;
			}else if(/^\.\./.test(src)){
				var href = (parent.src ? parent.src : document.location.href);
				href = href.substring(0, href.lastIndexOf('/'));
				while (/^\.\./.test(src)){
					href = href.substring(0, href.lastIndexOf('/'));
					src = src.substring(3);
				}
				src = href + '/' + src;
			}

			var url = swfPath + (swfPath.indexOf('?') != -1 ? '&' : '?') + 
				"__src__=" + src + "&" + flashvars;
			if(!document.all){ //FireFox ignored movie reloading
				var parent = obj.parentNode;
				if(parent != undefined){
					parent.removeChild(obj);
					obj.src = url;
					parent.appendChild(obj);
				}
			}else{
				obj.movie = url; //IE
			}
		}catch(e){
			alert("FlexDoor::replace error: " + e.message);
		}
	};

	this.changeMovieByParent = function(parent){
		if(movies[parent] != null)
			movie = movies[parent];
		else
			throw new Error("Cannot find a flash movie for this parent: " + parent);
	};

	this.addEventListener = function(type, listener, ref){
		if(ref){
			var refId = getRefId(ref);
			var eventId = deserialize(getMovie().js_event(refId, type));
			events.push({type:type, listener:listener, eventId:eventId, refId:refId});
		}else{ //Global Events
			events.push({type:type, listener:listener});
		}
	};

	this.removeEventListener = function(type, listener, ref){
		if(ref)
			deserialize(getMovie().js_event(getRefId(ref), type, true));
		for(var i = events.length - 1; i >= 0; i--){
			var e = events[i];
			if( typeof(e.listener) != "function" ||
			   (e.type == type && e.listener == listener)){
				events.splice(i, 1);
			}
		}
	};

	this.dispatchEvent = function(type, eventRef, eventId){
		if(type == this.INITIALIZED){
			TYPE_IS_ERROR		  = this.getRef("FlexDoorLib", "TYPE_IS_ERROR");
			TYPE_IS_NULL		  = this.getRef("FlexDoorLib", "TYPE_IS_NULL");
			TYPE_IS_ARRAY		  = this.getRef("FlexDoorLib", "TYPE_IS_ARRAY");
			TYPE_IS_XML			  = this.getRef("FlexDoorLib", "TYPE_IS_XML");
			TYPE_IS_ANONYMOUS	  = this.getRef("FlexDoorLib", "TYPE_IS_ANONYMOUS");
			TYPE_IS_FUNCTION	  = this.getRef("FlexDoorLib", "TYPE_IS_FUNCTION");
			TYPE_IS_ASINSTANCE	  = this.getRef("FlexDoorLib", "TYPE_IS_ASINSTANCE");
			this.TYPE_IS_GETTER   = this.getRef("FlexDoorLib", "TYPE_IS_GETTER");
			this.TYPE_IS_TRAVERSE = this.getRef("FlexDoorLib", "TYPE_IS_TRAVERSE");
		}
		for(var i = events.length - 1; i >= 0; i--){
			var e = events[i];
			if(typeof(e.listener) != "function"){
				events.splice(i, 1);
			}else if(e.type == type && (eventId == null || e.eventId == eventId)){
				e.listener(deserialize(eventRef));
				break;
			}
		}
	};

	this.stringToXML = function(value){
		var xmlDoc;
		value = value.replace(/\r|\n/g, '');
		if(document.all){
			xmlDoc = new ActiveXObject("MSXML2.DOMDocument");
			xmlDoc.loadXML(value);
		}else{
			xmlDoc = new DOMParser().parseFromString(value, 'text/xml');
		}
		return xmlDoc;
	};

	this.xmlToString = function(xmlDoc)
	{
		var xml = "";
		var items = (xmlDoc.length != undefined) ? xmlDoc : [xmlDoc];
		for(var i = 0; i < items.length; i++){
			if(xmlDoc && document.all){
				xml += items[i].xml + "\n";
			}else if(xmlDoc){
				xml += new XMLSerializer().serializeToString(items[i]);
			}
		}
		return xml;
	};

	this.xmlElement= function(xmlDoc){
		return (document.all) ? xmlDoc.documentElement : xmlDoc.firstChild;
	};

	//Bridge API
	this.embed = function(){
		return getMovie();
	};

	this.root = function(ref, localName, value, keep_refs){
		return deserialize(getMovie().js_root(getRefId(ref), localName, serialize(value), keep_refs == true));
	}

	this.getApp = function(){
		return deserialize(getMovie().js_app());
	};

	this.getRef = function(ref, propName, args, keep_refs){
		return call(ref, propName, args, keep_refs);
	};

	this.getXmlRef = function(parentRefId, childRefId, keep_refs){
		return deserialize(getMovie().js_node(getRefId(parentRefId), getRefId(childRefId), keep_refs != false));
	};

	this.create = function(ref, params){
		return deserialize(getMovie().js_create(getRefId(ref), serialize(params)));
	};

	this.releaseAll = function(ref){
		objects = {};
		this.release(-1);
	};

	this.release = function(ref){
		if(ref instanceof RefObject){
			ref = getRefId(ref);
			delete objects[ref];
		}
		getMovie().js_release(ref);
	};

	this.swfObjectIds = function(){
		return getMovie().js_memory();
	};

	this.jsObjectIds = function(){
		return objects;
	};

	this.base64 = function(ref, base64Str){
		return getMovie().js_base64(getRefId(ref), base64Str);
	};

	this.exit = function(){
		for(var i = events.length - 1; i >= 0; i--){
			var e = events[i];
			if(!isNaN(e.refId)){
				deserialize(getMovie().js_event(e.refId, e.type, true));
				events.splice(i, 1);
			}
		}
		var error = new Error("Stopped by user");
		error.name = "InterruptedException";
		throw error;
	};

	this.resetRefHistory = function(history){
		if(refHistory instanceof Array)
			this.release(refHistory);
		refHistory = (history instanceof Array ? history : []);
	};

	this.setRefHistory = function(history){
		var oldHistory = (refHistory instanceof Array ? refHistory.slice() : null);
		refHistory = history;
		return oldHistory;
	};

	this.setFrameRate = function(sec){
		getMovie().js_frameRate(sec);
	};

	this.openProperties = function(){
		var info = getMovie().js_topInfo();
		var result    = info[0];
		var children  = info[1];
		var accessors = info[2];
		var root = FlexDoor.stringToXML(result.value);
		var ref = new RefObject(result.refId, root.firstChild.getAttribute("name"));
		initRefInfo(ref, root);
		if(propertyWin && !propertyWin.closed)
			propertyWin.close();
		propertyWin = window.open("", null,"left=0,top=0,scrollbars=yes,resizable=yes");
		try{
			propertyWin.document.write("<HTML><HEAD><TITLE>" + ref.__TYPE__ + "</TITLE>")
			propertyWin.document.write("\n<STYLE>td{cursor:pointer;cursor:hand;color:blue}td.over{background-color: yellow;}td.out{background-color: white;}</STYLE>");
			propertyWin.document.write("\n</HEAD>\n<TABLE>");
			var childByName = children.join('.');
			var childByRef  = (accessors && accessors.length) ? accessors[accessors.length - 1] : null;
			while(children.length){
				var accessor = accessors.pop();
				propertyWin.document.write("\n<TR><TD nowrap onmouseover='this.className=\"over\"' onmouseout='this.className=\"out\"' accessor='" + (accessor ? accessor : '') + "' onclick='opener.FlexDoor.writeHTML(this.getAttribute(\"accessor\"), this.firstChild.nodeValue, document)'>" + children.join('.') + "</TD></TR>");
				children.pop();
			}
			propertyWin.document.write("\n</TABLE><HR>");
			propertyWin.document.write("\n<DIV id='elm1' style='color:red'></DIV>");
			propertyWin.document.write("\n<H3><DIV id='elm2'></DIV></H3>");
			propertyWin.document.write("\n<DIV id='elm3'></DIV></HTML>");
			propertyWin.document.close();
			propertyWin.focus();
			this.writeHTML(childByRef, childByName, propertyWin.document);
		}catch(e){}
	};

	this.writeHTML = function(childByRef, childByName, document){
		if(!childByName || !document) return;
		var tempHistory = FlexDoor.setRefHistory([]);
		var ref, baseClass;
		if(!childByRef || childByRef == '')
			childByRef = childByName;
		try{
			ref = eval(childByRef);
		}catch(e){}
		if(!ref){
			alert("Cannot find class reference: " + childByRef);
			return;
		}
		if(ref && ref.__INFO__)
			baseClass = ref.__INFO__["{!__BASE__!}"];
		document.title = ref.__TYPE__;
		document.getElementById("elm1").innerHTML = childByRef;
		document.getElementById("elm3").innerHTML = "<PRE>" + getAPIs(ref).toString() + "</PRE>";
		if(baseClass){
			for(var i = 0; i < this.asDocs.length; i++){
				var type;
				var doc = this.asDocs[i];
				if(ref.__TYPE__.indexOf(doc.prefix) == 0){ //Class Type
					type = ref.__TYPE__.replace(/\.|\:{2}/g, "/");
				}else if(baseClass.base.indexOf(doc.prefix) == 0){ //Base Class Type
					type = baseClass.base.replace(/\.|\:{2}/g, "/");
				}
				if(type){
					document.getElementById("elm2").innerHTML = "<A HREF='" + doc.baseURL + 
						type + ".html' TARGET='_blank'>" + baseClass + "</A>";
					FlexDoor.resetRefHistory(tempHistory);
					return;
				}
			}
			document.getElementById("elm2").innerHTML = "<PRE>" + baseClass + "</PRE>";
		}
		FlexDoor.resetRefHistory(tempHistory);
	};

	this.openModalWindow = function(url, width, height, left, top, args){
		try{
			if(window.showModalDialog){
				var position = (left == undefined || top == undefined) ? 'center=1' : 'dialogLeft=' + left + '; dialogTop=' + top;
				window.showModalDialog(url, args, 'dialogWidth:' + width + 'px; dialogHeight:' + height + 'px; status:0; scroll:0;' + position);
			}else{
				var position = (left == undefined || top == undefined) ? 'centerscreen' : 'left=' + left + ', top=' + top;
				netscape.security.PrivilegeManager.enablePrivilege( "UniversalPreferencesRead " +
																	"UniversalBrowserWrite"); 
				window.open(url, 'popupModalWindow' + new Date().getTime(), 'width=' + width + 'px, height=' + height + 'px, chrome, dependent=1, dialog=1, modal=1, resizable=0, scrollbars=0, location=0, status=0, menubar=0, toolbar=0, ' + position);
			}
		}catch(e){
			alert("Warning: Popup modal window has been disabled.\n" + e.message);
		}
	};

	this.pause = function(msec, freeze) {
		if(freeze != true){	
			this.pauseWindowDelay = msec;
			this.openModalWindow(this.pauseUrl, pauseWindowW, pauseWindowH, this.pauseWindowX, this.pauseWindowY, msec);
		}else{
			var startTime = new Date();
			while(new Date() - startTime < msec);
		}
	};

	//private

	var movie = null;
	var movies = [];
	var events = [];
	var objects = {};
	var refHistory;
	var propertyWin;

	var TYPE_IS_ERROR;
	var TYPE_IS_NULL;
	var TYPE_IS_ARRAY;
	var TYPE_IS_XML;
	var TYPE_IS_ANONYMOUS;
	var TYPE_IS_FUNCTION;
	var TYPE_IS_ASINSTANCE;

	//Base class 
	function RefObject(refId, type, value) {
		if(value != undefined)
			this.value = value;
		this.refId = refId;
		this.__TYPE__ = type;
		this.toString = function () { return this.__TYPE__ };
		objects[refId] = this;
	};

	//XML class 
	function XML(xmlValue, refId, type){
		RefObject.call(this, refId, type, xmlValue);
	};
	XML.prototype = new RefObject();
	XML.prototype.constructor = XML;

	function getMovie(id, parent){
		if(movie == null && id){
			if(!movie && parent && parent.contentDocument)
				movie = parent.contentDocument.getElementById(id);
			if(!movie && parent &&  parent.contentWindow && parent.contentWindow.document)
				movie = parent.contentWindow.document.getElementById(id);
			if(!movie && parent && parent.document)
				movie = parent.document.getElementById(id);
			if(!movie && document)
				movie = document.getElementById(id);
			if(movie == null) throw new Error("Cannot find a flash movie id: " + id);
			movies[parent] = movie;
		}
		return movie;
	};

	function call(ref, propName, args, keep_refs){
		if(args && args.length)
			args = new Array().concat.apply(null, args).slice(1);
		else
			args = null;
		var result = getMovie().js_call(getRefId(ref), propName, 
			serialize((args && args.length == 1) ? args[0] : args), keep_refs != false);
		return deserialize(result);
	};

	function getRefId(ref){
		if(ref && typeof(ref) == "object" && !isNaN(ref.refId))
			return ref.refId;
		else
			return serialize(ref);
	};

	function addInfo(ref, key, info){
		ref.toString = function(){
			if(!ref || !ref.__INFO__)
				return null;
			var array = getAPIs(ref);
			array.unshift(ref.__INFO__["{!__BASE__!}"]);
			return array.toString();
		};
		ref.__INFO__['{' + key + '}'] = info;
	};

	function getAPIs(ref){
		if(!ref || !ref.__INFO__)
			return null;
		var array = [];
		for(var key in ref.__INFO__){
			if(key != "{!__BASE__!}")
				array.push(ref.__INFO__[key]);
		}
		return array.sort();
	};

	function serialize(ref){
		if(ref instanceof XML){
			return {refId:ref.refId, value:ref.value, type:TYPE_IS_XML};
		}else if(ref && typeof(ref) == "object" && !isNaN(ref.refId)){
			return {refId:ref.refId, type:TYPE_IS_ASINSTANCE};
		}else if(ref && typeof(ref) == "object" && 
			(ref.nodeType == FlexDoor.XML_ELEMENT_NODE_TYPE ||
			 ref.nodeType == FlexDoor.XML_DOCUMENT_NODE_TYPE)){
			return serialize(new XML(FlexDoor.xmlToString(ref)));
		}else if(ref instanceof Array){
			var array = [];
			for(var i = 0; i < ref.length; i++)
				array[i] = serialize(ref[i]);
			return array;
		}else{
			return ref;
		}
	};

	function deserialize(result) {
		if (result == undefined || result == null) {
			return null;
		} else if (result.type != undefined) {
			if(refHistory instanceof Array && result.refId != undefined)
				refHistory.push(result.refId);
			switch (result.type) {
				case TYPE_IS_ERROR:
					var error = new Error(result.value);
					error.name = "FlashInternalError";
					return error;
				case TYPE_IS_NULL:
					return null;
				case TYPE_IS_ARRAY:
					var array = [];
					for(var i = 0; i < result.value.length; i++)
						array.push(deserialize(result.value[i]));
					array.refId = result.refId;
					array.toString = function(){
						return "JavaScript Array,\nlength=" + this.length + "\n" + this.join("\n");
					};
					array.numChildren = function(){
						return this.length;
					};
					return array;
				case TYPE_IS_XML:
					var root = FlexDoor.stringToXML(result.value);
					var xml = new XML(result.xmlValue, result.refId, root.firstChild.getAttribute("name"));
					initRefInfo(xml, root);
					return xml;
				case TYPE_IS_ANONYMOUS:
					return new RefObject(result.refId, "FlexObject", result.value);
				case TYPE_IS_FUNCTION:
					var root = FlexDoor.stringToXML(result.value);
					var func = new RefObject(result.refId, "Function");
					initRefInfo(func, root);
					return func;
				case TYPE_IS_ASINSTANCE:
					var root = FlexDoor.stringToXML(result.value);
					var clazz = new RefObject(result.refId, root.firstChild.getAttribute("name"));
					initRefInfo(clazz, root);
					return clazz;
			}
		}
		return result;
	}

	function getType(type) {
		if (type.indexOf("::") != -1)
			return type.substring(type.indexOf("::") + 2);
		return type;
	}

	function initRefInfo(ref, root) {
		if(FlexDoor.showRefInfo != true)
			return;
		ref.__INFO__ = new Object();
		var constructor = root.getElementsByTagName("constructor");
		if(constructor && constructor.length) {
			var info = {};
			info.name = ref.__TYPE__;
			info.type = "constructor";
			info.params = [];
			info.toString = function () {
				return "\n" + getType(this.name) + "(" + this.params.join(',') + ")"
			};
			var params = constructor[0].getElementsByTagName("parameter");
			for (var p = 0; p < params.length; p++) {
				var obj = {type:params[p].getAttribute("type"), optional:params[p].getAttribute("optional")};
				obj.toString = function () {
					return this.optional == "false" ? getType(this.type) : getType(this.type) + "=null";
				};
				info.params.push(obj);
			}
			addInfo(ref, ref.__TYPE__, info);
		}
		var accessors = root.getElementsByTagName("accessor");
		for (var i = 0; i < accessors.length; i++) {
			var accessor = accessors[i];
			var accessorName = accessor.getAttribute("name");
			ref[accessorName] = new Function("return FlexDoor.getRef(this, '" + accessorName + "', arguments, true);");
			var info = {};
			info.constant = (accessor.parentNode == root.documentElement);
			info.name = accessorName;
			info.type = accessor.getAttribute("type");
			info.access = accessor.getAttribute("access");
			info.toString = function () {
				return "\n" + (this.constant ? "static " : "") + "get " + this.name + "():" + getType(this.type) +
					(this.access == "readonly" ? "" : "\n" + 
					(this.constant ? "static " : "") + "set " + this.name + "(" + getType(this.type) + "):void")
			};
			addInfo(ref, accessorName, info);
		}
		var constants = root.getElementsByTagName("constant");
		for (var i = 0; i < constants.length; i++) {
			var constant = constants[i];
			var constantName = constant.getAttribute("name");
			ref[constantName] = new Function("return FlexDoor.getRef(this, '" + constantName + "');");
			var info = {};
			info.constant = (constant.parentNode == root.documentElement);
			info.name = constantName;
			info.type = constant.getAttribute("type");
			info.toString = function () {
				return "\n" + 'const ' + (this.constant ? "static " : "") + this.name + ":" + getType(this.type)
			};
			addInfo(ref, constantName, info);
		}
		var variables = root.getElementsByTagName("variable");
		for (var i = 0; i < variables.length; i++) {
			var variable = variables[i];
			var variableName = variable.getAttribute("name");
			ref[variableName] = new Function("return FlexDoor.getRef(this, '" + variableName + "', arguments, true);");
			var info = {};
			info.constant = (variable.parentNode == root.documentElement);
			info.name = variableName;
			info.type = variable.getAttribute("type");
			info.toString = function () {
				return "\n" + 'var ' + (this.constant ? "static " : "") + this.name + ":" + getType(this.type)
			};
			addInfo(ref, variableName, info);
		}
		var methods = root.getElementsByTagName("method");
		for (var i = 0; i < methods.length; i++) {
			var method = methods[i];
			var methodName = method.getAttribute("name");
			if (methodName != "toString") {
				ref[methodName] = new Function("return FlexDoor.getRef(this, '" + methodName + "', arguments, true);");
			}
			var info = {};
			info.constant = (method.parentNode == root.documentElement);
			info.name = methodName;
			info.type = "function";
			info.returnType = method.getAttribute("returnType");
			info.params = [];
			info.toString = function () {
				return "\n" + (this.constant ? "static " : "") + this.name + "(" + this.params.join(',') + "):" + getType(this.returnType)
			};
			var params = method.getElementsByTagName("parameter");
			for (var p = 0; p < params.length; p++) {
				var obj = {type:params[p].getAttribute("type"), optional:params[p].getAttribute("optional")};
				obj.toString = function () {
					return this.optional == "false" ? getType(this.type) : getType(this.type) + "=null";
				};
				info.params.push(obj);
			}
			addInfo(ref, methodName, info);
		}
		var base = root.firstChild.getAttribute("base");
		if(base){
			var info = {};
			info.base = base;
			info.params = [];
			info.toString = function () {
				return "\n" + base + " - " + ref.__TYPE__ + (this.params.length ? "(" + this.params.join(',') + ")" : '');
			};
			if(ref.length){
				for(var i = 0; i < ref.length(); i++)
					info.params.push('arg' + i);
			}
			addInfo(ref, "!__BASE__!", info);
		}
		return ref;
	}
};