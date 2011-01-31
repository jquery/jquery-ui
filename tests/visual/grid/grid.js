/*
 * Grid
 * 
 * Depends on:
 * tmpl
 * datastore
 */
(function( $ ) {

$.widget( "ui.grid", {
	options: {
		type: null,
		rowTemplate: null
	},
	_create: function() {
		if ( !this.options.type ) {
			this._parseData();
		}
		this._rowTemplate();
		var that = this;
		this.element.addClass( "ui-widget" );
		this.element.find( "th" ).addClass( "ui-widget-header" );
		this.element.delegate( "tbody > tr", "click", function( event ) {
			that._trigger( "select", event, {
				item: $.ui.datastore.main.get( that.options.type,
					$( this ).tmplItem().data.guid )
			});
		});
		this.refresh();
	},
	refresh: function() {
		var tbody = this.element.find( "tbody" ).empty(),
			// TODO the get() call needs to be async for remote sources
			items = this.items = $.ui.datastore.main.get( this.options.type ).options.items,
			template = this.options.rowTemplate;
		$.each( items, function( itemId, item ) {
			// TODO use item.toJSON() or a method like that to compute values to pass to tmpl
			$.tmpl( template, item.options.data ).appendTo( tbody );
		});
		tbody.find( "td" ).addClass( "ui-widget-content" );
	},
	// TODO: data extraction should live on its own
	// and grid should delegate the work to the data extractor
	_parseData: function() {
		var type = "generated" + $.now();
		this.options.type = type;

		var fieldDescriptions = {};
		var fields = this.options.columns = this.element.find( "th" ).map(function() {
			var th = $( this ),
				field = $( this ).data( "field" );
			if ( !field ) {
				// generate field name if missing
				field = $( this ).text().toLowerCase().replace(/\s|[^a-z0-9]/g, "_");
			}

			fieldDescriptions[ field ] = {
				type: th.data( "type" ),
				culture: th.data( "culture" ),
				format: th.data( "format" ),
				sortOrder: th.data( "sort-order" ) || 1
			};

			return field;
		}).get();

		var indexedGuid = 1;
		var items = this.element.find( "tbody" ).children().map(function() {
			var item = { guid: $( this ).data( "guid" ) };
			// generate guid if missing
			if ( !item.guid ) {
				item.guid = indexedGuid++;
			}
			$( this ).children().each(function( i ) {
				item[ fields[ i ] ] = $( this ).text();
			});
			return item;
		}).get();

		$.ui.dataitem.extend( type, {
			fields: fieldDescriptions
		});
		$.ui.datasource({
			type: type,
			source: items
		});
	},

	_rowTemplate: function() {
		if ( this.options.rowTemplate ) {
			return;
		}
		var template = $.map( this.options.columns, function( field ) {
			return "<td>${" + field + "}</td>";
		}).join( "" );
		template = "<tr>" + template + "</tr>";
		this.options.rowTemplate = template;
	}
});

})( jQuery );
