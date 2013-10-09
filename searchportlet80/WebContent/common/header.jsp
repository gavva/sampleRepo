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

	<%-- CSS Includes: Build Version is appended to avoid caching issues  --%> 	
	<jsp:scriptlet>String buildVer = "-12345";/*TODO: GlobalSystem.getSingleInstance().getBuildProperties().get("build.number").toString();*/</jsp:scriptlet>

	<%-- Dojo CSS - Include these first so we can override where necessary --%>
	<style type="text/css">
		@import "dojo/dojo/resources/dojo.css?<%=buildVer%>";
		@import "dojo/dijit/themes/tundra/tundra.css?<%=buildVer%>";
	</style>	    
	
	<link rel="stylesheet" type="text/css" href="css/searchportlet.css?<%=buildVer%>" />
	<!-- 
   <link rel="stylesheet" type="text/css" href="css/common.css?<%=buildVer%>" />
   <link rel="stylesheet" type="text/css" href="css/email-list.css?<%=buildVer%>" />
	<link rel="stylesheet" type="text/css" href="css/error.css?<%=buildVer%>" />
	<link rel="stylesheet" type="text/css" href="css/dialog.css?<%=buildVer%>" />
	<link rel="stylesheet" type="text/css" href="css/tabs.css?<%=buildVer%>" />
	<link rel="stylesheet" type="text/css" href="css/toolbar.css?<%=buildVer%>" />
	<link rel="stylesheet" type="text/css" href="css/login.css?<%=buildVer%>" />
	<link rel="stylesheet" type="text/css" href="css/button.css?<%=buildVer%>" />
	<link rel="stylesheet" type="text/css" href="css/TabContainer.css?<%=buildVer%>" />
	<link rel="stylesheet" type="text/css" href="css/SlideTabContainer.css?<%=buildVer%>" />
	<link rel="stylesheet" type="text/css" href="css/FacetTree.css?<%=buildVer%>" />
	<link rel="stylesheet" type="text/css" href="css/SearchPane.css?<%=buildVer%>" />
	-->
<% if(session.getAttribute("customizing") != null && ((String)session.getAttribute("customizing")).equalsIgnoreCase("true")) { %>
	<link rel="stylesheet" type="text/css" href="css/customizer.css?<%=buildVer%>" />
<% } %>	
	
	<%-- Set the browser shortcut icon --%>
<% if (ConfigManager.isTextAnalyticsEnabled()) { %>
	<link rel="shortcut icon" href="images/analytics.ico" type="image/vnd.microsoft.icon">
<% } else { %>	
	<link rel="shortcut icon" href="images/search.ico" type="image/vnd.microsoft.icon">
<% }%>	

	<%
		String actualLocale = request.getLocale().toString().replace('_', '-').toLowerCase();
	%>
	
	<%-- override styles with config.properties --%>
    <style type="text/css">
    <%
    Properties properties = ConfigManager.getConfigProperties(request);
    String bgImage = (String) properties.get("search.backgroundImage");
    String bannerLeft = (String) properties.get("bannerLeft.backgroundImage");
    String bannerRight = (String) properties.get("bannerRight.backgroundImage");
    String bannerBody = (String) properties.get("bannerBody.backgroundImage");
    String strStretchHeight = (String) properties.get("style.stretchHeight");
    boolean isStretchHeight = "true".equalsIgnoreCase(strStretchHeight);
    String strResotreSessionResults = (String) properties.get("restoreSessionResults");
    boolean isRestoreSessionResults = "true".equalsIgnoreCase(strResotreSessionResults);
    %>
    <% if(bgImage != null) {%>
    	body.edr {
    		background-image: url('<%=bgImage%>');
    	}
    <% } %>
    
    <% if(bannerLeft != null) {%>
        .edr .Banner .BannerLeft {
        	background-image: url('<%=bannerLeft%>');
        }
    <% } %>

    <% if(bannerBody != null) {%>
        .edr .Banner .BannerCenter {
        	background-image: url('<%=bannerBody%>');
        }
    <% } %>
    
    <% if(bannerRight != null) {%>
        .edr .Banner .BannerGroup {
        	background-image: url('<%=bannerRight%>');
        }
    <% } %>    
    </style>
	
	<%-- Include the DOJO Toolkit --%>
	<script type="text/javascript">
		var djConfig = {
			parseOnLoad: false,
			locale: '<%= actualLocale %>',
			modulePaths: {
				"widgets": "../../js/widgets"
			},
			scopeMap: [
			   		["dojo", "dojo13"],
			   		["dijit", "dijit13"],
			   		["dojox", "dojox13"]
			   	]			
		};
	</script>
<%
String contextPath = request.getContextPath();
application.setAttribute("contextPath", contextPath);
application.setAttribute("runOnPortalServer" , "false");
application.setAttribute("stretchHeight", "" + isStretchHeight);
 %>
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
    	EDR.contextPath = "<%= contextPath %>";
    	EDR.config.imageBaseDir = EDR.contextPath + "/images/";
    	EDR.isNoflash = <%=(request.getParameter("textonly") == null || !request.getParameter("textonly").equalsIgnoreCase("true")) ? false : true %>;
		EDR.isAuthorized = <%=request.getRemoteUser() == null ? false : true %>;
		EDR.isPortlet = false;
		EDR.isStretchHeight = <%=""+isStretchHeight%>;
		EDR.isRestoreSessionResults = <%=""+isRestoreSessionResults%>;
		EDR.securedSourcesPresent = <%="true".equals(SessionUtil.getSessionAttribute(request, "securedSourcesPresent")) ? "true" : "false" %>; 
<%--  EDR.helpBaseUrl = "http://publib.boulder.ibm.com/infocenter/discover/v9r1m0/topic/com.ibm.discovery.sa.doc/"; --%>
		EDR.helpBaseUrl = "<%=SessionUtil.getSessionAttribute(request, "helpBaseUrl")%>/com.ibm.discovery.es.help.sa.doc/";
    	EDR.viewHelp = function(file) {
    	    var url = EDR.helpBaseUrl + file;
          w = window.open(url, 'esHelpWindow', 'location=yes,width=600,height=450,status,scrollbars,resizable,screenX=20,screenY=40,left=20,top=40');
          w.focus();
          return false;
      }
    </script>
    
	<script type="text/javascript" src="dojo/dojo/dojo.js?<%=buildVer%>" ></script>
	<script type="text/javascript">		
		// Dojo
		<es:dojo />.require("dojo.parser");

    	EDR.dojo = <es:dojo />;
    	EDR.dijit = <es:dijit />;		
	</script>
	<!-- debug include start -->
	<!-- debug include end -->
	<script type="text/javascript">		
		<es:dojo />.require("dojo.io.iframe");
		<es:dojo />.require("dojo.data.ItemFileReadStore");
		<es:dojo />.require("dojo.data.ItemFileWriteStore");
		
		// Dijit
		<es:dojo />.require("dijit.InlineEditBox");
		<es:dojo />.require("dijit.Toolbar");
		<es:dojo />.require("dijit.Dialog");
		<es:dojo />.require("dijit.Menu");
		<es:dojo />.require("dijit.TitlePane");
		<es:dojo />.require("dijit.layout.ContentPane");
		<es:dojo />.require("dijit.layout.TabContainer");
       	<es:dojo />.require("dijit.layout.TabContainer");
       	<es:dojo />.require("dijit.layout.BorderContainer");
       	<es:dojo />.require("dijit.layout.SplitContainer");
		<es:dojo />.require("dijit.layout.TabContainer");
		<es:dojo />.require("dijit.Toolbar");
		<es:dojo />.require("dijit.form.Form");
		<es:dojo />.require("dijit.form.DateTextBox");
       	<es:dojo />.require("dijit.form.Button");
		<es:dojo />.require("dijit.form.Textarea");
		
		// Dojox
		<es:dojo />.require("dojox.widget.FisheyeLite");
		<es:dojo />.require("dojox.form.DropDownSelect");		

		// Custom widgets
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

<% if (ConfigManager.isTextAnalyticsEnabled()) { %>
		<es:dojo />.require("widgets.CategoryTree");
		<es:dojo />.require("widgets.DeepInspector");
		<es:dojo />.require("widgets.CognosIntegration");
		<es:dojo />.require("widgets.analytics.CategoryView");
		<es:dojo />.require("widgets.analytics.TimeSeriesView");
		<es:dojo />.require("widgets.analytics.TopicView");
		<es:dojo />.require("widgets.analytics.DeltaView");
		<es:dojo />.require("widgets.analytics.TwoDMapView");
		<es:dojo />.require("widgets.QueryTree");	
		<es:dojo />.require("widgets.analytics.PreviewContent");
		<es:dojo />.require("widgets.analytics.FacetsOption");
		<es:dojo />.require("widgets.analytics.TimeSeriesOption");
		<es:dojo />.require("widgets.analytics.DeviationsOption");
		<es:dojo />.require("widgets.analytics.TrendsOption");
		<es:dojo />.require("widgets.analytics.FacetPairsOption");
<% } %>

<% if(session.getAttribute("customizing") != null && ((String)session.getAttribute("customizing")).equalsIgnoreCase("true")) { %>
		EDR.customizing = true;
		<es:dojo />.require("widgets.customize.Popup");
		<es:dojo />.require("widgets.customize.Dialog");
		<es:dojo />.require("widgets.customize.TabWindow");
		<es:dojo />.require("widgets.customize.ServerSettings");
		<es:dojo />.require("widgets.customize.ScreenSettings");
		<es:dojo />.require("widgets.customize.QueryOptions");	
		<es:dojo />.require("widgets.customize.Results");
		<es:dojo />.require("widgets.customize.Images");
		<es:dojo />.require("widgets.customize.TopResultCharts");
		<es:dojo />.require("widgets.customize.FacetCharts");
		<es:dojo />.require("widgets.customize.Facets");
		<es:dojo />.require("widgets.customize.TimeSeries");
		<es:dojo />.require("widgets.customize.Deviations");
		<es:dojo />.require("widgets.customize.Trends");
		<es:dojo />.require("widgets.customize.FacetPairs");
<% } %>
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
    <script type="text/javascript" src="js/searchportlet.js?<%=buildVer%>"></script>
    <!-- 
    <script type="text/javascript" src="js/application.jsp?<%=buildVer%>"></script>
    <script type="text/javascript" src="js/ajax.jsp?<%=buildVer%>"></script>
    <script type="text/javascript" src="js/util.jsp?<%=buildVer%>"></script>
    <script type="text/javascript" src="js/dialog.jsp?<%=buildVer%>"></script>
    <script type="text/javascript" src="js/constants.jsp?<%=buildVer%>"></script>
    -->          
<%--
    <script type="text/javascript" src="js/search.js?<%=buildVer%>"></script>
    <script type="text/javascript" src="js/admin.js?<%=buildVer%>"></script>
--%>
	<!--
    <script type="text/javascript" src="js/email.jsp?<%=buildVer%>"></script>
    -->
<% if (ConfigManager.isTextAnalyticsEnabled()) { %>
    <script type="text/javascript" src="flex/js/FABridge.js"></script>
    <script type="text/javascript" src="flex/js/CategoryView.js"></script>
    <script type="text/javascript" src="flex/js/TimeSeriesView.js"></script>
    <script type="text/javascript" src="flex/js/TopicView.js"></script>
    <script type="text/javascript" src="flex/js/DeltaView.js"></script>
    <script type="text/javascript" src="flex/js/TwoDMapView.js"></script>
    <script type="text/javascript">
	    EDR.isTextAnalyticsEnabled = true;
	 </script>

    <style type="text/css">
		.dijitContentPane {
			overflow:hidden;
		}
	 </style>
<% } %>
    <script type="text/javascript">
		// check supported browser
		if (!(<es:dojo />.isIE >= 7 || <es:dojo />.isFF >= 3)) {
			alert("<fmt:message key='errors.dialog.notsupportedbrowser'/>");
		}
		
		function hideSplash() {
			var splash = <es:dojo />.byId(EDR.prefix+'Splash');
			if (splash) {
				<es:dojo />.fadeOut( 
					{ node: splash, duration: 1,
						onEnd: function() { 
							splash.style.display = "none"; 

							if(window["doInit"] && <es:dojo />.isFunction(doInit)) doInit();
							//TODO: need this? > if (doInit) doInit();
					}
				}).play();
			}	
		}

		<es:dojo />.addOnLoad(function() {
			
//			dojo.parser.parse(dojo.body());
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


			EDR.BuildNumber = <%=buildVer%>;
			var splashInner = <es:dojo />.byId(EDR.prefix+'SplashInner');
			if (splashInner) {
				hideSplash();
			}

			<% if(session.getAttribute("customizing") != null && ((String)SessionUtil.getSessionAttribute(request, "customizing")).equalsIgnoreCase("true")) { %>
			var customizer = <es:dijit />.byId(EDR.prefix+"searchCustomizerWindow");
			if(customizer) {
				customizer.initialize();
				EDR.dialog.util.showById(EDR.prefix+"searchCustomizer");
			}

			<% } %>
			<% if (ConfigManager.isSessionHeartBeanEnabled()) { %>
			var searchManager = <es:dijit />.byId(EDR.prefix+"searchManager");
			if (searchManager != null) {
				setInterval(<es:dojo />.hitch(searchManager, "_heartBeat"), <%=ConfigManager.getSessionHeartBeatTime()%>);
			}
			<% } %>
		});		
    
    </script>

