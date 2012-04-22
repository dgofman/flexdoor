package {

	import flash.display.MovieClip;
	import fl.data.DataProvider;
	import fl.events.ListEvent;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.utils.setInterval;
	import flash.utils.clearInterval;

	public class InspectorView extends MovieClip
	{
		private var _helper:FlexDoorHelper;
		private var _eventsDataProvider:DataProvider;
		private var _componentsDataProvider:DataProvider;

		public function InspectorView(){
			super();
		}

		public function init(helper:FlexDoorHelper){
			_helper = helper;

			_helper.initButton(clear_btn, clearAll, "Clear  Ctrl+Alt+C");
			_helper.initButton(spy_events_ckb, spyEventsHandler, "Inspect Events  Ctrl+Alt+E");
			_helper.initButton(spy_objects_ckb, spyObjectsHandler, "Inspect Objects  Ctrl+Alt+O");
			_helper.initButton(close_btn, _helper.closeWindow, "Close  Ctrl+Alt+L");
			_helper.initButton(advanced_btn, _helper.openAdvanced, "Advanced  Ctrl+Alt+A");
			_helper.initButton(testCases_btn, _helper.openTestCases, "TestCases  Ctrl+Alt+T");

			_eventsDataProvider = new DataProvider();
			events_lst.labelField = "event";
			events_lst.dataProvider = _eventsDataProvider;
			events_lst.setStyle("cellRenderer", EventsListCellRenderer);
			events_lst.addEventListener(ListEvent.ITEM_ROLL_OVER, showListTooltip);
			events_lst.addEventListener(ListEvent.ITEM_ROLL_OUT, showListTooltip);
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
			components_lst.addEventListener(ListEvent.ITEM_ROLL_OVER, showListTooltip);
			components_lst.addEventListener(ListEvent.ITEM_ROLL_OUT, showListTooltip);
			components_lst.addEventListener(Event.CHANGE, function(event:Event):void{
				details_txt.text = event.target.selectedItem.code;
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

		private function showListTooltip(event:ListEvent):void{
			clearInterval(_helper.tooltipDelayInterval);
			if(event.type == ListEvent.ITEM_ROLL_OVER){
				_helper.tooltipDelayInterval = setInterval(function():void{
					mouseMoveListHandler();
					_helper.tooltip_lbl.text = " " + event.item[event.target.labelField] + " ";
					_helper.tooltip_lbl.visible = true;
					stage.addEventListener(MouseEvent.MOUSE_MOVE, mouseMoveListHandler);
				}, 500);
			}else{
				_helper.tooltip_lbl.visible = false;
				stage.removeEventListener(MouseEvent.MOUSE_MOVE, mouseMoveListHandler);
			}
		}

		private function mouseMoveListHandler(event:MouseEvent=null):void{
			clearInterval(_helper.tooltipDelayInterval);
			_helper.tooltip_lbl.x = mouseX + 15;
			_helper.tooltip_lbl.y = mouseY + 15;
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
			details_txt.text = "";
			_helper.dispatchEvent(new Event("clear"));
		}

		public function spyEventsHandler(event:MouseEvent=null):void{
			if(event == null)
				spy_events_ckb.selected = !spy_events_ckb.selected; 
			_helper.dispatchEvent(new Event(spy_events_ckb.selected ? "startSpyEvents" : "stopSpyEvents"));
		}

		public function spyObjectsHandler(event:MouseEvent=null):void{
			if(event == null)
				spy_objects_ckb.selected = !spy_objects_ckb.selected; 
			_helper.dispatchEvent(new Event(spy_objects_ckb.selected ? "startSpyObjects" : "stopSpyObjects"));
		}
	}
}