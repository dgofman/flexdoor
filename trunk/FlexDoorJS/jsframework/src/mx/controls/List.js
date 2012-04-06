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

function mx_controls_List(classType, extendType) 
{
	UIComponent.call(this, classType, extendType);

	this.getSelectedIndex = function(){
		return this.getter("selectedIndex");
	};
	this.setSelectedIndex = function(value){
		this.setter("selectedIndex", value);
	};

	this.getSelectedItem = function(){
		return this.getter("selectedItem");
	};
	this.setSelectedItem = function(value){
		this.setter("selectedItem", value);
	};

	this.getDataProvider = function(){
		return this.getter("dataProvider");
	};
	this.setDataProvider = function(value){
		this.setter("dataProvider", value);
	};
}

mx_controls_List.prototype.Extends = function(){
	mx_controls_List.prototype = new UIComponent(mx_controls_List);
};
mx_controls_List.Get = function(o){
	var ref = this;
	ref = UIComponent.Get(o, mx_controls_List);
	return ref;
};

function $List() {}
$List.Get = mx_controls_List.Get;