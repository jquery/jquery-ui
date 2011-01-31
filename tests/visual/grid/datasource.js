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
			$.ui.datastore.main.items[ this.options.type ] = new $.ui.dataitems({
				items: []
			});
			this.get( $.ui.datastore.main );
		},
		create: function( props ) {
			// TODO this needs to tell datastore that something changed
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
				});
			} else if ( $.isFunction( this.options.source ) ) {
				var that = this;
				this.options.source( {}, function(data) {
					store._populate( that.options.type, data );
				});
			}
		},
		save: function( items ) {
			// TODO item.save() isn't actually implemented
			// TODO how useful is it to save each individual item, when saves could/should be batched?
			$.each( items, function( itemId, item ) {
				item.save();
			});
		},
	});
	$.ui.datasource.types = {};
	
})( jQuery );
