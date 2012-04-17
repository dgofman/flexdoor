package {

	import flash.display.MovieClip;
	import flash.events.MouseEvent;

	public class AdvancedView extends MovieClip
	{
		private var _fdSpy:FlexDoorSpy;

		public function AdvancedView(){
			super();
		}

		public function init(fdSpy:FlexDoorSpy){
			_fdSpy = fdSpy;

			adv_close_btn.addEventListener(MouseEvent.CLICK, _fdSpy.closeWindow);
			adv_done_btn.addEventListener(MouseEvent.CLICK, saveAdvancedSettings);
		}

		public function saveAdvancedSettings(event:MouseEvent=null):void{
			_fdSpy.openBasic();
		}
	}
}