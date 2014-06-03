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

test( "dateFormat", function() {
	expect( 2 );
	var input = $( "#datepicker" ).val( "1/1/14" ).datepicker(),
		picker = input.datepicker( "widget" ),
		firstDayLink = picker.find( "td[id]:first a" );

	input.datepicker( "open" );
	firstDayLink.trigger( "mousedown" );
	equal( input.val(), "1/1/14", "default formatting" );

	input.datepicker( "option", "dateFormat", { date: "full" } );
	equal( input.val(), "Wednesday, January 1, 2014", "updated formatting" );

	input.datepicker( "destroy" );
});

test( "eachDay", function() {
	expect( 5 );
	var timestamp,
		input = $( "#datepicker" ).datepicker(),
		picker = input.datepicker( "widget" ),
		firstCell = picker.find( "td[id]:first" );

	equal( firstCell.find( "a" ).length, 1, "days are selectable by default" );
	timestamp = parseInt( firstCell.find( "a" ).attr( "data-timestamp" ), 10 );
	equal( new Date( timestamp ).getDate(), 1, "first available day is the 1st by default" );

	// Do not render the 1st of the month
	input.datepicker( "option", "eachDay", function( day ) {
		if ( day.date === 1 ) {
			day.render = false;
		}
	});
	firstCell = picker.find( "td[id]:first" );
	timestamp = parseInt( firstCell.find( "a" ).attr( "data-timestamp" ), 10 );
	equal( new Date( timestamp ).getDate(), 2, "first available day is the 2nd" );

	// Display the 1st of the month but make it not selectable.
	input.datepicker( "option", "eachDay", function( day ) {
		if ( day.date === 1 ) {
			day.selectable = false;
		}
	});
	firstCell = picker.find( "td[id]:first" );
	equal( firstCell.find( "a" ).length, 0, "the 1st is not selectable" );

	input.datepicker( "option", "eachDay", function( day ) {
		if ( day.date === 1 ) {
			day.extraClasses = "ui-custom";
		}
	});
	ok( picker.find( "td[id]:first a" ).hasClass( "ui-custom" ), "extraClasses applied" );

	input.datepicker( "destroy" );
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

test( "showWeek", function() {
	expect( 7 );
	var input = $( "#datepicker" ).datepicker(),
		container = input.datepicker( "widget" );

	equal( container.find( "thead th" ).length, 7, "just 7 days, no column cell" );
	equal( container.find( ".ui-calendar-week-col" ).length, 0,
		"no week column cells present" );
	input.datepicker( "destroy" );

	input = $( "#datepicker" ).datepicker({ showWeek: true });
	container = input.datepicker( "widget" );
	equal( container.find( "thead th" ).length, 8, "7 days + a column cell" );
	ok( container.find( "thead th:first" ).is( ".ui-calendar-week-col" ),
		"first cell should have ui-calendar-week-col class name" );
	equal( container.find( ".ui-calendar-week-col" ).length,
		container.find( "tr" ).length, "one week cell for each week" );
	input.datepicker( "destroy" );

	input = $( "#datepicker" ).datepicker();
	container = input.datepicker( "widget" );
	equal( container.find( "thead th" ).length, 7, "no week column" );
	input.datepicker( "option", "showWeek", true );
	equal( container.find( "thead th" ).length, 8, "supports changing option after init" );
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
