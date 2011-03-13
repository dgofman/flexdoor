package
{
	public class FlexDoor extends FlexDoorLib
	{
		public function FlexDoor(){
			_flexUtil = new FlexDoorUtil(this);
			_proxy = new FlexDoorProxy(1, null, statusHandler);
			super(_proxy);
		}

		private function statusHandler(channel:uint, status:String, message:String):void{
			trace(status + "::" + message);
		}
	}
}