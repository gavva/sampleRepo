//*********************** ES COPYRIGHT START  *********************************
// @copyright(external)
// 
// Licensed Materials - Property of IBM
// 5724-Z21
// (C) Copyright IBM Corp. 2003, 2012.
// 
// US Government Users Restricted Rights - Use, 
// duplication or disclosure restricted by GSA ADP 
// Schedule Contract with IBM Corp.
// 
// IBM grants you ("Licensee") a non-exclusive, royalty free, license to use,
// copy and redistribute the Non-Sample Header file software in source and
// binary code form, provided that i) this copyright notice, license and
// disclaimer  appear on all copies of the software; and ii) Licensee does
// not utilize the software in a manner which is disparaging to IBM.
// 
// This software is provided "AS IS."  IBM and its Suppliers and Licensors
// expressly disclaim all warranties, whether  EXPRESS OR IMPLIED, INCLUDING
// ANY IMPLIED WARRANTY OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE
// OR WARRANTY OF  NON-INFRINGEMENT.  IBM AND ITS SUPPLIERS AND  LICENSORS
// SHALL NOT BE LIABLE FOR ANY DAMAGES SUFFERED BY LICENSEE THAT RESULT FROM
// USE OR DISTRIBUTION OF THE SOFTWARE OR THE COMBINATION OF THE SOFTWARE
// WITH ANY OTHER CODE.  IN NO EVENT WILL IBM OR ITS SUPPLIERS  AND LICENSORS
// BE LIABLE FOR ANY LOST REVENUE, PROFIT OR DATA, OR FOR DIRECT, INDIRECT,
// SPECIAL, CONSEQUENTIAL, INCIDENTAL OR PUNITIVE DAMAGES, HOWEVER CAUSED AND
// REGARDLESS OF THE THEORY OF LIABILITY, ARISING OUT OF THE USE OF OR
// INABILITY TO USE SOFTWARE, EVEN IF IBM HAS BEEN ADVISED OF THE POSSIBILITY
// OF SUCH DAMAGES.
// 
// @endCopyright
//*********************** ES COPYRIGHT END  ***********************************
dojo.provide("widgets.analytics.FacetPairsOption");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit.form.NumberSpinner");
dojo.require("dijit.form.ComboBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("widgets.Button");

dojo.declare(
	"widgets.analytics.FacetPairsOption", [dijit._Widget, dijit._Templated],
	{				
		prefix: EDR.prefix,
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl("widgets.analytics", "templates/FacetPairsOption.html"),
		_autoLoad: false,
		handlers: [],				

		json: null,
				
		postCreate: function() {
			this.inherited("postCreate", arguments);

			this.numberOfRowResults.attr("regExpGen",dojo.number.regexp);
			this.numberOfColumnResults.attr("regExpGen",dojo.number.regexp);
//			this.numberOfRowsInTable.attr("regExpGen",dojo.number.regexp);
//			this.numberOfColumnsInTable.attr("regExpGen",dojo.number.regexp);
			if (this._autoLoad) this.loadJson();
		},		
		
		loadJson: function(json) {
			if (json == null) json = this._getNullResultsOptions();
			this.json = json;
			this.buildOptions();
		},
				
		getFormValues: function() {
			var values = dojo.formToObject(this.analytcsFacetPairsOptionsForm);
			return values;
		},
		
		validate: function(params) {
			var errors = "";
			
			if (!this.defaultView.isValid()) {
				errors += this.messages_preferences_analytics_facetPairs_defaultView + " : " + this.defaultView.invalidMessage + "<br/><br/>";
			}
			if (!this.numberOfRowResults.isValid()) {
				errors += this.messages_preferences_analytics_facetPairs_numberOfRowResults + " : " + this.numberOfRowResults.invalidMessage + "<br/><br/>";
			}
//			if (!this.numberOfRowsInTable.isValid()) {
//				errors += this.messages_preferences_analytics_facetPairs_numberOfRowsInTable + " : " + this.numberOfRowsInTable.invalidMessage + "<br/><br/>";
//			}
			if (!this.numberOfColumnResults.isValid()) {
				errors += this.messages_preferences_analytics_facetPairs_numberOfColumnResults + " : " + this.numberOfColumnResults.invalidMessage + "<br/><br/>";
			}
//			if (!this.numberOfColumnsInTable.isValid()) {
//				errors += this.messages_preferences_analytics_facetPairs_numberOfColumnsInTable + " : " + this.numberOfColumnsInTable.invalidMessage + "<br/><br/>";
//			}
			if (!this.defaultRowShowTarget.isValid()) {
				errors += this.messages_preferences_analytics_facetPairs_defaultRowShowTarget + " : " + this.defaultRowShowTarget.invalidMessage + "<br/><br/>";
			}
			if (!this.defaultColumnShowTarget.isValid()) {
				errors += this.messages_preferences_analytics_facetPairs_defaultColumnShowTarget + " : " + this.defaultColumnShowTarget.invalidMessage + "<br/><br/>";
			}
			if (!this.defaultListSortBy.isValid()) {
				errors += this.messages_preferences_analytics_facetPairs_defaultListSortBy + " : " + this.defaultListSortBy.invalidMessage + "<br/><br/>";
			}
//			if (!this.defaultRowSortBy.isValid()) {
//				errors += this.messages_preferences_analytics_facetPairs_defaultRowSortBy + " : " + this.defaultRowSortBy.invalidMessage + "<br/><br/>";
//			}
//			if (!this.defaultColumnSortBy.isValid()) {
//				errors += this.messages_preferences_analytics_facetPairs_defaultColumnSortBy + " : " + this.defaultColumnSortBy.invalidMessage + "<br/><br/>";
//			}
			
			if (errors != "") {
				EDR.util.alert(errors);
				return false;
			}			
			return true;
		},
		
		buildOptions: function() {
			if (this.json == null) return;			
			this.clear();
			var json = this.json;
			//numberOfRowResults
			this._buildNumberListSelect(this.numberOfRowResults, json.numberOfRowResultsList);
			dojo.attr(this.numberOfRowResults,"value", json.numberOfRowResults);
			
			//numberOfRowsInTable
//			this._buildNumberListSelect(this.numberOfRowsInTable, json.numberOfRowsInTableList);
//			dojo.attr(this.numberOfRowsInTable,"value", json.numberOfRowsInTable);
			
			//numberOfColumnResults
			this._buildNumberListSelect(this.numberOfColumnResults, json.numberOfColumnResultsList);
			dojo.attr(this.numberOfColumnResults,"value", json.numberOfColumnResults);
			
			//numberOfColumnsInTable
//			this._buildNumberListSelect(this.numberOfColumnsInTable, json.numberOfColumnsInTableList);
//			dojo.attr(this.numberOfColumnsInTable,"value", json.numberOfColumnsInTable);
			
			//defaultRowShowTarget
			this._buildFilteringSelect(this.defaultRowShowTarget,this._getDefaultRowShowTargetJson(),json.defaultRowShowTarget.toLowerCase());
			
			//defaultColumnShowTarget
			this._buildFilteringSelect(this.defaultColumnShowTarget,this._getDefaultColumnShowTargetJson(),json.defaultColumnShowTarget.toLowerCase());
			
			//defaultListSortBy
			this._buildFilteringSelect(this.defaultListSortBy,this._getDefaultListSortByJson(),json.defaultListSortBy.toLowerCase());
			
			//defaultRowSortBy
//			this._buildFilteringSelect(this.defaultRowSortBy,this._getDefaultRowSortByJson(),json.defaultRowSortBy.toLowerCase());
			
			//defaultColumnSortBy
//			this._buildFilteringSelect(this.defaultColumnSortBy,this._getDefaultColumnSortSortByJson(),json.defaultColumnSortBy.toLowerCase());
			
			//defaultView
			this._buildFilteringSelect(this.defaultView,this._getDefaultViewJson(),json.defaultView.toLowerCase());
		},
	
		_buildFilteringSelect: function(filteringWidget, json, value){
			var store = new dojo.data.ItemFileReadStore({data:{
				 identifier:"value",
				 items:json
			}});
			filteringWidget.attr("store", store);
			for (var i=0; i<json.length; i++) {
				var item = json[i];
				if (item.value == value) {
					filteringWidget.attr("value", item.value);
					break;
				}
			}			
		},
		
		clear: function() {

		},
		
		_getDefaultListSortByJson: function(){
			if (this._defaultListSortByJson == null) {
				this._defaultListSortByJson = [
					{value:"frequency", label:this.messages_preferences_analytics_sortByFrequency},
					{value:"correlation", label:this.messages_preferences_analytics_sortByCorrelation}
				];
			}
			return this._defaultListSortByJson;
		},
		
		_getDefaultRowSortByJson: function(){
			if (this._defaultRowSortByJson == null) {
				this._defaultRowSortByJson = this._getDefaultTableSortByArray();
			}
			return this._defaultRowSortByJson;
		},
		
		_getDefaultColumnSortSortByJson: function(){
			if (this._defaultColumnSortSortByJson == null) {
				this._defaultColumnSortSortByJson = this._getDefaultTableSortByArray();
			}
			return this._defaultColumnSortSortByJson;
		},
		
		_getDefaultTableSortByArray: function(){
			return [
					{value:"alphabetical", label:this.messages_preferences_analytics_sortByAlphabetical},
					{value:"frequency", label:this.messages_preferences_analytics_sortByFrequency},
					{value:"correlation", label:this.messages_preferences_analytics_sortByCorrelation}
				];
		},
		
		_getDefaultRowShowTargetJson: function(){
			if (this._defaultRowShowTargetJson == null) {
				this._defaultRowShowTargetJson = this._getDefaultShowTargetArray();
			}
			return this._defaultRowShowTargetJson;
		},
		
		_getDefaultColumnShowTargetJson: function(){
			if (this._defaultColumnShowTargetJson == null) {
				this._defaultColumnShowTargetJson = this._getDefaultShowTargetArray();
			}
			return this._defaultColumnShowTargetJson;
		},
		
		_getDefaultShowTargetArray: function(){
			return [
					{value:"keywords", label:this.messages_analytics_common_listTarget_keyword},
					{value:"subfacets", label:this.messages_analytics_common_listTarget_subcategory}
				];
		},
		
		_getDefaultViewJson: function(){
			if (this._defaultViewJson == null) {
				this._defaultViewJson = [
					{value:"table", label:this.messages_preferences_analytics_facetPairs_defaultView_flat},
					{value:"bird", label:this.messages_preferences_analytics_facetPairs_defaultView_grid},
					{value:"grid", label:this.messages_preferences_analytics_facetPairs_defaultView_table}
				];
			}
			return this._defaultViewJson;
		},
		
		_buildNumberListSelect: function(widget, json) {
			var options = new dojo.data.ItemFileWriteStore({data: {identifier: 'name', items:[]}});
			var values = json.split(",");
			for (var i=0; i<values.length; i++) {
				options.newItem({name:values[i]});
			}
		   widget.attr('store', options);
		},
		
		_getNullResultsOptions: function() {
			return {
				"numberOfRowResults":'100',
				"numberOfRowsInTable":'15',
				"numberOfColumnResults":'100',
				"numberOfColumnsInTable":'15',
				"defaultRowShowTarget":'keywords',
				"defaultColumnShowTarget":'keywords',
				"defaultListSortBy":'frequency',
				"defaultRowSortBy":'alphabetical',
				"defaultColumnSortBy":'alphabetical',
				"defaultView":'table'
			};
		},

		//after preferences saved
		afterSaveApplyChanges: function(json, isCollectionChanged){
			var twodmapView = dijit.byId(EDR.prefix+"twoDMapViewId");
			twodmapView.verticalRowCount=json.numberOfRowResults;
			twodmapView.horizontalRowCount=json.numberOfColumnResults;
//			twodmapView.setTableDimension(json.numberOfRowsInTable, json.numberOfColumnsInTable);
			var activeTabId = dijit.byId(EDR.prefix+"horizontalSearchPanes").activeTabId;
			var activeWidget = dijit.byId(activeTabId);
			if(!isCollectionChanged && dijit.byId(EDR.prefix+"documentViewId")!=activeWidget){
				activeWidget.refresh();
			}
		},
		
		destroy: function() {
			dojo.forEach(this.handlers, dojo.disconnect);
			this.inherited("destroy", arguments);
		},
		
		messages_preferences_analytics_facetPairs_numberOfRowResults : EDR.messages.preferences_analytics_facetPairs_numberOfRowResults,
		messages_preferences_analytics_facetPairs_numberOfRowsInTable : EDR.messages.preferences_analytics_facetPairs_numberOfRowsInTable,
		messages_preferences_analytics_facetPairs_numberOfColumnResults : EDR.messages.preferences_analytics_facetPairs_numberOfColumnResults,
		messages_preferences_analytics_facetPairs_numberOfColumnsInTable : EDR.messages.preferences_analytics_facetPairs_numberOfColumnsInTable,
		messages_preferences_analytics_facetPairs_defaultRowShowTarget : EDR.messages.preferences_analytics_facetPairs_defaultRowShowTarget,
		messages_preferences_analytics_facetPairs_defaultColumnShowTarget : EDR.messages.preferences_analytics_facetPairs_defaultColumnShowTarget,
		messages_analytics_common_listTarget_keyword : EDR.messages.analytics_common_listTarget_keyword,
		messages_analytics_common_listTarget_subcategory : EDR.messages.analytics_common_listTarget_subcategory,
		messages_preferences_analytics_facetPairs_defaultListSortBy : EDR.messages.preferences_analytics_facetPairs_defaultListSortBy,
		messages_preferences_analytics_facetPairs_defaultRowSortBy : EDR.messages.preferences_analytics_facetPairs_defaultRowSortBy,
		messages_preferences_analytics_facetPairs_defaultColumnSortBy : EDR.messages.preferences_analytics_facetPairs_defaultColumnSortBy,
		messages_preferences_analytics_facetPairs_defaultView : EDR.messages.preferences_analytics_facetPairs_defaultView,
		messages_preferences_analytics_facetPairs_defaultView_flat : EDR.messages.preferences_analytics_facetPairs_defaultView_flat,
		messages_preferences_analytics_facetPairs_defaultView_grid : EDR.messages.preferences_analytics_facetPairs_defaultView_grid,
		messages_preferences_analytics_facetPairs_defaultView_table : EDR.messages.preferences_analytics_facetPairs_defaultView_table,
		messages_preferences_analytics_sortByFrequency : EDR.messages.preferences_analytics_sortByFrequency,
		messages_preferences_analytics_sortByCorrelation : EDR.messages.preferences_analytics_sortByCorrelation,
		messages_preferences_analytics_sortByAlphabetical : EDR.messages.preferences_analytics_sortByAlphabetical,

		dummy: ""
	}
);