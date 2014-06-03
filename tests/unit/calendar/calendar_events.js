// The implement of events is completely changing therefore these tests are no longer directly
// relevant. Leaving them around commented out so we can ensure the functionality is replicated.
// For example:
// TODO: In the old implementation the Enter key select's today's date when the <input> has
// focus and is empty. Do we want to replicate this behavior in the rewrite?
/*

(function( $ ) {

module( "calendar: events" );

test( "beforeOpen", function() {
	expect( 0 );
});

test( "close", function() {
	expect( 0 );
});

test( "open", function() {
	expect( 0 );
});

test( "select", function() {
	expect( 0 );
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
		inp = TestHelpers.calendar.init( "#inp", {onSelect: callback}),
	date = new Date();
	// onSelect
	inp.val( "" ).calendar( "show" ).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	equal(selectedThis, inp[0], "Callback selected this" );
	equal(selectedInst, $.data(inp[0], TestHelpers.calendar.PROP_NAME), "Callback selected inst" );
	equal(selectedDate, $.calendar.formatDate( "mm/dd/yy", date),
		"Callback selected date" );
	inp.val( "" ).calendar( "show" ).
		simulate( "keydown", {ctrlKey: true, keyCode: $.ui.keyCode.DOWN}).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	date.setDate(date.getDate() + 7);
	equal(selectedDate, $.calendar.formatDate( "mm/dd/yy", date),
		"Callback selected date - ctrl+down" );
	inp.val( "" ).calendar( "show" ).
		simulate( "keydown", {keyCode: $.ui.keyCode.ESCAPE});
	equal(selectedDate, $.calendar.formatDate( "mm/dd/yy", date),
		"Callback selected date - esc" );
    dateStr = "02/04/2008";
    inp.val(dateStr).calendar( "show" ).
        simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
    equal(dateStr, selectedDate,
        "onSelect is called after enter keydown" );
	// onChangeMonthYear
	inp.calendar( "option", {onChangeMonthYear: callback2, onSelect: null}).
		val( "" ).calendar( "show" );
	newMonthYear = function(date) {
		return date.getFullYear() + "/" + (date.getMonth() + 1);
	};
	date = new Date();
	date.setDate(1);
	inp.simulate( "keydown", {keyCode: $.ui.keyCode.PAGE_UP});
	date.setMonth(date.getMonth() - 1);
	equal(selectedThis, inp[0], "Callback change month/year this" );
	equal(selectedInst, $.data(inp[0], TestHelpers.calendar.PROP_NAME), "Callback change month/year inst" );
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
	inp.calendar( "setDate", new Date(2007, 1 - 1, 26));
	equal(selectedDate, "2007/1", "Callback change month/year date - setDate" );
	selectedDate = null;
	inp.calendar( "setDate", new Date(2007, 1 - 1, 12));
	ok(selectedDate == null, "Callback change month/year date - setDate no change" );
	// onChangeMonthYear step by 2
	inp.calendar( "option", {stepMonths: 2}).
		calendar( "hide" ).val( "" ).calendar( "show" ).
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
	inp.calendar( "option", {onClose: callback, onChangeMonthYear: null, stepMonths: 1}).
		val( "" ).calendar( "show" ).
		simulate( "keydown", {keyCode: $.ui.keyCode.ESCAPE});
	equal(selectedThis, inp[0], "Callback close this" );
	equal(selectedInst, $.data(inp[0], TestHelpers.calendar.PROP_NAME), "Callback close inst" );
	equal(selectedDate, "", "Callback close date - esc" );
	inp.val( "" ).calendar( "show" ).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	equal(selectedDate, $.calendar.formatDate( "mm/dd/yy", new Date()),
		"Callback close date - enter" );
	inp.val( "02/04/2008" ).calendar( "show" ).
		simulate( "keydown", {keyCode: $.ui.keyCode.ESCAPE});
	equal(selectedDate, "02/04/2008", "Callback close date - preset" );
	inp.val( "02/04/2008" ).calendar( "show" ).
		simulate( "keydown", {ctrlKey: true, keyCode: $.ui.keyCode.END});
	equal(selectedDate, "", "Callback close date - ctrl+end" );

	inp2 = TestHelpers.calendar.init( "#inp2" );
	inp2.calendar().calendar( "option", {onClose: callback}).calendar( "show" );
	inp.calendar( "show" );
	equal(selectedThis, inp2[0], "Callback close this" );
});

})( jQuery );
 */
