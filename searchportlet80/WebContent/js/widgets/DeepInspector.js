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
dojo.provide("widgets.DeepInspector");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit.form.ComboBox");

dojo.declare(
	"widgets.DeepInspector", [dijit._Widget, dijit._Templated],
	{				
		prefix: EDR.prefix,
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl("widgets", "templates/DeepInspector.html"),
		dialog: null,
		categoryTree: null,
		url: "",
		timeout: 60000,
		handlers: [],
		
		startup: function() {
			this.inherited(arguments);
			this.dialog = dijit.byId(EDR.prefix+"deepInspectionDialog");
			this.categoryTree = dijit.byId(EDR.prefix+"categoryTree");
			this.numOfRecordWidget.regExpGen = dojo.number.regexp;
			this.numOfPrimaryWidget.regExpGen = dojo.number.regexp;
			this.numOfSecondaryWidget.regExpGen = dojo.number.regexp;
			this.thresholdWidget.regExpGen = dojo.number.regexp;
			this.handlers.push(dojo.connect(this.dialog.okButtonNode, "onClick", this, "doDeepInspect"));
		},
		
		doDeepInspect: function() {
			this.dialog.okButtonNode.setDisabled(true);
			
			var params = this.getFormValues();
			if (!this.validate(params)) return;
			
			this.preLoad();
			
			var self = this;
			var args = 	{ 
				url: this.url,
				successCallback: function(response, ioArgs) {
					var json = null;
					try {
						json = dojo.fromJson(response);
						self.saved(json);
						self.postLoad();
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
				
		preLoad: function() {
			EDR.ajax.Loading.setIsLoading(this.domNode.parentNode);
		},
		
		postLoad: function() {
			EDR.ajax.Loading.clearIsLoading(this.domNode.parentNode);
		},
		
		saved: function(json) {			
			this.dialog.cancelButtonNode.setLabel(EDR.messages.K0001I_COMMON_CLOSE);			
			var result = json.result;
			var requestId = json.requestId;		
			
			var content = "";	
			if(result == "success") {
				content = EDR.messages.prompt_deepInspection.replace("{0}", requestId);
			} else {
				content = this.message_error_fail; 
			}
			dojo.style(this.deepInspectionForm, "display", "none");
			dojo.style(this.messageDiv, "display", "block");
			this.messageDiv.innerHTML = content;	
		},
		
		loadErrorHandler: function() {
			this.dialog.okButtonNode.setDisabled(false);
			this.dialog.cancelButtonNode.setLabel(EDR.messages.K0001I_COMMON_CANCEL);
			EDR.ajax.Loading.clearIsLoading(this.domNode.parentNode);			
		},
				
		getFormValues: function() {
			var params = dojo.formToObject(this.deepInspectionForm);
/*	
			params.vertical_path = this.categoryTree.verticalFacetId;
			if (dijit.byId(activeTabId).hasHorizontalFacet) {
				params.horizontal_path = this.categoryTree.horizontalFacetId;
			} else {
				params.horizontal_path = "$" + dijit.byId(activeTabId).timeScale;		
			}
*/			
			var activeTabId = dijit.byId(EDR.prefix+"horizontalSearchPanes").activeTabId;
			if (activeTabId == (EDR.prefix+"categoryViewId")) {
				params.viewName = "Facets";
				params.vertical_path = this.categoryTree.verticalFacetId;
				params.horizontal_path = "";
			} else if (activeTabId == (EDR.prefix+"timeSeriesViewId")) {
				params.viewName = "Time Series";
				params.vertical_path = "$" + dijit.byId(activeTabId).timeScale;		
				params.horizontal_path = "";
			} else if (activeTabId == (EDR.prefix+"topicViewId")) {
				params.viewName = "Deviations";
				params.vertical_path = this.categoryTree.verticalFacetId;
				params.horizontal_path = "$" + dijit.byId(activeTabId).timeScale;		
			} else if (activeTabId == (EDR.prefix+"deltaViewId")) {
				params.viewName = "Trends";
				params.vertical_path = this.categoryTree.verticalFacetId;
				params.horizontal_path = "$" + dijit.byId(activeTabId).timeScale;		
			} else if (activeTabId == (EDR.prefix+"twoDMapViewId")) {
				params.viewName = "Facet Pairs";
				params.vertical_path = this.categoryTree.verticalFacetId;
				params.horizontal_path = this.categoryTree.horizontalFacetId;
			} else {
				return null;
			}			
			return params;
		},
		
		validate: function(params) {
			var errors = "";
			if (!this.numOfRecordWidget.isValid()) {
				errors += this.message_error_maxresult + "<br/><br/>";
			}
			if (!this.numOfPrimaryWidget.isValid()) {
				errors += this.message_error_maxrow + "<br/><br/>";
			}
			if (!this.numOfSecondaryWidget.isValid()) {
				errors += this.message_error_maxcol + "<br/><br/>";
			}
			if (!this.thresholdWidget.isValid()) {
				errors += this.message_error_threshhold + "<br/><br/>";
			}
			if (errors != "") {
				EDR.util.alert(errors);
				return false;
			}			
			return true;
		},
		
		setName: function() {
			var now = new Date();
			this.deepInspectName.value = "report_" + Math.floor(now / 1000);
		},
		
		clear: function() {
			dojo.style(this.deepInspectionForm, "display", "block");
			dojo.style(this.messageDiv, "display", "none");
			this.dialog.okButtonNode.setDisabled(false);
			this.dialog.cancelButtonNode.setLabel(EDR.messages.K0001I_COMMON_CANCEL);
			
			this.numOfRecordWidget.attr("value", 10);
			this.numOfPrimaryWidget.attr("value", 100);
			this.numOfSecondaryWidget.attr("value", 100);
			this.thresholdWidget.attr("value", 5);
			
			var activeTabId = dijit.byId(EDR.prefix+"horizontalSearchPanes").activeTabId;
			this.numOfSecondaryWidget.setDisabled(!dijit.byId(activeTabId).hasHorizontalFacet);
			this.setName();	
		},

		destroy: function() {
			dojo.forEach(this.handlers, dojo.disconnect);
			this.inherited("destroy", arguments);
		},
		
		message_name: EDR.messages.deepInspector_dialog_name,
		message_maxresult: EDR.messages.deepInspector_dialog_maxresult,
		message_maxrow: EDR.messages.deepInspector_dialog_maxrow,
		message_maxcolumn: EDR.messages.deepInspector_dialog_maxcol,
		message_threshhold: EDR.messages.deepInspector_dialog_alert,
		message_schedulable: EDR.messages.deepInspector_dialog_schedulable,
		message_description: EDR.messages.deepInspector_dialog_description,
		message_sortresult: EDR.messages.deepInspector_dialog_sortresult,
		message_sortresult_frequency: EDR.messages.deepInspector_dialog_sortresult_frequency,
		message_sortresult_indexcol: EDR.messages.deepInspector_dialog_sortresult_indexcol,
		message_tooltip_maxresult: EDR.messages.tooltip_deepInspector_dialog_maxresult,
		message_tooltip_maxrow: EDR.messages.tooltip_deepInspector_dialog_maxrow,
		message_tooltip_maxcolumn: EDR.messages.tooltip_deepInspector_dialog_maxcol,
		message_tooltip_threshhold: EDR.messages.tooltip_deepInspector_dialog_alert,
		message_tooltip_schedulable: EDR.messages.tooltip_deepInspector_dialog_schedulable,
		message_tooltip_description: EDR.messages.tooltip_deepInspector_dialog_description,
		message_error_maxresult: EDR.messages.tooltip_deepInspector_error_maxresult,
		message_error_maxrow: EDR.messages.tooltip_deepInspector_error_maxrow,
		message_error_maxcol: EDR.messages.tooltip_deepInspector_error_maxcol,
		message_error_threshhold: EDR.messages.tooltip_deepInspector_error_threshhold,
		message_error_fail: EDR.messages.tooltip_deepInspector_error_fail,
		message_yes: EDR.messages.label_schedulable_yes,
		message_no: EDR.messages.label_schedulable_no
	}
);