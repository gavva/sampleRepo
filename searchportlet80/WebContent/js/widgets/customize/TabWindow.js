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
dojo.provide("widgets.customize.TabWindow");

dojo.require("widgets.TabWindow");

/*
 * widgets.customize.TabWindow
 * This class manages sub config pages.
 */
dojo.declare(
"widgets.customize.TabWindow",
widgets.TabWindow,
{
	testData: "",
	
	_configJson: null,
	
	_onDialogShow: function() {
	},
	
	initialize: function() {
		this._loadConfig();
		this._initializeConfigPanes();
	},
	
	_onDialogOk: function() {
	},
	
	_loadConfig: function() {
		var args = {
			url: "customize",
			handleAs: "json",
			load: dojo.hitch(this, "_onConfigLoad"),
			error: dojo.hitch(this, "_onConfigError"),
			timeout: dojo.hitch(this, "_onConfigTimeout")
		};
		if(this.testData) {
			args.url = this.testData;
		}
		dojo.xhrGet(args);
	},
	
	saveConfig: function(loadFunction, errorFunction, timeoutFunction) {
		var data = {};
		var children = this.getChildren();
		for(i=0; i<children.length; i++) {
			data = children[i].collectData(data);
		}
		var json = {};
		for(var i=0; i<data.names.length; i++) {
			json[data.names[i]] = data.values[i]; 
		}
		
		var args = {
				url: "customize",
				handleAs: "json",
				content: json,
				load: (loadFunction ? loadFunction : dojo.hitch(this, "_onConfigSave")),
				error: (errorFunction ? errorFunction : dojo.hitch(this, "_onConfigSaveError")),
				timeout: (timeoutFunction ? timeoutFunction : dojo.hitch(this, "_onConfigSaveTimeout"))				
			};
			dojo.xhrPost(args);		
	},
	
	_onConfigLoad: function(data) {
		var json = {};
		for(var i=0; i<data.names.length; i++) {
			json[data.names[i]] = data.values[i];
		}
		this._configJson = json;
		var children = this.getChildren();
		for(var i=0; i<children.length; i++) {
			var child = children[i];
			child.initialize(this._configJson);
		}
	},
	_onConfigError: function(data) {
		
	},
	_onConfigTimeout: function(data) {
		
	},
	
	_onConfigSave: function(data) {
	},
	_onConfigSaveError: function(data) {
	},
	_onConfigSaveTimeout: function(data) {
	},		
	
	_initializeConfigPanes: function() {
		
	},
	
	__dummy__: null
});
