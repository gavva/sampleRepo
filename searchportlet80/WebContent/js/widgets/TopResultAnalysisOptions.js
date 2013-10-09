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
dojo.provide("widgets.TopResultAnalysisOptions");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit.form.RadioButton");

dojo.declare(
	"widgets.TopResultAnalysisOptions", [dijit._Widget, dijit._Templated],
	{				
		prefix: EDR.prefix,
		imgBasePath: EDR.config.imageBaseDir,
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl("widgets", "templates/TopResultAnalysisOptions.html"),
		handlers: [],

		json: null,
		
		postCreate: function() {
			this.inherited("postCreate", arguments);
			this.showTPAYes = this._supportingWidgets[0];
			this.showTPANo = this._supportingWidgets[1];
			if (this._autoLoad) this.loadJson();
		},		
		
		loadJson: function(json) {
			if (json == null) json = this._getNullResultsOptions();
			this.json = json;
			this.buildOptions();
		},
				
		getFormValues: function() {
			var values = dojo.formToObject(this.tpaOptionsForm);
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
			this["showTPA" + (this.json.showTPA == "Yes"? "Yes" : "No")].attr("checked", true);
		},
		
		clear: function() {
		},
		
		_getNullResultsOptions: function() {
			return {
				showTPA: true
			};
		},
				
		destroy: function() {
			dojo.forEach(this.handlers, dojo.disconnect);
			this.inherited("destroy", arguments);
		},
		
		applyChanges: function() {
			var newValue = this.showTPAYes.attr("checked");
			var searchManager = dijit.byId(EDR.prefix+"searchManager");
			if(searchManager) {
				searchManager.setShowTopResults(newValue);
				searchManager._showHideNarrowResults();
				dojo.publish("headerColumnsChanged");
			}
		},
		
		// messages
		label_intro: EDR.messages.topResultAnalysisOption_intro,
		label_intro2: EDR.isAuthorized ? EDR.messages.search_options_intro_authorized : EDR.messages.search_options_intro_unauthorized,
		label_showtpa: EDR.messages.topResultAnalysisOption_show,
		label_tooltip_help: EDR.messages.tooltip_help,		
		label_yes: EDR.messages.common_yes,
		label_no: EDR.messages.common_no
	}
);