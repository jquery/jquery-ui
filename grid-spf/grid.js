/*
 * Grid
 *
 * Depends on:
 * tmpl
 * datastore
 *
 * Optional:
 * extractingDatasource
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
		$(this.options.source.element).bind("datasourceresponse", function() {
			that.refresh();
		});
	},
	refresh: function() {
		// TODO this code assumes a single tbody which is not a safe assumption
		var tbody = this.element.find( "tbody" ).empty(),
			template = this.options.rowTemplate;
		$.each( this.options.source.toArray(), function( itemId, item ) {
			$.tmpl( template, item ).data( "grid-item", item ).appendTo( tbody );
		});
		this._trigger("refresh");
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
