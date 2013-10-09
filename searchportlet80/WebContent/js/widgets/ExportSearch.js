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
dojo.provide("widgets.ExportSearch");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dojo.data.ItemFileReadStore");

dojo.declare(
	"widgets.ExportSearch", [dijit._Widget, dijit._Templated],
	{				
		prefix: EDR.prefix,
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl("widgets", "templates/ExportSearch.html"),
		dialog: null,
		url: "",
		timeout: 60000,
		handlers: [],
		
		message_export_dialog_nameLabel: EDR.messages.export_dialog_nameLabel,
		message_export_dialog_contentLabel: EDR.messages.export_dialog_contentLabel,
		message_export_dialog_contentSource: EDR.messages.export_dialog_contentSource,
		message_export_dialog_descriptionLabel: EDR.messages.export_dialog_descriptionLabel,
		message_export_dialog_schedulableLabel: EDR.messages.export_dialog_schedulableLabel,
		message_yes: EDR.messages.label_schedulable_yes,
		message_no: EDR.messages.label_schedulable_no,
		
		_storeCacheEnabled: null,
		_storeCacheDisabled: null,

		startup: function() {
			this.inherited(arguments);
			this.dialog = dijit.byId(EDR.prefix+"exportSearchDialog");
			this.handlers.push(dojo.connect(this.dialog.okButtonNode, "onClick", this, "doExport"));
			this._storeCacheEnabled = new dojo.data.ItemFileReadStore({data:
			{
				identifier: "name",
				items: [
				        	{name: "cache", label: EDR.messages.export_content_cache},
				        	{name: "none", label: EDR.messages.export_content_none},
				        	{name: "index", label: EDR.messages.export_content_index}
				        ]
			}
		});
			this._storeCacheDisabled = new dojo.data.ItemFileReadStore({data:
			{
				identifier: "name",
				items: [
				        	{name: "none", label: EDR.messages.export_content_none}
				        ]
			}
		}); 
			this.contentSourceSelect = new dijit.form.FilteringSelect({
				name: "contentSource",
				store: this._storeCacheEnabled,
				labelAttr: "label",
				searchAttr: "label",
				value: "none"
			}, dojo.byId("exportContentSourceSelect"));
		},
		
		onExport: function() {
		},
	
		doExport: function() {
			this.dialog.okButtonNode.setDisabled(true);
			
			var params = this.getFormValues();
			//if (!this.validate(params)) return;
			
			this.preExport();
			
			var self = this;
			var args = 	{ 
				url: this.url,
				successCallback: function(response, ioArgs) {
					var json = null;
					try {
						json = dojo.fromJson(response);
						self.saved(json);
						self.postExport();
					} catch (e) {
			        	self.loadErrorHandler(response, ioArgs);
			        	return;
					}					
				},
				afterErrorHandlerCallback: dojo.hitch(this, this.loadErrorHandler),
				content: params,
				timeout: this.timeout,
				showProgress: false
			};
			EDR.ajax.Request.post(args);
		},
				
		preExport: function() {
			EDR.ajax.Loading.setIsLoading(this.domNode.parentNode);
		},
		
		postExport: function() {
			EDR.ajax.Loading.clearIsLoading(this.domNode.parentNode);
		},
		
		saved: function(json) {			
			this.dialog.cancelButtonNode.setLabel(EDR.messages.K0001I_COMMON_CLOSE);			
			var result = json.result;
			var requestId = json.requestId;	
			
			var content = "";		
			if(result == "success") {
				content = EDR.messages.prompt_export.replace("{0}", requestId);
			} else {
				content = "Export failed."; 
			}
			dojo.style(this.exportSearchForm, "display", "none");
			dojo.style(this.messageDiv, "display", "block");
			this.messageDiv.innerHTML = content;	
		},
		
		changeOptionsState: function(docCacheEnabled) {
			if(docCacheEnabled) {
				this.contentSourceSelect.attr("store", this._storeCacheEnabled);
			} else {
				this.contentSourceSelect.attr("store", this._storeCacheDisabled);
			}
		},
		
		loadErrorHandler: function() {
			this.dialog.okButtonNode.setDisabled(false);
			this.dialog.cancelButtonNode.setLabel(EDR.messages.K0001I_COMMON_CANCEL);
			EDR.ajax.Loading.clearIsLoading(this.domNode.parentNode);			
		},
				
		getFormValues: function() {
			var params = dojo.formToObject(this.exportSearchForm);
//			params["saveSearchOptions"] = this.saveOptionChk.checked;
			return params;
		},
		
		validate: function(params) {
		},
		
		setName: function() {
			var now = new Date();
			this.exportSearchName.value = "results_" + Math.floor(now / 1000);
		},
		
		clear: function() {
			dojo.style(this.exportSearchForm, "display", "block");
			dojo.style(this.messageDiv, "display", "none");
			this.dialog.okButtonNode.setDisabled(false);
			this.dialog.cancelButtonNode.setLabel(EDR.messages.K0001I_COMMON_CANCEL);
			this.description.value = "";		
			this.setName();	
		},

		destroy: function() {
			dojo.forEach(this.handlers, dojo.disconnect);
			this.inherited("destroy", arguments);
		}
	}
);