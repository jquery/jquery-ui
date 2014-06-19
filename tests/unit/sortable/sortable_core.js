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

asyncTest( "#3173: Sortable: connected sortables do not scroll on transfer", function() {
	expect( 1 );

	var element1 = $( "#sortable" ).sortable({
			connectWith: "#sortable2"
		}),
		element2 = $( "#sortable2" ).sortable({
			connectWith: "#sortable"
		}),
		item = element1.find( "li" ).eq( 0 );

	element1.css({"height": "90px", "overflow": "hidden"});
	element2.css({"height": "90px", "overflow-y": "scroll", "overflow-x": "hidden"});

	item.simulate( "drag", {
		dy: 175,
		dx: 0
	});

	setTimeout(function() {
		var top = element2.scrollTop();
		ok( top > 0, "sortable list scrolls down" );
		start();
	}, 200 );  
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
