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

/* application.jsp start */

/**
 * Global namespace declaration
 * 
 * EDR = eDiscovery Review
 */
if (typeof EDR == "undefined") {
	var EDR = {};
}

if(typeof dojo13 == "undefined") {
	var dojo13 = dojo;
	var dijit13 = dijit;
}

/**
 * Initialization
 */
(function() {

	// Register namespaces
	EDR["util"] = {};
	EDR["ajax"] = {};
	EDR["dialog"] = {};
	EDR["admin"] = {};
	EDR["search"] = {};
	EDR["bean"] = {};	
	EDR["email"] = {};	
	EDR["attachment"] = {};	
	EDR["portlet"] = {};	
	
})();

/**
 * Shortcut in the global namespace to retrieve an HTML element by it's ID.
 */
function g(element) {
	return (typeof element == 'string' ? dojo13.byId(element) : element);
}

/**
 * Shortcut in the global namespace to retrieve an HTML form by it's ID.
 */
function f(formId) {
	return document.forms[formId];
}

/**
 * Shortcut in the global namespace to retrieve the value of an HTML form element.
 */
function fv(formId, inputId) {
	return f(formId).elements[inputId].value;
}

/* application.jsp end */

/* ajax.jsp start */

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
		if (dijit13.byId(EDR.prefix+"searchPane").isAdvancedSearchOptionsEnabled()) {
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
						json = dojo13.fromJson(response);
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
		        			var dw = dijit13.byId(params.elementToReplace);
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
		
		params.type == "get" ? dojo13.xhrGet(kw) : dojo13.xhrPost(kw);	
		
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
       var loadingOverlay = dojo13.query("div[class='loadingBackground']", targetDiv)[0];            
       if (!loadingOverlay) { // no overlay present
       
         // render an overlay to make the target div appear disabled.        
         var overlay = document.createElement("div");
         var pos = dojo13.coords(targetDiv);
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
      var loadingOverlay = dojo13.query("div[class='loadingBackground']", targetDiv)[0];
      if (loadingOverlay) {        
        targetDiv.removeChild(loadingOverlay);
      }
    }
}

/**
 * Number of stacked requests showing a progress dialog
 */
EDR.ajax.progressCounter = 0;
/* ajax.jsp end */


/* util.jsp start */

/**
 * Static utility functions
 */
EDR.util = {
	isBrowserSupported: function() {
	   return (dojo13.isIE == 7 || dojo13.isFF >= 2);
	},

    isTimeout: function(response, ioArgs) {
       var dojoType = null;
       try {
          dojoType = response.dojoType;
       } catch (e) {
       }
       if (dojoType && dojoType == 'timeout' ) {
	       return true;
	   } else {
	       return false;
	   }
    },
    
	submitChangeCase: function() {
		f('setActiveCaseForm').submit();
		return true;
	},
	
	execOnEnter: function(event, fn) {		
		if (event) {
			key = event.keyCode;
			if (key && key == dojo13.keys.ENTER) {
				dojo13.stopEvent(event); 
				return fn();
			}
		}	
		return false;
	},
	
	// This method should be used in place of the standard javascript alert
	// to show a stylized alert dialog
	alert: function(alertString) {
	
		dojo13.byId(EDR.prefix+'alert-message').innerHTML = alertString;
		EDR.dialog.util.showById(EDR.prefix+'alert-dialog');	
	
	},
	
	
	// This method should be used in place of the standard javascript confirm
	// to show a stylized confirmation dialog.  The second parameter is the function
	// to call if the user selects OK
	confirm: function(confirmString, confirmFunction) {
	
		dojo13.byId(EDR.prefix+'confirmation-message').innerHTML = confirmString;
		var dlg = dijit13.byId(EDR.prefix+'confirmation-dialog');
		var con = dojo13.connect(dlg.okButtonNode, "onClick", this, function() {
			confirmFunction();
			EDR.dialog.util.hide(dlg);
			dojo13.disconnect(con);
		}); 
		EDR.dialog.util.showById(EDR.prefix+'confirmation-dialog');

	},
	
	// Returns true if this is a keyboard event and the user pressed
	// the enter or spacebar, else returns false.  This is useful for making
	// onclick events keyboard accessible
	isEnterOrSpace: function(event) {
		if (event) {
			key = event.keyCode;
			if (key && (key == dojo13.keys.ENTER || key == dojo13.keys.SPACE)) {
				return true;
			}
		}
		return false;
	},
	
	escapeFilterString: function(value) {
		var escapeValue = '';
		for(var i = 0; i < value.length; i++){
			c = value.charAt(i);
			switch (c) {
				case '\\':
				case '*':
				case '?':
				case '$':
				case '^':
				case '/':
				case '+':
				case '.':
				case '|':
				case '(':
				case ')':
				case '{':
				case '}':
				case '[':
				case ']':
					escapeValue += "\\";
					escapeValue += c;
					break;
				default:
					escapeValue += c;
					//escapeValue += caseSensitive ? '[' + c.toLowerCase() + c.toUpperCase() + ']' : c;
			}
		}
		return escapeValue;
	}
}

/**
 * Various window functions
 */
EDR.util.Window = {
	show: function(url) {
		var newWindow = window.open(url);
		newWindow.focus();	
	}
}

/**
 * Various keyboard functions
 */
EDR.util.Keyboard = {
	
	/**
	 * Checks the enter key and clicks the specified button. Propagate event if needed.
	 */
	checkEnterKey: function(button, propagate, evt) {
		// TODO
	}
}

/**
 * Various DOM-related utilities
 */
EDR.util.DOM = {

	/**
	 * Gets the currently selected text in the document body
	 */
	getSelectedText: function() {
		
		if (window.getSelection) {
			return window.getSelection().toString();
		} else if (document.getSelection) {
			return document.getSelection();
		} else if (document.selection) {
			return document.selection.createRange().text;
		} else {
			return "";
		}
		
	},
	
	/**
	 * Stops event propogation
	 */
	stopEventPropagation: function(anEvent) {
		if (!anEvent) {
			var anEvent = window.event;
		}
		anEvent.cancelBubble = true;
		if (anEvent.stopPropagation) {
			anEvent.stopPropagation();
		}
	}

}


/**
 * Clickable label functions
 */
EDR.util.MakeClickable = {

	mouseOver: function(id) {
		dojo13.byId(id).style.cursor = 'hand';	
	},
	
	mouseOut: function(radioId, selected) {
		dojo13.byId(id).style.cursor = 'pointer';	
	}
}
 	
 	
/**
 * Radio functions
 */
EDR.util.Radio = {

	mouseOver: function(radioId, selected) {
		radio = dojo13.byId(radioId);
		radio.style.cursor = 'hand';
		radio.src = (selected ? "images/radio_kiso_sel_hover13.png" : "images/radio_kiso_hover13.png");		
	},
	
	mouseOut: function(radioId, selected) {
		radio = g(radioId);
		radio.style.cursor = 'pointer';	
		radio.src = (selected ? "images/radio_kiso_sel13.png" : "images/radio_kiso_unsel13.png");
	}
}
 			
/**
 * Tab functions
 */
EDR.util.Tabs = {
	
	isSelected: function(tabId) {
		var tab = g(tabId);		
		if (tab.className == 'tabActive') {
		    return true;
		} else {
		    return false;
		}
	}, 
	
	show: function(tabId) {
		tab = g(tabId);		
		if (tab.className == 'tabInactive') {
			tab.className = 'tabActive';
			if (tab.hasChildNodes()) {
				var tabNodes = tab.childNodes;
				var child;
				for (var i = 0; i < tabNodes.length; i++) {
					child = tabNodes[i];
					if (child.className == 'tabInactiveLeft') {
						child.className = 'tabActiveLeft';
					} else if (child.className == 'tabInactiveMiddle') {
						child.className = 'tabActiveMiddle';
						
						if (child.hasChildNodes()) {
							var tabMiddleChildren = child.childNodes;
							var tabMiddleChild;
							for (var j = 0; j < tabMiddleChildren.length; j++) {
								tabMiddleChild = tabMiddleChildren[j];
								if (tabMiddleChild.className == tabId + 'IconInactive') {
									tabMiddleChild.className = tabId + 'IconActive';
								}
							}
						}
						
					} else if (child.className == 'tabInactiveRight') {
						child.className = 'tabActiveRight';
					}					
				}
			}
			//g(tabId+'Left').className = 'tabActiveLeft';
			//g(tabId+'Middle').className = 'tabActiveMiddle';
			//g(tabId+'Right').className = 'tabActiveRight';
			//g(tabId+'TabIcon').className = tabId+'IconActive';
			EDR.util.Element.show(tabId+'Content');
		}
	},
	
	hide: function(tabId) {
		tab = g(tabId);		
		if (tab.className == 'tabActive') {
			tab.className = 'tabInactive';
			if (tab.hasChildNodes()) {
				var tabNodes = tab.childNodes;
				var child;
				for (var i = 0; i < tabNodes.length; i++) {
					child = tabNodes[i];
					if (child.className == 'tabActiveLeft') {
						child.className = 'tabInactiveLeft';
					} else if (child.className == 'tabActiveMiddle') {
						child.className = 'tabInactiveMiddle';
						
						if (child.hasChildNodes()) {
							var tabMiddleChildren = child.childNodes;
							var tabMiddleChild;
							for (var j = 0; j < tabMiddleChildren.length; j++) {
								tabMiddleChild = tabMiddleChildren[j];
								if (tabMiddleChild.className == tabId + 'IconActive') {
									tabMiddleChild.className = tabId + 'IconInactive';
								}
							}
						}
						
					} else if (child.className == 'tabActiveRight') {
						child.className = 'tabInactiveRight';
					}					
				}
			}
			//g(tabId+'Left').className = 'tabInactiveLeft';
			//g(tabId+'Middle').className = 'tabInactiveMiddle';
			//g(tabId+'Right').className = 'tabInactiveRight';
			//g(tabId+'TabIcon').className = tabId+'IconInactive';
			EDR.util.Element.hide(tabId+'Content');
		}
	},
	
	hideAll: function(tabContainerId) {
		tabs = g(tabContainerId);
		if (tabs.hasChildNodes()) {
			var tabNodes = tabs.childNodes;
			var tabNode;
			for (var i = 0; i < tabNodes.length; i++) {
				tabNode = tabNodes[i];
				if (tabNode.className == 'tabActive' || tabNode.className == 'tabInactive') {
					EDR.util.Tabs.hide(tabNode.id);
				}
			}
		}
	},
	
	mouseOver: function(tabId) {
		g(tabId).style.cursor = 'hand';		
	},
	
	mouseOut: function(tabId) {
		g(tabId).style.cursor = 'pointer';	
	},
	
	close: function(tabContainerId, tabContentContainerId, tabId) {

		// Remove the tab
		var tabContainer = g(tabContainerId);
		var tab = g(tabId);
		tabContainer.removeChild(tab);
		
		// Remove the tab content
		var tabContentContainer = g(tabContentContainerId);
		var tabContent = g(tabId+"Content");
		tabContentContainer.removeChild(tabContent);
		
		// Hide all
		EDR.util.Tabs.hideAll(tabContainerId);
		
		// Select the first one
		if (tabContainer.hasChildNodes()) {
			var tabNodes = tabContainer.childNodes;
			var tabNode;
			for (var i = 0; i < tabNodes.length; i++) {
				tabNode = tabNodes[i];
				if (tabNode.className == 'tabActive' || tabNode.className == 'tabInactive') {
					EDR.util.Tabs.show(tabNode.id);
					break;
				}
			}
		}
	}
}

/**
 * Static utility date functions
 */
EDR.util.Date = {
	
	getLocaleDateFormat: function(locale, formatLength) {
		var formatLength = formatLength || 'short';
		if(dojo13.locale == "en" || dojo13.locale == "en-us")
			return "mm/dd/yyyy"; 
		return dojo13.date.locale._getGregorianBundle(dojo13.locale)["dateFormat-"+formatLength];		
	},
	
	/*
	 * Get the timezone offset 
	 */
	getTimeZoneOffset: function() {
	    var tzohour = parseInt((new Date().getTimezoneOffset()/60)*(-1));
	    var tzomin = parseInt(new Date().getTimezoneOffset()%60)*(-1);
	    var tzo = tzohour*100 + tzomin;
	    return tzo;
	}
}

/**
 * Static utility string functions
 */
EDR.util.String = {
	
	/**
	 *  Check whether a string is empty.
	 */
	isEmpty: function(s) {
		return ((s == null) || (s.length == 0))
	},
	
	isWhitespace: function(s) {
     	var whitespace = " \t\n\r";
     
	    var i;
	
	    // Is s empty?
	    if (EDR.util.String.isEmpty(s)) return true;
	
	    for (i = 0; i < s.length; i++) {
	    	var c = s.charAt(i);
	
	        if (whitespace.indexOf(c) == -1) return false;
	    }
	
	    // All characters are whitespace.
	    return true;
	},

	trim: function(s) { 
		var whitespace = " \t\n\r";
		var i = 0, j = 0;
		
		if (s == null || s.length == 0) {
			return s;
		}
		 
		while (i < s.length && whitespace.indexOf(s.charAt(i)) != -1) {
			i++;
		} 
		j = s.length-1; 
		while (j >= 0 && whitespace.indexOf(s.charAt(j)) != -1) {
			j--;
		} 
		return s.substring(i,j+1); 
	},
	
	htmlEscape: function(s) {
	   var sbuf = new Array();
	   for (var i = 0; i < s.length; i++) {
	     sbuf.push("&#");
		 sbuf.push(s.charCodeAt(i));
		 sbuf.push(";");
	   }
	   return sbuf.join("");
	},
	
	isInListAsName: function(s, list) {
	    if (s && list && list.length > 0) {
		   s = EDR.util.String.trim(s);
	       for (var i=0 ; i < list.length ; i++) {
	           if (s == list[i].name) {
	              return true;
	           }
	       }
	    }
	    return false;
	},
	
	isInList: function(s, list) {
	    if (s && list && list.length > 0) {
		   s = EDR.util.String.trim(s);
	       for (var i=0 ; i < list.length ; i++) {
	           if (s == list[i]) {
	              return true;
	           }
	       }
	    }
	    return false;
	}
} 


/**
 * Static utility number functions
 */
EDR.util.Number = {

	isNumber: function(s) { 
		var re = /\D/;
		return !re.test(s); 
	}
	
}

/**
 * Static utility functions for interacting with a DOM elemeent.
 */
EDR.util.Element = {
	
	/**
	 * Retrieves an element by it's ID.
	 */
	get: function(id) {
		return g(id);
	},
	
	/**
	 * Determines if an element is visible by checking it's display property.
	 */
	visible: function(id) {
		var el = g(id);
		if (el) {
			return el.style.display != 'none' && el.style.display != '';
		}
		return false;
	},
	
	/**
	 * Toggles an elements visibility.
	 */
	toggle: function(id) {
		var el = g(id);
		if (el) {
			el.style.display = (EDR.util.Element.visible(el) ? 'none' : 'block');
		}
		return el;
	},
	
	/**
	 * Hides an element.
	 */
	hide: function(id) {
		var el = g(id);
		if (el) {
			el.style.display = 'none';
		}		
		return el; 
	},
	
	/**
	 * Shows an element.
	 */
	show: function(id) {
		var el = g(id);
		if (el) {
			el.style.display = 'block';
		}
		return el;
	}
}

/**
 * Methods for manipulating dojo widgets
 */
EDR.util.dojo = {
    previousSizeShare: null, 

	/**
	 * Is the CntentPane with the given ID minimized
	 */
	isMinimized: function(domId) {
		var isMinimized = false;
		var dw = dijit13.byId(domId);
		if (dw) {
		    var sizeMin = dw.sizeMin;
		    var domNode = document.getElementById(domId);
	    	var clientHeight = null;
			if (domNode) {
			    clientHeight = domNode.clientHeight;
			}
		    if ((dw.sizeShare <= 0) || (clientHeight && clientHeight <= sizeMin)) {
			    isMinimized = true;
			}
		}		
		return isMinimized;
	},
		
	/**
	 * Minimizes the ContentPane with the given ID
	 */
	minimize: function(domId) {
		// Get the parent split container
		var containerId = g(domId).parentNode.id;
		var parentContainer = dijit13.byId(containerId);
		var children = parentContainer.getChildren();
		var minCount = 0;
		var minIndex = 0;
		var i = 0;
		
		EDR.util.dojo.previousSizeShare = {}; 
		for (i = 0; i < children.length; i++) {
			EDR.util.dojo.previousSizeShare[i] = children[i].sizeShare;
			
			if (children[i].id == domId) {
				children[i].sizeShare = 0;
				minIndex = i;
			} else if (children[i].sizeShare == 0) {
				minCount++;
				children[i].sizeShare = 1;
			}
		}
		
		if (minIndex == 0 && minCount == 2) {
			children[1].sizeShare = 1;
		} else if (minIndex == 1 && minCount == 2) {
			children[2].sizeShare = 1;
		} else if (minIndex == 2 && minCount == 2) {
			children[1].sizeShare = 1;
		}
		
		parentContainer.layout(); 
	},
	
	/**
	 * Maximizes the ContentPane with the given ID
	 */
	maximize: function(domId) {
		// Get the parent split container
		var containerId = g(domId).parentNode.id;
		var parentContainer = dijit13.byId(containerId);
		var children = parentContainer.getChildren();
		for (var i = 0; i < children.length; i++) {
			if (children[i].id == domId) {
				children[i].sizeShare = 100;
			} else {
				children[i].sizeShare = 0;
			}
		}
		// Call layout on the parent to refresh the layout
		parentContainer.layout(); 
	},
	
	/**
	 * Restore the ContentPane with the given ID
	 */
	restore: function(domId) {
		// Get the parent split container
		var containerId = g(domId).parentNode.id;
		var parentContainer = dijit13.byId(containerId);
		var children = parentContainer.getChildren();
		for (var i = 0; i < children.length; i++) {
			if (children[i].id == domId) {
			    if (EDR.util.dojo.previousSizeShare && EDR.util.dojo.previousSizeShare[i] && EDR.util.dojo.previousSizeShare[i] >= 5) {
					children[i].sizeShare = EDR.util.dojo.previousSizeShare[i];
	    		} else {
					children[i].sizeShare = 30;
	    		}
			} else {
			    if (EDR.util.dojo.previousSizeShare && EDR.util.dojo.previousSizeShare[i] && EDR.util.dojo.previousSizeShare[i] >= 5) {
					children[i].sizeShare = EDR.util.dojo.previousSizeShare[i];
	    		} else {
					children[i].sizeShare = 70;
	    		}
			}
		}
		// Call layout on the parent to refresh the layout
		parentContainer.layout(); 
	},
	
	selectedTabWithExpandablePane: function(paneId, tabId) {
	    // if the tab is already selected, then toggle the pane
	    if (EDR.util.Tabs.isSelected(tabId)) { 
		    if (EDR.util.dojo.isMinimized(paneId)) {
				EDR.util.dojo.restore(paneId);
				EDR.util.dojo.showMinimizedIcon(paneId);
		    } else {
				EDR.util.dojo.minimize(paneId);
				EDR.util.dojo.showMaximizedIcon(paneId);
		    }

		// if tab isn't selected & the pane is minimized, then restore the pane
	    } else { 
		    if (EDR.util.dojo.isMinimized(paneId)) {
				EDR.util.dojo.restore(paneId);
				EDR.util.dojo.showMinimizedIcon(paneId);
			}	
	    }
	}, 
	/*
	toggleIfMinimizedOrMaximized: function(domId) {
		var containerId = g(domId).parentNode.id;
		var parentContainer = dijit13.byId(containerId);
		var children = parentContainer.getChildren();
	    
	    // Determine if minimized or if sibling is minimized
		var isMinimized = false;
		var isSiblingMinimized = false;
	    var clientHeight = null;
		for (var i = 0; i < children.length; i++) {
		    var sizeMin = children[i].sizeMin;
		    var domNode = document.getElementById(children[i].id);
		    if (domNode) {
			    clientHeight = domNode.clientHeight;
			} else {
			    clientHeight = null;
			}
			if (children[i].id == domId) {
		        if ((children[i].sizeShare <= 0) || (clientHeight && clientHeight <= sizeMin)) {
			        isMinimized = true;
				}	
			} else {
		        if ((children[i].sizeShare <= 0) || (clientHeight && clientHeight <= sizeMin)) {
			        isSiblingMinimized = true;
				}	
			}
		}
		
		// If pane minimized, maximimize the pane
		if (isMinimized) {
			EDR.util.dojo.maximize(domId);
			EDR.util.dojo.showMinimizedIcon(domId);
			
		// If sibling minimized, minimize the pane
		} else if (isSiblingMinimized) {
			EDR.util.dojo.minimize(domId);
			EDR.util.dojo.showMaximizedIcon(domId);
		}
	}, */
	
	toggleMinimizeMaximizeIcon: function(domIdPrefix) {
		var maximize = g(domIdPrefix+'-maximize');
		var minimize = g(domIdPrefix+'-minimize');
	    if (maximize.style.display == 'none') {
	       maximize.style.display = '';
	       minimize.style.display = 'none';
	    } else {
	       minimize.style.display = '';
	       maximize.style.display = 'none';
	    }
	},
	
	showMinimizedIcon: function(domIdPrefix) {
		var maximize = g(domIdPrefix+'-maximize');
		var minimize = g(domIdPrefix+'-minimize');
       	minimize.style.display = '';
	    maximize.style.display = 'none';
	},
	
	showMaximizedIcon: function(domIdPrefix) {
		var maximize = g(domIdPrefix+'-maximize');
		var minimize = g(domIdPrefix+'-minimize');
        maximize.style.display = '';
	    minimize.style.display = 'none';
	},
	
	/**
	 * Expands all expandable nodes in a dojo tree widget
	 */
	expandTreeNodes: function(treeId) {
	
		var tree = dijit13.byId(treeId);
		dojo13.forEach(tree.getChildren(), function(node) {
				tree._expandNode(node);
			});
	}
}

/**
 * Utility functions for showing/hiding an expandable/collapsible list of items,
 * such as the list of refinements options on the search form. 
 */
 EDR.util.CollapsibleList = {
	
	openLists: [],
	
	isOpen: function(parentId) {
		var list = g(parentId);
		if (list != null && list.style.display == "none") {
			return false;
		} else {
			return true;
		}
	},
	
	// This function will expand the list if it is collapsed, or do the opposite
	// if it is already visible.  If the image ID is provided, the code will 
	// also toggle it between the right arrow and down arrow images
	toggleDisplay: function(parentId, imgId) {
		
		var list = g(parentId);
		if (list != null) {
			if (list.style.display == "none") {
				// expand the list and keep track of it
				list.style.display = "block";
				var val = new Array(2);
				val[0] = parentId;
				val[1] = imgId;
				var isSaved = false;
				for (var i = 0; i < this.openLists.length; i++) {
					if (this.openLists[i][0] == parentId) {
						isSaved = true;
						break;
					}
				}
				
				if (isSaved == false) {
					this.openLists.push(val);
				}
			} else {
				// collapse the list and delete it from the saved list
				list.style.display = "none";
				for (var j = 0; j < this.openLists.length; j++) {
					if (this.openLists[j][0] == parentId) {
						this.openLists.splice(j, 1);
					}
				}

			}		
		} else {
			// Invalid list ID, just return
			return;
		}
		
		if (imgId != null) {
			// If the user provided an image ID, toggle its image
			var image = g(imgId);
			if (list.style.display == "block") {
				image.src = "images/arrow_down8.png";
			} else {
				image.src = "images/arrow_right8.png";
			}
		}
	
	},
	
	openDisplay: function(parentId, imgId) {
		var list = g(parentId);
		if (list != null) {
			if (list.style.display == "none") {
				// expand the list and keep track of it
				list.style.display = "block";
				var val = new Array(2);
				val[0] = parentId;
				val[1] = imgId;
				var isSaved = false;
				for (var i = 0; i < this.openLists.length; i++) {
					if (this.openLists[i][0] == parentId) {
						isSaved = true;
						break;
					}
				}
				
				if (isSaved == false) {
					this.openLists.push(val);
				}
			}		
		} else {
			// Invalid list ID, just return
			return;
		}
		
		if (imgId != null) {
			// If the user provided an image ID, toggle its image
			var image = g(imgId);
			if (list.style.display == "block") {
				image.src = "images/arrow_down8.png";
			}
		}
	},
	
	// The initialize function will loop through and make sure any lists
	// that were previously expanded will be expanded.
	initialize: function() {
	
		for (var j = 0; j < this.openLists.length; j++) {
			this.toggleDisplay(this.openLists[j][0], this.openLists[j][1]);
		}
	
	}

}


/**
 * Utility functions for selecting an address list of items,
 * such as the list of sender/receiver emails on the sender/receiver dialog. 
 */

 EDR.util.List = function() {
	this.items = [];
 };	
 
 dojo13.extend(EDR.util.List, {
	get: function(id) {
		for (var j = 0; j < this.items.length; j++) {
			if (this.items[j].id && this.items[j].id == id) {
			    return this.items[j];
			}
		}
	    return null;
	}, 
	
	add: function(object) {
	    this.items[this.items.length] = object;
	},
	
	remove: function(id) {
	    var newItems = [];
	    var i = 0;
		for (var j = 0; j < this.items.length; j++) {
			if (this.items[j] && this.items[j].id != id) {
			    newItems[i] = this.items[j];
			    i++;
			}
		}
		this.items = newItems;
	},
	
	clear: function() {
	    this.items.length = 0;
	},
	
	getAll: function() {
		return this.items;
	}
 });

/**
 * Static utility for interacting with an HTML form.
 */
EDR.util.Form = {

	focus: function(elementId) {
		g(elementId).focus();
	},
	
	disable: function(formId) {
	
		// Show the progress indicator
		EDR.util.Element.show('form-indicator');
		
		// Disable inputs 
		EDR.util.Form.toggleElements(formId, 'input');
		
		// Disable the buttons
		EDR.util.Form.toggleElements(formId, 'button');
		
	},
	
	enable: function(formId) {
	
		// Hide the progress indicator
		EDR.util.Element.hide('form-indicator');	
		
		// Enable inputs
		EDR.util.Form.toggleElements(formId, 'input');
			
		// Enable the buttons
		EDR.util.Form.toggleElements(formId, 'button');
		
	},
	
	toggleElements: function(formId, elementType) {	
		var f = g(formId);		
		var elements = f.getElementsByTagName(elementType);		
		for (var i = 0; i < elements.length; i++) {			
			elements[i].disabled = (elements[i].disabled ? false : true);
		}	
	},
	
	// The clear function accepts a form ID and will loop through the form
	// and clear all of the input values.
	clear: function(formId) {
	
		var elements, i, element, elementType;
		var form = g(formId);
		
		// Get all the form elements 
		if (document.getElementsByTagName) {
			elements = form.getElementsByTagName('*');
		} else {
			elements = form.elements;
		}
		
		// Loop through the elements, and determine if they should be cleared
		for ( i=0; i < elements.length; i++ )  {
			element = elements[i];
			
			
			if (element.nodeName.toLowerCase() == 'input') {
				// For input elements, get the type - we only need to clear text fields and
				// checkboxes.
				if (element.getAttribute) {
					elementType = element.getAttribute('type');
				} else {
					elementType = element.type;
				}
			
				if (elementType == "text" || elementType == "password")  {
					element.value = '';
				} else if (elementType == "checkbox") {
					element.checked = false;
				}
				
			} else if (element.nodeName.toLowerCase() == 'select') {
				// For select elements, reset the selected index
				element.options.selectedIndex = 0;
			} else if (element.nodeName.toLowerCase() == 'textarea') {
				// For textarea elements, clear the field
				element.value = '';
			}
		}
	
	}
}

/**
* Functions to support a table with resizable columns
*/
EDR.util.ResizableTable = {
 
	resizeColumn 	: null,
	resizeColumnCellContent : null, 
 	minSize 		: 20,
 	oldMouseUp		: null,
 	oldMouseMove	: null,
	afterStopResizeFunction: function(){}, 
	afterSetFunction: function(){}, 
 	savedResizeColumns  : new Array(), 
 	
 	resizableHeaderTable : null,
 	displayArea : null,
	increaseColumnCell : null,
	hasIncreaseColumnChangedSize : false,
 
 	// Starts the column resizing for the table column containing the domNode
 	startResize	: function(e) {
		if (!e) var e = window.event;
 
       var resizerCurrentPosX = 0;
		if (e.pageX || e.pageY) 	{
		    resizerCurrentPosX = e.pageX;
		}	else 	{
		    resizerCurrentPosX = e.clientX;
		}
		
		var targ = null;
		if (e.target) {
		  targ = e.target;
		} else if (e.srcElement) {
		  targ = e.srcElement;
		}
		if (targ.nodeType == 3) { // defeat Safari bug
			targ = targ.parentNode;
		}
			
		// Save the pointer to the column node 
		EDR.util.ResizableTable.resizeColumn = targ.parentNode;
		
		// Save the pointer to the column node content cell 
		EDR.util.ResizableTable.resizeColumnCellContent = null;
		var resizeColumnChildren = EDR.util.ResizableTable.resizeColumn.childNodes;
		if (resizeColumnChildren) {
			for (var j = 0; j < resizeColumnChildren.length; j++) {
			     var child = resizeColumnChildren[j];
				 if (child.className && child.className == 'tableHeaderCellContent') {
				     EDR.util.ResizableTable.resizeColumnCellContent = child;
			         break;
				 }
		    }	  
		} 
		
		// Update the column node with the resizer's current position X
		EDR.util.ResizableTable.resizeColumn.setAttribute('resizerCurrentPosX', resizerCurrentPosX);
		
		// Get the resizable header table & display area
		EDR.util.ResizableTable.resizableHeaderTable = null;
		EDR.util.ResizableTable.displayArea = null;
		var count = 0;
		var parent = EDR.util.ResizableTable.resizeColumn.parentNode;
		while (count < 20) {
		    if (parent && parent.className.indexOf('resizableTable') > -1) {
		        EDR.util.ResizableTable.resizableHeaderTable = parent;
		        
		        var displayAreaId = EDR.util.ResizableTable.resizableHeaderTable.getAttribute('scrollableContent');
       		if (displayAreaId) {
		            EDR.util.ResizableTable.displayArea = dojo13.byId(displayAreaId);
		        }
				break;
		    }
		    parent = parent.parentNode;
		}
		
		// Get increaseColumnCell (the column to increase if resizing causes the table width to become < the display area)
		EDR.util.ResizableTable.hasIncreaseColumnChangedSize = false;
		EDR.util.ResizableTable.increaseColumnCell = null;
		var resizeColumnTH = EDR.util.ResizableTable.resizeColumn.parentNode;
		var allTHs = resizeColumnTH.parentNode.getElementsByTagName("th");		
		if (allTHs) {
	        var thToIncrease = allTHs[allTHs.length - 2]; // ignore the searchResultLastHeaderCell 
		    if (thToIncrease && thToIncrease == resizeColumnTH) {
				thToIncrease = allTHs[allTHs.length - 3]
		    } 
		    
			var children = thToIncrease.childNodes;
		    if (children) {
				for (var j = 0; j < children.length; j++) {
				     var child = children[j];
					 if (child.className && child.className.indexOf('tableHeaderCell') > -1) {
					     EDR.util.ResizableTable.increaseColumnCell = child;
				         break;
				     }    
				 }
		    }	  
		}
		
		// Add event handlers for mouse move and mouse up
		//EDR.util.ResizableTable.oldMouseUp = document.body.onmouseup;
		//EDR.util.ResizableTable.oldMouseMove = document.body.onmousemove;
		document.body.onmousemove = EDR.util.ResizableTable.resizeColumnWidth;
		document.body.onmouseup = EDR.util.ResizableTable.stopResize;
		
		// Prevent propagation
		e.cancelBubble = true;
		if (e.stopPropagation) e.stopPropagation();  
	},
 
 	// Stops the current column resizing in progress and removes event handlers
 	stopResize : function(e) {
		if (!e) var e = window.event;
 
   	document.body.onmousemove = null; //EDR.util.ResizableTable.oldMouseMove;
   	document.body.onmouseup = null; //EDR.util.ResizableTable.oldMouseUp;

   	document.body.style.cursor = "";

   	// Prevent propagation
   	e.cancelBubble = true;
   	if (e.stopPropagation) e.stopPropagation();  
   	
   	EDR.util.ResizableTable.afterStopResizeFunction(EDR.util.ResizableTable.resizeColumn, EDR.util.ResizableTable.resizeColumn.clientWidth);
   	if (EDR.util.ResizableTable.hasIncreaseColumnChangedSize) {
	    	EDR.util.ResizableTable.afterStopResizeFunction(EDR.util.ResizableTable.increaseColumnCell, EDR.util.ResizableTable.increaseColumnCell.clientWidth);
	    }
   	// do resize
   	dojo13.publish("headerColumnsResized");
 	},
 
   saveResizableColumnData : function(resizeableColumnBodyPrefixID, columnWidth) {
       if (resizeableColumnBodyPrefixID && columnWidth) {
	        // Add (or update) the column data to the saved list.
   	    // (The saved list is used by resetColumnSizes method to reset all the table's columns to this last width.)
       	var foundIt = false;
	        for (var i = 0 ; i < EDR.util.ResizableTable.savedResizeColumns.length ; i++) {
   	         if (EDR.util.ResizableTable.savedResizeColumns[i].resizeableColumnBodyPrefixID == resizeableColumnBodyPrefixID) {
       	         foundIt = true;
 	        	     EDR.util.ResizableTable.savedResizeColumns[i].columnWidth = columnWidth;
	             }
   	    }
       	if (!foundIt) {
           	var resizeableColumnData = {};
	            resizeableColumnData.resizeableColumnBodyPrefixID = resizeableColumnBodyPrefixID;
   	        resizeableColumnData.columnWidth = columnWidth;
       	     
           	EDR.util.ResizableTable.savedResizeColumns[EDR.util.ResizableTable.savedResizeColumns.length] = resizeableColumnData;
           }	
       } 
   },
   
   hasSavedResizableColumnData : function() {
       return (EDR.util.ResizableTable.savedResizeColumns.length > 0);
 	},
 	
   getSavedResizableColumnData : function(resizeableColumnBodyPrefixID) {
       if (resizeableColumnBodyPrefixID) {
	        for (var i = 0 ; i < EDR.util.ResizableTable.savedResizeColumns.length ; i++) {
   	         if (EDR.util.ResizableTable.savedResizeColumns[i].resizeableColumnBodyPrefixID == resizeableColumnBodyPrefixID) {
       	         return EDR.util.ResizableTable.savedResizeColumns[i];
       	     }    
            }
       }
       return null;
 	},
   
   resetColumnSizes : function(headerTable) {
       if (headerTable) {
           // Find all the tableHeaderCell divs in the table.  For each tableHeaderCell with saved data, call setSize
	    	var thElements = headerTable.getElementsByTagName("th");		
			for (var i = 0; i < thElements.length; i++) {			
				 var thChildNodes = thElements[i].childNodes;
				 for (var j = 0; j < thChildNodes.length; j++) {
					  var thChild = thChildNodes[j];
					  if (thChild.className && thChild.className.indexOf('tableHeaderCell') > -1) {
					      var columnData = EDR.util.ResizableTable.getSavedResizableColumnData(thChild.getAttribute('resizeableColumnBodyPrefixID'));
					      if (columnData) {
						      EDR.util.ResizableTable.setSize(thChild, columnData.columnWidth); 
					      }
					      break;
					  }
				 }	
			}	
		}
 	},
 	
   setSize : function(columnHeader, columnWidth) {
       // Resize the header column to the new width
	    columnHeader.setAttribute('columnWidth', columnWidth);
	    columnHeader.style.width = columnWidth + "px";
	    var th = columnHeader.parentNode;
	    dojo13.style(th, "width", columnWidth + "px");
	    
       // Resize all the data columns to the new width
       // Assumption: the header column has an attribute called resizeableColumnBodyPrefixID that is the column data prefix ID
		var resizeableColumnBodyPrefixID = columnHeader.getAttribute('resizeableColumnBodyPrefixID');
		if (resizeableColumnBodyPrefixID) {
			//TODO: implement later
			//dojo13.query("." + resizableColumnBodyProfixID).style("width", width + "px");
		}    
   }, 
   
 	resizeColumnWidth : function(e) {
   	var newPosX = 0;
   	if (!e) var e = window.event;
	    if (e.pageX) {
	      newPosX = e.pageX;
	    } else {
	      newPosX = e.clientX;
	    }

	    // Calc the change in size
	    var resizerCurrentPosX = EDR.util.ResizableTable.resizeColumn.getAttribute('resizerCurrentPosX');
	    var changeInSize = newPosX - resizerCurrentPosX;
	    
	    // Calc the column's new width
	    var columnNewWidth = EDR.util.ResizableTable.resizeColumn.clientWidth + changeInSize;
	    
       if (columnNewWidth > EDR.util.ResizableTable.minSize) {
	        // Save the column's original width	    
		    var columnOriginalWidth = EDR.util.ResizableTable.resizeColumn.getAttribute('columnWidth');
	    	if (!columnOriginalWidth) {
		        columnOriginalWidth = EDR.util.ResizableTable.resizeColumn.clientWidth;
		    }
	    
		    // Determine if we need to increase another col's width
	    	// if decreasing the col's width & the table's new width < display area, then need to increase another column's width
		    var needsToIncreaseAColumn = false;
		    if (changeInSize < 0 && EDR.util.ResizableTable.increaseColumnCell && EDR.util.ResizableTable.resizableHeaderTable && EDR.util.ResizableTable.displayArea) { 
				var newWidthForHeaderTable = EDR.util.ResizableTable.resizableHeaderTable.clientWidth + changeInSize; 
				if (newWidthForHeaderTable < EDR.util.ResizableTable.displayArea.clientWidth) {
		    	    needsToIncreaseAColumn = true;
		        }
		    }
		    
		    var resizeColumnCellContent = EDR.util.ResizableTable.resizeColumnCellContent;
   	    // if the width is increasing, then resize it
       	// if the width is decreasing & if the header text is not already hiding, then try to resize it
	        if ((changeInSize > 0) || 
	    	    (changeInSize < 0 && resizeColumnCellContent.clientWidth >= resizeColumnCellContent.scrollWidth)) { 
	    	    
	    	    // Save the increase column's width & calc its new width
			    var increaseColumnOriginalWidth = -1;
			    var increaseColumnNewWidth = -1;
		    	if (needsToIncreaseAColumn) {
				    increaseColumnOriginalWidth = EDR.util.ResizableTable.increaseColumnCell.getAttribute('columnWidth');
		    		if (!increaseColumnOriginalWidth) {
			    	    increaseColumnOriginalWidth = EDR.util.ResizableTable.increaseColumnCell.clientWidth;
				    }
				    
		        	increaseColumnNewWidth = EDR.util.ResizableTable.increaseColumnCell.clientWidth - changeInSize;
			    }
		    
	        	// Set the column(s) to the new size(s)
	            EDR.util.ResizableTable.setSize(EDR.util.ResizableTable.resizeColumn, columnNewWidth);
	            if (needsToIncreaseAColumn) {
		            EDR.util.ResizableTable.setSize(EDR.util.ResizableTable.increaseColumnCell, increaseColumnNewWidth);
		    	    EDR.util.ResizableTable.hasIncreaseColumnChangedSize = true;
	            }
           
		        // Optional user function to call after calling setSize method
	    	    // (i.e. this can use this to rescroll your header based on the body scrollLeft (needed for IE when scrolled left))
	        	EDR.util.ResizableTable.afterSetFunction(EDR.util.ResizableTable.resizeColumn, columnNewWidth, resizerCurrentPosX, newPosX);
	        	
	            // If set the width too small so that the header text is scrolling/hiding, reset it back to the previous width
	            if (resizeColumnCellContent.clientWidth < resizeColumnCellContent.scrollWidth) {
	            
	    	    	// Reset the column to the original size
	        	    EDR.util.ResizableTable.setSize(EDR.util.ResizableTable.resizeColumn, columnOriginalWidth);
		            if (needsToIncreaseAColumn) {
		    	        EDR.util.ResizableTable.setSize(EDR.util.ResizableTable.increaseColumnCell, increaseColumnOriginalWidth);
	            	}
           
		        	// Optional user function to call after calling setSize method
		    	    // (i.e. this can use this to rescroll your header based on the body scrollLeft (needed for IE when scrolled left))
		        	EDR.util.ResizableTable.afterSetFunction(EDR.util.ResizableTable.resizeColumn, columnOriginalWidth, resizerCurrentPosX, resizerCurrentPosX);
			        	
	            } else { // If successfully modified the size, then save it
	          
   		        // Save the last columnResizerPositionX in the column as an attribute
			        EDR.util.ResizableTable.resizeColumn.setAttribute('resizerCurrentPosX', newPosX);
         
       		    // Add (or update) the column data to the saved list.
           		// (The saved list is used by resetColumnSizes method to reset all the table's columns to this last width.)
			        EDR.util.ResizableTable.saveResizableColumnData(EDR.util.ResizableTable.resizeColumn.getAttribute('resizeableColumnBodyPrefixID'), columnNewWidth);
		            if (needsToIncreaseAColumn) {
				        EDR.util.ResizableTable.saveResizableColumnData(EDR.util.ResizableTable.increaseColumnCell.getAttribute('resizeableColumnBodyPrefixID'), increaseColumnNewWidth);
		            }
			    }
		//add new width to parent node
		var parent = EDR.util.ResizableTable.resizeColumn.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
		var parentWidth = dojo13.contentBox(parent).w;
		dojo13.contentBox(parent,{w:(parentWidth+changeInSize)});
		parent.style.width = parentWidth+changeInSize;
    	
		    }
	    }
	    
	    // Make sure the resize cursor is shown
	    document.body.style.cursor = "w-resize";
	
	    // Prevent propagation
	    e.cancelBubble = true;
	    if (e.stopPropagation) e.stopPropagation();    
 	}
}

/* util.jsp end */


/* dialog.jsp start */

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
		var dlg = dijit13.byId(dialogId);
		if(!dlg) {
			dojo13.parser.parse(dialogId + "-Container");
			dlg = dijit13.byId(dialogId);
			if(dojo13.isIE && dialogId == EDR.prefix + "preferences") {
				dijit13.byId(EDR.prefix + "resultsOptions").domNode.style.overflow = "auto";
			}
		}
		var smallDialogs = [EDR.prefix+"alert-dialog", EDR.prefix+"error-dialog", EDR.prefix+"preference", EDR.prefix+"multiSelectDlg", EDR.prefix+"myProfileDlg", EDR.prefix+"facetDialog", EDR.prefix+"previewDialog", EDR.prefix+"about-dialog", EDR.prefix+"documentLabelDialog"];
		if(dojo13.marginBox(dojo13.body().parentNode).w < 900){
			dojo["require"]("dojo._base.array");
			if(dojo.indexOf(smallDialogs, dialogId) != -1) {
				dlg.setWidth(500);
				if(dlg.containerNode) {
					var dialogNode = dojo13.query("div", dlg.containerNode)[0];
					dojo13.marginBox(dialogNode, {w:500});
					dialogNode.style.overflow = "auto";
				}
			}
		} else if (dialogId == "previewContent" || dialogId == "previewContainer") {
			dlg.domNode.style.width = "480px";
		}
		this.show(dlg);
	},
	
	hideById: function(dialogId) {
		this.hide(dijit13.byId(dialogId));
	},
	
	show: function(dlg) {
		// hide flash objects
		if(EDR.isTextAnalyticsEnabled) {
			widgets.analytics.hideAnalyticsPane();
		}
		
		var dialogs = EDR.dialog.util.dialogs;
		dojo13.forEach(dialogs, function(dlg) {
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
					dijit13._underlay.hide();
			}
		}
		// call original hide method
		dijit13.Dialog.prototype.hide.call(dlg);
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
		var dlg = dijit13.byId(EDR.dialog.Constants.COMMON_DIALOG_DOM_ID);
		
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
		var dlg = dijit13.byId(EDR.dialog.Constants.PROGRESS_DIALOG_DOM_ID);												
		dojo13.byId(EDR.prefix+"progress-message").innerHTML = msg;
		EDR.dialog.util.show(dlg);
	},
	
	hide: function() {
		document.body.style.cursor = "auto";
		EDR.dialog.util.hideById(EDR.dialog.Constants.PROGRESS_DIALOG_DOM_ID);
	}
}

EDR.dialog.WarningDialog = {

	show: function(warning, ioArgs) {			
		var dlg = dijit13.byId(EDR.prefix+"alert-dialog");			
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
		var dlg = dijit13.byId(EDR.dialog.Constants.ERROR_DIALOG_DOM_ID);	
		
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
/* dialog.jsp end */


/* constants.jsp start */
EDR.Constants = {
		APPLICATION_CONTEXT: EDR.contextPath
	}

	EDR.dialog.Constants = {
		
		PROGRESS_DIALOG_DOM_ID: EDR.prefix+"progress-dialog",
		
		ERROR_DIALOG_DOM_ID: EDR.prefix+"error-dialog",
		
		COMMON_DIALOG_DOM_ID: EDR.prefix+"common-dialog"
	}
	 
	EDR.search.Constants = {

		DEFAULT_START_PAGE: 1,
		
		DEFAULT_RESULTS_PER_PAGE: 25,
		
		SEARCH_FORM_ID: "searchForm",
		
		SEARCH_INITIAL_URL: EDR.Constants.APPLICATION_CONTEXT + "/search?action=index",
		
		SEARCH_URL: EDR.Constants.APPLICATION_CONTEXT + "/search?action=search",
		
		SAVE_SEARCH_URL: EDR.Constants.APPLICATION_CONTEXT + "/search?action=saveQuery",
		
		DELETE_SEARCH_URL: EDR.Constants.APPLICATION_CONTEXT + "/search?action=deleteQuery",
		
		IMPORT_SEARCH_URL: EDR.Constants.APPLICATION_CONTEXT + "/search?action=importQueries",
		
		LOAD_SAVED_SEARCHES_URL: EDR.Constants.APPLICATION_CONTEXT + "/search?action=loadSavedSearches",
		
		SORT_URL: EDR.Constants.APPLICATION_CONTEXT + "/search?action=sort",
				
		GROUP_URL: EDR.Constants.APPLICATION_CONTEXT + "/search?action=group",
		
		SEARCH_GROUP_URL: EDR.Constants.APPLICATION_CONTEXT + "/search?action=getGroupResults",
		
		PAGE_URL: EDR.Constants.APPLICATION_CONTEXT + "/search?action=page",
		
		SEARCH_NEW_DATE_RANGE: EDR.Constants.APPLICATION_CONTEXT + "/search?action=updateDateRange",
		
		EMAIL_RESULTS_ELEMENT_ID: "results-container",
		
		SEARCH_FORM_KEYWORDS_ID: "keywords",
		
		SEARCH_FORM_FROM_ID: "from",
		
		SEARCH_FORM_TOCCBCC_ID: "toccbcc",
		
		SEARCH_FORM_SUBJECT_ID: "subject",
		
		SEARCH_FORM_FROM_DATE_ID: "from-date",
		
		SEARCH_FORM_TO_DATE_ID: "to-date",
		
		SEARCH_PAGE: "page",
		
		SEARCH_SORT_FIELD: "sort-by",
		
		SEARCH_GROUP_FIELD: "group-by",
		
		SEARCH_GROUP_VALUE: "group-by-value",
		
		SEARCH_GROUP_REP_DOC_ID: "group-rep-docId",
		
		SEARCH_GROUP_REP_ROW_ID: "group-rep-rowId",
		
		SEARCH_GROUP_NUM_RESULTS: "group-num-results",
		
		SEARCH_GROUP_COUNTER: "group-counter",
		
		SEARCH_GROUP_SELECTALL: "selectAll",
		
		TIMELINE_ELEMENT_ID: "timeline",
		
		TIMELINE_TITLE_ELEMENT_ID: "timelineTitle",
		
		VISUALIZATION_CONTAINER_ELEMENT_ID: "visualization-container",
			
		SEARCH_RESULTS_PER_PAGE: "resultsPerPage",
		
		SEARCH_RESULTS_REFRESH: "resultsRefresh",
		
		CRITERIA_CONTAINER_ELEMENT_ID: "criteria-container",
		
		SEARCH_FORM_DATE_ERROR_ID: "date-error-div",
		
		SEARCH_FORM_KEYWORD_ERROR_ID: "keyword-error-div",
		
		SEARCH_FORM_SUBJECT_ERROR_ID: "subject-error-div",
		
		SEARCH_FORM_SENDER_ERROR_ID: "sender-error-div",
		
		SEARCH_FORM_RECIPIENT_ERROR_ID: "recipient-error-div",
		
		SEARCH_TOOLBAR_ID: "toolbar-container",
		
		SEARCH_SAVE_FORM_ID: "saveSearchForm",
		
		SEARCH_SAVE_FORM_NAME_ID: "saveSearchName",
		
		SEARCH_SAVE_FORM_ERROR_ID: "save-search-error-div"
	}

	EDR.email.Constants = {
		
		PREVIEW_URL: EDR.Constants.APPLICATION_CONTEXT + "/document.do?action=preview",
		
		EMAIL_PREVIEW_DOM_ID: "email-preview",
		
		EMAIL_ID: "emailId"
	}

	EDR.attachment.Constants = {
		DOWNLOAD_URL: EDR.Constants.APPLICATION_CONTEXT + "/attachment.do?action=download"	
	}

	EDR.admin.Constants = {

		CASE_ID: "caseId",
		
		FLAG_NAME: "flagName",
		
		FLAG_DESC: "flagDesc"
		
	}
/* constants.jsp end */


/* email.jsp start */

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
//					dijit13.byId("resultsPerPage").destroy();			
				//},
				successCallback: function(response) {
					var m = dijit13.byId(EDR.prefix+"searchManager");
					m.processSearchResults(response);
				},
				elementToReplace: EDR.search.Constants.EMAIL_RESULTS_ELEMENT_ID,
				errorCallback: EDR.bean.Email.handleSearchError
			}
		);	
	
	},
	
	switchFilterBy: function(filterBy) {
		var docFilterValue = dijit13.byId(EDR.prefix+"horizontalSearchPanes").resultToolbar.filterBySelectBox.attr("value");
		var params = {doctypefilter: docFilterValue};
		dijit13.byId(EDR.prefix+"searchManager").submitQuickRefineSearch(params);
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
//					dijit13.byId("resultsPerPage").destroy();			
//				},
//				afterSetContentCallback:  function() {
//				}, 
				successCallback: function(response) {
					var m = dijit13.byId(EDR.prefix+"searchManager");
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
						var m = dijit13.byId(EDR.prefix+"searchManager");
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
				var m = dijit13.byId(EDR.prefix+"searchManager");
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
					dijit13.byId(EDR.prefix+"resultsPerPage").destroy();			
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
			resultsPerPage: dijit13.byId(EDR.prefix+"resultsPerPage").value
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
					dijit13.byId(EDR.prefix+"resultsPerPage").destroy();			
				},
				successCallback: function(response) {
					var m = dijit13.byId(EDR.prefix+"searchManager");
					m.processSearchResults(response);
				},
				elementToReplace: EDR.search.Constants.EMAIL_RESULTS_ELEMENT_ID,
				errorCallback: EDR.bean.Email.handleSearchError
			}
		);	
	},
	
	toolbarDisable: function(disable) {
	    g('emailSelectAll').disabled = disable;
	    
	    var resultsPerPage = dijit13.byId(EDR.prefix+"resultsPerPage");
	    if (resultsPerPage) resultsPerPage.setDisabled(disable);	
	    
	    var printResultsButton = dijit13.byId(EDR.prefix+"printResultsButton");
	    if (printResultsButton) printResultsButton.setDisabled(disable);	
	    
	    if (disable) {
		    dojo13.query("a[id^='results-']", dijit13.byId(EDR.prefix+"horizontalSearchPanes").resultToolbar.domNode).forEach(
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
			var dlg = dijit13.byId(EDR.prefix+EDR.email.Constants.EMAIL_PREVIEW_DOM_ID);
			EDR.dialog.util.setContent(dlg, response);	
			
			var previewTabContainer = dijit13.byId(EDR.prefix+"previewTabContainer");
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
		dijit13.byId(EDR.prefix+"horizontalSearchPanes").resultToolbar.expandResultsButton.setDisabled(true);
		dijit13.byId(EDR.prefix+"collapseResultsButton").setDisabled(false);
		
		dojo13.query(".results-document-details").forEach(function(div) {
			dojo13.style(div, "display", "block");
		});
	},
	
	// collapse each results (hide details)
	collapseResults: function() {
		EDR.bean.Email.showDetails = false;
		
		dijit13.byId(EDR.prefix+"horizontalSearchPanes").resultToolbar.expandResultsButton.setDisabled(false);
		dijit13.byId(EDR.prefix+"collapseResultsButton").setDisabled(true);
		
		dojo13.query(".results-document-details").forEach(function(div) {
			dojo13.style(div, "display", "none");
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
			var dlg = dijit13.byId('setEmailFlagsDialog');
			//dlg.setContent(response);
			EDR.dialog.util.setContent(dlg, response);
			g('setEmailFlagsError').style.display = "none";
			EDR.bean.Email.setFlagCheckboxesInitialize('setEmailFlags-', EDR.bean.Email.changedSetEmailFlagValue, 'setFlagsForm');
			EDR.dialog.util.show(dlg);  
			dijit13.byId('setEmailFlags-clearAll').adjustButtonWidth();
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
			var json = dojo13.fromJson(response);
			if (typeof(json) == 'object' && json.emailError != null && json.emailError != "") {
				g(EDR.prefix+'setEmailFlagsError').innerHTML = json.emailError;
				g(EDR.prefix+'setEmailFlagsError').style.display = "";
				EDR.dialog.util.showById(EDR.prefix+'setEmailFlagsDialog'); //re-centers the dialog
				
			} else {	
				EDR.bean.Email.closeSetEmailFlagsDialog();
				
				// Refresh preview screen in order to see the new flag values on it
        		var dlg = dijit13.byId(EDR.prefix+EDR.email.Constants.EMAIL_PREVIEW_DOM_ID);
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
        dijit13.byId(EDR.prefix+'setEmailFlags-clearAll').setDisabled(true);
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
        	dijit13.byId(EDR.prefix+'setEmailFlags-clearAll').setDisabled(true);
    	} else { // Show the "clear all" link
        	dijit13.byId(EDR.prefix+'setEmailFlags-clearAll').setDisabled(false);
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
			var json = dojo13.fromJson(response);
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
			var json = dojo13.fromJson(response);
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
			var json = dojo13.fromJson(response);
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
		var json = dojo13.fromJson(response);
		if(json.isDisabledError) {
			var str = json.error;
			if (json.detailedError != null) {
				str = str + "\n" + json.detailedError;
			}
			//var dialog = dijit13.byId(EDR.prefix+'caseDisabledDialog');
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
				json = dojo13.fromJson(response);
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
				
 				dojo13.parser.parse(tabId + 'Content'); // needed to display the widgets.Toolbar
 				
			} else {
				// Hide all tabs 
				EDR.util.Tabs.hideAll('previewTabs');
			
				// Show the newly created tab			
				EDR.util.Tabs.show(tabId);
				dojo13.parser.parse(tabId + 'Content'); // needed to display the widgets.Toolbar
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
/* email.jsp end */


/* portlet.jsp start */

EDR.portlet.Layout = {
	//dialogs over than 500px width
	toSmallDialogs: [EDR.prefix+"alert-dialog", EDR.prefix+"error-dialog", EDR.prefix+"preference", EDR.prefix+"multiSelectDlg", EDR.prefix+"myProfileDlg", EDR.prefix+"facetDialog", EDR.prefix+"previewDialog", EDR.prefix+"about-dialog", EDR.prefix+"documentLabelDialog"],
	
	toSmallLayout: function(){
		//adjust query area
		var searchPane = dijit13.byId(EDR.prefix+"searchPane");
		searchPane.queryArea.style.minWidth= "580px";
		searchPane.middleSpace.style.width = "390px";
		searchPane.leftSpace.style.display = "none";
		searchPane.helpLink.style.display = "none";
		searchPane.domNode.style.marginLeft = "10px";
		var header = dojo13.byId(EDR.prefix+"header");
		header.style.width = "560px";
		
		//adjuct banner
		dijit13.byId(EDR.prefix+"bannerId").productNameNode.style.display = "none";
		
		//advanced search tab
		var advSearchPane = dijit13.byId(EDR.prefix+"advancedSearchPane");
		advSearchPane.domNode.style.width="250px";
		
		//saved search tab
		var savedSearchTab = dijit13.byId(EDR.prefix+"savedSearch");
		savedSearchTab.contentWidth = 240;
		savedSearchTab.itemLabelWidth = 200;
		savedSearchTab.domNode.style.width="240px";
		
		//adjust tab width
		var slideTabContainer = dijit13.byId(EDR.prefix+"slideTabContainer");
		slideTabContainer.defaultTabWidth = 120;
		slideTabContainer.reduceWidth = 50;
		var tabs = slideTabContainer.getChildren();
		dojo13.forEach(tabs, function(tab) {
			tab.tabWidth = 120;
			tab.contentWidth = 270;
			tab.containerNode.style.overflow = "auto";
			tab.containerNode.style.position = "relative";
			tab.resizeTab();
		});

		//adjust toolbar width
		var resultToolbar = dijit13.byId(EDR.prefix+"horizontalSearchPanes").resultToolbar;
		resultToolbar.containerNode.style.overflow = "auto";
		resultToolbar.toolbarButtonNode.style.whiteSpace = "nowrap";
		resultToolbar.toolbarButtonNode.style.width = "100%";
		resultToolbar.resultCountDiv.style.width = "150px";
		var resultsFilterBy = resultToolbar.resultsFilterByDiv;
		resultsFilterBy.style.width = "200px";
		resultsFilterBy.parentNode.style.width = "80px";
		resultToolbar.resultsFilterByLabel.style.whiteSpace = "nowrap";
		var resultsPerPage = resultToolbar.resultsPerPageDiv;		
		resultsPerPage.style.width = "200px";
		resultsPerPage.parentNode.style.width = "80px";
		resultToolbar.resultsPerPageLabel.style.whiteSpace = "nowrap";
		if(dojo13.isIE <= 7){
			resultToolbar.containerNode.style.height = "65px";
		}

		//override in advanced search tab
		advSearchPane.toggleSearchOptions = function(evt) {
			if (this.showOption) {
				this.showOption = false;
				dojo13.style(this.leftPane, "width","250px");
				dojo13.style(this.leftPane.parentNode, "width","250px");
				this.advButton.attr("label", "<span style='position:relative;top:-4px;'>" + this.show_options +
					(this.isLeftToRight() ?
						"</span><img src='"+this.imageBaseDir+"move-left23.png' alt='' style='position:relative;top:-1px;'/>" :
						"</span><img src='"+this.imageBaseDir+"move-right23.png' alt='' style='position:relative;top:-1px;'/>")
				);
				dojo13.style(this.rightPane, "display", "none");
			} else {
				this.showOption = true;
				dojo13.style(this.leftPane, "width", "250px");
				dojo13.style(this.leftPane.parentNode, "width","580px");
				this.advButton.attr("label", "<span style='position:relative;top:-4px;'>" + this.hide_options + 
					(this.isLeftToRight() ?
						"</span><img src='"+this.imageBaseDir+"move-right23.png' alt='' style='position:relative;top:-1px;'/>" :
						"</span><img src='"+this.imageBaseDir+"move-left23.png' alt='' style='position:relative;top:-1px;'/>")
				);
				dojo13.style(this.rightPane, "display", "block");
				dijit13.byId(EDR.prefix+"advSearchOptions").domNode.focus();
			}
			this.slideTabContent.fitToContent(true);
		};
	}
};
/* portlet.jsp end */


