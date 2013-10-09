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
dojo.provide("widgets.customize.Popup");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");

dojo.declare(
"widgets.customize.Popup",
[dijit._Widget, dijit._Templated],
{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl("widgets.customize", "templates/Popup.html"),
	
	messages_customizer_popup_label: EDR.messages.customizer_popup_label,
	messages_customizer_popup_button_open: EDR.messages.customizer_popup_button_open,
	messages_customizer_popup_button_revert: EDR.messages.customizer_popup_button_revert,
	customizer_popup_button_save: EDR.messages.customizer_popup_button_save,
	customizer_popup_button_exit: EDR.messages.customizer_popup_button_exit,
	
	postCreate: function() {
		this.inherited(arguments);
		if(this.isLeftToRight()) {
			dojo.addClass(this.domNode, "widgetsLtr");
		}
	},	
	
	isLeftToRight: function() {
		var dir = this.attr("dir");
		if(dir) {
			return dir == "ltr";
		} else {
			return dojo._isBodyLtr();	
		}
	},
	
	onOpenClick: function(evt) {
		EDR.dialog.util.showById(EDR.prefix+"searchCustomizer");
		return false;
	},
	
	onRevertClick: function(evt) {
		window.location.reload();
	},
	
	onCancelClick: function(evt) {
//		window.location = "logout.jsp";
		window.close();
	},
	
	onSaveClick: function(evt) {
		var saveButton = this.saveButton;
		var manager = dijit.byId(EDR.prefix+"searchCustomizerWindow");
		
		saveButton.setDisabled(true);
		manager.saveConfig(dojo.hitch(this, "_onSaveComplete"));
	},
	
	_onSaveComplete: function() {
		this.saveButton.setDisabled(false);
	},
	
	__dummy__: ''
});
		