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
 
<c:set var="collectionsCount" value="${fn:length(collections)}" />  
<% boolean isHebrew = "iw".equals(request.getLocale().getLanguage()); %>
<a name="searchresult"></a>
<h2 class="hiddenHeading"><fmt:message key="accessibility.hiddenHeader.searchresult"/></h2>
  
<div <es:dojoType />="widgets.layout.TabWindow" id="<%=applicationPrefix%>horizontalSearchPanes" class="horizontalSearchPanes"
	showIcon="true" style="position: absolute; width: 100%; height: 100%;">
	<%-- left pane container--%>
	<div id="<%=applicationPrefix%>tabWindowLeftChildrenContainer">
	<% if(!ConfigManager.isTextAnalyticsEnabled()) { %>
		<div class="leftContentTitle"><span style="padding-left:15px"><fmt:message key="columns.narrowresults"/></span></div>
	<% } %>
		<div <es:dojoType />="widgets.MultiAccordionContainer" style="width:100%;height:100%;">
			<% if(ConfigManager.isTextAnalyticsEnabled()) { %>			
				<a name="facettree"></a>
				<h2 class="hiddenHeading"><fmt:message key="accessibility.hiddenHeader.facettree"/></h2>
				
				<div <es:dojoType />="widgets.CategoryTreeTitlePane" settingsPaneId="<%=applicationPrefix%>categoryTab" type="facet" class="searchPane" title="<fmt:message key='analytics.pane.title.facettree' />"
					open="true" title_tooltip="<fmt:message key='tooltip.facet' />" icon_tooltip="<fmt:message key='tooltip.facet.preferences' />"
							icon_alt="">
					<div id="<%=applicationPrefix%>categoryTree" <es:dojoType />="widgets.CategoryTree" style="height:100%;position:relative;"
						url="category?action=getChildren" url2="category?action=getFilteredCategories">
					</div>
				</div>
			<% } else { %>
				<%-- Facet --%>
				<c:if test="${!(empty facetTreeBean)}">
					<div <es:dojoType />="widgets.ESTitlePane" settingsPaneId="<%=applicationPrefix%>facetTab" type="facet" id="<%=applicationPrefix%>facetSearchTitlePane" class="searchPane" title="${facetTreeBean.title}"
						open="${facetTreeBean.open}"
						title_tooltip="<fmt:message key="tooltip.facet"/>"
						icon_tooltip="<fmt:message key="tooltip.facet.preferences"/>"
						icon_alt="<fmt:message key="tooltip.facet.preferences"/>"
					>
						<div id="<%=applicationPrefix%>facetTree" <es:dojoType />="widgets.ESFacetTree"
							defaultSize="${facetTreeBean.defaultSize}"
							maxSize="${facetTreeBean.maxSize}"
							style="width:100%;height:100%;overflow-x:hidden;overflow-y:auto;"
							url="<%=request.getContextPath()%>/facets?action=getTopFacetCounts"
							urlLoadChildren="<%=request.getContextPath()%>/facets?action=getFacetChildrenItems"
							urlTypeAhead="<%=request.getContextPath()%>/facets?action=getTypeAheadFacetValues"
						>
						</div>
					</div>
				</c:if>
				
				<%-- Document Label --%>
				<c:if test="${!(empty documentLabelTreeBean)}">
					<div <es:dojoType />="widgets.ESTitlePane" settingsPaneId="<%=applicationPrefix%>facetTab" type="facet" id="<%=applicationPrefix%>documentLabelSearchTitlePane" class="searchPane" title="${documentLabelTreeBean.title}"
						open="${documentLabelTreeBean.open}"
						title_tooltip="<fmt:message key="tooltip.documentlabel"/>"
						icon_tooltip="<fmt:message key="tooltip.documentlabel.preferences"/>"
						icon_alt="<fmt:message key="tooltip.documentlabel.preferences"/>"
					>
						<div id="<%=applicationPrefix%>documentLabelTree" <es:dojoType />="widgets.DocumentLabelTree"
							defaultSize="${documentLabelTreeBean.defaultSize}"
							maxSize="${documentLabelTreeBean.maxSize}"
							style="width:100%;height:100%;overflow-x:hidden;overflow-y:auto;"
							url="<%=request.getContextPath()%>/facets?action=getTopDocumentLabelCounts"
							urlLoadChildren="<%=request.getContextPath()%>/facets?action=getDocumentLabelChildrenItems"
							urlTypeAhead="<%=request.getContextPath()%>/facets?action=getTypeAheadDocumentLabelValues"
						>
						</div>
					</div>
				</c:if>
				
				<%-- Dynamic Facet Chart --%>
	         <c:forEach items="${facetChartBeans}" var="item" varStatus="row">
					<div <es:dojoType />="widgets.ESTitlePane" settingsPaneId="<%=applicationPrefix%>facetTab" type="facet" id="<%=applicationPrefix%>dynamicFacetChartTitlePane-${row.count}" class="searchPane" title="${item.title}"
						open="${item.open}"
						title_tooltip="<fmt:message key="tooltip.facet.chart"/>"
						icon_tooltip="<fmt:message key="tooltip.facet.chart.preferences"/>"
						icon_alt="<fmt:message key="tooltip.facet.chart.preferences"/>"
					>
						<div id="<%=applicationPrefix%>dynamicFacetChart-${row.count}" <es:dojoType />="widgets.DynamicFacetChart"
							facetName="${item.facetName}"
							maxSize="${item.maxSize}"
							isDynamic="${item.isDynamic}"
							style="width:100%;height:100%;overflow:hidden;"
							url="<%=request.getContextPath()%>/facets?action=getDynamicFacetChart">
						</div>
					</div>
				</c:forEach>

				<%-- Dynamic Field Chart --%>
	         <c:forEach items="${fieldChartBeans}" var="item" varStatus="row">
					<div <es:dojoType />="widgets.ESTitlePane" settingsPaneId="<%=applicationPrefix%>topResultsTab" type="field" id="<%=applicationPrefix%>dynamicFieldChartTitlePane-${row.count}" class="searchPane"title="${item.title}"
						open="${item.open}"
						title_tooltip="<fmt:message key="tooltip.top.results"/>"
						icon_tooltip="<fmt:message key="tooltip.top.results.preferences"/>"
						icon_alt="<fmt:message key="tooltip.top.results.preferences"/>"
					>
						<div id="<%=applicationPrefix%>dynamicFieldChart-${row.count}" <es:dojoType />="widgets.DynamicFieldChart"
							fieldName="${item.fieldName}"
							maxSize="${item.maxSize}"
							separator="${item.separator}"
							sortType="${item.sortType}"
							sortOrder="${item.sortOrder}"
							isDynamic="${item.isDynamic}"
							style="width:100%;height:100%;overflow:hidden;"
							url="<%=request.getContextPath()%>/topResultsChart?action=getDynamicFieldChart">
						</div>
					</div>
				</c:forEach>
			<% } %>
		</div>		
	</div>
	<%-- right pane container--%>
	<div id="<%=applicationPrefix%>tabWindowRightChildrenContainer">
		<div <es:dojoType />="widgets.layout.DocumentsPane" title="<fmt:message key='tabs.documents' />"
			activeIconPath="images/documents16.png"
			style="position: absolute; width: 100%; height: 100%; overflow: hidden;"
			id="<%=applicationPrefix%>documentViewId">
			<div id="<%=applicationPrefix%>resultsHeader" <es:dojoType />="widgets.ResultsHeader"></div>
			<div id="<%=applicationPrefix%>resultsBodyContainer" style="width: 100%; height: 100%; <%if("true".equals((String)application.getAttribute("stretchHeight"))){%>overflow: hidden;<%} else {%>overflow-x:hidden; overflow-y: auto;<%}%>">
				<div id="<%=applicationPrefix%>resultsBody" <es:dojoType />="widgets.ResultsBody"></div>
			</div>		
		</div>
		<% if(ConfigManager.isTextAnalyticsEnabled()) { 
			   SearchPreferencesBean preferences = (SearchPreferencesBean)session.getAttribute("defaultSearchPreferences");
		%>
			<div <es:dojoType />="widgets.analytics.CategoryView" flashContainerId="<%=applicationPrefix%>categoryViewContainer"
				activeIconPath="images/facet16.png"
				title="<fmt:message key='analytics.view.title.category' />"
				style="position: absolute; width: 100%; height: 100%;"
				id="<%=applicationPrefix%>categoryViewId"
				verticalRowCount="<%=preferences.getFacetsNumberOfResults()%>">
			</div>
			<div <es:dojoType />="widgets.analytics.TimeSeriesView" flashContainerId="<%=applicationPrefix%>timeSeriesViewContainer"
				activeIconPath="images/timeline16.png"
				title="<fmt:message key='analytics.view.title.timeseries' />"
				url="<%=request.getContextPath()%>/analytics?action=getTimeSeriesView" 
				style="background-color: white; position: absolute; width: 100%; height: 100%;"
				id="<%=applicationPrefix%>timeSeriesViewId"
				timeScale="<%=preferences.getTimeseriesDefaultTimeScale()%>">
			</div>
			<div <es:dojoType />="widgets.analytics.TopicView" flashContainerId="<%=applicationPrefix%>topicViewContainer"
				activeIconPath="images/deviation16.png"
				title="<fmt:message key='analytics.view.title.topic' />"
				url="<%=request.getContextPath()%>/analytics?action=getTopicView" 
				style="background-color: white;position: absolute; width: 100%; height: 100%;"
				id="<%=applicationPrefix%>topicViewId"
				verticalRowCount="<%=preferences.getDeviationsNumberOfResults()%>"
				showLineInChart="<%=preferences.getDeviationsShowLineInChart()%>"
				barColorOfMultiChart="<%=preferences.getDeviationsBarColorOfMultiChart()%>">
			</div>
			<div <es:dojoType />="widgets.analytics.DeltaView" flashContainerId="<%=applicationPrefix%>deltaViewContainer"
				activeIconPath="images/trends16.png"
				title="<fmt:message key='analytics.view.title.delta' />"
				url="<%=request.getContextPath()%>/analytics?action=getDeltaView" 
				style="position: absolute; padding:0px; width: 100%; height: 100%;"
				id="<%=applicationPrefix%>deltaViewId"
				verticalRowCount="<%=preferences.getDeviationsNumberOfResults()%>"
				showLineInChart="<%=preferences.getDeviationsShowLineInChart()%>"
				barColorOfMultiChart="<%=preferences.getDeviationsBarColorOfMultiChart()%>">
			</div>
			<div <es:dojoType />="widgets.analytics.TwoDMapView" flashContainerId="<%=applicationPrefix%>twodmapViewContainer"
				activeIconPath="images/2Dmap16.png"
				hasHorizontalFacet="true"
				title="<fmt:message key='analytics.view.title.twodmap' />"
				style="position: absolute; width: 100%; height: 100%; background-color: white;"
				id="<%=applicationPrefix%>twoDMapViewId"
				verticalRowCount="<%=preferences.getFacetPairsNumberOfRowResults()%>"
				horizontalRowCount="<%=preferences.getFacetPairsNumberOfColumnResults()%>">
			</div>			
		<% } %>
	</div>	
</div>

<% if(session.getAttribute("customizing") != null && ((String)session.getAttribute("customizing")).equalsIgnoreCase("true")) { %>
<div <es:dojoType />="widgets.customize.Popup" <%if(isHebrew) { %> dir="ltr" <% } %> stickto="horizontalSearchPanes" style="z-index: 997;"></div>
<% } %>