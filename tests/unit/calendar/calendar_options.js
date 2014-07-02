(function( $ ) {

module( "calendar: options" );

test( "appendTo", function() {
	expect( 6 );
	var container,
		detached = $( "<div>" ),
		input = $( "#calendar" );

	input.calendar();
	container = input.calendar( "widget" ).parent()[ 0 ];
	equal( container, document.body, "defaults to body" );
	input.calendar( "destroy" );

	input.calendar({ appendTo: "#qunit-fixture" });
	container = input.calendar( "widget" ).parent()[ 0 ];
	equal( container, $( "#qunit-fixture" )[ 0 ], "child of specified element" );
	input.calendar( "destroy" );

	input.calendar({ appendTo: "#does-not-exist" });
	container = input.calendar( "widget" ).parent()[ 0 ];
	equal( container, document.body, "set to body if element does not exist" );
	input.calendar( "destroy" );

	input.calendar()
		.calendar( "option", "appendTo", "#qunit-fixture" );
	container = input.calendar( "widget" ).parent()[ 0 ];
	equal( container, $( "#qunit-fixture" )[ 0 ], "modified after init" );
	input.calendar( "destroy" );

	input.calendar({ appendTo: detached });
	container = input.calendar( "widget" ).parent()[ 0 ];
	equal( container, detached[ 0 ], "detached jQuery object" );
	input.calendar( "destroy" );

	input.calendar({ appendTo: detached[ 0 ] });
	container = input.calendar( "widget" ).parent()[ 0 ];
	equal( container, detached[ 0 ], "detached DOM element" );
	input.calendar( "destroy" );
});

test( "dateFormat", function() {
	expect( 2 );
	var input = $( "#calendar" ).val( "1/1/14" ).calendar(),
		picker = input.calendar( "widget" ),
		firstDayLink = picker.find( "td[id]:first a" );

	input.calendar( "open" );
	firstDayLink.trigger( "mousedown" );
	equal( input.val(), "1/1/14", "default formatting" );

	input.calendar( "option", "dateFormat", { date: "full" } );
	equal( input.val(), "Wednesday, January 1, 2014", "updated formatting" );

	input.calendar( "destroy" );
});

test( "eachDay", function() {
	expect( 5 );
	var timestamp,
		input = $( "#calendar" ).calendar(),
		picker = input.calendar( "widget" ),
		firstCell = picker.find( "td[id]:first" );

	equal( firstCell.find( "a" ).length, 1, "days are selectable by default" );
	timestamp = parseInt( firstCell.find( "a" ).attr( "data-timestamp" ), 10 );
	equal( new Date( timestamp ).getDate(), 1, "first available day is the 1st by default" );

	// Do not render the 1st of the month
	input.calendar( "option", "eachDay", function( day ) {
		if ( day.date === 1 ) {
			day.render = false;
		}
	});
	firstCell = picker.find( "td[id]:first" );
	timestamp = parseInt( firstCell.find( "a" ).attr( "data-timestamp" ), 10 );
	equal( new Date( timestamp ).getDate(), 2, "first available day is the 2nd" );

	// Display the 1st of the month but make it not selectable.
	input.calendar( "option", "eachDay", function( day ) {
		if ( day.date === 1 ) {
			day.selectable = false;
		}
	});
	firstCell = picker.find( "td[id]:first" );
	equal( firstCell.find( "a" ).length, 0, "the 1st is not selectable" );

	input.calendar( "option", "eachDay", function( day ) {
		if ( day.date === 1 ) {
			day.extraClasses = "ui-custom";
		}
	});
	ok( picker.find( "td[id]:first a" ).hasClass( "ui-custom" ), "extraClasses applied" );

	input.calendar( "destroy" );
});

test( "numberOfMonths", function() {
	expect( 0 );
});

asyncTest( "position", function() {
	expect( 3 );
	var input = $( "<input>" ).calendar().appendTo( "body" ).css({
			position: "absolute",
			top: 0,
			left: 0
		}),
		container = input.calendar( "widget" );

	input.calendar( "open" );
	setTimeout(function() {
		closeEnough( input.offset().left, container.offset().left, 1, "left sides line up by default" );
		closeEnough( container.offset().top, input.offset().top + input.outerHeight(), 1,
			"calendar directly under input by default" );

		// Change the position option using option()
		input.calendar( "option", "position", {
			my: "left top",
			at: "right bottom"
		});
		closeEnough( container.offset().left, input.offset().left + input.outerWidth(), 1,
			"calendar on right hand side of input after position change" );

		input.remove();
		start();
	});
});

test( "showWeek", function() {
	expect( 7 );
	var input = $( "#calendar" ).calendar(),
		container = input.calendar( "widget" );

	equal( container.find( "thead th" ).length, 7, "just 7 days, no column cell" );
	equal( container.find( ".ui-calendar-week-col" ).length, 0,
		"no week column cells present" );
	input.calendar( "destroy" );

	input = $( "#calendar" ).calendar({ showWeek: true });
	container = input.calendar( "widget" );
	equal( container.find( "thead th" ).length, 8, "7 days + a column cell" );
	ok( container.find( "thead th:first" ).is( ".ui-calendar-week-col" ),
		"first cell should have ui-calendar-week-col class name" );
	equal( container.find( ".ui-calendar-week-col" ).length,
		container.find( "tr" ).length, "one week cell for each week" );
	input.calendar( "destroy" );

	input = $( "#calendar" ).calendar();
	container = input.calendar( "widget" );
	equal( container.find( "thead th" ).length, 7, "no week column" );
	input.calendar( "option", "showWeek", true );
	equal( container.find( "thead th" ).length, 8, "supports changing option after init" );
});

/*
test( "setDefaults", function() {
	expect( 3 );
	TestHelpers.calendar.init( "#inp" );
	equal($.calendar._defaults.showOn, "focus", "Initial showOn" );
	$.calendar.setDefaults({showOn: "button"});
	equal($.calendar._defaults.showOn, "button", "Change default showOn" );
	$.calendar.setDefaults({showOn: "focus"});
	equal($.calendar._defaults.showOn, "focus", "Restore showOn" );
});

test( "option", function() {
	expect( 17 );
	var inp = TestHelpers.calendar.init( "#inp" ),
	inst = $.data(inp[0], TestHelpers.calendar.PROP_NAME);
	// Set option
	equal(inst.settings.showOn, null, "Initial setting showOn" );
	equal($.calendar._get(inst, "showOn" ), "focus", "Initial instance showOn" );
	equal($.calendar._defaults.showOn, "focus", "Initial default showOn" );
	inp.calendar( "option", "showOn", "button" );
	equal(inst.settings.showOn, "button", "Change setting showOn" );
	equal($.calendar._get(inst, "showOn" ), "button", "Change instance showOn" );
	equal($.calendar._defaults.showOn, "focus", "Retain default showOn" );
	inp.calendar( "option", {showOn: "both"});
	equal(inst.settings.showOn, "both", "Change setting showOn" );
	equal($.calendar._get(inst, "showOn" ), "both", "Change instance showOn" );
	equal($.calendar._defaults.showOn, "focus", "Retain default showOn" );
	inp.calendar( "option", "showOn", undefined);
	equal(inst.settings.showOn, null, "Clear setting showOn" );
	equal($.calendar._get(inst, "showOn" ), "focus", "Restore instance showOn" );
	equal($.calendar._defaults.showOn, "focus", "Retain default showOn" );
	// Get option
	inp = TestHelpers.calendar.init( "#inp" );
	equal(inp.calendar( "option", "showOn" ), "focus", "Initial setting showOn" );
	inp.calendar( "option", "showOn", "button" );
	equal(inp.calendar( "option", "showOn" ), "button", "Change instance showOn" );
	inp.calendar( "option", "showOn", undefined);
	equal(inp.calendar( "option", "showOn" ), "focus", "Reset instance showOn" );
	deepEqual(inp.calendar( "option", "all" ), {showAnim: ""}, "Get instance settings" );
	deepEqual(inp.calendar( "option", "defaults" ), $.calendar._defaults,
		"Get default settings" );
});

test( "disabled", function() {
	expect(8);
	var inp = TestHelpers.calendar.init( "#inp" );
	ok(!inp.calendar( "isDisabled" ), "Initially marked as enabled" );
	ok(!inp[0].disabled, "Field initially enabled" );
	inp.calendar( "option", "disabled", true);
	ok(inp.calendar( "isDisabled" ), "Marked as disabled" );
	ok(inp[0].disabled, "Field now disabled" );
	inp.calendar( "option", "disabled", false);
	ok(!inp.calendar( "isDisabled" ), "Marked as enabled" );
	ok(!inp[0].disabled, "Field now enabled" );
	inp.calendar( "destroy" );

	inp = TestHelpers.calendar.init( "#inp", { disabled: true });
	ok(inp.calendar( "isDisabled" ), "Initially marked as disabled" );
	ok(inp[0].disabled, "Field initially disabled" );
});

test( "change", function() {
	expect( 12 );
	var inp = TestHelpers.calendar.init( "#inp" ),
	inst = $.data(inp[0], TestHelpers.calendar.PROP_NAME);
	equal(inst.settings.showOn, null, "Initial setting showOn" );
	equal($.calendar._get(inst, "showOn" ), "focus", "Initial instance showOn" );
	equal($.calendar._defaults.showOn, "focus", "Initial default showOn" );
	inp.calendar( "change", "showOn", "button" );
	equal(inst.settings.showOn, "button", "Change setting showOn" );
	equal($.calendar._get(inst, "showOn" ), "button", "Change instance showOn" );
	equal($.calendar._defaults.showOn, "focus", "Retain default showOn" );
	inp.calendar( "change", {showOn: "both"});
	equal(inst.settings.showOn, "both", "Change setting showOn" );
	equal($.calendar._get(inst, "showOn" ), "both", "Change instance showOn" );
	equal($.calendar._defaults.showOn, "focus", "Retain default showOn" );
	inp.calendar( "change", "showOn", undefined);
	equal(inst.settings.showOn, null, "Clear setting showOn" );
	equal($.calendar._get(inst, "showOn" ), "focus", "Restore instance showOn" );
	equal($.calendar._defaults.showOn, "focus", "Retain default showOn" );
});

(function() {
	var url = window.location.search;
	url = decodeURIComponent( url.slice( url.indexOf( "swarmURL=" ) + 9 ) );

	// TODO: This test occassionally fails in IE in TestSwarm
	if ( $.ui.ie && url && url.indexOf( "http" ) === 0 ) {
		return;
	}

	asyncTest( "invocation", function() {
		var button, image,
			isOldIE = $.ui.ie && ( !document.documentMode || document.documentMode < 9 ),
			body = $( "body" );

		expect( isOldIE ? 25 : 29 );

		function step0() {
			var inp = TestHelpers.calendar.initNewInput(),
				dp = $( "#ui-calendar-div" );

			button = inp.siblings( "button" );
			ok( button.length === 0, "Focus - button absent" );
			image = inp.siblings( "img" );
			ok( image.length === 0, "Focus - image absent" );

			TestHelpers.calendar.onFocus( inp, function() {
				ok( dp.is( ":visible" ), "Focus - rendered on focus" );
				inp.simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE } );
				ok( !dp.is( ":visible" ), "Focus - hidden on exit" );
				step1();
			});
		}

		function step1() {

			var inp = TestHelpers.calendar.initNewInput(),
				dp = $( "#ui-calendar-div" );

			TestHelpers.calendar.onFocus( inp, function() {
				ok( dp.is( ":visible" ), "Focus - rendered on focus" );
				body.simulate( "mousedown", {} );
				ok( !dp.is( ":visible" ), "Focus - hidden on external click" );
				inp.calendar( "hide" ).calendar( "destroy" );

				step2();
			});
		}

		function step2() {
			var inp = TestHelpers.calendar.initNewInput({
					showOn: "button",
					buttonText: "Popup"
				}),
				dp = $( "#ui-calendar-div" );

			ok( !dp.is( ":visible" ), "Button - initially hidden" );
			button = inp.siblings( "button" );
			image = inp.siblings( "img" );
			ok( button.length === 1, "Button - button present" );
			ok( image.length === 0, "Button - image absent" );
			equal( button.text(), "Popup", "Button - button text" );

			TestHelpers.calendar.onFocus( inp, function() {
				ok( !dp.is( ":visible" ), "Button - not rendered on focus" );
				button.click();
				ok( dp.is( ":visible" ), "Button - rendered on button click" );
				button.click();
				ok( !dp.is( ":visible" ), "Button - hidden on second button click" );
				inp.calendar( "hide" ).calendar( "destroy" );

				step3();
			});
		}

		function step3() {
			var inp = TestHelpers.calendar.initNewInput({
					showOn: "button",
					buttonImageOnly: true,
					buttonImage: "images/calendar.gif",
					buttonText: "Cal"
				}),
				dp = $( "#ui-calendar-div" );

			ok( !dp.is( ":visible" ), "Image button - initially hidden" );
			button = inp.siblings( "button" );
			ok( button.length === 0, "Image button - button absent" );
			image = inp.siblings( "img" );
			ok( image.length === 1, "Image button - image present" );
			ok( /images\/calendar\.gif$/.test( image.attr( "src" ) ), "Image button - image source" );
			equal( image.attr( "title" ), "Cal", "Image button - image text" );

			TestHelpers.calendar.onFocus( inp, function() {
				ok( !dp.is( ":visible" ), "Image button - not rendered on focus" );
				image.click();
				ok( dp.is( ":visible" ), "Image button - rendered on image click" );
				image.click();
				ok( !dp.is( ":visible" ), "Image button - hidden on second image click" );
				inp.calendar( "hide" ).calendar( "destroy" );

				step4();
			});
		}

		function step4() {
			var inp = TestHelpers.calendar.initNewInput({
					showOn: "both",
					buttonImage: "images/calendar.gif"
				}),
				dp = $( "#ui-calendar-div" );

			ok( !dp.is( ":visible" ), "Both - initially hidden" );
			button = inp.siblings( "button" );
			ok( button.length === 1, "Both - button present" );
			image = inp.siblings( "img" );
			ok( image.length === 0, "Both - image absent" );
			image = button.children( "img" );
			ok( image.length === 1, "Both - button image present" );

			// TODO: This test occasionally fails to focus in IE8 in BrowserStack
			if ( !isOldIE ) {
				TestHelpers.calendar.onFocus( inp, function() {
					ok( dp.is( ":visible" ), "Both - rendered on focus" );
					body.simulate( "mousedown", {} );
					ok( !dp.is( ":visible" ), "Both - hidden on external click" );
					button.click();
					ok( dp.is( ":visible" ), "Both - rendered on button click" );
					button.click();
					ok( !dp.is( ":visible" ), "Both - hidden on second button click" );
					inp.calendar( "hide" ).calendar( "destroy" );

					start();
				});
			} else {
				start();
			}
		}

		step0();
	});
})();

test( "otherMonths", function() {
	expect( 8 );
	var inp = TestHelpers.calendar.init( "#inp" ),
		pop = $( "#ui-calendar-div" );
	inp.val( "06/01/2009" ).calendar( "show" );
	equal(pop.find( "tbody" ).text(),
		// support: IE <9, jQuery <1.8
		// In IE7/8 with jQuery <1.8, encoded spaces behave in strange ways
		$( "<span>\u00a0123456789101112131415161718192021222324252627282930\u00a0\u00a0\u00a0\u00a0</span>" ).text(),
		"Other months - none" );
	ok(pop.find( "td:last *" ).length === 0, "Other months - no content" );
	inp.calendar( "hide" ).calendar( "option", "showOtherMonths", true).calendar( "show" );
	equal(pop.find( "tbody" ).text(), "311234567891011121314151617181920212223242526272829301234",
		"Other months - show" );
	ok(pop.find( "td:last span" ).length === 1, "Other months - span content" );
	inp.calendar( "hide" ).calendar( "option", "selectOtherMonths", true).calendar( "show" );
	equal(pop.find( "tbody" ).text(), "311234567891011121314151617181920212223242526272829301234",
		"Other months - select" );
	ok(pop.find( "td:last a" ).length === 1, "Other months - link content" );
	inp.calendar( "hide" ).calendar( "option", "showOtherMonths", false).calendar( "show" );
	equal(pop.find( "tbody" ).text(),
		// support: IE <9, jQuery <1.8
		// In IE7/8 with jQuery <1.8, encoded spaces behave in strange ways
		$( "<span>\u00a0123456789101112131415161718192021222324252627282930\u00a0\u00a0\u00a0\u00a0</span>" ).text(),
		"Other months - none" );
	ok(pop.find( "td:last *" ).length === 0, "Other months - no content" );
});

test( "defaultDate", function() {
	expect( 16 );
	var inp = TestHelpers.calendar.init( "#inp" ),
		date = new Date();
	inp.val( "" ).calendar( "show" ).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), date, "Default date null" );

	// Numeric values
	inp.calendar( "option", {defaultDate: -2}).
		calendar( "hide" ).val( "" ).calendar( "show" ).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	date.setDate(date.getDate() - 2);
	TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), date, "Default date -2" );

	date = new Date();
	inp.calendar( "option", {defaultDate: 3}).
		calendar( "hide" ).val( "" ).calendar( "show" ).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	date.setDate(date.getDate() + 3);
	TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), date, "Default date 3" );

	date = new Date();
	inp.calendar( "option", {defaultDate: 1 / "a"}).
		calendar( "hide" ).val( "" ).calendar( "show" ).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), date, "Default date NaN" );

	// String offset values
	inp.calendar( "option", {defaultDate: "-1d"}).
		calendar( "hide" ).val( "" ).calendar( "show" ).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	date.setDate(date.getDate() - 1);
	TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), date, "Default date -1d" );
	inp.calendar( "option", {defaultDate: "+3D"}).
		calendar( "hide" ).val( "" ).calendar( "show" ).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	date.setDate(date.getDate() + 4);
	TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), date, "Default date +3D" );
	inp.calendar( "option", {defaultDate: " -2 w "}).
		calendar( "hide" ).val( "" ).calendar( "show" ).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	date = new Date();
	date.setDate(date.getDate() - 14);
	TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), date, "Default date -2 w" );
	inp.calendar( "option", {defaultDate: "+1 W"}).
		calendar( "hide" ).val( "" ).calendar( "show" ).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	date.setDate(date.getDate() + 21);
	TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), date, "Default date +1 W" );
	inp.calendar( "option", {defaultDate: " -1 m "}).
		calendar( "hide" ).val( "" ).calendar( "show" ).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	date = TestHelpers.calendar.addMonths(new Date(), -1);
	TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), date, "Default date -1 m" );
	inp.calendar( "option", {defaultDate: "+2M"}).
		calendar( "hide" ).val( "" ).calendar( "show" ).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	date = TestHelpers.calendar.addMonths(new Date(), 2);
	TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), date, "Default date +2M" );
	inp.calendar( "option", {defaultDate: "-2y"}).
		calendar( "hide" ).val( "" ).calendar( "show" ).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	date = new Date();
	date.setFullYear(date.getFullYear() - 2);
	TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), date, "Default date -2y" );
	inp.calendar( "option", {defaultDate: "+1 Y "}).
		calendar( "hide" ).val( "" ).calendar( "show" ).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	date.setFullYear(date.getFullYear() + 3);
	TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), date, "Default date +1 Y" );
	inp.calendar( "option", {defaultDate: "+1M +10d"}).
		calendar( "hide" ).val( "" ).calendar( "show" ).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	date = TestHelpers.calendar.addMonths(new Date(), 1);
	date.setDate(date.getDate() + 10);
	TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), date, "Default date +1M +10d" );
	// String date values
	inp.calendar( "option", {defaultDate: "07/04/2007"}).
		calendar( "hide" ).val( "" ).calendar( "show" ).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	date = new Date(2007, 7 - 1, 4);
	TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), date, "Default date 07/04/2007" );
	inp.calendar( "option", {dateFormat: "yy-mm-dd", defaultDate: "2007-04-02"}).
		calendar( "hide" ).val( "" ).calendar( "show" ).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	date = new Date(2007, 4 - 1, 2);
	TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), date, "Default date 2007-04-02" );
	// Date value
	date = new Date(2007, 1 - 1, 26);
	inp.calendar( "option", {dateFormat: "mm/dd/yy", defaultDate: date}).
		calendar( "hide" ).val( "" ).calendar( "show" ).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), date, "Default date 01/26/2007" );
});

test( "miscellaneous", function() {
	expect( 19 );
	var curYear, longNames, shortNames, date,
		dp = $( "#ui-calendar-div" ),
		inp = TestHelpers.calendar.init( "#inp" );
	// Year range
	function genRange(start, offset) {
		var i = start,
			range = "";
		for (; i < start + offset; i++) {
			range += i;
		}
		return range;
	}
	curYear = new Date().getFullYear();
	inp.val( "02/04/2008" ).calendar( "show" );
	equal(dp.find( ".ui-calendar-year" ).text(), "2008", "Year range - read-only default" );
	inp.calendar( "hide" ).calendar( "option", {changeYear: true}).calendar( "show" );
	equal(dp.find( ".ui-calendar-year" ).text(), genRange(2008 - 10, 21), "Year range - changeable default" );
	inp.calendar( "hide" ).calendar( "option", {yearRange: "c-6:c+2", changeYear: true}).calendar( "show" );
	equal(dp.find( ".ui-calendar-year" ).text(), genRange(2008 - 6, 9), "Year range - c-6:c+2" );
	inp.calendar( "hide" ).calendar( "option", {yearRange: "2000:2010", changeYear: true}).calendar( "show" );
	equal(dp.find( ".ui-calendar-year" ).text(), genRange(2000, 11), "Year range - 2000:2010" );
	inp.calendar( "hide" ).calendar( "option", {yearRange: "-5:+3", changeYear: true}).calendar( "show" );
	equal(dp.find( ".ui-calendar-year" ).text(), genRange(curYear - 5, 9), "Year range - -5:+3" );
	inp.calendar( "hide" ).calendar( "option", {yearRange: "2000:-5", changeYear: true}).calendar( "show" );
	equal(dp.find( ".ui-calendar-year" ).text(), genRange(2000, curYear - 2004), "Year range - 2000:-5" );
	inp.calendar( "hide" ).calendar( "option", {yearRange: "", changeYear: true}).calendar( "show" );
	equal(dp.find( ".ui-calendar-year" ).text(), genRange(curYear, 1), "Year range - -6:+2" );

	// Navigation as date format
	inp.calendar( "option", {showButtonPanel: true});
	equal(dp.find( ".ui-calendar-prev" ).text(), "Prev", "Navigation prev - default" );
	equal(dp.find( ".ui-calendar-current" ).text(), "Today", "Navigation current - default" );
	equal(dp.find( ".ui-calendar-next" ).text(), "Next", "Navigation next - default" );
	inp.calendar( "hide" ).calendar( "option", {navigationAsDateFormat: true, prevText: "< M", currentText: "MM", nextText: "M >"}).
		val( "02/04/2008" ).calendar( "show" );
	longNames = $.calendar.regional[""].monthNames;
	shortNames = $.calendar.regional[""].monthNamesShort;
	date = new Date();
	equal(dp.find( ".ui-calendar-prev" ).text(), "< " + shortNames[0], "Navigation prev - as date format" );
	equal(dp.find( ".ui-calendar-current" ).text(),
		longNames[date.getMonth()], "Navigation current - as date format" );
	equal(dp.find( ".ui-calendar-next" ).text(),
		shortNames[2] + " >", "Navigation next - as date format" );
	inp.simulate( "keydown", {keyCode: $.ui.keyCode.PAGE_DOWN});
	equal(dp.find( ".ui-calendar-prev" ).text(),
		"< " + shortNames[1], "Navigation prev - as date format + pgdn" );
	equal(dp.find( ".ui-calendar-current" ).text(),
		longNames[date.getMonth()], "Navigation current - as date format + pgdn" );
	equal(dp.find( ".ui-calendar-next" ).text(),
		shortNames[3] + " >", "Navigation next - as date format + pgdn" );
	inp.calendar( "hide" ).calendar( "option", {gotoCurrent: true}).
		val( "02/04/2008" ).calendar( "show" );
	equal(dp.find( ".ui-calendar-prev" ).text(),
		"< " + shortNames[0], "Navigation prev - as date format + goto current" );
	equal(dp.find( ".ui-calendar-current" ).text(),
		longNames[1], "Navigation current - as date format + goto current" );
	equal(dp.find( ".ui-calendar-next" ).text(),
		shortNames[2] + " >", "Navigation next - as date format + goto current" );
});

test( "minMax", function() {
	expect( 23 );
	var date,
		inp = TestHelpers.calendar.init( "#inp" ),
		dp = $( "#ui-calendar-div" ),
		lastYear = new Date(2007, 6 - 1, 4),
		nextYear = new Date(2009, 6 - 1, 4),
		minDate = new Date(2008, 2 - 1, 29),
		maxDate = new Date(2008, 12 - 1, 7);
	inp.val( "06/04/2008" ).calendar( "show" );
	inp.simulate( "keydown", {ctrlKey: true, keyCode: $.ui.keyCode.PAGE_UP}).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), lastYear,
		"Min/max - null, null - ctrl+pgup" );
	inp.val( "06/04/2008" ).calendar( "show" );
	inp.simulate( "keydown", {ctrlKey: true, keyCode: $.ui.keyCode.PAGE_DOWN}).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), nextYear,
		"Min/max - null, null - ctrl+pgdn" );
	inp.calendar( "option", {minDate: minDate}).
		calendar( "hide" ).val( "06/04/2008" ).calendar( "show" );
	inp.simulate( "keydown", {ctrlKey: true, keyCode: $.ui.keyCode.PAGE_UP}).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), minDate,
		"Min/max - 02/29/2008, null - ctrl+pgup" );
	inp.val( "06/04/2008" ).calendar( "show" );
	inp.simulate( "keydown", {ctrlKey: true, keyCode: $.ui.keyCode.PAGE_DOWN}).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), nextYear,
		"Min/max - 02/29/2008, null - ctrl+pgdn" );
	inp.calendar( "option", {maxDate: maxDate}).
		calendar( "hide" ).val( "06/04/2008" ).calendar( "show" );
	inp.simulate( "keydown", {ctrlKey: true, keyCode: $.ui.keyCode.PAGE_UP}).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), minDate,
		"Min/max - 02/29/2008, 12/07/2008 - ctrl+pgup" );
	inp.val( "06/04/2008" ).calendar( "show" );
	inp.simulate( "keydown", {ctrlKey: true, keyCode: $.ui.keyCode.PAGE_DOWN}).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), maxDate,
		"Min/max - 02/29/2008, 12/07/2008 - ctrl+pgdn" );
	inp.calendar( "option", {minDate: null}).
		calendar( "hide" ).val( "06/04/2008" ).calendar( "show" );
	inp.simulate( "keydown", {ctrlKey: true, keyCode: $.ui.keyCode.PAGE_UP}).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), lastYear,
		"Min/max - null, 12/07/2008 - ctrl+pgup" );
	inp.val( "06/04/2008" ).calendar( "show" );
	inp.simulate( "keydown", {ctrlKey: true, keyCode: $.ui.keyCode.PAGE_DOWN}).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), maxDate,
		"Min/max - null, 12/07/2008 - ctrl+pgdn" );
	// Relative dates
	date = new Date();
	date.setDate(date.getDate() - 7);
	inp.calendar( "option", {minDate: "-1w", maxDate: "+1 M +10 D "}).
		calendar( "hide" ).val( "" ).calendar( "show" );
	inp.simulate( "keydown", {ctrlKey: true, keyCode: $.ui.keyCode.PAGE_UP}).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), date,
		"Min/max - -1w, +1 M +10 D - ctrl+pgup" );
	date = TestHelpers.calendar.addMonths(new Date(), 1);
	date.setDate(date.getDate() + 10);
	inp.val( "" ).calendar( "show" );
	inp.simulate( "keydown", {ctrlKey: true, keyCode: $.ui.keyCode.PAGE_DOWN}).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), date,
		"Min/max - -1w, +1 M +10 D - ctrl+pgdn" );
	// With existing date
	inp = TestHelpers.calendar.init( "#inp" );
	inp.val( "06/04/2008" ).calendar( "option", {minDate: minDate});
	TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), new Date(2008, 6 - 1, 4), "Min/max - setDate > min" );
	inp.calendar( "option", {minDate: null}).val( "01/04/2008" ).calendar( "option", {minDate: minDate});
	TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), minDate, "Min/max - setDate < min" );
	inp.calendar( "option", {minDate: null}).val( "06/04/2008" ).calendar( "option", {maxDate: maxDate});
	TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), new Date(2008, 6 - 1, 4), "Min/max - setDate < max" );
	inp.calendar( "option", {maxDate: null}).val( "01/04/2009" ).calendar( "option", {maxDate: maxDate});
	TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), maxDate, "Min/max - setDate > max" );
	inp.calendar( "option", {maxDate: null}).val( "01/04/2008" ).calendar( "option", {minDate: minDate, maxDate: maxDate});
	TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), minDate, "Min/max - setDate < min" );
	inp.calendar( "option", {maxDate: null}).val( "06/04/2008" ).calendar( "option", {minDate: minDate, maxDate: maxDate});
	TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), new Date(2008, 6 - 1, 4), "Min/max - setDate > min, < max" );
	inp.calendar( "option", {maxDate: null}).val( "01/04/2009" ).calendar( "option", {minDate: minDate, maxDate: maxDate});
	TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), maxDate, "Min/max - setDate > max" );

	inp.calendar( "option", {yearRange: "-0:+1"}).val( "01/01/" + new Date().getFullYear());
	ok(dp.find( ".ui-calendar-prev" ).hasClass( "ui-state-disabled" ), "Year Range Test - previous button disabled at 1/1/minYear" );
	inp.calendar( "setDate", "12/30/" + new Date().getFullYear());
	ok(dp.find( ".ui-calendar-next" ).hasClass( "ui-state-disabled" ), "Year Range Test - next button disabled at 12/30/maxYear" );

	inp.calendar( "option", {
		minDate: new Date(1900, 0, 1),
		maxDate: "-6Y",
		yearRange: "1900:-6"
	}).val( "" );
	ok(dp.find( ".ui-calendar-next" ).hasClass( "ui-state-disabled" ), "Year Range Test - next button disabled" );
	ok(!dp.find( ".ui-calendar-prev" ).hasClass( "ui-state-disabled" ), "Year Range Test - prev button enabled" );

	inp.calendar( "option", {
		minDate: new Date(1900, 0, 1),
		maxDate: "1/25/2007",
		yearRange: "1900:2007"
	}).val( "" );
	ok(dp.find( ".ui-calendar-next" ).hasClass( "ui-state-disabled" ), "Year Range Test - next button disabled" );
	ok(!dp.find( ".ui-calendar-prev" ).hasClass( "ui-state-disabled" ), "Year Range Test - prev button enabled" );
});

test( "setDate", function() {
	expect( 24 );
	var inl, alt, minDate, maxDate, dateAndTimeToSet, dateAndTimeClone,
		inp = TestHelpers.calendar.init( "#inp" ),
		date1 = new Date(2008, 6 - 1, 4),
		date2 = new Date();
	ok(inp.calendar( "getDate" ) == null, "Set date - default" );
	inp.calendar( "setDate", date1);
	TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), date1, "Set date - 2008-06-04" );
	date1 = new Date();
	date1.setDate(date1.getDate() + 7);
	inp.calendar( "setDate", +7);
	TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), date1, "Set date - +7" );
	date2.setFullYear(date2.getFullYear() + 2);
	inp.calendar( "setDate", "+2y" );
	TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), date2, "Set date - +2y" );
	inp.calendar( "setDate", date1, date2);
	TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), date1, "Set date - two dates" );
	inp.calendar( "setDate" );
	ok(inp.calendar( "getDate" ) == null, "Set date - null" );
	// Relative to current date
	date1 = new Date();
	date1.setDate(date1.getDate() + 7);
	inp.calendar( "setDate", "c +7" );
	TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), date1, "Set date - c +7" );
	date1.setDate(date1.getDate() + 7);
	inp.calendar( "setDate", "c+7" );
	TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), date1, "Set date - c+7" );
	date1.setDate(date1.getDate() - 21);
	inp.calendar( "setDate", "c -3 w" );
	TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), date1, "Set date - c -3 w" );
	// Inline
	inl = TestHelpers.calendar.init( "#inl" );
	date1 = new Date(2008, 6 - 1, 4);
	date2 = new Date();
	TestHelpers.calendar.equalsDate(inl.calendar( "getDate" ), date2, "Set date inline - default" );
	inl.calendar( "setDate", date1);
	TestHelpers.calendar.equalsDate(inl.calendar( "getDate" ), date1, "Set date inline - 2008-06-04" );
	date1 = new Date();
	date1.setDate(date1.getDate() + 7);
	inl.calendar( "setDate", +7);
	TestHelpers.calendar.equalsDate(inl.calendar( "getDate" ), date1, "Set date inline - +7" );
	date2.setFullYear(date2.getFullYear() + 2);
	inl.calendar( "setDate", "+2y" );
	TestHelpers.calendar.equalsDate(inl.calendar( "getDate" ), date2, "Set date inline - +2y" );
	inl.calendar( "setDate", date1, date2);
	TestHelpers.calendar.equalsDate(inl.calendar( "getDate" ), date1, "Set date inline - two dates" );
	inl.calendar( "setDate" );
	ok(inl.calendar( "getDate" ) == null, "Set date inline - null" );
	// Alternate field
	alt = $( "#alt" );
	inp.calendar( "option", {altField: "#alt", altFormat: "yy-mm-dd"});
	date1 = new Date(2008, 6 - 1, 4);
	inp.calendar( "setDate", date1);
	equal(inp.val(), "06/04/2008", "Set date alternate - 06/04/2008" );
	equal(alt.val(), "2008-06-04", "Set date alternate - 2008-06-04" );
	// With minimum/maximum
	inp = TestHelpers.calendar.init( "#inp" );
	date1 = new Date(2008, 1 - 1, 4);
	date2 = new Date(2008, 6 - 1, 4);
	minDate = new Date(2008, 2 - 1, 29);
	maxDate = new Date(2008, 3 - 1, 28);
	inp.val( "" ).calendar( "option", {minDate: minDate}).calendar( "setDate", date2);
	TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), date2, "Set date min/max - setDate > min" );
	inp.calendar( "setDate", date1);
	TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), minDate, "Set date min/max - setDate < min" );
	inp.val( "" ).calendar( "option", {maxDate: maxDate, minDate: null}).calendar( "setDate", date1);
	TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), date1, "Set date min/max - setDate < max" );
	inp.calendar( "setDate", date2);
	TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), maxDate, "Set date min/max - setDate > max" );
	inp.val( "" ).calendar( "option", {minDate: minDate}).calendar( "setDate", date1);
	TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), minDate, "Set date min/max - setDate < min" );
	inp.calendar( "setDate", date2);
	TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), maxDate, "Set date min/max - setDate > max" );
	dateAndTimeToSet = new Date(2008, 3 - 1, 28, 1, 11, 0);
	dateAndTimeClone = new Date(2008, 3 - 1, 28, 1, 11, 0);
	inp.calendar( "setDate", dateAndTimeToSet);
	equal(dateAndTimeToSet.getTime(), dateAndTimeClone.getTime(), "Date object passed should not be changed by setDate" );
});

test( "altField", function() {
	expect( 10 );
	var inp = TestHelpers.calendar.init( "#inp" ),
		alt = $( "#alt" );
	// No alternate field set
	alt.val( "" );
	inp.val( "06/04/2008" ).calendar( "show" );
	inp.simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	equal(inp.val(), "06/04/2008", "Alt field - dp - enter" );
	equal(alt.val(), "", "Alt field - alt not set" );
	// Alternate field set
	alt.val( "" );
	inp.calendar( "option", {altField: "#alt", altFormat: "yy-mm-dd"}).
		val( "06/04/2008" ).calendar( "show" );
	inp.simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	equal(inp.val(), "06/04/2008", "Alt field - dp - enter" );
	equal(alt.val(), "2008-06-04", "Alt field - alt - enter" );
	// Move from initial date
	alt.val( "" );
	inp.val( "06/04/2008" ).calendar( "show" );
	inp.simulate( "keydown", {keyCode: $.ui.keyCode.PAGE_DOWN}).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	equal(inp.val(), "07/04/2008", "Alt field - dp - pgdn" );
	equal(alt.val(), "2008-07-04", "Alt field - alt - pgdn" );
	// Alternate field set - closed
	alt.val( "" );
	inp.val( "06/04/2008" ).calendar( "show" );
	inp.simulate( "keydown", {keyCode: $.ui.keyCode.PAGE_DOWN}).
		simulate( "keydown", {keyCode: $.ui.keyCode.ESCAPE});
	equal(inp.val(), "06/04/2008", "Alt field - dp - pgdn/esc" );
	equal(alt.val(), "", "Alt field - alt - pgdn/esc" );
	// Clear date and alternate
	alt.val( "" );
	inp.val( "06/04/2008" ).calendar( "show" );
	inp.simulate( "keydown", {ctrlKey: true, keyCode: $.ui.keyCode.END});
	equal(inp.val(), "", "Alt field - dp - ctrl+end" );
	equal(alt.val(), "", "Alt field - alt - ctrl+end" );
});

test( "autoSize", function() {
	expect( 15 );
	var inp = TestHelpers.calendar.init( "#inp" );
	equal(inp.prop( "size" ), 20, "Auto size - default" );
	inp.calendar( "option", "autoSize", true);
	equal(inp.prop( "size" ), 10, "Auto size - mm/dd/yy" );
	inp.calendar( "option", "dateFormat", "m/d/yy" );
	equal(inp.prop( "size" ), 10, "Auto size - m/d/yy" );
	inp.calendar( "option", "dateFormat", "D M d yy" );
	equal(inp.prop( "size" ), 15, "Auto size - D M d yy" );
	inp.calendar( "option", "dateFormat", "DD, MM dd, yy" );
	equal(inp.prop( "size" ), 29, "Auto size - DD, MM dd, yy" );

	// French
	inp.calendar( "option", $.extend({autoSize: false}, $.calendar.regional.fr));
	equal(inp.prop( "size" ), 29, "Auto size - fr - default" );
	inp.calendar( "option", "autoSize", true);
	equal(inp.prop( "size" ), 10, "Auto size - fr - dd/mm/yy" );
	inp.calendar( "option", "dateFormat", "m/d/yy" );
	equal(inp.prop( "size" ), 10, "Auto size - fr - m/d/yy" );
	inp.calendar( "option", "dateFormat", "D M d yy" );
	equal(inp.prop( "size" ), 18, "Auto size - fr - D M d yy" );
	inp.calendar( "option", "dateFormat", "DD, MM dd, yy" );
	equal(inp.prop( "size" ), 28, "Auto size - fr - DD, MM dd, yy" );

	// Hebrew
	inp.calendar( "option", $.extend({autoSize: false}, $.calendar.regional.he));
	equal(inp.prop( "size" ), 28, "Auto size - he - default" );
	inp.calendar( "option", "autoSize", true);
	equal(inp.prop( "size" ), 10, "Auto size - he - dd/mm/yy" );
	inp.calendar( "option", "dateFormat", "m/d/yy" );
	equal(inp.prop( "size" ), 10, "Auto size - he - m/d/yy" );
	inp.calendar( "option", "dateFormat", "D M d yy" );
	equal(inp.prop( "size" ), 16, "Auto size - he - D M d yy" );
	inp.calendar( "option", "dateFormat", "DD, MM dd, yy" );
	equal(inp.prop( "size" ), 23, "Auto size - he - DD, MM dd, yy" );
});

test( "daylightSaving", function() {
	expect( 25 );
	var inp = TestHelpers.calendar.init( "#inp" ),
		dp = $( "#ui-calendar-div" );
	ok(true, "Daylight saving - " + new Date());
	// Australia, Sydney - AM change, southern hemisphere
	inp.val( "04/01/2008" ).calendar( "show" );
	$( ".ui-calendar-calendar td:eq(6) a", dp).simulate( "click" );
	equal(inp.val(), "04/05/2008", "Daylight saving - Australia 04/05/2008" );
	inp.val( "04/01/2008" ).calendar( "show" );
	$( ".ui-calendar-calendar td:eq(7) a", dp).simulate( "click" );
	equal(inp.val(), "04/06/2008", "Daylight saving - Australia 04/06/2008" );
	inp.val( "04/01/2008" ).calendar( "show" );
	$( ".ui-calendar-calendar td:eq(8) a", dp).simulate( "click" );
	equal(inp.val(), "04/07/2008", "Daylight saving - Australia 04/07/2008" );
	inp.val( "10/01/2008" ).calendar( "show" );
	$( ".ui-calendar-calendar td:eq(6) a", dp).simulate( "click" );
	equal(inp.val(), "10/04/2008", "Daylight saving - Australia 10/04/2008" );
	inp.val( "10/01/2008" ).calendar( "show" );
	$( ".ui-calendar-calendar td:eq(7) a", dp).simulate( "click" );
	equal(inp.val(), "10/05/2008", "Daylight saving - Australia 10/05/2008" );
	inp.val( "10/01/2008" ).calendar( "show" );
	$( ".ui-calendar-calendar td:eq(8) a", dp).simulate( "click" );
	equal(inp.val(), "10/06/2008", "Daylight saving - Australia 10/06/2008" );
	// Brasil, Brasilia - midnight change, southern hemisphere
	inp.val( "02/01/2008" ).calendar( "show" );
	$( ".ui-calendar-calendar td:eq(20) a", dp).simulate( "click" );
	equal(inp.val(), "02/16/2008", "Daylight saving - Brasil 02/16/2008" );
	inp.val( "02/01/2008" ).calendar( "show" );
	$( ".ui-calendar-calendar td:eq(21) a", dp).simulate( "click" );
	equal(inp.val(), "02/17/2008", "Daylight saving - Brasil 02/17/2008" );
	inp.val( "02/01/2008" ).calendar( "show" );
	$( ".ui-calendar-calendar td:eq(22) a", dp).simulate( "click" );
	equal(inp.val(), "02/18/2008", "Daylight saving - Brasil 02/18/2008" );
	inp.val( "10/01/2008" ).calendar( "show" );
	$( ".ui-calendar-calendar td:eq(13) a", dp).simulate( "click" );
	equal(inp.val(), "10/11/2008", "Daylight saving - Brasil 10/11/2008" );
	inp.val( "10/01/2008" ).calendar( "show" );
	$( ".ui-calendar-calendar td:eq(14) a", dp).simulate( "click" );
	equal(inp.val(), "10/12/2008", "Daylight saving - Brasil 10/12/2008" );
	inp.val( "10/01/2008" ).calendar( "show" );
	$( ".ui-calendar-calendar td:eq(15) a", dp).simulate( "click" );
	equal(inp.val(), "10/13/2008", "Daylight saving - Brasil 10/13/2008" );
	// Lebanon, Beirut - midnight change, northern hemisphere
	inp.val( "03/01/2008" ).calendar( "show" );
	$( ".ui-calendar-calendar td:eq(34) a", dp).simulate( "click" );
	equal(inp.val(), "03/29/2008", "Daylight saving - Lebanon 03/29/2008" );
	inp.val( "03/01/2008" ).calendar( "show" );
	$( ".ui-calendar-calendar td:eq(35) a", dp).simulate( "click" );
	equal(inp.val(), "03/30/2008", "Daylight saving - Lebanon 03/30/2008" );
	inp.val( "03/01/2008" ).calendar( "show" );
	$( ".ui-calendar-calendar td:eq(36) a", dp).simulate( "click" );
	equal(inp.val(), "03/31/2008", "Daylight saving - Lebanon 03/31/2008" );
	inp.val( "10/01/2008" ).calendar( "show" );
	$( ".ui-calendar-calendar td:eq(27) a", dp).simulate( "click" );
	equal(inp.val(), "10/25/2008", "Daylight saving - Lebanon 10/25/2008" );
	inp.val( "10/01/2008" ).calendar( "show" );
	$( ".ui-calendar-calendar td:eq(28) a", dp).simulate( "click" );
	equal(inp.val(), "10/26/2008", "Daylight saving - Lebanon 10/26/2008" );
	inp.val( "10/01/2008" ).calendar( "show" );
	$( ".ui-calendar-calendar td:eq(29) a", dp).simulate( "click" );
	equal(inp.val(), "10/27/2008", "Daylight saving - Lebanon 10/27/2008" );
	// US, Eastern - AM change, northern hemisphere
	inp.val( "03/01/2008" ).calendar( "show" );
	$( ".ui-calendar-calendar td:eq(13) a", dp).simulate( "click" );
	equal(inp.val(), "03/08/2008", "Daylight saving - US 03/08/2008" );
	inp.val( "03/01/2008" ).calendar( "show" );
	$( ".ui-calendar-calendar td:eq(14) a", dp).simulate( "click" );
	equal(inp.val(), "03/09/2008", "Daylight saving - US 03/09/2008" );
	inp.val( "03/01/2008" ).calendar( "show" );
	$( ".ui-calendar-calendar td:eq(15) a", dp).simulate( "click" );
	equal(inp.val(), "03/10/2008", "Daylight saving - US 03/10/2008" );
	inp.val( "11/01/2008" ).calendar( "show" );
	$( ".ui-calendar-calendar td:eq(6) a", dp).simulate( "click" );
	equal(inp.val(), "11/01/2008", "Daylight saving - US 11/01/2008" );
	inp.val( "11/01/2008" ).calendar( "show" );
	$( ".ui-calendar-calendar td:eq(7) a", dp).simulate( "click" );
	equal(inp.val(), "11/02/2008", "Daylight saving - US 11/02/2008" );
	inp.val( "11/01/2008" ).calendar( "show" );
	$( ".ui-calendar-calendar td:eq(8) a", dp).simulate( "click" );
	equal(inp.val(), "11/03/2008", "Daylight saving - US 11/03/2008" );
});

var beforeShowThis = null,
	beforeShowInput = null,
	beforeShowInst = null,
	beforeShowDayThis = null,
	beforeShowDayOK = true;


function beforeAll(input, inst) {
	beforeShowThis = this;
	beforeShowInput = input;
	beforeShowInst = inst;
	return {currentText: "Current"};
}

function beforeDay(date) {
	beforeShowDayThis = this;
	beforeShowDayOK &= (date > new Date(2008, 1 - 1, 26) &&
		date < new Date(2008, 3 - 1, 6));
	return [(date.getDate() % 2 === 0), (date.getDate() % 10 === 0 ? "day10" : "" ),
		(date.getDate() % 3 === 0 ? "Divisble by 3" : "" )];
}

test( "callbacks", function() {
	expect( 13 );
	// Before show
	var dp, day20, day21,
		inp = TestHelpers.calendar.init( "#inp", {beforeShow: beforeAll}),
		inst = $.data(inp[0], "calendar" );
	equal($.calendar._get(inst, "currentText" ), "Today", "Before show - initial" );
	inp.val( "02/04/2008" ).calendar( "show" );
	equal($.calendar._get(inst, "currentText" ), "Current", "Before show - changed" );
	ok(beforeShowThis.id === inp[0].id, "Before show - this OK" );
	ok(beforeShowInput.id === inp[0].id, "Before show - input OK" );
	deepEqual(beforeShowInst, inst, "Before show - inst OK" );
	inp.calendar( "hide" ).calendar( "destroy" );
	// Before show day
	inp = TestHelpers.calendar.init( "#inp", {beforeShowDay: beforeDay});
	dp = $( "#ui-calendar-div" );
	inp.val( "02/04/2008" ).calendar( "show" );
	ok(beforeShowDayThis.id === inp[0].id, "Before show day - this OK" );
	ok(beforeShowDayOK, "Before show day - dates OK" );
	day20 = dp.find( ".ui-calendar-calendar td:contains('20')" );
	day21 = dp.find( ".ui-calendar-calendar td:contains('21')" );
	ok(!day20.is( ".ui-calendar-unselectable" ), "Before show day - unselectable 20" );
	ok(day21.is( ".ui-calendar-unselectable" ), "Before show day - unselectable 21" );
	ok(day20.is( ".day10" ), "Before show day - CSS 20" );
	ok(!day21.is( ".day10" ), "Before show day - CSS 21" );
	ok(!day20.attr( "title" ), "Before show day - title 20" );
	ok(day21.attr( "title" ) === "Divisble by 3", "Before show day - title 21" );
	inp.calendar( "hide" ).calendar( "destroy" );
});

test( "beforeShowDay - tooltips with quotes", function() {
	expect( 1 );
	var inp, dp;
	inp = TestHelpers.calendar.init( "#inp", {
		beforeShowDay: function() {
			return [ true, "", "'" ];
		}
	});
	dp = $( "#ui-calendar-div" );

	inp.calendar( "show" );
	equal( dp.find( ".ui-calendar-calendar td:contains('9')" ).attr( "title" ), "'" );
	inp.calendar( "hide" ).calendar( "destroy" );
});

test( "localisation", function() {
	expect( 24 );
	var dp, month, day, date,
		inp = TestHelpers.calendar.init( "#inp", $.calendar.regional.fr);
	inp.calendar( "option", {dateFormat: "DD, d MM yy", showButtonPanel:true, changeMonth:true, changeYear:true}).val( "" ).calendar( "show" );
	dp = $( "#ui-calendar-div" );
	equal($( ".ui-calendar-close", dp).text(), "Fermer", "Localisation - close" );
	$( ".ui-calendar-close", dp).simulate( "mouseover" );
	equal($( ".ui-calendar-prev", dp).text(), "Précédent", "Localisation - previous" );
	equal($( ".ui-calendar-current", dp).text(), "Aujourd'hui", "Localisation - current" );
	equal($( ".ui-calendar-next", dp).text(), "Suivant", "Localisation - next" );
	month = 0;
	$( ".ui-calendar-month option", dp).each(function() {
		equal($(this).text(), $.calendar.regional.fr.monthNamesShort[month],
			"Localisation - month " + month);
		month++;
	});
	day = 1;
	$( ".ui-calendar-calendar th", dp).each(function() {
		equal($(this).text(), $.calendar.regional.fr.dayNamesMin[day],
			"Localisation - day " + day);
		day = (day + 1) % 7;
	});
	inp.simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	date = new Date();
	equal(inp.val(), $.calendar.regional.fr.dayNames[date.getDay()] + ", " +
		date.getDate() + " " + $.calendar.regional.fr.monthNames[date.getMonth()] +
		" " + date.getFullYear(), "Localisation - formatting" );
});

test( "noWeekends", function() {
	expect( 31 );
	var i, date;
	for (i = 1; i <= 31; i++) {
		date = new Date(2001, 1 - 1, i);
		deepEqual($.calendar.noWeekends(date), [(i + 1) % 7 >= 2, ""],
			"No weekends " + date);
	}
});

test( "iso8601Week", function() {
	expect( 12 );
	var date = new Date(2000, 12 - 1, 31);
	equal($.calendar.iso8601Week(date), 52, "ISO 8601 week " + date);
	date = new Date(2001, 1 - 1, 1);
	equal($.calendar.iso8601Week(date), 1, "ISO 8601 week " + date);
	date = new Date(2001, 1 - 1, 7);
	equal($.calendar.iso8601Week(date), 1, "ISO 8601 week " + date);
	date = new Date(2001, 1 - 1, 8);
	equal($.calendar.iso8601Week(date), 2, "ISO 8601 week " + date);
	date = new Date(2003, 12 - 1, 28);
	equal($.calendar.iso8601Week(date), 52, "ISO 8601 week " + date);
	date = new Date(2003, 12 - 1, 29);
	equal($.calendar.iso8601Week(date), 1, "ISO 8601 week " + date);
	date = new Date(2004, 1 - 1, 4);
	equal($.calendar.iso8601Week(date), 1, "ISO 8601 week " + date);
	date = new Date(2004, 1 - 1, 5);
	equal($.calendar.iso8601Week(date), 2, "ISO 8601 week " + date);
	date = new Date(2009, 12 - 1, 28);
	equal($.calendar.iso8601Week(date), 53, "ISO 8601 week " + date);
	date = new Date(2010, 1 - 1, 3);
	equal($.calendar.iso8601Week(date), 53, "ISO 8601 week " + date);
	date = new Date(2010, 1 - 1, 4);
	equal($.calendar.iso8601Week(date), 1, "ISO 8601 week " + date);
	date = new Date(2010, 1 - 1, 10);
	equal($.calendar.iso8601Week(date), 1, "ISO 8601 week " + date);
});

test( "parseDate", function() {
	expect( 26 );
	TestHelpers.calendar.init( "#inp" );
	var currentYear, gmtDate, fr, settings, zh;
	ok($.calendar.parseDate( "d m y", "" ) == null, "Parse date empty" );
	TestHelpers.calendar.equalsDate($.calendar.parseDate( "d m y", "3 2 01" ),
		new Date(2001, 2 - 1, 3), "Parse date d m y" );
	TestHelpers.calendar.equalsDate($.calendar.parseDate( "dd mm yy", "03 02 2001" ),
		new Date(2001, 2 - 1, 3), "Parse date dd mm yy" );
	TestHelpers.calendar.equalsDate($.calendar.parseDate( "d m y", "13 12 01" ),
		new Date(2001, 12 - 1, 13), "Parse date d m y" );
	TestHelpers.calendar.equalsDate($.calendar.parseDate( "dd mm yy", "13 12 2001" ),
		new Date(2001, 12 - 1, 13), "Parse date dd mm yy" );
	TestHelpers.calendar.equalsDate($.calendar.parseDate( "y-o", "01-34" ),
		new Date(2001, 2 - 1, 3), "Parse date y-o" );
	TestHelpers.calendar.equalsDate($.calendar.parseDate( "yy-oo", "2001-347" ),
		new Date(2001, 12 - 1, 13), "Parse date yy-oo" );
	TestHelpers.calendar.equalsDate($.calendar.parseDate( "oo yy", "348 2004" ),
		new Date(2004, 12 - 1, 13), "Parse date oo yy" );
	TestHelpers.calendar.equalsDate($.calendar.parseDate( "D d M y", "Sat 3 Feb 01" ),
		new Date(2001, 2 - 1, 3), "Parse date D d M y" );
	TestHelpers.calendar.equalsDate($.calendar.parseDate( "d MM DD yy", "3 February Saturday 2001" ),
		new Date(2001, 2 - 1, 3), "Parse date dd MM DD yy" );
	TestHelpers.calendar.equalsDate($.calendar.parseDate( "DD, MM d, yy", "Saturday, February 3, 2001" ),
		new Date(2001, 2 - 1, 3), "Parse date DD, MM d, yy" );
	TestHelpers.calendar.equalsDate($.calendar.parseDate( "'day' d 'of' MM (''DD''), yy",
		"day 3 of February ('Saturday'), 2001" ), new Date(2001, 2 - 1, 3),
		"Parse date 'day' d 'of' MM (''DD''), yy" );
	currentYear = new Date().getFullYear();
	TestHelpers.calendar.equalsDate($.calendar.parseDate( "y-m-d", (currentYear - 2000) + "-02-03" ),
			new Date(currentYear, 2 - 1, 3), "Parse date y-m-d - default cutuff" );
	TestHelpers.calendar.equalsDate($.calendar.parseDate( "y-m-d", (currentYear - 2000 + 10) + "-02-03" ),
			new Date(currentYear+10, 2 - 1, 3), "Parse date y-m-d - default cutuff" );
	TestHelpers.calendar.equalsDate($.calendar.parseDate( "y-m-d", (currentYear - 2000 + 11) + "-02-03" ),
			new Date(currentYear-89, 2 - 1, 3), "Parse date y-m-d - default cutuff" );
	TestHelpers.calendar.equalsDate($.calendar.parseDate( "y-m-d", "80-02-03", {shortYearCutoff: 80}),
		new Date(2080, 2 - 1, 3), "Parse date y-m-d - cutoff 80" );
	TestHelpers.calendar.equalsDate($.calendar.parseDate( "y-m-d", "81-02-03", {shortYearCutoff: 80}),
		new Date(1981, 2 - 1, 3), "Parse date y-m-d - cutoff 80" );
	TestHelpers.calendar.equalsDate($.calendar.parseDate( "y-m-d", (currentYear - 2000 + 60) + "-02-03", {shortYearCutoff: "+60"}),
			new Date(currentYear + 60, 2 - 1, 3), "Parse date y-m-d - cutoff +60" );
	TestHelpers.calendar.equalsDate($.calendar.parseDate( "y-m-d", (currentYear - 2000 + 61) + "-02-03", {shortYearCutoff: "+60"}),
			new Date(currentYear - 39, 2 - 1, 3), "Parse date y-m-d - cutoff +60" );
	gmtDate = new Date(2001, 2 - 1, 3);
	gmtDate.setMinutes(gmtDate.getMinutes() - gmtDate.getTimezoneOffset());
	TestHelpers.calendar.equalsDate($.calendar.parseDate( "@", "981158400000" ), gmtDate, "Parse date @" );
	TestHelpers.calendar.equalsDate($.calendar.parseDate( "!", "631167552000000000" ), gmtDate, "Parse date !" );

	fr = $.calendar.regional.fr;
	settings = {dayNamesShort: fr.dayNamesShort, dayNames: fr.dayNames,
		monthNamesShort: fr.monthNamesShort, monthNames: fr.monthNames};
	TestHelpers.calendar.equalsDate($.calendar.parseDate( "D d M y", "Lun. 9 Avril 01", settings),
		new Date(2001, 4 - 1, 9), "Parse date D M y with settings" );
	TestHelpers.calendar.equalsDate($.calendar.parseDate( "d MM DD yy", "9 Avril Lundi 2001", settings),
		new Date(2001, 4 - 1, 9), "Parse date d MM DD yy with settings" );
	TestHelpers.calendar.equalsDate($.calendar.parseDate( "DD, MM d, yy", "Lundi, Avril 9, 2001", settings),
		new Date(2001, 4 - 1, 9), "Parse date DD, MM d, yy with settings" );
	TestHelpers.calendar.equalsDate($.calendar.parseDate( "'jour' d 'de' MM (''DD''), yy", "jour 9 de Avril ('Lundi'), 2001", settings),
		new Date(2001, 4 - 1, 9), "Parse date 'jour' d 'de' MM (''DD''), yy with settings" );

	zh = $.calendar.regional["zh-CN"];
	TestHelpers.calendar.equalsDate($.calendar.parseDate( "yy M d", "2011 十一月 22", zh),
		new Date(2011, 11 - 1, 22), "Parse date yy M d with zh-CN" );
});

test( "parseDateErrors", function() {
	expect( 17 );
	TestHelpers.calendar.init( "#inp" );
	var fr, settings;
	function expectError(expr, value, error) {
		try {
			expr();
			ok(false, "Parsed error " + value);
		}
		catch (e) {
			equal(e, error, "Parsed error " + value);
		}
	}
	expectError(function() { $.calendar.parseDate(null, "Sat 2 01" ); },
		"Sat 2 01", "Invalid arguments" );
	expectError(function() { $.calendar.parseDate( "d m y", null); },
		"null", "Invalid arguments" );
	expectError(function() { $.calendar.parseDate( "d m y", "Sat 2 01" ); },
		"Sat 2 01 - d m y", "Missing number at position 0" );
	expectError(function() { $.calendar.parseDate( "dd mm yy", "Sat 2 01" ); },
		"Sat 2 01 - dd mm yy", "Missing number at position 0" );
	expectError(function() { $.calendar.parseDate( "d m y", "3 Feb 01" ); },
		"3 Feb 01 - d m y", "Missing number at position 2" );
	expectError(function() { $.calendar.parseDate( "dd mm yy", "3 Feb 01" ); },
		"3 Feb 01 - dd mm yy", "Missing number at position 2" );
	expectError(function() { $.calendar.parseDate( "d m y", "3 2 AD01" ); },
		"3 2 AD01 - d m y", "Missing number at position 4" );
	expectError(function() { $.calendar.parseDate( "d m yy", "3 2 AD01" ); },
		"3 2 AD01 - dd mm yy", "Missing number at position 4" );
	expectError(function() { $.calendar.parseDate( "y-o", "01-D01" ); },
		"2001-D01 - y-o", "Missing number at position 3" );
	expectError(function() { $.calendar.parseDate( "yy-oo", "2001-D01" ); },
		"2001-D01 - yy-oo", "Missing number at position 5" );
	expectError(function() { $.calendar.parseDate( "D d M y", "D7 3 Feb 01" ); },
		"D7 3 Feb 01 - D d M y", "Unknown name at position 0" );
	expectError(function() { $.calendar.parseDate( "D d M y", "Sat 3 M2 01" ); },
		"Sat 3 M2 01 - D d M y", "Unknown name at position 6" );
	expectError(function() { $.calendar.parseDate( "DD, MM d, yy", "Saturday- Feb 3, 2001" ); },
		"Saturday- Feb 3, 2001 - DD, MM d, yy", "Unexpected literal at position 8" );
	expectError(function() { $.calendar.parseDate( "'day' d 'of' MM (''DD''), yy",
		"day 3 of February (\"Saturday\" ), 2001" ); },
		"day 3 of Mon2 ('Day7'), 2001", "Unexpected literal at position 19" );
	expectError(function() { $.calendar.parseDate( "d m y", "29 2 01" ); },
		"29 2 01 - d m y", "Invalid date" );
	fr = $.calendar.regional.fr;
	settings = {dayNamesShort: fr.dayNamesShort, dayNames: fr.dayNames,
		monthNamesShort: fr.monthNamesShort, monthNames: fr.monthNames};
	expectError(function() { $.calendar.parseDate( "D d M y", "Mon 9 Avr 01", settings); },
		"Mon 9 Avr 01 - D d M y", "Unknown name at position 0" );
	expectError(function() { $.calendar.parseDate( "D d M y", "Lun. 9 Apr 01", settings); },
		"Lun. 9 Apr 01 - D d M y", "Unknown name at position 7" );
});

test( "Ticket #7244: date parser does not fail when too many numbers are passed into the date function", function() {
	expect( 4 );
	var date;
	try{
		date = $.calendar.parseDate( "dd/mm/yy", "18/04/19881" );
		ok(false, "Did not properly detect an invalid date" );
	}catch(e){
		ok( "invalid date detected" );
	}

	try {
		date = $.calendar.parseDate( "dd/mm/yy", "18/04/1988 @ 2:43 pm" );
		equal(date.getDate(), 18);
		equal(date.getMonth(), 3);
		equal(date.getFullYear(), 1988);
	} catch(e) {
		ok(false, "Did not properly parse date with extra text separated by whitespace" );
	}
});

test( "formatDate", function() {
	expect( 16 );
	TestHelpers.calendar.init( "#inp" );
	var gmtDate, fr, settings;
	equal($.calendar.formatDate( "d m y", new Date(2001, 2 - 1, 3)),
		"3 2 01", "Format date d m y" );
	equal($.calendar.formatDate( "dd mm yy", new Date(2001, 2 - 1, 3)),
		"03 02 2001", "Format date dd mm yy" );
	equal($.calendar.formatDate( "d m y", new Date(2001, 12 - 1, 13)),
		"13 12 01", "Format date d m y" );
	equal($.calendar.formatDate( "dd mm yy", new Date(2001, 12 - 1, 13)),
		"13 12 2001", "Format date dd mm yy" );
	equal($.calendar.formatDate( "yy-o", new Date(2001, 2 - 1, 3)),
		"2001-34", "Format date yy-o" );
	equal($.calendar.formatDate( "yy-oo", new Date(2001, 2 - 1, 3)),
		"2001-034", "Format date yy-oo" );
	equal($.calendar.formatDate( "D M y", new Date(2001, 2 - 1, 3)),
		"Sat Feb 01", "Format date D M y" );
	equal($.calendar.formatDate( "DD MM yy", new Date(2001, 2 - 1, 3)),
		"Saturday February 2001", "Format date DD MM yy" );
	equal($.calendar.formatDate( "DD, MM d, yy", new Date(2001, 2 - 1, 3)),
		"Saturday, February 3, 2001", "Format date DD, MM d, yy" );
	equal($.calendar.formatDate( "'day' d 'of' MM (''DD''), yy",
		new Date(2001, 2 - 1, 3)), "day 3 of February ('Saturday'), 2001",
		"Format date 'day' d 'of' MM ('DD'), yy" );
	gmtDate = new Date(2001, 2 - 1, 3);
	gmtDate.setMinutes( gmtDate.getMinutes() - gmtDate.getTimezoneOffset() );
	equal($.calendar.formatDate( "@", gmtDate), "981158400000", "Format date @" );
	equal($.calendar.formatDate( "!", gmtDate), "631167552000000000", "Format date !" );
	fr = $.calendar.regional.fr;
	settings = {dayNamesShort: fr.dayNamesShort, dayNames: fr.dayNames,
		monthNamesShort: fr.monthNamesShort, monthNames: fr.monthNames};
	equal($.calendar.formatDate( "D M y", new Date(2001, 4 - 1, 9), settings),
		"lun. avril 01", "Format date D M y with settings" );
	equal($.calendar.formatDate( "DD MM yy", new Date(2001, 4 - 1, 9), settings),
		"lundi avril 2001", "Format date DD MM yy with settings" );
	equal($.calendar.formatDate( "DD, MM d, yy", new Date(2001, 4 - 1, 9), settings),
		"lundi, avril 9, 2001", "Format date DD, MM d, yy with settings" );
	equal($.calendar.formatDate( "'jour' d 'de' MM (''DD''), yy",
		new Date(2001, 4 - 1, 9), settings), "jour 9 de avril ('lundi'), 2001",
		"Format date 'jour' d 'de' MM (''DD''), yy with settings" );
});

// TODO: Fix this test so it isn't mysteriously flaky in Browserstack on certain OS/Browser combos
// test( "Ticket 6827: formatDate day of year calculation is wrong during day lights savings time", function(){
// 	expect( 1 );
// 	var time = $.calendar.formatDate( "oo", new Date( "2010/03/30 12:00:00 CDT" ));
// 	equal(time, "089" );
// });

test( "Ticket 7602: Stop calendar from appearing with beforeShow event handler", function() {
	expect( 3 );

	var inp, dp;

	inp = TestHelpers.calendar.init( "#inp", {
		beforeShow: function() {
		}
	});
	dp = $( "#ui-calendar-div" );
	inp.calendar( "show" );
	equal( dp.css( "display" ), "block", "beforeShow returns nothing" );
	inp.calendar( "hide" ).calendar( "destroy" );

	inp = TestHelpers.calendar.init( "#inp", {
		beforeShow: function() {
			return true;
		}
	});
	dp = $( "#ui-calendar-div" );
	inp.calendar( "show" );
	equal( dp.css( "display" ), "block", "beforeShow returns true" );
	inp.calendar( "hide" );
	inp.calendar( "destroy" );

	inp = TestHelpers.calendar.init( "#inp", {
		beforeShow: function() {
			return false;
		}
	});
	dp = $( "#ui-calendar-div" );
	inp.calendar( "show" );
	equal( dp.css( "display" ), "none", "beforeShow returns false" );
	inp.calendar( "destroy" );
});
*/

})(jQuery);
