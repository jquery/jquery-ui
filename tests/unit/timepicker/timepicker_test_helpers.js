jQuery.extend( TestHelpers, {
	// helper funciton to quick "press" a key - keydown/keyup
	downup: function( element, key ) {
		element.simulate( "keydown", { keyCode: key } );
		element.simulate( "keyup", { keyCode: key } );
	},

	press: function( element, key ) {
		var code = key.charCodeAt( 0 );

		element.simulate( "keypress", {
			charCode: code,
			which: code
		});
	},

	focus: function( element ) {
		var triggered = false;

		function trigger() {
			triggered = true;
		}

		element.bind( "focus", trigger );
		element[ 0 ].focus();

		if ( !triggered ) {
			element.triggerHandler( "focus" );
		}
		element.unbind( "focus", trigger );
	},

	blur: function( element ) {
		var triggered = false;

		function trigger() {
			triggered = true;
		}

		element.bind( "blur", trigger );
		element[ 0 ].blur();

		// Some versions of IE don't actually .blur() on an element - so we focus the body
		if ( element[ 0 ].ownerDocument.activeElement === element[ 0 ] ) {
			element[ 0 ].ownerDocument.body.focus();
		}

		if ( !triggered ) {
			element.triggerHandler( "blur" );
		}
		element.unbind( "blur", trigger );
	}
	
});
