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
<%@ page import="com.ibm.es.oze.searchui.common.ConfigManager"%>

<%@ include file="/common/includes.jsp" %>

<% if(ConfigManager.isTextAnalyticsEnabled()) {
   SearchPreferencesBean preferences = (SearchPreferencesBean)session.getAttribute("defaultSearchPreferences");
	String flexLocale = ConfigManager.getFlexLocale(request);
	
	String facetsOptions = "";
	String timeSeriesOptions = "";
	String deviationsOptions = "";
	String trendsOptions = "";
	String facetPairsOptions = "";
	
	if (preferences != null) {
		facetsOptions = 
			"&defaultShowTarget=" + preferences.getFacetsDefaultShowTarget() +
			"&defaultSortBy=" + preferences.getFacetsDefaultSortBy();
		timeSeriesOptions = "&defaultTimeScale=" + preferences.getTimeseriesDefaultTimeScale();
		deviationsOptions =
		   "&defaultTimeScale=" + preferences.getDeviationsDefaultTimeScale() +
		   "&defaultShowTarget=" + preferences.getDeviationsDefaultShowTarget() +
		   "&defaultSortBy=" + preferences.getDeviationsDefaultSortBy() +
		   "&numberOfCharts=" + preferences.getDeviationsNumberOfCharts();
		trendsOptions =
		   "&defaultTimeScale=" + preferences.getTrendsDefaultTimeScale() +
		   "&defaultShowTarget=" + preferences.getTrendsDefaultShowTarget() +
		   "&defaultSortBy=" + preferences.getTrendsDefaultSortBy() + 
		   "&numberOfCharts=" + preferences.getTrendsNumberOfCharts();
		facetPairsOptions =
			"&defaultRowShowTarget=" + preferences.getFacetPairsDefaultRowShowTarget() +
			"&defaultColumnShowTarget=" + preferences.getFacetPairsDefaultColumnShowTarget() +
			"&defaultListSortBy=" + preferences.getFacetPairsDefaultListSortBy() +
			"&defaultRowSortBy=" + preferences.getFacetPairsDefaultRowSortBy() +
			"&defaultColumnSortBy=" + preferences.getFacetPairsDefaultColumnSortBy() +
			"&defaultView=" + preferences.getFacetPairsDefaultView();
	}
%>

<%-- Deep Inspector Dialog --%>
<div <es:dojoType />="widgets.customDialog" id="<%=applicationPrefix%>deepInspectionDialog" title="<fmt:message key='deepInspector.dialog.title' />"
			okButtonLabel="<fmt:message key='button.apply'/>" okFunction="function(){}">
	<div <es:dojoType />="dijit.layout.ContentPane" style="width:320px;height:360px;padding:5px;">
		<div id="<%=applicationPrefix%>deepInspectionContent" <es:dojoType />="widgets.DeepInspector"
				url="<%=request.getContextPath()%>/search?action=deepInspection">
		</div>
	</div>
</div>

<%-- Cognos Integration Dialog --%>
<div <es:dojoType />="widgets.customDialog" id="<%=applicationPrefix%>cognosIntegrationDialog" title="Cognos Report"
			okButtonLabel="<fmt:message key='button.apply'/>" okFunction="function(){}">
	<div <es:dojoType />="dijit.layout.ContentPane" style="width:550px;height:200px;padding:5px;">
		<div id="<%=applicationPrefix%>cognosIntegrationContent" <es:dojoType />="widgets.CognosIntegration"
				url="<%=request.getContextPath()%>/search?action=cognosIntegration">
		</div>
	</div>
</div>

<%if(request.getParameter("textonly") == null || !request.getParameter("textonly").equalsIgnoreCase("true") ) { %>
<div id="<%=applicationPrefix%>categoryViewContainer" style="position: absolute; width: 1px;height: 1px;background-color: white;top: -9999px; z-index:99999">
	<a name="facetview"></a>
	<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	 width="100%" height="100%"
	codebase="http://fpdownload.macromedia.com/get/flashplayer/current/swflash.cab">
		<param name="movie" value="flex/CategoryView.swf" />
		<param name="flashvars" value="bridgeName=b_CategoryView&localeChain=<%=flexLocale%><%=facetsOptions%>"/>
		<param name="quality" value="high" />
		<param name="allowScriptAccess" value="sameDomain" />
		<param name="SeamlessTabbing" value="true">
		<embed src="flex/CategoryView.swf" quality="high"
			width="100%" height="100%" name="CategoryViewTest" 
			align="middle"
			play="true"
			loop="false"
			quality="high"
			allowScriptAccess="sameDomain"
			type="application/x-shockwave-flash"
			pluginspage="http://www.adobe.com/go/getflashplayer" 
			SeamlessTabbing="true"
			flashvars="bridgeName=b_CategoryView&localeChain=<%=flexLocale%><%=facetsOptions%>">
		</embed>
	</object>
</div>

<div id="<%=applicationPrefix%>timeSeriesViewContainer" url="<%=request.getContextPath()%>/analytics?action=getTimeSeriesView" style="position: absolute; width: 1px;height: 1px;background-color: white;top: -9999px; z-index:99999">													
	<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="100%" height="100%"
		codebase="http://fpdownload.macromedia.com/get/flashplayer/current/swflash.cab">
		<param name="movie" value="flex/TimeSeriesView.swf" />
		<param name="flashvars" value="bridgeName=b_TimeSeriesView&localeChain=<%=flexLocale%><%=timeSeriesOptions%>"/>
		<param name="quality" value="high" />
		<param name="allowScriptAccess" value="sameDomain" />
		<param name="SeamlessTabbing" value="true">
		<embed src="flex/TimeSeriesView.swf" quality="high"
			width="100%" height="100%" name="TimeSeriesViewTest" 
			align="middle"
			play="true"
			loop="false"
			quality="high"
			allowScriptAccess="sameDomain"
			type="application/x-shockwave-flash"
			pluginspage="http://www.adobe.com/go/getflashplayer" 
			SeamlessTabbing="true"
			flashvars="bridgeName=b_TimeSeriesView&localeChain=<%=flexLocale%><%=timeSeriesOptions%>">
		</embed>
	</object>
	<%-- Hidden table for accessible version of the timeseries view --%>
	<div class="hiddenAccessible">
		<a name="timeseries"></a>
		<table summary="Timeseries view">
			<thead>
			</thead>
			<tbody>
			</tbody>
		</table>
	</div>
</div>

<div id="<%=applicationPrefix%>topicViewContainer" url="<%=request.getContextPath()%>/analytics?action=getTopicView" style="position: absolute; width: 1px;height: 1px;background-color: white;top: -9999px; z-index:99999">
	<a name="deviations"></a>
	<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="100%" height="100%"
		codebase="http://fpdownload.macromedia.com/get/flashplayer/current/swflash.cab">
		<param name="movie" value="flex/TopicView.swf" />
		<param name="flashvars" value="bridgeName=b_TopicView&localeChain=<%=flexLocale%><%=deviationsOptions%>"/>
		<param name="quality" value="high" />
		<param name="allowScriptAccess" value="sameDomain" />
		<param name="SeamlessTabbing" value="true">
		<embed src="flex/TopicView.swf" quality="high"
			width="100%" height="100%" name="TopicViewTest" 
			align="middle"
			play="true"
			loop="false"
			quality="high"
			allowScriptAccess="sameDomain"
			type="application/x-shockwave-flash"
			pluginspage="http://www.adobe.com/go/getflashplayer" 
			SeamlessTabbing="true"
			flashvars="bridgeName=b_TopicView&localeChain=<%=flexLocale%><%=deviationsOptions%>">
		</embed>
	</object>
</div>

<div id="<%=applicationPrefix%>deltaViewContainer" url="<%=request.getContextPath()%>/analytics?action=getDeltaView" style="position: absolute; width: 1px;height: 1px;background-color: white;top: -9999px; z-index:99999">
	<a name="trends"></a>
	<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="100%" height="100%"
		codebase="http://fpdownload.macromedia.com/get/flashplayer/current/swflash.cab">
		<param name="movie" value="flex/DeltaView.swf" />
		<param name="flashvars" value="bridgeName=b_DeltaView&localeChain=<%=flexLocale%><%=trendsOptions%>"/>
		<param name="quality" value="high" />
		<param name="allowScriptAccess" value="sameDomain" />
		<param name="SeamlessTabbing" value="true">
		<embed src="flex/DeltaView.swf" quality="high"
			width="100%" height="100%" name="DeltaViewTest" 
			align="middle"
			play="true"
			loop="false"
			quality="high"
			allowScriptAccess="sameDomain"
			type="application/x-shockwave-flash"
			pluginspage="http://www.adobe.com/go/getflashplayer" 
			SeamlessTabbing="true"
			flashvars="bridgeName=b_DeltaView&localeChain=<%=flexLocale%><%=trendsOptions%>">
		</embed>
	</object>
</div>

<div id="<%=applicationPrefix%>twodmapViewContainer" style="position: absolute; width: 1px;height: 1px;background-color: white;top: -9999px; z-index:99999">
	<a name="facetpairs"></a>
	<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	width="100%" height="100%"
	codebase="http://fpdownload.macromedia.com/get/flashplayer/current/swflash.cab">
		<param name="movie" value="flex/TwoDMapView.swf" />
		<param name="flashvars" value="bridgeName=b_TwoDMapView&localeChain=<%=flexLocale%><%=facetPairsOptions%>"/>
		<param name="quality" value="high" />
		<param name="allowScriptAccess" value="sameDomain" />
		<param name="SeamlessTabbing" value="true">
		<embed src="flex/TwoDMapView.swf" quality="high"
			width="100%" height="100%" name="TwoDMapViewTest" 
			align="middle"
			play="true"
			loop="false"
			quality="high"
			allowScriptAccess="sameDomain"
			type="application/x-shockwave-flash"
			pluginspage="http://www.adobe.com/go/getflashplayer" 
			SeamlessTabbing="true"
			flashvars="bridgeName=b_TwoDMapView&localeChain=<%=flexLocale%><%=facetPairsOptions%>">
		</embed>
	</object>
</div>	
<% } %>

<% } %>