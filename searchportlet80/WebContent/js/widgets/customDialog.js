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
dojo.provide("widgets.customDialog");

dojo.require("dijit.Dialog");
dojo.require("widgets.Button");
dojo.require("widgets.Moveable");

/*
 * This class was created so that we could have a common look-and-feel
 * for all dialogs in the product.  This should be used instead of 
 * dijit.Dialog.  It also adds a property to the standard dijit.Dialog
 * class called isClosable.  Setting this property to false when the 
 * dialog is declared in HTML will prevent the close button from appearing
 * in the title bar.
 */
dojo.declare(
	"widgets.customDialog",
	dijit.Dialog,
	{		
		templateString: null,		
		templatePath: dojo.moduleUrl("widgets", "templates/customDialog.html"),		
		widgetsInTemplate: true,
		imgBasePath: EDR.config.imageBaseDir,
		
		closable: true,		
		
		// ID of the element that should receive focus on open
		showCancel: true,		
		showOk: true,
		showCustom: false,
		showCustom2: false,
		showButtonBar: true,
		
//		firstFocusId: "",				

		cancelButtonLabel: "",
//		cancelButtonId: "",
		cancelButtonWidget: null,
		customButtonLabel: "",
		customButtonTitle: "",
//		customButtonId: "",
		customButtonFunction: function(){},

		customButton2Label: "",
//		customButton2Id: "",
		customButton2Title: "",
		customButton2Function: function(){},
		cancelFunction: function() {
			this._onCancel();
			this.close();
		},
				
		okButtonLabel: "",		
//		okButtonId: "",		
		okFunction: function() {
			this._onOk();
			this.close();
//			this.onExecute();
		},		
		okButtonHandle: null,//Array
		okButtonWidget: null,
		
		duration: 500,
		
		postCreate: function() {
			// Call the parent function
			this.inherited("postCreate", arguments);
			
			this.okButtonHandle = [];			
			this.okButtonWidget = this._supportingWidgets[2];
			this.cancelButtonWidget = this._supportingWidgets[3];
			
			if (!this.closable) {
				this.closeButtonNode.style.display = "none";
				// this.cancelButtonNodeParent.style.display = "none"; // IMPORTANT!  Using display=none causes FF to dismiss line-height
			}		
			
			if (this.draggable) {
				this.titleNode.style.cursor = "move";
			}
			
			// Set button IDs
			// if (this.cancelButtonId != "") this.cancelButtonNode.titleNode.id = this.cancelButtonId; 
			// if (this.okButtonId != "") this.okButtonNode.titleNode.id = this.okButtonId;
			// if (this.customButtonId != "") this.customButtonNode.titleNode.id = this.customButtonId;
			
			// Set button labels
			this.cancelButtonNode.setLabel((this.cancelButtonLabel == "" ? EDR.messages.K0001I_COMMON_CANCEL : this.cancelButtonLabel));		
			this.okButtonNode.setLabel((this.okButtonLabel == "" ? EDR.messages.K0001I_COMMON_OK : this.okButtonLabel));
			this.customButtonNode.setLabel((this.customButtonLabel == "" ? EDR.messages.K0001I_COMMON_OK : this.customButtonLabel));
			this.customButton2Node.setLabel((this.customButton2Label == "" ? EDR.messages.K0001I_COMMON_OK : this.customButton2Label));
	
			// Set tooltip text
			this.closeButtonNode.title = EDR.messages.K0001I_COMMON_CLOSE;
			this.cancelButtonNode.titleNode.title = this.cancelButtonLabel == "" ? EDR.messages.K0001I_COMMON_CANCEL : this.cancelButtonLabel;		
			this.okButtonNode.titleNode.title = this.okButtonLabel == "" ? EDR.messages.K0001I_COMMON_OK : this.okButtonLabel;
			this.customButtonNode.titleNode.title = this.customButtonTitle == "" ? (this.customButtonLabel == "" ? EDR.messages.K0001I_COMMON_OK : this.customButtonLabel) : this.customButtonTitle;
			this.customButton2Node.titleNode.title = this.customButton2Title == "" ? (this.customButton2Label == "" ? EDR.messages.K0001I_COMMON_OK : this.customButton2Label) : this.customButton2Title;
			
			if (this.showButtonBar) {
				
				// Wire up cancel click event
				/* CJH - this is not needed and caused the hide() function to be called twice */
				if (this.showCancel) {
					dojo.connect(this.cancelButtonNode, "onClick", this, this.cancelFunction);		
				}
				
				// Disable the ok button if necessary
				if (this.showOk) {
					this.okButtonHandle = dojo.connect(this.okButtonNode, "onClick", this, this.okFunction);
				} else {
					this.okButtonNode.domNode.style.display = "none"; // IMPORTANT!  Using display=none causes FF to dismiss line-height	
				}
				
				// Disable the custom button if necessary 
				if (this.showCustom) {
					dojo.connect(this.customButtonNode, "onClick", this, this.customButtonFunction);
				} else {
					this.customButtonNode.domNode.style.display = "none"; // IMPORTANT!  Using display=none causes FF to dismiss line-height						
				}	
				
				// Disable the second custom button if necessary 
				if (this.showCustom2) {
					dojo.connect(this.customButton2Node, "onClick", this, this.customButton2Function);
				} else {
					this.customButton2Node.domNode.style.display = "none"; // IMPORTANT!  Using display=none causes FF to dismiss line-height						
				}	
				
			} else {
				this.buttonBarNode.style.display = "none";
				this.altFooterNode.style.display = "block";
			}
		},
		
		_onSubmit: function() {
		},
		
		startup: function() {
			this.inherited(arguments);
			
			// fit to content divs			
			var maxWidth = 0;
			dojo.forEach(dojo.query("> DIV", this.containerNode), function(div) {
				var size = dojo.marginBox(div);
				maxWidth = Math.max(maxWidth, size.w);
			});
			dojo.marginBox(this.containerOuter, {w:maxWidth+2});
			dojo.marginBox(this.buttonBarNode, {w:maxWidth+2});
			dojo.marginBox(this.titleBar, {w:maxWidth+2});
		},
		
		show: function() {
			this.inherited(arguments);
			this.containerNode.style.width = "100%";
			this.containerNode.style.height = "100%";
			
			var childWidgets = this.getChildren();
			if(childWidgets && childWidgets.length == 1) {
				var child = childWidgets[0];
				if(child && child._onDialogShow) {
					child._onDialogShow();
				}
			}
		},
		
		hide: function() {
			EDR.dialog.util.hide(this);
		},
		
		_onCancel: function() {
			var childWidgets = this.getChildren();
			if(childWidgets && childWidgets.length == 1) {
				var child = childWidgets[0];
				if(child && child._onDialogHide) {
					child._onDialogHide();
				}
			}	
		},
		
		_onOk: function() {
			var childWidgets = this.getChildren();
			if(childWidgets && childWidgets.length == 1) {
				var child = childWidgets[0];
				if(child && child._onDialogOk) {
					child._onDialogOk();
				}
			}	
		},		
		
		enableKeyhandler: function() {
			this._modalconnects.push(dojo.connect(dojo.doc.documentElement, "onkeypress", this, "_onKey"));		
		},
		
		disableKeyHandler: function() {
			dojo.disconnect(this._modalconnects[this._modalconnects.length-1]);
		},
		
		close: function() {
			this.hide();
		},
		
		// override
		_setup: function() {
			this.inherited(arguments);
			if(this.draggable) {
				this._moveable.destroy();
				this._moveable = new widgets.Moveable(this.domNode, { handle: this.titleBar, timeout: 0 });				
			}
		},
		
		setWidth: function(width) {
			dojo.marginBox(this.containerOuter, {w:width+2});
			dojo.marginBox(this.buttonBarNode, {w:width+2});
			dojo.marginBox(this.titleBar, {w:width+2});
		},
		
		messages_close: EDR.messages.K0001I_COMMON_CLOSE
	}
);
