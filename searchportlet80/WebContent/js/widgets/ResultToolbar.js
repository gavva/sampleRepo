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
dojo.provide("widgets.ResultToolbar");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit.Toolbar");
dojo.require("dijit.ToolbarSeparator");
dojo.require("dojox.form.DropDownSelect");
dojo.require("widgets.Toolbar");

dojo.declare(
"widgets.ResultToolbar",
[dijit._Widget, dijit._Templated],
{
	prefix: EDR.prefix,
	imgBasePath: EDR.config.imageBaseDir,
	testData: "",
	_testMode: false,
	
	collectionsCount: 0,
	
	widgetsInTemplate: true,

	switchDetailsButton: null,
	
	_detailsExpanded: false,
	
	_lastQuery: '',
	
	moreAmount: 5,
		
	exportEnabled: false,
	docCacheEnabled: false,
	deepInspectionEnabled: false,
	
	defaultPerPageOption : [10,25,50,100],
	filterBySelectBox: null,
	perPageSelectBox : null,
	
	_secureMode: false,
	_currentPage: -1,
	_startPage: -1,
	_endPage: -1,
	_lastPage: -1,
	
	messages_tooltip_saveSearchDialogButton: EDR.messages.tooltip_saveSearchDialogButton,
	messages_tooltip_exportButton: EDR.messages.export_button_tooltip,
	messages_tooltip_deepInspectionButton: EDR.messages.tooltip_deepInspection,	
	messages_tooltip_searcBackwardButton: EDR.messages.tooltip_searcBackwardButton,
	messages_tooltip_searcForwardButton: EDR.messages.tooltip_searcForwardButton,
	messages_tooltip_expandResults_open: EDR.messages.tooltip_expandResults_open,
	messages_tooltip_expandResults_close: EDR.messages.tooltip_expandResults_close,
	messages_tooltip_resultsFilterBy: EDR.messages.tooltip_resultsFilterBy,
	messages_tooltip_resultsPerPage: EDR.messages.tooltip_resultsPerPage,
	messages_tooltip_openConfigDialogButton: EDR.messages.tooltip_openConfigDialogButton,	
	messages_toolbars_document_type_show: EDR.messages.toolbars_document_type_show,
	messages_button_save: EDR.messages.button_save,
	messages_tooltip_documents_next: EDR.messages.tooltip_documents_next,
	messages_tooltip_documents_previous: EDR.messages.tooltip_documents_previous,
	messages_tooltip_documents_first: EDR.messages.tooltip_documents_first,
	messages_tooltip_documents_last: EDR.messages.tooltip_documents_last,
	messages_tooltip_help: EDR.messages.tooltip_help,
	messages_tooltip_show_queryarea: EDR.messages.searchpane_showqueryarea,
	messages_tooltip_hide_queryarea: EDR.messages.searchpane_hidequeryarea,
	messages_resulttoolbar_label_resultsPerPage: EDR.messages.resulttoolbar_label_resultsPerPage,
	messages_resulttoolbar_button_label_reset: EDR.messages.resulttoolbar_button_label_reset,
	messages_resulttoolbar_button_tooltip_reset: EDR.messages.resulttoolbar_button_tooltip_reset,
		
	templatePath: dojo.moduleUrl("widgets", "templates/ResultToolbar.html"),
	
	_getIconImagePath: function(name/*previous or next*/, amount/*page or more*/, type/*n(ormal),d(isable),h(ighlighted)*/) {
		var amountString = (amount == "page" ? "page" : "set");
		var typeString = "";
		if(type == "d") {
			typeString = "_d";
		} else if(type == "h") {
			typeString = "_h";
		}
		return dojo.moduleUrl("widgets", "templates/images/" + name + "_" + amountString +"12" + typeString +".png");
	},

	postCreate: function() {
		this.previousMoreImg.src = this._getIconImagePath("previous", "more", "d");
		this.previousImg.src = this._getIconImagePath("previous", "page", "d");
		this.nextImg.src = this._getIconImagePath("next", "page", "d");
		this.nextMoreImg.src = this._getIconImagePath("next", "more", "d");
	
		dojo.subscribe("postLoad", this, "_processSearchResults");
      dojo.subscribe("collectionChanged", this, "_processCollectionChanged");

		this.searchBackwardButton.connect(this.searchBackwardButton, "onClick", dojo.hitch(this, "_searchBackwardButtonClick"));
		
		this.searchForwardButton.connect(this.searchForwardButton, "onClick", dojo.hitch(this, "_searchForwardButtonClick"));
		
		var expandButton = this.expandResultsButton;
		expandButton.connect(expandButton, "onClick", dojo.hitch(this, "_expandResultsButtonClick"));
		
		var openConfigButton = this.openConfigDialogButton;
		openConfigButton.connect(openConfigButton, "onClick", dojo.hitch(this, "_openConfigDialogButtonClick"));
		
		var prevNextButtons = ["previousMoreImg", "previousImg", "nextImg", "nextMoreImg"];
		for(var i=0; i<prevNextButtons.length; ++i) {
			this.connect(this[prevNextButtons[i]], "onclick", dojo.hitch(this, "_onPrevNextButtonClick"));
			this.connect(this[prevNextButtons[i]].parentNode, "onkeypress", dojo.hitch(this, "_onPrevNextButtonEnter"));
			this.connect(this[prevNextButtons[i]], "onmouseover", dojo.hitch(this, "_onPrevNextButtonMouseOver"));
			this.connect(this[prevNextButtons[i]], "onmouseout", dojo.hitch(this, "_onPrevNextButtonMouseOut"));
		}
		
		if(this.collectionsCount < 1) {
			this._setPromptMessage(EDR.messages.text_collection_none);
		} else {
			this._setPromptMessage(EDR.messages.prompt_beforeSearch);
		}
		
//		if(EDR.isTextAnalyticsEnabled) {
//			dojo.subscribe("verticalFacetChanged", this, "_verticalFacetChanged");
//			dojo.subscribe("horizontalFacetChanged", this, "_horizontalFacetChanged");
//			this.connect(dijit.byId("verticalListTarget"), "openDropDown", dojo.hitch(this, "_onOpenDropDown") );
//			this.connect(dijit.byId("verticalListTarget"), "closeDropDown", dojo.hitch(this, "_onCloseDropDown") );
//			this.connect(dijit.byId("verticalMaxRows"), "openDropDown", dojo.hitch(this, "_onOpenDropDown") );
//			this.connect(dijit.byId("verticalMaxRows"), "closeDropDown", dojo.hitch(this, "_onCloseDropDown") );
//			this.connect(dijit.byId("horizontalListTarget"), "openDropDown", dojo.hitch(this, "_onOpenDropDown") );
//			this.connect(dijit.byId("horizontalListTarget"), "closeDropDown", dojo.hitch(this, "_onCloseDropDown") );
//			this.connect(dijit.byId("horizontalMaxRows"), "openDropDown", dojo.hitch(this, "_onOpenDropDown") );
//			this.connect(dijit.byId("horizontalMaxRows"), "closeDropDown", dojo.hitch(this, "_onCloseDropDown") );
//		}
		
		if(this.testData != "") {
			this._testMode = true;
			this._renderTestdata();
		}
		
		//document type
		var length = EDR.config.documentTypes.length;
		dojo.create("option",{value:"ALL",innerHTML:EDR.messages.toolbars_document_type_all.toUpperCase()},this.resultsFilterByNode);
		for(var i = 0 ; i < length ; i++){
			dojo.create("option",{value:EDR.config.documentTypes[i],innerHTML:EDR.config.documentTypes[i].toUpperCase()},this.resultsFilterByNode);
		}
		
		if(!EDR.isRestoreSessionResults) {
			this.filterBySelectBox = new dojox.form.DropDownSelect({onChange: function(value){
				EDR.bean.Email.switchFilterBy(value);
			}},this.resultsFilterByNode);			
		} else {
			this.filterBySelectBox = new dojox.form.DropDownSelect({onChange: function(value){
				if(!EDR.bean.Email.ignoreChange){
					EDR.bean.Email.switchFilterBy(value);
				}
			}},this.resultsFilterByNode);
			
		}
		
		this.buildResultPerPage();
		
		if (EDR.isTextAnalyticsEnabled) {
			dojo.style(this.resetSearchButton.domNode, "display", "");	
			dojo.style(this.showHideSearchAreaButton.domNode, "display", "");	
			dojo.style(this.deepInspectionDialogButton.domNode, "display", "");	
			dojo.style(this.cognosIntegrationDialogButton.domNode, "display", "");	
		} else {
			dojo.style(this.helpContainer, "display", "none");
		}
		if(dojo.isIE <= 7) {
			dojo.style(this.toolbarButtonNode,"width","360px");
		}
	},
	
	buildResultPerPage: function(){
		var perPageLength = this.defaultPerPageOption.length;
		
		for(var i = 0 ; i < perPageLength ; i++){
			dojo.create("option",{value:this.defaultPerPageOption[i], innerHTML:this.defaultPerPageOption[i]},this.resultsPerPageNode);
		}
		var configValue = EDR.config.preferences_resultsRange;
		//if there is a config value differed from default values
		if(!this.hasConfigValue(configValue)){
			var configOption = dojo.create("option",{value:configValue, innerHTML:configValue},this.resultsPerPageNode,"first");
		}
		this.perPageSelectBox = new dojox.form.DropDownSelect({id:EDR.prefix+"resultsPerPage"},this.resultsPerPageNode);
		this.perPageSelectBox.attr("value", configValue);
		
		if(!EDR.isRestoreSessionResults) {
			this.perPageSelectBox.onChange = function(value) {
				EDR.bean.Email.switchResultsPerPage(value);	
			};			
		} else {
			this.perPageSelectBox.onChange = function(value) {
				if(!EDR.bean.Email.ignoreChange) {
					EDR.bean.Email.switchResultsPerPage(value);	
				}
			};
		}
		
	},
	
	hasConfigValue: function(configValue){
		return (dojo.some(this.defaultPerPageOption, function(value) {
			return value == configValue;
		}));
	},
	
	//this method is called after preferences are saved
	updateResultPerPage: function(configValue){
		this.clearResultPerPage();
		var resultsPerPageNode = dojo.byId(EDR.prefix+"resultsPerPageSelect");
		var perPageLength = this.defaultPerPageOption.length;
		for(var i = 0 ; i < perPageLength ; i++){
			var configOption = dojo.create("option",{value:this.defaultPerPageOption[i], innerHTML:this.defaultPerPageOption[i]},resultsPerPageNode);
		}
		if(!this.hasConfigValue(configValue)){
			var configOption = dojo.create("option",{value:configValue, innerHTML:configValue},resultsPerPageNode,"first");
		}
		this.perPageSelectBox = new dojox.form.DropDownSelect({id:EDR.prefix+"resultsPerPage"},resultsPerPageNode);
		this.perPageSelectBox.attr("value", configValue);
		
		if(!EDR.isRestoreSessionResults) {
			this.perPageSelectBox.onChange = function(value) {
				EDR.bean.Email.switchResultsPerPage(value);
			};
		} else {
			this.perPageSelectBox.onChange = function(value) {
				if(!EDR.bean.Email.ignoreChange) {
					EDR.bean.Email.switchResultsPerPage(value);
				}
			};
		}
	},
	
	clearResultPerPage: function(){
		if(this.perPageSelectBox){
			this.perPageSelectBox.destroy();
			dojo.create("select",{id:EDR.prefix+"resultsPerPageSelect",dojoAttachPoint:"resultsPerPageNode"},this.resultsPerPageDiv);
		}
	},
	
//	_onOpenDropDown: function() {
//		widgets.analytics.hideAnalyticsPane();
//	},
//	
//	_onCloseDropDown: function() {
//		widgets.analytics.showAnalyticsPane();
//	},
	
	showDocumentButtons: function() {
		dojo.style(this.documentButtons, "display", "");
		dojo.style(this.resultCountRangeDiv, "visibility", "visible");
		dojo.style(this.resultCountLeftParen, "visibility", "visible");
		dojo.style(this.resultCountRightParen, "visibility", "visible");
		dojo.style(this.showHideSearchAreaButton, "display", "hidden");
		if (EDR.isTextAnalyticsEnabled && this.deepInspectionEnabled) {
			this.hideDeepInspectionButton();
		}
		if (EDR.isTextAnalyticsEnabled /*&& this.cognosIntegrationEnabled*/) {
			this.hideCognosIntegrationButton();
		}
//		dojo.style(this.analyticsButtons, "display", "none");
	},
	
	hideDocumentButtons: function() {
		dojo.style(this.documentButtons, "display", "none");
		dojo.style(this.resultCountRangeDiv, "visibility", "hidden");
		dojo.style(this.resultCountLeftParen, "visibility", "hidden");
		dojo.style(this.resultCountRightParen, "visibility", "hidden");
//		dojo.style(this.analyticsButtons, "display", "");
		if (EDR.isTextAnalyticsEnabled && this.deepInspectionEnabled) {
			this.showDeepInspectionButton();
		}
		if (EDR.isTextAnalyticsEnabled /*&& this.cognosIntegrationEnabled*/) {
			this.showCognosIntegrationButton();
		}
		if(dojo.isIE<=7){
			var td = this.pageNumbers.parentNode.parentNode;
			dojo.style(td,"width",dojo.contentBox(td).w);
			dojo.style(this.resultsPagination,dojo.contentBox(td).w);
		}
	},
	
	_showHideSearchAreaClicked: function() {
		if (EDR.isQueryAreaHidden) {
			dijit.byId(EDR.prefix+"searchPane").showQueryArea();
		} else {
			dijit.byId(EDR.prefix+"searchPane").hideQueryArea();
		}
	},
	
	toggleShowHideAreaButton: function(isHidden) {
		if (isHidden) {
			this.showHideSearchAreaButton.attr("alt", this.messages_tooltip_show_queryarea);
			this.showHideSearchAreaButton.attr("title", this.messages_tooltip_show_queryarea);
		} else {
			this.showHideSearchAreaButton.attr("alt", this.messages_tooltip_hide_queryarea);
			this.showHideSearchAreaButton.attr("title", this.messages_tooltip_hide_queryarea);
		}
	},
	
	enableDeepInspectionButton: function(enabled) {
		if (!EDR.isTextAnalyticsEnabled) return;
		this.deepInspectionEnabled = enabled;
		if (this.deepInspectionEnabled && this.documentButtons.style.display == "none") {
			this.showDeepInspectionButton();
		} else {
			this.hideDeepInspectionButton();
		}
	},
	
	showDeepInspectionButton: function() {
		dojo.style(this.deepInspectionDialogButton.domNode, "display", "");		
	},
	
	hideDeepInspectionButton: function() {
		dojo.style(this.deepInspectionDialogButton.domNode, "display", "none");		
	},
	
	showCognosIntegrationButton: function() {
		dojo.style(this.cognosIntegrationDialogButton.domNode, "display", "");		
	},
	
	hideCognosIntegrationButton: function() {
		dojo.style(this.cognosIntegrationDialogButton.domNode, "display", "none");		
	},
	
	enableExportButton: function(enabled) {
		dojo.style(this.exportSearchDialogButton.domNode, "display", enabled ? "" : "none");		
	},
	
	changeOptionsState: function(docCacheEnabled) {
		var exportSearch = dijit.byId(EDR.prefix+"exportSearchContent");
		exportSearch.changeOptionsState(docCacheEnabled);
	},
	
	changeSecureMode: function(secure) {
		this._secureMode = secure;
		
		if(this._secureMode) {
			dojo.style(this.nextMoreImg.parentNode, "display", "none");	
			dojo.style(this.previousMoreImg.parentNode, "display", "none");
			dojo.style(this.pageNumbers, "display", "none");
			dojo.style(this.resultCountAllSpan, "display", "none");
			dojo.style(this.resultCountLeftParen, "display", "none");
			dojo.style(this.resultCountRightParen, "display", "none");
		} else {
			dojo.style(this.nextMoreImg.parentNode, "display", "");	
			dojo.style(this.previousMoreImg.parentNode, "display", "");
			dojo.style(this.pageNumbers, "display", "");
			dojo.style(this.resultCountAllSpan, "display", "");
			dojo.style(this.resultCountLeftParen, "display", "");
			dojo.style(this.resultCountRightParen, "display", "");
		}
		
	},
	
	_setPromptMessage: function(message) {
		// hide other parts
		if(dojo.isIE && dojo.isIE <= 7) {
			dojo.style(this.toolbarInfo, "display", "block");
		} else {
			dojo.style(this.toolbarInfo, "display", "table-row");
		}
		dojo.style(this.toolbarBody, "display", "none");
		this.toolbarPrompt.innerHTML = message;
	},
	
	_prepareDisplayResults: function(searchResult) {
		// show hidden parts
		dojo.style(this.toolbarInfo, "display", "none");
		if(dojo.isIE && dojo.isIE <= 7) {
			dojo.style(this.toolbarBody, "display", "block");
		} else {
		dojo.style(this.toolbarBody, "display", "table-row");
		}
		
		if (this.searchBackwardButton != null) {
			this.searchBackwardButton.setDisabled(this._testMode ? false : !searchResult.hasPreviousQuery);
		}
		if (this.searchForwardButton != null) {
			this.searchForwardButton.setDisabled(this._testMode ? false : !searchResult.hasNextQuery);
		}
	},
	
	_renderTestdata: function() {
		var args = {
			url: this.testData,
			handleAs: "json",
			load: dojo.hitch(this, "_onTestdataLoadComplete")
		};
		dojo.xhrGet(args);
	},	
	
	_onTestdataLoadComplete: function(data) {
		this._prepareDisplayResults();
		this._processSearchResults_0(data);
	},
	
	_searchBackwardButtonClick: function(evt) {
		dijit.byId(EDR.prefix+"searchManager").submitPreviousSearch();
	},
	
	_searchForwardButtonClick: function(evt) {
		dijit.byId(EDR.prefix+"searchManager").submitNextSearch();
	},
	
	_expandResultsButtonClick: function(evt) {
		var button = this.expandResultsButton;
		if(this._detailsExpanded) {
			this._detailsExpanded = false;
			dojo.attr(button,"iconClass", "expandResultsIcon");
			dojo.attr(button,"alt",this.messages_tooltip_expandResults_open);
			dojo.attr(button,"title",this.messages_tooltip_expandResults_open);
		} else {
			this._detailsExpanded = true;
			dojo.attr(button,"iconClass", "collapseResultsIcon");
			dojo.attr(button,"alt",this.messages_tooltip_expandResults_close);
			dojo.attr(button,"title",this.messages_tooltip_expandResults_close);
		}
		dojo.publish("expandDetails", [this._detailsExpanded]);		
	},
	
	_openConfigDialogButtonClick: function(evt) {
		var dlg = dijit.byId(EDR.prefix+"preference");
		if(!dlg) {
			dojo.require["dojo.parser"];
			dojo.parser.parse(EDR.prefix+"preference-Container");
			dlg = dijit.byId(EDR.prefix+"preference");
		}
		dlg.showTab(EDR.prefix+"resultsOptionsTab");
		EDR.dialog.util.show(dlg);
	},
	
	openSaveDialog: function(evt) {
		var content = dijit.byId(EDR.prefix+"saveSearchContent"); 
		if(!content) {
			dojo.parser.parse(EDR.prefix+"saveSearchDialog-Container");
			content = dijit.byId(EDR.prefix+"saveSearchContent");
		}
		content.setQuery(this._lastQuery);		
		var dialog = dijit.byId(EDR.prefix+"saveSearchDialog");
		dialog.attr("title", EDR.messages.dialog_saveSearch);
		dialog.okButtonNode.setLabel(this.messages_button_save);
		dialog.okButtonNode.titleNode.title = this.messages_button_save;
		EDR.dialog.util.show(dialog);
	},
	
	openExportDialog: function(evt) {
		var dialog = dijit.byId(EDR.prefix+"exportSearchContent");
		dialog.clear();
		var dialog = dijit.byId(EDR.prefix+"exportSearchDialog");
//		dialog.attr("title", "Export This Query");
		EDR.dialog.util.show(dialog);
	},
	
	openDeepInspectionDialog: function(evt) {
		var dialog = dijit.byId(EDR.prefix+"deepInspectionContent");
		dialog.clear();
		var dialog = dijit.byId(EDR.prefix+"deepInspectionDialog");
//		dialog.attr("title", "Export This Query");
		EDR.dialog.util.show(dialog);
	},
	
	openCognosIntegrationDialog: function(evt) {
		var dialog = dijit.byId(EDR.prefix+"cognosIntegrationContent");
		dialog.clear();
		var dialog = dijit.byId(EDR.prefix+"cognosIntegrationDialog");
//		dialog.attr("title", "Export This Query");
		EDR.dialog.util.show(dialog);		
	},
	
	updateResultCount: function(start/*int*/, end/*int*/, all/*int*/, estimated/*int*/) {
		var message = EDR.messages.text_results_range;
		message = message.replace("\{0\}", start <= end ? start : end);
		message = message.replace("\{1\}", end);
		message = message.replace("\{2\}", this._secureMode ? estimated : all);
		
		var str = EDR.messages.text_results_all;
		if(EDR.isTextAnalyticsEnabled) {
			var numberOfDocs = dijit.byId(EDR.prefix+"searchManager")._numberOfDocs;
			var allString = estimated + "/" + numberOfDocs;
			str = str.replace(/\{0\}/g, allString);
		} else {
			str = str.replace(/\{0\}/g, estimated);	
		}		
		
		this.resultCountRangeDiv.innerHTML = message;
		this.resultCountAllSpan.innerHTML = str;
	},
	

	updatePageLink: function(current, start, end, hasNext, hasPrev) {
		dojo.empty(this.pageNumbers);
		for(var i = start; i<=end; i++) {
			if(i == current) {
				dojo.create("span", {className: "current", innerHTML: i, id: EDR.prefix+"results-current-page"}, this.pageNumbers);
			} else {
				var a = dojo.create("a", {innerHTML: i, id: EDR.prefix+"results-page-"+i, className: "active", href: "javascript:;"}, this.pageNumbers);
				//for IE
				a.onclick=function(){
					var num=i;
					return function(){
						EDR.bean.Email.pageThruEmails(num);
					};
				}();
			}
			dojo.place(dojo.doc.createTextNode(" "), this.pageNumbers);
		}
		if(this._secureMode) {
			this._enableNext(hasNext);
			this._enablePrev(hasPrev);
		} else {
			if(start < current) {
				this._enablePrev(true);
			} else {
				this._enablePrev(false);
			}
			if(current < end) {
				this._enableNext(true);
			} else {
				this._enableNext(false);
			}
			if(current - start > 1) {
				this._enablePrevMore(true);
			} else {
				this._enablePrevMore(false);
			}
			if(end - current > 1) {
				this._enableNextMore(true);
			} else {
				this._enableNextMore(false);
			}
		}
	},

	_enablePrev: function(flag) {
		this._enableButton(flag, "previous");
	},
	
	_enablePrevMore: function(flag) {
		this._enableButton(flag, "previous", true);
	},	
	
	_enableNext: function(flag) {
		this._enableButton(flag, "next");
	},

	_enableNextMore: function(flag) {
		this._enableButton(flag, "next", true);
	},
	
	_enableButton: function(flag, type, more) {
		var buttonImg = this[type + (more? "More":"") + "Img"];
		dojo.attr(buttonImg, "enable", flag);
		if(flag) {
			dojo.attr(buttonImg, "src", EDR.contextPath + "/images/" + type + "_" + (more? "set" : "page") + "12.png");
		} else {
			dojo.attr(buttonImg, "src", EDR.contextPath + "/images/" + type + "_" + (more? "set" : "page") + "12_d.png");
		}
	},
	
	_onPrevNextButtonMouseOver: function(evt) {
		var img = evt.target;
		if(dojo.attr(img, "enable")) {
			var type = dojo.attr(img, "buttonType");
			var more = dojo.attr(img, "amount") == "more";
			dojo.attr(img, "src", EDR.contextPath + "/images/" + type + "_" + (more? "set" : "page") + "12_h.png");
		}
	},

	_onPrevNextButtonMouseOut: function(evt) {
		var img = evt.target;
		if(dojo.attr(img, "enable")) {
			var type = dojo.attr(img, "buttonType");
			var more = dojo.attr(img, "amount") == "more";
			dojo.attr(img, "src", EDR.contextPath + "/images/" + type + "_" + (more? "set" : "page") + "12.png");			
		}
	},
	
	prevNextButtonExecute: function(img) {
		if(dojo.attr(img, "enable")) {
			var type = dojo.attr(img, "buttonType");
			var amountType = dojo.attr(img, "amount");
			var amount = 1;
//			if(amountType == "more") {
//				amount = this.moreAmount;
//			}
			var pageTo = this._currentPage;
			if(!this._secureMode) {
				if(type == "previous") {
					pageTo -= amount;
					if(pageTo < 1 || amountType == "more") {
						pageTo = 1;
					}
				} else {
					pageTo += amount;
					if(pageTo > this._lastPage || amountType == "more") {
						pageTo = this._lastPage;
					}
				}
				EDR.bean.Email.pageThruEmails(pageTo);
			} else {
				if(type == "previous") {
					pageTo = "previous";
				} else {
					pageTo = "next";
				}
				EDR.bean.Email.pageThruEmails(pageTo);
			}
		}
	},

	_onPrevNextButtonClick: function(evt) {
		this.prevNextButtonExecute(evt.target);		
	},
	
	_onPrevNextButtonEnter: function(evt) {
		if(evt.keyCode == dojo.keys.ENTER){
			this.prevNextButtonExecute(evt.target.getElementsByTagName("img")[0]);
		}
	},
	
	_processSearchResults: function(evt) {
		var m = dijit.byId(EDR.prefix+"searchManager");
		var searchResult = m.getSearchResult();
		
		this._lastQuery = searchResult.fullQuery;
		this._prepareDisplayResults(searchResult);
		this._processSearchResults_0(searchResult);
	},
	
	_processSearchResults_0: function(searchResult) {
		var availableCount = searchResult.availableNumberOfResults;
		var estimatedCount = searchResult.estimatedNumberOfResults;
		var resultsPerPage = searchResult.resultsPerPage;
		var lastPage = this._lastPage = Math.ceil(availableCount / resultsPerPage);
		
		var pageStart = searchResult.pageStartRange;
		var pageEnd = searchResult.pageEndRange;
		this.updateResultCount(pageStart + 1, pageEnd, availableCount, estimatedCount);
		
		var currentPage = this._currentPage = searchResult.currentPage;
		var startPage = this._startPage = searchResult.startPage;
		var endPage = this._endPage = searchResult.endPage;
		var hasNext = searchResult.pageEndRange - searchResult.pageStartRange >= searchResult.resultsPerPage ? true : false;
		var hasPrev = searchResult.pageStartRange > 0 ? true : false;
		this.updatePageLink(currentPage, startPage, endPage, hasNext, hasPrev);
		
		if(EDR.isRestoreSessionResults) {
			var currentPerPage = this.perPageSelectBox.attr("value");
			if(currentPerPage != searchResult.resultsPerPage) {
				EDR.bean.Email.ignoreChange = true;
				this.perPageSelectBox.attr("value", searchResult.resultsPerPage);
				EDR.bean.Email.ignoreChange = false;
			}
			
			var currentFilterType = this.filterBySelectBox.attr("value");
			if(currentFilterType != searchResult.resultsFilterType) {
				EDR.bean.Email.ignoreChange = true;
				this.filterBySelectBox.attr("value", searchResult.resultsFilterType);
				EDR.bean.Email.ignoreChange = false;
			}
		}
	},
	
	_processCollectionChanged: function() {
	   if (EDR.isTextAnalyticsEnabled) return;
      this._setPromptMessage(EDR.messages.prompt_beforeSearch);
	},
	
	_verticalFacetChanged: function(message) {
		var verticalFacetId = message.verticalFacetLabel || message.verticalFacetId;
		this.verticalFacetIdSpan.innerHTML = verticalFacetId;
	},
	
	_horizontalFacetChanged: function(message) {
		var horizontalFacetId = message.horizontalFacetLabel || message.horizontalFacetId;
		this.horizontalFacetIdSpan.innerHTML = horizontalFacetId;
	},
	
	_resetButtonClicked: function(evt) {
		dijit.byId(EDR.prefix+"searchManager").submitQuickKeywordSearch("*:*");		
		//dijit.byId(EDR.prefix+"categoryTree").unselectAll();
	},
	
	
	__dummy__: ''
});
