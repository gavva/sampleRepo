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
dojo.provide("widgets.customize.FacetCharts");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.form.Button");
dojo.require("widgets.customize._ChartsPane");

dojo.declare(
"widgets.customize.FacetCharts",
[widgets.customize._ChartsPane],
{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl("widgets.customize", "templates/FacetCharts.html"),

	facetChartsPropertiesArray : ["enable","titleKey","canUserChangeFacetName","facetName","maxValues.all","open"],
	facetChartsDefaultValues:["true","","true","","500","true"],

	messages_customizer_charts_facet_section1: EDR.messages.customizer_charts_facet_section1,
	messages_customizer_charts_facet_section2: EDR.messages.customizer_charts_facet_section2,
	messages_customizer_charts_facet_header : EDR.messages.customizer_charts_facet_header,
	
	constructor: function() {
		this.chartType = "facetCharts";
	},
	
	postCreate: function() {
		this.inherited(arguments);
	},
	
	initialize: function(json) {
		this.inherited(arguments);
    	var addFacetChartsButton = new dijit.form.Button({label: EDR.messages.customizer_charts_facet_button_label},this.addFacetChartsButtonId);
    	this.handlers.push(dojo.connect(addFacetChartsButton,"onClick", this, "addChartsBlock"));
	},
	
	__dummy__: null	
});
