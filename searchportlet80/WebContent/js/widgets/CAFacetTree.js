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
dojo.provide("widgets.CAFacetTree");

dojo.require("widgets.ESFacetTree");

dojo.declare(
	"widgets.CAFacetTree", [widgets.ESFacetTree],
	{				
		pfacetId: "",
		sfacetId: "",
		primaryFacetImg: null,
		secondaryFacetImg: null,
		
		postLoad: function() {
			this.inherited("postLoad", arguments);
			this.restoreFacet(this.pfacetId, this.sfacetId);
		},
		
		clearFacet: function() {
			this.pfacetId = "";
			this.sfacetId = "";
			this.primaryFacetImg = null;
			this.secondaryFacetImg = null;
		},
		
		restoreFacet: function(pfId, sfId) {
			var pImg = dojo.byId("pfacet-icon-" + pfId);
			if (pImg != null) {
				dojo.byId("pfacet").value = pfId;
				pImg.src = this.imgBasePath + "pfacet-e.gif";
				this.primaryFacetImg = pImg;
			} else {
				dojo.byId("pfacet").value = "";
				this.pfacetId = "";
			}
			var sImg = dojo.byId("sfacet-icon-" + sfId);
			if (sImg != null) {
				dojo.byId("sfacet").value = sfId;
				sImg.src = this.imgBasePath + "sfacet-e.gif";
				this.secondaryFacetImg = sImg;
			} else {
				dojo.byId("sfacet").value = "";
				this.pfacetId = "";
			}
			
			var activePane = dijit.byId(EDR.prefix+"horizontalSearchPanes").activeTabId;
			if (sImg != null && activePane == "2dmapPane") {
				dojo.publish("secondaryFacetChanged", [{}]);
			} else if (pImg != null) {
				dojo.publish("primaryFacetChanged", [{}]);
			}
		},
				
		buildFacetGroupContentElem: function(facet) {
			var contentBody = this.inherited("buildFacetGroupContentElem", arguments);
			var arrowImg = contentBody.firstChild;
			var label = arrowImg.nextSibling;
			
			var pfacet = dojo.doc.createElement("IMG");
			pfacet.src = this.imgBasePath + "pfacet-d.gif";
			dojo.addClass(pfacet, "pfacet");
			pfacet.setAttribute("id", "pfacet-icon-" + facet.id);
			this.handlers.push(dojo.connect(pfacet, "onclick", this, this.primaryFacetSelected));
			
			var sfacet = dojo.doc.createElement("IMG");
			sfacet.src = this.imgBasePath + "sfacet-d.gif";
			dojo.addClass(sfacet, "sfacet");
			sfacet.setAttribute("id", "sfacet-icon-" + facet.id);
			this.handlers.push(dojo.connect(sfacet, "onclick", this, this.secondaryFacetSelected));
			
			contentBody.insertBefore(sfacet, label);
			contentBody.insertBefore(pfacet, sfacet);
			
			return contentBody;
		},
		
		primaryFacetSelected: function(evt) {
			if (evt != null && evt.stopPropagation) evt.stopPropagation();
			var img = evt.currentTarget;
			var facetId = img.id.substr(12);
			if (img.src != this.imgBasePath + "pfacet-e.gif") {
				img.src = this.imgBasePath + "pfacet-e.gif";
				if (this.primaryFacetImg != null) {
					this.primaryFacetImg.src = this.imgBasePath + "pfacet-d.gif";
				}
				this.pfacetId = facetId;
				this.primaryFacetImg = img;
				dojo.byId("pfacet").value = facetId;
				
				dojo.publish("primaryFacetChanged", [{facetId:facetId}]);
			}
			return false;
		},
		
		secondaryFacetSelected: function(evt) {
			if (evt != null && evt.stopPropagation) evt.stopPropagation();
			var img = evt.currentTarget;
			var facetId = img.id.substr(12);
			if (img.src != this.imgBasePath + "sfacet-e.gif") {
				img.src = this.imgBasePath + "sfacet-e.gif";
				if (this.secondaryFacetImg != null) {
					this.secondaryFacetImg.src = this.imgBasePath + "sfacet-d.gif";
				}
				this.sfacetId = facetId;
				this.secondaryFacetImg = img;
				dojo.byId("sfacet").value = facetId;
				
				dojo.publish("secondaryFacetChanged", [{facetId:facetId}]);
			}
			return false;
		}
	}
);