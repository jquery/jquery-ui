(function( $ ) {

module( "core - deprecated" );

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
