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

function init(id, options) {
	$.datepicker.setDefaults($.datepicker.regional['']);
	var inp = $(id);
	inp.datepicker($.extend({speed: ''}, options || {}));
	return inp;
}

var PROP_NAME = 'datepicker';

test('setDefaults', function() {
	var inp = init('#inp');
	var dp = $('#ui-datepicker-div');
	ok(!dp.is(':visible'), 'Initially invisible');
	ok(inp.is('.hasDatepicker'), 'Marker class set');
	ok($($.datepicker.dpDiv).html() == '', 'Content empty');
	inp.datepicker('show');
	ok($($.datepicker.dpDiv).html() != '', 'Content present');
	inp.datepicker('hide');
	equals($.datepicker._defaults.showOn, 'focus', 'Initial showOn');
	$.datepicker.setDefaults({showOn: 'button'});
	equals($.datepicker._defaults.showOn, 'button', 'Change default showOn');
	$.datepicker.setDefaults({showOn: 'focus'});
	equals($.datepicker._defaults.showOn, 'focus', 'Restore showOn');
});

test('remove', function() {
	var rem = init('#rem');
	ok(rem.is('.hasDatepicker'), 'Marker class set');
	ok($.data(rem[0], PROP_NAME), 'Datepicker instance present');
	rem.datepicker('destroy');
	rem = $('#rem');
	ok(!rem.is('.hasDatepicker'), 'Marker class cleared');
	ok(!$.data(rem[0], PROP_NAME), 'Datepicker instance absent');
	rem.datepicker({showOn: 'both', buttonImage: 'img/calendar.gif'});
	ok(rem.is('.hasDatepicker'), 'Marker class set');
	ok($.data(rem[0], PROP_NAME), 'Datepicker instance present');
	rem.datepicker('destroy');
	rem = $('#rem');
	ok(!rem.is('.hasDatepicker'), 'Marker class cleared');
	ok(!$.data(rem[0], PROP_NAME), 'Datepicker instance absent');
});

test('change', function() {
	var inp = init('#inp');
	var inst = $.data(inp[0], PROP_NAME);
	equals(inst.settings.showOn, null, 'Initial setting showOn');
	equals($.datepicker._get(inst, 'showOn'), 'focus', 'Initial instance showOn');
	equals($.datepicker._defaults.showOn, 'focus', 'Initial default showOn');
	inp.datepicker('change', 'showOn', 'button');
	equals(inst.settings.showOn, 'button', 'Change setting showOn');
	equals($.datepicker._get(inst, 'showOn'), 'button', 'Change instance showOn');
	equals($.datepicker._defaults.showOn, 'focus', 'Retain default showOn');
	inp.datepicker('change', {showOn: 'both'});
	equals(inst.settings.showOn, 'both', 'Change setting showOn');
	equals($.datepicker._get(inst, 'showOn'), 'both', 'Change instance showOn');
	equals($.datepicker._defaults.showOn, 'focus', 'Retain default showOn');
	inp.datepicker('change', 'showOn', undefined);
	equals(inst.settings.showOn, null, 'Clear setting showOn');
	equals($.datepicker._get(inst, 'showOn'), 'focus', 'Restore instance showOn');
	equals($.datepicker._defaults.showOn, 'focus', 'Retain default showOn');
});

test('invocation', function() {
	var inp = init('#inp');
	var dp = $('#ui-datepicker-div');
	var body = $('body');
	// On focus
	var button = inp.siblings('button');
	ok(button.length == 0, 'Focus - button absent');
	var image = inp.siblings('img');
	ok(image.length == 0, 'Focus - image absent');
	inp.focus();
	ok(dp.is(':visible'), 'Focus - rendered on focus');
	inp.simulate('keydown', {keyCode: $.simulate.VK_ESC});
	ok(!dp.is(':visible'), 'Focus - hidden on exit');
	inp.focus();
	ok(dp.is(':visible'), 'Focus - rendered on focus');
	body.simulate('mousedown', {});
	ok(!dp.is(':visible'), 'Focus - hidden on external click');
	inp.datepicker('hide').datepicker('destroy');
	// On button
	inp = $('#inp');
	inp.datepicker({speed: '', showOn: 'button', buttonText: 'Popup'});
	ok(!dp.is(':visible'), 'Button - initially hidden');
	button = inp.siblings('button');
	image = inp.siblings('img');
	ok(button.length == 1, 'Button - button present');
	ok(image.length == 0, 'Button - image absent');
	equals(button.text(), 'Popup', 'Button - button text');
	inp.focus();
	ok(!dp.is(':visible'), 'Button - not rendered on focus');
	button.click();
	ok(dp.is(':visible'), 'Button - rendered on button click');
	button.click();
	ok(!dp.is(':visible'), 'Button - hidden on second button click');
	inp.datepicker('hide').datepicker('destroy');
	// On image button
	inp = $('#inp');
	inp.datepicker({speed: '', showOn: 'button', buttonImageOnly: true,
		buttonImage: 'img/calendar.gif', buttonText: 'Cal'});
	ok(!dp.is(':visible'), 'Image button - initially hidden');
	button = inp.siblings('button');
	ok(button.length == 0, 'Image button - button absent');
	image = inp.siblings('img');
	ok(image.length == 1, 'Image button - image present');
	equals(image.attr('title'), 'Cal', 'Image button - image text');
	inp.focus();
	ok(!dp.is(':visible'), 'Image button - not rendered on focus');
	image.click();
	ok(dp.is(':visible'), 'Image button - rendered on image click');
	image.click();
	ok(!dp.is(':visible'), 'Image button - hidden on second image click');
	inp.datepicker('hide').datepicker('destroy');
	// On both
	inp = $('#inp');
	inp.datepicker({speed: '', showOn: 'both', buttonImage: 'img/calendar.gif'});
	ok(!dp.is(':visible'), 'Both - initially hidden');
	button = inp.siblings('button');
	ok(button.length == 1, 'Both - button present');
	image = inp.siblings('img');
	ok(image.length == 0, 'Both - image absent');
	image = button.children('img');
	ok(image.length == 1, 'Both - button image present');
	inp.focus();
	ok(dp.is(':visible'), 'Both - rendered on focus');
	body.simulate('mousedown', {});
	ok(!dp.is(':visible'), 'Both - hidden on external click');
	button.click();
	ok(dp.is(':visible'), 'Both - rendered on button click');
	button.click();
	ok(!dp.is(':visible'), 'Both - hidden on second button click');
});

test('enableDisable', function() {
	var inp = init('#inp');
	ok(!inp.datepicker('isDisabled'), 'Initially marked as enabled');
	ok(!inp[0].disabled, 'Field initially enabled');
	inp.datepicker('disable');
	ok(inp.datepicker('isDisabled'), 'Now marked as disabled');
	ok(inp[0].disabled, 'Field now disabled');
	inp.datepicker('enable');
	ok(!inp.datepicker('isDisabled'), 'Now marked as enabled');
	ok(!inp[0].disabled, 'Field now enabled');
});

test('keystrokes', function() {
	var inp = init('#inp');
	var date = new Date();
	inp.val('').datepicker('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(inp.datepicker('getDate'), date, 'Keystroke enter');
	inp.val('02/04/2008').datepicker('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(inp.datepicker('getDate'), new Date(2008, 2 - 1, 4), 'Keystroke enter - preset');
	inp.val('02/04/2008').datepicker('show');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_HOME}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(inp.datepicker('getDate'), date, 'Keystroke ctrl+home');
	inp.val('02/04/2008').datepicker('show');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_END});
	ok(inp.datepicker('getDate') == null, 'Keystroke ctrl+end');
	inp.val('').datepicker('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_ESC});
	ok(inp.datepicker('getDate') == null, 'Keystroke esc');
	inp.val('02/04/2008').datepicker('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_ESC});
	equalsDate(inp.datepicker('getDate'), new Date(2008, 2 - 1, 4), 'Keystroke esc - preset');
	inp.val('02/04/2008').datepicker('show');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGUP}).
		simulate('keydown', {keyCode: $.simulate.VK_ESC});
	equalsDate(inp.datepicker('getDate'), new Date(2008, 2 - 1, 4), 'Keystroke esc - abandoned');
	// Moving by day or week
	inp.val('').datepicker('show');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_LEFT}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date.setDate(date.getDate() - 1);
	equalsDate(inp.datepicker('getDate'), date, 'Keystroke ctrl+left');
	inp.val('').datepicker('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_LEFT}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date.setDate(date.getDate() + 1);
	equalsDate(inp.datepicker('getDate'), date, 'Keystroke left');
	inp.val('').datepicker('show');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_RIGHT}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date.setDate(date.getDate() + 1);
	equalsDate(inp.datepicker('getDate'), date, 'Keystroke ctrl+right');
	inp.val('').datepicker('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_RIGHT}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date.setDate(date.getDate() - 1);
	equalsDate(inp.datepicker('getDate'), date, 'Keystroke right');
	inp.val('').datepicker('show');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_UP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date.setDate(date.getDate() - 7);
	equalsDate(inp.datepicker('getDate'), date, 'Keystroke ctrl+up');
	inp.val('').datepicker('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_UP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date.setDate(date.getDate() + 7);
	equalsDate(inp.datepicker('getDate'), date, 'Keystroke up');
	inp.val('').datepicker('show');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date.setDate(date.getDate() + 7);
	equalsDate(inp.datepicker('getDate'), date, 'Keystroke ctrl+down');
	inp.val('').datepicker('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date.setDate(date.getDate() - 7);
	equalsDate(inp.datepicker('getDate'), date, 'Keystroke down');
	// Moving by month or year
	inp.val('02/04/2008').datepicker('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_PGUP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(inp.datepicker('getDate'), new Date(2008, 1 - 1, 4), 'Keystroke pgup');
	inp.val('02/04/2008').datepicker('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(inp.datepicker('getDate'), new Date(2008, 3 - 1, 4), 'Keystroke pgdn');
	inp.val('02/04/2008').datepicker('show');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGUP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(inp.datepicker('getDate'), new Date(2007, 2 - 1, 4), 'Keystroke ctrl+pgup');
	inp.val('02/04/2008').datepicker('show');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(inp.datepicker('getDate'), new Date(2009, 2 - 1, 4), 'Keystroke ctrl+pgdn');
	// Check for moving to short months
	inp.val('03/31/2008').datepicker('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_PGUP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(inp.datepicker('getDate'), new Date(2008, 2 - 1, 29), 'Keystroke pgup - Feb');
	inp.val('01/30/2008').datepicker('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(inp.datepicker('getDate'), new Date(2008, 2 - 1, 29), 'Keystroke pgdn - Feb');
	inp.val('02/29/2008').datepicker('show');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGUP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(inp.datepicker('getDate'), new Date(2007, 2 - 1, 28), 'Keystroke ctrl+pgup - Feb');
	inp.val('02/29/2008').datepicker('show');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(inp.datepicker('getDate'), new Date(2009, 2 - 1, 28), 'Keystroke ctrl+pgdn - Feb');
});

test('mouse', function() {
	var inp = init('#inp');
	var dp = $('#ui-datepicker-div');
	var date = new Date();
	inp.val('').datepicker('show');
	$('.ui-datepicker tbody a:contains(10)', dp).simulate('click', {});
	date.setDate(10);
	equalsDate(inp.datepicker('getDate'), date, 'Mouse click');
	inp.val('02/04/2008').datepicker('show');
	$('.ui-datepicker tbody a:contains(12)', dp).simulate('click', {});
	equalsDate(inp.datepicker('getDate'), new Date(2008, 2 - 1, 12), 'Mouse click - preset');
	inp.val('02/04/2008').datepicker('show');
	$('.ui-datepicker-clear a', dp).simulate('click', {});
	ok(inp.datepicker('getDate') == null, 'Mouse click - clear');
	inp.val('').datepicker('show');
	$('.ui-datepicker-close a', dp).simulate('click', {});
	ok(inp.datepicker('getDate') == null, 'Mouse click - close');
	inp.val('02/04/2008').datepicker('show');
	$('.ui-datepicker-close a', dp).simulate('click', {});
	equalsDate(inp.datepicker('getDate'), new Date(2008, 2 - 1, 4), 'Mouse click - close + preset');
	inp.val('02/04/2008').datepicker('show');
	$('.ui-datepicker-prev a', dp).simulate('click', {});
	$('.ui-datepicker-close a', dp).simulate('click', {});
	equalsDate(inp.datepicker('getDate'), new Date(2008, 2 - 1, 4), 'Mouse click - abandoned');
	// Current/previous/next
	inp.val('02/04/2008').datepicker('show');
	$('.ui-datepicker-current a', dp).simulate('click', {});
	$('.ui-datepicker tbody a:contains(14)', dp).simulate('click', {});
	date.setDate(14);
	equalsDate(inp.datepicker('getDate'), date, 'Mouse click - current');
	inp.val('02/04/2008').datepicker('show');
	$('.ui-datepicker-prev a', dp).simulate('click', {});
	$('.ui-datepicker tbody a:contains(16)', dp).simulate('click', {});
	equalsDate(inp.datepicker('getDate'), new Date(2008, 1 - 1, 16), 'Mouse click - previous');
	inp.val('02/04/2008').datepicker('show');
	$('.ui-datepicker-next a', dp).simulate('click', {});
	$('.ui-datepicker tbody a:contains(18)', dp).simulate('click', {});
	equalsDate(inp.datepicker('getDate'), new Date(2008, 3 - 1, 18), 'Mouse click - next');
	// Previous/next with minimum/maximum
	inp.datepicker('change', {minDate: new Date(2008, 2 - 1, 2), maxDate: new Date(2008, 2 - 1, 26)}).
		val('02/04/2008').datepicker('show');
	$('.ui-datepicker-prev a', dp).simulate('click', {});
	$('.ui-datepicker tbody a:contains(16)', dp).simulate('click', {});
	equalsDate(inp.datepicker('getDate'), new Date(2008, 2 - 1, 16), 'Mouse click - previous + min/max');
	inp.val('02/04/2008').datepicker('show');
	$('.ui-datepicker-next a', dp).simulate('click', {});
	$('.ui-datepicker tbody a:contains(18)', dp).simulate('click', {});
	equalsDate(inp.datepicker('getDate'), new Date(2008, 2 - 1, 18), 'Mouse click - next + min/max');
	// Change day of week
	inp.val('02/04/2008').datepicker('show');
	equals($('.ui-datepicker-title-row td:first', dp).text(), 'Su', 'Mouse click - initial day of week');
	$('.ui-datepicker-title-row td:last a', dp).simulate('click', {});
	equals($('.ui-datepicker-title-row td:first', dp).text(), 'Sa', 'Mouse click - day of week');
});

test('defaultDate', function() {
	var inp = init('#inp');
	var date = new Date();
	inp.val('').datepicker('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(inp.datepicker('getDate'), date, 'Default date null');
	inp.datepicker('change', {defaultDate: '-1d'}).
		datepicker('hide').val('').datepicker('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date.setDate(date.getDate() - 1);
	equalsDate(inp.datepicker('getDate'), date, 'Default date -1d');
	inp.datepicker('change', {defaultDate: '+3D'}).
		datepicker('hide').val('').datepicker('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date.setDate(date.getDate() + 4);
	equalsDate(inp.datepicker('getDate'), date, 'Default date +3D');
	inp.datepicker('change', {defaultDate: ' -2 w '}).
		datepicker('hide').val('').datepicker('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date = new Date();
	date.setDate(date.getDate() - 14);
	equalsDate(inp.datepicker('getDate'), date, 'Default date -2 w');
	inp.datepicker('change', {defaultDate: '+1 W'}).
		datepicker('hide').val('').datepicker('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date.setDate(date.getDate() + 21);
	equalsDate(inp.datepicker('getDate'), date, 'Default date +1 W');
	inp.datepicker('change', {defaultDate: ' -1 m '}).
		datepicker('hide').val('').datepicker('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date = new Date();
	date.setMonth(date.getMonth() - 1);
	equalsDate(inp.datepicker('getDate'), date, 'Default date -1 m');
	inp.datepicker('change', {defaultDate: '+2M'}).
		datepicker('hide').val('').datepicker('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date.setMonth(date.getMonth() + 3);
	equalsDate(inp.datepicker('getDate'), date, 'Default date +2M');
	inp.datepicker('change', {defaultDate: '-2y'}).
		datepicker('hide').val('').datepicker('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date = new Date();
	date.setFullYear(date.getFullYear() - 2);
	equalsDate(inp.datepicker('getDate'), date, 'Default date -2y');
	inp.datepicker('change', {defaultDate: '+1 Y '}).
		datepicker('hide').val('').datepicker('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date.setFullYear(date.getFullYear() + 3);
	equalsDate(inp.datepicker('getDate'), date, 'Default date +1 Y');
	inp.datepicker('change', {defaultDate: '+1M +10d'}).
		datepicker('hide').val('').datepicker('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date = new Date();
	date.setMonth(date.getMonth() + 1);
	date.setDate(date.getDate() + 10);
	equalsDate(inp.datepicker('getDate'), date, 'Default date +1M +10d');
	date = new Date(2007, 1 - 1, 26);
	inp.datepicker('change', {defaultDate: date}).
		datepicker('hide').val('').datepicker('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(inp.datepicker('getDate'), date, 'Default date 01/26/2007');
});

test('minMax', function() {
	var inp = init('#inp');
	var lastYear = new Date(2007, 6 - 1, 4);
	var nextYear = new Date(2009, 6 - 1, 4);
	var minDate = new Date(2008, 2 - 1, 29);
	var maxDate = new Date(2008, 12 - 1, 7);
	inp.val('06/04/2008').datepicker('show');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGUP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(inp.datepicker('getDate'), lastYear, 'Min/max - null, null - ctrl+pgup');
	inp.val('06/04/2008').datepicker('show');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(inp.datepicker('getDate'), nextYear, 'Min/max - null, null - ctrl+pgdn');
	inp.datepicker('change', {minDate: minDate}).datepicker('hide').val('06/04/2008').datepicker('show');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGUP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(inp.datepicker('getDate'), minDate, 'Min/max - 02/29/2008, null - ctrl+pgup');
	inp.val('06/04/2008').datepicker('show');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(inp.datepicker('getDate'), nextYear, 'Min/max - 02/29/2008, null - ctrl+pgdn');
	inp.datepicker('change', {maxDate: maxDate}).datepicker('hide').val('06/04/2008').datepicker('show');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGUP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(inp.datepicker('getDate'), minDate, 'Min/max - 02/29/2008, 12/07/2008 - ctrl+pgup');
	inp.val('06/04/2008').datepicker('show');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(inp.datepicker('getDate'), maxDate, 'Min/max - 02/29/2008, 12/07/2008 - ctrl+pgdn');
	inp.datepicker('change', {minDate: null}).datepicker('hide').val('06/04/2008').datepicker('show');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGUP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(inp.datepicker('getDate'), lastYear, 'Min/max - null, 12/07/2008 - ctrl+pgup');
	inp.val('06/04/2008').datepicker('show');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(inp.datepicker('getDate'), maxDate, 'Min/max - null, 12/07/2008 - ctrl+pgdn');
	// relative dates
	var date = new Date();
	date.setDate(date.getDate() - 7);
	inp.datepicker('change', {minDate: '-1w', maxDate: '+1 M +10 D '}).
		datepicker('hide').val('').datepicker('show');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGUP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(inp.datepicker('getDate'), date, 'Min/max - -1w, +1 M +10 D - ctrl+pgup');
	date = new Date();
	date.setMonth(date.getMonth() + 1);
	date.setDate(date.getDate() + 10);
	inp.val('').datepicker('show');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(inp.datepicker('getDate'), date, 'Min/max - -1w, +1 M +10 D - ctrl+pgdn');
});

test('setDate', function() {
	var inp = init('#inp');
	var date1 = new Date(2008, 6 - 1, 4);
	var date2 = new Date();
	inp.datepicker('setDate', date1);
	equalsDate(inp.datepicker('getDate'), date1, 'Set date - 2008-06-04');
	date1 = new Date();
	date1.setDate(date1.getDate() + 7);
	inp.datepicker('setDate', +7);
	equalsDate(inp.datepicker('getDate'), date1, 'Set date - +7');
	date2.setFullYear(date2.getFullYear() + 2);
	inp.datepicker('setDate', '+2y');
	equalsDate(inp.datepicker('getDate'), date2, 'Set date - +2y');
	inp.datepicker('setDate', date1, date2);
	equalsDate(inp.datepicker('getDate'), date1, 'Set date - two dates');
	inp.datepicker('setDate');
	ok(inp.datepicker('getDate') == null, 'Set date - null');
	// Ranges
	date1 = new Date(2008, 6 - 1, 4);
	date2 = new Date(2009, 7 - 1, 5);
	inp.datepicker('change', {rangeSelect: true});
	inp.datepicker('setDate', date1, date2);
	equalsDateArray(inp.datepicker('getDate'), [date1, date2], 'Set date range - 2008-06-04 - 2009-07-05');
	inp.datepicker('setDate', date1);
	equalsDateArray(inp.datepicker('getDate'), [date1, date1], 'Set date range - 2008-06-04');
	date1 = new Date();
	date1.setDate(date1.getDate() - 10);
	date2 = new Date();
	date2.setDate(date2.getDate() + 10);
	inp.datepicker('setDate', -10, +10);
	equalsDateArray(inp.datepicker('getDate'), [date1, date2], 'Set date range - -10 - +10');
	inp.datepicker('setDate', -10);
	equalsDateArray(inp.datepicker('getDate'), [date1, date1], 'Set date range - -10');
	date1 = new Date();
	date1.setDate(date1.getDate() - 14);
	date2 = new Date();
	date2.setFullYear(date2.getFullYear() + 1);
	inp.datepicker('setDate', '-2w', '+1Y');
	equalsDateArray(inp.datepicker('getDate'), [date1, date2], 'Set date range - -2w - +1Y');
	inp.datepicker('setDate', '-2w');
	equalsDateArray(inp.datepicker('getDate'), [date1, date1], 'Set date range - -2w');
	inp.datepicker('setDate');
	isObj(inp.datepicker('getDate'), [null, null], 'Set date range - null');
});

test('ranges', function() {
	var inp = init('#inp', {rangeSelect: true});
	var d1 = new Date();
	var d2 = new Date();
	// Select today - today
	inp.val('').datepicker('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDateArray(inp.datepicker('getDate'), [d1, d2], 'Range 1 month - enter/enter');
	// Can't select prior to start date
	inp.val('').datepicker('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_UP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDateArray(inp.datepicker('getDate'), [d1, d2], 'Range 1 month - enter/ctrl+up/enter');
	// Can select after start date
	inp.val('').datepicker('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	d2.setDate(d2.getDate() + 7);
	equalsDateArray(inp.datepicker('getDate'), [d1, d2], 'Range 1 month - enter/ctrl+down/enter');
	// Select then cancel defaults to first date
	inp.val('').datepicker('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {keyCode: $.simulate.VK_ESC});
	equalsDateArray(inp.datepicker('getDate'), [d1, d1], 'Range 1 month - enter/ctrl+down/esc');
	// Callbacks
	inp.datepicker('change', {onSelect: callback}).datepicker('hide').
		val('06/04/2008').datepicker('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equals(selectedDate, '06/04/2008 - 06/11/2008', 'Range 1 month onSelect - enter/ctrl+down/enter');
	inp.datepicker('change', {onChangeMonthYear: callback, onSelect: null}).datepicker('hide').
		val('05/04/2008').datepicker('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_PGUP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(selectedDate, new Date(2008, 4 - 1, 1), 'Range 1 month onChangeMonthYear - enter/ctrl+down/enter');
	inp.datepicker('change', {onClose: callback, onChangeMonthYear: null}).datepicker('hide').
		val('03/04/2008').datepicker('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDateArray(selectedDate, [new Date(2008, 3 - 1, 4), new Date(2008, 3 - 1, 11)],
		'Range 1 month onClose - enter/ctrl+down/enter');
});

test('altField', function() {
	var inp = init('#inp');
	var alt = $('#alt');
	// No alternate field set
	alt.val('');
	inp.val('06/04/2008').datepicker('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equals(inp.val(), '06/04/2008', 'Alt field - dp - enter');
	equals(alt.val(), '', 'Alt field - alt not set');
	// Alternate field set
	alt.val('');
	inp.datepicker('change', {altField: '#alt', altFormat: 'yy-mm-dd'}).
		val('06/04/2008').datepicker('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equals(inp.val(), '06/04/2008', 'Alt field - dp - enter');
	equals(alt.val(), '2008-06-04', 'Alt field - alt - enter');
	// Move from initial date
	alt.val('');
	inp.val('06/04/2008').datepicker('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equals(inp.val(), '07/04/2008', 'Alt field - dp - pgdn');
	equals(alt.val(), '2008-07-04', 'Alt field - alt - pgdn');
	// Alternate field set - closed
	alt.val('');
	inp.val('06/04/2008').datepicker('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_ESC});
	equals(inp.val(), '06/04/2008', 'Alt field - dp - pgdn/esc');
	equals(alt.val(), '', 'Alt field - alt - pgdn/esc');
	// Clear date and alternate
	alt.val('');
	inp.val('06/04/2008').datepicker('show');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_END});
	equals(inp.val(), '', 'Alt field - dp - ctrl+end');
	equals(alt.val(), '', 'Alt field - alt - ctrl+end');
	// Range select no alternate field set
	alt.val('');
	inp.datepicker('change', {rangeSelect: true, altField: '', altFormat: ''}).
		datepicker('hide').val('06/04/2008 - 07/14/2008').datepicker('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equals(inp.val(), '06/04/2008 - 06/04/2008', 'Alt field range - dp - enter');
	equals(alt.val(), '', 'Alt field range - alt not set');
	// Range select no movement
	alt.val('');
	inp.datepicker('change', {altField: '#alt', altFormat: 'yy-mm-dd'}).
		datepicker('hide').val('06/04/2008 - 07/14/2008').datepicker('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equals(inp.val(), '06/04/2008 - 06/04/2008', 'Alt field range - dp - enter');
	equals(alt.val(), '2008-06-04 - 2008-06-04', 'Alt field range - alt - enter');
	// Range select next month
	alt.val('');
	inp.val('06/04/2008 - 07/14/2008').datepicker('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equals(inp.val(), '06/04/2008 - 07/04/2008', 'Alt field range - dp - enter/pgdn/enter');
	equals(alt.val(), '2008-06-04 - 2008-07-04', 'Alt field range - alt - enter/pgdn/enter');
	// Range select escape
	alt.val('');
	inp.val('06/04/2008 - 07/14/2008').datepicker('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_ESC});
	equals(inp.val(), '06/04/2008 - 06/04/2008', 'Alt field range - dp - enter/pgdn/esc');
	equals(alt.val(), '2008-06-04 - 2008-06-04', 'Alt field range - alt - enter/pgdn/esc');
	// Range select clear
	alt.val('');
	inp.val('06/04/2008 - 07/14/2008').datepicker('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_END});
	equals(inp.val(), '', 'Alt field range - dp - enter/pgdn/ctrl+end');
	equals(alt.val(), '', 'Alt field range - alt - enter/pgdn/ctrl+end');
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
	var inp = init('#inp', {onSelect: callback});
	var date = new Date();
	// onSelect
	inp.val('').datepicker('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equals(selectedThis, inp[0], 'Callback selected this');
	equals(selectedInst, $.data(inp[0], PROP_NAME), 'Callback selected inst');
	equals(selectedDate, $.datepicker.formatDate('mm/dd/yy', date), 'Callback selected date');
	inp.val('').datepicker('show');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date.setDate(date.getDate() + 7);
	equals(selectedDate, $.datepicker.formatDate('mm/dd/yy', date), 'Callback selected date - ctrl+down');
	inp.val('').datepicker('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_ESC});
	equals(selectedDate, $.datepicker.formatDate('mm/dd/yy', date), 'Callback selected date - esc');
	// onChangeMonthYear
	inp.datepicker('change', {onChangeMonthYear: callback, onSelect: null}).
		val('').datepicker('show');
	date = new Date();
	date.setDate(1);
	inp.simulate('keydown', {keyCode: $.simulate.VK_PGUP});
	date.setMonth(date.getMonth() - 1);
	equals(selectedThis, inp[0], 'Callback change month/year this');
	equals(selectedInst, $.data(inp[0], PROP_NAME), 'Callback change month/year inst');
	equalsDate(selectedDate, date, 'Callback change month/year date - pgup');
	inp.simulate('keydown', {keyCode: $.simulate.VK_PGDN});
	date.setMonth(date.getMonth() + 1);
	equalsDate(selectedDate, date, 'Callback change month/year date - pgdn');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGUP});
	date.setFullYear(date.getFullYear() - 1);
	equalsDate(selectedDate, date, 'Callback change month/year date - ctrl+pgup');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_HOME});
	date.setFullYear(date.getFullYear() + 1);
	equalsDate(selectedDate, date, 'Callback change month/year date - ctrl+home');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGDN});
	date.setFullYear(date.getFullYear() + 1);
	equalsDate(selectedDate, date, 'Callback change month/year date - ctrl+pgdn');
	// onChangeMonthYear step by 2
	inp.datepicker('change', {stepMonths: 2}).datepicker('hide').val('').datepicker('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_PGUP});
	date.setMonth(date.getMonth() - 14);
	equalsDate(selectedDate, date, 'Callback change month/year by 2 date - pgup');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGUP});
	date.setMonth(date.getMonth() - 12);
	equalsDate(selectedDate, date, 'Callback change month/year by 2 date - ctrl+pgup');
	inp.simulate('keydown', {keyCode: $.simulate.VK_PGDN});
	date.setMonth(date.getMonth() + 2);
	equalsDate(selectedDate, date, 'Callback change month/year by 2 date - pgdn');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGDN});
	date.setMonth(date.getMonth() + 12);
	equalsDate(selectedDate, date, 'Callback change month/year by 2 date - ctrl+pgdn');
	// onClose
	inp.datepicker('change', {onClose: callback, onChangeMonthYear: null, stepMonths: 1}).
		val('').datepicker('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_ESC});
	equals(selectedThis, inp[0], 'Callback close this');
	equals(selectedInst, $.data(inp[0], PROP_NAME), 'Callback close inst');
	ok(selectedDate == null, 'Callback close date - esc');
	inp.val('').datepicker('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(selectedDate, new Date(), 'Callback close date - enter');
	inp.val('02/04/2008').datepicker('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_ESC});
	equalsDate(selectedDate, new Date(2008, 2 - 1, 4), 'Callback close date - preset');
	inp.val('02/04/2008').datepicker('show');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_END});
	ok(selectedDate == null, 'Callback close date - ctrl+end');
});

test('status', function() {
	var inp = init('#inp', {showStatus: true});
	inp.val('').datepicker('show');
	var dp = $('#ui-datepicker-div');
	var status = $('.ui-datepicker-status', dp);
	equals(status.text(), 'Select a date', 'Status - default');
	$('.ui-datepicker-clear a', dp).simulate('mouseover');
	equals(status.text(), 'Erase the current date', 'Status - clear');
	$('.ui-datepicker-close a', dp).simulate('mouseover');
	equals(status.text(), 'Close without change', 'Status - close');
	$('.ui-datepicker-prev a', dp).simulate('mouseover');
	equals(status.text(), 'Show the previous month', 'Status - previous');
	$('.ui-datepicker-current a', dp).simulate('mouseover');
	equals(status.text(), 'Show the current month', 'Status - current');
	$('.ui-datepicker-next a', dp).simulate('mouseover');
	equals(status.text(), 'Show the next month', 'Status - next');
	$('.ui-datepicker-new-month', dp).simulate('mouseover');
	equals(status.text(), 'Show a different month', 'Status - new month');
	$('.ui-datepicker-new-year', dp).simulate('mouseover');
	equals(status.text(), 'Show a different year', 'Status - new year');
	var day = 0;
	$('.ui-datepicker-title-row a', dp).each(function() {
		$(this).simulate('mouseover');
		equals(status.text(), 'Set ' + $.datepicker.regional[''].dayNames[day] +
			' as first week day', 'Status - day ' + day);
		day++;
	});
	day = 0;
	var month = $.datepicker.regional[''].monthNamesShort[new Date().getMonth()];
	$('.ui-datepicker-days-row:eq(1) a', dp).each(function() {
		$(this).simulate('mouseover');
		equals(status.text(), 'Select ' + $.datepicker.regional[''].dayNames[day] +
			', ' + month + ' ' + $(this).text(), 'Status - dates');
		day++;
	});
});

test('localisation', function() {
	var inp = init('#inp', $.datepicker.regional['fr']);
	inp.datepicker('change', {dateFormat: 'DD, d MM yy', showStatus: true}).
		val('').datepicker('show');
	var dp = $('#ui-datepicker-div');
	var status = $('.ui-datepicker-status', dp);
	equals($('.ui-datepicker-clear', dp).text(), 'Effacer', 'Localisation - clear');
	equals($('.ui-datepicker-close', dp).text(), 'Fermer', 'Localisation - close');
	$('.ui-datepicker-close a', dp).simulate('mouseover');
	equals(status.text(), 'Fermer sans modifier', 'Localisation - status');
	equals($('.ui-datepicker-prev', dp).text(), '<Préc', 'Localisation - previous');
	equals($('.ui-datepicker-current', dp).text(), 'Courant', 'Localisation - current');
	equals($('.ui-datepicker-next', dp).text(), 'Suiv>', 'Localisation - next');
	equals($('.ui-datepicker-current', dp).text(), 'Courant', 'Localisation - current');
	var month = 0;
	$('.ui-datepicker-new-month option', dp).each(function() {
		equals($(this).text(), $.datepicker.regional['fr'].monthNames[month],
			'Localisation - month ' + month);
		month++;
	});
	var day = 0;
	$('.ui-datepicker-title-row td', dp).each(function() {
		equals($(this).text(), $.datepicker.regional['fr'].dayNamesMin[day],
			'Localisation - day ' + day);
		day++;
	});
	inp.simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	var date = new Date();
	equals(inp.val(), $.datepicker.regional['fr'].dayNames[date.getDay()] +
		', ' + date.getDate() + ' ' + $.datepicker.regional['fr'].monthNames[date.getMonth()] +
		' ' + date.getFullYear(), 'Localisation - formatting');
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
