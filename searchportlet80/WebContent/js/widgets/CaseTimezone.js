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
dojo.provide("widgets.CaseTimezone");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");

dojo.require("widgets.Button");
dojo.require("dijit.form.FilteringSelect");

dojo.declare(
	"widgets.CaseTimezone",
	[dijit._Widget, dijit._Templated],
	{			
		templateString: null,
		templatePath: dojo.moduleUrl("widgets", "templates/CaseTimezone.html"),
			
		widgetsInTemplate: true,
		
		timezoneJson: null,
		
		K0014I_CASE_TIMEZONE_DIALOG_NOVALUE_ERROR: "",
		K0014I_CASE_TIMEZONE_LABEL: "",
				
		postCreate: function() {
		},
		
		isValid: function() {
			if (this.isValidTimezone()) return true;
			return false;
		},
		
		getErrorMessage: function() {
			var message = "";
			if (!this.isValidTimezone()) message += this.K0014I_CASE_TIMEZONE_DIALOG_NOVALUE_ERROR + "\n";
			return message;
		},
		
		
		isValidTimezone: function() {
			if (this.caseTimezone.isValid()) return true;
			return false;
		},
		
		setCaseTimezoneJson: function(json) {
			this.timezoneJson = json
			this.renderCaseTimezone(this.timezoneJson);
		},
		
		getTimezone: function() {
			return this.caseTimezone.getValue();
		},

		renderCaseTimezone: function(json) {
			if (this.caseTimezone != null) this.caseTimezone.destroy();
		
			var html = this.buildCaseTimezone(json);
			this.domNode.innerHTML = html;
			dojo.parser.parse(this.domNode);
			
			this.caseTimezone = dijit.byId("caseTimezoneDiv");
			this.caseTimezone.domNode.style.width = "20em";
//			this.caseTimezone.invalidMessage = this.K0014I_ADMIN_SYSLOG_DIALOG_LABEL_LOGLEVEL_ERROR;
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
			html += '<label for="caseTimezoneDiv">' + this.K0014I_CASE_TIMEZONE_LABEL  + '</label><br/>';
			html += '<select dojoType="dijit.form.FilteringSelect" id="caseTimezoneDiv">';
			
			var caseTimezones = json;
			for (var i=0; i<caseTimezones.length; i++) {
				html += '<option value="' + caseTimezones[i].value + '"' +
					((caseTimezones[i].isDefault) ? 'selected="selected">' : '>') + caseTimezones[i].name + '</option>';
			}

			html += '</select></div>';
			return html;
		},
		
		destroy: function() {
			if (this.caseTimezone != null) this.caseTimezone.destroy();
			this.inherited("destroy", arguments);
		}
	}	
);