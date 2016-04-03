define( [
	"qunit",
	"jquery",
	"./helper",
	"ui/widgets/draggable"
], function( QUnit, $, testHelper ) {

var element;

QUnit.module( "draggable: methods", {
	beforeEach: function() {
		element = $( "<div style='background: green; width: 200px; height: 100px; position: absolute; top: 10px; left: 10px;'><span>Absolute</span></div>" ).appendTo( "#qunit-fixture" );
	},
	afterEach: function() {
		element.remove();
	}
} );

QUnit.test( "init", function( assert ) {
	assert.expect( 5 );

	element.draggable();
	assert.ok( true, ".draggable() called on element" );

	$( [] ).draggable();
	assert.ok( true, ".draggable() called on empty collection" );

	$( "<div></div>" ).draggable();
	assert.ok( true, ".draggable() called on disconnected DOMElement" );

	element.draggable( "option", "foo" );
	assert.ok( true, "arbitrary option getter after init" );

	element.draggable( "option", "foo", "bar" );
	assert.ok( true, "arbitrary option setter after init" );
} );

QUnit.test( "destroy", function( assert ) {
	assert.expect( 4 );

	element.draggable().draggable( "destroy" );
	assert.ok( true, ".draggable('destroy') called on element" );

	$( [] ).draggable().draggable( "destroy" );
	assert.ok( true, ".draggable('destroy') called on empty collection" );

	element.draggable().draggable( "destroy" );
	assert.ok( true, ".draggable('destroy') called on disconnected DOMElement" );

	var expected = element.draggable(),
		actual = expected.draggable( "destroy" );
	assert.equal( actual, expected, "destroy is chainable" );
} );

QUnit.test( "enable", function( assert ) {
	assert.expect( 11 );

	element.draggable( { disabled: true } );
	testHelper.shouldNotDrag( assert, element, ".draggable({ disabled: true })" );

	element.draggable( "enable" );
	testHelper.shouldMove( assert, element, ".draggable('enable')" );
	assert.equal( element.draggable( "option", "disabled" ), false, "disabled option getter" );

	element.draggable( "destroy" );
	element.draggable( { disabled: true } );
	testHelper.shouldNotDrag( assert, element, ".draggable({ disabled: true })" );

	element.draggable( "option", "disabled", false );
	assert.equal( element.draggable( "option", "disabled" ), false, "disabled option setter" );
	testHelper.shouldMove( assert, element, ".draggable('option', 'disabled', false)" );

	var expected = element.draggable(),
		actual = expected.draggable( "enable" );
	assert.equal( actual, expected, "enable is chainable" );
} );

QUnit.test( "disable", function( assert ) {
	assert.expect( 14 );

	element = $( "#draggable2" ).draggable( { disabled: false } );
	testHelper.shouldMove( assert, element, ".draggable({ disabled: false })" );

	element.draggable( "disable" );
	testHelper.shouldNotDrag( assert, element, ".draggable('disable')" );
	assert.equal( element.draggable( "option", "disabled" ), true, "disabled option getter" );

	element.draggable( "destroy" );
	element.draggable( { disabled: false } );
	testHelper.shouldMove( assert, element, ".draggable({ disabled: false })" );

	element.draggable( "option", "disabled", true );
	assert.equal( element.draggable( "option", "disabled" ), true, "disabled option setter" );
	testHelper.shouldNotDrag( assert, element, ".draggable('option', 'disabled', true)" );

	assert.lacksClasses( element.draggable( "widget" ), "ui-state-disabled" );
	assert.ok( !element.draggable( "widget" ).attr( "aria-disabled" ), "element does not get aria-disabled" );
	assert.hasClasses( element.draggable( "widget" ), "ui-draggable-disabled" );

	var expected = element.draggable(),
		actual = expected.draggable( "disable" );
	assert.equal( actual, expected, "disable is chainable" );
} );

} );
