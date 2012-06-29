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


/**
 * The SharedObject class is used to read and store limited amounts of data on a user's computer or on a server. 
 * Shared objects offer real-time data sharing between multiple client SWF files and objects that are persistent 
 * on the local computer or remote server. Local shared objects are similar to browser cookies and remote shared 
 * objects are similar to real-time data transfer devices. To use remote shared objects, you need Adobe Flash Media Server. 
 * 
 * 
 * The following code creates (and on subsequent executions, retrieves) a SharedObject object using an id with the value
 *  of hostName. A property named username is added to the data property of the SharedObject object. 
 *  The flush() method is then called, followed by a check to see if the string pending, or 
 *  a boolean value of true or false was returned. One should be aware that all open 
 *  SharedObject instances will automatically be flushed whenever the current instance of the Flash Player is closed. 
 * 
 * Example usage:
 *
 *    @example
 *       var hostName = "yourDomain";
 *       var username = "yourUsername";
 *
 *       var so = $SharedObject.getLocal(hostName);
 *       so.setData("username", username, false);
 *       var flushResult = so.flush();
 *       alert("flushResult: " + flushResult);
 *       alert(so.getData("username")); // yourUsername
 *
 * The following code creates a SharedObject object using an id "thehobbit". 
 * A property named username is added to the data property of the SharedObject object. 
 * The size property is then traced, which returns the value indicated. 
 * 
 * Example usage:
 *
 *    @example
 *       var so = $SharedObject.getLocal("thehobbit");
 *       so.setData("username", "bilbobaggins");
 *       alert(so.size()); // 55
 *
 *       var so = $SharedObject.getLocal("thehobbit");
 *       var data = so.data();
 *       for(var key in data)
 *          System.info(key + "=" + data[key]);
*/

function flash_net_SharedObject(classType) 
{
	/* extendType - flash.net::SharedObject */
	EventDispatcher.call(this, classType);

	//Public Properties
	
	/**
	 * @property {Object} client
	 * 
	 * Indicates the object on which callback methods are invoked. 
	 * The default object is this. You can set the client property to another object, 
	 * and callback methods will be invoked on that other object.
	 * @readonly 
	 */
	this.client = function(){
		return this.getter("client");
	};

	/**
	 * @property {Object} data
	 *
	 * The collection of attributes assigned to the data property of the object; 
	 * these attributes can be shared and stored. Each attribute can be an object of any 
	 * ActionScript or JavaScript type — Array, Number, Boolean, ByteArray, XML, and so on. 
	 * For example, the following lines assign values to various aspects of a shared object: 
	 * @readonly
	 */
	this.data = function(){
		return getDataRef(this, false);
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
	this.getData = function(key){
		return this.refValue(getDataRef(this, true), null, key);
	};

	this.setData = function(key, value, autoFlush){
		this.refValue(getDataRef(this, true), null, key);
		if(autoFlush != false) this.flush();
	};

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

	//Private function
	function getDataRef(instance, keepRef){
		if(!isNaN(instance.dataRef))
			System.releaseIds([instance.dataRef]);
		return instance.dataRef = System.getter(instance, "data", keepRef);
	}
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