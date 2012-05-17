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

function fd_Function(object) 
{
	UIComponent.call(this, fd_Function, "Function");
	this._refId = object.refId;
	this._isEventListener = false;

	this.Initialize = function(classType, funtionName){
		this.classType = classType;
		this.funtionName = funtionName;
	};

	this.destroy = function(){
		System.releaseIds([this._refId]);
		if( this.classType instanceof Function && 
			this.classType[this.funtionName] instanceof Function){
			this.classType[this.funtionName] = null;
		}
	};
}
fd_Function.prototype = new Object();
fd_Function.Get = function(o){
	var ref = this;
	ref = UIComponent.Get(o, fd_Function);
	return ref;
};

function $Function() {}
$Function.Get = fd_Function.Get;