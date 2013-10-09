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

<%@ include file="/common/includes.jsp" %>

<div class="tundra edr" id="<%=applicationPrefix%>overallContainer">	
	<jsp:include page="/common/messages.jsp"/>
	
	<%if (PortalUtil.isPortletApplication()) {%>
		<jsp:include page="/common/portletheader.jsp"/>
	<%} else {%>
		<jsp:include page="/common/header.jsp"/>
	<%}%>

	<%-- Accessibility Links --%>
	<jsp:include page="/common/accessibility.jsp"/>
	
	<%-- Splash screen --%>		
	<jsp:include page="/common/splash.jsp"/>
	
	<%-- Banner --%>
	<div id="<%=applicationPrefix%>header-Container">
	<div id="<%=applicationPrefix%>header" class="bannerHeader">
		<jsp:include page="/common/banner.jsp"/>
	</div>					 	
	</div>					 	
	
	<%-- Tabs --%>
	<div id="<%=applicationPrefix%>topBorderContainer-Container">
	<div id="<%=applicationPrefix%>topBorderContainer" class="topBorderContainer" <es:dojoType />="widgets.ESBorderContainer">
		<div id="<%=applicationPrefix%>queryContentPane" class="queryContentPane" <es:dojoType />="dijit.layout.ContentPane">
		
			<a name="searchform"></a>
			<h2 class="hiddenHeading"><fmt:message key="accessibility.hiddenHeader.searchform"/></h2>
			
			<div id="<%=applicationPrefix%>searchPane" class="searchPaneClass" style="width: 100%;" <es:dojoType />="widgets.SearchPane">
				<div id="<%=applicationPrefix%>slideTabContainer" <es:dojoType />="widgets.SlideTabContainer" style="width:100%;">
				<% if(ConfigManager.isTextAnalyticsEnabled()) { %>
					<div label="<fmt:message key='tabs.queryTree'/>" title="<fmt:message key='tooltip.queryTree'/>" id="<%=applicationPrefix%>queryTreeTab" class="slidTabWidget" <es:dojoType />="widgets.SlideTabContent"
						iconPath="down-arrow23.png" closeIconPath="diagonal-up-arrow23.png">
						<div id="<%=applicationPrefix%>queryTree" <es:dojoType />="widgets.QueryTree"
							url="<%=request.getContextPath()%>/queryTree?action=loadQueryTree"
							style="width:550px;height:270px;"></div>
					</div>
				<% } %>
					<div label="<fmt:message key='tabs.advancedSearch'/>" title="<fmt:message key='tooltip.advancedSearch'/>" id="<%=applicationPrefix%>advSearchTab" class="slidTabWidget" <es:dojoType />="widgets.SlideTabContent"
						iconPath="down-arrow23.png" closeIconPath="diagonal-up-arrow23.png">
						<%-- AdvancedSearch --%>
						<c:set var="dateTooltip">
							<fmt:message key='K0015I.TOOLTIP.DATE.SEARCH'>
								<fmt:param value="${dateFormat}"/>
							</fmt:message>
						</c:set>						
						<div id="<%=applicationPrefix%>advancedSearchPane" <es:dojoType />="widgets.AdvancedSearchPane"
							style="width:400px;height:270px;"
							dateTooltip="<c:out value='${dateTooltip}'/>"
						></div>
					</div>
					<div label="<fmt:message key='tabs.savedSearch'/>" title="<fmt:message key='tooltip.savedSearch'/>" id="<%=applicationPrefix%>savedSearchTab" class="slidTabWidget" <es:dojoType />="widgets.SlideTabContent"
						iconPath="down-arrow23.png" closeIconPath="diagonal-up-arrow23.png">
						<div id="<%=applicationPrefix%>savedSearch" <es:dojoType />="widgets.SavedSearch"
							url="<%=request.getContextPath()%>/preferences?action=loadSavedSearch"
							style="width:400px;height:270px;"></div>
					</div>
				</div>
			</div>
		</div>
		<div id="<%=applicationPrefix%>content" class="contentDiv" <es:dojoType />="dijit.layout.ContentPane" style="position:absolute;width:100%;">
			<jsp:include page="/layouts/content.jsp"/>
		</div>
	</div>
	</div>
	
	<%-- Footer --%>
	<div class="footerDiv">				
	</div>
				
	<%-- Manager Objects --%>
	<div id="<%=applicationPrefix%>searchManager-Container">
	<div id="<%=applicationPrefix%>searchManager" <es:dojoType />="widgets.SearchManager"
		initErrorJson="<%= HtmlUtil.escape((String)SessionUtil.getSessionAttribute(request, "initErrorJson")) %>"
		collectionCounts='${collectionsCount}'
		query='${initialQuery}'
		view='${initialView}'
		facets='${initialFacets}'
<% if(ConfigManager.isTextAnalyticsEnabled()) { %>
		isTextAnalyticsEnabled="true"
<% } %>
	></div>
	</div>

	<%-- Common Dialogs --%>
	<div id="<%=applicationPrefix%>commonDialogs-Container">
	<jsp:include page="/dialogs/common.jsp"/>
	</div>
		
	<%-- Searc Dialogs --%>
	<jsp:include page="/dialogs/search.jsp"/>
	
	<%-- Text Miner Dialogs --%>
	<div id="<%=applicationPrefix%>analyticsDialogs-Container">
	<jsp:include page="/dialogs/analytics.jsp"/>
	</div>
	
	<%-- Bootstrap Stuff - Typically JS --%>
	<jsp:include page="/common/bootstrap.jsp"/>

</div><%--End of overall container --%>
