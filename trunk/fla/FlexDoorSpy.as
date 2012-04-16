package {

	import fl.data.DataProvider;
	import fl.events.ListEvent;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.display.Sprite;
	import flash.utils.setInterval;
	import flash.utils.clearInterval;

	public class FlexDoorSpy  extends Sprite
	{
		private var _eventsDataProvider:DataProvider;
		private var _componentsDataProvider:DataProvider;
		private var _tooltipDelayInterval:Number;

		public function FlexDoorSpy(){
			super();
			this.visible = false;

			tooltip_lbl.autoSize = "left";
			tooltip_lbl.border = true;
			tooltip_lbl.borderColor = 0xCCCCCC;
			tooltip_lbl.background = true;
			tooltip_lbl.backgroundColor = 0xF5EE77;
			tooltip_lbl.visible = false;

			bg_mc.addEventListener(MouseEvent.MOUSE_DOWN, dragEventHandler);
			bg_mc.addEventListener(MouseEvent.MOUSE_UP, dragEventHandler);

			close_top_btn.addEventListener(MouseEvent.CLICK, closeWindow);
			close_btn.addEventListener(MouseEvent.CLICK, closeWindow);
			clear_btn.addEventListener(MouseEvent.CLICK, clearAll);
			start_stop_btn.addEventListener(MouseEvent.CLICK, startStopRecord);

			clear_btn.useHandCursor = close_top_btn.useHandCursor = 
				close_btn.useHandCursor = start_stop_btn.useHandCursor = true;

			_eventsDataProvider = new DataProvider();
			events_lst.labelField = "event";
			events_lst.dataProvider = _eventsDataProvider;
			events_lst.setStyle("cellRenderer", EventsListCellRenderer);
			events_lst.addEventListener(ListEvent.ITEM_ROLL_OVER, showTooltip);
			events_lst.addEventListener(ListEvent.ITEM_ROLL_OUT, showTooltip);
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
			components_lst.addEventListener(ListEvent.ITEM_ROLL_OVER, showTooltip);
			components_lst.addEventListener(ListEvent.ITEM_ROLL_OUT, showTooltip);
			components_lst.addEventListener(Event.CHANGE, function(event:Event):void{
				details_txt.text = event.target.selectedItem.code;
			});
		}
		
		public function addNewEvent(item){
			events_lst.verticalScrollPosition = 0;
			_eventsDataProvider.addItemAt(item, 0);
			moveItemTop(item.uid);
		}

		public function addComponent(item){
			components_lst.verticalScrollPosition = 0;
			if(moveItemTop(item.uid) == false)
				_componentsDataProvider.addItemAt(item, 0);
		}

		private function showTooltip(event:ListEvent):void{
			clearInterval(_tooltipDelayInterval);
			if(event.type == ListEvent.ITEM_ROLL_OVER){
				_tooltipDelayInterval = setInterval(function():void{
					mouseMoveHandler();
					tooltip_lbl.text = " " + event.item[event.target.labelField] + " ";
					tooltip_lbl.visible = true;
					stage.addEventListener(MouseEvent.MOUSE_MOVE, mouseMoveHandler);
				}, 500);
			}else{
				tooltip_lbl.visible = false;
				stage.removeEventListener(MouseEvent.MOUSE_MOVE, mouseMoveHandler);
			}
		}

		private function mouseMoveHandler(event:MouseEvent=null):void{
			clearInterval(_tooltipDelayInterval);
			tooltip_lbl.x = mouseX + 15;
			tooltip_lbl.y = mouseY + 15;
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

		private function closeWindow(event:MouseEvent):void{
			visible = false;
			start_stop_btn.label = "Stop";
			dispatchEvent(new Event("close"));
		}

		private function clearAll(event:MouseEvent):void{
			_componentsDataProvider.removeAll();
			_eventsDataProvider.removeAll();
			details_txt.text = "";
			dispatchEvent(new Event("clear"));
		}

		private function startStopRecord(event:MouseEvent):void{
			dispatchEvent(new Event(start_stop_btn.label.toLowerCase()));
			start_stop_btn.label = (start_stop_btn.label == "Start" ? "Stop" : "Start");
		}

		private function dragEventHandler(event:MouseEvent):void{
			if(event.type == MouseEvent.MOUSE_DOWN && stage.hitTestObject(bg_mc)){
				this.startDrag();
			}else{
				this.stopDrag();
			}
		}
	}
}