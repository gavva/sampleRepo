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

<%--@ page import="com.ibm.es.nuvo.ediscovery.ui.common.Constants" --%>
<%--@ page import="com.ibm.es.nuvo.ediscovery.ui.common.StandardException"--%>
<%@ page import="java.io.PrintWriter" %>

<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<%@ include file="/common/includes.jsp" %>
 


	<%-- 
		All exceptions are in the request under: 'javax.servlet.jsp.jspException'.
		
		The reason for this is so that we can use the same error page for application errors 
		and JSP errors.
		
		Application errors are errors that occur within the application (Struts action classes,
		Struts beans, etc.).  These types of errors are handled by the UI framework and an
		exception is added to the request under the key mentioned above.  If the request is an 
		Ajax request, a JSON string representing the error is returned as the Ajax response, thus
		this error page is not used.  Instead we parse the JSON string and insert properties from the
		JSON string (messsage, details, etc.) directly into the error dialog itself (dialogs\error.jsp).
		
		JSP errors are unexpected errors that occurred during JSP rendering.  These errors typically
		don't happen but anything is possible.  To handle these exception the JSP page where the 
		exception may occur must have the errorPage attribute set, for example:
		
		<%@ page errorPage="/ajaxError.do" %>
		
		The example above would be used by a JSP page (snippet really) that is the response of an
		Ajax request.	
	--%>
	<logic:present name="javax.servlet.jsp.jspException">

		<div id="<%=applicationPrefix%>error-info-container">
			
			<%-- Error Message --%>
			<div class="error-dialog-label-heading"><fmt:message key="K0013I.ERROR.MESSAGE"/></div>	
			<div id="<%=applicationPrefix%>error-message">			
				<bean:write name="javax.servlet.jsp.jspException" property="message" />
			</div>
			
			<br/>
			
			<%-- Error Details --%>
			<div class="error-dialog-label-heading"><fmt:message key="K0013I.ERROR.DETAILS"/></div>
			<div id="<%=applicationPrefix%>error-details" class="error-details">
				<bean:define id="e" name="javax.servlet.jsp.jspException" type="java.lang.Exception" />
				
				<%-- If it's an application exception then we always wrap in a StandardException --%>
				<%--
					if (e instanceof StandardException) {			
				--%>		
					<bean:write name="javax.servlet.jsp.jspException" property="details" />
				
				<%-- If it's a JSP exception then print out the stack trace --%>
				<%--
					} else {
						response.flushBuffer();
						e.printStackTrace(new PrintWriter(out));
					}
				--%>
			</div>
		
		</div>
		
	</logic:present>	
	
