define( [
	"qunit",
	"jquery",
	"./helper",
	"ui/widgets/sortable"
], function( QUnit, $, testHelper ) {

QUnit.module( "sortable: methods" );

QUnit.test( "init", function( assert ) {
	assert.expect( 5 );

	$( "<div></div>" ).appendTo( "body" ).sortable().remove();
	assert.ok( true, ".sortable() called on element" );

	$( [] ).sortable();
	assert.ok( true, ".sortable() called on empty collection" );

	$( "<div></div>" ).sortable();
	assert.ok( true, ".sortable() called on disconnected DOMElement" );

	$( "<div></div>" ).sortable().sortable( "option", "foo" );
	assert.ok( true, "arbitrary option getter after init" );

	$( "<div></div>" ).sortable().sortable( "option", "foo", "bar" );
	assert.ok( true, "arbitrary option setter after init" );
} );

QUnit.test( "destroy", function( assert ) {
	assert.expect( 4 );
	$( "<div></div>" ).appendTo( "body" ).sortable().sortable( "destroy" ).remove();
	assert.ok( true, ".sortable('destroy') called on element" );

	$( [] ).sortable().sortable( "destroy" );
	assert.ok( true, ".sortable('destroy') called on empty collection" );

	$( "<div></div>" ).sortable().sortable( "destroy" );
	assert.ok( true, ".sortable('destroy') called on disconnected DOMElement" );

	var expected = $( "<div></div>" ).sortable(),
		actual = expected.sortable( "destroy" );
	assert.equal( actual, expected, "destroy is chainable" );
} );

QUnit.test( "enable", function( assert ) {
	assert.expect( 5 );

	var el, actual, expected;

	el = $( "#sortable" ).sortable( { disabled: true } );

	testHelper.sort( assert, $( "li", el )[ 0 ], 0, 44, 0, ".sortable({ disabled: true })" );

	el.sortable( "enable" );
	assert.equal( el.sortable( "option", "disabled" ), false, "disabled option getter" );

	el.sortable( "destroy" );
	el.sortable( { disabled: true } );
	el.sortable( "option", "disabled", false );
	assert.equal( el.sortable( "option", "disabled" ), false, "disabled option setter" );

	testHelper.sort( assert, $( "li", el )[ 0 ], 0, 44, 2, ".sortable('option', 'disabled', false)" );

	expected = $( "<div></div>" ).sortable(),
	actual = expected.sortable( "enable" );
	assert.equal( actual, expected, "enable is chainable" );
} );

QUnit.test( "disable", function( assert ) {
	assert.expect( 9 );

	var chainable,
		element = $( "#sortable" ).sortable( { disabled: false } );

	testHelper.sort( assert, $( "li", element )[ 0 ], 0, 44, 2, ".sortable({ disabled: false })" );

	chainable = element.sortable( "disable" );
	testHelper.sort( assert, $( "li", element )[ 0 ], 0, 44, 0, "disabled.sortable getter" );

	element.sortable( "destroy" );

	element.sortable( { disabled: false } );
	testHelper.sort( assert, $( "li", element )[ 0 ], 0, 44, 2, ".sortable({ disabled: false })" );
	element.sortable( "option", "disabled", true );
	assert.equal( element.sortable( "option", "disabled" ), true, "disabled option setter" );

	assert.lacksClasses( element.sortable( "widget" ), "ui-state-disabled" );
	assert.ok( !element.sortable( "widget" ).attr( "aria-disabled" ), "element does not get aria-disabled" );
	assert.hasClasses( element.sortable( "widget" ), "ui-sortable-disabled" );

	testHelper.sort( assert, $( "li", element )[ 0 ], 0, 44, 0, ".sortable('option', 'disabled', true)" );
	assert.equal( chainable, element, "disable is chainable" );
} );

QUnit.test( "refresh() should update the positions of initially empty lists (see #7498)", function( assert ) {
	assert.expect( 1 );

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

	assert.equal( changeCount, 1 );
} );

} );
