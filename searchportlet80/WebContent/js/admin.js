//*********************** ES COPYRIGHT START  *********************************
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
//*********************** ES COPYRIGHT END  ***********************************
  
EDR.admin.currentDir = "";
EDR.admin.selectedCase = "";
EDR.admin.currentPage = "nav-system-casemanagement";
EDR.admin.caseManagementEditCaseIdEncoded = ""; 
EDR.admin.caseManagementEditCaseId = ""; 
EDR.admin.caseManagementEditCaseIconPrefix = "";
EDR.admin.caseManagementEditWidgets = [];
EDR.admin.ralFolders = []; 
EDR.admin.commitFolders = [];
EDR.admin.longRunningProcessTimeOut = 0;
// Flag to skip the next case management page refresh, useful if a change was made that could invalidate data that could already
// be on its way back to the client.
EDR.admin.skipRefresh = false;
// Flag to stop the periodic refresh
EDR.admin.stopRefresh = false;
// Variable to keep track of session timeout delay
EDR.admin.sessionTimeout = 0;
EDR.admin.sessionTimer = null;

EDR.admin.nav = {

	// This method resets the session timeout delay
	resetTimeout: function(delay) {
		
		// If we haven't already set the delay, save the passed value
		if (delay != null && EDR.admin.sessionTimeout == 0) {
			EDR.admin.sessionTimeout = delay;
		}
		
		// Cancel the current timer if it exists
		if (EDR.admin.sessionTimer != null) {
			clearTimeout(EDR.admin.sessionTimer);
		}	
		
		// Set the new timer
		EDR.admin.sessionTimer = setTimeout(EDR.admin.nav.invalidateSession, EDR.admin.sessionTimeout);
	
	},
	
	// This method invalidates the user's session since it has timed out
	invalidateSession: function() {
	
		function successCallback(response, ioArgs) {
			// Refresh the page
			location.reload(true);
		}

		EDR.ajax.Request.get(
				{
					url: EDR.Constants.APPLICATION_CONTEXT + "/logout.do?action=logout",
					showProgress: false,
					successCallback: successCallback
				});
	
	},
	
	selectTOCItem: function(menuItemID) {
	    var menuItem = g(menuItemID);
	    if (menuItem) {
	       menuItem.className = 'tocItemActive';
	    }
	}, 
	
	deselectAllTOCItems: function(containerId) {
		var container = g(containerId);
		if (container != null && container.hasChildNodes()) {
			var tocItemNodes = container.childNodes;
			for (var i = 0; i < tocItemNodes.length; i++) {
				var tocItemNode = tocItemNodes[i];
				if (tocItemNode.className == 'tocItemActive') {
				    tocItemNode.className = 'tocItemInactive';
				}
			}
		}
	}, 
	
	selectSubTOCItem: function(menuItemID) {
	    var menuItem = g(menuItemID);
	    if (menuItem) {
	       menuItem.className = 'subtocItemActive';
	    }
	}, 
	
	deselectAllSubTOCItems: function(containerId) {
		var container = g(containerId);
		if (container != null) {
			var elements = container.getElementsByTagName('a');
			for (var i = 0; i < elements.length; i++) {
				var element = elements[i];
				if (element.className == 'subtocItemActive') {
			    	element.className = 'subtocItemInactive';
				}
			}
		}
	},
	
	setView: function(menuItemID, logLevel, page, logName) {
		
		var caseId = null;
		
		// Close any open edit areas
		if (EDR.admin.caseManagementEditCaseIdEncoded != '') {
			EDR.admin.caseManagement.closeEditArea();
		}
		
		// Stop any periodic refreshes which are happening now
		EDR.admin.stopRefresh = true;
			
		
		// Set the right pane to a loading message while we retrieve the content
		dijit.byId(EDR.prefix+'adminMainContent').setContent(g('adminLoading').innerHTML);
		
		if (menuItemID == 'nav-system-casemanagement') {
		
			function startRefresh(response, ioArgs) {

				// If we're still on the case management page, update the content
				if (EDR.admin.currentPage == 'nav-system-casemanagement') {
	    			// Look for a Dijit widget
	    			var dw = dijit.byId(EDR.prefix+'adminMainContent');
	    			if (dw != null && dw.setContent) {
	    				dw.setContent(response);
	    			} 
				
					// Re-enable periodic refresh
					EDR.admin.stopRefresh = false;
					
					// Periodically reload this page to detect crawler status and size updates
					EDR.admin.caseManagement.refresh(true); 
				}
		
			}
			
			var parms = {};
			parms.showProgress = false;
			parms.url = EDR.contextPath + '/case.do?action=getAllCases';
			parms.timeout = EDR.admin.longRunningProcessTimeOut;
			parms.successCallback = startRefresh;
			parms.type = "get";
			EDR.ajax.Request._doRequest(parms);
			
		
		} else if (menuItemID == 'nav-system-flagmanagement') {
		
			// Flag Management Screen
			EDR.ajax.Request.updateContentPane('adminMainContent', EDR.contextPath + '/flag.do?action=showDefaultFlags');
			
			
		} else if (menuItemID == 'nav-system-nodemanagement') {
		
			// Node Management Screen
			EDR.ajax.Request.updateContentPane('adminMainContent', EDR.contextPath + '/nodeManagement.do?action=listNodes');
			
			// Periodically refresh the display to show up-to-date node statistics
			EDR.admin.stopRefresh = false;
			EDR.admin.nav.refreshTimer = setTimeout(EDR.admin.nav.refreshNodeManagementScreen, 5000);

			
		} else if(menuItemID == 'nav-system-errorlog') {
		
			// View Logs
			var paramPage = '';
			var paramLogLevel = '';
			var paramLogName = '';
			if (page != null) {
				paramPage = '&page='+page;
			}
			if (logLevel != null) {
				paramLogLevel = '&logLevel='+logLevel;
			}
			if (logName != null) {
				paramLogName = '&logName='+encodeURIComponent(logName);
			}
			EDR.ajax.Request.updateContentPane('adminMainContent', EDR.contextPath + '/logAction.do?action=showSystemLog'+paramLogLevel+paramPage+paramLogName);
			
		} else if (menuItemID.indexOf('-repository') != -1) {
		
			// File Management Screen
			caseId = menuItemID.substring(10, menuItemID.indexOf('-repository'));
			caseId = EDR.util.String.trim(g('nav-case-name-' + caseId).innerHTML);
			// Save the selected case ID
			EDR.admin.selectedCase = caseId;
			EDR.ajax.Request.updateContentPane('adminMainContent', EDR.contextPath + '/crawler.do?action=listRepositories&caseId=' + encodeURIComponent(caseId));
			
		} 
		
		// Save this as the current page ID
		EDR.admin.currentPage = menuItemID;
		
	},

	downloadSystemLog: function() {
		EDR.util.confirm(EDR.messages.K0015I_DOWNLOAD_LOGFILE_CONFIRM, 
			function() {
			    var logName = '';
	    		var logTypeSelect = g('viewLogType');
	    		if (logTypeSelect) {
		    		logName = logTypeSelect.options[logTypeSelect.selectedIndex].value;
	    		}
	    		var paramLogName = '';
				if (logName) {
					paramLogName = '&logName='+encodeURIComponent(logName);
				}
				window.location='logAction.do?action=downloadSystemLog'+paramLogName;
			});
	},
	
	showLogFile: function(logLevel) {
	    var logName = '';
	    var logTypeSelect = g('viewLogType');
	    if (logTypeSelect) {
		    logName = logTypeSelect.options[logTypeSelect.selectedIndex].value;
	    }
	    EDR.admin.nav.setView('nav-system-errorlog', logLevel, null, logName);
	},
		
	selectViewLogs: function(caseId) {
	    EDR.admin.nav.deselectAllTOCItems('adminTOCItemContainer'); 
	    EDR.admin.nav.deselectAllSubTOCItems('adminCaseList'); 
	    EDR.admin.nav.selectTOCItem('adminTOCItemSystemLog'); 
	    EDR.admin.nav.setView('nav-system-errorlog', null, null, caseId);
	    g('adminTOCItemSystemLogSpan').appendChild(g('selectedAdminTOCItem')); 	    
	}, 
	
	selectManageCases: function() {
	    EDR.admin.nav.deselectAllTOCItems('adminTOCItemContainer'); 
	    EDR.admin.nav.deselectAllSubTOCItems('adminCaseList'); 
	    EDR.admin.nav.selectTOCItem('adminTOCItemCaseManagement'); 
	    EDR.admin.nav.setView('nav-system-casemanagement');
	    g('adminTOCItemCaseManagementSpan').appendChild(g('selectedAdminTOCItem')); 	    
	}, 
	
	selectManageFlags: function() {
	    EDR.admin.nav.deselectAllTOCItems('adminTOCItemContainer'); 
	    EDR.admin.nav.deselectAllSubTOCItems('adminCaseList'); 
	    EDR.admin.nav.selectTOCItem('adminTOCItemFlagManagement'); 
	    EDR.admin.nav.setView('nav-system-flagmanagement');
	    g('adminTOCItemFlagManagementSpan').appendChild(g('selectedAdminTOCItem')); 	    
	},
	
	selectIndexServers: function() {
	    EDR.admin.nav.deselectAllTOCItems('adminTOCItemContainer'); 
	    EDR.admin.nav.deselectAllSubTOCItems('adminCaseList'); 
	    EDR.admin.nav.selectTOCItem('adminTOCItemNodeManagement'); 
	    EDR.admin.nav.setView('nav-system-nodemanagement');
	    g('adminTOCItemNodeManagementSpan').appendChild(g('selectedAdminTOCItem')); 	    
	},
	
	// Refreshes the admin page display
	refreshAdminPage: function() {
		EDR.admin.nav.setView(EDR.admin.currentPage);	
	},
	
	filterAdminMenuCases: function(filterString) {
	    filterString = EDR.util.String.trim(filterString).toLowerCase();
	    var container = g('adminCaseList');
		if (container && container.hasChildNodes()) {
			var caseNodes = container.childNodes;
			for (var i = 0; i < caseNodes.length; i++) {
				var caseNode = caseNodes[i];
				var id = caseNode.id;
				if (id) {
					var caseName = id.substring('admin-case-'.length).toLowerCase();
					if (EDR.util.String.isWhitespace(filterString) || (caseName.indexOf(filterString) > -1)) {
					    caseNode.style.display = '';
					} else {
					    caseNode.style.display = 'none';
					}
				}
			}
		}
	},
	
	selectRepositoryInTOC: function(caseId) {
	   EDR.util.CollapsibleList.openDisplay('admin-list-'+caseId, 'admin-arrow-'+caseId);
	   EDR.admin.nav.deselectAllTOCItems('adminTOCItemContainer'); 
	   EDR.admin.nav.deselectAllSubTOCItems('adminCaseList'); 
	   EDR.admin.nav.selectSubTOCItem('adminTOCItemRepository-'+caseId); 
	   EDR.admin.nav.setView('nav-cases-'+caseId+'-repository');
	   var rep = g('adminTOCItemRepository-'+caseId);
	   if (rep) {
		   rep.scrollIntoView(true);
	   }
	},
	
	// Continue refreshing the node screen until/unless the user navigates away
	refreshNodeManagementScreen: function() {
		
		function successCallback(response, ioArgs) {
			if (EDR.admin.currentPage == "nav-system-nodemanagement" && EDR.admin.stopRefresh == false) {
				// We are still on the node management screen, update the page
				var json = null;
				try {
					json = dojo.fromJson(response);
				} catch (e) {
					// json format error
				}
				if (json != null && typeof(json) == 'object') {
					// We received json back from the server, update the table contents
					var nodes = json.nodes;
					if (nodes != null) {
						for (var i = 0; i < nodes.length; i++) {
							if (g('nodes-list-name-' + i) != null) {
								g('nodes-list-name-' + i).innerHTML = nodes[i].name;
								g('nodes-list-status-' + i).innerHTML = nodes[i].status;
								if (nodes[i].isActive) {
									g('nodes-list-activate-' + i).style.display = "none";
									g('nodes-list-deactivate-' + i).style.display = "";
									g('nodes-image-active-' + i).style.display = "";
									g('nodes-image-inactive-' + i).style.display = "none";
								} else {
									g('nodes-list-activate-' + i).style.display = "";
									g('nodes-list-deactivate-' + i).style.display = "none";
									g('nodes-image-inactive-' + i).style.display = "";
									g('nodes-image-active-' + i).style.display = "none";
								}
							}
						}
					}
				} else {
					// Replace the content of the page with the snippet in the response
					dijit.byId(EDR.prefix+'adminMainContent').setContent(response);
				}
					
				EDR.admin.nav.refreshTimer = setTimeout(EDR.admin.nav.refreshNodeManagementScreen, 7500);
			}
		}
		
		if (EDR.admin.currentPage == "nav-system-nodemanagement" && EDR.admin.stopRefresh == false) {
			var numNodes = g('nodeTableBody').rows.length;
			if (numNodes == 1 && g('nodeTableBody').rows[0].id == "empty-table") {
				numNodes = 0;
			}
			var params = {};
			params.url = EDR.contextPath + '/nodeManagement.do?action=refreshNodes&numNodes=' + numNodes;
			params.showProgress = false;
			params.type = "get";
			params.successCallback = successCallback;
			EDR.ajax.Request._doRequest(params);
		}

	}
	
	
};   

EDR.admin.cases = {
	
	showSelectCaseDialog: function(issueQuery) {
		
		function successCallback(response, ioArgs) {
			var dlg = dijit.byId(EDR.prefix+'changeActiveCaseDialog');
		    dijit.byId(EDR.prefix+'selectCaseIdDlg').setContent(response);
			//EDR.dialog.util.setContent(dlg, response);
			EDR.dialog.util.show(dlg);  
			if (dojo.isMozilla) {
			    g('selectCaseIdDlg').style.overflow = 'hidden';
			}
		}

		EDR.ajax.Request.get(
				{
					url: EDR.Constants.APPLICATION_CONTEXT + "/case.do?action=selectCaseData&sortOrder=asc&sortField=id",
					progressText: EDR.messages.K0001I_COMMON_PROGRESS_WAIT,
					successCallback: successCallback
				});
	},
	
	filterCases: function(filterString) {

		if (filterString.length > 0) {
			filterString = filterString.toLowerCase();
		}
		var pattern = new RegExp("^" + filterString + ".*");
		// Get the table
		var table = g('casesTable');
		//var tableWidget = dijit.byId(EDR.prefix+'casesTable');
		//var table = tableWidget.containerNode;
		var tableBody = table.getElementsByTagName("tbody")[0];
		var rows = tableBody.getElementsByTagName("tr");
		for (var i = 0; i < rows.length; i++) {
		    if (rows[i].getAttribute('remote')) { 
				//var col = rows[i].getElementsByTagName("td")[0];
				//var caseName = col.innerHTML;
				var caseName = rows[i].getAttribute('id');
				if (pattern.test(caseName.toLowerCase())) {
					rows[i].style.display = "";
				} else {
					rows[i].style.display = "none";
				}	
			}
		}
	},
	
	keypressHeader: function(event, header) {
		if (event) {
			key = event.keyCode;
			if (key && (key == dojo.keys.ENTER || key == dojo.keys.SPACE)) {
				return this.clickedHeader(header); 
			}	
		}	
		return false;		
	},
	
	clickedHeader: function(header) {
		function successCallback(response, ioArgs) {
		    var selectCaseId = dijit.byId(EDR.prefix+'selectCaseId');
			var dlg = dijit.byId(EDR.prefix+'changeActiveCaseDialog');
		    if (dlg) {
			    dijit.byId(EDR.prefix+'selectCaseIdDlg').setContent(response);
				EDR.dialog.util.show(dlg);  
				if (dojo.isMozilla) {
				    g('selectCaseIdDlg').style.overflow = 'hidden';
				}
				
				// set timeout to allow the browser to render dialog
				setTimeout(dojo.hitch(this, function(){
				    g('filterString').focus();
				}), 50);
			} else if (selectCaseId) {
			    selectCaseId.setContent(response);
			}	
		}
		
		if (header) {
		    var sortfield = header.getAttribute("sortindex");
		    var sortorder = header.getAttribute("sortorder");
		    var newSortOrder = "asc";
			if (sortorder == "asc") { 
			   newSortOrder = "desc"; 
			}
			var showProgress = false;
			if (dijit.byId(EDR.prefix+'changeActiveCaseDialog')) {
			   showProgress = true;
			}
			EDR.ajax.Request.get(
				{
					url: EDR.Constants.APPLICATION_CONTEXT + "/case.do?action=selectCaseData&sortOrder=" + newSortOrder + "&sortField=" + sortfield,
					progressText: EDR.messages.K0001I_COMMON_PROGRESS_WAIT,
				    showProgress: showProgress,
					successCallback: successCallback
				});
		}	
	},
	
	keypressRow: function(event, row) {
		var focusRow = null;
		if (event) {
			key = event.keyCode;
			if (key && key == dojo.keys.ENTER) {
				if (dojo.isFF) {
				    focusRow = this.getFocusRow(row);
					return this.doubleClickRow(focusRow);
				}
			} else if (key && key == dojo.keys.SPACE) {
			    focusRow = this.getFocusRow(row);
			    focusRow.focus();
			    focusRow.scrollIntoView();
				return this.selectRow(focusRow); 
			} else if (key && key == dojo.keys.DOWN_ARROW) {
				return this.moveDownRow(row);
			} else if (key && key == dojo.keys.UP_ARROW) {
				return this.moveUpRow(row);
			}			
		}	
		return false;		
	},
	
	getFocusRow: function(row) {
		var table = g('casesTable');
		var tableBody = table.getElementsByTagName("tbody")[0];
		var rows = tableBody.getElementsByTagName("tr");
		for (var i = 0; i < rows.length; i++) {
		    if (rows[i].className.indexOf('focused') > -1) { // focused row
		        return rows[i];
		    }
		}
		return row;
	}, 
	
	moveDownRow: function(row) {
		var table = g('casesTable');
		var tableBody = table.getElementsByTagName("tbody")[0];
		var rows = tableBody.getElementsByTagName("tr");
		var selectedRow = null;
		for (var i = 0; i < rows.length; i++) {
		    if (selectedRow) {
			    rows[i].getElementsByTagName("A")[0].focus();
			    break;
		    }
		    if (rows[i].className.indexOf('focused') > -1) { // focused row
		        selectedRow = rows[i];
		    }
		}
	}, 
	
	moveUpRow: function(row) {
		var table = g('casesTable');
		var tableBody = table.getElementsByTagName("tbody")[0];
		var rows = tableBody.getElementsByTagName("tr");
		var previousRow = null;
		for (var i = 0; i < rows.length; i++) {
		    if (rows[i].getAttribute('remote')) { 
			    if (rows[i].className.indexOf('focused') > -1) { // focused row
				    if (previousRow) {
					    previousRow.getElementsByTagName("A")[0].focus();
				    }
				    break;
			    }
				previousRow = rows[i];
		    }
		}
	}, 
	
	selectRow: function(row) {
	    // Reset rows
		var table = g('casesTable');
		var tableBody = table.getElementsByTagName("tbody")[0];
		var rows = tableBody.getElementsByTagName("tr");
		for (var i = 0; i < rows.length; i++) {
		    if (rows[i].getAttribute('remote')) { 
			    rows[i].className = rows[i].getAttribute('originalClass');
			}    
		}
		
		// Set row
	    if (row.className && row.className != '') {
		    row.className += " selected focused";
	    } else {
		    row.className = "selected focused";
	    }
	    
	    // Accessibility
	    var selected = g('selectCaseSelectedRow');
	    if (selected) {
		    selected.style.display = '';
		    row.appendChild(selected); 	    
		}    
	},
	
	onFocusRow: function(row) {
	    if (row.className.indexOf('focused') == -1) {
		    if (row.className && row.className != '') {
			    row.className += " focused";
		   	} else {
			    row.className = "focused";
		    }
		}
	},
	
	onBlurRow: function(row) {
	    if (row.className.indexOf('focused') > -1) { // focused row
		    if (row.className.indexOf('selected') > -1) { // selected row
			    row.className = row.getAttribute('originalClass') + " selected";
	    	} else { // not selected row
			    row.className = row.getAttribute('originalClass');
		    }
		}
	},
	
	doubleClickRow: function(row) {
	    var id = row.getAttribute('id');
	    if (row.getAttribute('remote') == 'true') {
		   var url = "http://" + row.getAttribute('analysisServer') + EDR.contextPath + "/search?action=index&activeCaseId=" + encodeURIComponent(id);
		   EDR.util.Window.show(url); 
		   
	    } else {
			// Get reference to the form
			var frm = f('selectCaseForm');
		
			// Set the active case value
			frm.elements['activeCaseId'].value = id;
		
			// Submit the form
			frm.submit();						
	    }
	},
	
	submitSelectCaseForm: function() {
		
		// Make sure they selected something
		//var selectedCaseId = dijit.byId(EDR.prefix+'casesTable').getSelectedRowIDAttr();
		var selectedCaseId = '';
		var selectedRow = null;
		var table = g('casesTable');
		var tableBody = table.getElementsByTagName("tbody")[0];
		var rows = tableBody.getElementsByTagName("tr");
		for (var i = 0; i < rows.length; i++) {
			var className = rows[i].className;
			if (className.indexOf('selected') > -1) {
				var col = rows[i].getElementsByTagName("td")[0];
				selectedCaseId = col.getElementsByTagName("A")[0].innerHTML;
				selectedRow = rows[i];
				break;
			}
		}
		
		if (EDR.util.String.isWhitespace(selectedCaseId) || 
			selectedCaseId == null || 
			selectedCaseId == "null") {
			EDR.util.alert(EDR.messages.K0022I_MUST_SELECT_CASE);
			return false;
		}
		
		//var obj = dijit.byId(EDR.prefix+'casesTable').getSelectedItem();
		//if (obj.remote == 'true') {
		   //var url = "http://" + obj.analysisServer + EDR.contextPath + "/search?action=index&activeCaseId=" + encodeURIComponent(obj.id);
		if (selectedRow.getAttribute('remote') == 'true') { 
		   var url = "http://" + selectedRow.getAttribute('analysisServer') + EDR.contextPath + "/search?action=index&activeCaseId=" + encodeURIComponent(selectedCaseId); 
		   EDR.util.Window.show(url);
		   
		} else {
			// Get reference to the form
			var frm = f('selectCaseForm');
		
			// Set the active case value
			frm.elements['activeCaseId'].value = selectedCaseId;
		
			// Submit the form
			frm.submit();						
		}
	},
	
	showCreateCaseDialog: function() {
		EDR.util.Form.clear('createCaseForm');
		g('createCaseError').style.display = "none";
		EDR.dialog.util.showbyId(EDR.prefix+'createCaseDialog');
	},
	
	validateCreateCase: function(form) {
		
		g('createCaseError').style.display = "none";
		
		if (form.caseName.value == null || form.caseName.value == "") {
		
			g('createCaseError').innerHTML = EDR.messages.K0014I_ERROR_NAME_REQUIRED;
			g('createCaseError').style.display = "block";
			return false;
		
		}
		
		return true;
	
	},
	
	submitCreateCase: function() {
		
		if (!EDR.admin.cases.validateCreateCase(f('createCaseForm'))) {
			return false;
		}
		
		g('createCaseError').style.display = "none";
	
		function successCallback(response, ioArgs) {
			// See if we got an error
			var json = {};
			try {
				json = dojo.fromJson(response);
			} catch (e) {
				// json format error
			}
			if (typeof(json) == 'object') {
				if (json.caseError != null && json.caseError != "") {
					g('createCaseError').innerHTML = json.caseError;
					g('createCaseError').style.display = "block";
					return;					
				}
			} 
			
        	// Refresh the case screen
			location.reload(true);
		}
		
		EDR.ajax.Form.submit(
			{ 
        		url: EDR.contextPath + "/case.do?action=create",
				formId: "createCaseForm",
				successCallback: successCallback
			}
		);	
		
	},
	
	showModifyCaseDialog: function(caseId) {
		function successCallback(response, ioArgs) {
			var responseObject = null;
			try {
				responseObject = dojo.fromJson(response);
			} catch (e) {
   				EDR.ajax.Error.handle(e, ioArgs);
			}
			
			if (responseObject != null && typeof(responseObject) == 'object') {
	       		// Check for errors
    	   		if (responseObject.caseError != null) {
					EDR.util.alert(responseObject.caseError);
       				//EDR.ajax.Error.handle(responseObject.caseError, ioArgs);
	       			EDR.admin.nav.refreshAdminPage();
    	   		} else {
       				dojo.byId(EDR.prefix+'newCaseName').value = responseObject.name;
       				dojo.byId(EDR.prefix+'newCaseDescription').value = responseObject.description;
       				dojo.byId(EDR.prefix+'oldCaseName').value = responseObject.name;
	       			EDR.dialog.util.showById(EDR.prefix+'modifyCaseDialog');
	       		}	
			}
		}
	
		g('modifyCaseError').style.display = "none";
		EDR.ajax.Request.get({
        	url: EDR.contextPath + "/case.do?action=read&caseId=" + encodeURIComponent(caseId),
			successCallback: successCallback
        });
	},
	
	validateModifyCase: function(caseForm) {

		g('modifyCaseError').style.display = "none";
		
		if (caseForm.newCaseName.value == null || caseForm.newCaseName.value == "") {
		
			g('modifyCaseError').innerHTML = EDR.messages.K0014I_ERROR_NAME_REQUIRED;
			g('modifyCaseError').style.display = "block";
			return false;
		
		}
		
		return true;
	
	},
	
	submitModifyCase: function() {

		if (!EDR.admin.cases.validateModifyCase(f('modifyCaseForm'))) {
			return false;
		}
		
		g('modifyCaseError').style.display = "none";	
		
		function successCallback(response, ioArgs) {
			// See if we got an error
			var json = {};
			try {
				json = dojo.fromJson(response);
			} catch (e) {
				// json format error
			}
			if (typeof(json) == 'object') {
				if (json.caseError != null && json.caseError != "") {
					g('modifyCaseError').innerHTML = json.caseError;
					g('modifyCaseError').style.display = "block";
					return;					
				}
			} 
			
			// Hide the dialog
			EDR.dialog.util.hide('modifyCaseDialog');

        	// Refresh the case screen
			EDR.admin.nav.refreshAdminPage();
		}
		
		EDR.ajax.Form.submit(
			{ 
        		url: EDR.contextPath + "/case.do?action=modify",
				formId: "modifyCaseForm",
				successCallback: successCallback
			}
		);	
		
	},
	
	
	showCaseLangsDialog: function(caseId) {
		function successCallback(response, ioArgs) {
			var responseObject = null;
			try {
				responseObject = dojo.fromJson(response);
			} catch (e) {
   				EDR.ajax.Error.handle(e, ioArgs);
			}
			
			if (responseObject != null && typeof(responseObject) == 'object') {
	       		// Check for errors
	       		if (responseObject.caseError != null) {						
					EDR.util.alert(responseObject.caseError);
    	   			//EDR.ajax.Error.handle(responseObject.caseError, ioArgs);
       				EDR.admin.nav.refreshAdminPage();
	       		} else {					
    	   			var langSelection = dijit.byId(EDR.prefix+'langSelectionContent');
       				langSelection.caseId = caseId;
       				langSelection.setLangsJson(responseObject);
		    		EDR.dialog.util.showbyId(EDR.prefix+'caseLangsDialog');
	    		}
			}
		}
		
		g('modifyCaseError').style.display = "none";
		EDR.ajax.Request.get({
        	url: EDR.contextPath + "/case.do?action=getKnownLanguage&caseId=" + encodeURIComponent(caseId),
			progressText: EDR.messages.K0001I_COMMON_PROGRESS_WAIT,
			successCallback: successCallback
        } );
	},
	
	showCaseTimezoneDiv: function(caseId, caseIdEncoded) {
		function successCallback(response, ioArgs) {

			// Close any open edit areas
		    if (EDR.admin.caseManagementEditCaseIdEncoded != '') {
		        EDR.admin.caseManagement.closeEditArea();
		    }
		    
			EDR.admin.caseManagementEditCaseIdEncoded = caseIdEncoded;
			EDR.admin.caseManagementEditCaseId = caseId;
        	EDR.admin.caseManagementEditCaseIconPrefix = 'caseManagementActionTimezone_';
		
			var editArea = g('caseManagementEditArea_' + caseIdEncoded);
			if (editArea) {
			    // Select the icon
				var editIcon = g(EDR.admin.caseManagementEditCaseIconPrefix + caseIdEncoded);
				if (editIcon) {
					editIcon.className = 'actionItemDiv selected';
				}	
		    
		        // Show the new edit content
				editArea.innerHTML = response;
				EDR.admin.caseManagementEditWidgets = dojo.parser.parse(g('caseManagementTable'));
				
				editArea.style.display = '';
			}	
		}

		EDR.ajax.Request.get(
			{
				url: EDR.Constants.APPLICATION_CONTEXT + "/case.do?action=showCaseTimezone&caseId=" + encodeURIComponent(caseId),
				progressText: EDR.messages.K0001I_COMMON_PROGRESS_WAIT,
				successCallback: successCallback
			}
		);
	},
	
	showCaseLangTimezoneDialog: function(caseId) {
		function successCallback(response, ioArgs) {
			var responseObject = null;
			try {
				responseObject = dojo.fromJson(response);
			} catch (e) {
   				EDR.ajax.Error.handle(e, ioArgs);
			}
			
			if (responseObject != null && typeof(responseObject) == 'object') {
	       		// Check for errors
    	   		if (responseObject.caseError != null) {						
					EDR.util.alert(responseObject.caseError);
       				//EDR.ajax.Error.handle(responseObject.caseError, ioArgs);
       				EDR.admin.nav.refreshAdminPage();
	       		} else {					
    	   			var langTimezone = dijit.byId(EDR.prefix+'caseLangTimezoneContent');
       				langTimezone.caseId = caseId;        			
       				langTimezone.setCaseLangTimezoneJson(responseObject);
		    		EDR.dialog.util.showbyId(EDR.prefix+'caseLangTimezoneDialog');
		    	}	
			}
		}
		
		g('modifyCaseError').style.display = "none";
		EDR.ajax.Request.get(
				{
					url: EDR.contextPath + "/case.do?action=getLangTimezone&caseId=" + encodeURIComponent(caseId),
					progressText: EDR.messages.K0001I_COMMON_PROGRESS_WAIT,
					successCallback: successCallback
				});
	},
	
	saveCaseLangs: function(caseId) {
		function successCallback(response, ioArgs) {
			var responseObject = null;
			try {
				responseObject = dojo.fromJson(response);
			} catch (e) {
   				EDR.ajax.Error.handle(e, ioArgs);
			}
			
			if (responseObject != null && typeof(responseObject) == 'object') {
				if (responseObject.caseError != null) {
					EDR.util.alert(responseObject.caseError);
    	   			//EDR.ajax.Error.handle(responseObject.caseError, ioArgs);
       				EDR.admin.nav.refreshAdminPage();
       			} else {
		    		EDR.dialog.util.hide('caseLangsDialog');
		    	}	
			}
		}	
				
		g('modifyCaseError').style.display = "none";	

		var langSelection = dijit.byId(EDR.prefix+'langSelectionContent');
		var readUrl = EDR.contextPath + "/case.do?action=setKnownLanguage&caseId=" + encodeURIComponent(langSelection.caseId);
		readUrl += "&knownLanguage=" + encodeURIComponent(langSelection.getLangs());
		
		EDR.ajax.Request.get({
        	url: readUrl,
			progressText: EDR.messages.K0001I_COMMON_PROGRESS_WAIT,
			successCallback: successCallback
        } );
	},
	
	enableCaseForAnalysis: function(caseIdEncoded, caseId) {

		var url = EDR.contextPath + "/case.do?action=changeStatusOfCaseForAnalysis&caseId=" + encodeURIComponent(caseId) + "&enabled=true";
		function successCallback(response, ioArgs) {
    		
			// See if we got an error
			var json = {};
			try {
				json = dojo.fromJson(response);
			} catch (e) {
				// json format error
			}
			if (typeof(json) == 'object' && json.caseError != null && json.caseError != "") {
				EDR.util.alert(json.caseError);
				//EDR.ajax.Error.handle(json.caseError, ioArgs);		
	        	// Refresh the case screen
				EDR.admin.nav.refreshAdminPage();
			} else {
				// Case was successfully enabled, cancel pending page refreshes
				EDR.admin.skipRefresh = true;
				
				// update checkbox 
				var enableSearch = g('enableSearch_' + caseIdEncoded);
				var disableSearch = g('disableSearch_' + caseIdEncoded);
				if (enableSearch) {
					enableSearch.style.display = 'none';
					disableSearch.style.display = '';
				}
				// Add the link
				g('collectionNameLink_' + caseIdEncoded).style.display = '';
				g('collectionNameNoLink_' + caseIdEncoded).style.display = 'none';
			}		

		}

		EDR.ajax.Request.get(
		{
			url: url,
			timeout: EDR.admin.longRunningProcessTimeOut,
			successCallback: successCallback
		});

		
	},
	
	disableCaseForAnalysis: function(caseIdEncoded, caseId) {
		
		var url = EDR.contextPath + "/case.do?action=changeStatusOfCaseForAnalysis&caseId=" + encodeURIComponent(caseId) + "&enabled=false";
		
		function successCallback(response, ioArgs) {
    		
			// See if we got an error
			var json = {};
			try {
				json = dojo.fromJson(response);
			} catch (e) {
				// json format error
			}
			if (typeof(json) == 'object' && json.caseError != null && json.caseError != "") {
				EDR.util.alert(json.caseError);
				//EDR.ajax.Error.handle(json.caseError, ioArgs);		
	        	// Refresh the case screen
				EDR.admin.nav.refreshAdminPage();
				return;
			} else {
				// Case was successfully disabled, cancel pending page refreshes
				EDR.admin.skipRefresh = true;
				// update checkbox 
				var enableSearch = g('enableSearch_' + caseIdEncoded);
				var disableSearch = g('disableSearch_' + caseIdEncoded);
				if (enableSearch) {
					enableSearch.style.display = '';
					disableSearch.style.display = 'none';
				}
				// Remove the link
				g('collectionNameLink_' + caseIdEncoded).style.display = 'none';
				g('collectionNameNoLink_' + caseIdEncoded).style.display = '';
			
			}		
			
		}

				
		EDR.ajax.Request.get(
		{
			url: url,
			timeout: EDR.admin.longRunningProcessTimeOut,
			successCallback: successCallback
		});

	},
	
	jumpToSearchPage: function() {
		var url = EDR.contextPath + "/case.do?action=listCases";
		
		function successCallback(response, ioArgs) {
    		
			// See if we got an error
			var json = {};
			try {
				json = dojo.fromJson(response);
			} catch (e) {
				// json format error
			}
			if (typeof(json) == 'object') {
				if (json.caseError != null && json.caseError != "") {													
					EDR.util.alert(json.caseError);
  					//EDR.ajax.Error.handle(json.caseError, ioArgs);		
  					
		        	// Refresh the case screen
					return ;
				}
				if(json.items.length > 0) {
					var items = json.items;
					var len = items.length;
					for(var i=0; i<len; i++) {
						if(items[i].remote == "false") {
							window.location = EDR.contextPath + '/search?action=index&caseIdAutoComplete=true';
							return;
						}
					}
				}
			}
			EDR.util.alert(EDR.messages.K0014I_CASE_NO_AVAILABLE_CASE_ADMIN);
			return;
		}
		
		EDR.ajax.Request.get(
		{
			url: url,
			successCallback: successCallback
		});
	},
	
	preImportCase: function(caseId) {		
		// ask user to specify default case language or not
		var langTimezoneWidget = dijit.byId(EDR.prefix+'caseLangTimezoneContent');
		langTimezoneWidget.caseId = caseId;
		EDR.admin.cases.showCaseLangTimezoneDialog(caseId);
	},
	
	callImportCase: function() {
		var langTimezoneWidget = dijit.byId(EDR.prefix+'caseLangTimezoneContent');
		if (!langTimezoneWidget.isValid()) {
			EDR.util.alert(langTimezoneWidget.getErrorMessage());
			return;
		}
		EDR.dialog.util.hide('caseLangTimezoneDialog');
		EDR.admin.cases.importCase(langTimezoneWidget.caseId,
			langTimezoneWidget.getLang(), langTimezoneWidget.getTimezone());
	},
	
	importCase: function(caseId, lang, timezone) {
		function successCallback(response, ioArgs) {
    		EDR.dialog.ProgressDialog.hide();
    		
			// See if we got an error
			var json = {};
			try {
				json = dojo.fromJson(response);
			} catch (e) {
				// json format error
			}
			if (typeof(json) == 'object') {
				if (json.caseError != null && json.caseError != "") {													
					EDR.util.alert(json.caseError);
  					//EDR.ajax.Error.handle(json.caseError, ioArgs);		

					return;
				}
			} 
			
			EDR.admin.nav.refreshAdminPage();
			
		}
		
		var url = EDR.Constants.APPLICATION_CONTEXT + "/case.do?action=importCase&caseId=" + encodeURIComponent(caseId);
		url += "&knownLanguage=" + encodeURIComponent(lang) + "&timezone=" + encodeURIComponent(timezone);
		EDR.ajax.Request.get(
				{
					url: url,
					timeout: EDR.admin.longRunningProcessTimeOut,
					timeoutCallback: EDR.admin.caseManagement.timeoutCallback, 
					progressText: EDR.messages.K0014I_CASE_IMPORT_PROGRESS,
					successCallback: successCallback
				});
	},
	
	startRALCrawler: function(caseId) {

		function successCallback(response, ioArgs) {
    		
			// See if we got an error
			var json = {};
			try {
				json = dojo.fromJson(response);
			} catch (e) {
				// json format error
			}
			if (typeof(json) == 'object') {
				if (json.caseError != null && json.caseError != "") {													
					EDR.util.alert(json.caseError);
  					//EDR.ajax.Error.handle(json.caseError, ioArgs);		
					return;
				}
				
				// Update the case display
				var availableCases = json.availableCases;
				   
			    EDR.admin.caseManagement.updateAvailableCasesData(availableCases);
				
			}
			
			// Restart the refresh
			EDR.admin.stopRefresh = false;
			EDR.admin.nav.refreshTimer = setTimeout(function() { EDR.admin.caseManagement.refresh(false) }, 5000);
			 
	
			
		}

		EDR.admin.stopRefresh = true;
		
		EDR.ajax.Request.get(
				{
					url: EDR.Constants.APPLICATION_CONTEXT + "/case.do?action=startRALCrawler&caseId=" + encodeURIComponent(caseId),
					timeout: EDR.admin.longRunningProcessTimeOut,
					timeoutCallback: EDR.admin.caseManagement.timeoutCallback, 
					progressText: EDR.messages.K0014I_CASE_START_CRAWLER_PROGRESS,
					successCallback: successCallback
				});
	},
	
	stopRALCrawler: function(caseId) {


		function successCallback(response, ioArgs) {
    		
			// See if we got an error
			var json = {};
			try {
				json = dojo.fromJson(response);
			} catch (e) {
				// json format error
			}
			if (typeof(json) == 'object') {
				if (json.caseError != null && json.caseError != "") {													
					EDR.util.alert(json.caseError);
  					//EDR.ajax.Error.handle(json.caseError, ioArgs);		
					return;
				}
				
				var availableCases = json.availableCases;
				  
			    EDR.admin.caseManagement.updateAvailableCasesData(availableCases);
				
			} 
			
			// Restart the refresh
			EDR.admin.stopRefresh = false;
			EDR.admin.nav.refreshTimer = setTimeout(function() { EDR.admin.caseManagement.refresh(false) }, 5000);
			
		}
		
		EDR.admin.stopRefresh = true;

		EDR.ajax.Request.get(
				{
					url: EDR.Constants.APPLICATION_CONTEXT + "/case.do?action=stopRALCrawler&caseId=" + encodeURIComponent(caseId),
					timeout: EDR.admin.longRunningProcessTimeOut,
					timeoutCallback: EDR.admin.caseManagement.timeoutCallback, 
					progressText: EDR.messages.K0014I_CASE_STOP_CRAWLER_PROGRESS,
					successCallback: successCallback
				});
	},
	
	deleteCase: function(caseId, includeReleaseCheckbox) {

		function successCallback(response, ioArgs) {
    		EDR.dialog.ProgressDialog.hide();
    		
			// See if we got an error
			var json = {};
			try {
				json = dojo.fromJson(response);
			} catch (e) {
				// json format error
			}
			if (typeof(json) == 'object') {
				if (json.caseError != null && json.caseError != "") {													
					EDR.util.alert(json.caseError);
  					//EDR.ajax.Error.handle(json.caseError, ioArgs);		
  					
					return;
				}
			} 
			
			EDR.admin.nav.refreshAdminPage();
			
		}
	
	    var confirmText = EDR.messages.K0014I_CASE_DELETE_CONFIRM;
	    if (includeReleaseCheckbox) {
		    confirmText += "<br/><br/><input type=\"checkbox\" checked name=\"confirmCaseDelete\" id=\"confirmCaseDelete\" value=\"true\" />&nbsp;"; 
	      	confirmText += "<label for='confirmCaseDelete'>" + EDR.messages.K0014I_CASE_DELETE_RELEASE_CONFIRM + "</label>";
	    }
	    
		EDR.util.confirm(confirmText, function() {
		    var checkbox = g('confirmCaseDelete');
		    var releaseValue = "false";
		    if (checkbox && checkbox.checked) {
		        releaseValue = "true";
		    }
		    
			EDR.ajax.Request.get(
				{
					url: EDR.Constants.APPLICATION_CONTEXT + "/case.do?action=delete&caseId=" + encodeURIComponent(caseId) + "&release=" + releaseValue ,
					timeout: EDR.admin.longRunningProcessTimeOut, 
					timeoutCallback: EDR.admin.caseManagement.timeoutCallback, 
					progressText: EDR.messages.K0014I_CASE_DELETE_PROGRESS,
					successCallback: successCallback
				});
		});
	},
	
	buildOverlayIndex: function(caseId) {
	
		function successCallback(response, ioArgs) {
			// See if we got an error
			var json = {};
			try {
				json = dojo.fromJson(response);
			} catch (e) {
				// json format error
			}
			if (typeof(json) == 'object') {
				if (json.buildOverlayError != null && json.buildOverlayError != "") {
					EDR.util.alert(json.buildOverlayError);
					return;					
				}
			} 
			
        	// Refresh the case screen
			EDR.admin.nav.refreshAdminPage();
		}
	
		EDR.ajax.Request.get(
			{
				url: EDR.Constants.APPLICATION_CONTEXT + "/case.do?action=buildOverlayIndex&caseId=" + encodeURIComponent(caseId),
				timeout: EDR.admin.longRunningProcessTimeOut,
				successCallback: successCallback
			}
		);
	}
};

EDR.admin.timezone = {
	saveTimezone: function(caseId) {

		var timezoneWidget = dijit.byId("caseTimezoneContent");
		if (!timezoneWidget.isValid()) {
			EDR.util.alert(timezoneWidget.getErrorMessage());
			return;
		}
		if (typeof caseId == 'undefined') {
		   caseId = EDR.admin.caseManagementEditCaseId;
		}
		
		function successCallback(response, ioArgs) {
    		EDR.dialog.ProgressDialog.hide();

			// Close any open edit areas
		    if (EDR.admin.caseManagementEditCaseIdEncoded != '') {
		        EDR.admin.caseManagement.closeEditArea();
		    }
		    
			// See if we got an error
			var json = {};
			try {
				json = dojo.fromJson(response);
			} catch (e) {
				// json format error
			}
			if (typeof(json) == 'object') {
				if (json.caseError != null && json.caseError != "") {													
					EDR.util.alert(json.caseError);
  					//EDR.ajax.Error.handle(json.caseError, ioArgs);		
        			EDR.admin.nav.refreshAdminPage();
					return;
				}
			} 
		}

		EDR.ajax.Request.get(
		{
			url: EDR.Constants.APPLICATION_CONTEXT + "/case.do?action=setTimezone&caseId=" + encodeURIComponent(caseId) +
				"&timezone=" + encodeURIComponent(timezoneWidget.getTimezone()),
			progressText: EDR.messages.K0001I_COMMON_PROGRESS_WAIT,
			successCallback: successCallback
		});
	}
};

EDR.admin.ignore = {

	// Expands the manage ignore text div in the case mgmt table
	showManageIgnoreTextDiv: function(caseIdEncoded, caseId) {

		function successCallback(response, ioArgs) {

			// Close any open edit areas
		    if (EDR.admin.caseManagementEditCaseIdEncoded != '') {
		        EDR.admin.caseManagement.closeEditArea();
		    }
		    
			// See if we got an error
			var json = {};
			try {
				json = dojo.fromJson(response);
			} catch (e) {
				// json format error
			}
			if (typeof(json) == 'object') {
				if (json.caseError != null && json.caseError != "") {													
					EDR.util.alert(json.caseError);
  					//EDR.ajax.Error.handle(json.caseError, ioArgs);		
        			//EDR.admin.nav.refreshAdminPage();
					return;
				}
			} 
			
			EDR.admin.caseManagementEditCaseIdEncoded = caseIdEncoded;
			EDR.admin.caseManagementEditCaseId = caseId;
        	EDR.admin.caseManagementEditCaseIconPrefix = 'caseManagementActionIgnore_';
		
			var editArea = g('caseManagementEditArea_' + caseIdEncoded);
			if (editArea) {
			    // Select the icon
				var editIcon = g(EDR.admin.caseManagementEditCaseIconPrefix + caseIdEncoded);
				if (editIcon) {
					editIcon.className = 'actionItemDiv selected';
				}	
		    
		        // Show the new edit content
				editArea.innerHTML = response;
				EDR.admin.caseManagementEditWidgets = dojo.parser.parse(g('caseManagementTable'));
				
				editArea.style.display = '';
				
				dijit.byId("button-add-ignoretext").adjustButtonWidth();
				dijit.byId("button-copy-ignoretext").adjustButtonWidth();
			}	
		}

		EDR.ajax.Request.get(
			{
				url: EDR.Constants.APPLICATION_CONTEXT + "/case.do?action=showIgnoreText&caseId=" + encodeURIComponent(caseId),
				progressText: EDR.messages.K0001I_COMMON_PROGRESS_WAIT,
				successCallback: successCallback
			}
		);
	
	},
	
	// Populates and displays the copy ignore text dialog
	showCopyDialog: function() {

		var caseId = EDR.admin.caseManagementEditCaseId;
		
		function successCallback(response, ioArgs) {
		
			// See if we got an error
			var json = {};
			try {
				json = dojo.fromJson(response);
			} catch (e) {
				// json format error
			}
			
			if (typeof(json) == 'object' && json.copyCases != null && json.copyCases != "") {
				var copyCases = json.copyCases;
				var selectBox = g('copyIgnoreTextSource');
				selectBox.options.length = 0;
				for (var i = 0 ; i < copyCases.length ; i++) {
			 		selectBox.options[i] = new Option(copyCases[i], copyCases[i]);
			 	}
			} else {
				EDR.util.alert(EDR.messages.K0014I_IGNORE_COPY_ERROR_NONE);
				return;
			}
		
			g('copyIgnoreTextError').style.display = "none";
			g('copyIgnoreTextCaseId').value = caseId;
			EDR.dialog.util.showbyId(EDR.prefix+'copyIgnoreTextDialog');
		}
		
		EDR.ajax.Request.get(
			{ 
        		url: EDR.contextPath + "/case.do?action=getIgnoreTextCopySources&caseId=" + encodeURIComponent(caseId),
				successCallback: successCallback
			}
		);		
	
	},
	
	submitCopyIgnoreText: function() {
	
		function successCallback(response, ioArgs) {
			// See if we got an error
			var json = {};
			try {
				json = dojo.fromJson(response);
			} catch (e) {
				// json format error
			}
			if (typeof(json) == 'object') {
				if (json.ignoreTextError != null && json.ignoreTextError != "") {
					g('copyIgnoreTextError').innerHTML = json.ignoreTextError;
					g('copyIgnoreTextError').style.display = "block";
					return;					
				}
			}
			
			EDR.dialog.util.hide('copyIgnoreTextDialog');
			// refresh the ignore text div
			var editArea = g('caseManagementEditArea_' + EDR.admin.caseManagementEditCaseIdEncoded);
			editArea.innerHTML = response;
		}
		
		
		EDR.ajax.Request.get(
			{ 
        		url: EDR.contextPath + "/case.do?action=copyIgnoreText",
				formId: "copyIgnoreTextForm",
				successCallback: successCallback
			}
		);	
	
	
	},
	
	// Shows the add ignore text dialog
	showAddIgnoreDialog: function() {

		var caseId = EDR.admin.caseManagementEditCaseId;
		EDR.util.Form.clear('createIgnoreTextForm');
		g('createIgnoreTextError').style.display = "none";
		g('addIgnoreTextCaseId').value = caseId;
		EDR.dialog.util.showbyId(EDR.prefix+'createIgnoreTextDialog');	
	},
	
	// Submits the add ignore text dialog
	submitAddIgnoreText: function() {

		function successCallback(response, ioArgs) {
			// See if we got an error
			var json = {};
			try {
				json = dojo.fromJson(response);
			} catch (e) {
				// json format error
			}
			if (typeof(json) == 'object') {
				if (json.ignoreTextError != null && json.ignoreTextError != "") {
					g('createIgnoreTextError').innerHTML = json.ignoreTextError;
					g('createIgnoreTextError').style.display = "block";
					return;					
				}
			}
			
			EDR.dialog.util.hide('createIgnoreTextDialog');
			// refresh the ignore text div
			var editArea = g('caseManagementEditArea_' + EDR.admin.caseManagementEditCaseIdEncoded);
			editArea.innerHTML = response;
		}
		
		if (EDR.util.String.isWhitespace(g('createIgnoreName').value) ||
			EDR.util.String.isWhitespace(g('createIgnoreText').value)) {
			g('createIgnoreTextError').innerHTML = EDR.messages.K0013I_ERROR_FORM_ALL_REQUIRED;
			g('createIgnoreTextError').style.display = "block";
			return;	
		} else {
			g('createIgnoreTextError').style.display = "none";
		}
		
		EDR.ajax.Request.get(
			{ 
        		url: EDR.contextPath + "/case.do?action=addIgnoreTextNoValidate",
				formId: "createIgnoreTextForm",
				successCallback: successCallback
			}
		);	
	
	},
	
	// Deletes the selected ignore text
	deleteIgnoreText: function(name) {
	
		var caseId = EDR.admin.caseManagementEditCaseId;
		
		function successCallback(response, ioArgs) {
			// refresh the ignore text div
			var editArea = g('caseManagementEditArea_' + EDR.admin.caseManagementEditCaseIdEncoded);
			editArea.innerHTML = response;
		}
		
		EDR.ajax.Form.submit(
			{ 
        		url: EDR.contextPath + "/case.do?action=deleteIgnoreText&name=" + encodeURIComponent(name) + "&caseId=" + encodeURIComponent(caseId),
				progressText: EDR.messages.K0001I_COMMON_PROGRESS_WAIT,
				successCallback: successCallback
			}
		);	
	
	},
	
	modifyIgnoreText: function(name, text) {
	
		// Clear the form values
		EDR.util.Form.clear('modifyIgnoreForm');
		
		// Set the hidden form values
		g('modifyIgnoreFormCaseId').value = EDR.admin.caseManagementEditCaseId;
		g('modifyIgnoreFormOldName').value = name;
		g('modifyIgnoreFormNewName').value = name;
		g('modifyIgnoreFormNewText').value = text;
		
		g('modifyIgnoreError').style.display = "none";
		EDR.dialog.util.showbyId(EDR.prefix+'modifyIgnoreDialog');
	},
	
	submitModifyIgnoreText: function() {
	
		// Clear error message
		g('modifyIgnoreError').style.display = "none";
		
		// Callback function
		function successCallback(response, ioArgs) {
		
			// See if we got an error
			var json = {};
			try {
				json = dojo.fromJson(response);
			} catch (e) {
				// json format error
			}
			if (typeof(json) == 'object') {
				if (json.ignoreTextError != null && json.ignoreTextError != "") {
					g('modifyIgnoreError').innerHTML = json.ignoreTextError + "<p><p>";
					g('modifyIgnoreError').style.display = "block";
					return;
				}
			} 
			
        	// Close the dialog box
        	EDR.dialog.util.hide('modifyIgnoreDialog');
        	
        	// Refresh the ignore text pane
			if (EDR.admin.caseManagementEditCaseIdEncoded != '') {
				var editArea = g('caseManagementEditArea_' + EDR.admin.caseManagementEditCaseIdEncoded);
				editArea.innerHTML = response;
			}
			
		}
		
		// Submit the form
		EDR.ajax.Form.submit(
			{
        		url: EDR.contextPath + "/case.do?action=modifyIgnoreText",
				formId: "modifyIgnoreForm",
				successCallback: successCallback
			}
		);
	}
	

};



EDR.admin.cases.release = {
	releaseCaseScreen: function(caseIdEncoded, caseId, isImportable) {
	
		function successCallback(response, ioArgs) {
			// See if we got an error
			var json = {};
			try {
				json = dojo.fromJson(response);
			} catch (e) {
				// json format error
			}
			if (typeof(json) == 'object') {
				if (json.caseError != null && json.caseError != "") {													
					EDR.util.alert(json.caseError);
  					//EDR.ajax.Error.handle(json.caseError, ioArgs);		
					EDR.admin.nav.refreshAdminPage();
					return;
				}
			} 
			
	        EDR.admin.caseManagement.closeEditArea();
			dijit.byId(EDR.prefix+'adminMainContent').setContent(response);
			EDR.admin.nav.refreshAdminPage();
		}
		
		EDR.admin.caseManagementEditCaseIdEncoded = caseIdEncoded;
		EDR.admin.caseManagementEditCaseId = caseId;
		
		var confirmMessage = EDR.messages.K0014I_CASE_RELEASE_CONFIRM;
		if (typeof isImportable != 'undefined' && isImportable) {
			confirmMessage = EDR.messages.K0014I_CASE_IMPORTABLE_RELEASE_CONFIRM;
		}
		
		EDR.util.confirm(confirmMessage, function() { 
			EDR.ajax.Request.get(
					{
					url: EDR.Constants.APPLICATION_CONTEXT + "/case.do?action=releaseCase&caseId=" + encodeURIComponent(caseId),
					timeout: EDR.admin.longRunningProcessTimeOut,
					timeoutCallback: EDR.admin.caseManagement.timeoutCallback, 
					progressText: EDR.messages.K0001I_COMMON_PROGRESS_WAIT,
					successCallback: successCallback
					});
	    });
	}
};

EDR.admin.cases.commit = {
	currentEditIndex : -1,
	
    // User hit the commit icon, open the commit area
	commitCaseScreen: function(caseIdEncoded, caseId) {

		function successCallback(response, ioArgs) {
    		EDR.dialog.ProgressDialog.hide();

			// Close any open edit areas
		    if (EDR.admin.caseManagementEditCaseIdEncoded != '') {
		        EDR.admin.caseManagement.closeEditArea();
		    }
		    
			// See if we got an error
			var json = {};
			try {
				json = dojo.fromJson(response);
			} catch (e) {
				// json format error
			}
			if (typeof(json) == 'object') {
				if (json.caseError != null && json.caseError != "") {													
					EDR.util.alert(json.caseError);
  					//EDR.ajax.Error.handle(json.caseError, ioArgs);		
        			EDR.admin.nav.refreshAdminPage();
					return;
				}
			} 
			
			EDR.admin.caseManagementEditCaseIdEncoded = caseIdEncoded;
			EDR.admin.caseManagementEditCaseId = caseId;
        	EDR.admin.caseManagementEditCaseIconPrefix = 'caseManagementActionExport_';
		
			var editArea = g('caseManagementEditArea_' + caseIdEncoded);
			if (editArea) {
			    // Select the icon
				var editIcon = g(EDR.admin.caseManagementEditCaseIconPrefix + caseIdEncoded);
				if (editIcon) {
					editIcon.className = 'actionItemDiv selected';
				}	
		    
		        // Show the new edit content
				var editContent = document.createElement("div");
				editContent.className = 'caseManagementEditDiv'; 
				editContent.innerHTML = response;
				editArea.innerHTML = '';
				editArea.appendChild(editContent);
				
				EDR.admin.caseManagementEditWidgets = dojo.parser.parse(g('caseManagementTable'));
				
				editArea.style.display = '';
				g('caseManagementCommitFoldersDiv').style.display = '';
				dijit.byId(EDR.prefix+'caseManagement-button-commit').adjustButtonWidth();
				dijit.byId(EDR.prefix+'caseManagement-button-cancel').adjustButtonWidth();
				dijit.byId(EDR.prefix+'caseManagement-button-addDirectory').adjustButtonWidth();
				
				// Clear the list of commitFolders
				EDR.admin.commitFolders.length = 0;
				
				// If the jsp was pre-loaded with folders & flags, copy these into EDR.admin.commitFolders
				var tbody = g('caseManagementCommitTBody');		
				if (tbody && tbody.rows.length > 0) {				   
			        g('caseManagementCommitFolders').checked = true;
				    g('caseManagementCommitFoldersDiv').style.display = '';
				    
				    for (var i = 0 ; i < tbody.rows.length ; i++) {
				        var obj = {};
				        
				        var column0 = tbody.rows[i].getElementsByTagName("td")[0];
				        obj.folderName = EDR.util.String.trim(column0.innerHTML);
				        
				        obj.flagValues = [];
				        var column1 = tbody.rows[i].getElementsByTagName("td")[1];
				        var flags = column1.innerHTML;
				        var flagArray = flags.split(", ");
					    for (var j = 0 ; j < flagArray.length ; j++) {
						     obj.flagValues[obj.flagValues.length] = EDR.util.String.trim(flagArray[j]);
						}
				        
						EDR.admin.commitFolders[EDR.admin.commitFolders.length] = obj;
				    }
				} else {
			        g('caseManagementCommitFolders').checked = false;
				    g('caseManagementCommitFoldersDiv').style.display = 'none';
				}
				
				// set timeout to allow the browser to render 
				setTimeout(dojo.hitch(this, function(){
				    g('caseManagementCommitFolders').focus();
				}), 50); 
			}	
		}

		EDR.ajax.Request.get(
				{
					url: EDR.Constants.APPLICATION_CONTEXT + "/case.do?action=showCommitCasePage&caseId=" + encodeURIComponent(caseId),
					progressText: EDR.messages.K0001I_COMMON_PROGRESS_WAIT,
					successCallback: successCallback
				});
	}, 
	
	// Show the dialog that allows the user to enter folder name & to select flags
	showDialogForFolderAndFlags: function(caseId) {
		function successCallback(response, ioArgs) {
			var dlg = dijit.byId(EDR.prefix+'commitFlagsDialog');
		    dlg.connectOKButton(EDR.admin.cases.commit.submitCommitEmailFlags);
			EDR.dialog.util.setContent(dlg, response);
			dojo.connect(g('commitFlagsFolderName'), 'onkeypress', EDR.admin.cases.commit.submitOnEnterCommitEmailFlags);		
			g('commitFlagsError').innerHTML = ""; 
			EDR.dialog.util.show(dlg);  
		}

		if (typeof caseId == 'undefined') {
		   caseId = EDR.admin.caseManagementEditCaseId;
		}
		var refresh = "true";
		if (EDR.admin.commitFolders && EDR.admin.commitFolders.length > 0) {
		   refresh = "false";
		}
		EDR.ajax.Request.get(
				{
					url: EDR.Constants.APPLICATION_CONTEXT + "/flag.do?action=getFlagsForCommit&caseId=" + encodeURIComponent(caseId) + "&refresh=" + refresh,
					timeout: EDR.admin.longRunningProcessTimeOut,
					progressText: EDR.messages.K0001I_COMMON_PROGRESS_WAIT,
					successCallback: successCallback
				});
	},

    // Verify folder name & flag checkboxes on add/edit screen
	verifyCommitScreen: function(screenValues) {
		// Must select at least 1 flag
		if (screenValues.flagValues.length == 0) {
		    return EDR.messages.K0013E_ERROR_FLAG_REQUIRED;
		}
		
		// Folder required
		if (EDR.util.String.isWhitespace(screenValues.folderName)) {
		    return EDR.messages.K0013E_ERROR_FOLDER_REQUIRED;
		}
		
		// Folder already exists in eDM
		if (EDR.util.String.isInListAsName(screenValues.folderName, EDR.admin.ralFolders)) {
		    return EDR.messages.K0013E_ERROR_FOLDER_DUPLICATE;
		}
		
		// Already in the list to send to the server
		for (var i=0 ; i < EDR.admin.commitFolders.length ; i++) {
		    if (EDR.admin.commitFolders[i].folderName == screenValues.folderName) {
			    return EDR.messages.K0013E_ERROR_FOLDER_INLIST;
		    }
		}
		
		return null;
	},

	// Get the folder name & flag checkboxes on add/edit screen	
	getCommitScreenValues: function() {
	    var obj = {};
	    obj.folderName = EDR.util.String.trim(g('commitFlagsFolderName').value);  
	    
	    obj.flagValues = [];
	    for (var i=1 ; ; i++) {
	        var el = g('commitFlags-' + i + '_value');
	        if (!el) {
	            break;
	        } else {
	            if (el.value == 'true') {
			        var flagValue = g('commitFlags-' + i + '_flagvalue').value;
			        obj.flagValues[obj.flagValues.length] = flagValue; 
	            }
	        }
	    }
	    return obj;
	},
	
	submitOnEnterCommitEmailFlags: function(event) {		
		EDR.util.execOnEnter(event, EDR.admin.cases.commit.submitCommitEmailFlags);
	},
	
	// User hit the Save button on the Add dialog	
	submitCommitEmailFlags: function() {
		function successCallback(response, ioArgs) {
			var json = null;
			try {
				json = dojo.fromJson(response);
			} catch (e) {
				// json format error
			    EDR.util.alert(e);
			    return;
			}
			
			if (json != null && typeof(json) == 'object') {
				var err = g('commitFlagsError');
				if (json.caseError != null && json.caseError != "") {
					err.innerHTML = json.caseError;
					err.style.display = '';
				} else {
					err.innerHTML = '';
					EDR.admin.ralFolders = json.folders;
				    EDR.admin.cases.commit.processAddFolderScreen();
				}
			}
		}
		
		function errorCallback(response, ioArgs) {
		    // Getting the RAL folders probably timed out.  Cannot verify if this folder is a duplicate, but will still allow adding of it.
		    EDR.admin.cases.commit.processAddFolderScreen();
		}
		
	    if (!EDR.admin.ralFolders || EDR.admin.ralFolders.length == 0) {
			// Get the existing ralFolders
			var caseId = EDR.admin.caseManagementEditCaseId;
			EDR.ajax.Request.get(
				{
					url: EDR.Constants.APPLICATION_CONTEXT + "/case.do?action=exploreRALFoldersAsJSON&caseId=" + encodeURIComponent(caseId),
					timeout: EDR.admin.longRunningProcessTimeOut,
					progressText: EDR.messages.K0001I_COMMON_PROGRESS_WAIT,
					successCallback: successCallback
				});
				
		} else { 
		    EDR.admin.cases.commit.processAddFolderScreen();
		}
	},
	
	processAddFolderScreen: function() {
	    // Get screen values, verify, load table, & hide dialog
		var screenValues = EDR.admin.cases.commit.getCommitScreenValues();
		var errorMsg = EDR.admin.cases.commit.verifyCommitScreen(screenValues);				
		if (errorMsg) {
			var errDiv = g('commitFlagsError');
			if (errDiv) {
				errDiv.innerHTML = errorMsg;
				errDiv.style.display = '';
			} else {
			    EDR.util.alert(errorMsg);
			}	
		} else {
			EDR.admin.commitFolders[EDR.admin.commitFolders.length] = screenValues;
		    EDR.admin.cases.commit.loadCommitTable();			
			EDR.dialog.util.hide('commitFlagsDialog');  
		}
	},

	// Clicked an commit checkbox
	clickedCommitFlagCheckbox: function(checkboxId) {
	    var checkbox = document.getElementById(checkboxId);
    	var checkboxValues = checkbox.getAttribute('values').split(',');
		// Get current value
    	var hiddenElement = document.getElementById(checkboxId+'_value');
	    var hiddenElementValue = hiddenElement.value;
    	// Set status to the next one
	    var status = 1;
    	if (hiddenElementValue == checkboxValues[1]) {
        	status = 0;
	    }
	    // Set the hidden element to the new status value
    	hiddenElement.value = checkboxValues[status];
	    // Set the checkbox's checked & disabled properties based on the new status
	    if (status == 0) { 
	       checkbox.src = "images/check_kiso_unsel13.png";
	       checkbox.alt = EDR.messages.K0015I_TOOLTIP_CHECKBOX_COMMIT;
	    } else { 
	       checkbox.src = "images/check_kiso_sel13.png";
	       checkbox.alt = EDR.messages.K0015I_TOOLTIP_CHECKBOX_COMMIT_SELECTED;
	    }
	},
	
	loadCommitTable: function() {
		var tbody = g('caseManagementCommitTBody');		
		if (tbody) {				   
		   // Clear all the rows
		   while (tbody.rows.length>0) {
				tbody.deleteRow(0);
		   }		
		   
		   // Load the rows
		   if (EDR.admin.commitFolders) {
		      for (var i=0 ; i < EDR.admin.commitFolders.length ; i++) {
		          var obj = EDR.admin.commitFolders[i];
		          
			      var rowClass = "rowEven";
		          if (i%2 == 0) {
		             rowClass = "rowOdd";
		          }
			      var tableRow = document.createElement("tr");
				  tableRow.className = rowClass;
				  tbody.appendChild(tableRow);	
						  
				  // Column 1 (folderName)
				  var column1 = document.createElement("td");
				  column1.innerHTML = obj.folderName;
				  tableRow.appendChild(column1);	
						  
				  // Column 2 (flags)
				  var column2 = document.createElement("td");
				  var flagValues = obj.flagValues;
				  var data = '';
				  for (var j=0 ; j < flagValues.length ; j++) {
				       if (j != 0) {
				          data += ', ';
				       }
				       data += flagValues[j];
				  }
				  column2.innerHTML = data;
				  tableRow.appendChild(column2);	
				  
				  // Column3 (edit action)
				  var column3 = document.createElement("td");
				  column3.width = '1%';
				  tableRow.appendChild(column3);	
				  data = '<a title="' + EDR.messages.K0001I_COMMON_EDIT + '" href="javascript:;" onclick="EDR.admin.cases.commit.showEditDialog(\''; 
				  data += obj.folderName;
				  data += '\')"><img src="images/edit23.png" alt="' + EDR.messages.K0001I_COMMON_EDIT + '"/></a>'; 
				  column3.innerHTML = data;
				  tableRow.appendChild(column3);	
				  
				  // Column4 (delete action)
				  var column4 = document.createElement("td");
				  column4.width = '1%';
				  tableRow.appendChild(column4);	
				  data = '<a title="' + EDR.messages.K0001I_COMMON_DELETE + '" href="javascript:;" onclick="EDR.admin.cases.commit.deleteFolderFlags(\''; 
				  data += obj.folderName;
				  data += '\')"><img src="images/delete23.png" alt="' + EDR.messages.K0001I_COMMON_DELETE + '"/></a>'; 
				  column4.innerHTML = data;
				  tableRow.appendChild(column4);	
		      }
		   }
		}	
	},
	
	showEditDialog: function(folderName, caseId) {
		function successCallback(response, ioArgs) {
			var dlg = dijit.byId(EDR.prefix+'commitFlagsDialog');
		    dlg.connectOKButton(EDR.admin.cases.commit.submitCommitEditFolderFlags);
			EDR.dialog.util.setContent(dlg, response);
			dojo.connect(g('commitFlagsFolderName'), 'onkeypress', EDR.admin.cases.commit.submitOnEnterCommitEditFolderFlags);		
			g('commitFlagsError').innerHTML = "";
			
			// Set the folderName
			var folderNameEl = g('commitFlagsFolderName');
	    	folderNameEl.value = folderName;
	    	//folderNameEl.disabled = 'disabled';
	    	
	    	// Set the flagValues
		    for (var i=1 ; ; i++) {
		        var el = g('commitFlags-' + i + '_flagvalue');
	    	    if (!el) {
	        	    break;
		        } else {
		            var elValue = el.value;
					if (EDR.util.String.isInList(elValue, flagValues)) {
			            EDR.admin.cases.commit.clickedCommitFlagCheckbox('commitFlags-' + i);
			        }    
		        }
		    }
	    	
			EDR.dialog.util.show(dlg);  
		}

		if (typeof caseId == 'undefined') {
		   caseId = EDR.admin.caseManagementEditCaseId;
		}
		
     	EDR.admin.cases.commit.currentEditIndex = -1; 
		var flagValues = [];
	    for (var i = 0 ; i < EDR.admin.commitFolders.length ; i++) {
    	     var obj = EDR.admin.commitFolders[i];
        	 if (obj.folderName == folderName) {
	        	 EDR.admin.cases.commit.currentEditIndex = i; 
            	 flagValues = obj.flagValues;
	             break;
	         }
    	} 
    	
    	if (EDR.admin.cases.commit.currentEditIndex == -1) {
    	   EDR.util.alert('Cannot edit '+folderName+'.');
    	} else {
			EDR.ajax.Request.get(
				{
					url: EDR.Constants.APPLICATION_CONTEXT + "/flag.do?action=getFlagsForCommit&caseId=" + encodeURIComponent(caseId),
					progressText: EDR.messages.K0001I_COMMON_PROGRESS_WAIT,
					successCallback: successCallback
				});
    	}
	},
	
	submitOnEnterCommitEditFolderFlags: function(event) {		
		EDR.util.execOnEnter(event, EDR.admin.cases.commit.submitCommitEditFolderFlags);
	},
	
	// User hit the Save button on the Edit dialog	
	submitCommitEditFolderFlags: function() {
	    // Get screen values, verify, load table, & hide dialog
		var screenValues = EDR.admin.cases.commit.getCommitScreenValues();
		var err = null;
		// Must select at least 1 flag
		if (screenValues.flagValues.length == 0) {
			err = g('commitFlagsError');
		    err.innerHTML = EDR.messages.K0013E_ERROR_FLAG_REQUIRED;
		    err.style.display = '';
		    
		// Folder required    
		} else if (EDR.util.String.isWhitespace(screenValues.folderName)) {
			err = g('commitFlagsError');
		    err.innerHTML = EDR.messages.K0013E_ERROR_FOLDER_REQUIRED;
		    err.style.display = '';
		    
		// Folder already exists in eDM
		} else if (EDR.util.String.isInListAsName(screenValues.folderName, EDR.admin.ralFolders)) {
			err = g('commitFlagsError');
		    err.innerHTML = EDR.messages.K0013E_ERROR_FOLDER_DUPLICATE;
		    err.style.display = '';
		
		} else {
		    // Get the item in the list & replace it with the new screen values
		    if (EDR.admin.cases.commit.currentEditIndex > -1 && EDR.admin.cases.commit.currentEditIndex <= EDR.admin.commitFolders.length) {
		        EDR.admin.commitFolders[EDR.admin.cases.commit.currentEditIndex] = screenValues;
	    		EDR.admin.cases.commit.loadCommitTable();			
				EDR.dialog.util.hide('commitFlagsDialog');  
		    }
		}
	},
	
	// User hit the Delete icon 
	deleteFolderFlags: function(folderName) {
	    var newCommitFolders = [];
	    for (var i = 0 ; i < EDR.admin.commitFolders.length ; i++) {
	         var obj = EDR.admin.commitFolders[i];
	         if (obj.folderName != folderName) {
	             newCommitFolders[newCommitFolders.length] = obj;
	         }
	    } 
		EDR.admin.commitFolders = newCommitFolders;
		
	    EDR.admin.cases.commit.loadCommitTable();			
	}, 
	
	commitCase: function(caseId) {
		function successCallback(response, ioArgs) {
    		EDR.dialog.ProgressDialog.hide();
    		
			// See if we got an error
			var json = {};
			try {
				json = dojo.fromJson(response);
			} catch (e) {
				// json format error
			}
			if (typeof(json) == 'object') {
				if (json.caseError != null && json.caseError != "") {													
					EDR.util.alert(json.caseError);
  					//EDR.ajax.Error.handle(json.caseError, ioArgs);		
        			EDR.admin.nav.refreshAdminPage();
					return;
				}
			} 
			
			dijit.byId(EDR.prefix+'adminMainContent').setContent(response);
			
			EDR.admin.commitFolders = [];
			EDR.admin.caseManagementEditCaseIdEncoded = ""; 
			EDR.admin.caseManagementEditCaseId = ""; 
			EDR.admin.caseManagementEditCaseIconPrefix = "";
			
	       	// Refresh the case screen
			EDR.admin.nav.refreshAdminPage();
		}
	
		//if (confirm(EDR.messages.K0014I_CASE_EXPORT_CONFIRM)) {
		if (typeof caseId == 'undefined') {
		   caseId = EDR.admin.caseManagementEditCaseId;
		}
		
		// Create the URL
		var url = EDR.contextPath + '/case.do?action=exportCase&caseId=' + encodeURIComponent(caseId);
		
		// Add folder & flag values to the URL
		var commitFoldersCheckbox = g('caseManagementCommitFolders');
		if (commitFoldersCheckbox && commitFoldersCheckbox.checked) {
			for (var i=0 ; i < EDR.admin.commitFolders.length ; i++) {
			    var obj = EDR.admin.commitFolders[i];
		    
				// Add folder to the URL
    	    	url += '&folderName' + i + '=' + encodeURIComponent(obj.folderName);
    	    
	    	    // Add flag values to the URL
				var setFlagValues = obj.flagValues;
				for (var j = 0 ; j < setFlagValues.length ; j++) {
					url += '&flagValue' + i + '=' + encodeURIComponent(setFlagValues[j]);
				}
			}
		}
		
		EDR.ajax.Request.get(
			{
				url: url,
				timeout: EDR.admin.longRunningProcessTimeOut,
				timeoutCallback: EDR.admin.caseManagement.timeoutCallback, 
				progressText: EDR.messages.K0014I_CASE_EXPORT_PROGRESS,
				successCallback: successCallback
			});
	}
	
};

/**
 * Functions related to remote node management
 */
EDR.admin.nodes = {

	showAddNodeDialog: function() {
		EDR.util.Form.clear('addNodeForm');
		g('addNodeError').style.display = "none";
		EDR.dialog.util.showbyId(EDR.prefix+'addNodeDialog');
	},
	
	validateAddNode: function(form) {
		
		g('addNodeError').style.display = "none";
		
		// Make sure every field has a value
		if (form.nodeNameField.value == null || EDR.util.String.trim(form.nodeNameField.value) == "" || 
			form.nodePort.value == null || EDR.util.String.trim(form.nodePort.value) == "" ||
			form.nodeUser.value == null || EDR.util.String.trim(form.nodeUser.value) == "" ||
			form.nodePassword.value == null || EDR.util.String.trim(form.nodePassword.value) == "") {
		
			g('addNodeError').innerHTML = EDR.messages.K0013I_ERROR_FORM_ALL_REQUIRED;
			g('addNodeError').style.display = "block";
			return false;
		
		}
		
		// Make sure the port is an integer
		if (parseInt(form.nodePort.value, 10) != form.nodePort.value - 0) {
			g('addNodeError').innerHTML = EDR.messages.K0013I_ERROR_PORT_NAN;
			g('addNodeError').style.display = "block";
			return false;
		}
		
		return true;
	
	},
	
	
	testAddNode: function() {
		
		if (!EDR.admin.nodes.validateAddNode(f('addNodeForm'))) {
			return false;
		}
		
		function successCallback(response, ioArgs) {
			// See if we got an error
			var json = {};
			try {
				json = dojo.fromJson(response);
			} catch (e) {
				// json format error
			}
			if (typeof(json) == 'object') {
				if (json.nodeError != null && json.nodeError != "") {
					g('addNodeError').innerHTML = json.nodeError;
					g('addNodeError').style.display = "block";
					return;					
				} else if (json.nodeSuccess != null && json.nodeSuccess != "") {
					EDR.util.alert(json.nodeSuccess);
				}
			} 
			
		}
		
		EDR.ajax.Form.submit(
			{ 
        		url: EDR.contextPath + "/nodeManagement.do?action=testAddNode",
				formId: "addNodeForm",
				successCallback: successCallback
			}
		);	
		
		
	},
	
	
	validateModifyNode: function(form) {
		
		g('modifyNodeError').style.display = "none";
		
		// Make sure every field has a value
		if (form.newNodeName.value == null || EDR.util.String.trim(form.newNodeName.value) == "" || 
			form.newNodePort.value == null || EDR.util.String.trim(form.newNodePort.value) == "" ||
			form.newNodeUser.value == null || EDR.util.String.trim(form.newNodeUser.value) == "" ||
			form.newNodePassword.value == null || EDR.util.String.trim(form.newNodePassword.value) == "") {
		
			g('modifyNodeError').innerHTML = EDR.messages.K0013I_ERROR_FORM_ALL_REQUIRED;
			g('modifyNodeError').style.display = "block";
			return false;
		
		}
		
		// Make sure the port is an integer
		if (parseInt(form.newNodePort.value, 10) != form.newNodePort.value - 0) {
			g('modifyNodeError').innerHTML = EDR.messages.K0013I_ERROR_PORT_NAN;
			g('modifyNodeError').style.display = "block";
			return false;
		}
		
		return true;
	
	},
	
	submitAddNode: function() {
		
		if (!EDR.admin.nodes.validateAddNode(f('addNodeForm'))) {
			return false;
		}
		
		function successCallback(response, ioArgs) {
			// See if we got an error
			var json = {};
			try {
				json = dojo.fromJson(response);
			} catch (e) {
				// json format error
			}
			if (typeof(json) == 'object') {
				if (json.nodeError != null && json.nodeError != "") {
					g('addNodeError').innerHTML = json.nodeError;
					g('addNodeError').style.display = "block";
					return;					
				}
			} 
			
        	EDR.dialog.util.hide('addNodeDialog');
			EDR.admin.nav.refreshAdminPage();
		}
		
		EDR.ajax.Form.submit(
			{ 
        		url: EDR.contextPath + "/nodeManagement.do?action=addNode",
				formId: "addNodeForm",
				successCallback: successCallback
			}
		);	
		
	},
	
	// This method reads the current node information
	// from the server and displays a dialog where the user can
	// change this information
	showModifyNodeDialog: function(name, port) {

		function successCallback(response, ioArgs) {
			
			var json = {};
			try {
				json = dojo.fromJson(response);
			} catch (e) {
				// json format error
			}
			if (typeof(json) == 'object') {
				// See if we got an error
				if (json.nodeError != null && json.nodeError != "") {
					EDR.util.alert(json.nodeError);
					return;					
				}
        	
        		var modifyForm = f('modifyNodeForm');
        		modifyForm.oldNodeName.value = name;
        		modifyForm.oldNodePort.value = port;
        		modifyForm.newNodeName.value = name;
        		modifyForm.newNodePort.value = port;
        		modifyForm.newNodeUser.value = json.nodeUser;
        		modifyForm.newNodePassword.value = json.nodePassword;
	        	EDR.dialog.util.showbyId(EDR.prefix+'modifyNodeDialog');
	        }

		}
		
		var ajaxUrl = EDR.Constants.APPLICATION_CONTEXT + "/nodeManagement.do?action=read&nodeName=";
		ajaxUrl = ajaxUrl + encodeURIComponent(name) + "&nodePort=" + encodeURIComponent(port);
		EDR.ajax.Request.get(
			{
				url: ajaxUrl,
				successCallback: successCallback
			}
		);
	
	},
	
	// This is called when the user attempts to save changes to the node setup
	submitModifyNode: function() {
		
		if (!EDR.admin.nodes.validateModifyNode(f('modifyNodeForm'))) {
			return false;
		}
		
		function successCallback(response, ioArgs) {
			// See if we got an error
			var json = {};
			try {
				json = dojo.fromJson(response);
			} catch (e) {
				// json format error
			}
			if (typeof(json) == 'object') {
				if (json.nodeError != null && json.nodeError != "") {
					g('modifyNodeError').innerHTML = json.nodeError;
					g('modifyNodeError').style.display = "block";
					return;					
				}
			} 
			
        	EDR.dialog.util.hide('modifyNodeDialog');
			EDR.admin.nav.refreshAdminPage();
		}
		
		EDR.ajax.Form.submit(
			{ 
        		url: EDR.contextPath + "/nodeManagement.do?action=modifyNode",
				formId: "modifyNodeForm",
				successCallback: successCallback
			}
		);	
		
	},
	
	// This method activates the selected node
	activateNode: function(name, port) {
	
		function successCallback(response, ioArgs) {
			// See if we got an error
			var json = {};
			try {
				json = dojo.fromJson(response);
			} catch (e) {
				// json format error
			}
			if (typeof(json) == 'object') {
				if (json.nodeError != null && json.nodeError != "") {
					EDR.util.alert(json.nodeError);
					return;					
				}
			} 
			
			dijit.byId(EDR.prefix+'adminMainContent').setContent(response);
		}
		
		var ajaxUrl = EDR.Constants.APPLICATION_CONTEXT + "/nodeManagement.do?action=activateNode&nodeName=";
		ajaxUrl = ajaxUrl + encodeURIComponent(name) + "&nodePort=" + encodeURIComponent(port);
		EDR.ajax.Request.get(
			{
				url: ajaxUrl,
				successCallback: successCallback
			}
		);

	},
	
	// This method deactivates the selected node
	deactivateNode: function(name, port) {
	
		function successCallback(response, ioArgs) {
			// See if we got an error
			var json = {};
			try {
				json = dojo.fromJson(response);
			} catch (e) {
				// json format error
			}
			if (typeof(json) == 'object') {
				if (json.nodeError != null && json.nodeError != "") {
					EDR.util.alert(json.nodeError);
					return;					
				}
			} 
			
			dijit.byId(EDR.prefix+'adminMainContent').setContent(response);
		}
		
		var ajaxUrl = EDR.Constants.APPLICATION_CONTEXT + "/nodeManagement.do?action=deactivateNode&nodeName=";
		ajaxUrl = ajaxUrl + encodeURIComponent(name) + "&nodePort=" + encodeURIComponent(port);
		EDR.ajax.Request.get(
			{
				url: ajaxUrl,
				successCallback: successCallback
			}
		);

	},
	
	// This method attempts to ping the selected node to see if it can connect
	testConnection: function(name, port) {
	
		function successCallback(response, ioArgs) {
			// See if we got an error
			var json = {};
			try {
				json = dojo.fromJson(response);
			} catch (e) {
				// json format error
			}
			if (typeof(json) == 'object') {
				if (json.nodeError != null && json.nodeError != "") {
					EDR.util.alert(json.nodeError);
				} else {
					EDR.util.alert(json.nodeSuccess);
				}
			} 
		}
		
		var ajaxUrl = EDR.Constants.APPLICATION_CONTEXT + "/nodeManagement.do?action=testConnection&nodeName=";
		ajaxUrl = ajaxUrl + encodeURIComponent(name) + "&nodePort=" + encodeURIComponent(port);
		EDR.ajax.Request.get(
			{
				url: ajaxUrl,
				successCallback: successCallback
			}
		);

	},
	
	// This method activates the selected node
	deleteNode: function(name, port) {
	
		function successCallback(response, ioArgs) {
			// See if we got an error
			var json = {};
			try {
				json = dojo.fromJson(response);
			} catch (e) {
				// json format error
			}
			if (typeof(json) == 'object') {
				if (json.nodeError != null && json.nodeError != "") {
					EDR.util.alert(json.nodeError);
					return;					
				}
			} 
			
			dijit.byId(EDR.prefix+'adminMainContent').setContent(response);
		}
		
		var ajaxUrl = EDR.Constants.APPLICATION_CONTEXT + "/nodeManagement.do?action=deleteNode&nodeName=";
		ajaxUrl = ajaxUrl + encodeURIComponent(name) + "&nodePort=" + encodeURIComponent(port);
		EDR.ajax.Request.get(
			{
				url: ajaxUrl,
				successCallback: successCallback
			}
		);


	}

};



EDR.admin.file = {

	currentDir : "",
	
	// Opens the file browser and navigates to the root directory
	openBrowseDialog: function() {	
		this.exploreDirectory("/");		
	},
	
	// Hides the browse dialog
	closeBrowseDialog: function() {
		EDR.dialog.util.hide('browseDialog');

	},
	
	openDir: function() {
		myDirList = g('directoryBrowseList');
		this.exploreDirectory(myDirList.options[myDirList.selectedIndex].value);
	},
	
	setDirField: function() {
		var myDirList = g('directoryBrowseList');
		var newDir = myDirList.options[myDirList.selectedIndex].value;
		var inputField = g('currentDir');
		var newPath = EDR.admin.currentDir;
		
		if (newDir != "[..]") {
			if (inputField.value != "") {
				if (newPath.indexOf("/") == 0) {
					// Must be Linux
					if (newPath.lastIndexOf("/") != (newPath.length - 1)) {
						newPath = newPath + "/";
					}
			
				} else {
					// Assume a Windows system
					if (newPath.lastIndexOf("\\") != (newPath.length - 1)) {
						newPath = newPath + "\\";
					}
				}
			}
		
			newPath = newPath + newDir;
			inputField.value = newPath;
		} else {
			inputField.value = newPath;
		}	
	},
	
	// Navigates to path and puts the list of child directories into the browse dialog 
	exploreDirectory: function(path) {

		var actionUrl = EDR.contextPath + "/crawler.do?action=exploreDirectory&path=" + encodeURIComponent(path);
		function successCallback(response, ioArgs) {
        	// Refresh the browse dialog list
			g('browseDialogDataDiv').innerHTML = response;
			var inputField = g('currentDir');
			EDR.admin.currentDir = inputField.value;
			// If the dialog is not already visible, show it
			if (g('browseDialog').style.display != "block") {
				EDR.dialog.util.showbyId(EDR.prefix+'browseDialog');
			}
		}
		
		EDR.ajax.Form.submit(
			{ 
        		url: actionUrl,
        		form: "",
				successCallback: successCallback,
				showProgress: false
			}
		);	
		

	},
	
	// Copies the path from the browse dialog to the add directory dialog
	setDirectoryPath: function() {
	
		var inputField = g('currentDir');
		g('directoryPath').value = inputField.value;
		EDR.dialog.util.hide('browseDialog');
	
	},
	
	// Issues an ajax call to add the directory to the selected case
	addDirectory: function() {
		
		var inputField = g('directoryPath');
		var actionUrl = EDR.contextPath + "/crawler.do?action=addDirectory&path=" + encodeURIComponent(inputField.value);
		actionUrl = actionUrl + "&caseId=" + encodeURIComponent(EDR.admin.selectedCase);
		EDR.dialog.util.hide('addDirectoryDialog');

		function successCallback(response, ioArgs) {
			// Refreshes the directory list screen
			dijit.byId(EDR.prefix+'adminMainContent').setContent(response);
			
		}
		
		EDR.ajax.Form.submit(
			{ 
        		url: actionUrl,
        		form: "",
				successCallback: successCallback
			}
		);	
	
	},
	
	// Issues an ajax call to remove the directory from the selected case
	removeDirectory: function(directory) {
		
		var actionUrl = EDR.contextPath + "/crawler.do?action=removeDirectory&path=" + encodeURIComponent(directory);
		actionUrl = actionUrl + "&caseId=" + encodeURIComponent(EDR.admin.selectedCase);

		function successCallback(response, ioArgs) {
			// Refreshes the directory list screen
			dijit.byId(EDR.prefix+'adminMainContent').setContent(response);
			
		}
		
		EDR.util.confirm(EDR.messages.K0014I_FILES_DELETE_CONFIRM, function() {
		
			EDR.ajax.Form.submit(
				{ 
        			url: actionUrl,
        			form: "",
					successCallback: successCallback
				}
			);
		});	
	
	},
	
	// Starts the file crawler for the given case ID
	startCrawler: function() {

		var actionUrl = EDR.contextPath + "/crawler.do?action=startFileCrawler";
		actionUrl = actionUrl + "&caseId=" + encodeURIComponent(EDR.admin.selectedCase);

		function successCallback(response, ioArgs) {
			// Refreshes the directory list screen
			dijit.byId(EDR.prefix+'adminMainContent').setContent(response);
			
		}
		
		EDR.ajax.Form.submit(
			{ 
        		url: actionUrl,
        		form: "",
				successCallback: successCallback
			}
		);	
	
	
	
	},
	
	// Stops the file crawler for the given case ID
	stopCrawler: function() {
	
		var actionUrl = EDR.contextPath + "/crawler.do?action=stopFileCrawler";
		actionUrl = actionUrl + "&caseId=" + encodeURIComponent(EDR.admin.selectedCase);

		function successCallback(response, ioArgs) {
			// Refreshes the directory list screen
			dijit.byId(EDR.prefix+'adminMainContent').setContent(response);
			
		}
		
		EDR.ajax.Form.submit(
			{ 
        		url: actionUrl,
        		form: "",
				successCallback: successCallback
			}
		);	
	
	
	}
	
};


EDR.admin.RAL = {

	openRALFolderBrowseDialog: function(caseId) {	
		function successCallback(response, ioArgs) {
		    var dlg = dijit.byId(EDR.prefix+'browseRALFoldersDialog');
			EDR.dialog.util.setContent(dlg, response);
		    g('ralFoldersBrowseStatus').style.display = 'none';
			// Select the currentFolderName
			var currentFolderName = g('commitFlagsFolderName').value;
			var myRALFolderList = g('ralFoldersBrowseList');
			myRALFolderList.selectedIndex = 0;
			if (currentFolderName) {
			    currentFolderName = EDR.util.String.trim(currentFolderName);
			    if (!EDR.util.String.isEmpty(currentFolderName)) {
 					for (var i = 0 ; i < myRALFolderList.length ; i++) {
					    if (myRALFolderList[i].value == currentFolderName) {
				    	   myRALFolderList.selectedIndex = i;
					       break;
					    }   
				    }   
			    }
			}
			EDR.dialog.util.show(dlg);
		}
		
		if (typeof caseId == 'undefined') {
		   caseId = EDR.admin.caseManagementEditCaseId;
		}
		var actionUrl = EDR.contextPath + "/case.do?action=exploreRALFolders&caseId=" + encodeURIComponent(caseId);
		EDR.ajax.Form.submit(
			{ 
        		url: actionUrl,
        		form: "",
				timeout: EDR.admin.longRunningProcessTimeOut,
				successCallback: successCallback,
				showProgress: false
			}
		);	
	},
	
	// Copies the folder from the browse dialog to the commit & add folder dialog
	setRALFolder: function() {
		var myRALFolderList = g('ralFoldersBrowseList');
		var selectedRALFolder = myRALFolderList.options[myRALFolderList.selectedIndex].value;
		g('commitFlagsFolderName').value = selectedRALFolder;
		EDR.dialog.util.hide('browseRALFoldersDialog');
	},

	// Starts the file crawler for the given case ID
	startCrawler: function() {

		var actionUrl = EDR.contextPath + "/crawler.do?action=startRALCrawler";
		actionUrl = actionUrl + "&caseId=" + encodeURIComponent(EDR.admin.selectedCase);

		function successCallback(response, ioArgs) {
			var json = {};
			try {
				json = dojo.fromJson(response);
			} catch (e) {
				// json format error
			}
			if (typeof(json) == 'object') {
				if (json.caseError != null && json.caseError != "") {
					EDR.util.alert(json.caseError);
   					//EDR.ajax.Error.handle(json.caseError, ioArgs);		
        			EDR.admin.nav.refreshAdminPage();
					return;					
				}
			} 
			
			// Refreshes the directory list screen
			dijit.byId(EDR.prefix+'adminMainContent').setContent(response);
		}
		
		EDR.ajax.Form.submit(
			{ 
        		url: actionUrl,
        		form: "",
				successCallback: successCallback
			}
		);	
	
	
	
	},
	
	// Stops the file crawler for the given case ID
	stopCrawler: function() {
	
		var actionUrl = EDR.contextPath + "/crawler.do?action=stopRALCrawler";
		actionUrl = actionUrl + "&caseId=" + encodeURIComponent(EDR.admin.selectedCase);

		function successCallback(response, ioArgs) {
			// Refreshes the directory list screen
			dijit.byId(EDR.prefix+'adminMainContent').setContent(response);
			
		}
		
		EDR.ajax.Form.submit(
			{ 
        		url: actionUrl,
        		form: "",
				successCallback: successCallback
			}
		);	
	
	
	}



};


EDR.admin.System = {

    about: function() {
		function successCallback(response, ioArgs) {
			var dlg = dijit.byId(EDR.prefix+'about-dialog');
			dlg.setContent(response);
			EDR.dialog.util.show(dlg);  
		}
		
		EDR.ajax.Request.get(
			{ 
       			url: EDR.contextPath + "/system.do?action=about",
       			sync: true,
       			showProgress: false,
				successCallback: successCallback
			}
		);
    },
    
	logout: function() {
		EDR.ajax.Request.get(
			{ 
       			url: EDR.contextPath + "/logout.do?action=logout",
       			showProgress: false
			}
		); 
		//window.location = EDR.contextPath;
    },
    
	shutdown: function() {

		var actionUrl = EDR.contextPath + "/admin.do?action=shutdown";

		function successCallback(response, ioArgs) {
			// Indicate to the user that the server was stopped
			EDR.util.alert(EDR.messages.K0014I_SHUTDOWN_COMPLETE);
			// Cancel any pending refresh timers
			clearTimeout(EDR.admin.nav.refreshTimer);
		}
		
		if (confirm(EDR.messages.K0014I_SHUTDOWN_CONFIRM)) {
			EDR.ajax.Form.submit(
				{ 
        			url: actionUrl,
        			form: "",
					successCallback: successCallback
				}
			);
		}		
	
	}

};


EDR.admin.flags = {

	showAddFlagDialog: function() {
		EDR.util.Form.clear('addFlagForm');
		g('addFlagError').style.display = "none";
		g('addFlagCaseId').value = EDR.admin.caseManagementEditCaseId;
		EDR.admin.flags.loadAvailableFlagsTable();
		EDR.dialog.util.showbyId(EDR.prefix+'addFlagDialog');	
	},
	
	// This method will get a table of all flags that don't belong
	// to the selected case
	loadAvailableFlagsTable: function() {
		
		function successCallback(response, ioArgs) {
		
			g('add-flag-existing-form').innerHTML = response;
		
		}
	
		g('add-flag-existing-form').innerHTML = EDR.messages.K0001I_COMMON_PROGRESS_WAIT;
		var ajaxUrl = EDR.Constants.APPLICATION_CONTEXT + "/flag.do?action=getAvailableFlags&caseId=";
		ajaxUrl = ajaxUrl + encodeURIComponent(EDR.admin.caseManagementEditCaseId);

		EDR.ajax.Request.get(
			{
				url: ajaxUrl,
				showProgress: false,
				successCallback: successCallback
			}
		);	
					
	},
	
	showCorrectAddFlagForm: function() {
		if (g('new-flag-radio-button').checked == false) {
			g('add-flag-existing-form').style.display = "";
			g('add-flag-new-form').style.display = "none";
		} else {
			g('add-flag-existing-form').style.display = "none";
			g('add-flag-new-form').style.display = "";
		}
	
	},
	
	// This function will add a flag to the list of default flags
	submitAddFlag: function() {
	
		function successCallback(response, ioArgs) {
			// See if we got an error
			var json = {};
			try {
				json = dojo.fromJson(response);
			} catch (e) {
				// json format error
			}
			
			if (typeof(json) == 'object') {
				if (json.flagError != null && json.flagError != "") {
					g('addFlagError').innerHTML = json.flagError;
					g('addFlagError').style.display = "block";
					return;					
				}
			} 
			
			// No error, close the dialog and refresh the display
        	EDR.dialog.util.hide('addFlagDialog');
        	
        	// Refresh the flag management screen
        	if (g('addFlagCaseId').value == "") {
				dijit.byId(EDR.prefix+'adminMainContent').setContent(response);
			} else if (EDR.admin.caseManagementEditCaseIconPrefix == 'caseManagementActionFlags_') {
				// refresh the flag management case div
				var editArea = g('caseManagementEditArea_' + EDR.admin.caseManagementEditCaseIdEncoded);
				editArea.innerHTML = response;
			}
			
		}
	    
	    // Make sure the user either selected a flag or entered a name for a new flag
	    if (g('new-flag-radio-button').checked == true) {
	    	if (EDR.util.String.isEmpty(g('newFlagName').value)) {
	    		g('addFlagError').innerHTML = EDR.messages.K0014I_ERROR_NAME_REQUIRED;
	    		g('addFlagError').style.display = "";
	    		return;
	    	}
	    } else {
	    	var checkboxes = g('addFlagForm').existingFlagName;
	    	var isChecked = false;
	    	
	    	if (checkboxes == null) {
	    		g('addFlagError').innerHTML = EDR.messages.K0014I_FLAG_CREATE_DEFAULT_NONESELECTED;
	    		g('addFlagError').style.display = "";
	    		return;
	    	}
	    	
	    	if (checkboxes.checked == true) {
	    		isChecked = true;
	    	} else {
		    	for (var i = 0; i < checkboxes.length; i++) {
		    		if (checkboxes[i].checked) {
		    			isChecked = true;
		    			break;
		    		}	    	
		    	}
	    	}
	    	
	    	if (!isChecked) {
	    		g('addFlagError').innerHTML = EDR.messages.K0014I_FLAG_CREATE_DEFAULT_NONESELECTED;
	    		g('addFlagError').style.display = "";
	    		return;
	    	}
	    }
	    
	    g('addFlagError').style.display = "none";
		var ajaxUrl = EDR.Constants.APPLICATION_CONTEXT + "/flag.do?action=addFlag";
		
		// Submit the form
		EDR.ajax.Form.submit(
			{
        		url: ajaxUrl,
				formId: "addFlagForm",
				successCallback: successCallback
			}
		);	
	},
	
	
	// This function will delete a flag from the list of default flags
	deleteDefaultFlag: function(flagName) {
	
		function successCallback(response, ioArgs) {
        	
        	// Refresh the flag management screen
			dijit.byId(EDR.prefix+'adminMainContent').setContent(response);
			
		}
	    
		var ajaxUrl = EDR.Constants.APPLICATION_CONTEXT + "/flag.do?action=deleteDefaultFlag&flagName=";
		ajaxUrl = ajaxUrl + encodeURIComponent(flagName);
		
		// Submit the request
		EDR.ajax.Form.submit(
			{
        		url: ajaxUrl,
				formId: "",
				successCallback: successCallback
			}
		);	
	},
	
	// This function will display the manage flags controls
	// inline in the manage cases table
	showManageFlagDiv: function(caseIdEncoded, caseId) {

		function successCallback(response, ioArgs) {

			// Close any open edit areas
		    if (EDR.admin.caseManagementEditCaseIdEncoded != '') {
		        EDR.admin.caseManagement.closeEditArea();
		    }
		    
			EDR.admin.caseManagementEditCaseIdEncoded = caseIdEncoded;
			EDR.admin.caseManagementEditCaseId = caseId;
        	EDR.admin.caseManagementEditCaseIconPrefix = 'caseManagementActionFlags_';
		
			var editArea = g('caseManagementEditArea_' + caseIdEncoded);
			if (editArea) {
			    // Select the icon
				var editIcon = g(EDR.admin.caseManagementEditCaseIconPrefix + caseIdEncoded);
				if (editIcon) {
					editIcon.className = 'actionItemDiv selected';
				}	
		    
		        // Show the new edit content
				editArea.innerHTML = response;
				
				EDR.admin.caseManagementEditWidgets = dojo.parser.parse(g('caseManagementTable'));
				
				editArea.style.display = '';
				
				dijit.byId("button-add-flag").adjustButtonWidth();
			}	
		}

		EDR.ajax.Request.get(
			{
				url: EDR.Constants.APPLICATION_CONTEXT + "/flag.do?action=show&caseId=" + encodeURIComponent(caseId),
				progressText: EDR.messages.K0001I_COMMON_PROGRESS_WAIT,
				successCallback: successCallback
			}
		);
	
	
	},
	
	deleteFlag: function(flagName) {
	
		function successCallback(response, ioArgs) {
			
			// See if we got an error
			var json = {};
			try {
				json = dojo.fromJson(response);
			} catch (e) {
				// json format error
			}

			if (typeof(json) == 'object' && json.flagError != null && json.flagError != "") {
				EDR.util.alert(json.flagError);
				return;					
			} else {
				if (EDR.admin.caseManagementEditCaseIconPrefix == 'caseManagementActionFlags_') {
					// refresh the flag management case div
					var editArea = g('caseManagementEditArea_' + EDR.admin.caseManagementEditCaseIdEncoded);
					editArea.innerHTML = response;
				}
			}
		
		}
		
		// Confirm that we want to delete the flag
		EDR.util.confirm(EDR.messages.K0014I_FLAG_DELETE_CONFIRM, function() {
		
			// Construct the action URL
			var actionUrl = EDR.contextPath + "/flag.do?action=delete&caseId=" + encodeURIComponent(EDR.admin.caseManagementEditCaseId) + "&flagName=" + encodeURIComponent(flagName);

			EDR.ajax.Request.get(
				{
					url: actionUrl,
					progressText: EDR.messages.K0001I_COMMON_PROGRESS_WAIT,
					successCallback: successCallback
				}
			);			

		});
	},
	
	modifyFlag: function(flagName, flagDescription) {
	
		// Clear the form values
		EDR.util.Form.clear('modifyFlagForm');
		
		// Set the hidden form values
		dojo.byId(EDR.prefix+'modifyFlagFormCaseId').value = EDR.admin.caseManagementEditCaseId;
		dojo.byId(EDR.prefix+'modifyFlagFormOldFlagName').value = flagName;
		dojo.byId(EDR.prefix+'modifyFlagFormNewFlagName').value = flagName;
		dojo.byId(EDR.prefix+'modifyFlagFormNewFlagDescription').value = flagDescription;
		
		g(EDR.prefix+'modifyFlagError').style.display = "none";
		EDR.dialog.util.showById(EDR.prefix+'modifyFlagDialog');
	},
	
	submitModifyFlag: function() {
	
		// Clear error message
		g('modifyFlagError').style.display = "none";
		
		// Callback function
		function successCallback(response, ioArgs) {
		
			// See if we got an error
			var json = {};
			try {
				json = dojo.fromJson(response);
			} catch (e) {
				// json format error
			}
			if (typeof(json) == 'object') {
				if (json.flagError != null && json.flagError != "") {
					g('modifyFlagError').innerHTML = json.flagError + "<p><p>";
					g('modifyFlagError').style.display = "block";
					return;
				}
			} 
			
        	// Close the dialog box
        	EDR.dialog.util.hide('modifyFlagDialog');
        	
        	// Refresh the flag management pane
        	if (g('modifyFlagFormCaseId').value == "") {
				dijit.byId(EDR.prefix+'adminMainContent').setContent(response);
			} else {
				if (EDR.admin.caseManagementEditCaseIdEncoded != '') {
					var editArea = g('caseManagementEditArea_' + EDR.admin.caseManagementEditCaseIdEncoded);
					editArea.innerHTML = response;
				}
			}
			
		}
		
		// Submit the form
		EDR.ajax.Form.submit(
			{
        		url: EDR.contextPath + "/flag.do?action=modify",
				formId: "modifyFlagForm",
				successCallback: successCallback
			}
		);
	}
	

	
};


EDR.admin.caseManagement = {
	timeoutCallback: function(response, ioArgs) {
	
       	EDR.ajax.Error.handle(response, ioArgs);
       	
		if (EDR.admin.currentPage == "nav-system-casemanagement") {
		    //setTimeout(function() { EDR.admin.caseManagement.refresh(false) }, 5000);
			//EDR.admin.nav.refreshTimer = setTimeout(function() { EDR.admin.caseManagement.refresh(false) }, 5000);
			EDR.admin.nav.refreshAdminPage();
		}	
	}, 
	
	// Continue refreshing the case screen until/unless the user navigates away
	refresh: function(firstRefresh) {
	
		function successCallback(response, ioArgs) {
			if (EDR.admin.currentPage == "nav-system-casemanagement") {
				
				if (EDR.admin.skipRefresh == true) {
					// Skip this refresh and schedule another one
					EDR.admin.skipRefresh = false;
					EDR.admin.nav.refreshTimer = setTimeout(function() { EDR.admin.caseManagement.refresh(false) }, 5000);
					return;	
				}
				
				// Stop refreshing?
				if (EDR.admin.stopRefresh == true) {
					return;
				}
				
				var json = {};
				try {
					json = dojo.fromJson(response);
				} catch (e) {
					// json format error
					json = null; 
				}
				
				if (json != null && typeof(json) == 'object') { 
				   	var availableCases = json.availableCases;
				   
			       	EDR.admin.caseManagement.updateAvailableCasesData(availableCases);
				   
				} else {
					// Error, just retry
					EDR.admin.nav.refreshTimer = setTimeout(function() { EDR.admin.caseManagement.refresh(false) }, 5000);
				
				}
			}
		}
		
		function errorCallback(response, ioArgs) {
			if (ioArgs && ioArgs.xhr) {
			    var status = -1;
				try {
				  status = ioArgs.xhr.status;
				} catch (e) {
				}
			    if (status != 0) { // ignore status == 0 & response.dojoType == 'timeout'
			        var dojoType = '';
			        try {
			           dojoType = response.dojoType;
			        } catch (e) {
			        }
			        if (dojoType) {
						if ( dojoType != 'timeout' ) {
							EDR.ajax.Error.handle(response, ioArgs);
						} else {
							// For timeouts, just try again
							if (EDR.admin.currentPage == "nav-system-casemanagement") {
								EDR.admin.nav.refreshTimer = setTimeout(function() { EDR.admin.caseManagement.refresh(false) }, 5000);
							}
						}						
		            }	
	            }    
			}
	
		}
		
		if (EDR.admin.currentPage == "nav-system-casemanagement" && EDR.admin.stopRefresh == false) {
			var params = {};
			params.url = EDR.contextPath + '/case.do?action=getLocalCasesAsJSON';
			if (firstRefresh) {
				params.url = params.url + '&firstRefresh=true';
			}
			params.timeout = EDR.admin.longRunningProcessTimeOut;
			params.showProgress = false;
			params.type = "get";
			params.successCallback = successCallback;
			params.errorCallback = errorCallback;
			EDR.ajax.Request._doRequest(params);
		}

	},

	// This method will kick off the update of the cases on the case management
	// screen.  It will start a tail-recursion so that the browser can still be
	// updated and manipulated.
   	updateAvailableCasesData: function(availableCases) {
   		if (availableCases && availableCases.length > 0) {
   			setTimeout(function() {EDR.admin.caseManagement.updateCaseData(availableCases, 0);}, 0);
   		
   		
   		} else if (EDR.admin.currentPage == "nav-system-casemanagement") {
   			// There were no cases to update, just schedule the next server request
   			EDR.admin.nav.refreshTimer = setTimeout(function() { EDR.admin.caseManagement.refresh(false) }, 5000);
 		
   		}
  	
   	},
   	
   	// This method will update the display to reflect the latest case data.  It uses
   	// tail recursion so that the browser will not hang, and keeps track of the case
   	// to be updated using the index parameter.
    updateCaseData: function(availableCases, index) {
	
		 if (EDR.admin.currentPage != "nav-system-casemanagement") {
		 	// The user navigated away from the case management page, exit
		 	return;
		 }
		 
		 if (index == availableCases.length) {
		 	// We have reached the end of the array, schedule the next page update
		 	EDR.admin.nav.refreshTimer = setTimeout(function() { EDR.admin.caseManagement.refresh(false) }, 5000);
		 	return;
		 }
		 
	 	 var aCase = availableCases[index];
		 var id = aCase.id;
		 
		 // If the case is remote, skip it
		 if (aCase.remote == "true") {
		 	setTimeout(function() {EDR.admin.caseManagement.updateCaseData(availableCases, ++index);}, 0);
		 	return;
		 }
		 
		 // If the case has changed to the active state, remove it from the table
		 if (aCase.phase == "active") {
		 	var caseRow = g('case-row-' + aCase.idEncoded);
		 	if (caseRow != null) {
		 		g('caseManagementTable').deleteRow(caseRow.rowIndex);
		 	}
		 	setTimeout(function() {EDR.admin.caseManagement.updateCaseData(availableCases, ++index);}, 0);
		 	return;
		 }
		 
		 var caseManagementStatusInfo = g('caseManagementStatusInfo_' + aCase.idEncoded);
		 if (caseManagementStatusInfo) {
		     EDR.admin.caseManagement.setStatusIcon(aCase);
		 }
		 
		 /* var caseManagementCollectionNameInfo = g('caseManagementCollectionNameInfo_' + aCase.idEncoded);
		 if (caseManagementCollectionNameInfo) {
		     caseManagementCollectionNameInfo.innerHTML = EDR.admin.caseManagement.getCollectionNameData(aCase, true);
		 } */
		 // Update the index size status
		 EDR.admin.caseManagement.updateIndexStatus(aCase);

               // Case errors				 
		 var caseManagementErrorInfo = g('caseManagementErrorInfo_' + aCase.idEncoded);
		 if (caseManagementErrorInfo) {
		 	var data = EDR.admin.caseManagement.getErrorData(aCase);
		 	if (data != '') {
				caseManagementErrorInfo.innerHTML = data;
		 		caseManagementErrorInfo.style.display = "";
		 	} else {
		 	 	caseManagementErrorInfo.style.display = "none";
		 	}
		 }
		 
		 // Commit errors
		 var caseManagementCommitErrorInfo = g('caseManagementCommitErrorInfo_' + aCase.idEncoded);
		 if (caseManagementCommitErrorInfo) {
		 	var data = EDR.admin.caseManagement.getCommitErrorData(aCase);
		 	if (data != '') {
				caseManagementCommitErrorInfo.innerHTML = data;
		 		caseManagementCommitErrorInfo.style.display = "";
		 	} else {
		 	 	caseManagementCommitErrorInfo.style.display = "none";
		 	}
		 }
		 
		 var caseManagementStartAnalysisInfo = g('caseManagementStartAnalysisInfo_' + aCase.idEncoded);
		 if (caseManagementStartAnalysisInfo) {
		 	var startAnalysisData = EDR.admin.caseManagement.getStartAnalysisData(aCase);
		    if (startAnalysisData != "") {
		    	caseManagementStartAnalysisInfo.innerHTML = startAnalysisData;
		    	caseManagementStartAnalysisInfo.style.display = "";
		    } else {
		    	caseManagementStartAnalysisInfo.style.display = "none";
			}				    	
		 }
		 
		 // Update enable analysis checkbox
	 	 EDR.admin.caseManagement.updateEnableAnalysisCheckbox(aCase);

		 // Hide actions if commiting & show the commit status
		 var actionsDiv = g('caseManagementActions_' + aCase.idEncoded);
		 if (actionsDiv) {
			 if ((aCase.inCommit == 'false' && aCase.overlayRebuildStatus < 0) || EDR.admin.caseManagementEditCaseIdEncoded == aCase.idEncoded) {
			     actionsDiv.style.display = '';
			     
				 // Display correct action icons
				 var nonImportActions = g("caseManagementNonImportActions_" + aCase.idEncoded); 
				 var importActions = g("caseManagementImportActions_" + aCase.idEncoded); 
				 if (aCase.importable == 'true') {
				     importActions.style.display = '';
				     nonImportActions.style.display = 'none';
		     
					 var importDeleteAction = g("caseManagementImportDeleteAction_" + aCase.idEncoded); 
					 if (aCase.hasLocalIndex == 'true') {
					     importDeleteAction.style.display = '';
					 } else {
					     importDeleteAction.style.display = 'none';
					 }
				 } else {
				     importActions.style.display = 'none';
				     nonImportActions.style.display = '';
				 }
		 
			 } else {
			     actionsDiv.style.display = 'none';
			 }
		 }	 
		 EDR.admin.caseManagement.updateCommitStatus(aCase);
		 
		 EDR.admin.caseManagement.updateOverlayRebuildStatus(aCase);
		 
		 // If crawler running, disable commit action and ignore text management
		 var commitIcon = g('caseManagementActionExportIcon_' + aCase.idEncoded);
		 var commitDisabledIcon = g('caseManagementActionExportIcon_d_' + aCase.idEncoded);
		 var ignoreIcon = g('caseManagementActionIgnoreIcon_' + aCase.idEncoded);
		 var ignoreDisabledIcon = g('caseManagementActionIgnoreIcon_d_' + aCase.idEncoded);
		 if (commitIcon != null && ignoreIcon != null && commitDisabledIcon != null && ignoreDisabledIcon != null) {
			if (aCase.fileCrawlerStatus == 'running' || aCase.ralCrawlerStatus == 'running') {
			    commitDisabledIcon.style.display = '';
			    commitIcon.style.display = 'none';
			    ignoreDisabledIcon.style.display = '';
			    ignoreIcon.style.display = 'none';
			} else {
			    commitDisabledIcon.style.display = 'none';
			    commitIcon.style.display = '';
			    ignoreDisabledIcon.style.display = 'none';
			    ignoreIcon.style.display = '';
		    }	
		 }
		 
		 setTimeout(function() {EDR.admin.caseManagement.updateCaseData(availableCases, ++index);}, 0);    
 		 return;
    },

    updateRemoteCasesData: function(remoteCases) {
	    if (remoteCases) {
		 	for (var i = 0 ; i < remoteCases.length ; i++) {
			 	 var aCase = remoteCases[i];
				 
				 var caseManagementCollectionNameInfo = g('caseManagementRemoteCollectionNameInfo_' + aCase.idEncoded);
				 if (caseManagementCollectionNameInfo) {
				     caseManagementCollectionNameInfo.innerHTML = EDR.admin.caseManagement.getCollectionNameData(aCase, true);
				 }
		     }
        }   
    },
    
    updateUnavailableCasesData: function(unavailableCases) {
	    if (unavailableCases) {
		 	for (var i = 0 ; i < unavailableCases.length ; i++) {
			 	 var aCase = unavailableCases[i];
				 
				 var caseManagementCollectionNameInfo = g('caseManagementUnavailableCollectionNameInfo_' + aCase.idEncoded);
				 if (caseManagementCollectionNameInfo) {
				     caseManagementCollectionNameInfo.innerHTML = EDR.admin.caseManagement.getCollectionNameData(aCase, false);
				 }
		     }
        }   
    },
	    	
	setStatusIcon: function(aCase) {
	
		var hiddenStatus = g('caseManagementIndexingAccessibleStatus-' + aCase.idEncoded);
		var statusIcon = g("caseStatusIcon-" + aCase.idEncoded); 
		if (statusIcon == null) {
			return;
		}
		
		if (aCase.inCommit == 'true') {
		    statusIcon.src="images/commit23.png";
		    statusIcon.alt=EDR.messages.K0014I_CRAWLER_STATUS_INCOMMIT;
		    statusIcon.title=EDR.messages.K0014I_CRAWLER_STATUS_INCOMMIT; 
		    hiddenStatus.innerHTML=EDR.messages.K0014I_CRAWLER_STATUS_INCOMMIT;
		} else if (aCase.needsOverlayRebuild == 'true' || aCase.overlayRebuildStatus >= 0) {
			statusIcon.src = "images/attention23.png";
			statusIcon.alt=EDR.messages.K0014I_CRAWLER_STATUS_REBUILD;
			statusIcon.title=EDR.messages.K0014I_CRAWLER_STATUS_REBUILD;
			hiddenStatus.innerHTML=EDR.messages.K0014I_CRAWLER_STATUS_REBUILD;		
		} else if (aCase.fileCrawlerStatus == 'running' || aCase.ralCrawlerStatus == 'running') {
		    statusIcon.src="images/running23.png";
		    statusIcon.alt=EDR.messages.K0014I_CRAWLER_STATUS_RUNNING;
		    statusIcon.title=EDR.messages.K0014I_CRAWLER_STATUS_RUNNING; 
		    hiddenStatus.innerHTML=EDR.messages.K0014I_CRAWLER_STATUS_RUNNING;
		} else if (aCase.needsSetup == 'true') {
		    statusIcon.src="images/setup23.png";
		    statusIcon.alt=EDR.messages.K0014I_CRAWLER_STATUS_SETUP;
		    statusIcon.title=EDR.messages.K0014I_CRAWLER_STATUS_SETUP; 
		    hiddenStatus.innerHTML=EDR.messages.K0014I_CRAWLER_STATUS_SETUP;
		} else if (aCase.crawlComplete == 'false') {
		    statusIcon.src="images/attention23.png";
		    statusIcon.alt=EDR.messages.K0014I_CRAWLER_STATUS_PAUSED;
		    statusIcon.title=EDR.messages.K0014I_CRAWLER_STATUS_PAUSED;
		    hiddenStatus.innerHTML=EDR.messages.K0014I_CRAWLER_STATUS_PAUSED; 
		} else if (aCase.changed == 'true') {
		    statusIcon.src="images/attention23.png";
		    statusIcon.alt=EDR.messages.K0014I_CRAWLER_STATUS_WARNING;
		    statusIcon.title=EDR.messages.K0014I_CRAWLER_STATUS_WARNING;
		    hiddenStatus.innerHTML=EDR.messages.K0014I_CRAWLER_STATUS_WARNING; 
	    } else if (aCase.phase == 'INACTIVE') {
		    statusIcon.src="images/inactive23.png";
		    statusIcon.alt=EDR.messages.K0014I_CRAWLER_STATUS_INACTIVE;
		    statusIcon.title=EDR.messages.K0014I_CRAWLER_STATUS_INACTIVE; 
		    hiddenStatus.innerHTML=EDR.messages.K0014I_CRAWLER_STATUS_INACTIVE;
		} else if (aCase.fileCrawlerStatus == 'stopped' && aCase.ralCrawlerStatus == 'stopped') {
		    statusIcon.src="images/success23.png";
		    statusIcon.alt=EDR.messages.K0014I_CRAWLER_STATUS_SUCCESS;
		    statusIcon.title=EDR.messages.K0014I_CRAWLER_STATUS_SUCCESS; 
		    hiddenStatus.innerHTML=EDR.messages.K0014I_CRAWLER_STATUS_SUCCESS;
		}
	},
	
    getCollectionNameData: function(aCase, addLink) {
		var data = '<div class="collectionName" id="collectionName_' + aCase.idEncoded + '">';
		
		if (aCase.enableForSearch == 'true' && addLink == true) {
			data += "<a id='collectionNameLink_" + aCase.idEncoded + "' href='"+ EDR.contextPath +"/search?action=index&activeCaseId=" + encodeURIComponent(aCase.id) + "' title='" + EDR.messages.K0015I_TOOLTIP_CASE_OPENSEARCH + "'>";
			data += aCase.id;
			data += "</a>";
		} else {
			data += aCase.id;
		}
		
		data += '</div>';
		if (aCase.description) {
		    data += '<div class="collectionDescription">' + aCase.description + '</div>';
		}

	    if ((aCase.remote == 'true' || aCase.hasLocalIndex != 'true') && aCase.analysisServer) {
	        data += '<div><span class="label">' + EDR.messages.K0014I_ADMIN_NODES_FULLNAME + ':</span>&nbsp;'; 
 		    data += aCase.analysisServer;
		    data += '</div>';
		}

		return data;
    },
    
	getStartAnalysisData: function(aCase) {
		var data = '';
   	    if (aCase.localOnly == 'false' && aCase.inCommit == 'false' && aCase.needsOverlayRebuild == 'false' && aCase.overlayRebuildStatus < 0) { // must be an eDM case (that isn't in the process of being commited)
	  		if (aCase.importable == 'true') {
   		         data += '<a title="' + EDR.messages.K0015I_TOOLTIP_IMPORT_START + '" href="javascript:;" onclick="EDR.admin.cases.preImportCase(\''; 
   	    	     data += aCase.id;
   	        	 data += '\')"><img src="images/start23.png" alt="' + EDR.messages.K0014I_ADMIN_MENU_IMPORT_START + '"/></a>'; 
	   	         data += '<a title="' + EDR.messages.K0015I_TOOLTIP_IMPORT_START + '" class="startAnalysisText" href="javascript:;" onclick="EDR.admin.cases.preImportCase(\''; 
   		         data += aCase.id;
   	    	     data += '\')">' + EDR.messages.K0014I_ADMIN_MENU_IMPORT_START + '</a>';
	   	    } else {
   		         if (aCase.fileCrawlerStatus == 'stopped' && aCase.ralCrawlerStatus == 'stopped') {
   	    	         if (aCase.changed == 'true' || aCase.crawlComplete == 'false') {
						 data += '<a title="' + EDR.messages.K0015I_TOOLTIP_IMPORT_START + '" href="javascript:;" onclick="EDR.admin.cases.startRALCrawler(\''; 
		        		 data += aCase.id;
			        	 data += '\')"><img src="images/start23.png" alt="' + EDR.messages.K0014I_ADMIN_MENU_IMPORT_START + '" /></a>'; 
			        	 data += '<a title="' + EDR.messages.K0015I_TOOLTIP_IMPORT_START + '" class="startAnalysisText" href="javascript:;" onclick="EDR.admin.cases.startRALCrawler(\'';
		    	    	 data += aCase.id;
	    	    		 data += '\')">' + EDR.messages.K0014I_ADMIN_MENU_IMPORT_START + '</a>'; 
   	            	 }
	   	         } else {
			         data += '<a title="' + EDR.messages.K0015I_TOOLTIP_IMPORT_STOP + '" href="javascript:;" onclick="EDR.admin.cases.stopRALCrawler(\''; 
			         data += aCase.id;
		    	     data += '\')"><img src="images/pause23.png" alt="' + EDR.messages.K0014I_ADMIN_MENU_IMPORT_STOP + '" /></a>'; 
		        	 data += '<a title="' + EDR.messages.K0015I_TOOLTIP_IMPORT_STOP + '" class="startAnalysisText" href="javascript:;" onclick="EDR.admin.cases.stopRALCrawler(\'';
			         data += aCase.id;
			         data += '\')">' + EDR.messages.K0014I_ADMIN_MENU_IMPORT_STOP + '</a>'; 
			     }    
   	         }
   	    } 

		return data;   	   
	
	},
	
	/**
	 * This method will enable/disable and check/uncheck the checkbox indicating whether a case is enabled for
	 * analysis or not.
	 */
	updateEnableAnalysisCheckbox: function(aCase) {
		
		var enableSearch = g('enableSearch_' + aCase.idEncoded);
		var enableSearchDisabled = g('enableSearchDisabled_' + aCase.idEncoded);
		var disableSearch = g('disableSearch_' + aCase.idEncoded);
		var disableSearchDisabled = g('disableSearchDisabled_' + aCase.idEncoded);
		var caseNameLink = g('collectionNameLink_' + aCase.idEncoded);
		var caseNameNoLink = g('collectionNameNoLink_' + aCase.idEncoded);
		
		if (enableSearch != null) {
		    var enableSearching = g('caseManagementEnableSearching_' + aCase.idEncoded);
		    if (enableSearching) {
			    if (aCase.inCommit == "false") {
			        enableSearching.style.display = '';
			    } else {
			        enableSearching.style.display = 'none';
			        return;
			    }
		    }
		    
			if (aCase.enableForSearch == "true") {
				if (aCase.needsSetup != "true" && aCase.phase != 'INACTIVE'
					&& aCase.ralCrawlerStatus == 'stopped' && aCase.fileCrawlerStatus == 'stopped') {
					enableSearch.style.display = 'none';
					enableSearchDisabled.style.display = 'none';
					disableSearch.style.display = '';
					disableSearchDisabled.style.display = 'none';
					caseNameLink.style.display = '';
					caseNameNoLink.style.display = 'none';
				} else {
					enableSearch.style.display = 'none';
					enableSearchDisabled.style.display = 'none';
					disableSearch.style.display = 'none';
					disableSearchDisabled.style.display = '';
					caseNameLink.style.display = '';
					caseNameNoLink.style.display = 'none';
				}
			} else {
				if (aCase.needsSetup != "true" && aCase.phase != 'INACTIVE'
					&& aCase.ralCrawlerStatus == 'stopped' && aCase.fileCrawlerStatus == 'stopped') {
					enableSearch.style.display = '';
					enableSearchDisabled.style.display = 'none';
					disableSearch.style.display = 'none';
					disableSearchDisabled.style.display = 'none';
					caseNameLink.style.display = 'none';
					caseNameNoLink.style.display = '';
				} else {
					enableSearch.style.display = 'none';
					enableSearchDisabled.style.display = '';
					disableSearch.style.display = 'none';
					disableSearchDisabled.style.display = 'none';
					caseNameLink.style.display = 'none';
					caseNameNoLink.style.display = '';
				}
			}
		
		}

	},
	
	/**
	 * This method will update the display of the commit progress
	 */
	updateCommitStatus: function(aCase) {
	    // Hide or show the commit area
	    var commitInfo = g('caseManagementCommitInfo_' + aCase.idEncoded);
	    if (commitInfo) {
		    if (aCase.inCommit == "false") {
		        commitInfo.style.display = 'none';
		    } else {
		        commitInfo.style.display = '';
		    }
	    }
	    
	    // Update the label
		var processBarLabel = g('commitProgressBarLabel-' + aCase.idEncoded);
		if (processBarLabel != null) {
			processBarLabel.innerHTML = aCase.commitStatusMessage;
		}
		
		// Update the progress bar
		var progressBarContainer = g('commitProgressBar-' + aCase.idEncoded);
		if (progressBarContainer) {
			progressBarContainer.className = "progressBarContainer running";
			if (aCase.commitProgress != '-1') {
				var progressBarFilled = g('commitProgressBarComplete-' + aCase.idEncoded);
				if (progressBarFilled) {
					progressBarFilled.style.width = aCase.commitProgress + "%";
				}
			} 
		}
	},
	
	/**
	 * This method will update the overlay index rebuild status
	 */
	updateOverlayRebuildStatus: function(aCase) {
		var overlayDiv = g('caseManagementOverlayRebuild_' + aCase.idEncoded);
		if (overlayDiv) {
			if (aCase.needsOverlayRebuild == "true" && aCase.overlayRebuildStatus < 0) {
				overlayDiv.style.display = "";
			} else {
				overlayDiv.style.display = "none";
			}
		}
		
		var overlayProgress = g('caseManagementOverlayRebuildInfo_' + aCase.idEncoded);
		if (overlayProgress) {
			if (aCase.overlayRebuildStatus >= 0) {
				overlayProgress.style.display = "";
				g('overlayProgressBarComplete-' + aCase.idEncoded).style.width = aCase.overlayRebuildStatus * 100 + "%";
			} else {
				overlayProgress.style.display = "none";
			}
		
		}	
	
	},
	
	/**
	 * This method will update the display of the index size
	 */
	updateIndexStatus: function(aCase) {
	
		if (aCase.totalDocCount != -1 || aCase.localOnly == 'true') {
		
		    var indexInfo = g('caseManagementIndexInfo_' + aCase.idEncoded);
	
		    if (indexInfo) {
			    if (aCase.inCommit == "false" && aCase.needsOverlayRebuild == 'false' && aCase.overlayRebuildStatus < 0) {
			        indexInfo.style.display = '';
			    } else {
			        indexInfo.style.display = 'none';
			    }
		    }
		    
			var indexSizeLabel = g('progressBarLabelText-' + aCase.idEncoded);
			if (indexSizeLabel != null) {
				indexSizeLabel.innerHTML = aCase.indexStatusMessage;
			}
			
			// Show the help icon if the total doc count doesn't match the crawled count
			if (aCase.docCount != aCase.totalDocCount && aCase.crawlComplete == 'true' && aCase.ralCrawlerStatus != 'running') {
				g('indexCountNotMatchImg-' + aCase.idEncoded).style.display = '';
			} else {
				g('indexCountNotMatchImg-' + aCase.idEncoded).style.display = 'none';
			}
			
			// Update the progress bar
			var progressBarContainer = g('progressBar-' + aCase.idEncoded);
			if (progressBarContainer) {
				var progressBarFilled = null;
				if (aCase.fileCrawlerStatus == 'running' || aCase.ralCrawlerStatus == 'running') {
					progressBarContainer.className = "progressBarContainer running";
					if (aCase.percentageDocCount != '') {
						progressBarFilled = g('progressBarComplete-' + aCase.idEncoded);
						if (progressBarFilled) {
							progressBarFilled.style.width = aCase.percentageDocCount + "%";
						}
					}
				} else {
					progressBarContainer.className = "progressBarContainer";
						progressBarFilled = g('progressBarComplete-' + aCase.idEncoded);
						if (progressBarFilled) {
							progressBarFilled.style.width = "0%";
						}
				}
				progressBarContainer.style.display = '';
			}
		}
	},
		
	getCommitErrorData: function(aCase) {
		var data = '';
      	if (aCase.numberCommitErrors != '0') {
      	    data += '<div class="error">';
   	        var msg = EDR.messages.K0001I_COMMON_COMMIT_ERROR_NUMBER;
   	        var index = msg.indexOf('{0}');
   	        if (index > -1) {
	   		    var newMsg = msg.substring(0, index);
	   	     	newMsg += aCase.numberCommitErrors;
	   	     	newMsg += msg.substring(index + 3);
	   	     	msg = newMsg;
	   	    } else {
	   	        msg = aCase.numberCommitErrors + msg;
	   	    }    
            data += msg;
   	     				     
   	     	data += '&nbsp;<a title="';
   	     	data += EDR.messages.K0001I_COMMON_COMMIT_LOG_LINK;
   	     	data += '" href="javascript:;" onclick="EDR.admin.Log.showCommitLog(\'';
   	     	data += aCase.idEncoded;
   	     	data += '\');">';
   	     	data += EDR.messages.K0001I_COMMON_COMMIT_LOG_LINK;
   	     	data += '</a>';
   	     				     
      		data += '</div>';
  	    }
        return data;
	},
	
	getErrorData: function(aCase) {
		var data = '';
   	     				  
      	if (aCase.numberErrors != '0') {
      	    data += '<div class="error">';
   	        var msg = EDR.messages.K0001I_COMMON_ERROR_NUMBER;
   	        var index = msg.indexOf('{0}');
   	        if (index > -1) {
	   		    var newMsg = msg.substring(0, index);
	   	     	newMsg += aCase.numberErrors;
	   	     	newMsg += msg.substring(index + 3);
	   	     	msg = newMsg;
	   	    } else {
	   	        msg = aCase.numberErrors + msg;
	   	    }    
            data += msg;
   	     				     
   	     	data += '&nbsp;<a title="';
   	     	data += EDR.messages.K0001I_COMMON_LOG_LINK;
   	     	data += '" href="javascript:;" onclick="EDR.admin.nav.selectViewLogs(\'';
   	     	data += aCase.idEncoded;
   	     	data += '\');">';
   	     	data += EDR.messages.K0001I_COMMON_LOG_LINK;
   	     	data += '</a>';
   	     				     
      		data += '</div>';
  	    }
	
		/* if (aCase.lastError) {
      	    data += '<div><span class="label">' + EDR.messages.K0001I_COMMON_ERROR_LAST + ':</span>&nbsp;<span>&nbsp;'; 
      	    data += aCase.lastError;
      	    data += '</span></div>';
		}  */
		      				
        return data;
	},
	
	closeEditArea: function() {
		var lastEditArea = g('caseManagementEditArea_' + EDR.admin.caseManagementEditCaseIdEncoded);
		if (lastEditArea) {
		    lastEditArea.style.display = 'none';
	   		dojo.forEach(EDR.admin.caseManagementEditWidgets, function(instance) {
	   	 		if (instance && instance.destroy) {
	   	 		   instance.destroy();
	   	 		}
			});
		    lastEditArea.innerHTML = ''; 
		}
			
		var lastEditIcon = g(EDR.admin.caseManagementEditCaseIconPrefix + EDR.admin.caseManagementEditCaseIdEncoded);
		if (lastEditIcon) {
			lastEditIcon.className = 'actionItemDiv';
		}	
			
		EDR.admin.caseManagementEditCaseIdEncoded = ""; 
		EDR.admin.caseManagementEditCaseId = ""; 
		EDR.admin.caseManagementEditCaseIconPrefix = "";
	}	
};


EDR.admin.Log = {

	showLogMessageHelp: function(url) {
		var viewport = dijit.getViewport();
		var subwnd = {w:600, h:400};
		subwnd.l = Math.floor(((screen.width - subwnd.w)/2));
		subwnd.t = Math.floor(((screen.height - subwnd.h)/2));
		
		var param = "location=0,status=0,scrollbars=1";
		param += ",width=" + subwnd.w;
		param += ",height=" + subwnd.h;
		param += ",left=" + subwnd.l;
		param += ",top=" + subwnd.t;
		
		window.open(url, 'messageHelpFile', param);
	},

	showCommitLog: function(caseId) {
		function successCallback(response, ioArgs) {
			var responseObject = null;
			try {
				responseObject = dojo.fromJson(response);
			} catch (e) {
			}
			
			if (responseObject != null && typeof(responseObject) == 'object' && responseObject.caseError != null) {					
				EDR.util.alert(responseObject.caseError);
			} else {
				var dlg = dijit.byId(EDR.prefix+'commitErrorDialog');
				EDR.dialog.util.setContent(dlg, response);
				EDR.dialog.util.show(dlg);  
			}
		}
	    	
		EDR.ajax.Request.get({
        	url: EDR.Constants.APPLICATION_CONTEXT + "/logAction.do?action=showCommitLog&caseId=" + encodeURIComponent(caseId), 
			progressText: EDR.messages.K0001I_COMMON_PROGRESS_WAIT,
			successCallback: successCallback
        } );
	},
	
	showLogSettingsDialog: function() {
		function successCallback(response, ioArgs) {
			var responseObject = null;
			try {
				responseObject = dojo.fromJson(response);
			} catch (e) {
   				EDR.ajax.Error.handle(e, ioArgs);
			}
			
			if (responseObject != null && typeof(responseObject) == 'object') {
	       		// Check for errors
    	   		if (responseObject.caseError != null) {					
					EDR.util.alert(responseObject.caseError);
       				//EDR.ajax.Error.handle(responseObject.caseError, ioArgs);
       				EDR.admin.nav.refreshAdminPage();
	       		} else {
					var logContent = dijit.byId("logSettingsContent");
					logContent.setLogSettingsJson(responseObject);
		    		EDR.dialog.util.showbyId(EDR.prefix+'logSettingsDialog');
		    	}	
			}
		}
	    	
		g('modifyCaseError').style.display = "none";
		
		EDR.ajax.Request.get({
        	url: EDR.Constants.APPLICATION_CONTEXT + "/logAction.do?action=getLogSettings",
			progressText: EDR.messages.K0001I_COMMON_PROGRESS_WAIT,
			successCallback: successCallback
        } );
	},

	saveLogContents: function(event) {
		function successCallback(response, ioArgs) {
			var responseObject = null;
			try {
				responseObject = dojo.fromJson(response);
			} catch (e) {
   				EDR.ajax.Error.handle(e, ioArgs);
			}
			
			if (responseObject != null && typeof(responseObject) == 'object') {
				if (responseObject.caseError != null) {
					EDR.util.alert(responseObject.caseError);
    	   			//EDR.ajax.Error.handle(responseObject.caseError, ioArgs);
       				EDR.admin.nav.refreshAdminPage();
       			} else {
					EDR.dialog.util.hide('logSettingsDialog');			
				}	
			}
		}

		var logContent = dijit.byId("logSettingsContent");
		if (!logContent.isValid()) {
			EDR.util.alert(logContent.getErrorMessage());
			return;
		}
		
		g('modifyCaseError').style.display = "none";		

		var readUrl = EDR.contextPath + "/logAction.do?action=setLogSettings";
		readUrl += "&level=" + encodeURIComponent(logContent.getLogLevel());
		readUrl += "&maxNum=" + encodeURIComponent(logContent.getMaxNum());
		readUrl += "&maxSize=" + encodeURIComponent(logContent.getMaxSize());
		
		EDR.ajax.Request.get({
        	url: readUrl,
			progressText: EDR.messages.K0001I_COMMON_PROGRESS_WAIT,
			successCallback: successCallback
        } );
 	}	
};

EDR.admin.Registration = {


	showNextButton: function(event) {

		var form = f('registrationForm');
		// Make sure every field has a value
		if (form.hostName.value != null && EDR.util.String.trim(form.hostName.value) != "" && 
			form.port.value != null && EDR.util.String.trim(form.port.value) != "" &&
			form.dbName.value != null && EDR.util.String.trim(form.dbName.value) != "" &&
			form.dbSchema.value != null && EDR.util.String.trim(form.dbSchema.value) != "") {
			
			dijit.byId(EDR.prefix+'registration-next-button').setDisabled(false);
			if (event) {
				key = event.keyCode;
				if (key && key == dojo.keys.ENTER) {
					EDR.admin.Registration.showNext();
				}
			}	
		} else {
			dijit.byId(EDR.prefix+'registration-next-button').setDisabled(true);
		}
	
	},
	
	showSaveButton: function(event) {

		var form = f('registrationForm');
		// Make sure every field has a value
		if (form.usernameCM.value == null || EDR.util.String.trim(form.usernameCM.value) == "" || 
			form.passwordCM.value == null || EDR.util.String.trim(form.passwordCM.value) == "" ||
			form.usernameAdminCM.value == null || EDR.util.String.trim(form.usernameAdminCM.value) == "" ||
			form.passwordAdminCM.value == null || EDR.util.String.trim(form.passwordAdminCM.value) == "") {
			dijit.byId(EDR.prefix+'registration-submit-button').setDisabled(true);
		} else {
			dijit.byId(EDR.prefix+'registration-submit-button').setDisabled(false);
			if (event) {
				key = event.keyCode;
				if (key && key == dojo.keys.ENTER) {
					EDR.admin.Registration.submit();
				}
			}	
		}
	},
	
	showSaveButtonP8: function(event) {
	
		var form = f('registrationForm');
		// Make sure every field has a value
		if (form.serverAddress.value != null && EDR.util.String.trim(form.serverAddress.value) != "" && 
			form.objectStore.value != null && EDR.util.String.trim(form.objectStore.value) != "" &&
			form.domain.value != null && EDR.util.String.trim(form.domain.value) != "" &&
			form.usernameP8.value != null && EDR.util.String.trim(form.usernameP8.value) != "" &&
			form.passwordP8.value != null && EDR.util.String.trim(form.passwordP8.value) != "") {
			
			dijit.byId(EDR.prefix+'registration-submit-button').setDisabled(false);
				
			if (event) {
				key = event.keyCode;
				if (key && key == dojo.keys.ENTER) {
					EDR.admin.Registration.submit();
				}
			}	
		} else {
			dijit.byId(EDR.prefix+'registration-submit-button').setDisabled(true);
		}
	
	
	},
	
	showNext: function() {
	
		if (!EDR.admin.Registration.validateFirstPage()) {
			return;
		}
	
		g('cm-registration-page-1').style.display = "none";
		g('cm-registration-page-2').style.display = "block";
		g('p8-radio-button').disabled = true;
		dijit.byId(EDR.prefix+'registration-back-button').setDisabled(false);
		dijit.byId(EDR.prefix+'registration-submit-button').setDisabled(true);
		dijit.byId(EDR.prefix+'registration-next-button').setDisabled(true);
		dijit.byId(EDR.prefix+'registration-back-button').domNode.style.display = "";
		dijit.byId(EDR.prefix+'registration-next-button').domNode.style.display = "none";
		dijit.byId(EDR.prefix+'registration-submit-button').domNode.style.display = "";
		g('usernameCM').value = "";
		g('passwordCM').value = "";
		g('usernameAdminCM').value = "";
		g('passwordAdminCM').value = "";
		EDR.util.Form.focus("usernameAdminCM");
	
	},
	
	showPrevious: function() {

		g('registrationError').style.display = "none";
		g('cm-registration-page-2').style.display = "none";
		g('cm-registration-page-1').style.display = "block";
		g('p8-radio-button').disabled = false;
		dijit.byId(EDR.prefix+'registration-back-button').setDisabled(true);
		dijit.byId(EDR.prefix+'registration-submit-button').setDisabled(true);
		dijit.byId(EDR.prefix+'registration-next-button').setDisabled(false);
		dijit.byId(EDR.prefix+'registration-back-button').domNode.style.display = "none";
		dijit.byId(EDR.prefix+'registration-next-button').domNode.style.display = "";
		dijit.byId(EDR.prefix+'registration-submit-button').domNode.style.display = "none";
		EDR.util.Form.focus("hostName");
	},
	
	validateFirstPage: function() {

		var form = f('registrationForm');
		g('registrationError').style.display = "none";
		
		if (form.hostName.value == null || EDR.util.String.trim(form.hostName.value) == "" || 
			form.port.value == null || EDR.util.String.trim(form.port.value) == "" ||
			form.dbName.value == null || EDR.util.String.trim(form.dbName.value) == "" ||
			form.dbSchema.value == null || EDR.util.String.trim(form.dbSchema.value) == "") {
			
			g('registrationError').innerHTML = EDR.messages.K0013I_ERROR_FORM_ALL_REQUIRED;
			g('registrationError').style.display = "block";
			return false;
			
		}		

		
		// Make sure the port is an integer
		if (parseInt(form.port.value, 10) != form.port.value - 0) {
			g('registrationError').innerHTML = EDR.messages.K0013I_ERROR_PORT_NAN;
			g('registrationError').style.display = "block";
			return false;
		}
		
		return true;
	},
	
	submit: function() {
	
		function successCallback(response, ioArgs) {
			// See if we got an error
			var json = {};
			try {
				json = dojo.fromJson(response);
			} catch (e) {
				// json format error
			}
			if (typeof(json) == 'object') {
				if (json.registrationError != null && json.registrationError != "") {
					g('registrationError').innerHTML = json.registrationError;
					g('registrationError').style.display = "block";
					return;					
				}
			} 
			// Registration was successful, close the dialog to get the real
			// login screen
			EDR.dialog.util.hide('registerServerDialog');
		}

		g('registrationError').style.display = "none";

		EDR.ajax.Form.submit(
			{ 
  				url: EDR.contextPath + "/register.do?action=register",
				formId: "registrationForm",
				timeout: EDR.admin.longRunningProcessTimeOut,
				successCallback: successCallback,
				showProgress: true
			}
		);	
	
	}

};
