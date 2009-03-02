var FlexLoader = new function(){
		
	// -----------------------------------------------------------------------------
	// Globals
	// Major version of Flash required
	var requiredMajorVersion = 9;
	// Minor version of Flash required
	var requiredMinorVersion = 0;
	// Minor version of Flash required
	var requiredRevision = 0;

	var isIE  = (navigator.appVersion.indexOf("MSIE") != -1) ? true : false;
	var isWin = (navigator.appVersion.toLowerCase().indexOf("win") != -1) ? true : false;
	var isOpera = (navigator.userAgent.indexOf("Opera") != -1) ? true : false;
	
	function GetSwfVer(){
		// NS/Opera version >= 3 check for Flash plugin in plugin array
		var flashVer = -1;
		
		if (navigator.plugins != null && navigator.plugins.length > 0) {
			if (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]) {
				var swVer2 = navigator.plugins["Shockwave Flash 2.0"] ? " 2.0" : "";
				var flashDescription = navigator.plugins["Shockwave Flash" + swVer2].description;			
				var descArray = flashDescription.split(" ");
				var tempArrayMajor = descArray[2].split(".");
				var versionMajor = tempArrayMajor[0];
				var versionMinor = tempArrayMajor[1];
				if ( descArray[3] != "" ) {
					tempArrayMinor = descArray[3].split("r");
				} else {
					tempArrayMinor = descArray[4].split("r");
				}
				var versionRevision = tempArrayMinor[1] > 0 ? tempArrayMinor[1] : 0;
				var flashVer = versionMajor + "." + versionMinor + "." + versionRevision;
			}
		}
		// MSN/WebTV 2.6 supports Flash 4
		else if (navigator.userAgent.toLowerCase().indexOf("webtv/2.6") != -1) flashVer = 4;
		// WebTV 2.5 supports Flash 3
		else if (navigator.userAgent.toLowerCase().indexOf("webtv/2.5") != -1) flashVer = 3;
		// older WebTV supports Flash 2
		else if (navigator.userAgent.toLowerCase().indexOf("webtv") != -1) flashVer = 2;
		else if ( isIE && isWin && !isOpera ) {
			try {
				// version will be set for 7.X or greater players
				var axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
				flashVer = axo.GetVariable("$version");
			} catch (e) {
				try {
					// version will be set for 6.X players only
					var axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
					
					// installed player is some revision of 6.0
					// GetVariable("$version") crashes for versions 6.0.22 through 6.0.29,
					// so we have to be careful. 
					
					// default to the first public version
					flashVer = "WIN 6,0,21,0";
	
					// throws if AllowScripAccess does not exist (introduced in 6.0r47)		
					axo.AllowScriptAccess = "always";
	
					// safe to call for 6.0r47 or greater
					flashVer = axo.GetVariable("$version");
				} catch (e) {
					try {
						// version will be set for 4.X or 5.X player
						var axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
						flashVer = axo.GetVariable("$version");
					} catch (e) {
						try {
							// version will be set for 3.X player
							var axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
							flashVer = "WIN 3,0,18,0";
						} catch (e) {
							try {
								// version will be set for 2.X player
								var axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
								flashVer = "WIN 2,0,0,11";
							} catch (e) {}
						}
					}
				}
			}
		}
		return flashVer;
	};
	
	function DetectFlashVer(reqMajorVer, reqMinorVer, reqRevision)
	{
		versionStr = GetSwfVer();
		if (versionStr == -1 ) {
			return false;
		} else if (versionStr != 0) {
			if(isIE && isWin && !isOpera) {
				// Given "WIN 2,0,0,11"
				tempArray         = versionStr.split(" "); 	// ["WIN", "2,0,0,11"]
				tempString        = tempArray[1];			// "2,0,0,11"
				versionArray      = tempString.split(",");	// ['2', '0', '0', '11']
			} else {
				versionArray      = versionStr.split(".");
			}
			var versionMajor      = versionArray[0];
			var versionMinor      = versionArray[1];
			var versionRevision   = versionArray[2];
	
			// is the major.revision >= requested major.revision AND the minor version >= requested minor
			if (versionMajor > parseFloat(reqMajorVer)) {
				return true;
			} else if (versionMajor == parseFloat(reqMajorVer)) {
				if (versionMinor > parseFloat(reqMinorVer))
					return true;
				else if (versionMinor == parseFloat(reqMinorVer)) {
					if (versionRevision >= parseFloat(reqRevision))
						return true;
				}
			}
			return false;
		}
	};
		
	function flashParamsToString(id, flashParams){
		var str = 'width="100%" height="100%" ';
		if (isIE && isWin && !isOpera)
		{
			str = '<object id="' + id + '" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ' + str;
			for (var i in flashParams)
				str += '><param name="' + i + '" value="' + flashParams[i] + '" /';
			str += '></object>';
		} else {
			str = '<embed id="' + id + '" name="' + id + '" pluginspage="http://www.adobe.com/go/getflashplayer" ' + str;
			for (var i in flashParams)
				str += i + '="' + flashParams[i] + '" ';
			str += '> </embed>';
		}
		return str;
	};
	
	this.createSWF = function(divId, swfId, swf, uri, flashvars, baseURI)
	{
		// Version check based upon the values defined in globals
		var hasRequestedVersion = DetectFlashVer(requiredMajorVersion, requiredMinorVersion, requiredRevision);

		var flashParams = {
			allowFullScreen:true,
			align:"middle",
			quality:"high",
			wmode:"transparent",
			allowScriptAccess:"always",
			type:"application/x-shockwave-flash"
		};
		
		if(flashvars)
			flashParams.flashvars = flashvars;
		if(baseURI)
			flashParams.base = baseURI;
					
		if (hasRequestedVersion) {
			// if we've detected an acceptable version
			// embed the Flash Content SWF when all tests are passed
			flashParams.src = uri + swf;
			output = flashParamsToString(swfId, flashParams);
		} else {  // flash is too old or we can't detect the plugin
			output = 'Alternate HTML content should be placed here. '
			+ 'This content requires the Adobe Flash Player. '
			+ '<a href=http://www.adobe.com/go/getflash/>Get Flash</a>';
		}

		var div = document.getElementById(divId);
		if(div){
			div.innerHTML = output;
		}else{
			document.write(output);
		}
	};
};
