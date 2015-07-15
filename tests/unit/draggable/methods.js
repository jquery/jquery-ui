define( [
	"jquery",
	"./helper",
	"ui/widgets/draggable"
], function( $, testHelper ) {

var element;

module( "draggable: methods", {
	setup: function() {
		element = $("<div style='background: green; width: 200px; height: 100px; position: absolute; top: 10px; left: 10px;'><span>Absolute</span></div>").appendTo("#qunit-fixture");
	},
	teardown: function() {
		element.remove();
	}
});

test( "init", function() {
	expect( 5 );

	element.draggable();
	ok( true, ".draggable() called on element" );

	$([]).draggable();
	ok( true, ".draggable() called on empty collection" );

	$("<div></div>").draggable();
	ok( true, ".draggable() called on disconnected DOMElement" );

	element.draggable( "option", "foo" );
	ok( true, "arbitrary option getter after init" );

	element.draggable( "option", "foo", "bar" );
	ok( true, "arbitrary option setter after init" );
});

test( "destroy", function() {
	expect( 4 );

	element.draggable().draggable("destroy");
	ok( true, ".draggable('destroy') called on element" );

	$([]).draggable().draggable("destroy");
	ok( true, ".draggable('destroy') called on empty collection" );

	element.draggable().draggable("destroy");
	ok( true, ".draggable('destroy') called on disconnected DOMElement" );

	var expected = element.draggable(),
		actual = expected.draggable("destroy");
	equal( actual, expected, "destroy is chainable" );
});

test( "enable", function() {
	expect( 11 );

	element.draggable({ disabled: true });
	testHelper.shouldNotDrag( element, ".draggable({ disabled: true })" );

	element.draggable("enable");
	testHelper.shouldMove( element, ".draggable('enable')" );
	equal( element.draggable( "option", "disabled" ), false, "disabled option getter" );

	element.draggable("destroy");
	element.draggable({ disabled: true });
	testHelper.shouldNotDrag( element, ".draggable({ disabled: true })" );

	element.draggable( "option", "disabled", false );
	equal(element.draggable( "option", "disabled" ), false, "disabled option setter" );
	testHelper.shouldMove( element, ".draggable('option', 'disabled', false)" );

	var expected = element.draggable(),
		actual = expected.draggable("enable");
	equal( actual, expected, "enable is chainable" );
});

test( "disable", function( assert ) {
	expect( 14 );

	element = $( "#draggable2" ).draggable({ disabled: false });
	testHelper.shouldMove( element, ".draggable({ disabled: false })" );

	element.draggable( "disable" );
	testHelper.shouldNotDrag( element, ".draggable('disable')" );
	equal( element.draggable( "option", "disabled" ), true, "disabled option getter" );

	element.draggable( "destroy" );
	element.draggable({ disabled: false });
	testHelper.shouldMove( element, ".draggable({ disabled: false })" );

	element.draggable( "option", "disabled", true );
	equal( element.draggable( "option", "disabled" ), true, "disabled option setter" );
	testHelper.shouldNotDrag( element, ".draggable('option', 'disabled', true)" );

	assert.lacksClasses( element.draggable( "widget" ), "ui-state-disabled" );
	ok( !element.draggable( "widget" ).attr( "aria-disabled" ), "element does not get aria-disabled" );
	assert.hasClasses( element.draggable( "widget" ), "ui-draggable-disabled" );

	var expected = element.draggable(),
		actual = expected.draggable( "disable" );
	equal( actual, expected, "disable is chainable" );
});

} );
