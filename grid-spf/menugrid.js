// TODO cleanup/refactor!
// fix string-filter, don't show "like[filter]"
$.widget("spf.menugrid", $.ui.grid, {
	_create: function() {
		this._superApply("_create", arguments);
		this.element.addClass("menugrid");
		var options = this.options;
		var source = this.options.source;
		var that = this;
		source.element.bind("dataviewresponse", function() {
			that._updateFilterValues();
			that.refresh();
		});
		var headers = this.element.find( "th" );
		this._hoverable( headers );
		headers.disableSelection().click( function() {
			headers.not( this ).removeClass( "sorted sorted-desc" );
			var column = options.columns[ this.cellIndex ];
			var sorted = $(this).hasClass("sorted");
			$( this ).toggleClass("sorted", !sorted).toggleClass("sorted-desc", sorted);
			source
				.option( "sort", ( sorted ? "-" : "" ) + column.property )
				.refresh();
		}).append( '<span class="ui-icon-asc ui-icon ui-icon-carat-1-n"></span><span class="ui-icon-desc ui-icon ui-icon-carat-1-s"></span>' );

		var thead = this.element.find( "thead" );
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
		var options = this.options;
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
	},
	_toArray: function() {
		return this.options.source.result;
	}
});
