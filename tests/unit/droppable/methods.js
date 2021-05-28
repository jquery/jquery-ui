define( [
	"qunit",
	"jquery",
	"lib/helper",
	"./helper",
	"ui/widgets/droppable"
], function( QUnit, $, helper, testHelper ) {

QUnit.module( "droppable: methods", { afterEach: helper.moduleAfterEach }  );

QUnit.test( "init", function( assert ) {
	assert.expect( 5 );

	$( "<div></div>" ).appendTo( "body" ).droppable().remove();
	assert.ok( true, ".droppable() called on element" );

	$( [] ).droppable();
	assert.ok( true, ".droppable() called on empty collection" );

	$( "<div></div>" ).droppable();
	assert.ok( true, ".droppable() called on disconnected DOMElement" );

	$( "<div></div>" ).droppable().droppable( "option", "foo" );
	assert.ok( true, "arbitrary option getter after init" );

	$( "<div></div>" ).droppable().droppable( "option", "foo", "bar" );
	assert.ok( true, "arbitrary option setter after init" );
} );

QUnit.test( "destroy", function( assert ) {
	assert.expect( 4 );

	$( "<div></div>" ).appendTo( "body" ).droppable().droppable( "destroy" ).remove();
	assert.ok( true, ".droppable('destroy') called on element" );

	$( [] ).droppable().droppable( "destroy" );
	assert.ok( true, ".droppable('destroy') called on empty collection" );

	$( "<div></div>" ).droppable().droppable( "destroy" );
	assert.ok( true, ".droppable('destroy') called on disconnected DOMElement" );

	var expected = $( "<div></div>" ).droppable(),
		actual = expected.droppable( "destroy" );
	assert.equal( actual, expected, "destroy is chainable" );
} );

QUnit.test( "enable", function( assert ) {
	assert.expect( 7 );

	var el, expected, actual;

	el = $( "#droppable1" ).droppable( { disabled: true } );
	testHelper.shouldNotDrop( assert );
	el.droppable( "enable" );
	testHelper.shouldDrop( assert );
	assert.equal( el.droppable( "option", "disabled" ), false, "disabled option getter" );
	el.droppable( "destroy" );
	el.droppable( { disabled: true } );
	testHelper.shouldNotDrop( assert );
	el.droppable( "option", "disabled", false );
	assert.equal( el.droppable( "option", "disabled" ), false, "disabled option setter" );
	testHelper.shouldDrop( assert );

	expected = $( "<div></div>" ).droppable(),
	actual = expected.droppable( "enable" );
	assert.equal( actual, expected, "enable is chainable" );
} );

QUnit.test( "disable", function( assert ) {
	assert.expect( 10 );

	var actual, expected,
		element = $( "#droppable1" ).droppable( { disabled: false } );

	testHelper.shouldDrop( assert );
	element.droppable( "disable" );
	testHelper.shouldNotDrop( assert );
	assert.equal( element.droppable( "option", "disabled" ), true, "disabled option getter" );
	element.droppable( "destroy" );
	element.droppable( { disabled: false } );
	testHelper.shouldDrop( assert );
	element.droppable( "option", "disabled", true );
	assert.lacksClasses( element.droppable( "widget" ), "ui-state-disabled" );
	assert.ok( !element.droppable( "widget" ).attr( "aria-disabled" ), "element does not get aria-disabled" );
	assert.hasClasses( element.droppable( "widget" ), "ui-droppable-disabled" );
	assert.equal( element.droppable( "option", "disabled" ), true, "disabled option setter" );
	testHelper.shouldNotDrop( assert );

	expected = $( "<div></div>" ).droppable();
	actual = expected.droppable( "disable" );
	assert.equal( actual, expected, "disable is chainable" );
} );

} );
