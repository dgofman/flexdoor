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

function spark_events_IndexChangeEvent(classType) 
{
	/* extendType - spark.events::IndexChangeEvent */
	flash_events_Event.call(this, classType);

	this.Initialize = function(object){
		flash_events_Event.prototype.Initialize.call(this, object);
		this.oldIndex = this.ref.oldIndex;
		this.newIndex = this.ref.newIndex;
	};
}

spark_events_IndexChangeEvent.prototype.Import = function(){
	return ["flash.events::Event"];
};
spark_events_IndexChangeEvent.prototype.Extends = function(){
	spark_events_IndexChangeEvent.prototype = new flash_events_Event(spark_events_IndexChangeEvent);
};
spark_events_IndexChangeEvent.Get = function(o){
	var ref = this;
	ref = UIComponent.Get(o, spark_events_IndexChangeEvent);
	return ref;
};

function $$IndexChangeEvent() {}
$$IndexChangeEvent.Get = spark_events_IndexChangeEvent.Get;
$$IndexChangeEvent.Is = function(target) { return target instanceof spark_events_IndexChangeEvent; };
$$IndexChangeEvent.Create = function(type, newIndex, oldIndex, bubbles, cancelable){
	if(newIndex == undefined) newIndex = -1;
	if(oldIndex == undefined) oldIndex = -1;
	return System.create("spark.events::IndexChangeEvent", 
			$Event.Params(type, bubbles, cancelable, oldIndex, newIndex));
};

$$IndexChangeEvent.CHANGE = "change";
$$IndexChangeEvent.CHANGING = "changing";
$$IndexChangeEvent.CARET_CHANGE = "caretChange";