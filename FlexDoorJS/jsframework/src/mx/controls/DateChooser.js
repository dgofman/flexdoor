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

function mx_controls_DateChooser(classType) 
{
	/* extendType - mx.controls::DateChooser */
	UIComponent.call(this, classType);
	
	this.monthDisplay = function(){
		return this.getter("monthDisplay");
	};

	this.yearDisplay = function(){
		return this.getter("yearDisplay");
	};

	this.upYearButton = function(){
		return this.getter("upYearButton");
	};

	this.downYearButton = function(){
		return this.getter("downYearButton");
	};

	this.fwdMonthButton = function(){
		return this.getter("fwdMonthButton");
	};

	this.backMonthButton = function(){
		return this.getter("backMonthButton");
	};

	this.calendarLayout = function(){
		return this.getter("dateGrid");
	};

	this.selectedDate = function(){ /* getter and setter */
		return this.property("selectedDate", arguments);
	};

	this.selectedRanges = function(){ /* getter and setter */
		return this.property("selectedRanges", arguments);
	};

	this.showToday = function(){ /* getter and setter */
		return this.property("showToday", arguments);
	};
}

mx_controls_DateChooser.prototype.Extends = function(){
	mx_controls_DateChooser.prototype = new UIComponent(mx_controls_DateChooser);
};
mx_controls_DateChooser.Get = function(o){
	var ref = this;
	ref = UIComponent.Get(o, mx_controls_DateChooser);
	return ref;
};

function $DateChooser() {}
$DateChooser.Get = mx_controls_DateChooser.Get;
$DateChooser.Is = function(target) { return target instanceof mx_controls_DateChooser; };