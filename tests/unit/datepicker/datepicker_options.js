(function( $ ) {

module( "datepicker: options" );

test( "appendTo", function() {
	expect( 6 );
	var container,
		detached = $( "<div>" ),
		input = $( "#datepicker" );

	input.datepicker();
	container = input.datepicker( "widget" ).parent()[ 0 ];
	equal( container, document.body, "defaults to body" );
	input.datepicker( "destroy" );

	input.datepicker({ appendTo: "#qunit-fixture" });
	container = input.datepicker( "widget" ).parent()[ 0 ];
	equal( container, $( "#qunit-fixture" )[ 0 ], "child of specified element" );
	input.datepicker( "destroy" );

	input.datepicker({ appendTo: "#does-not-exist" });
	container = input.datepicker( "widget" ).parent()[ 0 ];
	equal( container, document.body, "set to body if element does not exist" );
	input.datepicker( "destroy" );

	input.datepicker()
		.datepicker( "option", "appendTo", "#qunit-fixture" );
	container = input.datepicker( "widget" ).parent()[ 0 ];
	equal( container, $( "#qunit-fixture" )[ 0 ], "modified after init" );
	input.datepicker( "destroy" );

	input.datepicker({ appendTo: detached });
	container = input.datepicker( "widget" ).parent()[ 0 ];
	equal( container, detached[ 0 ], "detached jQuery object" );
	input.datepicker( "destroy" );

	input.datepicker({ appendTo: detached[ 0 ] });
	container = input.datepicker( "widget" ).parent()[ 0 ];
	equal( container, detached[ 0 ], "detached DOM element" );
	input.datepicker( "destroy" );
});

test( "Pass-through options", function() {
	expect( 8 );

	var options = {
			"buttons": { "Test": $.noop },
			"dateFormat": { date: "full" },
			"eachDay": function( day ) { day; },
			"max": new Date( 2000, 0, 1 ),
			"min": new Date( 2000, 0, 2 ),
			"numberOfMonths": 3,
			"showWeek": true
		},
		input = $( "#datepicker" ).val( "1/1/14" ).datepicker(),
		datepickerInstance = input.datepicker( "instance" );

	$.each( options, function( key, value ) {
		input.datepicker( "option", key, value );

		deepEqual(
			datepickerInstance.calendar.calendar( "option", key ),
			value,
			"option " + key + ": correct value"
		);

		if ( key === "dateFormat" ) {
			equal( input.val(), "Wednesday, January 1, 2014", "option " + key + ": updated format" );
		}
	});
});

asyncTest( "position", function() {
	expect( 3 );
	var input = $( "<input>" ).datepicker().appendTo( "body" ).css({
			position: "absolute",
			top: 0,
			left: 0
		}),
		container = input.datepicker( "widget" );

	input.datepicker( "open" );
	setTimeout(function() {
		closeEnough( input.offset().left, container.offset().left, 1, "left sides line up by default" );
		closeEnough( container.offset().top, input.offset().top + input.outerHeight(), 1,
			"datepicker directly under input by default" );

		// Change the position option using option()
		input.datepicker( "option", "position", {
			my: "left top",
			at: "right bottom"
		});
		closeEnough( container.offset().left, input.offset().left + input.outerWidth(), 1,
			"datepicker on right hand side of input after position change" );

		input.remove();
		start();
	});
});

test( "Stop datepicker from appearing with beforeOpen event handler", function() {
	expect( 3 );

	var input = TestHelpers.datepicker.init( "#datepicker", {
		beforeOpen: function() {}
	});

	input.datepicker( "open" );
	ok( input.datepicker( "widget" ).is( ":visible" ), "beforeOpen returns nothing" );
	input.datepicker( "close" ).datepicker( "destroy" );

	input = TestHelpers.datepicker.init( "#datepicker", {
		beforeOpen: function() {
			return true;
		}
	});
	input.datepicker( "open" );
	ok( input.datepicker( "widget" ).is( ":visible" ), "beforeOpen returns true" );
	input.datepicker( "close" ).datepicker( "destroy" );

	input = TestHelpers.datepicker.init( "#datepicker", {
		beforeOpen: function() {
			return false;
		}
	});
	input.datepicker( "open" );
	ok( !input.datepicker( "widget" ).is( ":visible" ), "beforeOpen returns false" );
	input.datepicker( "destroy" );
});

})(jQuery);
