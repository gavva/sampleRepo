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
dojo.provide("widgets.Portlet");

dojo.require("dijit.layout.LayoutContainer");
dojo.require("dijit._Templated");

dojo.declare(
	"widgets.Portlet",
	[dijit.layout.LayoutContainer, dijit._Templated],
	{
		
		widgetsInTemplate: true,			
		
		showButtonBar: false,
		
		"class": "portlet",
				
		templateString: null,
		
		templatePath: dojo.moduleUrl("widgets", "templates/Portlet.html"),
		
		collapsable: false,
			
		layout: function() {
			var footer = (this.showButtonBar ? this.buttonBarNode : this.footerNode);
			
			var children = [
				{domNode: this.headerNode, layoutAlign: "top"},
				{domNode: this.containerNode, layoutAlign: "client"},				
				{domNode: footer, layoutAlign: "bottom"}
			];
			dijit.layout.layoutChildren(this.domNode, this._contentBox, children);
		},
		
		postCreate: function() {
			this.inherited("postCreate", arguments);
			
			// Show the min/max buttons?
			if (this.collapsable) {
				this.collapsableNode.style.display = "block";				
			}
			
			// Show button bar?
			if (this.showButtonBar) {
				this.buttonBarNode.style.display = "block";
				this.footerNode.style.display = "none";
			} else {
				this.buttonBarNode.style.display = "none";
				this.footerNode.style.display = "block";			
			}
		},
		
		minimize: function() {
			EDR.util.dojo.minimize(this.domNode.id);
		},
		
		maximize: function() {
			EDR.util.dojo.maximize(this.domNode.id);
		},
		
		setTitle: function(/*String*/ title){
			this.titleNode.title = title;
			this.titleTextNode.innerHTML = title;			
		},
		
		_fillContent: function(source){
			// summary:
			//		relocate source contents to templated container node
			//		this.containerNode must be able to receive children, or exceptions will be thrown
			var dest = this.containerNode;
			
			var buttons = this.buttonNode;
			
			if(source && dest){
				while(source.hasChildNodes()){
					var child = source.firstChild;
					
					// Look for a node to include in the button bar
					if (this.showButtonBar) {
						
					}
					
					//dojo.query("div@includeContentsInButtonBar=true");
					
					/*
					alert(child.id);
					if (this.showButtonBar && 
						child.getAttribute && 
						child.getAttribute("includeContentsInButtonBar")) {
						alert("node type: " + child.type);
					}*/
					
					/*
					if (child.type == 'submit' && this.showButtonBar) {
						alert(child.getAttribute("includeInButtonBar"));
						buttons.insertBefore(child, this.cancelButton);
					} else {
						dest.appendChild(child);
					}*/
					
					dest.appendChild(child);
				}
			}
		}
		
	}
);