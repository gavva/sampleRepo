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
dojo.provide("widgets.SlideTabContent");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dojo.fx");
dojo.require("dojox.fx");

dojo.declare(
	"widgets.SlideTabContent", [dijit._Widget, dijit._Templated],
	{			
		templatePath: dojo.moduleUrl("widgets", "templates/SlideTabContent.html"),
		
		tabWidth: 225,
		tabHeight: 30,
		tabContentHeight: 21/*tabHeight - 9*/,
		contentWidth: 380,
		contentHeight: 270,
		
		limitMinTabWidth: 25, 
		
		imgBasePath: EDR.config.imageBaseDir,
		iconPath: "loadsearch23.png",
		closeIconPath: "loadsearch23.png",
//		title: "",
		label: "",		
		animate: true,
		opened: false,
		handlers: [],
		
		postCreate: function() {
			this.inherited(arguments);
			dojo.marginBox(this.domNode, {w:this.tabWidth, h:this.tabHeight});
			this.handlers.push(dojo.connect(this.tabContainerNode, "onclick", this, "onTabClicked"));
		},
		
		startup: function() {
			this.inherited(arguments);
			this.iconImg.setAttribute("alt", this.label);
			this.fitToContent(false);
			if (this.isLeftToRight()) {
				dojo.style(this.tabIconSpan, "right", "0");
			} else {
				dojo.style(this.tabIconSpan, "left", "0");
				this.closeIconPath = "diagonal-up-arrow-reverse23.png";
			}
		},
		
		onTabClicked: function(evt) {
			this.opened ? this.close() : this.open();
		},
		
		beforeOpen: function(id, anim, contentWidth) {
			this.opened = true;
			dojo.style(this.containerNode, "visibility", "visible");
		},
		
		beforeClose: function(id, anim) {
			this.opened = false;
		},
		
		afterOpen: function(id, anim) {
			this.iconImg.src = this.imgBasePath + this.closeIconPath;
			this.titleNode.innerHTML = this.label;
			dojo.publish("afterSlideTabOpened", [{contentId:this.domNode.id}]);
		},
		
		afterClose: function(id, anim) {
			dojo.style(this.containerNode, "visibility", "hidden");
			this.iconImg.src = this.imgBasePath + this.iconPath;
			this.titleNode.innerHTML = this.label;
			dojo.publish("afterSlideTabClosed", [{contentId:this.domNode.id}]);
		},
		
		open: function() {
			if (this.animate) {
				var anim = this.wipeTo({w:this.contentWidth, h:this.contentHeight});
				this.beforeOpen(this.id, anim, this.contentWidth);
				
				var con = dojo.connect(anim, "onEnd", this, function() {
					this.afterOpen(this.id, anim);
					dojo.disconnect(con);
				});		
				anim.play();			
			} else {
				this.beforeOpen(this.id, null);	
				dojo.marginBox(this.domNode, {w:this.contentWidth, h:this.contentHeight});				
				this.afterOpen(this.id, null);
			}
		},
		
		fitToContent: function(show) {
			var singleChild = this.getChildren()[0];
			if (singleChild != null) {
				var size = dojo.marginBox(singleChild.domNode);
				this.contentWidth = size.w + 18;
				this.contentHeight = size.h + this.tabHeight;
			}
			if (show) this.open();
		},
		
		close: function() {						
			if (this.animate) {
				var anim = this.wipeTo({w:this.tabWidth, h:this.tabHeight});
				this.beforeClose(this.id, anim);	
						
				var con = dojo.connect(anim, "onEnd", this, function() {
					this.afterClose(this.id, anim);
					dojo.disconnect(con);
				});
				anim.play();			
			} else {
				this.beforeClose(this.id, anim);
				dojo.marginBox(this.domNode, {w:this.tabWidth, h:this.tabHeight});				
				this.afterClose(this.id, anim);
			}
		},
		
		setTitle: function(title) {
			this.titleNode.innerHTML = title;
		},
		
		wipeTo: function(size) {
			var anims = [];
	       	anims.push(dojox.fx.wipeTo({
                node: this.domNode,
                width: size.w
	        }));
	        anims.push(dojox.fx.wipeTo({
                node: this.domNode,
                height: size.h
	        }));
			return dojo.fx.combine(anims);
		},
		
		resizeTab: function(){
			var anim = this.wipeTo({w:this.tabWidth, h:this.tabHeight});
			if(this.tabWidth < 40){
				dojo.style(this.titleNode, "display", "none");
			} else {
				dojo.style(this.titleNode, "width", (this.tabWidth - 38) + "px");
				dojo.style(this.titleNode, "display", "block");
				dojo.style(this.iconImg, "display", "block");				
			}
			anim.play();
		}
	}
);