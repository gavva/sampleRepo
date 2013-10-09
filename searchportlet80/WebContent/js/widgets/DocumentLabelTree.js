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
dojo.provide("widgets.DocumentLabelTree");

dojo.require("widgets.FacetTree");
dojo.require("dijit._Templated");
dojo.require("dijit.form.RadioButton");
dojo.require("dojox.collections.ArrayList");
dojo.require("widgets.Button");

dojo.declare(
	"widgets.DocumentLabelTree", [widgets.FacetTree],
	{		
		prefix: EDR.prefix + "_documentLabel_",
		
		initDialog: function() {
			this.facetTypeAheadWidget = dijit.byId(EDR.prefix+"documentLabelTypeAheadWidget");
			this.facetDialogContent = dijit.byId(EDR.prefix+"documentLabelDialogContent");
			this.facetDialog = dijit.byId(EDR.prefix+"documentLabelDialog");
			this.handlers.push(dojo.connect(this.facetDialog.okButtonNode, "onClick", this, "onFacetDialogApplied"));
			this.handlers.push(dojo.connect(this.facetDialog.cancelButtonNode, "onClick", this, "onFacetDialogCanceled"));
			this.handlers.push(dojo.connect(this.facetDialogContent, "facetSelectedEventHandler", this, "facetSelectedEventHandler"));
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
			
			var tooltip = dojo.string.substitute(EDR.messages.tooltip_facet_quick, ['"' + facet.facetLabel + '"']);
			var a = dojo.create("a", {href:"javascript:;", title:tooltip, innerHTML:facet.facetLabel, style:"font-weight:bold;"}, label);
			dojo.create("span", {innerHTML:"&nbsp(" + facet.count + ")"}, label);
//			label.innerHTML = facet.facetLabel;
			
			this.handlers.push(dojo.connect(a, "onclick", this, function(evt) { 
				if (evt != null && evt.stopPropagation) evt.stopPropagation();
				this.andfacets.clear();
				this.andfacets.add(facet.postParamValue);
				this.submitSearch("refineSearch");
			}));
			
			var magContainer = dojo.create("div", {}, null);
			dojo.addClass(magContainer, "maglink");
			
			var magLink = dojo.create("a", {href:"javascript:;", title:tooltip}, magContainer);
			var magImg = dojo.create("img", {src:this.imgBasePath + "mag-glass12_h.png"}, magLink);
			this.handlers.push(dojo.connect(magLink, "onclick", this, function(evt) { 
				if (evt != null && evt.stopPropagation) evt.stopPropagation();
				this.andfacets.clear();
				this.andfacets.add(facet.postParamValue);
				this.submitSearch("refineSearch");
			}));
			
			this.handlers.push(dojo.connect(content, "onmouseover", this, function(evt) { 
				magLink.style.visibility = "visible";
			}));
			this.handlers.push(dojo.connect(content, "onmouseout", this, function(evt) { 
				magLink.style.visibility = "hidden";
			}));
			
			content.appendChild(arrowImg);
			content.appendChild(label);
			content.appendChild(magContainer);
			
			return content;
		},
		
		getFormValues: function() {
			var values = {};
			if (this.andfacets.count > 0) values.andDocumentLabels = this.andfacets.toArray();
			if (this.notfacets.count > 0) values.notDocumentLabels = this.notfacets.toArray();
			return values;
		},
		
		preLoad: function() {
			EDR.ajax.Loading.setIsLoading(this.domNode);
		},
		
		postLoad: function() {
			EDR.ajax.Loading.clearIsLoading(this.domNode);
		},
		
		loadErrorHandler: function(response) {
			EDR.ajax.Loading.clearIsLoading(this.domNode);
		},
		
		label_showmore: EDR.messages.tooltip_showmoredocumentlabel,
		label_typeahead: EDR.messages.tooltip_documentlabel_typeahead		
	}
);