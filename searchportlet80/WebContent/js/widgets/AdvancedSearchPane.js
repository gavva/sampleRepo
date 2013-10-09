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
dojo.provide("widgets.AdvancedSearchPane");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit.form.TextBox");
dojo.require("widgets.DateTextBox");

dojo.declare(
	"widgets.AdvancedSearchPane", [dijit._Widget, dijit._Templated],
	{
		prefix: EDR.prefix,
		imageBaseDir: EDR.config.imageBaseDir,
		
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl("widgets", "templates/AdvancedSearchPane.html"),
		fromDate: null,
		toDate: null,
		slideTabContent: null,
		advButton: null,
//		advOptions: null,
		searchType: "search",
		handlers: [],
		
		leftPaneWidth: 400,
		leftPaneWidthExpanded: 300,
		rightPaneWidth: 300,
		
		showOption: false,
				
		postCreate: function() {
			this.inherited("postCreate", arguments);
			
			this.fromDate = this._supportingWidgets[6];
			this.toDate = this._supportingWidgets[7];
			this.advButton = this._supportingWidgets[10];
			
			var self = this;
			dojo.forEach(this._supportingWidgets, function(widget) {
				if (widget.textbox != null) self.handlers.push(dojo.connect(widget.textbox, "onkeypress", self, "submitOnEnter"));			
			});
//			this.handlers.push(dojo.connect(this.searchOptionsLink, "onclick", this, "toggleSearchOptions"));		

			dojo.subscribe("afterSlideTabOpened", this, "onOpen");
			dojo.subscribe("refresh", this, "refresh");
		},
		
		startup: function() {
			this.inherited("startup", arguments);
			this.slideTabContent = dijit.byId(EDR.prefix+"advSearchTab");
			// to avoid IE's content pane size issue
			if (dojo.isIE == 7) dojo.style(this.advOptions.serchOptionsForm, "width", "95%");
			this.handlers.push(dojo.connect(this.advOptions, "preLoad", this, "preLoad"));
			this.handlers.push(dojo.connect(this.advOptions, "postLoad", this, "postLoad"));
			this.handlers.push(dojo.connect(this.advOptions, "loadErrorHandler", this, "postLoad"));
			this.advOptions.setAdvancedSearchOptions();
		},
		
		onOpen: function(event) {
			if (event.contentId == (EDR.prefix+"advSearchTab")) {
				this.refresh();
			}
		},
		
		onClose: function() {
		},
		
		onSearchButtonClicked: function() {
			var params = this.getFormValues();
			var errors = this.validate(params, true);
			if (errors != "") {
				EDR.util.alert(errors);
				return;
			}			
			dijit.byId(EDR.prefix+"searchManager").submitSearch(null, this.searchType, params);
//			dijit.byId(EDR.prefix+"advSearchTab").close();
		},
		
		onClearButtonClicked: function() {
			this.reset();
		},
		
		onNewSearchClicked: function() {
			this.searchType = "search";
		},
		
		onRefineSearchClicked: function() {
			this.searchType = "refineSearch";
		},
		
		onFromDateRangeClicked: function() {
			this.fromToDate.showPicker();
			this.toToDate.hidePicker();
		},
		
		onToDateRangeClicked: function() {
			this.toToDate.showPicker();
			this.fromToDate.hidePicker();
		},
		
		preLoad: function() {
			var overlay = EDR.ajax.Loading.setIsLoading(this.rightPane);
			overlay.style.top = "0px";
			overlay.style.left = "0px";
			overlay.style.width = "300px";
		},
		
		postLoad: function() {
			EDR.ajax.Loading.clearIsLoading(this.rightPane);
		},
		
		submitOnEnter: function(evt) {
			if (evt.keyCode == dojo.keys.ENTER) {
				this.onSearchButtonClicked();
			}
		},
		
		toggleSearchOptions: function(evt) {
			if (this.showOption) {
				this.showOption = false;
				dojo.style(this.leftPane, "width", this.leftPaneWidth + "px");
				dojo.style(this.domNode, "width", this.leftPaneWidth + "px");
				this.advButton.attr("label", "<span style='position:relative;top:-4px;'>" + this.show_options +
					(this.isLeftToRight() ?
						"</span><img src='"+this.imageBaseDir+"move-left23.png' alt='' style='position:relative;top:-1px;'/>" :
						"</span><img src='"+this.imageBaseDir+"move-right23.png' alt='' style='position:relative;top:-1px;'/>")
				);
				dojo.style(this.rightPane, "display", "none");
			} else {
				this.showOption = true;
				dojo.style(this.leftPane, "width", this.leftPaneWidthExpanded + "px");
				dojo.style(this.domNode, "width", this.leftPaneWidthExpanded + this.rightPaneWidth + 20 + "px");
				this.advButton.attr("label", "<span style='position:relative;top:-4px;'>" + this.hide_options + 
					(this.isLeftToRight() ?
						"</span><img src='"+this.imageBaseDir+"move-right23.png' alt='' style='position:relative;top:-1px;'/>" :
						"</span><img src='"+this.imageBaseDir+"move-left23.png' alt='' style='position:relative;top:-1px;'/>")
				);
				dojo.style(this.rightPane, "display", "block");
			}
/*			
			if (this.showOption) {
				var con = dojo.connect(this.slideTabContent, "afterOpen", dojo.hitch(this, function() {
					this.advOptions.load();
					if (dojo.isIE <= 7) {
						dojo.forEach(dijit.findWidgets(this.advOptions.domNode), function(widget) {
							if (widget.declaredClass == "widgets.Button") {
								widget.adjustButtonWidth();
							}
						});
					}
					dojo.disconnect(con);
				}));
			}*/
			this.slideTabContent.fitToContent(true);
		},
		
		getFormValues: function() {
			var params = dojo.formToObject(this.advancedSearchForm);
			if (this.showOption) {
				params = dojo.mixin(params, this.advOptions.getFormValues());
//				params.advancedSearchOptions = true; // move to ajax.js
			}
			return params;
		},
		
		validate: function(params, needKeywords) {
			var errors = "";
			if (needKeywords) {
				if ( (params.keywords == null || params.keywords == "") && 
					 (params.showResultsWithAllWords == null || params.showResultsWithAllWords == "") &&						
					 (params.showResultsWithPhrase == null || params.showResultsWithPhrase == "") &&						
					 (params.showResultsWithAnyWords == null || params.showResultsWithAnyWords == "") &&						
					 (params.showResultsWithNoneWords == null || params.showResultsWithNoneWords == "")	)
				{
					errors += EDR.messages.erros_noQueryTerms + "</br></br>";
	//				this.markFieldInvalid(this.keywordErr, EDR.messages.error_Search_invalid_param, this.keywords);
				}
			}
			
			var isValidDateFormat = false;
			if (!this.fromDate.isValid()) {
				errors += EDR.messages.error_Search_invalid_date + "</br></br>";
				this.markFieldInvalid(this.dateError, EDR.messages.error_Search_invalid_param, this.fromDateInput);
			} else if (!this.toDate.isValid()) {
				errors += EDR.messages.error_Search_invalid_date + "</br></br>";
				this.markFieldInvalid(this.dateError, EDR.messages.error_Search_invalid_param, this.toDateInput);
			} else {
				isValidDateFormat = true;
			}
			
			var hasBothDate = false;
			var fromDateIsEmpty = EDR.util.String.isWhitespace(this.fromDate.textbox.value);
			var toDateIsEmpty = EDR.util.String.isWhitespace(this.toDate.textbox.value);
			if (!fromDateIsEmpty && toDateIsEmpty) {
				errors += EDR.messages.error_Search_invalid_dateRange + "</br></br>";
				this.markFieldInvalid(this.dateError, EDR.messages.error_Search_invalid_param, this.toDate);
			} else if (fromDateIsEmpty && !toDateIsEmpty) {
				errors += EDR.messages.error_Search_invalid_dateRange + "</br></br>";
				this.markFieldInvalid(this.dateError, EDR.messages.error_Search_invalid_param, this.fromDate);
			} else if (!fromDateIsEmpty && !toDateIsEmpty) {
				hasBothDate = true;
			}
			
			if (isValidDateFormat && hasBothDate) {
				var fdate = this.fromDate.value;
				var tdate = this.toDate.value;
				if (fdate.getTime() > tdate.getTime()) {
					errors += EDR.messages.error_Search_invalid_dateRange_values + "</br></br>";
					this.markFieldInvalid(this.dateError, EDR.messages.error_Search_invalid_param, this.fromDateInput);
				}
			}			
			
			if (this.showOption) {
				errors += this.advOptions.getErrorMessage(params);
			}			
			return errors;
		},
		
		refresh: function() {
			if (this.showOption) {
				this.advOptions.load();
				if (dojo.isIE <= 7) {
					dojo.forEach(dijit.findWidgets(this.advOptions.domNode), function(widget) {
						if (widget.declaredClass == "widgets.Button") {
							widget.adjustButtonWidth();
						}
					});
				}
			}
		},
		
		reset: function() {
			this.searchType = "search";
			dojo.forEach(this._supportingWidgets, function(widget) {
				if (widget.reset) widget.reset();
			});
			this.clearError();
		},
		
		onKeyPress: function(evt) {
			if (evt.keyCode == dojo.keys.ENTER) {
				dijit.byId(EDR.prefix+"searchPane").submitSearch();
			}
		},
		
		clearError: function() {
			this.markFieldValid(this.dateError);
		},
		
		markFieldInvalid: function(errorDiv, errorMsg, input) {
			errorDiv.innerHTML = errorMsg;
			errorDiv.className = 'error';
			if (input) input.focus;
		},
		
		markFieldValid: function(errorDiv) {
			errorDiv.innerHTML = "";
			errorDiv.className = 'noError';
		},
		
		destroy: function() {
			dojo.forEach(this.handlers, dojo.disconnect);
			this.inherited("destroy", arguments);
		},
		
		// messages
		label_newsearch: EDR.messages.searchpane_newsearch,
		label_refinesearch: EDR.messages.searchpane_addsearch,
		label_search: EDR.messages.button_search,
		label_clear: EDR.messages.button_clear,
		label_advoptions_title: EDR.messages.label_advoptions_title,
		prompt_search: EDR.messages.prompt_search,
		prompt_searchOptions: EDR.messages.prompt_searchOptions,
		prompt_showResultsWith_allWords: EDR.messages.prompt_showResultsWith_allWords,
		prompt_showResultsWith_phrase: EDR.messages.prompt_showResultsWith_phrase,
		prompt_showResultsWith_anyWords: EDR.messages.prompt_showResultsWith_anyWords,
		prompt_showResultsWith_noneWords: EDR.messages.prompt_showResultsWith_noneWords,
		text_Search_dateStart: EDR.messages.text_Search_dateStart,
		text_Search_dateEnd: EDR.messages.text_Search_dateEnd,
		show_options: EDR.messages.button_advancedSearch_show,
		hide_options: EDR.messages.button_advancedSearch_hide,
		dateTooltip: "",// from jsp
		
		messages_tooltip_searchpane_newsearch_link: EDR.messages.tooltip_searchpane_newsearch_link,
		messages_tooltip_searchpane_addsearch_link: EDR.messages.tooltip_searchpane_addsearch_link,
		messages_tooltip_searchpane_search: EDR.messages.tooltip_searchpane_search,
		messages_tooltip_searchpane_clear: EDR.messages.tooltip_searchpane_clear,
		messages_tooltip_searchpane_showoptions_link: EDR.messages.tooltip_searchpane_showoptions_link,
		
		messages_tooltip_allWords: EDR.messages.tooltip_allWords,
		messages_tooltip_exactPhrase: EDR.messages.tooltip_exactPhrase,
		messages_tooltip_anyWords: EDR.messages.tooltip_anyWords,
		messages_tooltip_noneWords: EDR.messages.tooltip_noneWords,
		messages_tooltip_dateRange: EDR.messages.tooltip_dateRange
	}
);