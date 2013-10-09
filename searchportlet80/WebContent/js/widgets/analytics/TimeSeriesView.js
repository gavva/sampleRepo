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
dojo.provide("widgets.analytics.TimeSeriesView");

dojo.require("widgets.analytics._AnalyticsPane");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.HorizontalSlider");

dojo.declare(
"widgets.analytics.TimeSeriesView",
widgets.analytics._AnalyticsPane,
{
	prefix: EDR.prefix,
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl("widgets.analytics", "templates/TimeSeriesView.html"),
	
	url: "",
	timeScale: ".year",
	
	timeScaleSelection: null,	
	onSubmitListener: null,
	filterTimer: null,
	
	startup: function() {
		this.inherited("startup", arguments);
		
		if (!EDR.isNoflash) {
			dojo.style(this.toolbarNode, "display", "none");
		}
		
		dojo.subscribe("refresh", this, "refresh");
		dojo.subscribe("verticalFacetChanged", this, "refresh");
	},
	
	load: function(timeScaleFacetId) {
		if (!EDR.isNoflash) {
			var successCallback = dojo.hitch(this, function() {
				this.clear();
				TimeSeriesView.load("-", true, "", this.url, "");
			});
			if (TimeSeriesView.initialized) {
				successCallback();
			} else {
				TimeSeriesView.lazyLoading = successCallback;
			}
		} else {
			var params = {
				timescale_path: this.timeScaleSelection.value,
				resultType: "html"
			};		
			var args = 	{ 
				url: this.url,
				showProgress: false,
				successCallback: dojo.hitch(this, function(response, ioArgs) {
					try {
						this.containerNode.innerHTML = response;
						this.postLoad();
					} catch (e) {
						this.loadErrorHandler(response, ioArgs);
						return;
					}
				}),
				afterErrorHandlerCallback: dojo.hitch(this, function(response, ioArgs) {
					this.loadErrorHandler(response, ioArgs);
				}),
				content: params,
				timeout: this.timeout
			};			
			this.preLoad();
			EDR.ajax.Request.post(args);
		}	
	},
	
	loadErrorHandler: function(response, ioArgs) {
		EDR.ajax.Loading.clearIsLoading(this.domNode.parentNode.parentNode);
	},
	
	loadFlexErrorHandler: function(event) {
		try {
			var json = dojo.fromJson(event.getErrorJsonString());
			if (json.warning != null) {
				EDR.ajax.Warning.handle(json.warning, []);
			} else if (json.error != null) {
				EDR.ajax.Error.handle(json.error, []);
			} else {
				alert(event.getErrorJsonString());
			}
		} catch (e) {			
			alert(event.getErrorJsonString());
		}
	},
	
	clear: function() {
		if (!EDR.isNoflash) {
			TimeSeriesView.addFlexEventListener("onSubmitSearch", dojo.hitch(this, "onSubmitSearch"));
			TimeSeriesView.addFlexEventListener("onLoadError", dojo.hitch(this, "loadFlexErrorHandler"));
		}
	},
	
	refresh: function() {		
		if (!this.isVisible) return;		
		this.load(this.timeScale);
	},
	
	reset: function() {
	},
	
	resize: function() {
		this.layout();
	},
	
//	layout: function() {
//		var size = dojo.contentBox(this.domNode);
//		dojo.contentBox(this.containerNode, {
//			h:dojo.contentBox(this.domNode).h - dojo.marginBox(this.toolbarNode).h
//		});
//		
//		this.inherited(arguments);
//	},
	
	preLoad: function() {
		EDR.ajax.Loading.setIsLoading(this.domNode.parentNode.parentNode);
//		widgets.analytics.hideAnalyticsPane();	
//		dijit.byId("horizontalSearchPanes")._childLoading = true;
	},
	
	postLoad: function() {
		EDR.ajax.Loading.clearIsLoading(this.domNode.parentNode.parentNode);
//		widgets.analytics.showAnalyticsPane();
//		dijit.byId("horizontalSearchPanes")._childLoading = false;
	},
		
	onShow: function() {
		this.inherited(arguments);
	//	dijit.byId("horizontalSearchPanes").resultToolbar.enableDeepInspectionButton(false);
		this.refresh();
	},
	
	onHide: function() {
		this.inherited(arguments);
	//	dijit.byId("horizontalSearchPanes").resultToolbar.enableDeepInspectionButton(true);
	},
	
	onTimescaleChanged: function(evt) {
		this.timeScale = this.timeScaleSelection.value;
		this.refresh();
	},
	
	onChartItemSelected: function(event) {
		if (event.getStartDate() != null) {
//			this._enableButtons(true, true, TimeSeriesView.hasDateRangeFilter());
		} else {
//			this._enableButtons(false, false, false);
		}
	},
		
	onSubmitSearch: function(event) {
		if (event == null) return;
		var params = {
			keywords: event.getQueryString(),
			operator: event.getOperatorString()
		};
		dijit.byId(EDR.prefix+"searchManager").submitQuickRefineSearch(params);
/*
//		var event = TimeSeriesView.getOnSubmitSearchEvent();
		if (event == null) return;
		
		var timeScale = event.getTimeScale();
		if(this.timeScale != timeScale) {
			this.timeScale = timeScale;
			this.refresh();
			return;
		}		
		
		var startDate = event.getStrStartDate();
		var endDate = event.getStrEndDate();
		
		// #date::>=2001-08-17 #date::<=2002-08-17
		var params = { 
			keywords: "#date::>=" + startDate + " #date::<=" + endDate
		};
		dijit.byId(EDR.prefix+"searchManager").submitQuickRefineSearch(params); */
	},
	
	destroy: function() {
		dojo.forEach(this.handlers, dojo.disconnect);
		this.inherited(arguments);
	},
	
	label_year:	EDR.messages.$_year,
	label_month:	EDR.messages.$_month,
	label_day:	EDR.messages.$_day,
	label_month_of_year:	EDR.messages.$_month_of_year,
	label_day_of_month:	EDR.messages.$_day_of_month,
	label_day_of_week:	EDR.messages.$_day_of_week,
	label_timescale:	EDR.messages.common_analytics_timescale,
	label_sort:	EDR.messages.common_analytics_sort,
	label_show:	EDR.messages.common_analytics_show,
	label_keyword:	EDR.messages.common_analytics_keyword,
	label_subfacets:	EDR.messages.common_analytics_subfacets,
	label_sort_freq:	EDR.messages.common_analytics_sort_freq,
	label_sort_index:	EDR.messages.common_analytics_sort_index,
	label_sort_latest_index:	EDR.messages.common_analytics_sort_latest_index,
	label_sort_ascending:	EDR.messages.common_analytics_sort_ascending,
	label_sort_descending:	EDR.messages.common_analytics_sort_descending,
	
	__dummy__: null
});
