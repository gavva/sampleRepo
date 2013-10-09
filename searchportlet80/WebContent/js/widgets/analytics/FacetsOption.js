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
dojo.provide("widgets.analytics.FacetsOption");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit.form.ComboBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("widgets.Button");

dojo.declare(
	"widgets.analytics.FacetsOption", [dijit._Widget, dijit._Templated],
	{				
		prefix: EDR.prefix,
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl("widgets.analytics", "templates/FacetsOption.html"),
		_autoLoad: false,
		handlers: [],				
		json: null,
				
		messages_preferences_analytics_facets_numberOfResults : EDR.messages.preferences_analytics_facets_numberOfResults,
		messages_preferences_analytics_facets_defaultSortBy : EDR.messages.preferences_analytics_facets_defaultSortBy,
		messages_preferences_analytics_facets_defaultShowTarget : EDR.messages.preferences_analytics_facets_defaultShowTarget,
		messages_preferences_analytics_sortByFrequency : EDR.messages.preferences_analytics_sortByFrequency,
		messages_preferences_analytics_sortByCorrelation : EDR.messages.preferences_analytics_sortByCorrelation,
		messages_analytics_common_listTarget_keyword : EDR.messages.analytics_common_listTarget_keyword,
		messages_analytics_common_listTarget_subcategory : EDR.messages.analytics_common_listTarget_subcategory,
		
		postCreate: function() {
			this.inherited("postCreate", arguments);
			this.numberOfResults.attr("regExpGen",dojo.number.regexp);
			if (this._autoLoad) this.loadJson();
		},
		
		loadJson: function(json) {
			if (json == null) json = this._getNullResultsOptions();
			this.json = json;
			this.buildOptions();
		},
				
		getFormValues: function() {
			var values = dojo.formToObject(this.analytcsFacetsOptionsForm);
			return values;
		},
		
		validate: function(params) {
			var errors = "";
			
			if (!this.numberOfResults.isValid()) {
				errors += this.messages_preferences_analytics_facets_numberOfResults + " : " + this.numberOfResults.invalidMessage + "<br/><br/>";
			}
			if (!this.defaultSortBy.isValid()) {
				errors += this.messages_preferences_analytics_facets_defaultSortBy + " : " + this.defaultSortBy.invalidMessage + "<br/><br/>";
			}
			if (!this.defaultShowTarget.isValid()) {
				errors += this.messages_preferences_analytics_facets_defaultShowTarget + " : " + this.defaultShowTarget.invalidMessage + "<br/><br/>";
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
			
			//DefaultSortBy
			this._buildFilteringSelect(this.defaultSortBy,this._getDefaultSortByJson(),json.defaultSortBy.toLowerCase());

			//DefaultShowTarget
			this._buildFilteringSelect(this.defaultShowTarget,this._getDefaultShowTargetJson(),json.defaultShowTarget.toLowerCase());
		},
		
		_buildNumberListSelect: function(widget, json) {
			var options = new dojo.data.ItemFileWriteStore({data: {identifier: 'name', items:[]}});
			var values = json.split(",");
			for (var i=0; i<values.length; i++) {
				options.newItem({name:values[i]});
			}
		   widget.attr('store', options);
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
					{value:"frequency", label:this.messages_preferences_analytics_sortByFrequency},
					{value:"correlation", label:this.messages_preferences_analytics_sortByCorrelation}
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
		
		_getNullResultsOptions: function() {
			return {
				"numberOfResults":'100',
				"defaultSortBy":'frequency',
				"defaultShowTarget":'keywords'
			};
		},
		
		_setFacetOptions: function(){
			
		},
		
		//after preferences saved
		afterSaveApplyChanges: function(json, isCollectionChanged){
			var facetView = dijit.byId(EDR.prefix+"categoryViewId");
			facetView.verticalRowCount=json.numberOfResults;

			var activeTabId = dijit.byId(EDR.prefix+"horizontalSearchPanes").activeTabId;
			var activeWidget = dijit.byId(activeTabId);
			if(!isCollectionChanged && dijit.byId(EDR.prefix+"documentViewId")!=activeWidget){
				activeWidget.refresh();
			}
		},
		
		destroy: function() {
			dojo.forEach(this.handlers, dojo.disconnect);
			this.inherited("destroy", arguments);
		}
	}
);