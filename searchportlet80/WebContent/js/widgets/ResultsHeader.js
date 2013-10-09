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
dojo.provide("widgets.ResultsHeader");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");


dojo.declare(
"widgets.ResultsHeader",
[dijit._Widget, dijit._Templated],
{
	widgetsInTemplate: false,
	templatePath: dojo.moduleUrl("widgets", "templates/ResultsHeader.html"),
	_headerWidth: {"title": 340},
	FILETYPE_WIDTH: 160,
	FILETYPE: "filetype",
	THUMBNAIL_WIDTH: 140,
	THUMBNAIL: "thumbnail",
	DEFAULT_WIDTH: 90,
	
	postCreate: function() {
//		this.sortImgRelevance.src = dojo.moduleUrl("widgets", "templates/images/arrow_down_blue8.png");
	
		dojo.subscribe("headerColumnsChanged", this, "_onChangeHeaderColumns");	
		dojo.subscribe("headerColumnsResized", this, "_onResized");
		dojo.subscribe("postLoad", this, "_onChangeHeaderColumns");
	},
	
	getWidth: function(columnName) {
		if(columnName) {
		var th = dojo.byId(EDR.prefix+"resultsHeader_"+columnName);
		if(th) {
			return th.clientWidth;
		} else {
			return -1;
		}
		} else {
			// return whole width
			return this.searchResultsHeaderTable.clientWidth;
	
		}
	},
	
	_onResized: function() {
		var row = this.headerRow;
		var cols = row.cells;
		var length = cols.length;
		var resizers = dojo.query("div.columnResizer",this.headerRow);
		var sumWidth = 0;
		for(var i=0; i<length; i++) {
			var width = dojo.contentBox(resizers[i].parentNode).w;
			this._headerWidth[dojo.attr(cols[i], "columnName")] = width;
			sumWidth += width;
		}
		var container = dijit.byId(EDR.prefix+"documentViewId").domNode;
		if(length>0){
			var contentWidth = dojo.contentBox(container.parentNode.parentNode).w; 
			if(sumWidth < contentWidth){
				var index = (dojo.isIE <= 8 && length > 1) ? length - 2 : length - 1; 
				var width = dojo.contentBox(resizers[index].parentNode.parentNode).w;
				var change = contentWidth - sumWidth;
				var newWidth = width + change;
				this._headerWidth[dojo.attr(cols[index], "columnName")] = newWidth;
				dojo.contentBox(resizers[index].parentNode.parentNode,{w:newWidth});
				dojo.contentBox(container,{w:(sumWidth+change-2)});
			}else{
				dojo.contentBox(container,{w:sumWidth-2});
			}
		}
	},
	
	_renderHeader: function(cols) {
		var searchManager = dijit.byId(EDR.prefix+"searchManager");
		
		dojo.empty(this.headerRow);
		
		var _capitalize = function(str) {
			return (str.substring(0,1).toUpperCase() + str.substring(1));
		};
		
		var tr = this.headerRow;
//		if(!searchManager || searchManager.needNarrowResults())
//		{
//			this._renderNarrowresults(tr);
//		}
		
		var sortKey = "relevance";
		var sortKeys = [];
		var sortableFields = [];
		var sortOrder = "dsc";

		if(searchManager) {
			var results = searchManager.getSearchResult();
			if(results) {
				sortKey = results.sortKey;
				sortKeys = sortKey.split(":");
				for(var i=0; i<sortKeys.length; ++i) {
					if(sortKeys[i] == "[Relevance]") {
						sortKeys[i] = "relevance";
					} else if(sortKeys[i] == "[Date]") {
						sortKeys[i] = "date";
					}
				}
				sortOrder = results.sortOrder;
				if(sortOrder != null) {
					var sortOrders = sortOrder.split(":");
					sortOrder = sortOrders[0];
				}
				
				var columns = results.resultColumns.columns;
				for(var i=0; i<columns.length; ++i) {
					if(columns[i].sortable) {
						sortableFields.push(columns[i].name);
					}
				}
			} else {
				// use default values
			}
		}
		
		for(var i=0; i<cols.length; i++) {
			var col = cols[i];
			this._renderHeaderColumn(tr, col, sortKeys, sortOrder, sortableFields);
		}
	},
	
	_renderNarrowresults: function(tr) {
		var th = dojo.create("th", {style: "width: 216px;max-width:216px;min-width:216px;", columnName: "narrowresults"}, tr);
		var outerDiv = dojo.create("div", {className: "tableHeaderCell searchResultSelection", resizeableColumnBodyPrefixID: "searchResultCol1", id:EDR.prefix+"searchResultSelectionHeaderCell",style:"width:214px"}, th);
//		var outerDiv = dojo.create("div", {className: "tableHeaderCell searchResultSelection", id:"searchResultSelectionHeaderCell", style:"width:214px"}, th);
		dojo.attr(outerDiv, "columnWidth", 216);
		var contentDiv = dojo.create("div", {className: "tableHeaderCellContent", style: "width: 210px;", innerHTML: EDR.messages.columns_narrowresults}, outerDiv);
		this._addColumnResizer(outerDiv, false);
	},
	
	_renderHeaderColumn: function(tr, col, sortKeys, sortOrder, sortableFields) {
		//example
		//<th id="resultsHeader_columnName">
        //  <div style="width: 100px" class="tableHeaderCell searchResultFlags" resizeableColumnBodyPrefixID="searchResultCol_relevance">
		//    <div class="tableHeaderCellContent">
		//      <span>
		//        <a class="sortKey currentKey" href="javascript:;">
		//          Relevance<img dojoAttachPoint="sortImgRelevance" src="images/arrow_down_blue8.png" 
		//            title="" alt=""/><span class="tableHeaderCellContentSpacer">&nbsp;</span></a>
		//      </span>
		//    </div>
        //    <div class="columnResizer" onmousedown="EDR.util.ResizableTable.startResize(event)">|</div>
		//  </div>
		//</th>
		//
	var width;
		if(!width) {
			if(this._headerWidth[col]) {
				width = this._headerWidth[col];
			} else {
				//initialize
				if(col==this.FILETYPE){
					this._headerWidth[col] = width = this.FILETYPE_WIDTH;
				}else if(col==this.THUMBNAIL){
					this._headerWidth[col] = width = this.THUMBNAIL_WIDTH;
				}else{
					this._headerWidth[col] = width = this.DEFAULT_WIDTH;
				}
			}
		}
		var args = {id: EDR.prefix+"resultsHeader_"+col, columnName: col};
		var th = dojo.create("th", args, tr);
//		if(col != "thumbnail") {
			dojo.style(th, "width", width + "px");
//		}
		var outerDiv = dojo.create("div", {className: "tableHeaderCell searchResultFlags", resizeableColumnBodyPrefixID: "searchResultCol_"+col}, th);
		dojo.attr(outerDiv, "columnWidth", width);
		var contentDiv = dojo.create("div", {className: "tableHeaderCellContent"}, outerDiv);
		var span;
		if(dojo.indexOf(sortableFields, col) >= 0) {
			span = dojo.create("span", null, contentDiv);
			if(EDR.messages["tooltip_columns_"+col]) {
				dojo.attr(span,"title",EDR.messages["tooltip_columns_"+col]);
			} else {
				var tooltipSortField;
				if(sortKeys[0] == col) {
					if(sortOrder == "ascending") {
						tooltipSortField = EDR.messages.tooltip_sortBy_fieldDescending;
					} else {
						tooltipSortField = EDR.messages.tooltip_sortBy_fieldAscending;
					}
				} else {
					if(sortOrder == "ascending") {
						tooltipSortField = EDR.messages.tooltip_sortBy_fieldAscending;
					} else {
						tooltipSortField = EDR.messages.tooltip_sortBy_fieldDescending;
					}				
				}
				dojo.attr(span,"title",tooltipSortField);
			}
			
			var imgTag = "";
			if(sortKeys[0] == col) {
				if(sortOrder == "descending") {
					var sortedDescending = EDR.messages.prompt_descending_active;
					imgTag = "<img src='" + EDR.contextPath + "/images/arrow_down_blue8.png' alt='"+ sortedDescending +"' title='"+ sortedDescending+"'>";
				} else {
					var sortedAscending = EDR.messages.prompt_ascending_active;
					imgTag = "<img src='" + EDR.contextPath + "/images/arrow_up_blue8.png' alt='"+ sortedAscending +"' title='"+ sortedAscending +"'>";
				}
//				if(sortKeys.length > 1) {
//					imgTag += "<span class='tableHeaderSortByNumber'>" + (sortKeysIndex+1) + "</span>";
//				}				
			}
			
			var field = col;
			if(col == "relevance") field = "[Relevance]";
			var a = dojo.create("a", {href: "javascript:;",innerHTML: (EDR.messages["columns_"+col]?EDR.messages["columns_"+col]:col) + imgTag + "<span class='tableHeaderCellContentSpacer'>&nbsp;</span>"}, span);
			var columnField=field;
			var nextSortOrder;
			if(field == "[Relevance]") {
				nextSortOrder = "descending";
			} else if(field == sortKeys[0] || (field == "date" && sortKeys[0] == "[Date]")) {
				nextSortOrder = sortOrder == "descending" ? "ascending" : "descending";
			} else {
				nextSortOrder = sortOrder;
			}			
			a.onclick=function(field, order){
				return function(){
					EDR.bean.Email.sortByField(columnField, nextSortOrder);
				};
			}(columnField, nextSortOrder);
			
			dojo.addClass(a, "sortKey");
			if(col == sortKeys[0]) {
				dojo.addClass(a, "currentKey");
			}
		} else {
			var headerText = EDR.messages["columns_"+col];
			if(!headerText) {
				headerText = col;
			}
			span = dojo.create("span", {innerHTML: headerText + "<span class='tableHeaderCellContentSpacer'>&nbsp;</span>"}, contentDiv);	
			var tooltip = EDR.messages["tooltip_columns_"+col] ? EDR.messages["tooltip_columns_"+col] : col;
			dojo.attr(span,"title", tooltip);
		}
		this._addColumnResizer(outerDiv, true);		
	},
	
	_addColumnResizer: function(div, resizable) {
		var args ={innerHTML: "|",className: "columnResizer"};
		if(resizable) {
//			args.onmousedown = "EDR.util.ResizableTable.startResize(event)";
			args.onmousedown=function(event){
				EDR.util.ResizableTable.startResize(event);
			};
		}
		//<div class="columnResizer" onmousedown="EDR.util.ResizableTable.startResize(event)">|</div>
		var resizer = dojo.create("div", args, div);
	},
	
	_onChangeHeaderColumns: function(args) {
		var searchManager = dijit.byId(EDR.prefix+"searchManager");
		var cols = searchManager.getColumnDefs();
		this._renderHeader(cols);
	},

	onShow: function() {
		dijit.byId(EDR.prefix+"resultsBody").processCachedSearchResults();
	},
	
	onHide: function() {
	},

	__dummy__: ''
});
