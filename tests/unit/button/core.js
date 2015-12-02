define( [
	"jquery",
	"ui/safe-active-element",
	"ui/widgets/button"
], function( $ ) {

module( "Button: core" );

asyncTest( "Disabled button loses focus", function() {
	expect( 2 );
	var element = $( "#button" ).button();

	element.focus();
	setTimeout( function() {

		equal( element[ 0 ], $.ui.safeActiveElement( document ), "Button is focused" );

		element.button( "disable" );
		notEqual( element[ 0 ], $.ui.safeActiveElement( document ), "Button has had focus removed" );
		start();
	} );
} );

} );
