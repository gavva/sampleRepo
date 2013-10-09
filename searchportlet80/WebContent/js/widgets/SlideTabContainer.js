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
dojo.provide("widgets.SlideTabContainer");

dojo.require("dijit.layout._LayoutWidget");
dojo.require("widgets.SlideTabContent");
dojo.require("dojo.fx");
dojo.require("dojox.fx");

dojo.declare(
	"widgets.SlideTabContainer", [dijit.layout._LayoutWidget],
	{			
		templatePath: dojo.moduleUrl("widgets", "templates/SlideTabContainer.html"),
		
		handlers: [],
		id2panes: {},
		currentPane: null,
		defaultTabWidth: 225,
		reduceWidth: 16,
		numOfChild: 0,
		isOpen: false,
		
		postCreate: function() {
			this.inherited(arguments);
		},
				
		startup: function() {
			this.inherited(arguments);
			
			var children = this.getChildren();
			var self = this;
			dojo.forEach(children, function(pane) {
				self.handlers.push(dojo.connect(pane, "beforeOpen", self, "beforeOpen"));
				self.handlers.push(dojo.connect(pane, "afterOpen", self, "afterOpen"));
				self.handlers.push(dojo.connect(pane, "beforeClose", self, "beforeClose"));
				self.handlers.push(dojo.connect(pane, "afterClose", self, "afterClose"));
				self.id2panes[pane.id] = pane;
				self.numOfChild++;
			});
		},
		
		resize: function() {
			var children = this.getChildren();
			var maxHeight = 1;
			dojo.forEach(children, function(pane) {
				maxHeight = Math.max(maxHeight, dojo.marginBox(pane.domNode).h);
				if (pane.domNode.offsetTop != 0) {
					dojo.style(pane.domNode, "visibility", "hidden");
				} else if (pane.domNode.style.visibility == "hidden") {
					dojo.style(pane.domNode, "visibility", "visible");
				}
			});
			dojo.style(this.domNode, "height", maxHeight + "px");
		},
		
		onTabAnimate: function() {
		},
		
		beforeOpen: function(id, anim, contentWidth) {
			this.opening = true;
			
			var needResize = this.currentPane == null;
			if (this.currentPane != null && id != this.currentPane.id) {
				this.currentPane.close();
			}
			this.currentPane = this.id2panes[id];
			
			if (needResize && anim != null) {
				var cons = [];
				cons.push(dojo.connect(anim, "onAnimate", this, "onTabAnimate"));
				cons.push(dojo.connect(anim, "onEnd", this, function() {
					dojo.forEach(cons, function(con) {
						dojo.disconnect(con);
					});
				}));
			}

			var children = this.id2panes;
			var self = this;
			var tabWidth = 170;
			var availableWidth = dojo.contentBox(this.containerNode).w;
			var allTabWidth = (this.numOfChild - 1) * this.defaultTabWidth + contentWidth;
			if ((availableWidth - allTabWidth) < this.reduceWidth) {
				tabWidth = (availableWidth - contentWidth - this.reduceWidth) / (this.numOfChild - 1);
			}
			
			if(needResize && EDR.isTextAnalyticsEnabled) {
				widgets.analytics.hideAnalyticsPane();
			}
			
			for(var childId in children){
				if(self.currentPane.id != childId){
					dojo.attr(children[childId], "tabWidth", tabWidth);
					children[childId].resizeTab();
				}
			}
		},
				
		beforeClose: function(id, anim) {
			var children = this.id2panes;
			var self = this;
			for(var id in children){
				if(self.currentPane.id!=id){
					dojo.attr(children[id],"tabWidth",self.defaultTabWidth);
					children[id].resizeTab();
				}
			}
			if (this.opening) return;			
			this.currentPane = null;
			
			if(EDR.isTextAnalyticsEnabled) {
				widgets.analytics.hideAnalyticsPane();
			}
			if (anim != null) {
				var cons = [];
				cons.push(dojo.connect(anim, "onAnimate", this, "onTabAnimate"));
				cons.push(dojo.connect(anim, "onEnd", this, function() {
					dojo.forEach(cons, function(con) {
						dojo.disconnect(con);
					});
				}));
			}
			
			if(dojo.isIE <= 7){
				dijit.byId(EDR.prefix+"horizontalSearchPanes").resultsBodyContainer.layout();
			}
			
		},
		
		afterOpen: function(id, anim) {
			this.opening = false;
			this.isOpen = true;
			if(EDR.isTextAnalyticsEnabled) {
				widgets.analytics.showAnalyticsPane();
			}
		},
		
		afterClose: function(id, anim) {
			if (this.opening) return;
			this.isOpen = false;
			if(EDR.isTextAnalyticsEnabled) {
				widgets.analytics.showAnalyticsPane();
			}
		}
	}
);