(function( $ ) {

module( "core - deprecated" );

asyncTest( "focus - original functionality", function() {
	expect( 1 );
	$( "#inputTabindex0" )
		.one( "focus", function() {
			ok( true, "event triggered" );
			start();
		})
		.focus();
});

asyncTest( "focus", function() {
	expect( 2 );

	// support: IE 8
	// IE sometimes gets confused about what's focused if we don't explicitly
	// focus a different element first
	$( "body" ).focus();

	$( "#inputTabindex0" )
		.one( "focus", function() {
			ok( true, "event triggered" );
			start();
		})
		.focus( 500, function() {
			ok( true, "callback triggered" );
		});
});

test( "zIndex", function() {
	expect( 7 );
	var el = $( "#zIndexAutoWithParent" ),
		parent = el.parent();
	equal( el.zIndex(), 100, "zIndex traverses up to find value" );
	equal( parent.zIndex(200 ), parent, "zIndex setter is chainable" );
	equal( el.zIndex(), 200, "zIndex setter changed zIndex" );

	el = $( "#zIndexAutoWithParentViaCSS" );
	equal( el.zIndex(), 0, "zIndex traverses up to find CSS value, not found because not positioned" );

	el = $( "#zIndexAutoWithParentViaCSSPositioned" );
	equal( el.zIndex(), 100, "zIndex traverses up to find CSS value" );
	el.parent().zIndex( 200 );
	equal( el.zIndex(), 200, "zIndex setter changed zIndex, overriding CSS" );

	equal( $( "#zIndexAutoNoParent" ).zIndex(), 0, "zIndex never explicitly set in hierarchy" );
});

})( jQuery );
