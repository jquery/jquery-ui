$.widget("spf.gridFilter", {
	_create: function() {
		var grid = this.grid = this.element.data("grid");
		var options = grid.options;
		var source = grid.options.source;
		this._bind( source, {
			dataviewresponse: "_updateFilterValues"
		});

		var thead = grid.uiGridHeadTable.find( "thead" );
		var inputs = this.inputs = thead.children(":has(th)")
			.clone()
			.appendTo( thead )
			.find( "th" )
				.removeAttr("tabindex")
				.each(function() {
					$( "<input>" ).appendTo( $( this ).empty() );
				})
				.find( "input" );

		inputs.bind( "change", function() {
			var column = options.columns[ this.parentNode.cellIndex ],
				value = this.value,
				operator;

			if ( /^[<>]=?/.test( value ) ) {
				operator = value.replace( /^([<>]=?).+/, "$1" );
				value = value.substring( operator.length );
			} else if ( column.type === "number" ) {
				// avoid Like operator for numbers
				operator = "==";
			}
			if ( value != null && value.length ) {
				source.option( "filter." + column.property, {
					operator: operator,
					value: value
				});
			} else {
				source.option( "filter." + column.property, null );
			}
			source.refresh();
		});
	},
	_updateFilterValues: function() {
		var options = this.grid.options;
		if (options.source.options.filter) {
			var filters = options.source.options.filter;
			this.inputs.each( function() {
				var column = options.columns[ this.parentNode.cellIndex ];
				for ( property in filters ) {
					if ( property == column.property ) {
						var filter = filters[property];
						var output = filter.value;
						if ( filter.operator && !/like|==/.test(filter.operator) ) {
							output = filter.operator + output;
						}
						$( this ).val( output );
					}
				}
			});
		} else {
			this.inputs.val("");
		}
	}
});
