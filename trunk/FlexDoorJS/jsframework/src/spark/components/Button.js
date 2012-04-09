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

function spark_components_Button(classType, extendType) 
{
	/* extendType - spark.components::Button */
	UIComponent.call(this, classType, extendType);

	this.click = function(type){
		if(type == undefined) type = $MouseEvent.CLICK;
		Static.doEvent($MouseEvent, type, this);
	};
}

spark_components_Button.prototype.Import = function(){
	return ["spark.components.supportClasses::SkinnableComponent",
	        "flash.events::MouseEvent"];
};
spark_components_Button.prototype.Extends = function(){
	spark_components_supportClasses_SkinnableComponent.prototype.Extends();
	spark_components_Button.prototype = new spark_components_supportClasses_SkinnableComponent(spark_components_Button);
};
spark_components_Button.Get = function(o){
	var ref = this;
	ref = UIComponent.Get(o, spark_components_Button);
	return ref;
};

function $$Button() {}
$$Button.Get = spark_components_Button.Get;