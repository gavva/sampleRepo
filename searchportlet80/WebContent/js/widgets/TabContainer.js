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
dojo.provide("widgets.TabContainer");

dojo.require("dijit.layout.TabContainer");

dojo.declare(
	"widgets.TabContainer",
	[dijit.layout.TabContainer],	
	{
		_controllerWidget: "widgets.TabController",
		transitioning: true,
		activeTabId: "",
		showIcon: false,
		
		postCreate: function() {
			this.inherited(arguments);
			this.modifyTemplate();
			if(this.isLeftToRight()) {
				dojo.addClass(this.domNode, "widgetsLtr");
			}
		},
		
		isLeftToRight: function() {
			var dir = this.attr("dir");
			if(dir) {
				return dir == "ltr";
			} else {
				return dojo._isBodyLtr();	
			}
		},
		
		_transition: function(newWidget, oldWidget) {
			this.transitioning = true;
			this.inherited(arguments);
			this.transitioning = false;
		},
		
		_showChild: function(page) {
			if (!this.transitioning) return;			
			this.activeTabId = page.id;
			this.inherited(arguments);
			if (page.onTabShow) page.onTabShow();
			var button = this.tablist.pane2button[page];
			if (button != null && dojo.hasClass(button.innerDiv, "tabInactiveMiddle"))
				this.toggleTabStyle(button);
		},
		
		_hideChild: function(page) {			
			this.inherited(arguments);
			
			if (!this.transitioning) return;
			if (page.onTabHide) page.onTabHide();
			var button = this.tablist.pane2button[page];
			if (button != null && dojo.hasClass(button.innerDiv, "tabActiveMiddle"))
				this.toggleTabStyle(button);
		},
		
		toggleTabStyle: function(button) {
			if (button == null) return;
			dojo.toggleClass(button.leftEdgeOfInnerDiv, "tabInactiveLeft");
			dojo.toggleClass(button.rightEdgeOfInnerDiv, "tabInactiveRight");
			dojo.toggleClass(button.innerDiv, "tabInactiveMiddle");			
			dojo.toggleClass(button.leftEdgeOfInnerDiv, "tabActiveLeft");
			dojo.toggleClass(button.rightEdgeOfInnerDiv, "tabActiveRight");
			dojo.toggleClass(button.innerDiv, "tabActiveMiddle");			
			button.toggleIcon();
		},
				
		modifyTemplate: function() {
			dojo.style(this.containerNode, "borderLeft", "1px solid #CCCCCC");
			dojo.style(this.containerNode, "borderRight", "1px solid #CCCCCC");
		}
	}
);

dojo.declare(
	"widgets.TabController",
	[dijit.layout.TabController],
	{
		buttonWidget: "widgets._TabButton",
		
		postCreate: function() {
			this.inherited(arguments);
			this.modifyTemplate();
		},
		
		onAddChild: function(page, insertIndex){
			this.inherited(arguments);		
			this.pane2button[page].setIcons(
				page.activeIconPath,
				page.inactiveIconPath
			);
		},
		
		modifyTemplate: function() {
			this.domNode.style.paddingLeft = "5px";
		}
	}
);

dojo.declare(
	"widgets._TabButton",
	[dijit.layout._TabButton],
	{
		leftEdgeOfInnerDiv: null,
		rightEdgeOfInnerDiv: null,
		tabIcon: null,
		activeIconPath: null,	// assume 16x16 size
		inactiveIconPath: null, // assume 16x16 size
		
		postCreate: function() {
			this.inherited(arguments);
			this.showIcon = EDR.isTextAnalyticsEnabled;
			this.modifyTemplate();
		},
		
		setIcons: function(activeIconPath, inactiveIconPath) {
			if (!this.showIcon) return;
			//for IE to avoid blank IMG tag
			if(activeIconPath==undefined&&inactiveIconPath==undefined){
				dojo.style(this.tabIcon,"visibility","hidden");
				dojo.style(this.tabIcon,"width","0px");
				dojo.style(this.tabIcon,"height","0px");
			}else{
				this.activeIconPath = activeIconPath;
				this.inactiveIconPath = inactiveIconPath;
				this.tabIcon.src = this.activeIconPath;
			}
		},
		
		toggleIcon: function() {
			if (!this.showIcon) return;
			
			if (this.tabIcon.src == this.activeIconPath) {
				if (this.inactiveIconPath != null && this.inactiveIconPath != "")
					this.tabIcon.src = this.inactiveIconPath;
			}
			else if (this.tabIcon.src == this.inactiveIconPath) {
				if (this.activeIconPath != null && this.activeIconPath != "")
					this.tabIcon.src = this.activeIconPath;
			}
		},
		
		modifyTemplate: function() {
			dojo.addClass(this.domNode, "tabInactive");
			this.leftEdgeOfInnerDiv = dojo.doc.createElement("DIV");
			dojo.addClass(this.leftEdgeOfInnerDiv, "tabInactiveLeft");
			this.rightEdgeOfInnerDiv = dojo.doc.createElement("DIV");
			dojo.addClass(this.rightEdgeOfInnerDiv, "tabInactiveRight");
			dojo.addClass(this.innerDiv, "tabInactiveMiddle");
			
			this.domNode.insertBefore(this.leftEdgeOfInnerDiv, this.innerDiv);
			this.domNode.appendChild(this.rightEdgeOfInnerDiv);
			if (this.showIcon) {			
				this.tabIcon = dojo.doc.createElement("IMG");
				this.tabIcon.setAttribute("alt", "");
				dojo.addClass(this.tabIcon, "tabIcon");
				this.tabContent.insertBefore(this.tabIcon, this.tabContent.firstChild);
			}			
		}
	}
);

