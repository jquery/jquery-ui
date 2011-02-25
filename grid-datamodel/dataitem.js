/*
 * Dataitem and Dataitems
 * 
 * Depends on:
 * ---
 */
(function( $ ) {
	
	$.widget( "ui.dataitem", {
		defaultElement: null,
		options: {
			data: null
		},
		_create: function() {
		},
		get: function( key ) {
			return this.options.data[ key ];
		},
		set: function( key, value ) {
			this.options.data[ key ] = value;
			return this;
		}
	});
	$.ui.dataitem.types = {};
	$.ui.dataitem.extend = function( type, prototype ) {
		$.widget( "ui.dataitem-" + type, $.ui.dataitem, prototype );
		$.ui.dataitem.types[ type ] = $.ui[ "dataitem-" + type ];
	};

	$.widget( "ui.dataitems", {
		defaultElement: null,
		options: {
			items: null
		},
		// TODO find a better name
		updated: function() {
			this._trigger("data");
		}
	});
	
})( jQuery );
