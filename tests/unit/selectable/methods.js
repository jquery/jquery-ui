define( [
	"qunit",
	"jquery",
	"lib/helper",
	"ui/widgets/selectable"
], function( QUnit, $, helper ) {

QUnit.module( "selectable: methods", { afterEach: helper.moduleAfterEach }  );

QUnit.test( "init", function( assert ) {
	assert.expect( 5 );

	$( "<div></div>" ).appendTo( "body" ).selectable().remove();
	assert.ok( true, ".selectable() called on element" );

	$( [] ).selectable().remove();
	assert.ok( true, ".selectable() called on empty collection" );

	$( "<div></div>" ).selectable().remove();
	assert.ok( true, ".selectable() called on disconnected DOMElement" );

	var el = $( "<div></div>" ).selectable();
	el.selectable( "option", "foo" );
	el.remove();
	assert.ok( true, "arbitrary option getter after init" );

	$( "<div></div>" ).selectable().selectable( "option", "foo", "bar" ).remove();
	assert.ok( true, "arbitrary option setter after init" );
} );

QUnit.test( "destroy", function( assert ) {
	assert.expect( 4 );

	$( "<div></div>" ).appendTo( "body" ).selectable().selectable( "destroy" ).remove();
	assert.ok( true, ".selectable('destroy') called on element" );

	$( [] ).selectable().selectable( "destroy" ).remove();
	assert.ok( true, ".selectable('destroy') called on empty collection" );

	$( "<div></div>" ).selectable().selectable( "destroy" ).remove();
	assert.ok( true, ".selectable('destroy') called on disconnected DOMElement" );

	var expected = $( "<div></div>" ).selectable(),
		actual = expected.selectable( "destroy" );
	assert.equal( actual, expected, "destroy is chainable" );
} );

QUnit.test( "enable", function( assert ) {
	assert.expect( 3 );
	var expected, actual,
		fired = false,
		el = $( "#selectable1" );

	el.selectable( {
		disabled: true,
		start: function() { fired = true; }
	} );
	el.simulate( "drag", {
		dx: 20,
		dy: 20
	} );
	assert.equal( fired, false, "start fired" );
	el.selectable( "enable" );
	el.simulate( "drag", {
		dx: 20,
		dy: 20
	} );
	assert.equal( fired, true, "start fired" );
	el.selectable( "destroy" );

	expected = $( "<div></div>" ).selectable();
	actual = expected.selectable( "enable" );
	assert.equal( actual, expected, "enable is chainable" );
} );

QUnit.test( "disable", function( assert ) {
	assert.expect( 6 );
	var chainable,
		fired = false,
		element = $( "#selectable1" );

	element.selectable( {
		disabled: false,
		start: function() {
			fired = true;
		}
	} );
	element.simulate( "drag", {
		dx: 20,
		dy: 20
	} );
	assert.equal( fired, true, "start fired" );

	chainable = element.selectable( "disable" );
	fired = false;

	element.simulate( "drag", {
		dx: 20,
		dy: 20
	} );
	assert.equal( fired, false, "start fired" );

	assert.lacksClasses( element.selectable( "widget" ), "ui-state-disabled" );

	assert.ok( !element.selectable( "widget" ).attr( "aria-disabled" ), "element does not get aria-disabled" );
	assert.hasClasses( element.selectable( "widget" ), "ui-selectable-disabled" );

	element.selectable( "destroy" );

	assert.equal( chainable, element, "disable is chainable" );
} );

} );
