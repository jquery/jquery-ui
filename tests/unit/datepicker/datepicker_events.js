// The implement of events is completely changing therefore these tests are no longer directly
// relevant. Leaving them around commented out so we can ensure the functionality is replicated.
// For example:
// TODO: In the old implementation the Enter key select's today's date when the <input> has
// focus and is empty. Do we want to replicate this behavior in the rewrite?
/*

(function( $ ) {

module( "datepicker: events" );

test( "beforeOpen", function() {
	expect( 0 );
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

var selectedThis = null,
selectedDate = null,
selectedInst = null;

function callback(date, inst) {
	selectedThis = this;
	selectedDate = date;
	selectedInst = inst;
}

function callback2(year, month, inst) {
	selectedThis = this;
	selectedDate = year + "/" + month;
	selectedInst = inst;
}

test( "events", function() {
	expect( 26 );
	var dateStr, newMonthYear, inp2,
		inp = TestHelpers.datepicker.init( "#inp", {onSelect: callback}),
	date = new Date();
	// onSelect
	inp.val( "" ).datepicker( "show" ).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	equal(selectedThis, inp[0], "Callback selected this" );
	equal(selectedInst, $.data(inp[0], TestHelpers.datepicker.PROP_NAME), "Callback selected inst" );
	equal(selectedDate, $.datepicker.formatDate( "mm/dd/yy", date),
		"Callback selected date" );
	inp.val( "" ).datepicker( "show" ).
		simulate( "keydown", {ctrlKey: true, keyCode: $.ui.keyCode.DOWN}).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	date.setDate(date.getDate() + 7);
	equal(selectedDate, $.datepicker.formatDate( "mm/dd/yy", date),
		"Callback selected date - ctrl+down" );
	inp.val( "" ).datepicker( "show" ).
		simulate( "keydown", {keyCode: $.ui.keyCode.ESCAPE});
	equal(selectedDate, $.datepicker.formatDate( "mm/dd/yy", date),
		"Callback selected date - esc" );
    dateStr = "02/04/2008";
    inp.val(dateStr).datepicker( "show" ).
        simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
    equal(dateStr, selectedDate,
        "onSelect is called after enter keydown" );
	// onChangeMonthYear
	inp.datepicker( "option", {onChangeMonthYear: callback2, onSelect: null}).
		val( "" ).datepicker( "show" );
	newMonthYear = function(date) {
		return date.getFullYear() + "/" + (date.getMonth() + 1);
	};
	date = new Date();
	date.setDate(1);
	inp.simulate( "keydown", {keyCode: $.ui.keyCode.PAGE_UP});
	date.setMonth(date.getMonth() - 1);
	equal(selectedThis, inp[0], "Callback change month/year this" );
	equal(selectedInst, $.data(inp[0], TestHelpers.datepicker.PROP_NAME), "Callback change month/year inst" );
	equal(selectedDate, newMonthYear(date),
		"Callback change month/year date - pgup" );
	inp.simulate( "keydown", {keyCode: $.ui.keyCode.PAGE_DOWN});
	date.setMonth(date.getMonth() + 1);
	equal(selectedDate, newMonthYear(date),
		"Callback change month/year date - pgdn" );
	inp.simulate( "keydown", {ctrlKey: true, keyCode: $.ui.keyCode.PAGE_UP});
	date.setFullYear(date.getFullYear() - 1);
	equal(selectedDate, newMonthYear(date),
		"Callback change month/year date - ctrl+pgup" );
	inp.simulate( "keydown", {ctrlKey: true, keyCode: $.ui.keyCode.HOME});
	date.setFullYear(date.getFullYear() + 1);
	equal(selectedDate, newMonthYear(date),
		"Callback change month/year date - ctrl+home" );
	inp.simulate( "keydown", {ctrlKey: true, keyCode: $.ui.keyCode.PAGE_DOWN});
	date.setFullYear(date.getFullYear() + 1);
	equal(selectedDate, newMonthYear(date),
		"Callback change month/year date - ctrl+pgdn" );
	inp.datepicker( "setDate", new Date(2007, 1 - 1, 26));
	equal(selectedDate, "2007/1", "Callback change month/year date - setDate" );
	selectedDate = null;
	inp.datepicker( "setDate", new Date(2007, 1 - 1, 12));
	ok(selectedDate == null, "Callback change month/year date - setDate no change" );
	// onChangeMonthYear step by 2
	inp.datepicker( "option", {stepMonths: 2}).
		datepicker( "hide" ).val( "" ).datepicker( "show" ).
		simulate( "keydown", {keyCode: $.ui.keyCode.PAGE_UP});
	date.setMonth(date.getMonth() - 14);
	equal(selectedDate, newMonthYear(date),
		"Callback change month/year by 2 date - pgup" );
	inp.simulate( "keydown", {ctrlKey: true, keyCode: $.ui.keyCode.PAGE_UP});
	date.setMonth(date.getMonth() - 12);
	equal(selectedDate, newMonthYear(date),
		"Callback change month/year by 2 date - ctrl+pgup" );
	inp.simulate( "keydown", {keyCode: $.ui.keyCode.PAGE_DOWN});
	date.setMonth(date.getMonth() + 2);
	equal(selectedDate, newMonthYear(date),
		"Callback change month/year by 2 date - pgdn" );
	inp.simulate( "keydown", {ctrlKey: true, keyCode: $.ui.keyCode.PAGE_DOWN});
	date.setMonth(date.getMonth() + 12);
	equal(selectedDate, newMonthYear(date),
		"Callback change month/year by 2 date - ctrl+pgdn" );
	// onClose
	inp.datepicker( "option", {onClose: callback, onChangeMonthYear: null, stepMonths: 1}).
		val( "" ).datepicker( "show" ).
		simulate( "keydown", {keyCode: $.ui.keyCode.ESCAPE});
	equal(selectedThis, inp[0], "Callback close this" );
	equal(selectedInst, $.data(inp[0], TestHelpers.datepicker.PROP_NAME), "Callback close inst" );
	equal(selectedDate, "", "Callback close date - esc" );
	inp.val( "" ).datepicker( "show" ).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	equal(selectedDate, $.datepicker.formatDate( "mm/dd/yy", new Date()),
		"Callback close date - enter" );
	inp.val( "02/04/2008" ).datepicker( "show" ).
		simulate( "keydown", {keyCode: $.ui.keyCode.ESCAPE});
	equal(selectedDate, "02/04/2008", "Callback close date - preset" );
	inp.val( "02/04/2008" ).datepicker( "show" ).
		simulate( "keydown", {ctrlKey: true, keyCode: $.ui.keyCode.END});
	equal(selectedDate, "", "Callback close date - ctrl+end" );

	inp2 = TestHelpers.datepicker.init( "#inp2" );
	inp2.datepicker().datepicker( "option", {onClose: callback}).datepicker( "show" );
	inp.datepicker( "show" );
	equal(selectedThis, inp2[0], "Callback close this" );
});

})( jQuery );
 */
