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
dojo.provide("widgets.TypeAhead");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");

dojo.declare(
	"widgets.TypeAhead", [dijit._Widget, dijit._Templated],
	{				
		templateString:"<div class='typeAheadDiv'></div>",
		
		connectedInputElementId: "",
		connectedInputElement : null,
		
		selectedItem: null,
		selectedItemIndex: null,
		defaultValue: "",
		isVisible: false,
		
		//for IE
		typeTimer: null,
		typeDuration: 200,
		
		//for firefox
		loopTimer: null,
		loopTimerDuration: 300,
		
		blurTimer: null,
		stopTimer: false,
		numberOfResults: 10,
		mode: "",
		
		//apply the value when attaching with needSendingOption == false
		needSendingOption: true,
		defaultNumberOfResults: 10,
	
		//prevent showing after enter key
		isExecuteEnter: false,
		
		//prevent showing after the input value become blank
		isEmpty: true,
		
		url:"",
		timeout: 1000,
	
		handlers: [],
		trHandlers: [],
		blurHandler: null,
		
		constructor: function(){
			this.handlers = [];
			this.trHandlers = [];
		},

		//new widgets.TypeAhead()
		postCreate: function() {
			this.inherited("postCreate", arguments);
			if ((this.connectedInputElementId != null)&&(this.connectedInputElementId != "")) {
				this.attach(this.connectedInputElementId);
			}
		},
		
		//create by HTML
		startup: function() {
			this.inherited("startup", arguments);
			//for click the scroll bar
			if(dojo.isIE){
				this.blurHandler = dojo.connect(this.domNode, "onfocus", this, function() {
					if (this.blurTimer != null) {
						clearTimeout(this.blurTimer);
					}
				});
			}
			if ((this.connectedInputElementId != null)&&(this.connectedInputElementId != "")) {
				this.attach(this.connectedInputElementId);
			}
		},
		
		//call after focus on the connected input element 
		attach: function(connectedInputElementId, url, needSendingOption) {
			if(needSendingOption && (this.mode=="off" || this.mode=="allOff")){
				this.detach();
				return;
			}
			if ((connectedInputElementId == null)||(connectedInputElementId == "")||(connectedInputElementId==this.connectedInputElementId)){
				 return;
			}
			if(this.connectedInputElementId!=connectedInputElementId){
				this.detach();
			}
			
			this.connectedInputElementId = connectedInputElementId;
			this.connectedInputElement = dojo.byId(this.connectedInputElementId);
			var targetInput = this.connectedInputElement;
			if(url!=null){
				this.url = url;
			}
			
			this.needSendingOption = needSendingOption;
			
			if(targetInput!=null){
				this.handlers.push(dojo.connect(targetInput,"onkeyup",this,"_onInputKeyup"));
				this.handlers.push(dojo.connect(targetInput,"onblur",this,"_onBlur"));
				this.handlers.push(dojo.connect(targetInput,"onkeydown",this,"_onInputKeyDown"));
				this.handlers.push(dojo.connect(window,"onresize",this,"hideTable"));
			}
		},
		
		detach: function() {
			if(!this.isVisible){
				this.hideTable();
			}
			this.clearTable();
			this.defaultValue = "";
			this.connectedInputElementId = "";
			dojo.forEach(this.handlers, dojo.disconnect);
			if(dojo.isFF){
				this.clearLoopTimer();
			}
		},
		
		showTable: function(){
			var best = dijit.popup.open({
				popup: this,
				around: this.connectedInputElement
			});
			this.isVisible = true;
			this.domNode.style.visibility = "visible";
			dojo.marginBox(this.domNode, {
				w:(dojo.marginBox(this.connectedInputElement)).w
			});
			this.adjustScrollBar();
		},
		
		hideTable: function(){
			dijit.popup.close(this);
			this.isVisible = false;
			this.domNode.style.visibility = "hidden";
		},
		
		_onStartTimer: function(e,self){
			if(self.loopTimer==null){
				return;
			}
			var isFirstStart = (self.loopTimer=="");
			self.loopTimer = setTimeout(function(){
				var value = self.connectedInputElement.value;
				if(self.defaultValue != value){
					self.preLoadTypeAheadSuggestion(e, value);
				}
				self._onStartTimer(e,self);
			}, (isFirstStart ? 0 : self.loopTimerDuration));
		},
		
		//for holding press
		_onInputKeyDown: function(e){
			if(e.keyCode == dojo.keys.ENTER){
				this.onExecute(e, e.target.value);
				this.defaultValue = e.target.value;
				this.isExecuteEnter = true;
			}else{
				this.isExecuteEnter = false;
			}
			if(e.keyCode == dojo.keys.UP_ARROW || e.keyCode == dojo.keys.DOWN_ARROW){
				if(dojo.isFF){
					this.clearLoopTimer();
				}
				this._onKeyUpDownArrow(e.keyCode);
			}else if(dojo.isFF){
				if(e.keyCode == dojo.keys.LEFT_ARROW || e.keyCode == dojo.keys.RIGHT_ARROW){
					this.clearLoopTimer();
				}else if(this.loopTimer==null){
					//set loop start				
					this.loopTimer = "";
					this._onStartTimer(e,this);
				}
			}
			if(e.keyCode == dojo.keys.ESCAPE){
				this.setDisplayValue(this.defaultValue);
				this.hideTable();
			}
		},
		
		_onInputKeyup: function(e){
			var value = e.target.value;
			if(!(dojo.isFF||(e.keyCode == dojo.keys.UP_ARROW)||(e.keyCode == dojo.keys.DOWN_ARROW)||(e.keyCode == dojo.keys.LEFT_ARROW)||(e.keyCode == dojo.keys.RIGHT_ARROW))){
				this._onTypeKeyword(e,value);
			}
		},
		
		loadTypeAheadSuggestionHTML: function(e,keyword) {
			var content = this.getLoadParams(e, keyword);
			var args = 	{ 
				url: this.url,
				showProgress: false,
				successCallback: dojo.hitch(this, function(response, ioArgs) {
					this.hideTable();
					this.disconnectTrHandlers();
					this.selectedItem = null;
					this.selectedItemIndex = null;
					this.buildTableFromHTML(response);
					this.postLoad();		
				}),
				afterErrorHandlerCallback: dojo.hitch(this, function(response, ioArgs) {
					this.loadErrorHandler(response, ioArgs);
				}),
				content: content,
				timeout: this.timeout
			};			
			this.preLoad();					
			EDR.ajax.Request.post(args);
		},
		
		getLoadParams: function(e, keyword) {
			var content = null; 
			if(this.needSendingOption){
				content = {
					"keyword": keyword,
					"numberOfResults": this.numberOfResults,
					"mode": this.mode
				};
			}else{
				content = {
					"keyword": keyword,
					"numberOfResults": this.defaultNumberOfResults
				};			
			}
			return content;
		},
		
		buildTableFromHTML: function(table){
			var self = this;
			if(!self.isExecuteEnter && !self.isEmpty ){
				self.domNode.innerHTML = table;
				//connect handlers after rendering
				var tableNode = self.domNode.firstChild;
				if(tableNode && tableNode.tagName=="TABLE"){
					var trs = dojo.query("tr",tableNode);
					var trLength = trs.length;
					if(trLength>0){
						self.showTable();
						for(var i=0; i<trLength; i++){
							self._trConnectHandlers(trs[i]);
						}
						//for overlay on flash panes
						self.domNode.parentNode.style.zIndex = 900;
					}else{
						self.clearTable();
					}
				}
			}else{
				self.clearTable();
			}
		},
		
		_onTypeKeyword: function(e,value){
			if (this.typeTimer != null) {
				this.clearTypeTimer();
			}
			//to prevent keys which is no input or pre
			if(this.defaultValue == value){
				return;
			}
		 	this.typeTimer = setTimeout(dojo.hitch(this, function(){
		 		this.preLoadTypeAheadSuggestion(e, value);
		 	}), this.isFirstType(value) ? 0 : this.typeDuration);
		},
		
		preLoadTypeAheadSuggestion: function(e, value){
			this.defaultValue = value;
			if(value.length>0){
				this.isEmpty = false;
				this.loadTypeAheadSuggestionHTML(e,value);
			}else{
				this.clearTable();
				//prevent showing after ajax callback
				this.defaultValue = "";
				this.isEmpty = true;
			}			
			if(!dojo.isFF){
				this.clearTypeTimer();
			}
		},
		
		_onKeyUpDownArrow: function(keyCode){
			if(this.domNode.firstChild){
				if(!this.isVisible){
					this.showTable();
				}else{
					if(keyCode == dojo.keys.DOWN_ARROW){
						this.selectedItem = this.getNextTr(this.selectedItemIndex);
					}else if(keyCode == dojo.keys.UP_ARROW){
						this.selectedItem = this.getPreviousTr(this.selectedItemIndex);						
					}
					if(this.selectedItem != null){
						var firstTd = this.selectedItem.firstChild;
						if(firstTd){						
							dojo.addClass(this.selectedItem,"selected");
							var value = dojo.attr(firstTd,"value");
							if(value!=null){
								this.setDisplayValue(value);
							}
							this.adjustScrollBar();
						}
					}else{
						this.setDisplayValue(this.defaultValue);
					}
				}					
			}
		},
		
		_onKeyEnter: function(e){
			if(this.isVisible && this.selectedItem != null){
				this.hideTable();
			}
		},
		
		_trConnectHandlers: function(elm){
			var self = this;
			self.trHandlers.push(dojo.connect(elm,"onmouseover",self,function(e) {
				self._onTrMouseOverHandler(elm,e);
			}));
			self.trHandlers.push(dojo.connect(elm, "onclick", self,function(e) {
				self._onTrClickHandler(elm,e);
			}));
		},
		
		_onTrMouseOverHandler: function(elm, e){
			if(this.selectedItem!=null){
				dojo.removeClass(this.selectedItem,"selected");
			}
			dojo.addClass(elm,"selected");
			this.selectedItem = elm;
			this.changeSelectedIndex();
		},
		
		changeSelectedIndex: function(){
			var tableNode = this.domNode.firstChild;
			if(tableNode!=null){
				var trNodes = dojo.query("tr",tableNode);
				var length = trNodes.length;
				for(var i=0; i<length; i++){
					if(trNodes[i]==this.selectedItem){
						this.selectedItemIndex = i;
						break;
					}
				}
			}			
		},
		
		_onTrClickHandler: function(elm,e){
			var firstTd = elm.firstChild;
			if(firstTd && firstTd.tagName=="TD"){
				var value = dojo.attr(firstTd,"value");
				this.setDisplayValue(value);
				this.hideTable();
				this.connectedInputElement.focus();
				this.onExecute(e, firstTd.innerHTML);
				this.defaultValue = value;
			}
		},
		
		//for override
		onExecute: function(e, value){

		},
		
		_onBlur: function(){
			if(this.isVisible){
				//activate onclick handler on the table 
				this.blurTimer = setTimeout(dojo.hitch(this, function() {
					 this.blurTimer = null;
					 this.hideTable();
				}), 300);
			}
			if(dojo.isFF){
				this.clearLoopTimer();
			}
		},
		
		clearLoopTimer: function(){
			if(this.loopTimer != null){
				clearTimeout(this.loopTimer);
				this.loopTimer = null;
			}
		},
		
		clearTypeTimer: function(){
			clearTimeout(this.typeTimer);
			this.typeTimer = null;
		},
		
		isFirstType: function(value){
			if(this.defaultValue.length==0 && value.length==1){
				return true;
			}else{
				return false;
			}
		},

		adjustScrollBar: function(){
			var tableNode = this.domNode.firstChild;
			if(tableNode){
				if(dojo.contentBox(this.domNode).h < dojo.contentBox(tableNode).h){
					if(this.selectedItem != null){
						dijit.scrollIntoView(this.selectedItem);
					}
				}
			}
		},
		
		clearTable: function(){
			this.hideTable();
			var tableNode = this.domNode.firstChild;
			if(tableNode){
				//disconnect event on table cell
				this.disconnectTrHandlers();
				this.domNode.removeChild(tableNode);
			}
			this.selectedItem = null;
			this.selectedItemIndex = null;
		},
		
		disconnectTrHandlers: function(){
			var length = this.trHandlers.length;
			for(var i=0;i<length;i++){
				dojo.disconnect(this.trHandlers[i]);
			}
		},
		
		getNextTr: function(index){
			var tableNode = this.domNode.firstChild;
			if(tableNode!=null){
			var trNodes = dojo.query("tr",tableNode);
				if(trNodes.length>0){
					if(index != null){
						dojo.removeClass(this.selectedItem,"selected");
						if(index==(trNodes.length-1)){
							this.selectedItemIndex = null;
							return null;
						}else{
							this.selectedItemIndex = this.selectedItemIndex + 1;
							return trNodes[this.selectedItemIndex];
						}						
					}else{
						this.selectedItemIndex = 0;
						return trNodes[0];
					}
				}
			}
			this.selectedItemIndex = null;
			return null;
		},
		
		getPreviousTr: function(index){
			var tableNode = this.domNode.firstChild;
			if(tableNode!=null){
			var trNodes = dojo.query("tr",tableNode);
				if(trNodes.length>0){
					if(index != null){
						dojo.removeClass(this.selectedItem,"selected");
						if(index==0){
							this.selectedItemIndex = null;
							return null;
						}else{
							this.selectedItemIndex = this.selectedItemIndex - 1;
							return trNodes[this.selectedItemIndex];
						}
					}else{
						this.selectedItemIndex = trNodes.length - 1;
						return trNodes[trNodes.length - 1];
					}
				}
			}
			this.selectedItemIndex = null;
			return null;
		},
		
		setDisplayValue: function(value){
			this.connectedInputElement.value = value;
		},
		
		setWidth: function(value){
			this.domNode.style.width = value + "px";
		},
		
		setURL: function(url){
			this.url = url;
		},
		
		setNumberOfResults: function(numberOfResults){
			this.numberOfResults = numberOfResults;
		},
		
		setMode: function(mode){
			this.mode = mode;
		},
		
		preLoad: function() {},		
		
		postLoad: function() {},	
		
		loadErrorHandler: function(response, ioArgs) {

		},
		
		destroy: function() {
			dojo.forEach(this.handlers, dojo.disconnect);
			if(dojo.isIE){
				dojo.disconnect(this.blurHandler);
			}
			this.inherited("destroy", arguments);
		}
	}
);