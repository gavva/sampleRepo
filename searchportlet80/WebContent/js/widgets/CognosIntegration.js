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
dojo.provide("widgets.CognosIntegration");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit.form.ComboBox");

dojo.declare(	
	"widgets.CognosIntegration", [dijit._Widget, dijit._Templated],
	{
		idprefix: EDR.prefix+"cognos_",
		
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl("widgets", "templates/CognosIntegration.html"),
		dialog: null,
		categoryTree: null,
		url: "",
		timeout: 60000,
		handlers: [],
		
		requestName: "",
		
		startup: function() {
			this.inherited(arguments);
			this.dialog = dijit.byId(EDR.prefix+"cognosIntegrationDialog");
			this.categoryTree = dijit.byId(EDR.prefix+"categoryTree");
			dijit.byId(this.idprefix + "numOfRecord").regExpGen = dojo.number.regexp;
			dijit.byId(this.idprefix + "numOfPrimary").regExpGen = dojo.number.regexp;
			dijit.byId(this.idprefix + "numOfSecondary").regExpGen = dojo.number.regexp;
			this.handlers.push(dojo.connect(this.dialog.okButtonNode, "onClick", this, "doCognosIntegrate"));
		},
				
		doCognosIntegrate: function() {
			this.dialog.okButtonNode.setDisabled(true);
			
			var params = this.getFormValues();
			if (!this.validate(params)) return;

			this.requestName = params.cognosIntegrationId;
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
			var url = json.url;
			var content = "";	
			if(result == "success") {
/*				var url = "/cognos8/cgi-bin/cognos.cgi?b_action=cognosViewer";
				url += "&ui.action=run";
				url += "&ui.object=/content/package[@name='CCASAMPLE']/report[@name='" + this.requestName + "']";
				url += "&ui.name=" + this.requestName;
				url += "&run.outputFormat=";
				url += "&run.prompt=true";
				url = encodeURI(url);
				content += "<br/><br/>";
				content += '<a target="_blank" href="' + url + '">Open this search with Cognos</a><br /><br />';*/
				content += "Report was created by Cognos 8 BI<br/><br/>";
				content += "Please click the following URL:<br/>";
				content += '<a target="_blank" href="' + url + '">'+url+'</a><br /><br />';
			} else {
				content = this.message_error_fail; 
			}
			dojo.style(this.cognosIntegrationForm, "display", "none");
			dojo.style(this.messageDiv, "display", "block");
			this.messageDiv.innerHTML = content;
//            var iframe = dojo.create("iframe", {width: 795, height: 520, src: "loading.html"}, this.messageDiv);
//            setTimeout(dojo.hitch(this, function() {
//              if(iframe) {
//                    iframe.src = url;
//                }
//            }), 3000);
		},
		
		getFormValues: function() {
			var params = dojo.formToObject(this.cognosIntegrationForm);
/*	
			params.vertical_path = this.categoryTree.verticalFacetId;
			if (dijit.byId(activeTabId).hasHorizontalFacet) {
				params.horizontal_path = this.categoryTree.horizontalFacetId;
			} else {
				params.horizontal_path = "$" + dijit.byId(activeTabId).timeScale;		
			}
*/			
			var activeTabId = dijit.byId(EDR.prefix+"horizontalSearchPanes").activeTabId;
			if (activeTabId == EDR.prefix+"categoryViewId") {
				params.viewName = "Facets";
				params.viewURLName = "facets";
				params.vertical_path = this.categoryTree.verticalFacetId;
				params.horizontal_path = "";
				params.max_returned_secondary = "100";
			} else if (activeTabId == EDR.prefix+"timeSeriesViewId") {
				params.viewName = "Time Series";
				params.viewURLName = "timeseries";
				params.vertical_path = "$" + dijit.byId(activeTabId).timeScale;		
				params.horizontal_path = "";
				params.max_returned_secondary = "1000";
			} else if (activeTabId == EDR.prefix+"topicViewId") {
				params.viewName = "Deviations";
				params.viewURLName = "eviations";
				params.vertical_path = this.categoryTree.verticalFacetId;
				params.horizontal_path = "$" + dijit.byId(activeTabId).timeScale;		
				params.max_returned_secondary = "1000";
			} else if (activeTabId == EDR.prefix+"deltaViewId") {
				params.viewName = "Trends";
				params.viewURLName = "trends";
				params.vertical_path = this.categoryTree.verticalFacetId;
				params.horizontal_path = "$" + dijit.byId(activeTabId).timeScale;
				params.max_returned_secondary = "1000";
			} else if (activeTabId == EDR.prefix+"twoDMapViewId") {
				params.viewName = "Facet Pairs";
				params.viewURLName = "facetpairs";
				params.vertical_path = this.categoryTree.verticalFacetId;
				params.horizontal_path = this.categoryTree.horizontalFacetId;
			} else {
				return null;
			}
			params.queryURL = EDR.contextPath + "/search?action=index";
			return params;
		},
		
		validate: function(params) {
			var errors = "";
			if (!dijit.byId(this.idprefix + "numOfRecord").isValid()) {
				errors += this.message_error_maxresult + "<br/><br/>";
			}
			if (!dijit.byId(this.idprefix + "numOfPrimary").isValid()) {
				errors += this.message_error_maxrow + "<br/><br/>";
			}
			if (!dijit.byId(this.idprefix + "numOfSecondary").isValid()) {
				errors += this.message_error_maxcol + "<br/><br/>";
			}
			if (errors != "") {
				EDR.util.alert(errors);
				return false;
			}			
			return true;
		},
		
		setName: function() {
			var now = new Date();
			this.deepInspectName.value = "congnos_report_" + Math.floor(now / 1000);
		},
		
		loadErrorHandler: function() {
			this.dialog.okButtonNode.setDisabled(false);
			this.dialog.cancelButtonNode.setLabel(EDR.messages.K0001I_COMMON_CANCEL);
			EDR.ajax.Loading.clearIsLoading(this.domNode.parentNode);			
		},
		
		clear: function() {
			dojo.style(this.cognosIntegrationForm, "display", "block");
			dojo.style(this.messageDiv, "display", "none");
			this.dialog.okButtonNode.setDisabled(false);
			this.dialog.cancelButtonNode.setLabel(EDR.messages.K0001I_COMMON_CANCEL);
			var activeTabId = dijit.byId(EDR.prefix+"horizontalSearchPanes").activeTabId;
			dijit.byId(this.idprefix + "numOfRecord").attr("value", 10);
			dijit.byId(this.idprefix + "numOfPrimary").attr("value", 100);
			if(activeTabId==EDR.prefix+"categoryViewId"||activeTabId==EDR.prefix+"twoDMapViewId"){
				dijit.byId(this.idprefix + "numOfSecondary").attr("value", 100);
			}else{
				dijit.byId(this.idprefix + "numOfSecondary").attr("value", 1000);
			}
			dijit.byId(this.idprefix + "numOfSecondary").setDisabled(!dijit.byId(activeTabId).hasHorizontalFacet);
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