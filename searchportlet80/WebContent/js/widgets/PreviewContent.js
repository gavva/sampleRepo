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
dojo.provide("widgets.PreviewContent");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit.form.Button");
dojo.require("widgets.Toolbar");

dojo.declare(
	"widgets.PreviewContent", [dijit._Widget, dijit._Templated],
	{				
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl("widgets", "templates/PreviewContent.html"),
		dialog: null,
		
		documentId: "",
		
		url: "",
		timeout: 10000,
		handlers: [],
		
		highlightList: [],
		currentHighlightSpan:null,
		highlightIndex: null,
		
		//trancate for long title
		fontStyle: "font-size:13px;",
		limitWidthForTitle: 300,
		
		messages_tooltip_preview_previous: EDR.messages.tooltip_preview_previous,
		messages_tooltip_preview_next: EDR.messages.tooltip_preview_next,
		messages_preview_document_title :EDR.messages.preview_document_title,
		messages_preview_document_date :EDR.messages.preview_document_date,
		
		postCreate: function() {
			this.inherited("postCreate", arguments);
			this.handlers.push(dojo.connect(this._supportingWidgets[1], "onClick", this, function() {
				this.previousHighlight();
			}));
			this.handlers.push(dojo.connect(this._supportingWidgets[2], "onClick", this, function() {
				this.nextHighlight();
			}));		
		},
		
		startup: function() {
			this.inherited(arguments);
			this.dialog = dijit.byId(EDR.prefix+"previewDialog");

			this.handlers.push(dojo.connect(this.dialog.okButtonNode, "onClick", this, function() {
				this.dialog.cancelFunction();
			}));
		},
				
		loadErrorHandler: function() {
		},
		
		setDocumentParams: function(params, fullQuery) {
			this.documentId = params.documentID;
			this.collectionId = params.collectionID;
			this.documentTitle.innerHTML = this._getTruncatedLabel(params.title,this.limitWidthForTitle);
			this.documentTitle.title = params.title;
			this.documentDate.innerHTML = params.date;
			this.description = params.description;
			this.previewBody.innerHTML = "";
			this.preLoad();
			dojo.xhrPost({
						url: EDR.contextPath + "/preview?action=loadPreview",
						content: {"did": this.documentId, "cid": this.collectionId, "query": fullQuery},
						load: dojo.hitch(this, "_onLoad"),
						error: dojo.hitch(this, "_onError"),
						timeout: dojo.hitch(this, "_onTimeout")
					});
		},
		
		_onLoad: function(response, ioArgs) {
			this.postLoad();
			if(response!=null){
				this.previewBody.innerHTML = response;
				this.previewBody.scrollTop = 0;
				this.clearHighlight();
				this.setHighlightList();
			}
		},
		
		setHighlightList: function(){
			var spans = this.previewBody.getElementsByTagName("span");
			var length = spans.length;
			if(length>0){
				for(var i=0;i<length;i++){
					if(spans[i].className=="OFHighlightTerm1"||spans[i].className=="OFHighlightTerm2"||spans[i].className=="OFHighlightTerm3"||spans[i].className=="OFHighlightTerm4"||spans[i].className=="OFHighlightTerm5"){
						this.highlightList.push(spans[i]);
					}
				}
			}			
		},
		
		_onError: function(response, ioArgs) {
			this.previewBody.innerHTML = EDR.messages.preview_prompt_documentNotAvailable+"<br /><br />" +this.description;
		},
		
		_onTimeout: function(response, ioArgs) {
			this.previewBody.innerHTML = EDR.messages.preview_prompt_documentNotAvailable+"<br /><br />" +this.description;
		},
		
		previousHighlight: function(){
			if(!(this.highlightList==null||this.highlightList.length==0)){
				if(this.currentHighlightSpan!=null){
					this.removeHighlight(this.currentHighlightSpan);
				}
				var length = this.highlightList.length
				if(this.highlightIndex==null){
					this.highlightIndex = length-1;
				}else{
					this.highlightIndex--;
				}
				if(this.highlightIndex<0){
					this.highlightIndex = length-1;
				}
				this.buildHighlightSpan();
			}
		},

		nextHighlight: function(){
			if(!(this.highlightList==null||this.highlightList.length==0)){
				if(this.currentHighlightSpan!=null){
					this.removeHighlight(this.currentHighlightSpan);
				}
				var length = this.highlightList.length
				if(this.highlightIndex==null){
					this.highlightIndex = 0;
				}else{
					this.highlightIndex++;	
				}		
				if(this.highlightIndex>length-1){
					this.highlightIndex = 0;
				}
				this.buildHighlightSpan();
			}
		},
		
		buildHighlightSpan: function(){
			this.currentHighlightSpan = this.highlightList[this.highlightIndex];
			dojo.addClass(this.highlightList[this.highlightIndex],"selectedOFHighlightTerm");
			dojo.attr(this.currentHighlightSpan,"tabindex",0);
			this.currentHighlightSpan.focus();
		},
		
		removeHighlight: function(span){
			dojo.removeAttr(span,"tabindex");
			dojo.removeClass(span,"selectedOFHighlightTerm");
		},
		
		clear: function(){
			this.clearHighlight();
		},
		
		clearHighlight: function(){
			this.highlightIndex = null;
			this.highlightList = [];
			this.currentHighlightSpan = null;
		},

		preLoad: function() {
			EDR.ajax.Loading.setIsLoading(this.domNode);
		},
		
		postLoad: function() {
			EDR.ajax.Loading.clearIsLoading(this.domNode);
		},
		
		_getTruncatedLabel: function(item, width) {
			var label = item + ""/*hack: object2string*/; 
			if (this._getStringExtent(label) < width) {
				return label;
			} else {
				var ellipse = "...";
				var labelWidth = width - this._getStringExtent(ellipse);
				if (labelWidth > 0) { 	
					for (var i=0; i<label.length; i++) {
						var s = label.slice(0, i);
						if (labelWidth < this._getStringExtent(s) && i > 0) {
							return label.slice(0, i-1) + ellipse;
						}
			}
		}
				return ellipse;
			}
		},
		
		_getStringExtent: function(str) {
			this.hiddenSpan.innerHTML = str;
			var size = this.hiddenSpan.offsetWidth;
			this.hiddenSpan.innerHTML = "";
			return size;
		},
				
		destroy: function() {
			dojo.forEach(this.handlers, dojo.disconnect);
			this.inherited("destroy", arguments);
		}
	}
);