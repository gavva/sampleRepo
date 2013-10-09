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
dojo.provide("widgets.SearchOptions");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit.form.RadioButton");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.form.TextBox");

dojo.require("widgets.customDialog");
dojo.require("widgets.MultiSelection");
dojo.require("widgets.Button");

dojo.declare(
	"widgets.SearchOptions", [dijit._Widget, dijit._Templated],
	{				
		prefix: EDR.prefix,
		imgBasePath: EDR.config.imageBaseDir,
		widgetsInTemplate: true,
		
		templatePath: dojo.moduleUrl("widgets", "templates/SearchOptions.html"),
		dialog: null,
		handlers: [],
		_autoLoad: false,
		isAdvancedSearchOption: false,
		
		colspan: 4,
		url: "",
		partialLoadUrl: "",
		json: null,		
		
		postCreate: function() {
			this.inherited("postCreate", arguments);
			this.handlers = [];
			
			this.facet = this._supportingWidgets[0];
			this.federator = this._supportingWidgets[1];
			this.fileAll = this._supportingWidgets[2];
			this.fileSpecify = this._supportingWidgets[3];
			this.fileTypeBtn = this._supportingWidgets[4];
			this.langAll = this._supportingWidgets[5];
			this.langSpecify = this._supportingWidgets[6];
			this.langBtn = this._supportingWidgets[7];
			
			if (EDR.isTextAnalyticsEnabled) {
				dojo.style(this.federatorContainer, "display", "none");
				dojo.style(this.noFederatorContainer, "display", "none");
				dojo.style(this.federatorMessages, "display", "none");
				dojo.style(this.facet.domNode, "display", "none");
			}
						
			if (this._autoLoad) this.load();
		},		

		onCollectionChanged: function(evt) {
			this.partialLoad();
		},

		load: function() {
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
				showProgress: false
			};
			EDR.ajax.Request.post(args);
		},
		
		partialLoad: function() {
			if (this.isAdvancedSearchOption) {
				this.preLoad();
				var params = this.getFormValues();		
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
						this.partialLoadErrorHandler(response, ioArgs);
					}),
					timeout: this.timeout,
					content: params,
					showProgress: false
				};
				EDR.ajax.Request.post(args);
			} else {
				dijit.byId(EDR.prefix+"preference").changeCollection();
			}
		},
		
		loadJson: function(json) {
			if (json == null) json = this._getNullSearchOptions();
			this.json = json;
			this.buildOptions();
		},
		
		preLoad: function() {
//			EDR.ajax.Loading.setIsLoading(this.domNode);
		},
		
		postLoad: function() {
//			EDR.ajax.Loading.clearIsLoading(this.domNode);
		},
		
		partialPreLoad: function() {
			dojo.forEach(this.domNode.getElementsByTagName("IMG"), function(img) {
				if (img.src.indexOf("status_indicator_20_slow.gif") != -1)
					img.style.display = "";
			});
		},
		
		partialPostLoad: function() {
			dojo.forEach(this.domNode.getElementsByTagName("IMG"), function(img) {
				if (img.src.indexOf("status_indicator_20_slow.gif") != -1)
					img.style.display = "none";
			});
		},
		
		loadErrorHandler: function() {
		},
		
		partialLoadErrorHandler: function() {
			this.partialPostLoad();
		},
				
		getFormValues: function() {
			var values = dojo.formToObject(this.serchOptionsForm);			
			values.documentSourcesAll = dojo.every(dijit.findWidgets(this.sourceContainer), function(widget) {
				return widget.attr("checked");
			});
			if (values.filetype == "all") {
				values.documentTypesAll = true;
			} else {
				values.documentTypesAll = false;
				values.documentTypes = this._getSelectedItemIds(this.json.filetypes.items);
//				if (values.documentTypes.length == 0) values.documentTypesAll = true;
			}
			if (values.langtype == "all") {
				values.languagesAll = true;
			} else {
				values.languagesAll = false;
				values.languages = this._getSelectedItemIds(this.json.languages.items);
//				if (values.languages.length == 0) values.languagesAll = true;
			}
			values.isFacetedSearch = values.searchMode == "facet";
			if (values.scopes == null) values["scopes"] = "";
			return values;
		},
		
		validate: function(params) {
			var errors = "";
			if (!params.isFacetedSearch && (params.collections == null || params.collections.length == null)) {
				errors += this.error_nocollection + "<br/><br/>";
			}
			if (this.json.sourcetypes.length > 0 && (params.documentSources == null || params.documentSources.length == 0)) {
				errors += this.error_nosourcetypes + "<br/><br/>";
			}
			if (errors != "") {
				EDR.util.alert(errors);
				return false;
			}			
			return true;
		},
		
		getErrorMessage: function(params) {
			var errors = "";
			if (!params.isFacetedSearch && (params.collections == null || params.collections.length == null)) {
				errors += this.error_nocollection + "<br/><br/>";
			}
			if (this.json.sourcetypes.length > 0 && (params.documentSources == null || params.documentSources.length == 0)) {
				errors += this.error_nosourcetypes + "<br/><br/>";
			}
			return errors;
		},
		
		buildOptions: function() {
			if (this.json == null) return;			
			this.clear();			
			this.buildCollections();
			this.buildScopes();
			this.buildSourceTypes();
			this.buildFileTypes();
			this.buildLanguages();			
		},
		
		buildCollections: function() {
			this._buildRadioBoxList(this.json.facetCollections, "facetedCollection", this.facetContainer, "onCollectionChanged");
			if (!EDR.isTextAnalyticsEnabled) this._buildCheckBoxList(this.json.collections, "collections", this.federatorContainer);
			
			if (this.json.isFacetedSearch) {
				this.facet.attr("checked", true);
				this.disableFederatorCollections(true);
			} else {
				this.federator.attr("checked", true);
				this.disableFacetCollections(true);
			}

			var noFacet = this.json.facetCollections.length == 0;
			dojo.style(this.facetContainer, "display", noFacet ? "none" : "block");
			dojo.style(this.noFacetContainer, "display", noFacet ? "block" : "none");

			if (!EDR.isTextAnalyticsEnabled) {
				var noFederator = this.json.collections.length == 0;
				dojo.style(this.federatorContainer, "display", noFederator ? "none" : "block");
				dojo.style(this.noFederatorContainer, "display", noFederator ? "block" : "none");
			}
			
			var selectFacet = function() {
				this.json.isFacetedSearch = true;
				this.disableFacetCollections(false);
				this.disableFederatorCollections(true);
				this.onCollectionChanged();
			};
			
			var selectFederator = function() {
				this.json.isFacetedSearch = false;
				this.disableFacetCollections(true);
				this.disableFederatorCollections(false);
				this.onCollectionChanged();
			};
	
			this.handlers.push(dojo.connect(this.facet, "onClick", this, selectFacet));
			this.handlers.push(dojo.connect(this.federator, "onClick", this, selectFederator));
		},
				
		buildSourceTypes: function() {
			this._buildCheckBoxList(this.json.sourcetypes, "documentSources", this.sourceContainer, true);
			var noSource = this.json.sourcetypes.length == 0;
			dojo.style(this.sourceContainer, "display", noSource ? "none" : "block");
			dojo.style(this.noSourceContainer, "display", noSource ? "block" : "none");
		},
		
		buildFileTypes: function() {
			if (this.json.filetypes.all) {
				this.fileAll.attr("checked", true);
				this.fileTypeBtn.setDisabled(true);
			} else {
				this.fileSpecify.attr("checked", true);
				this.fileTypeBtn.setDisabled(false);
			}
			
			selectFileAll = function() {
				this.json.filetypes.all = true;
				this.fileTypeBtn.setDisabled(true);
			}
			
			selectFileSpecify = function() {
				this.json.filetypes.all = false;
				this.fileTypeBtn.setDisabled(false);
			},
			
			showFileTypeSelection = function() {
				var dialog = this._getMultiSelectDialog();
				dialog.titleTextNode.innerHTML = this.label_file;
				
				// close items
				var fileTypes = dojo.clone(this.json.filetypes);
				dialog.multiSelection.options = fileTypes.items;
				dialog.multiSelection.buildOptions();
				
				var self = this;
				var handlers = [];
				handlers.push(dojo.connect(dialog.okButtonNode, "onClick", function() {
					dojo.forEach(handlers, dojo.disconnect);						
					self.json.filetypes.items = dialog.multiSelection.options;
					//EDR.dialog.util.hide(dialog);
				}));
				handlers.push(dojo.connect(dialog.cancelButtonNode, "onClick", function() {
					dojo.forEach(handlers, dojo.disconnect);						
				}));
										
				EDR.dialog.util.show(dialog);
			}
		
			this.handlers.push(dojo.connect(this.fileAll, "onClick", this, selectFileAll));
			this.handlers.push(dojo.connect(this.fileSpecify, "onClick", this, selectFileSpecify));
			this.handlers.push(dojo.connect(this.fileTypeBtn, "onClick", this, showFileTypeSelection));
		},
		
		buildLanguages: function() {
			if (this.json.languages.all) {
				this.langAll.attr("checked", true);
				this.langBtn.setDisabled(true);
			} else {
				this.langSpecify.attr("checked", true);
				this.langBtn.setDisabled(false);
			}
			
			selectLangAll = function() {
				this.json.languages.all = true;
				this.langBtn.setDisabled(true);
			}
			
			selectLangSpecify = function() {
				this.json.languages.all = false;
				this.langBtn.setDisabled(false);
			}
			
			showLanguageSelection = function() {
				var dialog = this._getMultiSelectDialog();
				dialog.titleTextNode.innerHTML = this.label_lang;
				
				// close items
				var languages = dojo.clone(this.json.languages);
				dialog.multiSelection.options = languages.items;
				dialog.multiSelection.buildOptions();
				
				var self = this;
				var handlers = [];
				handlers.push(dojo.connect(dialog.okButtonNode, "onClick", function() {
					dojo.forEach(handlers, dojo.disconnect);						
					self.json.languages.items = dialog.multiSelection.options;
					//EDR.dialog.util.hide(dialog);
				}));
				handlers.push(dojo.connect(dialog.cancelButtonNode, "onClick", function() {
					dojo.forEach(handlers, dojo.disconnect);
				}));
		
				EDR.dialog.util.show(dialog);
			}
		
			this.handlers.push(dojo.connect(this.langAll, "onClick", this, selectLangAll));
			this.handlers.push(dojo.connect(this.langSpecify, "onClick", this, selectLangSpecify));
			this.handlers.push(dojo.connect(this.langBtn, "onClick", this, showLanguageSelection));
		},
		
		buildScopes: function() {
			this._buildCheckBoxList(this.json.scopes, "scopes", this.scopeContainer);
			var noScope = this.json.scopes.length == 0;
			dojo.style(this.scopeContainer, "display", noScope ? "none" : "block");
			dojo.style(this.noScopeContainer, "display", noScope ? "block" : "none");
		},
				
		clear: function() {
			dojo.forEach(this.handlers, dojo.disconnect);
			dojo.forEach(dijit.findWidgets(this.facetContainer), function(widget) {
				widget.destroy();
			});
			dojo.forEach(dijit.findWidgets(this.federatorContainer), function(widget) {
				widget.destroy();
			});
			dojo.forEach(dijit.findWidgets(this.sourceContainer), function(widget) {
				widget.destroy();
			});
			dojo.forEach(dijit.findWidgets(this.scopeContainer), function(widget) {
				widget.destroy();
			});
			dojo.empty(this.facetContainer);
			dojo.empty(this.federatorContainer);
			dojo.empty(this.scopeContainer);
			dojo.empty(this.sourceContainer);
		},
		
		_getSelectedItemIds: function(items) {
			var array = [];
			for (var i=0; i<items.length; i++) {
				if (items[i].selected) array.push(items[i].value);
			}
			return array;
		},
		
		_getMultiSelectDialog: function() {
			if (this.dialog == null) {
				this.dialog = dijit.byId(EDR.prefix+"multiSelectDlg");
			}
			return this.dialog;
		},
				
		_buildCheckBoxList: function(candidates, name, parent, sourceTypeIcon) {
			var array = [];
			for (var i=0; i<candidates.length; i++) {
				var item = candidates[i];
				var chkboxContainer = dojo.create("div", {}, parent);
				var params = {id:this.prefix+this.id + "-" + name + "-" + i, name: name, value: item.value};
				var chkbox = new dijit.form.CheckBox(params);
				array.push(chkbox);
				chkboxContainer.appendChild(chkbox.domNode);
				chkbox.attr('checked', item.selected);
				if (sourceTypeIcon) this._buildSourceTypeIcon(item.value, chkboxContainer);
				dojo.create("label", {"for":this.prefix+this.id + "-" + name + "-" + i, innerHTML: item.label}, chkboxContainer);
			}
			return array;
		},
		
		_buildSourceTypeIcon: function(documentSource, parent) {
			var sourceTypeString = EDR.messages[documentSource + "_tooltip"];
			if(sourceTypeString == null) {
				sourceTypeString = EDR.messages.seedlist_tooltip;
			}
			var iconPath = EDR.config["documentSource_" + documentSource.toLowerCase() + "_icon"];
			if(iconPath == null) {
				iconPath = EDR.config.documentSource_default_icon;
			}
			iconPath = EDR.contextPath + iconPath;
			return dojo.create("img", {src: iconPath, alt:"", style:"vertical-align:bottom;margin-left:5px;margin-right:5px;"}, parent);
		},
		
		_buildRadioBoxList: function(candidates, name, parent, clickEvtHandler) {
			var array = [];
			for (var i=0; i<candidates.length; i++) {
				var item = candidates[i];
				var radioContainer = dojo.create("div", {}, parent);
				var params = {id:this.prefix+this.id + "-" + name + "-" + i, name: name, value: item.value};
				var radio = new dijit.form.RadioButton(params);
				if (clickEvtHandler != null) {
					this.handlers.push(dojo.connect(radio, "onClick", this, clickEvtHandler));
				}
				array.push(radio);
				radioContainer.appendChild(radio.domNode);
				radio.attr('checked', item.selected);
				dojo.create("label", {"for":this.prefix+this.id + "-" + name + "-" + i, innerHTML: item.label}, radioContainer);
			}
			return array;
		},
		
		disableFacetCollections: function(disable) {
			dojo.forEach(dijit.findWidgets(this.facetContainer), function(widget) {
				widget.setDisabled(disable);
			});
			dojo.forEach(this.facetContainer.getElementsByTagName("LABEL"), function(label) {
				label.style.color = disable ? "gray" : "black";
			});
		},
		
		disableFederatorCollections: function(disable) {
			dojo.forEach(dijit.findWidgets(this.federatorContainer), function(widget) {
				widget.setDisabled(disable);
			});
			dojo.forEach(this.federatorContainer.getElementsByTagName("LABEL"), function(label) {
				label.style.color = disable ? "gray" : "black";
			});
		},
		
		setAdvancedSearchOptions: function() {
			this.isAdvancedSearchOption = true;
			this.url = EDR.contextPath + "/preferences?action=getAdvancedSearchOptions";
			this.partialLoadUrl = EDR.contextPath + "/preferences?action=getAdvancedSearchOptions";
			if (dojo.isFF) {
				this.introLabel.innerHTML = this.search_options_intro;
			} else {
				this.introLabel.innerText = this.search_options_intro;
			}
		},
		
		_getNullSearchOptions: function() {
			return {
				isFaceteSearch: false,
				facetCollections: [],
				collections: [],
				scopes: [],
				sourcetypes: [], 
				filetypes: { all: true, items:[] },
				languages: { all: true, items:[] }
			};
		},
				
		destroy: function() {
			dojo.forEach(this.handlers, dojo.disconnect);
			this.inherited("destroy", arguments);
		},
		
		// messages
		tooltip_advancedSearch: EDR.messages.tooltip_advancedSearch,
		collection_embedded_help: EDR.messages.tooltip_help_collection,
		button_select: EDR.messages.button_select,
		search_options_intro: EDR.messages.search_options_intro,
		search_options_intro2: EDR.isAuthorized ? EDR.messages.search_options_intro_authorized : EDR.messages.search_options_intro_unauthorized,
		tooltip_documentsource: EDR.messages.tooltip_documentsources,
		tooltip_documenttypes: EDR.messages.tooltip_documenttypes,
		tooltip_languages: EDR.messages.tooltip_languages,
		tooltip_scopes: EDR.messages.tooltip_scopes,
		label_collection: EDR.messages.label_collection,
		label_facetcollection: EDR.messages.label_facetcollection,
		label_nofacet: EDR.messages.label_nofacet,
		label_nofederator: EDR.messages.label_nofederator,
		label_scope: EDR.messages.label_scope,
		label_noscope: EDR.messages.label_noscope,
		label_scope_title: "",//EDR.messages.label_scope_title,
		label_source: EDR.messages.label_source,
		label_nosource: "",
		label_source_all: EDR.messages.label_source_all,
		label_source_specific: EDR.messages.label_source_specific,
		label_file: EDR.messages.label_file,
		label_file_all: EDR.messages.label_file_all,
		label_file_specific: EDR.messages.label_file_specific,
		label_lang: EDR.messages.label_lang,
		label_lang_all: EDR.messages.label_lang_all,
		label_lang_specific: EDR.messages.label_lang_specific,
		error_nocollection: EDR.messages.error_nocollection,
		error_nosourcetypes: EDR.messages.error_nosourcetypes,
		splash_loading: EDR.messages.splash_loading
	}
);