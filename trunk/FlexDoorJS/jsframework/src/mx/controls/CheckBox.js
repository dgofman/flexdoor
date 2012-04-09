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

function mx_controls_CheckBox(classType, extendType) 
{
	/* extendType - mx.controls::CheckBox */
	UIComponent.call(this, classType, extendType);

	this.selected= function(value){
		return this.property("selected", value);
	};
}

mx_controls_CheckBox.prototype.Import = function(){
	return ["mx.controls::Button"];
};
mx_controls_CheckBox.prototype.Extends = function(){
	mx_controls_Button.prototype.Extends();
	mx_controls_CheckBox.prototype = new mx_controls_Button(mx_controls_CheckBox);
};
mx_controls_CheckBox.Get = function(o){
	var ref = this;
	ref = UIComponent.Get(o, mx_controls_CheckBox);
	return ref;
};

function $CheckBox() {}
$CheckBox.Get = mx_controls_CheckBox.Get;