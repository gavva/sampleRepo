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

EDR.ajax.Request = {

	get: function(params) {
		params.showProgress = ((params.showProgress == false) ? false : true);
		params.type = "get";
		EDR.ajax.Request._doRequest(params);
	},

	post: function(params) {
		params.showProgress = ((params.showProgress == false) ? false : true);
		params.type = "post";
		EDR.ajax.Request._doRequest(params);
	},
	
	/**
	 * The updateContentPane function will retrieve the page from the specified URL
	 * and insert it into ContentPane widget with the specified ID.  This should be used
	 * in place of the Dojo setHref function to avoid session timeout issues.
	 */
	updateContentPane: function(paneId, href, timeout) {
		
		var parms = {};
		parms.showProgress = false;
		parms.url = href;
		parms.elementToReplace = paneId;
		if (timeout != null) {
			parms.timeout = timeout;
		}
		parms.type = "get";
		EDR.ajax.Request._doRequest(parms);
		
	},
	
	_doRequest: function(params) {
		
		if (params.showProgress) {
			var progressText = params.progressText ? params.progressText : EDR.messages.K0001I_COMMON_PROGRESS_WAIT;			
			EDR.dialog.ProgressDialog.show(progressText);
			// Keep track of the progress depth
			EDR.ajax.progressCounter = EDR.ajax.progressCounter + 1;
		} 
		
		// Add a request parameter to indicate this is an Ajax request 
		
		// Determine if there are query parameters in the request, since the first query parameter must
		// start with ?, look for that 
		var url = params.url + ((params.url.indexOf("?") == -1) ? "?" : "&") + "isXhr=true";
		
		var sync = false;
		if (params.sync) {
			sync = params.sync;
		}
		
		var content = {};
		if (params.content) {
			content = params.content;
		}
		
		var handleAs = null;
		if (params.handleAs) {
			handleAs = params.handleAs;
		}
		
		// check if advanced search options is enabled
		if (<es:dijit />.byId(EDR.prefix+"searchPane").isAdvancedSearchOptionsEnabled()) {
			content.advancedSearchOptions = true; // enable advanced search option
		}
		
		var kw = {
		
		        url: url,
		        
		        sync: sync, 
		        
		        content: content,
		        
		        load: function(response, ioArgs) {
		        	
		        	if (params.showProgress) {
		        		EDR.ajax.progressCounter = EDR.ajax.progressCounter - 1;
		        		if (EDR.ajax.progressCounter <= 0) {
		        			EDR.ajax.progressCounter = 0;
							EDR.dialog.ProgressDialog.hide();
						}
					}
					
					// Check for redirects - if we were redirected to the login page, 
					// the session must have timed out...just refresh the page
					if (response.indexOf("j_username") != -1) {
						// We must have been redirected to the login page, just refresh the entire page
						window.location.reload(true);
						return response;
					}
					
					// Always check for an error					
					var json = {};
					try {
						json = <es:dojo />.fromJson(response);
					} catch (e) {
						// json format error
					}

					// If the return is an object, then we have error data in JSON format
					if (typeof(json) == 'object' && json.warning != null) {
						if (params.errorCallback) {
							params.errorCallback(response, ioArgs);
	            	} else {
	            	   // Default is to show an error dialog
	            		EDR.ajax.Warning.handle(json.warning, ioArgs);
	            	}
		            if (params.afterErrorHandlerCallback) {
		            	params.afterErrorHandlerCallback(response, ioArgs);
		            }
						return response;
					} else if (typeof(json) == 'object' && json.error != null) {  
						if (params.errorCallback) {
						params.errorCallback(response, ioArgs);
	            	} else {
	            	   	// Default is to show an error dialog
	            		EDR.ajax.Error.handle(json.error, ioArgs);
	            	}
		            if (params.afterErrorHandlerCallback) {
		            	params.afterErrorHandlerCallback(response, ioArgs);
		            }
						return response;
					}				
					 
					// Use the provided success callback if it exists 
		        	if (params.successCallback) {
		        		params.successCallback(response, ioArgs);
		        	} else {
		        				        		
		        		// Support setting content of a Dojo content pane and a standard Div
		        		if (params.elementToReplace) {
		        			
		        			// Look for a Dijit widget
		        			var dw = <es:dijit />.byId(params.elementToReplace);
		        			if (dw != null) {
		        			    if (params.beforeSetContentCallback) {
		        			       params.beforeSetContentCallback();
		        			    }
		        			    if (dw.setContent) {
		        					dw.setContent(response);
			        			    if (params.afterSetContentCallback) {
			        			       params.afterSetContentCallback();
			        			    }
		        				} else {
		        					dw.innerHTML = response;
		        				}
		        			} else {		        			
			        			var el = g(params.elementToReplace);       				
			        			el.innerHTML = response;
			        		}
		        		}
		        	}		        	
		        	
		        	return response;
		        },
		        
		        // If we get to this callback something severe happened
		        error: function(response, ioArgs) {
		        
			        	if (params.showProgress) {
			        		EDR.ajax.progressCounter = 0;
							EDR.dialog.ProgressDialog.hide();
						}
						
						if (EDR.util.isTimeout(response, ioArgs) && params.timeoutCallback) {
							params.timeoutCallback(response, ioArgs);
						} else if (params.errorCallback) {
							params.errorCallback(response, ioArgs);
		            } else {
		            	// Default is to show an error dialog
		            	EDR.ajax.Error.handle(response, ioArgs);
		            }
		            
		            if (params.afterErrorHandlerCallback) {
		            	params.afterErrorHandlerCallback(response, ioArgs);
		            }
		            
		            return response;
		        },
		        
//		        timeout: ((params.timeout == null) ? 300000 : params.timeout), // use default timeout (60s)
		        
		        form: params.formId,
		        handleAs: handleAs
		};
		
		params.type == "get" ? <es:dojo />.xhrGet(kw) : <es:dojo />.xhrPost(kw);	
		
	}	
	
	
}
   
/**
 * Static utility Ajax form functions (based on DOJO)
 */
EDR.ajax.Form = {
	
	submit: function(params) {		
		EDR.ajax.Request.post(params);		
	}	
}

/**
 * Utilities for handling Ajax errors.
 */
 
EDR.ajax.Error = {
	
	handle: function(error, ioArgs) {
		EDR.dialog.ErrorDialog.show(error, ioArgs);				
	}

}

EDR.ajax.Warning = {

	handle: function(error, ioArgs) {
		EDR.dialog.WarningDialog.show(error, ioArgs);				
	}
}

EDR.ajax.Loading = {
    setIsLoading: function(div) {
       var targetDiv = div
       var loadingOverlay = <es:dojo />.query("div[class='loadingBackground']", targetDiv)[0];            
       if (!loadingOverlay) { // no overlay present
       
         // render an overlay to make the target div appear disabled.        
         var overlay = document.createElement("div");
         var pos = <es:dojo />.coords(targetDiv);
	     overlay.className = "loadingBackground";
	     overlay.style.position = "absolute";
	     overlay.style.left = pos.l;
	     overlay.style.top = pos.t;
	     overlay.style.width = pos.w + "px";
	     overlay.style.height = pos.h + "px";
	     overlay.style.zIndex = 100;
	     targetDiv.appendChild(overlay);
	     
	     var busy = document.createElement("div");
	     busy.style.position = "absolute";
	     busy.style.left = (pos.w/2 - 10) + "px";
	     var heightOffset = pos.h == 0 ? 50 : pos.h;
	     busy.style.top = (heightOffset/2 - 10) + "px";
	     busy.innerHTML = "<img alt=\""+ EDR.messages.splash_loading +"\" src=\""+EDR.config.imageBaseDir+"status_indicator_20_slow.gif\"/>";
	     busy.zIndex = 200;
	     overlay.appendChild(busy);
	     
	     return overlay;
	   }
	   return loadingOverlay;
    },
    
    clearIsLoading: function(div) {      
      var targetDiv = div
      var loadingOverlay = <es:dojo />.query("div[class='loadingBackground']", targetDiv)[0];
      if (loadingOverlay) {        
        targetDiv.removeChild(loadingOverlay);
      }
    }
}

/**
 * Number of stacked requests showing a progress dialog
 */
EDR.ajax.progressCounter = 0;