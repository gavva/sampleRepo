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
dojo.provide("widgets.layout.TabWindow");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("widgets.layout.BorderContainer");

dojo.require("widgets.TabWindow");
dojo.require("widgets.ResultToolbar");
dojo.require("widgets.ResultBottomBar");
dojo.require("widgets.MultiAccordionContainer");
dojo.require("widgets.ESTitlePane");
dojo.require("widgets.CategoryTree");

// for Search/TextAnalytics basic layout using TabContainer and BorderLayout
dojo.declare(
"widgets.layout.TabWindow",
widgets.TabWindow,
{
	
	_childLoading: false,
	
	widgetsInTemplate: true,
	templateString: null,
	templatePath: dojo.moduleUrl("widgets.layout", "templates/TabWindow.html"),
	_borderContainer: null,
	_isResultDisplay:false,
	
	handlers: [],
	
	startup: function() {
		this.inherited(arguments);
		
		// call startup functions for widgets which are under left pane
		dojo.forEach(dijit.findWidgets(this.leftContainerNode), function(widget) {
			if (widget.startup) widget.startup();
		});
	},
	
	// override
	_fillContent: function(source) {
		var leftPane = this.leftContainerNode;
		var rightPane = this.containerNode;
		if (source && leftPane && rightPane) {
			dojo.forEach(dojo.query("> DIV", source), function(div) {
				var dest = null;
				if (div.id == (EDR.prefix+"tabWindowLeftChildrenContainer")) {
					dest = leftPane;
				} else if (div.id == (EDR.prefix+"tabWindowRightChildrenContainer")) {
					dest = rightPane;
				}
				if (dest != null) {
					while(div.hasChildNodes()) {
						dest.appendChild(div.firstChild);
					}
				}
			});
		}
	},
	
	_hideChild: function(widget) {
		if (!this.transitioning) return;
		if (widget.onTabHide) widget.onTabHide();
		var button = this.tablist.pane2button[widget];
		if (button != null && dojo.hasClass(button.innerDiv, "tabActiveMiddle")) {
			this.toggleTabStyle(button);		
		}
		
		dojo.style(widget.domNode, "display", "none");
		
		if(widget["onHide"]) {
			widget.onHide();
			widget.isVisible = false;
		}
	},
	
	selectChild: function() {
//		if(this._childLoading) return;
		this.inherited(arguments);
	},
	
	_transition: function(){
		var tmp = this._containerContentBox;
		this._containerContentBox = dojo.contentBox(this.containerNode);
		this.inherited(arguments);
		this._containerContentBox = tmp;
	},
	
	_showChild: function(widget) {
		if (!this.transitioning) return;			
		this.activeTabId = widget.id;

		if (widget.onTabShow) widget.onTabShow();
		var button = this.tablist.pane2button[widget];
		if (button != null && dojo.hasClass(button.innerDiv, "tabInactiveMiddle")) {
			this.toggleTabStyle(button);
		}
		
		dojo.removeClass(widget.domNode, "dijitHidden");
		dojo.style(widget.domNode, "display", "block");
		
		if(widget["onShow"]) {
			widget.isVisible = true;
			widget.onShow();
		}
		
		//change Help URL
		var a = this.resultToolbar.eachTabHelp;
		a.onclick= dojo.hitch(this, function() {
			EDR.viewHelp(this._getHelpURL(widget.id)+".htm?noframes=true");	
		});
		if(!(this.activeTabId == (EDR.prefix+"documentViewId"))){
			this.containerNode.style.overflowX = "hidden";		
		}else{
			this.containerNode.style.overflowX = "auto";
			//adjust height of result's body when seleceted tab changed to document view
			this._borderContainer.resize();
		}
		dojo.publish("tabChanged", [{activeTabId:this.activeTabId}]);
	},
	
	postCreate: function() {
		this.inherited(arguments);		
//		this._borderContainer = this._supportingWidgets[0];		
		this._borderContainer = this._supportingWidgets[2];
		dojo.addOnLoad(dojo.hitch(this, "resize"));		
		
		dojo.style(this.tablist.domNode, "position", "relative");
		if(this.isLeftToRight()) {
			dojo.style(this.tablist.domNode, "left", "3px");	
		} else {
			dojo.style(this.tablist.domNode, "right", "3px");
		}
		
		this.hideResultDisplay();
		dojo.subscribe("postLoad", this, "applyChanges");
      dojo.subscribe("collectionChanged", this, "collectionChanged");
		
		var splitterPosition = this.isLeftToRight() ? "left" : "right"; 
		this.handlers.push(dojo.connect(this._borderContainer.getSplitter(splitterPosition), "_startDrag", this, "hideFlashPane"));
		this.handlers.push(dojo.connect(this._borderContainer.getSplitter(splitterPosition), "_stopDrag", this, "showFlashPane"));
	},
	
	hideFlashPane: function(){
		if(this.activeTabId != (EDR.prefix+"documentViewId")){
			widgets.analytics.hideAnalyticsPane();
			var container = dijit.byId(this.activeTabId).domNode;
			if(!EDR.isNoflash) {
				this.setIsLoading(container);
			}
		}else{
			//for resizing document pane
			this.layout();
		}
	},
	
	showFlashPane: function(){
		if(this.activeTabId != (EDR.prefix+"documentViewId")){
			var container = dijit.byId(this.activeTabId).domNode;
			if(!EDR.isNoflash) {
				this.clearIsLoading(container);
			}
			
//			widgets.analytics.showAnalyticsPane();
		}
		this.layout();
	},
	
    setIsLoading: function(div) {
       var targetDiv = div
       var loadingOverlay = dojo.query("div[class='resizingBackground']", targetDiv)[0];            
       if (!loadingOverlay) { // no overlay present
         // render an overlay to make the target div appear disabled.        
         var overlay = document.createElement("div");
         var pos = dojo.coords(targetDiv);
	     overlay.className = "resizingBackground";
	     overlay.style.position = "absolute";
	     overlay.style.left = pos.l;
	     overlay.style.top = pos.t;
	     overlay.style.width = pos.w + "px";
	     overlay.style.height = pos.h + "px";
	     overlay.style.zIndex = 100;
	     targetDiv.appendChild(overlay);
	     var busy = document.createElement("div");
	     busy.style.position = "absolute";
	     busy.style.left = (pos.w/2 - 25) + "px";
	     var heightOffset = pos.h == 0 ? 50 : pos.h;
	     busy.style.top = (heightOffset/2 - 10) + "px";
	     busy.innerHTML = EDR.messages.splash_resizing + "<img src=\""+EDR.config.imageBaseDir+"/status_indicator_20_slow.gif\" alt=\""+EDR.messages.splash_resizing+"\"/>";
	     busy.zIndex = 200;
	     overlay.appendChild(busy);
	     return overlay;
	   }
	   return loadingOverlay;
    },
    
    clearIsLoading: function(div) {      
      var targetDiv = div
      var loadingOverlay = dojo.query("div[class='resizeingBackground']", targetDiv)[0];
      if (loadingOverlay) {        
        targetDiv.removeChild(loadingOverlay);
      }
    },
	
	layout: function() {
		this._borderContainer.resize();
		
		var width = this._contentBox.w;
		dojo.style(this.tablist.domNode, "width", (width - 6) + "px");
		dojo.style(this.tablist.rightEdgeWindowDiv, "left", (width - 3) + "px");		
				
		var selected = this.selectedChildWidget;
		if(selected) {	
			dojo.style(selected.domNode, "width", "100%");
			dojo.style(selected.domNode, "height", "100%");
			if(selected.resize) {
				selected.resize();
			}
		}	
		// call startup functions for widgets which are under left pane
		dojo.forEach(dijit.findWidgets(this.leftContainerNode), function(widget) {
			if (widget.resize) widget.resize();
		});
		if(dojo.isIE <= 7) {
			this._borderContainer.resize();
			dojo.forEach(dijit.findWidgets(this.leftContainerNode), function(widget) {
				if (widget.resize) widget.resize();
			});
		}
		
		//for resizing outerWidth in document pane 
		var resultsHeaderTable = dijit.byId(EDR.prefix+"resultsHeader").searchResultsHeaderTable;
		if((this.activeTabId == (EDR.prefix+"documentViewId"))&&(dojo.contentBox(resultsHeaderTable).w>dojo.contentBox(dojo.byId(EDR.prefix+"documentViewId")).w)){
			dojo.contentBox(dojo.byId(EDR.prefix+"documentViewId"),{w:dojo.contentBox(resultsHeaderTable).w});
		}
	},
	
	hideResultDisplay: function(){
	   dojo.style(this.leftContainerNode, "visibility", "hidden");
		dojo.style(this._borderContainer.domNode,"visibility","hidden");
	},
	
	showResultDisplay: function(){
      dojo.style(this.leftContainerNode, "visibility", "visible");
		dojo.style(this._borderContainer.domNode,"visibility","visible");
	},
	
	applyChanges: function(){
		if(!this._isResultDisplay){
			this.showResultDisplay();
			this._isResultDisplay=true;
		}
	},
	
	collectionChanged: function() {
      if (EDR.isTextAnalyticsEnabled) return;
      this.hideResultDisplay();
      this._isResultDisplay=false;
	},
	
	_getHelpURL: function(activeWidgetId){
		if(activeWidgetId==(EDR.prefix+"documentViewId"))
			return "iiysutmdoc";
		else if(activeWidgetId==(EDR.prefix+"categoryViewId"))
			return "iiysutmfacet";
		else if(activeWidgetId==(EDR.prefix+"timeSeriesViewId"))
			return "iiysutmtime";
		else if(activeWidgetId==(EDR.prefix+"topicViewId"))
			return "iiysutmtopic";
		else if(activeWidgetId==(EDR.prefix+"deltaViewId"))
			return "iiysutmtrend";
		else if(activeWidgetId==(EDR.prefix+"twoDMapViewId"))
			return "iiysutm2dmap";
		else
			return "";
	},
	
	destroy: function() {
		dojo.forEach(this.handlers, dojo.disconnect);
		this.inherited("destroy", arguments);
	},
		
	__dummy__ : null
});
