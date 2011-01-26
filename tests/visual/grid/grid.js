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
				items = $.ui.datastore.main.get( this.options.type ).options.items,
				template = this.options.rowTemplate;
			$.each( items, function( itemId, item ) {
				$.tmpl( template, item.options.data ).appendTo( tbody );
			});
			tbody.find( "td" ).addClass( "ui-widget-content" );
		},
		_parseData: function() {
			var type = "generated" + $.now();
			this.options.type = type;

			var fields = this.element.find( "th" ).map(function() {
				var field = $( this ).data( "field" );
				if ( !field ) {
					// generate field name if missing
					field = $( this ).text().toLowerCase().replace(/\s|[^a-z0-9]/g, "_");
				}
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

			var template = $.map( fields, function( field ) {
				return "<td>${" + field + "}</td>";
			}).join( "" );
			template = "<tr>" + template + "</tr>";
			this.options.rowTemplate = template;

			$.ui.datasource({
				type: type,
				source: items
			});
			$.ui.dataitem.extend( type, {} );
			$.ui.datastore.main.populate( type );
		}
	});
	
})( jQuery );
