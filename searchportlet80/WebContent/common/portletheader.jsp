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
<%@ taglib uri="http://java.sun.com/portlet" prefix="portlet"%> 
<%@ include file="/common/includes.jsp" %>
<portlet:defineObjects/>
<%
String contextPath = renderResponse.encodeURL(renderRequest.getContextPath());
application.setAttribute("contextPath", contextPath);
application.setAttribute("runOnPortalServer" , "true");
String actualLocale = request.getLocale().toString().replace('_', '-').toLowerCase();

Properties properties = ConfigManager.getConfigProperties(request);
String strStretchHeight = (String) properties.get("style.stretchHeight");
boolean isStretchHeight = "true".equalsIgnoreCase(strStretchHeight);
application.setAttribute("stretchHeight", ""+isStretchHeight);
String strResotreSessionResults = (String) properties.get("restoreSessionResults");
boolean isRestoreSessionResults = "true".equalsIgnoreCase(strResotreSessionResults);
 %>
 
<script type="text/javascript">
		var djConfig = {
			parseOnLoad: false,
			locale: '<%= actualLocale %>',
			modulePaths: {
				"widgets": "../../js/widgets"
			},
			baseUrl: "<%=contextPath%>/dojo/dojo/",
			scopeMap: [
			   		["dojo", "dojo13"],
			   		["dijit", "dijit13"],
			   		["dojox", "dojox13"]
			   	]			
		};

</script>
<script type="text/javascript">
		EDR.prefix = "<%=applicationPrefix%>";
    	EDR.isTextAnalyticsEnabled = false;
    	EDR.isQueryTreeEnabled = false;
    	EDR.isCategoryTreeEnabled = <%=(SessionUtil.getSessionAttribute(request,"isCategoryTreeEnabled") == null || !((String)SessionUtil.getSessionAttribute(request,"isCategoryTreeEnabled")).equalsIgnoreCase("true")) ? false : true %>;
    	EDR.isExportEnabled = <%=(SessionUtil.getSessionAttribute(request,"isExportEnabled") == null || !((String)SessionUtil.getSessionAttribute(request,"isExportEnabled")).equalsIgnoreCase("true")) ? false : true %>;
    	EDR.isDocCacheEnabled = <%=(SessionUtil.getSessionAttribute(request,"isDocCacheEnabled") == null || !((String)SessionUtil.getSessionAttribute(request,"isDocCacheEnabled")).equalsIgnoreCase("true")) ? false : true %>;
    	EDR.isThumbnailEnabled = <%=(SessionUtil.getSessionAttribute(request,"isThumbnailEnabled") == null || !((String)SessionUtil.getSessionAttribute(request,"isThumbnailEnabled")).equalsIgnoreCase("true")) ? false : true %>;
    	EDR.isDeepInspectionEnabled = <%=(SessionUtil.getSessionAttribute(request,"isDeepInspectionEnabled") == null || !((String)SessionUtil.getSessionAttribute(request,"isDeepInspectionEnabled")).equalsIgnoreCase("true")) ? false : true %>;
    	EDR.isSecureCollection = <%=(SessionUtil.getSessionAttribute(request,"isSecureCollection") == null || !((String)SessionUtil.getSessionAttribute(request,"isSecureCollection")).equalsIgnoreCase("true")) ? false : true %>;    	
    	EDR.contextPath = "<%=contextPath%>";
    	EDR.config.imageBaseDir = EDR.contextPath + "/images/";
    	EDR.isNoflash = false;
		EDR.isAuthorized = false;
		EDR.isPortlet = true;
		EDR.isStretchHeight = <%= ""+isStretchHeight %>;
		EDR.isRestoreSessionResults = <%=""+isRestoreSessionResults%>;		
		EDR.securedSourcesPresent = <%="true".equals(SessionUtil.getSessionAttribute(request, "securedSourcesPresent")) ? "true" : "false" %>; 
		<%--  EDR.helpBaseUrl = "http://publib.boulder.ibm.com/infocenter/discover/v9r1m0/topic/com.ibm.discovery.es.help.sa.doc/"; --%>
		EDR.helpBaseUrl = "<%=SessionUtil.getSessionAttribute(request, "helpBaseUrl")%>/com.ibm.discovery.es.help.sa.doc/";
    	EDR.viewHelp = function(file) {
			var url = EDR.helpBaseUrl + file;
			w = window.open(url, 'esHelpWindow', 'location=yes,width=600,height=450,status,scrollbars,resizable,screenX=20,screenY=40,left=20,top=40');
			w.focus();
        	return false;
		}
		
		if(EDR.config.banner_file != null && EDR.config.banner_file.indexOf("http") != 0) {
			EDR.config.banner_file = EDR.contextPath + "/" + EDR.config.banner_file;
		}
</script>

<script type="text/javascript" src="<%=contextPath%>/dojo/dojo/dojo.js"></script>
<script type="text/javascript">
<es:dojo />.body = function() { return <es:dojo />.byId(EDR.prefix+"overallContainer"); };

<es:dojo />.registerModulePath("widgets", "<%=renderResponse.encodeURL(renderRequest.getContextPath()) + "/js/widgets"%>");
<es:dojo />.require("dojo.parser");

		EDR.dojo = <es:dojo />;
		EDR.dijit = <es:dijit />;

		<es:dojo />.require("widgets.customDialog");
		<es:dojo />.require("widgets.Banner");
		<es:dojo />.require("widgets.Toolbar");
		<es:dojo />.require("widgets.InlineEditBox");
		<es:dojo />.require("widgets.DateTextBox");
		<es:dojo />.require("widgets.Button"); 
		<es:dojo />.require("widgets.TabContainer");
		<es:dojo />.require("widgets.TabWindow");
		<es:dojo />.require("widgets.QueryTabWindow");
		<es:dojo />.require("widgets.SearchTabWindow");
		<es:dojo />.require("widgets.ESFacetTree");
		<es:dojo />.require("widgets.HorizontalBarChart");
		<es:dojo />.require("widgets.DynamicFieldChart");
		<es:dojo />.require("widgets.DynamicFacetChart");
		<es:dojo />.require("widgets.FileSizeChart");
		<es:dojo />.require("widgets.BasicSearchPane");
		<es:dojo />.require("widgets.AdvancedSearchPane");
		<es:dojo />.require("widgets.ESBorderContainer");
		<es:dojo />.require("widgets.LayoutPreference");
		<es:dojo />.require("widgets.QueryText");
		<es:dojo />.require("widgets.SearchManager");
		<es:dojo />.require("widgets.SearchOptions");
		<es:dojo />.require("widgets.PreferencesDialog");
		<es:dojo />.require("widgets.MyProfileContent");
		<es:dojo />.require("widgets.MyProfileDialog");
		<es:dojo />.require("widgets.SlideTabContainer");
		<es:dojo />.require("widgets.SlideTabContent");
		<es:dojo />.require("widgets.SearchPane");
		<es:dojo />.require("widgets.MultiAccordionContainer");
		<es:dojo />.require("widgets.FacetItems");
		<es:dojo />.require("widgets.ResultsBorderContainer");
		<es:dojo />.require("widgets.ResultToolbar")
		<es:dojo />.require("widgets.ResultBottomBar");
		<es:dojo />.require("widgets.ResultsHeader");
		<es:dojo />.require("widgets.ResultsBody");
		<es:dojo />.require("widgets.ResultsOptions");
		<es:dojo />.require("widgets.ResultsColumns");		
		<es:dojo />.require("widgets.FacetOptions");
		<es:dojo />.require("widgets.TopResultAnalysisOptions");	
		<es:dojo />.require("widgets.ESTitlePane");	
		<es:dojo />.require("widgets.CategoryTreeTitlePane");	
		<es:dojo />.require("widgets.SaveSearch");
		<es:dojo />.require("widgets.ExportSearch");
		<es:dojo />.require("widgets.SavedSearch");
		<es:dojo />.require("widgets.PreviewContent");
		<es:dojo />.require("widgets.layout.TabWindow");
		<es:dojo />.require("widgets.layout.DocumentsPane");
		<es:dojo />.require("widgets.TypeAhead");
		<es:dojo />.require("widgets.FacetTypeAhead");
		<es:dojo />.require("widgets.DocumentLabelTree");
		if(<es:dojo />.isIE >= 9) {
			<es:dojo />.require("dijit.layout._LayoutWidget");
			<es:dijit />.layout._LayoutWidget.prototype.getChildren = function() {
				var children = [];
				if(this.containerNode) {
					var childNodes = this.containerNode.childNodes;
					for(var i=0; childNodes && i<childNodes.length; i++) {
						var node = childNodes[i];
						if(node && node.nodeType == 1) {//ELEMENT_NODE
							if(node.hasAttribute("widgetId")) {
								var w = <es:dijit />.byNode(node);
								children.push(w);
							}
						}
					}
				}
				return children;
			}
		}
</script>
<script type="text/javascript" src="<%= renderResponse.encodeURL(renderRequest.getContextPath() + "/js/searchportlet.js")%>"></script>
<%--
<script type="text/javascript" src="<%= renderResponse.encodeURL(renderRequest.getContextPath() + "/js/application.jsp")%>"></script>
<script type="text/javascript" src="<%= renderResponse.encodeURL(renderRequest.getContextPath() + "/js/ajax.jsp")%>"></script>
<script type="text/javascript" src="<%= renderResponse.encodeURL(renderRequest.getContextPath() + "/js/util.jsp")%>"></script>
<script type="text/javascript" src="<%= renderResponse.encodeURL(renderRequest.getContextPath() + "/js/dialog.jsp")%>"></script>
<script type="text/javascript" src="<%= renderResponse.encodeURL(renderRequest.getContextPath() + "/js/constants.jsp")%>"></script>
<script type="text/javascript" src="<%= renderResponse.encodeURL(renderRequest.getContextPath() + "/js/email.jsp")%>"></script>
<script type="text/javascript" src="<%= renderResponse.encodeURL(renderRequest.getContextPath() + "/js/portlet.jsp")%>"></script>
--%>

<script type="text/javascript">
// check supported browser
if (!(<es:dojo />.isIE >= 7 || <es:dojo />.isFF >= 3)) {
	alert("<fmt:message key='errors.dialog.notsupportedbrowser'/>");
}

<es:dojo />.addOnLoad(function() {
	//adjust the position because the node by dojo.body() has relative position
	var _portletPlaceOnScreenAroundRect = <es:dijit />._placeOnScreenAroundRect;
	<es:dijit />._placeOnScreenAroundRect = function(node, x, y, width, height, aroundCorners, layoutNode){
		var body = <es:dojo />.body(); 
		if(body.id==(EDR.prefix+"overallContainer")){
			//the coords (x, y) are the position of dojo.body() from (x:0, y:0)
			//the coords are (x:53.9, y:147.6) in case there is one portlet
			var coords = <es:dojo />.coords(body, true);
			x = x - coords.x + body.scrollLeft;
			y = y - coords.y + body.scrollTop;
			return _portletPlaceOnScreenAroundRect(node, x, y, width, height, aroundCorners, layoutNode);
		}else{
			return _portletPlaceOnScreenAroundRect(node, x, y, width, height, aroundCorners, layoutNode);
		}
	};
	
	//adjust the width of dialog's overlay
	var getViewport = <es:dijit />.getViewport;
	<es:dijit />.getViewport = function(){
		var obj = getViewport();
		var body = <es:dojo />.body();
		<% if (isStretchHeight) { %>
		var de = <es:dojo />.doc.documentElement;
		var sc = <es:dojo />._docScroll();
		obj.w = de.clientWidth;
		obj.h = de.clientHeight;
        obj.l =  sc.x;
		obj.t = sc.y;
		<% } else { %>
		obj.w = body.clientWidth;
		obj.h = body.clientHeight;
		<% } %>
		return obj;
	};
	
	//change target scroll bar
	var docScroll = <es:dojo />._docScroll;
	<es:dojo />._docScroll = function(){
		var obj = docScroll();
		var body = <es:dojo />.body();
		<% if (isStretchHeight) { %>
		var de = <es:dojo />.doc.documentElement;
		obj.x = de.scrollLeft - body.offsetLeft;
		obj.y = de.scrollTop - body.offsetTop;
		<% } else { %>
		obj.x = body.scrollLeft;
		obj.y = body.scrollTop;
		<% } %>
		return obj;
	};

	if(<es:dojo />.marginBox(<es:dojo />.body().parentNode).w < 900){
		EDR.isSmallPortletLayout = true;
		if(<es:dojo />.isIE <= 7){
			<es:dojo />.body().style.width = "600px";
		}else{
			<es:dojo />.body().style.minWidth = "600px";
		}
	}
	
	<es:dojo />.style("<%=applicationPrefix%>alert-dialog", "visibility", "");
	<es:dojo />.style("<%=applicationPrefix%>progress-dialog", "visibility", "");
	<es:dojo />.style("<%=applicationPrefix%>confirmation-dialog", "visibility", "");
	<es:dojo />.style("<%=applicationPrefix%>error-dialog", "visibility", "");	
	
//	<es:dojo />.parser.parse(EDR.prefix+"overallContainer");
	<es:dojo />.parser.parse(EDR.prefix + "header-Container");

	<es:dojo />.parser.parse(EDR.prefix + "searchManager-Container");
	<es:dojo />.parser.parse(EDR.prefix + "commonDialogs-Container");
	<es:dojo />.parser.parse(EDR.prefix + "facetDialog-Container");
	<es:dojo />.parser.parse(EDR.prefix + "documentLabelDialog-Container");
	<es:dojo />.parser.parse(EDR.prefix + "exportSearchDialog-Container");
	<es:dojo />.parser.parse(EDR.prefix + "typeAheadWidget-Container");

	if(EDR.customizing) {
		<es:dojo />.parser.parse(EDR.prefix + "searchCustomizer-Container");
	}
	
	<es:dojo />.parser.parse(EDR.prefix + "topBorderContainer-Container");

	//adjust height of tabContainer due to the padding 1px
	//dojo.byId("mainTextInput").parentNode.style.height = "24px";
	<es:dijit />.byId(EDR.prefix+"searchPane").queryTextBox.textInputContainer.style.height = "24px"; ;
	
	if(<es:dojo />.isIE){
		//show scrollbar of preference's result tab	
//		<es:dijit />.byId(EDR.prefix+"resultsOptions").domNode.style.overflow = "auto";
	}
	
	if(EDR.isSmallPortletLayout){
		EDR.portlet.Layout.toSmallLayout();
	}
	
	function hideSplash() {
		var splash = <es:dojo />.byId(EDR.prefix+'Splash'); 
		if (splash) {
			<es:dojo />.fadeOut( 
				{ node: splash, duration: 1,
					onEnd: function() { 
						splash.style.display = "none"; 
						if(window["doInit"] && <es:dojo />.isFunction(doInit)) doInit();
				}
			}).play();
		}	
	}
	
	var splashInner = <es:dojo />.byId(EDR.prefix+'SplashInner');
		if (splashInner) {
			hideSplash();
	}
		
});
</script>
<style type="text/css">
@import "<%=renderResponse.encodeURL(renderRequest.getContextPath() + "/css/searchportlet.css") %>";
<%--
@import "<%=renderResponse.encodeURL(renderRequest.getContextPath() + "/css/common.css") %>";
@import "<%=renderResponse.encodeURL(renderRequest.getContextPath() + "/css/email-list.css") %>";
@import "<%=renderResponse.encodeURL(renderRequest.getContextPath() + "/css/error.css") %>";
@import "<%=renderResponse.encodeURL(renderRequest.getContextPath() + "/css/dialog.css") %>";
@import "<%=renderResponse.encodeURL(renderRequest.getContextPath() + "/css/tabs.css") %>";
@import "<%=renderResponse.encodeURL(renderRequest.getContextPath() + "/css/toolbar.css") %>";
@import "<%=renderResponse.encodeURL(renderRequest.getContextPath() + "/css/login.css") %>";
@import "<%=renderResponse.encodeURL(renderRequest.getContextPath() + "/css/button.css") %>";
@import "<%=renderResponse.encodeURL(renderRequest.getContextPath() + "/css/TabContainer.css") %>";
@import "<%=renderResponse.encodeURL(renderRequest.getContextPath() + "/css/SlideTabContainer.css") %>";
@import "<%=renderResponse.encodeURL(renderRequest.getContextPath() + "/css/FacetTree.css") %>";
@import "<%=renderResponse.encodeURL(renderRequest.getContextPath() + "/css/SearchPane.css") %>";
--%>
@import "<%=renderResponse.encodeURL(renderRequest.getContextPath() + "/dojo/dijit/themes/tundra/tundra.css") %>"
</style>