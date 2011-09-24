/*
 * Grid
 *
 * Depends on:
 * widget
 * tmpl
 * observable (optional)
 * localDataview (optional, when no source option is specified)
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
		this._columns();
		this._rowTemplate();
		this._source();
		this.element.addClass( "ui-widget" );
		this.element.find( "th" ).addClass( "ui-state-default" );
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
		var that = this;
			tbody = this._container().empty();
		$.each( this._toArray(), function( itemId, item ) {
			that._newRow( item ).appendTo( tbody );
		});
		this._trigger("refresh");
	},
	refreshItem: function( item ) {
		var that = this;
		this._container().children().each(function() {
			if ( $( this ).data( "grid-item" ) === item ) {
				$( this ).replaceWith( that._newRow( item ) );
			}
		});
	},
	_columns: function() {
		if ( this.options.columns ) {
			if ( $.type( this.options.columns[ 0 ] ) === "string" ) {
				this.options.columns = $.map( this.options.columns, function( column ) {
					return {
						property: column
					};
				});
			}
			var head = this.element.find("thead");
			if ( !head.find( "th" ).length ) {
				$.each( this.options.columns, function( index, column ) {
					$( "<th>" ).text(column.label || column.property).appendTo(head);
				});
			}
			return;
		}
		var dataFields = this.options.dataFields;
		this.options.columns = this.element.find( "th" ).map(function() {
			var th = $( this );
			var property = th.data( "property" );
			if ( !property ) {
				// generate property name if missing
				// replaces whitespace and non-alphanumerics with underscore
				property = th.text().toLowerCase().replace(/\s|[^a-z0-9]/g, "_");
			}
			var result = {
				property: property,
				label: th.text()
			};
			$.each( dataFields, function(index, dataField) {
				result[dataField] = th.data( dataField );
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

})( jQuery );
