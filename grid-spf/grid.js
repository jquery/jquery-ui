/*
 * Grid
 *
 * Depends on:
 * widget
 * tmpl
 * observable (optional)
 */
(function( $ ) {

$.widget( "ui.grid", {
	options: {
		dataFields: [ "type", "editor", "editorOptions", "template" ],
		columns: null,
		rowTemplate: null
	},
	_create: function() {
		var that = this;
		this._columns();
		this._rowTemplate();
		this.element.addClass( "ui-widget" );
		this.element.find( "th" ).addClass( "ui-state-default" );
		this.element.delegate( "tbody > tr", "click", function( event ) {
			that._trigger( "select", event, {
				item: $( this ).data( "grid-item" )
			});
		});
		if ( $.observable ) {
			$.observable( this.options.source ).bind( "insert remove replaceAll change", function( event, ui ) {
				if ( event.type === "change" ) {
					that.refreshItem( ui.item );
					return;
				}
				that.refresh();
			});
		}
	},
	_container: function() {
		// TODO this code assumes a single tbody which is not a safe assumption
		return this.element.find( "tbody" );
	},
	_toArray: function() {
		return this.options.source;
	},
	refresh: function() {
		var tbody = this._container().empty(),
			template = this.options.rowTemplate;
		$.each( this._toArray(), function( itemId, item ) {
			$.tmpl( template, item ).data( "grid-item", item ).appendTo( tbody );
		});
		this._trigger("refresh");
	},
	refreshItem: function( item ) {
		var template = this.options.rowTemplate;
		this._container().children().each(function() {
			if ( $( this ).data( "grid-item" ) === item ) {
				$( this ).replaceWith( $.tmpl( template, item ).data( "grid-item", item ) );
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
					$( "<th>" ).text(column.property).appendTo(head);
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
				property = th.text().toLowerCase().replace(/\s|[^a-z0-9]/g, "_");
			}
			var result = {
				property: property
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
	}
});

})( jQuery );
