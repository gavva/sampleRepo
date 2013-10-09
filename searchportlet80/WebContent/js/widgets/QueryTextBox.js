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
dojo.provide("widgets.QueryTextBox");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("widgets.TypeAhead");

dojo.declare(
	"widgets.QueryTextBox", [dijit._Widget, dijit._Templated],
	{		
		prefix: EDR.prefix,
		templatePath: dojo.moduleUrl("widgets", "templates/QueryTextBox.html"),
		widgetsInTemplate: true,
		handlers: [],
		
		textbox: null,
		imgBasePath: EDR.config.imageBaseDir,
		
		message_queryHelp: EDR.messages.queryHelp,
				
		postCreate: function() {
			this.inherited("postCreate", arguments);
//			this.queryTextBox = this._supportingWidgets[0];
			if (EDR.isTextAnalyticsEnabled) {
				dojo.style(this.queryHelp, "bottom", "43px");
				dojo.style(this.textInputContainer, "display", "none");
				dojo.style(this.textAreaContainer, "display", "block");
				this.textbox = this.textArea;
			} else {
				dojo.style(this.hideQueryLink, "display", "none");
				dojo.style(this.textInputContainer, "display", "block");
				dojo.style(this.textAreaContainer, "display", "none");
				this.textbox = this.textInput;
			}
			this.handlers.push(dojo.connect(this.textbox, "onkeypress", this, "onKeyPress"));
			this.setFullQuery("");
		},
		
		startup: function() {
			this.inherited(arguments);
			dojo.style(this.textbox, "right", 0);
		},
		
/*		showQueryArea: function() {
			dojo.style(this.queryArea, "display", "block");
			dojo.style(this.showHideQueryArea, "display", "none");
			dijit.byId(EDR.prefix+"searchPane").showQueryArea();
		}, */
		
		hideQueryArea: function() {
			dijit.byId(EDR.prefix+"searchPane").hideQueryArea();
		},
		
		getFullQuery: function() {
			return this.textbox.value;
		},
		
		setFullQuery: function(fullQuery) {
			this.textbox.value = fullQuery;
		},
		
		loadErrorHandler: function(response) {
			//console.debug(response);
		},
		
		onKeyPress: function(evt) {
			if (evt.keyCode == dojo.keys.ENTER) {
				this.textbox.blur();
				dijit.byId(EDR.prefix+"searchPane").submitSearch();
			}
		},
		
		reset: function() {
			this.setFullQuery("");
		},
		
		clear: function() {
		},
		
		destroy: function() {
			dojo.forEach(this.handlers, dojo.disconnect);
			this.inherited("destroy", arguments);
		},
		
		hidearea_label: EDR.messages.searchpane_hidequeryarea,
		searchQueryInput: EDR.messages.hiddenLabel_searchQuery
	}
);