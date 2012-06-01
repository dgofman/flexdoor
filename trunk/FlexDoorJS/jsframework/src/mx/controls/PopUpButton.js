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

function mx_controls_PopUpButton(classType) 
{
	/* extendType - mx.controls::PopUpButton */
	UIComponent.call(this, classType);

	this.popUp = function(){/* getter and setter */
		return this.property("popUp", arguments);
	};
	
	this.isShowingPopUp = function(){
		return this.getter("isShowingPopUp");
	};
	
	this.open = function(){
		this.execute("open");
	};
	
	this.close = function(){
		this.execute("close");
	};
}

mx_controls_PopUpButton.prototype.Import = function(){
	return ["mx.controls::Button"];
};
mx_controls_PopUpButton.prototype.Extends = function(){
	mx_controls_Button.prototype.Extends();
	mx_controls_PopUpButton.prototype = new mx_controls_Button(mx_controls_PopUpButton);
};
mx_controls_PopUpButton.Get = function(o){
	var ref = this;
	ref = UIComponent.Get(o, mx_controls_PopUpButton);
	return ref;
};

function $PopUpButton() {}
$PopUpButton.Get = mx_controls_PopUpButton.Get;
$PopUpButton.Is = function(target) { return target instanceof mx_controls_PopUpButton; };