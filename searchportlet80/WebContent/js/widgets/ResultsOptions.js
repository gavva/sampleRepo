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
dojo.provide("widgets.ResultsOptions");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit.form.RadioButton");
dojo.require("dijit.form.NumberSpinner");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.HorizontalSlider");
dojo.require("dijit.form.HorizontalRule");
dojo.require("dijit.form.HorizontalRuleLabels");
dojo.require("widgets.Button");

dojo.declare(
	"widgets.ResultsOptions", [dijit._Widget, dijit._Templated],
	{
		prefix: EDR.prefix,
		imgBasePath: EDR.config.imageBaseDir,
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl("widgets", "templates/ResultsOptions.html"),
		_autoLoad: false,
		handlers: [],
		
		_sortByItems: null, // sortBy items for 2nd, 3rd keys

		json: null,
				
		postCreate: function() {
			this.inherited("postCreate", arguments);

			if (this._autoLoad) this.loadJson();
			
			this.typeAheadNumberOfResults.domNode.style.marginTop = "2px";
			this.handlers.push(dojo.connect(this.sortBy,"onChange",this,this._onSortByChange));
			this.handlers.push(dojo.connect(this.sortBy2,"onChange",this,this._onSortBy2Change));
			this.handlers.push(dojo.connect(this.sortBy3,"onChange",this,this._onSortBy3Change));
			this.handlers.push(dojo.connect(this.queryMode,"onChange",this,this._onQueryModeChange));
			this.handlers.push(dojo.connect(this.typeAheadMode,"onChange",this,this._onTypeAheadModeChange));
			if(dojo.isIE){
				//for IE to avoid right align
				this.handlers.push(dojo.connect(this.typeAheadMode, "_selectOption", this, this._moveFocusOnTypeAheadMode));
				if(EDR.isPortlet) {
					this.domNode.style.overflow = "auto";
				}
			}
		},		
		
		loadJson: function(json) {
			if (json == null) json = this._getNullResultsOptions();
			this.json = json;
			this.buildOptions();
		},
				
		getFormValues: function() {
			var values = dojo.formToObject(this.resultsOptionsForm);
			return values;
		},
		
		validate: function(params) {
			var errors = "";

			if (!this.resultsRange.isValid()) {
				errors += this.label_number + " : " + this.resultsRange.invalidMessage + "<br/><br/>";
			}
			if (!this.queryLanguage.isValid()) {
				errors += this.label_lang + " : " + this.queryLanguage.invalidMessage + "<br/><br/>";
			}
			if (!this.queryMode.isValid()) {
				errors += this.label_mode + " : " + this.queryMode.invalidMessage + "<br/><br/>";
			}
			if (!this.sortBy.isValid()) {
				errors += this.label_sortby + " : " + this.sortBy.invalidMessage + "<br/><br/>";
			}
			if (!this.sortBy2.isValid()) {
				errors += this.label_sortby2 + " : " + this.sortBy2.invalidMessage + "<br/><br/>";
			}
			if (!this.sortBy3.isValid()) {
				errors += this.label_sortby3 + " : " + this.sortBy3.invalidMessage + "<br/><br/>";
			}			
			if (!this.sortByOrder.isValid()) {
				errors += this.label_sortorder + " : " + this.sortByOrder.invalidMessage + "<br/><br/>";
			}
			if (!this.sortByOrder2.isValid()) {
				errors += this.label_sortorder2 + " : " + this.sortByOrder2.invalidMessage + "<br/><br/>";
			}
			if (!this.sortByOrder3.isValid()) {
				errors += this.label_sortorder3 + " : " + this.sortByOrder3.invalidMessage + "<br/><br/>";
			}			
			if (!this.typeAheadNumberOfResults.isValid()) {
				errors += this.label_resultsOption_typeAhead_numberOfResults + " : " + this.typeAheadNumberOfResults.invalidMessage + "<br/><br/>";
			}
						
			if (!this.typeAheadMode.isValid()) {
				errors += this.label_resultsOption_typeAhead_mode + " : " + this.typeAheadMode.invalidMessage + "<br/><br/>";
			}
			
			if (errors != "") {
				EDR.util.alert(errors);
				return false;
			}			
			return true;
		},
		
		buildOptions: function() {
			if (this.json == null) return;			
			this.clear();
			var self = this;
			
			// result range
			this.resultsRange.attr("value", this.json.resultsRange);

			// query language
			var store = new dojo.data.ItemFileReadStore({data:{
				 identifier:"value",
				 items:this.json.queryLanguage
			}});
			this.queryLanguage.attr("store", store);
			
			// query mode
			var queryModeJson = this._getQueryModeJson();
			store = new dojo.data.ItemFileReadStore({data:{
				 identifier:"value",
				 items:queryModeJson
			}});
			this.queryMode.attr("store", store);
		
			// sort by
			store = new dojo.data.ItemFileReadStore({data:{
				identifier:"value",
				items:this.json.sortBy
			}});
			this.sortBy.attr("store", store);
			
			var clonedArray = dojo.fromJson(dojo.toJson(this.json.sortBy));
			for(var i=0;i<clonedArray.length;++i) {
				//remove "[Relevance]"
				if(clonedArray[i].value == "[Relevance]") {
					clonedArray.splice(i, 1); //delete
					break;
				}
			}
			var noneItem = {
					label: EDR.messages.prompt_selection_none,
					selected: false,
					value: "[None]"				
			};
			clonedArray.unshift(noneItem);
			
			this._sortByItems = dojo.fromJson(dojo.toJson(clonedArray));

			store = new dojo.data.ItemFileReadStore({data:{
				identifier:"value",
				items:clonedArray
			}});
			this._sortBy2Array = clonedArray;
			this.sortBy2.attr("store", store);
			
			clonedArray = dojo.fromJson(dojo.toJson(clonedArray));
			store = new dojo.data.ItemFileReadStore({data:{
				identifier:"value",
				items:clonedArray
			}});
			this._sortBy3Array = clonedArray;
			this.sortBy3.attr("store", store);
		
			// sort by order
			var sortByOrderJson = this._getSortByOrderJson();
			clonedArray = dojo.fromJson(dojo.toJson(sortByOrderJson));
			store = new dojo.data.ItemFileReadStore({data:{
				 identifier:"value",
				 items:clonedArray
			}});
			this.sortByOrder.attr("store", store);
			
			clonedArray = dojo.fromJson(dojo.toJson(sortByOrderJson));
			store = new dojo.data.ItemFileReadStore({data:{
				 identifier:"value",
				 items:clonedArray
			}});			
			this.sortByOrder2.attr("store", store);
			
			clonedArray = dojo.fromJson(dojo.toJson(sortByOrderJson));
			store = new dojo.data.ItemFileReadStore({data:{
				 identifier:"value",
				 items:clonedArray
			}});
			this.sortByOrder3.attr("store", store);
		
			// summary length
			this.summaryLength.attr("value", this.json.summaryLength);
			
			// type ahead number of results
			this.typeAheadNumberOfResults.attr("value", this.json.typeAheadNumberOfResults);

			// type ahead mode
			var typeAheadModeJson = this._getTypeAheadModeJson();
			store = new dojo.data.ItemFileReadStore({data:{
				 identifier:"value",
				 items:typeAheadModeJson
			}});
			this.typeAheadMode.attr("store", store);
			
			if(this.json.typeAheadMode=="allOff"){
				this.typeAheadMode.attr("disabled",true);
				this.typeAheadNumberOfResults.attr("disabled",true);
			}
						
			// quick links
			this["predefinedQuery" + (this.json.predefinedQuery  == "Yes"? "Yes" : "No")].attr("checked", true);
			
			// spell correction
			this["spellCorrection" + (this.json.spellCorrection == "Yes" ? "Yes" : "No")].attr("checked", true);
			
			// site collapsing
			this["siteCollapsing" + (this.json.siteCollapsing == "Yes" ? "Yes" : "No")].attr("checked", true);
			
			// synonym expansion
			if (this.json.synonymExpansions == "Automatic") {
				this.synonymExpansionsAutomatic.attr("checked", true);
			} else if (this.json.synonymExpansions == "Semantic") {
//				this.synonymExpansionsSemantic.attr("checked", true);
				this.synonymExpansionsAutomatic.attr("checked", true);
			} else {
				this.synonymExpansionsOff.attr("checked", true);
			}
			
			
			for (var i=0; i<this.json.queryLanguage.length; i++) {
				var item = this.json.queryLanguage[i];
				if (item.selected) {
					self.queryLanguage.attr("value", item.value);
					break;
				}
			}
			
			for (var i=0; i<queryModeJson.length; i++) {
				var item = queryModeJson[i];
				if (item.value == this.json.queryMode) {
					self.queryMode.attr("value", item.value);
					break;
				}
			}
			
			for (var i=0; i<typeAheadModeJson.length; i++) {
				var item = typeAheadModeJson[i];
				if (item.value == this.json.typeAheadMode) {
					self.typeAheadMode.attr("value", item.value);
					break;
				}
			}
			
			for (var i=0; i<this.json.sortBy.length; i++) {
				var item = this.json.sortBy[i];
				if (item.selected) {
					self.sortBy.attr("value", item.value);
					break;
				}
			}
			if(this.json.sortBy2) {
				self.sortBy2.attr("value", this.json.sortBy2);	
			} else {
				self.sortBy2.attr("value", "[None]");	
			}

			if(this.json.sortBy3) {
				self.sortBy3.attr("value", this.json.sortBy3);	
			} else {
				self.sortBy3.attr("value", "[None]");	
			}
			
			if(this.json.sortByOrder1) {
				self.sortByOrder.attr("value", this.json.sortByOrder1);
			} else {
				self.sortByOrder.attr("value", "descending");
			}
			
			if(this.json.sortByOrder2) {
				self.sortByOrder2.attr("value", this.json.sortByOrder2);
			} else {
				self.sortByOrder2.attr("value", "descending");
			}

			if(this.json.sortByOrder3) {
				self.sortByOrder3.attr("value", this.json.sortByOrder3);
			} else {
				self.sortByOrder3.attr("value", "descending");
			}			
		},
		
		clear: function() {
/*			dojo.forEach(this.queryLanguage.getOptions(), dojo.hitch(this, function(option) {
				this.queryLanguage.removeOption(option);
			}));
			dojo.forEach(this.sortBy.getOptions(), dojo.hitch(this, function(option) {
				this.sortBy.removeOption(option);
			})); */
		},
		
		_getNullResultsOptions: function() {
/*			return {
				resultsRange: 25,
				queryLanguage: [{value:"en", label:"English", selected:true}],
				sortBy: [{value:"relevance", label:"Relevance", selected:true}],
				sortByOrder: "descending",
				predefinedQuery: "No", 
				spellCorrection: "Yes",
				queryMode: "baseform",
				siteCollapsing: "Yes",
				synonymExpansions: "Semantic",
				summaryLength: 3				
			};*/
			return {
				"resultsRange":'10',
				queryLanguage:[],
				sortBy:[
					{"label":'filesize',"value":'filesize',selected:false},
					{"label":'lastmodifiedtime',"value":'lastmodifiedtime',selected:false},
					{"label":'modifieddate',"value":'modifieddate',selected:false},
					{"label":'postedtime',"value":'postedtime',selected:false},
					{"label":'[Relevance]',"value":'[Relevance]',selected:false},
					{"label":'[Date]',"value":'[Date]',selected:false}
				],
				"sortByOrder":'',
				"predefinedQuery":'No',
				"spellCorrection":'Yes',
				"queryMode":'engine',
				"siteCollapsing":'Yes',
				"synonymExpansions":'Semantic',
				"summaryLength":1,
				"typeAheadNumberOfResults":10,
				"typeAheadMode":"queryLog,term"
			};
		},
		
		_getQueryModeJson: function() {
			if (this._queryModeJson == null) {
				this._queryModeJson = [
					{value:"engine", label:this.label_mode_engine},
					{value:"baseform", label:this.label_mode_baseform},
					{value:"exact", label:this.label_mode_exact},
					{value:"baseform_exact", label:this.label_mode_baseformexact}
				];
			}
			return this._queryModeJson;
		},
		
		_getSortByOrderJson: function() { 
			if (this._sortByOrder == null) {
				this._sortByOrder = [
					{value:"descending", label:this.label_descending},
					{value:"ascending", label:this.label_ascending}
				];
			}
			return this._sortByOrder;
		},
		
		_getTypeAheadModeJson: function() {
			if (this._typeAheadModeJson == null) {
				this._typeAheadModeJson = [
					{value:"off", label:EDR.messages.resultsOption_label_typeAhead_mode_off},
					{value:"queryLog", label:EDR.messages.resultsOption_label_typeAhead_mode_queryLog},
					{value:"term", label:EDR.messages.resultsOption_label_typeAhead_mode_term},
					{value:"queryLog,term", label:EDR.messages.resultsOption_label_typeAhead_mode_queryLogFirst},
					{value:"term,queryLog", label:EDR.messages.resultsOption_label_typeAhead_mode_termFirst}
				];
			}
			return this._typeAheadModeJson;
		},
				
		destroy: function() {
			dojo.forEach(this.handlers, dojo.disconnect);
			this.inherited("destroy", arguments);
		},
		
		_onSortByChange: function(value){
			var input = this.sortByOrder;
			if(value=='[Relevance]'){
				input.setValue("descending");
				input.attr("disabled",true);
				if(this.sortBy2.attr("value") != true) {
					this.sortBy2.attr("value", "[None]");
				}
				if(this.sortBy3.attr("disabled") != true) {
					this.sortBy3.attr("value", "[None]");			
				}
				this.sortBy2.attr("disabled", true);
				this.sortBy3.attr("disabled", true);
				this.sortByOrder2.attr("disabled", true);
				this.sortByOrder3.attr("disabled", true);
			}else{
				input.attr("disabled",false);
				this.sortBy2.attr("disabled", false);
				
				if(value == this.sortBy2.attr("value")) {
					this.sortBy2.attr("value", "[None]");
				}
				var newItems = dojo.fromJson(dojo.toJson(this._sortByItems));
				var filteredItems = [];
				for(var i=0; i<newItems.length;++i) {
					var itemValue = newItems[i].value;
					if(itemValue != value && itemValue != this.sortBy.attr("value")) {
						filteredItems.push(newItems[i]);
					}
				}
				var store = new dojo.data.ItemFileReadStore({data:{
					identifier:"value",
					items:filteredItems
				}});
				this.sortBy2.attr("store", store);
				
				if(value == this.sortBy3.attr("value")) {
					this.sortBy3.attr("value", "[None]");
				}
				var newItems = dojo.fromJson(dojo.toJson(this._sortByItems));
				var filteredItems = [];
				for(var i=0; i<newItems.length;++i) {
					var itemValue = newItems[i].value;
					if(itemValue != value && itemValue != this.sortBy.attr("value") && itemValue != this.sortBy2.attr("value")) {
						filteredItems.push(newItems[i]);
					}
				}
				var store = new dojo.data.ItemFileReadStore({data:{
					identifier:"value",
					items:filteredItems
				}});
				this.sortBy3.attr("store", store);					
			
			}
		},
		
		_onSortBy2Change: function(value){
			if(value=='[None]'){
				this.sortBy3.attr("value", "[None]");
				this.sortBy3.attr("disabled", true);
				this.sortByOrder2.attr("disabled", true);
			}else{
				this.sortBy3.attr("disabled", false);
				this.sortByOrder2.attr("disabled", false);
				
				if(value == this.sortBy3.attr("value")) {
					this.sortBy3.attr("value", "[None]");
				}
				var newItems = dojo.fromJson(dojo.toJson(this._sortByItems));
				var filteredItems = [];
				for(var i=0; i<newItems.length;++i) {
					var itemValue = newItems[i].value;
					if(itemValue != value && itemValue != this.sortBy.attr("value") && itemValue != this.sortBy2.attr("value")) {
						filteredItems.push(newItems[i]);
					}
				}
				var store = new dojo.data.ItemFileReadStore({data:{
					identifier:"value",
					items:filteredItems
				}});
				this.sortBy3.attr("store", store);					
				
			}
		},
		
		_onSortBy3Change: function(value){
			if(value=='[None]'){
				this.sortByOrder3.attr("disabled", true);
			}else{
				this.sortByOrder3.attr("disabled", false);
			}
		},
		
		_onQueryModeChange: function(value){
			var input = this.queryMode;
			switch(value){
				case "engine":
					input.attr("title",this.tooltip_resultsOption_mode);
					break;
				case "baseform":
					input.attr("title",this.tooltip_resultsOption_mode_base);
					break;
				case "exact":
					input.attr("title",this.tooltip_resultsOption_mode_exact);
					break;
				case "baseform_exact":
					input.attr("title",this.tooltip_resultsOption_mode_both);
					break;
			}
		},
		
		_onTypeAheadModeChange: function(value){
			var input = this.typeAheadMode;
			switch(value){
				case "off":
					input.attr("title", EDR.messages.resultsOption_label_typeAhead_mode_off);
					break;
				case "queryLog":
					input.attr("title", EDR.messages.resultsOption_label_typeAhead_mode_queryLog);
					break;
				case "term":
					input.attr("title", EDR.messages.resultsOption_label_typeAhead_mode_term);
					break;
				case "queryLog,term":
					input.attr("title", EDR.messages.resultsOption_label_typeAhead_mode_queryLogFirst);
					break;
				case "term,queryLog":
					input.attr("title", EDR.messages.resultsOption_label_typeAhead_mode_termFirst);
					break;
			}
		},
		
		_moveFocusOnTypeAheadMode: function(){
			var fieldRange = this.typeAheadMode.textbox.createTextRange();
			fieldRange.moveStart("character", 0);
			fieldRange.collapse();
			fieldRange.select();
		},
		
		// messages
		label_intro1: EDR.messages.resultsOption_label_title,
		label_intro2: EDR.isAuthorized ? EDR.messages.search_options_intro_authorized : EDR.messages.search_options_intro_unauthorized,
		label_number: EDR.messages.resultsOption_label_number,
		label_lang: EDR.messages.resultsOption_label_lang,
		label_mode: EDR.messages.resultsOption_label_mode,
		label_sortby: EDR.messages.resultsOption_label_sortby,
		label_sortby2: EDR.messages.resultsOption_label_sortby + " (" + EDR.messages.order_2 + ")",
		label_sortby3: EDR.messages.resultsOption_label_sortby + " (" + EDR.messages.order_3 + ")",		
		label_sortorder: EDR.messages.resultsOption_label_sortorder,
		label_sortorder2: EDR.messages.resultsOption_label_sortorder + " (" + EDR.messages.order_2 + ")",
		label_sortorder3: EDR.messages.resultsOption_label_sortorder + " (" + EDR.messages.order_3 + ")",		
		label_summarylen: EDR.messages.resultsOption_label_summarylen,
		label_summarymin: EDR.messages.resultsOption_label_summarymin,
		label_summarymax: EDR.messages.resultsOption_label_summarymax,
		label_quicklinks: EDR.messages.resultsOption_label_quicklinks,
		label_spell: EDR.messages.resultsOption_label_spell,
		label_collapse: EDR.messages.resultsOption_label_collapse,
		label_synonym: EDR.messages.resultsOption_label_synonym,
		label_yes: EDR.messages.resultsOption_label_yes,
		label_no: EDR.messages.resultsOption_label_no,
		label_semanticyes: EDR.messages.resultsOption_label_semanticyes,
		label_mode_engine: EDR.messages.resultsOption_label_mode_engine,
		label_mode_baseform: EDR.messages.resultsOption_label_mode_baseform,
		label_mode_exact: EDR.messages.resultsOption_label_mode_exact,
		label_mode_baseformexact: EDR.messages.resultsOption_label_mode_baseformexact,		
		label_ascending: EDR.messages.resultsOption_label_ascending,
		label_descending: EDR.messages.resultsOption_label_descending,
		label_resultsOption_typeAhead_numberOfResults: EDR.messages.resultsOption_label_typeAhead_numberOfResults,
		label_resultsOption_typeAhead_mode: EDR.messages.resultsOption_label_typeAhead_mode,
		
		tooltip_resultsOption_num_results: EDR.messages.tooltip_resultsOption_num_results,
		tooltip_resultsOption_query_lang: EDR.messages.tooltip_resultsOption_query_lang,
		tooltip_resultsOption_mode: EDR.messages.tooltip_resultsOption_mode,
		tooltip_resultsOption_mode_base: EDR.messages.tooltip_resultsOption_mode_base,
		tooltip_resultsOption_mode_exact: EDR.messages.tooltip_resultsOption_mode_exact,
		tooltip_resultsOption_mode_both: EDR.messages.tooltip_resultsOption_mode_both,
		tooltip_resultsOption_sort_by: EDR.messages.tooltip_resultsOption_sort_by,
		tooltip_resultsOption_sort_order: EDR.messages.tooltip_resultsOption_sort_order,
		tooltip_resultsOption_summary: EDR.messages.tooltip_resultsOption_summary,
		tooltip_resultsOption_quick_links: EDR.messages.tooltip_resultsOption_quick_links,
		tooltip_resultsOption_spell_correct: EDR.messages.tooltip_resultsOption_spell_correct,
		tooltip_resultsOption_collapse_results: EDR.messages.tooltip_resultsOption_collapse_results,
		tooltip_resultsOption_search_synonyms: EDR.messages.tooltip_resultsOption_search_synonyms,
		tooltip_help_querymode: EDR.messages.tooltip_help_querymode,
		tooltip_resultsOption_typeAhead_numberOfResults: EDR.messages.tooltip_resultsOption_typeAhead_numberOfResults,
		tooltip_resultsOption_typeAhead_mode: EDR.messages.tooltip_resultsOption_typeAhead_mode,
		tooltip_help_typeAheadMode: EDR.messages.tooltip_help_typeAheadMode
	}
);