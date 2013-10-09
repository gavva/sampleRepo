<!-- *********************** ES COPYRIGHT START  *********************************
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
//*********************** ES COPYRIGHT END  *********************************** -->
<%
response.setContentType("application/x-javascript");
response.setCharacterEncoding("UTF-8");
%>
<%@ taglib uri="/WEB-INF/tld/enterpriseSearch.tld" prefix="es" %>

EDR.portlet.Layout = {
	//dialogs over than 500px width
	toSmallDialogs: [EDR.prefix+"alert-dialog", EDR.prefix+"error-dialog", EDR.prefix+"preference", EDR.prefix+"multiSelectDlg", EDR.prefix+"myProfileDlg", EDR.prefix+"facetDialog", EDR.prefix+"previewDialog", EDR.prefix+"about-dialog", EDR.prefix+"documentLabelDialog"],
	
	toSmallLayout: function(){
		//adjust query area
		var searchPane = <es:dijit />.byId(EDR.prefix+"searchPane");
		searchPane.queryArea.style.minWidth= "580px";
		searchPane.middleSpace.style.width = "390px";
		searchPane.leftSpace.style.display = "none";
		searchPane.helpLink.style.display = "none";
		searchPane.domNode.style.marginLeft = "10px";
		var header = <es:dojo />.byId(EDR.prefix+"header");
		header.style.width = "560px";
		
		//adjuct banner
		<es:dijit />.byId(EDR.prefix+"bannerId").productNameNode.style.display = "none";
		
		//advanced search tab
		var advSearchPane = <es:dijit />.byId(EDR.prefix+"advancedSearchPane");
		advSearchPane.domNode.style.width="250px";
		
		//saved search tab
		var savedSearchTab = <es:dijit />.byId(EDR.prefix+"savedSearch");
		savedSearchTab.contentWidth = 240;
		savedSearchTab.itemLabelWidth = 200;
		savedSearchTab.domNode.style.width="240px";
		
		//adjust tab width
		var slideTabContainer = <es:dijit />.byId(EDR.prefix+"slideTabContainer");
		slideTabContainer.defaultTabWidth = 120;
		slideTabContainer.reduceWidth = 50;
		var tabs = slideTabContainer.getChildren();
		<es:dojo />.forEach(tabs, function(tab) {
			tab.tabWidth = 120;
			tab.contentWidth = 270;
			tab.containerNode.style.overflow = "auto";
			tab.containerNode.style.position = "relative";
			tab.resizeTab();
		});
		
		//make small dialogs
		var dlgLength = this.toSmallDialogs.length;
		for(var i=0; i<dlgLength; i++){
			var dialogWidget = <es:dijit />.byId(this.toSmallDialogs[i]);
			dialogWidget.setWidth(500);
			if(dialogWidget.containerNode){
				var dialogNode = <es:dojo />.query("div", dialogWidget.containerNode)[0];
				<es:dojo />.marginBox(dialogNode, {w:500});
				dialogNode.style.overflow = "auto";
			}
		}
		
		//adjust myProfile dialog
		<es:dijit />.byId(EDR.prefix+"myProfileDlg").domNode.style.width = "500px";
		
		//adjust preference dialog
		var preference = <es:dijit />.byId(EDR.prefix+"searchPanePreferenceTab");
		preference.domNode.style.width = "490px";
		preference.domNode.parentNode.style.overflow = "hidden";
		
		//adjust preview dialog
		<es:dijit />.byId(EDR.prefix+"previewContainer").domNode.style.width = "480px";
		<es:dijit />.byId(EDR.prefix+"previewContent").domNode.style.width = "480px";

		//adjust toolbar width
		var resultToolbar = <es:dijit />.byId(EDR.prefix+"horizontalSearchPanes").resultToolbar;
		resultToolbar.containerNode.style.overflow = "auto";
		resultToolbar.toolbarButtonNode.style.whiteSpace = "nowrap";
		resultToolbar.toolbarButtonNode.style.width = "100%";
		resultToolbar.resultCountDiv.style.width = "150px";
		var resultsFilterBy = resultToolbar.resultsFilterByDiv;
		resultsFilterBy.style.width = "200px";
		resultsFilterBy.parentNode.style.width = "80px";
		resultToolbar.resultsFilterByLabel.style.whiteSpace = "nowrap";
		var resultsPerPage = resultToolbar.resultsPerPageDiv;		
		resultsPerPage.style.width = "200px";
		resultsPerPage.parentNode.style.width = "80px";
		resultToolbar.resultsPerPageLabel.style.whiteSpace = "nowrap";
		if(<es:dojo />.isIE <= 7){
			resultToolbar.containerNode.style.height = "65px";
		}

		//override in advanced search tab
		advSearchPane.toggleSearchOptions = function(evt) {
			if (this.showOption) {
				this.showOption = false;
				<es:dojo />.style(this.leftPane, "width","250px");
				<es:dojo />.style(this.leftPane.parentNode, "width","250px");
				this.advButton.attr("label", "<span style='position:relative;top:-4px;'>" + this.show_options +
					(this.isLeftToRight() ?
						"</span><img src='"+this.imageBaseDir+"move-left23.png' alt='' style='position:relative;top:-1px;'/>" :
						"</span><img src='"+this.imageBaseDir+"move-right23.png' alt='' style='position:relative;top:-1px;'/>")
				);
				<es:dojo />.style(this.rightPane, "display", "none");
			} else {
				this.showOption = true;
				<es:dojo />.style(this.leftPane, "width", "250px");
				<es:dojo />.style(this.leftPane.parentNode, "width","580px");
				this.advButton.attr("label", "<span style='position:relative;top:-4px;'>" + this.hide_options + 
					(this.isLeftToRight() ?
						"</span><img src='"+this.imageBaseDir+"move-right23.png' alt='' style='position:relative;top:-1px;'/>" :
						"</span><img src='"+this.imageBaseDir+"move-left23.png' alt='' style='position:relative;top:-1px;'/>")
				);
				<es:dojo />.style(this.rightPane, "display", "block");
				<es:dijit />.byId(EDR.prefix+"advSearchOptions").domNode.focus();
			}
			this.slideTabContent.fitToContent(true);
		};
	}
};