<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html401/strict.dtd">
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
<%
    Properties properties = ConfigManager.getConfigProperties(request);
	String minHeight = "800px";
	boolean isStretchHeight = false;
    if(properties != null) {
    	minHeight = (String) properties.get("style.minHeight");
    	isStretchHeight = "true".equalsIgnoreCase((String) properties.get("style.stretchHeight"));
    }
%>
<html lang="<%= request.getLocale().getLanguage() %>">
	
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=8" />
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<meta http-equiv="Cache-Control" content="no-cache" />
		<meta http-equiv="Pragma" content="no-cache">
		<meta http-equiv="Expires" content="-1">
		
		<style>
			body {
				min-height: <%=minHeight%>;
				min-width: 1000px;	
				margin: 0 auto;
				position: relative;
				background-repeat: repeat-x;
				background-image: url('images/edisc_bg.png');
				background-color: #FFF;
				overflow: auto;
				<% if(isStretchHeight) { %>position: relative; <% } %>
			}
			
			html {
				margin: 0;
				background-color: gray;
				overflow-x: auto;
				overflow-y: hidden;
			}
			
			/* to avoid dojo.css overide font-size for IE7 */
			html, body {
				height: 100%;
				width: 100%;
				padding: 0;
				font-family: Tahoma;
				font-size: 12px;
				*font-size: 100%;
			}
			
			<% if(isStretchHeight) { %>
			div#overallContainer {
				height: 100%;
				position: relative;
				overflow-y: auto;
			}
			<% } %>
			
		</style>
		
		<title><% if(ConfigManager.isTextAnalyticsEnabled()) { %><fmt:message key="text.title.analytics"/><% } else { %><fmt:message key="text.title"/><% } %></title>	
	</head>
	
	<body class="tundra edr" dir="<%=SessionUtil.getSessionAttribute(request,"bodyDir")%>">		
		<c:if test="${properties != null}">
			<jsp:include page="/layouts/contents.jsp"/>
		</c:if>
	</body>	
</html>
