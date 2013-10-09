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
dojo.provide("widgets.CategoryTree");

dojo.require("widgets.FacetBase");
dojo.require("widgets.Button");
dojo.require("dijit._Templated");
dojo.require("dijit.form.RadioButton");
dojo.require("dojo.fx");

dojo.declare(
	"widgets.CategoryTree", [widgets.FacetBase, dijit._Templated],
	{	
		prefix: EDR.prefix,
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl("widgets", "templates/CategoryTree.html"),
		url: "",
		url2: "",
		timeout: 10000,
		
		showSelectionIcons: false,
		
		horizontalIcon: "column_d16.png",
		horizontalSelectedIcon: "column16.png",
		horizontalFacetImg: null,
		horizontalFacetLabel: null,
		horizontalFacetId: null,
		horizontalHasSubfacets: false,
		
		verticalIcon: "row_d16.png",
		verticalSelectedIcon: "row16.png",
		verticalFacetImg: null,
		verticalFacetLabel: null,
		verticalFacetId: null,
		verticalHasSubfacets: false,
		
		loaded: false,
		filterJson: null,
		json: null,
		
		sortType: "none",
		
		filterValue: "",
		prevFilterValue: "",
		filterEnabled: false,
				
		filterTimer: null,
		filterDuration: 500,
		treeItemWidth: 250,
		indentWidth: 15,
		defaultSize: 0,
		maxSize: 0,

		postCreate: function() {
			this.inherited("postCreate", arguments);
			dijit.setWaiRole(this.facetForm, "tree");
			
			dojo.subscribe("collectionChanged", this, "forceReload");
			dojo.subscribe("refresh", this, "refresh");
			dojo.subscribe("reset", this, "reset");
			dojo.subscribe("tabChanged", this, "onTabChanged");
			dojo.subscribe("verticalFacetChanged", this, "onFacetSearchStateChanged");
		},
		
		startup: function() {
			this.inherited(arguments);
			this._setTreeItemWidth();
			if (dojo.isIE <= 7) {
				this.clearBtn.adjustButtonWidth();
				this.categorySearchBtn.adjustButtonWidth();
				dojo.style(this.clearBtn.domNode, "position", "relative");
				dojo.style(this.clearBtn.domNode, "top", "4px");
			}
		},
		
		resize: function() {		
			this.layout();
		},
		
		layout: function() {
			this._setTreeItemWidth();
			
			dojo.forEach(dojo.query("div.refinement-group-ica", this.domNode), dojo.hitch(this, function(elem) {
				this._setRefGroupWidth(elem, elem.level);
			}));
			dojo.forEach(dojo.query("div.label-ica", this.domNode), dojo.hitch(this, function(elem) {
				this._setLabelWidth(elem, elem.level);
			}));
		},
				
		load: function() {
			var args = 	{ 
				url: this.url,
				showProgress: false,
				successCallback: dojo.hitch(this, function(response, ioArgs) {
					var json = null;
					try {
						json = dojo.fromJson(response);
					} catch (e) {
			        	this.loadErrorHandler(response, ioArgs);
			        	return;
					}
					this.clear();
					this.json = json;
					this.loadJson(json);	
					var activeTabId = dijit.byId(EDR.prefix+"horizontalSearchPanes").activeTabId;
					if (activeTabId != null && dijit.byId(activeTabId) != null && dijit.byId(activeTabId).hasHorizontalFacet) {
						this.enableSelectionIcons(true);
					}					
					this.postLoad();		
				}),
				afterErrorHandlerCallback: dojo.hitch(this, function(response, ioArgs) {
					this.loadErrorHandler(response, ioArgs);
				}),
				timeout: this.timeout
			};			
			this.preLoad();					
			EDR.ajax.Request.post(args);
		},
		
		loadFilteredCategories: function(filter) {
			var args = 	{ 
				url: this.url2,
				content: {
					filter: filter
				},
				showProgress: false,
				successCallback: dojo.hitch(this, function(response, ioArgs) {
					var json = null;
					try {
						json = dojo.fromJson(response);
					} catch (e) {
			        	this.loadErrorHandler(response, ioArgs);
			        	return;
					}
					this.clear();
					this.loadJson(json);	
					this.filterJson = json;
					this.postLoad();		
				}),
				afterErrorHandlerCallback: dojo.hitch(this, function(response, ioArgs) {
					this.loadErrorHandler(response, ioArgs);
				}),
				timeout: this.timeout
			};			
			this.preLoad();					
			EDR.ajax.Request.post(args);
		},
		
		loadChildren: function(parent, parentId, level, afterChildrenLoaded) {
			var args = 	{ 
				url: this.url,
				content: {
					parentId: parentId
				},
				showProgress: false,
				successCallback: dojo.hitch(this, function(response, ioArgs) {
					var json = null;
					try {
						json = dojo.fromJson(response);
					} catch (e) {
			        	this.loadErrorHandler(response, ioArgs);
			        	return;
					}
					this.loadJson(json, parent, level);	
					afterChildrenLoaded(json);					
				}),
				afterErrorHandlerCallback: dojo.hitch(this, function(response, ioArgs) {
					this.loadErrorHandler(response, ioArgs);
				}),
				timeout: this.timeout
			};			
			EDR.ajax.Request.post(args);
		},
		
		loadJson: function(json, parent, level) {
			this.loaded = true;
			if (json == null) json = [];
			if (json.length == 0 && parent == null) {
				this.facetForm.innerHTML = "<div style='padding:5px'></div>";
			} else {
				if (parent == null) {
					parent = this.facetForm;
					level = 0;
				}
				dojo.empty(parent);
				this.buildFacetGroups(json, parent, level);	
			}
		},
		
		isVisible: function() {
			return true;
		},
		
		refresh: function() {
			if (this.isVisible() && !this.loaded) this.load();
		},
		
		forceReload: function() {
			this.onFilterClearClicked();
			this.unselectAll();
		},
		
		unselectAll: function() {
			this.horizontalFacetImg = null;
			this.verticalFacetImg = null;
			this.horizontalFacetLabel = null;
			this.verticalFacetLabel = null;
			this.horizontalFacetId = null;
			this.verticalFacetId = null;
			
			dojo.publish("verticalFacetChanged", [{
				horizontalFacetLabel: "",
				horizontalFacetId: "",
				horizontalHasSubfacets: true,
				verticalFacetLabel: "",
				verticalFacetId: "",
				verticalHasSubfacets: true
			}]);
			dojo.publish("horizontalFacetChanged", [{
				horizontalFacetLabel: "",
				horizontalFacetId: "",
				horizontalHasSubfacets: true,
				verticalFacetLabel: "",
				verticalFacetId: "",
				verticalHasSubfacets: true
			}]);
			
			this.load();
		},
		
		clear: function() {
			dojo.forEach(this.handlers, dojo.disconnect);
			dojo.empty(this.facetForm);			
//			this.showSelectionIcons = false;
			this.horizontalFacetImg = null;
			this.verticalFacetImg = null;
		},
		
		reset: function() {			
			this.inherited(arguments);
		},
				
		loadErrorHandler: function(response) {},		
	
		preLoad: function() {
			this.filterInput.setAttribute("readonly", "");
			EDR.ajax.Loading.setIsLoading(this.domNode);
		},
	
		postLoad: function() {
			this.filterInput.removeAttribute("readonly");
			EDR.ajax.Loading.clearIsLoading(this.domNode);
		},
		
		loadErrorHandler: function(response) {
			this.filterInput.removeAttribute("readonly");
			EDR.ajax.Loading.clearIsLoading(this.domNode);
		},

		onFilterChanged: function(evt) {
			if (evt.keyCode == dojo.keys.TAB) return;
			
			if (this.filterTimer != null) {
				clearTimeout(this.filterTimer);
				this.filterTimer = null;
			}

		 	var filter = this.filterInput.value;
			if (this.prevFilterValue == filter) return;
			
		 	this.filterTimer = setTimeout(dojo.hitch(this, function() {
				this.prevFilterValue = filter;
		 		if (filter != null && filter.length != 0) {
					this.filterEnabled = true;
					this.filterValue = filter;
		 			this.loadFilteredCategories(filter);
		 		} else {
					this.filterEnabled = false;
					this.clear();
				 	this.loadJson(this.json);		 	
		 		}
		    }), this.filterDuration);
		},	
		
		onFilterClearClicked: function(evt) {
			this.filterEnabled = false;
		 	this.filterInput.value = "";
		 	this.prevFilterValue = "";
			this.clear();
		 	this.loadJson(this.json);		 	
		},
		
		onSortOrderChanged: function(value) {
			this.sortType = value;
			this.clear();
			if (this.filterEnabled) {
				this.loadJson(this.filterJson);
			} else {
				this.loadJson(this.json);
			}
		},
		
		onFacetClicked: function(evt) {
			if (evt.type != "click" && evt.keyCode != dojo.keys.ENTER && evt.charCode != dojo.keys.SPACE
				&& evt.keyCode != dojo.keys.LEFT_ARROW && evt.keyCode != dojo.keys.RIGHT_ARROW) return;
			
			var refTitle = evt.currentTarget.parentNode;
			var facetId = refTitle.facet.id;
			
			if (evt.type == "click" || (evt.keyCode === dojo.keys.ENTER || evt.charCode == dojo.keys.SPACE)) {
				if (facetId != this.verticalFacetId /*&& facetId != this.horizontalFacetId */) {
					var evt = { 
						currentTarget: refTitle.childNodes[1].childNodes[2],
						type: "click"
					};
					this.verticalFacetSelected(evt);
				}
			} else if (evt.keyCode == dojo.keys.RIGHT_ARROW) {
				if (refTitle.facet.hasChildren && !refTitle.facet.open) {
					var evt = { type: "click", currentTarget: refTitle.childNodes[1].firstChild };
					this.toggleFacetEventHandler(evt, false);					
				}
			} else if (evt.keyCode == dojo.keys.LEFT_ARROW) {
				if (refTitle.facet.hasChildren && refTitle.facet.open) {
					var evt = { type: "click", currentTarget: refTitle.childNodes[1].firstChild };
					this.toggleFacetEventHandler(evt, false);					
				}
			}
		},
		
		onTabChanged: function(evt) {
			var activeTabId = evt.activeTabId;
			var activeTabWidget = dijit.byId(activeTabId);
			this.enableSelectionIcons(activeTabWidget != null && activeTabWidget.hasHorizontalFacet);
		},
		
		onSearchButtonClicked: function(evt) {						
			var values = dojo.formToObject(this.facetSearchForm);
			var query = "";
			if (values.searchType == "keywordSearch") {
				if (values.keywordValue == null || values.keywordValue.length == 0) {
					EDR.util.alert(EDR.messages.analytics_categorytree_nokeyword);
					return;
				} else {
					query = "/\"keyword" + this.verticalFacetId + "\"/\"" + this._normalizeFacetValue(values.keywordValue) + "\"";
				}
			} else {			
				if (values.pathValue == null || values.pathValue.length == 0) {
					EDR.util.alert(EDR.messages.analytics_categorytree_nopath);
					return;
				} else {
					var paths = values.pathValue.split(".");
					if (paths == null || paths.length <= 1) {
						EDR.util.alert(EDR.messages.analytics_categorytree_nopath);
					}
					paths.pop();
					query = "/\"subcategory" + paths.join(".") + "\"/\"" + values.pathValue + "\"";
				}
			}
			if (query != null && query.length != 0) {
				var params = {keywords: query};
				var searchType = dijit.byId(EDR.prefix+"categoryRefineSearch").checked ?  "refineSearch" : "search";
				dijit.byId(EDR.prefix+"searchManager").submitSearch(null, searchType, params);
			}
		},
		
		onSearchTypeChanged: function(evt) {
			if (this.searchType.value == "keywordSearch") {
				this.keywordInput.removeAttribute("disabled");
			} else {
				this.keywordInput.setAttribute("disabled", "");
			}
		},
		
		onFacetSearchStateChanged: function(evt) {
			if (this.verticalFacetId == null || this.verticalFacetId.length == 0) {
				this.categorySearchBtn.setDisabled(true);
				this.pathInput.value = "";
			} else {
				this.categorySearchBtn.setDisabled(false);
				this.pathInput.value = this.verticalFacetId;
			}
		},
		
		enableSelectionIcons: function(enabled) {
			if (this.showSelectionIcons == enabled) return;
			dojo.forEach(dojo.query("img.vertical-category-img", this.domNode), dojo.hitch(this, function(elem) {
				dojo.style(elem, "visibility", enabled ? "visible" : "hidden");
				elem.parentNode.tabIndex = enabled ? "0" : "-1";
			}));
			dojo.forEach(dojo.query("img.horizontal-category-img", this.domNode), dojo.hitch(this, function(elem) {
				dojo.style(elem, "visibility", enabled ? "visible" : "hidden");
				elem.parentNode.tabIndex = enabled ? "0" : "-1";
			}));
			if (this.horizontalFacetImg != null) {
				var refTitle = this.horizontalFacetImg.parentNode.parentNode.parentNode;
				this.toggleSelectionClass(refTitle, enabled);
			}
			this.showSelectionIcons = enabled;
		},
		
		toggleSelectionClass: function(refTitle, selected) {
			if (selected) {
				dojo.addClass(refTitle.childNodes[0], "refinement-title-top-selected");
				dojo.addClass(refTitle, "refinement-title-ica-selected");
				dojo.addClass(refTitle.childNodes[2], "refinement-title-bottom-selected");
				dojo.removeClass(refTitle.childNodes[0], "refinement-title-top");
				dojo.removeClass(refTitle, "refinement-title-ica");
				dojo.removeClass(refTitle.childNodes[2], "refinement-title-bottom");
			} else {
				dojo.addClass(refTitle.childNodes[0], "refinement-title-top");
				dojo.addClass(refTitle, "refinement-title-ica");
				dojo.addClass(refTitle.childNodes[2], "refinement-title-bottom");
				dojo.removeClass(refTitle.childNodes[0], "refinement-title-top-selected");
				dojo.removeClass(refTitle, "refinement-title-ica-selected");
				dojo.removeClass(refTitle.childNodes[2], "refinement-title-bottom-selected");
			}
		},
		
		toggleFacetEventHandler: function(evt, force) { // evt.currentTarget == arrowContainer
			if (evt != null && evt.stopPropagation) evt.stopPropagation();
			if (evt.type != "click" && evt.keyCode != dojo.keys.ENTER && evt.charCode != dojo.keys.SPACE) return;
//			if (dojo.isIE) evt.currentTarget = evt.currentTarget.parentNode;

			var refTitle = evt.currentTarget.parentNode.parentNode;					
			var arrowImg = evt.currentTarget.firstChild;
			var label = evt.currentTarget.nextSibling;
			var refGroupList = refTitle.nextSibling;
			var level = refTitle.level + 1;
			var facetJson = refTitle.facet;

			if (refGroupList.style.display == 'none') {			
				facetJson.open = true;
				if (refGroupList.firstChild == null || force) {
					dojo.empty(refGroupList); // clear existing sub facet containers
					if (facetJson.facets != null && facetJson.facets.length != 0) {
						this.loadJson(facetJson.facets, refGroupList, level);	
						arrowImg.src = this.imgBasePath + "arrow_down8.png";
						setTimeout(function() {dojo.fx.wipeIn({node: refGroupList, duration: 300}).play();}, 0);
					} else {
						this.loadChildren(refGroupList, refTitle.facet.id, level, dojo.hitch(this, function(json) {
							facetJson.facets = json;
							arrowImg.src = this.imgBasePath + "arrow_down8.png";
							setTimeout(function() {dojo.fx.wipeIn({node: refGroupList, duration: 300}).play();}, 0);
						}));
					}
				} else {
					arrowImg.src = this.imgBasePath + "arrow_down8.png";
					setTimeout(function() {dojo.fx.wipeIn({node: refGroupList, duration: 300}).play();}, 0);
				}
				dijit.setWaiState(label, "expanded", "true");
			} else {
				arrowImg.src = this.imgBasePath + (this.isLeftToRight() ? "arrow_right8.png" : "arrow_left8.png");
				setTimeout(function() {dojo.fx.wipeOut({node: refGroupList, duration: 300}).play();}, 0);
				facetJson.open = false;
				dijit.setWaiState(label, "expanded", "false");
			}
		},
				
		verticalFacetSelected: function(evt) {
			if (evt != null && evt.stopPropagation) evt.stopPropagation();
			if (evt.type != "click" && evt.keyCode != dojo.keys.ENTER && evt.charCode != dojo.keys.SPACE) return;
//			if (dojo.isIE) evt.currentTarget = evt.currentTarget.parentNode;
			
			var refTitle = evt.currentTarget.parentNode.parentNode;;
			var img = evt.currentTarget.firstChild;
			var label = evt.currentTarget.previousSibling;
			var facetId = refTitle.facet.id;
			var facetLabel = refTitle.facet.label;
			var hasSubfacets = refTitle.facet.hasChildren;
			if (img.src.lastIndexOf(this.verticalSelectedIcon) == -1) {
			
				this.toggleSelectionClass(refTitle, true);		
				img.src = this.imgBasePath + this.verticalSelectedIcon;
				
				if (this.verticalFacetImg != null) {
					var prevLabel = this.verticalFacetImg.parentNode.previousSibling;
					this.toggleSelectionClass(this.verticalFacetImg.parentNode.parentNode.parentNode, false);
					this.verticalFacetImg.src = this.imgBasePath + this.verticalIcon;
					dijit.setWaiState(prevLabel, "selected", "false");			
				}
				
				this.verticalFacetLabel = facetLabel;
				this.verticalFacetId = facetId;
				this.verticalFacetImg = img;
				this.verticalHasSubfacets = hasSubfacets;
				dijit.setWaiState(label, "selected", "false");			
				
				dojo.publish("verticalFacetChanged", [{
					horizontalFacetLabel: this.horizontalFacetLabel,
					horizontalFacetId: this.horizontalFacetId,
					horizontalHasSubfacets: this.horizontalHasSubfacets,
					verticalFacetLabel: this.verticalFacetLabel,
					verticalFacetId: this.verticalFacetId,
					verticalHasSubfacets: this.verticalHasSubfacets
				}]);
			}
			return false;
		},

		setVerticalFacetId: function(vid) {
			this.verticalFacetId = vid;

			dojo.publish("verticalFacetChanged", [{
				horizontalFacetLabel: this.horizontalFacetLabel,
				horizontalFacetId: this.horizontalFacetId,
				horizontalHasSubfacets: this.horizontalHasSubfacets,
				verticalFacetLabel: this.verticalFacetLabel,
				verticalFacetId: this.verticalFacetId,
				verticalHasSubfacets: this.verticalHasSubfacets
			}]);
		},
		
		setHorizontalFacetId: function(hid) {
			this.horizontalFacetId = hid;
			
			dojo.publish("horizontalFacetChanged", [{
				horizontalFacetLabel: this.horizontalFacetLabel,
				horizontalFacetId: this.horizontalFacetId,
				horizontalHasSubfacets: this.horizontalHasSubfacets,
				verticalFacetLabel: this.verticalFacetLabel,
				verticalFacetId: this.verticalFacetId,
				verticalHasSubfacets: this.verticalHasSubfacets
			}]);
		},
		
		horizontalFacetSelected: function(evt) {
			if (evt != null && evt.stopPropagation) evt.stopPropagation();
			if (evt.type != "click" && evt.keyCode != dojo.keys.ENTER && evt.charCode != dojo.keys.SPACE) return;
//			if (dojo.isIE) evt.currentTarget = evt.currentTarget.parentNode;
			
			var refTitle = evt.currentTarget.parentNode.parentNode;;
			var img = evt.currentTarget.firstChild;
			var label = evt.currentTarget.previousSibling.previousSibling;
			var facetId = refTitle.facet.id;
			var facetLabel = refTitle.facet.label;
			var hasSubfacets = refTitle.facet.hasChildren;
			if (img.src.lastIndexOf(this.horizontalSelectedIcon) == -1) {
			
				this.toggleSelectionClass(refTitle, true);		
				img.src = this.imgBasePath + this.horizontalSelectedIcon;
				
				if (this.horizontalFacetImg != null) {
					var prevLabel = this.horizontalFacetImg.parentNode.previousSibling.previousSibling;
					this.horizontalFacetImg.src = this.imgBasePath + this.horizontalIcon;
					this.toggleSelectionClass(this.horizontalFacetImg.parentNode.parentNode.parentNode, false);
					dijit.setWaiState(prevLabel, "selected", "false");			
				}
				
				this.horizontalFacetLabel = facetLabel;
				this.horizontalFacetId = facetId;
				this.horizontalFacetImg = img;
				this.horizontalHasSubfacets = hasSubfacets;
				dijit.setWaiState(label, "selected", "true");
				
				dojo.publish("horizontalFacetChanged", [{
					horizontalFacetLabel: this.horizontalFacetLabel,
					horizontalFacetId: this.horizontalFacetId,
					horizontalHasSubfacets: this.horizontalHasSubfacets,
					verticalFacetLabel: this.verticalFacetLabel,
					verticalFacetId: this.verticalFacetId,
					verticalHasSubfacets: this.verticalHasSubfacets
				}]);
			}
			return false;
		},
		
		applyFacetFilter: function(filterValue) {
			if (filterValue == null || filterValue.length == 0) {
				dojo.forEach(dojo.query("div.refinement-group-ica", this.domNode), dojo.hitch(this, function(elem) {
					dojo.style(elem, "display", "block");
				}));
			} else {
				var regexp = dojo.data.util.filter.patternToRegExp("*" + filterValue + "*", true);			
				dojo.forEach(dojo.query("div.refinement-group-ica", this.domNode), dojo.hitch(this, function(elem) {
					var refTitle = elem.firstChild;
					var facetLabel = refTitle.facet.label;
					if (facetLabel.match(regexp)) {
						dojo.style(elem, "display", "block");
					} else {
						dojo.style(elem, "display", "none");
					}
				}));
			}
		},
		
		buildFacetGroups: function(facets, parent, level) {
			var self = this;
			if (parent == null) parent = this.facetForm;
			if (facets == null) return;
			
			var _facets = facets.concat([]);
			if (this.sortType == "ascending") {
				_facets.sort(function(a,b) { return a.label > b.label; });
			} else if (this.sortType == "descending") {
				_facets.sort(function(a,b) { return a.label < b.label; });
			}
			for (var i=0; i<_facets.length; i++) {
				parent.appendChild(this.buildFacetGroupElem(_facets[i], level));				
			}
		},
				
		buildFacetGroupElem: function(facet, level) {
			var refGroup = dojo.doc.createElement("DIV");
			refGroup.level = level;
			dojo.addClass(refGroup, "refinement-group-ica");
			this._setRefGroupWidth(refGroup, level);
			dojo.style(refGroup, "position", "relative");

			var refTitle = dojo.doc.createElement("DIV");
//			refTitle.setAttribute("tabIndex", 0);
			refTitle.title = dojo.string.substitute(EDR.messages.tooltip_facet_mine, [facet.label]);
			dojo.addClass(refTitle, "refinement-title-ica");
			refTitle.facet = facet;
			refTitle.level = level;

//			this.handlers.push(dojo.connect(refTitle, "onclick", this, this.onFacetClicked));
//			this.handlers.push(dojo.connect(refTitle, "onkeypress", this, this.onFacetClicked));
			
			var contentTop = dojo.doc.createElement("DIV");
			dojo.addClass(contentTop, "refinement-title-top");
			contentTop.innerHTML = "<div></div>";
			
			var contentBody = this.buildFacetGroupContentElem(facet, level);
			
			var contentBottom = dojo.doc.createElement("DIV");
			dojo.addClass(contentBottom, "refinement-title-bottom");
			contentBottom.innerHTML = "<div></div>";
			
			var refGroupList = dojo.doc.createElement("DIV");
			refGroupList.style.display = 'none';
			if (this.filterEnabled) {
				refGroupList.innerHTML = "<div></div>"; // dummy to prevent load children facets when filter is enabled
			}
						
			refTitle.appendChild(contentTop);
			refTitle.appendChild(contentBody);
			refTitle.appendChild(contentBottom);
			
			refGroup.appendChild(refTitle);
			refGroup.appendChild(refGroupList);
			
			if (facet.id == this.verticalFacetId) {
				var evt = { type: "click", currentTarget: contentBody.childNodes[2] };
				this.verticalFacetSelected(evt);
			} else if (this.showSelectionIcons && facet.id == this.horizontalFacetId) {
				var evt = { type: "click", currentTarget: contentBody.childNodes[3] };
				this.horizontalFacetSelected(evt);
			}
			if (facet.hasChildren && facet.facets != null && facet.facets.length != 0 && facet.open == true) {
				// this is filtered category tree case. Forcefully expand children
				var evt = { type: "click", currentTarget: contentBody.firstChild };
				this.toggleFacetEventHandler(evt, true);
			}
			
			return refGroup;
		},
		
		buildFacetGroupContentElem: function(facet, level) {
			var contentBody = dojo.doc.createElement("DIV");
			this.handlers.push(dojo.connect(contentBody, "onclick", this, this.onFacetClicked));
			this.handlers.push(dojo.connect(contentBody, "onkeypress", this, this.onFacetClicked));
			
			dojo.addClass(contentBody, "refinement-title-body-ica");
//			dojo.style(contentBody, "paddingLeft", this.indentWidth * level + "px");
//			dojo.style(contentBody, "paddingLeft", "3px");

//			var arrowLink = dojo.create("A", {href:"javascript:;"}, contentBody);			
			var arrowContainer = dojo.create("DIV", {className: "arrow-container"}, contentBody);

//			var arrowImg = dojo.create("IMG", {className: "arrow-img", src: this.imgBasePath + "arrow_right8.png"}, arrowLink);
			var arrowImg = dojo.create("IMG", {className: "arrow-img",
				src: this.imgBasePath + (this.isLeftToRight() ? "arrow_right8.png" : "arrow_left8.png")}, arrowContainer);
			
			if (facet.hasChildren) {
//				this.handlers.push(dojo.connect(arrowLink, "onclick", this, this.toggleFacetEventHandler));
//				this.handlers.push(dojo.connect(arrowLink, "onkeypress", this, this.toggleFacetEventHandler));
				this.handlers.push(dojo.connect(arrowContainer, "onclick", this, this.toggleFacetEventHandler));
				this.handlers.push(dojo.connect(arrowContainer, "onkeypress", this, this.toggleFacetEventHandler));
				//dojo.attr(arrowContainer, "tabIndex", "0");				
				dojo.attr(arrowContainer, "title", EDR.messages.tooltip_facet_expandcollapse);				
				dojo.attr(arrowImg, "alt", EDR.messages.tooltip_facet_expandcollapse);				
			} else {
				//dojo.attr(arrowContainer, "tabIndex", "-1");				
				dojo.style(arrowImg, "visibility", "hidden");
			}
						
			var label = dojo.doc.createElement("DIV");
			dojo.addClass(label, "label-ica");
			this._setLabelWidth(label, level);
//			dojo.style(label, this.isLeftToRight() ? "paddingLeft" : "paddingRight", "0px");
//			dojo.style(label, "float", this.isLeftToRight() ? "left" : "right");
			if (facet.match) dojo.style(label, "fontWeight", "bold");
			label.level = level;
			label.innerHTML = facet.label;			
			label.tabIndex = 0;
			dijit.setWaiRole(label, "treeitem");
			dijit.setWaiState(label, "expanded", "false");
			dijit.setWaiState(label, "selected", "false");			
			
			contentBody.appendChild(label);

			var vfacetLink = dojo.create("A", {href:"javascript:;"}, contentBody);
			var vfacetImg = dojo.create("IMG", {src:this.imgBasePath + this.verticalIcon, className:"vertical-category-img"}, vfacetLink);
			dojo.attr(vfacetImg, "title", EDR.messages.tooltip_2d_facet1);
			dojo.attr(vfacetImg, "alt", EDR.messages.tooltip_2d_facet1);
			this.handlers.push(dojo.connect(vfacetLink, "onclick", this, this.verticalFacetSelected));
			this.handlers.push(dojo.connect(vfacetLink, "onkeypress", this, this.verticalFacetSelected));
			
			var hfacetLink = dojo.create("A", {href:"javascript:;"}, contentBody);
			var hfacetImg = dojo.create("IMG", {src:this.imgBasePath + this.horizontalIcon, className:"horizontal-category-img"}, hfacetLink);
			dojo.attr(hfacetImg, "title", EDR.messages.tooltip_2d_facet2);
			dojo.attr(hfacetImg, "alt", EDR.messages.tooltip_2d_facet2);
			this.handlers.push(dojo.connect(hfacetLink, "onclick", this, this.horizontalFacetSelected));
			this.handlers.push(dojo.connect(hfacetLink, "onkeypress", this, this.horizontalFacetSelected));

			// show/hide 2dmap icons
			dojo.style(vfacetImg, "visibility", this.showSelectionIcons ? "visible" : "hidden");
			vfacetLink.tabIndex = this.showSelectionIcons ? "0" : "-1";
			dojo.style(hfacetImg, "visibility", this.showSelectionIcons ? "visible" : "hidden");
			hfacetLink.tabIndex = this.showSelectionIcons ? "0" : "-1";
			
			return contentBody;
		},
		
		_setTreeItemWidth: function() {
			this.treeItemWidth = dojo.contentBox(this.domNode).w - 5;
			if (this.treeItemWidth < 100) this.treeItemWidth = 100;
		},
		
		_setRefGroupWidth: function(refGroup, level) {
			dojo.style(refGroup, "width", (this.treeItemWidth - (this.indentWidth * level + 25)) + "px");
			if (level == 0) {
				dojo.style(refGroup, this.isLeftToRight() ? "left" : "right", 0 + "px");
			} else {
				dojo.style(refGroup, this.isLeftToRight() ? "left" : "right", this.indentWidth + "px");
			}
		},
		
		_setLabelWidth: function(label, level) {
			dojo.style(label, "width", this.treeItemWidth - (92 + level * this.indentWidth)+ "px");
		},
		
		_normalizeFacetValue: function(value) {
			var ret = "";
			for (var i=0; i<value.length; i++) {
				var c = value.charAt(i);
				if (c == '"') {
					ret += '\\"';
				} else if (c == '\\') {
					ret += '\\\\';
				} else {
					ret += c;
				}
			}
			return ret;
		},
		
		// messages
		message_filter: EDR.messages.facetsearch_filter,
		message_title: EDR.messages.facetsearch_dialog_title,
		message_facetlabel: EDR.messages.facetsearch_dialog_facetLabel,
		message_facetpath: EDR.messages.facetsearch_dialog_facetPath,
		message_keyword: EDR.messages.facetsearch_dialog_keyword,
		message_searchtype: EDR.messages.facetsearch_dialog_search_type,
		message_keywordsearch: EDR.messages.facetsearch_dialog_search_keyword,
		message_subfacetsearch: EDR.messages.facetsearch_dialog_search_subfacet,
		message_search: EDR.messages.button_search,
		message_cancel: EDR.messages.K0001I_COMMON_CANCEL,
		message_addsearch: EDR.messages.searchpane_addsearch,
		message_newsearch: EDR.messages.searchpane_newsearch,
		message_clear: EDR.messages.button_clear,
		message_tooltip_filter: EDR.messages.analytics_categorytree_filter_tooltip,
		message_tooltip_clear: EDR.messages.analytics_categorytree_clear_tooltip,
		message_tooltip_searchtype: EDR.messages.analytics_categorytree_searchtype_tooltip,
		message_tooltip_facetpath: EDR.messages.analytics_categorytree_facetpath_tooltip,
		message_tooltip_keyword: EDR.messages.analytics_categorytree_keyword_tooltip		
	}
);