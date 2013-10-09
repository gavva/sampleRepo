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
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>

<%@ page import="com.ibm.es.nuvo.Copyright" %>

<%-- Copyright variable --%>
<% 
	String messagesCopyright = Copyright.CopyrightText; 
%> 


<%-- This page contains all of the localized messages needed by JS code --%>


<%@page import="com.ibm.es.oze.searchui.common.ConfigManager"%>
<%@page import="java.util.Properties"%><%@page import="com.ibm.es.oze.searchui.common.ResourceBundleManager"%>

<%@page import="com.ibm.es.oze.searchui.query.SearchPreferencesBean"%><script type="text/javascript">
<%
Properties props = ConfigManager.getConfigProperties(request);
SearchPreferencesBean preferencesBean = (SearchPreferencesBean) session.getAttribute("defaultSearchPreferences");
int resultsPerPage = 10;
if(preferencesBean != null) {
	resultsPerPage = preferencesBean.getResultsRange();
}
%>

if(typeof(EDR) == "undefined") {
	EDR = {};
}

EDR.config = {
	// general
	forceTitleLink: "<%=props.getProperty("forceTitleLink")%>",
	
	//#==============================================================================================
	//# Document Source icon
	//#==============================================================================================		
	documentSource_default_icon				: "/images/sourceDefault.gif",
	documentSource_vbr_icon					: "<%=props.getProperty("documentSource.vbr.icon")%>",
	documentSource_cm_icon					: "<%=props.getProperty("documentSource.cm.icon")%>",
	documentSource_dominodoc_icon			: "<%=props.getProperty("documentSource.dominodoc.icon")%>",
	documentSource_db2_icon					: "<%=props.getProperty("documentSource.db2.icon")%>",
	documentSource_exchange_icon			: "<%=props.getProperty("documentSource.exchange.icon")%>",
	documentSource_nntp_icon				: "<%=props.getProperty("documentSource.nntp.icon")%>",
	documentSource_notes_icon				: "<%=props.getProperty("documentSource.notes.icon")%>",
	documentSource_quickplace_icon			: "<%=props.getProperty("documentSource.quickplace.icon")%>",
	documentSource_unixfs_icon				: "<%=props.getProperty("documentSource.unixfs.icon")%>",
	documentSource_web_icon					: "<%=props.getProperty("documentSource.web.icon")%>",
	documentSource_wp_icon					: "<%=props.getProperty("documentSource.wp.icon")%>",
	documentSource_winfs_icon				: "<%=props.getProperty("documentSource.winfs.icon")%>",
	documentSource_wcm_icon					: "<%=props.getProperty("documentSource.wcm.icon")%>",
	documentSource_database_icon			: "<%=props.getProperty("documentSource.database.icon")%>",
	documentSource_ldap_icon				: "<%=props.getProperty("documentSource.ldap.icon")%>",
	documentSource_jdbc_icon				: "<%=props.getProperty("documentSource.jdbc.icon")%>",
	documentSource_seedlist_icon			: "<%=props.getProperty("documentSource.seedlist.icon")%>",
	documentSource_seedlist_qr80_icon		: "<%=props.getProperty("documentSource.seedlist.qr80.icon")%>",
	documentSource_seedlist_wp61_icon		: "<%=props.getProperty("documentSource.seedlist.wp61.icon")%>",
	documentSource_seedlist_lc20activities_icon	: "<%=props.getProperty("documentSource.seedlist.lc20activities.icon")%>",
	documentSource_seedlist_lc20blogs_icon	: "<%=props.getProperty("documentSource.seedlist.lc20blogs.icon")%>",
	documentSource_seedlist_lc20communities_icon	: "<%=props.getProperty("documentSource.seedlist.lc20communities.icon")%>",
	documentSource_seedlist_lc20dogear_icon	: "<%=props.getProperty("documentSource.seedlist.lc20dogear.icon")%>",
	documentSource_seedlist_lc20profiles_icon	: "<%=props.getProperty("documentSource.seedlist.lc20profiles.icon")%>",
	documentSource_seedlist_lc25activities_icon	: "<%=props.getProperty("documentSource.seedlist.lc25activities.icon")%>",
	documentSource_seedlist_lc25blogs_icon	: "<%=props.getProperty("documentSource.seedlist.lc25blogs.icon")%>",
	documentSource_seedlist_lc25communities_icon	: "<%=props.getProperty("documentSource.seedlist.lc25communities.icon")%>",
	documentSource_seedlist_lc25dogear_icon	: "<%=props.getProperty("documentSource.seedlist.lc25dogear.icon")%>",
	documentSource_seedlist_lc25profiles_icon	: "<%=props.getProperty("documentSource.seedlist.lc25profiles.icon")%>",
	documentSource_seedlist_lc25wikis_icon	: "<%=props.getProperty("documentSource.seedlist.lc25wikis.icon")%>",
	documentSource_seedlist_lc25forum_icon	: "<%=props.getProperty("documentSource.seedlist.lc25forum.icon")%>",
	documentSource_seedlist_lc25files_icon	: "<%=props.getProperty("documentSource.seedlist.lc25files.icon")%>",
	documentSource_seedlist_lc30activities_icon	: "<%=props.getProperty("documentSource.seedlist.lc30activities.icon")%>",
	documentSource_seedlist_lc30blogs_icon	: "<%=props.getProperty("documentSource.seedlist.lc30blogs.icon")%>",
	documentSource_seedlist_lc30communities_icon	: "<%=props.getProperty("documentSource.seedlist.lc30communities.icon")%>",
	documentSource_seedlist_lc30dogear_icon	: "<%=props.getProperty("documentSource.seedlist.lc30dogear.icon")%>",
	documentSource_seedlist_lc30profiles_icon	: "<%=props.getProperty("documentSource.seedlist.lc30profiles.icon")%>",
	documentSource_seedlist_lc30wikis_icon	: "<%=props.getProperty("documentSource.seedlist.lc30wikis.icon")%>",
	documentSource_seedlist_lc30forum_icon	: "<%=props.getProperty("documentSource.seedlist.lc30forum.icon")%>",
	documentSource_seedlist_lc30files_icon	: "<%=props.getProperty("documentSource.seedlist.lc30files.icon")%>",
	documentSource_seedlist_lc40activities_icon	: "<%=props.getProperty("documentSource.seedlist.lc40activities.icon")%>",
	documentSource_seedlist_lc40blogs_icon	: "<%=props.getProperty("documentSource.seedlist.lc40blogs.icon")%>",
	documentSource_seedlist_lc40communities_icon	: "<%=props.getProperty("documentSource.seedlist.lc40communities.icon")%>",
	documentSource_seedlist_lc40dogear_icon	: "<%=props.getProperty("documentSource.seedlist.lc40dogear.icon")%>",
	documentSource_seedlist_lc40profiles_icon	: "<%=props.getProperty("documentSource.seedlist.lc40profiles.icon")%>",
	documentSource_seedlist_lc40wikis_icon	: "<%=props.getProperty("documentSource.seedlist.lc40wikis.icon")%>",
	documentSource_seedlist_lc40forum_icon	: "<%=props.getProperty("documentSource.seedlist.lc40forum.icon")%>",
	documentSource_seedlist_lc40files_icon	: "<%=props.getProperty("documentSource.seedlist.lc40files.icon")%>",
	documentSource_seedlist_lc40news_icon	: "<%=props.getProperty("documentSource.seedlist.lc40news.icon")%>",
	documentSource_seedlist_lc40events_icon	: "<%=props.getProperty("documentSource.seedlist.lc40events.icon")%>",
	documentSource_seedlist_lc45activities_icon	: "<%=props.getProperty("documentSource.seedlist.lc45activities.icon")%>",
	documentSource_seedlist_lc45blogs_icon	: "<%=props.getProperty("documentSource.seedlist.lc45blogs.icon")%>",
	documentSource_seedlist_lc45communities_icon	: "<%=props.getProperty("documentSource.seedlist.lc45communities.icon")%>",
	documentSource_seedlist_lc45dogear_icon	: "<%=props.getProperty("documentSource.seedlist.lc45dogear.icon")%>",
	documentSource_seedlist_lc45profiles_icon	: "<%=props.getProperty("documentSource.seedlist.lc45profiles.icon")%>",
	documentSource_seedlist_lc45wikis_icon	: "<%=props.getProperty("documentSource.seedlist.lc45wikis.icon")%>",
	documentSource_seedlist_lc45forum_icon	: "<%=props.getProperty("documentSource.seedlist.lc45forum.icon")%>",
	documentSource_seedlist_lc45files_icon	: "<%=props.getProperty("documentSource.seedlist.lc45files.icon")%>",
	documentSource_seedlist_lc45news_icon	: "<%=props.getProperty("documentSource.seedlist.lc45news.icon")%>",
	documentSource_seedlist_lc45events_icon	: "<%=props.getProperty("documentSource.seedlist.lc45events.icon")%>",
	documentSource_seedlist_lc45libraries_icon	: "<%=props.getProperty("documentSource.seedlist.lc45libraries.icon")%>",

	documentSource_p8_icon	: "<%=props.getProperty("documentSource.p8.icon")%>",
	documentSource_sp_icon	: "<%=props.getProperty("documentSource.sp.icon")%>",
	documentSource_agent_icon	: "<%=props.getProperty("documentSource.agent.icon")%>",

	
	// client viewer icon
	clientViewer_show						: "<%=props.getProperty("clientViewer.show")%>",
	client_notes_icon						: "<%=props.getProperty("client.notes.icon")%>",
	client_dominodoc_icon					: "<%=props.getProperty("client.dominodoc.icon")%>",

	// link target
	default_link_target						: "<%=props.getProperty("default.link.target")%>",
	http_link_target						: "<%=props.getProperty("http.link.target")%>",
	https_link_target						: "<%=props.getProperty("https.link.target")%>",
	notes_link_target						: "<%=props.getProperty("notes.link.target")%>",

	banner_file								: "<%=props.getProperty("banner.file")%>",
	displayedApplicationName				: "<%=props.getProperty("displayedApplicationName")%>",

	link_preferences_show					: "<%=props.getProperty("link.preferences.show")%>",
	link_myProfile_show						: "<%=props.getProperty("link.myProfile.show")%>",
	link_help_show							: "<%=props.getProperty("link.help.show")%>",
	link_about_show							: "<%=props.getProperty("link.about.show")%>",
	link_logOff_show						: "<%=props.getProperty("link.logOff.show")%>",

	//for DocumentType
	documentTypes : [
		<% for ( int i = 0; i < ConfigManager.getDocumentTypes().size(); i++ ){
		String fileTypeStr = (String)ConfigManager.getDocumentTypes().get(i);%>
			"<%=fileTypeStr.substring(13,fileTypeStr.length())%>"
		<% if(i!=(ConfigManager.getDocumentTypes().size()-1)){%>
			,
		<% }}%>
	],
	
	//for ScreenSetting
	field_defaultIcon								: "<%=props.getProperty("field.defaultIcon")%>",
	field_icon_from									: "<%=props.getProperty("field.icon.from")%>",
	button_addRow									: "<%=props.getProperty("button.addRow")%>",
	extraQueryData_show								: "<%=props.getProperty("extraQueryData.show")%>",
	
	//for TopResultCharts
	<% int i = 1; while(props.getProperty("topResultsCharts" + i + ".enable") != null) { %>
	topResultsCharts<%=i%>_enable			: "<%=props.getProperty("topResultsCharts"+i+".enable")%>",
	topResultsCharts<%=i%>_maxValues_collapsed			: "<%=props.getProperty("topResultsCharts"+i+".maxValues.collapsed")%>",
	topResultsCharts<%=i%>_fieldName			: "<%=props.getProperty("topResultsCharts"+i+".fieldName")%>",
	topResultsCharts<%=i%>_fieldValueSeparator			: "<%=props.getProperty("topResultsCharts"+i+".fieldValueSeparator")%>",
	topResultsCharts<%=i%>_canUserChangeFieldName			: "<%=props.getProperty("topResultsCharts"+i+".canUserChangeFieldName")%>",
	topResultsCharts<%=i%>_sortKey			: "<%=props.getProperty("topResultsCharts"+i+".sortKey")%>",
	topResultsCharts<%=i%>_sortOrder			: "<%=props.getProperty("topResultsCharts"+i+".sortOrder")%>",
	topResultsCharts<%=i%>_titleKey			: "<%=props.getProperty("topResultsCharts"+i+".titleKey")%>",
	topResultsCharts<%=i%>_open			: "<%=props.getProperty("topResultsCharts"+i+".open")%>",
	<%++i;} %>
	documentType_html_show								: "<%=props.getProperty("documentType.html.show")%>",
	documentType_doc_show								: "<%=props.getProperty("documentType.doc.show")%>",
	documentType_ppt_show								: "<%=props.getProperty("documentType.ppt.show")%>",
	documentType_xls_show								: "<%=props.getProperty("documentType.xls.show")%>",
	documentType_xml_show								: "<%=props.getProperty("documentType.xml.show")%>",
	documentType_txt_show								: "<%=props.getProperty("documentType.txt.show")%>",
	documentType_pdf_show								: "<%=props.getProperty("documentType.pdf.show")%>",

	fields_db2									: "<%=props.getProperty("fields.db2")%>",
	fields_domino								: "<%=props.getProperty("fields.domino")%>",
	fields_dominodoc							: "<%=props.getProperty("fields.dominodoc")%>",
	fields_exchange								: "<%=props.getProperty("fields.exchange")%>",
	fields_file									: "<%=props.getProperty("fields.file")%>",
	fields_https								: "<%=props.getProperty("fields.https")%>",
	fields_http									: "<%=props.getProperty("fields.http")%>",
	fields_jdbc								: "<%=props.getProperty("fields.jdbc")%>",
	fields_news								: "<%=props.getProperty("fields.news")%>",
	fields_quickplace								: "<%=props.getProperty("fields.quickplace")%>",
	fields_seedlist								: "<%=props.getProperty("fields.seedlist")%>",
	fields_vbr								: "<%=props.getProperty("fields.vbr")%>",
	fields_wcm								: "<%=props.getProperty("fields.wcm")%>",
	fields_wp6								: "<%=props.getProperty("fields.wp6")%>",
	fields_wps								: "<%=props.getProperty("fields.wps")%>",

	fields_db2_show									: "<%=props.getProperty("fields.db2.show")%>",
	fields_domino_show								: "<%=props.getProperty("fields.domino.show")%>",
	fields_dominodoc_show							: "<%=props.getProperty("fields.dominodoc.show")%>",
	fields_exchange_show								: "<%=props.getProperty("fields.exchange.show")%>",
	fields_file_show									: "<%=props.getProperty("fields.file.show")%>",
	fields_https_show								: "<%=props.getProperty("fields.https.show")%>",
	fields_http_show									: "<%=props.getProperty("fields.http.show")%>",
	fields_jdbc_show								: "<%=props.getProperty("fields.jdbc.show")%>",
	fields_news_show								: "<%=props.getProperty("fields.news.show")%>",
	fields_quickplace_show								: "<%=props.getProperty("fields.quickplace.show")%>",
	fields_seedlist_show								: "<%=props.getProperty("fields.seedlist.show")%>",
	fields_vbr_show								: "<%=props.getProperty("fields.vbr.show")%>",
	fields_wcm_show								: "<%=props.getProperty("fields.wcm.show")%>",
	fields_wp6_show								: "<%=props.getProperty("fields.wp6.show")%>",
	fields_wps_show								: "<%=props.getProperty("fields.wps.show")%>",
	
	documentSource_cm_show						: "<%=props.getProperty("documentSource.cm.show")%>",
	documentSource_database_show						: "<%=props.getProperty("documentSource.database.show")%>",
	documentSource_db2_show						: "<%=props.getProperty("documentSource.db2.show")%>",
	documentSource_dominodoc_show						: "<%=props.getProperty("documentSource.dominodoc.show")%>",
	documentSource_exchange_show						: "<%=props.getProperty("documentSource.exchange.show")%>",
	documentSource_jdbc_show						: "<%=props.getProperty("documentSource.jdbc.show")%>",
	documentSource_ldap_show						: "<%=props.getProperty("documentSource.ldap.show")%>",
	documentSource_nntp_show						: "<%=props.getProperty("documentSource.nntp.show")%>",
	documentSource_notes_show						: "<%=props.getProperty("documentSource.notes.show")%>",
	documentSource_quickplace_show						: "<%=props.getProperty("documentSource.quickplace.show")%>",
	documentSource_seedlist_show						: "<%=props.getProperty("documentSource.seedlist.show")%>",
	documentSource_seedlist_lc20activities_show						: "<%=props.getProperty("documentSource.seedlist.lc20activities.show")%>",
	documentSource_seedlist_lc20blogs_show						: "<%=props.getProperty("documentSource.seedlist.lc20blogs.show")%>",
	documentSource_seedlist_lc20communities_show						: "<%=props.getProperty("documentSource.seedlist.lc20communities.show")%>",
	documentSource_seedlist_lc20dogear_show						: "<%=props.getProperty("documentSource.seedlist.lc20dogear.show")%>",
	documentSource_seedlist_lc20profiles_show						: "<%=props.getProperty("documentSource.seedlist.lc20profiles.show")%>",
	documentSource_seedlist_qr80_show						: "<%=props.getProperty("documentSource.seedlist.qr80.show")%>",
	documentSource_seedlist_wp61_show						: "<%=props.getProperty("documentSource.seedlist.wp61.show")%>",
	documentSource_unixfs_show						: "<%=props.getProperty("documentSource.unixfs.show")%>",
	documentSource_vbr_show						: "<%=props.getProperty("documentSource.vbr.show")%>",
	documentSource_wcm_show						: "<%=props.getProperty("documentSource.wcm.show")%>",
	documentSource_web_show						: "<%=props.getProperty("documentSource.web.show")%>",
	documentSource_winfs_show						: "<%=props.getProperty("documentSource.winfs.show")%>",
	documentSource_wp_show						: "<%=props.getProperty("documentSource.wp.show")%>",

	preferences_resultsRange						: "<%= resultsPerPage %>",
	typeAhead_numberOfResults					: "<%=props.getProperty("typeAhead.search.numberOfResults")%>",
	spellCorrections_keepOriginalQueryTerms: "<%=props.getProperty("spellCorrections.keepOriginalQueryTerms")%>",
	
	style_minHeight							: "<%=props.getProperty("style.minHeight")%>",
	style_stretchHeight						: "<%=props.getProperty("style.stretchHeight")%>",
	__dummy__								: ''
};

EDR.messages = {
	// Oze messages
	button_search							: "<fmt:message key='button.search' />",
	button_clear							: "<fmt:message key='button.clear' />",
	button_select							: "<fmt:message key='button.select' />",
	button_apply							: "<fmt:message key='button.apply' />",
	button_edit								: "<fmt:message key='button.edit' />",
	button_save								: "<fmt:message key='button.save' />",
	
	splash_loading							: "<fmt:message key='splash.loading' />",
	splash_resizing							: "<fmt:message key='splash.resizing' />",
	prompt_beforeSearch						: "<fmt:message key='prompt.beforeSearch' />",
	prompt_search_searching					: "<fmt:message key='prompt.search.searching' />",
	prompt_advanced_numRequestedResults		: "<fmt:message key='prompt.advanced.numRequestedResults' />",
	prompt_export							: "<fmt:message key='prompt.export' />",
	prompt_deepInspection				: "<fmt:message key='prompt.deepInspection' />",

	export_dialog_nameLabel					: "<fmt:message key='export.dialog.nameLabel' />",
	export_dialog_contentLabel				: "<fmt:message key='export.dialog.contentLabel' />",
	export_dialog_contentSource				: "<fmt:message key='export.dialog.contentSource' />",
	export_dialog_descriptionLabel			: "<fmt:message key='export.dialog.descriptionLabel' />",
	export_dialog_schedulableLabel			: "<fmt:message key='export.dialog.schedulableLabel' />",
	export_button_tooltip					: "<fmt:message key='export.button.tooltip' />",
	export_content_cache					: "<fmt:message key='export.content.cache' />",
	export_content_index					: "<fmt:message key='export.content.index' />",
	export_content_none						: "<fmt:message key='export.content.none' />",
	
	deepInspector_dialog_name				: "<fmt:message key='deepInspector.dialog.name' />",
	deepInspector_dialog_title				: "<fmt:message key='deepInspector.dialog.title' />",	
	deepInspector_dialog_maxresult			: "<fmt:message key='deepInspector.dialog.maxresult' />",
	deepInspector_dialog_maxrow				: "<fmt:message key='deepInspector.dialog.maxrow' />",
	deepInspector_dialog_maxcol				: "<fmt:message key='deepInspector.dialog.maxcol' />",
	deepInspector_dialog_alert					: "<fmt:message key='deepInspector.dialog.alert' />",
	deepInspector_dialog_schedulable			: "<fmt:message key='deepInspector.dialog.schedulable' />",
	deepInspector_dialog_description			: "<fmt:message key='deepInspector.dialog.description' />",
	deepInspector_dialog_sortresult			: "<fmt:message key='deepInspector.dialog.sortresult' />",
	deepInspector_dialog_sortresult_frequency		: "<fmt:message key='deepInspector.dialog.sortresult.frequency' />",
	deepInspector_dialog_sortresult_indexcol		: "<fmt:message key='deepInspector.dialog.sortresult.indexcol' />",
	
	
	tooltip_deepInspector_dialog_maxresult : "<fmt:message key='tooltip.deepInspector.dialog.maxresult' />",
	tooltip_deepInspector_dialog_maxrow		: "<fmt:message key='tooltip.deepInspector.dialog.maxrow' />",
	tooltip_deepInspector_dialog_maxcol		: "<fmt:message key='tooltip.deepInspector.dialog.maxcol' />",
	tooltip_deepInspector_dialog_alert		: "<fmt:message key='tooltip.deepInspector.dialog.alert' />",
	tooltip_deepInspector_dialog_schedulable	: "<fmt:message key='tooltip.deepInspector.dialog.schedulable' />",
	tooltip_deepInspector_dialog_description	: "<fmt:message key='tooltip.deepInspector.dialog.description' />",
	tooltip_deepInspector_error_maxresult	: "<fmt:message key='tooltip.deepInspector.error.maxresult' />",
	tooltip_deepInspector_error_maxrow		: "<fmt:message key='tooltip.deepInspector.error.maxrow' />",
	tooltip_deepInspector_error_maxcol		: "<fmt:message key='tooltip.deepInspector.error.maxcol' />",
	tooltip_deepInspector_error_threshhold	: "<fmt:message key='tooltip.deepInspector.error.threshhold' />",
	tooltip_deepInspector_error_fail			: "<fmt:message key='tooltip.deepInspector.error.fail' />",
		
	facetsearch_filter						:"<fmt:message key='analytics.view.categorytree.filter' />",
	facetsearch_dialog_title				:"<fmt:message key='facetsearch.dialog.title' />",
	facetsearch_dialog_facetLabel			:"<fmt:message key='facetsearch.dialog.facetLabel' />",
	facetsearch_dialog_facetPath			:"<fmt:message key='facetsearch.dialog.facetPath' />",
	facetsearch_dialog_keyword				:"<fmt:message key='facetsearch.dialog.keyword' />",
	facetsearch_dialog_search_type		:"<fmt:message key='facetsearch.dialog.search.type' />",
	facetsearch_dialog_search_keyword	:"<fmt:message key='facetsearch.dialog.search.keyword' />",
	facetsearch_dialog_search_subfacet	:"<fmt:message key='facetsearch.dialog.search.subfacet' />",
	tooltip_facetsearch						:"<fmt:message key='tooltip.facetsearch' />",
		
	searchpane_title						: "<fmt:message key='searchpane.title' />",
	searchpane_newsearch					: "<fmt:message key='searchpane.newsearch' />",
	searchpane_addsearch					: "<fmt:message key='searchpane.addearch' />",
	searchpane_search						: "<fmt:message key='searchpane.search' />",
	searchpane_clear						: "<fmt:message key='searchpane.clear' />",
	searchpane_morelink					: "<fmt:message key='searchpane.morelink' />",
	searchpane_showqueryarea			: "<fmt:message key='label.queryarea.show' />",
	searchpane_hidequeryarea			: "<fmt:message key='label.queryarea.hide' />",
	
	erros_noQueryTerms						: "<fmt:message key='errors.noQueryTerms' />",
	erros_dialog_information					: "<fmt:message key='errors.dialog.information' />",
	error_Search_invalid_param				: "<fmt:message key='error.Search.invalid.param' />",
	error_Search_invalid_date				: "<fmt:message key='error.Search.invalid.date' />",
	error_Search_invalid_dateRange			: "<fmt:message key='error.Search.invalid.dateRange' />",
	error_Search_invalid_dateRange_values	: "<fmt:message key='error.Search.invalid.dateRange.values' />",
	errors_dialog_information				: "<fmt:message key='errors.dialog.information' />",
	error_savesearch_noname					: "<fmt:message key='error.savesearch.noname' />",
	error_savesearch_noquery				: "<fmt:message key='error.savesearch.noquery' />",
	
	text_collection_none					: "<fmt:message key='text.collection.none' />",
	text_results_displayed					: "<fmt:message key='text.results.displayed' />",
	text_results_found						: "<fmt:message key='text.results.found' />",
	text_results_range						: "<fmt:message key='text.results.range' />",
	text_results_all						: "<fmt:message key='text.results.all' />",	
	text_results_omitted					: "<fmt:message key='text.results.omitted' />",	
	text_results_show_duplicates			: "<fmt:message key='text.results.show.duplicates' />",		

	tooltip_sortBy_fieldDescending			: "<fmt:message key='tooltip.sortBy.fieldDescending' />",
	tooltip_sortBy_fieldAscending			: "<fmt:message key='tooltip.sortBy.fieldAscending' />",
	tooltip_searchpane_newsearch			: "<fmt:message key='tooltip.searchpane.newsearch' />",
	tooltip_searchpane_addsearch			: "<fmt:message key='tooltip.searchpane.addearch' />",
	tooltip_searchpane_newsearch_link		: "<fmt:message key='tooltip.searchpane.newsearch.link' />",
	tooltip_searchpane_addsearch_link		: "<fmt:message key='tooltip.searchpane.addearch.link' />",
	tooltip_searchpane_newsearch_checked	: "<fmt:message key='tooltip.searchpane.newsearch.checked' />",
	tooltip_searchpane_addsearch_checked	: "<fmt:message key='tooltip.searchpane.addearch.checked' />",
	tooltip_searchpane_search				: "<fmt:message key='tooltip.searchpane.search' />",
	tooltip_searchpane_clear				: "<fmt:message key='tooltip.searchpane.clear' />",
	tooltip_facet_and						: "<fmt:message key='tooltip.facet.and' />",
	tooltip_facet_and_checked				: "<fmt:message key='tooltip.facet.and.checked' />",
	tooltip_facet_not						: "<fmt:message key='tooltip.facet.not' />",
	tooltip_facet_not_checked				: "<fmt:message key='tooltip.facet.not.checked' />",
	tooltip_facet_plus						: "<fmt:message key='tooltip.facet.plus' />",
	tooltip_facet_minus						: "<fmt:message key='tooltip.facet.minus' />",
	tooltip_facet_quick						: "<fmt:message key='tooltip.facet.quick' />",
	tooltip_facet_expandcollapse			: "<fmt:message key='tooltip.facet.expandcollapse' />",
	tooltip_facet_mine						: "<fmt:message key='tooltip.facet.mine' />",	
	tooltip_facet_selected_remove			: "<fmt:message key='tooltip.facet.selected.remove'/>",
	tooltip_documentlabel_selected_remove			: "<fmt:message key='tooltip.documentlabel.selected.remove'/>",
	tooltip_facet_typeahead					: "<fmt:message key='tooltip.facet.typeahead'/>",
	tooltip_documentlabel_typeahead					: "<fmt:message key='tooltip.documentlabel.typeahead'/>",
	tooltip_help								: "<fmt:message key='tooltip.help.link.general'/>",
	tooltip_help_collection					: "<fmt:message key='tooltip.help.searchoptions.collection' />",
	tooltip_help_querymode				: "<fmt:message key='tooltip.help.searchoptions.querymode' />",
	tooltip_help_typeAheadMode			:	"<fmt:message key='tooltip.help.searchoptions.typeAheadMode' />",
	tooltip_help_querysyntax				: "<fmt:message key='tooltip.help.searchoptions.querysyntax' />",
	tooltip_help_general						: "<fmt:message key='tooltip.link.help' />",
	tooltip_deepInspection					: "<fmt:message key='tooltip.deepInspection' />",	
	tooltip_showmorefacet					: "<fmt:message key='tooltip.facet.more' />",
	tooltip_showmoredocumentlabel					: "<fmt:message key='tooltip.category.more' />",

	tooltip_documents_next					: "<fmt:message key='tooltip.documents.next' />",
	tooltip_documents_previous				: "<fmt:message key='tooltip.documents.previous' />",
	tooltip_documents_first					: "<fmt:message key='tooltip.documents.first' />",
	tooltip_documents_last					: "<fmt:message key='tooltip.documents.last' />",

	tooltip_2d_facet1						: "<fmt:message key='tooltip.2d.facet1' />",
	tooltip_2d_facet2						: "<fmt:message key='tooltip.2d.facet2' />",
	
	tooltip_documentsources: "<fmt:message key='tooltip.searchoptions.documentsources' />",
	tooltip_documenttypes: "<fmt:message key='tooltip.searchoptions.documenttypes' />",
	tooltip_languages: "<fmt:message key='tooltip.searchoptions.languages' />",
	tooltip_scopes: "<fmt:message key='tooltip.searchoptions.scopes' />",

	text_field_predefinedLinks				: "<fmt:message key='text.field.predefinedLinks' />",
	text_field_spellCorrections				: "<fmt:message key='text.field.spellCorrections' />",
	text_field_synonymExpansion				: "<fmt:message key='text.field.synonymExpansion' />",
	text_field_synonymExpansionSemantic		: "<fmt:message key='text.field.synonymExpansionSemantic' />",
	text_field_synonymExpansionSemanticConcepts : "<fmt:message key='text.field.synonymExpansionSemanticConcepts' />",

	// for customizer
	banner									: "<fmt:message key='banner' />",
	backgroundImageName						: "<fmt:message key='backgroundImageName' />",
	bannerLeft								: "<fmt:message key='bannerLeft' />",
	bannerImageName							: "<fmt:message key='bannerImageName' />",
	bannerRight								: "<fmt:message key='bannerRight' />",
	clientViewer							: "<fmt:message key='clientViewer' />",
	banner_collection						: "<fmt:message key='banner.collection' />",
	banner_collection_change				: "<fmt:message key='banner.collection.change' />",
	banner_collection_change_tooltip		: "<fmt:message key='banner.collection.change.tooltip' />",
	analytics_view_title_category			: "<fmt:message key='analytics.view.title.category' />",
	analytics_view_title_timeseries			: "<fmt:message key='analytics.view.title.timeseries' />",
	analytics_view_title_topic				: "<fmt:message key='analytics.view.title.topic' />",
	analytics_view_title_delta				: "<fmt:message key='analytics.view.title.delta' />",
	analytics_view_title_twodmap			: "<fmt:message key='analytics.view.title.twodmap' />",
	customizer_analytics_common_default		: "<fmt:message key='customizer.common.default' />",	
	customizer_analytics_common_available	: "<fmt:message key='customizer.common.available' />",	
	customizer_analytics_2dmap_rows			: "<fmt:message key='customizer.analytics.2dmap_rows' />",	
	customizer_analytics_2dmap_columns		: "<fmt:message key='customizer.analytics.2dmap_columns' />",		
	customizer_analytics_max_lines			: "<fmt:message key='customizer.analytics.max_lines' />",	
	customizer_popup_label					: "<fmt:message key='customizer.popup.label' />",	
	customizer_popup_button_open			: "<fmt:message key='customizer.popup.button.open' />",	
	customizer_popup_button_revert			: "<fmt:message key='customizer.popup.button.revert' />",	
	customizer_popup_button_save			: "<fmt:message key='customizer.popup.button.save' />",	
	customizer_popup_button_exit			: "<fmt:message key='customizer.popup.button.exit' />",	
	customizer_query_section1				: "<fmt:message key='customizer.query.section1' />",	
	customizer_query_section2				: "<fmt:message key='customizer.query.section2' />",	
	customizer_query_section3				: "<fmt:message key='customizer.query.section3' />",
	customizer_query_typeAhead_section		: "<fmt:message key='customizer.query.typeAhead.section' />",
	customizer_typeAhead_search_numberOfResults	: "<fmt:message key='customizer.typeAhead.search.numberOfResults' />",
	customizer_typeAhead_search_mode				: "<fmt:message key='customizer.typeAhead.search.mode' />",
	customizer_typeAhead_facet_numberOfResults	: "<fmt:message key='customizer.typeAhead.facet.numberOfResults' />",
	customizer_typeAhead_category_numberOfResults	: "<fmt:message key='customizer.typeAhead.category.numberOfResults' />",
	customizer_results_section1				: "<fmt:message key='customizer.results.section1' />",
	customizer_screen_section1				: "<fmt:message key='customizer.screen.section1' />",
	customizer_screen_section2				: "<fmt:message key='customizer.screen.section2' />",
	customizer_screen_section3				: "<fmt:message key='customizer.screen.section3' />",
	customizer_server_section1				: "<fmt:message key='customizer.server.section1' />",
	customizer_server_section2				: "<fmt:message key='customizer.server.section2' />",
	customizer_charts_topResults_header		: "<fmt:message key='customizer.charts.topResults.header' />",
	customizer_charts_topResults_button_label		: "<fmt:message key='customizer.charts.topResults.button.label' />",
	customizer_charts_facet_header		: "<fmt:message key='customizer.charts.facet.header' />",
	customizer_charts_facet_button_label		: "<fmt:message key='customizer.charts.facet.button.label' />",
	customizer_charts_facet_section1				:  "<fmt:message key='customizer.charts.facet.section1' />",
	customizer_charts_facet_section2				:  "<fmt:message key='customizer.charts.facet.section2' />",
	customizer_text_imc_password_label		: "<fmt:message key='customizer.text.imc.password.label' />",
	customizer_text_imc_username_label		: "<fmt:message key='customizer.text.imc.username.label' />",
	customizer_prompt_advanced_numRequestedResults: "<fmt:message key='customizer.prompt.advanced.numRequestedResults' />",
	customizer_preferences_analytics_facets_numberOfResults: "<fmt:message key='customizer.preferences.analytics.facets.numberOfResults' />",
	customizer_preferences_analytics_facets_defaultSortBy: "<fmt:message key='customizer.preferences.analytics.facets.defaultSortBy' />",
	customizer_preferences_analytics_facets_defaultShowTarget: "<fmt:message key='customizer.preferences.analytics.facets.defaultShowTarget' />",
	customizer_analytics_common_listTarget_subcategory: "<fmt:message key='customizer.analytics.common.listTarget.subcategory' />",
	customizer_analytics_common_listTarget_keyword: "<fmt:message key='customizer.analytics.common.listTarget.keyword' />",
	customizer_preferences_analytics_sortByFrequency: "<fmt:message key='customizer.preferences.analytics.sortByFrequency' />",
	customizer_preferences_analytics_sortByCorrelation: "<fmt:message key='customizer.preferences.analytics.sortByCorrelation' />",
	customizer_preferences_analytics_sortByAlphabetical: "<fmt:message key='customizer.preferences.analytics.sortByAlphabetical' />",

	customizer_preferences_analytics_timeseries_defaultTimeScale	: "<fmt:message key='customizer.preferences.analytics.timeseries.defaultTimeScale' />",

	customizer_preferences_analytics_deviations_numberOfResults	: "<fmt:message key='customizer.preferences.analytics.deviations.numberOfResults' />",
	customizer_preferences_analytics_deviations_numberOfCharts	: "<fmt:message key='customizer.preferences.analytics.deviations.numberOfCharts' />",
	customizer_preferences_analytics_deviations_showLineInChart	: "<fmt:message key='customizer.preferences.analytics.deviations.showLineInChart' />",
	customizer_preferences_analytics_deviations_defaultSortBy	: "<fmt:message key='customizer.preferences.analytics.deviations.defaultSortBy' />",
	customizer_preferences_analytics_deviations_defaultShowTarget	: "<fmt:message key='customizer.preferences.analytics.deviations.defaultShowTarget' />",
	customizer_preferences_analytics_deviations_defaultTimeScale	: "<fmt:message key='customizer.preferences.analytics.deviations.defaultTimeScale' />",
	customizer_preferences_analytics_deviations_barColorOfMultiChart	: "<fmt:message key='customizer.preferences.analytics.deviations.barColorOfMultiChart' />",

	customizer_preferences_analytics_trends_numberOfResults	: "<fmt:message key='customizer.preferences.analytics.trends.numberOfResults' />",
	customizer_preferences_analytics_trends_numberOfCharts	: "<fmt:message key='customizer.preferences.analytics.trends.numberOfCharts' />",
	customizer_preferences_analytics_trends_showLineInChart	: "<fmt:message key='customizer.preferences.analytics.trends.showLineInChart' />",
	customizer_preferences_analytics_trends_defaultSortBy	: "<fmt:message key='customizer.preferences.analytics.trends.defaultSortBy' />",
	customizer_preferences_analytics_trends_defaultShowTarget	: "<fmt:message key='customizer.preferences.analytics.trends.defaultShowTarget' />",
	customizer_preferences_analytics_trends_defaultTimeScale	: "<fmt:message key='customizer.preferences.analytics.trends.defaultTimeScale' />",
	customizer_preferences_analytics_trends_barColorOfMultiChart	: "<fmt:message key='customizer.preferences.analytics.trends.barColorOfMultiChart' />",
	customizer_preferences_analytics_facetPairs_numberOfRowResults	: "<fmt:message key='customizer.preferences.analytics.facetPairs.numberOfRowResults' />",
	customizer_preferences_analytics_facetPairs_numberOfRowsInTable	: "<fmt:message key='customizer.preferences.analytics.facetPairs.numberOfRowsInTable' />",
	customizer_preferences_analytics_facetPairs_numberOfColumnResults	: "<fmt:message key='customizer.preferences.analytics.facetPairs.numberOfColumnResults' />",
	customizer_preferences_analytics_facetPairs_numberOfColumnsInTable	: "<fmt:message key='customizer.preferences.analytics.facetPairs.numberOfColumnsInTable' />",
	customizer_preferences_analytics_facetPairs_defaultRowShowTarget	: "<fmt:message key='customizer.preferences.analytics.facetPairs.defaultRowShowTarget' />",
	customizer_preferences_analytics_facetPairs_defaultColumnShowTarget	: "<fmt:message key='customizer.preferences.analytics.facetPairs.defaultColumnShowTarget' />",
	customizer_preferences_analytics_facetPairs_defaultListSortBy	: "<fmt:message key='customizer.preferences.analytics.facetPairs.defaultListSortBy' />",
	customizer_preferences_analytics_facetPairs_defaultRowSortBy	: "<fmt:message key='customizer.preferences.analytics.facetPairs.defaultRowSortBy' />",
	customizer_preferences_analytics_facetPairs_defaultColumnSortBy	: "<fmt:message key='customizer.preferences.analytics.facetPairs.defaultColumnSortBy' />",
	customizer_preferences_analytics_facetPairs_defaultView	: "<fmt:message key='customizer.preferences.analytics.facetPairs.defaultView' />",
	customizer_preferences_analytics_facetPairs_defaultView_flat	: "<fmt:message key='customizer.preferences.analytics.facetPairs.defaultView.flat' />",
	customizer_preferences_analytics_facetPairs_defaultView_grid	: "<fmt:message key='customizer.preferences.analytics.facetPairs.defaultView.grid' />",
	customizer_preferences_analytics_facetPairs_defaultView_table	: "<fmt:message key='customizer.preferences.analytics.facetPairs.defaultView.table' />",
	customizer_$_year							: "<fmt:message key='customizer.$.year' />",
	customizer_$_month							: "<fmt:message key='customizer.$.month' />",
	customizer_$_day							: "<fmt:message key='customizer.$.day' />",
	customizer_$_month_of_year					: "<fmt:message key='customizer.$.month_of_year' />",
	customizer_$_day_of_month					: "<fmt:message key='customizer.$.day_of_month' />",
	customizer_$_day_of_week					: "<fmt:message key='customizer.$.day_of_week' />",
	customizer_preferences_analytics_barColorOfMultiChart_label_legend	: "<fmt:message key='customizer.preferences.analytics.barColorOfMultiChart.label.legend' />",
	customizer_preferences_analytics_barColorOfMultiChart_label_index	: "<fmt:message key='customizer.preferences.analytics.barColorOfMultiChart.label.index' />",
	customizer_no_palette: "<fmt:message key='common.no' />" + " " + "<fmt:message key='palette' />", 
	
	//# Prompts
	prompt_displayed_application_name		: "<fmt:message key='prompt.displayed.application.name' />",
	prompt_application_name					: "<fmt:message key='prompt.application.name' />",
	prompt_application_password				: "<fmt:message key='prompt.application.password' />",
	prompt_collections						: "<fmt:message key='prompt.collections' />",
	prompt_hostname							: "<fmt:message key='prompt.hostname' />",
	prompt_loggingLevel						: "<fmt:message key='prompt.loggingLevel' />",
	prompt_loggingLevel_info				: "<fmt:message key='prompt.loggingLevel.info' />",
	prompt_loggingLevel_severe				: "<fmt:message key='prompt.loggingLevel.severe' />",
	prompt_loggingLevel_all					: "<fmt:message key='prompt.loggingLevel.all' />",
	prompt_loggingLevel_off					: "<fmt:message key='prompt.loggingLevel.off' />",
	prompt_loggingLevel_fine				: "<fmt:message key='prompt.loggingLevel.fine' />",
	prompt_portNumber						: "<fmt:message key='prompt.portNumber' />",
	prompt_tabName							: "<fmt:message key='prompt.tabName' />",
	prompt_tabCollections					: "<fmt:message key='prompt.tabCollections' />",
	prompt_searchWithinResults				: "<fmt:message key='prompt.searchWithinResults' />",
	prompt_ascending_active					: "<fmt:message key='prompt.ascending.active' />",
	prompt_descending_active				: "<fmt:message key='prompt.descending.active' />",
	
	showMessage_error						: "<fmt:message key='showMessage.error' />",
	showMessage_warning						: "<fmt:message key='showMessage.warning' />",
	showMessage_info						: "<fmt:message key='showMessage.info' />",
	showMessage_success						: "<fmt:message key='showMessage.success' />",

	showDetailsImage_show					: "<fmt:message key='showDetailsImage.show' />",
	showDetails_show						: "<fmt:message key='showDetails.show' />",
	refineResults_show						: "<fmt:message key='refineResults.show' />",
	sorting_show							: "<fmt:message key='sorting.show' />",
	sourceTypeFilter_show					: "<fmt:message key='sourceTypeFilter.show' />",
	filter_showOnTwoLines					: "<fmt:message key='filter.showOnTwoLines' />",
	clientViewer_show						: "<fmt:message key='clientViewer.show' />",
	builtQueryString_show					: "<fmt:message key='builtQueryString.show' />",
	extraQueryData_show						: "<fmt:message key='extraQueryData.show' />",
	refreshButton_show						: "<fmt:message key='refreshButton.show' />",
	numberSearchResultsReturned_show		: "<fmt:message key='numberSearchResultsReturned.show' />",
	preferences_extendedHighlighting		: "<fmt:message key='preferences.extendedHighlighting' />",
	hostname								: "<fmt:message key='hostname' />",

	filters									: "<fmt:message key='filters' />",
	queryOptions							: "<fmt:message key='queryOptions' />",
	hostData								: "<fmt:message key='hostData' />",
	timeout									: "<fmt:message key='timeout' />",
	trustStore								: "<fmt:message key='trustStore' />",
	trustPassword							: "<fmt:message key='trustPassword' />",
	port									: "<fmt:message key='port' />",
	protocol								: "<fmt:message key='protocol' />",
	protocol_http							: "<fmt:message key='protocol.http' />",
	protocol_https							: "<fmt:message key='protocol.https' />",
	

	// link to OEE's message id
	K0001I_COMMON_OK	 					: "<fmt:message key='common.ok'/>",
	K0001I_COMMON_CANCEL 					: "<fmt:message key='common.cancel'/>",
	K0001I_COMMON_CLOSE						: "<fmt:message key='common.close'/>",
	K0001I_COMMON_ALERT						: "<fmt:message key='common.alert'/>",
	K0001I_COMMON_CONFIRM					: "<fmt:message key='common.confirm'/>",
	common_add					: "<fmt:message key='button.add' />",
	common_remove				: "<fmt:message key='button.remove' />",
	common_yes					: "<fmt:message key='common.yes' />",
	common_no					: "<fmt:message key='common.no' />",
	common_delete				: "<fmt:message key='alt.delete' />",
	label_schedulable_yes	: "<fmt:message key='label.schedulable.yes' />",
	label_schedulable_no		: "<fmt:message key='label.schedulable.no' />",
	

//		#Document source tooltip. Used in search results
	vbr_tooltip					: "<fmt:message key='vbr.tooltip' />",				
	cm_tooltip              	: "<fmt:message key='cm.tooltip' />",
	dominodoc_tooltip       	: "<fmt:message key='dominodoc.tooltip' />",
	db2_tooltip             	: "<fmt:message key='db2.tooltip' />",
	exchange_tooltip        	: "<fmt:message key='exchange.tooltip' />",
	nntp_tooltip            	: "<fmt:message key='nntp.tooltip' />",
	notes_tooltip           	: "<fmt:message key='notes.tooltip' />",
	quickplace_tooltip      	: "<fmt:message key='quickplace.tooltip' />",
	unixfs_tooltip          	: "<fmt:message key='unixfs.tooltip' />",
	web_tooltip             	: "<fmt:message key='web.tooltip' />",
	wp_tooltip              	: "<fmt:message key='wp.tooltip' />",
	winfs_tooltip           	: "<fmt:message key='winfs.tooltip' />",
	wcm_tooltip             	: "<fmt:message key='wcm.tooltip' />",
	database_tooltip        	: "<fmt:message key='database.tooltip' />",
	ldap_tooltip            	: "<fmt:message key='ldap.tooltip' />",
	jdbc_tooltip            	: "<fmt:message key='jdbc.tooltip' />",
	seedlist_tooltip        	: "<fmt:message key='seedlist.tooltip' />",
	p8_tooltip					: "<fmt:message key='p8.tooltip' />",
	sp_tooltip					: "<fmt:message key='sp.tooltip' />",
	agent_tooltip				: "<fmt:message key='agent.tooltip' />",

	// Source Types
	vbr							: "<fmt:message key='vbr' />",				
	cm			              	: "<fmt:message key='cm' />",
	dominodoc			       	: "<fmt:message key='dominodoc' />",
	db2			             	: "<fmt:message key='db2' />",
	exchange		        	: "<fmt:message key='exchange' />",
	nntp		            	: "<fmt:message key='nntp' />",
	notes			           	: "<fmt:message key='notes' />",
	quickplace			      	: "<fmt:message key='quickplace' />",
	unixfs			          	: "<fmt:message key='unixfs' />",
	web			             	: "<fmt:message key='web' />",
	wp			              	: "<fmt:message key='wp' />",
	winfs			           	: "<fmt:message key='winfs' />",
	wcm			             	: "<fmt:message key='wcm' />",
	database		        	: "<fmt:message key='database' />",
	ldap		            	: "<fmt:message key='ldap' />",
	jdbc		            	: "<fmt:message key='jdbc' />",
	seedlist		        	: "<fmt:message key='seedlist' />",
	p8							: "<fmt:message key='p8' />",
	sp							: "<fmt:message key='sp' />",
	agent						: "<fmt:message key='agent' />",

	//SSO related errors
	errors_imc_disabled			: "<fmt:message key='errors.imc.disabled' />",        	
	errors_imc_invalid_credentials: "<fmt:message key='errors.imc.invalid.credentials' />",
	errors_imc_invalid_token    :"<fmt:message key='errors.imc.invalid.token' />",   
	errors_imc_properties_empty :"<fmt:message key='errors.imc.properties.empty' />",
	
	
	text_imc_sso_enabled		: "<fmt:message key='text.imc.sso.enabled' />",
	text_imc_display_help		: "<fmt:message key='text.imc.display.help' />",
	text_imc_display_label		: "<fmt:message key='text.imc.display.label' />",
	text_imc_domain_label		: "<fmt:message key='text.imc.domain.label' />",
	text_imc_enable_label		: "<fmt:message key='text.imc.enable.label' />",
	text_imc_ignore_help		: "<fmt:message key='text.imc.ignore.help' />",
	text_imc_password_label		: "<fmt:message key='text.imc.password.label' />",
	text_imc_username_label		: "<fmt:message key='text.imc.username.label' />",
	text_imc_unavailable		: "<fmt:message key='text.imc.unavailable' />",

	// Column headers
	columns_narrowresults		: "<fmt:message key='columns.narrowresults' />",
	columns_filetype			: "<fmt:message key='columns.filetype' />",
	columns_relevance			: "<fmt:message key='columns.relevance' />",
	columns_date				: "<fmt:message key='columns.date' />",
	columns_title				: "<fmt:message key='columns.title' />",
	columns_thumbnail			: "<fmt:message key='columns.thumbnail' />",

	tooltip_columns_filetype	: "<fmt:message key='tooltip.columns.filetype' />",
	tooltip_columns_relevance	: "<fmt:message key='tooltip.columns.relevance' />",
	tooltip_columns_date		: "<fmt:message key='tooltip.columns.date' />",
	tooltip_columns_title		: "<fmt:message key='tooltip.columns.title' />",
	tooltip_columns_thumbnail	: "<fmt:message key='tooltip.columns.thumbnail' />",
	
	
	link_search_site			: "<fmt:message key='link.search.site' />",
	link_preferences_show		: "<fmt:message key='link.preferences.show' />",
	link_myProfile_show			: "<fmt:message key='link.myProfile.show' />",
	link_about_show				: "<fmt:message key='link.about.show' />",
	link_help_show				: "<fmt:message key='link.help.show' />",
	link_logOff_show			: "<fmt:message key='link.logOff.show' />",
	
	// Advanced search
	prompt_search							:"<fmt:message key='prompt.search'/>",
	prompt_searchOptions					:"<fmt:message key='prompt.searchOptions'/>",
	prompt_showResultsWith_allWords  :"<fmt:message key='prompt.showResultsWith.allWords'/>",
	prompt_showResultsWith_phrase		:"<fmt:message key='prompt.showResultsWith.phrase'/>",
	prompt_showResultsWith_anyWords	:"<fmt:message key='prompt.showResultsWith.anyWords'/>",
	prompt_showResultsWith_noneWords :"<fmt:message key='prompt.showResultsWith.noneWords'/>",
	text_Search_dateStart				:"<fmt:message key='text.Search.dateStart'/>",
	text_Search_dateEnd					:"<fmt:message key='text.Search.dateEnd'/>",
	button_advancedSearch_show :"<fmt:message key='button.advancedSearch.show'/>",
	button_advancedSearch_hide :"<fmt:message key='button.advancedSearch.hide'/>",
	prompt_show_ACL				:"<fmt:message key='prompt.show.ACL'/>",
	
	advancedSearch_noResult		:"<fmt:message key='advancedSearch.noResult'/>",
	facets_noResult		:"<fmt:message key='facets.noResult'/>",
	facets_narrowedby			:"<fmt:message key='facets.narrowedby'/>",
	editSearch_title			:"<fmt:message key='editSearch.title'/>",
	deleteSavedSearch_title			:"<fmt:message key='deleteSavedSearch.title'/>",
	saveSearch_title			:"<fmt:message key='saveSearch.title'/>",
	saveSearch_name_show			:"<fmt:message key='saveSearch.name.show'/>",
	saveSearch_query_show			:"<fmt:message key='saveSearch.query.show'/>",
	saveSearch_description_show			:"<fmt:message key='saveSearch.description.show'/>",

	tooltip_advancedSearch	:"<fmt:message key='tooltip.advancedSearch'/>",
	
	tooltip_searchpane_newsearch_link	:"<fmt:message key='tooltip.searchpane.newsearch.link'/>",
	tooltip_searchpane_addsearch_link	:"<fmt:message key='tooltip.searchpane.addsearch.link'/>",
	tooltip_searchpane_search		:"<fmt:message key='tooltip.searchpane.search'/>",
	tooltip_searchpane_clear			:"<fmt:message key='tooltip.searchpane.clear'/>",
	tooltip_searchpane_showoptions_link		:"<fmt:message key='tooltip.searchpane.showoptions.link'/>",

	tooltip_allWords			:"<fmt:message key='tooltip.allWords'/>",
	tooltip_exactPhrase			:"<fmt:message key='tooltip.exactPhrase'/>",
	tooltip_anyWords			:"<fmt:message key='tooltip.anyWords'/>",
	tooltip_noneWords			:"<fmt:message key='tooltip.noneWords'/>",
	tooltip_dateRange			:"<fmt:message key='tooltip.dateRange'/>",

	tooltip_saveSearchDialogButton	:"<fmt:message key='tooltip.saveSearchDialogButton'/>",
	tooltip_searcBackwardButton	:"<fmt:message key='tooltip.searcBackwardButton'/>",
	tooltip_searcForwardButton	:"<fmt:message key='tooltip.searcForwardButton'/>",
	tooltip_expandResults_open	:"<fmt:message key='tooltip.expandResults.open'/>",
	tooltip_expandResults_close	:"<fmt:message key='tooltip.expandResults.close'/>",
	tooltip_resultsFilterBy	:"<fmt:message key='tooltip.resultsFilterBy'/>",
	tooltip_resultsPerPage	:"<fmt:message key='tooltip.resultsPerPage'/>",
	tooltip_openConfigDialogButton	:"<fmt:message key='tooltip.openConfigDialogButton'/>",

	tooltip_preview_previous	:"<fmt:message key='tooltip.preview.previous'/>",
	tooltip_preview_next	:"<fmt:message key='tooltip.preview.next'/>",

	preferences_resultsColumns		:"<fmt:message key='preferences.resultsColumns'/>",
	preferences_resultsColumns_show	:"<fmt:message key='preferences.resultsColumns.show'/>",
	preferences_resultsColumns_moveToFirst	: "<fmt:message key='preferences.resultsColumns.moveToFirst'/>",
	preferences_resultsColumns_moveBefore	: "<fmt:message key='preferences.resultsColumns.moveBefore'/>",
	preferences_resultsColumns_moveAfter	: "<fmt:message key='preferences.resultsColumns.moveAfter'/>",
	preferences_resultsColumns_moveToLast	: "<fmt:message key='preferences.resultsColumns.moveToLast'/>",
	preferences_resultsColumns_header1	: "<fmt:message key='preferences.resultsColumns.header1'/>",
	preferences_resultsColumns_header2	: "<fmt:message key='preferences.resultsColumns.header2'/>",
	preferences_resultsColumns_error_noCellChecked : "<fmt:message key='preferences.resultsColumns.error.noCellChecked'/>",
	
	facetOption_intro						:"<fmt:message key='facetOption.intro'/>",
	facetOption_typeahead				:"<fmt:message key='facetOption.typeahead'/>",
	facetOption_documentLabel_typeahead :"<fmt:message key='facetOption.documentlabel.typeahead'/>",
	facetOption_show						:"<fmt:message key='facetOption.show'/>",
	facetOption_tooltip_numberOfResults :"<fmt:message key='tooltip.facet.typeAhead.numberOfResults'/>",
	documentlabelOption_tooltip_numberOfResults :"<fmt:message key='tooltip.documentlabel.typeAhead.numberOfResults'/>",
	topResultAnalysisOption_intro			:"<fmt:message key='topResultAnalysisOption.intro'/>",
	topResultAnalysisOption_show			:"<fmt:message key='topResultAnalysisOption.show'/>",

	
	resultsOption_label_title			:"<fmt:message key='resultsOption.label.title'/>",
	resultsOption_label_number			:"<fmt:message key='resultsOption.label.number'/>",
	resultsOption_label_lang			:"<fmt:message key='resultsOption.label.lang'/>",
	resultsOption_label_mode			:"<fmt:message key='resultsOption.label.mode'/>",
	resultsOption_label_sortby			:"<fmt:message key='resultsOption.label.sortby'/>",
	resultsOption_label_sortorder			:"<fmt:message key='resultsOption.label.sortorder'/>",
	resultsOption_label_summarylen			:"<fmt:message key='resultsOption.label.summarylen'/>",
	resultsOption_label_summarymin			:"<fmt:message key='resultsOption.label.summarymin'/>",
	resultsOption_label_summarymax			:"<fmt:message key='resultsOption.label.summarymax'/>",
	resultsOption_label_quicklinks			:"<fmt:message key='resultsOption.label.quicklinks'/>",
	resultsOption_label_spell			:"<fmt:message key='resultsOption.label.spell'/>",
	resultsOption_label_collapse			:"<fmt:message key='resultsOption.label.collapse'/>",
	resultsOption_label_synonym			:"<fmt:message key='resultsOption.label.synonym'/>",
	resultsOption_label_yes			:"<fmt:message key='resultsOption.label.yes'/>",
	resultsOption_label_no			:"<fmt:message key='resultsOption.label.no'/>",
	resultsOption_label_semanticyes			:"<fmt:message key='resultsOption.label.semanticyes'/>",
	resultsOption_label_mode_engine			:"<fmt:message key='resultsOption.label.mode.engine'/>",
	resultsOption_label_mode_baseform			:"<fmt:message key='resultsOption.label.mode.baseform'/>",
	resultsOption_label_mode_exact			:"<fmt:message key='resultsOption.label.mode.exact'/>",
	resultsOption_label_mode_baseformexact			:"<fmt:message key='resultsOption.label.mode.baseformexact'/>",
	resultsOption_label_ascending			:"<fmt:message key='resultsOption.label.ascending'/>",
	resultsOption_label_descending			:"<fmt:message key='resultsOption.label.descending'/>",
	resultsOption_label_typeAhead_numberOfResults	:"<fmt:message key='resultsOption.label.typeAhead.numberOfResults'/>",
	resultsOption_label_typeAhead_mode	:"<fmt:message key='resultsOption.label.typeAhead.mode'/>",
	resultsOption_label_typeAhead_mode_off	:"<fmt:message key='resultsOption.label.typeAhead.mode.off'/>",
	resultsOption_label_typeAhead_mode_queryLog	:"<fmt:message key='resultsOption.label.typeAhead.mode.queryLog'/>",
	resultsOption_label_typeAhead_mode_term	:"<fmt:message key='resultsOption.label.typeAhead.mode.term'/>",
	resultsOption_label_typeAhead_mode_queryLogFirst	:"<fmt:message key='resultsOption.label.typeAhead.mode.queryLogFirst'/>",
	resultsOption_label_typeAhead_mode_termFirst	:"<fmt:message key='resultsOption.label.typeAhead.mode.termFirst'/>",
	
	tooltip_resultsOption_num_results		:"<fmt:message key='tooltip.resultsOption.num.results'/>",
	tooltip_resultsOption_query_lang	:"<fmt:message key='tooltip.resultsOption.query.lang'/>",
	tooltip_resultsOption_mode	:"<fmt:message key='tooltip.resultsOption.mode'/>",
	tooltip_resultsOption_mode_base	:"<fmt:message key='tooltip.resultsOption.mode.base'/>",
	tooltip_resultsOption_mode_exact	:"<fmt:message key='tooltip.resultsOption.mode.exact'/>",
	tooltip_resultsOption_mode_both	:"<fmt:message key='tooltip.resultsOption.mode.both'/>",
	tooltip_resultsOption_sort_by	:"<fmt:message key='tooltip.resultsOption.sort.by'/>",
	tooltip_resultsOption_sort_order	:"<fmt:message key='tooltip.resultsOption.sort.order'/>",
	tooltip_resultsOption_summary	:"<fmt:message key='tooltip.resultsOption.summary'/>",
	tooltip_resultsOption_quick_links	:"<fmt:message key='tooltip.resultsOption.quick.links'/>",
	tooltip_resultsOption_spell_correct	:"<fmt:message key='tooltip.resultsOption.spell.correct'/>",
	tooltip_resultsOption_collapse_results	:"<fmt:message key='tooltip.resultsOption.collapse.results'/>",
	tooltip_resultsOption_search_synonyms	:"<fmt:message key='tooltip.resultsOption.search.synonyms'/>",
	tooltip_resultsOption_typeAhead_numberOfResults	: "<fmt:message key='tooltip.resultsOption.typeAhead.numberOfResults'/>",
	tooltip_resultsOption_typeAhead_mode	:"<fmt:message key='tooltip.resultsOption.typeAhead.mode'/>",
	
	// Search options
	label_collection:		"<fmt:message key='text.collection.name'/>",
	label_nofederator:		"<fmt:message key='text.collection.none'/>",
	label_facetcollection:  "<fmt:message key='text.facetcollection.name'/>",
	label_nofacet:			"<fmt:message key='text.facetcollection.none'/>",
	label_scope:			"<fmt:message key='prompt.advanced.scopes'/>",
	label_noscope:			"<fmt:message key='prompt.noScopes'/>",
	label_source:			"<fmt:message key='prompt.advanced.documentSources'/>",
	label_source_all:		"<fmt:message key='prompt.advanced.documentSources.all'/>",
	label_source_specific:	"<fmt:message key='prompt.advanced.documentSources.specific'/>",
	label_file:			"<fmt:message key='prompt.advanced.documentTypes'/>",
	label_file_all:			"<fmt:message key='prompt.advanced.documentTypes.all'/>",
	label_file_specific:	"<fmt:message key='prompt.advanced.documentTypes.specific'/>",
	label_lang:				"<fmt:message key='prompt.advanced.resultLanguages'/>",
	label_lang_all:			"<fmt:message key='prompt.advanced.resultLanguages.all'/>",
	label_lang_specific:	"<fmt:message key='prompt.advanced.resultLanguages.specific'/>",
	search_options_intro:						"<fmt:message key='prompt.searchOptions.intro'/>",
	search_options_intro_authorized:			"<fmt:message key='prompt.searchOptions.intro.authorized'/>",
	search_options_intro_unauthorized:		"<fmt:message key='prompt.searchOptions.intro.unauthorized'/>",
	label_candidates:			 "<fmt:message key='prompt.selection.all'/>",
	label_applied: 				 "<fmt:message key='alt.checkmark'/>",
	error_nocollection:		"<fmt:message key='errors.noCollections'/>",
	error_nosourcetypes:	"<fmt:message key='errors.noSouceTypes'/>",
	
	// Advanced search options
	label_advoptions_title	:"<fmt:message key='prompt.advanced.options.title'/>",

	preferences_defaultCollections	:	"<fmt:message key='preferences.defaultCollections' />",
	prompt_advanced_siteCollapsing	:	"<fmt:message key='prompt.advanced.siteCollapsing' />",
	prompt_advanced_spellCorrections:	"<fmt:message key='prompt.advanced.spellCorrections' />",
	prompt_advanced_nearDuplicateDetection:	"<fmt:message key='prompt.advanced.nearDuplicateDetection' />",
	prompt_advanced_summaryLength:	"<fmt:message key='prompt.advanced.summaryLength' />",
	prompt_advanced_summaryLength_level1:	"<fmt:message key='prompt.advanced.summaryLength.level1' />",
	prompt_advanced_summaryLength_level2:	"<fmt:message key='prompt.advanced.summaryLength.level2' />",
	prompt_advanced_summaryLength_level3:	"<fmt:message key='prompt.advanced.summaryLength.level3' />",
	prompt_advanced_summaryLength_level4:	"<fmt:message key='prompt.advanced.summaryLength.level4' />",
	prompt_advanced_summaryLength_level5:	"<fmt:message key='prompt.advanced.summaryLength.level5' />",
	titles							:	"<fmt:message key='titles' />",
	titles_clean					:	"<fmt:message key='titles.clean' />",
	titles_truncatePrefix			:	"<fmt:message key='titles.truncatePrefix' />",
	button_clientViewer				:	"<fmt:message key='button.clientViewer' />",
	client_notes_icon				:	"<fmt:message key='client.notes.icon' />",
	client_dominodoc_icon			:	"<fmt:message key='client.dominodoc.icon' />",
	date_fields						:	"<fmt:message key='date.fields' />",
	filterBy_fileType_name			:	"<fmt:message key='filterBy.fileType.name' />",
	filterBy_fileType_extensions	:	"<fmt:message key='filterBy.fileType.extensions' />",
	filterBy_custom_name			:	"<fmt:message key='filterBy.custom.name' />",
	filterBy_custom_value			:	"<fmt:message key='filterBy.custom.value' />",

	//for ScreenSetting
	fieldName						:	"<fmt:message key='fieldName' />",
	fieldImage						:	"<fmt:message key='fieldImage' />",
	fieldImageToShow				:	"<fmt:message key='fieldImageToShow' />",	
	field_icon_from						:	"<fmt:message key='field.icon.from' />",
	
	//for TopResultCharts
	field_defaultIcon				:	"<fmt:message key='field.defaultIcon' />",
	customChart				:	"<fmt:message key='customChart' />",
	enableChart				:	"<fmt:message key='enableChart' />",
	chartTitle				:	"<fmt:message key='chartTitle' />",
	enableDynamicFields				:	"<fmt:message key='enableDynamicFields' />",
	metaDataField			:	"<fmt:message key='metaDataField' />",
	fieldValueSeparator			:	"<fmt:message key='fieldValueSeparator' />",
	maxCollapsedValues			:	"<fmt:message key='maxCollapsedValues' />",
	maxExpandedValues			:	"<fmt:message key='maxExpandedValues' />",
	chartWidth			:	"<fmt:message key='chartWidth' />",
	barHeight			:	"<fmt:message key='barHeight' />",
	barColor			:	"<fmt:message key='barColor' />",
	barGradient			:	"<fmt:message key='barGradient' />",
	sortByKey			:	"<fmt:message key='sortByKey' />",
	prompt_sortBy_sortByOrder			:	"<fmt:message key='prompt.sortBy.sortByOrder' />",
	prompt_selection_none		:	"<fmt:message key='prompt.selection.none' />",	
	dynaClassName			:	"<fmt:message key='dynaClassName' />",

	topResult_resultSize	:	"<fmt:message key='topResult.resultSize' />",
	topResultsCharts_open	:	"<fmt:message key='topResultsCharts.open' />",
	topResultsCharts_enable	:	"<fmt:message key='topResultsCharts.enable' />",
	topResultsCharts_titleKey	:	"<fmt:message key='topResultsCharts.titleKey' />",
	topResultsCharts_canUserChangeFieldName	:	"<fmt:message key='topResultsCharts.canUserChangeFieldName' />",
	topResultsCharts_fieldName	:	"<fmt:message key='topResultsCharts.fieldName' />",
	topResultsCharts_fieldValueSeparator	:	"<fmt:message key='topResultsCharts.fieldValueSeparator' />",
	topResultsCharts_maxValues_collapsed	:	"<fmt:message key='topResultsCharts.maxValues.collapsed' />",
	topResultsCharts_maxValues_expanded	:	"<fmt:message key='topResultsCharts.maxValues.expanded' />",
	topResultsCharts_width	:	"<fmt:message key='topResultsCharts.width' />",
	topResultsCharts_barheight	:	"<fmt:message key='topResultsCharts.barheight' />",
	topResultsCharts_color	:	"<fmt:message key='topResultsCharts.color' />",
	topResultsCharts_color_gradient	:	"<fmt:message key='topResultsCharts.color.gradient' />",
	topResultsCharts_sortKey	:	"<fmt:message key='topResultsCharts.sortKey' />",
	topResultsCharts_sortOrder	:	"<fmt:message key='topResultsCharts.sortOrder' />",
	topResultsCharts_dynamicChartClass	:	"<fmt:message key='topResultsCharts.dynamicChartClass' />",
	topResultsCharts_createNewChart	:	"<fmt:message key='createNewChart' />",

	facetCharts_createNewChart	:	"<fmt:message key='facetCharts.createNewChart' />",
	facetCharts_enable	:	"<fmt:message key='facetCharts.enable' />",
	facetCharts_maxValues_all	:	"<fmt:message key='facetCharts.maxValues.all' />",
	facetCharts_facetName	:	"<fmt:message key='facetCharts.facetName' />",
	facetCharts_canUserChangeFacetName	:	"<fmt:message key='facetCharts.canUserChangeFacetName' />",
	facetCharts_titleKey	:	"<fmt:message key='facetCharts.titleKey' />",
	facetCharts_open	:	"<fmt:message key='facetCharts.open' />",

	facetTree_enable	:	"<fmt:message key='facetTree.enable' />",
	facetTree_titleKey	:	"<fmt:message key='facetTree.titleKey' />",
	facetTree_maxValues_default	:	"<fmt:message key='facetTree.maxValues.default' />",
	facetTree_maxValues_all	:	"<fmt:message key='facetTree.maxValues.all' />",
	facetTree_open	:	"<fmt:message key='facetTree.open' />",

	documentLabelTree_enable	:	"<fmt:message key='documentLabelTree.enable' />",
	documentLabelTree_titleKey	:	"<fmt:message key='documentLabelTree.titleKey' />",
	documentLabelTree_maxValues_default	:	"<fmt:message key='documentLabelTree.maxValues.default' />",
	documentLabelTree_maxValues_all	:	"<fmt:message key='documentLabelTree.maxValues.all' />",
	documentLabelTree_open	:	"<fmt:message key='documentLabelTree.open' />",
	
	documentType_html								: "<fmt:message key='documentType.html' />",
	documentType_doc								: "<fmt:message key='documentType.doc' />",
	documentType_ppt								: "<fmt:message key='documentType.ppt' />",
	documentType_xls								: "<fmt:message key='documentType.xls' />",
	documentType_xml								: "<fmt:message key='documentType.xml' />",
	documentType_txt								: "<fmt:message key='documentType.txt' />",
	documentType_pdf								: "<fmt:message key='documentType.pdf' />",

	documentType_html_show								: "<fmt:message key='documentType.html.show' />",
	documentType_doc_show								: "<fmt:message key='documentType.doc.show' />",
	documentType_ppt_show								: "<fmt:message key='documentType.ppt.show' />",
	documentType_xls_show								: "<fmt:message key='documentType.xls.show' />",
	documentType_xml_show								: "<fmt:message key='documentType.xml.show' />",
	documentType_txt_show								: "<fmt:message key='documentType.txt.show' />",
	documentType_pdf_show								: "<fmt:message key='documentType.pdf.show' />",

	documentSourceName				: "<fmt:message key='documentSourceName' />",
	documentSourceImage				: "<fmt:message key='documentSourceImage' />",
	documentSourceImage_label		: "<fmt:message key='documentSourceImage.label' />",

	fieldProtocol					: "<fmt:message key='fieldProtocol' />",
	fieldShow					: "<fmt:message key='fieldShow' />",
	fields					: "<fmt:message key='fields' />",
	fieldImageToShow		: "<fmt:message key='fieldImageToShow' />",

	button_addRow			: "<fmt:message key='button.addRow' />",

	hiddenLabel_dyc_facetselection	: "<fmt:message key='accessibility.hiddenLabel.dyc.facetselection' />",
	hiddenLabel_dyc_fieldselection	: "<fmt:message key='accessibility.hiddenLabel.dyc.fieldselection' />",
	hiddenLabel_searchQuery	: "<fmt:message key='accessibility.hiddenLabel.searchquery' />",

	// result toolbar
	toolbars_document_type_all : "<fmt:message key='toolbars.document.type.all' />",
	toolbars_document_type_show : "<fmt:message key='toolbars.document.type.show' />",
	resulttoolbar_label_exploredOn : "<fmt:message key='resulttoolbar.label.exploredOn' />",
	
	// result bottom bar
	resultbottombar_label_searchedFor : "<fmt:message key='resultbottombar.label.searchedFor' />",
	
	// text analytics
	
	analytics_common_listTarget : "<fmt:message key='analytics.common.listTarget' />",
	analytics_common_listTarget_subcategory : "<fmt:message key='analytics.common.listTarget.subcategory' />",
	analytics_common_listTarget_keyword : "<fmt:message key='analytics.common.listTarget.keyword' />",
	
	analytics_preview_nameLabel : "<fmt:message key='analytics.preview.nameLabel' />",
	analytics_preview_valueLabel : "<fmt:message key='analytics.preview.valueLabel' />",
	analytics_preview_standardInfoLabel : "<fmt:message key='analytics.preview.standardInfoLabel' />",
	analytics_preview_keywordInfoLabel : "<fmt:message key='analytics.preview.keywordInfoLabel' />",
	tooltip_analytics_preview: "<fmt:message key='tooltip.analytics.preview' />",
	tooltip_search_preview: "<fmt:message key='tooltip.search.preview' />",
	
	preview_prompt_documentNotAvailable : "<fmt:message key='preview.prompt.documentNotAvailable' />",
	preview_label_value : "<fmt:message key='preview.label.value' />",
	preview_label_beginOffset	: "<fmt:message key='preview.label.beginOffset' />",
	preview_label_endOffset : "<fmt:message key='preview.label.endOffset' />",
	preview_document_title : "<fmt:message key='preview.document.title' />",
	preview_document_date : "<fmt:message key='preview.document.date' />",
	analytics_categorytree_nopath	: "<fmt:message key='analytics.view.categorytree.nopath' />",
	analytics_categorytree_nokeyword		: "<fmt:message key='analytics.view.categorytree.nokeyword' />",
	analytics_categorytree_sort_tooltip	: "<fmt:message key='analytics.categorytree.sort.tooltip' />",
	analytics_categorytree_sort_none		: "<fmt:message key='analytics.categorytree.sort.none' />",
	analytics_categorytree_sort_ascending	: "<fmt:message key='analytics.categorytree.sort.ascending' />",
	analytics_categorytree_sort_descending	: "<fmt:message key='analytics.categorytree.sort.descending' />",
	analytics_categorytree_filter_tooltip	: "<fmt:message key='analytics.categorytree.filter.tooltip' />",
	analytics_categorytree_clear_tooltip	: "<fmt:message key='analytics.categorytree.clear.tooltip' />",
	analytics_categorytree_searchtype_tooltip	: "<fmt:message key='analytics.categorytree.searchtype.tooltip' />",
	analytics_categorytree_facetpath_tooltip	: "<fmt:message key='analytics.categorytree.facetpath.tooltip' />",
	analytics_categorytree_keyword_tooltip		: "<fmt:message key='analytics.categorytree.keyword.tooltip' />",

	querytree_label_docs					: "<fmt:message key='querytree.label.docs' />",
	querytree_label_doc					: "<fmt:message key='querytree.label.doc' />",
	
	// facet items
	facetItems_label_filter	: "<fmt:message key='facetItems.label.filter' />",
	facetItems_label_sortBy	: "<fmt:message key='facetItems.label.sortBy' />",
	facetItems_label_count	: "<fmt:message key='facetItems.label.count' />",
	facetItems_label_show	: "<fmt:message key='facetItems.label.show' />",
	facetItems_label_all	: "<fmt:message key='facetItems.label.all' />",
	facetItems_label_include	: "<fmt:message key='facetItems.label.include' />",

	//myProfile
	myProfile_column1	: "<fmt:message key='myProfile.column1' />",
	myProfile_column2	: "<fmt:message key='myProfile.column2' />",
	myProfile_column3	: "<fmt:message key='myProfile.column3' />",
	myProfile_column4	: "<fmt:message key='myProfile.column4' />",
	
	queryHelp			: "<fmt:message key='queryHelp' />",
	tabs_savedSearch	: "<fmt:message key='tabs.savedSearch' />",
	dialog_saveSearch	: "<fmt:message key='dialog.saveSearch' />",

	//analytics options
	preferences_analytics_facets_numberOfResults	: "<fmt:message key='preferences.analytics.facets.numberOfResults' />",
	preferences_analytics_facets_defaultSortBy	: "<fmt:message key='preferences.analytics.facets.defaultSortBy' />",
	preferences_analytics_facets_defaultShowTarget	: "<fmt:message key='preferences.analytics.facets.defaultShowTarget' />",
	preferences_analytics_timeseries_defaultTimeScale	: "<fmt:message key='preferences.analytics.timeseries.defaultTimeScale' />",

	preferences_analytics_deviations_numberOfResults	: "<fmt:message key='preferences.analytics.deviations.numberOfResults' />",
	preferences_analytics_deviations_numberOfCharts	: "<fmt:message key='preferences.analytics.deviations.numberOfCharts' />",
	preferences_analytics_deviations_showLineInChart	: "<fmt:message key='preferences.analytics.deviations.showLineInChart' />",
	preferences_analytics_deviations_defaultSortBy	: "<fmt:message key='preferences.analytics.deviations.defaultSortBy' />",
	preferences_analytics_deviations_defaultShowTarget	: "<fmt:message key='preferences.analytics.deviations.defaultShowTarget' />",
	preferences_analytics_deviations_defaultTimeScale	: "<fmt:message key='preferences.analytics.deviations.defaultTimeScale' />",
	preferences_analytics_deviations_barColorOfMultiChart	: "<fmt:message key='preferences.analytics.deviations.barColorOfMultiChart' />",

	preferences_analytics_trends_numberOfResults	: "<fmt:message key='preferences.analytics.trends.numberOfResults' />",
	preferences_analytics_trends_numberOfCharts	: "<fmt:message key='preferences.analytics.trends.numberOfCharts' />",
	preferences_analytics_trends_showLineInChart	: "<fmt:message key='preferences.analytics.trends.showLineInChart' />",
	preferences_analytics_trends_defaultSortBy	: "<fmt:message key='preferences.analytics.trends.defaultSortBy' />",
	preferences_analytics_trends_defaultShowTarget	: "<fmt:message key='preferences.analytics.trends.defaultShowTarget' />",
	preferences_analytics_trends_defaultTimeScale	: "<fmt:message key='preferences.analytics.trends.defaultTimeScale' />",
	preferences_analytics_trends_barColorOfMultiChart	: "<fmt:message key='preferences.analytics.trends.barColorOfMultiChart' />",
	preferences_analytics_facetPairs_numberOfRowResults	: "<fmt:message key='preferences.analytics.facetPairs.numberOfRowResults' />",
	preferences_analytics_facetPairs_numberOfRowsInTable	: "<fmt:message key='preferences.analytics.facetPairs.numberOfRowsInTable' />",
	preferences_analytics_facetPairs_numberOfColumnResults	: "<fmt:message key='preferences.analytics.facetPairs.numberOfColumnResults' />",
	preferences_analytics_facetPairs_numberOfColumnsInTable	: "<fmt:message key='preferences.analytics.facetPairs.numberOfColumnsInTable' />",
	preferences_analytics_facetPairs_defaultRowShowTarget	: "<fmt:message key='preferences.analytics.facetPairs.defaultRowShowTarget' />",
	preferences_analytics_facetPairs_defaultColumnShowTarget	: "<fmt:message key='preferences.analytics.facetPairs.defaultColumnShowTarget' />",
	preferences_analytics_facetPairs_defaultListSortBy	: "<fmt:message key='preferences.analytics.facetPairs.defaultListSortBy' />",
	preferences_analytics_facetPairs_defaultRowSortBy	: "<fmt:message key='preferences.analytics.facetPairs.defaultRowSortBy' />",
	preferences_analytics_facetPairs_defaultColumnSortBy	: "<fmt:message key='preferences.analytics.facetPairs.defaultColumnSortBy' />",
	preferences_analytics_facetPairs_defaultView	: "<fmt:message key='preferences.analytics.facetPairs.defaultView' />",
	preferences_analytics_facetPairs_defaultView_flat	: "<fmt:message key='preferences.analytics.facetPairs.defaultView.flat' />",
	preferences_analytics_facetPairs_defaultView_grid	: "<fmt:message key='preferences.analytics.facetPairs.defaultView.grid' />",
	preferences_analytics_facetPairs_defaultView_table	: "<fmt:message key='preferences.analytics.facetPairs.defaultView.table' />",

	preferences_analytics_sortByFrequency	: "<fmt:message key='preferences.analytics.sortByFrequency' />",
	preferences_analytics_sortByCorrelation	: "<fmt:message key='preferences.analytics.sortByCorrelation' />",
	preferences_analytics_sortByAlphabetical	: "<fmt:message key='preferences.analytics.sortByAlphabetical' />",
	preferences_analytics_timeScale_year	: "<fmt:message key='preferences.analytics.timeScale.year' />",
	preferences_analytics_timeScale_month	: "<fmt:message key='preferences.analytics.timeScale.month' />",
	preferences_analytics_timeScale_day	: "<fmt:message key='preferences.analytics.timeScale.day' />",
	preferences_analytics_barColorOfMultiChart_label_legend	: "<fmt:message key='preferences.analytics.barColorOfMultiChart.label.legend' />",
	preferences_analytics_barColorOfMultiChart_label_index	: "<fmt:message key='preferences.analytics.barColorOfMultiChart.label.index' />",

	preferences_analytics_label_yes	: "<fmt:message key='preferences.analytics.label.yes' />",
	preferences_analytics_label_no	: "<fmt:message key='preferences.analytics.label.no' />",

	// timescale facet labels
	
	$_year							: "<fmt:message key='$.year' />",
	$_month							: "<fmt:message key='$.month' />",
	$_day							: "<fmt:message key='$.day' />",
	$_month_of_year					: "<fmt:message key='$.month_of_year' />",
	$_day_of_month					: "<fmt:message key='$.day_of_month' />",
	$_day_of_week					: "<fmt:message key='$.day_of_week' />",
	
	common_analytics_timescale	:	"<%= ResourceBundleManager.getMessage("common.label.timescale", request.getLocale()) %>",
	common_analytics_sort	:	"<%= ResourceBundleManager.getMessage("common.label.sort", request.getLocale()) %>",
	common_analytics_show	:	"<%= ResourceBundleManager.getMessage("common.label.show", request.getLocale()) %>",
	common_analytics_keyword	: "<%= ResourceBundleManager.getMessage("common.item.keywords", request.getLocale()) %>",
	common_analytics_subfacets	: "<%= ResourceBundleManager.getMessage("common.item.subfacets", request.getLocale()) %>",
	common_analytics_sort_freq	: "<%= ResourceBundleManager.getMessage("sort.frequency", request.getLocale()) %>",
	common_analytics_sort_index	: "<%= ResourceBundleManager.getMessage("sort.maxindex", request.getLocale()) %>",
	common_analytics_sort_latest_index: "<%= ResourceBundleManager.getMessage("sort.latestindex", request.getLocale()) %>",
	common_analytics_sort_ascending	: "<%= ResourceBundleManager.getMessage("sort.name.ascending", request.getLocale()) %>",
	common_analytics_sort_descending	: "<%= ResourceBundleManager.getMessage("sort.name.descending", request.getLocale()) %>",

	twodmap_label_rowsTarget : "<%= ResourceBundleManager.getMessage("2dmap.label.rowsTarget", request.getLocale()) %>",
	twodmap_label_columnsTarget : "<%= ResourceBundleManager.getMessage("2dmap.label.columnsTarget", request.getLocale()) %>",

	resulttoolbar_label_resultsPerPage: "<fmt:message key='resulttoolbar.label.resultsPerPage' />",
	resulttoolbar_button_label_reset: "<fmt:message key='resulttoolbar.button.label.reset' />",
	resulttoolbar_button_tooltip_reset: "<fmt:message key='resulttoolbar.button.tooltip.reset' />",

	order_2: "<fmt:message key='order.2' />",
	order_3: "<fmt:message key='order.3' />",
		
	///////////////////////////////////////////////////////////////////////////////////////////////////////////
	__dummy__					: ''
}


</script>
