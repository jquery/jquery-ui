(function( $ ) {

module( "spinner: core" );

// TODO: move to spinner_methods
test( "destroy", function() {
	expect( 1 );
	// TODO: is this cheat still needed?
	// cheat a bit to get IE6 to pass
	$( "#spin" ).val( 0 );
	domEqual( "#spin", function() {
		$( "#spin" ).spinner().spinner( "destroy" );
	});
});

test( "keydown UP on input, increases value not greater than max", function() {
	expect( 5 );
	var element = $( "#spin" ).spinner({
		max: 100,
		value: 70,
		step: 10
	});

	spinner_simulateKeyDownUp( element, $.ui.keyCode.UP );
	equals( element.val(), 80 );
	spinner_simulateKeyDownUp( element, $.ui.keyCode.UP );
	equals( element.val(), 90 );
	spinner_simulateKeyDownUp( element, $.ui.keyCode.UP );
	equals( element.val(), 100 );
	spinner_simulateKeyDownUp( element, $.ui.keyCode.UP );
	equals( element.val(), 100 );
	spinner_simulateKeyDownUp( element, $.ui.keyCode.UP );
	equals( element.val(), 100 );
});

test( "keydown DOWN on input, decreases value not less than min", function() {
	expect( 5 );
	var element = $( "#spin" ).spinner({
		min: 20,
		value: 50,
		step: 10
	});

	spinner_simulateKeyDownUp( element, $.ui.keyCode.DOWN );
	equals( element.val(), 40 );
	spinner_simulateKeyDownUp( element, $.ui.keyCode.DOWN );
	equals( element.val(), 30 );
	spinner_simulateKeyDownUp( element, $.ui.keyCode.DOWN );
	equals( element.val(), 20 );
	spinner_simulateKeyDownUp( element, $.ui.keyCode.DOWN );
	equals( element.val(), 20 );
	spinner_simulateKeyDownUp( element, $.ui.keyCode.DOWN );
	equals( element.val(), 20 );
});

test( "keydown PGUP on input, increases value not greater than max", function() {
	expect( 5 );
	var element = $( "#spin" ).spinner({
		max: 100,
		value: 70,
		page: 10
	});

	spinner_simulateKeyDownUp( element, $.ui.keyCode.PAGE_UP );
	equals( element.val(), 80 );
	spinner_simulateKeyDownUp( element, $.ui.keyCode.PAGE_UP );
	equals( element.val(), 90 );
	spinner_simulateKeyDownUp( element, $.ui.keyCode.PAGE_UP );
	equals( element.val(), 100 );
	spinner_simulateKeyDownUp( element, $.ui.keyCode.PAGE_UP );
	equals( element.val(), 100 );
	spinner_simulateKeyDownUp( element, $.ui.keyCode.PAGE_UP );
	equals( element.val(), 100 );
});

test( "keydown PGDN on input, decreases value not less than min", function() {
	expect( 5 );
	var element = $( "#spin" ).spinner({
		min: 20,
		value: 50,
		page: 10
	});

	spinner_simulateKeyDownUp( element, $.ui.keyCode.PAGE_DOWN );
	equals( element.val(), 40 );
	spinner_simulateKeyDownUp( element, $.ui.keyCode.PAGE_DOWN );
	equals( element.val(), 30 );
	spinner_simulateKeyDownUp( element, $.ui.keyCode.PAGE_DOWN );
	equals( element.val(), 20 );
	spinner_simulateKeyDownUp( element, $.ui.keyCode.PAGE_DOWN );
	equals( element.val(), 20 );
	spinner_simulateKeyDownUp( element, $.ui.keyCode.PAGE_DOWN );
	equals( element.val(), 20 );
});

test( "mouse click on buttons", function() {
	expect( 2 );
	var element = $( "#spin" ).spinner(),
		val = 0;

	$( ".ui-spinner-up" ).trigger( "mousedown" ).trigger( "mouseup" );
	equals( element.val(), ++val, "mouse click on up" );

	$( ".ui-spinner-down" ).trigger( "mousedown" ).trigger( "mouseup" );
	equals( element.val(), --val, "mouse click on down");
});

test( "mouse wheel on input", function() {
	expect( 4 );

	var element = $( "#spin" ).spinner();
	equal( element.val(), 0 );
	element.trigger( "mousewheel", 1 );
	equal( element.val(), 1 );

	element.trigger( "mousewheel", -1 );
	equal( element.val(), 0 );

	element.trigger( "mousewheel", -1 );
	equal(element.val(), -1 );
});

test( "reading HTML5 attributes", function() {
	expect( 4 );
	var element = $( "<input id='spinner' type='number' min='-100' max='100' value='5' step='2'>" ).spinner();
	equals( element.spinner( "option", "value" ), 5, "value" );	
	equals( element.spinner( "option", "max" ), 100, "max" );
	equals( element.spinner( "option", "min" ), -100, "min" );
	equals( element.spinner( "option", "step" ), 2, "step" );
});

test( "ARIA attributes", function() {
	expect( 7 );
	var element = $( "#spin" ).spinner({ min: -5, max: 5, value: 2 });

	equals( element.attr( "role" ), "spinbutton", "role" );
	equals( element.attr( "aria-valuemin" ), -5, "aria-valuemin" );
	equals( element.attr( "aria-valuemax" ), 5, "aria-valuemax" );
	equals( element.attr( "aria-valuenow" ), 2, "aria-valuenow" );

	element.spinner( "stepUp" );

	equals( element.attr( "aria-valuenow" ), 3, "stepUp 1 step changes aria-valuenow" );

	element.spinner( "option", { min: -10, max: 10 } );

	equals( element.attr( "aria-valuemin" ), -10, "min option changed aria-valuemin changes" );
	equals( element.attr( "aria-valuemax" ), 10, "max option changed aria-valuemax changes" );
});

})( jQuery );
