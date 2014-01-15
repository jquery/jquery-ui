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
	expect( 6 );
	var item = "<li><p></p></li>",
		el = $( "<ul>" + item + item + "</ul>" )
			.sortable()
			.appendTo( "#qunit-fixture" );

	ok( el.find( "li:first" ).hasClass( "ui-sortable-handle" ), "defaults to item" );
	ok( el.find( "li:last" ).hasClass( "ui-sortable-handle" ), "both items received class name" );

	el.sortable( "option", "handle", "p" );
	ok( !el.find( "li" ).hasClass( "ui-sortable-handle" ), "removed on change" );
	ok( el.find( "p" ).hasClass( "ui-sortable-handle" ), "applied to handle" );

	el.append( item ).sortable( "refresh" );
	ok( el.find( "p:last" ).hasClass( "ui-sortable-handle" ), "class name applied on refresh" );

	el.sortable( "destroy" );
	equal( el.find( ".ui-sortable-handle" ).length, 0, "class name removed on destroy" );
});

})( jQuery );
