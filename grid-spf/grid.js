/*
 * Grid
 *
 * Depends on:
 * widget
 * tmpl
 * observable (optional)
 * localDataview (optional, when no source option is specified)
 * resizable (optional)
 */
(function( $ ) {

$.widget( "ui.grid", {

	options: {
		dataFields: [ "type", "editor", "editorOptions", "template", "culture", "format" ],
		columns: null,
		rowTemplate: null
	},

	_create: function() {
		var that = this;
		this._draw();
		this._columns();
		this._rowTemplate();
		this._source();
		this.element.delegate( "tbody > tr", "click", function( event ) {
			that._trigger( "select", event, {
				item: $( this ).data( "grid-item" )
			});
		});
		if ( $.observable ) {
			that._bindChange( that._toArray() );
			$.observable( this.options.source ).bind( "insert remove replaceAll", function( event, ui ) {
				if ( event.type === "insert" ) {
					that._bindChange( ui.items );
				} else if (event.type === "replaceAll" ) {
					that._unbindChange( ui.oldItems );
					that._bindChange( ui.newItems );
				} else {
					that._unbindChange( ui.items );
				}
				that.refresh();
			});
		}
	},
	
	_draw: function() {
		var totalWidth = 0,
			colWidths = this.element.find( "tr:first" ).children().map(function() {
				var width = $( this ).outerWidth();
				totalWidth += width;
				return width;
			});

		// Create the grid
		var uiGrid = ( this.uiGrid = $("<div class='ui-widget ui-grid'></div>") )
				.insertBefore( this.element ),

			// Add grid head and grid body
			uiGridHead = ( this.uiGridHead = $("<div class='ui-widget-header ui-grid-head'></div>") )
				.appendTo( uiGrid ),
			uiGridBody = ( this.uiGridBody = $("<div class='ui-widget-content ui-grid-body'></div>") )
				.appendTo( uiGrid ),
			uiGridFoot = ( this.uiGridFoot = $("<div class='ui-widget-header ui-grid-foot'></div>") )
				.appendTo( uiGrid ),

			// New table in grid head for column headers
			uiGridHeadTable = ( this.uiGridHeadTable = $("<table class='ui-widget-content ui-grid-head-table'></table>") )
				.appendTo( uiGridHead ),

			// Existing table in grid body for the body table
			uiGridBodyTable = ( this.uiGridBodyTable = this.element )
				.addClass( "ui-grid-body-table" )
				.appendTo( uiGridBody ),
			
			uiGridFootTable = ( this.uiGridFootTable = $("<table class='ui-widget-content ui-grid-foot-table'></table>") )
				.appendTo( uiGridFoot );
		
		// These are used in refresh when needed for scrollbar padding
		this.uiGridHeadAndFoot = this.uiGridHead.add( this.uiGridFoot );
		this.uiGridHeadTableAndFootTable = this.uiGridHeadTable.add( this.uiGridFootTable );
		this.uiGridHeadAndFootAndTables = this.uiGridHeadAndFoot.add( this.uiGridHeadTableAndFootTable );

		// Move table CAPTION to grid head
		uiGridBodyTable.find( "caption" ).addClass( "ui-widget-header" )
			.prependTo( uiGridHeadTable );

		// Create COLGROUP and COLs if missing
		if ( !uiGridBodyTable.find("colgroup").length ) {
			// TODO: Consider adding support for existing COL elements not inside COLGROUP
			// TODO: ... in the meantime, remove any that might exist
			uiGridBodyTable.find( "col" ).remove();
			var colgroup = $( "<colgroup></colgroup>" ).insertBefore( uiGridBodyTable.find("thead") );
			uiGridBodyTable.find( "tr:eq(0)" ).children().each(function(i) {
				colgroup.append( "<col>" );
			});
		}

		// Auto-size columns based on relative widths of pre-grid table column widths
		uiGridBody.find( "colgroup" ).children().each(function(i) {
			$( this ).css( "width", ( colWidths[i] / totalWidth * 100 ) + '%' );
		});

		// Copy table COLGROUP to grid head and grid foot
		uiGridBodyTable.find( "colgroup" )
			.clone()
			.appendTo( uiGridHeadTable )
			.clone()
			.appendTo( uiGridFootTable );

		// Move table THEAD to grid head for fixed column headers
		uiGridBodyTable.find( "thead" )
			.appendTo( uiGridHeadTable );
		
		// Move table TFOOT to grid foot for fixed footer
		uiGridBodyTable.find( "tfoot" )
			.appendTo( uiGridFootTable );

		// Give head rows a clickable state
		uiGridHeadTable.find( "tr" ).addClass( "ui-state-default" );

		// Give head cells a clickable state
		this._hoverable( uiGridHeadTable.find("th").addClass("ui-state-default") );

		// Give body rows a clickable state
		this._hoverable( uiGridBodyTable.find("tr").addClass("ui-state-default") );

		// Give body cells a clickable state
		uiGridBodyTable.find( "td" ).addClass( "ui-state-default" );

		// Give foot cells a clickable state
		uiGridFootTable.find( "td" ).addClass( "ui-state-default" );
	},

	widget: function() {
		return this.uiGrid;
	},

	_destroy: function() {
		if ( $.observable ) {
			this._unbindChange( this.options.source );
			// TODO see below
			$.observable( this.options.source ).unbind( ".grid");
		}
		// TODO implement actually destroying the grid
	},

	_bindChange: function( items ) {
		var that = this;
		$.each( items, function( index, item ) {
			// TODO make namespace specific for this instance
			$.observable( item ).bind( "change.grid", function() {
				that.refreshItem( item );
			});
		});
	},

	_unbindChange: function( items ) {
		$.each( items, function( index, item ) {
			// TODO see above
			$.observable( item ).unbind( "change.grid" );
		});
	},

	_container: function() {
		// TODO this code assumes a single tbody which is not a safe assumption
		return this.element.find( "tbody" );
	},

	_newRow: function( item ) {
		return $.tmpl( this.options.rowTemplate, item ).data( "grid-item", item );
	},

	// can be customized by subwidgets
	_toArray: function() {
		return this.options.source;
	},

	refresh: function() {
		var gridHeight, headHeight, footHeight,
			that = this,
			tbody = this._container().empty();

		$.each( this._toArray(), function( itemId, item ) {
			that._newRow( item ).appendTo( tbody );
		});

		gridHeight = this.uiGrid.outerHeight();
		headHeight = this.uiGridHead.outerHeight();
		footHeight = this.uiGridFoot.outerHeight();

		if ( $.ui.resizable && this.uiGrid.is(":ui-resizable") ) {
			this.uiGrid.addClass( "ui-grid-resizable" );
			if ( footHeight < 16 ) {
				this.uiGridFoot.height( 16 );
				footHeight = this.uiGridFoot.height();
			}
		} else {
			this.uiGrid.removeClass( "ui-grid-resizable" );
		}

		// Adjust body height to fill
		this.uiGridBody.height( gridHeight - headHeight - footHeight );

		// Adjust head and foot in case of visible scrollbar on body to keep columns aligned
		var paddingRight,
			vertScrollbar = ( this.uiGridBody[0].scrollHeight !== this.uiGridBody[0].clientHeight );
		if ( vertScrollbar ) {
			paddingRight = this.uiGridBody.width() - this.uiGridBodyTable.outerWidth();
			this.uiGridHeadAndFoot.css( "padding-right", paddingRight + "px" );
			this.uiGridHeadTableAndFootTable.css( "padding-right", "1px");
		} else {
			// Have to set to 0 before removing property or it "sticks"
			this.uiGridHeadAndFootAndTables.css( "padding-right", 0 ).css( "padding-right", null );
		}

		this._trigger( "refresh" );
	},

	refreshItem: function( item ) {
		var that = this;
		this._container().children().each(function() {
			if ( $( this ).data( "grid-item" ) === item ) {
				$( this ).replaceWith( that._newRow(item) );
			}
		});
	},

	_columns: function() {
		if ( this.options.columns ) {
			if ( $.type( this.options.columns[0] ) === "string" ) {
				this.options.columns = $.map( this.options.columns, function( column ) {
					return {
						property: column
					};
				});
			}
			var head = this.uiGridHeadTable.find( "thead" );
			if ( !head.find("th").length ) {
				$.each( this.options.columns, function( index, column ) {
					$( "<th class='ui-state-default'>" )
						.text( column.label || column.property )
						.appendTo( head );
				});
			}
			return;
		}
		var dataFields = this.options.dataFields;
		this.options.columns = this.uiGridHeadTable.find( "th" ).map(function() {
			var th = $( this );
			var property = th.data( "property" );
			if ( !property ) {
				// generate property name if missing
				// replaces whitespace and non-alphanumerics with underscore
				property = th.text()
					.toLowerCase()
					.replace( /\s|[^a-z0-9]/g, "_" );
			}
			var result = {
				property: property,
				label: th.text()
			};
			$.each( dataFields, function( index, dataField ) {
				result[ dataField ] = th.data( dataField );
			});
			return result;
		}).get();
	},

	_rowTemplate: function() {
		if ( this.options.rowTemplate ) {
			return;
		}
		var template = $.map( this.options.columns, function( column, index ) {
			if ( column.template ) {
				return $( column.template ).html();
			}
			return "<td class=\"ui-widget-content\">${" + column.property + "}</td>";
		}).join( "" );
		template = "<tr>" + template + "</tr>";
		// compile the template
		this.options.rowTemplate = $.template( template );
	},

	_source: function() {
		if ( this.options.source ) {
			return;
		}
		var columns = this.options.columns;
		// TODO source should be dataview.result; fix menugrid to deal with that
		this.options.source = $.ui.localDataview({
			properties: columns,
			input: this._container().children().map(function() {
				var item = {};
				$( this ).children().each(function( i ) {
					item[ columns[ i ].property ] = $( this ).text();
				});
				return item;
			}).get()
		});
	}
});

}( jQuery ));
