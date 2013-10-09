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
dojo.provide("widgets.Textarea");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");

dojo.declare(
	"widgets.Textarea",
	[dijit._Widget, dijit._Templated],
	{
		layoutPaneId: "",
		buttonPaneId: "",
		parentPaneId: "",
		onEnter: function(){}, 
						
		templateString: null,
		templatePath: dojo.moduleUrl("widgets", "templates/Textarea.html"),
		
		postCreate: function(){
			widgets.Textarea.superclass.postCreate.apply(this,arguments);
			this.resizeContainer();
			this.connect(window, "onresize", this.resizeContainer);
			this.connect(this.containerNode, "keypress", this.keyPressContainer); 
		}, 
		
		keyPressContainer: function(e){
			if (e.keyCode == dojo.keys.ENTER && !e.shiftKey && !e.ctrlKey && !e.altKey){
				if (this.onEnter) {
					this.onEnter();
				}	
				dojo.stopEvent(e);
				return false;
			}	
		},
		
		resizeContainer: function() {
/*			var textareaContainer = this.textareaContainer;
			var textareaContainerMiddleMiddle = this.textareaContainerMiddleMiddle;
			var containerMiddle = this.textareaContainerMiddle;
			var textarea = g(this.id + 'textarea'); 
			
			var parentDiv = g(this.parentPaneId); 
			var buttonsDiv = g(this.buttonPaneId); 
			if (parentDiv && buttonsDiv && textareaContainer && textareaContainerMiddleMiddle) {
			    // Setting the container width allows the textarea to take up all the available horizontal space in the parent container
				var textareaWidth = parentDiv.clientWidth - buttonsDiv.clientWidth - 10;
				if (textareaWidth > 0) {
					textareaContainer.style.width = textareaWidth;
					textareaContainerMiddleMiddle.style.width = textareaWidth - 10;
					if (textarea) {
						textarea.style.width = textareaContainerMiddleMiddle.style.width;
					}	
				}	
		    } else {
				if (textareaContainer) {
					textareaContainerMiddleMiddle.style.width = textareaContainer.clientWidth - 20;
					if (textarea) {
						textarea.style.width = textareaContainerMiddleMiddle.style.width;
					}	
				}
		    }
		    
			if (containerMiddle && containerMiddle.style && textarea && textarea.clientHeight) {
				var textareaHeight = textarea.clientHeight;
				containerMiddle.style.height = textareaHeight;
			}*/
		}, 
		
		getValue: function() {
			var textarea = g(this.id + 'textarea'); 
			return textarea.value;
		},
		
		setValue: function(value) {
			var textarea = g(this.id + 'textarea'); 
			textarea.value = value;
		}
	}
);
