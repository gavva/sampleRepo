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

<jsp:include page="/common/messages.jsp"/>
<jsp:include page="/common/portletheader.jsp"/>
<%
    Properties properties = ConfigManager.getConfigProperties(request);
    String minHeight = (String) properties.get("style.minHeight");
%>
<div class="tundra edr portletOverallContainer" id="<%=applicationPrefix%>overallContainer" style="min-height:<%=minHeight%>; overflow:auto;">	
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
			
			<div id="<%=applicationPrefix%>searchPane" style="width: 100%;" <es:dojoType />="widgets.SearchPane">
				<div id="<%=applicationPrefix%>slideTabContainer" <es:dojoType />="widgets.SlideTabContainer" style="width:100%;">


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
			<jsp:include page="/layouts/portletcontent.jsp"/>
		</div>
	</div>
	</div>

	<%-- Footer --%>
	<div class="footerDiv">				
	</div>
				
	<%-- Manager Objects --%>
	<div id="<%=applicationPrefix%>searchManager-Container">
	<div id="<%=applicationPrefix%>searchManager" <es:dojoType />="widgets.SearchManager"
		initErrorJson='${initErrorJson}'
		collectionCounts='${collectionsCount}'
		query='<bean:write name="renderActionForm" property="q"/>'
		view='${initialView}'
		facets='${initialFacets}'
	></div>
	</div>
	
	<%-- Bootstrap Stuff - Typically JS --%>
	<jsp:include page="/common/bootstrap.jsp"/>	

	<%-- Common Dialogs --%>
	<div id="<%=applicationPrefix%>commonDialogs-Container">
	<jsp:include page="/dialogs/common.jsp"/>
	</div>

	<%-- Search Dialogs --%>
	<jsp:include page="/dialogs/search.jsp"/>

	
</div><%--End of overall container --%>
