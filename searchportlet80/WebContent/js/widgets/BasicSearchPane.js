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
dojo.provide("widgets.BasicSearchPane");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");

dojo.declare(
	"widgets.BasicSearchPane", [dijit._Widget, dijit._Templated],
	{				
		prefix: EDR.prefix,
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl("widgets", "templates/BasicSearchPane.html"),
//		keywords: null,
		handlers: [],
		
		// resources
		prompt_search: "",
		prompt_searchOptions: "",
		
		postCreate: function() {
			this.buildMessages();
			this.inherited("postCreate", arguments);
//			this.keywords = dijit.byId("basicKeywords");
			this.handlers.push(dojo.connect(this.keywords.textbox, "onkeypress", this, "submitOnEnter"));	
			this.handlers.push(dojo.connect(this.searchOptionsLink, "onclick", this, "showSearchOptions"));		
		},
		
		buildMessages: function() {
		},
		
		submitOnEnter: function(evt) {
			if (evt.keyCode == dojo.keys.ENTER) {
				dijit.byId(EDR.prefix+"searchPane").onSearchBtnClicked();
			}
		},
		
		showSearchOptions: function(evt) {
			var dlg = dijit.byId(EDR.prefix+"preference");
			if (dlg != null) {
				dlg.showTab(EDR.prefix+"searchOptionsTab");
				EDR.dialog.util.show(dlg);
			}
		},
		
		getFormValues: function() {
			return dojo.formToObject(this.basicSearchForm);			
		},
	
		validate: function(params, needKeywords) {
			if (params == null) params = this.getFormValues();
			
			var errors = "";
			if (needKeywords && (params.basicKeywords == null || params.basicKeywords == "")) {
				errors += EDR.messages.erros_noQueryTerms + "</br></br>";
//				this.markFieldInvalid(this.keywordErr, EDR.messages.error_Search_invalid_param, this.keywords);
			}
			return errors;
		},
		
		clearPane: function() {
			dojo.forEach(this.getDescendants(), function(widget){
				if(widget.reset) widget.reset();
			});
			this.clearError();
		},
		
		clearError: function() {
			this.markFieldValid(this.keywordErr);
		},
				
		markFieldInvalid: function(errorDiv, errorMsg, input) {
			errorDiv.innerHTML = errorMsg;
			errorDiv.className = 'error';
			if (input) input.focus;
		},
		
		markFieldValid: function(errorDiv) {
			errorDiv.innerHTML = "";
			errorDiv.className = 'noError';
		},
		
		destroy: function() {
			dojo.forEach(this.handlers, dojo.disconnect);
			this.inherited("destroy", arguments);
		}
	}
);