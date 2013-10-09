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
dojo.provide("widgets.customize.ScreenSettings");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("widgets.customize._ConfigPane");
dojo.require("dijit.form.FilteringSelect");

dojo.declare(
"widgets.customize.ScreenSettings",
[dijit._Widget, dijit._Templated, widgets.customize._ConfigPane],
{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl("widgets.customize", "templates/ScreenSettings.html"),

	messages_fieldName: EDR.messages.fieldName,
	messages_fieldImage: EDR.messages.fieldImage,
//	messages_fieldImageToShow: EDR.messages.fieldImageToShow,
	messages_button_addRow: EDR.messages.button_addRow,
	messages_customizer_screen_section1: EDR.messages.customizer_screen_section1,
	messages_customizer_screen_section2: EDR.messages.customizer_screen_section2,
	messages_customizer_screen_section3: EDR.messages.customizer_screen_section3,

	config_field_icon_from: EDR.config.field_icon_from,
	
	postCreate: function() {
		this.inherited(arguments);
		var banner = dijit.byId(EDR.prefix+"bannerId");
		dojo.style(this.logoffElement,"display",(banner.isLoggedIn ? "" : "none"));
	},
	
	initialize: function(json) {
		this.inherited(arguments);
		
/*		var tbody = this.fieldImageBody;		
		for(var name in json) {
			var result = name.match(/field\.icon\.(.*)/);
			if(result) {
				var fieldname = result[1];
				var tr = dojo.create("tr", null, tbody);
				var td = dojo.create("td", null, tr);
				var input1 = dojo.create("input", {type:"text", className:"dijitComboBox", value: fieldname}, td);
				var td2 = dojo.create("td", null, tr);
				var input2 = dojo.create("input", {type:"text", className:"dijitComboBox", value: json[name]}, td2);
				var td3 = dojo.create("td", null, tr);
				var a = dojo.create("a", {"href": "javascript:;"}, td3);
				var img = dojo.create("img", {src: EDR.contextPath + "/images/delete.gif"}, a);
				a.onclick = function(evt) {
					var node = this;
					var td = node.parentNode;
					var tr = td.parentNode;
					var tbody = tr.parentNode;
					tbody.removeChild(tr);
					dojo.stopEvent(evt)
				}
			}
		}
		
		this._addFieldRow();*/
	},
	
	_onBannerChange: function(evt) {
		var file = this.input_config_banner_file.value;
		var img = dojo.query("div.BannerLogo > img")[0];
		img.src = file;
	},
	
	_onDisplayNameChange: function(evt) {
		var target = evt.target;
		var displayName = target.value;
		var titles = dojo.query("div.BannerProductName");
		titles.attr("innerHTML", displayName);
	},
	
	_onBackgroundChange: function(evt) {
		var target = evt.target;
		var image = target.value;
		dojo.style(dojo.body(), "backgroundImage", "url('"+image +"')");
	},
	
	_onBannerLeftChange: function(evt) {
		var target = evt.target;
		var image = target.value;
		var divs = dojo.query("div.Banner .BannerLeft");
		divs.style("backgroundImage", "url('"+image +"')");		
	},	
	
	_onBannerCenterChange: function(evt) {
		var target = evt.target;
		var image = target.value;
		var divs = dojo.query("div.BannerGroup .BannerCenter");
		divs.style("backgroundImage", "url('"+image +"')");		
	},
	
	_onBannerRightChange: function(evt) {
		var target = evt.target;
		var image = target.value;
		var divs = dojo.query("div.Banner .BannerGroup");
		divs.style("backgroundImage", "url('"+image +"')");		
	},		
	
	_onShowChange: function(evt) {
		var input = evt.target;
		var div = input.parentNode;
		var tr = div.parentNode.parentNode;
		var configkey = dojo.attr(tr, "configkey");
		
		this._changeShowState(configkey);
	},
	
	_changeShowState: function(configkey, state) {
		var postfix = configkey.match(/link\.(.*)\.show/)[1];
		var node1 = dojo.byId(EDR.prefix + "link_" + postfix);
		var node2 = dojo.byId(EDR.prefix + "separator_" + postfix);
		if(node1) {
			dojo.toggleClass(node1, "dijitHidden");
		}
		if(node2) {
			dojo.toggleClass(node2, "dijitHidden");	
		}
	},
	
	_addFieldRow: function() {
		var tbody = this.fieldImageBody;
		
		var tr = dojo.create("tr", null, tbody);
		var td = dojo.create("td", null, tr);
		var input1 = dojo.create("input", {type:"text", className:"dijitComboBox", value: ""}, td);
		var td2 = dojo.create("td", null, tr);
		var input2 = dojo.create("input", {type:"text", className:"dijitComboBox", value: ""}, td2);
		var td3 = dojo.create("td", null, tr);
		var a = dojo.create("a", {"href": "javascript:;"}, td3);
		var img = dojo.create("img", {src: EDR.contextPath + "/images/delete.gif"}, a);
		a.onclick = function(evt) {
			var node = this;
			var td = node.parentNode;
			var tr = td.parentNode;
			var tbody = tr.parentNode;
			tbody.removeChild(tr);
			dojo.stopEvent(evt)
		}

	},

	__dummy__ : ''
});
