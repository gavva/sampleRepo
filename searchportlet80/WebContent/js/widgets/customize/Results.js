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
dojo.provide("widgets.customize.Results");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("widgets.customize._ConfigPane");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.CheckBox");

dojo.declare(
"widgets.customize.Results",
[dijit._Widget, dijit._Templated, widgets.customize._ConfigPane],
{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl("widgets.customize", "templates/Results.html"),
	
	messages_fieldProtocol: EDR.messages.fieldProtocol,
	messages_fieldShow: EDR.messages.fieldShow,
	messages_fields: EDR.messages.fields,
	messages_titles: EDR.messages.titles,
	messages_clientViewer: EDR.messages.clientViewer,
	messages_button_addRow: EDR.messages.button_addRow,
	messages_customizer_results_section1: EDR.messages.customizer_results_section1,

	initialize: function(json) {
		this.inherited(arguments);
	
/*		var tbody = this.fieldProtocolBody;

		var names = [];
		for(var name in json) {
			var regexp = new RegExp("fields\.(.*)");
			var result = regexp.exec(name);
			if(result) {
				var fieldname = result[1];
				names.push(fieldname);
			}
		}
		names.sort();
		for(var i=0; i<names.length; ++i) {
			var tr = dojo.create("tr", {configkey:"fields."+names[i]}, tbody);
			var td = dojo.create("td", null, tr);
			var input1 = dojo.create("input", {type:"text", className:"dijitComboBox", value: names[i]}, td);
			input1.onchange = function(evt){
				var node = this;
				var td = node.parentNode;
				var tr = td.parentNode;
				dojo.attr(tr,"configkey","fields."+node.value);
			}
			var td2 = dojo.create("td", null, tr);
			var input2 = dojo.create("input", {type:"text", className:"dijitComboBox", value: json["fields."+names[i]], style: "width: 280px;"}, td2);
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
		}
		
		this._addFieldRow();*/
	},
	
	_addFieldRow: function(evt) {
		var tbody = this.fieldProtocolBody;
		
		var tr = dojo.create("tr", null, tbody);
		var td = dojo.create("td", null, tr);
		var input1 = dojo.create("input", {type:"text", className:"dijitComboBox", value: ""}, td);
		input1.onchange = function(evt){
			var node = this;
			var td = node.parentNode;
			var tr = td.parentNode;
			dojo.attr(tr,"configkey","fields."+node.value);
		}
		var td2 = dojo.create("td", null, tr);
		var input2 = dojo.create("input", {type:"text", className:"dijitComboBox", value: "", style: "width: 280px;"}, td2);
		var td3 = dojo.create("td", null, tr);
		var a = dojo.create("a", {"href": "javascript:;"}, td3);
		var img = dojo.create("img", {src: EDR.contextPath + "/images/delete.gif", alt:EDR.messages.common_delete}, a);
		a.onclick = function(evt) {
			var node = this;
			var td = node.parentNode;
			var tr = td.parentNode;
			var tbody = tr.parentNode;
			tbody.removeChild(tr);
			dojo.stopEvent(evt);
		};
	},
	
	onResultsColumnsChange: function(evt) {
		var columnDefsStr =  this.resultsColumns.value;
		if(columnDefsStr != null) {
			var columnDefs = columnDefsStr.split(",");
			columnDefs = dojo.filter(columnDefs, function(elem){ return !(elem.length == 0 || elem[0] == '$'); });
			var manager = dijit.byId(EDR.prefix+"searchManager");
			manager.setColumnDefs(columnDefs);
			dojo.publish("headerColumnsChanged");
		}
	},
	
	__dummy__: null	
});
