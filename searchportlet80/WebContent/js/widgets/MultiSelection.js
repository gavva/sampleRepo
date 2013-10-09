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
dojo.provide("widgets.MultiSelection");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit.form.MultiSelect");

dojo.declare(
	"widgets.MultiSelection", [dijit._Widget, dijit._Templated],
	{				
		prefix: EDR.prefix,
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl("widgets", "templates/MultiSelection.html"),
		handlers: [],

		available: null,
		selected: null,
		
		// options parameters
		options: [],
		
		// resources
		availableTitle: EDR.messages.label_candidates,
		selectedTitle: EDR.messages.label_applied,
		addBtnTitle: "",
		removeBtnTitle: "",
				
		postCreate: function() {
			this.inherited("postCreate", arguments);

			//this.available = dijit.byId("availableList");
			this.available = this.availableList;
			this.selected = this.selectedList;
			
			var size = dojo.contentBox(this.domNode);
			var box = {
				w: (size.w - 72) / 2,
				h: (size.h - 20)
			}
			dojo.marginBox(this.available.domNode, box);
			dojo.marginBox(this.selected.domNode, box);
			dojo.style(this.btnContainer, "paddingTop", size.h * 0.4);
					
			this.handlers.push(dojo.connect(this.leftBtn, "onclick", this, "remove"));
			this.handlers.push(dojo.connect(this.rightBtn, "onclick", this, "add"));
		},
		
		add: function() {
			this.available.getSelected().forEach(function(opt){
				for (var i=0; i<this.options.length; i++) {
					if (opt.value == this.options[i].value) {
						this.options[i].selected = true;
						break;
					}
				}
			}, this);
			this.buildOptions();
		},
		
		remove: function() {
			this.selected.getSelected().forEach(function(opt){
				for (var i=0; i<this.options.length; i++) {
					if (opt.value == this.options[i].value) {
						this.options[i].selected = false;
						break;
					}
				}
			}, this);
			this.buildOptions();
		},
		
		buildOptions: function() {
			this.clearOptions();
			
			var options = this.options;
			if (options == null || options.length == 0) return;
			for (var i=0; i<options.length; i++) {
				var option = dojo.doc.createElement("OPTION");
				option.innerHTML = options[i].label;
				option.label = options[i].label;
				option.title = options[i].label;
				option.value = options[i].value;
				
				if (options[i].selected)
					this.selected.domNode.appendChild(option);
				else
					this.available.domNode.appendChild(option);
			}
		},
		
		clearOptions: function() {
			this.selected.domNode.innerHTML = "";
			this.available.domNode.innerHTML = "";
		},
		
		destroy: function() {
			dojo.forEach(this.handlers, dojo.disconnect);
			this.inherited("destroy", arguments);
		}
	}
);