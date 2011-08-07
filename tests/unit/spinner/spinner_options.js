(function( $ ) {

module( "spinner: options" );

test( "numberFormat, number", function() {
	expect( 1 );
	var element = $( "#spin" ).spinner({
		value: "1",
		numberFormat: "n"
	});
	equal( element.val(), "1.00", "n" );
});

test( "numberFormat, number, simple", function() {
	expect( 1 );
	var element = $( "#spin" ).spinner({
		value: "1",
		numberFormat: "n0"
	});
	equal( element.val(), "1", "n0" );
});

test( "numberFormat, currency", function() {
	expect( 1 );
	var element = $( "#spin" ).spinner({
		value: "1",
		numberFormat: "C"
	});
	equal( element.val(), "$1.00", "C" );
});

/* TODO figure out how to test this properly
test("incremental - false (default)", function() {
	var el = $("#spin").spinner({ incremental:false });

	for ( var i = 1 ; i<=120 ; i++ ) {
		el.simulate("keydown",{keyCode:$.ui.keyCode.UP});
	}
	el.simulate("keyup",{keyCode:$.ui.keyCode.UP});

	equals(el.val(), 120, "incremental false - keydown 120 times");

	for ( var i = 1 ; i<=210 ; i++ ) {
		el.simulate("keydown",{keyCode:$.ui.keyCode.DOWN});
	}
	el.simulate("keyup",{keyCode:$.ui.keyCode.DOWN});

	equals(el.val(), -90, "incremental false - keydown 210 times");
});

test("incremental - true (default)", function() {
	var el = $("#spin").spinner();

	for ( var i = 1 ; i<=120 ; i++ ) {
		el.simulate("keydown",{keyCode:$.ui.keyCode.UP});
	}
	el.simulate("keyup",{keyCode:$.ui.keyCode.UP});

	equals(el.val(), 300, "incremental true - keydown 120 times (100+20*10)");

	for ( var i = 1 ; i<=210 ; i++ ) {
		el.simulate("keydown",{keyCode:$.ui.keyCode.DOWN});
	}
	el.simulate("keyup",{keyCode:$.ui.keyCode.DOWN});

	equals(el.val(), -1800, "incremental true - keydown 210 times (300-100-100*10-10*100)");
});
*/

test( "max", function() {
	expect( 3 );
	var element = $( "#spin" ).spinner({ max: 100, value: 1000 });
	equals( element.val(), 100, "max constrained if value option is greater" );

	element.spinner( "value", 1000 );
	equals( element.val(), 100, "max constrained if value method is greater" );

	element.val( 1000 ).blur();
	equals( element.val(), 100, "max constrained if manual entry" );
});

test( "min", function() {
	expect( 3 );
	var element = $( "#spin" ).spinner({ min: -100, value: -1000 });
	equals( element.val(), -100, "min constrained if value option is greater" );

	element.spinner( "value", -1000 );
	equals( element.val(), -100, "min constrained if value method is greater" );

	element.val( -1000 ).blur();
	equals( element.val(), -100, "min constrained if manual entry" );
});

test( "step, 2", function() {
	expect( 4 );
	var element = $( "#spin" ).spinner({ step: 2 });
	equals( element.val(), "0", "value initialized to 0" );

	element.spinner( "stepUp" );
	equals( element.val(), "2", "stepUp" );

	element.spinner( "value", "10.5" );
	equals( element.val(), "10.5", "value reset to 10.5" );

	element.spinner( "stepUp" );
	equals( element.val(), "12.5", "stepUp" );
});

test( "step, 0.7", function() {
	expect( 2 );
	var element = $("#spin").spinner({
		step: 0.7
	});
	equals( element.val(), "0", "value initialized to 0" );

	element.spinner( "stepUp" );
	equals( element.val(), "0.7", "stepUp" );
});

// TODO: test value

})( jQuery );
