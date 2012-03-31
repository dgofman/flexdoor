/**
 * @author David Gofman
 */
 
function DataGrid(classType, className, extendType) 
{
	UIComponent.call(this, classType, className, extendType);
}
DataGrid.prototype.Get = function(){ return this; };
DataGrid.prototype.required = function(){
	return ["org.flexdoor.controls::List"];
};
DataGrid.prototype.extends = function(){ 
	DataGrid.prototype = new List(DataGrid, "org.flexdoor.controls::DataGrid");
};
