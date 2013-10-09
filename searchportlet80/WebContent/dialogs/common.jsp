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

<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" errorPage="/jspError.do" %>

<%@ include file="/common/includes.jsp" %>

<%-- Progress Dialog --%>
<div <es:dojoType />="widgets.customDialog" class="progress-dialog" id="<%=applicationPrefix%>progress-dialog" closable="false" showButtonBar="false" draggable="false" style="visibility: hidden;">
	<div style="text-align:center;width:200px;height:50px;" id="<%=applicationPrefix%>progress-message"></div>
</div>

<%-- Alert Dialog --%>
<div <es:dojoType />="widgets.customDialog" showOk="false" id="<%=applicationPrefix%>alert-dialog" style="visibility: hidden;"
	cancelButtonLabel="<fmt:message key='common.ok'/>"
	closable="false" title="<fmt:message key='common.alert'/>">
	<div style="width:600px;min-height:50px;">
		<%-- Alert Icon --%>
		<div class="error-dlg-icon-container">
			<img src="<%=request.getContextPath()%>/images/attention32.png" alt="<fmt:message key='common.alert'/>">
		</div>			
		<div tabindex="0" class="error-dlg-content-container" id="<%=applicationPrefix%>alert-message"
			style="padding-top: 10px;padding-bottom: 10px;"></div>
	</div>
</div>

<%-- Confirm Dialog --%>
<div <es:dojoType />="widgets.customDialog" id="<%=applicationPrefix%>confirmation-dialog"
	closable="false"  style="visibility: hidden;"
	title="<fmt:message key='common.confirm'/>">
	<div style="min-width:400px;min-height:50px;">
		<%-- Alert Icon --%>
		<div class="error-dlg-icon-container">
			<img src="<%=request.getContextPath()%>/images/question32.png" alt="<fmt:message key='common.alert'/>" />
		</div>	
		<div class="error-dlg-content-container" id="<%=applicationPrefix%>confirmation-message"
			style="padding-top: 10px;padding-bottom: 10px;"></div>
	</div>
</div>

<%-- Common Dialog --%>
<div <es:dojoType />="widgets.customDialog" id="<%=applicationPrefix%>common-dialog"></div>

<%-- Error Dialog --%>
<div <es:dojoType />="widgets.customDialog" showOk="false" id="<%=applicationPrefix%>error-dialog"  style="visibility: hidden;"
	cancelButtonLabel="<fmt:message key="common.ok"/>"
	closable="false" title="<fmt:message key="errors.dialog.information"/>">
	<div style="width:600px;min-height:50px;">
		<%-- Error Icon --%>
		<div class="error-dlg-icon-container">
			<img src="<%=request.getContextPath()%>/images/error23.png" alt="<fmt:message key="errors.dialog.information"/>">
		</div>			
		<div tabindex="0" class="error-dlg-content-container" style="padding-top: 10px;padding-bottom: 10px;">
			<fmt:message key="errors.dialog.unexpected.search.error"/>
		</div>
		
		<%-- Error Informations --%>
		<div style="display:none;">
			<%-- HTTP Status Code --%>
			<div>
				<div class="error-dialog-label-heading"><fmt:message key="errors.dialog.http.status.code"/></div>	
				<div id="<%=applicationPrefix%>error-http-status-code"></div>			
				<br/>
			</div>
			
			<%-- HTTP Status Message --%>
			<div>
				<div class="error-dialog-label-heading"><fmt:message key="errors.dialog.http.status.message"/></div>	
				<div id="<%=applicationPrefix%>error-http-status-message"></div>		
				<br/>
			</div>
				
			<div id="<%=applicationPrefix%>error-info-container">
					
				<%-- Error Message --%>
				<div id="<%=applicationPrefix%>error-message-container">
					<div class="error-dialog-label-heading"><fmt:message key="errors.dialog.message"/></div>	
					<div id="<%=applicationPrefix%>error-message"></div>
				</div>
				
				<br/>
				
				<%-- Error Details --%>
				<div id="<%=applicationPrefix%>error-details-container">
					<div class="error-dialog-label-heading"><fmt:message key="errors.dialog.details"/></div>
					<div id="<%=applicationPrefix%>error-details" class="error-details"></div>			
				</div>
			</div>
		</div>
	</div>
</div>
