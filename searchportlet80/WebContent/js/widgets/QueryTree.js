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
dojo.provide("widgets.QueryTree");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit.form.Button");
dojo.require("dojo._base.xhr");

dojo.declare(
	"widgets.QueryTree", [dijit._Widget, dijit._Templated],
	{				
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl("widgets", "templates/QueryTree.html"),
		imgBasePath: EDR.config.imageBaseDir,
		title: "",
		
		slideTabContent: null,
		resultBottomBar: null,
		
		url:"",
		trLength: 0,
		selectedCell: null,
		selectedCellId: -1,
		
		handlers: [],
		tdHandlers: [],
		_cellNum: [0],
		cellId:0,
		timeout: 10000,
		
		maxDepth: 0,
		LIMIT_TABLE_HEIGHT : 230,
		
		messages_querytree_label_docs : EDR.messages.querytree_label_docs,
		messages_querytree_label_doc : EDR.messages.querytree_label_doc,
		
		postCreate: function() {
			this.inherited("postCreate", arguments);
			this.title = dijit.byId(EDR.prefix+"queryTreeTab").title;
			dojo.subscribe("postLoad", this, "_processSearch");
		},
		
		startup: function() {
			this.url = EDR.contextPath + "/queryTree?action=loadQueryTree";
			this.inherited(arguments);
			this.slideTabContent = dijit.byId(EDR.prefix+"queryTreeTab");
			this.resultsBottomBar = dijit.byId(EDR.prefix+"horizontalSearchPanes").resultBottomBar;
//			this.handlers.push(dojo.connect(this.slideTabContent, "afterOpen", this, "onOpen"));
//			this.handlers.push(dojo.connect(this.slideTabContent, "afterClose", this, "onClose"));			
			dojo.subscribe("afterSlideTabOpened", this, "onOpen");
			dojo.subscribe("afterSlideTabClosed", this, "onClose");
		},
		
		onOpen: function(event) {
			if (event.contentId == (EDR.prefix+"queryTreeTab")) {
				this.load();
				dojo.style(this.domNode.parentNode,"overflow","auto");
				dojo.byId(EDR.prefix+"queryTreeTab").title = "";
			}
		},
		
		onClose: function(event) {
			if (event.contentId == (EDR.prefix+"queryTreeTab")) {
				dojo.style(this.domNode.parentNode,"overflow","hidden");
				this.resultsBottomBar.revertMessage();
				this.clear();
				dojo.byId(EDR.prefix+"queryTreeTab").title = this.title;
			}
		},
		
		_processSearch: function(){
			if(this.slideTabContent.opened)
				this.load();
		},
		
		load: function(){
			this.preLoad();					
			var args = 	{ 
				url: this.url,
				successCallback: dojo.hitch(this, function(response, ioArgs) {
					var json = null;
					try {
						if(response!=""){
							json = dojo.fromJson(response);
						}
					} catch (e) {
			        	this.loadErrorHandler(response, ioArgs);
			        	return;
					}
					if(json!=null){
						this.loadJson(json.text,json.leafCount,json.instanceId);
					}else{
						this.clear();
					}
					this.postLoad();					
				}),
				afterErrorHandlerCallback: dojo.hitch(this, function(response, ioArgs) {
					this.loadErrorHandler(response, ioArgs);
				}),
				timeout: this.timeout,
				showProgress: false
			};
			EDR.ajax.Request.post(args);
		},
		
		loadJson: function(json,leafCount,nodeId) {
					this.selectedCell= null;
					this._initConjunctionsTable(json,leafCount);
					this.selectedCell = dojo.byId(this.selectedCellId);
					if(this.selectedCell!=null)
						dojo.addClass(this.selectedCell, "selected");

					//add a scrollbar and adjust the cell's width if cell's width is over LIMIT_CELL_WIDTH 
					var firstTd = this.conjunctionsTableBody.firstChild.firstChild;
					if(firstTd!=null)
						this._adjustCellWidth(firstTd);
		},
		
		loadErrorHandler: function() {
			EDR.ajax.Loading.clearIsLoading(this.domNode);
		},

		_initConjunctionsTable: function(json,leafNum) {
			this.clear();
			if (json==null) return;			
			var trs=[];
			for(var i=0;i<leafNum;i++){
				trs.push(dojo.create("tr", {className: "trClass"}, this.conjunctionsTableBody));
			}
			this.trLength = trs.length;
			this._renderTable(json,0,trs,this);
		},
		
		_renderTable: function(obj,depth,trs,self){
			if(self.maxDepth<depth){
				self.maxDepth = depth;
			}
			if((depth!=0)&&(self._cellNum.length<=depth)){
				self._cellNum.push(self._cellNum[depth-1]);
			}
			if (obj.nodeType == "leaf") {
				var td = dojo.create("td",{className:"leaf",cellId:self.cellId,id:obj.id,tabindex:"0",
					innerHTML: obj.objLabel+ " : \" "+obj.value+" \" "+obj.count+" "+(((obj.count==0)||(obj.count==1))?self.messages_querytree_label_doc:self.messages_querytree_label_docs)+" ",
					nodesType:obj.nodeType,objType:obj.objType,count:obj.count,value:obj.value,style:{overflow:"hidden"}},trs[(self._cellNum[depth])]);
				if(!(obj.objType=="option"||((obj.value=="*:*")&&(self.trLength==1)))){
					var aObj = dojo.create("a",{href:"javascript:;"},td);
					var imgObj = dojo.create("img",{src:self.imgBasePath+"delete23.png",
						alt:EDR.messages.common_delete,
						title:EDR.messages.common_delete,
						style:{padding:"1px",width:"15px",height:"15px",backgroundColor:"transparent"}},aObj);
					self._connectHandlers(td);
				}else if((obj.value=="*:*")&&(self.trLength==1)){
					self._connectHandlers(td);
				}else if(obj.objType=="option"){
					dojo.addClass(td, "option");
				}
				self.cellId++;
				
				for(var i=depth;i<self._cellNum.length;i++)
					self._cellNum[i]++;
					
				return 1;
			} else {
				var rowspanNum = 0;
				var length = obj.children.length;
				for(var i=0;i<length;i++){
					rowspanNum+=arguments.callee(obj.children[i],depth+1,trs,self);
				}
				var td = dojo.create("td",{cellId:self.cellId,id:obj.id,tabindex:"0",innerHTML: obj.objType+" : "+obj.count+" "+(((obj.count==0)||(obj.count==1))?self.messages_querytree_label_doc:self.messages_querytree_label_docs)+" "
				,rowSpan:rowspanNum,nodesType:obj.nodeType,objType:obj.objType,count:obj.count,style:{overflow:"hidden"}},trs[self._cellNum[depth]],"first");
				if(obj.nodeType!="option"){
					var aObj = dojo.create("a",{href:"javascript:;"},td);
					var imgObj = dojo.create("img",{src:self.imgBasePath+"delete23.png",
					alt:EDR.messages.common_delete,
					title:EDR.messages.common_delete,
					style:{padding:"1px",width:"15px",height:"15px"}},aObj);
					self._connectHandlers(td);
				}else{
					dojo.addClass(td, "option");
				}
				
				self.cellId++;
				self._cellNum[depth]+=rowspanNum;
				return rowspanNum;
			}
		},
		
		_adjustCellWidth: function(firstTd){
			var table = this.queryTreeTable;
			var queryTreeNode =table.parentNode;
			if(dojo.marginBox(this.conjunctionsTableBody).h > this.LIMIT_TABLE_HEIGHT||(this.maxDepth+1)>3){
				dojo.style(queryTreeNode.parentNode,"overflowX","auto");
				dojo.style(queryTreeNode.parentNode,"overflowY","auto");
			}else{
				dojo.style(queryTreeNode.parentNode,"overflowX","hidden");
				dojo.style(queryTreeNode.parentNode,"overflowY","hidden");
			}
			if((this.maxDepth+1)>3){
				dojo.style(table,"width",(178*(this.maxDepth+1))+"px");
				dojo.query("td",this.conjunctionsTableBody).forEach(function(td) {
					dojo.style(td,"width","176px");
				});
			}else{
				dojo.style(table,"width","100%");
				dojo.query("td",this.conjunctionsTableBody).forEach(function(td) {
					dojo.style(td,"width",null);
				});
				dojo.style(queryTreeNode.parentNode,"overflowX","hidden");
			}
		},
		
		preLoad: function() {
			EDR.ajax.Loading.setIsLoading(this.domNode);
		},
		
		postLoad: function() {
			EDR.ajax.Loading.clearIsLoading(this.domNode);
		},
		
		clear: function() {
			dojo.forEach(this.tdHandlers, dojo.disconnect);
			dojo.empty(this.conjunctionsTableBody);
			this._cellNum=[0];
			this.cellId=0;
			this.maxDepth=0;
		},
		
		_connectHandlers: function(elm){
				var self = this;
				self.tdHandlers.push(dojo.connect(elm,"onmouseover",self,function(evt) {
					self._onMouseOverHandler(elm,evt);
				}));
				self.tdHandlers.push(dojo.connect(elm, "onmouseout", self,function(evt) {
					self._onMouseOutHandler(elm,evt);
				}));
				self.tdHandlers.push(dojo.connect(elm, "onclick", self,function(evt) {
					self._onSelectedHandler(elm,evt);
				}));
				self.tdHandlers.push(dojo.connect(elm, "onkeypress", self,function(evt) {
					self._onSelectedHandler(elm,evt);
				}));	
				var a = elm.getElementsByTagName("A");
				if(a.length>0){
					self.tdHandlers.push(dojo.connect(elm.getElementsByTagName("A")[0], "onclick", this,function(evt) {
							self._onDeleteHandler(elm);
					}));
				}
		},
		
		_onSelectedHandler: function(elm,evt){
			var self = this;
			if(evt.type != "click" && evt.charCode != dojo.keys.SPACE) return;
			if(self.selectedCell){
				dojo.removeClass(self.selectedCell, "selected");
			}
			if(self.selectedCell!=elm){
				dojo.removeClass(elm,"mouseOver");
				dojo.addClass(elm, "selected");
				self.selectedCell = elm;
				self.selectedCellId = elm.id;
			}else{
				dojo.removeClass(elm, "selected");
				dojo.addClass(elm, "mouseOver");
				self.selectedCell = null;
				self.selectedCellId = -1;
			}
		},
		
		_onMouseOverHandler: function(elm,evt){
			if(!dojo.hasClass(elm,"selected")){
				dojo.addClass(elm,"mouseOver");
			}
		},
		
		_onMouseOutHandler: function(elm,evt){
			dojo.removeClass(elm,"mouseOver");
		},		

		_onDeleteHandler: function(elm,evt){
			var rootId = dojo.attr(this.conjunctionsTableBody.firstChild.firstChild,"cellId");
			var deleteId = dojo.attr(elm,"cellId");
			var searchManager = dijit.byId(EDR.prefix+"searchManager");
			if(rootId==deleteId){
				searchManager.submitQuickKeywordSearch("*:*");				
			}else{
				params = {
					"rootId": rootId,
					"deleteId": deleteId
				};
				searchManager.removeTreeNode(null,"removeTreeNode",params);
			}
		},
		
		getSelectedCell: function(){
			return this.selectedCell;
		},
		
		_getNullResults: function() {
			return null;
		},
				
		destroy: function() {
			dojo.forEach(this.handlers, dojo.disconnect);
			this.inherited("destroy", arguments);
		}
	}
);