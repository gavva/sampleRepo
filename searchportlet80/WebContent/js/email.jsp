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

EDR.bean.Email = {
	ignoreChange: false,
    selectedPrefixDocumentID: "", 
    selectedPrefixTagUpdateToken: "",
    selectedPrefixTagDocId: "",
    selectedIgnoreText: "",
    
    hideDetails: false,
	
	switchResultsPerPage: function(resultsPerPage) {
		
		// When we switch the results per page we have to start again at page number 1
		params = { 
			page: EDR.search.Constants.DEFAULT_START_PAGE, 
			resultsPerPage: resultsPerPage 
		};		
		
		EDR.ajax.Request.get(
			{ 
				url: EDR.search.Constants.PAGE_URL + 
					'&' + EDR.search.Constants.SEARCH_PAGE + '=' + 
					encodeURIComponent(params.page) + 
					'&' + EDR.search.Constants.SEARCH_RESULTS_PER_PAGE + '=' + 
					encodeURIComponent(params.resultsPerPage),
				progressText: EDR.messages.splash_loading,
//				beforeSetContentCallback: function() {
				// TODO dojo1.3 migration
//					<es:dijit />.byId("resultsPerPage").destroy();			
				//},
				successCallback: function(response) {
					var m = <es:dijit />.byId(EDR.prefix+"searchManager");
					m.processSearchResults(response);
				},
				elementToReplace: EDR.search.Constants.EMAIL_RESULTS_ELEMENT_ID,
				errorCallback: EDR.bean.Email.handleSearchError
			}
		);	
	
	},
	
	switchFilterBy: function(filterBy) {
		var docFilterValue = <es:dijit />.byId(EDR.prefix+"horizontalSearchPanes").resultToolbar.filterBySelectBox.attr("value");
		var params = {doctypefilter: docFilterValue};
		<es:dijit />.byId(EDR.prefix+"searchManager").submitQuickRefineSearch(params);
	},	
	
	sortByField: function(field, order) {	    
	   	EDR.ajax.Request.get(
			{ 
				url: EDR.search.Constants.SORT_URL,
				content: {
					"sort-by": field,
					"sort-order": order
				},
				progressText: EDR.messages.splash_loading,
//				beforeSetContentCallback: function() {
					//TODO dojo1.3 migration
//					<es:dijit />.byId("resultsPerPage").destroy();			
//				},
//				afterSetContentCallback:  function() {
//				}, 
				successCallback: function(response) {
					var m = <es:dijit />.byId(EDR.prefix+"searchManager");
					m.processSearchResults(response);
				},					
				elementToReplace: EDR.search.Constants.EMAIL_RESULTS_ELEMENT_ID,
				errorCallback: EDR.bean.Email.handleSearchError
			}
		);	
	},
	
	searchSameGroup: function(url) {
	   	EDR.ajax.Request.get(
				{ 
					url: url,
					progressText: EDR.messages.splash_loading,
					successCallback: function(response) {
						var m = <es:dijit />.byId(EDR.prefix+"searchManager");
						m.processSearchResults(response);
					},					
//					elementToReplace: EDR.search.Constants.EMAIL_RESULTS_ELEMENT_ID,
					errorCallback: EDR.bean.Email.handleSearchError
				}
			);
	},
	
	searchAllResults: function() {
		var url = EDR.contextPath + "/search?action=search&nearDuplicateDetection=No";
		var args = { 
			url: url,
			handleAs: "json",
			progressText: EDR.messages.splash_loading,
			successCallback: function(response) {
				var m = <es:dijit />.byId(EDR.prefix+"searchManager");
				m.processSearchResults(response);
			},					
			errorCallback: EDR.bean.Email.handleSearchError
		};
		EDR.ajax.Request.get(args);
	},	
	
	groupByField: function(field) {	    
	   	EDR.ajax.Request.get(
			{ 
				url: EDR.search.Constants.GROUP_URL + 
					'&' + EDR.search.Constants.SEARCH_GROUP_FIELD + '=' + 
					encodeURIComponent(field),
				progressText: EDR.messages.K0001I_COMMON_LOADING_PROGRESS,
				beforeSetContentCallback: function() {
					//TODO dojo1.3 migration
					<es:dijit />.byId(EDR.prefix+"resultsPerPage").destroy();			
				},
				afterSetContentCallback:  function() {
				}, 
				elementToReplace: EDR.search.Constants.EMAIL_RESULTS_ELEMENT_ID,
				errorCallback: EDR.bean.Email.handleSearchError
			}
		);	
	},
	
	// User selected the expand grouped results control
	expandGroupedResult: function(fieldName, fieldValue, expansionElementId, expansionMarkerElementId, numResults, docId, rowId, imgId) {
			
		// Toggle the grouped result display
		var results = g(expansionElementId);
		if (results != null) {
			if (results.style.display == "none") {
				results.style.display = "block";
			} else {
				results.style.display = "none";
			}
		}

		// Toggle the image (between expand/collapse)
		if (imgId != null) {
			var image = g(imgId);
			if (results.style.display == "block") {
				image.src = "images/section_minimize8.png";
				image.title = EDR.messages.K0015I_TOOLTIP_SECTION_MINIMIZE;
			} else {
				image.src = "images/section_maximize8.png";
				image.title = EDR.messages.K0015I_TOOLTIP_SECTION_MAXIMIZE;
			}
		}
				
		// Skip running a search for the group results if this row has already been processed
		if (g(expansionMarkerElementId).innerHTML != '') {
			return;
		}
		
		// Mark that this row has been processed
		g(expansionMarkerElementId).innerHTML = '&nbsp;';
				
		// Clear the contents of the expansionElementId element
		g(expansionElementId).innerHTML = '';
		
		// Get the number of results with checkboxes
		var counter = EDR.bean.Email.getNumberOfCheckboxResults();
		
		// Make the backend SEARCH_GROUP_URL call to get the grouped results
		// Put the new results into the expansionElementId element
	   	EDR.ajax.Request.get(
			{ 
				url: EDR.search.Constants.SEARCH_GROUP_URL + 
					'&' + EDR.search.Constants.SEARCH_GROUP_FIELD + '=' + encodeURIComponent(fieldName) +
					'&' + EDR.search.Constants.SEARCH_GROUP_VALUE + '=' + encodeURIComponent(fieldValue) +
					'&' + EDR.search.Constants.SEARCH_GROUP_REP_DOC_ID + '=' + encodeURIComponent(docId) +
					'&' + EDR.search.Constants.SEARCH_GROUP_REP_ROW_ID + '=' + encodeURIComponent(rowId) + 
					'&' + EDR.search.Constants.SEARCH_GROUP_NUM_RESULTS + '=' + encodeURIComponent(numResults) +
					'&' + EDR.search.Constants.SEARCH_GROUP_COUNTER + '=' + encodeURIComponent(counter) +
					'&' + EDR.search.Constants.SEARCH_GROUP_SELECTALL + '=' + g('emailSelectAll').checked,
				progressText: EDR.messages.K0001I_COMMON_LOADING_PROGRESS,
				elementToReplace: expansionElementId,
				errorCallback: EDR.bean.Email.handleSearchError
			}
		);
		
	},
	
	pageThruEmails: function(page, sync, refresh) {
  	    if (typeof sync == "undefined") {
 	       sync = false;
 	    } 	    
		params = { 
			page: page, 
			resultsPerPage: <es:dijit />.byId(EDR.prefix+"resultsPerPage").value
		};
		
		EDR.ajax.Request.get(
			{ 
				url: EDR.search.Constants.PAGE_URL + 
					'&' + EDR.search.Constants.SEARCH_PAGE + '=' + 
					encodeURIComponent(params.page) + 
					'&' + EDR.search.Constants.SEARCH_RESULTS_PER_PAGE + '=' + 
					encodeURIComponent(params.resultsPerPage) + 
					'&' + EDR.search.Constants.SEARCH_RESULTS_REFRESH + '=' + (refresh ? "true" : "false"),
				progressText: "Loading...",
			    sync: sync, 
				beforeSetContentCallback: function() {
					//TODO dojo1.3 migration
					<es:dijit />.byId(EDR.prefix+"resultsPerPage").destroy();			
				},
				successCallback: function(response) {
					var m = <es:dijit />.byId(EDR.prefix+"searchManager");
					m.processSearchResults(response);
				},
				elementToReplace: EDR.search.Constants.EMAIL_RESULTS_ELEMENT_ID,
				errorCallback: EDR.bean.Email.handleSearchError
			}
		);	
	},
	
	toolbarDisable: function(disable) {
	    g('emailSelectAll').disabled = disable;
	    
	    var resultsPerPage = <es:dijit />.byId(EDR.prefix+"resultsPerPage");
	    if (resultsPerPage) resultsPerPage.setDisabled(disable);	
	    
	    var printResultsButton = <es:dijit />.byId(EDR.prefix+"printResultsButton");
	    if (printResultsButton) printResultsButton.setDisabled(disable);	
	    
	    if (disable) {
		    <es:dojo />.query("a[id^='results-']", <es:dijit />.byId(EDR.prefix+"horizontalSearchPanes").resultToolbar.domNode).forEach(
		      function(item) {
		        item.onclick = function() { return false; }
        		item.style.textDecoration = 'none';
		      }
		    );
		}
	},
		    
	showPreview: function(id) {
	
		// Show the preview dialog
		function successCallback(response, ioArgs) {			
			var dlg = <es:dijit />.byId(EDR.prefix+EDR.email.Constants.EMAIL_PREVIEW_DOM_ID);
			EDR.dialog.util.setContent(dlg, response);	
			
			var previewTabContainer = <es:dijit />.byId(EDR.prefix+"previewTabContainer");
			EDR.dialog.util.show(dlg);
			
			// ORDER IS IMPORTANT! THESE HAVE TO GO AFTER THE DIALOG IS RENDERED
			previewTabContainer.startup();
			previewTabContainer.resize();
			
		}
		
		EDR.ajax.Request.get(
			{ 
				url: EDR.email.Constants.PREVIEW_URL + 
				'&' + EDR.email.Constants.EMAIL_ID + '=' + encodeURIComponent(id),
				progressText: EDR.messages.K0001I_COMMON_LOADING_PROGRESS,
				successCallback: successCallback,
				errorCallback: EDR.bean.Email.handleSearchError
			}
		);	
		
		return false;		
	},
	
	// Generate a printable version of the e-mail preview
	showPrintablePreview: function() {
	
		var newWindow = window.open(EDR.contextPath + "/email.do?action=generatePrintablePreview");
		newWindow.focus();	
		
	},
	
	
	// Generate a printable version of the attachment preview
	showPrintableAttachment: function() {
	
		var newWindow = window.open(EDR.contextPath + "/email.do?action=generatePrintablePreview&printAttachment=true");
		newWindow.focus();	
		
	},
	
	// expand each results (show details)
	expandResults: function() {
		EDR.bean.Email.showDetails = true;
		var resultToolbar = 
		<es:dijit />.byId(EDR.prefix+"horizontalSearchPanes").resultToolbar.expandResultsButton.setDisabled(true);
		<es:dijit />.byId(EDR.prefix+"collapseResultsButton").setDisabled(false);
		
		<es:dojo />.query(".results-document-details").forEach(function(div) {
			<es:dojo />.style(div, "display", "block");
		});
	},
	
	// collapse each results (hide details)
	collapseResults: function() {
		EDR.bean.Email.showDetails = false;
		
		<es:dijit />.byId(EDR.prefix+"horizontalSearchPanes").resultToolbar.expandResultsButton.setDisabled(false);
		<es:dijit />.byId(EDR.prefix+"collapseResultsButton").setDisabled(true);
		
		<es:dojo />.query(".results-document-details").forEach(function(div) {
			<es:dojo />.style(div, "display", "none");
		});		
	},
	
    // User selected the Email result checkbox
	selectedEmailResult: function(checkbox) {
	   var disabled = true;
	   if ((checkbox && checkbox.checked) || EDR.bean.Email.hasSelectedResults()) {
	       disabled = false;
	   }
	   g('result-number-selected').innerHTML = EDR.bean.Email.getNumberOfSelectedResults();
	
	   // Uncheck Select All
	   g('emailSelectAll').checked = false;
	},
	
	selectAll: function(checked) {
		if (typeof checked == "undefined") {
		    checked = true;
		}
		for (var i=1 ; ; i++) {
			var checkboxElement = g('email-list-selected-checkbox-'+i);
			if (!checkboxElement) {
				break;
			} else {
				// Only set check=true for checkboxes where disabled==false
				// Allow setting check=false for all checkboxes
				if (!checkboxElement.disabled || !checked) {
					checkboxElement.checked = checked;
				}
			}
		}
		
		if (checked) {
			g('result-number-selected').innerHTML = g('result-number').innerHTML;
		} else {
			g('result-number-selected').innerHTML = EDR.bean.Email.getNumberOfSelectedResults();
		}
	},
	
    // User selected the More link for To Addresses
	displayEmailToAddresses: function(toValues) {
	   if (toValues.charAt(0) == '[' && toValues.charAt(toValues.length - 1) == ']') {
	      toValues = toValues.substr(1, toValues.length - 2);
	   }
	   var toArray = toValues.split(", ");
	   var screenData = "";
	   for (var i = 0 ; i < toArray.length ; i++) {
	       screenData += toArray[i] + "<br/>";
	   }
	   var emailToElement = g(EDR.prefix+'displayEmailToAddressData');
	   emailToElement.innerHTML = screenData;
	   EDR.dialog.util.showById(EDR.prefix+'displayEmailToAddressDialog'); 
	},

    // User selected the More link for Flags
	displayEmailFlags: function(flagValues) {
	   if (flagValues.charAt(0) == '[' && flagValues.charAt(flagValues.length - 1) == ']') {
	      flagValues = flagValues.substr(1, flagValues.length - 2);
	   }
	   var flagArray = flagValues.split(", ");
	   var screenData = "";
	   for (var i = 0 ; i < flagArray.length ; i++) {
	       screenData += flagArray[i] + "<br/>";
	   }
	   var emailFlagElement = g(EDR.prefix+'displayEmailFlagsData');
	   emailFlagElement.innerHTML = screenData;
	   EDR.dialog.util.showById(EDR.prefix+'displayEmailFlagsDialog'); 
	},

	// Close the email set flags dialog
	closeSetEmailFlagsDialog: function() {
		 EDR.dialog.util.hide('setEmailFlagsDialog');
	},
	
    // User selected "Set flags"	
	showSetEmailFlagsDialog: function(documentID, tagUpdateToken, tagDocId) {
		function successCallback(response, ioArgs) {
			// Show the set flag dialog
			var dlg = <es:dijit />.byId('setEmailFlagsDialog');
			//dlg.setContent(response);
			EDR.dialog.util.setContent(dlg, response);
			g('setEmailFlagsError').style.display = "none";
			EDR.bean.Email.setFlagCheckboxesInitialize('setEmailFlags-', EDR.bean.Email.changedSetEmailFlagValue, 'setFlagsForm');
			EDR.dialog.util.show(dlg);  
			<es:dijit />.byId('setEmailFlags-clearAll').adjustButtonWidth();
		}
		
		// Save the documentId, tagUpdateToken, & tagDocId for later
        EDR.bean.Email.selectedPrefixDocumentID = documentID;
        EDR.bean.Email.selectedPrefixTagUpdateToken = tagUpdateToken;
        EDR.bean.Email.selectedPrefixTagDocId = tagDocId;
        
		// Use either the input documentID or the selected email results documentIDs
		var docIds = [];
		if (documentID) {
            docIds[docIds.length] = documentID;
		} else {
		    if (!EDR.bean.Email.hasSelectedResults()) {
				EDR.dialog.ErrorDialog.show(EDR.messages.K0014I_ERROR_RESULT_REQUIRED);
			}
			// Check to see if all were selected
	    	if (g('emailSelectAll').checked) {
				docIds[docIds.length] = "all";
			} else {	
				for (var i=1 ; ; i++) {
					var checkboxElement = g('email-list-selected-checkbox-'+i);
					if (!checkboxElement) {
					   break;
					} else {
					   if (checkboxElement.checked) {
				    	  var documentIDElement = g('email-list-documentID-'+i);
					      if (documentIDElement) {
					          docIds[docIds.length] = documentIDElement.value;
					      }
					   }
					}   
				}
			}
		} 

        // Create URL with the documentIDs
		var url = EDR.contextPath + '/email.do';
		var params = {};
		params.action = 'getFlags';
	    for (var i = 0 ; i < docIds.length ; i++) {
			params[EDR.email.Constants.EMAIL_ID + i] = docIds[i];
	    }		
	    
		EDR.ajax.Request.post({ 
				url: url,
				content: params,
				progressText: EDR.messages.K0001I_COMMON_LOADING_PROGRESS, 
				successCallback: successCallback,
				errorCallback: EDR.bean.Email.handleSearchError
		});	
	},
	
	validateSetEmailFlags: function() {
		g('setEmailFlagsError').style.display = "none";
		return true;
	},
	
	submitSetEmailFlags: function() {
		if (!EDR.bean.Email.validateSetEmailFlags()) { return false; }
		
		function successCallback(response, ioArgs) {			
			var json = <es:dojo />.fromJson(response);
			if (typeof(json) == 'object' && json.emailError != null && json.emailError != "") {
				g(EDR.prefix+'setEmailFlagsError').innerHTML = json.emailError;
				g(EDR.prefix+'setEmailFlagsError').style.display = "";
				EDR.dialog.util.showById(EDR.prefix+'setEmailFlagsDialog'); //re-centers the dialog
				
			} else {	
				EDR.bean.Email.closeSetEmailFlagsDialog();
				
				// Refresh preview screen in order to see the new flag values on it
        		var dlg = <es:dijit />.byId(EDR.prefix+EDR.email.Constants.EMAIL_PREVIEW_DOM_ID);
			    if (sltedDocId && (dlg && dlg.open == true)) { 
			       EDR.bean.Email.showPreview(sltedDocId);
			    }
			    
			    // Refresh email result & facet areas in order to see the new flag values on it
				EDR.bean.Email.refreshEmailPage(); 
			} 
		}
		
		g('setEmailFlagsError').style.display = "none";
		
		// Get the selected flag values from the screen
		var clearFlagValues = [];
		var setFlagValues = [];
		for (var i=1 ; ; i++) {
			var element = g('setEmailFlags-'+i);
			if (!element) {
			   break;
			} else {
			   var tagName = g('setEmailFlagsName-'+i);
			   var originalTagValue = g('setEmailFlagsOriginalValue-'+i);
			   var elementValue = g('setEmailFlags-'+i+'_value').value;
			   if (elementValue == "false") {
			      if (tagName && originalTagValue && (originalTagValue.value != 'false')) {
			          clearFlagValues[clearFlagValues.length] = tagName.value; 
			      }    
			   } else if (elementValue == "true") {
			      if (tagName && originalTagValue && (originalTagValue.value != 'true')) {
			          setFlagValues[setFlagValues.length] = tagName.value; 
			      }    
			   }
			}   
		}

        // Generate the setFlags URL using either the passed in token/docid or the selected results token/docid
        var url = "";
        
        // If on the preview screen, then use the specified prefix doc's update token/docid
	    if (EDR.bean.Email.selectedPrefixDocumentID) {
			// Create URL 
			url = EDR.contextPath + '/email.do?action=setFlags';
			
			// Add the array of flagValues to the URL
			if (setFlagValues) {
				for (var i = 0 ; i < setFlagValues.length ; i++) {
					url += '&flagValue=' + encodeURIComponent(setFlagValues[i]);
				}
			}	
			// Add the array of flagValues to the URL
			if (clearFlagValues) {
				for (var i = 0 ; i < clearFlagValues.length ; i++) {
					url += '&clearFlagValue=' + encodeURIComponent(clearFlagValues[i]);
				}
			}	
		
			// Add the selected tagDocId & tagUpdateToken to the URL
		    url += '&tagDocId=' + encodeURIComponent(EDR.bean.Email.selectedPrefixTagDocId) + '&tagUpdateToken=' + encodeURIComponent(EDR.bean.Email.selectedPrefixTagUpdateToken);
	    } else {
			url = EDR.bean.Email.getSetFlagsURLForSelectedDocuments(setFlagValues, clearFlagValues); 
	    }		

		// Need to save the documentID value so that it can be used by successCallback	    
	    var sltedDocId = EDR.bean.Email.selectedPrefixDocumentID;
		
		EDR.ajax.Request.get({ 
				url: url,
				showProgressText: EDR.messages.K0014I_INFO_SETTING_EMAIL_FLAGS,
				successCallback: successCallback,
				errorCallback: EDR.bean.Email.handleSearchError
							});	
	},
	
	refreshEmailPage: function() {
		var page = g('results-current-page');
	    // Refresh email screen in order to see the new flag values on it
	    // NOTE: call pageThruEmails sync in order for the session to contain the results which will be used by getTopFacets to determine the facet counts
		EDR.bean.Email.pageThruEmails(page.innerHTML, true, true);
		// Update the top facets for refinement to see the new flag values on it
	},
	
	// The user selected the "clear all" link
	clearAllEmailFlagsOnSetFlagDialog: function() {
	    // clear the UI values
		for (var i=1 ; ; i++) {
			var element = g(EDR.prefix+'setEmailFlags-'+i);
			if (!element) {
			   break;
			} else {
			   g(EDR.prefix+'setEmailFlags-'+i+'_value').value = "false";
			   EDR.bean.Email.clickedSetFlagCheckbox('setEmailFlags-'+i, true);
			}   
		}
		
		// Show the disabled "Clear all" link
        <es:dijit />.byId(EDR.prefix+'setEmailFlags-clearAll').setDisabled(true);
	},
	
    // The user changed a flag value on the set flag dialog
    changedSetEmailFlagValue: function(checkbox) {
        // Set the checkbox value
        if (checkbox) {
	        EDR.bean.Email.clickedSetFlagCheckbox(checkbox.id, false); 
	    }    
	    
        // Determine if all the values are set to clear
	    var isAllDeselected = true;
		for (var i=1 ; ; i++) {
			var element = g('setEmailFlags-'+i);
			if (!element) {
			   break;
			} else {
			   var elementValue = g(EDR.prefix+'setEmailFlags-'+i+'_value').value;
			   if (elementValue != "false") {
			       isAllDeselected = false;
			       break;
			   }
			}   
		}
		
		// If all the values are set to cleared, then show the disabled "clear all" link
		if (isAllDeselected) {
        	<es:dijit />.byId(EDR.prefix+'setEmailFlags-clearAll').setDisabled(true);
    	} else { // Show the "clear all" link
        	<es:dijit />.byId(EDR.prefix+'setEmailFlags-clearAll').setDisabled(false);
    	}    
    },
    
	getSetFlagsURLForSelectedDocuments: function(setFlagValues, clearFlagValues) {
		// Create URL 
		var url = EDR.contextPath + '/email.do?action=setFlags';
		
		// Add the array of flagValues to the URL
		if (setFlagValues) {
			for (var i = 0 ; i < setFlagValues.length ; i++) {
				url += '&flagValue=' + encodeURIComponent(setFlagValues[i]);
			}
		}	
		
		// Add the array of flagValues to the URL
		if (clearFlagValues) {
			for (var i = 0 ; i < clearFlagValues.length ; i++) {
				url += '&clearFlagValue=' + encodeURIComponent(clearFlagValues[i]);
			}
		}	
		
	    if (g('emailSelectAll').checked) {
	    	// User wants to flag all e-mails that match this query
	    	url += "&selectAll=true";
	    } else {
		    // Get selected email result's tagDocIds & tagUpdateTokens
			var tagDocIds = [];
			var tagUpdateTokens = [];
			for (var i=1 ; ; i++) {
				var checkboxElement = g('email-list-selected-checkbox-'+i);
				if (!checkboxElement) {
				   break;
				} else {
				   if (checkboxElement.checked) {
				      var tagUpdateTokenElement = g('email-list-tagUpdateToken-'+i);
				      if (tagUpdateTokenElement) {
				          tagUpdateTokens[tagUpdateTokens.length] = tagUpdateTokenElement.value;
				      }
				      
				      var tagDocIdElement = g('email-list-tagDocId-'+i);
				      if (tagDocIdElement) {
				          tagDocIds[tagDocIds.length] = tagDocIdElement.value;
				      }
				   }
				}   
			}
			// Add the selected tagDocIds & tagUpdateTokens to the URL
			for (var i = 0 ; i < tagDocIds.length ; i++) {
			    url += '&tagDocId=' + encodeURIComponent(tagDocIds[i]) + '&tagUpdateToken=' + encodeURIComponent(tagUpdateTokens[i]);
			}
		}	
		return url;
	},
	
	getNumberOfSelectedResults : function() {
	    var num = 0;
		for (var i=1 ; ; i++) {
			var checkboxElement = g('email-list-selected-checkbox-' + i);
			if (!checkboxElement) {
			   break;
			} else {
			   if (checkboxElement.checked) {
			      num++;
			   }
			}   
		}
		return num;
	},
	
	getNumberOfCheckboxResults : function() {
	    var num = 0;
		for (var i=1 ; ; i++) {
			var checkboxElement = g('email-list-selected-checkbox-' + i);
			if (!checkboxElement) {
			   break;
			} else {
		      num++;
			}
		}
		return num;
	},
	
	hasSelectedResults : function() {
	    return EDR.bean.Email.hasSelectedCheckbox('email-list-selected-checkbox-');
	},

	hasSelectedCheckbox : function(checkboxPrefix) {
		for (var i=1 ; ; i++) {
			var checkboxElement = g(checkboxPrefix + i);
			if (!checkboxElement) {
			   break;
			} else {
			   if (checkboxElement.checked) {
			      return true;
			   }
			}   
		}
		return false;
	},

    /*
    // User selected "Set flag" for the input flagValue	
	setFlagForSelectedResults: function(flagValue) {
		function successCallback(response, ioArgs) {			
			//alert('status='+ioArgs.xhr.status+' text='+ioArgs.xhr.statusText+' responseText='+ioArgs.xhr.responseText+' response='+response);
			var json = <es:dojo />.fromJson(response);
			if (typeof(json) == 'object' && json.emailError != null && json.emailError != "") {			    
			    EDR.dialog.ErrorDialog.show(json.emailError);
			} else {
				EDR.bean.Email.refreshEmailPage(); 
			}			
		}
		
		if (!EDR.bean.Email.hasSelectedResults()) {
			EDR.dialog.ErrorDialog.show(EDR.messages.K0014I_ERROR_RESULT_REQUIRED);
		} else {
			var url = EDR.bean.Email.getSetFlagsURLForSelectedDocuments([ flagValue ]);
			EDR.ajax.Request.get({ 
						url: url,
						showProgressText: EDR.messages.K0014I_INFO_SETTING_EMAIL_FLAG,
						successCallback: successCallback
								 });
		}
	}, */
	
	setFlagCheckboxesInitialize: function(prefix, onclickCallback, formId) {
	    // Get the list of labels
    	var labels = document.getElementsByTagName("label");
	    var labelsArray = new Array();
    	for (var i = 0; i < labels.length; i++) {
        	var htmlFor = labels[i].getAttribute('htmlFor');
	        if (!htmlFor) {
    	        htmlFor = labels[i].getAttribute('for');
	        }
        	if (htmlFor) {
    	        labelsArray[htmlFor] = labels[i];
        	}
	    }
	    // Get the list of input checkboxes with attribute values
	    var form = document.getElementById(formId);
	    var inputArray = document.getElementsByTagName('img');
    	for (var i = 0; i < inputArray.length; i++) {
           	if (prefix && inputArray[i].name.substr(0, prefix.length) != prefix) {
               	continue;
            }
   	        var values = inputArray[i].getAttribute("values");
       	    if (values === null) { 
               continue; 
           	}
       	    var name = inputArray[i].name;
           	inputArray[i].id = name;

            // Create a hidden element that stores the checkbox's current value
   	        var hiddenElement = document.createElement('INPUT');
       	    hiddenElement.setAttribute('type', 'hidden');
           	hiddenElement.setAttribute('name', name + '_value');
            hiddenElement.setAttribute('id', name + '_value');
   	        hiddenElement.setAttribute('value', inputArray[i].getAttribute('value'));
       	    form.appendChild(hiddenElement);
           	inputArray[i].setAttribute('value', '');

			// When select the label, update the checkbox value & state
			var theOnclickCallback = onclickCallback;
			var label = labelsArray[name];
       	    if (label) {
           	    label.setAttribute('checkboxid', name);
               	label.onclick = function(e){
                    EDR.bean.Email.clickedSetFlagCheckbox(this.getAttribute('checkboxid'), false);
               	    if (theOnclickCallback) {
               	       theOnclickCallback();
               	    }
   	                return false;
       	        };
           	}
            EDR.bean.Email.clickedSetFlagCheckbox(name, true);
	    }
	},
	
	clickedSetFlagCheckbox: function(checkboxId, initialize) {
	    var checkbox = document.getElementById(checkboxId);
    	var checkboxValues = checkbox.getAttribute('values').split(',');
		// Get current value
    	var hiddenElement = document.getElementById(checkboxId+'_value');
	    var hiddenElementValue = hiddenElement.value;
    	// Set status to the next one
	    var status = 1;
    	if (hiddenElementValue == checkboxValues[1]) {
        	status = 2;
	    } else if (hiddenElementValue == checkboxValues[2]) {
    	    status = 0;
	    }
    	if (initialize) {
        	status--;
	    }
    	if (status == -1) { 
        	status = (checkboxValues.length - 1);
	    }
    	if (status >= checkboxValues.length) {
	       status = 0;
    	}
	    // Set the hidden element to the new status value
    	hiddenElement.value = checkboxValues[status];
	    // Set the checkbox's checked & disabled properties based on the new status
	    if (status == 0) { 
	       checkbox.src = "images/check_kiso_unsel13.png";
	       checkbox.alt = EDR.messages.K0015I_TOOLTIP_FLAG_SET;
	    } else if (status == 1) { 
	       checkbox.src = "images/check_kiso_sel13.png";
	       checkbox.alt = EDR.messages.K0015I_TOOLTIP_FLAG_SET_CHECKED;
	    } else {   
	       checkbox.src = "images/check_kiso_trisel13.png";
	       checkbox.alt = EDR.messages.K0015I_TOOLTIP_FLAG_SET_MIXED;
	    }
	},
	
	/**
	 * This method is fired when the user releases the mouse button in the e-mail
	 * preview pane.  If the user has selected text, a button will appear which
	 * will allow the user to ignore that text if desired.  If no text is selected,
	 * this method will merely return.
	 */
	checkForSelectedText: function(evt) {
	
		var selectedText = EDR.util.DOM.getSelectedText();
		var clickTarget = evt.target;
		if (clickTarget == null) {
			clickTarget = evt.srcElement;
		}
		if (selectedText != "") {
			EDR.bean.Email.selectedIgnoreText = selectedText;  
		} else if (clickTarget.type != 'button') {
			EDR.bean.Email.selectedIgnoreText = "";
		}
	
	},
	
	/**
	 * This method is called when the user presses the 'Ignore' button after selecting
	 * some text.  It will first issue a call to the server to make sure the text is valid
	 * and make sure only whole tokens are selected.  It will then show a dialog allowing
	 * the user to modify and save the selected text.
	 */
	showIgnoreTextDialog: function() {

		function successCallback(response, ioArgs) {
			// See if we got an error
			var json = <es:dojo />.fromJson(response);
			// A warning might be returned if we have to round to the nearest tokens
			if (json.ignoreTextWarning != null && json.ignoreTextWarning != "") {
				g(EDR.prefix+'addIgnoreTextError').innerHTML = json.ignoreTextWarning;
				g(EDR.prefix+'addIgnoreTextError').style.display = "block";
			} else if (json.ignoreTextError != null && json.ignoreTextError != "") {
				// We received an error from the server - the text was not found 
				EDR.util.alert(json.ignoreTextError);
				return;
			} else {
				g(EDR.prefix+'addIgnoreTextError').style.display = "none";
			} 

			g(EDR.prefix+'ignoreText').value = json.newIgnoreText;
			EDR.dialog.util.showById(EDR.prefix+'addIgnoreTextDialog');
		}
			
		if (EDR.bean.Email.selectedIgnoreText != null && EDR.bean.Email.selectedIgnoreText != "") {
			
			var attachId = EDR.bean.Attachment.getSelectedAttachmentID();
			g('ignoreText').value = EDR.bean.Email.selectedIgnoreText;
			g('ignoreTextID').value = "";
			g('addIgnoreTextError').style.display = "none";
			EDR.ajax.Form.submit(
				{ 
        			url: EDR.contextPath + "/case.do?action=validateIgnoreText&attachId=" + encodeURIComponent(attachId),
					formId: "addIgnoreTextForm",
					successCallback: successCallback
				}
			);	
			EDR.bean.Email.selectedIgnoreText = "";
					
		} else {
			EDR.util.alert(EDR.messages.K0014I_EMAIL_IGNORE_ERROR_NONE);
		}
	},
	
	/**
	 * This method will save the selected ignore text, along with its specified name
	 */
	saveIgnoreText: function() {
	
		// Submit the form to save the ignore text
		if (g('ignoreTextID').value == "") {
			g('addIgnoreTextError').innerHTML = EDR.messages.K0014I_ERROR_NAME_REQUIRED;
			g('addIgnoreTextError').style.display = "block";
			return;
		} else {
			g('addIgnoreTextError').style.display = "none";
		}
		
		function successCallback(response, ioArgs) {
			// See if we got an error
			var json = <es:dojo />.fromJson(response);
			if (json.ignoreTextError != null && json.ignoreTextError != "") {
				g('addIgnoreTextError').innerHTML = json.ignoreTextError;
				g('addIgnoreTextError').style.display = "block";
				if (json.newIgnoreText != null && json.newIgnoreText != "") {
					g('ignoreText').value = json.newIgnoreText;
				}
				return;					
			} else {
				g('addIgnoreTextError').style.display = "none";
				EDR.dialog.util.hide('addIgnoreTextDialog');
				EDR.util.alert(json.ignoreTextSuccess);
			} 

		}

		var attachId = EDR.bean.Attachment.getSelectedAttachmentID();
		
		EDR.ajax.Form.submit(
			{ 
        		url: EDR.contextPath + "/case.do?action=addIgnoreText&attachId=" + encodeURIComponent(attachId),
				formId: "addIgnoreTextForm",
				successCallback: successCallback
			}
		);
	},
	
	// This method generates a printer-friendly view of the results
	showPrintableView: function() {
	
		var newWindow = window.open(EDR.contextPath + "/search?action=generatePrintableResults");
		newWindow.focus();	
	
	},
	
	handleSearchError: function(response, ioArgs) {
		var json = <es:dojo />.fromJson(response);
		if(json.isDisabledError) {
			var str = json.error;
			if (json.detailedError != null) {
				str = str + "\n" + json.detailedError;
			}
			//var dialog = <es:dijit />.byId(EDR.prefix+'caseDisabledDialog');
			//dialog.setContent(str);
			//EDR.dialog.util.show(dialog);
			EDR.util.alert(str);
			return;
		} else {
			EDR.ajax.Error.handle(response, ioArgs);
		}
	}
}
   

EDR.bean.Attachment = {
    selectedEmailID: "", 
    selectedAttachmentID: "",
    selectedFileName: "",

	view: function(emailId, attachmentFileName, attachmentId) { 
		
		function successCallback(response, ioArgs) {	
			// See if we got an error
			var json = {};
			try {
				json = <es:dojo />.fromJson(response);
			} catch (e) {
				// json format error
			}
			if (typeof(json) == 'object' && json.error != null && json.error != "") {
				EDR.util.alert(json.error);
				return;					
			} 
			
			var tabs = g('previewTabs');
			var tabsContent = g('previewTabContent');
			
			// Tab ID
			var tabId = 'tab' + attachmentId;
			
			var match = false;
			
			var tabNodeRight;
			var selectedTabNodeId = 'tabEmail'; // Default to Email tab 
			
			// Look for an existing tab with this attachment ID
			if (tabs.hasChildNodes()) {
				var tabNodes = tabs.childNodes;
				var tabNode;
				for (var i = 0; i < tabNodes.length; i++) { 
					tabNode = tabNodes[i];
					
					// Get the currently selected tab ID
					if (tabNode.id != null && EDR.util.Tabs.isSelected(tabNode.id)) {
					    selectedTabNodeId = tabNode.id;
					}
					
					if (tabNode.id == tabId) {
						tabContentNode = g(tabId + 'Content');
						tabContentNode.innerHTML = response;
						match = true;
					}
					
					if (tabNode.id == "tabButtonContainerRight") {
						tabNodeRight = tabNode;
					}
				}
			}
			
			if (!match) {
				
				// Get the email tab
				var emailTab = g('tabEmail');
				var emailTabContent = g('tabEmailContent');
							
				// Clone the email tab
				var tabClone = emailTab.cloneNode(true);
				tabClone.id = tabId;		
				tabClone.onclick = function() { EDR.util.Tabs.hideAll('previewTabs');EDR.util.Tabs.show(tabId);EDR.bean.Attachment.selectedEmailID=emailId;EDR.bean.Attachment.selectedAttachmentID=attachmentId;EDR.bean.Attachment.selectedFileName=attachmentFileName; }
				tabClone.onmouseover = function() { EDR.util.Tabs.mouseOver(tabId); }
				tabClone.onmouseout = function() { EDR.util.Tabs.mouseOut(tabId); }
				var tabCloneCloseImg = null; 
								
				// Set the tab name
				if (tabClone.hasChildNodes()) {
					var tabNodes = tabClone.childNodes;
					var child;
					for (var i = 0; i < tabNodes.length; i++) {
						child = tabNodes[i];
						if (child.className == 'tabActiveLeft') {
							
						} else if (child.className == 'tabActiveMiddle' || child.className == 'tabInactiveMiddle') {
							
							if (child.hasChildNodes()) {
								var tabMiddleChildren = child.childNodes;
								var tabMiddleChild;
								for (var j = 0; j < tabMiddleChildren.length; j++) {
									tabMiddleChild = tabMiddleChildren[j];
									if (tabMiddleChild.className == 'tabText') {
										
										// TODO: Do we need to truncate????
										tabMiddleChild.innerHTML = attachmentFileName;
										
									} else if (tabMiddleChild.className == 'tabEmailIconActive' || 
										tabMiddleChild.className == 'tabEmailIconInactive') {
										tabMiddleChild.className = 'tabAttachmentIconActive';
									}
								}
								
								// Add a close icon
								var closeLink = document.createElement("a");
								closeLink.className = "tabCloseLink";
								closeLink.setAttribute("href", "javascript:;");								
								closeLink.onclick = function(event) { EDR.util.Tabs.close('previewTabs', 'previewTabContent', tabId); EDR.util.DOM.stopEventPropagation(event);};
								var closeImg = document.createElement("img");
								closeImg.src = "images/section_close8.png";
								closeLink.appendChild(closeImg);
								tabMiddleChild.appendChild(closeLink);
								tabCloneCloseImg = closeImg; 
							}
							
						} else if (child.className == 'tabActiveRight') {
							
						}					
					}
				}
				
				// Create the content element
				var tabContent = document.createElement("div");
				tabContent.id = tabId + 'Content';
				//tabContent.className = 'previewContent';
				tabContent.className = 'tabContent';
				
				// Set the tab content
				tabContent.innerHTML = response;
				
				// Add the new tab to the container
				if (tabNodeRight != null) {
					tabs.insertBefore(tabClone, tabNodeRight);
				} else {
					tabs.appendChild(tabClone);
				}
				
				// If the tab cannot be displayed, then remove it 
				if (tabClone.offsetTop != emailTab.offsetTop) {
					tabs.removeChild(tabClone);
					EDR.util.alert(EDR.messages.K0014I_COMMON_MAX_NUMBER_TABS);
					return;
				}	
				// If the close image of the tabClone cannot be displayed on the 1st line, then remove the tabClone
				if (tabCloneCloseImg && (tabCloneCloseImg.offsetTop >= tabClone.offsetHeight)) { 
					tabs.removeChild(tabClone);
					EDR.util.alert(EDR.messages.K0014I_COMMON_MAX_NUMBER_TABS);
					return;
				} 
				
				tabsContent.appendChild(tabContent);
				
				// Hide all tabs  
				EDR.util.Tabs.hideAll('previewTabs');
				
				// Show the newly created tab			
				EDR.util.Tabs.show(tabId);
				
				// Check that the tab didn't move to the next line after it was made active
				if (tabClone.offsetTop != emailTab.offsetTop) {
					tabs.removeChild(tabClone);
					tabsContent.removeChild(tabContent);
					EDR.util.Tabs.show(selectedTabNodeId);
					EDR.util.alert(EDR.messages.K0014I_COMMON_MAX_NUMBER_TABS);
					return;
				}	
				
 				<es:dojo />.parser.parse(tabId + 'Content'); // needed to display the widgets.Toolbar
 				
			} else {
				// Hide all tabs 
				EDR.util.Tabs.hideAll('previewTabs');
			
				// Show the newly created tab			
				EDR.util.Tabs.show(tabId);
				<es:dojo />.parser.parse(tabId + 'Content'); // needed to display the widgets.Toolbar
			}
		}
		
		EDR.bean.Attachment.selectedEmailID = emailId;
		EDR.bean.Attachment.selectedAttachmentID = attachmentId;
		EDR.bean.Attachment.selectedFileName = attachmentFileName;
		var theAttachmentFileName = attachmentFileName;
		
		var url = 'attachment.do?action=view' +
			'&emailId=' + encodeURIComponent(emailId) + 
			'&attachmentId=' + encodeURIComponent(attachmentId);
		
		EDR.ajax.Request.get({ 
			url: url,
			successCallback: successCallback,
			errorCallback: EDR.bean.Email.handleSearchError
		});
	},
	
	download: function(emailId, attachmentFileName, attachmentId) {
  	    if (typeof emailId == "undefined") {
			if (EDR.util.Tabs.isSelected('tabEmail')) {
				EDR.util.alert(EDR.messages.K0014I_EMAIL_DOWNLOAD_ERROR_NONE);
			} else {
	  	        var form = g('attachmentForm');
	  	        form.attachmentEmailId.value = EDR.bean.Attachment.selectedEmailID;
  		        form.attachmentId.value = EDR.bean.Attachment.selectedAttachmentID;
  	    	    form.attachmentFileName.value = EDR.bean.Attachment.selectedFileName;
  	        	form.submit();
			}
			
  	    } else {
  	        var form = g('attachmentForm');
  	        form.attachmentEmailId.value = emailId;
  	        form.attachmentId.value = attachmentId;
  	        form.attachmentFileName.value = attachmentFileName;
  	        form.submit();
  	    }
	},
	
	/**
	 * This method will return the currently displayed attachment ID based on what
	 * tab is open, or 0 if the main e-mail body is currently open.
	 */
	getSelectedAttachmentID: function() {
	
		var attachId = "0";
		// Figure out which attachment, if any, contains the selected text
		var tabs = g('previewTabs');
		
		if (tabs.hasChildNodes()) {
			var tabNodes = tabs.childNodes;
			var tabNode;
			for (var i = 0; i < tabNodes.length; i++) { 
				tabNode = tabNodes[i];
				if (tabNode.id != null && EDR.util.Tabs.isSelected(tabNode.id)) {
					attachId = tabNode.id.substring(3);
				}
			}
		}
		
		if (attachId == "Email") {
			attachId = "0";
		}
		
		return attachId;
	}
}