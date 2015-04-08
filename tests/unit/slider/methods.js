define( [
	"jquery",
	"ui/slider"
], function( $ ) {

module( "slider: methods" );

test( "init", function() {
	expect(5);

	$( "<div></div>" ).appendTo( "body" ).slider().remove();
	ok( true, ".slider() called on element" );

	$( [] ).slider().remove();
	ok( true, ".slider() called on empty collection" );

	$( "<div></div>" ).slider().remove();
	ok( true, ".slider() called on disconnected DOMElement" );

	var element = $( "<div></div>" ).slider();
	element.slider( "option", "foo" );
	element.remove();
	ok( true, "arbitrary option getter after init" );

	$( "<div></div>" ).slider().slider( "option", "foo", "bar" ).remove();
	ok( true, "arbitrary option setter after init" );
});

test( "destroy", function( assert ) {
	expect( 1 );
	assert.domEqual( "#slider1", function() {
		$( "#slider1" ).slider().slider( "destroy" );
	});
});

test( "enable", function( assert ) {
	expect( 3 );
	var element,
		expected = $( "<div></div>" ).slider(),
		actual = expected.slider( "enable" );
	equal(actual, expected, "enable is chainable" );

	element = $( "<div></div>" ).slider({ disabled: true });
	assert.hasClasses( element, "ui-state-disabled ui-slider-disabled" );
	element.slider( "enable" );
	assert.lacksClasses( element, "ui-state-disabled ui-slider-disabled" );
});

test( "disable", function( assert ) {
	expect( 4 );
	var element,
		expected = $( "<div></div>" ).slider(),
		actual = expected.slider( "disable" );
	equal(actual, expected, "disable is chainable" );

	element = $( "<div></div>" ).slider({ disabled: false });
	assert.lacksClasses( element, "ui-state-disabled ui-slider-disabled" );
	element.slider( "disable" );
	assert.hasClasses( element, "ui-state-disabled ui-slider-disabled" );
	ok( !element.attr( "aria-disabled" ), "slider does not have aria-disabled attr after disable method call" );
});

test( "value", function() {
	expect( 19 );
	$( [ false, "min", "max" ] ).each(function() {
		var element = $( "<div></div>" ).slider({
			range: this,
			value: 5
		});
		equal( element.slider( "value" ), 5, "range: " + this + " slider method get" );
		equal( element.slider( "value", 10), element, "value method is chainable" );
		equal( element.slider( "value" ), 10, "range: " + this + " slider method set" );
		element.remove();
	});
	var element = $( "<div></div>" ).slider({
		min: -1, value: 0, max: 1
	});
	// min with value option vs value method
	element.slider( "option", "value", -2 );
	equal( element.slider( "option", "value" ), -2, "value option does not respect min" );
	equal( element.slider( "value" ), -1, "value method get respects min" );
	equal( element.slider( "value", -2 ), element, "value method is chainable" );
	equal( element.slider( "option", "value" ), -1, "value method set respects min" );
	// max with value option vs value method
	element.slider( "option", "value", 2);
	equal( element.slider( "option", "value" ), 2, "value option does not respect max" );
	equal( element.slider( "value" ), 1, "value method get respects max" );
	equal( element.slider( "value", 2 ), element, "value method is chainable" );
	equal( element.slider( "option", "value" ), 1, "value method set respects max" );

	// set max value with step 0.01
	element.slider( "option", {
		min: 2,
		value: 2,
		max: 2.4,
		step: 0.01
	});
	element.slider( "option", "value", 2.4 );
	equal( element.slider( "value" ), 2.4, "value is set to max with 0.01 step" );

	element = $( "<div></div>" ).slider({
		value: 100,
		min: 10,
		max: 500,
		step: 50
	});

	element.slider( "option", "value", 510 );
	equal( element.slider( "value" ), 460, "value is restricted to maximum valid step" );
});

//test( "values", function() {
//	ok(false, "missing test - untested code is broken code." );
//});

} );
