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
dojo.provide("widgets.customize.QueryOptions");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("widgets.customize._ConfigPane");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.CheckBox");

dojo.declare(
"widgets.customize.QueryOptions",
[dijit._Widget, dijit._Templated, widgets.customize._ConfigPane],
{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl("widgets.customize", "templates/QueryOptions.html"),
	
	messages_filterBy_fileType_name: EDR.messages.filterBy_fileType_name,
	messages_filterBy_fileType_extensions: EDR.messages.filterBy_fileType_extensions,
	messages_filterBy_custom_name: EDR.messages.filterBy_custom_name,
	messages_filterBy_custom_value: EDR.messages.filterBy_custom_value,
	messages_button_addRow: EDR.messages.button_addRow,
	messages_customizer_query_section1: EDR.messages.customizer_query_section1,
	messages_customizer_query_section2: EDR.messages.customizer_query_section2,
	messages_customizer_query_section3: EDR.messages.customizer_query_section3,
	messages_customizer_query_typeAhead_section: EDR.messages.customizer_query_typeAhead_section,
	
	initialize: function(json) {
		this.inherited(arguments);
		
		var tbody = this.fileTypeFilterBody;
//		var tbody2 = this.customFilterBody;
		
		for(var key in json) {
			if(key.indexOf("documentType.") == 0) {
				var ext = key.substring(13);
				var tr = dojo.create("tr", {configkey:key}, tbody);
				var td1 = dojo.create("td", null, tr);
				var input1 = dojo.create("input", {"value": ext, "className": "dijitComboBox", "style":"width: 5em;"}, td1);		
				input1.onchange = function(evt){
					var node = this;
					var td = node.parentNode;
					var tr = td.parentNode;
					dojo.attr(tr,"configkey","documentType."+node.value);
				}
				var td2 = dojo.create("td", null, tr);
				var input2 = dojo.create("input", {"value": json[key], className: "dijitComboBox", "style": "width: 280px;"}, td2);				
				var td3 = dojo.create("td", null, tr);
				var a = dojo.create("a", {"href": "javascript:;"}, td3);
				var img = dojo.create("img", {src: EDR.contextPath + "/images/delete.gif", alt:EDR.messages.common_delete, title:EDR.messages.common_delete}, a);
				a.onclick = function(evt) {
					var node = this;
					var td = node.parentNode;
					var tr = td.parentNode;
					var tbody = tr.parentNode;
					tbody.removeChild(tr);
					dojo.stopEvent(evt);
				}
			}/* else if(key.indexOf("filterCustom.") == 0) {
				var labelStr = key.substring(13);

				var tr = dojo.create("tr", {configkey:key}, tbody2);
				var td1 = dojo.create("td", null, tr);
				var input1 = dojo.create("input", {"value": labelStr, "className": "dijitComboBox"}, td1);				
				input1.onchange = function(evt){
					var node = this;
					var td = node.parentNode;
					var tr = td.parentNode;
					dojo.attr(tr,"configkey","filterCustom."+node.value);
				}
				var td2 = dojo.create("td", null, tr);
				var input2 = dojo.create("input", {"value": json[key], className: "dijitComboBox", "style": "width: 280px;"}, td2);				
				var td3 = dojo.create("td", null, tr);
				var a = dojo.create("a", {"href": "javascript:;"}, td3);
				var img = dojo.create("img", {src: EDR.contextPath + "/images/delete.gif", alt:EDR.messages.common_delete, title:EDR.messages.common_delete}, a);
				a.onclick = function(evt) {
					var node = this;
					var td = node.parentNode;
					var tr = td.parentNode;
					var tbody = tr.parentNode;
					tbody.removeChild(tr);
					dojo.stopEvent(evt);
				}
			}*/
		}
		this._addFileTypeRow();
//		this._addCustomFilterRow();
	},
	
	_addFileTypeRow: function() {
		var tbody = this.fileTypeFilterBody;
		
		var tr = dojo.create("tr", null, tbody);
		var td = dojo.create("td", null, tr);
		var input1 = dojo.create("input", {type:"text", className:"dijitComboBox", value: "", "style":"width: 5em;"}, td);
		input1.onchange = function(evt){
			var node = this;
			var td = node.parentNode;
			var tr = td.parentNode;
			dojo.attr(tr,"configkey","documentType."+node.value);
		}
		var td2 = dojo.create("td", null, tr);
		var input2 = dojo.create("input", {type:"text", className:"dijitComboBox", value: "", "style": "width: 280px;"}, td2);
		var td3 = dojo.create("td", null, tr);
		var a = dojo.create("a", {"href": "javascript:;"}, td3);
		var img = dojo.create("img", {src: EDR.contextPath + "/images/delete.gif", alt:EDR.messages.common_delete, title:EDR.messages.common_delete}, a);
		a.onclick = function(evt) {
			var node = this;
			var td = node.parentNode;
			var tr = td.parentNode;
			var tbody = tr.parentNode;
			tbody.removeChild(tr);
			dojo.stopEvent(evt)
		}

	},
	
	_addCustomFilterRow: function() {
		var tbody = this.customFilterBody;
		
		var tr = dojo.create("tr", null, tbody);
		var td = dojo.create("td", null, tr);
		var input1 = dojo.create("input", {type:"text", className:"dijitComboBox", value: ""}, td);
		input1.onchange = function(evt){
			var node = this;
			var td = node.parentNode;
			var tr = td.parentNode;
			dojo.attr(tr,"configkey","filterCustom."+node.value);
		}
		var td2 = dojo.create("td", null, tr);
		var input2 = dojo.create("input", {type:"text", className:"dijitComboBox", value: "", style: "width: 280px;"}, td2);
		var td3 = dojo.create("td", null, tr);
		var a = dojo.create("a", {"href": "javascript:;"}, td3);
		var img = dojo.create("img", {src: EDR.contextPath + "/images/delete.gif", alt:EDR.messages.common_delete, title:EDR.messages.common_delete}, a);
		a.onclick = function(evt) {
			var node = this;
			var td = node.parentNode;
			var tr = td.parentNode;
			var tbody = tr.parentNode;
			tbody.removeChild(tr);
			dojo.stopEvent(evt)
		}

	},	
	
	__dummy__: null	
});
