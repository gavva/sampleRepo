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
<%@ taglib uri="/WEB-INF/tld/enterpriseSearch.tld" prefix="es" %>

/**
 * With Dojo's dialog implementation, only the first dialog is truly modal.  If more
 * than one dialog is opened at a time, the previous dialogs can still be manipulated
 * and/or closed, which is not our desired behavior.  The fix for this is to make sure
 * all subsequent dialogs had a higher z-index value than the prior dialogs.  In order
 * to do this, we will keep track of the number of currently opened dialogs.
 */
EDR.dialog.openDialogs = 0;

/**
 * General-purpose functions to show/hide dialogs
 */
EDR.dialog.util = {
	
	dialogs: [],
	
	setContent: function(dlg, data) {
		dlg.setContent(data);
		
	},
	
	showById: function(dialogId) {
		var dlg = <es:dijit />.byId(dialogId);
		if(!dlg) {
			<es:dojo />.parser.parse(dialogId + "-Container");
			dlg = <es:dijit />.byId(dialogId);
			if(<es:dojo />.isIE && dialogId == EDR.prefix + "preferences") {
				<es:dijit />.byId(EDR.prefix + "resultsOptions").domNode.style.overflow = "auto";
			}
		}
		var smallDialogs = [EDR.prefix+"alert-dialog", EDR.prefix+"error-dialog", EDR.prefix+"preference", EDR.prefix+"multiSelectDlg", EDR.prefix+"myProfileDlg", EDR.prefix+"facetDialog", EDR.prefix+"previewDialog", EDR.prefix+"about-dialog", EDR.prefix+"documentLabelDialog"];
		if(<es:dojo />.marginBox(<es:dojo />.body().parentNode).w < 900){
			dojo["require"]("dojo._base.array");
			if(dojo.indexOf(smallDialogs, dialogId) != -1) {
				dlg.setWidth(500);
				if(dlg.containerNode) {
					var dialogNode = <es:dojo />.query("div", dlg.containerNode)[0];
					<es:dojo />.marginBox(dialogNode, {w:500});
					dialogNode.style.overflow = "auto";
				}
			}
		} else if (dialogId == "previewContent" || dialogId == "previewContainer") {
			dlg.domNode.style.width = "480px";
		}
		this.show(dlg);	
	},
	
	hideById: function(dialogId) {
		this.hide(<es:dijit />.byId(dialogId));
	},
	
	show: function(dlg) {
		// hide flash objects
		if(EDR.isTextAnalyticsEnabled) {
			widgets.analytics.hideAnalyticsPane();
		}
		
		var dialogs = EDR.dialog.util.dialogs;
		<es:dojo />.forEach(dialogs, function(dlg) {
			dlg.domNode.style.zIndex = 900;
			if (dlg.disableKeyHandler) dlg.disableKeyHandler();
		});
		dialogs.push(dlg);
		dlg.show();
		dlg.domNode.style.zIndex = 1000;       
	},
	
	hide: function(dlg) {
		var dialogs = EDR.dialog.util.dialogs;
		dialogs.pop();				
		if (dialogs.length > 0) {
			// hack to show multiple modal dialogs
			dlg._fadeOut.onEnd = function() {
				dlg._fadeOut.node.style.visibility="hidden";
				dlg._fadeOut.node.style.top = "-9999px";
			}
			dialogs[dialogs.length-1].domNode.style.zIndex = 1000;
			if (dialogs[dialogs.length-1].enableKeyhandler)
				dialogs[dialogs.length-1].enableKeyhandler();
		} else {
			dlg._fadeOut.onEnd = function() {
				dlg._fadeOut.node.style.visibility="hidden";
				dlg._fadeOut.node.style.top = "-9999px";
				if (EDR.dialog.util.dialogs && EDR.dialog.util.dialogs.length == 0)
					<es:dijit />._underlay.hide();
			}
		}
		// call original hide method
		<es:dijit />.Dialog.prototype.hide.call(dlg);
		// restore flash pane
		if(EDR.isTextAnalyticsEnabled && dialogs.length <= 0) {		
			widgets.analytics.showAnalyticsPane();
		}
	}	
}

/**
 * Common dialog.
 */
EDR.dialog.CommonDialog = {

	show: function(params) {	
		var dlg = <es:dijit />.byId(EDR.dialog.Constants.COMMON_DIALOG_DOM_ID);
		
		if (params.title) {
			dlg.setTitle(params.title);
		}
		
		if (params.content) {	
			dlg.setContent(params.content);
		}
		
		EDR.dialog.util.show(dlg);

	},
	
	hide: function() {
		EDR.dialog.util.hideById(EDR.dialog.Constants.COMMON_DIALOG_DOM_ID);
	}
}
    
/**
 * Progress dialog.
 */
EDR.dialog.ProgressDialog = {

	show: function(msg) {
		document.body.style.cursor = "wait";		
		var dlg = <es:dijit />.byId(EDR.dialog.Constants.PROGRESS_DIALOG_DOM_ID);												
		<es:dojo />.byId(EDR.prefix+"progress-message").innerHTML = msg;
		EDR.dialog.util.show(dlg);
	},
	
	hide: function() {
		document.body.style.cursor = "auto";
		EDR.dialog.util.hideById(EDR.dialog.Constants.PROGRESS_DIALOG_DOM_ID);
	}
}

EDR.dialog.WarningDialog = {

	show: function(warning, ioArgs) {			
		var dlg = <es:dijit />.byId(EDR.prefix+"alert-dialog");			
		var msgEl = g(EDR.prefix+"alert-message");
		msgEl.innerHTML = "";
		if (warning.message) {
			msgEl.innerHTML = warning.message;
		}
		EDR.dialog.util.show(dlg);
	},
	
	hide: function() {
		EDR.dialog.util.hideById(EDR.prefix+"alert-dialog");
	}
}

/**
 * Error dialog.
 */
EDR.dialog.ErrorDialog = {

	show: function(error, ioArgs) {			
		// Get a reference to the dialog element
		var dlg = <es:dijit />.byId(EDR.dialog.Constants.ERROR_DIALOG_DOM_ID);	
		
		// Add status code
		var scEl = g(EDR.prefix+"error-http-status-code");
		scEl.innerHTML = "";
		try {
			if (ioArgs && ioArgs.xhr && ioArgs.xhr.status) {
				scEl.innerHTML = ioArgs.xhr.status;
			}	
		} catch (e) {
			// exception
		}
		
		// Add status message		
		var smEl = g(EDR.prefix+"error-http-status-message");
		smEl.innerHTML = "";
		try {
			if (ioArgs && ioArgs.xhr && ioArgs.xhr.statusText) {
				smEl.innerHTML = ioArgs.xhr.statusText;
			}	
		} catch (e) {
			// exception
		}
						
		// Check the format of what we're given; if it's a JSON string do the right thing
		if (error.message || error.details) {  

			// Add error message
			var msgEl = g(EDR.prefix+"error-message");
			msgEl.innerHTML = "";
			if (error.message) {
				msgEl.innerHTML = error.message;
			} else {				
				g(EDR.prefix+'error-message-container').style.display = "none";
			}
			
			// Add error details
			var detailsEl = g(EDR.prefix+"error-details");
			detailsEl.innerHTML = "";
			if (error.details) {		
				detailsEl.innerHTML = error.details;
			} else {
				g(EDR.prefix+'error-details-container').style.display = "none";
			}
		
		// Otherwise, simply replace the content
		} else {
					
			var el = g(EDR.prefix+"error-info-container");			
			var responseText = null;
			try {
				if (ioArgs && ioArgs.xhr) {
				    responseText = ioArgs.xhr.responseText;
				}
			} catch (e) {
				// exception
			}
			if (responseText) {
				el.innerHTML = responseText; // should be meaningful
			} else {
				el.innerHTML = error; // worst case
			}
		}		
		
		EDR.dialog.util.show(dlg);
	},
	
	hide: function() {
		EDR.dialog.util.hideById(EDR.dialog.Constants.ERROR_DIALOG_DOM_ID);
	}
}