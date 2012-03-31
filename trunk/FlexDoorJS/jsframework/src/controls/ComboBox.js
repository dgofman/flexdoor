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

function ComboBox(classType, className, extendType) 
{
	UIComponent.call(this, classType, className, extendType);
	this.dropdown = new List(List, "org.flexdoor.controls::List");
}

ComboBox.prototype.initialize = function(object, parent){
	UIComponent.prototype.initialize.call(this, object, parent);
	UIComponent.prototype.initialize.call(this.dropdown, object, parent);
};

ComboBox.prototype = new UIComponent(ComboBox, "org.flexdoor.controls::ComboBox");
ComboBox.prototype.Get = function(){ return this; };
ComboBox.prototype.required = function(){
	return ["org.flexdoor.controls::List"];
};

//Class Functions
ComboBox.prototype.open = function(){
	this.app.doFlexUiEvent('Open', this.monkeyId, 'automationName', [null], '', '', '10', '1000', false);
};

ComboBox.prototype.selectedItem = function(value){
	this.dropdown.selectedItem(value);
};