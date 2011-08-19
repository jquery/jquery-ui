$.widget("spf.menugrid", {
	_create: function() {
		var source = this.element.data("grid").options.source;
		this.element.find( "th" ).each(function() {
			var header = $( this ),
				field = header.data( "field" );
			var menu = $( "#menu-tmpl" ).tmpl().appendTo( this ).menu({
				select: function( event, ui ) {
					source
						.option( "sort",
							ui.item.find( "a" ).data( "sort" ) === "asc" ? field : "-" + field )
						.refresh();
					menu.hide();
				}
			}).popup({
				trigger: header
			});
		});

		var thead = this.element.find( "thead" );
		var inputs = thead.children()
			.clone()
			.insertAfter( thead )
			.find( "th" )
				.removeAttr("tabindex")
				.each(function() {
					$( "<input>" ).appendTo( $( this ).empty() );
				});

		inputs.find( "input" ).bind( "change", function() {
			var head = $( this ).parent(),
				field = head.data( "field" ),
				type = head.data( "type" ),
				value = this.value,
				operator;

			if ( /^[<>]=?/.test( value ) ) {
				operator = value.replace( /^([<>]=?).+/, "$1" );
				value = value.substring( operator.length );
				value = value == null || isNaN( value ) ? "" : value;
			}
			if ( type === "number" ) {
				value = parseFloat( value );
				operator = operator || "==";
			}
			if ( type === "string" ) {
				operator = "like";
			}
			if ( value ) {
				source.option( "filter." + field, {
					operator: operator,
					value: value
				});
			} else {
				source.option( "filter." + field, null );
			}
			source.refresh();
		});
	}
});
