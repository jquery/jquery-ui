/*
 * Dataview
 *
 * Depends on:
 * widget
 * observable
 */
(function( $ ) {

$.widget( "ui.dataview", {
	defaultElement: null,
	options: {
		sort: [],
		paging: {
			limit: null,
			offset: 0
		},
		filter: null
	},

	_init: function() {
		// normalize options
		this.option(this.options);
		this.result = [];
	},

	_setOption: function( key, value ) {
		// reset offset to 0 when changing limit
		if ( key === "paging" && value.limit !== this.options.paging.limit ) {
			value.offset = 0;
		}

		if ( key === "sort" && value && !$.isArray( value ) ) {
			value = [value];
		}

		// remove filters when setting their value to null
		if ( key === "filter" ) {
			for ( var filter in value) {
				if ( value[ filter ] === null ) {
					delete value[ filter ];
				}
			}
			if ( $.isEmptyObject( value ) ) {
				value = null;
			}
		}
		this._super( key, value );
	},

	page: function( pageIndex ) {
		var limit = this.options.paging.limit;
		if ( pageIndex !== undefined ) {
			this.option( "paging.offset", pageIndex * limit - limit );
			return this;
		}
		return Math.ceil( this.options.paging.offset / limit + 1 );
	},

	totalPages: function() {
		return Math.ceil( this.totalCount / this.options.paging.limit );
	},

	// TODO need reasonable signatures/names for callback and error.
	refresh: function( callback, error ) {
		this._trigger( "request" );

		var request = $.extend( {}, this.options, {
			page: this.page()
		});

		var that = this;
		this.options.source( request, function( data, totalCount ) {
			that.totalCount = parseInt(totalCount, 10);
			$.observable( that.result ).replaceAll( data );
			that._trigger( "response" );
			if (callback) {
				callback.apply(that, arguments);
			}
		}, function () {
			if (error) {
				error.apply(that, arguments);
			}
		});
        return this;
	}
});

}( jQuery ) );
