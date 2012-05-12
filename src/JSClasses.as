package
{
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
					"mx.containers.Panel",
					"mx.containers.TitleWindow",
					"mx.controls.AdvancedDataGrid",
					"mx.controls.Alert",
					"mx.controls.Button",
					"mx.controls.CheckBox",
					"mx.controls.ComboBox",
					"mx.controls.DataGrid",
					"mx.controls.advancedDataGridClasses.AdvancedDataGridGroupItemRenderer",
					"mx.controls.advancedDataGridClasses.AdvancedDataGridItemRenderer",
					"mx.controls.dataGridClasses.DataGridItemRenderer",
					"mx.controls.Image",
					"mx.controls.List",
					"mx.controls.TextInput",
					"mx.core.Application",
					"mx.core.Container",
					"mx.core.UIComponent",
					"mx.core.UITextField",
					"mx.events.CollectionEvent",
					"mx.events.DataGridEvent",
					"mx.events.FlexEvent",
					"mx.events.ListEvent",
					"spark.components.Button",
					"spark.components.Group",
					"spark.components.Panel",
					"spark.components.TitleWindow",
					"spark.components.supportClasses.GroupBase",
					"spark.components.supportClasses.SkinnableComponent"
			];
		}

		public static function eventInfo(e:*):String{
			var type:XML = describeType(e);
			switch(type.@name.toString()){
				case "flash.events::MouseEvent":
					return '$MouseEvent.Create(' + [str(e.type), e.bubbles, e.cancelable, e.buttonDown, null, e.localX, e.localY,
													e.ctrlKey, e.altKey, e.shiftKey, e.delta].join(', ') + ');';
				case "mx.events::CollectionEvent":
					return '$CollectionEvent.Create(' + [str(e.type), str(e.kind), e.location, e.oldLocation, 
														 e.items, e.bubbles, e.cancelable].join(', ') + ');';
				case "mx.events::DataGridEvent":
					return '$DataGridEvent.Create(' + [str(e.type), e.rowIndex, e.columnIndex, str(e.reason), str(e.dataField), null, 
																		e.localX, e.bubbles, e.cancelable].join(', ') + ');';
				case "mx.events::FlexEvent":
					return '$FlexEvent.Create(' + [str(e.type), e.bubbles, e.cancelable].join(', ') + ');';
				case "mx.events::ListEvent":
					return '$ListEvent.Create(' + [str(e.type), e.rowIndex, e.columnIndex, null, 
													str(e.reason), e.bubbles, e.cancelable].join(', ')  + ');';
			}
			return '$Event.Create(' + [str(e.type), e.bubbles, e.cancelable].join(', ') + ');';
		}
		
		private static function str(value:String):String{
			return '"' + value + '"';
		}
	}
}