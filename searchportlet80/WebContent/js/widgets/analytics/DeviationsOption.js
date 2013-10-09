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
dojo.provide("widgets.analytics.DeviationsOption");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit.form.NumberSpinner");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.RadioButton");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("widgets.Button");

dojo.declare(
	"widgets.analytics.DeviationsOption", [dijit._Widget, dijit._Templated],
	{				
		prefix: EDR.prefix,
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl("widgets.analytics", "templates/DeviationsOption.html"),
		_autoLoad: false,
		handlers: [],				

		json: null,
								 
		postCreate: function() {
			this.inherited("postCreate", arguments);
			this.numberOfResults.attr("regExpGen", dojo.number.regexp);
			if (this._autoLoad) this.loadJson();
		},
		
		loadJson: function(json) {
			if (json == null) json = this._getNullResultsOptions();
			this.json = json;
			this.buildOptions();
		},
				
		getFormValues: function() {
			var values = dojo.formToObject(this.analytcsDeviationsOptionsForm);
			return values;
		},
		
		validate: function(params) {
			var errors = "";
			
			if (!this.numberOfResults.isValid()) {
				errors += this.messages_preferences_analytics_deviations_numberOfResults + " : " + this.numberOfResults.invalidMessage + "<br/><br/>";
			}			
			if (!this.numberOfCharts.isValid()) {
				errors += this.messages_preferences_analytics_deviations_numberOfCharts + " : " + this.numberOfCharts.invalidMessage + "<br/><br/>";
			}
			if (!this.defaultSortBy.isValid()) {
				errors += this.messages_preferences_analytics_deviations_defaultSortBy + " : " + this.defaultSortBy.invalidMessage + "<br/><br/>";
			}
			if (!this.defaultShowTarget.isValid()) {
				errors += this.messages_preferences_analytics_deviations_defaultShowTarget + " : " + this.defaultShowTarget.invalidMessage + "<br/><br/>";
			}
			if (!this.defaultTimeScale.isValid()) {
				errors += this.messages_preferences_analytics_deviations_defaultTimeScale + " : " + this.defaultTimeScale.invalidMessage + "<br/><br/>";
			}
			if (!this.barColorOfMultiChart.isValid()) {
				errors += this.messages_preferences_analytics_deviations_barColorOfMultiChart + " : " + this.barColorOfMultiChart.invalidMessage + "<br/><br/>";
			}
			
			if (errors != "") {
				EDR.util.alert(errors);
				return false;
			}			
			return true;
		},
		
		buildOptions: function() {
			if (this.json == null) return;			
			this.clear();
			var json = this.json
			//numberOfResults
			this._buildNumberListSelect(this.numberOfResults, json.numberOfResultsList);
			dojo.attr(this.numberOfResults,"value", json.numberOfResults);
			
			//numberOfCharts
			this.numberOfCharts.attr("value",json.numberOfCharts);
			
			// showLineInChart
			this["showLineInChart" + (json.showLineInChart? "Yes" : "No")].attr("checked", true);
			
			//DefaultSortBy
			this._buildFilteringSelect(this.defaultSortBy,this._getDefaultSortByJson(),json.defaultSortBy.toLowerCase());

			//DefaultShowTarget
			this._buildFilteringSelect(this.defaultShowTarget,this._getDefaultShowTargetJson(),json.defaultShowTarget.toLowerCase());
			
			// default Time Scale
			this._buildFilteringSelect(this.defaultTimeScale,this._getDefaultTimeScaleJson(),json.defaultTimeScale.toLowerCase());
			
			//BarColorOfMultiChart 
			this._buildFilteringSelect(this.barColorOfMultiChart,this._getBarColorOfMultiChartJson(),json.barColorOfMultiChart.toLowerCase());
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
		
		_getDefaultSortByJson: function(){
			if (this._defaultSortByJson == null) {
				this._defaultSortByJson = [
					{value:"frequency", label:this.messages_common_analytics_sort_freq},
					{value:"maxindex", label:this.messages_common_analytics_sort_index},
					{value:"latestindex", label:this.messages_common_analytics_sort_latest_index},
					{value:"name_asc", label:this.messages_common_analytics_sort_ascending},
					{value:"name_dsc", label:this.messages_common_analytics_sort_descending}
				];
			}
			return this._defaultSortByJson;
		},
		
		_getDefaultShowTargetJson: function(){
			if (this._defaultShowTargetJson == null) {
				this._defaultShowTargetJson = [
					{value:"keywords", label:this.messages_analytics_common_listTarget_keyword},
					{value:"subfacets", label:this.messages_analytics_common_listTarget_subcategory}
				];
			}
			return this._defaultShowTargetJson;
		},
		
		_getDefaultTimeScaleJson: function(){
			if (this._defaultTimeScaleJson == null) {
				this._defaultTimeScaleJson = [
					{value:".year", label:this.messages_preferences_analytics_timeScale_year},
					{value:".month", label:this.messages_preferences_analytics_timeScale_month},
					{value:".day", label:this.messages_preferences_analytics_timeScale_day},
					{value:".month_of_year", label:this.messages_month_of_year},
					{value:".day_of_month", label:this.messages_day_of_month},
					{value:".day_of_week", label:this.messages_day_of_week}
				];
			}
			return this._defaultTimeScaleJson;
		},
				
		_getBarColorOfMultiChartJson: function(){
			if (this._barColorOfMultiChartJson == null) {
				this._barColorOfMultiChartJson = [
					{value:"legend", label:this.messages_preferences_analytics_barColorOfMultiChart_label_legend},
					{value:"index", label:this.messages_preferences_analytics_barColorOfMultiChart_label_index}
				];
			}
			return this._barColorOfMultiChartJson;
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
				"numberOfResults": '50',
				"numberOfCharts": '3',
				"showLineInChart": true,
				"defaultSortBy": 'frequency',
				"defaultShowTarget": 'keywords',
				"defaultTimeScale": '.year',
				"barColorOfMultiChart": 'legend'
			};
		},
		
		//after preferences saved
		afterSaveApplyChanges: function(json, isCollectionChanged){
			var deviationView = dijit.byId(EDR.prefix+"topicViewId");
			deviationView.verticalRowCount=json.numberOfResults;
			deviationView.showLineInChart = json.showLineInChart;
			deviationView.barColorOfMultiChart = json.barColorOfMultiChart;
			
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
		
		messages_preferences_analytics_deviations_numberOfCharts : EDR.messages.preferences_analytics_deviations_numberOfCharts,
		messages_preferences_analytics_deviations_numberOfResults : EDR.messages.preferences_analytics_deviations_numberOfResults,
		messages_preferences_analytics_deviations_showLineInChart : EDR.messages.preferences_analytics_deviations_showLineInChart,
		messages_preferences_analytics_deviations_defaultSortBy : EDR.messages.preferences_analytics_deviations_defaultSortBy,
		messages_preferences_analytics_deviations_defaultShowTarget : EDR.messages.preferences_analytics_deviations_defaultShowTarget,
		messages_preferences_analytics_deviations_defaultTimeScale : EDR.messages.preferences_analytics_deviations_defaultTimeScale,
		messages_preferences_analytics_deviations_barColorOfMultiChart : EDR.messages.preferences_analytics_deviations_barColorOfMultiChart,
		messages_preferences_analytics_barColorOfMultiChart_label_legend : EDR.messages.preferences_analytics_barColorOfMultiChart_label_legend,
		messages_preferences_analytics_barColorOfMultiChart_label_index : EDR.messages.preferences_analytics_barColorOfMultiChart_label_index,
		messages_preferences_analytics_label_yes : EDR.messages.preferences_analytics_label_yes,
		messages_preferences_analytics_label_no : EDR.messages.preferences_analytics_label_no,
		messages_preferences_analytics_timeScale_year : EDR.messages.preferences_analytics_timeScale_year,
		messages_preferences_analytics_timeScale_month : EDR.messages.preferences_analytics_timeScale_month,
		messages_preferences_analytics_timeScale_day : EDR.messages.preferences_analytics_timeScale_day,
		messages_common_analytics_sort_freq : EDR.messages.common_analytics_sort_freq,
		messages_common_analytics_sort_index : EDR.messages.common_analytics_sort_index,
		messages_common_analytics_sort_latest_index : EDR.messages.common_analytics_sort_latest_index,
		messages_common_analytics_sort_ascending : EDR.messages.common_analytics_sort_ascending,
		messages_common_analytics_sort_descending : EDR.messages.common_analytics_sort_descending,
		messages_analytics_common_listTarget_keyword : EDR.messages.analytics_common_listTarget_keyword,
		messages_analytics_common_listTarget_subcategory : EDR.messages.analytics_common_listTarget_subcategory,
		messages_month_of_year : EDR.messages.$_month_of_year,
		messages_day_of_month : EDR.messages.$_day_of_month,
		messages_day_of_week : EDR.messages.$_day_of_week,
		 
		dummy: ""
	}
);