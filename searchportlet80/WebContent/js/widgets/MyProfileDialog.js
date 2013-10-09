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
dojo.provide("widgets.MyProfileDialog");
dojo.require("widgets.customDialog");

dojo.require("dijit.Dialog");
dojo.require("widgets.MyProfileContent");

dojo.declare(
	"widgets.MyProfileDialog", [widgets.customDialog],
	{		
		_content: null,
		
		isClosable: false,
		
		okButtonLabel: EDR.messages.button_apply,
		cancelButtonLabel: EDR.messages.K0001I_COMMON_CLOSE,
		
		postCreate: function() {
			this.inherited("postCreate", arguments);
		},
		
		startup: function() {
			this.inherited("startup", arguments);
		},
		
		show: function() {
			this.inherited(arguments);
			
			var content = dijit.byId(EDR.prefix+"myProfileContent");
			if(content){
				content.onDialogOpen();
			}
		},
		

		okFunction: function() {
			var content = dijit.byId(EDR.prefix+"myProfileContent");
			if(content){
				content.onSubmit();
			}			
		},
		
		cancelFunction: function() {
			this.inherited("cancelFunction", arguments);
		}
	}
);
