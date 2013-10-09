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
dojo.provide("widgets.customize.Images");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("widgets.customize._ConfigPane");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.CheckBox");

dojo.declare(
"widgets.customize.Images",
[dijit._Widget, dijit._Templated, widgets.customize._ConfigPane],
{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl("widgets.customize", "templates/Images.html"),

	messages_documentSourceName: EDR.messages.documentSourceName,
	messages_documentSourceImage: EDR.messages.documentSourceImage,
	messages_documentSourceImage_label: EDR.messages.documentSourceImage_label,
	
	initialize: function(json) {
		var tbody = this.sourceImageBody;
		var names = [];
		for(var name in json) {
			var regexp = new RegExp("documentSource\.(.*)\.icon");
			var result = regexp.exec(name);
			if(result) {
				var fieldname = result[1];
				names.push(fieldname);
			}
		}
		names.sort();
		for(var i=0; i<names.length; ++i) {
			var tr = dojo.create("tr", {configkey:"documentSource."+names[i]+".icon"}, tbody);
			var td = dojo.create("td", {innerHTML: names[i]}, tr);
			var td2 = dojo.create("td", null, tr);
			var input2 = dojo.create("input", {type:"text", className:"dijitComboBox", value: json["documentSource."+names[i]+".icon"]}, td2);
		}
	},
	
	__dummy__: null	
});
