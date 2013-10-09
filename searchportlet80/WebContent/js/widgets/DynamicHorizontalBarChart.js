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
dojo.provide("widgets.DynamicHorizontalBarChart");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit.form.ComboBox");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("widgets.HorizontalBarChart");

dojo.declare(
	"widgets.DynamicHorizontalBarChart", [dijit._Widget, dijit._Templated],
	{		
		templatePath: dojo.moduleUrl("widgets", "templates/DynamicHorizontalBarChart.html"),
		widgetsInTemplate: true,
		
		selection: null,
		chart: null,
		json: null,
		handlers: [],		
		
		_autoLoad: false,
		timeout: 60000,
		imgBasePath: EDR.config.imageBaseDir,
		url: "",
		resizing: false,
		
		labelAttr: "",
		searchAttr: "",
		groupPrefix: "",
		
		isDynamic: true,
		
		postCreate: function() {
			this.inherited("postCreate", arguments);
			this.selection = this._supportingWidgets[0];
			this.chart = this._supportingWidgets[1];
			
			if (!this.isDynamic) dojo.style(this.selectionContainer, "display", "none");
			
			this.handlers.push(dojo.connect(this.chart, "barSelected", this, "onItemSelected"));
			this.handlers.push(dojo.connect(this.selection, "onChange", this, "onGroupSelected"));
			
			dojo.subscribe("refresh", this, "refresh");
			
			if (this._autoLoad && this.url != null && this.url.length != 0) {
				this.load(this.url);
			} else {
				this.json = this._getNullGroups();
			}
			if (this._autoLoad) this.loadJson(this.json);
		},
		
		load: function(url) {
			if (!this.isVisible()) return;
			
			if (url == null) url = this.url;
			var params = this.getRequestParams();
			
			var args = 	{ 
				url: url,
				showProgress: false,
				successCallback: dojo.hitch(this, function(response, ioArgs) {
					var json = null;
					try {
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
				content: params,
				timeout: this.timeout
			};			
			this.preLoad();					
			EDR.ajax.Request.post(args);
		},
		
		resize: function() {
			if (!this.isVisible()) return;
			
			this.resizing = true;
			this.layout();
			this.resizing = false;
		},
		
		layout: function() {
			var clientSize = dojo.contentBox(this.domNode);
			var selectionSize = dojo.marginBox(this.selectionContainer);
			dojo.marginBox(this.chart.domNode, {
				// w: clientSize.w,
				h: (clientSize.h - selectionSize.h)
			});
			this.onGroupSelected();
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
		
		loadJson: function(json) {
			if (json == null) return;
			
			this.json = json;
			this.buildGroupSelection(json);
		},
		
		onGroupSelected: function(value) {
			var selected = this.selection.item;
			if (selected == null) {
				this.renderBarChart(this._getNullGroupItems());
			} else {
				var selectedName = selected[this.groupPrefix + "Id"];
				if (this[this.groupPrefix + "Name"] == selectedName) {
					this.renderBarChart(selected);
				} else {
					this[this.groupPrefix + "Name"] = selectedName;
					this.load();
				}
			}
		},
		
		onItemSelected: function(item) {
			var param = this.getFormValues(item);
			dijit.byId(EDR.prefix+"searchManager").submitQuickRefineSearch(param);
		},
		
		getFormValues: function(item) {
			return {};
		},
		
		getRequestParams: function() {
			return {};
		},
		
		buildGroupSelection: function(groups) {
			this.selection.store = new dojo.data.ItemFileReadStore(
				{ data: { items:groups } }
			);
			
			if (groups.length > 0) {
				var selected = null;
				for (var i=0; i<groups.length; i++) {
					if (groups[i].isSelected) {
						selected = groups[i];
						break;
					}
				}
//				if (selected == null && this.isDynamic) selected = groups[0];
				if (selected != null)
					this.selectGroup(selected);
				else
					this.chart.clear();
			} else {
				this.selection.attr("value", "");
				this.selection.attr("item", null);
				this.chart.clear();
			}
		},
		
		selectGroup: function(group) {
			if (group == null) return;
			
			this.selection.attr("value", group[this.groupPrefix + "Label"]);
			this.selection.attr("item", group);
			this.onGroupSelected(group[this.groupPrefix + "Name"]);		
		},
		
		renderBarChart: function(json) {
			if (json == null) return;

			// set maxCount param
			if (json.maxCount == null) {
				var maxCount = 0;
				for (var i=0; i<json.items.length; i++) {
					var count = parseInt(json.items[i].count);
					if (maxCount < count) maxCount = count;
				}
				json.maxCount = maxCount;
			}
			
			this.chart.resizing = this.resizing;
			this.chart.loadJson(json);
		},
		
		preLoad: function() {
		},
		
		postLoad: function() {
		},
		
		_getNullGroups: function() {
			return [];
		},
		
		_getNullGroupItems: function() {
			return {
				items: []
			};
		},
		
		loadErrorHandler: function(response) {
		},
		
		clear: function() {
			dojo.forEach(this.handlers, dojo.disconnect);
		},
		
		destroy: function() {
			this.clear();
			this.inherited("destroy", arguments);
		}		
	}
);