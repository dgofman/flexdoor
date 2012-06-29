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

	//Public Properties
	this.client = function(){
		return this.getter("client");
	};

	this.data = function(){ /* getter and setter */
		return this.property("data", arguments);
	};

	this.defaultObjectEncoding = function(){
		return this.getter("defaultObjectEncoding");
	};

	this.fps = function(){
		return this.getter("fps");
	};

	this.objectEncoding = function(){
		return this.getter("objectEncoding");
	};

	this.size = function(){
		return this.getter("size");
	};

	//Public Methods
	this.clear = function(){
		this.execute("clear");
	};

	this.close = function(){
		this.execute("close");
	};

	this.connect = function(myConnection, params){
		this.execute("connect", myConnection, params);
	};

	this.flush = function(minDiskSpace){
		if(minDiskSpace == undefined) minDiskSpace = 0;
		return this.execute("flush", minDiskSpace);
	};

	this.send = function(){
		this.execute("send", System.getParams(arguments, 0, false));
	};

	this.setDirty = function(propertyName){
		this.execute("setDirty", propertyName);
	};

	this.setProperty = function(propertyName, value){
		this.execute("setProperty", propertyName, value);
	};
}

flash_net_SharedObject.prototype = new EventDispatcher(flash_net_SharedObject);

flash_net_SharedObject.getLocal = function(name, localPath, secure){
	var ref = this;
	var clazz = System.getClass("flash.net::SharedObject");
	ref = System.execute(clazz, "getLocal", [name, localPath, secure]);
	return ref;
};

flash_net_SharedObject.getRemote = function(name, remotePath, persistence, secure){
	var ref = this;
	var clazz = System.getClass("flash.net::SharedObject");
	ref = System.execute(clazz, "getRemote", [name, remotePath, persistence, secure]);
	return ref;
};

function $SharedObject(){}
$SharedObject.getLocal = flash_net_SharedObject.getLocal;
$SharedObject.getRemote = flash_net_SharedObject.getRemote;