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

function Application(classType)
{
	UIComponent.call(this, classType);
	Application.application = this;

	this.pageTitle = function(){ /* public var */
		return this.property("pageTitle", arguments);
	};
	
	this.parameters = function(){
		return this.getter("parameters");
	};
	
	this.preloader = function(){ /* public var */
		return this.property("preloader", arguments);
	};
	
	this.preloaderChromeColor = function(){ /* public var */
		return this.property("preloaderChromeColor", arguments);
	};
	
	this.resetHistory = function(){ /* public var */
		return this.property("resetHistory", arguments);
	};
	
	this.scriptRecursionLimit = function(){ /* public var */
		return this.property("scriptRecursionLimit", arguments);
	};
	
	this.scriptTimeLimit = function(){ /* public var */
		return this.property("scriptTimeLimit", arguments);
	};
	
	this.usePreloader = function(){ /* public var */
		return this.property("usePreloader", arguments);
	};
	
	this.viewSourceURL = function() { /* getter and setter */
		return this.property("viewSourceURL", arguments);
	};
	
	//API's
	this.getSystemManager = function(){
		return this.systemManager;
	};

	this.getPopupWindow = function(extendType, index, visibleOnly){
		return this.systemManager.getChildByType(extendType, index, visibleOnly);
	};
}

Application.prototype.Import = function(){
	return ["mx.core::Container"];
};
Application.prototype.Extends = function(){
	Container.prototype.Extends();
	Application.prototype = new Container(Application);
};
Application.Get = function(o){
	var ref = this;
	ref = UIComponent.Get(o, Application);
	return ref;
};
Application.Is = function(target) { return target instanceof Application; };

function mx_core_Application(){};