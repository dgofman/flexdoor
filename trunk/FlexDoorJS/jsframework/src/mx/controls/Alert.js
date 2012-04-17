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

function mx_controls_Alert(classType, extendType) 
{
	/* extendType - mx.controls::Alert */
	UIComponent.call(this, classType, extendType);
	
	this.buttonOK = function(){
		return this.alertForm.getChildByName("OK");
	};
	this.buttonCANCEL = function(){
		return this.alertForm.getChildByName("CANCEL");
	};
	this.buttonYES = function(){
		return this.alertForm.getChildByName("YES");
	};
	this.button = function(id){
		return this.alertForm.getChildByName("NO");
	};

	this.Initialize = function(object, parent){
		mx_containers_Panel.prototype.Initialize.call(this, object, parent);
		this.alertForm = UIComponent.Get(this.getter("alertForm"));
	};
}

mx_controls_Alert.prototype.Import = function(){
	return ["mx.containers::Panel"];
};
mx_controls_Alert.prototype.Extends = function(){
	mx_containers_Panel.prototype.Extends();
	mx_controls_Alert.prototype = new mx_containers_Panel(mx_controls_Alert);
};
mx_controls_Alert.Get = function(o){
	var ref = this;
	ref = UIComponent.Get(o, mx_controls_Alert);
	return ref;
};

function $Alert() {}
$Alert.Get = mx_controls_Alert.Get;
$Alert.Is = function(target) { return target instanceof mx_controls_Alert; };