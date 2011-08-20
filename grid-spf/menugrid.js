$.widget("spf.menugrid", {
	_create: function() {
		var grid = this.element.data( "grid" );
		var source = grid.options.source;
		var headers = this.element.find( "th" );
		this._hoverable( headers );
		headers.click( function() {
			headers.not( this ).removeClass( "sorted sorted-desc" );
			var column = grid.options.columns[ this.cellIndex ];
			var sorted = $(this).hasClass("sorted");
			$( this ).toggleClass("sorted", !sorted).toggleClass("sorted-desc", sorted);
			source
				.option( "sort", ( sorted ? "-" : "" ) + column.property )
				.refresh();
		}).append( '<span class="ui-icon-asc ui-icon ui-icon-carat-1-n"></span><span class="ui-icon-desc ui-icon ui-icon-carat-1-s"></span>' );

		var thead = this.element.find( "thead" );
		var inputs = thead.children(":has(th)")
			.clone()
			.appendTo( thead )
			.find( "th" )
				.removeAttr("tabindex")
				.each(function() {
					$( "<input>" ).appendTo( $( this ).empty() );
				})
				.find( "input" );

		inputs.bind( "change", function() {
			var column = grid.options.columns[ this.parentNode.cellIndex ],
				value = this.value,
				operator;

			if ( /^[<>]=?/.test( value ) ) {
				operator = value.replace( /^([<>]=?).+/, "$1" );
				value = value.substring( operator.length );
				value = value == null || isNaN( value ) ? "" : value;
			}
			if ( column.type === "number" ) {
				value = parseFloat( value );
				operator = operator || "==";
			}
			if ( column.type === "string" ) {
				operator = "like";
			}
			if ( value ) {
				source.option( "filter." + column.property, {
					operator: operator,
					value: value
				});
			} else {
				source.option( "filter." + column.property, null );
			}
			source.refresh();
		})

		function updateFilterValues() {
			if (source.options.filter) {
				var filters = source.options.filter;
				inputs.each( function() {
					var column = grid.options.columns[ this.parentNode.cellIndex ];
					for ( property in filters ) {
						if ( property == column.property ) {
							var filter = filters[property];
							var output = filter.value;
							if ( filter.operator !== "==" ) {
								output = filter.operator + output;
							}
							$( this ).val( output );
						}
					}
				});
			} else {
				inputs.val("");
			}
		}
		source.element.bind( "datasourcerequest", updateFilterValues );
		updateFilterValues();
	}
});
