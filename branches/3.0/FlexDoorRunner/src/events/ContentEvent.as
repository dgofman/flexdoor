package
{
	import flash.events.Event;
	
	public class ContentEvent extends Event
	{
		private var _kind:String;
		private var _state:Boolean;

		public static const CONTENT_TYPE:String = "contentEvent";

		public static const OBJECTS_KIND:String = "objectsKind";
		public static const EVENTS_KIND:String = "eventsKind";
		public static const CLEAR_KIND:String = "clearKind";
		public static const CLOSE_KIND:String = "closeKind";

		public function ContentEvent(kind:String, state:Boolean=false){
			super(CONTENT_TYPE);
			_kind = kind;
			_state = state;
		}

		public function get kind():String{
			return _kind;
		}

		public function get state():Boolean{
			return _state;
		}
	}
}