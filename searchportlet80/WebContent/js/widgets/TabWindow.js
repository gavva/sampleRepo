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
dojo.provide("widgets.TabWindow");
dojo.require("widgets.TabContainer");

dojo.declare(
	"widgets.TabWindow",
	[widgets.TabContainer],	
	{
		_controllerWidget: "widgets.TabWindowController",
		
		leftBottomEdgeWindowDiv: null,
		rightBottomEdgeWindowDiv: null,
		middleBottomEdgeWindowDiv: null,
		
		postCreate: function(){
			this.inherited(arguments);
			if (!this.isLeftToRight()) {
				dojo.removeClass(this.leftBottomEdgeWindowDiv, "tabWindowBottomLeft");
				dojo.addClass(this.leftBottomEdgeWindowDiv, "tabWindowBottomLeft_rtl");
				dojo.removeClass(this.rightBottomEdgeWindowDiv, "tabWindowBottomRight");
				dojo.addClass(this.rightBottomEdgeWindowDiv, "tabWindowBottomRight_rtl");
			}
		},
		
		startup: function() {
			this.inherited(arguments);
			this.isSingleTab = this.getChildren().length == 1;
			if (this.isSingleTab) {
				dojo.style(this.tablist.domNode, "display", "none");
				dojo.style(this.tablist.leftEdgeWindowDiv, "display", "none");
				dojo.style(this.tablist.rightEdgeWindowDiv, "display", "none");
				dojo.style(this.leftBottomEdgeWindowDiv, "display", "none");
				dojo.style(this.rightBottomEdgeWindowDiv, "display", "none");
				dojo.style(this.middleBottomEdgeWindowDiv, "display", "none");				

			}
		},
		
		modifyTemplate: function() {
			this.inherited(arguments);
			
			this.leftBottomEdgeWindowDiv = dojo.doc.createElement("DIV");
			dojo.addClass(this.leftBottomEdgeWindowDiv, "tabWindowBottomLeft");
			this.rightBottomEdgeWindowDiv = dojo.doc.createElement("DIV");
			dojo.addClass(this.rightBottomEdgeWindowDiv, "tabWindowBottomRight");
			this.middleBottomEdgeWindowDiv = dojo.doc.createElement("DIV");
			dojo.addClass(this.middleBottomEdgeWindowDiv, "tabWindowBottomMiddle");			
			
			this.domNode.appendChild(this.leftBottomEdgeWindowDiv);
			this.domNode.appendChild(this.middleBottomEdgeWindowDiv);
			this.domNode.appendChild(this.rightBottomEdgeWindowDiv);
		},
		
		layout: function() {
			this._contentBox.h -= 4;
			this.inherited(arguments);

			var controller = this.tablist;			
			var header = controller.domNode;
			var container = this.containerNode;
			
			var width = parseInt(header.style.width);
			header.style.left = "3px";
			header.style.width = (width - 6) + "px";
			controller.rightEdgeWindowDiv.style.left = (width - 3) + "px";

//			var height = parseInt(container.style.height) - 4;			
//			container.style.height =  height + "px";
			this.middleBottomEdgeWindowDiv.style.width = (width - 6) + "px";
		}		
	}
);

dojo.declare(
	"widgets.TabWindowController",
	[widgets.TabController],
	{
		leftEdgeWindowDiv: null,
		rightEdgeWindowDiv: null,
		
		modifyTemplate: function() {
			this.inherited(arguments);
			this.domNode.style.paddingLeft = "0px";
			
			this.leftEdgeWindowDiv = dojo.doc.createElement("DIV");
			dojo.addClass(this.leftEdgeWindowDiv, "tabWindowLeft");
			this.rightEdgeWindowDiv = dojo.doc.createElement("DIV");
			dojo.addClass(this.rightEdgeWindowDiv, "tabWindowRight");
			dojo.addClass(this.domNode, "tabWindowMiddle");
			
			this.buildToolbar(this.domNode);

			var parent = this.domNode.parentNode;
			parent.appendChild(this.rightEdgeWindowDiv);
			parent.insertBefore(this.leftEdgeWindowDiv, this.domNode);
		},
		
		buildToolbar: function(parent) {
		}
	}
);

