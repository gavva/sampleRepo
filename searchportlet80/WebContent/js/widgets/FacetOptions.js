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
dojo.provide("widgets.FacetOptions");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit.form.RadioButton");

dojo.declare(
	"widgets.FacetOptions", [dijit._Widget, dijit._Templated],
	{
		prefix: EDR.prefix,
		imgBasePath: EDR.config.imageBaseDir,
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl("widgets", "templates/FacetOptions.html"),
		handlers: [],
		
		json: null,
		
		postCreate: function() {
			this.inherited("postCreate", arguments);
			this.showFacetYes = this._supportingWidgets[0];
			this.showFacetNo = this._supportingWidgets[1];
			if (this._autoLoad) this.loadJson();
		},		
		
		loadJson: function(json) {
			if (json == null) json = this._getNullResultsOptions();
			this.json = json;
			this.buildOptions();
		},
				
		getFormValues: function() {
			var values = dojo.formToObject(this.facetOptionsForm);
			return values;
		},
		
		validate: function(params) {
			var errors = "";
			
			if (!this.numberOfResults.isValid()) {
				errors += this.label_typeahead + " : " + this.numberOfResults.invalidMessage + "<br/><br/>";
			}
			if (!this.numberOfResults.isValid()) {
				errors += this.label_documentLabel_typeahead + " : " + this.documentLabelNumberOfResults.invalidMessage + "<br/><br/>";
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
			this["showFacet" + (this.json.showFacet == "Yes"? "Yes" : "No")].attr("checked", true);
			this.numberOfResults.attr("value", this.json.facetTypeAheadNumberOfResults);
			this.documentLabelNumberOfResults.attr("value", this.json.documentLabelTypeAheadNumberOfResults);
		},
		
		clear: function() {
		},
		
		_getNullResultsOptions: function() {
			return {
				showFacet: true
			};
		},
				
		destroy: function() {
			dojo.forEach(this.handlers, dojo.disconnect);
			this.inherited("destroy", arguments);
		},
		
		applyChanges: function() {
			// facet type ahead
			var facetTypeAhead = dijit.byId(EDR.prefix+"facetTypeAheadWidget");
			if (facetTypeAhead) {
				facetTypeAhead.maxSize = this.numberOfResults.value;
			}
			
			// show/hide facet panes
			var newValue = this.showFacetYes.attr("checked");
			var searchManager = dijit.byId(EDR.prefix+"searchManager");
			if(searchManager) {
				searchManager.setShowFacets(newValue);
				searchManager._showHideNarrowResults();
				dojo.publish("headerColumnsChanged");
			}
		},
		
		// messages
		label_typeahead: EDR.messages.facetOption_typeahead,
		label_typeahead_tooltip: EDR.messages.facetOption_tooltip_numberOfResults,
		label_documentLabel_typeahead: EDR.messages.facetOption_documentLabel_typeahead,
		label_documentLabel_typeahead_tooltip: EDR.messages.documentlabelOption_tooltip_numberOfResults,
		label_intro: EDR.messages.facetOption_intro,
		label_intro2: EDR.isAuthorized ? EDR.messages.search_options_intro_authorized : EDR.messages.search_options_intro_unauthorized,
		label_tooltip_help: EDR.messages.tooltip_help,		
		label_showfacet: EDR.messages.facetOption_show,
		label_yes: EDR.messages.common_yes,
		label_no: EDR.messages.common_no
	}
);