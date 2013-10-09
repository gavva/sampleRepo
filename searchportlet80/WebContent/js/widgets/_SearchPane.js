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
dojo.provide("widgets._SearchPane");

dojo.require("dijit.layout._LayoutWidget");
dojo.require("dijit._Templated");
dojo.require("dijit.form.CheckBox");
dojo.require("widgets.QueryTextBox");
dojo.require("widgets.SlideTabContainer");
dojo.require("widgets.SlideTabContent");
dojo.require("widgets.Button");

dojo.declare(
	"widgets._SearchPane", [dijit.layout._LayoutWidget, dijit._Templated],
	{				
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl("widgets", "templates/_SearchPane.html"),
		
		slideTabContainer: null,
		queryTextBox: null,
		submitButton: null,
		clearButton: null,
		advSearch: null,
		loadSearch: null,
		searchOption: null,
		
		inAnimation: false,
		
		handlers: [],
		
		postCreate: function() {
			this.inherited("postCreate", arguments);
		},
		
		startup: function() {
			this.inherited("startup", arguments);
			
			this.slideTabContainer = this.getChildren()[0];
//			this.loadSearch = this.slideTabContainer.getChildren()[1];
			this.queryTextBox = this._supportingWidgets[0];
			this.submitButton = this._supportingWidgets[1];
			this.clearButton = this._supportingWidgets[2];
			this.searchTypeChk = this._supportingWidgets[3];
			this.advSearch = dijit.byId(EDR.prefix+"advancedSearchPane");
			this.searchOption = dijit.byId(EDR.prefix+"searchOptions");
			
			this.handlers.push(dojo.connect(this.slideTabContainer, "onTabAnimate", this, "onTabAnimate"));
			this.handlers.push(dojo.connect(this.slideTabContainer, "afterOpen", this, "onTabAnimationEnd"));
			this.handlers.push(dojo.connect(this.slideTabContainer, "afterClose", this, "onTabAnimationEnd"));
			
			dojo.subscribe("preLoad", this, function() { this.setSearchType("search"); });
			dojo.subscribe("refresh", this, "refresh");
		},
		
		submitSearch: function() {
			var params = this.getFormValues();
			if (this.validate(params)) {
				dijit.byId(EDR.prefix+"searchManager").submitSearch(null, this.getSearchType(), params);
			}
		},
		
		getFormValues: function() {
			var params = {};
			params.keywords = this.queryTextBox.getFullQuery();
			params.filterBy = this.filterBy.value;
			
			// advanced search parameters
			if (this.isAdvancedSearch()) {
				dojo.mixin(params, this.advSearch.getFormValues());
			}
			
			// search options parameters
			params = dojo.mixin(params, this.searchOption.getFormValues());
			
			// facet parameters
			var facetTree = dijit.byId(EDR.prefix+"facetTree");
			if (facetTree != null) {
				params = dojo.mixin(params, facetTree.getFormValues());
			}
			
			return params;
		},
		
		validate: function(params) {
			// at first, clear errors all previous error messages
			this.advSearch.clearError();
			
			var needKeywords = 
				(params.andfacet == null || params.andfacet.length == 0) &&
				(params.notfacet == null || params.notfacet.length == 0);

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
			this.loadFullQuery();
		},
		
		loadFullQuery: function() {
			this.queryTextBox.load();
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
				this.queryTextBox.setFullQuery("");
			}
			this.searchTypeChk.attr("checked", type == "refineSearch");
		},
		
		isAdvancedSearch: function() {
			var openedPane = this.slideTabContainer.currentPane;
			return openedPane != null && openedPane.id == (EDR.prefix+"advSearchTab");
		},
				
		resize: function(changeSize, resultSize) {
			var width = this.domNode.clientWidth;
			var t = Math.floor(width*0.2);
			
			dojo.marginBox(this.leftSpace, {w: t});
			dojo.marginBox(this.middleSpace, {w: width - 2*t});
			dojo.marginBox(this.rightSpace, {w: t});
			
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
			// publish reset event
			dojo.publish("reset");
			this.reset();
		},
		
		onCheckBoxToggled: function() {
//			this.setSearchType(this.searchTypeChk.checked ? "search" : "refineSearch");
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
		}		
	}
);