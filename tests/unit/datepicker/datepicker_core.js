/*
 * datepicker_core.js
 */

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

(function($) {

module("datepicker: core");

test('baseStructure', function() {
	var dp = $('#ui-datepicker-div');
	var inp = init('#inp');
	inp.focus();
	var iframe = ($.browser.msie && parseInt($.browser.version) < 7);
	ok(dp.is(':visible'), 'Structure - datepicker visible');
	ok(!dp.is('.ui-datepicker-rtl'), 'Structure - not right-to-left');
	ok(!dp.is('.ui-datepicker-multi'), 'Structure - not multi-month');
	equals(dp.children().length, 2 + (iframe ? 1 : 0), 'Structure - child count');
	
	var header = dp.children(':first');
	ok(header.is('div.ui-datepicker-header'), 'Structure - header division');
	equals(header.children().length, 3, 'Structure - header child count');
	ok(header.children(':first').is('a.ui-datepicker-prev') && header.children(':first').html() != '', 'Structure - prev link');
	ok(header.children(':eq(1)').is('a.ui-datepicker-next') && header.children(':eq(1)').html() != '', 'Structure - next link');
	
	var title = header.children(':last');
	ok(title.is('div.ui-datepicker-title') && title.html() != '','Structure - title division');
	equals(title.children().length, 2, 'Structure - title child count');
	ok(title.children(':first').is('span.ui-datepicker-month') && title.children(':first').text() != '', 'Structure - month text')
	ok(title.children(':last').is('span.ui-datepicker-year') && title.children(':last').text() != '', 'Structure - year text')
	
	var table = dp.children(':eq(1)');
	ok(table.is('table.ui-datepicker-calendar'), 'Structure - month table');
	ok(table.children(':first').is('thead'), 'Structure - month table thead');
	var thead = table.children(':first').children(':first');
	ok(thead.is('tr'), 'Structure - month table title row');
	equals(thead.find('th').length, 7, 'Structure - month table title cells');
	ok(table.children(':eq(1)').is('tbody'), 'Structure - month table body');
	ok(table.children(':eq(1)').children('tr').length >= 4, 'Structure - month table week count');
	var week = table.children(':eq(1)').children(':first');
	ok(week.is('tr'), 'Structure - month table week row');
	equals(week.children().length, 7, 'Structure - week child count');
	ok(week.children(':first').is('td.ui-datepicker-week-end'), 'Structure - month table first day cell');
	ok(week.children(':last').is('td.ui-datepicker-week-end'), 'Structure - month table second day cell');
	ok(dp.children('iframe').length == (iframe ? 1 : 0), 'Structure - iframe');
	inp.datepicker('hide').datepicker('destroy');
	
	// Editable month/year and button panel
	inp = init('#inp', {changeMonth: true, changeYear: true, showButtonPanel: true});
	inp.focus();

	var title = dp.find('div.ui-datepicker-title');
	ok(title.children(':first').is('select.ui-datepicker-month'), 'Structure - month selector');
	ok(title.children(':last').is('select.ui-datepicker-year'), 'Structure - year selector');
		
	var panel = dp.children(':last');
	ok(panel.is('div.ui-datepicker-buttonpane'), 'Structure - button panel division');
	equals(panel.children().length, 2, 'Structure - button panel child count');
	ok(panel.children(':first').is('button.ui-datepicker-current'), 'Structure - today button');
	ok(panel.children(':last').is('button.ui-datepicker-close'), 'Structure - close button');
	inp.datepicker('hide').datepicker('destroy');
	
	// Multi-month 2
	inp = init('#inp', {numberOfMonths: 2});
	inp.focus();
	ok(dp.is('.ui-datepicker-multi'), 'Structure multi [2] - multi-month');
	equals(dp.children().length, 2 + (iframe ? 1 : 0), 'Structure multi [2] - child count');
	month = dp.children(':first');
	ok(month.is('div.ui-datepicker-group') && month.is('div.ui-datepicker-group-first'), 'Structure multi [2] - first month division');
	month = dp.children(':eq(1)');
	ok(month.is('div.ui-datepicker-group') && month.is('div.ui-datepicker-group-last'), 'Structure multi [2] - second month division');
	inp.datepicker('hide').datepicker('destroy');
	
	// Multi-month [2, 2]
	inp = init('#inp', {numberOfMonths: [2, 2]});
	inp.focus();
	ok(dp.is('.ui-datepicker-multi'), 'Structure multi - multi-month');
	equals(dp.children().length, 4 + (iframe ? 1 : 0), 'Structure multi [2,2] - child count');
	month = dp.children(':first');
	ok(month.is('div.ui-datepicker-group') && month.is('div.ui-datepicker-group-first'), 'Structure multi [2,2] - first month division');
	month = dp.children(':eq(1)');
	ok(month.is('div.ui-datepicker-group') && month.is('div.ui-datepicker-group-last'), 'Structure multi [2,2] - second month division');
	month = dp.children(':eq(2)');
	ok(month.is('div.ui-datepicker-group') && month.is('div.ui-datepicker-group-first'), 'Structure multi [2,2] - third month division');
	month = dp.children(':eq(3)');
	ok(month.is('div.ui-datepicker-group') && month.is('div.ui-datepicker-group-last'), 'Structure multi [2,2] - fourth month division');
	inp.datepicker('hide').datepicker('destroy');
	
	// Inline
	var inl = init('#inl');
	dp = inl.children();
	ok(dp.is('.ui-datepicker-inline'), 'Structure inline - main div');
	ok(!dp.is('.ui-datepicker-rtl'), 'Structure inline - not right-to-left');
	ok(!dp.is('.ui-datepicker-multi'), 'Structure inline - not multi-month');
	equals(dp.children().length, 2, 'Structure inline - child count');
	var header = dp.children(':first');
	ok(header.is('div.ui-datepicker-header'), 'Structure inline - header division');
	equals(header.children().length, 3, 'Structure inline - header child count');
	var table = month.children(':eq(1)');
	ok(table.is('table.ui-datepicker-calendar'), 'Structure inline - month table');
	ok(table.children(':first').is('thead'), 'Structure inline - month table thead');
	ok(table.children(':eq(1)').is('tbody'), 'Structure inline - month table body');
	inl.datepicker('destroy');
	
	// Inline multi-month
	inl = init('#inl', {numberOfMonths: 2});
	dp = inl.children();
	ok(dp.is('.ui-datepicker-inline') && dp.is('.ui-datepicker-multi'), 'Structure inline multi - main div');	
	equals(dp.children().length, 2 + (iframe ? 1 : 0), 'Structure multi - child count');
	month = dp.children(':first');
	ok(month.is('div.ui-datepicker-group') && month.is('div.ui-datepicker-group-first'), 'Structure multi - first month division');
	month = dp.children(':eq(1)');
	ok(month.is('div.ui-datepicker-group') && month.is('div.ui-datepicker-group-last'), 'Structure multi - second month division');
	inl.datepicker('destroy');
});

test('customStructure', function() {
	var dp = $('#ui-datepicker-div');
	// Check right-to-left localisation
	var inp = init('#inp', $.datepicker.regional['he']);
	inp.data('showButtonPanel.datepicker',true);
	inp.focus();
	var iframe = ($.browser.msie && parseInt($.browser.version) < 7);
	ok(dp.is('.ui-datepicker-rtl'), 'Structure RTL - right-to-left');
	var header = dp.children(':first');
	ok(header.is('div.ui-datepicker-header'), 'Structure RTL - header division');
	equals(header.children().length, 3, 'Structure RTL - header child count');
	ok(header.children(':first').is('a.ui-datepicker-next'), 'Structure RTL - prev link');
	ok(header.children(':eq(1)').is('a.ui-datepicker-prev'), 'Structure RTL - next link');	
	var panel = dp.children(':last');
	ok(panel.is('div.ui-datepicker-buttonpane'), 'Structure RTL - button division');
	equals(panel.children().length, 2, 'Structure RTL - button panel child count');
	ok(panel.children(':first').is('button.ui-datepicker-close'), 'Structure RTL - close button');
	ok(panel.children(':last').is('button.ui-datepicker-current'), 'Structure RTL - today button');
	inp.datepicker('hide').datepicker('destroy');

	// Hide prev/next
	inp = init('#inp', {hideIfNoPrevNext: true, minDate: new Date(2008, 2 - 1, 4), maxDate: new Date(2008, 2 - 1, 14)});
	inp.val('02/10/2008').focus();
	var header = dp.children(':first');
	ok(header.is('div.ui-datepicker-header'), 'Structure hide prev/next - header division');
	equals(header.children().length, 1, 'Structure hide prev/next - links child count');
	ok(header.children(':first').is('div.ui-datepicker-title'), 'Structure hide prev/next - title division');
	inp.datepicker('hide').datepicker('destroy');
	
	// Changeable Month with read-only year
	inp = init('#inp', {changeMonth: true});
	inp.focus();
	var title = dp.children(':first').children(':last');
	equals(title.children().length, 2, 'Structure changeable month - title child count');
	ok(title.children(':first').is('select.ui-datepicker-month'), 'Structure changeable month - month selector');
	ok(title.children(':last').is('span.ui-datepicker-year'), 'Structure changeable month - read-only year');
	inp.datepicker('hide').datepicker('destroy');
	
	// Changeable year with read-only month
	inp = init('#inp', {changeYear: true});
	inp.focus();
	var title = dp.children(':first').children(':last');
	equals(title.children().length, 2, 'Structure changeable year - title child count');
	ok(title.children(':first').is('span.ui-datepicker-month'), 'Structure changeable year - read-only month');
	ok(title.children(':last').is('select.ui-datepicker-year'), 'Structure changeable year - year selector');
	inp.datepicker('hide').datepicker('destroy');

	// Read-only first day of week
	inp = init('#inp', {changeFirstDay: false});
	inp.focus();
	var thead = dp.find('.ui-datepicker-calendar thead tr');
	equals(thead.children().length, 7, 'Structure read-only first day - thead child count');
	equals(thead.find('a').length, 0, 'Structure read-only first day - thead links count');
	inp.datepicker('hide').datepicker('destroy');
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
	inp.datepicker('option', {stepMonths: 2, gotoCurrent: false}).
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
});

test('mouse', function() {
	var inp = init('#inp');
	var dp = $('#ui-datepicker-div');
	var date = new Date();
	inp.val('').datepicker('show');
	$('.ui-datepicker-calendar tbody a:contains(10)', dp).simulate('click', {});
	date.setDate(10);
	equalsDate(inp.datepicker('getDate'), date, 'Mouse click');
	inp.val('02/04/2008').datepicker('show');
	$('.ui-datepicker-calendar tbody a:contains(12)', dp).simulate('click', {});
	equalsDate(inp.datepicker('getDate'), new Date(2008, 2 - 1, 12),
		'Mouse click - preset');
	inp.val('02/04/2008').datepicker('show');
	inp.val('').datepicker('show');
	$('button.ui-datepicker-close', dp).simulate('click', {});
	ok(inp.datepicker('getDate') == null, 'Mouse click - close');
	inp.val('02/04/2008').datepicker('show');
	$('button.ui-datepicker-close', dp).simulate('click', {});
	equalsDate(inp.datepicker('getDate'), new Date(2008, 2 - 1, 4),
		'Mouse click - close + preset');
	inp.val('02/04/2008').datepicker('show');
	$('a.ui-datepicker-prev', dp).simulate('click', {});
	$('button.ui-datepicker-close', dp).simulate('click', {});
	equalsDate(inp.datepicker('getDate'), new Date(2008, 2 - 1, 4),
		'Mouse click - abandoned');
	// Current/previous/next
	inp.val('02/04/2008').datepicker('option', {showButtonPanel: true}).datepicker('show');
	$('.ui-datepicker-current', dp).simulate('click', {});
	$('.ui-datepicker-calendar tbody a:contains(14)', dp).simulate('click', {});
	date.setDate(14);
	equalsDate(inp.datepicker('getDate'), date, 'Mouse click - current');
	inp.val('02/04/2008').datepicker('show');
	$('.ui-datepicker-prev', dp).simulate('click');
	$('.ui-datepicker-calendar tbody a:contains(16)', dp).simulate('click');
	equalsDate(inp.datepicker('getDate'), new Date(2008, 1 - 1, 16),
		'Mouse click - previous');
	inp.val('02/04/2008').datepicker('show');
	$('.ui-datepicker-next', dp).simulate('click');
	$('.ui-datepicker-calendar tbody a:contains(18)', dp).simulate('click');
	equalsDate(inp.datepicker('getDate'), new Date(2008, 3 - 1, 18),
		'Mouse click - next');
	// Previous/next with minimum/maximum
	inp.datepicker('option', {minDate: new Date(2008, 2 - 1, 2),
		maxDate: new Date(2008, 2 - 1, 26)}).val('02/04/2008').datepicker('show');
	$('.ui-datepicker-prev', dp).simulate('click');
	$('.ui-datepicker-calendar tbody a:contains(16)', dp).simulate('click');
	equalsDate(inp.datepicker('getDate'), new Date(2008, 2 - 1, 16),
		'Mouse click - previous + min/max');
	inp.val('02/04/2008').datepicker('show');
	$('.ui-datepicker-next', dp).simulate('click');
	$('.ui-datepicker-calendar tbody a:contains(18)', dp).simulate('click');
	equalsDate(inp.datepicker('getDate'), new Date(2008, 2 - 1, 18),
		'Mouse click - next + min/max');
	// Inline
	var inl = init('#inl');
	var dp = $('.ui-datepicker-inline', inl);
	var date = new Date();
	inl.datepicker('setDate', date);
	$('.ui-datepicker-calendar tbody a:contains(10)', dp).simulate('click', {});
	date.setDate(10);
	equalsDate(inl.datepicker('getDate'), date, 'Mouse click inline');
	inl.datepicker('option', {showButtonPanel: true}).datepicker('setDate', new Date(2008, 2 - 1, 4));
	$('.ui-datepicker-calendar tbody a:contains(12)', dp).simulate('click', {});
	equalsDate(inl.datepicker('getDate'), new Date(2008, 2 - 1, 12), 'Mouse click inline - preset');
	inl.datepicker('option', {showButtonPanel: true});
	$('.ui-datepicker-current', dp).simulate('click', {});
	$('.ui-datepicker-calendar tbody a:contains(14)', dp).simulate('click', {});
	date.setDate(14);
	equalsDate(inl.datepicker('getDate'), date, 'Mouse click inline - current');
	inl.datepicker('setDate', new Date(2008, 2 - 1, 4));
	$('.ui-datepicker-prev', dp).simulate('click');
	$('.ui-datepicker-calendar tbody a:contains(16)', dp).simulate('click');
	equalsDate(inl.datepicker('getDate'), new Date(2008, 1 - 1, 16),
		'Mouse click inline - previous');
	inl.datepicker('setDate', new Date(2008, 2 - 1, 4));
	$('.ui-datepicker-next', dp).simulate('click');
	$('.ui-datepicker-calendar tbody a:contains(18)', dp).simulate('click');
	equalsDate(inl.datepicker('getDate'), new Date(2008, 3 - 1, 18),
		'Mouse click inline - next');
});

})(jQuery);
