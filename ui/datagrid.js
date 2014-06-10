/*!
 * jQuery UI Spinner @VERSION
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/spinner/
 */
(function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define([
			"jquery",
			"./core",
			"./widget"
		], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
}(function( $ ) {

return $.widget( "ui.datagrid", {
	version: "@VERSION",
	widgetEventPrefix: "datagrid",
	instance: {
		_table				: null,
		_div				: null,
		_tbody				: null,
		_tfoot				: null,
		_thead				: null,
		_providerPointer	: 0,
		_headerTable		: null,
		_headerDiv			: null,
		_headerDivInternal	: null,
		_footerDiv			: null,
		_footerFeedBackDiv	: null,
		_height				: 100,
		_isPercentHeight	: true,
		_lastSort			: null,
		_errors				: new Array(),
		_sortTickDirection	: null,
		_divComponent		: null,
		_lastColumnsWidth	: new Array(),
		_width				: "100%",
		_height				: "100%",
		_expansive			: true, //future
		_showHeader			: true, //future
		_showFooter			: true, //future
	},
	//getFooter: function() {return this.instance._footerDiv}, //future	
	options: {
		dataProvider		: null,
		columns				: null,
		pageSize			: null,		
		onclick				: null,
		id					: null,
		enableSort			: false,
		enablePages			: false,
		//not merged because its not working well yet ------
		enableFilter		: false, //future              |
		enableTools			: false, //future              |
		showLoadedFeedback	: true, //future               |
		//--------------------------------------------------
	},
	_create: function() {
		var _this = this;
	
		this._setIntervalValues();
		this._validateTable();
	
		this.instance._table = this._getTable();	
			
		this.instance._headerTable = this._getTable();		
		this.instance.id = this.instance.id ? this.instance.id : ("ID_TABLE_"+this._getRandomNumber(0,999999));
		if(this.instance.id) {
			this.instance._table.id = this.instance.id;
		}
		
		var __columns = new Array();
		for(var i=0; i<this.options.columns.length; i++) {
			if(this.options.columns[i].visible != false) {
				__columns.push(this.options.columns[i]);
			}
		}
		
		this.options.columns = __columns;
		this.instance._tbody = this._getBody();
		this.instance._tfoot = this._getFoot();
		this.instance._thead = this._getHead();
		this.instance._tbody.appendChild(this._getTR());
		this.instance._tfoot.appendChild(this._getTR());
		this.instance._thead.appendChild(this._getTR(undefined, true));
		this.instance._table.appendChild(this.instance._tbody);
		
		if(this.instance._showHeader == true) {
			for(var i=0; i<this.options.columns.length; i++) {
				var _td = this._getTD(true, this.options.columns[i].width);
				if(i == 0) {
					$(_td).css("border-left", "0px solid");
				} else if(i == this.options.columns.length-1) {
					_td.className += " datagrid-header-last-column";
				}
				this.instance._thead.getElementsByTagName("TR")[0].appendChild(_td);
				this.instance._thead.getElementsByTagName("TR")[0].getElementsByTagName("TD")[i].innerHTML = "<nobr style='font-size:12px'>"+this.options.columns[i].label+"<nobr>";

			}
		}
		
		this.instance._providerPointer = 0;
		this.instance._div = this._getParentDiv();
		
		if(this.options.enablePages == true) {
			$(this.instance._div).scroll(function(){_this._checkToAppendData()});
		}
		
		if(this.instance._expansive == true) {
			this.instance._div.style.overflowX = "hidden";
		}
		
		this.instance._headerDiv = this._getSimpleDiv("datagrid-header ui-corner-top ui-widget-header ui-widget datagrid-internal-container");
		this.instance._headerDivInternal = this._getSimpleDiv("datagrid-internal-container");
		this.instance._headerDiv.style.width = "100%";
		this.instance._headerDiv.style.position = "relative";
		this.instance._headerDiv.style.overflow = "hidden";
		this.instance._footerDiv = this._getSimpleDiv("datagrid-footer ui-corner-bottom ui-state-hover ui-widget datagrid-internal-container");
		this.instance._footerDiv.style.width = "100%";
		
		this.instance._footerFeedBackDiv = this._getSimpleDiv();
		this.instance._footerDiv.appendChild(this.instance._footerFeedBackDiv);
		
		this.instance._headerDivInternal.style.position = "absolute";
		this.instance._headerDivInternal.style.left = "0px";
		this.instance._headerTable.appendChild(this.instance._thead);
		this.instance._table.appendChild(this.instance._tfoot);
		this.instance._table.removeChild(this.instance._tfoot);
		this.instance._headerDiv.appendChild(this.instance._headerDivInternal);
		this.instance._headerDivInternal.appendChild(this.instance._headerTable);
		this.instance._div.appendChild(this.instance._table);
		this.instance._divComponent = this._getSimpleDiv("datagrid-internal-container");
		this.instance._divComponent.style.width = this.options.width;
		
		this.instance._headerDiv.style.borderBottom = "0px solid black";	
		
		this.instance._divComponent.appendChild(this.instance._headerDiv);
		this.instance._divComponent.appendChild(this.instance._div);
		this.instance._divComponent.appendChild(this.instance._footerDiv);
		this.element.context.appendChild(this.instance._divComponent);
		
		this._adjustTableHeight();
		this._appendData();
		this._syncronizeTables();
		this._keepTablesSize();
		if(this.instance._showHeader == true) {
			for(var i=0; i<this.options.columns.length; i++) {
				if(this.options.enableSort == true) {
					eval("this.instance._thead.getElementsByTagName(\"TR\")[0].getElementsByTagName(\"TD\")[i].onclick = function(){_this._sortTable('"+this.options.columns[i].field+"', this)} ");
				}
			}
		}
	
		$(window).on("resize", function() {
			_this._syncronizeTables();
			_this._adjustTableHeight();		
		});
	},
	_appendData: function() {			
		var pageSize = 999999;
		var _hasPage = true;
	
		if(this.options.enablePages == true) {
			if(this.options.pageSize != null) {
				pageSize = this.options.pageSize;
			}
		} else {			
			_hasPage = false;
			
		}
				
		var _initial = this.instance._providerPointer;
		var _final = _initial + pageSize;
		if(_final > this.options.dataProvider.length) {
			_final = this.options.dataProvider.length
		}
		
		for(this.instance._providerPointer=_initial; this.instance._providerPointer<_final; this.instance._providerPointer++) {
			
			this.instance._tbody.appendChild(this._getTR(this.options.dataProvider[this.instance._providerPointer]));
			for(var col=0; col<this.options.columns.length; col++) {
				var _td = this._getTD();
				if(col == 0) {
					$(_td).css("border-left", "0px solid #fff");
				} else if(col == this.options.columns.length-1) {
					//$(_td).css("border-right", "1px solid #fbd850");
				}
				this.instance._tbody.rows[this.instance._providerPointer+1].appendChild(_td);
				if(this.options.columns[col].advancedLabelFunction) {
					this.options.columns[col].advancedLabelFunction(this.options.dataProvider[this.instance._providerPointer], _td)
				} else {
					var cellText = "";
					if(this.options.columns[col].labelFunction) {
						cellText = this.options.columns[col].labelFunction(this.options.dataProvider[this.instance._providerPointer], new Object(this.instance._providerPointer));							
					} else {
						cellText = this.options.dataProvider[this.instance._providerPointer][this.options.columns[col].field] != undefined ? this.options.dataProvider[this.instance._providerPointer][this.options.columns[col].field] : "";											
					}
					
					if(this.options.columns[col].textAsInput != false) {
						this.instance._tbody.rows[this.instance._providerPointer+1].cells[col].innerHTML = this._getCellText(cellText);					
					} else {
						this.instance._tbody.rows[this.instance._providerPointer+1].cells[col].innerHTML = cellText;
					}
				}
			}
		}
		if(this.options.enablePages == true) {
			this._refreshFeedbackShowing();
		}
		this._keepTablesSize();
		this._scrollBarAdjusts();		
	},
	_sortString: function(a, b, obj) {
		var _r;
		var _a = a[obj];
		var _b = b[obj];		
		_a = _a==undefined?"":_a.toString().toUpperCase();
		_b = _b==undefined?"":_b.toString().toUpperCase();
		try {_r = (_a == _b ? 0 : (_a > _b ? 1 : -1));} catch(e) {return -1}	
		return _r;
	},
	_sortNumber: function(a, b, obj) {
		try {return (parseInt(a[obj]) - parseInt(b[obj]));} catch(e) {return -1}
	},
	_getCellText: function(text) {
	
		//-- my poor english --
		//the image "ie_craps.gif" are here because Internet Explorer showed a stranger behavior to render inside the input=text.
		//without this workaround, Internet Explorer resize the input by himself.
		
		//-- portuguese --
		//a imagem "ie_craps.gif" existe porque o Internet Explorer mostrou um comportamento estranho pra renderizar o valor no input=text
		//sem esse workaround o Internet Explorer redimensiona sozinho o input.
		return "<input readonly type='text' class='datagrid-input-text datagrid-internal-container' style='width:95%; height:100%; border:0px solid black; background: rgba(255,255,255,0);'/><img width='0' src='ie_craps.gif' onerror='this.parentNode.getElementsByTagName(\"input\")[0].value = \""+text+"\"; this.style.display=\"none\"' onload='this.parentNode.getElementsByTagName(\"input\")[0].value = \""+text+"\"; this.style.display=\"none\"'>";
	},
	_syncronizeTables: function() {
	
		this.instance._lastColumnsWidth = new Array();
		for(var i=0; i<this.instance._tbody.rows[1].cells.length; i++) {
			this.instance._tbody.rows[1].cells[i].style.width = $(this.instance._headerTable.rows[0].cells[i]).width() + "px";
		}
		//-- my poor english --
		//by aligning the header with the body is possible that the label of the header be bigger then any other values in the body
		//thats why a set de minimum value on the header to the body too.
		
		//-- portuguese --
		//alinhando o header de acordo com o body é possivel que o label do header seja maior que qualquer um dos valores no body
		//por isso eu refaço o alinhamento para que o valor minimo do header seja também no body.
		for(var i=0; i<this.instance._tbody.rows[1].cells.length; i++) {			
			this.instance._tbody.rows[1].cells[i].style.width = this.instance._headerTable.rows[0].cells[i].offsetWidth + "px";
			this.instance._lastColumnsWidth.push(this.instance._tbody.rows[1].cells[i].offsetWidth);
		}
	},	
	_keepTablesSize: function() {
	
		if(this.instance._lastColumnsWidth.length > 0) {				
			for(var i=0; i<this.instance._tbody.rows[1].cells.length; i++) {
				this.instance._tbody.rows[1].cells[i].style.width = this.instance._lastColumnsWidth[i] + "px";
				this.instance._headerTable.rows[0].cells[i].style.width =  this.instance._lastColumnsWidth[i] + "px";
			}
			for(var i=0; i<this.instance._tbody.rows[1].cells.length; i++) {			
				this.instance._tbody.rows[1].cells[i].style.width = this.instance._headerTable.rows[0].cells[i].offsetWidth + "px";
				this.instance._lastColumnsWidth.push(this.instance._tbody.rows[1].cells[i].offsetWidth);
			}			
		}
		
	},	
	_getRandomNumber: function(x,y){
		return (parseInt(x) + (Math.floor(Math.random() * (x - y))));
	},
	_setIntervalValues: function() {
		this.instance._isPercentHeight = this.instance._height.substring(this.instance._height.length-1, this.instance._height.length) == "%";
		this.instance._height = this.instance._isPercentHeight ? this.instance._height.substring(0, this.instance._height.length-1) : this.instance._height;
		this.instance._sortTickDirection = this._sortTickDirection();
		//alert(this.instance._height);
	},
	_validateTable: function() {
		if(Number(this.instance._height == "NaN")) {
			this.instance._errors.push("HEIGHT_NAN_ERROR");
		}
	},
	_sortTickDirection: function() {
		var label = document.createElement("label");
		label.style.marginLeft = "3px";
		$(label).css("float", "right");
		label.className = "ui-icon ui-icon-circle-triangle-s"
		return label;
	},
	_getColumByField: function(field) {
		for(var i=0; i<this.options.columns.length; i++) {
			if(this.options.columns[i].field == field) {
				return this.options.columns[i];
			}
		}
	},
	_sortTable: function(field, element) {
	
		var column = this._getColumByField(field);
	
		if(column.sort != "none") {
			
			var _this = this;
			element.appendChild(this.instance._sortTickDirection);
		
			if(this.instance._lastSort == column.field) {				
				this.instance._sortTickDirection.className = (this.instance._sortTickDirection.className == "ui-icon ui-icon-circle-triangle-s" ? "ui-icon ui-icon-circle-triangle-n" : "ui-icon ui-icon-circle-triangle-s");
				this.options.dataProvider.reverse();
			} else {				
				this.instance._sortTickDirection.className = "ui-icon ui-icon-circle-triangle-s";
				if(column.sortFunction) {
					this.options.dataProvider.sort(function(a, b) {return column.sortFunction(a, b, field)});
				} else {			
					if(column.sort == "integer") {
						this.options.dataProvider.sort(function(a, b) {return _this._sortNumber(a, b, field)});
					} /*else if(column.sort == "java_calendar") {						
						this.options.dataProvider.sort(function(a, b) {return _this._sortJavaCalendar(a, b, field)});				
					}*/ else {						
						this.options.dataProvider.sort(function(a, b) {return _this._sortString(a, b, field)});
					}
				}
			}
			
			this.instance._lastSort = column.field;
			this.instance._tbody.innerHTML = "";
			this.instance._tbody.appendChild(this._getTR());
			this.instance._providerPointer = 0;
			this._appendData();
		}
	},
	_getTable: function() {
		var table = document.createElement("TABLE");
		table.className = "datagrid ui-widget datagrid-internal-container";
		table.style.marginBottom = "0px";		
		table.cellSpacing = 0;
		table.cellPadding = 2;		
		table.width = this._getTableWidth();		
		return table;
	},
	_getTableWidth: function() {
		var _width = 0;
		if(this.instance._expansive == true) {
			_width = "100%";			
		} else {		
			for(var i=0; i<this.options.columns.length; i++) {
				_width += (this.options.columns[i].width ? this.options.columns[i].width : 100);				
			}
		}
		return _width;
	},
	_getTR: function(data, isHeader) {
		var tr = document.createElement("TR");
		var _this = this;
		if(isHeader == undefined || isHeader == false) {
			tr.className = "datagrid-row ui-widget datagrid-internal-container";
			if(this.options.onclick) {
				tr.onclick = function(){_this.options.onclick(data, tr)};
			}
		} else {
			tr.className = "datagrid-internal-container";
		}
		return tr;
	},	
	_getBody: function() {
		return document.createElement("TBODY");
	},
	_getHead: function() {
		var thead = document.createElement("THEAD");
		return thead;
	},	
	_getFoot: function() {
		var thead = document.createElement("TFOOT");	
		return thead;
	},
	_getHeaderDiv: function() {
		var div = document.createElement("DIV");		
		div.style.width="100%";
		return div;
	},	
	_getTD: function(isHeader, width, isFooter) {
		var td = document.createElement("TD");		

		if(isHeader == true) {
			td.className = "datagrid-header ui-widget datagrid-internal-container";
		} else {
			td.className = "datagrid-cell ui-widget datagrid-internal-container";
		}
		
		if(isFooter == true) {
			td.appendChild(this._getHeaderDiv());
		}
		
		if(width != undefined) {
			td.style.width = width.toString() + "%";
		}
		
		td.style.overflow = "auto";
		return td;
	},
	_getSimpleDiv: function(className) {
		var div = document.createElement("DIV");
		if(className)div.className = className;
		return div;
	},
	_getParentDiv: function() {
		var div = this._getSimpleDiv("ui-state-active ui-widget-content ui-widget datagrid-internal-container");
		div.style.width = "100%"; //instance.width;
		div.style.position = "relative";
		div.style.overflow = "auto";	
		return div;
	},
	_scrollBarAdjusts: function() {
		if($(this.instance._div).height() <= $(this.instance._table).height()) {
			this.instance._headerDivInternal.style.right = "17px";
		} else {
			this.instance._headerDivInternal.style.right = "0px";
		}
	
	},	
	_refreshFeedbackShowing: function() {
		this.instance._footerFeedBackDiv.innerHTML = "Showing " + this.instance._providerPointer + " from " + this.options.dataProvider.length;	
	},	
	_checkToAppendData: function() {
		this.instance._headerDiv.scrollLeft = this.instance._div.scrollLeft;
		if(((this.instance._div.scrollTop) + ($(this.instance._div).height())) >= this.instance._div.scrollHeight-10) {
			this._appendData();			
		}
	},
	_adjustTableHeight: function(){
		if(this.instance._isPercentHeight == false) {
			return;
		}
		var parentHeight = $(this.instance._divComponent.parentNode).height();
		var value = Math.floor(parentHeight*this.instance._height/100) - $(this.instance._footerDiv).height() - $(this.instance._headerDiv).height();
		this.instance._div.style.height = value + "px";
	},
	GET_FOOTER: function( event ) {return this.instance._footerDiv}
});

}));
