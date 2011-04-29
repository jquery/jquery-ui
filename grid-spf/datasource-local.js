(function ($, undefined ) {

// custom datasource for local paging/sorting/filter, accepts a input option
$.widget( "ui.localDatasource", $.ui.datasource, {
	// all datasource implementations share a common event prefix
	widgetEventPrefix: "datasource",
	_create: function() {
		var that = this;
		this.options.source = function( request, response) {
			var sortedItems = that._sort( that._filter( that.options.input ) );
			response( that._page( sortedItems ), sortedItems.length );
		}
		this.refresh();
	},
	_filter: function( items ) {
		if ( this.options.filter ) {
			var that = this;
			return $.grep( items, function ( item ) { 
				var property,
					filter,
					match = true;
	            for ( property in that.options.filter ) {
					filter = that.options.filter[ property ];
					match &= that._match( item[ property ], filter );
				}
				return match;
	        });
        } else {
			// copy input array to avoid sorting original
			// TODO need this only when actually sorting, not for paging, which slices anyway
            return $.makeArray( items );
        }
	},
	_match: function( value, filter ) {
		var operator = filter.operator || "==",
			operand = filter.value || filter;
		switch (operator || "==") {
            case "==": return value == operand;
            case "!=": return value != operand;
            case "<": return value < operand;
            case "<=": return value <= operand;
            case ">": return value > operand;
            case ">=": return value >= operand;
			case "like": return new RegExp( operand.replace( /[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&" ), "i" ).test( value )
            default: throw "Unrecognized filter operator: " + operator + " for operand " + operand;
        }
	},
	_sort: function( items ) {
		// TODO some bug(s) in here, see grid.html and sort on all three columns, then remove the first one
		function sorter( property, secondary ) {
			var order = property.charAt( 0 ) == "-" ? -1 : 1;
			return function ( item1, item2 ) {
                var value1 = item1[ property ],
                    value2 = item2[ property ];
                if ( value1 == value2 ) {
					if ( secondary.length ) {
						var next = secondary[ 0 ]
						return sorter( next, secondary.slice( 1 ) )( item1, item2 );
					} else {
						return 0;
					}
				}
				return order * ( value1 > value2 ? 1 : -1 );
            }
		}
		if ( this.options.sort.length ) {
			var sorts = this.options.sort;
			var first = sorts[ 0 ];
        	return items.sort( sorter( first, sorts.slice( 1 ) ) );
        } else {
            return items;
        }
	},
	_page: function( items ) {
		var paging = this.options.paging,
			limit = paging.limit || items.length;
		return items.slice( paging.offset, paging.offset + limit );
	}
});

})(jQuery);
