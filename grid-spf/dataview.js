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

	// TODO subwidgets override _create, should we force them to call _super("_create")?
	// or is there a way to have a constructor along with _create?
	// _init is probably safe here, as this shouldn't get called as a widget anyway
	_init: function() {
		this.result = [];
	},

	// TODO this needs to be applied to init options as well, to make sort: "prop" work
	_setOption: function( key, value ) {
		// reset offset to 0 when changing limit
		// TODO actually only necessary when offset > offset + new limit
		// in other words, when on a page that won't exist anymore after the limit change
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
		this._super( "_setOption", key, value );
	},

	page: function( pageIndex ) {
		var limit = this.options.paging.limit;
		if ( pageIndex !== undefined ) {
			this.option( "paging.offset", pageIndex * limit - limit );
		}
		return Math.ceil( this.options.paging.offset / limit + 1 );
	},

	totalPages: function() {
		return Math.ceil( this.totalCount / this.options.paging.limit );
	},

	refresh: function( callback ) {
		if ( callback ) {
			this.element.one( "dataviewresponse", callback );
		}
		this._trigger( "request" );

		var request = $.extend( {}, this.options, {
			page: this.page()
		});
		var that = this;
		this.options.source( request, function( data, totalCount ) {
			that.totalCount = parseInt(totalCount, 10);
			$.observable( that.result ).replaceAll( data );
			that._trigger( "response" );
		});
        return this;
	}
});

}( jQuery ) );
