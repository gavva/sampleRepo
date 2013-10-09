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
dojo.provide("widgets.customize._ConfigPane");

dojo.declare(
"widgets.customize._ConfigPane",
null,
{

	initialize: function(json) {
		var trs = dojo.query("tr", this.domNode);
		trs.forEach(function(tr) {
			var key = dojo.attr(tr, "configkey");

			if(key){

				var messagekey = dojo.attr(tr, "messagekey");
				var configtype = dojo.attr(tr, "configtype");
				if(!messagekey) {
					messagekey = key;
				}
				var value = json[key];
				if(typeof(value) == "undefined") {
					value = "";
				}
		
				var td = dojo.query("> td", tr);
				var inputs = dojo.query("input", tr);
				
				td[0].innerHTML = EDR.messages[messagekey.replace(/\./g, "_")];
				
				if(configtype == "bool") {
					var divs = dojo.query("> div", td[1]);
					if(divs && divs[0]) {
						var checkbox = dijit.byNode(divs[0]);
						checkbox.attr("value", value.toLowerCase() == "true");
					}
				}else if(configtype == "yesno"){
					var divs = dojo.query("> div", td[1]);
					if(divs && divs[0]) {
						var checkbox = dijit.byNode(divs[0]);
						checkbox.attr("value", value.toLowerCase() == "yes");
					}		
				}else if(configtype == "select"){
					var divs = dojo.query("> div", td[1]);
					if(divs && divs[0]) {
						var select = dijit.byNode(divs[0]);
						try {
							select.setValue(value);	
						} catch(e) {
						}
					}
				} else if(configtype == "numberlist") {
					var firstComma = value.indexOf(',');
					var defaultValue = value.substring(0, firstComma);
					var restStr = value.substring(firstComma + 1); 
					if(inputs[0]) {
						inputs[0].value = defaultValue;
					}
					if(inputs[1]) {
						inputs[1].value = restStr;
					}
				} else {
					if(inputs[0]) {
						inputs[0].value = value;
					}				
				}
			}
			
		}, this);
	},
	
	collectData: function(data) {
		if(!data || !data["names"] || !data["values"]) {
			data = { "names": [], "values": [] };
		}
		return this.collectDataFromNode(data, this.domNode);;
	},
	
	collectDataFromNode: function(data, node){
		var trs = dojo.query("tr", node);
		trs.forEach(function(tr) {
			
			var key = dojo.attr(tr, "configkey");
			var configtype = dojo.attr(tr, "configtype");
			data.names.push(key);
			var tds = dojo.query("> td", tr);
			var value;
			if(configtype == "bool") {
				var divs = dojo.query("> div", tds[1]);
				if(divs && divs[0]) {
					var checkbox = dijit.byNode(divs[0]);
					value = checkbox.attr("value");
					if(value == "on") {
						value = true;
					}
//					console.debug("value:", value);
				}
			} else if(configtype == "yesno"){
				var divs = dojo.query("> div", tds[1]);
				if(divs && divs[0]) {
					var checkbox = dijit.byNode(divs[0]);
					value = checkbox.attr("value");
					value = (!value) ? "No" : "Yes";
				}
			} else if(configtype == "select") {
				var divs = dojo.query("> div", tds[1]);
				if(divs && divs[0]) {
					var select = dijit.byNode(divs[0]);
					value = select.getValue();
				}				
			} else if(configtype == "numberlist") {
				var inputs = dojo.query("input", tr);
				if(inputs[0] && inputs[1]) {
					if (inputs[0].value != "" && inputs[1].value != "") {
						value = inputs[0].value + "," + inputs[1].value;
					} else if (inputs[0].value != "") {
						value = inputs[0].value;
					} else {
						value = inputs[1].value
					}
				}				
			} else {
				var inputs = dojo.query("input", tr);
				if(inputs[1]){
					value = inputs[1].value;
				}else if(inputs[0]) {
					value = inputs[0].value;
				} else {
					var select = dojo.query("select", tr);
					value = select.value;
				}
			}
			
			data.values.push(value);
		}, this);
		
		return data;
	}
	
});
