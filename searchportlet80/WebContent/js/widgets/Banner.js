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
dojo.provide("widgets.Banner");

dojo.require("dijit.layout._LayoutWidget");
dojo.require("dijit._Templated");

dojo.declare(
	"widgets.Banner",
	[dijit.layout._LayoutWidget, dijit._Templated],
	{
		config_banner_file: EDR.config.banner_file,
		
		"class": "Banner",
				
		templateString: null,
		
		loginId: "",
		loginIdLabel: "",
		productName: "",
		isFacetedSearch: false,
		isLoggedIn: true,
		collections: "",
		collectionIds: "",
		fontStyle: "font-size:13px;",
		limitWidthForCollections: 80,
		limitWidthForUserName: 80,
		
		messages_banner_collection : EDR.messages.banner_collection,
		messages_banner_collection_change : EDR.messages.banner_collection_change,
		messages_banner_collection_change_tooltip: EDR.messages.banner_collection_change_tooltip,
		
		templatePath: dojo.moduleUrl("widgets", "templates/Banner.html"),
		
		postCreate: function() {
			if (this.loginId != "" && this.loginIdLabel != "") {
				if(!EDR.isPortlet) {
					this.loginIdNode.style.display = "block";
				} else {
					this.limitWidthForCollections = 320;
				}
				this.collectionNode.style.display = "block";
			}
			this.userNameNode.title = this.loginId;
			this.userNameNode.innerHTML = this._getTruncatedLabel(this.loginId,this.limitWidthForUserName);
			this.bannerCollectionsDisplay.title = this.collections;
			this.bannerCollectionsDisplay.innerHTML = this._getTruncatedLabel(this.collections,this.limitWidthForCollections);
			this.changeLinkNode.onclick = function(){
				var dlg = dijit.byId(EDR.prefix+"preference");
				if(!dlg) {
					dojo.parser.parse(EDR.prefix+"preference-Container");
					dlg = dijit.byId(EDR.prefix+"preference");
				}
				dlg.showTab(EDR.prefix+"searchOptionsTab");
				EDR.dialog.util.show(dlg);
			};
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
		
		setCollections: function(json, isFacetedSearch){
			var collectionsStr = json.collectionLabels;
			var collectionIds = json.collectionIds;
			var isChanged = false;
			if (this.isFacetedSearch == null || this.isFacetedSearch != isFacetedSearch) isChanged = true;
			if (this.collectionIds != null && this.collectionIds != collectionIds) isChanged = true;
			this.collections = collectionsStr;
			this.collectionIds = collectionIds;
			this.isFacetedSearch = isFacetedSearch;
			this.bannerCollectionsDisplay.title = collectionsStr;
			this.bannerCollectionsDisplay.innerHTML = this._getTruncatedLabel(collectionsStr,this.limitWidthForCollections);
			return isChanged;
		},
		
		resize: function(){
			var width = this.domNode.clientWidth;
			var w = ((width-1000)> 0) ? (width-1000) : 0;
			var collectionMargin = w*0.25 + 20;
			dojo.style(this.collectionNode,"marginRight",collectionMargin+"px");
			if(!EDR.isPortlet) {
				this.limitWidthForCollections = w*0.25 +30;	
			} else {
			}
			
			this.bannerCollectionsDisplay.innerHTML = this._getTruncatedLabel(this.collections,this.limitWidthForCollections);
			this.userNameNode.innerHTML = this._getTruncatedLabel(this.loginId,this.limitWidthForCollections);
		}
	}
);