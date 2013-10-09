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
dojo.provide("widgets.analytics.TwoDMapView");

dojo.require("widgets.analytics._AnalyticsPane");

dojo.require("dijit.form.FilteringSelect");

dojo.declare(
"widgets.analytics.TwoDMapView",
widgets.analytics._AnalyticsPane,
{
	prefix: EDR.prefix,
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl("widgets.analytics", "templates/TwoDMapView.html"),
	
	testData: '',
	
	_verticalFacetId: "",
	_horizontalFacetId: "",
	
	verticalRowCount: 100,
	horizontalRowCount: 100,
	
	messages_keywords: EDR.messages.common_analytics_keyword,
	messages_subfacets: EDR.messages.common_analytics_subfacets,
	messages_rowTarget: EDR.messages.twodmap_label_rowsTarget,
	messages_colTarget: EDR.messages.twodmap_label_columnsTarget,
	
	postCreate: function() {
		this.inherited(arguments);
		
		if(EDR.isNoflash) {
			dojo.style(this.domNode, "overflow", "auto");
		} else {
			dojo.style(this.toolbarDiv, "display", "none");
		}
		
		dojo.subscribe("verticalFacetChanged", this, "onFacetChanged");
		dojo.subscribe("horizontalFacetChanged", this, "onFacetChanged");
		dojo.subscribe("refresh", this, "refresh");
		
		if(this.testData != '') {
			this._renderTestData();
		}
	},
	
	destroy: function() {
		this.inherited(arguments);
		
		dojo.unsubscribe("verticalFacetChanged", this, "onFacetChanged");
		dojo.unsubscribe("horizontalFacetChanged", this, "onFacetChanged");
	},
	
	resize: function() {
		this.layout();
	},
	
	_getHtmlContent: function() {
		var args = {
			handleAs: "text",
			url: "analytics.do",
			load: dojo.hitch(this, "_getHtmlContentSuccess"),
			content: {
				action: "getTwoDMapView",
				format: "html",
				vertical_path: this._verticalFacetId,
				vertical_target: this.verticalTarget,
				vertical_count: this.verticalRowCount,
				horizontal_path: this._horizontalFacetId,
				horizontal_target: this.horizontalTarget,
				horizontal_count: this.horizontalRowCount
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
	
	
//	layout: function() {
//		var size = dojo.contentBox(this.domNode);
//		dojo.contentBox(this.containerNode, {
//			h:dojo.contentBox(this.domNode).h - dojo.marginBox(this.toolbarDiv).h
//		});
//		
//		this.inherited(arguments);
//	},	
	
	addToSearch: function(evt) {
		var pair = evt.getSelectedValues();
		var vPrefix = evt.getVerticalTarget() == "keywords" ? "keyword" : "subcategory";
		var hPrefix = evt.getHorizontalTarget() == "keywords" ? "keyword" : "subcategory";
		if(pair != null) {
			var vid = pair[0];
			var hid = pair[1];
			
			var facetValue = "/" + vPrefix + this._verticalFacetId + "/\"" + this.escapeQuery(vid) + "\" " + "/" + hPrefix + this._horizontalFacetId + "/\"" + this.escapeQuery(hid) + "\"";
			var params = { keywords: facetValue};
			dijit.byId(EDR.prefix+"searchManager").submitQuickRefineSearch(params);
		}
	},
	
	_onTargetChanged: function(evt) {
		this.refresh();
	},
	
	_onVerticalTargetChanged: function(data) {
		this.verticalTarget = data;
		this.refresh();
	},
	
	_onHorizontalTargetChanged: function(data) {
		this.horizontalTarget = data;
		this.refresh();
	},
	
	refresh: function() {
		if(this.isVisible) {
			this._render(this._verticalFacetId, this._horizontalFacetId);
		}
	},
	
	
	_renderTestData: function() {
		var args = {
				handleAs: "xml",
				url: this.testData,
				load: dojo.hitch(this, "_onTestDataLoadComplete")
		};
		dojo.xhrGet(args);				
	},
	
	onFacetChanged: function(message) {
		var vid = message.verticalFacetId;
		var hid = message.horizontalFacetId;
		this._verticalFacetId = vid;
		this._horizontalFacetId = hid;
		if(TwoDMapView.initialized) {
			var vLabel = message.verticalFacetLabel != null ? message.verticalFacetLabel : "";
			var hLabel = message.horizontalFacetLabel != null ? message.horizontalFacetLabel : "";
			
			TwoDMapView.setFacetLabels(vLabel, hLabel);
		}

		if(this.isVisible && vid && hid) {
			this._render(vid, hid);
		}
	},
	
	onShow: function() {
		this.inherited(arguments);

//		var toolbar = dijit.byId("horizontalSearchPanes").resultToolbar;
//		toolbar.enableHorizontalInfo();
		var tree = dijit.byId(EDR.prefix+"categoryTree");
		var vid = tree.verticalFacetId;
		var hid = tree.horizontalFacetId;
		
		if(TwoDMapView.initialized) {
			if(tree.verticalHasSubfacets) {
				TwoDMapView.enableVerticalSubfacets();
			} else {
				TwoDMapView.disableVerticalSubfacets();
			}
			if(tree.horizontalHasSubfacets) {
				TwoDMapView.enableHorizontalSubfacets();
			} else {
				TwoDMapView.disableHorizontalSubfacets();
			}
		}
		
		if(this.isVisible) {
			if (vid && hid) {
			this._render(vid, hid);
		} else {
				this._render(null, null);
			}
		}
	},
	
	onHide: function() {
		this.inherited(arguments);
//		dijit.byId("horizontalSearchPanes").resultToolbar.enableDeepInspectionButton(true);
		
//		var toolbar = dijit.byId("horizontalSearchPanes").resultToolbar;
//		toolbar.disableHorizontalInfo();
	},
	
	preLoad: function() {
		EDR.ajax.Loading.setIsLoading(this.domNode.parentNode.parentNode);
//		widgets.analytics.hideAnalyticsPane();
//		dijit.byId("horizontalSearchPanes")._childLoading = true;
//		this._disableButtons();
	},
	
	postLoad: function() {
		EDR.ajax.Loading.clearIsLoading(this.domNode.parentNode.parentNode);
//		widgets.analytics.showAnalyticsPane();
//		dijit.byId("horizontalSearchPanes")._childLoading = false;
	},
	
	clear: function() {
		TwoDMapView.addFlexEventListener("submitSearch", dojo.hitch(this, "addToSearch") );
		TwoDMapView.addFlexEventListener("targetChanged", dojo.hitch(this, "_onTargetChanged") );
		TwoDMapView.addFlexEventListener("onLoadError",	dojo.hitch(this, "_onFlexLoadError") );
	},
	
	_onFlexLoadError: function(event) {
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
	
	_render: function(verticalFacetId, horizontalFacetId) {
		this._verticalFacetId = verticalFacetId;
		this._horizontalFacetId = horizontalFacetId;
//		dijit.byId("horizontalSearchPanes").resultToolbar.enableDeepInspectionButton(this._verticalFacetId != null && this._horizontalFacetId != null);
		
		if(EDR.isNoflash) {
			this._getHtmlContent();
		} else {
		
			var loadFunction = dojo.hitch(this, function() {
				this.clear();
				
				var tree = dijit.byId(EDR.prefix+"categoryTree");
				if(tree.verticalHasSubfacets) {
					TwoDMapView.enableVerticalSubfacets();
				} else {
					TwoDMapView.disableVerticalSubfacets();
				}
				if(tree.horizontalHasSubfacets) {
					TwoDMapView.enableHorizontalSubfacets();
				} else {
					TwoDMapView.disableHorizontalSubfacets();
				}			
	
				var targets = TwoDMapView.getTargets();
				this.verticalTarget = targets[0];
				this.horizontalTarget = targets[1];
				TwoDMapView.load(verticalFacetId, this.verticalRowCount, horizontalFacetId, this.horizontalRowCount,  "analytics", "");
			});
			
			if(TwoDMapView.initialized) {
				loadFunction();
			} else {
				TwoDMapView.lazyLoading = loadFunction;
			}
		
		}
		
	},
	
	_onComplete: function(data) {
		TwoDMapView.loadXmlStr(data);
	},
	
	_onTestDataLoadComplete: function(data) {
		var categories = data.getElementsByTagName("category");
		if(categories.length > 0) {
			var first = categories[0];
			var dataElem = first.getElementsByTagName("data")[0];
			var horizontalCategories = dataElem.getElementsByTagName("value");
			for(var i=0; i<horizontalCategories.length; i++) {
				var name = horizontalCategories[i].getElementsByTagName("name")[0];
				var value = name.firstChild.nodeValue;
				dojo.create("th", {innerHTML: value}, this.headerRow);
			}
		}

		for(var i=0; i<categories.length; i++) {
			var category = categories[i];
			var nameElem = category.getElementsByTagName("name")[0];
			var name = nameElem.firstChild.nodeValue;
			
			var tr = dojo.create("tr", null, this.tbody);
			var td = dojo.create("td", {innerHTML: name}, tr);
			var dataElem = category.getElementsByTagName("data")[0];
			var horizontalCategories = dataElem.getElementsByTagName("value");
			for(var j=0; j<horizontalCategories.length; j++) {
				var actual_cnt_elem = horizontalCategories[j].getElementsByTagName("actual_cnt")[0];
				var actual_cnt = actual_cnt_elem.firstChild.nodeValue;
				dojo.create("td", {innerHTML: actual_cnt}, tr);
			}
			
		}
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
//			this._disableButtons();
		} else {
//			this._enableButtons();
		}
	},
	
	setTableDimension: function(numberOfRows, numberOfColumns){
//		console.log("numberOfRows in table:"+numberOfRows+",numberOfColumns in table:"+numberOfColumns);
	},
	
	__dummy__: null
});
