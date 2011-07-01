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
				// TODO add item
			});
		});
		$(this.options.source.element).bind("datasourceresponse", function() {
			that.refresh();
		});
	},
	refresh: function() {
		// TODO this code assumes a single tbody which is not a safe assumption
		var tbody = this.element.find( "tbody" ).empty();
		// TODO how to refresh a single row? -> tmplItem().update()
		$.tmpl( this.options.rowTemplate, this.options.source.toArray() ).appendTo( tbody );
		this._trigger("refresh");
	},

	_columns: function() {
		if ( this.options.columns ) {
			var head = this.element.find("thead");
			if ( !thead.find( "th" ).length ) {
				// TODO improve this
				$.each( this.options.columns, function(index, column) {
					$("<th>").attr("data-field", column).text(column).appendTo(head)
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
			return field;
		}).get();
	},

	_rowTemplate: function() {
		if ( this.options.rowTemplate ) {
			return;
		}
		var headers = this.element.find( "thead th" );
		var template = $.map( this.options.columns, function( field, index ) {
			// TODO how to specify a custom template using the columns option?
			// make columns array-of-objects (optional) to contain all the potential data attributes?
			// should then output those when generating the columns
			var customTemplate = headers.eq( index ).data( "template" );
			if ( customTemplate ) {
				return $(customTemplate).html();
			}
			return "<td class=\"ui-widget-content\">${" + field + "}</td>";
		}).join( "" );
		template = "<tr>" + template + "</tr>";
		// compile the template
		this.options.rowTemplate = $.template( template );
	}
});

})( jQuery );
