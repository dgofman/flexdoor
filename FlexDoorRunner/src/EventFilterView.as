package {

	import flash.display.MovieClip;
	import flash.events.MouseEvent;
	import flash.text.TextFormat;
	import flash.events.FocusEvent;
	import fl.events.ListEvent;
	import fl.data.DataProvider;
	import flash.net.SharedObject;
	import fl.controls.dataGridClasses.DataGridColumn;
	
	public class EventFilterView extends MovieClip
	{
		private var _runner:FlexDoorRunner;
		private var _so:SharedObject;

		public function EventFilterView(){
			super();

			var dgc1:DataGridColumn = new DataGridColumn("type");
			dgc1.headerText = "Exclude Event Type";
			dgc1.width = 250;
			var dgc2:DataGridColumn = new DataGridColumn("event");
			dgc2.headerText = "Event Class Type";
			var dgc3:DataGridColumn = new DataGridColumn("delete");
			dgc3.headerText = " X";
			dgc3.width = 25;
			dgc3.resizable = false;
			dgc3.sortable = false;
			events_dg.columns = [dgc1, dgc2, dgc3];
		}

		public function init(runner:FlexDoorRunner){
			_runner = runner;
			_so = _runner.so;

			if(_so.data.excludeEvents is Array){
				events_dg.dataProvider = new DataProvider(_so.data.excludeEvents);
			}else{
				restoreDefault();
			}

			events_dg.labelFunction = columnLabelFunction;
			events_dg.addEventListener(ListEvent.ITEM_CLICK, function(event:ListEvent):void
			{
				var dataField:String = events_dg.columns[event.columnIndex].dataField;
				if(dataField == "delete")
					events_dg.dataProvider.removeItemAt(uint(event.rowIndex));
			});

			_runner.initButton(adv_restore_btn, restoreDefault, "Restore Default");
			_runner.initButton(adv_apply_btn, applyEvents, "Apply");
			_runner.initButton(adv_save_btn, saveSettings, "Save");
		}

		private function columnLabelFunction(data:Object, column:DataGridColumn):String {
			if(column.dataField == "delete")
				return " X";
			return (data[column.dataField] != null ? data[column.dataField] : "");
		}
		
		private function restoreDefault(event:MouseEvent=null):void{
			var events:Array = [
					{event:"flash.events::Event", type:"alphaChanged"},
					{event:"flash.events::Event", type:"childrenChanged"},
					{event:"flash.events::Event", type:"contentChange"},
					{event:"flash.events::Event", type:"dataProviderChanged"},
					{event:"flash.events::Event", type:"directionChanged"},
					{event:"flash.events::Event", type:"editableChanged"},
					{event:"flash.events::Event", type:"enabledChanged"},
					{event:"flash.events::Event", type:"explicitHeightChanged"},
					{event:"flash.events::Event", type:"explicitWidthChanged"},
					{event:"flash.events::Event", type:"explicitMinHeightChanged"},
					{event:"flash.events::Event", type:"explicitMinWidthChanged"},
					{event:"flash.events::Event", type:"htmlTextChanged"},
					{event:"flash.events::Event", type:"restrictChanged"},
					{event:"flash.events::Event", type:"skinChanged"},
					{event:"flash.events::Event", type:"sourceChanged"},
					{event:"flash.events::Event", type:"tabFocusEnabledChange"},
					{event:"flash.events::Event", type:"toolTipChanged"},
					{event:"flash.events::Event", type:"horizontalScrollPolicyChanged"},
					{event:"flash.events::Event", type:"validateDisplayListComplete"},
					{event:"flash.events::Event", type:"validatePropertiesComplete"},
					{event:"flash.events::Event", type:"verticalScrollPolicyChanged"},
					{event:"flash.events::Event", type:"validateSizeComplete"},
					{event:"flash.events::Event", type:"viewChanged"},
					{event:"mx.events::CollectionEvent", type:"collectionChange"},
					{event:"mx.events::FlexEvent", type:"dataChange"},
					{event:"mx.events::FlexEvent", type:"creationComplete"},
					{event:"mx.events::FlexEvent", type:"contentCreationComplete"},
					{event:"mx.events::EffectEvent", type:"effectStart"},
					{event:"mx.events::EffectEvent", type:"effectEnd"},
					{event:"mx.events::FlexEvent", type:"hide"},
					{event:"mx.events::FlexEvent", type:"initialize"},
					{event:"mx.events::FlexEvent", type:"preinitialize"},
					{event:"mx.events::FlexEvent", type:"show"},
					{event:"mx.events::ToolTipEvent", type:"toolTipCreate"},
					{event:"mx.events::ToolTipEvent", type:"toolTipHide"},
					{event:"mx.events::ToolTipEvent", type:"toolTipEnd"},
					{event:"mx.events::ToolTipEvent", type:"toolTipShow"},
					{event:"mx.events::ToolTipEvent", type:"toolTipShown"},
					{event:"mx.events::ToolTipEvent", type:"toolTipStart"},
					{event:"mx.events::PropertyChangeEvent", type:"propertyChange"},
					{event:"mx.events::FlexEvent", type:"updateComplete"},
					{event:"mx.events::FlexEvent", type:"valueCommit"},
					{event:"spark.events::IndexChangeEvent", type:"caretChange"},
					{event:"spark.events::ElementExistenceEvent", type:"elementAdd"},
					{event:"spark.events::SkinPartEvent", type:"partAdded"}
			];
			events_dg.dataProvider = new DataProvider(events);
		}
		
		private function applyEvents(event:MouseEvent=null):void{
			_runner.openInspector();
			_runner.dispatchEvent(new ContentEvent(ContentEvent.APPLY_EVENTS));
		}
		
		private function saveSettings(event:MouseEvent=null):void{
			_so.data.excludeEvents = _runner.toArray(events_dg.dataProvider);
			_so.flush();
			applyEvents();
		}
		
		public function getExcludeEvents():Object{
			var events:Object = {};
			for(var i:uint = 0; i < events_dg.dataProvider.length; i++){
				var item:Object = events_dg.dataProvider.getItemAt(i);
				events[item.event + '_' + item.type] = item.event;
			}
			return events;
		}
	}
}