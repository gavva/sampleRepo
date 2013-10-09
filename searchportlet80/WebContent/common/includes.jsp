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

<%-- Common page imports --%>
<%@ page import="org.apache.struts.*" %>
<%@ page import="java.util.*" %>
<%@ page import="com.ibm.es.oze.searchui.query.*" %>
<%@ page import="com.ibm.es.oze.searchui.common.ConfigManager"%>
<%@ page import="com.ibm.es.oze.searchui.portal.PortalUtil" %>
<%@ page import="com.ibm.es.oze.searchui.util.SessionUtil" %>
<%@ page import="com.ibm.es.oze.searchui.util.HtmlUtil" %>
<%-- TODO: need this? <%@ page import="com.ibm.es.nuvo.GlobalSystem" %> --%>


<%-- Taglib definitions --%>
<%@ taglib uri="/WEB-INF/tld/enterpriseSearch.tld" prefix="es" %>
<%@ taglib uri="/WEB-INF/tld/struts-html.tld" prefix="html" %>
<%@ taglib uri="/WEB-INF/tld/struts-logic.tld" prefix="logic" %>
<%@ taglib uri="/WEB-INF/tld/struts-bean.tld" prefix="bean" %>    
<%@ taglib uri="/WEB-INF/tld/struts-tiles.tld" prefix="tiles" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>

<%@ page import="com.ibm.es.nuvo.Copyright" %>

<%-- Copyright variable --%>
<% 
	String copyright = Copyright.CopyrightText; 
	// Create a single variable to point to the location of the help documentation
	String helpSite = "http://publib.boulder.ibm.com/infocenter/email/v1r0m0/topic/com.ibm.eda.doc/";
	String applicationPrefix = "";
	if(PortalUtil.isPortletApplication()) {
	   applicationPrefix = "oee_";
	}
%>