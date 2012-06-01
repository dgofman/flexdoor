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
					"spark.components.Button",
					"spark.components.CheckBox",
					"spark.components.Group",
					"spark.components.Panel",
					"spark.components.SkinnableContainer",
					"spark.components.TitleWindow",
					"spark.components.supportClasses.GroupBase",
					"spark.components.supportClasses.SkinnableComponent"
			];
		}

		public static function eventInfo(e:*):String{
			var type:XML = describeType(e);
			switch(type.@name.toString()){
				case "flash.events::MouseEvent":
					return '$MouseEvent' + params(e.type, e.bubbles, e.cancelable, e.buttonDown, e.relatedObject, e.localX, e.localY,
													e.ctrlKey, e.altKey, e.shiftKey, e.delta);
				case "mx.events::AdvancedDataGridEvent":
					return '$AdvancedDataGridEvent' + params(e.type, e.rowIndex, e.columnIndex, e.dataField, e.reason, e.itemRenderer, e.item, e.localX,
						e.multiColumnSort, e.removeColumnFromSort, e.triggerEvent, e.headerPart, e.bubbles, e.cancelable);
				case "mx.events::CollectionEvent":
					return '$CollectionEvent' + params(e.type, e.kind, e.location, e.oldLocation, 
																		e.items, e.bubbles, e.cancelable);
				case "mx.events::DataGridEvent":
					return '$DataGridEvent' + params(e.type, e.rowIndex, e.columnIndex, e.dataField, e.reason, 
																				e.itemRenderer, e.localX, e.bubbles, e.cancelable);
				case "mx.events::DragEvent":
					return '$DragEvent' + params(e.type, e.action, e.dragInitiator, e.dragSource,
																		e.ctrlKey, e.altKey, e.shiftKey, e.bubbles, e.cancelable);
				case "mx.events::FlexEvent":
					return '$FlexEvent' + params(e.type, e.bubbles, e.cancelable);
				case "mx.events::ListEvent":
					return '$ListEvent' + params(e.type, e.rowIndex, e.columnIndex, e.itemRenderer, e.reason, e.bubbles, e.cancelable);
				case "mx.events::MenuEvent":
					return '$MenuEvent' + params(e.type, e.index, e.itemRenderer, e.item, e.label, e.menuBar, e.menu, e.bubbles, e.cancelable);
			}
			return '$Event' + params(e.type, e.bubbles, e.cancelable);
		}

		private static function params(...args):String{
			for(var i:uint = 0; i < args.length; i++){
				if(args[i] == null){
					args[i] = "null";
				}else if(args[i] is DisplayObject){
					var locators:Array = [];
					FlexDoorUtil.instance.getComponentInfo(args[i], [], locators, {});
					args[i] = 'Locator.Get("/' + locators.join('/') + '")';
				}else if(args[i] is String){
					args[i] = '"' + args[i] + '"';
				}
			}
			return '.Create(' + args.join(', ') + ');';
		}
	}
}