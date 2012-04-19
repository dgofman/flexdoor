package {

	import flash.display.MovieClip;
	import flash.events.MouseEvent;
	import flash.text.TextFormat;
	import flash.events.FocusEvent;
	import flash.net.SharedObject;
	import fl.data.DataProvider;
	import fl.controls.dataGridClasses.DataGridColumn;

	public class AdvancedView extends MovieClip
	{
		private var _fdSpy:FlexDoorSpy;
		private var _so:SharedObject;
		private var _excludeEvents:DataProvider;
		private var _includeEvents:DataProvider;

		public function AdvancedView(){
			super();
			_so = SharedObject.getLocal("flexdoor");

			if(_so.data.excludeEvents == null){
				_so.data.excludeEvents = [
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
							{event:"spark.events::SkinPartEvent", type:"partAdded"}];
			}

			if(_so.data.includeEvents == null){
				_so.data.includeEvents = [
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
							{event:"spark.events::SkinPartEvent", type:"partAdded"}];
			}

			_so.flush();
			_excludeEvents = new DataProvider(_so.data.excludeEvents);
			_includeEvents = new DataProvider(_so.data.includeEvents);
			
			if(_so.data.isExcludeEvent == true){
				events_dg.dataProvider = _excludeEvents;
				exclude_events_rb.selected = true;
			}else{
				events_dg.dataProvider = _includeEvents;
				include_events_rb.selected = true;
			}
			
			var dgc1:DataGridColumn = new DataGridColumn("enable");
			dgc1.headerText = "";
			dgc1.width = 25;
			dgc1.cellRenderer = CheckBoxCellRenderer;
			dgc1.resizable = false;
			var dgc2:DataGridColumn = new DataGridColumn("type");
			dgc2.headerText = "Event Type";
			dgc2.width = 200;
			var dgc3:DataGridColumn = new DataGridColumn("event");
			dgc3.headerText = "Event Class Type";
			events_dg.columns = [dgc1, dgc2, dgc3];
		}

		public function init(fdSpy:FlexDoorSpy){
			_fdSpy = fdSpy;

			_fdSpy.initButton(adv_close_btn, _fdSpy.closeWindow, "Close  Ctrl+Alt+L");
			_fdSpy.initButton(adv_save_btn, saveSettings, "Save  Ctrl+Alt+S");

			event_class_txt.addEventListener(FocusEvent.FOCUS_IN, onFocusEventHandler);
			event_class_txt.addEventListener(FocusEvent.FOCUS_OUT, onFocusEventHandler);
			event_type_txt.addEventListener(FocusEvent.FOCUS_IN, onFocusEventHandler);
			event_type_txt.addEventListener(FocusEvent.FOCUS_OUT, onFocusEventHandler);

			reset();
			event_class_txt.dispatchEvent(new FocusEvent(FocusEvent.FOCUS_OUT));
			event_type_txt.dispatchEvent(new FocusEvent(FocusEvent.FOCUS_OUT));
		}

		private function onFocusEventHandler(event:FocusEvent):void{
			if(event.type == FocusEvent.FOCUS_OUT){
				if(event.currentTarget.text.length == 0){
					if(event.currentTarget == event_class_txt){
						event.currentTarget.text = "mx.events::CollectionEvent";
					}else if(event.currentTarget == event_type_txt){
						event.currentTarget.text = "collectionChange";
					}
					event.currentTarget.textColor = 0x666666;
				}
			}else{
				if(event.currentTarget.textColor == 0x666666){
					event.currentTarget.text = "";
					event.currentTarget.textColor = 0x000000;
				}
			}
		}

		public function saveSettings(event:MouseEvent=null):void{
			_fdSpy.openBasic();
			reset();
		}
		
		public function reset():void{
			event_class_txt.text = "";
			event_type_txt.text = "";
		}
	}
}