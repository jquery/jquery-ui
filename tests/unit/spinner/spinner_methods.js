(function( $ ) {

module( "spinner: methods" );

test( "destroy", function() {
	expect( 1 );
	domEqual( "#spin", function() {
		$( "#spin" ).spinner().spinner( "destroy" );
	});
});

test( "disable", function() {
	expect( 14 );
	var element = $( "#spin" ).spinner({ value: 2 }),
		wrapper = $( "#spin" ).spinner( "widget" );

	ok( !wrapper.hasClass( "ui-spinner-disabled" ), "before: wrapper does not have ui-spinner-disabled class" );
	ok( !element.is( ":disabled" ), "before: input does not have disabled attribute" );

	element.spinner( "disable" );
	ok( wrapper.hasClass( "ui-spinner-disabled" ), "after: wrapper has ui-spinner-disabled class" );
	ok( element.is( ":disabled"), "after: input has disabled attribute" );

	spinner_simulateKeyDownUp( element, $.ui.keyCode.UP );
	equals( 2, element.val(), "keyboard - value does not change on key UP" );

	spinner_simulateKeyDownUp( element, $.ui.keyCode.DOWN );
	equals( 2, element.val(), "keyboard - value does not change on key DOWN" );

	spinner_simulateKeyDownUp( element, $.ui.keyCode.PAGE_UP );
	equals( 2, element.val(), "keyboard - value does not change on key PGUP" );

	spinner_simulateKeyDownUp( element, $.ui.keyCode.PAGE_DOWN );
	equals( 2, element.val(), "keyboard - value does not change on key PGDN" );

	wrapper.find( ".ui-spinner-up" ).trigger( "mousedown" ).trigger( "mouseup" );
	equals( 2, element.val(), "mouse - value does not change on clicking up button" );

	wrapper.find( ".ui-spinner-down" ).trigger( "mousedown" ).trigger( "mouseup" );
	equals( 2, element.val(), "mouse - value does not change on clicking down button" );

	element.spinner( "stepUp", 6 );
	equals( 8, element.val(), "script - stepUp 6 steps changes value");

	element.spinner( "stepDown" );
	equals( 7, element.val(), "script - stepDown 1 step changes value" );

	element.spinner( "pageUp" );
	equals( 17, element.val(), "script - pageUp 1 page changes value" );

	element.spinner( "pageDown" );
	equals( 7, element.val(), "script - pageDown 1 page changes value" );
});

test( "enable", function() {
	expect( 5 );
	var element = $( "#spin" ).spinner({ disabled: true })
		wrapper = element.spinner( "widget" );

	ok( wrapper.hasClass( "ui-spinner-disabled" ), "before: wrapper has ui-spinner-disabled class" );
	ok( element.is( ":disabled" ), "before: input has disabled attribute" );

	element.spinner( "enable" );

	ok( !wrapper.hasClass( ".ui-spinner-disabled" ), "after: wrapper does not have ui-spinner-disabled class" );
	ok( !element.is( ":disabled" ), "after: input does not have disabled attribute" );

	spinner_simulateKeyDownUp( element, $.ui.keyCode.UP );
	equals( 1, element.val(), "keyboard - value does not change on key UP" );
});

test( "pageDown", function() {
	expect( 4 );
	var element = $( "#spin" ).spinner({
		page: 20,
		value: -12,
		min: -100
	});

	element.spinner( "pageDown" );
	equals( element.val(), -32, "pageDown 1 page" );

	element.spinner( "pageDown", 3 );
	equals( element.val(), -92, "pageDown 3 pages" );

	element.spinner( "pageDown" );
	equals( element.val(), -100, "value close to min and pageDown 1 page" );

	element.spinner( "pageDown", 10 );
	equals( element.val(), -100, "value at min and pageDown 10 pages" );
});

test( "pageUp", function() {
	expect( 4 );
	var element = $( "#spin" ).spinner({
		page: 20,
		value: 12,
		max: 100
	});

	element.spinner( "pageUp" );
	equals( element.val(), 32, "pageUp 1 page" );

	element.spinner( "pageUp", 3 );
	equals( element.val(), 92, "pageUp 3 pages" );

	element.spinner( "pageUp" );
	equals( element.val(), 100, "value close to max and pageUp 1 page" );

	element.spinner( "pageUp", 10 );
	equals( element.val(), 100, "value at max and pageUp 10 pages" );
});

test( "stepDown", function() {
	expect( 4 );
	var element = $( "#spin" ).spinner({
		step: 2,
		value: 0,
		min: -15
	});

	element.spinner( "stepDown" );
	equals( element.val(), -2, "stepDown 1 step" );

	element.spinner( "stepDown", 5 );
	equals( element.val(), -12, "stepDown 5 steps" );

	element.spinner( "stepDown", 4 );
	equals( element.val(), -15, "close to min and stepDown 4 steps" );

	element.spinner( "stepDown" );
	equals( element.val(), -15, "at min and stepDown 1 step" );
});

test("stepTrailingDecimal", function() {
	expect(2);

	el = $('#spin').spinner({ step: .02, page: 5, value: 0.001, min: -.08 });

	el.spinner('stepDown')
	equals(el.val(), -0.019, "stepDown 1 step");

	el.spinner('stepUp', 2)
	equals(el.val(), 0.021, "stepDown 5 steps");
	
});

test("decimalValueIntegerStep", function() {
	expect(3);

	el = $('#spin').spinner({ step: 1, page: 5, value: .001 });

	el.spinner('stepUp')
	equals(el.val(), 1.001, "stepUp 1 step");

	el.spinner('stepUp', 5)
	equals(el.val(), 6.001, "stepUp 5 steps");
	
	el.spinner('stepDown', 7)
	equals(el.val(), -0.999, "stepDown 7 steps");
	
});

test("integerValueDecimalStep", function() {
	expect(4);

	el = $('#spin').spinner({ step: .01, page: 5, value: 0, min: -.08 });

	el.spinner('stepDown')
	equals(el.val(), -0.01, "stepDown 1 step");

	el.spinner('stepDown', 5)
	equals(el.val(), -0.06, "stepDown 5 steps");
	
	el.spinner('stepDown', 3);
	equals(el.val(), -0.08, "close to min and stepDown 3 steps");

	el.spinner('stepDown');
	equals(el.val(), -0.08, "at min and stepDown 1 step");
});
test( "stepUp", function() {
	expect( 4 );
	var element = $( "#spin" ).spinner({
		step: 2,
		value: 0,
		max: 15
	});

	element.spinner( "stepUp" );
	equals( element.val(), 2, "stepUp 1 step" );

	element.spinner( "stepUp", 5 );
	equals( element.val(), 12, "stepUp 5 steps" );

	element.spinner( "stepUp", 4 );
	equals( element.val(), 15, "close to min and stepUp 4 steps" );

	element.spinner( "stepUp" );
	equals( element.val(), 15, "at max and stepUp 1 step" );
});

test( "value", function() {
	expect( 2 );
	var element = $( "#spin" ).spinner({ value: 0 });

	element.spinner( "value", 10 );
	equals( element.val(), 10, "change value via value method" );

	equals( element.spinner( "value" ), 10, "get value via value method" );
});

})( jQuery );
