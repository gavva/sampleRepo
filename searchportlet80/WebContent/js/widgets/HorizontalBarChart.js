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
dojo.provide("widgets.HorizontalBarChart");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dojox.fx.Shadow");

dojo.declare("widgets.HorizontalBarChart",
	[dijit._Widget, dijit._Templated],
	{
		templatePath: dojo.moduleUrl("widgets", "templates/HorizontalBarChart.html"),
		imgBasePath: EDR.config.imageBaseDir,
		imgFileName: "gradient_chartbar.png",
		barImgPath: "",
		
		json: null,
		url: '',
		_autoLoad: false,
		handlers:[],
		animations: [],
		shadows: [],
		resizing: false,
		
		rowHeight: 20,
		labelWidth: 100,
		barWidth: -1,
		barHeight: 10,
		barAnimDuration: 700,
		barImgWidth: -1,
		
		maxScrollTop: 0,
		maxScrollDelta: 0,
		numOfRows: 0,
		beginOffset: 0,
		endOffset: 4,
		
		prevFocusedNode: null,				
		
		postCreate: function() {
			this.animations = [];
			this.handlers = []
			this.barImgPath = this.imgBasePath + "gradient_chartbar.png",
			this.inherited("postCreate", arguments);
			if(this._autoLoad) this.load(this.url);
			this.handlers.push(dojo.connect(this.domNode, "onscroll", this, "onScroll"));
		},
		
		clear: function() {
			var rows = this.chartBodyContainer.rows;
			while (rows.length != 0) {
				this.chartBodyContainer.deleteRow(0);
			}
			this.animations = [];
			this.shadows = [];
		},
		
		reload: function(field) {
			this.clear();
			this.load(this.url, field);
		},
		
		load: function(url, field) {
			this.preLoad();
			var self = this;
			if (url == null) url = this.url;
			function load(response, ioArgs) {
				var json = null;
				try {
					json = dojo.fromJson(response);
				} catch (e) {
			        self.loadErrorHandler(response);
				}
				self.loadJson(json);
				self.postLoad();					
			}
			var param = {
				url: url,
				load: load,
				error: self.loadErrorHandler,
				timeout: 10000
			};
			dojo.xhrGet(param);
		},
		
		loadJson: function(json) {
			this.json = json;
			this.clear();
			this.render(json);
		},
		
		preLoad: function() {
		},
		
		postLoad: function() {
		},		
				
		render: function(json) {
			var items = json.items;
			if(items == null || items.length == 0) return;

			var size = dojo.contentBox(this.domNode);
			this.labelWidth = size.w / 2;
			this.barWidth = size.w - this.labelWidth;
			this.barImgWidth = this.barWidth - 20/*scroll width*/;
			
			this.numOfRows = Math.floor(size.h / this.rowHeight) + 1;
			this.beginOffset = 0;
			this.endOffset = Math.min(this.numOfRows, items.length);
			
			var dummyHeight = Math.max(items.length * this.rowHeight, 0);
			dojo.style(this.dummyDiv, "height", dummyHeight + "px");
			this.maxScrollTop = dummyHeight - size.h;
			this.maxScrollDelta = Math.max((items.length - this.numOfRows) * this.rowHeight, 0);
			
			var beginOffset = this.beginOffset;
			var endOffset = Math.min(this.endOffset, items.length);
			
			this.animations = [];
			this.shadows = [];
			for(var i=beginOffset; i<endOffset; i++) {
				var tr = dojo.doc.createElement("TR");
				dojo.style(tr, "height", this.rowHeight + "px");

				var labelCell = this.buildLabelCell(items[i]);
				tr.appendChild(labelCell);
				this.handlers.push(dojo.connect(labelCell, "onkeypress", this, "onCellKeyPressed"));
				this.handlers.push(dojo.connect(labelCell.firstChild, "onfocus", this, "onCellFocused"));

				var barCell = this.buildBarCell(items[i], json.maxCount);
				tr.appendChild(barCell);
				this.handlers.push(dojo.connect(barCell, "onkeypress", this, "onCellKeyPressed"));
				this.handlers.push(dojo.connect(barCell.firstChild, "onfocus", this, "onCellFocused"));
				
				this.chartBodyContainer.appendChild(tr);
			}
			var rows = this.chartBodyContainer.rows;
			var lastBarDiv = rows[rows.length-1].firstChild.nextSibling;

			if (this.animations.length != 0) dojo.fx.combine(this.animations).play();
			if (this.shadows.length != 0) {
				var self = this;
				setTimeout(function() {
					for (var i=0; i<self.shadows.length; i++) {
						self.shadows[i].resize();
					}
				}, 0);
			}
		},
		
		updateRange: function() {
			var items = this.json.items;
			if(items == null || items.length == 0) return;
			
			var beginOffset = Math.max(0, this.beginOffset);
			var endOffset = Math.min(this.endOffset, items.length);
			
			for(var i=beginOffset, trIndex=0; i<endOffset; i++) {
				var tr = this.chartBodyContainer.rows[trIndex];
				this.updateLabel(tr.cells[0], items[i]);
				this.updateBar(tr.cells[1], items[i], this.json.maxCount);
				trIndex++;
			}
		},
		
		buildLabelCell: function(item) {
			var cell = dojo.doc.createElement("TH");
			dojo.style(cell, "width", this.labelWidth + "px");
			cell.style.margin = "0px";
			dojo.style(cell, "overflow", "hidden");
			dojo.style(cell, "whiteSpace", "nowrap");
			this.renderLabel(cell, item);			
			return cell;
		},
		
		renderLabel: function(cell, item) {
			var label = this._getTruncatedLabel(item, this.labelWidth);
			var tooltip = item.itemLabel + " : (" + item.count + ")";
			if (item.isSearchable) {
				cell.innerHTML = "<a href='javascript:;' tabindex='0' style='font-style:italic;font-size:8pt;'></a>";				
				cell.firstChild.title = tooltip;
				cell.firstChild.appendChild(dojo.doc.createTextNode(label));
				this.handlers.push(dojo.connect(cell.firstChild, "onclick", this, "onLabelClicked"));
			} else {
				cell.innerHTML = "<span tabindex='0' style='font-style:italic;font-size:8pt;'></span>";
				cell.firstChild.appendChild(dojo.doc.createTextNode(label));
				cell.firstChild.title = tooltip;
			}
		},
		
		updateLabel: function(cell, item) {
			if (item == null) {
				cell.firstChild.innerHTML = "";
			} else {
				var label = this._getTruncatedLabel(item, this.labelWidth);
				var tooltip = item.itemLabel + " : (" + item.count + ")";
				cell.firstChild.innerHTML = label;
				cell.firstChild.title = tooltip;
			}
		},
		
		buildBarCell: function(item, maxCount) {
			var cell = dojo.doc.createElement("TD");
			dojo.style(cell, "width", this.barWidth);
			this.renderBar(cell, item, maxCount);	        
			return cell;
		},
		
		renderBar: function(cell, item, maxCount) {
			var barSize = { w:this.barImgWidth * (item.count/maxCount), h:this.barHeight};
			var tooltip = item.itemLabel + " : (" + item.count + ")";
			cell.innerHTML = 
				"<div tabindex='0' style='margin-bottom:5px;width:" + barSize.w + "px;height:" + barSize.h + "px;'>" +
					"<img src='" + this.barImgPath + "' alt='" + tooltip + "' title='" + tooltip + "'" +
						" width='100%' height='" + (barSize.h) + "px'/>" +
				"</div>";
			var barDiv = cell.firstChild;
			barDiv.item = item;
			barDiv.barImg = cell.firstChild.firstChild; // Bar div has pointer to Bar img
			if (item.isSearchable) {
				this.handlers.push(dojo.connect(barDiv, "onclick", this, "onBarChartClicked"));
				this.handlers.push(dojo.connect(barDiv, "onkeypress", this, "onBarChartClicked"));
				this.handlers.push(dojo.connect(barDiv, "onmouseover", this, "onChartBarMouseOver"));
				this.handlers.push(dojo.connect(barDiv, "onmouseout", this, "onChartBarMouseOut"));
			}
			if (this.needAnimation()) {
		        this.animations.push(this.buildBarAnimation(barDiv, 0, barSize.w));
			} else {
				dojo.style(barDiv, "width", barSize.w + "px");
				if (barDiv.shadow == null) {
					var shadow = new dojox.fx.Shadow({ node: barDiv});
					barDiv.shadow = shadow;
					shadow.startup();
				}
				this.shadows.push(shadow);
			}
		},
		
		barSelected: function(item) {
			// override
		},
		
		onScroll: function(evt) {
			var scrollTop = Math.abs(parseInt(this.domNode.scrollTop));			
			var scrollDelta = scrollTop % this.rowHeight;
			var rows = Math.floor(scrollTop / this.rowHeight); 
			
			if (scrollTop == this.maxScrollTop) {
				this.endOffset = this.json.items.length;		
				this.beginOffset = this.endOffset - this.numOfRows;
				dojo.style(this.chartContainer, "top", this.maxScrollDelta + "px");				
			} else if (scrollTop == 0) {
				this.beginOffset = 0;
				this.endOffset = this.beginOffset + this.numOfRows;		
				dojo.style(this.chartContainer, "top", 0 + "px");							
			} else {
				this.beginOffset = rows;
				this.endOffset = this.beginOffset + this.numOfRows;		
				dojo.style(this.chartContainer, "top", scrollTop - scrollDelta + "px");
			}			
			this.updateRange();
		},
		
		onCellFocused: function(evt) {
			var targetCell = evt.currentTarget.parentNode;
			
			var rows = this.chartBodyContainer.rows;
			var firstLabelCell = rows[0].firstChild;
			var firstBarCell = firstLabelCell.nextSibling;
			var lastLabelCell = rows[rows.length-1].firstChild;
			var lastBarCell = lastLabelCell.nextSibling;
			
			if (targetCell == firstLabelCell && this.prevFocusedNode != firstBarCell && this.beginOffset != 0) {
				this.domNode.scrollTop = 0;
				this.onScroll();
			} else if (targetCell == lastBarCell && this.prevFocusedNode != lastLabelCell && this.endOffset < this.json.items.length) {
				this.domNode.scrollTop = this.maxScrollTop;
				this.onScroll();
			}
			this.prevFocusedNode = targetCell;
		},
		
		onCellKeyPressed: function(evt) {
			if(!(evt.charOrCode && evt.charOrCode === dojo.keys.TAB)) return;
			
			var rows = this.chartBodyContainer.rows;
			var target = evt.currentTarget;
			var firstLabelCell = rows[0].firstChild;
			var firstBarCell = firstLabelCell.nextSibling;
			var lastLabelCell = rows[rows.length-1].firstChild;
			var lastBarCell = lastLabelCell.nextSibling;
			
			if (target != firstLabelCell && target != lastBarCell) return;
			
			if (target == lastBarCell) {
				if (!evt.shiftKey && this.endOffset < this.json.items.length) {
					// go to next cell					
					var scrollTop = Math.abs(parseInt(this.domNode.scrollTop)) + this.rowHeight;
					scrollTop = Math.min(scrollTop, this.maxScrollTop);					
					this.domNode.scrollTop = scrollTop;
					lastLabelCell.firstChild.focus();
					this.onScroll();
					dojo.stopEvent(evt);
				}
			} else {
				if (evt.shiftKey && this.numOfRows < this.endOffset) {
					// go to previous cell
					var scrollTop = Math.abs(parseInt(this.domNode.scrollTop)) - this.rowHeight;
					scrollTop = Math.max(scrollTop, 0);					
					this.domNode.scrollTop = scrollTop;
					firstBarCell.firstChild.focus();
					this.onScroll();
					dojo.stopEvent(evt);					
				}
			}
		},
		
		onLabelClicked: function(evt) {
			if (evt.type != "click" && evt.keyCode != dojo.keys.ENTER) return;
			this.barSelected(evt.currentTarget.parentNode.nextSibling.firstChild.item);
		},
		
		onBarChartClicked: function(evt) {
			if (evt.type != "click" && evt.keyCode != dojo.keys.ENTER) return;
			this.barSelected(evt.currentTarget.item);
		},
		
		onChartBarMouseOver: function(evt) {
			var img = evt.currentTarget.barImg;
			img.style.border = "1px solid navy";
		},
		
		onChartBarMouseOut: function(evt) {
			var img = evt.currentTarget.barImg;
			img.style.border = "none";
		},
		
		needAnimation: function() {
			if (this.resizing) return false;
			var node = this.domNode;
			while (node != null) {
				if (node.style != null && (node.style.display == "none" || node.style.visibility == "hidden"))
					return false;
				node = node.parentNode;
			}
			return true;
		},
		
		updateBar: function(cell, item, maxCount) {
			var barDiv = cell.firstChild;
			var barImg = barDiv.barImg;
			if (item == null) {
				dojo.style(barDiv, "width", 0);
				barDiv.shadow.setDisabled(true);
				barImg.alt = img.title = "";
			} else {
				var width = this.barImgWidth * (item.count/maxCount);
				dojo.style(barDiv, "width", width + "px");
				barDiv.shadow.setDisabled(false);
				barDiv.shadow.resize();
				
				var tooltip = item.itemLabel + " : (" + item.count + ")";				
				barImg.alt = barImg.title = tooltip;
			}
		},
		
		buildBarAnimation: function(target, start, end) {
			var shadow = new dojox.fx.Shadow({ node: target});
			target.shadow = shadow;
			shadow.startup();				
			var animation = dojo.animateProperty(
		    	{
		    	    node: target,
		    	    duration: this.barAnimDuration,
		    	    easing: function(n) {
		    	    	if (dojo.isIE) {
		    	    	} else {
			    	    	shadow.resize();
			    	   }
						return dojo._defaultEasing(n);
		    	    },
		    	    properties: {
		    	    	width: {start: start, end: end}
		            },
		            onEnd: function(n) {
			    	    	shadow.resize();
		            }
		        });
		    return animation;
		},
		
		_getTruncatedLabel: function(item, width) {
			var label = item.itemLabel + ""/*hack: object2string*/; 
			var count = " (" + item.count + ")";
			if (this._getStringExtent(label + count) < width) {
				return label + count;
			} else {
				var ellipse = "... (" + item.count + ")";
				var labelWidth = width - this._getStringExtent(ellipse);
				if (labelWidth > 0) { 	
					for (var i=0; i<label.length; i++) {
						var s = label.slice(0, i);
						if (labelWidth < this._getStringExtent(s) && i > 0) {
							return label.slice(0, i-1) + ellipse;
						}
					}				
				}
				return ellipse;
			}
		},
		
		_getStringExtent: function(str) {
			this.hiddenSpan.innerHTML = str;
			var size = this.hiddenSpan.offsetWidth;
			this.hiddenSpan.innerHTML = "";
			return size;
		},
		
		loadErrorHandler: function() {
		}
	}
);