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
<%
response.setContentType("application/x-javascript");
response.setCharacterEncoding("UTF-8");
%>
EDR.Constants = {
	APPLICATION_CONTEXT: EDR.contextPath
}

EDR.dialog.Constants = {
	
	PROGRESS_DIALOG_DOM_ID: EDR.prefix+"progress-dialog",
	
	ERROR_DIALOG_DOM_ID: EDR.prefix+"error-dialog",
	
	COMMON_DIALOG_DOM_ID: EDR.prefix+"common-dialog"
}
 
EDR.search.Constants = {

	DEFAULT_START_PAGE: 1,
	
	DEFAULT_RESULTS_PER_PAGE: 25,
	
	SEARCH_FORM_ID: "searchForm",
	
	SEARCH_INITIAL_URL: EDR.Constants.APPLICATION_CONTEXT + "/search?action=index",
	
	SEARCH_URL: EDR.Constants.APPLICATION_CONTEXT + "/search?action=search",
	
	SAVE_SEARCH_URL: EDR.Constants.APPLICATION_CONTEXT + "/search?action=saveQuery",
	
	DELETE_SEARCH_URL: EDR.Constants.APPLICATION_CONTEXT + "/search?action=deleteQuery",
	
	IMPORT_SEARCH_URL: EDR.Constants.APPLICATION_CONTEXT + "/search?action=importQueries",
	
	LOAD_SAVED_SEARCHES_URL: EDR.Constants.APPLICATION_CONTEXT + "/search?action=loadSavedSearches",
	
	SORT_URL: EDR.Constants.APPLICATION_CONTEXT + "/search?action=sort",
			
	GROUP_URL: EDR.Constants.APPLICATION_CONTEXT + "/search?action=group",
	
	SEARCH_GROUP_URL: EDR.Constants.APPLICATION_CONTEXT + "/search?action=getGroupResults",
	
	PAGE_URL: EDR.Constants.APPLICATION_CONTEXT + "/search?action=page",
	
	SEARCH_NEW_DATE_RANGE: EDR.Constants.APPLICATION_CONTEXT + "/search?action=updateDateRange",
	
	EMAIL_RESULTS_ELEMENT_ID: "results-container",
	
	SEARCH_FORM_KEYWORDS_ID: "keywords",
	
	SEARCH_FORM_FROM_ID: "from",
	
	SEARCH_FORM_TOCCBCC_ID: "toccbcc",
	
	SEARCH_FORM_SUBJECT_ID: "subject",
	
	SEARCH_FORM_FROM_DATE_ID: "from-date",
	
	SEARCH_FORM_TO_DATE_ID: "to-date",
	
	SEARCH_PAGE: "page",
	
	SEARCH_SORT_FIELD: "sort-by",
	
	SEARCH_GROUP_FIELD: "group-by",
	
	SEARCH_GROUP_VALUE: "group-by-value",
	
	SEARCH_GROUP_REP_DOC_ID: "group-rep-docId",
	
	SEARCH_GROUP_REP_ROW_ID: "group-rep-rowId",
	
	SEARCH_GROUP_NUM_RESULTS: "group-num-results",
	
	SEARCH_GROUP_COUNTER: "group-counter",
	
	SEARCH_GROUP_SELECTALL: "selectAll",
	
	TIMELINE_ELEMENT_ID: "timeline",
	
	TIMELINE_TITLE_ELEMENT_ID: "timelineTitle",
	
	VISUALIZATION_CONTAINER_ELEMENT_ID: "visualization-container",
		
	SEARCH_RESULTS_PER_PAGE: "resultsPerPage",
	
	SEARCH_RESULTS_REFRESH: "resultsRefresh",
	
	CRITERIA_CONTAINER_ELEMENT_ID: "criteria-container",
	
	SEARCH_FORM_DATE_ERROR_ID: "date-error-div",
	
	SEARCH_FORM_KEYWORD_ERROR_ID: "keyword-error-div",
	
	SEARCH_FORM_SUBJECT_ERROR_ID: "subject-error-div",
	
	SEARCH_FORM_SENDER_ERROR_ID: "sender-error-div",
	
	SEARCH_FORM_RECIPIENT_ERROR_ID: "recipient-error-div",
	
	SEARCH_TOOLBAR_ID: "toolbar-container",
	
	SEARCH_SAVE_FORM_ID: "saveSearchForm",
	
	SEARCH_SAVE_FORM_NAME_ID: "saveSearchName",
	
	SEARCH_SAVE_FORM_ERROR_ID: "save-search-error-div"
}

EDR.email.Constants = {
	
	PREVIEW_URL: EDR.Constants.APPLICATION_CONTEXT + "/document.do?action=preview",
	
	EMAIL_PREVIEW_DOM_ID: "email-preview",
	
	EMAIL_ID: "emailId"
}

EDR.attachment.Constants = {
	DOWNLOAD_URL: EDR.Constants.APPLICATION_CONTEXT + "/attachment.do?action=download"	
}

EDR.admin.Constants = {

	CASE_ID: "caseId",
	
	FLAG_NAME: "flagName",
	
	FLAG_DESC: "flagDesc"
	
}
