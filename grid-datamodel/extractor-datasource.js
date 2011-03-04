/*
 * Table Extractor Datasource
 * 
 * Depends on:
 * datasource
 */
(function( $ ) {
	
$.widget( "ui.extractingDatasource", $.ui.datasource, {
	options: {
		table: null
	},
	_create: function() {
		var type = "generated" + $.now();
		this.options.type = type;

		var fieldDescriptions = {};
		var fields = this.options.table.find( "th" ).map(function() {
			var th = $( this ),
				field = th.data( "field" );
			if ( !field ) {
				// generate field name if missing
				field = th.text().toLowerCase().replace(/\s|[^a-z0-9]/g, "_");
			}

			fieldDescriptions[ field ] = {
				type: th.data( "type" ),
				culture: th.data( "culture" ),
				format: th.data( "format" ),
				sortOrder: th.data( "sort-order" ) || 1
			};

			return field;
		}).get();
		
		$.ui.dataitem.extend( type, {
			fields: fieldDescriptions
		});

		var indexedGuid = 1;
		var items = this.options.source = this.options.table.find( "tbody" ).children().map(function() {
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
		
		this._super("_create");
	},
	type: function() {
		return this.options.type;
	}
});
	
})( jQuery );
