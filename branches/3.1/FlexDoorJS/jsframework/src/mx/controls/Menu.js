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

function mx_controls_Menu(classType) 
{
	/* extendType - mx.controls::Menu */
	UIComponent.call(this, classType);
	
	this.parentMenu = function(){/* getter and setter */
		return this.property("parentMenu", arguments);
	};
	
	this.dataDescriptor = function(){/* getter and setter */
		return this.property("dataDescriptor", arguments);
	};
	
	this.showRoot = function(){/* getter and setter */
		return this.property("showRoot", arguments);
	};
	
	this.hasRoot = function(){
		return this.getter("hasRoot");
	};
	
	this.subMenus = function(){
		return this.getter("subMenus");
	};

	this.sourceMenuBar = function(){
		return this.getter("sourceMenuBar");
	};

	this.getRootMenu = function(){
		return this.execute("mx_internal::getRootMenu");
	};
	
	this.selectedIndex = function(){  /* getter and setter */
		return this.property("selectedIndex", arguments, function(value){
			this.fireEvent($ListEvent.Create($ListEvent.ITEM_CLICK, value, 0, this.indexToItemRenderer(value)));
		});
	};
}

mx_controls_Menu.prototype.Import = function(){
	return ["mx.controls::List"];
};
mx_controls_Menu.prototype.Extends = function(){
	mx_controls_List.prototype.Extends();
	mx_controls_Menu.prototype = new mx_controls_List(mx_controls_Menu);
};
mx_controls_Menu.Get = function(o){
	var ref = this;
	ref = UIComponent.Get(o, mx_controls_Menu);
	return ref;
};

function $Menu() {}
$Menu.Get = mx_controls_Menu.Get;
$Menu.Is = function(target) { return target instanceof mx_controls_Menu; };