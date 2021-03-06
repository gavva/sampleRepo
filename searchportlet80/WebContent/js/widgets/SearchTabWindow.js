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
dojo.provide("widgets.SearchTabWindow");

dojo.require("widgets.TabWindow");
dojo.require("dijit.form.TextBox");

dojo.declare(
	"widgets.SearchTabWindow",
	[widgets.TabWindow],	
	{
		_controllerWidget: "widgets.SearchTabWindowController",
		isSingleTab: false,
		
		postCreate: function(){
			this.inherited(arguments);
		}
	}
);

dojo.declare(
	"widgets.SearchTabWindowController",
	[widgets.TabWindowController],
	{
		maximizeImgPath: "images/size_max.png",		
		normalImgPath: "images/size_normal.png",
		showSearchPaneImgPath: "images/show_search.png",		
		hideSearchPaneImgPath: "images/hide_search.png",	
		showHiedePaneTrigerImg: null,
		sizeChangeTrigerImg: null,
		handlers: [],

		buildToolbar: function(parent) {
/*			dojo.style(parent, "overflow", "visible"); // to enalbe FishEye
			this.showHiedePaneTrigerImg = this.buildImg(this.hideSearchPaneImgPath, "showHideSearchPane");
			this.sizeChangeTrigerImg = this.buildImg(this.normalImgPath, "showHideSearchQueryPane");
			
			if (this.isLeftToRight()) {
				parent.appendChild(this.sizeChangeTrigerImg);
				parent.appendChild(this.showHiedePaneTrigerImg);
				this.sizeChangeTrigerImg.style.marginRight = "15px";
			} else {
				parent.appendChild(this.showHiedePaneTrigerImg);
				parent.appendChild(this.sizeChangeTrigerImg);
				this.showHiedePaneTrigerImg.style.marginLeft = "15px";
			} */
		},
		
		layout: function() {
			var contentBox = dojo.contentBox(this.domNode);
			dojo.style(this.simpleSearchInput.domNode, "width", contentBox.w - 250);
		},
		
		showHideSearchPane: function(evt) {
			var layoutManager = dijit.byId(EDR.prefix+"tabSearchContent");
			if (this.showHiedePaneTrigerImg.src == this.showSearchPaneImgPath) {
				layoutManager.showSearchPane();
				this.showHiedePaneTrigerImg.src = this.hideSearchPaneImgPath;
			} else {
				layoutManager.hideSearchPane();
				this.showHiedePaneTrigerImg.src = this.showSearchPaneImgPath;
			}
			this.reconnect();
		},
		
		showHideSearchQueryPane: function(evt) {
			var layoutManager = dijit.byId(EDR.prefix+"tabSearchContent");
			if (this.sizeChangeTrigerImg.src == this.maximizeImgPath) {
				layoutManager.maximizeSearchResultPane();
				this.sizeChangeTrigerImg.src = this.normalImgPath;
			} else {
				layoutManager.maximizeSearchQueryPane();
				this.sizeChangeTrigerImg.src = this.maximizeImgPath;
			}
			this.reconnect();
		},
		
		reconnect: function() {
			dojo.forEach(this.handlers, dojo.disconnect);
			this.handlers.push(dojo.connect(this.showHiedePaneTrigerImg, "onclick", this, "showHideSearchPane"));						
			this.handlers.push(dojo.connect(this.sizeChangeTrigerImg, "onclick", this, "showHideSearchQueryPane"));						
		},
		
		buildImg: function(imgPath, eventHandlerName) {
			var img = dojo.doc.createElement("IMG");
			img.width = "16";
			img.height = "16";
			img.src = imgPath;
			dojo.style(img, "float", this.isLeftToRight() ? "right" : "left");
			var margin = this.isLeftToRight() ? "0px 0px 2px 10px" : "0px 10px 2px 0px";
			dojo.style(img, "margin", margin);
			this.handlers.push(dojo.connect(img, "onclick", this, eventHandlerName));
/*			var anim = new dojox.widget.FisheyeLite({
				properties: {
					height:1.6,
					width:1.6
				}
			},img);*/
			return img;			
		},
		
		destroy: function() {
			dojo.forEach(this.handlers, dojo.disconnect);
			this.inherited("destroy", arguments);
		}		
	}
);

