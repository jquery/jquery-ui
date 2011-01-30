/*
 * Datasource
 * 
 * Depends on:
 * datastore
 */
(function( $ ) {
	
	$.widget( "ui.datasource", {
		options: {
			type: null,
			source: null
		},
		_create: function() {
			$.ui.datasource.types[ this.options.type ] = this;
			// TODO initialzing items[type] should probably be moved into the populate call 
			$.ui.datastore.main.items[ this.options.type ] = [];
			$.ui.datastore.main.populate( this.options.type );
		},
		create: function( props ) {
			this.options.source.push( props );
		},
		get: function( store ) {
			if ($.isArray( this.options.source ) ) {
				// TODO pass this (as the datasource instance) instead of type?
				store._populate( this.options.type, this.options.source );
			} else if ( $.type( this.options.source ) == "string" ) {
				var that = this;
				$.getJSON( this.options.source, {}, function(data) {
					store._populate( that.options.type, data );
					// TODO replace this workaround with proper notifications or async handling 
					$("table").grid("refresh");
				});
			} else if ( $.isFunction( this.options.source ) ) {
				var that = this;
				this.options.source( {}, function(data) {
					store._populate( that.options.type, data );
					// TODO see above 
					$("table").grid("refresh");
				});
			}
		},
		save: function( items ) {
			$.each( items, function( itemId, item ) {
				item.save();
			});
		},
	});
	$.ui.datasource.types = {};
	
})( jQuery );
