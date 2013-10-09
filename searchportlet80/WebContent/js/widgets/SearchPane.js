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
dojo.provide("widgets.SearchPane");

dojo.require("dijit.layout._LayoutWidget");
dojo.require("dijit._Templated");
dojo.require("dijit.form.CheckBox");
dojo.require("widgets.QueryTextBox");
dojo.require("widgets.SlideTabContainer");
dojo.require("widgets.SlideTabContent");
dojo.require("widgets.Button");

dojo.declare(
	"widgets.SearchPane", [dijit.layout._LayoutWidget, dijit._Templated],
	{
		prefix: EDR.prefix,
		imgBasePath: EDR.config.imageBaseDir,
		
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl("widgets", "templates/SearchPane.html"),
		
		slideTabContainer: null,
		queryTextBox: null,
		submitButton: null,
		clearButton: null,
		advSearch: null,
		loadSearch: null,
		searchOption: null,
		
		inAnimation: false,
		maxInputWidth: 750,
		
		handlers: [],
		
		postCreate: function() {
			this.inherited("postCreate", arguments);
		},
		
		startup: function() {
			this.inherited("startup", arguments);
			
			this.slideTabContainer = this.getChildren()[0];
			this.queryTextBox = this._supportingWidgets[0];
			this.submitButton = this._supportingWidgets[1];
			this.clearButton = this._supportingWidgets[2];
			this.searchTypeChk = this._supportingWidgets[3];
			this.advSearch = dijit.byId(EDR.prefix+"advancedSearchPane");
			
			var top = ((dojo.isIE <= 7) ? "1px" : "0px");

			dojo.style(this.containerNode, "position", "relative");
			dojo.style(this.containerNode,  "top", top);
				
			if (EDR.isTextAnalyticsEnabled) {
				dojo.style(this.queryTextBox.domNode, "height", "65px");	
				dojo.style(this.rightSpace, "paddingTop", "22px");
				dojo.style(this.helpLink, "paddingTop", "26px");
			} else {
				dojo.style(this.helpLink, "visibility", "hidden");
			}
			
			this.handlers.push(dojo.connect(this.slideTabContainer, "onTabAnimate", this, "onTabAnimate"));
			this.handlers.push(dojo.connect(this.slideTabContainer, "afterOpen", this, "onTabAnimationEnd"));
			this.handlers.push(dojo.connect(this.slideTabContainer, "afterClose", this, "onTabAnimationEnd"));
			
			dojo.subscribe("collectionChanged", this, function() { 
				var result = dijit.byId(EDR.prefix+"searchManager").getSearchResult()
				var query = "";
				if (EDR.isTextAnalyticsEnabled) {
					query = "*:*";
				} else {
					query = result != null ? result.query : "";
					if (query == null || query == "") return;
					return;
				}
				dijit.byId(EDR.prefix+"searchManager").submitQuickKeywordSearch(query);
			});
			dojo.subscribe("preferenceChanged", this, function() {
				if (!EDR.isTextAnalyticsEnabled) return;
				
				var result = dijit.byId(EDR.prefix+"searchManager").getSearchResult()
				var query = query = result != null ? result.query : "";
				if (query == "" || query == null) query = "*:*";
				dijit.byId(EDR.prefix+"searchManager").submitQuickKeywordSearch(query);
			});			
			dojo.subscribe("preLoad", this, function() { this.setSearchType("search"); });
			dojo.subscribe("refresh", this, "refresh");
			
			var typeAhead = dijit.byId(EDR.prefix+"typeAheadWidget");
			if(typeAhead){
				var input = EDR.isTextAnalyticsEnabled ? this.queryTextBox.textArea : this.queryTextBox.textInput;
				if(input!=null){
					var self = this;
					self.handlers.push(dojo.connect(input,"onfocus",typeAhead,function(e){
						typeAhead.attach(input.id,EDR.contextPath + "/typeAhead?action=getSearchTypeAheadKeywords", true);
						//override
						typeAhead.onExecute = function(e, value){
							if(e.type=="click"){
								self.submitSearch();
							}
						}
					}));
				}
			}
		},
		
		showQueryArea: function() {
			EDR.isQueryAreaHidden = false;
			dojo.style(this.queryArea, "display", "block");
			dojo.style(this.noQueryArea, "display", "none");
			var searchPane = dijit.byId(EDR.prefix+"horizontalSearchPanes");
			searchPane.resultToolbar.toggleShowHideAreaButton(false);
			searchPane.resultBottomBar.show();
			dijit.byId(EDR.prefix+"topBorderContainer").resize();
		},
		
		hideQueryArea: function() {
			EDR.isQueryAreaHidden = true;
			dojo.style(this.queryArea, "display", "none");
			dojo.style(this.noQueryArea, "display", "block");
			var searchPane = dijit.byId(EDR.prefix+"horizontalSearchPanes");
			searchPane.resultToolbar.toggleShowHideAreaButton(true);
			dojo.style(searchPane.resultBottomBar.domNode, "display", "none");
			dijit.byId(EDR.prefix+"topBorderContainer").resize();
		},
		
		submitSearch: function() {
			var params = this.getFormValues();
			if (this.validate(params)) {
				dijit.byId(EDR.prefix+"searchManager").submitSearch(null, this.getSearchType(), params);
				//if (this.isAdvancedSearch()) dijit.byId(EDR.prefix+"advSearchTab").close();
			}
		},
		
		getFormValues: function() {
			var params = {};
			params.keywords = this.queryTextBox.getFullQuery();
//			params.filterBy = this.paramFilterBy.value;
			
			// advanced search parameters
			if (this.isAdvancedSearch()) {
				dojo.mixin(params, this.advSearch.getFormValues());
			}
/*			
			// facet parameters
			var facetTree = dijit.byId(EDR.prefix+"facetTree");
			if (facetTree != null) {
				params = dojo.mixin(params, facetTree.getFormValues());
			}
*/			
			return params;
		},
		
		validate: function(params) {
			// at first, clear errors all previous error messages
			this.advSearch.clearError();
			
			var needKeywords = true;
//				(params.andfacet == null || params.andfacet.length == 0) &&
//				(params.notfacet == null || params.notfacet.length == 0);

			var errors = "";			
			if (this.isAdvancedSearch()) {
				errors = this.advSearch.validate(params, needKeywords);
			} else if (needKeywords) {
				if (params.keywords == null || params.keywords == "")
					errors = EDR.messages.erros_noQueryTerms + "</br></br>";
			}
			if (errors != "") {
				EDR.util.alert(errors);
				return false;
			}			
			return true;
		},
		
		refresh: function() {
			this.reset();
			var query = dijit.byId(EDR.prefix+"searchManager").getSearchResult().query;
			if (query != null && query.length > 0) {
				this.searchTypeChk.setDisabled(false);
				dojo.style(this.withinResultsLabel, "color", "black");
			} else {
				this.searchTypeChk.setDisabled(true);
				dojo.style(this.withinResultsLabel, "color", "gray");
			}
			this.queryTextBox.setFullQuery(query);
		},
		
		reset: function() {
			this.queryTextBox.reset();
			this.advSearch.reset();
		},
		
		getSearchType: function() {
			return this.searchTypeChk.checked ? "refineSearch" : "search";
		},
		
		setSearchType: function(type) {
			if (type == "refineSearch") {
//				this.queryTextBox.setFullQuery("");
			}
			this.searchTypeChk.attr("checked", type == "refineSearch");
		},
		
		isAdvancedSearch: function() {
			var openedPane = this.slideTabContainer.currentPane;
			return openedPane != null && openedPane.id == (EDR.prefix+"advSearchTab");
		},
		
		isAdvancedSearchOptionsEnabled: function() {
			return this.isAdvancedSearch() && this.advSearch.showOption;
		},
				
		resize: function(changeSize, resultSize) {
			var width = this.domNode.clientWidth;
			var wl = Math.floor(width*0.10);
			var wr = Math.floor(width*0.20);
			var wm = width - (wl + wr);
			var delta = wm - this.maxInputWidth;
			if (delta > 0) {
				wm = this.maxInputWidth;
				wl += delta / 2 - 1;
				wr += delta / 2 - 1;
			}
						
			dojo.marginBox(this.leftSpace, {w: wl});
			dojo.marginBox(this.middleSpace, {w: wm});
			//dojo.marginBox(this.rightSpace, {w: wr});
			
			// slideTabContainer is already resized?
			if (this.inAnimation) return;
			
			this.layout();
		},
		
		layout: function() {
			this.slideTabContainer.resize();
		},
		
		relayoutTopContainer: function() {
			// force to relayout top level container			
			this.slideTabContainer.resize();
			dijit.byId(EDR.prefix+"topBorderContainer").layout();			
		},
		
		onSearchButtonClicked: function(evt) {
			this.submitSearch();
		},
		
		onClearButtonClicked: function(evt) {
			this.reset();
			if (EDR.isTextAnalyticsEnabled) {
				dijit.byId(EDR.prefix+"searchManager").submitQuickKeywordSearch("*:*");		
				//dijit.byId(EDR.prefix+"categoryTree").unselectAll();
			}
		},
				
		onTabAnimate: function() {
			this.inAnimation = true;	
			this.relayoutTopContainer();		
		},
		
		onTabAnimationEnd: function(id, anim) {
			this.inAnimation = false;
			var self = this;
			setTimeout(function() { self.relayoutTopContainer(); }, 0);		
		},
		
		destroy: function() {
			dojo.forEach(this.handlers, dojo.disconnect);
			this.inherited(arguments);
		},
		
		// messages
		search_label: EDR.messages.button_search,
		clear_label: EDR.messages.button_clear,
		search_within_result: EDR.messages.prompt_searchWithinResults,
		tooltip_help_general: EDR.messages.tooltip_help_general,
		showarea_label: EDR.messages.searchpane_showqueryarea,
		messages_tooltip_searchpane_search: EDR.messages.tooltip_searchpane_search,
		messages_tooltip_searchpane_clear: EDR.messages.tooltip_searchpane_clear,
		messages_tooltip_searchpane_addsearch_link: EDR.messages.tooltip_searchpane_addsearch_link
	}
);