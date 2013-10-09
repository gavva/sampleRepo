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
dojo.provide("widgets.FacetTree");

dojo.require("widgets.FacetBase");
dojo.require("dijit._Templated");
dojo.require("dijit.form.RadioButton");
dojo.require("dojox.collections.ArrayList");
dojo.require("widgets.Button");

dojo.declare(
	"widgets.FacetTree", [widgets.FacetBase, dijit._Templated],
	{		
		prefix: EDR.prefix,
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl("widgets", "templates/FacetTree.html"),
		url: "",
		urlLoadChildren: "",
		urlTypeAhead: "",
		timeout: 10000,
		
		facetDialog: null,
		facetDialogContent: null,
		facetTypeAheadWidget: null,
		
		newSearchChk: null,
		refineSearchChk: null,
		facetSearchBtn: null,
		facetClearBtn: null,
		
		facetTypeAheadInputIndex: 0,
		defaultSize: 0,
		maxSize: 0,
		
		openedItems: null,
		previousOpenedItems: null,
		loadRefCounter: 0,

		postCreate: function() {
			this.inherited("postCreate", arguments);
			this.previousOpenedItems = new dojox.collections.ArrayList([]);
			this.openedItems = new dojox.collections.ArrayList([]);
			dojo.subscribe("refresh", this, "refresh");
			dojo.subscribe("reset", this, "reset");
			dojo.subscribe("collectionChanged", this, "collectionChanged");
		},
		
		startup: function() {
			this.inherited(arguments);			
			if (dojo.isIE <= 7) {
				this.facetSearchBtn.adjustButtonWidth();
				this.facetClearBtn.adjustButtonWidth();
			}
			this.initDialog();
		},
		
		initDialog: function() {
			this.facetTypeAheadWidget = dijit.byId(EDR.prefix+"facetTypeAheadWidget");
			this.facetDialogContent = dijit.byId(EDR.prefix+"facetDialogContent");
			this.facetDialog = dijit.byId(EDR.prefix+"facetDialog");
			this.handlers.push(dojo.connect(this.facetDialog.okButtonNode, "onClick", this, "onFacetDialogApplied"));
			this.handlers.push(dojo.connect(this.facetDialog.cancelButtonNode, "onClick", this, "onFacetDialogCanceled"));
			this.handlers.push(dojo.connect(this.facetDialogContent, "facetSelectedEventHandler", this, "facetSelectedEventHandler"));
		},
		
		resize: function() {			
		},
		
		load: function() {
			if (!this.isVisible()) return;
			
			var params = {
				defaultSize: this.defaultSize,
				maxSize: this.maxSize
			};
			var args = 	{ 
				url: this.url,
				showProgress: false,
				successCallback: dojo.hitch(this, function(response, ioArgs) {
					var json = null;
					try {
						json = dojo.fromJson(response);
					} catch (e) {
			        	this.loadErrorHandler(response, ioArgs);
			        	return;
					}
					this.clear();
					this.loadRefCounter = 1;
					this.loadJson(json);	
					this.loadRefCounter--;
					if (this.loadRefCounter <= 0) this.postLoad();		
				}),
				afterErrorHandlerCallback: dojo.hitch(this, function(response, ioArgs) {
					this.loadErrorHandler(response, ioArgs);
				}),
				content: params,
				timeout: this.timeout
			};			
			this.preLoad();					
			EDR.ajax.Request.post(args);
		},
		
		loadChildren: function(params, afterChildrenLoaded) {
			if (!this.isVisible()) return;
			
			var args = 	{ 
				url: this.urlLoadChildren,
				content: params,
				showProgress: false,
				successCallback: dojo.hitch(this, function(response, ioArgs) {
					var json = null;
					try {
						json = dojo.fromJson(response);
					} catch (e) {
			        	this.loadErrorHandler(response, ioArgs);
			        	return;
					}
					afterChildrenLoaded(json);					
				}),
				afterErrorHandlerCallback: dojo.hitch(this, function(response, ioArgs) {
					this.loadErrorHandler(response, ioArgs);
				}),
				timeout: this.timeout
			};			
			EDR.ajax.Request.post(args);
		},
		
		loadJson: function(json, parent) {			
			if (json == null || json.length == 0) {
				dojo.style(this.buttonContainer, "display", "none");
				this.facetForm.innerHTML = "<div style='padding:5px'>" + this.label_nofacet + "</div>";
			} else {
				this.previousOpenedItems = this.openedItems;
				this.openedItems =  new dojox.collections.ArrayList([]);
				dojo.style(this.buttonContainer, "display", "block");
				this.buildSelectedFacets(json.selectedFacets, this.facetForm);
				this.buildFacetGroups(json.facets, this.facetForm);	
			}
		},
		
		isVisible: function() {
			if (dijit.byId(EDR.prefix+"horizontalSearchPanes").leftContentPane.domNode.style.visibility != "visible") return;
			
			var node = this.domNode;
			while (node != null) {
				if (node.style != null && (node.style.display == "none" || node.style.visibility == "hidden"))
					return false;
				node = node.parentNode;
			}
			return true;
		},
		
		refresh: function() {
			if (this.isVisible()) this.load();
		},
		
		collectionChanged: function() {
			this.openedItems.clear();
			this.previousOpenedItems.clear();
		},
		
		clear: function() {
			this.inherited(arguments);
			dijit.byId(EDR.prefix+"facetTypeAheadWidget").detach();
			this.facetTypeAheadInputIndex = 0;
			this.refineSearchChk.attr("checked", true);
			this.facetSearchBtn.setDisabled(true);
			this.facetClearBtn.setDisabled(true);
		},		
		
		reset: function() {			
			this.inherited(arguments);
			
			var self = this;
			dojo.forEach(this.domNode.getElementsByTagName("INPUT"), function(input) {
				if (input.name == "andfacet") {
/*					self.toggleAndImgEventHandler({
						type: "click",
						currentTarget: input.nextSibling
					})*/
					input.name = "facet";
					input.chkbox.attr("checked", false);
				}
/*					
				} else if (input.name == "notfacet") {
					self.toggleNotImgEventHandler({
						type: "click",
						currentTarget: input.nextSibling.nextSibling
					})
				}
*/
			});
			this.facetTypeAheadWidget.detach();
			this.refineSearchChk.attr("checked", true);
			this.facetSearchBtn.setDisabled(true);
			this.facetClearBtn.setDisabled(true);
		},
		
		preLoad: function() {},		
		postLoad: function() {},		
		loadErrorHandler: function(response) {},	
			
		onFacetDialogCanceled: function(evt) {
			this.facetDialogContent.clear();
		},
		
		onFacetDialogApplied: function(evt) {
			this.andfacets = this.facetDialogContent.andfacets;
			this.notfacets = this.facetDialogContent.notfacets;
			
			if (this.andfacets.count == 0) return;
			
			var searchType = this.newSearchChk.checked ? "search" : "refineSearch";
			this.submitSearch(searchType);
			this.facetDialog.cancelFunction();
		},

		facetSelectedEventHandler: function(evt) {
			this.inherited("facetSelectedEventHandler", arguments);
			if (this.facetDialog.open) this.facetDialog.cancelFunction();
			this.submitSearch("refineSearch");
		},

		onSearchButtonClicked: function(evt) {
			var searchType = this.newSearchChk.checked ? "search" : "refineSearch";
			this.submitSearch(searchType);
		},
		
		onClearButtonClicked: function(evt) {
			this.reset();
		},
				
		toggleCheckBoxEventHandler: function(chkbox) {
			this.inherited("toggleCheckBoxEventHandler", arguments);
			if ( (this.andfacets == null || this.andfacets.count == 0) )
			{
//				this.newSearchChk.attr("checked", true);
				this.facetSearchBtn.setDisabled(true);
				this.facetClearBtn.setDisabled(true);
			} else {				
//				this.refineSearchChk.attr("checked", true);	
				this.facetSearchBtn.setDisabled(false);
				this.facetClearBtn.setDisabled(false);
			}
		},
		
		onMoreLinkClicked: function(evt) {
			this.setupFacetDialog(evt.currentTarget.facetName, evt.currentTarget.facetPath, evt.currentTarget.facetId, this.facetDialogContent);
			EDR.dialog.util.show(this.facetDialog);
		},
				
		setupFacetDialog: function(facetName, facetPath, facetId, facetDialogContent) {
			facetDialogContent.facetName = facetName;
			facetDialogContent.facetPath = facetPath;
			facetDialogContent.facetId = facetId;
			facetDialogContent.maxSize = this.maxSize;
			facetDialogContent.andfacets = this.andfacets.clone();
			facetDialogContent.notfacets = this.notfacets.clone();
			facetDialogContent.load();
		},
		
		toggleFacetEventHandler: function(evt) {
			if(evt.keyCode == dojo.keys.UP_ARROW || evt.keyCode == dojo.keys.DOWN_ARROW){
				this.focusNextFacetNode(evt.currentTarget, (evt.keyCode == dojo.keys.UP_ARROW) ? true : false);
			}
			if (evt.type != "click" && evt.keyCode != dojo.keys.ENTER && evt.charCode != dojo.keys.SPACE
				&& evt.keyCode != dojo.keys.RIGHT_ARROW && evt.keyCode != dojo.keys.LEFT_ARROW ) return;
			
			var refTitle = evt.currentTarget;			
			var arrowImg = refTitle.childNodes[1].firstChild;
			var refGroupList = refTitle.nextSibling;
			var refList = refGroupList.nextSibling;
			
			if((evt.keyCode == dojo.keys.RIGHT_ARROW && refGroupList.style.display != 'none')||
				(evt.keyCode == dojo.keys.LEFT_ARROW && refGroupList.style.display == 'none')) return;
			
			if (refGroupList.style.display == 'none') {			
				if (refGroupList.firstChild == null) this.buildFacetGroups(refTitle.facet.facets, refGroupList);
				if (refList.firstChild == null) {
					this.buildFacetItems(refTitle.facet.items, refList);
					if (refTitle.facet.more) {
						refList.appendChild(this.buildFacetTypeAheadInput(refTitle.facet.facetLabel, "", refTitle.facet.facetId));
//						refList.appendChild(this.buildMoreLink(refTitle.facet.facetLabel, "", refTitle.facet.facetId));
						refList.appendChild(this.buildMoreLink(refTitle.facet.facetName, "", refTitle.facet.facetId));
					}
				}				
				arrowImg.src = this.imgBasePath + "arrow_down8.png";
				refGroupList.style.display = 'block';
				refList.style.display = 'block';
				
				this.onElemOpened(refTitle.facet.postParamValue);
			} else {
				arrowImg.src = this.imgBasePath + (this.isLeftToRight() ? "arrow_right8.png" : "arrow_left8.png");
				refGroupList.style.display = 'none';
				refList.style.display = 'none';

				this.onElemClosed(refTitle.facet.postParamValue);
			}		
		},
		
		toggleNestedItemEventHandler: function(evt) {
			if(evt.keyCode == dojo.keys.UP_ARROW || evt.keyCode == dojo.keys.DOWN_ARROW){
				this.focusNextFacetNode(evt.currentTarget, (evt.keyCode == dojo.keys.UP_ARROW) ? true : false);
			}
			if (evt.type != "click" && evt.keyCode != dojo.keys.ENTER && evt.charCode != dojo.keys.SPACE
				&& evt.keyCode != dojo.keys.RIGHT_ARROW && evt.keyCode != dojo.keys.LEFT_ARROW) return;
			
			var container = evt.currentTarget.parentNode.parentNode;
			var arrowImg = evt.currentTarget.firstChild;
			var children = container.childNodes[1];
			
			if((evt.keyCode == dojo.keys.RIGHT_ARROW && children.style.display != 'none')||
				(evt.keyCode == dojo.keys.LEFT_ARROW && children.style.display == 'none')) return;
			
			if (children.style.display == 'none') {			
				if (children.firstChild == null) {
					var item = container.item;
					var items = container.item.items;
					if (items == null || items.length == 0) {
						var params = {
							facetName: item.facetName,
							facetPath: item.postParamValue,
							maxSize: this.defaultSize
						};
						this.loadChildren(params, dojo.hitch(this, function(json) {
							items = container.item.items = json.items;
							// avoid ajax problem (remove duplicate items)
							if (children.firstChild != null) {
								dojo.forEach(dijit.findWidgets(children), function(widget) {
									widget.destroy();
								});
								dojo.empty(children);
							}
							this.buildFacetItems(items, children);
							if (container.item.more) {
								children.appendChild(this.buildFacetTypeAheadInput(items[0].facetName, items[0].facetPath, ""));
								children.appendChild(this.buildMoreLink(items[0].facetName, items[0].facetPath, ""));
							}
							arrowImg.src = this.imgBasePath + "arrow_down8.png";
							//setTimeout(function() {dojo.fx.wipeIn({node: children, duration: 300}).play();}, 0);
							children.style.display = 'block';
							
							this.onElemOpened(item.postParamValue);
						}));
					} else {
//						this.buildFacetItems(items, children);
//						if (container.item.more) {
//							children.appendChild(this.buildFacetTypeAheadInput(items[0].facetName, items[0].facetPath));
//							children.appendChild(this.buildMoreLink(items[0].facetName, items[0].facetPath));
//						}
//						arrowImg.src = this.imgBasePath + "arrow_down8.png";
//						children.style.display = 'block';
					}
				} else {
					arrowImg.src = this.imgBasePath + "arrow_down8.png";
					//setTimeout(function() {dojo.fx.wipeIn({node: children, duration: 300}).play();}, 0);
					children.style.display = 'block';

					this.onElemOpened(container.item.postParamValue);
				}
			} else {
				arrowImg.src = this.imgBasePath + (this.isLeftToRight() ? "arrow_right8.png" : "arrow_left8.png");
				children.style.display = 'none';
				
				this.onElemClosed(container.item.postParamValue);
			}		
		},
		
		onElemOpened: function(postParamValue) {
			if (this.loadRefCounter >= 1) {
				this.loadRefCounter--;
				if (this.loadRefCounter <= 0) {
					this.postLoad();
				}
			}
			
			if (!this.openedItems.contains(postParamValue)) {
				this.openedItems.add(postParamValue);
			}
		},
		
		onElemClosed: function(postParamValue) {
			var removeValues = [];
			for (var i=0; i<this.openedItems.count; i++) {
				// close descendats
				var value = this.openedItems.item(i);
				if (value.indexOf(postParamValue) == 0) {
					removeValues.push(value);
				}
			}
			for (var i=0; i<removeValues.length; i++) {
				this.openedItems.remove(removeValues[i]);
			}
//			console.debug(this.openedItems);
			this.postLoad();
		},
		
		buildSelectedFacets: function(facets, parent) {
			var self = this;
			if (parent == null) parent = this.facetForm;
			if (facets == null || facets.length == 0) return;
			var container = dojo.create("DIV", {
				innerHTML:"<span>" + this.label_narrowedby + ":</span>",
				className:"selected-facet-container"
	//			style:"padding-left:5px;font-weight:bold;margin-bottom:5px;"
			}, parent);
			dojo.forEach(facets, function(facet, index) {
				self.buildSelectedFacet(facet, container);
			});
		},
		
		buildSelectedFacet: function(facet, parent) {
			var container = dojo.create("DIV", {className:"selected-facet"}, parent);
			var tooltip = dojo.string.substitute(this.label_removefacet, [facet.label]);
			var imgAnchor = dojo.create("A", {
				title: tooltip,
				href:"javascript:;"
			}, container);
			var img = dojo.create("IMG", {
				src:this.imgBasePath + "delete23.png",
				className:"selected-facet-img",
				alt:tooltip,
				title:tooltip
//				style:"width:15px;height:15px;vertical-align:bottom;"
			}, imgAnchor);
			var anchor = dojo.create("A", {
				innerHTML:facet.label,
				className:"selected-facet-label",
//				style:"padding-left:5px;",
				title:tooltip
			}, container);
						
			this.handlers.push(dojo.connect(imgAnchor, "onclick", this, function() {this.removeFacet(facet.value);}));
			this.handlers.push(dojo.connect(anchor, "onclick", this, function() {this.removeFacet(facet.value);}));
			return container;
		},
		
		buildFacetGroups: function(facets, parent) {
			var self = this;
			if (parent == null) parent = this.facetForm;
			if (facets == null) return;
			dojo.forEach(facets, function(facet, index) {
				var elem = self.buildFacetGroupElem(facet);
				parent.appendChild(elem);				
				
				if (self.previousOpenedItems.contains(facet.postParamValue)) {
					self.loadRefCounter++;
					var evt = { type: "click", currentTarget: elem.firstChild/*ref title*/ };
					self.toggleFacetEventHandler(evt, false);					
				}
			});
		},
				
		buildFacetItems: function(items, parent) {
			var self = this;
			dojo.forEach(items, function(item, index) {
				var elem = self.buildFacetItemElem(item);
				parent.appendChild(elem);
				
				if (self.previousOpenedItems.contains(item.postParamValue)) {
					self.loadRefCounter++;
					var evt = { type: "click", currentTarget: elem.firstChild.firstChild.nextSibling/*arrow container*/ };
					self.toggleNestedItemEventHandler(evt, false);					
				}
			});
		},
		
		buildFacetItemElem: function(item) {
			var container = dojo.create("DIV", {}, null);
			container.item = item;
			var itemContent = this._buildFacetItemElem(item);
			container.appendChild(itemContent);
			if (item.hasChildren) {
				var children = dojo.create("DIV", {className:"refinement-list", style:"display:none"}, container);
				children.style.display = "none";
			}
			return container;
		},
		
		_buildFacetItemElem: function(item) {
			var container = dojo.doc.createElement("DIV");
			var isAndFacet = this.andfacets.contains(item.postParamValue);
			var isNotFacet = this.notfacets.contains(item.postParamValue);
			
			var facetInput = dojo.create("INPUT", {
				type: "hidden",
				value: item.postParamValue,
				name: isAndFacet ? "andfacet" : "facet"
			}, container);

			var arrowContainer = dojo.create("DIV", {className: "arrow-container"}, container);
			var arrowImg = dojo.create("IMG", {className: "arrow-img-hierarchical",
				alt: dojo.string.substitute(EDR.messages.tooltip_facet_expandcollapse, [item.itemLabel]),
				src: this.imgBasePath + (this.isLeftToRight() ? "arrow_right8.png" : "arrow_left8.png"),
				tabindex: 0
			}, arrowContainer);
			
			if (item.hasChildren) {
				dojo.style(arrowContainer, "visibility", "visible");
				this.handlers.push(dojo.connect(arrowContainer, "onclick", this, this.toggleNestedItemEventHandler));
				this.handlers.push(dojo.connect(arrowContainer, "onkeypress", this, this.toggleNestedItemEventHandler));				
			} else {
				dojo.style(arrowContainer, "visibility", "hidden");
			}

			var chkbox = new dijit.form.CheckBox({id:EDR.prefix+this.itemIdPrefix + item.itemId+"_chkbox", name:""});
			if (isAndFacet) chkbox.attr("checked", true);
			container.appendChild(chkbox.domNode);
			facetInput.chkbox = chkbox;
			
			this.handlers.push(dojo.connect(chkbox, "onClick", this, function(evt) {
				this.toggleCheckBoxEventHandler(chkbox);
			}));
			
			var facetLabel = this.buildItemLabel(item);
			var labelTitle = dojo.string.substitute(EDR.messages.tooltip_facet_quick, ['"' + facetLabel + '"']);
			var labelLink = dojo.create("A", {
				href: "javascript:;", itemId: item.itemId, "for": item.itemId+"_chkbox",
				title: labelTitle}, null);
			var labelName = dojo.create("LABEL", {"for":EDR.prefix+this.itemIdPrefix + item.itemId+"_chkbox", role:"treeitem"}, labelLink);
			labelName.appendChild(dojo.doc.createTextNode(facetLabel));
			
			this.handlers.push(dojo.connect(labelLink, "onkeypress", this, this.onFacetLabelKeyPress));
			this.handlers.push(dojo.connect(labelLink, "onclick", this, this.facetSelectedEventHandler));			
			var countText = dojo.create("span", {innerHTML: "<bdo dir='ltr'>(" + item.count + ")</bdo>"}, null);
			
			if (this.isLeftToRight()) {
				container.appendChild(labelLink);
				container.appendChild(countText);
			} else {
				container.appendChild(countText);
				container.appendChild(labelLink);
			}
			
			return container;
		},
				
		buildMoreLink: function(facetName, facetPath, facetId) {
			var link = dojo.create("A", {
				href:"javascript:;", className:"morelink", 
				title:this.label_showmore,
				innerHTML:EDR.messages.searchpane_morelink
			}, null);
			link.facetName = facetName;
			link.facetPath = facetPath;
			link.facetId = facetId;
			this.handlers.push(dojo.connect(link, "onclick", this, "onMoreLinkClicked"));
			return link;
		},
		
		buildFacetTypeAheadInput: function(facetName, facetPath, facetId) {
			this.facetTypeAheadInputIndex += 1;
			var container = dojo.create("DIV", {
				style: "padding-left:15px;"
			}, null);
			var input = dojo.create("INPUT", {				
				id: EDR.prefix+"facetTypeAheadInput_" + this.facetTypeAheadInputIndex,
				style: "width:95%;",
				type: "text",
				title: this.label_typeahead
			}, container);
			input.facetName = facetName;
			input.facetPath = facetPath;
			input.facetId = facetId;
			var typeAhead = this.facetTypeAheadWidget;
			
			var self = this;
			this.handlers.push(dojo.connect(input, "onfocus", typeAhead, function(e) {
				typeAhead.attach(input.id, self.urlTypeAhead, false);
				typeAhead.onExecute = function(e, value) {
					var td = null;
					if (e.type == "click") {
						td = e.currentTarget.firstChild;
					} else {
						var selectedItem = self.facetTypeAheadWidget.selectedItem;
						if (selectedItem != null) {
							td = selectedItem.firstChild;
						}
					}
					if (td != null) {
						self.andfacets.add(td.getAttribute("param"));
						dijit.byId(EDR.prefix+"searchManager").submitSearch(null, "refineSearch", self.getFormValues());
					}
				}
			}));
			return container;
		},
		
		onFacetLabelKeyPress: function(evt){
			if(evt.keyCode == dojo.keys.UP_ARROW || evt.keyCode == dojo.keys.DOWN_ARROW){
				var target = evt.currentTarget.previousSibling.previousSibling;
				this.focusNextFacetNode(target, (evt.keyCode == dojo.keys.UP_ARROW) ? true : false);
			}
		},
		
		focusNextFacetNode: function(target, isUp){
			var nodeList = [];
			var topFacets = dojo.query("div.refinement-title", this.facetTreeContainer);
			for(var i=0; i<topFacets.length; i++){
				nodeList.push(topFacets[i]);
				dojo.query("div.arrow-container",topFacets[i].parentNode).forEach(function(node){
					nodeList.push(node);
				});
			}
			var index = null;
			var nextNode = null;
			var i = isUp ? nodeList.length-1 : 0;
			while(isUp?(i>=0):(i<nodeList.length)){
				if(index!=null && nodeList[i].parentNode.parentNode.parentNode.style.display!="none"){
					nextNode = nodeList[i];
					break;
				}
				if(target == nodeList[i]){
					index = i;
				} 
				isUp ? i-- : i++;
			}
			if(nextNode != null){
				if(dojo.hasClass(nextNode,"refinement-title")){
					nextNode.focus();
				}else if(nextNode.style.visibility=="hidden"){
					nextNode.nextSibling.nextSibling.focus();
				}else{
					nextNode.getElementsByTagName("img")[0].focus();
				}
			}
		},
		
		// messages
		label_showmore: EDR.messages.tooltip_showmorefacet,
		label_narrowedby: EDR.messages.facets_narrowedby,
		label_removefacet: EDR.messages.tooltip_facet_selected_remove,
		label_typeahead: EDR.messages.tooltip_facet_typeahead,
		label_newsearch: EDR.messages.searchpane_newsearch,
		label_refinesearch: EDR.messages.searchpane_addsearch,
		label_nofacet: EDR.messages.facets_noResult,
		label_search: EDR.messages.searchpane_search,
		label_clear: EDR.messages.searchpane_clear,
		messages_tooltip_searchpane_newsearch_link: EDR.messages.tooltip_searchpane_newsearch_link,
		messages_tooltip_searchpane_addsearch_link: EDR.messages.tooltip_searchpane_addsearch_link
	}
);