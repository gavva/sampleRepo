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
dojo.provide("widgets.ESBorderContainer");
dojo.require("dijit.layout._LayoutWidget");

dojo.declare(
	"widgets.ESBorderContainer", [dijit.layout._LayoutWidget],	
	{
		postCreate: function(){
			this.inherited(arguments);
		},
		
		startup: function() {	
			this.queryContentPane = dijit.byId(EDR.prefix+"queryContentPane");
			this.contentPane = dijit.byId(EDR.prefix+"content");
			this.searchPane = dijit.byId(EDR.prefix+"searchPane");
			this.searchTabWindow = dijit.byId(EDR.prefix+"horizontalSearchPanes");
			this.headerHeight = dojo.marginBox(dojo.byId(EDR.prefix+"header")).h;
			this.slideTabContainer = dijit.byId(EDR.prefix+"slideTabContainer");
			this.body = dojo.body();
			this.inherited(arguments);
		},
		
		resize: function() {
			this.layout();
		},
		
		layout: function() {
			this.queryContentPane.resize();
			this.searchPane.resize();
			if (!this.searchPane.inAnimation) {
				var self = this;
				setTimeout(function() {
					if (!self.searchPane.inAnimation) {
						var queryHeight = dojo.marginBox(self.queryContentPane.domNode).h;
						if(!self.slideTabContainer.isOpen || EDR.isQueryAreaHidden){
							dojo.marginBox(self.contentPane.domNode, {h: dojo.marginBox(self.body).h - queryHeight - self.headerHeight - 9/*bottom*/});
							if (dojo.isIE) {
								self.body.style.overflow = "hidden";
							}
						}else if(dojo.isIE){
							self.body.style.overflow = "auto";
						}		
						dojo.marginBox(self.domNode, {h: dojo.marginBox(self.contentPane.domNode).h + queryHeight});
						self.searchTabWindow.resize();
					}
				}, 0);
			}
		},
		
		resizeCustomButtons: function() {
			// hack to avoid button layout problem in IE7.
			if (dojo.isIE <= 7) {
				dijit.registry.byClass("widgets.Button").forEach(function(widget){
					widget.adjustButtonWidth();
				});
			}
		}
	}
);
