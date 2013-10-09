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

		<a class="forSkipNavigation" href="#searchresult" title="<fmt:message key="accessibility.navigation.skip.search"/>">
			<fmt:message key="accessibility.navigation.skip.search"/>
		</a>
		<a class="forSkipNavigation" href="#searchform" title="<fmt:message key="accessibility.navigation.skip.searchform"/>">
			<fmt:message key="accessibility.navigation.skip.searchform"/>
		</a>
		<!--a class="forSkipNavigation" href="#toolbar" title="<fmt:message key="accessibility.navigation.skip.toolbar"/>">
			<fmt:message key="accessibility.navigation.skip.toolbar"/>
		</a>
		<a class="forSkipNavigation" href="#savedsearch" title="<fmt:message key="accessibility.navigation.skip.savedsearch"/>">
			<fmt:message key="accessibility.navigation.skip.savedsearch"/>
		</a>
		<a class="forSkipNavigation" href="#advancedsearch" title="<fmt:message key="accessibility.navigation.skip.advancedsearch"/>">
			<fmt:message key="accessibility.navigation.skip.advancedsearch"/>
		</a-->
		
<% if(ConfigManager.isTextAnalyticsEnabled()) { %>		
		<a class="forSkipNavigation" href="#facettree" title="<fmt:message key="accessibility.navigation.skip.facettree"/>">
			<fmt:message key="accessibility.navigation.skip.facettree"/>
		</a>
		<!-- a class="forSkipNavigation" href="#timeseries" title="<fmt:message key="accessibility.navigation.skip.timeseries"/>">
			<fmt:message key="accessibility.navigation.skip.timeseries"/>
		</a>
		<a class="forSkipNavigation" href="#facetview" title="<fmt:message key="accessibility.navigation.skip.facetview"/>">
			<fmt:message key="accessibility.navigation.skip.facetview"/>
		</a>
		<a class="forSkipNavigation" href="#deviations" title="<fmt:message key="accessibility.navigation.skip.deviations"/>">
			<fmt:message key="accessibility.navigation.skip.deviations"/>
		</a>
		<a class="forSkipNavigation" href="#trends" title="<fmt:message key="accessibility.navigation.skip.trends"/>">
			<fmt:message key="accessibility.navigation.skip.trends"/>
		</a>
		<a class="forSkipNavigation" href="#facetpairs" title="<fmt:message key="accessibility.navigation.skip.facetpairs"/>">
			<fmt:message key="accessibility.navigation.skip.facetpairs"/>
		</a>
		<a class="forSkipNavigation" href="#querytree" title="<fmt:message key="accessibility.navigation.skip.querytree"/>">
			<fmt:message key="accessibility.navigation.skip.querytree"/>
		</a-->
<% } %>

  
