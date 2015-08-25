define( [
	"jquery",
	"./helper",
	"ui/widgets/sortable"
], function( $, testHelper ) {

module( "sortable: methods" );

test( "init", function() {
	expect( 5 );

	$( "<div></div>" ).appendTo( "body" ).sortable().remove();
	ok( true, ".sortable() called on element" );

	$( [] ).sortable();
	ok( true, ".sortable() called on empty collection" );

	$( "<div></div>" ).sortable();
	ok( true, ".sortable() called on disconnected DOMElement" );

	$( "<div></div>" ).sortable().sortable( "option", "foo" );
	ok( true, "arbitrary option getter after init" );

	$( "<div></div>" ).sortable().sortable( "option", "foo", "bar" );
	ok( true, "arbitrary option setter after init" );
} );

test( "destroy", function() {
	expect( 4 );
	$( "<div></div>" ).appendTo( "body" ).sortable().sortable( "destroy" ).remove();
	ok( true, ".sortable('destroy') called on element" );

	$( [] ).sortable().sortable( "destroy" );
	ok( true, ".sortable('destroy') called on empty collection" );

	$( "<div></div>" ).sortable().sortable( "destroy" );
	ok( true, ".sortable('destroy') called on disconnected DOMElement" );

	var expected = $( "<div></div>" ).sortable(),
		actual = expected.sortable( "destroy" );
	equal( actual, expected, "destroy is chainable" );
} );

test( "enable", function() {
	expect( 5 );

	var el, actual, expected;

	el = $( "#sortable" ).sortable( { disabled: true } );

	testHelper.sort( $( "li", el )[ 0 ], 0, 44, 0, ".sortable({ disabled: true })" );

	el.sortable( "enable" );
	equal( el.sortable( "option", "disabled" ), false, "disabled option getter" );

	el.sortable( "destroy" );
	el.sortable( { disabled: true } );
	el.sortable( "option", "disabled", false );
	equal( el.sortable( "option", "disabled" ), false, "disabled option setter" );

	testHelper.sort( $( "li", el )[ 0 ], 0, 44, 2, ".sortable('option', 'disabled', false)" );

	expected = $( "<div></div>" ).sortable(),
	actual = expected.sortable( "enable" );
	equal( actual, expected, "enable is chainable" );
} );

test( "disable", function( assert ) {
	expect( 9 );

	var chainable,
		element = $( "#sortable" ).sortable( { disabled: false } );

	testHelper.sort( $( "li", element )[ 0 ], 0, 44, 2, ".sortable({ disabled: false })" );

	chainable = element.sortable( "disable" );
	testHelper.sort( $( "li", element )[ 0 ], 0, 44, 0, "disabled.sortable getter" );

	element.sortable( "destroy" );

	element.sortable( { disabled: false } );
	testHelper.sort( $( "li", element )[ 0 ], 0, 44, 2, ".sortable({ disabled: false })" );
	element.sortable( "option", "disabled", true );
	equal( element.sortable( "option", "disabled" ), true, "disabled option setter" );

	assert.lacksClasses( element.sortable( "widget" ), "ui-state-disabled" );
	ok( !element.sortable( "widget" ).attr( "aria-disabled" ), "element does not get aria-disabled" );
	assert.hasClasses( element.sortable( "widget" ), "ui-sortable-disabled" );

	testHelper.sort( $( "li", element )[ 0 ], 0, 44, 0, ".sortable('option', 'disabled', true)" );
	equal( chainable, element, "disable is chainable" );
} );

test( "refresh() should update the positions of initially empty lists (see #7498)", function() {
	expect( 1 );

	var changeCount = 0,
		element = $( "#qunit-fixture" ).html( "<ul></ul>" ).find( "ul" );

	element
		.css( {
			"float": "left",
			width: "100px"
		} )
		.sortable( {
			change: function() {
				changeCount++;
			}
		} )
		.append( "<li>a</li><li>a</li>" )
		.find( "li" )
			.css( {
				"float": "left",
				width: "50px",
				height: "50px"
			} );

	element.sortable( "refresh" );

	// Switch the order of the two li elements
	element.find( "li" ).eq( 0 ).simulate( "drag", {
		dx: 55,
		moves: 15
	} );

	equal( changeCount, 1 );
} );

} );
