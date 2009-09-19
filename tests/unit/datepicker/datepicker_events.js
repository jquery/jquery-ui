/*
 * datepicker_events.js
 */
(function($) {

module("datepicker: events", {
	teardown: function() {
		stop();
		setTimeout(start, 13);
	}
});

var selectedThis = null;
var selectedDate = null;
var selectedInst = null;

function callback(date, inst) {
	selectedThis = this;
	selectedDate = date;
	selectedInst = inst;
}

function callback2(year, month, inst) {
	selectedThis = this;
	selectedDate = year + '/' + month;
	selectedInst = inst;
}

test('events', function() {
	var inp = init('#inp', {onSelect: callback});
	var date = new Date();
	// onSelect
	inp.val('').datepicker('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equals(selectedThis, inp[0], 'Callback selected this');
	equals(selectedInst, $.data(inp[0], PROP_NAME), 'Callback selected inst');
	equals(selectedDate, $.datepicker.formatDate('mm/dd/yy', date),
		'Callback selected date');
	inp.val('').datepicker('show').
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date.setDate(date.getDate() + 7);
	equals(selectedDate, $.datepicker.formatDate('mm/dd/yy', date),
		'Callback selected date - ctrl+down');
	inp.val('').datepicker('show').
		simulate('keydown', {keyCode: $.simulate.VK_ESC});
	equals(selectedDate, $.datepicker.formatDate('mm/dd/yy', date),
		'Callback selected date - esc');
	// onChangeMonthYear
	inp.datepicker('option', {onChangeMonthYear: callback2, onSelect: null}).
		val('').datepicker('show');
	var newMonthYear = function(date) {
		return date.getFullYear() + '/' + (date.getMonth() + 1);
	};
	date = new Date();
	date.setDate(1);
	inp.simulate('keydown', {keyCode: $.simulate.VK_PGUP});
	date.setMonth(date.getMonth() - 1);
	equals(selectedThis, inp[0], 'Callback change month/year this');
	equals(selectedInst, $.data(inp[0], PROP_NAME), 'Callback change month/year inst');
	equals(selectedDate, newMonthYear(date),
		'Callback change month/year date - pgup');
	inp.simulate('keydown', {keyCode: $.simulate.VK_PGDN});
	date.setMonth(date.getMonth() + 1);
	equals(selectedDate, newMonthYear(date),
		'Callback change month/year date - pgdn');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGUP});
	date.setFullYear(date.getFullYear() - 1);
	equals(selectedDate, newMonthYear(date),
		'Callback change month/year date - ctrl+pgup');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_HOME});
	date.setFullYear(date.getFullYear() + 1);
	equals(selectedDate, newMonthYear(date),
		'Callback change month/year date - ctrl+home');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGDN});
	date.setFullYear(date.getFullYear() + 1);
	equals(selectedDate, newMonthYear(date),
		'Callback change month/year date - ctrl+pgdn');
	inp.datepicker('setDate', new Date(2007, 1 - 1, 26));
	equals(selectedDate, '2007/1', 'Callback change month/year date - setDate');
	selectedDate = null;
	inp.datepicker('setDate', new Date(2007, 1 - 1, 12));
	ok(selectedDate == null, 'Callback change month/year date - setDate no change');
	// onChangeMonthYear step by 2
	inp.datepicker('option', {stepMonths: 2}).
		datepicker('hide').val('').datepicker('show').
		simulate('keydown', {keyCode: $.simulate.VK_PGUP});
	date.setMonth(date.getMonth() - 14);
	equals(selectedDate, newMonthYear(date),
		'Callback change month/year by 2 date - pgup');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGUP});
	date.setMonth(date.getMonth() - 12);
	equals(selectedDate, newMonthYear(date),
		'Callback change month/year by 2 date - ctrl+pgup');
	inp.simulate('keydown', {keyCode: $.simulate.VK_PGDN});
	date.setMonth(date.getMonth() + 2);
	equals(selectedDate, newMonthYear(date),
		'Callback change month/year by 2 date - pgdn');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGDN});
	date.setMonth(date.getMonth() + 12);
	equals(selectedDate, newMonthYear(date),
		'Callback change month/year by 2 date - ctrl+pgdn');
	// onClose
	inp.datepicker('option', {onClose: callback, onChangeMonthYear: null, stepMonths: 1}).
		val('').datepicker('show').
		simulate('keydown', {keyCode: $.simulate.VK_ESC});
	equals(selectedThis, inp[0], 'Callback close this');
	equals(selectedInst, $.data(inp[0], PROP_NAME), 'Callback close inst');
	equals(selectedDate, '', 'Callback close date - esc');
	inp.val('').datepicker('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equals(selectedDate, $.datepicker.formatDate('mm/dd/yy', new Date()),
		'Callback close date - enter');
	inp.val('02/04/2008').datepicker('show').
		simulate('keydown', {keyCode: $.simulate.VK_ESC});
	equals(selectedDate, '02/04/2008', 'Callback close date - preset');
	inp.val('02/04/2008').datepicker('show').
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_END});
	equals(selectedDate, '', 'Callback close date - ctrl+end');
});

})(jQuery);
