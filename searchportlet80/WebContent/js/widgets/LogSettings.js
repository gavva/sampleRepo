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
dojo.provide("widgets.LogSettings");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");

dojo.require("widgets.Button");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.NumberSpinner");

dojo.declare(
	"widgets.LogSettings",
	[dijit._Widget, dijit._Templated],
	{			
		templateString: null,
		templatePath: dojo.moduleUrl("widgets", "templates/LogSettings.html"),
			
		widgetsInTemplate: true,
		
		logSettingsJson: null,
		
		logSettingsStateListener: function() {},
		
		K0014I_ADMIN_SYSLOG_DIALOG_LABEL_LOGLEVEL: "",
		K0014I_ADMIN_SYSLOG_DIALOG_LABEL_MAXNUM: "",
		K0014I_ADMIN_SYSLOG_DIALOG_LABEL_MAXSIZE: "",
		K0014I_ADMIN_SYSLOG_DIALOG_LABEL_LOGLEVEL_ERROR: "",
		K0014I_ADMIN_SYSLOG_DIALOG_LABEL_MAXNUM_ERROR: "",
		K0014I_ADMIN_SYSLOG_DIALOG_LABEL_MAXSIZE_ERROR: "",		
		
		isValid: function() {
			if (this.isValidLogLevel() && this.isValidMaxNum() && this.isValidMaxSize()) return true;
			return false;
		},
		
		getErrorMessage: function() {
			var message = "";
			if (!this.isValidLogLevel()) message += this.K0014I_ADMIN_SYSLOG_DIALOG_LABEL_LOGLEVEL_ERROR + "<br/>";
			if (!this.isValidMaxNum()) message += this._buildMaxNumErrorMessage() + "<br/>";
			if (!this.isValidMaxSize()) message += this._buildMaxSizeErrorMessage() + "<br/>";
			return message;
		},
		
		_buildMaxNumErrorMessage: function() {
			var message = this.K0014I_ADMIN_SYSLOG_DIALOG_LABEL_MAXNUM_ERROR;
			message = message.replace('{0}', this.logSettingsJson.minNumOfLog);
			message = message.replace('{1}', this.logSettingsJson.maxNumOfLog);
			return message;
		},

		_buildMaxSizeErrorMessage: function() {
			var message = this.K0014I_ADMIN_SYSLOG_DIALOG_LABEL_MAXSIZE_ERROR;
			message = message.replace('{0}', this.logSettingsJson.minSizeOfLog);
			message = message.replace('{1}', this.logSettingsJson.maxSizeOfLog);
			return message;
		},
		
		isValidLogLevel: function() {
			if (this.logLevels.isValid()) return true;
			return false;
		},
		
		isValidMaxNum: function() {
			if (this.logMaxNum.isValid() && this.logMaxNum.isInRange()) return true;
			return false;
		},
		
		isValidMaxSize: function() {
			if (this.logMaxSize.isValid() && this.logMaxSize.isInRange()) return true;
			return false;
		},
		
		setLogSettingsJson: function(json) {
			this.logSettingsJson = json
			this.renderLogSettings(this.logSettingsJson);
		},
		
		getLogLevel: function() {
			return this.logLevels.getValue();
		},
		
		getMaxNum: function() {
			return this.logMaxNum.getValue();
		},

		getMaxSize: function() {
			return this.logMaxSize.getValue();
		},

		renderLogSettings: function(json) {
			if (this.logLevels != null) this.logLevels.destroy();
			if (this.logMaxNum != null) this.logMaxNum.destroy();
			if (this.logMaxSize != null) this.logMaxSize.destroy();
		
			var html = this.buildLogLevels(json);
			html += "<br/>";
			html += this.buildNumOfLog(json);
			html += "<br/>";
			html += this.buildSizeOfLog(json);
			this.domNode.innerHTML = html;
			dojo.parser.parse(this.domNode);
			
			this.logLevels = dijit.byId("logLevels");
			this.logLevels.invalidMessage = this.K0014I_ADMIN_SYSLOG_DIALOG_LABEL_LOGLEVEL_ERROR;
			// [workaround] this fix will be included in dojo 1.2
			this.logLevels.compositionend = function(evt) { this._onKeyPress({charCode:-1}); };
			
			this.logMaxNum = dijit.byId("logMaxNum");
			this.logMaxNum.invalidMessage = this._buildMaxNumErrorMessage();
			this.logMaxNum.rangeMessage = this._buildMaxNumErrorMessage();
			this.logMaxSize = dijit.byId("logMaxSize");			
			this.logMaxSize.invalidMessage = this._buildMaxSizeErrorMessage();
			this.logMaxSize.rangeMessage = this._buildMaxSizeErrorMessage();
		},
						
		buildLogLevels: function(json) {
			/*
				<div id="logLevelContainer">
					<span>Log level:</span>
				    <select dojoType="dijit.form.FilteringSelect" dojoAttachPoint="logLevels">
					</select>
				</div>
			*/
			var html = '<div>';
			html += '<label for="logLevels">' + this.K0014I_ADMIN_SYSLOG_DIALOG_LABEL_LOGLEVEL  + '</label><br/>';
			html += '<select dojoType="dijit.form.FilteringSelect" id="'+EDR.prefix+'logLevels">';
			
			var logLevels = json.logLevels;
			for (var i=0; i<logLevels.length; i++) {
				html += '<option value="' + logLevels[i].value + '"' +
					((logLevels[i].isSelected) ? 'selected="selected">' : '>') + logLevels[i].name + '</option>';
			}

			html += '</select></div>';
			return html;
		},
		
		buildNumOfLog: function(json) {
			/*
				<div id="logMaxNumContainer">
					<span>Maximum number of logs:</span>
					<input dojoType="dijit.form.NumberSpinner" dojoAttachPoint="logMaxNum"></input>
				</div>
			*/
			var html = '<div>';
			html += '<label for="logMaxNum">' + this.K0014I_ADMIN_SYSLOG_DIALOG_LABEL_MAXNUM  + '</label><br/>';
			html += '<input dojoType="dijit.form.NumberSpinner" id="'+EDR.prefix+'logMaxNum"';
			html += ' value="' + json.numOfLog + '"';			
			html += ' constraints="' + "{min:" + json.minNumOfLog + "," + "max:" + json.maxNumOfLog + ",places:0}" + '"';			
			html += ' smallDelta="' + 5 + '"></input>';
			html += '</div>';
			return html;
		},
		
		buildSizeOfLog: function(json) {
			/*
				<div id="logMaxSizeContainer">
					<span>Maximum size of logs:</span>
					<input dojoType="dijit.form.NumberSpinner" dojoAttachPoint="logMaxNum"></input>
				</div>
			*/
			var html = '<div>';
			html += '<label for="logMaxSize">' + this.K0014I_ADMIN_SYSLOG_DIALOG_LABEL_MAXSIZE  + '</label><br/>';
			html += '<input dojoType="dijit.form.NumberSpinner" id="'+EDR.prefix+'logMaxSize"';
			html += ' value="' + json.sizeOfLog + '"';			
			html += ' constraints="' + "{min:" + json.minSizeOfLog + "," + "max:" + json.maxSizeOfLog + ",places:0}" + '"';			
			html += ' smallDelta="' + 50 + '"></input>';
			html += '</div>';
			return html;
		},
		
		destroy: function() {
			if (this.logLevels != null) this.logLevels.destroy();
			if (this.logMaxNum != null) this.logMaxNum.destroy();
			if (this.logMaxSize != null) this.logMaxSize.destroy();
			this.inherited("destroy", arguments);
		}
	}	
);