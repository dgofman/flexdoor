var Utils = new function(){

	var pauseWindowW = 255;
	var pauseWindowH = 105;

	this.pauseUrl     = 'Pause.html';
	this.pauseWindowX = window.screen.width  - pauseWindowW;
	this.pauseWindowY = window.screen.height - pauseWindowH;
	this.pauseWindowDelay;

	this.totalErrors = 0;
	this.logWindow;
	this.loggerID;
	this.flexDoor = FlexDoor;

	this.loadXML = function(file){
		var xmlDoc;
		if (window.ActiveXObject){
			xmlDoc = new ActiveXObject("MSXML2.DOMDocument");
		}else if (document.implementation && document.implementation.createDocument){
			xmlDoc = document.implementation.createDocument("", "", null);
		}
		if(xmlDoc){
			xmlDoc.async = false;
			xmlDoc.load(file);
		}
		return xmlDoc;
	};

	this.delegate = function(target, func){
		var params = [];
		if(arguments.length > 2){
			for(var i = 2; i < arguments.length; i++)
				params.push(arguments[i]);
		}
		return function() { return func.apply(target, params); }
	};

	this.enterFrame = function(ref, funcHandlerRef, scope){
		var onEnterFrameHandler = function(event){
			try{
				if(funcHandlerRef.call(scope, null) == true){
					FlexDoor.removeEventListener("enterFrame", onEnterFrameHandler, ref);
					FlexDoor.release(event.refId);
				}
			}catch(e){
			}
		};
		FlexDoor.addEventListener("enterFrame", onEnterFrameHandler, ref);
	};

	this.pause = function(msec, freeze) {
		if(freeze != true){	
			this.pauseWindowDelay = msec;
			this.openModalWindow(this.pauseUrl, pauseWindowW, pauseWindowH, this.pauseWindowX, this.pauseWindowY);
		}else{
			var startTime = new Date();
			while(new Date() - startTime < msec);
		}
	};

	this.getAttribute = function(node, name){
		if(node){
			var value = node.getAttribute(name);
			//info(name + "="+ value);
			return value;
		}else{
			warn("The parent node is undefined: " + name);
		}
	};

	this.getElementsByTagName = function(node, name){
		if(node){
			var value = node.getElementsByTagName(name);
			if(value && value.length){
				return value[0];
			}else{
				warn("The child node is undefined: " + name);
			}
		}
	};

	this.assert = function(msg, param1, param2){
		if(param2 == undefined && !param1){
			this.error(msg + ' ['+ param1 + ']');
		}else if(param2 != undefined && param1 != param2){
			this.error(msg + ' ['+ param1 + ' != ' + param2 + ']');
		}else{
			return function(){};
		}
		return null;
	};

	this.formatTime = function(ms){
		function pad(num){ return num > 9 ? num : '0' + num; }
		return pad(Math.floor(ms / 3600)) + ":" +
			   pad(Math.floor((ms % 3600) / 60)) + ":" +
			   pad(Math.floor((ms % 3600) % 60));
	};

	this.begin = function(o){
		this.trace(o, 'group');
	};
	this.end = function(o){
		this.trace(o, 'log');
		try{console.groupEnd();
		}catch(e){}
		this.writeLog(' ');/*empty line*/
		this.winOnTop();
	};
	this.log = function(o){
		return this.trace(o, 'log');
	};
	this.info = function(o){
		return this.trace(o, 'info');
	};
	this.warn = function(o){
		return this.trace(o, 'warn');
	};
	this.error = function(o){
		if(o instanceof Error){
			var error = [o.name + ": " + o.message];
			if(o.lineNumber)error.push(o.lineNumber);
			if(o.fileName)error.push(o.fileName);
			return this.trace(error.join("\n"), 'error');
		}else{
			return this.trace(o, 'error');
		}
		this.totalErrors++;
		this.winOnTop();
	};
	this.trace = function(o, key){
		this.writeLog(o, key);
		if(this.loggerID != undefined){
			try{
				var logger = (document.all ? window[this.loggerID] : document[this.loggerID]);
				logger.js_trace(key, o);
				return o;
			}catch(e){}
		}
		try{console[key](o);
		}catch(e){}
		return o;
	};

	this.writeLog = function(o, key){
		if(!this.logWindow || this.logWindow.closed){
			this.logWindow = this.openWindow("", 500, 150, 1);
			if(this.logWindow  == null){ 
				this.writeLog = null;
				return false;
			}
			this.logWindow.document.write("<HTML><HEAD><TITLE>FlexDoor Log Window</TITLE>\n");
			this.logWindow.document.write("<SCRIPT>\nfunction addLog(key, o){ \n" +
					"document.getElementById('pre').appendChild(document.createTextNode(key ? '(' + key + ') ' + o : o));\n" +
					"document.getElementById('pre').appendChild(document.createElement('BR'));\n" +
					"window.scrollTo(0, document.body.scrollHeight); \n}\n</SCRIPT>\n</HEAD>\n");
			this.logWindow.document.write("<BODY><PRE id='pre'></PRE></BODY>\n");
			this.logWindow.document.close();
		}
		try{
			if(key == "html")
				this.logWindow.document.body.innerHTML = o;
			else
				this.logWindow.addLog(key, String(o).split('\n').join('\r\n'));
			return true;
		}catch(e){}
		return false;
	};
	
	this.openModalWindow = function(url, width, height, left, top){
		try{
			if(document.all){
				var position = (left == undefined || top == undefined) ? 'center=1' : 'dialogLeft=' + left + '; dialogTop=' + top;
				window.showModalDialog(url, this, 'dialogWidth:' + width + 'px; dialogHeight:' + height + 'px; status:0; scroll:0;' + position);
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
	
	this.openWindow = function(url, width, height, flag){
		var win = window.open(url, "popupWindow", "left=0,top=0,width=" + width + ",height=" + height + "," + 
								"scrollbars=" + flag + ",status=" + flag + ",resizable=" + flag);
		if(!win || win.closed){ 
			alert("Your popup blocker seems to be blocking this popup window.\n" +
				  "Please turn off pop-up blocker for this site permanently.");
			return null;
		}
		return win;
	};

	this.winOnTop = function(){
		try{
			if(this.logWindow && !this.logWindow.closed){
				var html = this.logWindow.document.body.innerHTML;
				this.logWindow.close();
				this.writeLog(html, "html");
				this.logWindow.scrollTo(0, this.logWindow.document.body.scrollHeight); 
			}
		}catch(e){}
	};

	this.memoryObjects = function(){
		var flashIds = FlexDoor.swfObjectIds();
		var jsIds = FlexDoor.jsObjectIds();
		var win = this.openWindow("", 500, 350, 1);
		if(win == null) return;	
		win.document.write("<HTML><HEAD><TITLE>FlexDoor Memory Objects</TITLE>\n");
		win.document.write("<BODY>\n");
		win.document.write("<TABLE border='1' cellpadding='5'><TR><TH>ID</TH><TH width='100%'>TYPE</TH></TR>\n");
		for(var i = 0; i < flashIds.length; i++){
			var id = flashIds[i];
			var refObject = jsIds[id];
			if(refObject && refObject.refId == id){
				win.document.write("<TR><TD align='center'>" + id + "</TD><TD>" + refObject.__TYPE__ + "</TD></TR>\n");
			}
		}
		win.document.write("</TABLE></BODY>");
		win.document.close();
	};
}