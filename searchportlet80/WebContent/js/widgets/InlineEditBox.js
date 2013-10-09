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
dojo.provide("widgets.InlineEditBox");

dojo.require("dijit.InlineEditBox");

dojo.declare(
	"widgets.InlineEditBox",
	dijit.InlineEditBox,
	{
		
		onCancel: function(value){
			// summary: User should set this handler to be notified of changes to value
		},
		
		postCreate: function() {
		
			// Call the parent function
			this.inherited("postCreate", arguments);			
			
			// Force edit to occur 
			this._edit();
						
		},
			
		_onMouseOver: function(){
			dojo.addClass(this.displayNode, this.disabled ? "disabledInlineEditorHover" : "enabledInlineEditorHover");
		},
	
		_onMouseOut: function(){
			dojo.removeClass(this.displayNode, this.disabled ? "disabledInlineEditorHover" : "enabledInlineEditorHover");
		},
		
		_edit: function(){
			// summary: display the editor widget in place of the original (read only) markup
	
			this.editing = true;
	
			var editValue = 
					(this.renderAsHtml ?
					this.value :
					this.value.replace(/\s*\r?\n\s*/g,"").replace(/<br\/?>/gi, "\n").replace(/&gt;/g,">").replace(/&lt;/g,"<").replace(/&amp;/g,"&"));
	
			// Placeholder for edit widget
			// Put place holder (and eventually editWidget) before the display node so that it's positioned correctly
			// when Calendar dropdown appears, which happens automatically on focus.
			var placeholder = document.createElement("span");
			dojo.place(placeholder, this.domNode, "before");
	
			var ew = this.editWidget = new widgets._InlineEditor({
				value: dojo.trim(editValue),
				autoSave: this.autoSave,
				buttonSave: this.buttonSave,
				buttonCancel: this.buttonCancel,
				renderAsHtml: this.renderAsHtml,
				editor: this.editor,
				editorParams: this.editorParams,
				style: dojo.getComputedStyle(this.displayNode),
				save: dojo.hitch(this, "save"),
				cancel: dojo.hitch(this, "cancel"),
				width: this.width
			}, placeholder);
	
			// to avoid screen jitter, we first create the editor with position:absolute, visibility:hidden,
			// and then when it's finished rendering, we switch from display mode to editor
			var ews = ew.domNode.style;
			this.displayNode.style.display="none";
			ews.position = "static";
			ews.visibility = "visible";
	
			// Replace the display widget with edit widget, leaving them both displayed for a brief time so that
			// focus can be shifted without incident.  (browser may needs some time to render the editor.)
			this.domNode = ew.domNode;
			
			/* LGG - NO TIMEOUT NECESSARY SINCE THERE IS NO READONLY MODE
			setTimeout(function(){
				ew.focus();
			}, 100);*/
		},		

		cancel: function(/*Boolean*/ focus){
			/* LGG - DISABLE DEFAULT CANCEL OPERATIONS TO SUPPORT CUSTOM JAVASCRIPT
			// summary:
			//		Revert to display mode, discarding any changes made in the editor
			this.editing = false;
			this._showText(focus);*/
			this.onCancel(this.value);
		}
});

dojo.declare(
	"widgets._InlineEditor",
	dijit._InlineEditor,
	{			
		templateString: null,
		
		templatePath: dojo.moduleUrl("widgets", "templates/InlineEditBox.html")

});