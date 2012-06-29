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


function flash_net_SharedObject() 
{
	/* extendType - flash.net::SharedObject */
	EventDispatcher.call(this, classType);

	this.clear = function(){
		System.execute(this, "clear");
	};

	this.close = function(){
		System.execute(this, "close");
	};

	this.connect = function(myConnection, params){
		System.execute(this, "connect", [myConnection, params]);
	};

	this.flush = function(minDiskSpace){
		if(minDiskSpace == undefined) minDiskSpace = 0;
		return System.execute(this, "flush", [minDiskSpace]);
	};

	this.send = function(){
		System.execute(this, "send", System.getParams(arguments, 0, true));
	};

	this.setDirty = function(propertyName){
		System.execute(this, "setDirty", [propertyName]);
	};

	this.setProperty = function(propertyName, value){
		System.execute(this, "setProperty", [propertyName, value]);
	};
}

flash_net_SharedObject.prototype = new EventDispatcher(flash_net_SharedObject);

flash_net_SharedObject.Get = function(o){
	var ref = this;
	ref = UIComponent.Get(o, flash_net_SharedObject);
	return ref;
};

function $SharedObject(){}
$SharedObject.Get = flash_events_Event.Get;
$SharedObject.Is = function(target) { return target instanceof flash_net_SharedObject; };

$SharedObject.getLocal = function(name, localPath, secure){
	return System.execute(this, "getLocal", [name, localPath, secure]);
};

$SharedObject.getRemote = function(name, remotePath, persistence, secure){
	return System.execute(this, "getLocal", [name, remotePath, persistence, secure]);
};