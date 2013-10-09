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
dojo.provide("widgets.SearchManager");

dojo.require("dijit._Widget");

dojo.declare(
	"widgets.SearchManager", [dijit._Widget],
	{				
		timeout: 60000,
		initErrorJson: {},
		isTextAnalyticsEnabled: false,
		collectionCounts: 0,
		query: "",
		view: "",
		facets: "",
		
		_closure: null,
		
		_heartBeatUrl : "search?action=touch",

		_searchResult: null,
		_numberOfDocs: 0,
		_columnDefs: null,

		_showFacets: true,
		_showTopResults: true,
			
		_heartBeat: function() {
			dojo.xhrGet({
				url: this._heartBeatUrl,
				error: dojo.hitch(this, "_heartBeatError"),
				timeout: dojo.hitch(this, "_heartBeatTimeout")
			});
		},
			
		_heartBeatError: function() {
		},
			
		_heartBeatTimeout: function() {
		},

		setShowFacets: function(show) {
			this._showFacets = show;
		},
		
		setShowTopResults: function(show) {
			this._showTopResults = show;
		},
		
		needNarrowResults: function() {
			if(this._searchResult == null) {
				return (this._showFacets || this._showTopResults);
			} else {
				if(this._searchResult.isFacetedSearch) {
					return this._showFacets;
				} else {
					return this._showTopResults;
				}
			}
		},
		
		getSearchResult: function() {
			return this._searchResult;
		},
		
		getColumnDefs: function() {
			return this._columnDefs;
		},
		
		setColumnDefs: function(defs) {
			this._columnDefs = defs;
		},
		
		postCreate: function() {
			this.inherited("postCreate", arguments);

//				dojo.subscribe("postLoad", this, "_showHideNarrowResults");
		},
		
		_showHideNarrowResults: function() {
			var searchPane = dijit.byId(EDR.prefix+"horizontalSearchPanes");
			var leftContentPane = searchPane.leftContentPane;
			var borderContainer = searchPane.resultsBodyContainer;
			var splitter = dojo._isBodyLtr() ? borderContainer._splitters["left"] : borderContainer._splitters["right"]; 
			if((this.needNarrowResults())&&(!EDR.isSmallPortletLayout)) {
					dojo.style(splitter,"display", "block");
					dojo.style(leftContentPane.domNode,"width","250px");
					dojo.style(leftContentPane.domNode,"visibility","visible");			
			} else {
					dojo.style(splitter,"display", "none");
					dojo.style(leftContentPane.domNode,"width","0px"); 
					dojo.style(leftContentPane.domNode,"visibility","hidden");			
			}
			borderContainer.layout();
			dijit.byId(EDR.prefix+"topBorderContainer").layout();
		},
		
		submitQuickRefineSearch: function(params) {
			if(this.isTextAnalyticsEnabled){
				var queryTree = dijit.byId(EDR.prefix+"queryTree");
				if(queryTree.getSelectedCell()!=null){
					params.queryTreeSelectionId = dojo.attr(queryTree.getSelectedCell(),"cellId");
				}
			}
			var args = 	{ 
				url: EDR.contextPath + "/search?action=refineSearch",
				progressText: EDR.messages.prompt_search_searching,
				successCallback: dojo.hitch(this, "processSearchResults"),
//				errorCallback: dojo.hitch(this, "handleSearchError"),
				timeout: this.timeout,
				content: params
			};
			EDR.ajax.Request.post(args);
			return false;
		},
		
		submitSavedSearch: function(params) {
			var docFilterValue = dijit.byId(EDR.prefix+"horizontalSearchPanes").resultToolbar.filterBySelectBox.attr("value");
			if(docFilterValue!="ALL"){
				params.doctypefilter=docFilterValue;
			}
			var resultsPerPageWidget = dijit.byId(EDR.prefix+"resultsPerPage");
			if(resultsPerPageWidget){
				params.resultsPerPage=resultsPerPageWidget.attr("value");
			}
			var args = 	{ 
				url: EDR.contextPath + "/search?action=" + "loadSavedSearch",
				progressText: EDR.messages.prompt_search_searching,
				successCallback: dojo.hitch(this, "processSearchResults"),
//				errorCallback: dojo.hitch(this, "handleSearchError"),
				timeout: this.timeout,
				content: params
			};
			EDR.ajax.Request.post(args);
			return false;
		},
		
		submitNextSearch: function() {
			var docFilterValue = dijit.byId(EDR.prefix+"horizontalSearchPanes").resultToolbar.filterBySelectBox.attr("value");
			var params = {};
			if(docFilterValue!="ALL"){
				params.doctypefilter=docFilterValue;
			}
			var resultsPerPageWidget = dijit.byId(EDR.prefix+"resultsPerPage");
			if(resultsPerPageWidget){
				params.resultsPerPage=resultsPerPageWidget.attr("value");
			}
			var args = 	{ 
				url: EDR.contextPath + "/search?action=" + "loadNextSearch",
				progressText: EDR.messages.prompt_search_searching,
				successCallback: dojo.hitch(this, "processSearchResults"),
//				errorCallback: dojo.hitch(this, "handleSearchError"),
				timeout: this.timeout,
				content: params
			};
			EDR.ajax.Request.post(args);
			return false;
		},

		submitPreviousSearch: function() {
			var docFilterValue = dijit.byId(EDR.prefix+"horizontalSearchPanes").resultToolbar.filterBySelectBox.attr("value");
			var params = {};
			if(docFilterValue!="ALL"){
				params.doctypefilter=docFilterValue;
			}
			var resultsPerPageWidget = dijit.byId(EDR.prefix+"resultsPerPage");
			if(resultsPerPageWidget){
				params.resultsPerPage=resultsPerPageWidget.attr("value");
			}
			var args = 	{ 
				url: EDR.contextPath + "/search?action=" + "loadPreviousSearch",
				progressText: EDR.messages.prompt_search_searching,
				successCallback: dojo.hitch(this, "processSearchResults"),
//				errorCallback: dojo.hitch(this, "handleSearchError"),
				timeout: this.timeout,
				content: params
			};
			EDR.ajax.Request.post(args);
			return false;
		},
		
		submitQuickKeywordSearch: function(keywords, closure, isInitial) {
			if(closure && dojo.isFunction(closure)) {
				this._closure = closure;
			}
			var params = { keywords: keywords };
			if(isInitial) {
				params["isInitial"] = true;
			}
			this.submitSearch(null, "search", params);
		},
		
		submitSearch: function(searchPane, type, params) {
			if(this.isTextAnalyticsEnabled){
				var queryTree = dijit.byId(EDR.prefix+"queryTree");
				if(queryTree.getSelectedCell()!=null){
					params.queryTreeSelectionId = dojo.attr(queryTree.getSelectedCell(),"cellId");
				}
			}
			
			var docFilterValue = dijit.byId(EDR.prefix+"horizontalSearchPanes").resultToolbar.filterBySelectBox.attr("value");
			if(docFilterValue!="ALL"){
				params.doctypefilter=docFilterValue;
			}
			var resultsPerPageWidget = dijit.byId(EDR.prefix+"resultsPerPage");
			if(resultsPerPageWidget){
				params.resultsPerPage=resultsPerPageWidget.attr("value");
			}
			var args = 	{ 
				url: EDR.contextPath + "/search?action=" + type,
				progressText: EDR.messages.prompt_search_searching,
				successCallback: dojo.hitch(this, "processSearchResults"),
//				errorCallback: dojo.hitch(this, "handleSearchError"),
				timeout: this.timeout,
				content: params
			};
			if(params.keywords == "") {
				args.showProgress = false;
			}
			EDR.ajax.Request.post(args);
			return false;
		},
		
		getResultColumnStringFromJson: function(columnObjArray){
			var length = columnObjArray.length;
			var columnStrArray = [];
			for(var i = 0 ; i<length ; i++){
				if(columnObjArray[i].show==true)
					columnStrArray.push(columnObjArray[i].name);
			}
			return columnStrArray;
		},				
		
		processSearchResults: function(response, ioArgs) {
			// publish pre load search results event
			dojo.publish("preLoad");
			try {
				this._searchResult = dojo.fromJson(response);
				if(EDR.isRestoreSessionResults && this._searchResult.fullQuery == "") {
					return;
				}
				EDR.isCategoryTreeEnabled = this._searchResult.isCategoryTreeEnabled;
				if(this._searchResult.allNumberOfResults >= 0) {
					this._numberOfDocs = this._searchResult.allNumberOfResults;
				}
				
				if(!this._columnDefs) {
					var defs = this.getResultColumnStringFromJson(this._searchResult.resultColumns.columns);
					this.setColumnDefs(defs);
				}					
			} catch(e) {
				alert(e);
			}
			// publish post load search results event			
			dojo.publish("postLoad");

			// publish refresh UI components event
			dojo.publish("refresh");
			
			// if closure exists, call it
			if(this._closure) {
				this._closure();
				this._closure = null;
			}
		},
				
		handleSearchError: function(response, ioArgs) {
			// publish Ajax error handling event
			dojo.publish("ajaxError", [response, ioArgs]);			
		},			

		destroy: function() {
			this.inherited("destroy", arguments);
		},

		removeTreeNode: function(searchPane, type, params) {
			var args = 	{ 
				url: EDR.contextPath + "/queryTree?action=" + type,
				progressText: EDR.messages.prompt_search_searching,
				successCallback: dojo.hitch(this, "processSearchResults"),
				timeout: this.timeout,
				content: params
			};
			EDR.ajax.Request.post(args);
			return false;
		}
		
		
	}
);