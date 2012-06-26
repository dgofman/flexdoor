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

function spark_events_RendererExistenceEvent(classType) 
{
	/* extendType - spark.events::RendererExistenceEvent */
	flash_events_Event.call(this, classType);

	this.Initialize = function(object){
		flash_events_Event.prototype.Initialize.call(this, object);
		this.index = this.ref.index;
		this.data = this.ref.data;
		this.renderer = this.ref.renderer;
	};
}

spark_events_RendererExistenceEvent.prototype.Import = function(){
	return ["flash.events::Event"];
};
spark_events_RendererExistenceEvent.prototype.Extends = function(){
	spark_events_RendererExistenceEvent.prototype = new flash_events_Event(spark_events_RendererExistenceEvent);
};
spark_events_RendererExistenceEvent.Get = function(o){
	var ref = this;
	ref = UIComponent.Get(o, spark_events_RendererExistenceEvent);
	return ref;
};

function $$RendererExistenceEvent() {}
$$RendererExistenceEvent.Get = spark_events_RendererExistenceEvent.Get;
$$RendererExistenceEvent.Is = function(target) { return target instanceof spark_events_RendererExistenceEvent; };
$$RendererExistenceEvent.Create = function(type, index, data, renderer, bubbles, cancelable){
	return System.create("spark.events::RendererExistenceEvent", 
			$Event.Params(type, bubbles, cancelable, renderer, index, data));
};

$$RendererExistenceEvent.RENDERER_ADD = "rendererAdd";
$$RendererExistenceEvent.RENDERER_REMOVE = "rendererRemove";