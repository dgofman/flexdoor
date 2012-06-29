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

function mx_containers_Box(classType) 
{
	/* extendType - mx.containers::Box */
	UIComponent.call(this, classType);
}

mx_containers_Box.prototype.Import = function(){
	return ["mx.core::Container"];
};
mx_containers_Box.prototype.Extends = function(){
	Container.prototype.Extends();
	mx_containers_Box.prototype = new Container(mx_containers_Box);
};
mx_containers_Box.Get = function(o){
	var ref = this;
	ref = UIComponent.Get(o, mx_containers_Box);
	return ref;
};

function $Box() {}
$Box.Get = mx_containers_Box.Get;
$Box.Is = function(target) { return target instanceof mx_containers_Box; };