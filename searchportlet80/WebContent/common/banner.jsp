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
 
<%-- 
	Banner w/links; only used for authenticated requests.
--%>
<%@page import="com.ibm.es.oze.searchui.common.ResourceBundleManager"%>
<%
	boolean isLoggedIn = true;
	String loginId = request.getRemoteUser();
	if(loginId == null){
		loginId = ResourceBundleManager.getResourceBundle(request.getLocale()).getString("banner.notLoggedIn");
		//loginId = "anonymous user"
		isLoggedIn = false;
	};
	Properties properties = ConfigManager.getConfigProperties(request);
	boolean isPreferenceVisible = true;
	if(properties.getProperty("link.preferences.show") != null && properties.getProperty("link.preferences.show").equalsIgnoreCase("false")) {
	   isPreferenceVisible = false;
	}
	
	boolean isMyProfileVisible = true;
	if(properties.getProperty("link.myProfile.show") != null && properties.getProperty("link.myProfile.show").equalsIgnoreCase("false")) {
	   isMyProfileVisible = false;
	}
	
	boolean isHelpVisible = true;
	if(properties.getProperty("link.help.show") != null && properties.getProperty("link.help.show").equalsIgnoreCase("false")) {
	   isHelpVisible = false;
	}
	
	boolean isAboutVisible = true;
	if(properties.getProperty("link.about.show") != null && properties.getProperty("link.about.show").equalsIgnoreCase("false")) {
	   isAboutVisible = false;
	}
	
	boolean isLogOffVisible = true;
	if(properties.getProperty("link.logOff.show") != null && properties.getProperty("link.logOff.show").equalsIgnoreCase("false")) {
	   isLogOffVisible = false;
	}
	
	String productName = properties.getProperty("displayedApplicationName");
	if(productName == null) {
		productName = ResourceBundleManager.getResourceBundle(request.getLocale()).getString("product.name");	
//	   productName = "OmniFind Enterprise Edition";
	}

	StringBuffer sb1 = new StringBuffer("");
	StringBuffer sb2 = new StringBuffer("");
	//ESCollection[] array = (ESCollection[])SessionUtil.getSessionAttribute(request, "collections");
	SearchOptionsBean options = (SearchOptionsBean)SessionUtil.getSessionAttribute(request, "defaultSearchOptions");
	ESCollection[] array = null;
	if(options != null) {
	   array = options.getIsFascetedSearch() ? options._getFacetedCollections() : options._getCollections();   
	}
	if(array != null) {
		for (int i=0; i<array.length; i++) {
			if (array[i].isSelected()) {
			   if (sb1.length() != 0) sb1.append(",");
			   sb1.append(array[i].getLabel());
			   if (sb2.length() != 0) sb2.append(",");
			   sb2.append(array[i].getID());
			}
		}
	}
	boolean isFacetedSearch = "true".equals(SessionUtil.getSessionAttribute(request,"isFacetedSearch")) ? true : false;
	String collections = sb1.toString();
	String collectionsIds = sb2.toString();
%>

<%@page import="com.ibm.es.oze.searchui.common.ConfigManager"%>
<%@page import="com.ibm.es.oze.searchui.query.ESCollection"%><div id="<%=applicationPrefix%>bannerId" <es:dojoType />="widgets.Banner"
	loginId="<%=loginId %>"
	productName="<%=productName%>"	
	loginIdLabel="<fmt:message key='banner.loginLabel' />"	
	collections="<%=collections%>"
	collectionIds="<%=collectionsIds%>"
	isFacetedSearch="<%=isFacetedSearch%>"
	isLoggedIn="<%=isLoggedIn%>"
>	
	&nbsp;|&nbsp;
	<a id="<%=applicationPrefix%>link_preferences" href="javascript:;" <%if(!isPreferenceVisible) { %>class="dijitHidden"<% } %> title="<fmt:message key='tooltip.link.preferences'/>" onclick="EDR.dialog.util.showById('<%=applicationPrefix%>preference'); return false;"><fmt:message key="link.preferences"/></a>
	<span id="<%=applicationPrefix%>separator_preferences" <%if(!isPreferenceVisible) { %>class="dijitHidden"<% } %>>&nbsp;|&nbsp;</span>
	<a id="<%=applicationPrefix%>link_myProfile" href="javascript:;" <%if(!isMyProfileVisible) { %>class="dijitHidden"<% } %> title="<fmt:message key='tooltip.link.myProfile'/>" onclick="EDR.dialog.util.showById('<%=applicationPrefix%>myProfileDlg'); return false;"><fmt:message key="link.myProfile"/></a>
	<span id="<%=applicationPrefix%>separator_myProfile" class="separator_myProfile <%if(!isMyProfileVisible) { %>dijitHidden<% } %>">&nbsp;|&nbsp;</span>
	<a id="<%=applicationPrefix%>link_help" href="javascript:;" onclick="EDR.viewHelp('iiysuenhanced.htm?noframes=true')" class="link_help <%if(!isHelpVisible) { %>dijitHidden<% } %>" title="<fmt:message key='tooltip.link.help'/>"><fmt:message key="link.help"/></a>
	<span id="<%=applicationPrefix%>separator_help" class="separator_help <%if(!isHelpVisible) { %>dijitHidden<% } %>">&nbsp;|&nbsp;</span>
	<a id="<%=applicationPrefix%>link_about" href="javascript:;" class="link_about <%if(!isAboutVisible) { %>dijitHidden<% } %>" title="<fmt:message key='link.about'/>" onclick="EDR.dialog.util.showById('<%=applicationPrefix%>about-dialog'); return false;"><fmt:message key="link.about"/></a>
	<span id="<%=applicationPrefix%>separator_about" class="separator_about <%if(!isAboutVisible || !isLogOffVisible || !isLoggedIn ) { %>dijitHidden<% } %>">&nbsp;|&nbsp;</span>
	<a id="<%=applicationPrefix%>link_logOff" href="javascript:;" class="link_logOff <%if(!isLogOffVisible || !isLoggedIn) { %>dijitHidden<% } %>" title="Log Out" onclick="window.location='logout.jsp'">Log Out</a>	
</div>

