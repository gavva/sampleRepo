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
dojo.provide("widgets.analytics._AnalyticsPane");

dojo.require("dijit.layout.ContentPane");
dojo.require("dijit._Templated");

dojo.declare(
"widgets.analytics._AnalyticsPane",
[dijit._Widget, dijit._Templated],
{
	
	isVisible: false,
	hasHorizontalFacet: false,
	activeIconPath: "",
	
	flashContainerId: "",
	
	verticalRowCount: "10",
	horizontalRowCount: "10",
	verticalTarget: "keywords",
	horizontalTarget: "keywords",
	
	lastFullQuery: '',
	
	escapeQuery: function(str) {
		// escapeTargets = ["*", "\"", "?", "\\"] ;
		var ret = str.replace(/\\/g, "\\\\");
		ret = ret.replace(/\*/g, "\\*");
		ret = ret.replace(/"/g, "\\\"");
		ret = ret.replace(/\?/g, "\\?");

		return ret;
	},
	
	moveIntoScreen: function() {
		if(EDR.dialog.util.dialogs.length > 0) {
			return;
		}
		var coords = dojo.coords(this.containerNode, true);

		var flashContainer = dojo.byId(this.flashContainerId);
		if(!flashContainer) {
			return;
		}
		with(flashContainer.style) {
			width = coords.w + "px";
			height = (coords.h - 2) + "px";
			left = coords.x + "px";
			top = coords.y + "px";
		}		
	},
	
	hideFromScreen: function() {
		var flashContainer = dojo.byId(this.flashContainerId);
		if(!flashContainer) {
			return;
		}
		with(flashContainer.style) {
			width = "1px";
			height = "1px";
			//left = "-9999px";
			top = "-9999px";
		}		
	},
	
	onShow: function() {
		this.layout();

		
		widgets.analytics._AnalyticsPane.currentPane = this;
		
//		var verticalTarget = dijit.byId("verticalListTarget");
//		if(verticalTarget) {
//			this._programmaticallyChanged++;
//			verticalTarget.setValue(this.verticalTarget);
//		}
//		
//		var verticalRowCount = dijit.byId("verticalMaxRows");
//		if(verticalRowCount) {
//			this._programmaticallyChanged++;
//			verticalRowCount.setValue(this.verticalRowCount);
//		}
	},
	
	onHide: function() {
		widgets.analytics._AnalyticsPane.currentPane = null;
		
		this.hideFromScreen();
	},
	
	_layoutTimer: null,
	
	resize: function() {
		this.layout();
	},
	
	// call after child's layout()
	layout: function() {
		if(this._layoutTimer != null) {
			clearTimeout(this._layoutTimer);
			this._layoutTimer = null;
		}
		this._layoutTimer = setTimeout(dojo.hitch(this, "_layout"), 0);
	},
	
	_layout: function() {
		this.moveIntoScreen();
	}
});


// Class methods
widgets.analytics._AnalyticsPane.currentPane = null;
widgets.analytics.hideAnalyticsPane = function() {
	var flashPane = widgets.analytics._AnalyticsPane.currentPane;
	if(flashPane) {
		flashPane.hideFromScreen();
	}	
}


widgets.analytics.showAnalyticsPane = function() {
	var flashPane = widgets.analytics._AnalyticsPane.currentPane;
	if(flashPane) {
		flashPane.moveIntoScreen();
	}	
}

widgets.analytics.currentPaneRefresh = function() {
	var currentPane = widgets.analytics._AnalyticsPane.currentPane;
	if(currentPane._programmaticallyChanged > 0) {
		currentPane._programmaticallyChanged--;
		return;
	}
		
	if(currentPane && currentPane.refresh) {
		currentPane.refresh();
	}
}

widgets.analytics.setVerticalTarget = function(target) {
	var currentPane = widgets.analytics._AnalyticsPane.currentPane;
	if(currentPane) {
		currentPane.verticalTarget = target;
	}
}

widgets.analytics.setHorizontalTarget = function(target) {
	var currentPane = widgets.analytics._AnalyticsPane.currentPane;
	if(currentPane) {
		currentPane.horizontalTarget = target;
	}	
}

widgets.analytics.setVerticalRowCount = function(count) {
	var currentPane = widgets.analytics._AnalyticsPane.currentPane;
	if(currentPane) {
		currentPane.verticalRowCount = count;
	}	
}

widgets.analytics.setHorizontalRowCount = function(count) {
	var currentPane = widgets.analytics._AnalyticsPane.currentPane;
	if(currentPane) {
		currentPane.horizontalRowCount = count;
	}	
}

