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
dojo.provide("widgets.QueryText");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");

dojo.declare(
	"widgets.QueryText", [dijit._Widget, dijit._Templated],
	{		
		templatePath: dojo.moduleUrl("widgets", "templates/QueryText.html"),
		handlers: [],
		
		imgBasePath: EDR.config.imageBaseDir,
		url: "",
				
		postCreate: function() {
			this.inherited("postCreate", arguments);
			this.setFullQuery("");
		},
		
		load: function() {
			this.preLoad();
			
			var self = this;
			var param = {		
		        url: self.url,
		        sync: false,
		        load: function(response, ioArgs) {
					var json = null;
					try {
						json = dojo.fromJson(response);
					} catch (e) {
			        	self.loadErrorHandler(response);
					}
					self.clear();
					self.loadSearchCriteria(json, self.domNode);	
					self.postLoad();					
		        },
		        error: function(response, ioArgs) {
		        	self.loadErrorHandler(response);
		        }
			};		
			dojo.xhrGet(param);
		},
		
		preLoad: function() {
		},
		
		postLoad: function() {
		},
		
		getFullQuery: function() {
			return this.textArea.value;
		},
		
		setFullQuery: function(fullQuery) {
			this.textArea.value = fullQuery;
		},
		
		submit: function() {
			dojo.byId(EDR.prefix+"keywords").value = this.getFullQuery();
			EDR.search.Form.submit();
		},
		
		loadSearchCriteria: function(json) {
			if (json == null) return;
			this.setFullQuery(json.fullQuery);
		},
		
		loadErrorHandler: function(response) {
			//console.debug(response);
		},
		
		clear: function() {
			this.setFullQuery("");
			dojo.forEach(this.handlers, dojo.disconnect);
		},
		
		destroy: function() {
			this.clear();
			this.inherited("destroy", arguments);
		}
	}
);