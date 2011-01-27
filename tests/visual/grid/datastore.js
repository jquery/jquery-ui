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
			// TODO hackity hack to get the same dataitems instance back for calls to datastore.get(type)
			this.dataitems = {};
			this.items = {};
		},
		create: function( type, props ) {
			return $.ui.datasource.types[ type ].create( props );
		},
		// TODO this should be done just once
		_normalize: function( type, index, item ) {
			var ctor = $.ui.dataitem.types[ type ];
			if ( !( item instanceof $.ui.dataitem ) ) {
				item = this.items[ type ][ index ] = ctor({ data: item });
			}
			return item;
		},
		// TODO there should be seperate methods for getting an item and a dataitems collection
		get: function( type, id ) {
			if ( id ) {
				for ( var i = 0, length = this.items[ type ].length; i < length; i++ ) {
					var item = this.items[ type ][ i ];
					// TODO consider saving items by id into an object for fast key lookup
					if (item.options.data.guid == id) {
						return this._normalize( type, i, item );
					}
				}
			}
			if ( this.dataitems[type] ) {
				return this.dataitems[type];
			}
			for ( var i = 0, length = this.items[ type ].length; i < length; i++ ) {
				this._normalize( type, i, this.items[ type ][ i ] );
			}
			return this.dataitems[type] = $.ui.dataitems({ items: this.items[ type ] });
		},
		// TODO rename this
		populate: function( type ) {
			// TODO or rename datasource.get
			$.ui.datasource.types[ type ].get( this );
		},
		// TODO or rename this
		_populate: function( type, items ) {
			// TODO just assign items to this.items[type]?
			var local = this.items[ type ];
			$.each( items, function( i, item ) {
				// TODO changed this to use index for proper array indexing
				// was item.guid which is not useful as array index
				local[ i ] = item;
			});
		},
		save: function() {
			$.each( this.items, function( type, items ) {
				$.ui.datasource.types[ type ].save( items );
			});
		}
	});
	$.ui.datastore.main = $.ui.datastore();
	
})( jQuery );
