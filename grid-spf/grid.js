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
		columns: null,
		rowTemplate: null
	},
	_create: function() {
		var that = this;
		this._columns();
		this._rowTemplate();
		this.element.addClass( "ui-widget" );
		this.element.find( "th" ).addClass( "ui-widget-header" );
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
		this.options.columns = this.element.find( "th" ).map(function() {
			var field = $( this ).data( "field" );
			if ( !field ) {
				// generate field name if missing
				field = $( this ).text().toLowerCase().replace(/\s|[^a-z0-9]/g, "_");
			}
			return {
				property: field,
				type: $( this ).data( "type" )
			};
		}).get();
	},

	_rowTemplate: function() {
		if ( this.options.rowTemplate ) {
			return;
		}
		var headers = this.element.find( "thead th" );
		var template = $.map( this.options.columns, function( column, index ) {
			// TODO how to specify a custom template using the columns option?
			// make columns array-of-objects (optional) to contain all the potential data attributes?
			// should then output those when generating the columns
			var customTemplate = headers.eq( index ).data( "template" );
			if ( customTemplate ) {
				return $(customTemplate).html();
			}
			return "<td class=\"ui-widget-content\">${" + column.property + "}</td>";
		}).join( "" );
		template = "<tr>" + template + "</tr>";
		// compile the template
		this.options.rowTemplate = $.template( template );
	}
});

})( jQuery );
