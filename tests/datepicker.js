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
	same(a1, a2, message);
}

function init(id, options) {
	$.datepicker.setDefaults($.datepicker.regional['']);
	var inp = $(id);
	inp.datepicker($.extend({duration: ''}, options || {}));
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

test('destroy', function() {
	var inp = init('#inp');
	ok(inp.is('.hasDatepicker'), 'Default - marker class set');
	ok($.data(inp[0], PROP_NAME), 'Default - instance present');
	ok(inp.next().is('#alt'), 'Default - button absent');
	inp.datepicker('destroy');
	inp = $('#inp');
	ok(!inp.is('.hasDatepicker'), 'Default - marker class cleared');
	ok(!$.data(inp[0], PROP_NAME), 'Default - instance absent');
	ok(inp.next().is('#alt'), 'Default - button absent');
	// With button
	inp= init('#inp', {showOn: 'both'});
	ok(inp.is('.hasDatepicker'), 'Button - marker class set');
	ok($.data(inp[0], PROP_NAME), 'Button - instance present');
	ok(inp.next().text() == '...', 'Button - button added');
	inp.datepicker('destroy');
	inp = $('#inp');
	ok(!inp.is('.hasDatepicker'), 'Button - marker class cleared');
	ok(!$.data(inp[0], PROP_NAME), 'Button - instance absent');
	ok(inp.next().is('#alt'), 'Button - button removed');
	// With append text
	inp = init('#inp', {appendText: 'Testing'});
	ok(inp.is('.hasDatepicker'), 'Append - marker class set');
	ok($.data(inp[0], PROP_NAME), 'Append - instance present');
	ok(inp.next().text() == 'Testing', 'Append - append text added');
	inp.datepicker('destroy');
	inp = $('#inp');
	ok(!inp.is('.hasDatepicker'), 'Append - marker class cleared');
	ok(!$.data(inp[0], PROP_NAME), 'Append - instance absent');
	ok(inp.next().is('#alt'), 'Append - append text removed');
	// With both
	inp= init('#inp', {showOn: 'both', buttonImageOnly: true,
		buttonImage: 'img/calendar.gif', appendText: 'Testing'});
	ok(inp.is('.hasDatepicker'), 'Both - marker class set');
	ok($.data(inp[0], PROP_NAME), 'Both - instance present');
	ok(inp.next()[0].nodeName.toLowerCase() == 'img', 'Both - button added');
	ok(inp.next().next().text() == 'Testing', 'Both - append text added');
	inp.datepicker('destroy');
	inp = $('#inp');
	ok(!inp.is('.hasDatepicker'), 'Both - marker class cleared');
	ok(!$.data(inp[0], PROP_NAME), 'Both - instance absent');
	ok(inp.next().is('#alt'), 'Both - button and append text absent');
	// Inline
	var inl = init('#inl');
	ok(inl.is('.hasDatepicker'), 'Inline - marker class set');
	ok(inl.html() != '', 'Inline - datepicker present');
	ok($.data(inl[0], PROP_NAME), 'Inline - instance present');
	ok(inl.next().length == 0 || inl.next().is('p'), 'Inline - button absent');
	inl.datepicker('destroy');
	inl = $('#inl');
	ok(!inl.is('.hasDatepicker'), 'Inline - marker class cleared');
	ok(inl.html() == '', 'Inline - datepicker absent');
	ok(!$.data(inl[0], PROP_NAME), 'Inline - instance absent');
	ok(inl.next().length == 0 || inl.next().is('p'), 'Inline - button absent');
});

test('option', function() {
	var inp = init('#inp');
	var inst = $.data(inp[0], PROP_NAME);
	equals(inst.settings.showOn, null, 'Initial setting showOn');
	equals($.datepicker._get(inst, 'showOn'), 'focus', 'Initial instance showOn');
	equals($.datepicker._defaults.showOn, 'focus', 'Initial default showOn');
	inp.datepicker('option', 'showOn', 'button');
	equals(inst.settings.showOn, 'button', 'Change setting showOn');
	equals($.datepicker._get(inst, 'showOn'), 'button', 'Change instance showOn');
	equals($.datepicker._defaults.showOn, 'focus', 'Retain default showOn');
	inp.datepicker('option', {showOn: 'both'});
	equals(inst.settings.showOn, 'both', 'Change setting showOn');
	equals($.datepicker._get(inst, 'showOn'), 'both', 'Change instance showOn');
	equals($.datepicker._defaults.showOn, 'focus', 'Retain default showOn');
	inp.datepicker('option', 'showOn', undefined);
	equals(inst.settings.showOn, null, 'Clear setting showOn');
	equals($.datepicker._get(inst, 'showOn'), 'focus', 'Restore instance showOn');
	equals($.datepicker._defaults.showOn, 'focus', 'Retain default showOn');
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
	inp = init('#inp', {showOn: 'button', buttonText: 'Popup'});
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
	inp = init('#inp', {showOn: 'button', buttonImageOnly: true,
		buttonImage: 'img/calendar.gif', buttonText: 'Cal'});
	ok(!dp.is(':visible'), 'Image button - initially hidden');
	button = inp.siblings('button');
	ok(button.length == 0, 'Image button - button absent');
	image = inp.siblings('img');
	ok(image.length == 1, 'Image button - image present');
	equals(image.attr('src'), 'img/calendar.gif', 'Image button - image source');
	equals(image.attr('title'), 'Cal', 'Image button - image text');
	inp.focus();
	ok(!dp.is(':visible'), 'Image button - not rendered on focus');
	image.click();
	ok(dp.is(':visible'), 'Image button - rendered on image click');
	image.click();
	ok(!dp.is(':visible'), 'Image button - hidden on second image click');
	inp.datepicker('hide').datepicker('destroy');
	// On both
	inp = init('#inp', {showOn: 'both', buttonImage: 'img/calendar.gif'});
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
	inp.datepicker('hide').datepicker('destroy');
});

test('baseStructure', function() {
	var dp = $('#ui-datepicker-div');
	var inp = init('#inp');
	inp.focus();
	var iframe = ($.browser.msie && parseInt($.browser.version) < 7);
	ok(dp.is(':visible'), 'Structure - datepicker visible');
	ok(!dp.is('.ui-datepicker-rtl'), 'Structure - not right-to-left');
	ok(!dp.is('.ui-datepicker-multi'), 'Structure - not multi-month');
	equals(dp.children().length, 4 + (iframe ? 1 : 0), 'Structure - child count');
	var control = dp.children(':first');
	ok(control.is('div.ui-datepicker-control'), 'Structure - control division');
	equals(control.children().length, 2, 'Structure - control child count');
	ok(control.children(':first').is('div.ui-datepicker-clear'),
		'Structure - clear division');
	ok(control.children(':last').is('div.ui-datepicker-close'),
		'Structure - close division');
	var links = dp.children(':eq(1)');
	ok(links.is('div.ui-datepicker-links'), 'Structure - links division');
	equals(links.children().length, 3, 'Structure - links child count');
	ok(links.children(':first').is('div.ui-datepicker-prev') &&
		links.children(':first').html() != '',
		'Structure - prev division');
	ok(links.children(':eq(1)').is('div.ui-datepicker-current') &&
		links.children(':eq(1)').html() != '',
		'Structure - current division');
	ok(links.children(':last').is('div.ui-datepicker-next') &&
		links.children(':last').html() != '',
		'Structure - next division');
	var month = dp.children(':eq(2)');
	ok(month.is('div.ui-datepicker-one-month') && month.is('div.ui-datepicker-new-row'),
		'Structure - month division');
	var header = month.children(':first');
	ok(header.is('div.ui-datepicker-header'), 'Structure - month header division');
	equals(header.children().length, 2, 'Structure - month header child count');
	ok(header.children(':first').is('select.ui-datepicker-new-month'),
		'Structure - new month select');
	ok(header.children(':last').is('select.ui-datepicker-new-year'),
		'Structure - new year select');
	var table = month.children(':eq(1)');
	ok(table.is('table.ui-datepicker'), 'Structure - month table');
	ok(table.children(':first').is('thead'), 'Structure - month table thead');
	var titles = table.children(':first').children(':first');
	ok(titles.is('tr.ui-datepicker-title-row'), 'Structure - month table title row');
	equals(titles.find('a').length, 7, 'Structure - month table title links');
	ok(table.children(':eq(1)').is('tbody'), 'Structure - month table body');
	ok(table.children(':eq(1)').children('tr').length >= 4,
		'Structure - month table week count');
	var week = table.children(':eq(1)').children(':first');
	ok(week.is('tr.ui-datepicker-days-row'), 'Structure - month table week row');
	equals(week.children().length, 7, 'Structure - week child count');
	ok(week.children(':first').is('td.ui-datepicker-days-cell') &&
		week.children(':first').is('.ui-datepicker-week-end-cell') &&
		!week.children(':first').is('.ui-datepicker-week-col'),
		'Structure - month table first day cell');
	ok(week.children(':eq(1)').is('td.ui-datepicker-days-cell') &&
		!week.children(':eq(1)').is('.ui-datepicker-week-end-cell'),
		'Structure - month table second day cell');
	ok(dp.children('.ui-datepicker-status').length == 0, 'Structure - status');
	ok(dp.children('iframe').length == (iframe ? 1 : 0), 'Structure - iframe');
	inp.datepicker('hide').datepicker('destroy');
	// Multi-month 2
	inp = init('#inp', {numberOfMonths: 2});
	inp.focus();
	ok(dp.is('.ui-datepicker-multi'), 'Structure multi - multi-month');
	equals(dp.children().length, 5 + (iframe ? 1 : 0), 'Structure multi - child count');
	month = dp.children(':eq(2)');
	ok(month.is('div.ui-datepicker-one-month') && month.is('div.ui-datepicker-new-row'),
		'Structure multi - first month division');
	month = dp.children(':eq(3)');
	ok(month.is('div.ui-datepicker-one-month') && !month.is('div.ui-datepicker-new-row'),
		'Structure multi - second month division');
	inp.datepicker('hide').datepicker('destroy');
	// Multi-month [2, 2]
	inp = init('#inp', {numberOfMonths: [2, 2]});
	inp.focus();
	ok(dp.is('.ui-datepicker-multi'), 'Structure multi - multi-month');
	equals(dp.children().length, 7 + (iframe ? 1 : 0), 'Structure multi - child count');
	month = dp.children(':eq(2)');
	ok(month.is('div.ui-datepicker-one-month') && month.is('div.ui-datepicker-new-row'),
		'Structure multi - first month division');
	month = dp.children(':eq(3)');
	ok(month.is('div.ui-datepicker-one-month') && !month.is('div.ui-datepicker-new-row'),
		'Structure multi - second month division');
	month = dp.children(':eq(4)');
	ok(month.is('div.ui-datepicker-one-month') && month.is('div.ui-datepicker-new-row'),
		'Structure multi - third month division');
	month = dp.children(':eq(5)');
	ok(month.is('div.ui-datepicker-one-month') && !month.is('div.ui-datepicker-new-row'),
		'Structure multi - fourth month division');
	inp.datepicker('hide').datepicker('destroy');
	// Inline
	var inl = init('#inl');
	dp = inl.children();
	ok(dp.is('.ui-datepicker-inline'), 'Structure inline - main div');
	ok(!dp.is('.ui-datepicker-rtl'), 'Structure inline - not right-to-left');
	ok(!dp.is('.ui-datepicker-multi'), 'Structure inline - not multi-month');
	equals(dp.children().length, 3, 'Structure inline - child count');
	var links = dp.children(':first');
	ok(links.is('div.ui-datepicker-links'), 'Structure inline - links division');
	equals(links.children().length, 3, 'Structure inline - links child count');
	var month = dp.children(':eq(1)');
	ok(month.is('div.ui-datepicker-one-month') && month.is('div.ui-datepicker-new-row'),
		'Structure inline - month division');
	var header = month.children(':first');
	ok(header.is('div.ui-datepicker-header'), 'Structure inline - month header division');
	equals(header.children().length, 2, 'Structure inline - month header child count');
	var table = month.children(':eq(1)');
	ok(table.is('table.ui-datepicker'), 'Structure inline - month table');
	ok(table.children(':first').is('thead'), 'Structure inline - month table thead');
	ok(table.children(':eq(1)').is('tbody'), 'Structure inline - month table body');
	ok(dp.children('.ui-datepicker-status').length == 0, 'Structure inline - status');
	inl.datepicker('destroy');
	// Inline multi-month
	inl = init('#inl', {numberOfMonths: 2});
	dp = inl.children();
	ok(dp.is('.ui-datepicker-inline'), 'Structure inline multi - main div');
	ok(dp.is('.ui-datepicker-multi'), 'Structure inline multi - not multi-month');
	equals(dp.children().length, 4, 'Structure inline multi - child count');
	var links = dp.children(':first');
	ok(links.is('div.ui-datepicker-links'), 'Structure inline multi - links division');
	equals(links.children().length, 3, 'Structure inline multi - links child count');
	var month = dp.children(':eq(1)');
	ok(month.is('div.ui-datepicker-one-month') && month.is('div.ui-datepicker-new-row'),
		'Structure inline multi - first month division');
	month = dp.children(':eq(2)');
	ok(month.is('div.ui-datepicker-one-month') && !month.is('div.ui-datepicker-new-row'),
		'Structure inline multi - second month division');
	inl.datepicker('destroy');
});

test('customStructure', function() {
	var dp = $('#ui-datepicker-div');
	// Check right-to-left localisation
	var inp = init('#inp', $.datepicker.regional['he']);
	inp.focus();
	var iframe = ($.browser.msie && parseInt($.browser.version) < 7);
	ok(dp.is('.ui-datepicker-rtl'), 'Structure RTL - right-to-left');
	var links = dp.children(':eq(1)');
	ok(links.is('div.ui-datepicker-links'), 'Structure - links division');
	equals(links.children().length, 3, 'Structure - links child count');
	ok(links.children(':first').is('div.ui-datepicker-next'),
		'Structure - next division');
	ok(links.children(':eq(1)').is('div.ui-datepicker-current'),
		'Structure - current division');
	ok(links.children(':last').is('div.ui-datepicker-prev'),
		'Structure - prev division');
	inp.datepicker('hide').datepicker('destroy');
	// Close at bottom
	inp = init('#inp', {closeAtTop: false});
	inp.focus();
	equals(dp.children().length, 4 + (iframe ? 1 : 0),
		'Structure close at bottom - child count');
	ok(dp.children(':first').is('div.ui-datepicker-links'),
		'Structure close at bottom - links division');
	ok(dp.children(':last').prev().is('div.ui-datepicker-control'),
		'Structure close at bottom - control division');
	inp.datepicker('hide').datepicker('destroy');
	// Mandatory
	inp = init('#inp', {mandatory: true});
	inp.focus();
	var control = dp.children(':first');
	ok(control.is('div.ui-datepicker-control'),
		'Structure mandatory - control division');
	equals(control.children().length, 1, 'Structure mandatory - control child count');
	ok(control.children(':first').is('div.ui-datepicker-close'),
		'Structure mandatory - close division');
	inp.datepicker('hide').datepicker('destroy');
	// Hide prev/next
	inp = init('#inp', {hideIfNoPrevNext: true,
		minDate: new Date(2008, 2 - 1, 4), maxDate: new Date(2008, 2 - 1, 14)});
	inp.val('02/10/2008').focus();
	var links = dp.children(':eq(1)');
	ok(links.is('div.ui-datepicker-links'),
		'Structure hide prev/next - links division');
	equals(links.children().length, 2, 'Structure hide prev/next - links child count');
	ok(links.children(':first').is('div.ui-datepicker-prev') &&
		links.children(':first').html() == '',
		'Structure hide prev/next - prev division');
	ok(links.children(':last').is('div.ui-datepicker-next') &&
		links.children(':last').html() == '',
		'Structure hide prev/next - next division');
	inp.datepicker('hide').datepicker('destroy');
	// Can't change month
	inp = init('#inp', {changeMonth: false});
	inp.focus();
	var header = dp.children(':eq(2)').children(':first');
	equals(header.children().length, 1, 'Structure change month - header child count');
	ok(header.children(':last').is('select.ui-datepicker-new-year'),
		'Structure change month - new year select');
	inp.datepicker('hide').datepicker('destroy');
	// Can't change year
	inp = init('#inp', {changeYear: false});
	inp.focus();
	var header = dp.children(':eq(2)').children(':first');
	equals(header.children().length, 1, 'Structure change year - header child count');
	ok(header.children(':first').is('select.ui-datepicker-new-month'),
		'Structure change year - new month select');
	inp.datepicker('hide').datepicker('destroy');
	// Can't change first day of week
	inp = init('#inp', {changeFirstDay: false});
	inp.focus();
	var titles = dp.find('.ui-datepicker-title-row');
	equals(titles.children().length, 7, 'Structure change first day - titles child count');
	equals(titles.find('a').length, 0, 'Structure change first day - titles links count');
	inp.datepicker('hide').datepicker('destroy');
	// Show weeks
	inp = init('#inp', {showWeeks: true});
	inp.focus();
	titles = dp.find('.ui-datepicker-title-row');
	equals(titles.children().length, 8, 'Structure show weeks - titles child count');
	var week = dp.find('.ui-datepicker-days-row:first');
	equals(week.children().length, 8, 'Structure show weeks - week child count');
	ok(week.children(':first').is('td.ui-datepicker-week-col'),
		'Structure show weeks - week column');
	inp.datepicker('hide').datepicker('destroy');
	// Show status
	inp = init('#inp', {showStatus: true});
	inp.focus();
	equals(dp.children().length, 6 + (iframe ? 1 : 0),
		'Structure show status - datepicker child count');
	ok(dp.children(':last').prev().is('div.ui-datepicker-status'),
		'Structure show status - status division');
	inp.datepicker('hide').datepicker('destroy');
	// Inline
	var inl = init('#inl', {showStatus: true, hideIfNoPrevNext: true,
		minDate: new Date(2008, 2 - 1, 4), maxDate: new Date(2008, 2 - 1, 14)});
	dp = inl.children();
	ok(dp.is('.ui-datepicker-inline'), 'Structure inline - main div');
	ok(!dp.is('.ui-datepicker-rtl'), 'Structure inline - not right-to-left');
	ok(!dp.is('.ui-datepicker-multi'), 'Structure inline - not multi-month');
	equals(dp.children().length, 5, 'Structure inline - child count');
	var links = dp.children(':first');
	ok(links.is('div.ui-datepicker-links'), 'Structure inline - links division');
	equals(links.children().children().length, 0, 'Structure inline - links child count');
	var month = dp.children(':eq(1)');
	ok(month.is('div.ui-datepicker-one-month') && month.is('div.ui-datepicker-new-row'),
		'Structure inline - month division');
	ok(dp.children(':last').prev().is('div.ui-datepicker-status'),
		'Structure inline - status');
	inl.datepicker('destroy');
});

test('enableDisable', function() {
	var inp = init('#inp');
	ok(!inp.datepicker('isDisabled'), 'Enable/disable - initially marked as enabled');
	ok(!inp[0].disabled, 'Enable/disable - field initially enabled');
	inp.datepicker('disable');
	ok(inp.datepicker('isDisabled'), 'Enable/disable - now marked as disabled');
	ok(inp[0].disabled, 'Enable/disable - field now disabled');
	inp.datepicker('enable');
	ok(!inp.datepicker('isDisabled'), 'Enable/disable - now marked as enabled');
	ok(!inp[0].disabled, 'Enable/disable - field now enabled');
	inp.datepicker('destroy');
	// With a button
	inp = init('#inp', {showOn: 'button'});
	ok(!inp.datepicker('isDisabled'), 'Enable/disable button - initially marked as enabled');
	ok(!inp[0].disabled, 'Enable/disable button - field initially enabled');
	ok(!inp.next('button')[0].disabled, 'Enable/disable button - button initially enabled');
	inp.datepicker('disable');
	ok(inp.datepicker('isDisabled'), 'Enable/disable button - now marked as disabled');
	ok(inp[0].disabled, 'Enable/disable button - field now disabled');
	ok(inp.next('button')[0].disabled, 'Enable/disable button - button now disabled');
	inp.datepicker('enable');
	ok(!inp.datepicker('isDisabled'), 'Enable/disable button - now marked as enabled');
	ok(!inp[0].disabled, 'Enable/disable button - field now enabled');
	ok(!inp.next('button')[0].disabled, 'Enable/disable button - button now enabled');
	inp.datepicker('destroy');
	// With an image button
	inp = init('#inp', {showOn: 'button', buttonImageOnly: true,
		buttonImage: 'img/calendar.gif'});
	ok(!inp.datepicker('isDisabled'), 'Enable/disable image - initially marked as enabled');
	ok(!inp[0].disabled, 'Enable/disable image - field initially enabled');
	ok(inp.next('img').css('opacity') == 1, 'Enable/disable image - image initially enabled');
	inp.datepicker('disable');
	ok(inp.datepicker('isDisabled'), 'Enable/disable image - now marked as disabled');
	ok(inp[0].disabled, 'Enable/disable image - field now disabled');
	ok(inp.next('img').css('opacity') != 1, 'Enable/disable image - image now disabled');
	inp.datepicker('enable');
	ok(!inp.datepicker('isDisabled'), 'Enable/disable image - now marked as enabled');
	ok(!inp[0].disabled, 'Enable/disable image - field now enabled');
	ok(inp.next('img').css('opacity') == 1, 'Enable/disable image - image now enabled');
	inp.datepicker('destroy');
	// Inline
	var inl = init('#inl');
	ok(!inl.datepicker('isDisabled'), 'Enable/disable inline - initially marked as enabled');
	ok($('.ui-datepicker-disabled', inl).length == 0, 'Enable/disable inline - cover initially absent');
	inl.datepicker('disable');
	ok(inl.datepicker('isDisabled'), 'Enable/disable inline - now marked as disabled');
	var disabled = $('.ui-datepicker-disabled', inl);
	var dp = $('.ui-datepicker-inline', inl);
	ok(disabled.length == 1, 'Enable/disable inline - cover now present');
	ok(disabled.offset().top == dp.offset().top && disabled.offset().left == dp.offset().left,
		'Enable/disable inline - cover positioning');
	ok(disabled.width() == dp.width() && disabled.height() == dp.height(),
		'Enable/disable inline - cover sizing');
	inl.datepicker('enable');
	ok(!inl.datepicker('isDisabled'), 'Enable/disable inline - now marked as enabled');
	ok($('.ui-datepicker-disabled', inl).length == 0, 'Enable/disable inline - cover now absent');
	inl.datepicker('destroy');
});

test('keystrokes', function() {
	var inp = init('#inp');
	var date = new Date();
	inp.val('').datepicker('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(inp.datepicker('getDate'), date, 'Keystroke enter');
	inp.val('02/04/2008').datepicker('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(inp.datepicker('getDate'), new Date(2008, 2 - 1, 4),
		'Keystroke enter - preset');
	inp.val('02/04/2008').datepicker('show').
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_HOME}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(inp.datepicker('getDate'), date, 'Keystroke ctrl+home');
	inp.val('02/04/2008').datepicker('show').
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_END});
	ok(inp.datepicker('getDate') == null, 'Keystroke ctrl+end');
	inp.val('').datepicker('show').
		simulate('keydown', {keyCode: $.simulate.VK_ESC});
	ok(inp.datepicker('getDate') == null, 'Keystroke esc');
	inp.val('02/04/2008').datepicker('show').
		simulate('keydown', {keyCode: $.simulate.VK_ESC});
	equalsDate(inp.datepicker('getDate'), new Date(2008, 2 - 1, 4),
		'Keystroke esc - preset');
	inp.val('02/04/2008').datepicker('show').
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGUP}).
		simulate('keydown', {keyCode: $.simulate.VK_ESC});
	equalsDate(inp.datepicker('getDate'), new Date(2008, 2 - 1, 4),
		'Keystroke esc - abandoned');
	// Moving by day or week
	inp.val('').datepicker('show').
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_LEFT}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date.setDate(date.getDate() - 1);
	equalsDate(inp.datepicker('getDate'), date, 'Keystroke ctrl+left');
	inp.val('').datepicker('show').
		simulate('keydown', {keyCode: $.simulate.VK_LEFT}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date.setDate(date.getDate() + 1);
	equalsDate(inp.datepicker('getDate'), date, 'Keystroke left');
	inp.val('').datepicker('show').
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_RIGHT}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date.setDate(date.getDate() + 1);
	equalsDate(inp.datepicker('getDate'), date, 'Keystroke ctrl+right');
	inp.val('').datepicker('show').
		simulate('keydown', {keyCode: $.simulate.VK_RIGHT}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date.setDate(date.getDate() - 1);
	equalsDate(inp.datepicker('getDate'), date, 'Keystroke right');
	inp.val('').datepicker('show').
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_UP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date.setDate(date.getDate() - 7);
	equalsDate(inp.datepicker('getDate'), date, 'Keystroke ctrl+up');
	inp.val('').datepicker('show').
		simulate('keydown', {keyCode: $.simulate.VK_UP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date.setDate(date.getDate() + 7);
	equalsDate(inp.datepicker('getDate'), date, 'Keystroke up');
	inp.val('').datepicker('show').
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date.setDate(date.getDate() + 7);
	equalsDate(inp.datepicker('getDate'), date, 'Keystroke ctrl+down');
	inp.val('').datepicker('show').
		simulate('keydown', {keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date.setDate(date.getDate() - 7);
	equalsDate(inp.datepicker('getDate'), date, 'Keystroke down');
	// Moving by month or year
	inp.val('02/04/2008').datepicker('show').
		simulate('keydown', {keyCode: $.simulate.VK_PGUP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(inp.datepicker('getDate'), new Date(2008, 1 - 1, 4),
		'Keystroke pgup');
	inp.val('02/04/2008').datepicker('show').
		simulate('keydown', {keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(inp.datepicker('getDate'), new Date(2008, 3 - 1, 4),
		'Keystroke pgdn');
	inp.val('02/04/2008').datepicker('show').
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGUP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(inp.datepicker('getDate'), new Date(2007, 2 - 1, 4),
		'Keystroke ctrl+pgup');
	inp.val('02/04/2008').datepicker('show').
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(inp.datepicker('getDate'), new Date(2009, 2 - 1, 4),
		'Keystroke ctrl+pgdn');
	// Check for moving to short months
	inp.val('03/31/2008').datepicker('show').
		simulate('keydown', {keyCode: $.simulate.VK_PGUP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(inp.datepicker('getDate'), new Date(2008, 2 - 1, 29),
		'Keystroke pgup - Feb');
	inp.val('01/30/2008').datepicker('show').
		simulate('keydown', {keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(inp.datepicker('getDate'), new Date(2008, 2 - 1, 29), 
		'Keystroke pgdn - Feb');
	inp.val('02/29/2008').datepicker('show').
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGUP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(inp.datepicker('getDate'), new Date(2007, 2 - 1, 28),
		'Keystroke ctrl+pgup - Feb');
	inp.val('02/29/2008').datepicker('show').
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(inp.datepicker('getDate'), new Date(2009, 2 - 1, 28),
		'Keystroke ctrl+pgdn - Feb');
	// Goto current
	inp.datepicker('option', {gotoCurrent: true}).
		datepicker('hide').val('02/04/2008').datepicker('show').
		simulate('keydown', {keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_HOME}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(inp.datepicker('getDate'), new Date(2008, 2 - 1, 4),
		'Keystroke ctrl+home');
	// Change steps
	inp.datepicker('option', {stepMonths: 2, stepBigMonths: 6, gotoCurrent: false}).
		datepicker('hide').val('02/04/2008').datepicker('show').
		simulate('keydown', {keyCode: $.simulate.VK_PGUP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(inp.datepicker('getDate'), new Date(2007, 12 - 1, 4),
		'Keystroke pgup step 2');
	inp.val('02/04/2008').datepicker('show').
		simulate('keydown', {keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(inp.datepicker('getDate'), new Date(2008, 4 - 1, 4),
		'Keystroke pgdn step 2');
	inp.val('02/04/2008').datepicker('show').
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGUP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(inp.datepicker('getDate'), new Date(2007, 8 - 1, 4),
		'Keystroke ctrl+pgup step 6');
	inp.val('02/04/2008').datepicker('show').
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(inp.datepicker('getDate'), new Date(2008, 8 - 1, 4),
		'Keystroke ctrl+pgdn step 6');
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
	equalsDate(inp.datepicker('getDate'), new Date(2008, 2 - 1, 12),
		'Mouse click - preset');
	inp.val('02/04/2008').datepicker('show');
	$('.ui-datepicker-clear a', dp).simulate('click', {});
	ok(inp.datepicker('getDate') == null, 'Mouse click - clear');
	inp.val('').datepicker('show');
	$('.ui-datepicker-close a', dp).simulate('click', {});
	ok(inp.datepicker('getDate') == null, 'Mouse click - close');
	inp.val('02/04/2008').datepicker('show');
	$('.ui-datepicker-close a', dp).simulate('click', {});
	equalsDate(inp.datepicker('getDate'), new Date(2008, 2 - 1, 4),
		'Mouse click - close + preset');
	inp.val('02/04/2008').datepicker('show');
	$('.ui-datepicker-prev a', dp).simulate('click', {});
	$('.ui-datepicker-close a', dp).simulate('click', {});
	equalsDate(inp.datepicker('getDate'), new Date(2008, 2 - 1, 4),
		'Mouse click - abandoned');
	// Current/previous/next
	inp.val('02/04/2008').datepicker('show');
	$('.ui-datepicker-current a', dp).simulate('click', {});
	$('.ui-datepicker tbody a:contains(14)', dp).simulate('click', {});
	date.setDate(14);
	equalsDate(inp.datepicker('getDate'), date, 'Mouse click - current');
	inp.val('02/04/2008').datepicker('show');
	$('.ui-datepicker-prev a', dp).simulate('click', {});
	$('.ui-datepicker tbody a:contains(16)', dp).simulate('click', {});
	equalsDate(inp.datepicker('getDate'), new Date(2008, 1 - 1, 16),
		'Mouse click - previous');
	inp.val('02/04/2008').datepicker('show');
	$('.ui-datepicker-next a', dp).simulate('click', {});
	$('.ui-datepicker tbody a:contains(18)', dp).simulate('click', {});
	equalsDate(inp.datepicker('getDate'), new Date(2008, 3 - 1, 18),
		'Mouse click - next');
	// Previous/next with minimum/maximum
	inp.datepicker('option', {minDate: new Date(2008, 2 - 1, 2),
		maxDate: new Date(2008, 2 - 1, 26)}).val('02/04/2008').datepicker('show');
	$('.ui-datepicker-prev a', dp).simulate('click', {});
	$('.ui-datepicker tbody a:contains(16)', dp).simulate('click', {});
	equalsDate(inp.datepicker('getDate'), new Date(2008, 2 - 1, 16),
		'Mouse click - previous + min/max');
	inp.val('02/04/2008').datepicker('show');
	$('.ui-datepicker-next a', dp).simulate('click', {});
	$('.ui-datepicker tbody a:contains(18)', dp).simulate('click', {});
	equalsDate(inp.datepicker('getDate'), new Date(2008, 2 - 1, 18),
		'Mouse click - next + min/max');
	// Change day of week
	inp.val('02/04/2008').datepicker('show');
	equals($('.ui-datepicker-title-row td:first', dp).text(), 'Su',
		'Mouse click - initial day of week');
	$('.ui-datepicker-title-row td:last a', dp).simulate('click', {});
	equals($('.ui-datepicker-title-row td:first', dp).text(), 'Sa',
		'Mouse click - day of week');
	// Highlight week
	inp.datepicker('option', {highlightWeek: true}).
		datepicker('hide').val('02/04/2008').datepicker('show');
	ok(!$('.ui-datepicker tr:eq(2)', dp).is('.ui-datepicker-week-over'),
		'Mouse over - no week highlight');
	$('.ui-datepicker tr:eq(2) td:first', dp).simulate('mouseover', {});
	ok($('.ui-datepicker tr:eq(2)', dp).is('.ui-datepicker-week-over'),
		'Mouse over - week highlight');
	// Inline
	var inl = init('#inl');
	var dp = $('.ui-datepicker-inline', inl);
	var date = new Date();
	inl.datepicker('setDate', date);
	$('.ui-datepicker tbody a:contains(10)', dp).simulate('click', {});
	date.setDate(10);
	equalsDate(inl.datepicker('getDate'), date, 'Mouse click inline');
	inl.datepicker('setDate', new Date(2008, 2 - 1, 4));
	$('.ui-datepicker tbody a:contains(12)', dp).simulate('click', {});
	equalsDate(inl.datepicker('getDate'), new Date(2008, 2 - 1, 12),
		'Mouse click inline - preset');
	$('.ui-datepicker-current a', dp).simulate('click', {});
	$('.ui-datepicker tbody a:contains(14)', dp).simulate('click', {});
	date.setDate(14);
	equalsDate(inl.datepicker('getDate'), date, 'Mouse click inline - current');
	inl.datepicker('setDate', new Date(2008, 2 - 1, 4));
	$('.ui-datepicker-prev a', dp).simulate('click', {});
	$('.ui-datepicker tbody a:contains(16)', dp).simulate('click', {});
	equalsDate(inl.datepicker('getDate'), new Date(2008, 1 - 1, 16),
		'Mouse click inline - previous');
	inl.datepicker('setDate', new Date(2008, 2 - 1, 4));
	$('.ui-datepicker-next a', dp).simulate('click', {});
	$('.ui-datepicker tbody a:contains(18)', dp).simulate('click', {});
	equalsDate(inl.datepicker('getDate'), new Date(2008, 3 - 1, 18),
		'Mouse click inline - next');
});

test('defaultDate', function() {
	var inp = init('#inp');
	var date = new Date();
	inp.val('').datepicker('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(inp.datepicker('getDate'), date, 'Default date null');
	// numeric values
	inp.datepicker('option', {defaultDate: -2}).
		datepicker('hide').val('').datepicker('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date.setDate(date.getDate() - 2);
	equalsDate(inp.datepicker('getDate'), date, 'Default date -2');
	inp.datepicker('option', {defaultDate: 3}).
		datepicker('hide').val('').datepicker('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date.setDate(date.getDate() + 5);
	equalsDate(inp.datepicker('getDate'), date, 'Default date 3');
	inp.datepicker('option', {defaultDate: 1 / 0}).
		datepicker('hide').val('').datepicker('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date.setDate(date.getDate() - 3);
	equalsDate(inp.datepicker('getDate'), date, 'Default date Infinity');
	inp.datepicker('option', {defaultDate: 1 / 'a'}).
		datepicker('hide').val('').datepicker('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(inp.datepicker('getDate'), date, 'Default date NaN');
	// string values
	inp.datepicker('option', {defaultDate: '-1d'}).
		datepicker('hide').val('').datepicker('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date.setDate(date.getDate() - 1);
	equalsDate(inp.datepicker('getDate'), date, 'Default date -1d');
	inp.datepicker('option', {defaultDate: '+3D'}).
		datepicker('hide').val('').datepicker('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date.setDate(date.getDate() + 4);
	equalsDate(inp.datepicker('getDate'), date, 'Default date +3D');
	inp.datepicker('option', {defaultDate: ' -2 w '}).
		datepicker('hide').val('').datepicker('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date = new Date();
	date.setDate(date.getDate() - 14);
	equalsDate(inp.datepicker('getDate'), date, 'Default date -2 w');
	inp.datepicker('option', {defaultDate: '+1 W'}).
		datepicker('hide').val('').datepicker('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date.setDate(date.getDate() + 21);
	equalsDate(inp.datepicker('getDate'), date, 'Default date +1 W');
	inp.datepicker('option', {defaultDate: ' -1 m '}).
		datepicker('hide').val('').datepicker('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date = new Date();
	date.setMonth(date.getMonth() - 1);
	equalsDate(inp.datepicker('getDate'), date, 'Default date -1 m');
	inp.datepicker('option', {defaultDate: '+2M'}).
		datepicker('hide').val('').datepicker('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date.setMonth(date.getMonth() + 3);
	equalsDate(inp.datepicker('getDate'), date, 'Default date +2M');
	inp.datepicker('option', {defaultDate: '-2y'}).
		datepicker('hide').val('').datepicker('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date = new Date();
	date.setFullYear(date.getFullYear() - 2);
	equalsDate(inp.datepicker('getDate'), date, 'Default date -2y');
	inp.datepicker('option', {defaultDate: '+1 Y '}).
		datepicker('hide').val('').datepicker('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date.setFullYear(date.getFullYear() + 3);
	equalsDate(inp.datepicker('getDate'), date, 'Default date +1 Y');
	inp.datepicker('option', {defaultDate: '+1M +10d'}).
		datepicker('hide').val('').datepicker('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date = new Date();
	date.setMonth(date.getMonth() + 1);
	date.setDate(date.getDate() + 10);
	equalsDate(inp.datepicker('getDate'), date, 'Default date +1M +10d');
	date = new Date(2007, 1 - 1, 26);
	inp.datepicker('option', {defaultDate: date}).
		datepicker('hide').val('').datepicker('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(inp.datepicker('getDate'), date, 'Default date 01/26/2007');
});

test('miscellaneous', function() {
	var dp = $('#ui-datepicker-div');
	var inp = init('#inp');
	// Year range
	inp.val('02/04/2008').datepicker('show');
	equals(dp.find('.ui-datepicker-new-year').text(),
		'199819992000200120022003200420052006200720082009201020112012201320142015201620172018',
		'Year range - default');
	inp.datepicker('hide').datepicker('option', {yearRange: '-6:+2'}).datepicker('show');
	equals(dp.find('.ui-datepicker-new-year').text(),
		'200220032004200520062007200820092010', 'Year range - -6:+2');
	inp.datepicker('hide').datepicker('option', {yearRange: '2000:2010'}).datepicker('show');
	equals(dp.find('.ui-datepicker-new-year').text(),
		'20002001200220032004200520062007200820092010', 'Year range - 2000:2010');
	// Navigation as date format
	equals(dp.find('.ui-datepicker-prev').text(),
		'<Prev', 'Navigation prev - default');
	equals(dp.find('.ui-datepicker-current').text(),
		'Today', 'Navigation current - default');
	equals(dp.find('.ui-datepicker-next').text(),
		'Next>', 'Navigation next - default');
	inp.datepicker('hide').datepicker('option', {navigationAsDateFormat: true,
		prevText: '< M', currentText: 'MM', nextText: 'M >'}).
		val('02/04/2008').datepicker('show');
	var longNames = $.datepicker.regional[''].monthNames;
	var shortNames = $.datepicker.regional[''].monthNamesShort;
	var date = new Date();
	equals(dp.find('.ui-datepicker-prev').text(),
		'< ' + shortNames[0], 'Navigation prev - as date format');
	equals(dp.find('.ui-datepicker-current').text(),
		longNames[date.getMonth()], 'Navigation current - as date format');
	equals(dp.find('.ui-datepicker-next').text(),
		shortNames[2] + ' >', 'Navigation next - as date format');
	inp.simulate('keydown', {keyCode: $.simulate.VK_PGDN});
	equals(dp.find('.ui-datepicker-prev').text(),
		'< ' + shortNames[1], 'Navigation prev - as date format + pgdn');
	equals(dp.find('.ui-datepicker-current').text(),
		longNames[date.getMonth()], 'Navigation current - as date format + pgdn');
	equals(dp.find('.ui-datepicker-next').text(),
		shortNames[3] + ' >', 'Navigation next - as date format + pgdn');
	inp.datepicker('hide').datepicker('option', {gotoCurrent: true}).
		val('02/04/2008').datepicker('show');
	equals(dp.find('.ui-datepicker-prev').text(),
		'< ' + shortNames[0], 'Navigation prev - as date format + goto current');
	equals(dp.find('.ui-datepicker-current').text(),
		longNames[1], 'Navigation current - as date format + goto current');
	equals(dp.find('.ui-datepicker-next').text(),
		shortNames[2] + ' >', 'Navigation next - as date format + goto current');
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
	equalsDate(inp.datepicker('getDate'), lastYear,
		'Min/max - null, null - ctrl+pgup');
	inp.val('06/04/2008').datepicker('show');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(inp.datepicker('getDate'), nextYear,
		'Min/max - null, null - ctrl+pgdn');
	inp.datepicker('option', {minDate: minDate}).
		datepicker('hide').val('06/04/2008').datepicker('show');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGUP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(inp.datepicker('getDate'), minDate,
		'Min/max - 02/29/2008, null - ctrl+pgup');
	inp.val('06/04/2008').datepicker('show');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(inp.datepicker('getDate'), nextYear,
		'Min/max - 02/29/2008, null - ctrl+pgdn');
	inp.datepicker('option', {maxDate: maxDate}).
		datepicker('hide').val('06/04/2008').datepicker('show');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGUP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(inp.datepicker('getDate'), minDate,
		'Min/max - 02/29/2008, 12/07/2008 - ctrl+pgup');
	inp.val('06/04/2008').datepicker('show');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(inp.datepicker('getDate'), maxDate,
		'Min/max - 02/29/2008, 12/07/2008 - ctrl+pgdn');
	inp.datepicker('option', {minDate: null}).
		datepicker('hide').val('06/04/2008').datepicker('show');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGUP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(inp.datepicker('getDate'), lastYear,
		'Min/max - null, 12/07/2008 - ctrl+pgup');
	inp.val('06/04/2008').datepicker('show');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(inp.datepicker('getDate'), maxDate,
		'Min/max - null, 12/07/2008 - ctrl+pgdn');
	// Relative dates
	var date = new Date();
	date.setDate(date.getDate() - 7);
	inp.datepicker('option', {minDate: '-1w', maxDate: '+1 M +10 D '}).
		datepicker('hide').val('').datepicker('show');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGUP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(inp.datepicker('getDate'), date,
		'Min/max - -1w, +1 M +10 D - ctrl+pgup');
	date = new Date();
	date.setMonth(date.getMonth() + 1);
	date.setDate(date.getDate() + 10);
	inp.val('').datepicker('show');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDate(inp.datepicker('getDate'), date,
		'Min/max - -1w, +1 M +10 D - ctrl+pgdn');
});

test('setDate', function() {
	var inp = init('#inp');
	var date1 = new Date(2008, 6 - 1, 4);
	var date2 = new Date();
	ok(inp.datepicker('getDate') == null, 'Set date - default');
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
	inp.datepicker('option', {rangeSelect: true});
	inp.datepicker('setDate', date1, date2);
	equalsDateArray(inp.datepicker('getDate'), [date1, date2],
		'Set date range - 2008-06-04 - 2009-07-05');
	inp.datepicker('setDate', date1);
	equalsDateArray(inp.datepicker('getDate'), [date1, date1],
		'Set date range - 2008-06-04');
	date1 = new Date();
	date1.setDate(date1.getDate() - 10);
	date2 = new Date();
	date2.setDate(date2.getDate() + 10);
	inp.datepicker('setDate', -10, +10);
	equalsDateArray(inp.datepicker('getDate'), [date1, date2],
		'Set date range - -10 - +10');
	inp.datepicker('setDate', -10);
	equalsDateArray(inp.datepicker('getDate'), [date1, date1],
		'Set date range - -10');
	date1 = new Date();
	date1.setDate(date1.getDate() - 14);
	date2 = new Date();
	date2.setFullYear(date2.getFullYear() + 1);
	inp.datepicker('setDate', '-2w', '+1Y');
	equalsDateArray(inp.datepicker('getDate'), [date1, date2],
		'Set date range - -2w - +1Y');
	inp.datepicker('setDate', '-2w');
	equalsDateArray(inp.datepicker('getDate'), [date1, date1],
		'Set date range - -2w');
	inp.datepicker('setDate');
	isObj(inp.datepicker('getDate'), [null, null], 'Set date range - null');
	// Inline
	var inl = init('#inl');
	date1 = new Date(2008, 6 - 1, 4);
	date2 = new Date();
	equalsDate(inl.datepicker('getDate'), date2, 'Set date inline - default');
	inl.datepicker('setDate', date1);
	equalsDate(inl.datepicker('getDate'), date1, 'Set date inline - 2008-06-04');
	date1 = new Date();
	date1.setDate(date1.getDate() + 7);
	inl.datepicker('setDate', +7);
	equalsDate(inl.datepicker('getDate'), date1, 'Set date inline - +7');
	date2.setFullYear(date2.getFullYear() + 2);
	inl.datepicker('setDate', '+2y');
	equalsDate(inl.datepicker('getDate'), date2, 'Set date inline - +2y');
	inl.datepicker('setDate', date1, date2);
	equalsDate(inl.datepicker('getDate'), date1, 'Set date inline - two dates');
	inl.datepicker('setDate');
	ok(inl.datepicker('getDate') == null, 'Set date inline - null');
	// Alternate field
	var alt = $('#alt');
	inp.datepicker('option', {altField: '#alt', altFormat: 'yy-mm-dd'});
	date1 = new Date(2008, 6 - 1, 4);
	date2 = new Date(2009, 7 - 1, 5);
	inp.datepicker('setDate', date1, date2);
	equals(inp.val(), '06/04/2008 - 07/05/2009',
		'Set date alternate - 06/04/2008 - 07/05/2009');
	equals(alt.val(), '2008-06-04 - 2009-07-05',
		'Set date alternate - 2008-06-04 - 2009-07-05');
	inp.datepicker('option', {rangeSelect: false}).datepicker('setDate', date1);
	equals(inp.val(), '06/04/2008', 'Set date alternate - 06/04/2008');
	equals(alt.val(), '2008-06-04', 'Set date alternate - 2008-06-04');
});

test('ranges', function() {
	var inp = init('#inp', {rangeSelect: true});
	var date1 = new Date();
	var date2 = new Date();
	// Select today - today
	inp.val('').datepicker('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDateArray(inp.datepicker('getDate'), [date1, date1],
		'Range - enter/enter');
	// Can't select prior to start date
	inp.val('').datepicker('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_UP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDateArray(inp.datepicker('getDate'), [date1, date1],
		'Range - enter/ctrl+up/enter');
	// Can select after start date
	inp.val('').datepicker('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date2.setDate(date2.getDate() + 7);
	equalsDateArray(inp.datepicker('getDate'), [date1, date2],
		'Range - enter/ctrl+down/enter');
	equals(inp.val(), $.datepicker.formatDate('mm/dd/yy', date1) + ' - ' +
		$.datepicker.formatDate('mm/dd/yy', date2), 'Range - value');
	// Select then cancel defaults to first date
	inp.val('').datepicker('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {keyCode: $.simulate.VK_ESC});
	equalsDateArray(inp.datepicker('getDate'), [date1, date1],
		'Range - enter/ctrl+down/esc');
	// Separator
	inp.datepicker('option', {rangeSeparator: ' to '}).
		datepicker('hide').val('06/04/2008').datepicker('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDateArray(inp.datepicker('getDate'),
		[new Date(2008, 6 - 1, 4), new Date(2008, 6 - 1, 11)],
		'Range separator - enter/ctrl+down/enter');
	equals(inp.val(), '06/04/2008 to 06/11/2008',
		'Range separator - value');
	// Callbacks
	inp.datepicker('option', {onSelect: callback, rangeSeparator: ' - '}).
		datepicker('hide').val('06/04/2008').datepicker('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equals(selectedDate, '06/04/2008 - 06/11/2008',
		'Range onSelect - enter/ctrl+down/enter');
	inp.datepicker('option', {onChangeMonthYear: callback2, onSelect: null}).
		datepicker('hide').val('05/04/2008').datepicker('show').
		simulate('keydown', {keyCode: $.simulate.VK_PGUP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equals(selectedDate, '2008/4',
		'Range onChangeMonthYear - enter/ctrl+down/enter');
	inp.datepicker('option', {onClose: callback, onChangeMonthYear: null}).
		datepicker('hide').val('03/04/2008').datepicker('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equals(selectedDate, '03/04/2008 - 03/11/2008',
		'Range onClose - enter/ctrl+down/enter');
	// Minimum/maximum
	date1 = new Date(2008, 5 - 1, 20);
	date2 = new Date(2008, 7 - 1, 2);
	inp.datepicker('option', {minDate: date1, maxDate: date2, onClose: null}).
		datepicker('hide').val('06/04/2008').datepicker('show').
		simulate('keydown', {keyCode: $.simulate.VK_PGUP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDateArray(inp.datepicker('getDate'), [date1, date2],
		'Range min/max - pgup/enter/pgdn/pgdn/enter');
	inp.val('06/04/2008').datepicker('show').
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_UP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalsDateArray(inp.datepicker('getDate'),
		[new Date(2008, 5 - 1, 28), new Date(2008, 6 - 1, 11)],
		'Range min/max - ctrl+up/enter/ctrl+down/ctrl+down/enter');
	// Inline
	var inl = init('#inl', {rangeSelect: true});
	var dp = $('.ui-datepicker-inline', inl);
	date1 = new Date();
	date1.setDate(12);
	date2 = new Date();
	date2.setDate(19);
	$('.ui-datepicker tbody a:contains(12)', dp).simulate('click', {});
	$('.ui-datepicker tbody a:contains(12)', dp).simulate('click', {});
	equalsDateArray(inl.datepicker('getDate'), [date1, date1],
		'Range inline - same day');
	$('.ui-datepicker tbody a:contains(12)', dp).simulate('click', {});
	$('.ui-datepicker tbody a:contains(10)', dp).simulate('click', {}); // Doesn't select
	equalsDateArray(inl.datepicker('getDate'), [date1, date1],
		'Range inline - prev');
	$('.ui-datepicker tbody a:contains(12)', dp).simulate('click', {}); // Selects
	inl.datepicker('setDate', date1);
	$('.ui-datepicker tbody a:contains(12)', dp).simulate('click', {});
	$('.ui-datepicker tbody a:contains(19)', dp).simulate('click', {});
	equalsDateArray(inl.datepicker('getDate'), [date1, date2],
		'Range inline - next');
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
	inp.datepicker('option', {altField: '#alt', altFormat: 'yy-mm-dd'}).
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
	inp.datepicker('option', {rangeSelect: true, altField: '', altFormat: ''}).
		datepicker('hide').val('06/04/2008 - 07/14/2008').datepicker('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equals(inp.val(), '06/04/2008 - 06/04/2008', 'Alt field range - dp - enter');
	equals(alt.val(), '', 'Alt field range - alt not set');
	// Range select no movement
	alt.val('');
	inp.datepicker('option', {altField: '#alt', altFormat: 'yy-mm-dd'}).
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
	equals(inp.val(), '06/04/2008 - 07/04/2008',
		'Alt field range - dp - enter/pgdn/enter');
	equals(alt.val(), '2008-06-04 - 2008-07-04',
		'Alt field range - alt - enter/pgdn/enter');
	// Range select escape
	alt.val('');
	inp.val('06/04/2008 - 07/14/2008').datepicker('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_ESC});
	equals(inp.val(), '06/04/2008 - 06/04/2008',
		'Alt field range - dp - enter/pgdn/esc');
	equals(alt.val(), '2008-06-04 - 2008-06-04',
		'Alt field range - alt - enter/pgdn/esc');
	// Range select clear
	alt.val('');
	inp.val('06/04/2008 - 07/14/2008').datepicker('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_END});
	equals(inp.val(), '', 'Alt field range - dp - enter/pgdn/ctrl+end');
	equals(alt.val(), '', 'Alt field range - alt - enter/pgdn/ctrl+end');
});

test('daylightSaving', function() {
	var inp = init('#inp');
	var dp = $('#ui-datepicker-div');
	ok(true, 'Daylight saving - ' + new Date());
	// Australia, Sydney - AM change, southern hemisphere
	inp.val('04/01/2008').datepicker('show');
	$('.ui-datepicker td:eq(13)', dp).simulate('click', {});
	equals(inp.val(), '04/05/2008', 'Daylight saving - Australia 04/05/2008');
	inp.val('04/01/2008').datepicker('show');
	$('.ui-datepicker td:eq(14)', dp).simulate('click', {});
	equals(inp.val(), '04/06/2008', 'Daylight saving - Australia 04/06/2008');
	inp.val('04/01/2008').datepicker('show');
	$('.ui-datepicker td:eq(15)', dp).simulate('click', {});
	equals(inp.val(), '04/07/2008', 'Daylight saving - Australia 04/07/2008');
	inp.val('10/01/2008').datepicker('show');
	$('.ui-datepicker td:eq(13)', dp).simulate('click', {});
	equals(inp.val(), '10/04/2008', 'Daylight saving - Australia 10/04/2008');
	inp.val('10/01/2008').datepicker('show');
	$('.ui-datepicker td:eq(14)', dp).simulate('click', {});
	equals(inp.val(), '10/05/2008', 'Daylight saving - Australia 10/05/2008');
	inp.val('10/01/2008').datepicker('show');
	$('.ui-datepicker td:eq(15)', dp).simulate('click', {});
	equals(inp.val(), '10/06/2008', 'Daylight saving - Australia 10/06/2008');
	// Brasil, Brasilia - midnight change, southern hemisphere
	inp.val('02/01/2008').datepicker('show');
	$('.ui-datepicker td:eq(27)', dp).simulate('click', {});
	equals(inp.val(), '02/16/2008', 'Daylight saving - Brasil 02/16/2008');
	inp.val('02/01/2008').datepicker('show');
	$('.ui-datepicker td:eq(28)', dp).simulate('click', {});
	equals(inp.val(), '02/17/2008', 'Daylight saving - Brasil 02/17/2008');
	inp.val('02/01/2008').datepicker('show');
	$('.ui-datepicker td:eq(29)', dp).simulate('click', {});
	equals(inp.val(), '02/18/2008', 'Daylight saving - Brasil 02/18/2008');
	inp.val('10/01/2008').datepicker('show');
	$('.ui-datepicker td:eq(20)', dp).simulate('click', {});
	equals(inp.val(), '10/11/2008', 'Daylight saving - Brasil 10/11/2008');
	inp.val('10/01/2008').datepicker('show');
	$('.ui-datepicker td:eq(21)', dp).simulate('click', {});
	equals(inp.val(), '10/12/2008', 'Daylight saving - Brasil 10/12/2008');
	inp.val('10/01/2008').datepicker('show');
	$('.ui-datepicker td:eq(22)', dp).simulate('click', {});
	equals(inp.val(), '10/13/2008', 'Daylight saving - Brasil 10/13/2008');
	// Lebanon, Beirut - midnight change, northern hemisphere
	inp.val('03/01/2008').datepicker('show');
	$('.ui-datepicker td:eq(41)', dp).simulate('click', {});
	equals(inp.val(), '03/29/2008', 'Daylight saving - Lebanon 03/29/2008');
	inp.val('03/01/2008').datepicker('show');
	$('.ui-datepicker td:eq(42)', dp).simulate('click', {});
	equals(inp.val(), '03/30/2008', 'Daylight saving - Lebanon 03/30/2008');
	inp.val('03/01/2008').datepicker('show');
	$('.ui-datepicker td:eq(43)', dp).simulate('click', {});
	equals(inp.val(), '03/31/2008', 'Daylight saving - Lebanon 03/31/2008');
	inp.val('10/01/2008').datepicker('show');
	$('.ui-datepicker td:eq(34)', dp).simulate('click', {});
	equals(inp.val(), '10/25/2008', 'Daylight saving - Lebanon 10/25/2008');
	inp.val('10/01/2008').datepicker('show');
	$('.ui-datepicker td:eq(35)', dp).simulate('click', {});
	equals(inp.val(), '10/26/2008', 'Daylight saving - Lebanon 10/26/2008');
	inp.val('10/01/2008').datepicker('show');
	$('.ui-datepicker td:eq(36)', dp).simulate('click', {});
	equals(inp.val(), '10/27/2008', 'Daylight saving - Lebanon 10/27/2008');
	// US, Eastern - AM change, northern hemisphere
	inp.val('03/01/2008').datepicker('show');
	$('.ui-datepicker td:eq(20)', dp).simulate('click', {});
	equals(inp.val(), '03/08/2008', 'Daylight saving - US 03/08/2008');
	inp.val('03/01/2008').datepicker('show');
	$('.ui-datepicker td:eq(21)', dp).simulate('click', {});
	equals(inp.val(), '03/09/2008', 'Daylight saving - US 03/09/2008');
	inp.val('03/01/2008').datepicker('show');
	$('.ui-datepicker td:eq(22)', dp).simulate('click', {});
	equals(inp.val(), '03/10/2008', 'Daylight saving - US 03/10/2008');
	inp.val('11/01/2008').datepicker('show');
	$('.ui-datepicker td:eq(13)', dp).simulate('click', {});
	equals(inp.val(), '11/01/2008', 'Daylight saving - US 11/01/2008');
	inp.val('11/01/2008').datepicker('show');
	$('.ui-datepicker td:eq(14)', dp).simulate('click', {});
	equals(inp.val(), '11/02/2008', 'Daylight saving - US 11/02/2008');
	inp.val('11/01/2008').datepicker('show');
	$('.ui-datepicker td:eq(15)', dp).simulate('click', {});
	equals(inp.val(), '11/03/2008', 'Daylight saving - US 11/03/2008');
});

var beforeShowThis = null;
var beforeShowInput = null;
var beforeShowInst = null;

function beforeAll(input, inst) {
	beforeShowThis = this;
	beforeShowInput = input;
	beforeShowInst = inst;
	return {currentText: 'Current'};
}

var beforeShowDayThis = null;
var beforeShowDayOK = true;

function beforeDay(date) {
	beforeShowDayThis = this;
	beforeShowDayOK &= (date > new Date(2008, 1 - 1, 26) &&
		date < new Date(2008, 3 - 1, 6));
	return [(date.getDate() % 2 == 0), (date.getDate() % 10 == 0 ? 'day10' : ''),
		(date.getDate() % 3 == 0 ? 'Divisble by 3' : '')];
}

function calcWeek(date) {
	var doy = date.getDate() + 6;
	for (var m = date.getMonth() - 1; m >= 0; m--)
		doy += $.datepicker._getDaysInMonth(date.getFullYear(), m);
	// Simple count from 01/01 starting at week 1
	return Math.floor(doy / 7);
}

test('callbacks', function() {
	// Before show
	var inp = init('#inp', {beforeShow: beforeAll});
	var inst = $.data(inp[0], 'datepicker');
	equals($.datepicker._get(inst, 'currentText'), 'Today', 'Before show - initial');
	inp.val('02/04/2008').datepicker('show');
	equals($.datepicker._get(inst, 'currentText'), 'Current', 'Before show - changed');
	ok(beforeShowThis.id == inp[0].id, 'Before show - this OK');
	ok(beforeShowInput.id == inp[0].id, 'Before show - input OK');
	isObj(beforeShowInst, inst, 'Before show - inst OK');
	inp.datepicker('hide').datepicker('destroy');
	// Before show day
	inp = init('#inp', {beforeShowDay: beforeDay});
	var dp = $('#ui-datepicker-div');
	inp.val('02/04/2008').datepicker('show');
	ok(beforeShowDayThis.id == inp[0].id, 'Before show day - this OK');
	ok(beforeShowDayOK, 'Before show day - dates OK');
	var day20 = dp.find('.ui-datepicker td:contains("20")');
	var day21 = dp.find('.ui-datepicker td:contains("21")');
	ok(!day20.is('.ui-datepicker-unselectable'), 'Before show day - unselectable 20');
	ok(day21.is('.ui-datepicker-unselectable'), 'Before show day - unselectable 21');
	ok(day20.is('.day10'), 'Before show day - CSS 20');
	ok(!day21.is('.day10'), 'Before show day - CSS 21');
	ok(day20.attr('title') == '', 'Before show day - title 20');
	ok(day21.attr('title') == 'Divisble by 3', 'Before show day - title 21');
	inp.datepicker('hide').datepicker('destroy');
	// Calculate week
	inp = init('#inp', {showWeeks: true, calculateWeek: calcWeek});
	inp.val('02/04/2008').datepicker('show');
	equals($('.ui-datepicker-week-col:first').text(), 4, 'Calculate week');
	equals($('.ui-datepicker-week-col:last').text(), 8, 'Calculate week');
	// Make Tuesday first
	$('.ui-datepicker-title-row a:contains("Tu")', dp).simulate('click', {});
	equals($('.ui-datepicker-week-col:first').text(), 5, 'Calculate week');
	equals($('.ui-datepicker-week-col:last').text(), 9, 'Calculate week');
	inp.datepicker('hide').datepicker('destroy');
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

function highlight20(date, inst) {
	return (date.getDate() == 20 ? '*** 20 ***' : $.datepicker.dateStatus(date, inst));
}

test('status', function() {
	var dp = $('#ui-datepicker-div');
	var inp = init('#inp', {showStatus: true, statusForDate: highlight20, showWeeks: true});
	inp.val('').datepicker('show');
	var status = $('.ui-datepicker-status', dp);
	ok(status.length == 1, 'Status - present');
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
	$('.ui-datepicker-title-row td:first', dp).simulate('mouseover');
	equals(status.text(), 'Week of the year', 'Status - week header');
	var day = 0;
	$('.ui-datepicker-title-row a', dp).each(function() {
		$(this).simulate('mouseover');
		equals(status.text(), 'Set ' + $.datepicker.regional[''].dayNames[day] +
			' as first week day', 'Status - day ' + day);
		day++;
	});
	$('.ui-datepicker-days-row:eq(1) td:first', dp).simulate('mouseover');
	equals(status.text(), 'Week of the year', 'Status - week column');
	day = 0;
	var month = $.datepicker.regional[''].monthNamesShort[new Date().getMonth()];
	$('.ui-datepicker-days-row:eq(1) a', dp).each(function() {
		$(this).simulate('mouseover');
		equals(status.text(), 'Select ' + $.datepicker.regional[''].dayNames[day] +
			', ' + month + ' ' + $(this).text(), 'Status - dates');
		day++;
	});
	$('.ui-datepicker-days-row a:contains("20")', dp).each(function() {
		$(this).simulate('mouseover');
		equals(status.text(), '*** 20 ***', 'Status - dates');
	});
	inp.datepicker('hide').datepicker('destroy');
});

test('localisation', function() {
	var inp = init('#inp', $.datepicker.regional['fr']);
	inp.datepicker('option', {dateFormat: 'DD, d MM yy', showStatus: true, showWeeks: true}).
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
	equals($('.ui-datepicker-title-row td:first', dp).text(),
		$.datepicker.regional['fr'].weekHeader, 'Localisation - week header');
	var day = 1;
	$('.ui-datepicker-title-row a', dp).each(function() {
		equals($(this).text(), $.datepicker.regional['fr'].dayNamesMin[day],
			'Localisation - day ' + day);
		day = (day + 1) % 7;
	});
	inp.simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	var date = new Date();
	equals(inp.val(), $.datepicker.regional['fr'].dayNames[date.getDay()] + ', ' +
		date.getDate() + ' ' + $.datepicker.regional['fr'].monthNames[date.getMonth()] +
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
	init('#inp');
	ok($.datepicker.parseDate('d m y', '') == null, 'Parse date empty');
	equalsDate($.datepicker.parseDate('d m y', '3 2 01'),
		new Date(2001, 2 - 1, 3), 'Parse date d m y');
	equalsDate($.datepicker.parseDate('dd mm yy', '03 02 2001'),
		new Date(2001, 2 - 1, 3), 'Parse date dd mm yy');
	equalsDate($.datepicker.parseDate('d m y', '13 12 01'),
		new Date(2001, 12 - 1, 13), 'Parse date d m y');
	equalsDate($.datepicker.parseDate('dd mm yy', '13 12 2001'),
		new Date(2001, 12 - 1, 13), 'Parse date dd mm yy');
	equalsDate($.datepicker.parseDate('y-o', '2001-34'),
		new Date(2001, 2 - 1, 3), 'Parse date y-o');
	equalsDate($.datepicker.parseDate('yy-oo', '2001-347'),
		new Date(2001, 12 - 1, 13), 'Parse date yy oo');
	equalsDate($.datepicker.parseDate('oo yy', '348 2004'),
		new Date(2004, 12 - 1, 13), 'Parse date oo-yy');
	equalsDate($.datepicker.parseDate('D d M y', 'Sat 3 Feb 01'),
		new Date(2001, 2 - 1, 3), 'Parse date D d M y');
	equalsDate($.datepicker.parseDate('d MM DD yy', '3 February Saturday 2001'),
		new Date(2001, 2 - 1, 3), 'Parse date dd MM DD yy');
	equalsDate($.datepicker.parseDate('DD, MM d, yy', 'Saturday, February 3, 2001'),
		new Date(2001, 2 - 1, 3), 'Parse date DD, MM d, yy');
	equalsDate($.datepicker.parseDate('\'day\' d \'of\' MM (\'\'DD\'\'), yy',
		'day 3 of February (\'Saturday\'), 2001'), new Date(2001, 2 - 1, 3),
		'Parse date \'day\' d \'of\' MM (\'\'DD\'\'), yy');
	equalsDate($.datepicker.parseDate('y-m-d', '01-02-03'),
		new Date(2001, 2 - 1, 3), 'Parse date y-m-d - default cutoff');
	equalsDate($.datepicker.parseDate('y-m-d', '51-02-03'),
		new Date(1951, 2 - 1, 3), 'Parse date y-m-d - default cutoff');
	equalsDate($.datepicker.parseDate('y-m-d', '51-02-03', {shortYearCutoff: 80}),
		new Date(2051, 2 - 1, 3), 'Parse date y-m-d - cutoff 80');
	equalsDate($.datepicker.parseDate('y-m-d', '51-02-03', {shortYearCutoff: '+60'}),
		new Date(2051, 2 - 1, 3), 'Parse date y-m-d - cutoff +60');
	var fr = $.datepicker.regional['fr'];
	var settings = {dayNamesShort: fr.dayNamesShort, dayNames: fr.dayNames,
		monthNamesShort: fr.monthNamesShort, monthNames: fr.monthNames};
	equalsDate($.datepicker.parseDate('D d M y', 'Lun 9 Avr 01', settings),
		new Date(2001, 4 - 1, 9), 'Parse date D M y with settings');
	equalsDate($.datepicker.parseDate('d MM DD yy', '9 Avril Lundi 2001', settings),
		new Date(2001, 4 - 1, 9), 'Parse date d MM DD yy with settings');
	equalsDate($.datepicker.parseDate('DD, MM d, yy', 'Lundi, Avril 9, 2001', settings),
		new Date(2001, 4 - 1, 9), 'Parse date DD, MM d, yy with settings');
	equalsDate($.datepicker.parseDate('\'jour\' d \'de\' MM (\'\'DD\'\'), yy',
		'jour 9 de Avril (\'Lundi\'), 2001', settings), new Date(2001, 4 - 1, 9),
		'Parse date \'jour\' d \'de\' MM (\'\'DD\'\'), yy with settings');
});

test('parseDateErrors', function() {
	init('#inp');
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
		'Sat 2 01 - d m y', 'Missing number at position 0');
	expectError(function() { $.datepicker.parseDate('dd mm yy', 'Sat 2 01'); },
		'Sat 2 01 - dd mm yy', 'Missing number at position 0');
	expectError(function() { $.datepicker.parseDate('d m y', '3 Feb 01'); },
		'3 Feb 01 - d m y', 'Missing number at position 2');
	expectError(function() { $.datepicker.parseDate('dd mm yy', '3 Feb 01'); },
		'3 Feb 01 - dd mm yy', 'Missing number at position 2');
	expectError(function() { $.datepicker.parseDate('d m y', '3 2 AD01'); },
		'3 2 AD01 - d m y', 'Missing number at position 4');
	expectError(function() { $.datepicker.parseDate('d m yy', '3 2 AD01'); },
		'3 2 AD01 - dd mm yy', 'Missing number at position 4');
	expectError(function() { $.datepicker.parseDate('y-o', '2001-D01'); },
		'2001-D01 - y-o', 'Missing number at position 5');
	expectError(function() { $.datepicker.parseDate('yy-oo', '2001-D01'); },
		'2001-D01 - yy-oo', 'Missing number at position 5');
	expectError(function() { $.datepicker.parseDate('D d M y', 'D7 3 Feb 01'); },
		'D7 3 Feb 01 - D d M y', 'Unknown name at position 0');
	expectError(function() { $.datepicker.parseDate('D d M y', 'Sat 3 M2 01'); },
		'Sat 3 M2 01 - D d M y', 'Unknown name at position 6');
	expectError(function() { $.datepicker.parseDate('DD, MM d, yy', 'Saturday- Feb 3, 2001'); },
		'Saturday- Feb 3, 2001 - DD, MM d, yy', 'Unexpected literal at position 8');
	expectError(function() { $.datepicker.parseDate('\'day\' d \'of\' MM (\'\'DD\'\'), yy',
		'day 3 of February ("Saturday"), 2001'); },
		'day 3 of Mon2 ("Day7"), 2001', 'Unexpected literal at position 19');
	expectError(function() { $.datepicker.parseDate('d m y', '29 2 01'); },
		'29 2 01 - d m y', 'Invalid date');
	var fr = $.datepicker.regional['fr'];
	var settings = {dayNamesShort: fr.dayNamesShort, dayNames: fr.dayNames,
		monthNamesShort: fr.monthNamesShort, monthNames: fr.monthNames};
	expectError(function() { $.datepicker.parseDate('D d M y', 'Mon 9 Avr 01', settings); },
		'Mon 9 Avr 01 - D d M y', 'Unknown name at position 0');
	expectError(function() { $.datepicker.parseDate('D d M y', 'Lun 9 Apr 01', settings); },
		'Lun 9 Apr 01 - D d M y', 'Unknown name at position 6');
});

test('formatDate', function() {
	init('#inp');
	equals($.datepicker.formatDate('d m y', new Date(2001, 2 - 1, 3)),
		'3 2 01', 'Format date d m y');
	equals($.datepicker.formatDate('dd mm yy', new Date(2001, 2 - 1, 3)),
		'03 02 2001', 'Format date dd mm yy');
	equals($.datepicker.formatDate('d m y', new Date(2001, 12 - 1, 13)),
		'13 12 01', 'Format date d m y');
	equals($.datepicker.formatDate('dd mm yy', new Date(2001, 12 - 1, 13)),
		'13 12 2001', 'Format date dd mm yy');
	equals($.datepicker.formatDate('yy-o', new Date(2001, 2 - 1, 3)),
		'2001-34', 'Format date yy-o');
	equals($.datepicker.formatDate('yy-oo', new Date(2001, 2 - 1, 3)),
		'2001-034', 'Format date yy-oo');
	equals($.datepicker.formatDate('D M y', new Date(2001, 2 - 1, 3)),
		'Sat Feb 01', 'Format date D M y');
	equals($.datepicker.formatDate('DD MM yy', new Date(2001, 2 - 1, 3)),
		'Saturday February 2001', 'Format date DD MM yy');
	equals($.datepicker.formatDate('DD, MM d, yy', new Date(2001, 2 - 1, 3)),
		'Saturday, February 3, 2001', 'Format date DD, MM d, yy');
	equals($.datepicker.formatDate('\'day\' d \'of\' MM (\'\'DD\'\'), yy',
		new Date(2001, 2 - 1, 3)), 'day 3 of February (\'Saturday\'), 2001',
		'Format date \'day\' d \'of\' MM (\'\'DD\'\'), yy');
	var fr = $.datepicker.regional['fr'];
	var settings = {dayNamesShort: fr.dayNamesShort, dayNames: fr.dayNames,
		monthNamesShort: fr.monthNamesShort, monthNames: fr.monthNames};
	equals($.datepicker.formatDate('D M y', new Date(2001, 4 - 1, 9), settings),
		'Lun Avr 01', 'Format date D M y with settings');
	equals($.datepicker.formatDate('DD MM yy', new Date(2001, 4 - 1, 9), settings),
		'Lundi Avril 2001', 'Format date DD MM yy with settings');
	equals($.datepicker.formatDate('DD, MM d, yy', new Date(2001, 4 - 1, 9), settings),
		'Lundi, Avril 9, 2001', 'Format date DD, MM d, yy with settings');
	equals($.datepicker.formatDate('\'jour\' d \'de\' MM (\'\'DD\'\'), yy',
		new Date(2001, 4 - 1, 9), settings), 'jour 9 de Avril (\'Lundi\'), 2001',
		'Format date \'jour\' d \'de\' MM (\'\'DD\'\'), yy with settings');
});

})(jQuery);
