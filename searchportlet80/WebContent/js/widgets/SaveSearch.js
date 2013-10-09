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
dojo.provide("widgets.SaveSearch");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit.form.CheckBox");

dojo.declare(
	"widgets.SaveSearch", [dijit._Widget, dijit._Templated],
	{				
		prefix: EDR.prefix,
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl("widgets", "templates/SaveSearch.html"),
		dialog: null,
		saveOptionChk: null,
		mode: "save", // save | edit
		url: "",
		timeout: 10000,
		handlers: [],
		
		messages_saveSearch_name_show: EDR.messages.saveSearch_name_show,
		messages_saveSearch_query_show: EDR.messages.saveSearch_query_show,
		messages_saveSearch_description_show: EDR.messages.saveSearch_description_show,
		
		postCreate: function() {
			this.inherited("postCreate", arguments);
		},
		
		startup: function() {
			this.inherited(arguments);
			this.dialog = dijit.byId(EDR.prefix+"saveSearchDialog");
//			this.saveOptionChk = this._supportingWidgets[0];
			this.handlers.push(dojo.connect(this.dialog.okButtonNode, "onClick", this, "onSave"));
//			handlers.push(dojo.connect(this.dialog.cancelButtonNode, "onClick", this, "onCancel"));
		},
		
		onSave: function() {
			if (this.mode == "save") this.save();
		},
/*		
		onCancel: function() {
		},
*/		
		save: function() {
			var params = this.getFormValues();
			if (!this.validate(params)) return;
			
			this.preSave();						
			
			var self = this;
			var args = 	{ 
				url: this.url,
				successCallback: function(response, ioArgs) {
					self.saved();
				},
				afterErrorHandlerCallback: dojo.hitch(this, this.loadErrorHandler),
				content: params,
				timeout: this.timeout,
				showProgress: false
			};
			EDR.ajax.Request.post(args);
		},
				
		preSave: function() {
		},
		
		postSave: function() {
		},
		
		saved: function() {
			dojo.publish("querySaved", [{}]);
			this.dialog.cancelFunction();
		},
		
		loadErrorHandler: function() {
		},
				
		getFormValues: function() {
			var params = dojo.formToObject(this.saveSearchForm);
//			params["saveSearchOptions"] = this.saveOptionChk.checked;
			return params;
		},
		
		validate: function(params) {
			var errors = "";
			if (params.saveSearchName == null || params.saveSearchName.length == 0) {
				errors += EDR.messages.error_savesearch_noname + "</br></br>";
			}
			if (params.saveSearchQuery == null || params.saveSearchQuery.length == 0) {
				errors += EDR.messages.error_savesearch_noquery + "</br></br>";
			}
			if (errors != "") {
				EDR.util.alert(errors);
				return false;
			}			
			return true;
		},
		
		setQuery: function(query) {
			this.mode = "save";
			var now = new Date();
			this.saveSearchName.value = "search_" + Math.floor(now / 1000);
			this.saveSearchQueryText.value = query;
			this.saveSearchDescription.value = "";
		},
		
		setValues: function(name, query, description) {
			this.mode = "edit";
			this.saveSearchName.value = name
			this.saveSearchQueryText.value = query;
			this.saveSearchDescription.value = description;
		},
		
		destroy: function() {
			dojo.forEach(this.handlers, dojo.disconnect);
			this.inherited("destroy", arguments);
		}
	}
);