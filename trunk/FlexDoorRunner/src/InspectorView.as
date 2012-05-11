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

			_runner.initButton(clear_btn, clearAll, "Clear  Ctrl+Alt+C");
			_runner.initButton(spy_events_ckb, inspectEventsHandler, "Inspect Events  Ctrl+Alt+E");
			_runner.attachToolTip(target_lbl, "Drag the Inspector Tool over a component to select it,\nthen release the mouse button", false);

			_eventsDataProvider = new DataProvider();
			events_lst.labelField = "event";
			events_lst.dataProvider = _eventsDataProvider;
			events_lst.setStyle("cellRenderer", EventsListCellRenderer);
			events_lst.addEventListener(ListEvent.ITEM_ROLL_OVER, _runner.showListTooltip);
			events_lst.addEventListener(ListEvent.ITEM_ROLL_OUT, _runner.showListTooltip);
			events_lst.addEventListener(ListEvent.ITEM_CLICK, function(event:ListEvent):void{
				for(var i:Number = 0; i < _componentsDataProvider.length; i++){
					var data:Object = _componentsDataProvider.getItemAt(i);
					if(data.uid == event.item.uid){
						components_lst.verticalScrollPosition = i * components_lst.rowHeight;
						components_lst.selectedIndex = i;
						components_lst.dispatchEvent(new Event(Event.CHANGE));
						break;;
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

		public function addNewEvent(item){
			events_lst.verticalScrollPosition = 0;
			_eventsDataProvider.addItemAt(item, 0);
			moveItemTop(item.uid);
		}

		public function addComponent(item){
			components_lst.verticalScrollPosition = 0;
			if(moveItemTop(item.uid) == false){
				_componentsDataProvider.addItemAt(item, 0);
				components_lst.selectedIndex = 0;
				components_lst.dispatchEvent(new Event(Event.CHANGE));
			}
		}

		private function moveItemTop(uid:String):Boolean{
			for(var i:Number = 0; i < _componentsDataProvider.length; i++){
				var data:Object = _componentsDataProvider.getItemAt(i);
				if(data.uid == uid){
					components_lst.removeItemAt(i);
					components_lst.addItemAt(data, 0);
					components_lst.selectedIndex = 0;
					components_lst.dispatchEvent(new Event(Event.CHANGE));
					return true;
				}
			}
			return false;
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
	}
}