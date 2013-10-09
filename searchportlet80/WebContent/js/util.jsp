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
 * Static utility functions
 */
EDR.util = {
	isBrowserSupported: function() {
	   return (<es:dojo />.isIE == 7 || <es:dojo />.isFF >= 2);
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
			if (key && key == <es:dojo />.keys.ENTER) {
				<es:dojo />.stopEvent(event); 
				return fn();
			}
		}	
		return false;
	},
	
	// This method should be used in place of the standard javascript alert
	// to show a stylized alert dialog
	alert: function(alertString) {
	
		<es:dojo />.byId(EDR.prefix+'alert-message').innerHTML = alertString;
		EDR.dialog.util.showById(EDR.prefix+'alert-dialog');	
	
	},
	
	
	// This method should be used in place of the standard javascript confirm
	// to show a stylized confirmation dialog.  The second parameter is the function
	// to call if the user selects OK
	confirm: function(confirmString, confirmFunction) {
	
		<es:dojo />.byId(EDR.prefix+'confirmation-message').innerHTML = confirmString;
		var dlg = <es:dijit />.byId(EDR.prefix+'confirmation-dialog');
		var con = <es:dojo />.connect(dlg.okButtonNode, "onClick", this, function() {
			confirmFunction();
			EDR.dialog.util.hide(dlg);
			<es:dojo />.disconnect(con);
		}); 
		EDR.dialog.util.showById(EDR.prefix+'confirmation-dialog');

	},
	
	// Returns true if this is a keyboard event and the user pressed
	// the enter or spacebar, else returns false.  This is useful for making
	// onclick events keyboard accessible
	isEnterOrSpace: function(event) {
		if (event) {
			key = event.keyCode;
			if (key && (key == <es:dojo />.keys.ENTER || key == <es:dojo />.keys.SPACE)) {
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
		<es:dojo />.byId(id).style.cursor = 'hand';	
	},
	
	mouseOut: function(radioId, selected) {
		<es:dojo />.byId(id).style.cursor = 'pointer';	
	}
}
 	
 	
/**
 * Radio functions
 */
EDR.util.Radio = {

	mouseOver: function(radioId, selected) {
		radio = <es:dojo />.byId(radioId);
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
		if(<es:dojo />.locale == "en" || <es:dojo />.locale == "en-us")
			return "mm/dd/yyyy"; 
		return <es:dojo />.date.locale._getGregorianBundle(<es:dojo />.locale)["dateFormat-"+formatLength];		
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
		var dw = <es:dijit />.byId(domId);
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
		var parentContainer = <es:dijit />.byId(containerId);
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
		var parentContainer = <es:dijit />.byId(containerId);
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
		var parentContainer = <es:dijit />.byId(containerId);
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
		var parentContainer = <es:dijit />.byId(containerId);
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
	
		var tree = <es:dijit />.byId(treeId);
		<es:dojo />.forEach(tree.getChildren(), function(node) {
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
 
 <es:dojo />.extend(EDR.util.List, {
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
		            EDR.util.ResizableTable.displayArea = <es:dojo />.byId(displayAreaId);
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
   	<es:dojo />.publish("headerColumnsResized");
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
	    <es:dojo />.style(th, "width", columnWidth + "px");
	    
       // Resize all the data columns to the new width
       // Assumption: the header column has an attribute called resizeableColumnBodyPrefixID that is the column data prefix ID
		var resizeableColumnBodyPrefixID = columnHeader.getAttribute('resizeableColumnBodyPrefixID');
		if (resizeableColumnBodyPrefixID) {
			//TODO: implement later
			//<es:dojo />.query("." + resizableColumnBodyProfixID).style("width", width + "px");
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
		var parentWidth = <es:dojo />.contentBox(parent).w;
		<es:dojo />.contentBox(parent,{w:(parentWidth+changeInSize)});
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
