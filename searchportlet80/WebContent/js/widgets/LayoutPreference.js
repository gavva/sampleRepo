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
dojo.provide("widgets.LayoutPreference");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.CheckBox");

/*
	LayoutConfiguration Object
	{
		searchPane: [
			"basicSearch",
			"advancedSearch"
			...
		],
		viewLayout: 2 // 1 - 4
	}
*/

dojo.declare(
	"widgets.LayoutPreference",
	[dijit._Widget, dijit._Templated],
	{
		cookieFieldName: "ESLayoutConfig",
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl("widgets", "templates/LayoutPreference.html"),
		
		postCreate: function() {
			this.inherited("postCreate", arguments);
			var config = this.loadFromCookie();
			if (config != null) this.loadConfig(config);
		},

		loadConfig: function(config) {
			var inputs = this.viewLayoutGroup.getElementsByTagName("INPUT");
			for (var i=0; i<inputs.length; i++) {
				if (inputs[i].value == config.viewLayout) {
					dijit.byId(inputs[i].id).setValue(true);
					break;
				}
			}
			
			inputs = this.searchPaneGroup.getElementsByTagName("INPUT");
			for (var i=0; i<inputs.length; i++) {
				for (var j=0; j<config.searchPane.length; j++) {				
					if (inputs[i].value == config.searchPane[j]) {
						dijit.byId(inputs[i].id).setValue(true);
						break;
					} else if (j == (config.searchPane.length - 1)) {
						dijit.byId(inputs[i].id).setValue(false);
					}
				}
			}
		},
		
		saveToCookie: function() {
			alert("Successfully Saved");
			dojo.cookie(this.cookieFieldName, dojo.toJson(this.getCurrentConfig()), {expires: 100}); 
		},
		
		loadFromCookie: function() {
			var config = dojo.fromJson(dojo.cookie(this.cookieFieldName)); 
			if (config != null) this.loadConfig(config);
		},
		
		apply: function() {
			var config = this.getCurrentConfig();
			dijit.byId(EDR.prefix+"tabSearchContent").loadViewConfiguration(config.viewLayout);				
			dijit.byId(EDR.prefix+"searchPane").loadViewConfiguration(config.searchPane);
		},
		
		getCurrentConfig: function() {
			var config = {};			
			var inputs = this.viewLayoutGroup.getElementsByTagName("INPUT");		
			for (var i=0; i<inputs.length; i++) {
				if (inputs[i].checked) {
					config['viewLayout'] = inputs[i].value;
				}
			}
			
			var array = [];
			inputs = this.searchPaneGroup.getElementsByTagName("INPUT");
			for (var i=0; i<inputs.length; i++) {
				if (inputs[i].checked) array.push(inputs[i].value);
			}
			config['searchPane'] = array;
			
			return config;
		}
	}
);