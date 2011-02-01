/*
 * Datastore
 * 
 * Depends on:
 * datasource
 * dataitem
 * dataitems
 */
(function( $ ) {
	
	$.widget( "ui.datastore", {
		_create: function() {
			this.items = {};
		},
		create: function( type, props ) {
			return $.ui.datasource.types[ type ].create( props );
		},
		// TODO there should be seperate methods for getting an item and a dataitems collection
		get: function( type, id ) {
			if ( id ) {
				for ( var i = 0, length = this.items[ type ].options.items.length; i < length; i++ ) {
					var item = this.items[ type ].options.items[ i ];
					// TODO save items by id into an object for fast key lookup
					// store that map in dataitems?
					if (item.options.data.guid == id) {
						return item;
					}
				}
			}
			return this.items[type];
		},
		// TODO rename or remove this (call datasource.get(store) directly instead)
		populate: function( type ) {
			// TODO or rename datasource.get
			$.ui.datasource.types[ type ].get( this );
		},
		// TODO or rename this
		_populate: function( type, items ) {
			var dataitems = this.items[ type ],
				ctor = $.ui.dataitem.types[ type ],
				local = dataitems.options.items
			// empty existing array
			// TODO update items and trigger appropiate change events
			local.splice(0);
			$.each( items, function( i, item ) {
				local[ i ] = new ctor({
					data: item
				});
			});
			// TODO move some stuff to dataitems?
			dataitems.updated();
		},
		save: function() {
			$.each( this.items, function( type, items ) {
				$.ui.datasource.types[ type ].save( items );
			});
		}
	});
	$.ui.datastore.main = $.ui.datastore();
	
})( jQuery );
