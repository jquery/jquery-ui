define( [
	"jquery",
	"./helper",
	"ui/sortable"
], function( $, testHelper ) {

module( "sortable: core" );

test( "#9314: Sortable: Items cannot be dragged directly into bottom position", function() {
	expect( 1 );

	var el = $( ".connectWith" ).sortable({
			connectWith: ".connectWith"
		});

	testHelper.sort( $( "li", el[ 1 ] )[ 0 ], 0, -12, 5, "Dragging the sortable into connected sortable" );
});

test( "ui-sortable-handle applied to appropriate element", function( assert ) {
	expect( 8 );
	var item = "<li><p></p></li>",
		el = $( "<ul>" + item + item + "</ul>" )
			.sortable()
			.appendTo( "#qunit-fixture" );

	assert.hasClasses( el.find( "li:first" ), "ui-sortable-handle" );
	assert.hasClasses( el.find( "li:last" ), "ui-sortable-handle" );

	el.sortable( "option", "handle", "p" );
	assert.lacksClasses( el.find( "li" )[ 0 ], "ui-sortable-handle" );
	assert.lacksClasses( el.find( "li" )[ 1 ], "ui-sortable-handle" );
	assert.hasClasses( el.find( "p" )[ 0 ], "ui-sortable-handle" );
	assert.hasClasses( el.find( "p" )[ 1 ], "ui-sortable-handle" );

	el.append( item ).sortable( "refresh" );
	assert.hasClasses( el.find( "p:last" ), "ui-sortable-handle" );

	el.sortable( "destroy" );
	equal( el.find( ".ui-sortable-handle" ).length, 0, "class name removed on destroy" );
});

} );
