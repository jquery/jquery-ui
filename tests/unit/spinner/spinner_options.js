(function( $ ) {

module( "spinner: options" );

test( "numberFormat, number", function() {
	expect( 2 );
	var element = $( "#spin" ).val( 0 ).spinner({ numberFormat: "n" });
	equal( element.val(), "0.00", "formatted on init" );
	element.spinner( "stepUp" );
	equal( element.val(), "1.00", "formatted after step" );
});

test( "numberFormat, number, simple", function() {
	expect( 2 );
	var element = $( "#spin" ).val( 0 ).spinner({ numberFormat: "n0" });
	equal( element.val(), "0", "formatted on init" );
	element.spinner( "stepUp" );
	equal( element.val(), "1", "formatted after step" );
});

test( "numberFormat, currency", function() {
	expect( 2 );
	var element = $( "#spin" ).val( 0 ).spinner({ numberFormat: "C" });
	equal( element.val(), "$0.00", "formatted on init" );
	element.spinner( "stepUp" );
	equal( element.val(), "$1.00", "formatted after step" );
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
	var element = $( "#spin" ).val( 1000 ).spinner({ max: 100 });
	equals( element.val(), 1000, "value not constrained on init" );

	element.spinner( "value", 1000 );
	equals( element.val(), 100, "max constrained if value method is greater" );

	element.val( 1000 ).blur();
	equals( element.val(), 1000, "max not constrained if manual entry" );
});

test( "min", function() {
	expect( 3 );
	var element = $( "#spin" ).val( -1000 ).spinner({ min: -100 });
	equals( element.val(), -1000, "value not constrained on init" );

	element.spinner( "value", -1000 );
	equals( element.val(), -100, "min constrained if value method is greater" );

	element.val( -1000 ).blur();
	equals( element.val(), -1000, "min not constrained if manual entry" );
});

test( "step, 2", function() {
	expect( 3 );
	var element = $( "#spin" ).val( 0 ).spinner({ step: 2 });

	element.spinner( "stepUp" );
	equals( element.val(), "2", "stepUp" );

	element.spinner( "value", "10.5" );
	equals( element.val(), "10.5", "value reset to 10.5" );

	element.spinner( "stepUp" );
	equals( element.val(), "12.5", "stepUp" );
});

test( "step, 0.7", function() {
	expect( 1 );
	var element = $("#spin").val( 0 ).spinner({
		step: 0.7
	});

	element.spinner( "stepUp" );
	equals( element.val(), "0.7", "stepUp" );
});

})( jQuery );
