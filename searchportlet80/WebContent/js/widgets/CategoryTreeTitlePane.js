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
dojo.provide("widgets.CategoryTreeTitlePane");

dojo.require("dijit.TitlePane");
dojo.require("dojox.form.DropDownSelect");

dojo.declare(
	"widgets.CategoryTreeTitlePane",
	[dijit.TitlePane],
	{
		imgBasePath: EDR.config.imageBaseDir,
		settingsPaneId: "",
		sortWidget: null,
		handlers: [],
		
		title_tooltip: "",
		icon_tooltip: "",
		icon_alt: "",
		
		postCreate: function() {
			this.inherited(arguments);
			this.modifyTemplate();
		},
		
		startup: function() {
			this.inherited(arguments);
			var categoryTree = dijit.byId(EDR.prefix+"categoryTree");
			this.handlers.push(dojo.connect(this.sortWidget, "onChange", categoryTree, categoryTree.onSortOrderChanged));
		},
		
		resize: function() {
			this.inherited(arguments);
			this.layout();
		},
			
		layout: function() {
			var labelWidth = dojo.marginBox(this.titleNode).w;
			var sortWidth = dojo.marginBox(this.sortWidget.domNode).w;
			var width = dojo.contentBox(this.titleBarNode).w - (labelWidth + sortWidth);
			if (width < 0) {				
				dojo.style(this.titleNode, "position", dojo.isIE <= 7 ? "absolute" : "relative");
				dojo.style(this.titleNode, "top", "-3000px");
			} else {
				dojo.style(this.titleNode, "position", dojo.isIE <= 7 ? "absolute" : "relative");
				dojo.style(this.titleNode, "top", dojo.isIE <= 7 ? "3px" : "0px");
			}
		},
		
		modifyTemplate: function() {
			var label = dojo.create("LABEL", {innerHTML:"", style:"display:none;", "for":"sortCategory"}, this.titleBarNode);
			var sortDiv = dojo.create("DIV", {}, this.titleBarNode);			
			var sortWidget = new dojox.form.DropDownSelect({
					id:"sortCategory", options:[],
					title:EDR.messages.analytics_categorytree_sort_tooltip,
				 	style: this.isLeftToRight() ? "position:absolute;top:0px;right:3px;" : "position:absolute;top:0px;left:3px;"
			}, sortDiv);
			
			var td = sortWidget.containerNode.parentNode;
			var labelContainer = dojo.create("DIV", {
				style:"overflow:hidden;float:right;max-width:100px;"
			}, td);
			labelContainer.appendChild(td.firstChild);
			labelContainer.appendChild(td.firstChild);
			labelContainer.appendChild(td.firstChild);
			if (dojo.isIE <= 7) { // hack for IE. Why style is not applied by dojo.create only in IE7...
				dojo.style(labelContainer, "overflow", "hidden");
				dojo.style(labelContainer, "float", "right");
				dojo.style(labelContainer, "maxWidth", "100px");				
			}
			
			dojo.forEach(sortWidget.domNode.getElementsByTagName("TD"), function(td) {
				dojo.style(td, "border", "none");
				dojo.style(td, "background", "none");
				dojo.style(td, "paddingLeft", "0px");
				dojo.style(td, "paddingRight", "0px");
			});
			sortWidget.addOption({value: "none", label: EDR.messages.analytics_categorytree_sort_none});
			sortWidget.addOption({value: "ascending", label: EDR.messages.analytics_categorytree_sort_ascending});
			sortWidget.addOption({value: "descending", label: EDR.messages.analytics_categorytree_sort_descending});
			this.sortWidget = sortWidget;
			this.titleNode.title = this.title_tooltip;
			var src = this.imgBasePath + "edit_display_srch_16.png";
			dojo.style(this.arrowNode, "display", "none");
		},
		
		destroy: function() {
			dojo.forEach(this.handlers, dojo.disconnect);
			this.inherited("destroy", arguments);
		}
	}
);