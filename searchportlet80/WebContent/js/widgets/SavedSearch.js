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
dojo.provide("widgets.SavedSearch");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");

dojo.declare(
	"widgets.SavedSearch", [dijit._Widget, dijit._Templated],
	{				
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl("widgets", "templates/SavedSearch.html"),
		slideTabContent: null,
		resultBottomBar: null,
		count: 0,
		contentWidth: 370,
		itemLabelWidth: 330,
//		fontStyle: "font-weight:bold;font-style:italic;font-size:12px;",
		fontStyle: "font-size:13px;",
		
		imgBasePath: EDR.config.imageBaseDir,
		url: "",
		submitUrl: "",
		timeout: 10000,
		handlers: [],
		isOpen: false,
		messages_advancedSearch_noResult: EDR.messages.advancedSearch_noResult,
		
		postCreate: function() {
			this.inherited("postCreate", arguments);
		},
		
		startup: function() {
			this.editUrl = EDR.contextPath + "/preferences?action=editSearchQuery";
			this.deleteUrl = EDR.contextPath + "/preferences?action=deleteSearchQuery";
			
			this.inherited(arguments);
			this.slideTabContent = dijit.byId(EDR.prefix+"savedSearchTab");
			this.resultsBottomBar = dijit.byId(EDR.prefix+"horizontalSearchPanes").resultBottomBar;
			dojo.subscribe("querySaved", this, "onQuerySaved");
			dojo.subscribe("afterSlideTabOpened", this, "onOpen");
			dojo.subscribe("afterSlideTabClosed", this, "onClose");
		},
		
		onOpen: function(event) {
			if (event.contentId == (EDR.prefix+"savedSearchTab")) {
				this.isOpen = true;
				this.load();
			}
		},
		
		onClose: function(event) {
			if (event.contentId == (EDR.prefix+"savedSearchTab")) {
				this.isOpen = false;
				this.resultsBottomBar.revertMessage();
				this.clear();
			}
			this.updateTitle();
		},
		
		onQuerySaved: function(event) {
			if (this.isOpen) {
				this.load();
			} else {
				this.countup();
			}
		},
		
		onSavedQuerySelected: function(evt, item) {
			if (item.id == null || item.id.length == 0) return;
			dijit.byId(EDR.prefix+"searchManager").submitSavedSearch({ savedSearchId: item.id });
			//dijit.byId(EDR.prefix+"savedSearchTab").close();
		},
		
		onSavedQueryEdit: function(evt, item) {
			if (evt.type != "click" && evt.keyCode != dojo.keys.ENTER) return;

			dojo.stopEvent(evt);
			
			var dialog = dijit.byId(EDR.prefix+"saveSearchDialog");
			dialog.attr("title", EDR.messages.editSearch_title);
			dialog.okButtonNode.setLabel(EDR.messages.button_edit);
			dialog.okButtonNode.titleNode.title = EDR.messages.button_edit;
			
			var dialogContent = dijit.byId(EDR.prefix+"saveSearchContent");
			dialogContent.setValues(item.name, item.query, item.description);
			
			var connects = [];
			connects.push(dojo.connect(dialog.okButtonNode, "onClick", this, dojo.hitch(this, function() {				
				var params = dialogContent.getFormValues();
				params.saveSearchId = item.id; 
				if (!dialogContent.validate(params)) return;
				
				dojo.forEach(connects, dojo.disconnect);
				this.editSavedSearch(params);
				EDR.dialog.util.hide(dialog);
			})));
			connects.push(dojo.connect(dialog.cancelButtonNode, "onClick", this, function() {
				dojo.forEach(connects, dojo.disconnect);
			}));
			EDR.dialog.util.show(dialog);
		},
		
		onSavedQueryDelete: function(evt, item) {
			if (evt.type != "click" && evt.keyCode != dojo.keys.ENTER) return;

			dojo.stopEvent(evt);
			this.deleteSavedSearch(item);
		},
		
		load: function() {
			this.preLoad();					
			var self = this;
			var args = 	{ 
				url: this.url,
				successCallback: function(response, ioArgs) {
					var json = null;
					try {
						json = dojo.fromJson(response);
					} catch (e) {
			        	self.loadErrorHandler(response, ioArgs);
			        	return;
					}
					self.clear();
					self.loadJson(json);	
					self.postLoad();
				},
				errorCallback: dojo.hitch(this, this.loadErrorHandler),
				timeout: this.timeout,
				showProgress: false
			};
			EDR.ajax.Request.post(args);
		},
				
		editSavedSearch: function(params) {
			this.preLoad();					
			var self = this;
			
			var args = 	{ 
				url: this.editUrl,
				successCallback: function(response, ioArgs) {
					var json = null;
					try {
						json = dojo.fromJson(response);
					} catch (e) {
			        	self.loadErrorHandler(response, ioArgs);
			        	return;
					}
					self.clear();
					self.loadJson(json);	
					self.postLoad();					
				},
				errorCallback: self.loadErrorHandler,
				timeout: this.timeout,
				content: params,
				showProgress: false
			};
			EDR.ajax.Request.post(args);
		},

		deleteSavedSearch: function(item) {
			this.preLoad();					
			var self = this;
			var params = {saveSearchId:item.id};
			var args = 	{ 
				url: this.deleteUrl,
				successCallback: function(response, ioArgs) {
					var json = null;
					try {
						json = dojo.fromJson(response);
					} catch (e) {
			        	self.loadErrorHandler(response, ioArgs);
			        	return;
					}
					self.clear();
					self.loadJson(json);	
					self.postLoad();					
				},
				errorCallback: self.loadErrorHandler,
				timeout: this.timeout,
				content: params,
				showProgress: false
			};
			EDR.ajax.Request.post(args);
		},
		
		preLoad: function() {
			EDR.ajax.Loading.setIsLoading(this.domNode);
		},
		
		postLoad: function() {
			EDR.ajax.Loading.clearIsLoading(this.domNode);
		},
		
		loadJson: function(json) {
			this.count = json.length;
			this.updateTitle();
			if(this.count==0){
				var itemDiv = dojo.create("DIV", {
					innerHTML: this.messages_advancedSearch_noResult,
					style: "width:100%;height:20px;" + this.fontStyle
				}, this.queryContainer);
			}else{
				for (var i=0; i<json.length; i++) {
					this.buildSavedItem(json[i], this.queryContainer);
				}
			}
		},
		
		loadErrorHandler: function() {
			EDR.ajax.Loading.clearIsLoading(this.domNode);
		},
		
		countup: function() {
			this.count++;
			this.updateTitle();
		},
		
		updateTitle: function() {
			var title = EDR.messages.tabs_savedSearch;
			var count = "<span style='font-weight:normal;font-size:10px;position:relative;top:-1px;'>" + 
								"<bdo dir='ltr'>(" + this.count + ")</bdo>" +
							"</span>";
			if (this.isLeftToRight()) {
				title = title + "&nbsp;" + count;
			} else {
				title = count + "&nbsp;" + title;
			}
			dijit.byId(EDR.prefix+"savedSearchTab").titleNode.innerHTML = title;
		},
		
		buildSavedItem: function(item, parent) {
			var itemDiv = dojo.create("DIV", {
				innerHTML: this.buildSavedItemHtml(item),
				title: item.name,
				style: "width:100%;height:20px;" + this.fontStyle
			}, parent);
			itemDiv.item = item;
			
			var buttons = itemDiv.getElementsByTagName("A");
			this.handlers.push(dojo.connect(buttons[1], "onclick", this, function(evt) {
				this.onSavedQueryEdit(evt, itemDiv.item);
			}));
			this.handlers.push(dojo.connect(buttons[1], "onkeypress", this, function(evt) {
				this.onSavedQueryEdit(evt, itemDiv.item);
			}));
			this.handlers.push(dojo.connect(buttons[2], "onclick", this, function(evt) {
				this.onSavedQueryDelete(evt, itemDiv.item);
			}));
			this.handlers.push(dojo.connect(buttons[2], "onkeypress", this, function(evt) {
				this.onSavedQueryDelete(evt, itemDiv.item);
			}));
			
			this.handlers.push(dojo.connect(itemDiv, "onclick", this, function(evt) {
				this.onSavedQuerySelected(evt, itemDiv.item);
			}));
			this.handlers.push(dojo.connect(itemDiv, "onmouseover", this, function() {
				var item = itemDiv.item;
				this.resultsBottomBar.showMessage("Query: " + item.query + "  /  Description: " + item.description);
				itemDiv.style.backgroundImage = "url('" + this.imgBasePath + "bg-savesearch.png')";
				itemDiv.style.cursor = "pointer";
			}));
			this.handlers.push(dojo.connect(itemDiv, "onmouseout", this, function() {
				itemDiv.style.backgroundImage = "none";
				itemDiv.style.cursor = "auto";
			}));
			return itemDiv;
		},
		
		buildSavedItemHtml: function(item) {
			var html = "";
			html += "<div style=\"width:"+this.contentWidth+"px\">";
			html += 	"<div tabindex=\"0\"style=\"width:"+this.itemLabelWidth+"px;float:left;\"><a href=\"javascript:;\">" + this._getTruncatedLabel(item, this.itemLabelWidth) + "</a></div>";
			html += 	"<div>";
			html += 		"<a href=\"javascript:;\">";
			html += 			"<img";
			html +=					  " src=\"" + this.imgBasePath + "edit23.png\"";
			html +=					  " alt=\"" + EDR.messages.editSearch_title + "\"";
			html +=					  " title=\"" + EDR.messages.editSearch_title + "\"";
			html +=					  " style=\"padding-left:3px;width:15px;height:15px;\"/>";
			html +=			"</a>";
			html += 		"<a href=\"javascript:;\">";
			html +=				"<img";
			html +=					  " src=\"" + this.imgBasePath + "delete23.png\"";
			html +=					  " alt=\"" + EDR.messages.deleteSavedSearch_title + "\"";
			html +=					  " title=\"" + EDR.messages.deleteSavedSearch_title + "\"";
			html +=					  " style=\"padding-left:3px;width:15px;height:15px;\"/>";
			html +=			"</a>";
			html += 	"</div>";
			html += "</div>"
			return html;
		},
		
		clear: function() {
			dojo.empty(this.queryContainer);
		},
		
		destroy: function() {
			dojo.forEach(this.handlers, dojo.disconnect);
			this.inherited("destroy", arguments);
		},
		
		_getTruncatedLabel: function(item, width) {
			var label = item.name + ""/*hack: object2string*/; 
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
		
		_getDummyJson: function() {
			return [
				{name:"saved search1", description:"aaaaaaaaaaaaaaaaaaaaaaaa", query:"query this"},
				{name:"saved search1", description:"aaaaaaaaaaaaaaaaaaaaaaaa", query:"query this"},
				{name:"saved search1", description:"aaaaaaaaaaaaaaaaaaaaaaaa", query:"query this"},
				{name:"saveeeeeeeeaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaeeeeeeeeeeeeeeeeeeeeeeeeeed search1", description:"aaaaaaaaaaaaaaaaaaaaaaaa", query:"query this"},
				{name:"saved search1", description:"aaaaaaaaaaaaaaaaaaaaaaaa", query:"query this"},
				{name:"saved search1", description:"aaaaaaaaaaaaaaaaaaaaaaaa", query:"query this"},
				{name:"saved search1", description:"aaaaaaaaaaaaaaaaaaaaaaaa", query:"query this"},
				{name:"saved search1", description:"aaaaaaaaaaaaaaaaaaaaaaaa", query:"query this"},
				{name:"saved seaaa22222222222222222222222aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaarch1", description:"aaaaaaaaaaaaaaaaaaaaaaaa", query:"query this"},
				{name:"saved search1", description:"aaaaaaaaaaaaaaaaaaaaaaaa", query:"query this"},
				{name:"saved search1", description:"aaaaaaaaaaaaaaaaaaaaaaaa", query:"query this"},
				{name:"saved search1", description:"aaaaaaaaaaaaaaaaaaaaaaaa", query:"query this"},
				{name:"saved search1", description:"aaaaaaaaaaaaaaaaaaaaaaaa", query:"query this"},
				{name:"saved search1", description:"aaaaaaaaaaaaaaaaaaaaaaaa", query:"query this"},
				{name:"saved search1", description:"aaaaaaaaaaaaaaaaaaaaaaaa", query:"query this"},
				{name:"saved search1", description:"aaaaaaaaaaaaaaaaaaaaaaaa", query:"query this"},
				{name:"saved search1", description:"aaaaaaaaaaaaaaaaaaaaaaaa", query:"query this"},
				{name:"saved search1", description:"aaaaaaaaaaaaaaaaaaaaaaaa", query:"query this"},
				{name:"saved search1", description:"aaaaaaaaaaaaaaaaaaaaaaaa", query:"query this"},
				{name:"saved search1", description:"aaaaaaaaaaaaaaaaaaaaaaaa", query:"query this"}
			];
		}
	}
);