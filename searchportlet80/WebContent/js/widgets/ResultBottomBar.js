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
dojo.provide("widgets.ResultBottomBar");

dojo.require("dojo.fx");
dojo.require("dijit._Widget");
dojo.require("dijit._Templated");

dojo.declare(
"widgets.ResultBottomBar",
[dijit._Widget, dijit._Templated],
{
	_height: 0,
	
	_visible: false,
	
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl("widgets", "templates/ResultBottomBar.html"),
	
	_lastQuery: '',
	_lastQueryLanguage: '',
	_lastSpellCorrections: null,
	_messageTemplate: EDR.messages.resultbottombar_label_searchedFor,
	
	postCreate: function() {
		if(EDR.isTextAnalyticsEnabled) {
			this._messageTemplate = EDR.messages.resulttoolbar_label_exploredOn;
		}
		this._height = dojo.contentBox(this.domNode).h;
		dojo.style(this.domNode, "display", "none");
		
		dojo.subscribe("postLoad", this, "_processSearchResults");
      dojo.subscribe("collectionChanged", this, "_processCollectionChanged");
	},
	

	show: function() {
		if (EDR.isQueryAreaHidden) return;
		this._visible = true;
		var anim = dojo.fx.wipeIn({node: this.domNode, duration: 1000});
		var _this = this;
		anim.onEnd = function() {
			var resultsBorderLayout = dijit.byId(EDR.prefix+"horizontalSearchPanes");
			if(resultsBorderLayout) {
				resultsBorderLayout.resize();
			}
			_this.domNode.style.overflow = "auto";
		};
		anim.play();
	},
	
	hide: function() {
		var anim = dojo.fx.wipeOut({node: this.domNode, duration: 1000});
		anim.play();
		this._visible = false;
	},

	_processSearchResults: function(evt) {
		var m = dijit.byId(EDR.prefix+"searchManager");
		var searchResult = m.getSearchResult();
		
		this.updateInfo(searchResult);
	},
	
	_processCollectionChanged: function() {
      if (EDR.isTextAnalyticsEnabled) return;
      this.hide();
      // hide it imeediately
      dojo.style(this.domNode, "display", "none");
	},
	
	showMessage: function(message) {
		this.domNode.style.overflow = "auto";
		dojo.empty(this.promptSearchFor);
		this.promptSearchFor.appendChild(dojo.doc.createTextNode(message));
		if(!this._visible) {
			this.show();
		}
	},
	
	revertMessage: function() {
		if (this._lastQuery != null && this._lastQuery.length != 0) {
			var m = dijit.byId(EDR.prefix+"searchManager");
			var searchResult = m.getSearchResult();

			var message = this._messageTemplate.replace("\{0\}", this._lastQuery);
			message += this.getQueryLanguage(this._lastQueryLanguage);
			message += this.getSpellCorrection(this._lastSpellCorrections, searchResult);
			message += this.getSynonymExpansion(this._synonymExpansions, this._userFeedBack, this._userFeedBackConcepts);
			this.promptSearchFor.innerHTML = message;
		} else {
			this.promptSearchFor.innerHTML = "";
			if(this._visible) {
				this.hide();
			}
		}
	},
	
	updateInfo: function(result) {
		var node = this.promptSearchFor;
		dojo.empty(node);
		
		var query = this._lastQuery = result.fullQuery;
		var message = this._messageTemplate.replace("\{0\}", query);
		node.appendChild(dojo.doc.createTextNode(message));
		dojo.style(this.domNode, "height", "auto");
		
		var queryLanguage = this._lastQueryLanguage = result.queryLanguage;
		dojo.create("span", {innerHTML: this.getQueryLanguage(queryLanguage)}, node);
		
		var spellCorrections = this._lastSpellCorrections = result.spellCorrections;;
		dojo.create("span", {innerHTML: this.getSpellCorrection(spellCorrections, result)}, node);
		
		var synonymExpansions = this._synonymExpansions = result.synonymExpansions;
		var userFeedBack = this._userFeedBack = result.userFeedBack;
		var userFeedBackConcepts = this._userFeedBackConcepts = result.userFeedBackConcepts;
		dojo.create("span", {innerHTML: this.getSynonymExpansion(synonymExpansions, userFeedBack, userFeedBackConcepts)}, node);
		
		if(result.dupEliminated) {
//			message += "<br />"+ EDR.messages.text_results_omitted;
//			message += "&nbsp";
			dojo.create("br", null, node);
			node.appendChild(dojo.doc.createTextNode(EDR.messages.text_results_omitted + " "));
//			var link = '<a onclick="EDR.bean.Email.searchAllResults()" href="javascript:;">' + EDR.messages.text_results_show_duplicates + '</a>';
//			message += link;
			dojo.create("a", {href: "javascript:;", innerHTML: EDR.messages.text_results_show_duplicates}, node);
			a.onclick = function() {
				EDR.bean.Email.searchAllResults();
			}
		}
		
		if(result.predefinedResults) {
//			message += "<br /><b>"+ EDR.messages.text_field_predefinedLinks + "</b>";
			dojo.create("br", null, node);
			dojo.create("b", {innerHTML: EDR.messages.text_field_predefinedLinks}, node);
			var results = result.predefinedResults;
			for(var i=0; i<results.length; i++) {
//				var content = '<br /><a href="' + results[i].documentID + '">' + results[i].title + '</a>: ' + results[i].description;
//				message += content;
				dojo.create("br", null, node);
				dojo.create("a", {href: results[i].documentID, innerHTML: results[i].title}, node);
				node.appendChild(dojo.doc.createTextNode(": " + results[i].description));
			}
		}
		// extraQueryData
		if(EDR.config["extraQueryData_show"] == "true") {
			var aclMessage = EDR.messages.prompt_show_ACL + ":" + result.decodedSecurityContext;
			node.appendChild(dojo.doc.createTextNode(aclMessage));
		}
		
//		this.promptSearchFor.innerHTML = message;
		if(!this._visible) {
			this.show();
		}
		// temp fix
		var resultsBorderLayout = dijit.byId(EDR.prefix+"horizontalSearchPanes");
		if(resultsBorderLayout) {
			resultsBorderLayout.resize();
		}
	},
	
	getQueryLanguage: function(queryLang) {
		var message = "&nbsp;&nbsp;" + this.escapeHtml(EDR.messages.resultsOption_label_lang) + ":&nbsp;" + this.escapeHtml(queryLang);
		return message;
	},

	getSpellCorrection: function(spellCorrections, result) {
		var message = "";
		var fullQuery = result.fullQuery;
		for (var i=0; i<spellCorrections.length; i++) {
			var suggestions = spellCorrections[i].data;
			var misspelled = spellCorrections[i].qSubstr;
			var words = "";
			for (var j=0; j<suggestions.length; j++) {
				var suggestion = this.escapeSingleQuoteAndBackSlash(this.escapeHtml(suggestions[j]));
				var match = suggestion.match(/^&quot;(.*)&quot;$/); 
				if(match) {
					suggestion = match[1];
				}
				if(EDR.config["spellCorrections_keepOriginalQueryTerms"] == "true") {
					suggestion = fullQuery.replace(misspelled, suggestion);
					suggestion = suggestion.replace(/"/g, "&quot;")
				}
				words += "&nbsp;&nbsp;" + "<a onclick=\"EDR.dijit.byId('"+EDR.prefix+"searchManager').submitQuickKeywordSearch('" + suggestion + "');\"" +
					" href='javascript:;'><b>" + this.escapeHtml(suggestions[j]) + "</b></a>";
			}
			message += "<span style='margin-left:10px;'>/</span>";
			message += "<span style='margin-left:15px;'>" + EDR.messages.text_field_spellCorrections.replace("\{0\}", words) + "</span>";
		}
		return message;
	},
	
	getSynonymExpansion: function(synonymExpansions, userFeedBack, userFeedBackConcepts) {
		var message = "&nbsp;&nbsp;";
		// synonym expansion
		for (var i=0; i<synonymExpansions.length; i++) {
         var item = synonymExpansions[i];
		   var from = this.escapeHtml(item.querySubstring);
		   var to = this.escapeHtml(item.expandedQuery);
			message += "<span style='margin-left:10px;'>/</span>";
			message += "<span style='margin-left:12px;'>" + 
				EDR.messages.text_field_synonymExpansion.replace("\{0\}", from).
					replace("\{1\}", to) + "</span>";
		}
		
		// user feedback
		if (userFeedBack != null) {
			message += "<span style='margin-left:10px;'>/</span>";
			message += "<span style='margin-left:12px;'>" + 
			EDR.messages.text_field_synonymExpansionSemantic + ":" + this.escapeHtml(userFeedBack) + "</span>";		
		}
		
		// user feedback concepts
		if (userFeedBack && userFeedBackConcepts) {
			message += "<span style='margin-left:10px;'>/</span>";
			if(userFeedBackConcepts) {
				message += "<span style='margin-left:12px;'>" + 
				EDR.messages.text_field_synonymExpansionSemanticConcepts + ":" + this.escapeHtml(userFeedBackConcepts) + "</span>";		
			}
		}
		
		return message;
	},
	
	escapeHtml: function(value) {
	     return value
	         .replace(/&/g, "&amp;")
	         .replace(/</g, "&lt;")
	         .replace(/>/g, "&gt;")
	         .replace(/"/g, "&quot;");
	},
	
	escapeSingleQuoteAndBackSlash: function(value) {
	     return value
	     	.replace(/\\/g, "\\\\")
	     	.replace(/'/g, "\\'");
	},
	
	__dummy__: ''
});