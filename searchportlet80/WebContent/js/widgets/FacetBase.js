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
dojo.provide("widgets.FacetBase");

dojo.require("dijit._Widget");
dojo.require("dojox.collections.ArrayList");

dojo.declare(
	"widgets.FacetBase", [dijit._Widget],
	{				
		treeItemWidth: 180,
		imgBasePath: EDR.config.imageBaseDir,
		itemIdPrefix: "",
		andfacets: null,
		notfacets: null,
		handlers: [],
				
		postCreate: function() {
			this.handlers = [];
			this.inherited("postCreate", arguments);
			this.andfacets = new dojox.collections.ArrayList([]);
			this.notfacets = new dojox.collections.ArrayList([]);
		},
		
		isEmpty: function() {
			return (this.andfacets.count == 0 && this.notfacets.count == 0) ? true : false;
		},
		
		getFormValues: function() {
			var values = {};
			if (this.andfacets.count > 0) values.andfacet = this.andfacets.toArray();
			if (this.notfacets.count > 0) values.notfacet = this.notfacets.toArray();
			return values;
		},
		
		facetSelectedEventHandler: function(evt) {
			if (evt.type != "click" && evt.keyCode != dojo.keys.ENTER) return;
			
			var facetLink = evt.currentTarget;
			var facetInput = facetLink.parentNode.firstChild;
			this.andfacets.clear();
			this.notfacets.clear();
			this.andfacets.add(facetInput.value);
		},
		
		toggleCheckBoxEventHandler: function(chkbox) {
			var facetInput = chkbox.domNode.parentNode.firstChild;
			if (chkbox.checked) {
				facetInput.name = "andfacet";
				this.andfacets.add(facetInput.value);
			} else {
				facetInput.name = "facet";
				this.andfacets.remove(facetInput.value);
			}
		},
		
		toggleFacetEventHandler: function(evt) {
		},
		
		buildFacetGroupElem: function(facet) {
			var refGroup = dojo.doc.createElement("DIV");
			dojo.addClass(refGroup, "refinement-group");
			//refGroup.style.width = this.treeItemWidth + "px";
			refGroup.style.width = "95%";

			var refTitle = dojo.doc.createElement("DIV");
			refTitle.tabIndex = 0;
			refTitle.title = dojo.string.substitute(EDR.messages.tooltip_facet_expandcollapse, [facet.facetLabel]);
			dojo.addClass(refTitle, "refinement-title");
			refTitle.facet = facet;
			dojo.attr(refTitle, "role", "treeitem");

			if (facet.items != null) {
				this.handlers.push(dojo.connect(refTitle, "onkeypress", this, this.toggleFacetEventHandler));
				if(facet.items.length != 0){
					this.handlers.push(dojo.connect(refTitle, "onclick", this, this.toggleFacetEventHandler));
				}
			}
			
			var contentTop = dojo.doc.createElement("DIV");
			dojo.addClass(contentTop, "refinement-title-top");
			contentTop.innerHTML = "<div></div>";

			var contentBody = this.buildFacetGroupContentElem(facet);

			var contentBottom = dojo.doc.createElement("DIV");
			dojo.addClass(contentBottom, "refinement-title-bottom");
			contentBottom.innerHTML = "<div></div>";
			
			var refGroupList = dojo.doc.createElement("DIV");
			dojo.addClass(refGroupList, "refinement-group-list");
			refGroupList.style.display = 'none';
			
			var refList = dojo.doc.createElement("DIV");
			dojo.addClass(refList, "refinement-list");
			refList.style.display = 'none';
			refList.style.paddingTop = "3px";
			
			refTitle.appendChild(contentTop);
			refTitle.appendChild(contentBody);
			refTitle.appendChild(contentBottom);
			
			refGroup.appendChild(refTitle);
			refGroup.appendChild(refGroupList);
			refGroup.appendChild(refList);
			
			return refGroup;
		},
		
		buildFacetGroupContentElem: function(facet) {
			var content = dojo.doc.createElement("DIV");
			dojo.addClass(content, "refinement-title-body");
			
			var arrowImg = dojo.doc.createElement("IMG");
			dojo.addClass(arrowImg, "arrow-img");
			arrowImg.src = this.imgBasePath + (this.isLeftToRight() ? "arrow_right8.png" : "arrow_left8.png");
			arrowImg.alt = dojo.string.substitute(EDR.messages.tooltip_facet_expandcollapse, [facet.facetLabel]);
			
			if (facet.items == null || facet.items.length == 0) dojo.style(arrowImg, "visibility", "hidden");
			
			var label = dojo.doc.createElement("DIV");
			dojo.addClass(label, "label");
			label.innerHTML = facet.facetLabel;
			
			content.appendChild(arrowImg);
			content.appendChild(label);
			
			return content;
		},
		
		buildFacetItemElem: function(item) {
			var container = dojo.doc.createElement("DIV");
			var isAndFacet = this.andfacets.contains(item.postParamValue + "");
			var isNotFacet = this.notfacets.contains(item.postParamValue + "");
			
			var facetInput = dojo.create("INPUT", {
				type: "hidden",
				value: item.postParamValue + "",
				name: isAndFacet ? "andfacet" : "facet"
			}, container);

			var chkbox = new dijit.form.CheckBox({id:EDR.prefix+this.itemIdPrefix + item.itemId+"_chkbox", name:""});
			if (isAndFacet) chkbox.attr("checked", true);
			container.appendChild(chkbox.domNode);
			facetInput.chkbox = chkbox;
			this.handlers.push(dojo.connect(chkbox, "onClick", this, function(evt) {
				this.toggleCheckBoxEventHandler(chkbox);
			}));
			
			var facetLabel = item.itemLabel + "";
			var labelTitle = dojo.string.substitute(EDR.messages.tooltip_facet_quick, ['"' + facetLabel + '"']);
			var labelLink = dojo.create("A", {
				href: "javascript:;",
				itemId: item.itemId + "",
				title: labelTitle,
				"for": item.itemId+"_chkbox"
			}, container);
			var label = dojo.create("LABEL", {"for":EDR.prefix+this.itemIdPrefix + item.itemId+"_chkbox"}, labelLink);
			label.appendChild(dojo.doc.createTextNode(facetLabel));
			
			this.handlers.push(dojo.connect(labelLink, "onclick", this, this.facetSelectedEventHandler));
			
			dojo.create("span", {innerHTML: "<bdo dir='ltr'>(" + item.count + ")</bdo>"}, container);
			
			return container;
		},
		
		submitSearch: function(searchType) {
			var params = this.getFormValues();
			dijit.byId(EDR.prefix+"searchManager").submitSearch(null, searchType, params);
		},
		
		removeFacet: function(removefacet) {
			this.andfacets.clear();
			this.notfacets.clear();
			this.notfacets.add(removefacet);
			var params = this.getFormValues();
			dijit.byId(EDR.prefix+"searchManager").submitSearch(null, "refineSearch", params);
		},
		
		buildItemLabel: function(item) {
			return item.itemLabel;
		},
		
		reset: function() {
			this.andfacets.clear();
			this.notfacets.clear();			
		},
		
		clear: function() {
			this.andfacets.clear();
			this.notfacets.clear();
			if (this.facetForm) {
				dojo.forEach(dijit.findWidgets(this.facetForm), function(widget) {
					widget.destroy();
				});
				this.facetForm.innerHTML = "";
			}
		},
		
		destroy: function() {
			this.clear();
			dojo.forEach(this.handlers, dojo.disconnect);
			this.inherited("destroy", arguments);
		}	
	}
);