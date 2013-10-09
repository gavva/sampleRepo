//*********************** ES COPYRIGHT START  *********************************
// @copyright(external)
// 
// Licensed Materials - Property of IBM
// 5724-Z21
// (C) Copyright IBM Corp. 2003, 2012.
// 
// US Government Users Restricted Rights - Use, 
// duplication or disclosure restricted by GSA ADP 
// Schedule Contract with IBM Corp.
// 
// IBM grants you ("Licensee") a non-exclusive, royalty free, license to use,
// copy and redistribute the Non-Sample Header file software in source and
// binary code form, provided that i) this copyright notice, license and
// disclaimer  appear on all copies of the software; and ii) Licensee does
// not utilize the software in a manner which is disparaging to IBM.
// 
// This software is provided "AS IS."  IBM and its Suppliers and Licensors
// expressly disclaim all warranties, whether  EXPRESS OR IMPLIED, INCLUDING
// ANY IMPLIED WARRANTY OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE
// OR WARRANTY OF  NON-INFRINGEMENT.  IBM AND ITS SUPPLIERS AND  LICENSORS
// SHALL NOT BE LIABLE FOR ANY DAMAGES SUFFERED BY LICENSEE THAT RESULT FROM
// USE OR DISTRIBUTION OF THE SOFTWARE OR THE COMBINATION OF THE SOFTWARE
// WITH ANY OTHER CODE.  IN NO EVENT WILL IBM OR ITS SUPPLIERS  AND LICENSORS
// BE LIABLE FOR ANY LOST REVENUE, PROFIT OR DATA, OR FOR DIRECT, INDIRECT,
// SPECIAL, CONSEQUENTIAL, INCIDENTAL OR PUNITIVE DAMAGES, HOWEVER CAUSED AND
// REGARDLESS OF THE THEORY OF LIABILITY, ARISING OUT OF THE USE OF OR
// INABILITY TO USE SOFTWARE, EVEN IF IBM HAS BEEN ADVISED OF THE POSSIBILITY
// OF SUCH DAMAGES.
// 
// @endCopyright
//*********************** ES COPYRIGHT END  ***********************************
dojo.provide("widgets.analytics.PreviewContent");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit.form.Button");
dojo.require("dijit.layout.SplitContainer");
dojo.require("dijit.layout.ContentPane");
dojo.require("widgets.Toolbar");

dojo.declare(
	"widgets.analytics.PreviewContent", [dijit._Widget, dijit._Templated],
	{				
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl("widgets.analytics", "templates/PreviewContent.html"),
		dialog: null,
		
		documentId: "",
		
		url: "",
		timeout: 10000,
		handlers: [],
		detailHandlers: [],
		
		highlightList: [],
		currentHighlightSpan:null,
		highlightIndex: null,
		
		selectedDetailCell: null,
		
		resultHighlightedText: "",
		text:"",
		previewClicked:false,
		
		//trancate for long title
		fontStyle: "font-size:13px;",
		limitWidthForTitle: 300,
		
		messages_tooltip_preview_previous: EDR.messages.tooltip_preview_previous,
		messages_tooltip_preview_next: EDR.messages.tooltip_preview_next,
		messages_analytics_preview_nameLabel :EDR.messages.analytics_preview_nameLabel,
		messages_analytics_preview_valueLabel :EDR.messages.analytics_preview_valueLabel,
		messages_analytics_preview_standardInfoLabel :EDR.messages.analytics_preview_standardInfoLabel,
		messages_analytics_preview_keywordInfoLabel :EDR.messages.analytics_preview_keywordInfoLabel,
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
			this.handlers.push(dojo.connect(this.previewDisplay.domNode, "onclick", this, function() {
				this.changeToResultHighlight();
			}));
		},
		
		startup: function() {
			this.inherited(arguments);
			this.dialog = dijit.byId(EDR.prefix+"previewDialog");
			this.handlers.push(dojo.connect(this.dialog.okButtonNode, "onClick", this, function() {
				this.dialog.cancelFunction();
			}));
		},
				
		loadErrorHandler: function(response, ioArgs) {
		},
		
		setDocumentParams: function(params, fullQuery) {
			this.documentId = params.documentID;
			this.collectionId = params.collectionID;
			this.documentTitle.innerHTML = this._getTruncatedLabel(params.title,this.limitWidthForTitle);
			this.documentTitle.title = params.title;
			this.documentDate.innerHTML = params.date;
			this.description = params.description;
			this.load(fullQuery);
		},
		
		load: function(fullQuery){
			this.clear();
			this.preLoad();					
			var args = 	{ 
				url: EDR.contextPath + "/preview?action=loadAnalyticsPreview",
				successCallback: dojo.hitch(this, function(response, ioArgs) {
					try {
						var json = null;
						json = dojo.fromJson(response);
					} catch (e) {
			        	this.loadErrorHandler(response, ioArgs);
			        	return;
					}
					this.loadJson(json);
					this.postLoad();					
				}),
				afterErrorHandlerCallback: dojo.hitch(this, function(response, ioArgs) {
					this.loadErrorHandler(response, ioArgs);
				}),
				content: {"did": this.documentId, "cid": this.collectionId, "query": fullQuery},
				timeout: this.timeout,
				showProgress: false,
				handleAs:"text"
			};
			EDR.ajax.Request.post(args);
		},
		
		loadJson: function(json){
			if(json==null){
				return;
			}else{
				var previewBody = json.previewBody;
				if(previewBody){
					//This widget has text as HTML because innnerHTML changes some text like spaces.
					this.resultHighlightedText = previewBody;
					this.previewBody.innerHTML =previewBody;
				}
				if(json.detailBody){
					this.buildDetailView(json.detailBody);
				}
				this.previewBody.scrollTop = 0;
//				this.highlightList = dojo.query("span.OFHighlightTerm1",this.previewBody);
				this.setHighlightList();
				this.previewSplitContainer.resize();
				this.previewInnerSplitContainer.resize();
				this.previewClicked=true;
			}
		},
		
		previousHighlight: function(){
			if(!(this.highlightList==null||this.highlightList.length==0)){
				if(this.currentHighlightSpan!=null){
					this.removeHighlight(this.currentHighlightSpan);
				}
				var length = this.highlightList.length;
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
				var length = this.highlightList.length;
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
			dojo.forEach(this.detailHandlers, dojo.disconnect);
			dojo.empty(this.keywordInfoBody);
			dojo.empty(this.standardInfoBody);
			dojo.empty(this.previewBody);
			this.resultHighlightedText = "";
			this.clearHighlight();
		},
		
		clearHighlight: function(){
			this.highlightIndex = null;
			this.highlightList = [];
			this.currentHighlightSpan = null;
		},
		
		buildDetailView: function(detailJson){
			this.text = this.reEscapeBrElement(detailJson.inputText);
			this.buildStandardTable(detailJson.standardInfos);
			this.buildKeywordTable(detailJson.keywordInfos);
		},
		
		buildStandardTable: function(standardInfoJson){
			var standardInfos = standardInfoJson;
			var length = standardInfos.length;
			for(var i=0;i<length;i++){
				var oddEven = (i % 2 == 0 ? "even" : "odd");
				var tr = dojo.create("tr",{className:oddEven,tabindex:0}, this.standardInfoBody);
				dojo.create("td",{innerHTML:standardInfos[i].category},tr);
				dojo.create("td",{innerHTML:standardInfos[i].keyword},tr);
			}
		},
		
		buildKeywordTable: function(keywordInfoJson){
			var keywordInfos = keywordInfoJson;
			var keywordInfoLength = keywordInfos.length;
			for(var i=0;i<keywordInfoLength;i++){
				var oddEven = (i % 2 == 0 ? "even" : "odd");
				var keyword = keywordInfos[i].keyword;
				var beginOffset = keywordInfos[i].beginOffset;
				var beginEncodedOffset = keywordInfos[i].beginEncodedOffset;
				var endOffset = keywordInfos[i].endOffset;
				var endEncodedOffset = keywordInfos[i].endEncodedOffset;
				var title = EDR.messages.preview_label_value+": \""+ keyword +"\", "+EDR.messages.preview_label_beginOffset+": "+ beginOffset + ", "+EDR.messages.preview_label_endOffset+": " + endOffset;
				var tr = dojo.create("tr",{className:oddEven,tabindex:0, title:title, style:{cursor:"pointer"}},this.keywordInfoBody);
				dojo.create("td",{innerHTML:keywordInfos[i].category},tr);
				dojo.create("td",{innerHTML:keyword},tr);
				this._connectHandlerToDetail(tr,beginEncodedOffset,endEncodedOffset);
			}
		},
		
		_connectHandlerToDetail: function(elm, htmlBeginOffsets, htmlEndOffsets){
			var self = this;
			self.detailHandlers.push(dojo.connect(elm,"onclick",self,function(evt) {
				self._onDetailClickHandler(elm,htmlBeginOffsets,htmlEndOffsets,evt);
			}));
			self.detailHandlers.push(dojo.connect(elm, "onkeypress", self,function(evt) {
				self._onDetailClickHandler(elm,htmlBeginOffsets,htmlEndOffsets,evt);
			}));
		},
			
		_onDetailClickHandler: function(elm, htmlBeginOffsets, htmlEndOffsets, evt){
			var self = this;
			if(evt.type != "click" && evt.charCode != dojo.keys.SPACE) return;
			var text = self.text;
			text = self.insertDetailSpan(text, htmlBeginOffsets, htmlEndOffsets);
			//The reason of escape is that some words such as "&" and "<" is changed from HTML in servlet to obtain original offsets ,so need to chage to HTML
			text = self.escapeBrElment(text);
			self.previewBody.innerHTML = text;//self.escapeToHTML(text);
			self.removeCurrentCellSelected();
			dojo.addClass(elm,"selected");
			self.selectedDetailCell=elm;
			self.makeFocusToDetailSpan();
			self.clearHighlight();
			self.setDetailHighlightList();
//			self.highlightList = dojo.query("span.detailHighlight",this.previewBody);
			self.previewClicked=false;
		},
		
		insertDetailSpan: function(text, startInsertPosition, endInsertPosition){
			var splitByEndStr = text.substring(0, endInsertPosition);
			var lastStr = text.substring(endInsertPosition, text.length);
			var firstStr = splitByEndStr.substring(0, startInsertPosition);
			var middleStr = splitByEndStr.substring(startInsertPosition, endInsertPosition);
			return firstStr + "<span class='detailHighlight'>" + middleStr + "</span>" + lastStr;
		},
		
		makeFocusToDetailSpan: function(){
			var detailHighlightList = dojo.query("span.detailHighlight",this.previewBody);
			if((detailHighlightList!=null)&&(detailHighlightList.length!=0)){
				var detailHighlightSpan = detailHighlightList[0];
				dojo.attr(detailHighlightSpan,"tabindex",0);
				detailHighlightSpan.focus();
			}
		},
		
		removeCurrentCellSelected: function(){
			if(this.selectedDetailCell!=null){
				dojo.removeClass(this.selectedDetailCell,"selected");
			}
		},
		
		changeToResultHighlight: function(){
			if(this.previewClicked==false){
				this.previewBody.innerHTML = this.resultHighlightedText;
//				console.log(this.resultHighlightedText);
//				this.highlightList = dojo.query("span.OFHighlightTerm1",this.previewBody);
				this.setHighlightList();
				this.removeCurrentCellSelected();
				this.previewClicked=true;
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
		
		setDetailHighlightList: function(){
			var spans = this.previewBody.getElementsByTagName("span");
			var length = spans.length;
			if(length>0){
				for(var i=0;i<length;i++){
					if(spans[i].className=="detailHighlight"){
						this.highlightList.push(spans[i]);
					}
				}
			}						
		},
		
		escapeToHTML: function(str){
			str = this.replaceAll(str,"&","&amp;");
			return str;
		},	
		
		//because string including "\n" can not be parsed as Json
		reEscapeBrElement: function(str){
			str = this.replaceAll(str,"<BR>","\n");
			return str;
		},
		
		escapeBrElment: function(str){
			str = this.replaceAll(str,"\n","<BR>");
			return str;
		},
		
		preLoad: function() {
			EDR.ajax.Loading.setIsLoading(this.domNode);
			dojo.style(this.previewSplitContainer.domNode,"visibility","hidden");
		},
		
		postLoad: function() {
			EDR.ajax.Loading.clearIsLoading(this.domNode);
			dojo.style(this.previewSplitContainer.domNode,"visibility","visible");
		},
		
		replaceAll: function(str, s1, s2){  
		    return str.split(s1).join(s2);  
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