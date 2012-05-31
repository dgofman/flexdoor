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

function mx_controls_ComboBase(classType, extendType) 
{
	/* extendType - mx.controls::ComboBase */
	UIComponent.call(this, classType, extendType);

	this.dataProvider = function(){ /* getter and setter */
		return this.property("dataProvider", arguments);
	};

	this.editable = function(){ /* getter and setter */
		return this.property("editable", arguments);
	};

	this.enableIME = function(){
		return this.getter("enableIME");
	};

	this.imeMode = function(){ /* getter and setter */
		return this.property("imeMode", arguments);
	};

	this.restrict = function(){ /* getter and setter */
		return this.property("restrict", arguments);
	};

	this.selectedIndex = function(){ /* getter and setter */
		if(arguments.length == 0){
			return this.getter("selectedIndex");
		}else{
			this.open();
			while(this.isOpen() == false){}
			this.dropdown().selectedIndex(arguments[0]);
			this.close();
		}
	};

	this.selectedItem = function(){ /* getter and setter */
		if(arguments.length == 0){
			return this.getter("selectedItem");
		}else{
			this.open();
			while(this.isOpen() == false){}
			this.dropdown().selectedItem(arguments[0]);
			if(autoClose != false) this.close();
		}
	};

	this.text = function(){ /* getter and setter */
		return this.property("text", arguments);
	};

	this.value = function(){
		return this.getter("value");
	};
}

mx_controls_ComboBase.prototype.Extends = function(){
	mx_controls_ComboBase.prototype = new UIComponent(mx_controls_Button);
};
mx_controls_ComboBase.Get = function(o){
	var ref = this;
	ref = UIComponent.Get(o, mx_controls_ComboBase);
	return ref;
};

function $ComboBase() {}
$ComboBase.Get = mx_controls_ComboBase.Get;
$ComboBase.Is = function(target) { return target instanceof mx_controls_ComboBase; };