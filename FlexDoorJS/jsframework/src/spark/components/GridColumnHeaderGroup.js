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

function spark_components_GridColumnHeaderGroup(classType) 
{
	/* extendType - spark.components::GridColumnHeaderGroup */
	UIComponent.call(this, classType);
}

spark_components_GridColumnHeaderGroup.prototype.Import = function(){
	return ["spark.components::Group"];
};
spark_components_GridColumnHeaderGroup.prototype.Extends = function(){
	spark_components_Group.prototype.Extends();
	spark_components_GridColumnHeaderGroup.prototype = new spark_components_Group(spark_components_GridColumnHeaderGroup);
};
spark_components_GridColumnHeaderGroup.Get = function(o){
	var ref = this;
	ref = UIComponent.Get(o, spark_components_GridColumnHeaderGroup);
	return ref;
};

function $$GridColumnHeaderGroup() {}
$$GridColumnHeaderGroup.Get = spark_components_GridColumnHeaderGroup.Get;
$$GridColumnHeaderGroup.Is = function(target) { return target instanceof spark_components_GridColumnHeaderGroup; };