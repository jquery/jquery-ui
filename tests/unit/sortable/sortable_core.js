/*
 * sortable_core.js
 */

(function( $ ) {

module( "sortable: core" );

test( "#9314: Sortable: Items cannot be dragged directly into bottom position", function() {
	expect( 1 );

	var el = $( ".connectWith" ).sortable({
			connectWith: ".connectWith"
		});

	TestHelpers.sortable.sort( $( "li", el[ 1 ] )[ 0 ], 0, -12, 5, "Dragging the sortable into connected sortable" );
});

})( jQuery );
