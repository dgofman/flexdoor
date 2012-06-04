package {

	import flash.display.MovieClip;
	import fl.controls.dataGridClasses.DataGridColumn;
	import fl.events.ListEvent;
	import flash.utils.describeType;
	import fl.data.DataProvider;

	public class PropertiesView extends MovieClip
	{
		private var _runner:FlexDoorRunner;
	
		[Embed("../assets/lock_on.png")]   private const _lockOn:Class;
		[Embed("../assets/lock_off.png")]  private const _lockOff:Class;

		public function PropertiesView(){
			super();
		}

		public function init(runner:FlexDoorRunner){
			_runner = runner;

			var dgc1:DataGridColumn = new DataGridColumn("icon");
			dgc1.headerText = "";
			dgc1.sortable = false;
			dgc1.resizable = false;
			dgc1.width = 20;
			dgc1.cellRenderer = IconCellRenderer;
			var dgc2:DataGridColumn = new DataGridColumn("name");
			dgc2.headerText = "Name";
			dgc2.sortable = false;
			dgc2.width = 100;
			var dgc3:DataGridColumn = new DataGridColumn("toolTip");
			dgc3.headerText = "Value";
			dgc3.sortable = false;
			var dgc4:DataGridColumn = new DataGridColumn("type");
			dgc4.headerText = "Type";
			dgc4.width = 100;
			dgc4.sortable = false;

			properties_dg.columns = [dgc1, dgc2, dgc3, dgc4];
			properties_dg.setStyle("cellRenderer", GridRowCellRenderer);
			properties_dg.addEventListener(ListEvent.ITEM_ROLL_OVER, _runner.showDataGridTooltip);
			properties_dg.addEventListener(ListEvent.ITEM_ROLL_OUT, _runner.showDataGridTooltip);

			components_lst.labelField = "name";
			components_lst.addEventListener(ListEvent.ITEM_ROLL_OVER, _runner.showListTooltip);
			components_lst.addEventListener(ListEvent.ITEM_ROLL_OUT, _runner.showListTooltip);
			components_lst.addEventListener(ListEvent.ITEM_CLICK, function(event:ListEvent):void{
				var c:* = event.item.uicomponent;
				properties_dg.dataProvider.removeAll();
				details_txt.text = "";
				if(c != null){
					var type:XML = describeType(c);
					var temp:Array, props:Array = [];
					props.push({toolTip:"Info", passed:1});
					props.push({name:"type", toolTip:type.@name});
					props.push({name:"extends", toolTip:type.extendsClass.@type.toXMLString().split("\n")});
					props.push({name:"implements", toolTip:type.implementsInterface.@type.toXMLString().split("\n")});

					var variables:XMLList = type.variable;
					if(variables.length() > 0){
						props.push({toolTip:"Variables", passed:1});
						temp = [];
						for each(var v:XML in variables){
							try{
								temp.push({name:v.@name, toolTip:c[v.@name], type:v.@type});
							}catch(e:Error){}
						}
						temp.sortOn("name");
						props = props.concat(temp);
					}

					var accessors:XMLList = type.accessor.(@access != "writeonly");
					if(accessors.length() > 0){
						props.push({toolTip:"Accessors", passed:1});
						temp = [];
						for each(var a:XML in accessors){
							try{
								temp.push({name:a.@name, toolTip:c[a.@name], type:a.@type, icon:(a.@access == 'readwrite' ? _lockOff : _lockOn)});
							}catch(e:Error){}
						}
						temp.sortOn("name");
						props = props.concat(temp);
					}

					var methods:XMLList = type.method;
					if(methods.length() > 0){
						props.push({toolTip:"Methods", passed:1});
						temp = [];
						for each(var m:XML in methods){
							try{
								temp.push({name:m.@name, toolTip:m.parameter.@type.toXMLString().split("\n"), type:m.@returnType});
							}catch(e:Error){}
						}
						temp.sortOn("name");
						props = props.concat(temp);
					}

					properties_dg.dataProvider = new DataProvider(props);
				}
			});

			_runner.addEventListener(ContentEvent.CLEAR_KIND, onClear);
		}

		private function onClear(event:ContentEvent):void{
			components_lst.dataProvider.removeAll();
			properties_dg.dataProvider.removeAll();
			details_txt.text = "";
		}
	}
}