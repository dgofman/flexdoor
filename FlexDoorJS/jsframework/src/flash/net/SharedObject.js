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
 * The following code assign values to various aspects of a shared object.
 * The for..in loop iterates through the all properties of the data property.
 *
 * Example usage:
 *
 *    @example
 *       var so = $SharedObject.getLocal("localdata");
 *       so.setData("username", "root");
 *       so.setData("password", "admin");
 *       var data = so.data();
 *       for(var name in data){
 *          System.info(key + "=" + data[name]);
 *       }
 *
 * The following code creates (and on subsequent executions, retrieves) a SharedObject object using 
 * an id with the value of hostName. A property named username is added to the data property of the SharedObject object.
 * The clear() method is finally called, which wipes out all information that was added to the data object 
 * (in this case was a single property named username). 
 *
 * Example usage:
 *
 *    @example
 *       var hostName = "yourDomain";
 *       var username = "yourUsername";
 *
 *       var so = $SharedObject.getLocal(hostName);
 *       so.setData("username", username);
 *       alert("set: " + so.getData("username")); // yourUsername
 *
 *       so.clear();
 *       alert("cleared: " + so.getData("username")); // null
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
	 */
	this.client = function(){
		return this.property("client", arguments);
	};

	/**
	 * @property {Object} data
	 *
	 * The collection of attributes assigned to the data property of the object; 
	 * these attributes can be shared and stored. Each attribute can be an object of any 
	 * ActionScript or JavaScript type — Array, Number, Boolean, ByteArray, XML, and so on. 
	 * @readonly 
	 */
	this.data = function(){
		return getDataRef(this, false);
	};

	/**
	 * @property {uint} defaultObjectEncoding
	 *
	 * The default value of SharedObject.defaultObjectEncoding is set to use the ActionScript 3.0 format, AMF3.
	 * If you need to write local shared objects that ActionScript 2.0 or 1.0 SWF files can read, set 
	 * SharedObject.defaultObjectEncoding to use the ActionScript 1.0 or ActionScript 2.0 format, 
	 * flash.net.ObjectEncoding.AMF0, at the beginning of your script, before you create any local shared objects. 
	 * All local shared objects created thereafter will use AMF0 encoding and can interact with older content. 
	 * You cannot change the objectEncoding value of existing local shared objects by setting 
	 * SharedObject.defaultObjectEncoding after the local shared objects have been created.
	 */
	this.defaultObjectEncoding = function(){
		return this.property("defaultObjectEncoding", arguments);
	};

	/**
	 * @property {Number} fps
	 *
	 * Specifies the number of times per second that a client's changes to a shared object are sent to the server.
	 * Use this method when you want to control the amount of traffic between the client and the server. 
	 * For example, if the connection between the client and server is relatively slow, you may want to set fps 
	 * to a relatively low value. Conversely, if the client is connected to a multiuser application in which 
	 * timing is important, you may want to set fps to a relatively high value.
	 * @writeonly
	 */
	this.fps = function(value){
		return this.setter("fps", value);
	};

	/**
	 * @property {uint} objectEncoding
	 *
	 * Specifies the number of times per second that a client's changes to a shared object are sent to the server.
	 * Use this method when you want to control the amount of traffic between the client and the server. 
	 * For example, if the connection between the client and server is relatively slow, you may want to set fps 
	 * to a relatively low value. Conversely, if the client is connected to a multiuser application in which 
	 * timing is important, you may want to set fps to a relatively high value.
	 */
	this.objectEncoding = function(){
		return this.property("objectEncoding", arguments);
	};

	/**
	 * @property {uint} size
	 *
	 * The current size of the shared object, in bytes.
	 * Flash calculates the size of a shared object by stepping through all of its data properties; 
	 * the more data properties the object has, the longer it takes to estimate its size.
	 * Estimating object size can take significant processing time, so you may want to avoid using this 
	 * method unless you have a specific need for it.
	 * @readonly 
	 */
	this.size = function(){
		return this.getter("size");
	};

	//Public Methods
	
	/**
     * This method returns an data property
     * 
     * @alias #data
     * @param {String} key The property name.
     * @return {Object} The collection of attributes assigned to the data property of the object
     */
	this.getData = function(key){
		return this.refValue(getDataRef(this, true), null, key);
	};

	/**
     * This method returns an data property
     *
     * @alias #data
     * @param {String} key The property name.
     * @return {Object} The collection of attributes assigned to the data property of the object
     */
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


	/**
     * This method returns an data property {@link #data}
     *
     * @param {NetConnection} myConnection The property name.
     * @param {String} params The property name.
     */
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