/*
 * datepicker_events.js
 */
(function($) {

module("datepicker: events");

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
	equal(selectedThis, inp[0], 'Callback selected this');
	equal(selectedInst, $.data(inp[0], PROP_NAME), 'Callback selected inst');
	equal(selectedDate, $.datepicker.formatDate('mm/dd/yy', date),
		'Callback selected date');
	inp.val('').datepicker('show').
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date.setDate(date.getDate() + 7);
	equal(selectedDate, $.datepicker.formatDate('mm/dd/yy', date),
		'Callback selected date - ctrl+down');
	inp.val('').datepicker('show').
		simulate('keydown', {keyCode: $.simulate.VK_ESC});
	equal(selectedDate, $.datepicker.formatDate('mm/dd/yy', date),
		'Callback selected date - esc');
    var dateStr = '02/04/2008';
    inp.val(dateStr).datepicker('show').
        simulate('keydown', {keyCode: $.simulate.VK_ENTER});
    equal(dateStr, selectedDate,
        'onSelect is called after enter keydown');
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
	equal(selectedThis, inp[0], 'Callback change month/year this');
	equal(selectedInst, $.data(inp[0], PROP_NAME), 'Callback change month/year inst');
	equal(selectedDate, newMonthYear(date),
		'Callback change month/year date - pgup');
	inp.simulate('keydown', {keyCode: $.simulate.VK_PGDN});
	date.setMonth(date.getMonth() + 1);
	equal(selectedDate, newMonthYear(date),
		'Callback change month/year date - pgdn');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGUP});
	date.setFullYear(date.getFullYear() - 1);
	equal(selectedDate, newMonthYear(date),
		'Callback change month/year date - ctrl+pgup');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_HOME});
	date.setFullYear(date.getFullYear() + 1);
	equal(selectedDate, newMonthYear(date),
		'Callback change month/year date - ctrl+home');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGDN});
	date.setFullYear(date.getFullYear() + 1);
	equal(selectedDate, newMonthYear(date),
		'Callback change month/year date - ctrl+pgdn');
	inp.datepicker('setDate', new Date(2007, 1 - 1, 26));
	equal(selectedDate, '2007/1', 'Callback change month/year date - setDate');
	selectedDate = null;
	inp.datepicker('setDate', new Date(2007, 1 - 1, 12));
	ok(selectedDate == null, 'Callback change month/year date - setDate no change');
	// onChangeMonthYear step by 2
	inp.datepicker('option', {stepMonths: 2}).
		datepicker('hide').val('').datepicker('show').
		simulate('keydown', {keyCode: $.simulate.VK_PGUP});
	date.setMonth(date.getMonth() - 14);
	equal(selectedDate, newMonthYear(date),
		'Callback change month/year by 2 date - pgup');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGUP});
	date.setMonth(date.getMonth() - 12);
	equal(selectedDate, newMonthYear(date),
		'Callback change month/year by 2 date - ctrl+pgup');
	inp.simulate('keydown', {keyCode: $.simulate.VK_PGDN});
	date.setMonth(date.getMonth() + 2);
	equal(selectedDate, newMonthYear(date),
		'Callback change month/year by 2 date - pgdn');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGDN});
	date.setMonth(date.getMonth() + 12);
	equal(selectedDate, newMonthYear(date),
		'Callback change month/year by 2 date - ctrl+pgdn');
	// onClose
	inp.datepicker('option', {onClose: callback, onChangeMonthYear: null, stepMonths: 1}).
		val('').datepicker('show').
		simulate('keydown', {keyCode: $.simulate.VK_ESC});
	equal(selectedThis, inp[0], 'Callback close this');
	equal(selectedInst, $.data(inp[0], PROP_NAME), 'Callback close inst');
	equal(selectedDate, '', 'Callback close date - esc');
	inp.val('').datepicker('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equal(selectedDate, $.datepicker.formatDate('mm/dd/yy', new Date()),
		'Callback close date - enter');
	inp.val('02/04/2008').datepicker('show').
		simulate('keydown', {keyCode: $.simulate.VK_ESC});
	equal(selectedDate, '02/04/2008', 'Callback close date - preset');
	inp.val('02/04/2008').datepicker('show').
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_END});
	equal(selectedDate, '', 'Callback close date - ctrl+end');

	var inp2 = init('#inp2');
	inp2.datepicker().datepicker('option', {onClose: callback}).datepicker('show');
	inp.datepicker('show');
	equal(selectedThis, inp2[0], 'Callback close this');
});

})(jQuery);
