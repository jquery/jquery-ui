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

test( "ui-sortable-handle applied to appropriate element", function() {
	expect( 4 );
	var el = $( "<ul><li><p></p></li></ul>" )
		.sortable().appendTo( "#qunit-fixture" );

	ok( el.find( "li" ).hasClass( "ui-sortable-handle"), "defaults to item" );

	el.sortable( "option", "handle", "p" );
	ok( !el.find( "li" ).hasClass( "ui-sortable-handle"), "removed on change" );
	ok( el.find( "p" ).hasClass( "ui-sortable-handle"), "applied to handle" );

	el.sortable( "destroy");
	equal( el.find( ".ui-sortable-handle" ).length, 0, "class name removed on destroy" );
});

})( jQuery );
