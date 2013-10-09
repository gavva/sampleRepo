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
dojo.provide("widgets.ESTitlePane");

dojo.require("dijit.TitlePane");

dojo.declare(
	"widgets.ESTitlePane",
	[dijit.TitlePane],
	{
		imgBasePath: EDR.config.imageBaseDir,
		settingsPaneId: "",
		handlers: [],
		
		title_tooltip: "",
		icon_tooltip: "",
		icon_alt: "",
		
		postCreate: function() {
			this.handlers = [];
			this.inherited(arguments);
			this.modifyTemplate();
		},
		
		modifyTemplate: function() {
			this.titleNode.title = this.title_tooltip;
			var src = this.imgBasePath + "edit_display_srch_16.png";
			var a = dojo.create("A", {src:"javascript:;", tabindex:0, style:
				this.isLeftToRight() ? "position:absolute;right:8px;top:1px;" : "position:absolute;left:8px;top:1px;"
				}, this.titleBarNode)
			var img = dojo.create("IMG", {
				src:src,
				alt:this.icon_alt,
				title:this.icon_tooltip
			}, a);
			this.handlers.push(dojo.connect(a, "onclick", this, "onSettingsButtonClicked"));
			this.handlers.push(dojo.connect(a, "onkeypress", this, "onSettingsButtonClicked"));
		},
		
		onSettingsButtonClicked: function(evt) {
			if (evt.type != "click" && evt.keyCode != dojo.keys.ENTER && evt.charCode != dojo.keys.SPACE) return;
			
			var dlg = dijit.byId(EDR.prefix+"preference");
			if (dlg != null && this.settingsPaneId != null && this.settingsPaneId.length > 0) {
				dlg.showTab(this.settingsPaneId);
				EDR.dialog.util.show(dlg);
			}
			dojo.stopEvent(evt);
		},
		
		onOpenPane: function() {
			var singleChild = this.getChildren()[0];
			if (singleChild != null && singleChild.load != null) {
				singleChild.load();
			}
		},
		
		onClosePane: function() {
		},
		
		destroy: function() {
			dojo.forEach(this.handlers, dojo.disconnect);
			this.inherited("destroy", arguments);
		}
	}
);