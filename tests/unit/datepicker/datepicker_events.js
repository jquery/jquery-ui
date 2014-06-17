(function( $ ) {

module( "datepicker: events" );

test( "beforeOpen", function() {
	expect( 3 );

	var input = TestHelpers.datepicker.init( "#datepicker", {
			beforeOpen: function() {
				ok( true, "beforeOpen event fired before open" );
				ok( input.datepicker( "widget" ).is( ":hidden" ), "calendar hidden on beforeOpen" );
			},
			open: function() {
				ok( input.datepicker( "widget" ).is( ":visible" ), "calendar open on open" );
			}
		});

	input
		.datepicker( "open" )
		.datepicker( "close" )
		.datepicker( "option", {
			beforeOpen: function() {
				return false;
			},
			open: function() {
				ok( false, "calendar should not open when openBefore is canceled" );
			}
		})
		.datepicker( "open" );
});

test( "close", function() {
	expect( 4 );

	var shouldFire,
		input = TestHelpers.datepicker.init( "#datepicker", {
			close: function() {
				ok( shouldFire, "close event fired" );
			}
		});

	shouldFire = false;
	input.datepicker( "open" );
	shouldFire = true;
	input.datepicker( "close" );

	shouldFire = false;
	input.datepicker( "open" );
	shouldFire = true;
	$( "body" ).trigger( "mousedown" );

	shouldFire = false;
	input.datepicker( "open" );
	shouldFire = true;
	input.simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE } );

	shouldFire = false;
	input.datepicker( "open" );
	shouldFire = true;
	input.datepicker( "widget" ).find( "tbody tr:first a:first" ).simulate( "mousedown" );
});

test( "open", function() {
	expect( 2 );

	var input = TestHelpers.datepicker.init( "#datepicker", {
			open: function() {
				ok( true, "open event fired on open" );
				ok( widget.is( ":visible" ), "calendar open on open" );
			}
		}),
		widget = input.datepicker( "widget" );

	input.datepicker( "open" );
});

asyncTest( "select", function() {
	expect( 4 );

	var input = TestHelpers.datepicker.init( "#datepicker", {
			select: function( event ) {
				ok( true, "select event fired " + message );
				equal(
					event.originalEvent.type,
					"calendarselect",
					"select originalEvent " + message
				);
			}
		}),
		widget = input.datepicker( "widget" ),
		message = "";

	function step1() {
		message = "on calendar cell click";
		input
			.simulate( "focus" )
			.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		setTimeout(function() {
			widget.find( "tbody tr:first a:first" ).simulate( "mousedown" );
			input.datepicker( "close" );
			step2();
		}, 100 );
	}

	function step2() {
		message = "on calendar cell enter";
		input
			.simulate( "focus" )
			.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		setTimeout(function() {
			$( ":focus" )
				.simulate( "keydown", { keyCode: $.ui.keyCode.RIGHT } )
				.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
			input.datepicker( "close" );
			step3();
		}, 100 );
	}

	function step3() {
		message = "on calendar escape (not expected)";
		input
			.simulate( "focus" )
			.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		setTimeout(function() {
			$( ":focus" ).simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE } );
			input.datepicker( "close" );
			start();
		}, 100 );
	}

	step1();
});

})( jQuery );
