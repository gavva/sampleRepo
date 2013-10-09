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
dependencies = {
	layers: [
		{
			name: "dojo.js",
			dependencies: [
				// Dojo parser
				"dojo.parser",
				"dojo.data.ItemFileReadStore",
				"dojo.data.ItemFileWriteStore",
				"dojo.io.iframe",
				
				// Dijit widgets		
				"dijit.InlineEditBox",
				"dijit.Toolbar",
				"dijit.Dialog",
				"dijit.Menu",
				"dijit.TitlePane",
				"dijit.layout.ContentPane",
				"dijit.layout.TabContainer",
		       	"dijit.layout.TabContainer",
		       	"dijit.layout.BorderContainer",
		       	"dijit.layout.SplitContainer",  	
				"dijit.layout.TabContainer",
				"dijit.Toolbar",
				"dijit.form.Form",
				"dijit.form.DateTextBox",
		       	"dijit.form.Button",
				"dijit.form.Textarea",
				
				// Dojox
				"dojox.widget.FisheyeLite",
				"dojox.form.DropDownSelect",		
				
				// Custom widgets
				"widgets.customDialog",
				"widgets.Banner",
				"widgets.Toolbar",
				"widgets.InlineEditBox",
				"widgets.DateTextBox",
				"widgets.Button", 
				"widgets.TabContainer",
				"widgets.TabWindow",
				"widgets.QueryTabWindow",
				"widgets.SearchTabWindow",
				"widgets.ESFacetTree",
				"widgets.HorizontalBarChart",
				"widgets.DynamicFieldChart",
				"widgets.DynamicFacetChart",
				"widgets.FileSizeChart",
				"widgets.SearchPane",
				"widgets.BasicSearchPane",
				"widgets.AdvancedSearchPane",
				"widgets.ESBorderContainer",
				"widgets.LayoutPreference",
				"widgets.QueryText",
				"widgets.SearchManager",
				"widgets.SearchOptions",
				"widgets.PreferencesDialog",
				"widgets.MyProfileDialog",
				"widgets.MyProfileContent",
				"widgets.SlideTabContainer",
				"widgets.SlideTabContent",
				"widgets.MultiAccordionContainer",
				"widgets.FacetItems",
				"widgets.ResultToolbar",
				"widgets.ResultBottomBar",
				"widgets.ResultsBorderContainer",
				"widgets.ResultsHeader",
				"widgets.ResultsBody",
				"widgets.ResultsOptions",
				"widgets.ResultsColumns",				
				"widgets.FacetOptions",
				"widgets.DocumentLabelTree",
				"widgets.TopResultAnalysisOptions",
				"widgets.ESTitlePane",
				"widgets.CategoryTreeTitlePane",
				"widgets.SaveSearch",
				"widgets.ExportSearch",
				"widgets.SavedSearch",
				"widgets.PreviewContent",
				"widgets.customize.Popup",
				"widgets.customize.Dialog",
				"widgets.customize.ScreenSettings",
				"widgets.customize.ServerSettings",
				"widgets.customize.QueryOptions",
				"widgets.customize.Results",
				"widgets.customize.Images",				
				"widgets.customize.TopResultCharts",
				"widgets.customize.FacetCharts",
				"widgets.customize.TabWindow",
				"widgets.layout.TabWindow",
				"widgets.layout.DocumentsPane",
				"widgets.TypeAhead",
				"widgets.FacetTypeAhead",
				
				// Text Analyticx Only
				"widgets.QueryTree",
				"widgets.DeepInspector",
				"widgets.CategoryTree",
				"widgets.CognosIntegration",
				"widgets.analytics.CategoryView",
				"widgets.analytics.TimeSeriesView",
				"widgets.analytics.TopicView",
				"widgets.analytics.DeltaView",
				"widgets.analytics.TwoDMapView",
				"widgets.analytics.PreviewContent",
				"widgets.analytics.FacetsOption",
				"widgets.analytics.TimeSeriesOption",
				"widgets.analytics.DeviationsOption",
				"widgets.analytics.TrendsOption",
				"widgets.analytics.FacetPairsOption",
				"widgets.customize.Facets",
				"widgets.customize.TimeSeries",
				"widgets.customize.Deviations",
				"widgets.customize.Trends",
				"widgets.customize.FacetPairs"
			]
	}
	],
	prefixes: [
		["dijit", "../dijit" ],
		["dojox", "../dojox" ],
		["widgets", "../../../WebContent/js/widgets"]
	]
}
