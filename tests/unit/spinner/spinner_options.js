(function( $ ) {

module( "spinner: options" );

test( "incremental, false", function() {
	expect( 100 );

	var i, diff,
		prev = 0,
		element = $( "#spin" ).val( prev ).spinner({
			incremental: false,
			spin: function( event, ui ) {
				equal( ui.value - prev, 1 );
				prev = ui.value;
			}
		});

	for ( i = 0; i < 100; i++ ) {
		element.simulate( "keydown", { keyCode: $.ui.keyCode.UP } );
	}
});

test( "incremental, true", function() {
	expect( 100 );

	function fill( num, val ) {
		return $.map( new Array( num ), function() {
			return val;
		});
	}

	var i, diff,
		prev = 0,
		expected = [].concat( fill( 18, 1 ), fill( 37, 2 ), fill( 14, 3 ),
			fill( 9, 4 ), fill( 6, 5 ), fill( 5, 6 ), fill ( 5, 7 ),
			fill( 4, 8 ), fill( 2, 9 ) ),
		element = $( "#spin" ).val( prev ).spinner({
			incremental: true,
			spin: function( event, ui ) {
				equal( ui.value - prev, expected[ i ] );
				prev = ui.value;
			}
		});

	for ( i = 0; i < 100; i++ ) {
		element.simulate( "keydown", { keyCode: $.ui.keyCode.UP } );
	}
});

test( "incremental, function", function() {
	expect( 100 );

	var i,
		prev = 0,
		element = $( "#spin" ).val( prev ).spinner({
			incremental: function( i ) {
				return i;
			},
			spin: function( event, ui ) {
				equal( ui.value - prev, i + 1 );
				prev = ui.value;
			}
		});

	for ( i = 0; i < 100; i++ ) {
		element.simulate( "keydown", { keyCode: $.ui.keyCode.UP } );
	}
});

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
	equals( element.val(), "10", "value reset to 10" );

	element.val( "4.5" );
	element.spinner( "stepUp" );
	equals( element.val(), "6", "stepUp" );
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
