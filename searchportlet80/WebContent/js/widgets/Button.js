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
dojo.provide("widgets.Button");

dojo.require("dijit.form.Button");

dojo.declare(
	"widgets.Button",
	[dijit.form.Button],
	{
		templatePath: dojo.moduleUrl("widgets", "templates/Button.html"),

		tabindex: "0",
		title: "",
		type: "button",
		
		postCreate: function(){
			this.inherited(arguments);
			if (!this.isLeftToRight()) {
/*				dojo.removeClass(this.btnCtrBottom, "ButtonContainerBottom");
				dojo.addClass(this.btnCtrBottom, "ButtonContainerBottom_rtl");
				dojo.removeClass(this.btnCtrBottomLeft, "ButtonContainerBottomLeft");
				dojo.addClass(this.btnCtrBottomLeft, "ButtonContainerBottomLeft_rtl"); */
			}
//			this.adjustButtonWidth();
		},
		
		startup: function() {
			this.inherited(arguments);
			this.adjustButtonWidth();
		},
		
		// adjustButtonWidth - set the button's bottom width to the buttonContainer's clientWidth
		adjustButtonWidth: function() {
			var buttonContainer = this.btnCtr;
			var buttonContainerBottom = this.btnCtrBottom;
			
			if (buttonContainer && buttonContainerBottom && (buttonContainer.clientWidth != 0)) {
				buttonContainerBottom.style.width = buttonContainer.clientWidth; 
				//for IE7, adjusting OK button's layout
				if(dojo.isIE<=7){
					var buttonContainerTop =  this.btnCtrTop;
					buttonContainerTop.style.width = buttonContainer.clientWidth;
					dojo.attr(this.ButtonContentNode,"align","center");
				}
			}
		},
		
		setButtonWidth: function(width) {
			dojo.byId(this.id).style.width = width + "px";
			var buttonContainerBottom = this.btnCtrBottom;
			buttonContainerBottom.style.width = width + 10 + "px";
		}
	}
);