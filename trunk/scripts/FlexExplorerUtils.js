
function runNextTest(scope, timeout){
	FlexDoor.resetRefHistory();
	if(timeout != undefined)
		Utils.pause(timeout, true);
	if(scope.currentTestIndex >= scope.tests.length){
		scope.done();
	}else{
		scope.tests[scope.currentTestIndex++]();
	}
}

function getChild(parent, type, index, visibleOnly){
	var numChildren = parent.numChildren();
	var repeatIndex = 0;
	if(index == null)
		index = 0;
	if(visibleOnly == null)
		visibleOnly = true;
	for(var i = 0; i < numChildren; i++){
		var child = parent.getChildAt(i);
		if(child.__TYPE__ == type && (visibleOnly == true && child.visible())){
			if(repeatIndex++ == index)
				return child;
		}
		FlexDoor.release(child);
	}
	//Utils.warn("Type not found: " + type + ", child index: " + index);
	return null;
}

function waitOnLoad(scope, callBack, callValidator){
	var onEnterFrameHandler = function(event){
		var loader = swfLoader.myLoader().getChildAt(0);
		var systemManager = loader.getChildAt(0);
		var swfApp = systemManager.getChildAt(0);
		if(!swfApp || swfApp.numChildren() == 0)
			return false;
		if(typeof(callValidator) == "function" && !callValidator())
			return false;
		if(typeof(callBack) == "function")
			setTimeout(Utils.delegate(scope, callBack, swfApp, swfApp.getChildAt(0)), 50);
		return true;
	};
	Utils.enterFrame(swfLoader, onEnterFrameHandler, this);
}

function openNode(nodes, label){
	Utils.log("openNode: " + label);
	var node = getNodeByAttribute(nodes, label, "label");
	tree.selectedIndex(-1);
	tree.selectedItem(node);
	if(tree.selectedIndex() == -1){
		var error = new Error("Cannot find a tree node label: " + label);
		error.name = "RuntimeError";
		throw error;
	}
	var ListEventRef = FlexDoor.getRef("mx.events.ListEvent");
	var event = FlexDoor.create(ListEventRef, ["change"]);
	tree.dispatchEvent(event);
	
	var caretIndex = tree.selectedIndex();
	var rowCount = tree.rowCount();
	var verticalScrollPosition = tree.verticalScrollPosition();
	var newVerticalScrollPosition = verticalScrollPosition;
	if(caretIndex < 0)
       newVerticalScrollPosition = 0;
    else if (caretIndex < verticalScrollPosition)
       newVerticalScrollPosition = caretIndex;
    else if (caretIndex >= verticalScrollPosition + rowCount)
       newVerticalScrollPosition = Math.min(tree.maxVerticalScrollPosition(), caretIndex - rowCount + 1);
    tree.verticalScrollPosition(newVerticalScrollPosition + 1);
	FlexDoor.release(ListEventRef);
}

function getNodeByAttribute(ref, value, attributeName){
	var items = (ref.length != undefined) ? ref : [ref];
	for(var i = 0; i < items.length; i++){
		var item = items[i];
		if(item.nodeType == FlexDoor.XML_DOCUMENT_NODE_TYPE)
			item = item.firstChild;
		if(item.nodeType == FlexDoor.XML_ELEMENT_NODE_TYPE && item.getAttribute(attributeName) == value){
			return item;
		}
	}
	return null;
}

function doEvent(control, event, pause, interval){
	control.dispatchEvent(event);
	if(interval == null)
		interval = PAUSE_INTERVAL;
	if(pause != false)
		Utils.pause(interval);
}

function doChildIndexEvent(control, index){
	var child = control.getChildAt(index);
 	doItemClickEvent(control, index, child.label());
}

function doItemClickEvent(control, index, label, type){
	if(!type) type = "itemClick";
	control.selectedIndex(index);
 	var ItemClickEventRef = FlexDoor.getRef("mx.events.ItemClickEvent");
	var event = FlexDoor.create(ItemClickEventRef, [type, false, false, label, index]);
	Utils.info("Label: " + label + ", index: " + index);
	control.dispatchEvent(event);
	Utils.pause(PAUSE_INTERVAL);
	FlexDoor.release(event);
	FlexDoor.release(ItemClickEventRef);
}

function doMenuEvent(menu, index, dataKey, type, menuBar){
	var tempHistory = FlexDoor.setRefHistory([]);
	if(!dataKey) dataKey = "label";
	if(!type) type = "itemClick";
	if(!menuBar) menuBar = null;
	menu.selectedIndex(index);
	var itemRenderer = menu.indexToItemRenderer(index);
	if(itemRenderer){
		var label, data = itemRenderer.data();
		if(data.__TYPE__ == "flash.xml::XMLDocument"){
			label = FlexDoor.getRef(data.firstChild().attributes(), dataKey);
		}else{
			label = FlexDoor.getRef(data, dataKey);
		}
	 	var MenuEventRef = FlexDoor.getRef("mx.events.MenuEvent");
		var event = FlexDoor.create(MenuEventRef, [type, false, true, menuBar, menu, data, itemRenderer, label, index]);
		Utils.info("Label: " + label + ", index: " + index);
		var rootMenu = FlexDoor.getRef(menu, "getRootMenu");
		rootMenu.dispatchEvent(event);
		Utils.pause(PAUSE_INTERVAL);
	}
	FlexDoor.resetRefHistory(tempHistory);
}

function closeAlertWindow(){
	var tempHistory = FlexDoor.setRefHistory([]);
	var MouseEventRef = FlexDoor.getRef("flash.events.MouseEvent");
	var event = FlexDoor.create(MouseEventRef, ["click"]);
	var sysManager = flexApp.systemManager();
	var numChildren = sysManager.numChildren();
	for(var i = 0; i < numChildren; i++){
		var child = sysManager.getChildAt(i);
		if(child.__TYPE__ == "mx.controls::Alert"){
			var alertForm = child.getChildAt(0);
			var button = alertForm.getChildByName("OK");
			if(button == null)
				button = alertForm.getChildByName("YES");
			button.dispatchEvent(event);
		}
	}
	FlexDoor.resetRefHistory(tempHistory);
}

//Chart Utils
function getLegendInfo(chart, styleName, showType){
  	var legendData = chart.legendData();
  	for(var l = 0; l < legendData.length; l++){
  		var legend = legendData[l];
  		var marker = legend.marker();
  		var stroke = marker.getStyle(styleName);
  		var color = stroke.color();
  		if(showType == true)
  			Utils.info(marker.__TYPE__);
  		Utils.info("Legend '" + legend.label() + "' - #" + color.toString(16));
  	}
}

function getChartInfo(chart, styleName, axis){
	if(axis == null) axis = "horizontalAxis";
  	var categoryAxis = FD.getRef(chart, axis);
  	var categoryField = categoryAxis.categoryField();
  	Utils.info(axis + " categoryField=" + categoryField);
  	var title = categoryAxis.title();
  	if(title)
  		Utils.info("CategoryAxis title=" + title);
  	var seriesList = chart.series();
  	for(var s = 0; s < seriesList.length; s++){
  		var series = seriesList[s];
  		Utils.log("Series displayName=" + series.displayName());
  		var yField = series.yField();
  		var items = FD.getRef(series, "items");
  		var info = [];
  		for(var i = 0; i < items.length; i++){
  			var seriesItem = items[i];
  			var item = seriesItem.item();
  			var seriesCategoryField = FD.getRef(item, categoryField);
  			if(axis == "horizontalAxis"){
  				info.push(seriesCategoryField + "=" + seriesItem.yValue());
  			}else{
  				info.push(seriesCategoryField + "=" + seriesItem.xValue());
  			}		
  		}
  		Utils.info(yField + ": " + info.join(", "));
  	}
  	getLegendInfo(chart, styleName);
}

function getHLOCChartInfo(chart){ //High, Low, Open, Close chart
	var categoryAxis = chart.horizontalAxis();
  	var categoryField = categoryAxis.categoryField();
  	Utils.info("horizontalAxis categoryField=" + categoryField);
  	var title = categoryAxis.title();
  	if(title)
  		Utils.info("CategoryAxis title=" + title);
  	var seriesList = chart.series();
  	for(var s = 0; s < seriesList.length; s++){
  		var series = seriesList[s];
  		var openField = series.openField();
  		var highField = series.highField(); 
        var lowField = series.lowField();
        var closeField = series.closeField();
  		var items = FD.getRef(series, "items");
  		for(var i = 0; i < items.length; i++){
			var seriesItem = items[i];
  			var openValue = seriesItem.openValue();
  			var highValue = seriesItem.highValue();
  			var lowValue = seriesItem.lowValue();
  			var closeValue = seriesItem.closeValue();
      		var date = FD.getRef(seriesItem.item(), categoryField);
  			var info = [categoryField + "=" + date,
  						openField  + "=" + openValue,
  						highField  + "=" + highValue,
  						lowField   + "=" + lowValue,
  						closeField + "=" + closeValue];
  			Utils.info(info.join(", "));
  		}
  	}
}

function getBubbleChartInfo(chart){
	var seriesList = chart.series();
  	for(var s = 0; s < seriesList.length; s++){
  		var series = seriesList[s];
  		Utils.log("Series displayName=" + series.displayName());
  		var xField = series.xField(); 
        var yField = series.yField();
  		var radiusField = series.radiusField();
  		var items = FD.getRef(series, "items");
  		for(var i = 0; i < items.length; i++){
			var seriesItem = items[i];
  			var xValue = seriesItem.xValue();
  			var yValue = seriesItem.yValue();
  			var zValue = seriesItem.zValue();
  			var info = [xField  + "=" + xValue,
  						yField  + "=" + yValue,
  						radiusField + "=" + zValue];
  			Utils.info(info.join(", "));
  		}
  	}
  	getLegendInfo(chart, "fill");
}

function getPieChatInfo(chart){
	var seriesList = chart.series();
  	for(var s = 0; s < seriesList.length; s++){
  		var series = seriesList[s];
  		var labelFunction = FD.getRef(series, "labelFunction", [FlexDoor.TYPE_IS_GETTER]);
  		var labelPosition = series.getStyle("labelPosition");
  		var field = series.field();
  		Utils.info("labelPosition=" + labelPosition);
  		var items = FD.getRef(series, "items");
  		for(var i = 0; i < items.length; i++){
  			var seriesItem = items[i];
  			var value = seriesItem.value();
  			var percentValue = seriesItem.percentValue();
  			var item = seriesItem.item();
  			var formatter = FD.getRef(labelFunction, null, [item, field, i, percentValue], false);
  			var info = [];
  			var keys = FD.getRef(item, null, [FlexDoor.TYPE_IS_TRAVERSE]);
  			for(var k = 0; k < keys.length; k++)
  				info.push(keys[k] + "=" + FD.getRef(item, keys[k]));
  			Utils.info(info.join(", "));
  			Utils.info(field + ": " + value + "=" + percentValue + "\n" + formatter);
  		}
  	}
}

function getPlotChartInfo(chart){
	var seriesList = chart.series();
  	for(var s = 0; s < seriesList.length; s++){
  		var series = seriesList[s];
  		var xField = series.xField();
  		var yField = series.yField();
  		var displayName = series.displayName();
  		Utils.info("displayName=" + displayName);
  		var items = FD.getRef(series, "items");
  		for(var i = 0; i < items.length; i++){
  			var seriesItem = items[i];
  			var item = seriesItem.item();
  			var xValue = seriesItem.xValue();
  			var yValue = seriesItem.yValue();
  			Utils.info(xField + "=" + xValue + ", " + yField + "=" + yValue);
  		}
  	}
  	getLegendInfo(chart, "fill", true);
}

function getDateTimeAxisInfo(chart){
  	var dateTimeAxis = chart.horizontalAxis();
  	var dataUnits = dateTimeAxis.dataUnits();
  	var parseFunction = FD.getRef(dateTimeAxis, "parseFunction", [FlexDoor.TYPE_IS_GETTER]);
  	Utils.info("horizontalAxis::DateTimeAxis, dataUnits=" + dataUnits);
  	var seriesList = chart.series();
  	for(var s = 0; s < seriesList.length; s++){
  		var series = seriesList[s];
  		Utils.log("Series displayName=" + series.displayName());
  		var xField = series.xField();
  		var yField = series.yField();
  		var items = FD.getRef(series, "items");
  		for(var i = 0; i < items.length; i++){
  			var seriesItem = items[i];
  			var xValue = seriesItem.xValue();
  			var yValue = seriesItem.yValue();
  			var date = FD.getRef(parseFunction, null, [xValue]);
  			var formattedDate = date.month() + 1 + "/" + date.date() + "/"+ date.fullYear();
  			Utils.info(xField + "=" + xValue + " (" + formattedDate + "), " + yField + "="+ yValue);
  		}
  	}
}