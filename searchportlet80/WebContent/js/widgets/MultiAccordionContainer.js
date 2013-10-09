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
dojo.provide("widgets.MultiAccordionContainer");
dojo.require("dijit.layout._LayoutWidget");
dojo.require("dijit.TitlePane");

dojo.declare(
	"widgets.MultiAccordionContainer", [dijit.layout._LayoutWidget],	
	{
		titlePaneHeight: 21,
		paddingHeight: 10,
		paneSpace: 5,
		duration: 500,
		handlers: [],
		
		facetPanes: [],
		traPanes: [],
		
		postCreate: function() {
			this.inherited(arguments);
			dojo.subscribe("postLoad", this, "updatePanes");
			dojo.subscribe("collectionChanged", this, "collectionChanged");
		},
		
		startup: function() {
			this.inherited(arguments);
			var self = this;
			dojo.forEach(this.getChildren(), function(pane) {
				dojo.style(pane.containerNode, "width", "100%");
				dojo.style(pane.containerNode, "height", "100%");				
				pane.toggle = function(){
					this.open =! this.open;
					this.open ? self.openPane(this) : self.closePane(this);
					this._onShow();
					this._setCss();
				}
				
				self.removeChild(pane);
				
				dojo.style(pane.domNode, "display", "none");
				if (pane.id.indexOf(EDR.prefix+"dynamicFieldChartTitlePane") == -1) {
					self.facetPanes.push(pane);
				} else {
					self.traPanes.push(pane);
				}
			});
		},
		
		updatePanes: function() {
			var mgr = dijit.byId(EDR.prefix+"searchManager");
			if (mgr) {
//				if (mgr.getSearchResult().isFacetedSearch || EDR.isTextAnalyticsEnabled) {
					this.showFacetPanes();
//				} else {
//					this.showTopResultAnalysisPanes();
//				}
				if(!mgr.isTextAnalyticsEnabled){
					mgr.setShowFacets(mgr.getSearchResult().showFacet);
					mgr.setShowTopResults(mgr.getSearchResult().showTPA);
					mgr._showHideNarrowResults();
				}
			}
		},
		
		collectionChanged: function() {
		   if (EDR.isTextAnalyticsEnabled) return;
		   this.clearPanes();
		},
		
		showFacetPanes: function() {
			this.clearPanes();
			dojo.forEach(this.facetPanes, dojo.hitch(this, function(pane) {
				if (pane.id.indexOf("documentLabelSearchTitlePane") != -1 && !EDR.isCategoryTreeEnabled) {					
				} else {
					dojo.style(pane.domNode, "display", "block");
					this.addChild(pane);
					if (EDR.isTextAnalyticsEnabled) pane.toggle = function() {}
				}
			}));
			this.resize();
		},
		
		showTopResultAnalysisPanes: function() {
			this.clearPanes();
			dojo.forEach(this.traPanes, dojo.hitch(this, function(pane) {
				dojo.style(pane.domNode, "display", "block");
				this.addChild(pane);
			}));
			this.resize();
		},
		
		clearPanes: function() {
			dojo.forEach(this.getChildren(), dojo.hitch(this, function(pane) {
				dojo.style(pane.domNode, "display", "none");
				this.removeChild(pane);
			}));
		},
		
		openPane: function(pane) {
			var self = this;
			var anims = [];
			var info = this._setupLayout();
			dojo.forEach(info.openPanes, function(pane) {
				anims.push(self._buildOpenAnimation(pane, info.wipeHeight));
			});						
			var anim = dojo.fx.combine(anims);
			var con = dojo.connect(anim, "onEnd", this, function() {
			 	this.layout();
			 	if (pane != null && pane.onOpenPane != null)
			 		pane.onOpenPane();
			 	dojo.disconnect(con);
			});
			anim.play();
		},
		
		closePane: function(pane) {
			var self = this;
			var anims = [];
			var info = this._setupLayout();
			dojo.forEach(info.openPanes, function(pane) {
				anims.push(self._buildOpenAnimation(pane, info.wipeHeight));
			});						
			anims.push(self._buildCloseAnimation(pane));
			var anim = dojo.fx.combine(anims);
			var con = dojo.connect(anim, "onEnd", this, function() { 
				this.layout();
			 	if (pane != null && pane.onOpenPane != null)
			 		pane.onClosePane();
			 	dojo.disconnect(con);
			});
			anim.play();
		},
		
		resize: function() {
			var searchManager = dijit.byId(EDR.prefix+"searchManager");
			if(searchManager) {
				if(!searchManager.isTextAnalyticsEnabled){
					var height = dojo.contentBox(this.domNode.parentNode).h;
					//The div's height of "narrow your results" is 20px
					dojo.style(this.domNode, "height", (height-20)+"px");
				}
			}
			// nothing to to for width:100%;height:100%;
			this.layout();
		},
		
		layout: function() {
			var info = this._setupLayout();
			var self = this;
			dojo.forEach(info.closePanes, function(pane) {
				dojo.style(pane.hideNode, "display", "none");
				dojo.style(pane.wipeNode, "display", "none");
				dojo.marginBox(pane.wipeNode, {h:0});
				pane.resize({h:this.titlePaneHeight + this.paneSpace});
			});
			dojo.forEach(info.openPanes, function(pane) {
				dojo.style(pane.hideNode, "display", "block");
				dojo.style(pane.wipeNode, "display", "block");
				dojo.marginBox(pane.wipeNode, {h:info.wipeHeight});
				pane.resize({h:info.wipeHeight + this.titlePaneHeight + this.paneSpace});
			});
		},		
		
		_setupLayout: function() {
			var openPanes = [];
			var closePanes = [];
			dojo.forEach(this.getChildren(), function(pane) {
				pane.open ? openPanes.push(pane) : closePanes.push(pane);
			});			
			var size = dojo.contentBox(this.domNode);
			var h = size.h - ((this.titlePaneHeight + this.paneSpace) * (closePanes.length + openPanes.length));
			var wipeHeight = 0;
			if (openPanes.length > 0)
				wipeHeight = Math.floor(h / openPanes.length) - this.paddingHeight;
			wipeHeight = Math.max(0, wipeHeight);
			
			return {
				openPanes: openPanes,
				closePanes: closePanes,
				wipeHeight: wipeHeight
			};
		},
		
		_buildOpenAnimation: function(pane, end) {
			var self = this;
			var animation = dojo.animateProperty(
		    	{
		    	    node: pane.wipeNode,
		    	    duration: self.duration,
		    	    properties: {
		    	    	height: {start: pane.wipeNode.clientHeight, end: end}
		            },
		            onBegin: function(n) {
						dojo.style(pane.hideNode, "display", "block");
						dojo.style(pane.wipeNode, "display", "block");
		            }
		        });
		    return animation;
		},
		
		_buildCloseAnimation: function(pane) {
			var self = this;
			var animation = dojo.animateProperty(
		    	{
		    	    node: pane.wipeNode,
		    	    duration: self.duration,
		    	    properties: {
		    	    	height: {start: pane.wipeNode.clientHeight, end: 0}
		            },
		            onEnd: function(n) {
						dojo.style(pane.hideNode, "display", "none");
						dojo.style(pane.wipeNode, "display", "none");
		            }
		        });
		    return animation;
		},
		
		destroy: function() {
			dojo.forEach(this.handlers, dojo.disconnect);
			this.inherited(arguments);
		}		
	}
);
