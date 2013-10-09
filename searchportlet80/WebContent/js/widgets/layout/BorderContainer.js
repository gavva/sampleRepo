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
dojo.provide("widgets.layout.BorderContainer");

dojo.require("dijit.layout.BorderContainer");

dojo.declare(
"widgets.layout.BorderContainer",
dijit.layout.BorderContainer,
{
	layout: function() {
		var parentNode = this.domNode.parentNode;
		var tablist = dojo.byId(EDR.prefix+"horizontalSearchPanes_tablist");
		
		var parentHeight = dojo.contentBox(parentNode).h;
		var tablistHeight = tablist?dojo.marginBox(tablist).h:0;
		var searchpane = dijit.byId(EDR.prefix+"horizontalSearchPanes");
		var toolbarHeight = 0;
		if(searchpane.resultToolbar){
			toolbarHeight = dojo.marginBox(searchpane.resultToolbar.domNode).h;
		}
		var bottomBarHeight = 0;
		if(searchpane.resultBottomBar){
			bottomBarHeight = dojo.marginBox(searchpane.resultBottomBar.domNode).h;
		}
		var height = parentHeight - tablistHeight - toolbarHeight - bottomBarHeight - 1;
		
		if(height < 0) {
			height = 0;
		}
		this.domNode.style.height = height + "px";
		
		this.inherited(arguments);
		
		var searchManager = dijit.byId(EDR.prefix+"searchManager");
		if(searchManager) {
			if (!searchManager.needNarrowResults())
				dojo.style(searchpane.centerContentPane.domNode,"left","0px");
		}
	},
	
	resize: function(){
		this.inherited(arguments);
		var resultsHeader = dijit.byId(EDR.prefix+"resultsHeader");
		var resultsBody = dojo.byId(EDR.prefix+"resultsBodyContainer");
		if((resultsHeader!=null)&&(resultsBody!=null)){
			var resultsHeaderHeight = dojo.marginBox(resultsHeader.domNode).h;
			var resultsPaneHeight = dojo.marginBox(dijit.byId(EDR.prefix+"horizontalSearchPanes").centerContentPane.domNode).h;
			dojo.marginBox(resultsBody,{h:(resultsPaneHeight-resultsHeaderHeight)});
		}
	}
});