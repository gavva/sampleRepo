<!-- *********************** ES COPYRIGHT START  *********************************
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
//*********************** ES COPYRIGHT END  *********************************** -->

<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<%@ include file="/common/includes.jsp" %>
 
<%--
	This JSP is included in the main layout JSP and is used to bootstrap anything on the screen.  For example,
	we need to ensure the refinement options, visualizations, and search criteria stay on the screen
	when the user leaves the search page and then returns usually by switching to admin mode.
--%>
<script type="text/javascript">

	function doInit() {
		// hack to avoid button layout problem in IE7.
		if (<es:dojo />.isIE <= 7) {
			<es:dijit />.registry.byClass("widgets.Button").forEach(function(widget){
				widget.adjustButtonWidth();
			});
		}
		
		// enable/disable export toolbar icon
		var resultToolbar = <es:dijit />.byId(EDR.prefix+"horizontalSearchPanes").resultToolbar
		resultToolbar.enableExportButton(EDR.isExportEnabled);
		resultToolbar.changeOptionsState(EDR.isDocCacheEnabled);
		resultToolbar.enableDeepInspectionButton(EDR.isDeepInspectionEnabled);
		resultToolbar.changeSecureMode(EDR.isSecureCollection);
		
		// handle initialization error
		var searchManager = <es:dijit />.byId(EDR.prefix+"searchManager");
		var initErrorJson = searchManager.initErrorJson;
		if (initErrorJson != null && initErrorJson.error != null) {
			EDR.dialog.ErrorDialog.show(initErrorJson.error, null);
		} else if (initErrorJson != null && initErrorJson.warning != null) {
			EDR.dialog.WarningDialog.show(initErrorJson.warning, null);
		} else {
			<es:dijit />.byId(EDR.prefix+"savedSearch").load();

			var searchPanes = <es:dijit />.byId(EDR.prefix+"horizontalSearchPanes");
			searchPanes.resize();
			
			if (searchManager.isTextAnalyticsEnabled) {

				var afterSearch = function() {
					var viewNameStr = searchManager.view;
					var viewId = "";
					if(viewNameStr == "facets") {
						viewId = EDR.prefix+"categoryViewId";
					} else if (viewNameStr == "timeseries") {
						viewId = EDR.prefix+"timeSeriesViewId";
					} else if(viewNameStr == "deviations") {
						viewId = EDR.prefix+"topicViewId";
					} else if(viewNameStr == "trends") {
						viewId = EDR.prefix+"deltaViewId";
					} else if(viewNameStr == "facetpairs") {
						viewId = EDR.prefix+"twoDMapViewId";
					}
		
					if(viewId != "") {
						<es:dijit />.byId(EDR.prefix+"horizontalSearchPanes").selectChild(<es:dijit />.byId(viewId));
					}
				
					if(searchManager.facets != "") {
						var categoryTree = <es:dijit />.byId("categoryTree");
						var facets = searchManager.facets.split(",");

						if(facets[0]) {
							categoryTree.setVerticalFacetId(facets[0]);
						}
						if(facets.length >= 2 && facets[1]) {
							categoryTree.setHorizontalFacetId(facets[1]);
						}
						categoryTree.refresh();
					} else if (viewNameStr == "timeseries") {
						// forcely update timeseries view without facet selection
						<es:dojo />.publish("refresh");
					}	
				}
				
				// search *:* query to retrieve all documents
				if(searchManager.query != null && searchManager.query != "") {
					searchManager.submitQuickKeywordSearch(searchManager.query, afterSearch);
				} else {
					searchManager.submitQuickKeywordSearch("*:*", afterSearch);
				}

			} else {
				// search UI
				if(searchManager.query != null && searchManager.query != "") {
					searchManager.submitQuickKeywordSearch(searchManager.query, null, true);
				} else if(EDR.isRestoreSessionResults){
					// restore last search if there is a stored object in session
					searchManager.submitQuickKeywordSearch("", null, true);
				}
			}
		}
		
		if (searchManager.isTextAnalyticsEnabled) {
			<es:dijit />.byId(EDR.prefix+"searchPane").hideQueryArea();
		}

		if(<es:dojo />.isIE <= 7) {
			var resultsHeader = <es:dijit />.byId(EDR.prefix+"resultsHeader");
			resultsHeader._onResized();
		}
	}
	
</script>
