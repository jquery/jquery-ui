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
			$.ui.datastore.main.items[ this.options.type ] = [];
			// populate store with static data directly
			if ($.isArray(this.options.source)) {
				// TODO pass this (as the datasource instance) instead of type?
				$.ui.datastore.main.populate( this.options.type );
			}
		},
		create: function( props ) {
			this.options.source.push( props );
		},
		get: function( store ) {
			store._populate( this.options.type, this.options.source );
		},
		save: function( items ) {
			$.each( items, function( itemId, item ) {
				item.save();
			});
		},
	});
	$.ui.datasource.types = {};
	
})( jQuery );
