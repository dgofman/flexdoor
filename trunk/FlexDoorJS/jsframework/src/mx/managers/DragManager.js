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

function mx_managers_DragManager(classType, extendType) 
{
	/* extendType - mx.managers::DragManager */
	UIComponent.call(this, classType, extendType);
}
mx_managers_DragManager.prototype = new Object();

mx_managers_DragManager.Get = function(o){
	var ref = this;
	ref = UIComponent.Get(o, mx_managers_DragManager);
	return ref;
};

function $DragManager() {}
$DragManager.Get = mx_managers_DragManager.Get;
$DragManager.Is = function(target) { return target instanceof mx_managers_DragManager; };

$DragManager.NONE = "none";
$DragManager.COPY = "copy";
$DragManager.MOVE = "move";
$DragManager.LINK = "link";

$DragManager.dragProxy = function(){
	var manager = System.getClass("mx.managers::DragManager");
	return System.getter(manager, "dragProxy");
};