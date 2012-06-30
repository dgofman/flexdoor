package {

	import flash.display.MovieClip;
	import fl.controls.dataGridClasses.DataGridColumn;
	import fl.events.ListEvent;
	import flash.utils.describeType;
	import fl.data.DataProvider;
	import flash.display.DisplayObject;
	import flash.events.Event;

	public class PropertiesView extends MovieClip
	{
		private var _runner:FlexDoorRunner;
	
		[Embed("../assets/lock_on.png")]   private const _lockOn:Class;
		[Embed("../assets/lock_off.png")]  private const _lockOff:Class;

		private const TAB:String = "    ";

		private const INFO:uint      = 0;
		private const VARIABLES:uint = 1;
		private const ACCESSORS:uint = 2;
		private const METHODS:uint   = 3;

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
			properties_dg.addEventListener(ListEvent.ITEM_CLICK, function(event:ListEvent):void{
				updateDetails(event.item);
			})
			properties_dg.addEventListener(Event.CHANGE, function(event:Event):void{
				updateDetails(event.target.selectedItem);
			});

			components_lst.labelField = "name";
			components_lst.addEventListener(ListEvent.ITEM_ROLL_OVER, _runner.showListTooltip);
			components_lst.addEventListener(ListEvent.ITEM_ROLL_OUT, _runner.showListTooltip);
			components_lst.addEventListener(ListEvent.ITEM_CLICK, function(event:ListEvent):void{
				updateProperties(event.item);
			});
		}

		public function updateProperties(item:Object):void{
			var c:* = item.uicomponent;
			properties_dg.dataProvider.removeAll();
			details_txt.htmlText = c.toString();
			if(c != null){
				var type:XML = describeType(c);
				var temp:Array, props:Array = [];
				props.push({toolTip:c.toString(), index:INFO, passed:1});
				props.push({name:"type", toolTip:type.@name, index:INFO});
				props.push({name:"extends", toolTip:type.extendsClass.@type.toXMLString().split("\n"), index:INFO});
				props.push({name:"implements", toolTip:type.implementsInterface.@type.toXMLString().split("\n"), index:INFO});
				if(c.parent != null)
					props.push({name:"parent", toolTip:c.parent.toString(), index:INFO, parent:c.parent});
				
				var variables:XMLList = type.variable;
				if(variables.length() > 0){
					props.push({toolTip:"Variables", passed:1});
					temp = [];
					for each(var v:XML in variables){
						try{
							temp.push({name:v.@name, toolTip:c[v.@name], type:v.@type, index:VARIABLES});
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
							temp.push({name:a.@name, toolTip:c[a.@name], type:a.@type, icon:(a.@access == 'readwrite' ? _lockOff : _lockOn), index:ACCESSORS});
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
							temp.push({name:m.@name, toolTip:m.parameter.@type.toXMLString().split("\n"), type:m.@returnType, index:METHODS});
						}catch(e:Error){}
					}
					temp.sortOn("name");
					props = props.concat(temp);
				}
				
				properties_dg.dataProvider = new DataProvider(props);
			}
		}

		protected function updateDetails(item:Object):void{
			var value:* = item.toolTip;
			if(item.index == undefined){
				details_txt.htmlText = "";
			}else if(item.index == INFO && item.name == "parent"){
				details_txt.htmlText = "<b>" + describeType(item.parent).@name + "</b>\n" + item.toolTip;
				if(components_lst.selectedItem.addParent != false && item.parent != null && item.parent.name != null){
					components_lst.selectedItem.addParent = false;
					var name:String = components_lst.selectedItem["name"];
					var indent:String = new Array(name.search(/(?!\s)/) + 3).join(" ");
					components_lst.addItemAt({name:indent + item.parent.name, uicomponent:item.parent}, components_lst.selectedIndex + 1);
				}
			}else if(item.index == METHODS){
				details_txt.htmlText = '<b>' + item.name + '</b> (' + value.join(', ') + ') : <b>' + item.type + '</b>';
			}else{
				var o:* = createProxyObject(value);
				if(value != null && typeof(item.toolTip) == "object"){
					details_txt.htmlText = "<b>" + describeType(value).@name + "</b>\n" + o;
				}else{
					details_txt.htmlText = (o != null ? String(o) : "");
				}
			}
		}

		protected function createProxyObject(ref:*, indent:String=''):*{
			if(ref is DisplayObject)
				return DisplayObject(ref).toString();
			if(ref == null || typeof(ref) != "object"){
				return ref;
			}

			var value:*;
			var out:Array = [];
			var array:Array = [];
			var classInfo:XML = describeType(ref);
			var isDict:Boolean  = (classInfo.@name.toString() == "flash.utils::Dictionary");
			var dynamic:Boolean = (classInfo.@isDynamic.toString() == "true");
			if(isDict || dynamic){
				for(var key:* in ref){
					value = ref[key];
					if(value is Array){
						for(var i:uint = 0; i < value.length; i++)
							array[i] = createProxyObject(value[i], indent + TAB);
						out.push('\n' + indent + '<b>' + key + '</b>' + TAB + '[' + array.join(', ') + ']');
					}else{
						out.push('\n' + indent + '<b>' + key + '</b>' + TAB + createProxyObject(value, indent + TAB));
					}
				}
			}else{
				var properties:XMLList;
				if (typeof(ref) == "xml"){
					properties = ref.attributes();
				}else{
					properties = classInfo..accessor.(@access != "writeonly") + classInfo..variable;
				}
				
				for(var p:uint = 0; p < properties.length(); p++){
					var item:XML = properties[p];
					var uri:String = item.@uri.toString();
					if(uri.length == 0){
						value = ref[item.@name];
						if(value is Array){
							array = [];
							for(var j:uint = 0; j < value.length; j++)
								array[j] = createProxyObject(value[j], indent + TAB);
							out.push('\n' + indent + '<b>' + item.@name + '</b>' + TAB + '[' + array.join(', ') + ']');
						}else{
							out.push('\n' + indent + '<b>' + item.@name + '</b>' + TAB + createProxyObject(value, indent + TAB));
						}
					}
				}
			}
			return out.join('');
		}

		public function reset():void{
			properties_dg.dataProvider.removeAll();
			details_txt.htmlText = "";
		}
	}
}