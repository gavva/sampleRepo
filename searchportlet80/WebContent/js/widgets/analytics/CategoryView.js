//*********************** ES COPYRIGHT START  *********************************
// @copyright(external)
// 
// Licensed Materials - Property of IBM
// 5724-Z21
// (C) Copyright IBM Corp. 2003, 2012.
// 
// US Government Users Restricted Rights - Use, 
// duplication or disclosure restricted by GSA ADP 
// Schedule Contract with IBM Corp.
// 
// IBM grants you ("Licensee") a non-exclusive, royalty free, license to use,
// copy and redistribute the Non-Sample Header file software in source and
// binary code form, provided that i) this copyright notice, license and
// disclaimer  appear on all copies of the software; and ii) Licensee does
// not utilize the software in a manner which is disparaging to IBM.
// 
// This software is provided "AS IS."  IBM and its Suppliers and Licensors
// expressly disclaim all warranties, whether  EXPRESS OR IMPLIED, INCLUDING
// ANY IMPLIED WARRANTY OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE
// OR WARRANTY OF  NON-INFRINGEMENT.  IBM AND ITS SUPPLIERS AND  LICENSORS
// SHALL NOT BE LIABLE FOR ANY DAMAGES SUFFERED BY LICENSEE THAT RESULT FROM
// USE OR DISTRIBUTION OF THE SOFTWARE OR THE COMBINATION OF THE SOFTWARE
// WITH ANY OTHER CODE.  IN NO EVENT WILL IBM OR ITS SUPPLIERS  AND LICENSORS
// BE LIABLE FOR ANY LOST REVENUE, PROFIT OR DATA, OR FOR DIRECT, INDIRECT,
// SPECIAL, CONSEQUENTIAL, INCIDENTAL OR PUNITIVE DAMAGES, HOWEVER CAUSED AND
// REGARDLESS OF THE THEORY OF LIABILITY, ARISING OUT OF THE USE OF OR
// INABILITY TO USE SOFTWARE, EVEN IF IBM HAS BEEN ADVISED OF THE POSSIBILITY
// OF SUCH DAMAGES.
// 
// @endCopyright
//*********************** ES COPYRIGHT END  ***********************************
dojo.provide("widgets.analytics.CategoryView");

dojo.require("widgets.analytics._AnalyticsPane");
dojo.require("widgets.Button");
dojo.require("dijit.form.FilteringSelect");

dojo.declare(
"widgets.analytics.CategoryView",
widgets.analytics._AnalyticsPane,
{
	prefix: EDR.prefix,
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl("widgets.analytics", "templates/CategoryView.html"),
	
	message_listTarget: EDR.messages.analytics_common_listTarget,
	message_listTarget_subcategory: EDR.messages.analytics_common_listTarget_subcategory,
	message_listTarget_keyword: EDR.messages.analytics_common_listTarget_keyword,
	message_common_analytics_show: EDR.messages.common_analytics_show,
	message_common_analytics_sort: EDR.messages.common_analytics_sort,
	message_preferences_analytics_sortByFrequency: EDR.messages.preferences_analytics_sortByFrequency,
	message_preferences_analytics_sortByCorrelation: EDR.messages.preferences_analytics_sortByCorrelation,
	message_preferences_analytics_sortByAlphabetical: EDR.messages.preferences_analytics_sortByAlphabetical,
	
	_listTargetSelect: null,
	
	_verticalFacetId: "",
	
	verticalRowCount: "100",
	verticalSortBy: "frequency",
	
	postCreate: function() {
		this.inherited(arguments);
		
		if(EDR.isNoflash) {
			dojo.style(this.domNode, "overflow", "auto");
		} else {
			dojo.style(this.toolbarDiv, "display", "none");
		}

		dojo.subscribe("verticalFacetChanged", this, "onFacetChanged");
		dojo.subscribe("refresh", this, "refresh");
	},
	
	_getHtmlContent: function(facetId) {
		var args = {
			handleAs: "text",
			url: "analytics.do",
			load: dojo.hitch(this, "_getHtmlContentSuccess"),
			content: {
				action: "getCategoryView",
				format: "html",
				vertical_path: facetId,
				vertical_target: this.verticalTarget,
				vertical_count: this.verticalRowCount,
				vertical_sortby: this.verticalSortBy
			}
		};
		EDR.ajax.Loading.setIsLoading(this.domNode.parentNode.parentNode);
		dojo.xhrGet(args);
	},
	
	_getHtmlContentSuccess: function(response) {
		var content = response;
		this.containerNode.innerHTML = response;
		EDR.ajax.Loading.clearIsLoading(this.domNode.parentNode.parentNode);
	},
	
	_getHtmlContentTimeout: function(response) {
		EDR.ajax.Loading.clearIsLoading(this.domNode.parentNode.parentNode);
	},
	
	_getHtmlContentError: function(response) {
		EDR.ajax.Loading.clearIsLoading(this.domNode.parentNode.parentNode)
	},
	
	destroy: function() {
		dojo.unsubscribe("verticalFacetChanged", this, "onFacetChanged");		
		this.inherited(arguments);
	},
	
	onShow: function() {
		this.inherited(arguments);
		
		var categoryTree = dijit.byId(EDR.prefix+"categoryTree");
		if(CategoryView.initialized) {
			if(categoryTree.verticalHasSubfacets) {
				CategoryView.enableSubfacets();
			} else {
				CategoryView.disableSubfacets();
			}		
		}
		
		var currentId = dijit.byId(EDR.prefix+"categoryTree").verticalFacetId;
		if(currentId != null && currentId != "") {
			this._render(currentId);
		} else {
			this._render(null);
		}
	},
	
	onHide: function() {
//		dijit.byId("horizontalSearchPanes").resultToolbar.enableDeepInspectionButton(true);
		this.inherited(arguments);
	},
	

	_onComplete: function(data) {
		if(data != "" && CategoryView.initialized) {
			CategoryView.loadXml(data);	
		}
	},
	
	refresh: function() {
		if(this.isVisible && this._verticalFacetId != "") {
			this._render(this._verticalFacetId);
		} else {
			this._render(null);
		}
	},
	
	clear: function() {
		CategoryView.addFlexEventListener("submitSearch", dojo.hitch(this, "_onSubmitSearch"));
		CategoryView.addFlexEventListener("targetChanged", dojo.hitch(this, "_onTargetChanged"));
		CategoryView.addFlexEventListener("onLoadError", dojo.hitch(this, "_onFlexLoadError"));			
	},
	
	_onFlexLoadError: function(evt) {
		try {
			var json = dojo.fromJson(event.getErrorJsonString());
			if (json.warning != null) {
				EDR.ajax.Warning.handle(json.warning, []);
			} else if (json.error != null) {
				EDR.ajax.Error.handle(json.error, []);
			} else {
				alert(event.getErrorJsonString());
			}
		} catch (e) {			
			alert(event.getErrorJsonString());
		}
	},
	
	_render: function(facetId, hasSubfacets) {
		this._verticalFacetId = facetId;
		
		if(EDR.isNoflash) {
			this._getHtmlContent(facetId);
		} else {

			var loadFunction = dojo.hitch(this, function() {
				this.clear();
				
				var categoryTree = dijit.byId(EDR.prefix+"categoryTree");
				if(categoryTree.verticalHasSubfacets) {
					CategoryView.enableSubfacets();
				} else {
					CategoryView.disableSubfacets();
				}		
				this.verticalTarget = CategoryView.getVerticalTarget();
				CategoryView.load(facetId, this.verticalRowCount,  "analytics", "");			
			});
			
			if(CategoryView.initialized) {
				loadFunction();			
			} else {
				CategoryView.lazyLoading = loadFunction;
			}			
		}

	},

	preLoad: function() {
		EDR.ajax.Loading.setIsLoading(this.domNode);
//		widgets.analytics.hideAnalyticsPane();
//		dijit.byId("horizontalSearchPanes")._childLoading = true;

//		this._disableButtons();
	},
	
	postLoad: function() {
		EDR.ajax.Loading.clearIsLoading(this.domNode);		
//		widgets.analytics.showAnalyticsPane();
//		dijit.byId("horizontalSearchPanes")._childLoading = false;
	},
	
//	layout: function() {
//		var size = dojo.contentBox(this.domNode);
//		dojo.contentBox(this.containerNode, {
//			h:dojo.contentBox(this.domNode).h - dojo.marginBox(this.toolbarDiv).h
//		});
//		
//		this.inherited(arguments);
//	},
	
	onFacetChanged: function(message) {
		if(this.isVisible) {
			this._render(message.verticalFacetId);
		}
	},
	
	addToSearch: function() {
		var keywords = CategoryView.initialized ? CategoryView.getSelectedKeywords() : [];
		var facetValue = "";
		var prefix = this.verticalTarget == "keywords" ? "keyword" : "subcategory";
		
		for(var i = 0; i<keywords.length; i++) {
			var keyword = keywords[i];
			facetValue += "/" + prefix + this._verticalFacetId + "/\"" + keyword + "\"";
			if(i != keywords.length - 1) {
				facetValue += " OR ";
			}
		}
		if(facetValue != "") {
			var params = {"keywords": facetValue};
			dijit.byId(EDR.prefix+"searchManager").submitQuickRefineSearch(params);
		}
		
		
//		if(keyword != null && keyword != "") {
//			var facetValue = this._verticalFacetId + ":\"" + keyword + "\"";
//			var params = { keywords: facetValue};
//			dijit.byId(EDR.prefix+"searchManager").submitQuickRefineSearch(params);
//		}
	},
	
	_enableButtons: function() {
		dojo.removeAttr(this.searchBtn, "disabled");
		dojo.attr(this.searchBtnImg, "src", "images/tmp/chartsearch.png");
	},
	
	_disableButtons: function() {	
		dojo.attr(this.searchBtn, "disabled", "disabled");
		dojo.attr(this.searchBtnImg, "src", "images/tmp/chartsearch_d.png");
	},
	
	_onSelectionChanged: function(evt) {
		var selected = evt.getSelectedValues();
		if(!selected || selected.length == 0) {
			this._disableButtons();
		} else {
			this._enableButtons();
		}
	},
	
	_onSubmitSearch: function(evt) {
//		this.addToSearch();
		var verticalTarget = evt.getVerticalTarget();
		var searchType = evt.getSearchType();
		var excludeMode = false;
		if(searchType.indexOf("not") != -1) {
			excludeMode = true;
		}
		var orMode = false;
		if(searchType.indexOf("or") != -1) {
			orMode = true;
		}
		var keywords = evt.getSelectedValues();
		
		var facetValue = " ";
		var prefix = this.verticalTarget == "keywords" ? "keyword" : "subcategory";
		
		if(!excludeMode && keywords.length > 1) {
			facetValue += "( ";
		}
		for(var i = 0; i<keywords.length; i++) {
			var keyword = keywords[i];
			if(excludeMode) {
				facetValue += "-";
			}
			facetValue += "/" + prefix + this._verticalFacetId + "/\"" + this.escapeQuery(keyword) + "\"";
			if(i != keywords.length - 1) {
				facetValue += " OR ";
			}
		}
		if(!excludeMode && keywords.length > 1) {
			facetValue += ")";
		}
		if(facetValue != "") {
			var params = {"keywords": facetValue};
			if(orMode) {
				params.operator = "OR";
			}
//			console.log("facetValue:" + facetValue);
			dijit.byId(EDR.prefix+"searchManager").submitQuickRefineSearch(params);
		}
		
	},
	
	_onTargetChanged: function(evt) {
		this.verticalTarget = evt; 
		this.refresh();
	},
	
	_onSortByChanged: function(evt) {
		this.verticalSortBy = evt;
		this.refresh();
	},
	
	__dummy__: null
});
