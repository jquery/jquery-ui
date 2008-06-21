/*
 * datepicker unit tests
 */
(function($) {

module('datepicker');

function equalsDate(d1, d2, message) {
	if (!d1 || !d2) {
		ok(false, message + ' - missing date');
		return;
	}
	d1 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate());
	d2 = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate());
	equals(d1.toString(), d2.toString(), message);
}

function equalsDateArray(a1, a2, message) {
	if (!a1 || !a2) {
		ok(false, message + ' - missing dates');
		return;
	}
	a1[0] = (a1[0] ? new Date(a1[0].getFullYear(), a1[0].getMonth(), a1[0].getDate()) : '');
	a1[1] = (a1[1] ? new Date(a1[1].getFullYear(), a1[1].getMonth(), a1[1].getDate()) : '');
	a2[0] = (a2[0] ? new Date(a2[0].getFullYear(), a2[0].getMonth(), a2[0].getDate()) : '');
	a2[1] = (a2[1] ? new Date(a2[1].getFullYear(), a2[1].getMonth(), a2[1].getDate()) : '');
	equals(serialArray(a1), serialArray(a2), message);
}

test('setDefaults', function() {
	var dp1 = $('#dp1');
	dp1.datepicker();
	ok(dp1.is('.hasDatepicker'), 'Marker class set');
	ok($($.datepicker._datepickerDiv).html() == '', 'Content empty');
	dp1.datepicker('show');
	ok($($.datepicker._datepickerDiv).html() != '', 'Content present');
	dp1.datepicker('hide');
	equals($.datepicker._defaults.showOn, 'focus', 'Initial showOn');
	$.datepicker.setDefaults({showOn: 'button'});
	equals($.datepicker._defaults.showOn, 'button', 'Change default showOn');
	$.datepicker.setDefaults({showOn: 'focus'});
	equals($.datepicker._defaults.showOn, 'focus', 'Restore showOn');
});

test('remove', function() {
	var rem = $('#rem');
	rem.datepicker();
	ok(rem.is('.hasDatepicker'), 'Marker class set');
	ok(rem[0]._calId, 'Datepicker ID present');
	rem.datepicker('destroy');
	rem = $('#rem');
	ok(!rem.is('.hasDatepicker'), 'Marker class cleared');
	ok(!rem[0]._calId, 'Datepicker ID absent');
	rem.datepicker({showOn: 'both', buttonImage: 'img/calendar.gif'});
	ok(rem.is('.hasDatepicker'), 'Marker class set');
	ok(rem[0]._calId, 'Datepicker ID present');
	ok(rem.parent('.ui-datepicker-wrap').length != 0, 'Wrapper present');
	rem.datepicker('destroy');
	rem = $('#rem');
	ok(!rem.is('.hasDatepicker'), 'Marker class cleared');
	ok(!rem[0]._calId, 'Datepicker ID absent');
	ok(rem.parent('.ui-datepicker-wrap').length == 0, 'Wrapper absent');
});

test('change', function() {
	var dp1 = $('#dp1');
	dp1.datepicker();
	var inst = $.datepicker._inst[dp1[0]._calId];
	equals(inst._settings.showOn, null, 'Initial setting showOn');
	equals(inst._get('showOn'), 'focus', 'Initial instance showOn');
	equals($.datepicker._defaults.showOn, 'focus', 'Initial default showOn');
	dp1.datepicker('change', 'showOn', 'button');
	equals(inst._settings.showOn, 'button', 'Change setting showOn');
	equals(inst._get('showOn'), 'button', 'Change instance showOn');
	equals($.datepicker._defaults.showOn, 'focus', 'Retain default showOn');
	dp1.datepicker('change', {showOn: 'both'});
	equals(inst._settings.showOn, 'both', 'Change setting showOn');
	equals(inst._get('showOn'), 'both', 'Change instance showOn');
	equals($.datepicker._defaults.showOn, 'focus', 'Retain default showOn');
	dp1.datepicker('change', 'showOn', undefined);
	equals(inst._settings.showOn, null, 'Clear setting showOn');
	equals(inst._get('showOn'), 'focus', 'Restore instance showOn');
	equals($.datepicker._defaults.showOn, 'focus', 'Retain default showOn');
});

test('enableDisable', function() {
	var dp1 = $('#dp1');
	dp1.datepicker();
	ok(!dp1.datepicker('isDisabled'), 'Initially enabled');
	dp1.datepicker('disable');
	ok(dp1.datepicker('isDisabled'), 'Now disabled');
	dp1.datepicker('enable');
	ok(!dp1.datepicker('isDisabled'), 'Now enabled');
});

test('keystrokes', function() {
	var dp1 = $('#dp1');
	var date = new Date();
	dp1.datepicker({speed: ''}).val('').datepicker('show');
	dp1.simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(dp1.datepicker('getDate'), date, 'Keystroke enter');
	dp1.val('02/04/2008').datepicker('show');
	dp1.simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(dp1.datepicker('getDate'), new Date(2008, 2 - 1, 4), 'Keystroke enter - preset');
	dp1.val('02/04/2008').datepicker('show');
	dp1.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_HOME}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(dp1.datepicker('getDate'), date, 'Keystroke ctrl+home');
	dp1.val('02/04/2008').datepicker('show');
	dp1.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_END});
	ok(dp1.datepicker('getDate') == null, 'Keystroke ctrl+end');
	dp1.val('').datepicker('show');
	dp1.simulate('keydown', {keyCode: $.simulate.VK_ESC});
	ok(dp1.datepicker('getDate') == null, 'Keystroke esc');
	dp1.val('02/04/2008').datepicker('show');
	dp1.simulate('keydown', {keyCode: $.simulate.VK_ESC});
	equalsDate(dp1.datepicker('getDate'), new Date(2008, 2 - 1, 4), 'Keystroke esc - preset');
	dp1.val('02/04/2008').datepicker('show');
	dp1.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGUP}).
		simulate('keydown', {keyCode: $.simulate.VK_ESC});
	equalsDate(dp1.datepicker('getDate'), new Date(2008, 2 - 1, 4), 'Keystroke esc - abandoned');
	dp1.val('').datepicker('show');
	dp1.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_LEFT}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date.setDate(date.getDate() - 1);
	equalsDate(dp1.datepicker('getDate'), date, 'Keystroke ctrl+left');
	dp1.val('').datepicker('show');
	dp1.simulate('keydown', {keyCode: $.simulate.VK_LEFT}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date.setDate(date.getDate() + 1);
	equalsDate(dp1.datepicker('getDate'), date, 'Keystroke left');
	dp1.val('').datepicker('show');
	dp1.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_RIGHT}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date.setDate(date.getDate() + 1);
	equalsDate(dp1.datepicker('getDate'), date, 'Keystroke ctrl+right');
	dp1.val('').datepicker('show');
	dp1.simulate('keydown', {keyCode: $.simulate.VK_RIGHT}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date.setDate(date.getDate() - 1);
	equalsDate(dp1.datepicker('getDate'), date, 'Keystroke right');
	dp1.val('').datepicker('show');
	dp1.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_UP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date.setDate(date.getDate() - 7);
	equalsDate(dp1.datepicker('getDate'), date, 'Keystroke ctrl+up');
	dp1.val('').datepicker('show');
	dp1.simulate('keydown', {keyCode: $.simulate.VK_UP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date.setDate(date.getDate() + 7);
	equalsDate(dp1.datepicker('getDate'), date, 'Keystroke up');
	dp1.val('').datepicker('show');
	dp1.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date.setDate(date.getDate() + 7);
	equalsDate(dp1.datepicker('getDate'), date, 'Keystroke ctrl+down');
	dp1.val('').datepicker('show');
	dp1.simulate('keydown', {keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date.setDate(date.getDate() - 7);
	equalsDate(dp1.datepicker('getDate'), date, 'Keystroke down');
	dp1.val('02/04/2008').datepicker('show');
	dp1.simulate('keydown', {keyCode: $.simulate.VK_PGUP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(dp1.datepicker('getDate'), new Date(2008, 1 - 1, 4), 'Keystroke pgup');
	dp1.val('02/04/2008').datepicker('show');
	dp1.simulate('keydown', {keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(dp1.datepicker('getDate'), new Date(2008, 3 - 1, 4), 'Keystroke pgdn');
	dp1.val('02/04/2008').datepicker('show');
	dp1.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGUP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(dp1.datepicker('getDate'), new Date(2007, 2 - 1, 4), 'Keystroke ctrl+pgup');
	dp1.val('02/04/2008').datepicker('show');
	dp1.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(dp1.datepicker('getDate'), new Date(2009, 2 - 1, 4), 'Keystroke ctrl+pgdn');
	dp1.val('03/31/2008').datepicker('show');
	dp1.simulate('keydown', {keyCode: $.simulate.VK_PGUP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(dp1.datepicker('getDate'), new Date(2008, 2 - 1, 29), 'Keystroke pgup - Feb');
	dp1.val('01/30/2008').datepicker('show');
	dp1.simulate('keydown', {keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(dp1.datepicker('getDate'), new Date(2008, 2 - 1, 29), 'Keystroke pgdn - Feb');
	dp1.val('02/29/2008').datepicker('show');
	dp1.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGUP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(dp1.datepicker('getDate'), new Date(2007, 2 - 1, 28), 'Keystroke ctrl+pgup - Feb');
	dp1.val('02/29/2008').datepicker('show');
	dp1.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(dp1.datepicker('getDate'), new Date(2009, 2 - 1, 28), 'Keystroke ctrl+pgdn - Feb');
});

test('defaultDate', function() {
	var dp1 = $('#dp1');
	var date = new Date();
	dp1.datepicker({speed: ''}).val('').datepicker('show');
	dp1.simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(dp1.datepicker('getDate'), date, 'Default date null');
	dp1.datepicker('change', {defaultDate: '-1d'}).
		datepicker('hide').val('').datepicker('show');
	dp1.simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date.setDate(date.getDate() - 1);
	equalsDate(dp1.datepicker('getDate'), date, 'Default date -1d');
	dp1.datepicker('change', {defaultDate: '+3D'}).
		datepicker('hide').val('').datepicker('show');
	dp1.simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date.setDate(date.getDate() + 4);
	equalsDate(dp1.datepicker('getDate'), date, 'Default date +3D');
	dp1.datepicker('change', {defaultDate: ' -2 w '}).
		datepicker('hide').val('').datepicker('show');
	dp1.simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date = new Date();
	date.setDate(date.getDate() - 14);
	equalsDate(dp1.datepicker('getDate'), date, 'Default date -2 w');
	dp1.datepicker('change', {defaultDate: '+1 W'}).
		datepicker('hide').val('').datepicker('show');
	dp1.simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date.setDate(date.getDate() + 21);
	equalsDate(dp1.datepicker('getDate'), date, 'Default date +1 W');
	dp1.datepicker('change', {defaultDate: ' -1 m '}).
		datepicker('hide').val('').datepicker('show');
	dp1.simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date = new Date();
	date.setMonth(date.getMonth() - 1);
	equalsDate(dp1.datepicker('getDate'), date, 'Default date -1 m');
	dp1.datepicker('change', {defaultDate: '+2M'}).
		datepicker('hide').val('').datepicker('show');
	dp1.simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date.setMonth(date.getMonth() + 3);
	equalsDate(dp1.datepicker('getDate'), date, 'Default date +2M');
	dp1.datepicker('change', {defaultDate: '-2y'}).
		datepicker('hide').val('').datepicker('show');
	dp1.simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date = new Date();
	date.setFullYear(date.getFullYear() - 2);
	equalsDate(dp1.datepicker('getDate'), date, 'Default date -2y');
	dp1.datepicker('change', {defaultDate: '+1 Y '}).
		datepicker('hide').val('').datepicker('show');
	dp1.simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date.setFullYear(date.getFullYear() + 3);
	equalsDate(dp1.datepicker('getDate'), date, 'Default date +1 Y');
	dp1.datepicker('change', {defaultDate: '+10d +1M'}).
		datepicker('hide').val('').datepicker('show');
	dp1.simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date = new Date();
	date.setDate(date.getDate() + 10);
	date.setMonth(date.getMonth() + 1);
	equalsDate(dp1.datepicker('getDate'), date, 'Default date +10d +1M');
	date = new Date(2007, 1 - 1, 26);
	dp1.datepicker('change', {defaultDate: date}).
		datepicker('hide').val('').datepicker('show');
	dp1.simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(dp1.datepicker('getDate'), date, 'Default date 01/26/2007');
});

test('minMax', function() {
	var dp1 = $('#dp1');
	var lastYear = new Date(2007, 6 - 1, 4);
	var nextYear = new Date(2009, 6 - 1, 4);
	var minDate = new Date(2008, 2 - 1, 29);
	var maxDate = new Date(2008, 12 - 1, 7);
	dp1.datepicker({speed: ''}).val('06/04/2008').datepicker('show');
	dp1.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGUP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(dp1.datepicker('getDate'), lastYear, 'Min/max - null, null - ctrl+pgup');
	dp1.val('06/04/2008').datepicker('show');
	dp1.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(dp1.datepicker('getDate'), nextYear, 'Min/max - null, null - ctrl+pgdn');
	dp1.datepicker('change', {minDate: minDate}).datepicker('hide').val('06/04/2008').datepicker('show');
	dp1.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGUP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(dp1.datepicker('getDate'), minDate, 'Min/max - 02/29/2008, null - ctrl+pgup');
	dp1.val('06/04/2008').datepicker('show');
	dp1.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(dp1.datepicker('getDate'), nextYear, 'Min/max - 02/29/2008, null - ctrl+pgdn');
	dp1.datepicker('change', {maxDate: maxDate}).datepicker('hide').val('06/04/2008').datepicker('show');
	dp1.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGUP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(dp1.datepicker('getDate'), minDate, 'Min/max - 02/29/2008, 12/07/2008 - ctrl+pgup');
	dp1.val('06/04/2008').datepicker('show');
	dp1.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(dp1.datepicker('getDate'), maxDate, 'Min/max - 02/29/2008, 12/07/2008 - ctrl+pgdn');
	dp1.datepicker('change', {minDate: null}).datepicker('hide').val('06/04/2008').datepicker('show');
	dp1.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGUP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(dp1.datepicker('getDate'), lastYear, 'Min/max - null, 12/07/2008 - ctrl+pgup');
	dp1.val('06/04/2008').datepicker('show');
	dp1.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(dp1.datepicker('getDate'), maxDate, 'Min/max - null, 12/07/2008 - ctrl+pgdn');
	// relative dates
	var date = new Date();
	date.setDate(date.getDate() - 7);
	dp1.datepicker('change', {minDate: '-1w', maxDate: '+10 D +1 M'}).
		datepicker('hide').val('').datepicker('show');
	dp1.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGUP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(dp1.datepicker('getDate'), date, 'Min/max - -1w, +10 D +1 M - ctrl+pgup');
	date.setDate(date.getDate() + 17);
	date.setMonth(date.getMonth() + 1);
	dp1.val('').datepicker('show');
	dp1.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(dp1.datepicker('getDate'), date, 'Min/max - -1w, +10 D +1 M - ctrl+pgdn');
});

test('ranges', function() {
	var dp1 = $('#dp1');
	var d1 = new Date();
	var d2 = new Date();
	dp1.datepicker({speed: '', rangeSelect: true}).val('').datepicker('show');
	dp1.simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDateArray(dp1.datepicker('getDate'), [d1, d2], 'Range 1 month - enter/enter');
	dp1.val('').datepicker('show');
	dp1.simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_UP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDateArray(dp1.datepicker('getDate'), [d1, d2], 'Range 1 month - enter/ctrl+up/enter');
	dp1.val('').datepicker('show');
	dp1.simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	d2.setDate(d2.getDate() + 7);
	equalsDateArray(dp1.datepicker('getDate'), [d1, d2], 'Range 1 month - enter/ctrl+down/enter');
	dp1.val('').datepicker('show');
	dp1.simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {keyCode: $.simulate.VK_ESC});
	equalsDateArray(dp1.datepicker('getDate'), [d1, d1], 'Range 1 month - enter/ctrl+down/esc');
	// Callbacks
	dp1.datepicker('change', {onSelect: callback}).datepicker('hide').
		val('06/04/2008').datepicker('show');
	dp1.simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equals(selectedDate, '06/04/2008 - 06/11/2008', 'Range 1 month onSelect - enter/ctrl+down/enter');
	dp1.datepicker('change', {onChangeMonthYear: callback, onSelect: null}).datepicker('hide').
		val('05/04/2008').datepicker('show');
	dp1.simulate('keydown', {keyCode: $.simulate.VK_PGUP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(selectedDate, new Date(2008, 4 - 1, 1), 'Range 1 month onChangeMonthYear - enter/ctrl+down/enter');
	dp1.datepicker('change', {onClose: callback, onChangeMonthYear: null}).datepicker('hide').
		val('03/04/2008').datepicker('show');
	dp1.simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDateArray(selectedDate, [new Date(2008, 3 - 1, 4), new Date(2008, 3 - 1, 11)],
		'Range 1 month onClose - enter/ctrl+down/enter');
});

var selectedThis = null;
var selectedDate = null;
var selectedInst = null;

function callback(date, inst) {
	selectedThis = this;
	selectedDate = date;
	selectedInst = inst;
}

test('callbacks', function() {
	var dp1 = $('#dp1');
	var date = new Date();
	// onSelect
	dp1.datepicker({speed: '', onSelect: callback}).val('').datepicker('show');
	dp1.simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equals(selectedThis, dp1[0], 'Callback selected this');
	equals(selectedInst, $.datepicker._getInst(dp1[0]._calId), 'Callback selected inst');
	equals(selectedDate, $.datepicker.formatDate('mm/dd/yy', date), 'Callback selected date');
	dp1.val('').datepicker('show');
	dp1.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date.setDate(date.getDate() + 7);
	equals(selectedDate, $.datepicker.formatDate('mm/dd/yy', date), 'Callback selected date - ctrl+down');
	dp1.val('').datepicker('show');
	dp1.simulate('keydown', {keyCode: $.simulate.VK_ESC});
	equals(selectedDate, $.datepicker.formatDate('mm/dd/yy', date), 'Callback selected date - esc');
	// onChangeMonthYear
	dp1.datepicker('change', {onChangeMonthYear: callback, onSelect: null}).
		val('').datepicker('show');
	date = new Date();
	date.setDate(1);
	dp1.simulate('keydown', {keyCode: $.simulate.VK_PGUP});
	date.setMonth(date.getMonth() - 1);
	equals(selectedThis, dp1[0], 'Callback change month/year this');
	equals(selectedInst, $.datepicker._getInst(dp1[0]._calId), 'Callback change month/year inst');
	equalsDate(selectedDate, date, 'Callback change month/year date - pgup');
	dp1.simulate('keydown', {keyCode: $.simulate.VK_PGDN});
	date.setMonth(date.getMonth() + 1);
	equalsDate(selectedDate, date, 'Callback change month/year date - pgdn');
	dp1.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGUP});
	date.setFullYear(date.getFullYear() - 1);
	equalsDate(selectedDate, date, 'Callback change month/year date - ctrl+pgup');
	dp1.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_HOME});
	date.setFullYear(date.getFullYear() + 1);
	equalsDate(selectedDate, date, 'Callback change month/year date - ctrl+home');
	dp1.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGDN});
	date.setFullYear(date.getFullYear() + 1);
	equalsDate(selectedDate, date, 'Callback change month/year date - ctrl+pgdn');
	// onChangeMonthYear step by 2
	dp1.datepicker('change', {stepMonths: 2}).datepicker('hide').val('').datepicker('show');
	dp1.simulate('keydown', {keyCode: $.simulate.VK_PGUP});
	date.setMonth(date.getMonth() - 14);
	equalsDate(selectedDate, date, 'Callback change month/year by 2 date - pgup');
	dp1.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGUP});
	date.setMonth(date.getMonth() - 12);
	equalsDate(selectedDate, date, 'Callback change month/year by 2 date - ctrl+pgup');
	dp1.simulate('keydown', {keyCode: $.simulate.VK_PGDN});
	date.setMonth(date.getMonth() + 2);
	equalsDate(selectedDate, date, 'Callback change month/year by 2 date - pgdn');
	dp1.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGDN});
	date.setMonth(date.getMonth() + 12);
	equalsDate(selectedDate, date, 'Callback change month/year by 2 date - ctrl+pgdn');
	// onClose
	dp1.datepicker('change', {onClose: callback, onChangeMonthYear: null, stepMonths: 1}).
		val('').datepicker('show');
	dp1.simulate('keydown', {keyCode: $.simulate.VK_ESC});
	equals(selectedThis, dp1[0], 'Callback close this');
	equals(selectedInst, $.datepicker._getInst(dp1[0]._calId), 'Callback close inst');
	ok(selectedDate == null, 'Callback close date - esc');
	dp1.val('').datepicker('show');
	dp1.simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(selectedDate, new Date(), 'Callback close date - enter');
	dp1.val('02/04/2008').datepicker('show');
	dp1.simulate('keydown', {keyCode: $.simulate.VK_ESC});
	equalsDate(selectedDate, new Date(2008, 2 - 1, 4), 'Callback close date - preset');
	dp1.val('02/04/2008').datepicker('show');
	dp1.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_END});
	ok(selectedDate == null, 'Callback close date - ctrl+end');
});

test('noWeekends', function() {
	for (var i = 1; i <= 31; i++) {
		var date = new Date(2001, 1 - 1, i);
		isSet($.datepicker.noWeekends(date), [(i + 1) % 7 >= 2, ''],
			'No weekends ' + date);
	}
});

test('iso8601Week', function() {
	var date = new Date(2000, 12 - 1, 31);
	equals($.datepicker.iso8601Week(date), 52, 'ISO 8601 week ' + date);
	date = new Date(2001, 1 - 1, 1);
	equals($.datepicker.iso8601Week(date), 1, 'ISO 8601 week ' + date);
	date = new Date(2001, 1 - 1, 7);
	equals($.datepicker.iso8601Week(date), 1, 'ISO 8601 week ' + date);
	date = new Date(2001, 1 - 1, 8);
	equals($.datepicker.iso8601Week(date), 2, 'ISO 8601 week ' + date);
	date = new Date(2003, 12 - 1, 28);
	equals($.datepicker.iso8601Week(date), 52, 'ISO 8601 week ' + date);
	date = new Date(2003, 12 - 1, 29);
	equals($.datepicker.iso8601Week(date), 1, 'ISO 8601 week ' + date);
	date = new Date(2004, 1 - 1, 4);
	equals($.datepicker.iso8601Week(date), 1, 'ISO 8601 week ' + date);
	date = new Date(2004, 1 - 1, 5);
	equals($.datepicker.iso8601Week(date), 2, 'ISO 8601 week ' + date);
	date = new Date(2009, 12 - 1, 28);
	equals($.datepicker.iso8601Week(date), 53, 'ISO 8601 week ' + date);
	date = new Date(2010, 1 - 1, 3);
	equals($.datepicker.iso8601Week(date), 53, 'ISO 8601 week ' + date);
	date = new Date(2010, 1 - 1, 4);
	equals($.datepicker.iso8601Week(date), 1, 'ISO 8601 week ' + date);
	date = new Date(2010, 1 - 1, 10);
	equals($.datepicker.iso8601Week(date), 1, 'ISO 8601 week ' + date);
});

test('parseDate', function() {
	ok($.datepicker.parseDate('d m y', '') == null, 'Parse date empty');
	equalsDate($.datepicker.parseDate('d m y', '3 2 01'),
		new Date(2001, 2 - 1, 3), 'Parse date d m y');
	equalsDate($.datepicker.parseDate('dd mm yy', '03 02 2001'),
		new Date(2001, 2 - 1, 3), 'Parse date dd mm yy');
	equalsDate($.datepicker.parseDate('d m y', '13 12 01'),
		new Date(2001, 12 - 1, 13), 'Parse date d m y');
	equalsDate($.datepicker.parseDate('dd mm yy', '13 12 2001'),
		new Date(2001, 12 - 1, 13), 'Parse date dd mm yy');
	equalsDate($.datepicker.parseDate('D d M y', 'Sat 3 Feb 01'),
		new Date(2001, 2 - 1, 3), 'Parse date D d M y');
	equalsDate($.datepicker.parseDate('d MM DD yy', '3 February Saturday 2001'),
		new Date(2001, 2 - 1, 3), 'Parse date dd MM DD yy');
	equalsDate($.datepicker.parseDate('DD, MM d, yy', 'Saturday, February 3, 2001'),
		new Date(2001, 2 - 1, 3), 'Parse date DD, MM d, yy');
	equalsDate($.datepicker.parseDate('\'day\' d of MM (\'\'DD\'\'), yy', 'day 3 of February (\'Saturday\'), 2001'),
		new Date(2001, 2 - 1, 3), 'Parse date \'day\' d of MM (\'\'DD\'\'), yy');
	equalsDate($.datepicker.parseDate('y-m-d', '01-02-03'),
		new Date(2001, 2 - 1, 3), 'Parse date y-m-d - default cutoff');
	equalsDate($.datepicker.parseDate('y-m-d', '51-02-03'),
		new Date(1951, 2 - 1, 3), 'Parse date y-m-d - default cutoff');
	equalsDate($.datepicker.parseDate('y-m-d', '51-02-03', {shortYearCutoff: 80}),
		new Date(2051, 2 - 1, 3), 'Parse date y-m-d - cutoff 80');
	equalsDate($.datepicker.parseDate('y-m-d', '51-02-03', {shortYearCutoff: '+60'}),
		new Date(2051, 2 - 1, 3), 'Parse date y-m-d - cutoff +60');
	var daysShort = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'];
	var daysLong = ['Day1', 'Day2', 'Day3', 'Day4', 'Day5', 'Day6', 'Day7'];
	var monthsShort = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6',
		'M7', 'M8', 'M9', 'M10', 'M11', 'M12'];
	var monthsLong = ['Mon1', 'Mon2', 'Mon3', 'Mon4', 'Mon5', 'Mon6', 
		'Mon7', 'Mon8', 'Mon9', 'Mon10', 'Mon11', 'Mon12'];
	var settings = {dayNamesShort: daysShort, dayNames: daysLong,
		monthNamesShort: monthsShort, monthNames: monthsLong};
	equalsDate($.datepicker.parseDate('D d M y', 'D7 3 M2 01', settings),
		new Date(2001, 2 - 1, 3), 'Parse date D M y with settings');
	equalsDate($.datepicker.parseDate('d MM DD yy', '3 Mon2 Day7 2001', settings),
		new Date(2001, 2 - 1, 3), 'Parse date d MM DD yy with settings');
	equalsDate($.datepicker.parseDate('DD, MM d, yy', 'Day7, Mon2 3, 2001', settings),
		new Date(2001, 2 - 1, 3), 'Parse date DD, MM d, yy with settings');
	equalsDate($.datepicker.parseDate('\'day\' d of MM (\'\'DD\'\'), yy', 'day 3 of Mon2 (\'Day7\'), 2001', settings),
		new Date(2001, 2 - 1, 3), 'Parse date \'day\' d of MM (\'\'DD\'\'), yy with settings');
});

test('parseDateErrors', function() {
	var expectError = function(expr, value, error) {
		try {
			expr();
			ok(false, 'Parsed error ' + value);
		}
		catch (e) {
			equals(e, error, 'Parsed error ' + value);
		}
	};
	expectError(function() { $.datepicker.parseDate(null, 'Sat 2 01'); },
		'Sat 2 01', 'Invalid arguments');
	expectError(function() { $.datepicker.parseDate('d m y', null); },
		'null', 'Invalid arguments');
	expectError(function() { $.datepicker.parseDate('d m y', 'Sat 2 01'); },
		'Sat 2 01', 'Missing number at position 0');
	expectError(function() { $.datepicker.parseDate('d m y', '3 Feb 01'); },
		'3 Feb 01', 'Missing number at position 2');
	expectError(function() { $.datepicker.parseDate('d m y', '3 2 AD01'); },
		'3 2 AD01', 'Missing number at position 4');
	expectError(function() { $.datepicker.parseDate('D d M y', 'D7 3 Feb 01'); },
		'D7 3 Feb 01', 'Unknown name at position 0');
	expectError(function() { $.datepicker.parseDate('D d M y', 'Sat 3 M2 01'); },
		'Sat 3 M2 01', 'Unknown name at position 6');
	expectError(function() { $.datepicker.parseDate('DD, MM d, yy', 'Saturday- Feb 3, 2001'); },
		'Sat- Feb 3, 2001', 'Unexpected literal at position 8');
	expectError(function() { $.datepicker.parseDate('\'day\' d of MM (\'\'DD\'\'), yy', 'day 3 of February ("Saturday"), 2001'); },
		'day 3 of Mon2 ("Day7"), 2001', 'Unexpected literal at position 19');
	expectError(function() { $.datepicker.parseDate('d m y', '29 2 01'); },
		'29 2 01', 'Invalid date');
	var daysShort = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'];
	var daysLong = ['Day1', 'Day2', 'Day3', 'Day4', 'Day5', 'Day6', 'Day7'];
	var monthsShort = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6',
		'M7', 'M8', 'M9', 'M10', 'M11', 'M12'];
	var monthsLong = ['Mon1', 'Mon2', 'Mon3', 'Mon4', 'Mon5', 'Mon6', 
		'Mon7', 'Mon8', 'Mon9', 'Mon10', 'Mon11', 'Mon12'];
	var settings = {dayNamesShort: daysShort, dayNames: daysLong,
		monthNamesShort: monthsShort, monthNames: monthsLong};
	expectError(function() { $.datepicker.parseDate('D d M y', 'Sat 3 M2 01', settings); },
		'Sat 3 M2 01', 'Unknown name at position 0');
	expectError(function() { $.datepicker.parseDate('D d M y', 'D7 3 Feb 01', settings); },
		'D7 3 Feb 01', 'Unknown name at position 5');
});

test('formatDate', function() {
	equals($.datepicker.formatDate('d m y', new Date(2001, 2 - 1, 3)),
		'3 2 01', 'Format date d m y');
	equals($.datepicker.formatDate('dd mm yy', new Date(2001, 2 - 1, 3)),
		'03 02 2001', 'Format date dd mm yy');
	equals($.datepicker.formatDate('d m y', new Date(2001, 12 - 1, 13)),
		'13 12 01', 'Format date d m y');
	equals($.datepicker.formatDate('dd mm yy', new Date(2001, 12 - 1, 13)),
		'13 12 2001', 'Format date dd mm yy');
	equals($.datepicker.formatDate('D M y', new Date(2001, 2 - 1, 3)),
		'Sat Feb 01', 'Format date D M y');
	equals($.datepicker.formatDate('DD MM yy', new Date(2001, 2 - 1, 3)),
		'Saturday February 2001', 'Format date DD MM yy');
	equals($.datepicker.formatDate('DD, MM d, yy', new Date(2001, 2 - 1, 3)),
		'Saturday, February 3, 2001', 'Format date DD, MM d, yy');
	equals($.datepicker.formatDate('\'day\' d of MM (\'\'DD\'\'), yy', new Date(2001, 2 - 1, 3)),
		'day 3 of February (\'Saturday\'), 2001', 'Format date \'day\' d of MM (\'\'DD\'\'), yy');
	var daysShort = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'];
	var daysLong = ['Day1', 'Day2', 'Day3', 'Day4', 'Day5', 'Day6', 'Day7'];
	var monthsShort = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6',
		'M7', 'M8', 'M9', 'M10', 'M11', 'M12'];
	var monthsLong = ['Mon1', 'Mon2', 'Mon3', 'Mon4', 'Mon5', 'Mon6', 
		'Mon7', 'Mon8', 'Mon9', 'Mon10', 'Mon11', 'Mon12'];
	var settings = {dayNamesShort: daysShort, dayNames: daysLong,
		monthNamesShort: monthsShort, monthNames: monthsLong};
	equals($.datepicker.formatDate('D M y', new Date(2001, 2 - 1, 3), settings),
		'D7 M2 01', 'Format date D M y with settings');
	equals($.datepicker.formatDate('DD MM yy', new Date(2001, 2 - 1, 3), settings),
		'Day7 Mon2 2001', 'Format date DD MM yy with settings');
	equals($.datepicker.formatDate('DD, MM d, yy', new Date(2001, 2 - 1, 3), settings),
		'Day7, Mon2 3, 2001', 'Format date DD, MM d, yy with settings');
	equals($.datepicker.formatDate('\'day\' d of MM (\'\'DD\'\'), yy', new Date(2001, 2 - 1, 3), settings),
		'day 3 of Mon2 (\'Day7\'), 2001', 'Format date \'day\' d of MM (\'\'DD\'\'), yy with settings');
});

})(jQuery);
