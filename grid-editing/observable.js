/*
 * Observable
 *
 * Depends on:
 * widget
 */
(function ( $, undefined ) {
	$.observable = function( data ) {
		if ( !this.property ) {
			return new $.observable( data );
		}
		this.data = data;
	};

	var splice = [].splice;

	$.observable.prototype = {
		data: null,

		_set: function( name, value ) {
			var fields = name.split( "." ),
				field = fields.pop();
			this._get( fields )[ field ] = value;
		},
		_get: function( name ) {
			var fields = $.type( name ) === "string" ? name.split( "." ) : name,
				field,
				object = this.data;
			if ( fields.length === 0 ) {
				return object;
			}
			while ( fields.length > 1 ) {
				field = fields.shift(),
				object = object[ field ];
			}
			return object[ fields[ 0 ] ];
		},

		property: function( path, value ) {
			if ( $.type( path ) === "object" ) {
				var oldValues = {},
					newValues = {},
					changed = false;
				for ( var key in path ) {
					var oldValue = this._get( key );
					if (oldValue != path[ key] ) {
						changed = true;
						oldValues[ key ] = oldValue;
						newValues[ key ] = path[ key ];
						this._set( key, path[ key ] );
					}
				}
				if ( changed ) {
					this.trigger( "change", {
						oldValues: oldValues,
						newValues: newValues
					});
				}
			} else if (arguments.length == 1) {
				return this._get( path );
			} else {
				var oldValue = this._get( path );
				// TODO should be strict? currently helpers are unaware of data types, don't do parsing, therefore strict comparison wouldn't be good
				if ( oldValue != value ) {
					this._set( path, value );
					var oldValues = {};
					oldValues[ path ] = oldValue;
					var newValues = {};
					newValues[ path ] = value;
					this.trigger( "change", {
						oldValues: oldValues,
						newValues: newValues
					});
				}

			}
			return this;
		},

		insert: function( index, items) {
			// insert( object )
			if ( $.type(index) === "object" ) {
				items = [ index ];
				index = this.data.length;
			// insert( index, object )
			} else if ( !$.isArray( items ) ) {
				items = [ items ];
			}
			// insert( index, objects )
			splice.apply( this.data, [ index, 0 ].concat( items ) );
			return this.trigger( "insert", {
				index: index,
				items: items
			});
		},

		remove: function( index, numToRemove ) {
			if ( $.type( index ) === "array" ) {
				// TODO there's probably a more efficient way to do this
				var i,
					j,
					l,
					m,
					removed = [],
					toRemove = index;
				for ( i = 0, l = this.data.length; i < l; i++ ) {
					for ( j = 0, m = toRemove.length; j < m; j++ ) {
						// TODO use an equal-method to compare objects, to allow custom matching on primary keys etc.
						if ( toRemove[ j ] === this.data[ i ] ) {
							removed.push({
								index: i,
								item: this.data[ j ]
							});
							break;
						}
					}
				}
				var removals = 0;
				for ( i = 0, l = removed.length; i < l; i++ ) {
					this.data.splice( removed[ i ].index - removals, 1 );
					removals += 1;
				}
				return this.trigger( "remove", { items: removed } );
			}
			if ( $.type( index ) === "object" ) {
				numToRemove = 1;
				for ( var i = 0, l = this.data.length; i < l; i++ ) {
					// TODO same as above
					if ( this.data[ i ] === index) {
						index = i;
						break;
					}
				}

			}
			if ( !numToRemove ) {
				numToRemove = 1;
			}
			var items = this.data.slice( index, index + numToRemove );
			this.data.splice( index, numToRemove );
			// TODO update event data, along with support for removing array of objects
			return this.trigger( "remove", { index: index, items: items } );
		},

		refresh: function( newItems ) {
			return this.trigger( "refresh" );
		}
	};

	$.each({ bind: "bind", unbind: "unbind", trigger: "triggerHandler" }, function( from, to ) {
		$.observable.prototype[ from ] = function() {
			var wrapped = $([ this.data ]);
			wrapped[ to ].apply( wrapped, arguments );
			return this;
		};
	});

})(jQuery);
