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
dojo.provide("widgets.QueryTabWindow");

dojo.require("widgets.TabWindow");
dojo.require("dijit.form.TextBox");

dojo.declare(
	"widgets.QueryTabWindow",
	[widgets.TabWindow],	
	{
		_controllerWidget: "widgets.QueryTabWindowController",
		
		minHeight: 32,
		defaultHeight: 95,
		
		postCreate: function(){
			this.inherited(arguments);
		},
		
		layout: function() {
			this.inherited(arguments);
			this.tablist.layout();
		},
		
		setViewModeSimple: function() {
			dojo.style(this.containerNode, "display", "none");
			this.tablist.setViewMode("simple");
		},
		
		setViewModeNormal: function() {
			dojo.style(this.containerNode, "display", "block");
			this.tablist.setViewMode("normal");
		}
	}
);

dojo.declare(
	"widgets.QueryTabWindowController",
	[widgets.TabWindowController],
	{
		viewMode: "normal", // "simple" or "normal"
		simpleSearchInput: null,
		simpleSearchButton: null,
		
		refreshImgPath: "images/refresh23.png",
		loadSearchImgPath: "images/loadsearch23.png",
		saveSearchImgPath: "images/save23.png",
		animations: [],
		handlers: [],

		onSerchBtnClicked: function(evt) {
			if (evt.type == "click" || evt.keyCode == dojo.keys.ENTER){
				var keywords = this.simpleSearchInput.textbox.value;
				if (keywords != null && keywords != "") {
					var params = {
						keywords: this.simpleSearchInput.textbox.value,
						basicKeywords: this.simpleSearchInput.textbox.value
					};
					dijit.byId(EDR.prefix+"searchManager").submitSearch(dijit.byId(EDR.prefix+"basicSearchPane"), "search", params);
				}
			}
		},
		
		setViewMode: function(mode) {
			if (this.viewMode == mode) return;
			if (mode == "simple") {
				for(var pane in this.pane2button) {
					dojo.style(this.pane2button[pane].domNode, "display", "none");
				}
				dojo.style(this.simpleSearchInput.domNode, "display", "block");
				dojo.style(this.simpleSearchButton.domNode, "display", "block");
				this.simpleSearchInput.textbox.value = "";
			} else {
				for(var pane in this.pane2button) {
					dojo.style(this.pane2button[pane].domNode, "display", "block");
				}
				dojo.style(this.simpleSearchInput.domNode, "display", "none");
				dojo.style(this.simpleSearchButton.domNode, "display", "none");
			}
			this.viewMode = mode;
		},		
		
		buildToolbar: function(parent) {
			// simple query text
			var input = dojo.doc.createElement("INPUT");
			this.simpleSearchInput = new dijit.form.TextBox( {
				id: EDR.prefix+"itt",
				trim: true
			}, input);
			dojo.style(this.simpleSearchInput.domNode, "height", 19);
			dojo.style(this.simpleSearchInput.domNode, "display", "none");
			dojo.style(this.simpleSearchInput.domNode, "float", this.isLeftToRight() ? "left" : "right");
			
			// simple search button
			var button = dojo.doc.createElement("INPUT");
			this.simpleSearchButton = new widgets.Button( {
				label: EDR.messages.button_search
			}, input);
			dojo.style(this.simpleSearchButton.domNode, "display", "none");
			dojo.style(this.simpleSearchButton.domNode, "position", "relative");
			dojo.style(this.simpleSearchButton.domNode, "top", "-3px");
			dojo.style(this.simpleSearchButton.domNode, "float", this.isLeftToRight() ? "left" : "right");
			this.handlers.push(dojo.connect(this.simpleSearchButton, "onClick", this, "onSerchBtnClicked"));			
			this.handlers.push(dojo.connect(this.simpleSearchInput.textbox, "onkeypress", this, "onSerchBtnClicked"));			
			
			dojo.style(parent, "overflow", "visible"); // to enalbe FishEye
			var refreshImg = this.buildImg(this.refreshImgPath, "refresh");
			var loadSearchImg = this.buildImg(this.loadSearchImgPath, "loadSearch");
			var saveSearchImg = this.buildImg(this.saveSearchImgPath, "saveSearch");
			
			if (this.isLeftToRight()) {
				parent.appendChild(this.simpleSearchInput.domNode);
				parent.appendChild(this.simpleSearchButton.domNode);
				parent.appendChild(saveSearchImg);
				parent.appendChild(loadSearchImg);
				parent.appendChild(refreshImg);
				saveSearchImg.style.marginRight = "15px";
			} else {
				parent.appendChild(refreshImg);
				parent.appendChild(loadSearchImg);
				parent.appendChild(saveSearchImg);
				parent.appendChild(this.simpleSearchButton.domNode);
				parent.appendChild(this.simpleSearchInput.domNode);
				saveSearchImg.style.marginLeft = "15px";
			}
		},
		
		layout: function() {
			var contentBox = dojo.contentBox(this.domNode);
			dojo.style(this.simpleSearchInput.domNode, "width", contentBox.w - 250);
		},
		
		refresh: function(evt) {
			alert("refresh");
		},
		
		loadSearch: function(evt) {
			alert("loadSearch");
		},
		
		saveSearch: function(evt) {
			alert("saveSearch");
		},
				
		buildImg: function(imgPath, eventHandlerName) {
			var img = dojo.doc.createElement("IMG");
			img.width = "23";
			img.height = "23";
			img.src = imgPath;
			dojo.style(img, "z-index", 20);
			dojo.style(img, "float", this.isLeftToRight() ? "right" : "left");
			var margin = this.isLeftToRight() ? "0px 0px 2px 10px" : "0px 10px 2px 0px";
			dojo.style(img, "margin", margin);
			this.handlers.push(dojo.connect(img, "onclick", this, eventHandlerName));
			var anim = new dojox.widget.FisheyeLite({
				properties: {
					height:1.4,
					width:1.4
				}
			},img);
			return img;			
		},
		
		destroy: function() {
			dojo.forEach(this.handlers, dojo.disconnect);
			this.inherited("destroy", arguments);
		}		
	}
);

