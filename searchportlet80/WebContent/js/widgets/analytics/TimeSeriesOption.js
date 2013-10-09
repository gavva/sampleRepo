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
dojo.provide("widgets.analytics.TimeSeriesOption");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("widgets.Button");

dojo.declare(
	"widgets.analytics.TimeSeriesOption", [dijit._Widget, dijit._Templated],
	{				
		prefix: EDR.prefix,
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl("widgets.analytics", "templates/TimeSeriesOption.html"),
		_autoLoad: false,
		handlers: [],				

		json: null,
				
		messages_preferences_analytics_timeseries_defaultTimeScale : EDR.messages.preferences_analytics_timeseries_defaultTimeScale,
		messages_preferences_analytics_timeScale_year : EDR.messages.preferences_analytics_timeScale_year,
		messages_preferences_analytics_timeScale_month : EDR.messages.preferences_analytics_timeScale_month,
		messages_preferences_analytics_timeScale_day : EDR.messages.preferences_analytics_timeScale_day,
	
		postCreate: function() {
			this.inherited("postCreate", arguments);
			if (this._autoLoad) this.loadJson();
		},
		
		loadJson: function(json) {
			if (json == null) json = this._getNullResultsOptions();
			this.json = json;
			this.buildOptions();
		},
				
		getFormValues: function() {
			var values = dojo.formToObject(this.analytcsTimeSeriesOptionsForm);
			return values;
		},
		
		validate: function(params) {
			var errors = "";
			
			if (!this.defaultTimeScale.isValid()) {
				errors += this.messages_preferences_analytics_timeseries_defaultTimeScale + " : " + this.defaultTimeScale.invalidMessage + "<br/><br/>";
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
			
			// default Time Scale
			this._buildFilteringSelect(this.defaultTimeScale,this._getDefaultTimeScaleJson(),json.defaultTimeScale.toLowerCase());
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
		
		_getDefaultTimeScaleJson: function(){
			if (this._defaultTimeScaleJson == null) {
				this._defaultTimeScaleJson = [
					{value:".year", label:this.messages_preferences_analytics_timeScale_year},
					{value:".month", label:this.messages_preferences_analytics_timeScale_month},
					{value:".day", label:this.messages_preferences_analytics_timeScale_day}
				];
			}
			return this._defaultTimeScaleJson;
		},
		
		_getNullResultsOptions: function() {
			return {
				"defaultTimeScale":'.year'
			};
		},
		
		_setFacetOptions: function(){
			
		},
		
		//after search, but before anaytics pane's refresh
		applyChanges: function(){

		},
		
		//after preferences saved
		afterSaveApplyChanges: function(json, isCollectionChanged){

		},
		
		destroy: function() {
			dojo.forEach(this.handlers, dojo.disconnect);
			this.inherited("destroy", arguments);
		}
	}
);