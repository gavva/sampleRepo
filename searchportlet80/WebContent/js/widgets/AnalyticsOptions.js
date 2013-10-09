//*********************** ES COPYRIGHT START  *********************************
// @copyright(disclaimer)
// 
// Licensed Materials - Property of IBM
// 5724-Z21
// (C) Copyright IBM Corp. 2003, 2012
// 
// US Government Users Restricted Rights
// Use, duplication or disclosure restricted by GSA ADP Schedule
// Contract with IBM Corp.
// 
// DISCLAIMER OF WARRANTIES :
// 
// Permission is granted to copy and modify this Sample code, and to
// distribute modified versions provided that both the copyright
// notice, and this permission notice and warranty disclaimer appear
// in all copies and modified versions.
// 
// THIS SAMPLE CODE IS LICENSED TO YOU "AS-IS".
// IBM  AND ITS SUPPLIERS AND LICENSORS  DISCLAIM
// ALL WARRANTIES, EITHER EXPRESS OR IMPLIED, IN SUCH SAMPLE CODE,
// INCLUDING THE WARRANTY OF NON-INFRINGEMENT AND THE IMPLIED WARRANTIES
// OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE. IN NO EVENT
// WILL IBM OR ITS LICENSORS OR SUPPLIERS BE LIABLE FOR ANY DAMAGES ARISING
// OUT OF THE USE OF  OR INABILITY TO USE THE SAMPLE CODE, DISTRIBUTION OF
// THE SAMPLE CODE, OR COMBINATION OF THE SAMPLE CODE WITH ANY OTHER CODE.
// IN NO EVENT SHALL IBM OR ITS LICENSORS AND SUPPLIERS BE LIABLE FOR ANY
// LOST REVENUE, LOST PROFITS OR DATA, OR FOR DIRECT, INDIRECT, SPECIAL,
// CONSEQUENTIAL,INCIDENTAL OR PUNITIVE DAMAGES, HOWEVER CAUSED AND REGARDLESS
// OF THE THEORY OF LIABILITY, EVEN IF IBM OR ITS LICENSORS OR SUPPLIERS
// HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
// 
// @endCopyright
//*********************** ES COPYRIGHT END  ***********************************
dojo.provide("widgets.AnalyticsOptions");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit.form.ComboBox");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("widgets.Button");

dojo.declare(
	"widgets.AnalyticsOptions", [dijit._Widget, dijit._Templated],
	{	
		prefix: EDR.prefix,
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl("widgets", "templates/AnalyticsOptions.html"),
		_autoLoad: false,
		handlers: [],				

		json: null,
				
		postCreate: function() {
			this.inherited("postCreate", arguments);

			this.facetsResultsRange = this._supportingWidgets[0];
			this.deviationsResultsRange = this._supportingWidgets[1];
			this.trendsResultsRange = this._supportingWidgets[2];
			this.twodmapResultsVerticalRange = this._supportingWidgets[3];
			this.twodmapResultsHorizontalRange = this._supportingWidgets[4];
			
			var length = this._supportingWidgets.length;
			for(var i=0; i<length; i++){
				this._supportingWidgets[i].attr("regExpGen",dojo.number.regexp);
			}
			
			if (this._autoLoad) this.loadJson();
			
			dojo.subscribe("postLoad", this, "applyChanges");
		},		
		
		loadJson: function(json) {
			if (json == null) json = this._getNullResultsOptions();
			this.json = json;
			this.buildOptions();
		},
				
		getFormValues: function() {
			var values = dojo.formToObject(this.analytcsOptionsForm);
			return values;
		},
		
		validate: function(params) {
			var errors = "";
			if (errors != "") {
				EDR.util.alert(errors);
				return false;
			}			
			return true;
		},
		
		buildOptions: function() {
			if (this.json == null) return;			
			this.clear();
			var self = this;
			
			// result range
			self.facetsResultsRange.attr("value", self.json.facetsResultsRange);
			self.deviationsResultsRange.attr("value", self.json.deviationsResultsRange);
			self.trendsResultsRange.attr("value", self.json.trendsResultsRange);
			self.twodmapResultsVerticalRange.attr("value", self.json.twodmapResultsVerticalRange);
			self.twodmapResultsHorizontalRange.attr("value", self.json.twodmapResultsHorizontalRange);
		},
		
		clear: function() {

		},
		
		_getNullResultsOptions: function() {
			return {
				"facetsResultsRange":'20',
				"deviationsResultsRange":'10',
				"trendsResultsRange":'10',
				"twodmapResultsVerticalRange":'10',
				"twodmapResultsHorizontalRange":'10'
			};
		},
		
		_setFacetOptions: function(){
			
		},
		
		//after search, but before anaytics pane's refresh
		applyChanges: function(){
			var searchManager = dijit.byId(EDR.prefix+"searchManager");
			if(searchManager) {
				if(searchManager.isTextAnalyticsEnabled){
					var results = searchManager.getSearchResult();
					if(results) {
						var analyticsOptions = results.analyticsOptions;
						var facetView = dijit.byId(EDR.prefix+"categoryViewId");
						facetView.verticalRowCount=analyticsOptions.facetsResultsRange;
			
						var deviationView = dijit.byId(EDR.prefix+"topicViewId");
						deviationView.verticalRowCount=analyticsOptions.deviationsResultsRange;
						
						var trendView = dijit.byId(EDR.prefix+"deltaViewId");
						trendView.verticalRowCount=analyticsOptions.trendsResultsRange;
						
						var twodmapView = dijit.byId(EDR.prefix+"twoDMapViewId");
						twodmapView.verticalRowCount=analyticsOptions.twodmapResultsVerticalRange;
						twodmapView.horizontalRowCount=analyticsOptions.twodmapResultsHorizontalRange;
					}
				}
			}
		},
		
		//after preferences saved
		afterSaveApplyChanges: function(json, isCollectionChanged){
			var facetView = dijit.byId(EDR.prefix+"categoryViewId");
			facetView.verticalRowCount=json.facetsResultsRange;

			var deviationView = dijit.byId(EDR.prefix+"topicViewId");
			deviationView.verticalRowCount=json.deviationsResultsRange;
			
			var trendView = dijit.byId(EDR.prefix+"deltaViewId");
			trendView.verticalRowCount=json.trendsResultsRange;
			
			var twodmapView = dijit.byId(EDR.prefix+"twoDMapViewId");
			twodmapView.verticalRowCount=json.twodmapResultsVerticalRange;
			twodmapView.horizontalRowCount=json.twodmapResultsHorizontalRange;

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