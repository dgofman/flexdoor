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

function ComboBox(classType, extendType) 
{
	UIComponent.call(this, classType, extendType);
	this.dropdown = new List(List, "List");

	this.open = function(){

	};

	this.getSelectedIndex = function(){
		return this.dropdown.getSelectedIndex();
	};
	this.setSelectedIndex = function(value){
		this.dropdown.setSelectedIndex(value);
	};

	this.getSelectedItem = function(){
		return this.dropdown.getSelectedItem();
	};
	this.setSelectedItem = function(value){
		this.dropdown.setSelectedItem(value);
	};
}

ComboBox.prototype.Import = function(){
	return ["controls::List"];
};
ComboBox.prototype.Extends = function(){
	List.prototype.Extends();
	ComboBox.prototype = new List(ComboBox);
};
ComboBox.prototype.Initialize = function(object, parent){
	UIComponent.prototype.Initialize.call(this, object, parent);
	UIComponent.prototype.Initialize.call(this.dropdown, object, this);
};
ComboBox.Get = function(o){ return UIComponent.Get(o); };