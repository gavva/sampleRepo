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
dojo.provide("widgets.ResultsBody");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dojox.image.LightboxNano");


dojo.declare(
"widgets.ResultsBody",
dijit._Widget,
{
	
	_columns: null,
	_columnsWidth: null,
	
	_detailsExpanded: false,
	
	testData: "",	//path of testdata
	_testMode: false,
	
	_cachedResults: null,
//	_cachedHtml: '',
	_cachedArray: [],
	
	widgetsInTemplate: false,
	templatePath: dojo.moduleUrl("widgets", "templates/ResultsBody.html"),
	
	postCreate: function() {
		if(this.testData != "") {
			this._renderTestdata();
		}
//		dojo.subscribe("postLoad", this, "_processSearchResults");
		dojo.subscribe("expandDetails", this, "_expandDetails");
		dojo.subscribe("headerColumnsChanged", this, "_onHeaderColumnsChanged");
		dojo.subscribe("headerColumnsResized", this, "_onHeaderColumnsChanged");
		
		this.connect(this.domNode.parentNode, "onscroll", "_onScroll");

		window["ica_g_openPreview"] = function (event, rowNum) {
			var resultsObj = dijit.byId(EDR.prefix+"searchManager").getSearchResult();
			var result = resultsObj.results[rowNum];
			
			var previewNode = null;
			if(EDR.isTextAnalyticsEnabled) {
				var analyticsPreviewWidget = dijit.byId(EDR.prefix+"analyticsPreviewContent");
				analyticsPreviewWidget.setDocumentParams(result, resultsObj.fullQuery);
				previewNode = analyticsPreviewWidget.previewSplitContainer.domNode;
			}else{
				var content = dijit.byId(EDR.prefix+"previewContent");
				if(!content) {
					dojo.parser.parse(EDR.prefix+"previewDialog-Container");
					content = dijit.byId(EDR.prefix+"previewContent");
				}
				content.setDocumentParams(result, resultsObj.fullQuery);
			}
			var previewContainer = dijit.byId(EDR.prefix+"previewContainer").domNode;
			var windowSize = dojo.contentBox(dojo.body());
			dojo.style(previewContainer, "width", "800px");
			dojo.style(previewContainer, "height", "600px");
			if(windowSize.w < 820) {
				dojo.style(previewContainer, "width", (windowSize.w - 40) + "px");
			}
			if(windowSize.h < 680) {
				dojo.style(previewContainer, "height", (windowSize.h - 100) + "px");
				if(previewNode){
					dojo.style(previewNode, "height", (windowSize.h - 150) + "px");
				}				
			} else {
				if(previewNode) {
					dojo.style(previewNode, "height", "550px");	
				}
			}
			EDR.dialog.util.showById(EDR.prefix+"previewDialog");			
		};

		window["ica_g_onkeydown"] = function(event, rowNum) {
			var evt = dojo.fixEvent(event);
			if(evt.keyCode == dojo.keys.ENTER) {
				ica_g_openPreview(event, rowNum);
			}
		};	
	},
	
	processCachedSearchResults: function() {
		if (this._cachedResults != null) {
			this.renderSearchResult(this._cachedResults);
		}
		this._cachedResults = null;
	},
	
	_processSearchResults: function(evt) {
		var m = dijit.byId(EDR.prefix+"searchManager");
		if(m) {
			var result = m.getSearchResult();
			if(result) {
				if (this.isVisible) {
					this.renderSearchResult(result);
				} else {
					this._cachedResults = result;
				}
			}
		}
	},
	
	refresh: function() {
		this._processSearchResults();
	},
	
	_onHeaderColumnsChanged: function() {
		var m = dijit.byId(EDR.prefix+"searchManager");
		if(m) {
			var result = m.getSearchResult();
			if(result) {
				this._columns = m.getColumnDefs();
				this.renderSearchResult(result);
			}
		}		
	},
	
	_renderTestdata: function() {
		var args = {
			url: this.testData,
			handleAs: "json",
			load: dojo.hitch(this, "_onTestdataLoadComplete")
		};
		dojo.xhrGet(args);
	},
	
	_onTestdataLoadComplete: function(response,ioArgs) {
		this.renderSearchResult(response);
	},
	
	renderSearchResult: function(searchResult) {
		this.clear();
		var results = searchResult.results;
		
		var resultsHeader = dijit.byId(EDR.prefix+"resultsHeader");
		dojo.style(EDR.prefix+"resultsBody", "width", resultsHeader.getWidth() + "px");
		
		if(!this._columns) return;
		
		var columnsLen = this._columns.length;
		this._columnsWidth = new Array();
		for(var i=0; i < columnsLen; i++) {
			var column = this._columns[i];
			var width = resultsHeader.getWidth(column);
			this._columnsWidth.push(width);
		}
		
//		this._cachedHtml += "<table class='email-list' style='width:100%' border='0' cellspacing='0' cellpadding='3' tabindex='0'><tbody dojoAttachPoint='tbody'>";
		this._cachedArray.push("<table class='email-list' style='width:100%' border='0' cellspacing='0' cellpadding='3' tabindex='0'><tbody dojoAttachPoint='tbody'>");
		for(var i=0; i<results.length; i++) {
			this._renderResult(results[i], i, searchResult);
		}
//		this._cachedHtml += "</tbody></table>";
		this._cachedArray.push("</tbody></table>");
//		this.domNode.innerHTML = this._cachedHtml;
		this.domNode.innerHTML = this._cachedArray.join("");

		this._onScroll();
		
		if(EDR.isStretchHeight) {
			this._calcHeight();
		}
	},
	
	_calcHeight: function() {
		var minHeight = 800;
		var strMinHeight = EDR.config.style_minHeight;
		if(strMinHeight && strMinHeight.length > 2) {
			strMinHeight = strMinHeight.substring(0, strMinHeight.length - 2);
			minHeight = strMinHeight - 0;
		}
		
		var bannerHeight = dojo.marginBox(EDR.prefix + "header").h;
		var queryPaneHeight = dojo.marginBox(EDR.prefix + "queryContentPane").h;
		var tabWindow = dijit.byId(EDR.prefix + "horizontalSearchPanes");
		var resultToolbarHeight = dojo.marginBox(tabWindow.resultToolbar.domNode).h;
		var resultBottomBarHeight = dojo.marginBox(tabWindow.resultBottomBar.domNode).h;
		var resultsHeaderHeight = dojo.marginBox(dijit.byId(EDR.prefix + "resultsHeader").domNode).h;
		var resultsBodyHeight = dojo.marginBox(dijit.byId(EDR.prefix + "resultsBody").domNode).h;
		var diff = minHeight - (bannerHeight + queryPaneHeight + resultToolbarHeight + resultBottomBarHeight + resultsHeaderHeight + resultsBodyHeight);
		if(diff > 0) {
			resultsBodyHeight += diff;
		}
		
		dojo.marginBox(EDR.prefix + "resultsBodyContainer", {h: resultsBodyHeight});
		var borderContainer = tabWindow.resultsBodyContainer;
		dojo.marginBox(borderContainer.domNode, {h: resultsHeaderHeight + resultsBodyHeight });
		var horizontalSearchPanesHeight = resultToolbarHeight + resultBottomBarHeight + resultsHeaderHeight + resultsBodyHeight;
		dojo.marginBox(tabWindow.domNode, {h:horizontalSearchPanesHeight});
		dojo.marginBox(EDR.prefix + "content", {h: horizontalSearchPanesHeight + 18});
	
		var topBorderContainer = dijit.byId(EDR.prefix + "topBorderContainer");
		dojo.marginBox(topBorderContainer.domNode, {h: queryPaneHeight + horizontalSearchPanesHeight + 18});
		
		if(EDR.isPortlet) {
			var totalHeight = bannerHeight + queryPaneHeight + horizontalSearchPanesHeight + 18;
			dojo.marginBox(EDR.prefix + "overallContainer", {h: totalHeight});
		}
	},
	
	_scrollStart: -1,
	
	_onScroll: function(evt) {
		var now = new Date() - 0;
		var _this = this;
		var execute = function() {

			var node = _this.domNode.parentNode;
			var height = dojo.contentBox(node).h;
			var scrollTop = node.scrollTop;
			
			var from = to = 0;
			var table = _this.domNode.firstChild;
			var rows = table.rows;
			var length = rows.length;
			for(var i=0; i<length; i++) {
				var tr = rows[i];
				var coords = dojo.coords(tr);
				if(coords.t < scrollTop) {
					from = i;
				}
				if(coords.t + coords.h < scrollTop + height) {
					to = i;
				} else {
					break;
				}
			}
			from = Math.floor(from/2);
			to = Math.ceil(to/2);
			
			_this._createImageObjects(from, to + 3, table);
			
		};
		if(now - this._scrollStart > 500) {
			this._scrollStart = now;
			setTimeout(execute, 500);
		}
	},
	
	_createImageObjects: function(from, to, table) {
		var _this = this;
		var rows = table.rows;
		var m = dijit.byId(EDR.prefix+"searchManager");
		if(m) {
			var result = m.getSearchResult();
			if(result) {
				var results = result.results;
				var tooltipText = EDR.messages.tooltip_columns_thumbnail;
				for(var i = from; i < to + 1; i++) {
					var r = results[i];
					if(r && r.thumbnail) {
						var td = dojo.query("td.result-column-thumbnail", rows[i*2])[0];						
						if(td) {
							if(dojo.query("a", td).length > 0) {
								continue;
							}
							var div = td.firstChild;
							var imgSrc = EDR.contextPath + "/getimage?did=" + encodeURIComponent(r.documentID) + "&cid=" + encodeURIComponent(r.collectionID); 
							var a = dojo.create("a", {onclick:"return false"}, div);
							var img = dojo.create("img", {"src":imgSrc, "title":tooltipText,"alt": r.documentID}, a);
							if(EDR.isStretchHeight) {
								img.onload = function() {
									_this._calcHeight();
								};
							}

							if(dojo.isIE) {
								var setSize = function(a, img) {
									return function() {
										var imgWidth; var imgHeight;
										imgWidth = img.width;
										imgHeight = img.height;
										
										var ratio = 1;
										if(imgWidth > imgHeight) {
											ratio = imgWidth / 120;
										} else {
											ratio = imgHeight / 120;
										}
										if(ratio != 0) {
											var newWidth = Math.floor(imgWidth / ratio);
											var newHeight = Math.floor(imgHeight / ratio);
											img.width = newWidth + "";
											img.height = newHeight + "";
											a.style.width = newWidth + "px";
											a.style.height = newHeight + 2 + "px";
										}
										dojo.style(img, "border", "1px solid black");
									};
								};
								
								var imgWidth; var imgHeight;
								imgWidth = img.width;
								imgHeight = img.height;
								if(imgHeight == 30) {
									img.onload = (function(func) {
										return function() {
											setTimeout(func, 100);
										};
									})(setSize(a,img));
								} else {
									(setSize(a,img))();
								}
							
							} else {
								dojo.style(img, "border", "1px solid black");								
								img.height = "120";
							}
							
							if(!(dojo.isIE && dojo.isIE <= 7)) {
								var nano = new dojox.image.LightboxNano({
									href: imgSrc
								}, a);					
							}
						}
					}
				}
			}
		}

	},
	
	_renderResult: function(result, rowNum, resultsObj) {
		if(!this._columns) return;
		
		var _capitalize = function(str) {
			return (str.substring(0,1).toUpperCase() + str.substring(1));
		};

		if(rowNum % 2 == 0) {
//			this._cachedHtml += "<tr id='" + EDR.prefix + "email-row-" + rowNum + "' class='email-entry-row-header even'>";
			this._cachedArray.push("<tr id='" + EDR.prefix + "email-row-" + rowNum + "' class='email-entry-row-header even'>");
		} else {
//			this._cachedHtml += "<tr id='" + EDR.prefix + "email-row-" + rowNum + "' class='email-entry-row-header odd'>";
			this._cachedArray.push("<tr id='" + EDR.prefix + "email-row-" + rowNum + "' class='email-entry-row-header odd'>");
		}
		
		for(var i=0; i<this._columns.length; i++) {
			var column = this._columns[i];
			var width = this._columnsWidth[i];
			var tr = null;
			if(dojo.isFunction(this["_render" + _capitalize(column)] )) {
				this["_render" + _capitalize(column)](result, tr, rowNum, width, resultsObj);
			} else {
				this._renderDefaultColumn(result, column, tr, rowNum, width);
			}
		}
//		this._cachedHtml += "</tr>";
		this._cachedArray.push("</tr>");

		if(rowNum % 2 == 0) {
//			this._cachedHtml += "<tr id='" + EDR.prefix + "email-row-" + rowNum + "' class='email-entry-row-header even'>";
			this._cachedArray.push("<tr id='" + EDR.prefix + "email-row-" + rowNum + "' class='email-entry-row-header even'>");
		} else {
//			this._cachedHtml += "<tr id='" + EDR.prefix + "email-row-" + rowNum + "' class='email-entry-row-header odd'>";
			this._cachedArray.push("<tr id='" + EDR.prefix + "email-row-" + rowNum + "' class='email-entry-row-header odd'>");
		}

		this._renderDescription(result, tr, rowNum);
//		this._cachedHtml += "</tr>";
		this._cachedArray.push("</tr>");
	},
	
	_renderFiletype: function(result, tr, rowNum, width, resultsObj) {
		var documentSource = result.documentSource;
		var protocol = result.protocol;
		var sourceTypeString = EDR.messages[documentSource + "_tooltip"];
		if(sourceTypeString == null) {
			sourceTypeString = documentSource || "";
		}
		var iconPath;
		if(documentSource == "seedlist") {
			iconPath = EDR.config["documentSource_" + documentSource + "_" + protocol + "_icon"];
		} else {
			iconPath = EDR.config["documentSource_" + documentSource + "_icon"];
		}
		
		if(iconPath == null) {
			iconPath = EDR.config.documentSource_default_icon;
		}
		iconPath = EDR.contextPath + iconPath;

//		this._cachedHtml += "<td class='result-column-filetype' tabindex='0' ";
		this._cachedArray.push("<td class='result-column-filetype' tabindex='0' ");
		
		if(EDR.isTextAnalyticsEnabled) {
//			this._cachedHtml += "title='" + EDR.messages.tooltip_analytics_preview + "' ";
			this._cachedArray.push("title='" + EDR.messages.tooltip_analytics_preview + "' ");
		} else {
//			this._cachedHtml += "title='" + EDR.messages.tooltip_search_preview + "' ";
			this._cachedArray.push("title='" + EDR.messages.tooltip_search_preview + "' ");
		}
		
//		this._cachedHtml += "style='min-width:"+width+"px;width:"+width+"px' onclick='ica_g_openPreview(event,"+ rowNum +")' onkeydown='ica_g_onkeydown(event,"+rowNum+")'>";
		this._cachedArray.push("style='min-width:"+width+"px;width:"+width+"px' onclick='ica_g_openPreview(event,"+ rowNum +")' onkeydown='ica_g_onkeydown(event,"+rowNum+")'>");
		
//		this._cachedHtml += "<div style='overflow:hidden;width:"+ width + "px'></div>";
		this._cachedArray.push("<div style='overflow:hidden;width:"+ width + "px'></div>");
		
		var iconTooltip = EDR.messages[documentSource + "_tooltip"];
		if(iconTooltip == null) {
			iconTooltip = sourceTypeString;
		}
		var iconAlt = EDR.messages[documentSource];
		
//		this._cachedHtml += "<img id='" + EDR.prefix + "email-list-type-"+rowNum+"' src='" + iconPath + "' title='" + iconTooltip + "' alt='" + iconAlt + "' />";
		this._cachedArray.push("<img id='" + EDR.prefix + "email-list-type-"+rowNum+"' src='" + iconPath + "' title='" + iconTooltip + "' alt='" + iconAlt + "' />");
//		this._cachedHtml += "<span style='vertical-align:top'>" + sourceTypeString +"</span>";
		this._cachedArray.push("<span style='vertical-align:top'>" + sourceTypeString +"</span>");
		
//		this._cachedHtml += "</td>";
		this._cachedArray.push("</td>");
	},
	
	_renderRelevance: function(result, tr, rowNum, width) {
//		this._cachedHtml += "<td class='result-column-score searchResultCol_relevance' style='min-width:"+ width+"px;width:"+width+"px'>";
//		this._cachedHtml += "<div style='overflow:hidden;'>" + result.score + "%";
//		this._cachedHtml += "</div></td>";
		this._cachedArray.push("<td class='result-column-score searchResultCol_relevance' style='min-width:"+ width+"px;width:"+width+"px'>");
		this._cachedArray.push("<div style='overflow:hidden;'>" + result.score + "%");
		this._cachedArray.push("</div></td>");
	},
	
	_renderDate: function(result, tr, rowNum, width) {
//		this._cachedHtml += "<td class='result-column-date' style='min-width:"+width+"px;width:"+width+"px'>";
//		this._cachedHtml += "<div style='overflow:hidden'>"+result.date+"</div>";
//		this._cachedHtml +="</div></td>";
		this._cachedArray.push("<td class='result-column-date' style='min-width:"+width+"px;width:"+width+"px'>");
		this._cachedArray.push("<div style='overflow:hidden'>"+result.date+"</div>");
		this._cachedArray.push("</div></td>");
	},
	
	_renderTitle: function(result, tr, rowNum, width) {
//		this._cachedHtml += "<td class='result-column-title' style='min-width:"+width+"px;width:"+width+"px'>";
		this._cachedArray.push("<td class='result-column-title' style='min-width:"+width+"px;width:"+width+"px'>");
		
		var uri = result.documentURI;
		var clientUrl = result.clientUrl;
		var content = "";
		var target = (EDR.config.default_link_target != "null" ? EDR.config.default_link_target : "_blank");
		if(uri) {
			if(uri.toLowerCase().indexOf("http://") == 0) {
				if(EDR.config.http_link_target != "null") {
					target = EDR.config.http_link_target;
				}
			} else if(uri.toLowerCase().indexOf("https://") == 0) {
				if(EDR.config.https_link_target != "null") {
					target = EDR.config.https_link_target;
				}
			} else if(uri.toLowerCase().indexOf("notes://") == 0) {
				if(EDR.config.notes_link_target != "null") {
					target = EDR.config.notes_link_target;
				}
			}
		}

		if(!(EDR.config.forceTitleLink && EDR.config.forceTitleLink == "true") && (!uri || uri == "")) {
			content = result.title;
		} else {
			content = "<a href='" + uri + "'" + (target != "" ? "' target='_blank'>" : ">") + result.title + "</a>";
		}
		// client viewer
		if(EDR.config.clientViewer_show  && EDR.config.clientViewer_show == "true") {
			if(clientUrl != "") {
				var clientIcon = "images/document.gif";
				if(EDR.config["client_" + result.documentSource +"_icon"] != null) {
					clientIcon = EDR.config["client_" + result.documentSource +"_icon"];
				}
				content += " <a href='" + clientUrl + "' style='font-size: smaller;'><img src='"+ EDR.contextPath + "/" + clientIcon + "' title='" + EDR.messages.clientViewer + "'/>" + EDR.messages.button_clientViewer + "</a>";
			}
			
		}
		
//		this._cachedHtml += "<div style='overflow:hidden;width:"+width+"px";
		this._cachedArray.push("<div style='overflow:hidden;width:"+width+"px");
		if(!result.firstOfASite) {
//			this._cachedHtml += ";padding-left:2em";
			this._cachedArray.push(";padding-left:2em");
		}
//		this._cachedHtml += "'>";
//		this._cachedHtml += content;
//		this._cachedHtml += "</div></td>";
		this._cachedArray.push("'>");
		this._cachedArray.push(content);
		this._cachedArray.push("</div></td>");
	},
	
	_renderThumbnail: function(result, tr, rowNum, width) {
//		this._cachedHtml += "<td class='result-column-thumbnail' rowSpan='2' style='min-width:"+width+"px;width:"+width+"px'>";
//		this._cachedHtml += "<div style='overflow:hidden;width:" + width + "px'>";
//		this._cachedHtml += "&nbsp;</div></td>";
		this._cachedArray.push("<td class='result-column-thumbnail' rowSpan='2' style='min-width:"+width+"px;width:"+width+"px'>");
		this._cachedArray.push("<div style='overflow:hidden;width:" + width + "px'>");		
		this._cachedArray.push("&nbsp;</div></td>");
	},
	
	_renderDefaultColumn: function(result, column, tr, rowNum, width) {
//		this._cachedHtml += "<td class='result-column-default' style='min-width:"+width+"px;width:"+width+"px'>";
//		this._cachedHtml += "<div style='width:"+width+"px'>";
//		this._cachedHtml += result["fields"][column] ? result["fields"][column] : "&nbsp;";
//		this._cachedHtml += "</div></td>";
		this._cachedArray.push("<td class='result-column-default' style='min-width:"+width+"px;width:"+width+"px'>");
		this._cachedArray.push("<div style='width:"+width+"px'>");		
		this._cachedArray.push(result["fields"][column] ? result["fields"][column] : "&nbsp;");
		this._cachedArray.push("</div></td>");
	},
	
	_renderDescription: function(result, tr, rowNum) {
		var colSpan  = (dojo.indexOf(this._columns,"thumbnail") != -1) ? this._columns.length-1 : this._columns.length;
//		this._cachedHtml += "<td class='email-entry-row-body " + (rowNum % 2 == 0 ? "even" : "odd") + " body' colSpan='" + colSpan +"'";
		this._cachedArray.push("<td class='email-entry-row-body " + (rowNum % 2 == 0 ? "even" : "odd") + " body' colSpan='" + colSpan +"'");
//		this._cachedHtml += "<div class='" +  (result.wbrInserted ? "result-column-description-container-forcebr" : "result-column-description-container") + "'";
		this._cachedArray.push("<div class='" +  (result.wbrInserted ? "result-column-description-container-forcebr" : "result-column-description-container") + "'");
		if(!result.firstOfASite) {
//			this._cachedHtml += " style='padding-left:3em'";
			this._cachedArray.push(" style='padding-left:3em'");
		}
//		this._cachedHtml += ">";
//		this._cachedHtml += "<div class='result-column-description'>" + result.description + "</div>";
//		this._cachedHtml += "<div class='results-document-details'";		
		this._cachedArray.push(">");
		this._cachedArray.push("<div class='result-column-description'>" + result.description + "</div>");
		this._cachedArray.push("<div class='results-document-details'");
		if(!this._detailsExpanded) {
//			this._cachedHtml += " style='display:none'";
			this._cachedArray.push(" style='display:none'");
		}
//		this._cachedHtml += ">";
		this._cachedArray.push(">");
		this._renderDetailField("Document ID", result.displayedDocumentID);
		this._renderDetailField("Title", result.displayedTitle);
		this._renderDetailField("Language", result.language);
		this._renderDetailField("Source", result.documentSource);
		if(result.documentType != null) {
			this._renderDetailField("Type", result.documentType);
		}
//		this._cachedHtml += "<hr />";
		this._cachedArray.push("<hr />");
		if(result.scopes != null && result.scopes.length != 0) {
			this._renderDetailField("Scopes", result.scopes);
		}
		if(result.fields != null) {
			var fields = result.fields;
			for(var name in fields) {
				if(name.indexOf('_') == 0) continue;
				this._renderDetailField(name, fields[name]);
			}
		}
//		this._cachedHtml += "</div>";
		this._cachedArray.push("</div>");
		if(!result.firstOfASite) {
//			this._cachedHtml += "<div class='results-samesite-link'>";
			this._cachedArray.push("<div class='results-samesite-link'>");
			var link = EDR.contextPath + "/search?action=sameGroup&site=" + result.encodedID;
//			this._cachedHtml += "<a href='javascript:' onclick='EDR.bean.Email.searchSameGroup(\""+link+"\")'>" + EDR.messages.link_search_site + "</a>";
//			this._cachedHtml += "</div>";			
			this._cachedArray.push("<a href='javascript:' onclick='EDR.bean.Email.searchSameGroup(\""+link+"\")'>" + EDR.messages.link_search_site + "</a>");
			this._cachedArray.push("</div>");
		}		

//		this._cachedHtml += "</div></td>";
		this._cachedArray.push("</div></td>");
	},
	
	_renderDetailField: function(label, value) {
//		this._cachedHtml += "<span><b>"+label+"</b>:&nbsp;" + (value != "" ? value : "&nbsp;");
//		this._cachedHtml += "</span><br />";		
		this._cachedArray.push("<span><b>"+label+"</b>:&nbsp;" + (value != "" ? value : "&nbsp;"));
		this._cachedArray.push("</span><br />");
	},
	
	_expandDetails: function(flag) {
		if(flag) {
			dojo.query("div.results-document-details", this.domNode).style("display", "block");
		} else {
			dojo.query("div.results-document-details", this.domNode).style("display", "none");
		}
		this._detailsExpanded = flag;
		if(EDR.isStretchHeight) {
			this._calcHeight();
		}
	},
	
	clear: function() {
		dojo.empty(this.domNode);
//		this._cachedHtml = "";
		this._cachedArray = [];
	},

	_onResized: function(){
		this._onHeaderColumnsChanged();
	},

	__dummy__: ''
});
