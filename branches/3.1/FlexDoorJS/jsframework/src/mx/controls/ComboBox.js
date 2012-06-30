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

function mx_controls_ComboBox(classType) 
{
	/* extendType - mx.controls::ComboBox */
	UIComponent.call(this, classType);

	this.open = function(){
		this.execute("open");
	};

	this.close = function(){
		this.execute("close");
	};

	this.isOpen = function(){
		return this.getter("isShowingDropdown");
	};

	this.dropdown = function(){
		return this.getter("dropdown");
	};
}

mx_controls_ComboBox.prototype.Import = function(){
	return ["mx.controls::ComboBase"];
};
mx_controls_ComboBox.prototype.Extends = function(){
	mx_controls_ComboBase.prototype.Extends();
	mx_controls_ComboBox.prototype = new mx_controls_ComboBase(mx_controls_ComboBox);
};
mx_controls_ComboBox.Get = function(o){
	var ref = this;
	ref = UIComponent.Get(o, mx_controls_ComboBox);
	return ref;
};

function $ComboBox() {}
$ComboBox.Get = mx_controls_ComboBox.Get;
$ComboBox.Is = function(target) { return target instanceof mx_controls_ComboBox; };