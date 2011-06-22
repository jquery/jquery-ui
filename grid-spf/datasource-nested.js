(function ($, undefined ) {

// TODO cache should be per-instance?
var cache = {};
$.widget( "ui.nestedDatasource", $.ui.datasource, {
	widgetEventPrefix: "datasource",
	options: {
		remote: null
	},

	_create: function() {
		var options = this.options;
		options.source = function( request, response ) {
			var i, length,
				cached = true,
				tags = request.filter,
				pageSize = request.paging.limit,
				page = request.page,
				start = ( page - 1 ) * pageSize,
				lastPage = start + pageSize === (cache[ tags ] && cache[ tags ].length);

			if ( !cache[ tags ] ) {
				cache[ tags ] = [];
			}

			// check if we have cached data
			for ( i = start; i < start + pageSize; i++ ) {
				if ( !cache[ tags ][ i ] ) {
					cached = false;
					break;
				}
			}

			if ( cached ) {
				response( cache[ tags ].slice( start, start + pageSize ), cache[ tags ].total );
				// let through to preload next batch when on last page
				if ( !lastPage ) {
					return;
				}
			}

			options.remote.refresh(function() {
				var total = cache[ tags ].total = options.remote.totalCount;
				var data = options.remote.toArray();
				for ( i = 0, length = data.length; i < length; i++ ) {
					cache[ tags ][ start + i ] = data[ i ];
				}
				if ( !cached && !lastPage ) {
					response( data.slice( 0, pageSize ), total );
				}
			});
		};
		this._super( "_create" );
	},

	_setOptions: function( options ) {
		if ( "filter" in options ) {
			this.options.remote.option( "filter", options.filter );
		}
		if ( "paging" in options ) {
			this.options.remote.option( "paging", {
				limit: ( "limit" in options.paging ?
					options.paging.limit : this.options.paging.limit ) * 5,
				offset: ( "offset" in options.paging ?
					options.paging.offset : this.options.paging.offset )
			});
		}
		this._super( "_setOptions", options );
	}
});

})(jQuery);
