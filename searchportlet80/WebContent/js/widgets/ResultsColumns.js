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
dojo.provide("widgets.ResultsColumns");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");

dojo.require("widgets.Button");

dojo.declare(
"widgets.ResultsColumns",
[dijit._Widget, dijit._Templated],
{
	widgetsInTemplate: true,
	
	_checkedIconPath: dojo.moduleUrl("widgets", "templates/images/check_kiso_sel13.png"),
	
	_uncheckedIconPath: dojo.moduleUrl("widgets", "templates/images/check_kiso_unsel13.png"),
	
	templatePath: dojo.moduleUrl("widgets", "templates/ResultsColumns.html"),
	
	imgBasePath: EDR.config.imageBaseDir,
	
	testData: "",
	
	_rowCount: 0,
	_selectedRow: 0,
	_focusedRow: 0,
	
	label_intro2: EDR.isAuthorized ? EDR.messages.search_options_intro_authorized : EDR.messages.search_options_intro_unauthorized,
	messages_preferences_resultsColumns_show: EDR.messages.preferences_resultsColumns_show,
	messages_preferences_resultsColumns_moveToFirst: EDR.messages.preferences_resultsColumns_moveToFirst,
	messages_preferences_resultsColumns_moveBefore: EDR.messages.preferences_resultsColumns_moveBefore,
	messages_preferences_resultsColumns_moveAfter: EDR.messages.preferences_resultsColumns_moveAfter,
	messages_preferences_resultsColumns_moveToLast: EDR.messages.preferences_resultsColumns_moveToLast,
	messages_preferences_resultsColumns_header1: EDR.messages.preferences_resultsColumns_header1,
	messages_preferences_resultsColumns_header2: EDR.messages.preferences_resultsColumns_header2,
	
	postCreate: function() {
/*		if(this.testData) {
			this._renderTestdata();
		}*/
//		dojo.subscribe("postLoad", this, "applyChanges");
	},
	
	startup: function() {
		this.setColumnsValuesMoveTop.adjustButtonWidth();
		this.setColumnsValuesMoveBottom.adjustButtonWidth();
		this.setColumnsValuesMoveUp.adjustButtonWidth();
		this.setColumnsValuesMoveDown.adjustButtonWidth();
	},
	
	getFormValues: function() {
		var values={};
		var trs = dojo.query("tr",this.columnsTableBody);
		var str="";
		var length = trs.length;
		for(var i=0; i<length; i++){
			if(dojo.attr(trs[i],"checked")==false) {
				str += "$";
			}
			str += dojo.attr(trs[i],"columnName");
			if(i<length-1)
				str += ",";
		}
		values["resultColumns"]=str;
		return values;
	},
	
	validate: function(params) {
			var errors = "";
			if (errors != "") {
				EDR.util.alert(errors);
				return false;
			}			
			return true;
	},
	
/*	_renderTestdata: function() {
		var args = {
				url: this.testData,
				handleAs: "json",
				load: dojo.hitch(this, "_onTestdataLoaded")
		};
		dojo.xhrGet(args);
	},*/
	
/*	_onTestdataLoaded: function(data) {
		this._initColumnsTable(data);
	},*/
	
	_initColumnsTable: function(data) {
		var columns = data.columns;
		this._rowCount = columns.length;
		
		for(var i=0; i<columns.length; i++) {
			var column = columns[i];
			var name = column.name;
			var id = "column_" + column.name;
			var show = column.show;
			var oddEven = (i % 2 == 0 ? "even" : "odd");
			var originalClass = oddEven;
			
			var args;
			if(i==0) {
				args = { className: "even selected focused" };
			} else {
				args = { className: oddEven};
			}
			args.columnName = name;
			args.checked = true;
			args.onclick = dojo.hitch(this, "_onRowClick");
			var tr = dojo.create("tr", args, this.columnsTableBody);
			var td = dojo.create("td", {className: "columnCheckbox"}, tr);
			var img = dojo.create("img", {style: "cursor: pointer;", id:EDR.prefix+"setSearchColumns-"+i, tabindex:0, onkeypress:dojo.hitch(this, "_onCheckButtonKeyPress") ,onclick: dojo.hitch(this, "_onCheckButtonClick")}, td);
			if(column.show) {
				img.src = this._checkedIconPath;
				tr.checked = true;
			} else {
				img.src = this._uncheckedIconPath;
				tr.checked = false;
			}
			
			td = dojo.create("td", {className: "columnName"}, tr);
			var labelText = EDR.messages["columns_"+column.name] ? EDR.messages["columns_"+column.name] : column.name;
			var label = dojo.create("a", {href: "javascript:;", innerHTML: labelText}, td);
		}
	},
	
	_onRowClick: function(evt) {
		var tbody = this.columnsTableBody;
		var lastFocused = tbody.rows[this._focusedRow];
		var lastSelected = tbody.rows[this._selectedRow];
		
		dojo.removeClass(lastFocused, "focused");
		dojo.removeClass(lastSelected, "selected");
		
		function getEventTargetRow(node) {
			if(node.tagName == "TR") {
				return node;	
			} else {
				return getEventTargetRow(node.parentNode);
			}
		}
		
		var row = getEventTargetRow(evt.target);

		this._selectedRow = row.rowIndex;
		this._focusedRow = row.rowIndex;
		dojo.addClass(row, "selected");		
		dojo.addClass(row, "focused");
		
//		this._updateButtonState();		
		this._updateButtonState(this._isThum(row));
	},
	
	_updateButtonState: function(_isThum) {
		if(_isThum){
			this.setColumnsValuesMoveUp.setDisabled(true);
			this.setColumnsValuesMoveDown.setDisabled(true);
			if(this._focusedRow == 0) {
				this.setColumnsValuesMoveTop.setDisabled(true);
				this.setColumnsValuesMoveBottom.setDisabled(false);				
			}else{
				this.setColumnsValuesMoveTop.setDisabled(false);	
				this.setColumnsValuesMoveBottom.setDisabled(true);							
			}
		}else{
/*			if(this._focusedRow != 0) {
				this.setColumnsValuesMoveTop.setDisabled(false);
				this.setColumnsValuesMoveUp.setDisabled(false);
			}
			if(this._focusedRow != this._rowCount - 1){
				this.setColumnsValuesMoveDown.setDisabled(false);
				this.setColumnsValuesMoveBottom.setDisabled(false);			
			}
			if(this._focusedRow == 0) {
				this.setColumnsValuesMoveTop.setDisabled(true);
				this.setColumnsValuesMoveUp.setDisabled(true);
			}
			if (this._focusedRow == this._rowCount - 1) {
				this.setColumnsValuesMoveDown.setDisabled(true);
				this.setColumnsValuesMoveBottom.setDisabled(true);
			}*/
			if(this._checkThumRowFirst()){
				this.setColumnsValuesMoveTop.setDisabled(true);
				if(this._focusedRow==1){
					this.setColumnsValuesMoveUp.setDisabled(true);
					this.setColumnsValuesMoveDown.setDisabled(false);
					this.setColumnsValuesMoveBottom.setDisabled(false);					
				}
				else if(this._focusedRow==this._rowCount - 1){
					this.setColumnsValuesMoveUp.setDisabled(false);
					this.setColumnsValuesMoveDown.setDisabled(true);
					this.setColumnsValuesMoveBottom.setDisabled(true);					
				}
				else{
					this.setColumnsValuesMoveUp.setDisabled(false);
					this.setColumnsValuesMoveDown.setDisabled(false);
					this.setColumnsValuesMoveBottom.setDisabled(false);						
				}					
			}else{
				this.setColumnsValuesMoveBottom.setDisabled(true);
				if(this._focusedRow==this._rowCount - 2){
					this.setColumnsValuesMoveTop.setDisabled(false);
					this.setColumnsValuesMoveUp.setDisabled(false);
					this.setColumnsValuesMoveDown.setDisabled(true);
				}
				else if(this._focusedRow==0){
					this.setColumnsValuesMoveTop.setDisabled(true);
					this.setColumnsValuesMoveUp.setDisabled(true);
					this.setColumnsValuesMoveDown.setDisabled(false);
				}else{
					this.setColumnsValuesMoveTop.setDisabled(false);
					this.setColumnsValuesMoveUp.setDisabled(false);
					this.setColumnsValuesMoveDown.setDisabled(false);
				}
			}
		}		
		this._updateRowState();
	},
	
	_updateRowState: function() {
		var tbody = this.columnsTableBody;
		for(var i=0; i<tbody.rows.length; i++) {
			var row = tbody.rows[i];
			
			if(i % 2 == 0) {
				if(dojo.hasClass(row, "odd")) {
					dojo.removeClass(row, "odd");
					dojo.addClass(row, "even");
				}
			} else {
				if(dojo.hasClass(row, "even")) {
					dojo.removeClass(row, "even");
					dojo.addClass(row, "odd");					
				}
			}
		}
	},
	
	onMoveUpClick: function(evt) {
		var tbody = this.columnsTableBody;
		
		var focusedRow = tbody.rows[this._focusedRow];
		if(this._focusedRow != 0) {
			dojo.place(focusedRow, tbody.rows[this._focusedRow - 1], "before");
			--this._focusedRow;
		}
		this._updateButtonState(this._isThum(focusedRow));
		
	},
	
	onMoveDownClick: function(evt) {
		var tbody = this.columnsTableBody;
		
		var focusedRow = tbody.rows[this._focusedRow];
		if(this._focusedRow != this._rowCount - 1) {
			dojo.place(focusedRow, tbody.rows[this._focusedRow + 1], "after");
			++this._focusedRow;
		}
		this._updateButtonState(this._isThum(focusedRow));
	},
	
	onMoveTopClick: function(evt) {
		var tbody = this.columnsTableBody;
		
		var focusedRow = tbody.rows[this._focusedRow];
		if(this._focusedRow != 0) {
			dojo.place(focusedRow, tbody.rows[0], "before");
			this._focusedRow = 0;
		}
		this._updateButtonState(this._isThum(focusedRow));		
	},
	
	onMoveBottomClick: function(evt) {
		var tbody = this.columnsTableBody;
		
		var focusedRow = tbody.rows[this._focusedRow];
		if(this._focusedRow != this._rowCount - 1){
			dojo.place(focusedRow, tbody.rows[this._rowCount - 1], "after");
			this._focusedRow = this._rowCount - 1;
		}
		this._updateButtonState(this._isThum(focusedRow));			
	},
	
	checkButtonExecute: function(img){
		if(this.validate()){
			var tr = img.parentNode.parentNode;
			if(tr.checked) {
				if(this._checkSomeColumn()){
					img.src = this._uncheckedIconPath;
					tr.checked = false;
				}
			} else {
				img.src = this._checkedIconPath;
				tr.checked = true;
			}
		}		
	},
	
	_onCheckButtonClick: function(evt) {
			this.checkButtonExecute(evt.target);
	},
	
	_onCheckButtonKeyPress: function(evt){
		if((evt.keyCode == dojo.keys.ENTER)||(evt.charCode == dojo.keys.SPACE)){
			this.checkButtonExecute(evt.target);
		}		
	},
	
	_isThum: function(tr){
		if((dojo.attr(tr,"columnName"))=="thumbnail")
			return true;
		return false;
	},
	
	_checkThumRowFirst: function(){
		var tbody = this.columnsTableBody;
		if(tbody.rows[0]==dojo.query("tr[columnName='thumbnail']",tbody)[0])
			return true;
		else
			return false;
	},
	
	_checkSomeColumn: function(){
		var trs = dojo.query("tr",this.columnsTableBody);
		var checkSomeArray = dojo.filter(trs, function(tr) {
			return tr.checked == true;
		});
		if (checkSomeArray.length==1) {
			var errors = "Please check at least a column in the Result Columns Tab.";
			EDR.util.alert(errors);
			return false;
		}
		return true;
	},
	
	buildPreferences: function(preferencesJson){
		this.clear();
		if (preferencesJson == null) preferencesJson = this._getNullResultsPreferences();
		this._initColumnsTable(preferencesJson);
	},
	
	//after save dialog
	afterSaveApplyChanges: function(){
		var tbody = this.columnsTableBody;
		var trs = tbody.rows;
		var columnDefs = [];
		for(var i=0; i<trs.length; i++) {
			if(trs[i].checked) {
				columnDefs.push(dojo.attr(trs[i], "columnName"));	
			}
		}
		var manager = dijit.byId(EDR.prefix+"searchManager");
		if(manager.getSearchResult()!=null){
			manager.setColumnDefs(columnDefs);
			dojo.publish("headerColumnsChanged");
		}
	},
	
	//after search
	applyChanges: function() {
		var manager = dijit.byId(EDR.prefix+"searchManager");
		var results = manager.getSearchResult();
		if(results!=null){
			var results = manager.getSearchResult();
			if(EDR.customizing) {
				var customizerResults = dijit.byId(EDR.prefix+"customizerResults");
				var columnDefsStr =  customizerResults.resultsColumns.value;
				if(columnDefsStr != null) {
					var columnDefs = columnDefsStr.split(",");
					var resultColumnStrArray = dojo.filter(columnDefs, function(elem){ return !(elem.length == 0 || elem[0] == '$'); });
				} else {
					var resultColumnStrArray = this.getResultColumnStringFromJson(results.resultColumns.columns);
				}
			} else {
				var resultColumnStrArray = this.getResultColumnStringFromJson(results.resultColumns.columns);
			}
			manager.setColumnDefs(resultColumnStrArray);
			dojo.publish("headerColumnsChanged");
		}
	},
	
	getResultColumnStringFromJson: function(columnObjArray){
		var length = columnObjArray.length;
		var columnStrArray = [];
		for(var i = 0 ; i<length ; i++){
			if(columnObjArray[i].show==true)
				columnStrArray.push(columnObjArray[i].name);
		}
		return columnStrArray;
	},
	
	clear: function() {
		dojo.empty(this.columnsTableBody);
	},
	
	_getNullResultsPreferences: function() {
		return {
			columns:[{name:"thumbnail",show:true},{name:"filetype",show:true},{name:"relevance",show:true},{name:"date",show:false},{name:"title",show:true}]
		};
	},
	__dummy__ :''
});