/**
 * @author David Gofman
 */

function Application(flashPlayerId)
{
	this.flash =  Static.getFlash(flashPlayerId);
	var object = this.flash.application();
	UIComponent.prototype.initialize.call(this, object, this.flash);
}
Application.application = null;
Application.prototype = new Container(Application, "org.flexdoor.core::Application");