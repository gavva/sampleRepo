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
dojo.provide("widgets.MyProfileContent");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");

dojo.declare(
"widgets.MyProfileContent",
[dijit._Widget, dijit._Templated],
{	
	imcUrl: "",
	
	templatePath: dojo.moduleUrl("widgets", "templates/MyProfileContent.html"),
	
	imgBasePath: EDR.config.imageBaseDir,
	
	testData: '',
	
	_userPrompts: [],//array
	
	messages_myProfile_column1 : EDR.messages.myProfile_column1,
	messages_myProfile_column2 : EDR.messages.myProfile_column2,
	messages_myProfile_column3 : EDR.messages.myProfile_column3,
	messages_myProfile_column4 : EDR.messages.myProfile_column4,
	messages_errors_dialog_information: EDR.messages.errors_dialog_information,
	
	postMixInProperties: function() {
		this.imcUrl = EDR.contextPath + "/imc";
	},
	
	postCreate: function() {
		this.inherited("postCreate", arguments);

		this.credentialsTitle.innerHTML = EDR.messages.text_imc_display_label;
		this._setDescription();
	},
	
	_setDescription: function(securedSourcesPresent) {
		var message;
		var dlg = dijit.byId(EDR.prefix+"myProfileDlg");
		if(securedSourcesPresent) {
			message = EDR.messages.text_imc_display_help;
			dojo.style(this.credentialsTitle, "display", "block");
			dojo.style(this.credentialsDiv, "display", "block");
		} else {
			message = EDR.messages.text_imc_unavailable;
			dojo.style(this.credentialsTitle, "display", "none");
			dojo.style(this.credentialsDiv, "display", "none");
		}
		this.descriptionDiv.innerHTML = message;
	},
	
	startup: function() {
		this.inherited("startup", arguments);	
	},
	
	onDialogOpen: function() {
		var args = {
			url: this.imcUrl,
			handleAs: "json",
			load: dojo.hitch(this, "_onImcInfoLoaded"),
			error: dojo.hitch(this, "_onImcInfoLoadError"),
			timeout: dojo.hitch(this, "_onImcInfoLoadTimeout")
		};
		if(this.testData) {
			args.url = this.testData;
		}
		dojo.xhrGet(args);
	},
	
	onSubmit: function() {
		this._disableButtons(true);
		var args = {
			form: this.promptsForm,
			handleAs: "json",
			load: dojo.hitch(this, "_onSubmitResponseLoaded"),
			error: dojo.hitch(this, "_onSubmitResponseError"),
			timeout: dojo.hitch(this, "_onSubmitResponseTimeout")
		};
		dojo.xhrPost(args);
	},
	
	_onSubmitResponseLoaded: function(response) {
		this._disableButtons(false);
		if(response) {
			var success = response.success;
			
			if(success) {
				this._clearError();
			} else {
				var error = response.errors[0].key;
				var domain = response.errors[0].domain;
				this._showError(error, domain);
			}
		}
	},
	
	_clearError: function() {
		//clear error text and hide error div
		dojo.style(this.errorDiv, "display", "none");
		dojo.empty(this.errorDescription);
	},
	
	_showError: function(key, domain) {
		//set error message and show error div
		var key = key.replace(/\./g,"_");
		var message = EDR.messages[key];
		message = message.replace(/\{0\}/, domain);
		this.errorDescription.innerHTML = message; 
		dojo.style(this.errorDiv, "display", "block");
	},
	
	_onSubmitResponseError: function(response) {
		this._disableButtons(false);		
	},
	
	_onSubmitResponseTimeout: function(response) {
		this._disableButtons(false);		
	},	
	
	_onImcInfoLoaded: function(data) {
		var securedSourcesPresent = (data.securedSourcesPresent == "true");
		this._updateTable(data);
		this._setDescription(securedSourcesPresent);
		this._enableOkButton(securedSourcesPresent);
	},
	
	_onImcInfoLoadTimeout: function(data) {
		
	},
	_onImcInfoLoadError: function(data) {
		
	},
	
	_disableButtons: function(disable) {
		var dlg = dijit.byId(EDR.prefix+"myProfileDlg");
		if(dlg) {
			var okButton = dlg.okButtonWidget;
			var cancelButton = dlg.cancelButtonWidget;
			if(okButton) {
				okButton.setDisabled(disable);
			}
			if(cancelButton) {
				cancelButton.setDisabled(disable);
			}
		}
	},
	
	_enableOkButton: function(enable) {
		var dlg = dijit.byId(EDR.prefix+"myProfileDlg");
		if(dlg) {
			var okButton = dlg.okButtonWidget;
			if(okButton) {
				okButton.setDisabled(!enable);
			}
		}
	},
	
	
	_updateTable: function(data) {
		var tbody = this.credentialsTableBody;
		dojo.empty(tbody);
		var prompts = data.prompts;
		for(var i=0; i<prompts.length; i++) {
			var prompt = prompts[i];
			var tr = dojo.create("tr", null, tbody);
			this._renderEnabled(tr, prompt, i);
			this._renderDomain(tr, prompt, i);
			this._renderUsername(tr, prompt, i);
			this._renderPassword(tr, prompt, i);
		}
		this.hiddenCount.value = prompts.length;
	},
	
	_renderEnabled: function(tr, prompt, index) {
		var td = dojo.create("td", null, tr);
		var args = {
			name: "enabled." + index,
			type: "checkbox",
			value: "checked"
		}
		if(prompt.enabled) {
			args.checked = "checked";
		}
		var input = dojo.create("input", args, td);
		
		
	},
	
	_renderDomain: function(tr, prompt, index) {
		var td = dojo.create("td", {innerHTML: prompt.domain}, tr);
		var hidden = dojo.create("input", {type: "hidden", value: prompt.domain, name: "domain."+index}, td);
	},
	
	_renderUsername: function(tr, prompt, index) {
		var td = dojo.create("td", null, tr);
		var input = dojo.create("input", {type: "text", value:prompt.username, name: "username."+index}, td);
	},
	
	_renderPassword: function(tr, prompt, index) {
		var td = dojo.create("td", null, tr);
		var input = dojo.create("input", {type: "password", value:prompt.password, name:"password."+index}, td);
	},

	__dummy__: ''
}
);
