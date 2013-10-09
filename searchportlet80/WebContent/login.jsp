<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w3.org/TR/REC-html40/loose.dtd">

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

<%@ include file="/common/includes.jsp" %>
<html:html>
	<head>
		<%-- Ideally we'd use tiles:insert, however, it doesn't seem to work well with FORM based security --%>
		<jsp:include page="/common/messages.jsp"/>
		<jsp:include page="/common/header.jsp"/>
		<script type="text/javascript">
			function preLogin() {
				var params = {
					url: "init",
					sync: true,
					form: "LoginForm",
					load: function(response, ioArgs) {
					},		
					error: function(response, ioArgs) {
					}
				}
				<es:dojo />.xhrPost(params);
			}
		</script>
		<style>
			body {
				min-height: 500px;
				min-width: 1000px;	
				margin: 0 auto;
				position: relative;
				background-repeat: repeat-x;
				background-image: url('images/edisc_bg.png');
				background-color: #FFF;
				overflow: hidden;
				position: absolute;
			}
			
			html {
				margin: 0;
				background-color: gray;
				overflow-x: auto;
				overflow-y: hidden;	
			}
			
			html, body {
				height: 100%;
				width: 100%;
				padding: 0;
				font-family: Tahoma;
				font-size: 12px;
			}
		</style>
	</head>
	
	      
	<body class="tundra edr login">
		
		<div id="swoosh">	
			
			<div <es:dojoType />="widgets.Banner" loginId="" loginIdLabel=""></div>
			
			<div id="login-distance"></div>
			  
			  <div id="box" class="white-box">
				
				<%-- Server side messages --%>
				<div id="login-error" tabIndex="0" class="error"><c:if test="${!empty param.message}"><fmt:message key="${param.message}" /></c:if></div>
				
				<div id="login-form">	
					
					<form id="LoginForm" action="j_security_check" method="post">     
					        					
						<input type="hidden" name="action" value="login" />
						<%--<input type="hidden" name="<%= sessionIdKey %>" value="<%= sessionIdValue %>" />--%>
						
						<input type="hidden" id="dateFormat" name="dateFormat" value=""/>
						
			  			<input type="hidden" id="timeZone" name="timeZone" value=""/>
			  	
						<fieldset>
							
							<legend><fmt:message key="text.imc.login.label"/></legend>
							
							<div class="text"><fmt:message key="text.login.help.header"/></div>
							
							<%-- Username --%>
							<div class="ic">
								<label for="j_username"><fmt:message key='text.imc.username.label' />:</label>
								<br/>
								<%--
								<input type="text" name="j_username" id="j_username" value="" size="30" trim="true"
					                dojoType="dijit.form.ValidationTextBox"
					                required="true"
					                promptMessage="<fmt:message key='K0001I.COMMON.REQUIRED'/>"/>
					            --%>					            
								<input type="text" name="j_username" id="j_username" value="" size="30" trim="true" <es:dojoType />="dijit.form.TextBox"/>					            					
							</div>
								
							<%-- Password --%>             
							<div class="ic">
								<label for="j_password"><fmt:message key='text.imc.password.label' />:</label>				
								<br/>
								<%--
								<input type="password" name="j_password" id="j_password" value="" size="30" trim="true"
					                dojoType="dijit.form.ValidationTextBox"
					                required="true"
					                promptMessage="<fmt:message key='K0001I.COMMON.REQUIRED'/>"/>
					            --%>					 
								<input type="password" name="j_password" id="j_password" value="" size="30" trim="true" <es:dojoType />="dijit.form.TextBox"/>
							</div>
							
							<%-- Buttons --%>
							<div style="float:left;">
								<div id="login-button" 
									<es:dojoType />="widgets.Button"
									type="submit"
									onClick="preLogin"
									title="<fmt:message key='button.login'/>"
									>
									<fmt:message key="button.login"/>
								</div>
							</div>
							<div class="progress"><img id="form-indicator" src="images/status_indicator_20_slow.gif" alt="<fmt:message key='K0001I.COMMON.PROGRESS.WAIT'/>"/></div>
							<%--
							<div class="copyright">
								<div><fmt:message key="K0001I.COMMON.COPYRIGHT.1"/></div>
								<div><fmt:message key="K0001I.COMMON.COPYRIGHT.2"/></div>
								<div><fmt:message key="K0001I.COMMON.COPYRIGHT.3"/></div>
							</div>
							--%>
						</fieldset>
							
					</form>					
				
				</div> <!-- End login-form -->
				
			</div> <!-- End box -->
     	
		</div> <!-- End swoosh -->
			
	
	<jsp:include page="/dialogs/common.jsp"/>		
		
	</body>
			
</html:html>
