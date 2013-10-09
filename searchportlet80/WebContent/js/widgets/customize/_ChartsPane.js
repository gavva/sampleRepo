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
dojo.provide("widgets.customize._ChartsPane");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("widgets.customize._ConfigPane");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.form.Button");

dojo.declare(
"widgets.customize._ChartsPane",
[dijit._Widget, dijit._Templated, widgets.customize._ConfigPane],
{
	chartType: "",
	handlers: [],
	json: null,
	
	constructor: function() {
		this.chartType = "";
		this.handlers = [];
	},
	
	postCreate: function() {
		this.inherited(arguments);
	},
	
	initialize: function(json) {
		this.inherited(arguments);
		this.json=json;
		this.buildCharts(json);
	},
	
	buildCharts: function(json){
		var chartType = this.chartType;
		var chartsDiv = this[chartType+"Body"];
		var chartPropertiesArray = this[chartType+"PropertiesArray"];
		for(var i=1;i<100;i++){
			var titleKey = json[chartType+i+".titleKey"];
			var secondDiv = dojo.create("div",{innerHTML:((titleKey!=undefined)?titleKey+"&nbsp;":""),chartNumber:i}, chartsDiv);
			this.buildButtons(secondDiv);
			var tbl = dojo.create("table", null, secondDiv);
			var tbody = dojo.create("tbody", null, tbl);
			var propLength = chartPropertiesArray.length;
			for(var j=0;j<propLength;j++){
				this.buildChartForm(j, chartPropertiesArray, chartType, tbody, json[chartType+i+"."+chartPropertiesArray[j]]);
			}
			if(!this.hasNext(json, i, chartType)){
				break;
			}
			var hr = dojo.create("hr",null,secondDiv);	
		}
	},
	
	buildChartForm: function(i, chartPropertiesArray, chartType, tbody, itemValue){
		var itemLabel = EDR.messages[chartType+"_"+chartPropertiesArray[i].replace(/\./g, "_")];
		var tr = dojo.create("tr", null, tbody);
		var td = dojo.create("td", {innerHTML:itemLabel}, tr);
		var td2 = dojo.create("td", {name:chartPropertiesArray[i]}, tr);
		var widgetDiv = dojo.create("div", null,td2);
		if((itemValue=="true") ||(itemValue=="false")){
			var checkboxWidget = new dijit.form.CheckBox({value: itemValue,checked:((itemValue=="true")?true:false)},widgetDiv);				
			this.handlers.push(dojo.connect(td2,"onclick",this, "_showItems"));
		}else{
			var input2 = dojo.create("input", {type:"text",className:"dijitComboBox",value:itemValue!=undefined?itemValue:""},widgetDiv);
		}		
	},
	
	buildButtons: function(div){
		var buttonArray = ["up","down","delete"];
		var altArray = [EDR.messages.preferences_resultsColumns_moveBefore,EDR.messages.preferences_resultsColumns_moveAfter,EDR.messages.common_delete];
		for(var i=0; i < buttonArray.length; i++){
			var outer = dojo.create("span",{style:{marginRight:"4px"}},div);
			var button = dojo.create("a", {href: "javascript:;", innerHTML: "<img src='"+EDR.contextPath + "/images/"+buttonArray[i]+".gif' alt='"+ altArray[i] +"' title='"+altArray[i]+"' />"}, outer);
			this._connectHandlers(button, buttonArray[i]);
		}
	},
	
	hasNext: function(json, i, chartType){
		return ((json[chartType+(i+1)+".enable"]!=null)&&(json[chartType+(i+1)+".enable"]!=""));
	},
	
	_connectHandlers: function(elm, operation){
		var self = this;
		self.handlers.push(dojo.connect(elm,"onclick",self,function(evt) {
			self["_"+operation](elm);
		}));
	},
	
	onShow: function() {
	},
	
	_showItems: function(e){
		if(e.target.value=="true"){
			e.target.value="false";
		}else{
			e.target.value="true"
		}
	},
	
	addChartsBlock: function(){
		var chartType = this.chartType;
		var chartsDiv = this[chartType+"Body"];
		var chartPropertiesArray = this[chartType+"PropertiesArray"];
		var chartDefaultValues = this[chartType+"DefaultValues"];
		var secondDiv = dojo.create("div",{innerHTML:EDR.messages[chartType+"_createNewChart"]+"&nbsp;",chartNumber:(chartsDiv.childNodes.length+1)},chartsDiv);
		var previousBlock = secondDiv.previousSibling;
		if(previousBlock!=null){
			var hr = dojo.create("hr",null,previousBlock);
		}
		this.buildButtons(secondDiv);
		var tbl = dojo.create("table", null, secondDiv);
		var tbody = dojo.create("tbody", null, tbl);
		var propLength = chartPropertiesArray.length;
		for(var j=0;j<propLength;j++){
			this.buildChartForm(j, chartPropertiesArray, chartType, tbody, chartDefaultValues[j]);
		}
	},
	
	_exchangeBlock: function(block, refBlock,position){
		var temp = block.getAttribute("chartNumber");
		block.setAttribute("chartNumber",refBlock.getAttribute("chartNumber"));
		refBlock.setAttribute("chartNumber",temp);		
		dojo.place(block, refBlock, position);
	},
	
	_up: function(elm){
		var targetBlock = elm.parentNode.parentNode;
		if(targetBlock.getAttribute("chartNumber")!="1"){
			var refBlock = targetBlock.previousSibling;
			if(!targetBlock.nextSibling){
				var hr = dojo.create("hr",null,targetBlock);
				refBlock.removeChild(refBlock.lastChild);
			}
			this._exchangeBlock(targetBlock,refBlock,"before");
		}
	},
	
	_down: function(elm){
		var targetBlock = elm.parentNode.parentNode;
		if(targetBlock.nextSibling){
			var refBlock = targetBlock.nextSibling;
			if(!refBlock.nextSibling){
				var hr = dojo.create("hr",null,refBlock);
				targetBlock.removeChild(targetBlock.lastChild);
			}
			this._exchangeBlock(targetBlock,refBlock,"after");
		}
	},
	
	_delete: function(elm){
		var targetBlock = elm.parentNode.parentNode;
		var chartsDiv = targetBlock.parentNode;
		var targetChartNumber = targetBlock.getAttribute("chartNumber");
		if((targetBlock.nextSibling==null)&&(targetBlock.previousSibling!=null)){
			//for hr element
			targetBlock.previousSibling.removeChild(targetBlock.previousSibling.lastChild);
		}
		chartsDiv.removeChild(targetBlock);
		var childLength = chartsDiv.childNodes.length;
		for(var i = targetChartNumber; i<=childLength; i++){
			chartsDiv.childNodes[i-1].setAttribute("chartNumber",i);
		}
		dojo.disconnect(elm);
	},
	
	collectData: function(data) {
		if(!data || !data["names"] || !data["values"]) {
			data = { "names": [], "values": [] };
		}
		data = this.collectDataFromNode(data, this.configNode);
		data = this.collectChartsData(data, this.chartType);
		return data;
	},
	
	collectChartsData: function(data, chartType){
		var trs = dojo.query("tr", this[chartType+"Body"]);
		var chartNumber;
		
		trs.forEach(function(tr) {
			chartNumber = tr.parentNode.parentNode.parentNode.getAttribute("chartNumber");
			var td = tr.childNodes[1];
			data.names.push(chartType+chartNumber+"."+td.getAttribute("name"));
			
			var inputObj = td.firstChild.firstChild;
			data.values.push(inputObj.value);
		}, this);
		if(chartNumber==undefined){
			chartNumber=0;
		}
		return data;
	},
	
	destroy: function() {
		dojo.forEach(this.handlers, dojo.disconnect);
		this.inherited("destroy", arguments);
	},
	
	__dummy__: null	
});
