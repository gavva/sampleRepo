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

EDR.search = {
    currentSearchRequestId: -1,
    
    // Infinite timeout value for long running requests
    longRunningProcessTimeOut: 0,
    
    previousQuery: "",
    
    genRequestId: function() {
	   var ms = (new Date()).getTime();
	   EDR.search.currentSearchRequestId = ms;
	   return ms;	
	},
	
    getCurrentRequestId: function() {
       return EDR.search.currentSearchRequestId;
    },
    
    storeFetchError: function(errorData, request) {
       // make a server request to determine if the error occurred due to a session tmeout
       EDR.ajax.Request.get(
			{ 
				url: EDR.contextPath + "/search?action=getCriteria",
				showProgress: false
			}
	   );      
    },
    
    facetRenderingCancelled: false,
    
	loadPreviousExecutedQuery: function() {
	
		EDR.search.Form.hideErrorMessages();
		
		// Make our Ajax call to restore the last executed query
		EDR.ajax.Request.get(
			{ 
				url: EDR.contextPath + "/search?action=restorePreviousExecutedQuery",
				progressText: EDR.messages.K0003I_SEARCH_SEARCHING,
				beforeSetContentCallback: EDR.search.Form.beforeSetContentCallback,
				successCallback: EDR.search.Form.processSearchResults,
				errorCallback: EDR.search.Form.handleSearchError,
				timeout: EDR.search.longRunningProcessTimeOut,
				content: {requestId: EDR.search.genRequestId()}
			}
		);
		
	},
	
	loadNextExecutedQuery: function() {
	
		// Make our Ajax call to restore the last executed query
		EDR.ajax.Request.get(
			{ 
				url: EDR.contextPath + "/search?action=restoreNextExecutedQuery",
				progressText: EDR.messages.K0003I_SEARCH_SEARCHING,
				beforeSetContentCallback: EDR.search.Form.beforeSetContentCallback,
				successCallback: EDR.search.Form.processSearchResults,
				errorCallback: EDR.search.Form.handleSearchError,
				timeout: EDR.search.longRunningProcessTimeOut,
				content: {requestId: EDR.search.genRequestId()}
			}
		);
				
	},
	
	showSearchPage: function() {
		window.location = EDR.search.Constants.SEARCH_INITIAL_URL;
	},
		
	/**
	 * Refreshes the various search UI elements.
	 */
	refresh: function(requestId) {			
	
		// clear search type
		<es:dijit />.byId(EDR.prefix+"searchPane").setSearchType("search");

		// clear query inputs
		<es:dijit />.byId(EDR.prefix+"basicSearchPane").clearPane();
		<es:dijit />.byId(EDR.prefix+"advancedSearchPane").clearPane();
		
		// Update the top facets for refinement
		EDR.search.Form.getSearchCriteria();
		EDR.search.Form.getTopFacets(requestId);
		EDR.search.Form.getDynamicFacetChart();
		EDR.search.Form.getDynamicFieldChart();
		EDR.search.Form.getFileSizeChart();
		
		// Refresh results per page UI to avoid FF2 layout problem
//		setTimeout(function() { <es:dijit />.byId(EDR.prefix+"resultsPerPage").startup(); } , 0);
	},
	
	/**
	 * Re-executes the current query and refreshes the various search UI elements
	 */
	refreshResults: function() {

		EDR.ajax.Request.get(
			{ 
				url: EDR.contextPath + "/search?action=refreshResults",
				progressText: EDR.messages.K0003I_SEARCH_SEARCHING,
				beforeSetContentCallback: EDR.search.Form.beforeSetContentCallback,
				successCallback: EDR.search.Form.processSearchResults,
				errorCallback: EDR.search.Form.handleSearchError,
				timeout: EDR.search.longRunningProcessTimeOut,
				content: {requestId: EDR.search.genRequestId()}
			}
		);
		
		return false;

	},
	
	/**
	 * Clears the various search UI elements.
	 */
	reset: function() {
    	
    	// Focus on keywords field
    	EDR.util.Form.focus('keywords');
    	
		// Clear the criteria div
		EDR.search.Criteria.clearInputValue();
		
		// Clear the email list div
		var eDiv = <es:dijit />.byId(EDR.search.Constants.EMAIL_RESULTS_ELEMENT_ID);
		eDiv.setContent("");
		
		// Clear the refinement pane
		var refinementDiv = g('refinement');
		refinementDiv.style.display = "none";
  		
		// Clear the error message div
		EDR.search.Form.hideErrorMessages();
		
		// Kick off an Ajax request to clear the session data
		EDR.ajax.Request.get(
			{ 
				url: EDR.contextPath + "/search?action=reset",		
				showProgress: false	
			}
		);
		
		// Clear the Timeline
		EDR.search.Form.updateTimeline(-1);
	},
	
    hideCaseInfo: function() {
       if (g('ToolbarTabs_rightContent')) {
	       g('ToolbarTabs_rightContent').style.display = 'none';
	   }
    },
    
    showCaseInfo: function() {
       if (g('ToolbarTabs_rightContent')) {
	       g('ToolbarTabs_rightContent').style.display = '';
	   }
    },
    
	loadCorpus: function() {
	  EDR.ajax.Request.get({
	    url: EDR.search.Constants.SEARCH_URL + 
		        '&' + EDR.search.Constants.SEARCH_FORM_KEYWORDS_ID + '=' +
		        '&' + EDR.search.Constants.SEARCH_FORM_FROM_ID + '=' +
		        '&' + EDR.search.Constants.SEARCH_FORM_TOCCBCC_ID + '=' +
		        '&' + EDR.search.Constants.SEARCH_FORM_SUBJECT_ID + '=' +
		        '&' + EDR.search.Constants.SEARCH_FORM_FROM_DATE_ID + '=' +
		        '&' + EDR.search.Constants.SEARCH_FORM_TO_DATE_ID + '=',
			    progressText: EDR.messages.K0003I_COMMON_LOADING,
				beforeSetContentCallback: EDR.search.Form.beforeSetContentCallback,
				successCallback: EDR.search.Form.processSearchResults,
				errorCallback: EDR.search.Form.handleSearchError,
				timeout: EDR.search.longRunningProcessTimeOut,
				content: {requestId: EDR.search.genRequestId()}
		}
	  )
	},
	
	// This method is called when the user clicks the link to show/hide the
	// details of a query parse error
	toggleErrorDetails: function() {
		
		var errorDiv = g('search-error-details');
		if (errorDiv.style.display == "none") {
			// Show the details
			errorDiv.style.display = "block";
			g('error-details-link').innerHTML = EDR.messages.K0001I_COMMON_HIDE_DETAILS;
		} else {
			// Hide the details
			errorDiv.style.display = "none";
			g('error-details-link').innerHTML = EDR.messages.K0001I_COMMON_DETAILS;
		
		}
	
	},
	
	searchPageGlobalResizeHandler: function() {
		EDR.search.Form.formContainerOnResize();
	}
}

EDR.search.query = {
    filterTimer: null,
    
    filter: "",
    
    selectedSearch: null,
    
    searchStore: null,
    
    openGroups: {},
    
    groupComboData: null,    
    
    showSaveDialog: function() {
      var renderDialog = function(searches, request) {
         var d = <es:dijit />.byId(EDR.prefix+"saveSearchDialog");
	     var errorDiv = <es:dojo />.byId(EDR.prefix+"saveSearchError");
	     errorDiv.style.display = "none";
	     EDR.util.Form.clear(d.id);
	     EDR.search.Form.markFieldValid(EDR.search.Constants.SEARCH_SAVE_FORM_ERROR_ID,
	        EDR.search.Constants.SEARCH_SAVE_FORM_NAME_ID); 
	     g(EDR.prefix+'saveSearchForm').queryString.value = <es:dijit />.byId(EDR.prefix+'query-string').getValue();
	     // Extract group data for combo-box
	     var comboValues = [];
	     var prevGroup = null;	    
         for (var j = 0; j < searches.length; j++) {
           // add the group to the import combobox
           var currentGroup = searches[j].group[0];  
           if (currentGroup != prevGroup && currentGroup != "") {    
              comboValues.push({name: currentGroup});
           }
           prevGroup = currentGroup;
         } 
	     <es:dijit />.byId(EDR.prefix+'group').store = new <es:dojo />.data.ItemFileReadStore({data: {identifier: "name", items: comboValues}}); 
	     EDR.dialog.util.show(d);
      }    
      EDR.search.query.initSearchStore(); 
      EDR.search.query.searchStore.fetch({sort: [{attribute:'group'}], onComplete: renderDialog, onError: EDR.search.storeFetchError});      
    },
    
    saveHandler: function() {
      <es:dojo />.hitch(this, EDR.search.query.save, {hideDialogOnSuccess: true})();
    },
    
    saveEdited: function() {
      var context = <es:dijit />.byId(EDR.prefix+"manageSavedSearchDialog");
      <es:dojo />.hitch(context, EDR.search.query.save, 
                 {
                   hideDialogOnSuccess: false, 
                   postSuccess: <es:dojo />.hitch(context, EDR.search.query.renderSavedSearches)
                 })();           
    },
    
    save: function(params) {       
      var form = <es:dojo />.query("form[class='saved-search-edit-form']", this.domNode)[0];
      var error = <es:dojo />.query("div[id$='SearchError']", this.domNode)[0];        
      
      var context = this;         
      EDR.ajax.Form.submit(      
			{ 
				url: EDR.search.Constants.SAVE_SEARCH_URL,
				formId: form.id,
				progressText: EDR.messages.K0023I_SAVING_SEARCH,
				successCallback: function(response, ioArgs) {				  
				  EDR.search.query.saveSuccessful(<es:dojo />.fromJson(response));
				  if (params.hideDialogOnSuccess && params.hideDialogOnSuccess == true) {
				    EDR.dialog.util.hide(context.id);
				  }
				  if (params.postSuccess) {
				    params.postSuccess();
				  }
				},
				errorCallback: <es:dojo />.hitch(context, EDR.search.query.handleSaveError)
			}
	  );	  
    },
    
    saveSuccessful: function(savedQueries) {      
      store = EDR.search.query.searchStore;
      for (var i = 0; i < savedQueries.length; i++) {
        var savedQuery = savedQueries[i];
        if (savedQuery.isDefault == "true") { 
          // This is the new default search. If there's a default search
          // in the cached store, turn off its default flag.
          store.fetch({query: {isDefault:"true"}, 
                     onItem: function(query, request) {
                         query.isDefault = "false";               
                     }
                     });
        }
        store.fetchItemByIdentity(
          {
            identity:savedQuery.name, 
            onItem: function(item) {
              if (item == null) {
                store.newItem(savedQuery);
              }
              else {
                // update item attribute values
                for (var key in savedQuery) {
                  if (key != 'name') {
                   store.setValue(item, key, savedQuery[key]);
                  }
                }
              }
            }  
          }
        );
      }
      // commit the store
      store.save();
      EDR.search.query.selectedSearch = null;      
    },
    
    importQuery: function() {
	   // EDR.dialog.ProgressDialog.show(EDR.messages.K0023I_IMPORTING_SAVED_SEARCHES);
       <es:dojo />.io.iframe.send(
         {
           form: "queryImportForm",
           url: EDR.search.Constants.IMPORT_SEARCH_URL,
           handleAs: "json",
           load: function(data){
              EDR.search.query.saveSuccessful(data); 
              var context = <es:dijit />.byId(EDR.prefix+"manageSavedSearchDialog");  
              <es:dojo />.hitch(context, EDR.search.query.renderSavedSearches)(); 
              <es:dijit />.byId(EDR.prefix+'importSearchDialog').onCancel();
              // EDR.dialog.ProgressDialog.hide();
              EDR.util.Form.clear(g(EDR.prefix+'queryImportForm'));     
              g('queryImportForm').importFile.value = '';               
           },
           error: function(response, ioArgs) {
		     // EDR.dialog.ProgressDialog.hide();
		     <es:dijit />.byId(EDR.prefix+'importSearchDialog').onCancel();
		     EDR.ajax.Error.handle(response, ioArgs);
		     return response;
		   },
		   timeout: 60000
         }
       );
    },
    
    deleteQuery: function(queryName) {
      var context = <es:dijit />.byId(EDR.prefix+"manageSavedSearchDialog");
      EDR.util.confirm(EDR.messages.K0023I_DELETE_SEARCH_CONFIRM, function() {
      	EDR.ajax.Form.submit(      
	      { 
		     url: EDR.search.Constants.DELETE_SEARCH_URL + "&name=" + encodeURIComponent(unescape(queryName)),				
	   	     progressText: EDR.messages.K0023I_DELETING_SEARCH,
	  	     successCallback: function(response, ioArgs) {
	  	       EDR.search.query.deleteSuccessful(response, ioArgs);
	  	       <es:dojo />.hitch(context, EDR.search.query.renderSavedSearches)()
	  	     },
	  	     errorCallback: <es:dojo />.hitch(context, EDR.search.query.handleSaveError)
	      }
	    );
	  });  
    },
    
    deleteSuccessful: function(response, ioArgs) {
      var deletedQuery = <es:dojo />.fromJson(response);      
      store = EDR.search.query.searchStore;
      store.fetchItemByIdentity(
        {
          identity:deletedQuery.name, 
          onItem: function(item) {
            if (item != null) {
              store.deleteItem(item);
            }
          }
        }
      );
      // commit the store
      store.save();
      EDR.search.query.selectedSearch = null;     
    },
    
    handleSaveError: function(response, ioArgs) { 
       var json = <es:dojo />.fromJson(ioArgs.xhr.responseText);
       if (json.errorType == "dupQuery") {
         var answer = confirm(json.message);
         if (answer) {
           <es:dojo />.hitch(this, EDR.search.query.save, true)();
         }
         else {           
           EDR.dialog.util.hide(this.id);
         }
       }
       else {     
         var errorDiv = <es:dojo />.query("div[id$='SearchError']", this.domNode)[0];       
         errorDiv.innerHTML = json.message;
         errorDiv.style.display = "block";
       }
    },
    
    select: function() {
      <es:dijit />.byId(EDR.prefix+'manageSearchApply').setDisabled(false);
      var searchNameElement = <es:dojo />.query("td[class='savedSearchName']", this)[0];    
      if (EDR.search.query.selectedSearch != null) {
         var oldElement = EDR.search.query.selectedSearch;
         oldElement.search.className = oldElement.classInfo;
      }      
      var identityText = searchNameElement.innerText ? searchNameElement.innerText : searchNameElement.textContent;          
      EDR.search.query.selectedSearch = {search: this, classInfo: this.className, identity: identityText};
      this.className = "savedSearch savedSearchSelected";
      <es:dijit />.byId(EDR.prefix+'runSelectedSearch').setDisabled(false);
    },
    
    primeEditSearchForm: function() {      
      EDR.search.query.searchStore.fetchItemByIdentity(
        {identity:EDR.search.query.selectedSearch.identity, 
         onItem: function(item) {
           var editForm = f('manageSearchEditForm');
           editForm.name.value = item.name; 
           editForm.group.value = item.group;           
           editForm.query.value = item.query;
           editForm.defaultQuery.checked = item.isDefault[0] == "true";
         }
        }); 
    },
    
    runSelectedSearch: function() {
      if (EDR.search.query.selectedSearch) {
        EDR.dialog.util.hide(this.id);
	    // Set the keywords field of the search form
	    f(EDR.search.Constants.SEARCH_FORM_ID).reset();
	    var selectedQuery = <es:dojo />.query("div[class='savedSearchQuery']", EDR.search.query.selectedSearch.search)[0];
	    var query = selectedQuery.innerText ? selectedQuery.innerText : selectedQuery.textContent;	  
	    f(EDR.search.Constants.SEARCH_FORM_ID).elements[EDR.search.Constants.SEARCH_FORM_KEYWORDS_ID].value = query;      
        return EDR.search.Form.submit(); 
      }     
    },
       
    loadManageSavedSearches: function() {
        EDR.search.query.initSearchStore();
        var d = <es:dijit />.byId(EDR.prefix+"manageSavedSearchDialog");        
        var name = <es:dojo />.query("input[name='name']", d.domNode)[0];
        var query = <es:dojo />.query("textarea[name='query']", d.domNode)[0];
        var error = <es:dojo />.query("div[id$='SearchError']", d.domNode)[0];
        EDR.search.Form.markFieldValid(error.id, name.id);
        EDR.search.Form.markFieldValid(error.id, query.id);
        EDR.search.query.resetDialog(d);        
    }, 
    
    resetDialog: function(dialog) {
        EDR.search.query.filter = ""; 
        EDR.search.query.selectedSearch = null;
        <es:dojo />.byId(EDR.prefix+'queryImportForm').importFile.value = "";        
        EDR.util.Form.clear(dialog.id);        
        // render the dialog
        (<es:dojo />.hitch(dialog, EDR.search.query.renderSavedSearches))();
    }, 
    
    initImportQueryDialog: function() {
       this.orient(g('manageSearchImport'), 'BR', 'BR');
       EDR.util.Form.clear('queryImportForm');    
       // IE doesn't let you clear a type=file field, so replace the old node with a new one   
       var old_input = <es:dojo />.byId(EDR.prefix+'importFileId');
       var new_input = old_input.cloneNode(false);
       new_input.onChange = old_input.onChange;
       new_input.value = "";
       old_input.parentNode.replaceChild(new_input, old_input);       
       setTimeout(function() {g(EDR.prefix+'importGroups').focus()}, 50);
	   <es:dijit />.byId(EDR.prefix+"importSearches").adjustButtonWidth();
	   <es:dijit />.byId(EDR.prefix+"cancelImportSearches").adjustButtonWidth();
    },
    
    initManageSavedSearchDialog: function() {
      var dialog = <es:dijit />.byId(EDR.prefix+"manageSavedSearchDialog");
      // wire up filter box handler
      var filter = <es:dojo />.query("input[id$='Filter']", dialog.domNode)[0];
      <es:dojo />.connect(filter, "onkeyup", dialog, EDR.search.query.filterChanged);
      dialog.postRenderFunction = function() {
          var editForm = <es:dojo />.query("form[class='saved-search-edit-form']", dialog.domNode)[0];
          EDR.util.Form.clear(editForm.id);
          <es:dojo />.query("tr[class~='savedSearch']", "manageSavedSearchDialog").forEach(
            function(item) {
              <es:dojo />.connect(item, "onfocus", item, EDR.search.query.select);
              <es:dojo />.connect(item, "onfocus", item, EDR.search.query.primeEditSearchForm);
              <es:dojo />.connect(item, "onclick", item, EDR.search.query.select);
              <es:dojo />.connect(item, "onclick", item, EDR.search.query.primeEditSearchForm);
              <es:dojo />.connect(item, "ondblclick", dialog.domNode, EDR.search.query.runSelectedSearch);
            }
          );
        };
    },
    
    focusGroup: function(obj) {       
       obj.className += " focussedGroup";
    },
    
    unfocusGroup: function(obj) {
       obj.className = obj.className.replace(" focussedGroup", '');
    },
    
    renderSavedSearches: function() {
      var dialog = this;
      var renderDom = function(searches, request) {
        var emptyGroup = "&lt;" + EDR.messages.K0003I_SEARCH_SAVE_UNGROUPED + "&gt;";
        var content = <es:dojo />.query("div[class='searchListContent']", dialog.domNode)[0];
        var htmlElements= new Array();
        var idx = 0;
        var groupIndex = 0;
        var searchIndex = 0;
        var currentGroup = null;
        var activeGroups = [];
        if (searches.length > 0) {            
	        for (var i = 0; i < searches.length; i++) {
	          var group = searches[i].group[0];
	          if (group == "") {
	            group = emptyGroup;
	          }
	          // render group heading
	          if (group != currentGroup) {
	            if (currentGroup != null) {
	              htmlElements[idx++] = "</tbody></table></div>";  // end previous group members table
	            }
	            groupIndex++;
	            searchIndex = 0;
	            currentGroup = group;	
	            activeGroups.push({name: group, id: i});                      
	            htmlElements[idx++] = "<div style=\"overflow:hidden\" class=\"clearFix savedSearchGroup" + ((groupIndex%2==0) ? " savedSearchGroup-row-even" : " savedSearchGroup-row-odd") + "\"><div style=\"float:left\"><a class=\"savedSearchLink\" onFocus=\"EDR.search.query.focusGroup(this);\" onBlur=\"EDR.search.query.unfocusGroup(this)\" href=\"javascript:;\" onclick=\"EDR.search.query.toggleGroupVisibility('" + dialog.id + "'," + i + ");\"><div id=\"" + EDR.prefix +  dialog.id + "-savedSearchGroup-" + i + "\">";
	            htmlElements[idx++] = "<img class=\"twistie\" id=\"" + EDR.prefix + dialog.id + "-savedSearchGroupTwistie-" + i + "\" src=\"images/arrow_right8.png\" title=\"" + EDR.messages.K0001I_COMMON_TOOLTIP_EXPANDCOLLAPSE + "\"/>";
	            htmlElements[idx++] = "<img src=\"images/savedsearches23.png\">";
	            htmlElements[idx++] = "<span class=\"savedSearchGroupName\">";
	            htmlElements[idx++] = searches[i].group[0] == "" ? group : EDR.util.String.htmlEscape(group);
	            htmlElements[idx++] = "</span>";           
	            htmlElements[idx++] = "</div></a></div>";	   
	            htmlElements[idx++] = "<div class=\"exportQueryLink\"><a href=\"" + EDR.contextPath + "/search?action=exportGroup&group=" + encodeURIComponent(searches[i].group) + "\"><img src=\"images/export23.png\" title=\"" + EDR.messages.K0015I_TOOLTIP_EXPORT_SAVED_SEARCHES + "\"/></span></a></div></div>";            
	            htmlElements[idx++] = "<div id=\"" + EDR.prefix + dialog.id + "-savedSearchGroupMembers-" + i + "\" class=\"savedSearchGroupMembers\" style=\"display:none\"/><table class=\"savedSearchTable\"><tbody>";
	          }        
	          searchIndex++;
	          htmlElements[idx++] = "<tr tabIndex=\"0\" id=\"" + EDR.prefix + dialog.id + "-savedSearch-" + i + "\" class=\"savedSearch" + ((searchIndex%2==0) ? " savedSearch-row-even" : " savedSearch-row-odd") + "\">";                                   
	          htmlElements[idx++] = "<td class=\"savedSearchName\">";
	          htmlElements[idx++] = searches[i].name;
	          htmlElements[idx++] = "</td>";
	          htmlElements[idx++] = "<td class=\"savedSearchInfo\">";            
	          htmlElements[idx++] = "<div id=\"" + EDR.prefix + dialog.id + "-savedSearch-query-" + i + "\" class=\"savedSearchQuery\">";
	          if (searches[i].isDefault[0] == "true") {
	             htmlElements[idx++] = "<img class=\"defaultSearchMarker\" src=\"images/default12.png\" title=\"" + EDR.messages.K0015I_TOOLTIP_DEFAULT_SEARCH + "\">";
	          }
	          htmlElements[idx++] = EDR.util.String.htmlEscape(searches[i].query[0]);	          
	          htmlElements[idx++] = "</div></td>";          
	          if (<es:dojo />.query("div[id$='actions']", dialog.domNode).length > 0) {
	            htmlElements[idx++] = "<td class=\"actionItem\"><div class=\"actionItemDiv\"><a href=\"javascript:;\" onclick=\"EDR.search.query.deleteQuery('" + escape(searches[i].name) + "');\"><img title=\"" + EDR.messages.K0001I_COMMON_DELETE + "\" src=\"images/delete23.png\"></a></td>";
	          }
	          htmlElements[idx++] = "</tr>";
	        } 
	        htmlElements[idx++] = "</tbody></table></div>"; // end last group member div
	    }
	    else {
	        htmlElements[idx++] = EDR.messages.K0023I_NO_SAVED_SEARCHES;
	    }
        content.innerHTML = htmlElements.join("");
        dialog.postRenderFunction();
        
        var groupCombo = <es:dijit />.byId(EDR.prefix+"importGroups");
        var comboValues = [];
        for (var j = 0; j < activeGroups.length; j++) {
          // add the group to the import combobox
          if (activeGroups[j].name != emptyGroup) {    
             comboValues.push({name: activeGroups[j].name});
          }                    
          if (EDR.search.query.openGroups[activeGroups[j].name] !== undefined) {
            EDR.search.query.toggleGroupVisibility(dialog.id, activeGroups[j].id);	              
	      }
        }
        <es:dijit />.byId(EDR.prefix+'importGroups').store = new <es:dojo />.data.ItemFileReadStore({data: {identifier: "name", items: comboValues}});                        
        <es:dijit />.byId(EDR.prefix+'manageSearchApply').setDisabled(true);
        <es:dijit />.byId(EDR.prefix+'runSelectedSearch').setDisabled(true);
        if (!dialog.open) {      
          EDR.dialog.util.show(dialog);
        }
        setTimeout(function() {<es:dijit />.focus(<es:dojo />.byId(EDR.prefix+'manageSearchFilter'))}, 50);     
      }
      
      var processError = function(error) {
         EDR.util.alert("got error" + error);         
      }      
      EDR.search.query.searchStore.fetch({sort: [{attribute:'group'}, {attribute:'name'}], query: EDR.search.query.filter, onComplete: renderDom, onError: EDR.search.storeFetchError});      
    },
    
    initSearchStore: function() {
      if (EDR.search.query.searchStore == null) {        
        EDR.search.query.searchStore = new <es:dojo />.data.ItemFileWriteStore({url: EDR.search.Constants.LOAD_SAVED_SEARCHES_URL});   
      }
    },
    toggleGroupVisibility: function(dialogId, groupId) {
      var toggleDuration = 0;
      var groupElementContainer = g(EDR.prefix+dialogId  + "-savedSearchGroupMembers-" + groupId);
      var group = g(EDR.prefix+dialogId + "-savedSearchGroup-" + groupId);
      var groupName = <es:dojo />.query("span[class='savedSearchGroupName']", group)[0].innerHTML;
      if (groupElementContainer.style.display == "none") {
        <es:dojo />.fx.wipeIn({node: <es:dojo />.byId(groupElementContainer.id), duration: toggleDuration}).play();
        g(EDR.prefix+dialogId + "-savedSearchGroupTwistie-" + groupId).src = "images/arrow_down8.png";        
        EDR.search.query.openGroups[groupName] = groupName;
      }
      else {
        <es:dojo />.fx.wipeOut({node: <es:dojo />.byId(groupElementContainer.id), duration: toggleDuration}).play();
        g(EDR.prefix+dialogId + "-savedSearchGroupTwistie-" + groupId).src = "images/arrow_right8.png";
        delete EDR.search.query.openGroups[groupName];
      }        
    },
    
    filterChanged: function() {
	  var currentTimer = EDR.search.query.filterTimer;
	  /* The filter has changed. If there's a current timer, cancel it. */
	  if (currentTimer != null) {
	    clearTimeout(currentTimer);
	  }	  
	  /*
	   * Set a timer to trigger the filter after 1 second of inactivity in
	   * the filter field.
		 */
	  var context = this;
	  EDR.search.query.filterTimer = 
	    setTimeout(function() {
	      <es:dojo />.hitch(context, EDR.search.query.filterSearches)();
	    }, 1000);
	},
	
	filterSearches: function() {
	  var filter = <es:dojo />.query("input[id$='Filter']", this.domNode)[0];
	  EDR.search.query.filter = {group:"*" + filter.value + "*"};
	  <es:dojo />.hitch(this, EDR.search.query.renderSavedSearches)(); 
	}
}

EDR.search.Criteria = {

    setInputValue: function(value) {
		<es:dijit />.byId(EDR.prefix+'query-string').setValue(value);
    },
    
    clearInputValue : function() {
		EDR.search.Criteria.setInputValue('');
    },
    
	saveCriteria : function(value) {
		
		// Display an alert
		if (EDR.util.String.isWhitespace(value)) {
			EDR.util.alert(EDR.messages.K0003I_SEARCH_ERROR_NOINPUT);		
	    	EDR.util.Form.focus('keywords');
			return false;
		}	
		
		EDR.search.Form.hideErrorMessages();
		
		EDR.ajax.Request.get(
			{ 
				url: EDR.contextPath + "/search?action=setCriteria&criteria=" + encodeURIComponent(value),		
				progressText: EDR.messages.K0003I_SEARCH_SEARCHING,
				beforeSetContentCallback: EDR.search.Form.beforeSetContentCallback,
				successCallback: EDR.search.Form.processSearchResults,
				errorCallback: EDR.search.Form.handleSearchError,
				content: {requestId: EDR.search.genRequestId()}
			}
		); 
	},
	
	/**
	 * Issue an Ajax call to refresh the query string and the toolbar buttons.
	 */
	refresh: function(requestId) {
		
		function successCallback(response, ioArgs) {
		    if (ioArgs.args.content.requestId != EDR.search.currentSearchRequestId) {
		      return;
		    }
			var json = <es:dojo />.fromJson(response);
			if (typeof(json) == 'object') {
				if (json.noResults != null && json.noResults != "") {
					EDR.search.Criteria.clearInputValue();
				} else {
					var queryString = json.queryString; 
					EDR.search.Criteria.setInputValue(queryString);
				}
				
				// Update the toolbar buttons
				if (json.enableBackButton == 'true') {
					<es:dijit />.byId(EDR.prefix+"toolbar.goBack").setDisabled(false);
				} else {
					<es:dijit />.byId(EDR.prefix+"toolbar.goBack").setDisabled(true);
				}
				
				if (json.enableForwardButton == 'true') {
					<es:dijit />.byId(EDR.prefix+"toolbar.goForward").setDisabled(false);
				} else {
					<es:dijit />.byId(EDR.prefix+"toolbar.goForward").setDisabled(true);
				}
				
				if (json.enableSaveButton == 'true') {
					<es:dijit />.byId(EDR.prefix+"toolbar.save").setDisabled(false);
				} else {
					<es:dijit />.byId(EDR.prefix+"toolbar.save").setDisabled(true);
				}
				
				// Update the number of active filters
				if (json.numFilters != 0) {
					g(EDR.prefix+'activeSearchFilters').innerHTML = json.truncatedFilters;
					g(EDR.prefix+'activeSearchFilters').title = json.activeFilters;
					<es:dijit />.byId(EDR.prefix+'searchFiltersDropdown').setLabel("(" + EDR.messages.K0003I_SEARCH_FILTER_EDIT + ")");
				} else {
					g(EDR.prefix+'activeSearchFilters').innerHTML = EDR.messages.K0001I_COMMON_NONE;
					g(EDR.prefix+'activeSearchFilters').title = EDR.messages.K0015I_TOOLTIP_SEARCH_FILTERS_NOACTIVE;
					<es:dijit />.byId(EDR.prefix+'searchFiltersDropdown').setLabel("(" + EDR.messages.K0003I_SEARCH_FILTER_ADD + ")");
				}


			}
		}	
		
		EDR.ajax.Request.get(
			{ 
				url: EDR.contextPath + "/search?action=getCriteria",	
				content: {requestId: requestId},	
				showProgress: false,
				successCallback: successCallback
			}
		);
	}
}

EDR.search.Filters = {

	initDialog: function() {
	
		function successCallback(response, ioArgs) {
		
			var filterDialog = <es:dijit />.byId(EDR.prefix+'searchFiltersDialog');
			if (filterDialog) {

				// Update the dialog contents
				filterDialog.setContent(response);
				
				// Reposition the dialog
				filterDialog.orient(g(EDR.prefix+'searchFiltersDropdown'), "BR", "BR");
				
				// Resize the buttons
				var saveButton = <es:dijit />.byId(EDR.prefix+'searchFilterSave');
				if (saveButton) {
					saveButton.adjustButtonWidth();
				}
				
				var cancelButton = <es:dijit />.byId(EDR.prefix+'searchFilterCancel');
				if (cancelButton) {
					cancelButton.adjustButtonWidth();
				}
				
				// Set focus to the first icon link
				var firstLink = g(EDR.prefix+'andfilter-link-1');
				if (firstLink != null) {
					EDR.util.Form.focus("andfilter-link-1");
				} else {
					// There are no flag filters available, set focus to cancel button
					EDR.util.Form.focus("searchFilterCancel");
				}
			}
			
		}
		
		// Put a progress indicator in the dialog
		var filterDialog = <es:dijit />.byId(EDR.prefix+'searchFiltersDialog');
		if (filterDialog) {
			var newDiv = document.createElement("div");
			newDiv.className = "progressDiv";
			filterDialog.setContent(newDiv);
		}
		
		// Make our Ajax call to refresh the filter settings
		EDR.ajax.Request.get(
			{ 
				url: EDR.contextPath + "/search?action=refreshSearchFilters",
				successCallback: successCallback,
				showProgress: false,
				errorCallback: EDR.search.Form.handleSearchError
			}
		);
	
	},
	
	saveFilterSettings: function() {
	
		function successCallback(response, ioArgs) {
			// Hide the tooltip dialog
			<es:dijit />.byId(EDR.prefix+'searchFiltersDialog').onCancel();
	  		var json = null;
			try {
				json = <es:dojo />.fromJson(response);
			} catch (e) {
				// json format error
			}
			if (json != null && typeof(json) == 'object' && json.filterError) {
				// We got an error
				EDR.util.alert(json.filterError);			
			} else {
				// Refresh the search results using the new filters
				EDR.search.refreshResults();
			}
	  	
	  	}
		
	    EDR.ajax.Form.submit(      
	      { 
		    url: EDR.contextPath + "/search?action=saveSearchFilters",				
			formId: "filterSettingsForm",
	  	    successCallback: successCallback
	  	  }
	    );	
	
	},
	
	toggleFilterANDChecked: function(index, flagName) {
		var andFilterInput = g("andfilter-" + index);
		var notFilterInput = g("notfilter-" + index);
		var img = g('andfilter-img-' + index);
		if (andFilterInput.value == null || andFilterInput.value == "") {
			if (notFilterInput.value != null && notFilterInput.value != "") {
				// First clear the NOT value
				this.toggleFilterNOTChecked(index, flagName);
			}	
			andFilterInput.value = flagName;
			img.src = "images/boolean_switch_and_sel13.png";
			img.alt = EDR.messages.K0015I_TOOLTIP_RADIO_FILTER_AND_CHECKED;
		
		} else {
			// User deselected this filter, uncheck it
			andFilterInput.value = "";
			img.src = "images/boolean_switch_and_unsel13.png";
			img.alt = EDR.messages.K0015I_TOOLTIP_RADIO_FILTER_AND;		
		}
	},
	
	toggleFilterNOTChecked: function(index, flagName) {
		var andFilterInput = g("andfilter-" + index);
		var notFilterInput = g("notfilter-" + index);
		var img = g('notfilter-img-' + index);
		if (notFilterInput.value == null || notFilterInput.value == "") {
			if (andFilterInput.value != null && andFilterInput.value != "") {
				// First clear the NOT value
				this.toggleFilterANDChecked(index, flagName);
			}	
			notFilterInput.value = flagName;
			img.src = "images/boolean_switch_not_sel13.png";
			img.alt = EDR.messages.K0015I_TOOLTIP_RADIO_FILTER_NOT_CHECKED;
		
		} else {
			// User deselected this filter, uncheck it
			notFilterInput.value = "";
			img.src = "images/boolean_switch_not_unsel13.png";	
			img.alt = EDR.messages.K0015I_TOOLTIP_RADIO_FILTER_NOT;	
		}
	}

}

EDR.search.Preview = {
	
	dlg: null,
	duration: 1000,
	
	getPreviewDialog: function() {
		if (EDR.search.Preview.dlg != null) {
			<es:dijit />.popup.close(EDR.search.Preview.dlg);
			EDR.search.Preview.dlg = null;			
		}
		var dlg = new <es:dijit />.TooltipDialog({}, "tt");
		dlg.setContent(
			"<div style='width:500px; height:250px; overflow-x:hidden; overflow-y:auto'>aaaaaaaaaaaaaaaaaaaaaaa</div>"
		);
		dlg.startup();
		
		<es:dojo />.connect(dlg.containerNode, "onblur", function(e){
			e.preventDefault();
			<es:dijit />.popup.close(dlg);
		});					
		EDR.search.Preview.dlg = dlg;
		return dlg;
	},
	
	showPreviewDialog: function(target, docId) {
		var dlg = EDR.search.Preview.getPreviewDialog();
					
		<es:dojo />._setOpacity(dlg.domNode, 0);
		<es:dijit />.popup.open({
			popup: dlg, around: target, orient: {TL:'BL', BL:'TL'}
		});
		<es:dojo />.fadeIn({node:dlg.domNode, duration:EDR.search.Preview.duration}).play();		
		
		EDR.ajax.Loading.setIsLoading(dlg.containerNode);
		EDR.search.Preview.getPreviewContent(dlg, docId);
	},
	
	getPreviewContent: function(dlg, docId) {
		// Show the preview dialog
		function successCallback(response, ioArgs) {			
			dlg.containerNode.firstChild.innerHTML = response;
			EDR.ajax.Loading.clearIsLoading(dlg.containerNode);			
		}

		var param = {
			url: EDR.contextPath + "/search?action=getPreview",
			load: successCallback,
			error: function() { alert('preview load error'); }
		}		
		<es:dojo />.xhrGet(param);
	},
	
	closePreviewDialog: function() {
		var dlg = EDR.search.Preview.getPreviewDialog();
		<es:dijit />.popup.close(dlg);
	}
}
  
EDR.search.Form = {
    timers: {
    },
    facetInputMap: {
      Senders: 'from',
      Recipients: 'toccbcc'
    },
    selectedItems: new EDR.util.List(),
    
    selectedFacetRefinements: new EDR.util.List(),
    
	/**
	 * Hack for dojo 1.0.  dojo 1.0 doesn't destroy the menu sub-widget before contentPane.setContent()
	 */
	beforeSetContentCallback : function() {
		var myWidgetSet = <es:dijit />.registry.byClass('<es:dijit />.MenuItem');
		if (myWidgetSet) myWidgetSet.forEach(function(widget){ widget.destroy();});
			
		myWidgetSet = <es:dijit />.registry.byClass('<es:dijit />.PopupMenuItem');
		if (myWidgetSet) myWidgetSet.forEach(function(widget){ widget.destroy();});
		
		// Remove any facets we added to the search form
		EDR.search.Form.removeFacetsFromForm();
	},
	
	/**
	 * This function marks an input field as invalid and display an error message next to it.
	 */
	markFieldInvalid: function(errorDivId, errorMsg, inputId) {
		g(errorDivId).innerHTML = errorMsg;
		g(errorDivId).className = 'error';			
		
		// Focus on the field
		if (inputId) EDR.util.Form.focus(inputId);
	},
	
	/**
	 * This function hides all error related stuff for a field.
	 */
	markFieldValid: function(errorDivId, inputId) {
		g(errorDivId).innerHTML = "";
		g(errorDivId).className = 'noError';
	},
	
	/**
	 * Hides all error messages
	 */
	hideErrorMessages: function() {
		EDR.search.Form.markFieldValid(EDR.search.Constants.SEARCH_FORM_KEYWORD_ERROR_ID, EDR.search.Constants.SEARCH_FORM_KEYWORDS_ID);
/*
 * EDR.search.Form.markFieldValid(EDR.search.Constants.SEARCH_FORM_DATE_ERROR_ID,
 * EDR.search.Constants.SEARCH_FORM_FROM_DATE_ID);
 * EDR.search.Form.markFieldValid(EDR.search.Constants.SEARCH_FORM_DATE_ERROR_ID,
 * EDR.search.Constants.SEARCH_FORM_TO_DATE_ID);
 * EDR.search.Form.markFieldValid(EDR.search.Constants.SEARCH_FORM_SUBJECT_ERROR_ID,
 * EDR.search.Constants.SEARCH_FORM_SUBJECT_ID);
 * EDR.search.Form.markFieldValid(EDR.search.Constants.SEARCH_FORM_SENDER_ERROR_ID,
 * EDR.search.Constants.SEARCH_FORM_FROM_ID);
 * EDR.search.Form.markFieldValid(EDR.search.Constants.SEARCH_FORM_RECIPIENT_ERROR_ID,
 * EDR.search.Constants.SEARCH_FORM_TOCCBCC_ID);
 */
	},
	
	// Enables/Disables all email action menu items
	disableEmailActionItems: function(disable) {
 	   if (typeof disable == "undefined") {
 	       disable = true;
 	   }
 	    
	   var setFlagButton = <es:dijit />.byId(EDR.prefix+"setFlagButton");
	   if (setFlagButton) {
		   setFlagButton.setDisabled(disable);	
	   }
		

	   /*
	   var id = g("email_set_flag_icon");
	   var idDisabled = g("email_set_flag_disabled_icon");
	   if (id && idDisabled) {
		   if (disable) {
			  id.style.display = "none";
			  idDisabled.style.display = "";
		   } else {
			  idDisabled.style.display = "none";
			  id.style.display = "";
		   }	  
	   } */	  
	   /*
	   var myWidgetSet = <es:dijit />.registry.byClass('<es:dijit />.MenuItem');
	   if (myWidgetSet) {
	      if (typeof disable == "undefined" || disable) {
		      myWidgetSet.forEach(EDR.search.Form.disableSetFlagWidget);
		  } else {
		      myWidgetSet.forEach(EDR.search.Form.enableSetFlagWidget);
		  }    
	   } */
	}, 
	
	// Callback - enables all the set flag menu items
	enableSetFlagWidget: function(widget) { 
	   var prefix = "email_action_set_flag_"; 
	   if (widget.id.substring(0, prefix.length) == prefix) {
	      widget.setDisabled(false); 
	   }
	},
	
	// Callback - disables all the set flag menu items
	disableSetFlagWidget: function(widget) { 
	   var prefix = "email_action_set_flag_"; 
	   if (widget.id.substring(0, prefix.length) == prefix) {
	      widget.setDisabled(true); 
	   }   
	},
	
	/**
	 * Resets only the results pane.
	 */
	shallowReset: function() {
		// Clear the results
		// var dw = <es:dijit />.byId(EDR.search.Constants.EMAIL_RESULTS_ELEMENT_ID);
		// dw.setContent("");
		
		// Reset the form values
		f(EDR.search.Constants.SEARCH_FORM_ID).reset();
		EDR.search.Form.hideErrorMessages();
		EDR.search.Form.clearFacets();
	},
	
	/**
	 * Resets all hidden inputs, visible inputs and the results pane.
	 */
	deepReset: function() {
		
		// Reset the form values
		f(EDR.search.Constants.SEARCH_FORM_ID).reset();
		
		// Reset the panes which contain various results
		EDR.search.reset();  		
	},
	
	wireKeyboardEvents: function() {		
		<es:dojo />.connect(g(EDR.search.Constants.SEARCH_FORM_KEYWORDS_ID), 	'onkeypress', EDR.search.Form.submitOnEnter);		
/*
 * dojo.connect(g(EDR.search.Constants.SEARCH_FORM_FROM_ID), 'onkeypress',
 * EDR.search.Form.submitOnEnter);
 * dojo.connect(g(EDR.search.Constants.SEARCH_FORM_TOCCBCC_ID), 'onkeypress',
 * EDR.search.Form.submitOnEnter);
 * dojo.connect(g(EDR.search.Constants.SEARCH_FORM_SUBJECT_ID), 'onkeypress',
 * EDR.search.Form.submitOnEnter);
 * dojo.connect(g(EDR.search.Constants.SEARCH_FORM_FROM_DATE_ID), 'onkeypress',
 * EDR.search.Form.submitOnEnter);
 * dojo.connect(g(EDR.search.Constants.SEARCH_FORM_TO_DATE_ID), 'onkeypress',
 * EDR.search.Form.submitOnEnter);
 */
	},
	
	submitOnEnter: function(event) {		
		if (event) {
			key = event.keyCode;
			if (key && key == <es:dojo />.keys.ENTER) {
				return EDR.search.Form.submit();
			}
		}	
		return false;
	},
	
	/**
	 * Submits the form via an Ajax post request and updates the appropriate DIV element with the HTML
	 * that is return from the server.
	 */
	submit: function(params) {
		
		EDR.search.Form.hideErrorMessages();
				
		if (!EDR.search.Form.isValid()) {			
			return false;
		}
		
		// Add any facets that were selected to the search form
		EDR.search.Form.addFacetsToForm();
				
		EDR.ajax.Form.submit(
			{ 
				url: EDR.contextPath + "/search?action=search",
				formId: EDR.search.Constants.SEARCH_FORM_ID,
				progressText: EDR.messages.prompt_search_searching,
				beforeSetContentCallback: EDR.search.Form.beforeSetContentCallback,
				successCallback: EDR.search.Form.processSearchResults,
				errorCallback: EDR.search.Form.handleSearchError,
				timeout: EDR.search.longRunningProcessTimeOut,
				content: {requestId: EDR.search.genRequestId()}
			}
		);
		
		return false;
	},
	
	/**
	 * Handles errors that occur during a search request.
	 */
	handleSearchError: function(response, ioArgs) {	
		 
		var json = <es:dojo />.fromJson(response);
		if(json.isDisabledError) {
			EDR.search.Form.showCaseDisabledErrorDialog(json);
		}
		var error = json.error;
		var errorFieldDiv = json.field + "-error-div";
		// Display the error in the results pane
		g('search-error-message').innerHTML = error;
		g(EDR.prefix+'email-search-error').style.display = "block";
		var resultsDiv = g('email-search-data');
		resultsDiv.style.display = "none";
		// Show the error message
		if (g(errorFieldDiv) != null) {
			EDR.search.Form.markFieldInvalid(
				errorFieldDiv, 
				EDR.messages.K0003I_SEARCH_ERROR_INVALID_SYNTAX,
				null);
		}
		// Set and hide the detailed error message, if it exists
		if (g('search-error-details').style.display != "none") {
			EDR.search.toggleErrorDetails();
		}
		
		if (json.detailedError) {
			g('error-details-link-container').style.display = "";
			g('search-error-details').innerHTML = json.detailedError;
		} else {
			g('error-details-link-container').style.display = "none";
			g('search-error-details').innerHTML = "";
		}
		
		// Save the previous query
		EDR.search.previousQuery = json.previousQuery;
	},
	
	showCaseDisabledErrorDialog: function(json) {
		var str = json.error;
		if (json.detailedError != null) {
			str = str + "\n" + json.detailedError;
		}
		// var dialog = <es:dijit />.byId('caseDisabledDialog');
		// dialog.setContent(str);
		// EDR.dialog.util.show(dialog);
		EDR.util.alert(str);
	},
	
	/**
	 * Called when the user wishes to dismiss a query syntax error message.
	 */
	hideSearchError: function() {
		EDR.search.Criteria.setInputValue(EDR.search.previousQuery);
		g(EDR.prefix+'email-search-error').style.display = "none";
		g('email-search-data').style.display = "block";	
	},
	
	/**
	 * Determines if the search form has any values.
	 */	
	isEmpty: function() {
		var isEmpty = true;				
		var f = g(EDR.search.Constants.SEARCH_FORM_ID);		
		var elements = f.getElementsByTagName('input');		
		for (var i = 0; i < elements.length; i++) {			
			element = elements[i];
			elementType = element.getAttribute('type');
			if (elementType == "text") {
				if (!EDR.util.String.isWhitespace(element.value)) {
					isEmpty = false;
					break;
				}
			}
		}
		
		// If the form fields aren't empty then the form is valid, no need to check the facets
		if (!isEmpty) return false;
		
		// If he form fields are empty check to see if any facets were checked
		isEmpty = !EDR.search.Form.isFacetChecked();
		
		return isEmpty;
	},
	  
	/**
	 * Ensures that we have a valid form before submitting.
	 */
	isValid: function() {			
		
		// If the form is empty return false display an alert
		if (EDR.search.Form.isEmpty()) {
			EDR.util.alert(EDR.messages.K0003I_SEARCH_ERROR_NOINPUT);
	    	EDR.util.Form.focus('keywords');
			return false;
		}	
		/* TODO: need this?
		// Date validation
		var fromDate = fv(EDR.search.Constants.SEARCH_FORM_ID, EDR.search.Constants.SEARCH_FORM_FROM_DATE_ID);
		var toDate = fv(EDR.search.Constants.SEARCH_FORM_ID, EDR.search.Constants.SEARCH_FORM_TO_DATE_ID);			
		
		if (!<es:dijit />.byId(EDR.search.Constants.SEARCH_FORM_FROM_DATE_ID).isValid()) {	
			EDR.search.Form.markFieldInvalid(
				EDR.search.Constants.SEARCH_FORM_DATE_ERROR_ID, 
				EDR.messages.K0003I_SEARCH_ERROR_INVALID_DATE_FORMAT,
				EDR.search.Constants.SEARCH_FORM_FROM_DATE_ID);			
			return false;	
		
		} else if (!<es:dijit />.byId(EDR.search.Constants.SEARCH_FORM_TO_DATE_ID).isValid()) {
			EDR.search.Form.markFieldInvalid(
				EDR.search.Constants.SEARCH_FORM_DATE_ERROR_ID, 
				EDR.messages.K0003I_SEARCH_ERROR_INVALID_DATE_FORMAT,
				EDR.search.Constants.SEARCH_FORM_TO_DATE_ID);				
			return false;
		
		} else if (!EDR.util.String.isWhitespace(fromDate) && EDR.util.String.isWhitespace(toDate)) {
			EDR.search.Form.markFieldInvalid(
				EDR.search.Constants.SEARCH_FORM_DATE_ERROR_ID, 
				EDR.messages.K0003I_SEARCH_ERROR_INVALID_DATE_RANGE,
				EDR.search.Constants.SEARCH_FORM_TO_DATE_ID);			
			return false;
		
		} else if (!EDR.util.String.isWhitespace(toDate) && EDR.util.String.isWhitespace(fromDate)) {
			EDR.search.Form.markFieldInvalid(
				EDR.search.Constants.SEARCH_FORM_DATE_ERROR_ID, 
				EDR.messages.K0003I_SEARCH_ERROR_INVALID_DATE_RANGE,
				EDR.search.Constants.SEARCH_FORM_FROM_DATE_ID);			
			return false;
		
		}
		*/
		return true;
	},
		
	processSearchResults: function(response, ioArgs) {
		// This function is called after the completion of a search request
    	// hard code updating the email results pane
    	EDR.search.Form.beforeSetContentCallback();
    	
    	// Clear the search form
 //   	EDR.util.Form.clear(EDR.search.Constants.SEARCH_FORM_ID);
    	
    	// Always revert back to new search
//    	var searchPane = <es:dijit />.byId("SearchPane");
//   	if (searchPane != null) searchPane.setSearchType("search");
    	
		var dw = <es:dijit />.byId(EDR.search.Constants.EMAIL_RESULTS_ELEMENT_ID);
		if (dw != null) {
			//TODO dojo1.3 migration
			<es:dijit />.byId(EDR.prefix+"resultsPerPage").destroy();
		   	dw.setContent(response);
					
		   	// Disables action menu items since no results will be selected
//		   	EDR.search.Form.disableEmailActionItems(true);
		}
		
		// Scroll to the top of the results
		dw = g(EDR.search.Constants.EMAIL_RESULTS_ELEMENT_ID);
		dw.parentNode.scrollTop = 0;
				
		// Refresh various UI components
//		EDR.search.refresh(ioArgs.args.content.requestId);
	},
	
	updateTimeline: function(requestId) {
	    EDR.ajax.Loading.setIsLoading('timelineContainer');
		var obj;
		if (<es:dojo />.isIE) {
			obj =  window["timelineObject"];
		}else{
			obj = document["timelineObject"];
		}

		
		if (obj.refreshTimelineDataFlex != undefined) {
			obj.refreshTimelineDataFlex(requestId);
		} else {
			// Try again in another second
			setTimeout(function() { EDR.search.Form.updateTimeline(requestId)}, 1000);
		}
	
	},
	
	// This method is called by the flex timeline with the timeline facet
	// data in JSON form. This is so that we can build an HTML table with this
	// data for accessibility compliance.
	buildTimelineTable: function(timelineData) {
	
		var json = <es:dojo />.fromJson(timelineData);
		var hiddenTable = g('hiddenTimelineTable');
		var hiddenTableBody = g('hiddenTimelineTableBody');
		var data = json.timelineData;
		
		// Clear out the existing table
		while (hiddenTable.rows.length > 1) {
			hiddenTable.deleteRow(hiddenTable.rows.length - 1);
		}
		
		// Create a new row for each of the data points
		if (data != null) {
			for (var i = 0; i < data.length; i++) {
				hiddenTableBody.insertRow(i);
				hiddenTableBody.rows[i].insertCell(0);
				hiddenTableBody.rows[i].cells[0].appendChild(document.createTextNode(data[i].time));
				hiddenTableBody.rows[i].insertCell(1);
				hiddenTableBody.rows[i].cells[1].appendChild(document.createTextNode(data[i].count));
				hiddenTableBody.rows[i].insertCell(2);
				if (data[i].expected != null) {
					hiddenTableBody.rows[i].cells[2].appendChild(document.createTextNode(data[i].expected));
				} else {
					hiddenTableBody.rows[i].cells[2].appendChild(document.createTextNode(""));
				}
			}
		
		}
	
	
	},
	
	setNewDateRange: function(newMinDate, newMaxDate) {
	
		EDR.ajax.Request.get(
			{ 
				url: EDR.search.Constants.SEARCH_NEW_DATE_RANGE + "&minDate=" + newMinDate + "&maxDate=" + newMaxDate,
				showProgres: true,
				progressText: EDR.messages.K0003I_SEARCH_SEARCHING,
				beforeSetContentCallback: EDR.search.Form.beforeSetContentCallback,
				successCallback: EDR.search.Form.processSearchResults,
				errorCallback: EDR.search.Form.handleSearchError,
				timeout: EDR.search.longRunningProcessTimeOut,
				content: {requestId: EDR.search.genRequestId()}
			}
		);
	},
	
	getSearchCriteria: function() {
		var sc = <es:dijit />.byId(EDR.prefix+"queryText");
		if (sc != null) {
			sc.load();
		}
	},
	
	// This method issues an AJAX call to get the top concepts
	// for a given search query.
	getTopFacets: function(requestId) {
		var facetTree = <es:dijit />.byId(EDR.prefix+"facetTree");
		if (facetTree != null) {
			facetTree.load();
		}
/*
		EDR.ajax.Loading.setIsLoading('refinement');
		EDR.ajax.Loading.setIsLoading('timelineContainer');
		// issue ajax call
		var actionUrl = EDR.contextPath + "/facets?action=getTopFacetCounts";
		EDR.ajax.Request.get(
			{ 
				url: actionUrl,		
				content: {requestId: requestId},
				showProgress: false,
				timeout: EDR.search.longRunningProcessTimeOut,
				successCallback: EDR.search.Form.processFacetData	
			}
		);
*/
	},
	
	getDynamicFacetChart: function() {
		var dyfc = <es:dijit />.byId(EDR.prefix+"dynamicFacetChart");
		if (dyfc != null) {
			dyfc.load();
		}
	},
	
	getDynamicFieldChart: function() {
		var dyfc = <es:dijit />.byId(EDR.prefix+"dynamicFieldChart");
		if (dyfc != null) {
			EDR.ajax.Loading.setIsLoading('dynamicFieldChartContainer');
			dyfc.load();
		}
	},
	
	getFileSizeChart: function() {
		var fsc = <es:dijit />.byId(EDR.prefix+"fileSizeChart");
		if (fsc != null) {
			EDR.ajax.Loading.setIsLoading('fileSizeChartContainer');
			fsc.load();
		}
	},
	
	processFacetData: function(response, ioArgs) {
	    var requestId = ioArgs.args.content.requestId;
		if (requestId != EDR.search.currentSearchRequestId) {
	      return;
	    }
		g(EDR.prefix+'refinement').innerHTML = response;
		g('refinement').style.display = "block";
		// Make sure the lists are expanded if they were before
		EDR.util.CollapsibleList.initialize();
		EDR.search.Form.formContainerOnResize();
		
		// Update the timeline now that we have facets
		EDR.search.Form.updateTimeline(requestId);		
	},  
	
	// This method is called when the user presses the 'more' link to get
	// more facet results for a particular facet type
	showMoreFacets: function(facetId) {
	
		// Show the extra facets, hide the more link, and show the less link
		g(facetId + '-more-link').style.display = "none";
		g(facetId + '-less-link').style.display = "inline";
		g(facetId + '-more-div').style.display = "block";	
	
	},
	
	// This method is called when the user presses the 'less' link to hide
	// the extra facet counts
	showLessFacets: function(facetId) {
	
		// Show the extra facets, hide the more link, and show the less link
		g(facetId + '-more-link').style.display = "inline";
		g(facetId + '-less-link').style.display = "none";
		g(facetId + '-more-div').style.display = "none";	
	
	},

	// Clears the facets hidden variable & img
	clearFacets: function() {
		var refinementDiv = g('refinement');
		// Get all the img elements
		var imgs = refinementDiv.getElementsByTagName('img');
		for (var i = 0; i < imgs.length; i++) {
			var img = imgs[i];
			if (img.id.substring(0, 3) == 'not') {
				img.src = "images/boolean_switch_not_unsel13.png";
				img.alt = EDR.messages.K0015I_TOOLTIP_RADIO_FACET_NOT;
			} else if (img.id.substring(0, 3) == 'and') {
				img.src = "images/boolean_switch_and_unsel13.png";
				img.alt = EDR.messages.K0015I_TOOLTIP_RADIO_FACET_AND;
			}
		}
		// Get all the input elements
		var elements = refinementDiv.getElementsByTagName('input');
		for (var i = 0; i < elements.length; i++) {
			var element = elements[i];
			var elementType = element.getAttribute('type');
			if (elementType == "hidden") {
				if (element.value == "true") {
				    element.value = "false";
				}
			}
		}
	},
	
	// The following 2 functions are called to set/unset the AND/OR state of the facets.
	// It will set the corresponding checkbox and make sure the opposing
	// value is not also set.  The facetId parameter is in the form FacetId-<index>
	toggleFacetNOTChecked: function(facetId) {

		var notCheckbox = g('not-' + facetId);
		var andCheckbox = g('and-' + facetId);
		var img = g('not-img-' + facetId);
		if (notCheckbox.value == "false") {
			// This is a call to set the boolean NOT state
			if (andCheckbox.value == "true") {
				// We need to clear the AND checkbox first
				this.toggleFacetANDChecked(facetId);
			}
			
			notCheckbox.value = "true";
			EDR.search.Form.selectedFacetRefinements.add(notCheckbox);
			img.src = "images/boolean_switch_not_sel13.png";
			img.alt = EDR.messages.K0015I_TOOLTIP_RADIO_FACET_NOT_CHECKED;
								    	
		} else {
			// We need to clear the boolean NOT state
			notCheckbox.value = "false";
			EDR.search.Form.selectedFacetRefinements.remove(notCheckbox.id);
			img.src = "images/boolean_switch_not_unsel13.png";
			img.alt = EDR.messages.K0015I_TOOLTIP_RADIO_FACET_NOT;
		
		}
	},
	
	toggleFacetANDChecked: function(facetId) {

		var notCheckbox = g('not-' + facetId);
		var andCheckbox = g('and-' + facetId);
		var img = g('and-img-' + facetId);
		if (andCheckbox.value == "false") {
			// This is a call to set the boolean NOT state
			if (notCheckbox.value == "true") {
				// We need to clear the AND checkbox first
				this.toggleFacetNOTChecked(facetId);
			}
			
			andCheckbox.value = "true";
			EDR.search.Form.selectedFacetRefinements.add(andCheckbox);
			img.src = "images/boolean_switch_and_sel13.png";
			img.alt = EDR.messages.K0015I_TOOLTIP_RADIO_FACET_AND_CHECKED;
							    	
		} else {
			// We need to clear the boolean NOT state
			andCheckbox.value = "false";
			EDR.search.Form.selectedFacetRefinements.remove(andCheckbox.id);
			img.src = "images/boolean_switch_and_unsel13.png";
			img.alt = EDR.messages.K0015I_TOOLTIP_RADIO_FACET_AND;
		
		}
	
	},
	
	// This function adds only selected facets to the search form,
	// so that we don't send as much form data to the server
	addFacetsToForm: function() {
		var searchForm = g(EDR.search.Constants.SEARCH_FORM_ID);
		var facetValues = EDR.search.Form.selectedFacetRefinements.getAll();
		for (var i = 0; i < facetValues.length; i++) {
			searchForm.appendChild(facetValues[i]);
		}
	},
	
	// This function removes the previously added facets
	removeFacetsFromForm: function() {
		var searchForm = g(EDR.search.Constants.SEARCH_FORM_ID);
		var facetValues = EDR.search.Form.selectedFacetRefinements.getAll();
		for (var i = 0; i < facetValues.length; i++) {
			try {
				searchForm.removeChild(facetValues[i]);
			} catch (e) {
				// Ignore this, the form no longer contains this field
			}
		}
		EDR.search.Form.selectedFacetRefinements.clear();
	},
	
	// This function is called to restrict a search by facet
	// with a single click of the facet value
	quickFacetRefine: function(facetId) {
	
		EDR.search.Form.hideErrorMessages();
		
		EDR.ajax.Form.submit(
			{ 
				url: EDR.contextPath + "/search?action=quickRefine&facet=" + encodeURIComponent(facetId),
				formId: EDR.search.Constants.SEARCH_FORM_ID,
				progressText: EDR.messages.K0003I_SEARCH_SEARCHING,
				beforeSetContentCallback: EDR.search.Form.beforeSetContentCallback,
				successCallback: EDR.search.Form.processSearchResults,
				errorCallback: EDR.search.Form.handleSearchError,
				timeout: EDR.search.longRunningProcessTimeOut,
				content: {requestId: EDR.search.genRequestId()}
			}
		);
	},
	
	// This method loops through the checkboxes in the refinement div and
	// checks to see if any of them are checked
	isFacetChecked: function() {
	    /*
		var refinementDiv = g('refinement');
		var isChecked = false;
		
		// Get all the input elements 
		var elements = refinementDiv.getElementsByTagName('input');
		for (var i = 0; i < elements.length; i++) {
			// Loop through them, looking for checked items
			var element = elements[i];
			var elementType = element.getAttribute('type');
			if (elementType == "hidden") {
				if (element.value == "true") {
					isChecked = true;
					break;
				}
			}
		}
		 */
		return EDR.search.Form.selectedFacetRefinements.getAll().length > 0;
	},
	
	/**
	 * Submit a thread view request
	 * Eventually this will call a new viewThread action, but for now, it will just set the
	 * keywords field of the search form with the appropriate threadid parametric search and
	 * submit the form via an Ajax post request and updates the appropriate DIV element with the HTML
	 * that is return from the server.
	 */
	threadView: function(threadId) {
		
		if (threadId != null) {
		
		  EDR.search.Form.hideErrorMessages();
		
		  // Set the keywords field of the search form
		  f(EDR.search.Constants.SEARCH_FORM_ID).reset();
		  f(EDR.search.Constants.SEARCH_FORM_ID).elements[EDR.search.Constants.SEARCH_FORM_KEYWORDS_ID].value = 'threadid:"' + threadId + '"';

		  if (!EDR.search.Form.isValid()) {
			  return false;
		  }
				
		  EDR.ajax.Form.submit(
			{ 
				url: EDR.search.Constants.SEARCH_URL,
				formId: EDR.search.Constants.SEARCH_FORM_ID,
				progressText: EDR.messages.K0003I_SEARCH_SEARCHING,
				beforeSetContentCallback: EDR.search.Form.beforeSetContentCallback,
				successCallback: EDR.search.Form.processSearchResults,
				errorCallback: EDR.search.Form.handleSearchError,
				timeout: EDR.search.longRunningProcessTimeOut,
				content: {requestId: EDR.search.genRequestId()}
			}
		  );
		}
				
		return false;
	},
	
	/**
	 * Render a facet dialog
	 */
	renderFacetDialog: function(params) {
	    /*
	     * Fetch the facet information from the server and render the dialog.  Each time this function
	     * is called it makes a server request.  This can probably be optimized by setting a 'dirty' flag
	     * whenever a new search is executed and checking that flag here.  If the 'dirty' flag is not set,
	     * then just show the existing dialog without re-fetching from the server.
		 */
	        
	    EDR.search.Form[params.facetId] = {
	      filter: {email: "*"},
	      store: new <es:dojo />.data.ItemFileReadStore({url: EDR.contextPath + "/facets?action=" + params.loadAction + "&facet=" + params.facetId})     
	    }
        EDR.search.Form.resetFacetDialog(params.facetId);
	    EDR.search.Form.sortFacetBy(params.facetId, [{attribute:'correlation', descending:true}]);
   	    EDR.search.Form.selectedItems.clear();             
		return false;	
	},	
	
	resetFacetDialog: function(facetId) {
	    <es:dojo />.query("img[id^='" + facetId + "-sort-arrow-']").forEach(
	      function(item) {
	        item.style.display = 'none';
	      }
	    );
	    <es:dojo />.query("a[id^='" + facetId + "-sort-link-']").forEach(
	      function(item) {
	        item.style["fontWeight"] = 'normal';
	      }
	    );
	    EDR.search.Form.selectFilterTypeAll(facetId);
	    g(facetId + "-filter").value = "";	
	    g(facetId+'-dlg-number-selected').innerHTML = "0";	    
	    EDR.dialog.ProgressDialog.show(EDR.messages.K0001I_COMMON_PROGRESS_WAIT);
		// Keep track of the progress depth
		EDR.ajax.progressCounter = EDR.ajax.progressCounter + 1;	    
	},
	
	/*
	 * Build the DOM tree representing the facets in the facet dialog.
	 */	
	renderFacetDialogData: function(facetId) {
	   var widgetAnchorId = facetId + "-dlg";
	   var renderDom = function(facets, request) {	     
	     var dialog = <es:dijit />.byId(widgetAnchorId);
	     var content = g(widgetAnchorId + "-content");
	     if (content != null) {
	       content.innerHTML = "";
  	     }
  	     // create a new content div
	     var content_div = document.createElement("div");    
	     content_div.className = "clearfix facet-dlg-content";
	     content_div.setAttribute("id", widgetAnchorId + "-content-client");	     
	     if (!dialog.open) {	             
	       EDR.dialog.util.show(dialog);
	     }
	     // remove busy indicator
	     EDR.ajax.progressCounter = EDR.ajax.progressCounter - 1;
		 if (EDR.ajax.progressCounter <= 0) {
		    EDR.ajax.progressCounter = 0;
		    EDR.dialog.ProgressDialog.hide();
		 }
	     setTimeout(
	        function() {
	           var filter = g(facetId + '-filter');
	           EDR.util.Form.focus(filter); 
	           filter.value = filter.value;
	        }, 50);
	     
	     // render columns of 20 entries each
	     EDR.search.Form.renderColumns(facets, facetId, widgetAnchorId, content_div);
	     
	     var anchor = g(widgetAnchorId + "-content");
	     anchor.appendChild(content_div);
	   }	   
	   EDR.search.Form.facetRenderingCancelled = false;	   
	   // initialize facet count
	   g(widgetAnchorId + "-count").innerHTML = "0";
	   EDR.search.Form[facetId].store.fetch({sort: EDR.search.Form[facetId].sort, query: EDR.search.Form[facetId].filter, queryOptions: {ignoreCase: true}, onComplete: renderDom, onError: EDR.search.storeFetchError});
	},
	
	renderColumns: function(facets, facetId, widgetAnchorId, content_div) {
	  var table = document.createElement("table");	  
	  var table_body = document.createElement("tbody");
	  table.appendChild(table_body);
	  var table_row = document.createElement("tr");
	  table_body.appendChild(table_row);	
	  content_div.appendChild(table);
  	  setTimeout(function() {EDR.search.Form.renderColumn(facets, widgetAnchorId, facetId, table_body, table_row, 0, 0, 0, facets.length);}, 0);
  	},
  	
  	renderColumn: function(facets, widgetAnchorId, facetId, table_body, table_row, facetIndex, showIndex, hiddenIndex) {  	    	  
  	  if (EDR.search.Form.facetRenderingCancelled == true) {     
  	     return;
  	  }
  	  var i;
  	  var elemIdx = 0;
  	  var htmlElements = new Array();
  	  if (facetIndex < facets.length) {  	    
  	    var currentColumn = document.createElement("td");
	    currentColumn.className = "facet-column";	      	    
  	    var numDisplayed = 0;
	    for (i = facetIndex; i < facets.length && numDisplayed < 20; i++) {
		   var showType = '';
		   if (EDR.search.Form[facetId].showType) {
		       showType = EDR.search.Form[facetId].showType;
		   }
		   var selectedObj = EDR.search.Form.selectedItems.get(facets[i].email);	       
		   var showIt = true;
		   if (showType != '') {
		      if (selectedObj && selectedObj.type == showType) {
		          showIt = true;
		      } else {
		          showIt = false;
		      }
		   }
		   
		   if (showIt) {   
		       numDisplayed++;
		       // create a div for the row
	           var className = "facet-row odd";	    	   
		       if (showIndex % 2 == 0) {
			      className = "facet-row even";
		       }		      
		       htmlElements[elemIdx++] = "<div class=\"" + className + "\"><div class=\"correlation-container\"><div class=\"correlation-bar\" style=\"width:" + facets[i].correlation + "%;\"></div></div>";	       
	    	   // create the nodes for the 'and' and 'not' selectors and register
	       	   // event handlers for mouseover effects
	       	   var emailNodeClassName = "email-address";
	       	   var notSelectorSrc = "images/boolean_switch_not_unsel13.png";
	       	   var notAlt = EDR.messages.K0015I_TOOLTIP_RADIO_FACET_NOT;
	       	   var andSelectorSrc = "images/boolean_switch_and_unsel13.png";
	       	   var andAlt = EDR.messages.K0015I_TOOLTIP_RADIO_FACET_AND;
	       	   var selectorValue = "";
	       	   if (selectedObj && selectedObj.type && selectedObj.type == 'not') {			  	   
			       emailNodeClassName = 'email-address-selected';
		    	   notSelectorSrc = "images/boolean_switch_not_sel13.png";
		    	   notAlt = EDR.messages.K0015I_TOOLTIP_RADIO_FACET_NOT_CHECKED;
			       selectorValue = "not";	       
			   } else if (selectedObj && selectedObj.type && selectedObj.type == 'and') {			  	   
		    	   emailNodeClassName = 'email-address-selected';
			       andSelectorSrc = "images/boolean_switch_and_sel13.png";
			       andAlt = EDR.messages.K0015I_TOOLTIP_RADIO_FACET_AND_CHECKED;
			       selectorValue = "and";	       
			   } 
	       	   htmlElements[elemIdx++] = "<a href=\"javascript:;\" onmouseover=\"EDR.search.Form.mouseOverFacetSelector(this);\" onmouseout=\"EDR.search.Form.mouseOutFacetSelector(this);\" onclick=\"EDR.search.Form.selectFacetSelector(this);\"><img class=\"include\" title=\"" + EDR.messages.K0015I_TOOLTIP_REFINE_PLUS + "\" facetName=\"" + facetId + "\" src=\"" + andSelectorSrc + "\"" + 
	       	     "id=\""+EDR.prefix+"and-facet-selector-" + facetId + facets[i].index + "\" alt=\"" + andAlt + "\"></img></a>"; 	       	    		       
	    	   htmlElements[elemIdx++] = "<a href=\"javascript:;\" onmouseover=\"EDR.search.Form.mouseOverFacetSelector(this);\" onmouseout=\"EDR.search.Form.mouseOutFacetSelector(this);\" onclick=\"EDR.search.Form.selectFacetSelector(this);\"><img title=\"" + EDR.messages.K0015I_TOOLTIP_REFINE_MINUS + "\" facetName=\"" + facetId + "\" src=\"" + notSelectorSrc + "\" id=\""+EDR.prefix+"not-facet-selector-" + facetId + facets[i].index + "\" alt=\"" + notAlt + "\"></img></a>"; 	    	  		          	   	           
		       // create the nodes to contain the facet labels and counts
		       htmlElements[elemIdx++] = "<span class=\"" + emailNodeClassName + "\" id=\""+EDR.prefix+"email-address-" + facetId + facets[i].index + "\">" + EDR.util.String.htmlEscape(facets[i].email[0]) + "</span><span class=\"email-count\"> (" + facets[i].count + ")</span>"; 		       	       
			   showIndex++;
			   // Update the number of facets values in this dialog
	           var countNode = g(widgetAnchorId + "-count");	     
	           countNode.innerHTML = showIndex;	           
	           htmlElements[elemIdx++] = "</div>";	
	       }    
	     }	     
	     currentColumn.innerHTML = htmlElements.join("");
	     table_row.appendChild(currentColumn); 	     
	     setTimeout(function() {EDR.search.Form.renderColumn(facets, widgetAnchorId, facetId, table_body, table_row, i, showIndex, hiddenIndex);}, 0);
	   }	   
	},
	
	mouseOverFacetSelector: function(anchor) {
	  var img = anchor.firstChild;
	  if (img.src.indexOf('unsel') != -1) {
	    img.src = img.src.replace(/unsel/, 'hover');
	  }
	},
	
	mouseOutFacetSelector: function(anchor) {
	  var img = anchor.firstChild;
	  if (img.src.indexOf('hover') != -1) {
	    img.src = img.src.replace(/hover/, 'unsel');
	  }
	},
	
	selectFacetSelector: function(anchor) {
	  var img = anchor.firstChild;
	  var facetId = img.id.substring(img.id.lastIndexOf('-') + 1);
	  var selectorValue = img.id.substring(0, 3); // first 3 characters is 'and' or 'not'
	  var emailAddress = g('email-address-'+facetId);
	  if (img.src.indexOf('hover') != -1) {
		// Highlight the selected email address
		if (emailAddress) {
		    emailAddress.className = 'email-address-selected';
		}	  
	    img.src = img.src.replace(/hover/, 'sel');
	    if (img.id.indexOf('not') != -1) {
	    	img.alt = EDR.messages.K0015I_TOOLTIP_RADIO_FACET_NOT_CHECKED;
	    } else {
	    	img.alt = EDR.messages.K0015I_TOOLTIP_RADIO_FACET_AND_CHECKED;
	    }	    
	    
	  } else if (img.src.indexOf('_sel') != -1) {
		// Highlight the selected email address
		if (emailAddress) {
		    emailAddress.className = '';
		}	  
	    img.src = img.src.replace(/sel/, 'unsel');
	    if (img.id.indexOf('not') != -1) {
	    	img.alt = EDR.messages.K0015I_TOOLTIP_RADIO_FACET_NOT;
	    } else {
	    	img.alt = EDR.messages.K0015I_TOOLTIP_RADIO_FACET_AND;
	    }	   
	    
	  } else {
		// Highlight the selected email address
		if (emailAddress) {
		    emailAddress.className = 'email-address-selected';
		}	  
	    img.src = img.src.replace(/unsel/, 'sel');
	    if (img.id.indexOf('not') != -1) {
	    	img.alt = EDR.messages.K0015I_TOOLTIP_RADIO_FACET_NOT_CHECKED;
	    } else {
	    	img.alt = EDR.messages.K0015I_TOOLTIP_RADIO_FACET_AND_CHECKED;
	    }
	  }
	  // Set number of selected facets
	  var facetName = img.getAttribute("facetName");
	  if (emailAddress) {
	      var objId = emailAddress.innerText ? emailAddress.innerText : emailAddress.textContent;
		  EDR.search.Form.selectedItems.remove(objId);
	      if (emailAddress.className != '') {
	          var obj = {};
	          obj.id = objId;
	          obj.type = selectorValue;	
	          var facetIndex = img.id.substring(img.id.lastIndexOf(facetName) + facetName.length);	             
	          obj.index = facetIndex;
		      EDR.search.Form.selectedItems.add(obj);
	      }
	  }
	  
	  if (img.id.indexOf('not') != -1) {
	      g(img.id.replace(/not/, 'and')).src = "images/boolean_switch_and_unsel13.png";
	      g(img.id.replace(/not/, 'and')).alt = EDR.messages.K0015I_TOOLTIP_RADIO_FACET_AND;
	  } else {
	      g(img.id.replace(/and/, 'not')).src = "images/boolean_switch_not_unsel13.png";
	      g(img.id.replace(/and/, 'not')).alt = EDR.messages.K0015I_TOOLTIP_RADIO_FACET_NOT;
	  }
	  
	  var num = EDR.search.Form.selectedItems.getAll().length; /* EDR.search.Form.getNumberOfSelectedFacets(facetName); */
	  var numSelectedDiv = g(facetName+'-dlg-number-selected');
	  if (numSelectedDiv) {
	     numSelectedDiv.innerHTML = num;
	  }
	},
	
	extractSelectedFacets: function() {
	  EDR.dialog.util.hide(this.id);
	  var facetName = this.id.substring(0, this.id.indexOf('dlg') - 1);
	  var items = EDR.search.Form.selectedItems.getAll();
	  for (var i = 0; i < items.length; i++) {
	     var item = items[i];
         var existingCheckboxId = "";	        
         var facetIndex = item.index;	       
         // check for an existing checkbox with the same id, but the opposite sense
         if (item.type == "and") {
           existingCheckboxId = "not" + "-" + facetName + "-" + facetIndex;
         }
         else {
           existingCheckboxId = "and" + "-" + facetName + "-" + facetIndex;
         }
         // if an existing checkbox exists with the same id but opposite sense, then remove it
         if (EDR.search.Form.selectedFacetRefinements.get(existingCheckboxId)) {
           EDR.search.Form.selectedFacetRefinements.remove(existingCheckboxId);
         }
         // If an existing checkbox exists with the same sense, then don't create another one
         var checkboxId = item.type + "-" + facetName + "-" + facetIndex;
         if (!EDR.search.Form.selectedFacetRefinements.get(checkboxId)) {
           var checkbox = document.createElement("input");
           checkbox.id = checkboxId;
           checkbox.value = "true";
           checkbox.name = checkboxId;	                
           EDR.search.Form.selectedFacetRefinements.add(checkbox);
         }
	  }
//    EDR.search.Form.setSearchType('add-to-search');
  	  EDR.search.Form.facetRenderingCancelled = true;
  	  
  	  // submit the refined search
  	  EDR.search.Form.submit();
	},
	
	closeFacetDialog: function() {
	  EDR.dialog.util.hide(this.id);
	  EDR.search.Form.facetRenderingCancelled = true;    
	},
	
	/*
	 * Sort the data in the facet dialog according to the provided sortDescriptor.
	 * The sort descriptor must be in the format required by <es:dojo />.data.ItemFileReadStore
	 */
	sortFacetBy: function(facetId, sortDescriptor) {
	  var oldSort = EDR.search.Form[facetId].sort;
	  if (oldSort) {
	    if (oldSort[0].attribute == sortDescriptor[0].attribute) { 
	      // same attribute, toggle sort order
	      sortDescriptor[0].descending = !oldSort[0].descending;
	    } else {
	      g(facetId + "-sort-arrow-desc-" + oldSort[0].attribute).style.display = 'none';
	      g(facetId + "-sort-arrow-desc-active-" + oldSort[0].attribute).style.display = 'none';
	      g(facetId + "-sort-arrow-asc-" + oldSort[0].attribute).style.display = 'none';
	      g(facetId + "-sort-arrow-asc-active-" + oldSort[0].attribute).style.display = 'none';
	      g(facetId + "-sort-link-" + oldSort[0].attribute).style["fontWeight"] = "normal";
	    } 	    
	  }  
	  // render sort order image
	  if (sortDescriptor[0].descending) {
	      g(facetId + "-sort-arrow-desc-" + sortDescriptor[0].attribute).style.display = 'none';
	      g(facetId + "-sort-arrow-desc-active-" + sortDescriptor[0].attribute).style.display = '';
	      g(facetId + "-sort-arrow-asc-" + sortDescriptor[0].attribute).style.display = '';
	      g(facetId + "-sort-arrow-asc-active-" + sortDescriptor[0].attribute).style.display = 'none';
	  } else {
	      g(facetId + "-sort-arrow-desc-" + sortDescriptor[0].attribute).style.display = '';
	      g(facetId + "-sort-arrow-desc-active-" + sortDescriptor[0].attribute).style.display = 'none';
	      g(facetId + "-sort-arrow-asc-" + sortDescriptor[0].attribute).style.display = 'none';
	      g(facetId + "-sort-arrow-asc-active-" + sortDescriptor[0].attribute).style.display = '';
	  }	  
      g(facetId + "-sort-link-" + sortDescriptor[0].attribute).style["fontWeight"] = "bold";
      
	  EDR.search.Form[facetId].sort = sortDescriptor;
	  EDR.search.Form.facetRenderingCancelled = true;
      setTimeout(function() {EDR.search.Form.renderFacetDialogData(facetId)}, 0);
	},
	
	filterType: function(facetId, type) {
	  EDR.search.Form[facetId].showType = type;
	  // Show the link as selected
	  if (type == '') {
	     EDR.search.Form.selectFilterTypeAll(facetId);
	  } else if (type == 'and') {
		  g(facetId+'-facet-dlg-show-all-selected').style.display = 'none';
		  g(facetId+'-facet-dlg-show-all').style.display = '';
		  g(facetId+'-facet-dlg-show-and-selected').style.display = '';
		  g(facetId+'-facet-dlg-show-and').style.display = 'none';
		  g(facetId+'-facet-dlg-show-not-selected').style.display = 'none';
		  g(facetId+'-facet-dlg-show-not').style.display = '';
	  } else if (type == 'not') {
		  g(facetId+'-facet-dlg-show-all-selected').style.display = 'none';
		  g(facetId+'-facet-dlg-show-all').style.display = '';
		  g(facetId+'-facet-dlg-show-and-selected').style.display = 'none';
		  g(facetId+'-facet-dlg-show-and').style.display = '';
		  g(facetId+'-facet-dlg-show-not-selected').style.display = '';
		  g(facetId+'-facet-dlg-show-not').style.display = 'none';
	  }
	  // Clear the filter
	  g(facetId + "-filter").value = "";	
	  EDR.search.Form[facetId].filter = {email:"*"};
	  // Show the results
	  EDR.search.Form.facetRenderingCancelled = true;
	  setTimeout(function() {EDR.search.Form.renderFacetDialogData(facetId)}, 0);
	},
	
	selectFilterTypeAll : function(facetId) {
	  EDR.search.Form[facetId].showType = ''; 
	  g(facetId+'-facet-dlg-show-all-selected').style.display = '';
	  g(facetId+'-facet-dlg-show-all').style.display = 'none';
	  g(facetId+'-facet-dlg-show-and-selected').style.display = 'none';
	  g(facetId+'-facet-dlg-show-and').style.display = '';
	  g(facetId+'-facet-dlg-show-not-selected').style.display = 'none';
	  g(facetId+'-facet-dlg-show-not').style.display = '';
	},
	
	/*
	 * An event handler for handling filter string change events
	 */
	filterChanged: function(facetId, filterText) {
	  var currentTimer = EDR.search.Form.timers[facetId];
	  /* The filter has changed. If there's a current timer, cancel it. */
	  if (currentTimer != null) {
	    clearTimeout(currentTimer);
	  }	  
	  /*
	   * Set a timer to trigger the filter after 1 second of inactivity in
	   * the filter field.
		 */
	  EDR.search.Form.timers[facetId] = 
	    setTimeout(function() {
	      EDR.search.Form.filterFacets(facetId, filterText)
	    }, 1000);
	},	
	
	/*
	 * Filter the facet values in a facet dialog according to the provided
	 * filter text.
	 */
	filterFacets: function(facetId, filterText) {
	  // Clear the Show filter
      EDR.search.Form.selectFilterTypeAll(facetId);
	  EDR.search.Form.facetRenderingCancelled = true;
	  EDR.search.Form[facetId].filter = {email:"*" + filterText + "*"};
	  setTimeout(function() {EDR.search.Form.renderFacetDialogData(facetId);}, 0);
	},

	formContainerOnResize: function() {
		if (<es:dojo />.isIE) {
			var form = <es:dojo />.byId(EDR.prefix+"formContainer");
			var width = <es:dojo />.byId(EDR.prefix+"searchPageLeftColumn").clientWidth + "px";
			if (form.style.width != width) form.style.width = width;
		}
	},
	
	loadHelperDialog: function(parms) {
	  var fieldName = parms.field;
	  var dialog = <es:dijit />.byId(EDR.prefix+fieldName + "-helper-dialog");
	  var queryForm = <es:dojo />.query("form", dialog.domNode)[0];
	  queryForm.query.value = g(fieldName).value;
	  EDR.dialog.util.show(dialog);
	}	
}

