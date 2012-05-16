package {

	import flash.display.MovieClip;
	import fl.data.DataProvider;
	import fl.events.ListEvent;
	import flash.events.Event;
	import flash.events.MouseEvent;

	public class InspectorView extends MovieClip
	{
		private var _runner:FlexDoorRunner;
		private var _eventsDataProvider:DataProvider;
		private var _componentsDataProvider:DataProvider;

		public function InspectorView(){
			super();
		}

		public function init(runner:FlexDoorRunner){
			_runner = runner;

			target_mc.buttonMode = true;
			target_mc.useHandCursor = true;
			target_mc.addEventListener(MouseEvent.MOUSE_DOWN, targetMouseEventHandler);
			
			_runner.initButton(clear_btn, clearAll, "Clear  Ctrl+Alt+C");
			_runner.initButton(spy_events_ckb, inspectEventsHandler, "Inspect Events  Ctrl+Alt+E");
			_runner.initButton(live_drag_ckb, liveDragHandler, "Live Drag  Ctrl+Alt+D");
			_runner.attachToolTip(target_lbl, "Drag the Inspector Tool over a component to select it, <br> then release the mouse button", false);

			_eventsDataProvider = new DataProvider();
			events_lst.labelField = "event";
			events_lst.dataProvider = _eventsDataProvider;
			events_lst.setStyle("cellRenderer", EventsListCellRenderer);
			events_lst.addEventListener(ListEvent.ITEM_ROLL_OVER, _runner.showListTooltip);
			events_lst.addEventListener(ListEvent.ITEM_ROLL_OUT, _runner.showListTooltip);
			events_lst.addEventListener(ListEvent.ITEM_CLICK, function(event:ListEvent):void{
				if(event.item == null){
					var selItem:Object = events_lst.dataProvider.getItemAt(uint(event.rowIndex));
					_runner.addtExcludeEvent(selItem.eventClass, selItem.type);
					for(var i:int = events_lst.dataProvider.length - 1; i >= 0;  i--){
						var item:Object = events_lst.dataProvider.getItemAt(i);
						if(item.eventClass == selItem.eventClass && item.type == selItem.type)
							events_lst.dataProvider.removeItemAt(i);
					}
				}
			});

			_componentsDataProvider = new DataProvider();
			components_lst.labelField = "name";
			components_lst.dataProvider = _componentsDataProvider;
			components_lst.addEventListener(ListEvent.ITEM_ROLL_OVER, _runner.showListTooltip);
			components_lst.addEventListener(ListEvent.ITEM_ROLL_OUT, _runner.showListTooltip);
			components_lst.addEventListener(Event.CHANGE, function(event:Event):void{
				details_txt.htmlText = event.target.selectedItem.code.split('\n').join('<br>');
			});
			components_lst.addEventListener(ListEvent.ITEM_CLICK, function(event:ListEvent):void{
				events_lst.selectedIndex = -1;
			});
		}

		private function targetMouseEventHandler(event:MouseEvent):void{
			if(live_drag_ckb.selected == false)
				_runner.dispatchEvent(new ContentEvent(ContentEvent.DRAG_KIND));
		}
		
		public function addNewEvent(item){
			events_lst.verticalScrollPosition = 0;
			_eventsDataProvider.addItemAt(item, 0);
			moveItemTop(item.uid, null);
		}

		public function addComponent(item){
			moveItemTop(item.uid, item);
		}

		private function moveItemTop(uid:String, item:Object):void{
			for(var i:Number = 0; i < _componentsDataProvider.length; i++){
				var data:Object = _componentsDataProvider.getItemAt(i);
				if(data.uid == uid){
					components_lst.removeItemAt(i);
					if(item == null) //add events
						item = data;
					break;
				}
			}
			_componentsDataProvider.addItemAt(item, 0);
			components_lst.verticalScrollPosition = 0;
			components_lst.selectedIndex = 0;
			components_lst.dispatchEvent(new Event(Event.CHANGE));
		}

		public function clearAll(event:MouseEvent=null):void{
			_componentsDataProvider.removeAll();
			_eventsDataProvider.removeAll();
			details_txt.htmlText = "";
			_runner.dispatchEvent(new ContentEvent(ContentEvent.CLEAR_KIND));
		}

		public function inspectEventsHandler(event:MouseEvent=null):void{
			if(event == null)
				spy_events_ckb.selected = !spy_events_ckb.selected;
			_runner.dispatchEvent(new ContentEvent(ContentEvent.EVENTS_KIND, spy_events_ckb.selected));
		}
		
		public function liveDragHandler(event:MouseEvent=null):void{
			if(event == null)
				live_drag_ckb.selected = !live_drag_ckb.selected;
			_runner.dispatchEvent(new ContentEvent(ContentEvent.LIVE_DRAG_KIND, live_drag_ckb.selected));
		}
	}
}