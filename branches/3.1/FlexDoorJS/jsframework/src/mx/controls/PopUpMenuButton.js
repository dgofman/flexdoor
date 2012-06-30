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

function mx_controls_PopUpMenuButton(classType) 
{
	/* extendType - mx.controls::PopUpMenuButton */
	UIComponent.call(this, classType);

	this.dataProvider = function(){ /* getter and setter */
		return this.property("dataProvider", arguments);
	};
	
	this.iconField = function(){ /* getter and setter */
		return this.property("iconField", arguments);
	};
	
	this.labelField = function(){ /* getter and setter */
		return this.property("labelField", arguments);
	};
	
	this.showRoot = function(){ /* getter and setter */
		return this.property("showRoot", arguments);
	};
	
	this.getPopUp = function(){
		return this.execute("mx_internal::getPopUp");
	};
	
	this.selectedIndex = function(index){
		var popup = this.getPopUp();
		if(popup != null){
			if(index == undefined)
				return popup.selectedIndex();
			popup.fireEvent($MenuEvent.Create($MenuEvent.ITEM_CLICK, index));
		}
	};
}

mx_controls_PopUpMenuButton.prototype.Import = function(){
	return ["mx.controls::PopUpButton", "mx.events::MenuEvent"];
};
mx_controls_PopUpMenuButton.prototype.Extends = function(){
	mx_controls_PopUpButton.prototype.Extends();
	mx_controls_PopUpMenuButton.prototype = new mx_controls_PopUpButton(mx_controls_PopUpMenuButton);
};
mx_controls_PopUpMenuButton.Get = function(o){
	var ref = this;
	ref = UIComponent.Get(o, mx_controls_PopUpMenuButton);
	return ref;
};

function $PopUpMenuButton() {}
$PopUpMenuButton.Get = mx_controls_PopUpMenuButton.Get;
$PopUpMenuButton.Is = function(target) { return target instanceof mx_controls_PopUpMenuButton; };