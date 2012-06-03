package
{
	import flash.display.DisplayObject;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.utils.describeType;

	public class JSClasses
	{
		public static function get aliases():Array{
			return [{prefix:'mx.core', alias:''},
					{prefix:'mx', alias:'$'},
					{prefix:'flash', alias:'$'},
					{prefix:'spark', alias:'$$'}];
		}

		public static function get list():Array{
			return ["flash.events.Event",
					"flash.events.MouseEvent",
					"flash.events.EventDispatcher",
					"mx.collections.HierarchicalCollectionView",
					"mx.collections.ListCollectionView",
					"mx.containers.Box",
					"mx.containers.Panel",
					"mx.containers.TitleWindow",
					"mx.controls.AdvancedDataGrid",
					"mx.controls.Alert",
					"mx.controls.Button",
					"mx.controls.ButtonBar",
					"mx.controls.CheckBox",
					"mx.controls.ColorPicker",
					"mx.controls.ComboBase",
					"mx.controls.ComboBox",
					"mx.controls.DataGrid",
					"mx.controls.DateChooser",
					"mx.controls.DateField",
					"mx.controls.HorizontalList",
					"mx.controls.HRule",
					"mx.controls.HScrollBar",
					"mx.controls.HSlider",
					"mx.controls.Image",
					"mx.controls.Label",
					"mx.controls.LinkBar",
					"mx.controls.LinkButton",
					"mx.controls.List",
					"mx.controls.Menu",
					"mx.controls.MenuBar",
					"mx.controls.NavBar",
					"mx.controls.NumericStepper",
					"mx.controls.PopUpButton",
					"mx.controls.PopUpMenuButton",
					"mx.controls.ProgressBar",
					"mx.controls.RadioButton",
					"mx.controls.RadioButtonGroup",
					"mx.controls.TabBar",
					"mx.controls.Text",
					"mx.controls.TextArea",
					"mx.controls.TextInput",
					"mx.controls.TileList",
					"mx.controls.ToggleButtonBar",
					"mx.controls.Tree",
					"mx.controls.VideoDisplay",
					"mx.controls.VRule",
					"mx.controls.VScrollBar",
					"mx.controls.VSlider",
					"mx.controls.advancedDataGridClasses.AdvancedDataGridGroupItemRenderer",
					"mx.controls.advancedDataGridClasses.AdvancedDataGridItemRenderer",
					"mx.controls.dataGridClasses.DataGridItemRenderer",
					"mx.controls.listClasses.ListBase",
					"mx.controls.listClasses.TileBase",
					"mx.controls.scrollClasses.ScrollBar",
					"mx.controls.sliderClasses.Slider",
					"mx.core.Application",
					"mx.core.Container",
					"mx.core.UIComponent",
					"mx.core.UITextField",
					"mx.events.AdvancedDataGridEvent",
					"mx.events.CollectionEvent",
					"mx.events.DataGridEvent",
					"mx.events.DragEvent",
					"mx.events.FlexEvent",
					"mx.events.ListEvent",
					"mx.events.MenuEvent",
					"mx.managers.DragManager",
					"spark.components.Application",
					"spark.components.BorderContainer",
					"spark.components.Button",
					"spark.components.ButtonBarButton",
					"spark.components.CheckBox",
					"spark.components.ComboBox",
					"spark.components.DataGrid",
					"spark.components.DataGroup",
					"spark.components.DataRenderer",
					"spark.components.DropDownList",
					"spark.components.Form",
					"spark.components.FormHeading",
					"spark.components.FormItem",
					"spark.components.Grid",
					"spark.components.GridColumnHeaderGroup",
					"spark.components.Group",
					"spark.components.HGroup",
					"spark.components.HScrollBar",
					"spark.components.HSlider",
					"spark.components.IconPlacement",
					"spark.components.Image",
					"spark.components.Label",
					"spark.components.List",
					"spark.components.NavigatorContent",
					"spark.components.NumericStepper",
					"spark.components.Panel",
					"spark.components.PopUpAnchor",
					"spark.components.PopUpPosition",
					"spark.components.RadioButton",
					"spark.components.RadioButtonGroup",
					"spark.components.ResizeMode",
					"spark.components.RichEditableText",
					"spark.components.RichText",
					"spark.components.Scroller",
					"spark.components.ScrollSnappingMode",
					"spark.components.SkinnableContainer",
					"spark.components.SkinnableDataContainer",
					"spark.components.SkinnablePopUpContainer",
					"spark.components.Spinner",
					"spark.components.TabBar",
					"spark.components.TextArea",
					"spark.components.TextInput",
					"spark.components.TextSelectionHighlighting",
					"spark.components.TileGroup",
					"spark.components.TitleWindow",
					"spark.components.ToggleButton",
					"spark.components.VGroup",
					"spark.components.VideoDisplay",
					"spark.components.VideoPlayer",
					"spark.components.VScrollBar",
					"spark.components.VSlider",
					"spark.components.supportClasses.ButtonBarBase",
					"spark.components.supportClasses.ButtonBase",
					"spark.components.supportClasses.DropDownListBase",
					"spark.components.supportClasses.GroupBase",
					"spark.components.supportClasses.ListBase",
					"spark.components.supportClasses.Range",
					"spark.components.supportClasses.ScrollBarBase",
					"spark.components.supportClasses.SkinnableComponent",
					"spark.components.supportClasses.SkinnableContainerBase",
					"spark.components.supportClasses.SliderBase",
					"spark.components.supportClasses.TextBase",
					"spark.components.supportClasses.ToggleButtonBase",
					"spark.components.supportClasses.TrackBase"
			];
		}

		public static function eventInfo(e:Event):Object{
			var type:XML = describeType(e);
			var eventType:String;
			var eventParams:Array;
			switch(type.@name.toString()){
				case "flash.events::MouseEvent":
					eventType = '$MouseEvent';
					eventParams = ['type', 'bubbles', 'cancelable', 'buttonDown', 'relatedObject', 'localX', 'localY', 'ctrlKey', 'altKey', 'shiftKey', 'delta'];
					break;
				case "mx.events::AdvancedDataGridEvent":
					eventType = '$AdvancedDataGridEvent';
					eventParams = ['type', 'rowIndex', 'columnIndex', 'dataField', 'reason', 'itemRenderer', 'item', 'localX',
															'multiColumnSort', 'removeColumnFromSort', 'triggerEvent', 'headerPart', 'bubbles', 'cancelable'];
					break;
				case "mx.events::CollectionEvent":
					eventType = '$CollectionEvent';
					eventParams = ['type', 'kind', 'location', 'oldLocation', 'items', 'bubbles', 'cancelable'];
					break;
				case "mx.events::DataGridEvent":
					eventType = '$DataGridEvent';
					eventParams = ['type', 'rowIndex', 'columnIndex', 'dataField', 'reason', 'itemRenderer', 'localX', 'bubbles', 'cancelable'];
					break;
				case "mx.events::DragEvent":
					eventType = '$DragEvent';
					eventParams = ['type', 'action', 'dragInitiator', 'dragSource', 'ctrlKey', 'altKey', 'shiftKey', 'bubbles', 'cancelable'];
					break;
				case "mx.events::FlexEvent":
					eventType = '$FlexEvent';
					eventParams = ['type', 'bubbles', 'cancelable'];
					break;
				case "mx.events::ListEvent":
					eventType = '$ListEvent';
					eventParams = ['type', 'rowIndex', 'columnIndex', 'itemRenderer', 'reason', 'bubbles', 'cancelable'];
					break;
				case "mx.events::MenuEvent":
					eventType = '$MenuEvent';
					eventParams = ['type', 'index', 'itemRenderer', 'item', 'label', 'menuBar', 'menu', 'bubbles', 'cancelable'];
					break;
				default:
					eventType = '$Event';
					eventParams = ['type', 'bubbles', 'cancelable'];
					break;
			}
			return {event:eventType + params(e, eventParams), params:eventParams};
		}

		private static function params(e:Event, params:Array):String{
			var values:Array = [];
			for(var i:uint = 0; i < params.length; i++){
				var name:String = params[i];
				var value:* = e[name];
				var htmlValue:* = value;
				if(value == null){
					value = 'null';
					htmlValue = '<font color="#7F0055">null</font>';
				}else if(typeof(value) == "boolean"){
					htmlValue = '<font color="#7F0055">' + value + '</font>';
				}else if(value is DisplayObject){
					var locators:Array = [];
					FlexDoorUtil.instance.getComponentInfo(value, [], locators, {});
					value = 'Locator.Get("/' + locators.join('/') + '")';
					htmlValue = 'Locator.Get(<font color="#2A00FF">"/' + locators.join('/') + '"</font>)';
				}else if(value is String){
					value = '"' + value + '"';
					htmlValue = '<font color="#2A00FF">' + value + '</font>';
				}
				values.push(value);
				params[i] = '<b>' + name + '</b> - ' + htmlValue;
			}
			return '.Create(' + values.join(', ') + ');';
		}
	}
}