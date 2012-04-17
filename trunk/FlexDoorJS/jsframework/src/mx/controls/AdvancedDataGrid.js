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

function mx_controls_AdvancedDataGrid(classType, extendType) 
{
	/* extendType - mx.controls::AdvancedDataGrid */
	UIComponent.call(this, classType, extendType);
	
	this.expandItem = function(item, open, animate, dispatchEvent){
		if(open == undefined) open = true;
		if(animate == undefined) animate = false;
		if(dispatchEvent == undefined) dispatchEvent = false;
		this.execute("expandItem", item, open, animate, dispatchEvent);
	};
}

mx_controls_AdvancedDataGrid.prototype.Import = function(){
	return ["mx.controls::DataGrid"];
};
mx_controls_AdvancedDataGrid.prototype.Extends = function(){
	mx_controls_DataGrid.prototype.Extends();
	mx_controls_AdvancedDataGrid.prototype = new mx_controls_DataGrid(mx_controls_AdvancedDataGrid);
};
mx_controls_AdvancedDataGrid.Get = function(o){
	var ref = this;
	ref = UIComponent.Get(o, mx_controls_AdvancedDataGrid);
	return ref;
};

function $AdvancedDataGrid() {}
$AdvancedDataGrid.Get = mx_controls_AdvancedDataGrid.Get;
$AdvancedDataGrid.Is = function(target) { return target instanceof mx_controls_AdvancedDataGrid; };