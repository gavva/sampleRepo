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
dojo.provide("widgets.FacetItems");

dojo.require("widgets.FacetBase");
dojo.require("widgets.Toolbar");
dojo.require("dijit._Templated");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dojo.data.util.filter");

dojo.declare(
	"widgets.FacetItems", [widgets.FacetBase, dijit._Templated],
	{		
		prefix: EDR.prefix,
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl("widgets", "templates/FacetItems.html"),
		_autoLoad: false,
		url: "",
		
		itemIdPrefix: "dlg_",
		facetName: "",
		facetPath: "",
		maxSize: 0,
		store: null,
		json: null,
		
		filterTimer: null,
		filterDuration: 500,
		filter: {itemLabel:"*"},
		showType: "all", /* "andfacets" "notfacets" */
		queryOptions: {ignoreCase: true},
		descending: true,
		sort: [],

		pageWidth: 200,
		labelWidth: 150,
		labelHeight: 20,
		
		itemLength: 0,
		numOfPageRows: 20,
		numOfPages: 3,
		numOfVisiblePages: 3,
		beginOffset: 0,
		endOffset: 0,
		maxScrollLeft: 0,
		maxScrollDelta: 0,
				
		messages_facetItems_label_filter : EDR.messages.facetItems_label_filter,
		messages_facetItems_label_sortBy  : EDR.messages.facetItems_label_sortBy ,
		messages_facetItems_label_count  : EDR.messages.facetItems_label_count ,
		messages_facetItems_label_show  : EDR.messages.facetItems_label_show ,
		messages_facetItems_label_all  : EDR.messages.facetItems_label_all ,
		messages_facetItems_label_include  : EDR.messages.facetItems_label_include ,
				
		postCreate: function() {
			this.inherited("postCreate", arguments);
			this.handlers.push(dojo.connect(this.facetTableContainer, "onscroll", this, "onScroll"));
			
			if (this._autoLoad && this.url != null && this.url.length != 0) {
				this.load(this.url);
			} else {
				this.json = this._getNullGroups();
				this._buildDummyTable(dojo.contentBox(this.domNode).w);
			}
		},
		
		startup: function() {
			this.inherited("startup", arguments);
//			this.filterText.focus();
		},
		
		load: function(url) {
			var params = this.getRequestParams();			
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
					this.loadJson(json);	
					this.postLoad();		
				}),
				afterErrorHandlerCallback: dojo.hitch(this, function(response, ioArgs) {
					this.loadErrorHandler(response, ioArgs);
				}),
				content: params,
				timeout: this.timeout
			};			
			this.preLoad();					
			EDR.ajax.Request.post(args);
		},
		
		preLoad: function() {
			EDR.ajax.Loading.setIsLoading(this.facetTableContainer);
		},
		
		postLoad: function() {
			EDR.ajax.Loading.clearIsLoading(this.facetTableContainer);
		},
		
		loadErrorHandler: function() {
			EDR.ajax.Loading.clearIsLoading(this.facetTableContainer);
		},
		
		getRequestParams: function() {
			return params = {
				facetName: this.facetName,
				facetPath: this.facetPath,
				facetId: this.facetId,
				maxSize: this.maxSize
			};
		},
				
		onFilterChanged: function(evt) {
			if (this.filterTimer != null) {
				clearTimeout(this.filterTimer);
				this.filterTimer = null;
			}

			var self = this;
		 	this.filterTimer = setTimeout(function() {
		 		var filter = "*" + self.filterText.value + "*";
		 		if (self.filter.itemLabel != filter) {
		 			self.filter.itemLabel = filter;
		 			self.rerender(self.json);
		 		}	
		    }, this.filterDuration);
		},	
		
		clearFilter: function(evt) {
			if (this.filterTimer != null) {
				clearTimeout(this.filterTimer);
				this.filterTimer = null;
			}
			this.filter.itemLabel = "*";
			this.filterText.value = "";
		},
		
		onCountSortClicked: function(evt) {
			if (this.descending) {
				this.desArrowImg.src = this.imgBasePath + "arrow_down8_d.png";
				this.ascArrowImg.src = this.imgBasePath + "arrow_up_blue8.png";
				this.sort = [{
					attribute: "count",
					descending: false
				}];
			} else {
				this.desArrowImg.src = this.imgBasePath + "arrow_down_blue8.png";
				this.ascArrowImg.src = this.imgBasePath + "arrow_up8_d.png";
				this.sort = [];
			}
			this.descending = !this.descending;
		 	this.rerender(this.json);
		},
		
		toggleCheckBoxEventHandler: function(chkbox) {
			this.inherited(arguments);
			this.facetSelectedSpan.innerHTML = "(" + this.andfacets.count + " " + "selected" + ")";
		},
		
		onScroll: function(evt) {
			var scrollLeft = Math.abs(parseInt(this.facetTableContainer.scrollLeft));			
			var scrollDelta = scrollLeft % this.pageWidth;
			var pages = Math.floor(scrollLeft / this.pageWidth); 
			
			var prevBeginOffset = this.beginOffset;
			var prevEndOffset = this.endOffset;
			
			if (scrollLeft == this.maxScrollLeft) {
				this.endOffset = this.itemLength;	
				this.beginOffset = this.numOfPageRows * pages;
				dojo.style(this.facetTable, "left", this.maxScrollDelta + "px");				
			} else if (scrollLeft == 0) {
				this.beginOffset = 0;
				this.endOffset = this.beginOffset + this.numOfPageRows * this.numOfVisiblePages;		
				dojo.style(this.facetTable, "left", 0 + "px");							
			} else {
				this.beginOffset = this.numOfPageRows * pages;
				this.endOffset = this.beginOffset + this.numOfPageRows * this.numOfVisiblePages;		
				dojo.style(this.facetTable, "left", scrollLeft - scrollDelta + "px");
			}			

			if (prevBeginOffset != this.beginOffset || prevEndOffset != this.endOffset)			
				this.updateRange();
		},
		
		onShowAllClicked: function(evt) {
			dojo.style(this.allLabel, "display", "");
			dojo.style(this.allLink, "display", "none");
			dojo.style(this.includeLabel, "display", "none");
			dojo.style(this.includeLink, "display", "");
/*			dojo.style(this.excludeLabel, "display", "none");
			dojo.style(this.excludeLink, "display", "");*/
			
			this.showType = "all";
			this.rerender(this.json);
		},

		onShowIncludeClicked: function(evt) {
			dojo.style(this.allLabel, "display", "none");
			dojo.style(this.allLink, "display", "");
			dojo.style(this.includeLabel, "display", "");
			dojo.style(this.includeLink, "display", "none");
/*			dojo.style(this.excludeLabel, "display", "none");
			dojo.style(this.excludeLink, "display", ""); */
			
			this.showType = "andfacets";
			this.rerender(this.json);
		},
/*		
		onShowExcludeClicked: function(evt) {
			dojo.style(this.allLabel, "display", "none");
			dojo.style(this.allLink, "display", "");
			dojo.style(this.includeLabel, "display", "none");
			dojo.style(this.includeLink, "display", "");
			dojo.style(this.excludeLabel, "display", "");
			dojo.style(this.excludeLink, "display", "none");
			
			this.showType = "notfacets";
			this.rerender(this.json);
		},
*/		
		render: function(facet) {
			this.buildViewConstants(facet.items);
			
			var self = this;
			this.store = new dojo.data.ItemFileReadStore({data: facet});
			this._overrideStoreFunction(this.store);
			var request = this.store.fetch({
				query: this.filter,
				queryOptions: this.queryOptions,
				sort: this.sort,				
				start: this.beginOffset,
				count: this.endOffset - this.beginOffset,
				onComplete: function(items) {
					var len = Math.ceil(items.length / self.numOfPageRows);
					for (var i=0; i<len; i++) {
						self.buildFacetItemColumn(
							items,
							i*self.numOfPageRows,
							Math.min((i+1)*self.numOfPageRows, items.length),
							self.itemsRow
						);
					}
				}
			});
		},
		
		rerender: function(facet) {
			if (facet == null) facet = this.json;
			this.buildViewConstants(facet.items);
			this.updateRange();			
		},
		
		buildViewConstants: function(items) {
		
			// calculate constans
			this.facetTableContainer.scrollLeft = 0;
			this.itemLength = this.getFilteredItemsLength(items, this.filter.itemLabel);
						
			var size = dojo.contentBox(this.domNode);
			this.numOfPages = Math.ceil(this.itemLength / this.numOfPageRows);
			this.numOfVisiblePages = Math.min(Math.ceil(size.w / this.pageWidth), this.numOfPages);
			
			var dummyWidth = Math.max(this.numOfPages * this.pageWidth, size.w);
			this.maxScrollLeft = dummyWidth - size.w;
			this.maxScrollDelta = Math.max((this.numOfPages - this.numOfVisiblePages) * this.pageWidth, 0);
			
			this._buildDummyTable(dummyWidth);
			
//			dojo.style(this.dummyTable, "width", dummyWidth + "px");
//			dojo.style(this.facetTable, "width", this.numOfVisiblePages * this.pageWidth + "px");
			
			var width = this.numOfVisiblePages * this.pageWidth;
			var height = this.numOfPageRows * this.labelHeight;
			dojo.marginBox(this.facetTable, {
					w: width,
					h: height
			});
			
			this.beginOffset = 0;
			this.endOffset = this.numOfVisiblePages * this.numOfPageRows;
			
			// update view labels
			this.facetNameSpan.innerHTML = this.itemLength + " " + this.json.facetLabel;
			this.facetSelectedSpan.innerHTML = "(" + this.andfacets.count + " " + "selected" + ")";
		},

		updateColumn: function(column, beginOffset, endOffset) {
			var self = this;
			if (beginOffset == 0 && endOffset == 0) {
				self.updateFacetItemColumn(null, 0, 0, column);
			} else {
				var request = this.store.fetch(
					{
						query: this.filter,
						queryOptions: this.queryOptions,
						sort: this.sort,
						start: beginOffset,
						count: endOffset - beginOffset,
						onComplete: function(items) {
							self.updateFacetItemColumn(items, beginOffset, endOffset, column);
						}
					}
				);
			}
		},
		
		updateRange: function() {
			this.beginOffset = Math.max(0, this.beginOffset);
			this.endOffset = Math.min(this.endOffset, this.itemLength);
			
			var columns = this.facetTable.rows[0].cells;
			var len = Math.ceil((this.endOffset - this.beginOffset) / this.numOfPageRows);
			
			for (var i=0; i<len; i++) {
				this.updateColumn(
					columns[i],
					this.beginOffset + i * this.numOfPageRows,
					Math.min(this.endOffset, this.beginOffset + (i+1) * this.numOfPageRows)
				);
			} 
			for (var i=len; i<columns.length; i++) {
				this.updateColumn(
					columns[i],
					0, 0 // render empty cell
				);
			}
		},

		getFilteredItemsLength: function(items, filter) {
			if (filter == "*") return items.length;
			
			var regexp = dojo.data.util.filter.patternToRegExp(filter, true);
			var count = 0;
			for (var i=0; i<items.length; i++) {
				var label = this.store == null ? items[i].itemLabel : this.store.getValue(items[i], "itemLabel");
				if (label.match(regexp))
					count++;
			}
			return count;
		},		
		
		buildItemLabel: function(item) {
			return "<span style='padding-left:5px;'>" + this._getTruncatedLabel(item, this.labelWidth) + "</span>";
		},
		
		loadJson: function(facet) {
			if (facet == null) return;			
			this.json = facet;
			this.render(facet);
		},
		
		buildFacetItemColumn: function(items, beginOffset, endOffset, parent) {
			var column = dojo.doc.createElement("TD");
			dojo.addClass(column, "facet-column");
			dojo.style(column, "width", this.pageWidth + "px");

			for (var i=beginOffset; i<endOffset; i++) {
				var itemElem = this.buildFacetItemElem(items[i]);
				dojo.addClass(itemElem, "facet-row");
				dojo.addClass(itemElem, i % 2 == 0 ? "even" : "odd");
				column.appendChild(itemElem);
				dojo.marginBox(itemElem, {h:this.labelHeight});			
			}			
			parent.appendChild(column);
		},
		
		updateFacetItemColumn: function(items, beginOffset, endOffset, column) {
			var itemDivs = dojo.query("> DIV", column);
			var itemIndex = 0;
			if (items == null || items.length == 0) {
				dojo.style(column, "display", "none");
			} else {
				dojo.style(column, "display", dojo.isIE ? "block" : "table-cell");
				for (var i=0; i<itemDivs.length; i++) {
					if (itemIndex < items.length) {
						var item = items[itemIndex];
						var parent = itemDivs[i];
						
						dojo.style(parent, "display", "block");
						
						var facetInput = parent.firstChild;					
						facetInput.setAttribute("value", item.postParamValue + "");
						
						facetInput.chkbox.attr("checked", this.andfacets.contains(item.postParamValue + ""));
						
						var labelLink = facetInput.nextSibling.nextSibling;
						labelLink.setAttribute("itemId", item.itemId + "");
						labelLink.innerHTML = this.buildItemLabel(item);
						var labelTitle = dojo.string.substitute(EDR.messages.tooltip_facet_quick, ['"' + item.itemLabel + '"']);
						labelLink.title = labelTitle;
						//this.handlers.push(dojo.connect(labelLink, "onclick", this, this.facetSelectedEventHandler));
												
						var text = labelLink.nextSibling;
						parent.removeChild(text);
						text = dojo.doc.createTextNode(" (" + item.count + ")");
						parent.appendChild(text);	
						
						itemIndex++;				
/*						
						var andImg = facetInput.nextSibling.firstChild;
						var notImg = facetInput.nextSibling.nextSibling.firstChild;
						
						if (facetInput.name == "andfacet") {
							if (!this.andfacets.contains(item.postParamValue)) {
								this.toggleAndImgEventHandler(
									{type: "click", currentTarget: andImg.parentNode, viewOnly:true}
								);								
							}
						} else if (facetInput.name == "notfacet") {
							if (!this.notfacets.contains(item.postParamValue)) {
								this.toggleNotImgEventHandler(
									{type: "click", currentTarget: notImg.parentNode, viewOnly:true}
								);								
							}
						}
						if (facetInput.name == "facet") {
							if (this.andfacets.contains(item.postParamValue)) {
								this.toggleAndImgEventHandler(
									{type: "click", currentTarget: andImg.parentNode, viewOnly:true}
								);								

							} else if (this.notfacets.contains(item.postParamValue)) {
								this.toggleNotImgEventHandler(
									{type: "click", currentTarget: notImg.parentNode, viewOnly:true}
								);						
							}
						}
*/		
					} else {
						dojo.style(itemDivs[i], "display", "none");
					}
				}
			}
		},
		
		clear: function() {
			dojo.forEach(dijit.findWidgets(this.facetTable), function(widget) {
				widget.destroy();
			});			
			dojo.empty(this.itemsRow);
			dojo.empty(this.dummyCell);
			this.clearFilter();
			this.store = null;		
		},
		
		_buildDummyTable: function(dummyWidth) {
			this.dummyCell.innerHTML = "";
			for (var i=0; i<this.numOfPageRows; i++) {
				var div = dojo.doc.createElement("DIV");
				dojo.addClass(div, "facet-row");
				dojo.addClass(div, i % 2 == 0 ? "even" : "odd");				
				this.dummyCell.appendChild(div);
				dojo.marginBox(div, {w:dummyWidth, h:this.labelHeight});			
			}
			
			var height = this.numOfPageRows * this.labelHeight;
			if (dojo.isIE == 7) height += 15;
			dojo.marginBox(this.dummyTable, {
					w: dummyWidth,
					h: height
			});
		},
		
		// build ellipssed strings
		_getTruncatedLabel: function(item, width) {
			var label = item.itemLabel + "";
			var count = " (" + item.count + ")";
			if (this._getStringExtent(label + count) < width) {
				return label;
			} else {
				var ellipse = "... (" + item.count + ")";
				var labelWidth = width - this._getStringExtent(ellipse);
				if (labelWidth > 0) { 	
					for (var i=0; i<label.length; i++) {
						var s = label.slice(0, i);
						if (labelWidth < this._getStringExtent(s) && i > 0) {
							return label.slice(0, i-1) + "...";
						}
					}				
				}
				return ellipse;
			}
		},
		
		_getStringExtent: function(str) {
			this.hiddenSpan.innerHTML = str;
			var size = this.hiddenSpan.offsetWidth;
			this.hiddenSpan.innerHTML = "";
			return size;
		},
		
		_overrideStoreFunction: function(store) {
			// hack to enable facet selectoin filter
			var self = this;
			var tf = store._containsValue;
			store._containsValue = function(item) {
				if (self.showType == "andfacets" && !self.andfacets.contains(item.postParamValue + "")) {
					return false;
				} else if (self.showType == "notfacets" && !self.notfacets.contains(item.postParamValue + "")) {
					return false;
				}
				return tf.apply(store, arguments);
			};
		},
		
		_getNullGroups: function() {
			return {
				facetLabel: "",
				facetId: "-",
				items: [],
				facets: []
			};
		}
	}
);