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
dojo.provide("widgets.PreferencesDialog");
dojo.require("widgets.customDialog");

dojo.require("dijit.Dialog");

/*
 * This class was created so that we could have a common look-and-feel
 * for all dialogs in the product.  This should be used instead of 
 * dijit.Dialog.  It also adds a property to the standard dijit.Dialog
 * class called isClosable.  Setting this property to false when the 
 * dialog is declared in HTML will prevent the close button from appearing
 * in the title bar.
 */
dojo.declare(
	"widgets.PreferencesDialog", [widgets.customDialog],
	{		
		url: "",
		saveUrl: "",
		saveAdvUrl: "",
		_autoLoad: false,
		timeout: 60000,
		json: null,		
		
		tabContainer: null,
		searchOptions: null,
		facetOptions: null,
		tpaOptions: null,
		resultsOptions: null,
		resultsColumns: null,
		preventDoubleClickFlag: false,
		
		postCreate: function() {
			this.inherited("postCreate", arguments);			
		},
		
		preLoad: function() {
			EDR.ajax.Loading.setIsLoading(this.containerNode);
		},
		
		postLoad: function() {
			EDR.ajax.Loading.clearIsLoading(this.containerNode);
		},
		
		loadErrorHandler: function(response, ioArgs) {
			// publish Ajax error handling event
			dojo.publish("ajaxError", [response, ioArgs]);			
			EDR.ajax.Loading.clearIsLoading(this.containerNode);
		},
		
		saveErrorHandler: function(response, ioArgs) {
			// publish Ajax error handling event
			dojo.publish("ajaxError", [response, ioArgs]);			
			EDR.ajax.Loading.clearIsLoading(this.containerNode);
		},
		
		startup: function() {
			this.inherited("startup", arguments);			
			this.tabContainer = dijit.byId(EDR.prefix+"searchPanePreferenceTab");
			this.searchOptions = dijit.byId(EDR.prefix+"searchOptions");
			this.resultsOptions = dijit.byId(EDR.prefix+"resultsOptions");
			this.resultsColumns = dijit.byId(EDR.prefix+"resultsColumns");
			var searchManager = dijit.byId(EDR.prefix+"searchManager");
			if(searchManager) {
				if(!searchManager.isTextAnalyticsEnabled){	
					this.facetOptions = dijit.byId(EDR.prefix+"facetOptions");
					this.tpaOptions = dijit.byId(EDR.prefix+"tpaOptions");
				}else{
					this.analyticsFacetOption = dijit.byId(EDR.prefix+"analyticsFacetOption");
					this.analyticsTimeSeriesOption = dijit.byId(EDR.prefix+"analyticsTimeSeriesOption");
					this.analyticsDeviationsOption = dijit.byId(EDR.prefix+"analyticsDeviationsOption");
					this.analyticsTrendsOption = dijit.byId(EDR.prefix+"analyticsTrendsOption");
					this.analyticsFacetPairsOption = dijit.byId(EDR.prefix+"analyticsFacetPairsOption");
				}
			}
		},
		
		load: function() {
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
					this.loadJson(json);	
					this.postLoad();		
				}),
				afterErrorHandlerCallback: dojo.hitch(this, function(response, ioArgs) {
					this.loadErrorHandler(response, ioArgs);
				}),
				timeout: this.timeout
			};
			
			this.preLoad();					
			EDR.ajax.Request.post(args);
		},
		
		changeCollection: function() {
			var params = this.getFormValues();
			// if (!this.validate(params)) return;
			this.preLoad();			
			var args = 	{ 
				url: this.url,
				successCallback: dojo.hitch(this, function(response, ioArgs) {
					var json = null;
					try {
						json = dojo.fromJson(response);
					} catch (e) {
			        	this.loadErrorHandler(response, ioArgs);
			        	return;
					}
					this.clear();
					this.loadJson(json);	
					this.postLoad();		
				}),
				afterErrorHandlerCallback: dojo.hitch(this, function(response, ioArgs) {
					this.loadErrorHandler(response, ioArgs);
				}),
				timeout: this.timeout,
				content: params,
				showProgress: false
			};
			EDR.ajax.Request.post(args);
		},
		
		save: function() {
			var params = this.getFormValues();
			if (!this.validate(params)) return false;
			
			this.preLoad();			
			var args = 	{ 
				url: this.saveUrl,
				successCallback: dojo.hitch(this, function(response, ioArgs) {
					var json = null;
					try {
						json = dojo.fromJson(response);
					} catch (e) {
			        	this.saveErrorHandler(response, ioArgs);
			        	return;
					}
					if (json.error) {
			        	this.saveErrorHandler(response, ioArgs);
			        	return;
					}
					this.saved(json);
					this.postLoad();					
					this.cancelFunction();
				}),
				afterErrorHandlerCallback: dojo.hitch(this, function(response, ioArgs) {
					this.saveErrorHandler(response, ioArgs);
				}),
				timeout: this.timeout,
				content: params,
				showProgress: false
			};
			EDR.ajax.Request.post(args);
			return true;
		},
		
		saved: function(json) {
			// Changed collection has category tree or not
			EDR.isCategoryTreeEnabled = json.isCategoryTreeEnabled;
			
			//for a display of banner's collections
			var isCollectionChanged = dijit.byId(EDR.prefix+"bannerId").setCollections(json.collections, json.isFacetedSearch);
			if (isCollectionChanged) {
				dojo.publish("collectionChanged");
			} else {
				dojo.publish("preferenceChanged");
			}
			
			//enable/disable export toolbar button
			var resultToolbar = dijit.byId(EDR.prefix+"horizontalSearchPanes").resultToolbar;
			resultToolbar.enableExportButton(json.isExportEnabled);
			resultToolbar.changeOptionsState(json.isDocCacheEnabled);
			resultToolbar.enableDeepInspectionButton(json.isDeepInspectionEnabled);
			resultToolbar.changeSecureMode(json.isSecureCollection);
			//change a display for resultsPerPage on toolbar
			resultToolbar.updateResultPerPage(json.resultsRange);
			
			//change number of results for type ahead
			var typeAheadWidget = dijit.byId(EDR.prefix+"typeAheadWidget");
			typeAheadWidget.setNumberOfResults(json.typeAheadNumberOfResults);
			typeAheadWidget.setMode(json.typeAheadMode);
			
			//change analytics result range
			if(EDR.isTextAnalyticsEnabled) {
				this.analyticsFacetOption.afterSaveApplyChanges(json.facets, isCollectionChanged);
				this.analyticsDeviationsOption.afterSaveApplyChanges(json.deviations, isCollectionChanged);
				this.analyticsTrendsOption.afterSaveApplyChanges(json.trends, isCollectionChanged);
				this.analyticsFacetPairsOption.afterSaveApplyChanges(json.facetPairs, isCollectionChanged);
			}
		},
		
		/***************** [Begin] temp fix for adv options ***************************/
		
		savedAdvancedOptions: function(json) {
			//for a display of banner's collections
			var isCollectionChanged = dijit.byId(EDR.prefix+"bannerId").setCollections(json.collections, json.isFacetedSearch);
			if (isCollectionChanged) dijit.byId(EDR.prefix+"categoryTree").forceReload();
			
			//enable/disable export toolbar button
			var resultToolbar = dijit.byId(EDR.prefix+"horizontalSearchPanes").resultToolbar; 
			resultToolbar.enableExportButton(json.isExportEnabled);
			resultToolbar.changeOptionsState(json.isDocCacheEnabled);
			resultToolbar.enableDeepInspectionButton(json.isDeepInspectionEnabled);
			//change a display for resultsPerPage on toolbar
			resultToolbar.updateResultPerPage(json.resultsRange);
		},
		
		/***************** [End] temp fix for adv options ***************************/
		
		loadJson: function(json) {
			this.json = json;
			if (json.searchOptions != null) {
				this.searchOptions.loadJson(json.searchOptions);
			}
			if (json.preferences.resultsOptions != null) {
				this.resultsOptions.loadJson(json.preferences.resultsOptions);
			}
			if (json.preferences.resultColumns != null) {
				this.resultsColumns.buildPreferences(json.preferences.resultColumns);
			}
			var searchManager = dijit.byId(EDR.prefix+"searchManager");
			if(searchManager) {
				if(!searchManager.isTextAnalyticsEnabled){
					if (json.preferences.facetOptions != null) {
						this.facetOptions.loadJson(json.preferences.facetOptions);
					}
					if (json.preferences.tpaOptions != null) {
						this.tpaOptions.loadJson(json.preferences.tpaOptions);
					}
				}else{
					if(json.preferences.analyticsOptions.facets!=null){
						this.analyticsFacetOption.loadJson(json.preferences.analyticsOptions.facets);
					}
					if(json.preferences.analyticsOptions.timeSeries!=null){
						this.analyticsTimeSeriesOption.loadJson(json.preferences.analyticsOptions.timeSeries);
					}
					if(json.preferences.analyticsOptions.deviations!=null){
						this.analyticsDeviationsOption.loadJson(json.preferences.analyticsOptions.deviations);
					}	
					if(json.preferences.analyticsOptions.trends!=null){
						this.analyticsTrendsOption.loadJson(json.preferences.analyticsOptions.trends);
					}					
					if(json.preferences.analyticsOptions.facetPairs!=null){
						this.analyticsFacetPairsOption.loadJson(json.preferences.analyticsOptions.facetPairs);
					}				
				}
			}
		},
		
		getFormValues: function() {
			var params = this.searchOptions.getFormValues();
			params = dojo.mixin(params,this.resultsColumns.getFormValues(),this.resultsOptions.getFormValues());
			
			var searchManager = dijit.byId(EDR.prefix+"searchManager");
			if(searchManager) {
				if(!searchManager.isTextAnalyticsEnabled){
					params = dojo.mixin(params,this.facetOptions.getFormValues(),this.tpaOptions.getFormValues());
				}else{
					params = dojo.mixin(params,
								this.analyticsFacetOption.getFormValues(),
								this.analyticsTimeSeriesOption.getFormValues(),
								this.analyticsDeviationsOption.getFormValues(),
								this.analyticsTrendsOption.getFormValues(),
								this.analyticsFacetPairsOption.getFormValues()
								);
				}
			}
			return params;
		},
		
		validate: function(params) {
			var panes = EDR.isTextAnalyticsEnabled ?
				[this.searchOptions, this.resultsOptions, this.resultsColumns, 
					this.analyticsFacetOption, this.analyticsTimeSeriesOption, this.analyticsDeviationsOption,
					this.analyticsTrendsOption, this.analyticsFacetPairsOption] :
				[this.searchOptions, this.resultsOptions, this.resultsColumns, this.facetOptions, this.tpaOptions];
					
			for (var i=0; i<panes.length; i++) {
				if (!panes[i].validate(params)) return false;
			}
			return true;
		},
		
		clear: function() {
		},
		
		showTab: function(id) {
			this.tabContainer.selectChild(id);
		},
		
		show: function() {
			this.preventDoubleClickFlag=false;
			this.load();
			this.inherited(arguments);
		},
		
		okFunction: function() {
			if(!this.preventDoubleClickFlag){
				this.preventDoubleClickFlag=true;
				if (!this.save()) {
					this.preventDoubleClickFlag = false;
					return;
				}
				
				var searchManager = dijit.byId(EDR.prefix+"searchManager");
				if(searchManager) {
					if(searchManager.getSearchResult()!=null){
						if(!searchManager.isTextAnalyticsEnabled){
							this.facetOptions.applyChanges();
							this.tpaOptions.applyChanges();
						}
						this.resultsColumns.afterSaveApplyChanges();
					}
				}
			}
		},
		
		cancelFunction: function() {
			this.inherited("cancelFunction", arguments);
		},
		
		//messages
		preferences_saved: ""
	}
);
