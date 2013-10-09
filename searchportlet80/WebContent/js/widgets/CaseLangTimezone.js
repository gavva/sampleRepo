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
dojo.provide("widgets.CaseLangTimezone");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");

dojo.require("widgets.Button");
dojo.require("dijit.form.FilteringSelect");

dojo.declare(
	"widgets.CaseLangTimezone",
	[dijit._Widget, dijit._Templated],
	{			
		templateString: null,
		templatePath: dojo.moduleUrl("widgets", "templates/CaseLangTimezone.html"),
			
		widgetsInTemplate: true,
		
		langTimezoneJson: null,
		
		K0014I_CASE_LANG_DIALOG_NOVALUE_ERROR: "",
		K0014I_CASE_TIMEZONE_DIALOG_NOVALUE_ERROR: "",
		K0014I_CASE_LANG_LABEL: "",
		K0014I_CASE_TIMEZONE_LABEL: "",
				
		isValid: function() {
			if (this.isValidLang() && this.isValidTimezone()) return true;
			return false;
		},
		
		getErrorMessage: function() {
			var message = "";
			if (!this.isValidLang()) message += this.K0014I_CASE_LANG_DIALOG_NOVALUE_ERROR + "<br/>";
			if (!this.isValidTimezone()) message += this.K0014I_CASE_TIMEZONE_DIALOG_NOVALUE_ERROR + "<br/>";
			return message;
		},
		
		
		isValidLang: function() {
			if (this.caseLang.isValid()) return true;
			return false;
		},
		
		isValidTimezone: function() {
			if (this.caseTimezone.isValid()) return true;
			return false;
		},
		
		setCaseLangTimezoneJson: function(json) {
			this.langTimezoneJson = json
			this.renderCaseLangTimezone(this.langTimezoneJson);
		},
		
		getLang: function() {
			return this.caseLang.getValue();
		},
		
		getTimezone: function() {
			return this.caseTimezone.getValue();
		},

		renderCaseLangTimezone: function(json) {
			if (this.caseLang != null) this.caseLang.destroy();
			if (this.caseTimezone != null) this.caseTimezone.destroy();
		
			var html = this.buildCaseLang(json);
			html += "<br/>";
			html += this.buildCaseTimezone(json);
			this.domNode.innerHTML = html;
			dojo.parser.parse(this.domNode);
			
			this.caseLang = dijit.byId("caseLang");
			// [workaround] this fix will be included in dojo 1.2
			this.caseLang.compositionend = function(evt) { this._onKeyPress({charCode:-1}); };
			// [workaround] to always show the menu under the text box
			this.caseLang.open = function() {
				this._isShowingNow=true;
				return dijit.popup.open({orient: {'BL':'TL'}, popup: this._popupWidget, around: this.domNode, parent: this});				
			}
			this.caseLang.domNode.style.width = "20em";
//			this.caseLang.invalidMessage = this.K0014I_ADMIN_SYSLOG_DIALOG_LABEL_LOGLEVEL_ERROR;


			this.caseTimezone = dijit.byId("caseTimezone");			
			// [workaround] this fix will be included in dojo 1.2
			this.caseTimezone.compositionend = function(evt) { this._onKeyPress({charCode:-1}); };
			// [workaround] to always show the menu under the text box
			this.caseTimezone.open = function() {
				this._isShowingNow=true;
				return dijit.popup.open({orient: {'BL':'TL'}, popup: this._popupWidget, around: this.domNode, parent: this});				
			}			
			this.caseTimezone.domNode.style.width = "20em";
//			this.caseTimezone.invalidMessage = this.K0014I_ADMIN_SYSLOG_DIALOG_LABEL_LOGLEVEL_ERROR;
		},
						
		buildCaseLang: function(json) {
			/*
				<div id="logLevelContainer">
					<span>Log level:</span>
				    <select dojoType="dijit.form.FilteringSelect" dojoAttachPoint="logLevels">
					</select>
				</div>
			*/
			var html = '<div>';
			html += '<label for="caseLang">' + this.K0014I_CASE_LANG_LABEL  + '</label><br/>';
			html += '<select dojoType="dijit.form.FilteringSelect" id="caseLang">';
			
			var caseLangs = json.langs;
			for (var i=0; i<caseLangs.length; i++) {
				html += '<option value="' + caseLangs[i].value + '"' +
					((caseLangs[i].isDefault) ? 'selected="selected">' : '>') + caseLangs[i].name + '</option>';
			}

			html += '</select></div>';
			return html;
		},
		
		buildCaseTimezone: function(json) {
			/*
				<div id="logLevelContainer">
					<span>Log level:</span>
				    <select dojoType="dijit.form.FilteringSelect" dojoAttachPoint="logLevels">
					</select>
				</div>
			*/
			var html = '<div>';
			html += '<label for="caseTimezone">' + this.K0014I_CASE_TIMEZONE_LABEL  + '</label><br/>';
			html += '<select dojoType="dijit.form.FilteringSelect" id="caseTimezone">';
			
			var caseTimezones = json.timezones;
			for (var i=0; i<caseTimezones.length; i++) {
				html += '<option value="' + caseTimezones[i].value + '"' +
					((caseTimezones[i].isDefault) ? 'selected="selected">' : '>') + caseTimezones[i].name + '</option>';
			}

			html += '</select></div>';
			return html;
		}
	}	
);