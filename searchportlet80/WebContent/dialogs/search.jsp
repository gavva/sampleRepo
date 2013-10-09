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
 
<%-- Preferences --%>

<% 
	int preferencesDialogWidth = 700;
	if(ConfigManager.isTextAnalyticsEnabled()) { 
		preferencesDialogWidth = 920;
	}
	boolean isHebrew = "iw".equals(request.getLocale().getLanguage());
	String contextPath = (String) application.getAttribute("contextPath");
%>

<div id="<%=applicationPrefix%>preference-Container">
<div <es:dojoType />="widgets.PreferencesDialog" id="<%=applicationPrefix%>preference" style="display:none""
	title="<fmt:message key='preferences'/>"
	url="<%=contextPath%>/preferences?action=getSearchPreferences"
	saveUrl="<%=contextPath%>/preferences?action=saveSearchPreferences"
	preferences_saved="<fmt:message key='info.preferencesSaved'/>"
	showOk="true" okButtonLabel="<fmt:message key='button.save'/>">
	<div style="width:<%=preferencesDialogWidth%>px; height:500px; padding: 5px;">
	
		<%-- Preferences Tab Window begin--%>
		<div <es:dojoType />="widgets.TabWindow" id="<%=applicationPrefix%>searchPanePreferenceTab" style="width:<%=preferencesDialogWidth-2%>px;height:500px;">
		
			<%-- Search Options--%>		
			<div <es:dojoType />="dijit.layout.ContentPane" activeIconPath="images/network16.png" id="<%=applicationPrefix%>searchOptionsTab"
				title="<fmt:message key='prompt.searchOptions'/>">
				<div <es:dojoType />="widgets.SearchOptions" id="<%=applicationPrefix%>searchOptions"
					style="width:100%;height:100%;position:relative;overflow-x:hidden;overflow-y:auto;"
					partialLoadUrl= "<%=contextPath%>/preferences?action=getSearchOptions">
				</div>
			</div>
			
			<% if(!ConfigManager.isTextAnalyticsEnabled()) { %>	
			<%-- Facet Options--%>
			<div <es:dojoType />="dijit.layout.ContentPane" activeIconPath="images/network16.png"
				title="<fmt:message key='preferences.facetsOptions'/>" id="<%=applicationPrefix%>facetTab">
				<div id="<%=applicationPrefix%>facetOptions" <es:dojoType />="widgets.FacetOptions"
					style="width:100%;height:100%;position:relative;overflow-x:hidden;overflow-y:auto;"
				>
				</div>
			</div>
			
			<%-- Top Result Charts Options--%>		
			<div <es:dojoType />="dijit.layout.ContentPane" activeIconPath="images/network16.png"
				title="<fmt:message key='preferences.topResultsOptions'/>" id="<%=applicationPrefix%>topResultsTab">
				<div id="<%=applicationPrefix%>tpaOptions" <es:dojoType />="widgets.TopResultAnalysisOptions"
					style="width:100%;height:100%;position:relative;overflow-x:hidden;overflow-y:auto;"
				>
				</div>
			</div>
			<% } %>
			
			<%-- Results Options--%>		
			<div <es:dojoType />="dijit.layout.ContentPane" activeIconPath="images/network16.png"
				title="<fmt:message key='preferences.tabs.documents'/>" id="<%=applicationPrefix%>resultsOptionsTab">
				<div id="<%=applicationPrefix%>resultsOptions" <es:dojoType />="widgets.ResultsOptions"
					style="width:100%;height:100%;position:relative;overflow-x:hidden;overflow-y:auto;"
				>
				</div>
			</div>
			
			<%-- Result Columns --%>		
			<div <es:dojoType />="dijit.layout.ContentPane" activeIconPath="images/network16.png"
				title="<fmt:message key='preferences.tabs.documentColumns'/>">
				<div id="<%=applicationPrefix%>resultsColumns" testData="tests/data/columns.json" <es:dojoType />="widgets.ResultsColumns"
					style="width:100%;height:100%;position:relative;overflow-x:hidden;overflow-y:auto;"
				>
				</div>
			</div>

			<%-- for Analytics --%>		
			<% if(ConfigManager.isTextAnalyticsEnabled()) { %>
			
			<%-- Facets Options --%>
			<div <es:dojoType />="dijit.layout.ContentPane" activeIconPath="images/network16.png"
				title="<fmt:message key='preferences.tabs.analytics.facets'/>">
				<div id="<%=applicationPrefix%>analyticsFacetOption" <es:dojoType />="widgets.analytics.FacetsOption"
					style="width:100%;height:100%;position:relative;overflow-x:hidden;overflow-y:auto;"
				>
				</div>
			</div>
			
			<%-- Time Series Options --%>
			<div <es:dojoType />="dijit.layout.ContentPane" activeIconPath="images/network16.png"
				title="<fmt:message key='preferences.tabs.analytics.timeSeries'/>">
				<div id="<%=applicationPrefix%>analyticsTimeSeriesOption" <es:dojoType />="widgets.analytics.TimeSeriesOption"
					style="width:100%;height:100%;position:relative;overflow-x:hidden;overflow-y:auto;"
				>
				</div>
			</div>
			
			<%-- Deviations Options --%>
			<div <es:dojoType />="dijit.layout.ContentPane" activeIconPath="images/network16.png"
				title="<fmt:message key='preferences.tabs.analytics.deviations'/>">
				<div id="<%=applicationPrefix%>analyticsDeviationsOption" <es:dojoType />="widgets.analytics.DeviationsOption"
					style="width:100%;height:100%;position:relative;overflow-x:hidden;overflow-y:auto;"
				>
				</div>
			</div>			
				
			<%-- Trends Options --%>
			<div <es:dojoType />="dijit.layout.ContentPane" activeIconPath="images/network16.png"
				title="<fmt:message key='preferences.tabs.analytics.trends'/>">
				<div id="<%=applicationPrefix%>analyticsTrendsOption" <es:dojoType />="widgets.analytics.TrendsOption"
					style="width:100%;height:100%;position:relative;overflow-x:hidden;overflow-y:auto;"
				>
				</div>
			</div>							

			<%-- Facet Pairs Options --%>
			<div <es:dojoType />="dijit.layout.ContentPane" activeIconPath="images/network16.png"
				title="<fmt:message key='preferences.tabs.analytics.facetPairs'/>">
				<div id="<%=applicationPrefix%>analyticsFacetPairsOption" <es:dojoType />="widgets.analytics.FacetPairsOption"
					style="width:100%;height:100%;position:relative;overflow-x:hidden;overflow-y:auto;"
				>
				</div>
			</div>						
			
			<% } %>
		</div>
		<%-- Preferences Tab Window End --%>
		
	</div>
</div>

<%-- MultiSelect Dialog --%>
<div <es:dojoType />="widgets.customDialog" id="<%=applicationPrefix%>multiSelectDlg" closable="false" style="display:none;">
	<script type="dojo/connect" event="startup" args="ev">
		this.multiSelection = <es:dijit />.byId(EDR.prefix+"msdlgms");
	</script>
   	<div style="padding:5px;width:600px; height:250px">
		<div <es:dojoType />="widgets.MultiSelection" id="<%=applicationPrefix%>msdlgms" style="width:100%;height:100%;"
			addBtnTitle="<fmt:message key='tooltip.multiselect.add' />"
			removeBtnTitle="<fmt:message key='tooltip.multiselect.remove' />">
		</div>
	</div>
</div>
</div>

<%-- My Profile Dialog --%>
<div id="<%=applicationPrefix%>myProfileDlg-Container">
<div <es:dojoType />="widgets.MyProfileDialog" id="<%=applicationPrefix%>myProfileDlg" title="<fmt:message key='myProfile'/>" style="width: 640px; height: 480px; display:none;">
	<div <es:dojoType />="widgets.MyProfileContent" id="<%=applicationPrefix%>myProfileContent"></div>
</div>
</div>

<%-- Facet Dialog --%>
<div id="<%=applicationPrefix%>facetDialog-Container">
<div <es:dojoType />="widgets.customDialog" id="<%=applicationPrefix%>facetDialog" title="<fmt:message key='dialog.facet'/>">
	<div style="width:785px;height:475px;padding:5px;">
		<div id="<%=applicationPrefix%>facetDialogContent" <es:dojoType />="widgets.FacetItems"
			url="<%=contextPath%>/facets?action=getFacetCounts"
			style="width:780px;height:450px;"
			<c:if test="${!(empty facetTreeBean)}">
				maxValue="${facetTreeBean.maxSize}"
			</c:if>
		>
		</div>
	</div>
</div>
</div>

<%-- Document Label Dialog --%>
<div id="<%=applicationPrefix%>documentLabelDialog-Container">
<div <es:dojoType />="widgets.customDialog" id="<%=applicationPrefix%>documentLabelDialog" title="<fmt:message key='dialog.documentlabel'/>">
	<div style="width:785px;height:475px;padding:5px;">
		<div id="documentLabelDialogContent" <es:dojoType />="widgets.FacetItems"
			url="<%=contextPath%>/facets?action=getDocumentLabelCounts"
			style="width:780px;height:450px;" id="<%=applicationPrefix%>documentLabelDialogContent"
			<c:if test="${!(empty documentLabelTreeBean)}">
				maxValue="${documentLabelTreeBean.maxSize}"
			</c:if>
		>
		</div>
	</div>
</div>
</div>

<%-- Save Search Dialog --%>
<div id="<%=applicationPrefix%>saveSearchDialog-Container">
<div <es:dojoType />="widgets.customDialog" id="<%=applicationPrefix%>saveSearchDialog" title="<fmt:message key='dialog.saveSearch'/>" okButtonLabel="<fmt:message key='button.save'/>"  style="display: none;">
	<div <es:dojoType />="dijit.layout.ContentPane" style="width:320px;height:240px;padding:5px;">
		<div id="<%=applicationPrefix%>saveSearchContent" <es:dojoType />="widgets.SaveSearch"
				url="<%=contextPath%>/preferences?action=saveSearchQuery">
		</div>
	</div>
</div>
</div>

<%-- Export Search Dialog --%>
<div id="<%=applicationPrefix%>exportSearchDialog-Container">
<div <es:dojoType />="widgets.customDialog" id="<%=applicationPrefix%>exportSearchDialog" title="<fmt:message key='export.dialog.title' />" style="display:none;"
			okButtonLabel="<fmt:message key='button.apply'/>" okFunction="function(){}">
	<div <es:dojoType />="dijit.layout.ContentPane" style="width:320px;height:240px;padding:5px;">
		<div id="<%=applicationPrefix%>exportSearchContent" <es:dojoType />="widgets.ExportSearch"
				url="<%=contextPath%>/search?action=export">
		</div>
	</div>
</div>
</div>

<%-- Preview Dialog --%>
<div id="<%=applicationPrefix%>previewDialog-Container">
<div <es:dojoType />="widgets.customDialog" id="<%=applicationPrefix%>previewDialog" title="<fmt:message key='<%= ConfigManager.isTextAnalyticsEnabled() ? "analytics.preview.title" : "search.preview.title"%>' />" showOk="false"  style="display: none;">
	<div id="<%=applicationPrefix%>previewContainer" <es:dojoType />="dijit.layout.ContentPane" style="width:800px;height:550px;padding:5px;overflow:hidden;">
<% if(!ConfigManager.isTextAnalyticsEnabled()) { %>			
		<div id="<%=applicationPrefix%>previewContent" <es:dojoType />="widgets.PreviewContent"
	 url="<%=contextPath%>/preferences?action=saveSearchQuery"></div>
<%}else{ %>
	<div id="<%=applicationPrefix%>analyticsPreviewContent" <es:dojoType />="widgets.analytics.PreviewContent"
	 url="<%=contextPath%>/preferences?action=saveSearchQuery"></div>
<%}%>
	</div>
</div>
</div>

<%-- About Dialog --%>
<div  id="<%=applicationPrefix%>about-dialog-Container">
<div <es:dojoType />="widgets.customDialog" showOk="false" width="350px" id="<%=applicationPrefix%>about-dialog"  style="display: none;"
	cancelButtonLabel="<fmt:message key='common.ok'/>"
	closable="false"
	title="<fmt:message key='about'/>">
	<div class="About" style="width: 650px; height: 500px">
		<div style="position: absolute; ">
			<img src="<%=contextPath %><fmt:message key="splash.screen"/>" alt="" width="650" height="460" /><br />
			<!--<div class="build"><fmt:message key="about.build"/>:&nbsp;xxxxxxx</div>-->
			<div>
				<span><fmt:message key="about.level"/>:</span>
				<span><%=ConfigManager.getBuildLevel()%></span>
			</div>
			<div>
				<span><fmt:message key="about.release"/>:</span>
				<span><%=ConfigManager.getReleaseLevel()%></span>
			</div>
		</div>
	</div>
</div>
</div>

<%-- Search Type Ahead --%>
<%
	SearchPreferencesBean preferences = (SearchPreferencesBean)session.getAttribute("defaultSearchPreferences");
	int typeAheadNumberOfResults = 0;
	int facetTypeAheadNumberOfResults = 0;
	int documentLabelTypeAheadNumberOfResults = 0;
	String typeAheadMode = "queryLog,term";
	if(preferences != null) {
	   typeAheadNumberOfResults = preferences.getTypeAheadNumberOfResults();
	   facetTypeAheadNumberOfResults = preferences.getFacetTypeAheadNumberOfResults();
	   documentLabelTypeAheadNumberOfResults =  preferences.getDocumentLabelTypeAheadNumberOfResults();
	   typeAheadMode = preferences.getTypeAheadMode();
	}

%>
<div  id="<%=applicationPrefix%>typeAheadWidget-Container">
<div <es:dojoType />="widgets.TypeAhead" id="<%=applicationPrefix%>typeAheadWidget" numberOfResults="<%=typeAheadNumberOfResults%>" mode="<%=typeAheadMode%>"></div>
<div <es:dojoType />="widgets.FacetTypeAhead" id="<%=applicationPrefix%>facetTypeAheadWidget" maxSize="<%=facetTypeAheadNumberOfResults%>"></div>
<div <es:dojoType />="widgets.FacetTypeAhead" id="<%=applicationPrefix%>documentLabelTypeAheadWidget" maxSize="<%=documentLabelTypeAheadNumberOfResults%>"></div>
</div>

<%-- Customizer Dialog --%>
<div id="<%=applicationPrefix%>searchCustomizer-Container">
<% if(session.getAttribute("customizing") != null && ((String)session.getAttribute("customizing")).equalsIgnoreCase("true")) { %>
<% if(!ConfigManager.isTextAnalyticsEnabled()) { %>
<div <es:dojoType />="widgets.customize.Dialog" <%if(isHebrew) { %> dir="ltr" <% } %> id="<%=applicationPrefix%>searchCustomizer" title="<fmt:message key='palette' />" showOk="false" cancelButtonLabel="<fmt:message key='customizer.common.close' />">
<% } else { %>
<div <es:dojoType />="widgets.customize.Dialog" <%if(isHebrew) { %> dir="ltr" <% } %> id="<%=applicationPrefix%>searchCustomizer" title="<fmt:message key='paletteAnalytics' />" showOk="false" cancelButtonLabel="<fmt:message key='customizer.common.close' />">
<% } %>
	   <div <es:dojoType />="widgets.customize.TabWindow" <%if(isHebrew) { %> dir="ltr" <% } %> id="<%=applicationPrefix%>searchCustomizerWindow" class="searchCustomizerWindow" style="width:880px; height: 480px;">
   		<div <es:dojoType />="widgets.customize.ServerSettings" title="<fmt:message key='customizer.server.title' />"></div>
   		<div <es:dojoType />="widgets.customize.ScreenSettings" title="<fmt:message key='customizer.screen.title' />"></div>   		
  		<div <es:dojoType />="widgets.customize.QueryOptions" title="<fmt:message key='customizer.query.title' />"></div>   		
  		<div id="<%=applicationPrefix%>customizerResults" <es:dojoType />="widgets.customize.Results" title="<fmt:message key='customizer.results.title' />"></div>   		
  		<div <es:dojoType />="widgets.customize.Images" title="<fmt:message key='customizer.images.title' />"></div>

<% if(ConfigManager.isTextAnalyticsEnabled()) { %>
		<div <es:dojoType />="widgets.customize.Facets" title="<fmt:message key='customizer.preferences.tabs.analytics.facets' />"></div>
		<div <es:dojoType />="widgets.customize.TimeSeries" title="<fmt:message key='customizer.preferences.tabs.analytics.timeSeries' />"></div>
		<div <es:dojoType />="widgets.customize.Deviations" title="<fmt:message key='customizer.preferences.tabs.analytics.deviations' />"></div>
		<div <es:dojoType />="widgets.customize.Trends" title="<fmt:message key='customizer.preferences.tabs.analytics.trends' />"></div>
		<div <es:dojoType />="widgets.customize.FacetPairs" title="<fmt:message key='customizer.preferences.tabs.analytics.facetPairs' />"></div>
<% } else { %>  
  		<div <es:dojoType />="widgets.customize.FacetCharts" title="<fmt:message key='customizer.charts.facet.title' />"></div>
  		<div <es:dojoType />="widgets.customize.TopResultCharts" title="<fmt:message key='customizer.charts.title' />"></div>
<% } %> 		
   </div>
</div>
<% } %>
</div>
