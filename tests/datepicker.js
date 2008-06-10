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

test('defaults', function() {
	var dp1 = $('#dp1');
	dp1.datepicker();
	ok(dp1.is('.hasDatepicker'), 'Marker class set');
	ok($($.datepicker._datepickerDiv).html() == '', 'Content empty');
	dp1.focus();
	ok($($.datepicker._datepickerDiv).html() != '', 'Content present');
	dp1.blur();
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
	ok(rem[0]._calId != null, 'Datepicker ID present');
	rem.datepicker('destroy');
	ok(!rem.is('.hasDatepicker'), 'Marker class cleared');
	ok(rem[0]._calId == null, 'Datepicker ID absent');
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
/*
test('keystrokes', function() {
	var dp1 = $('#dp1');
	dp1.datepicker().val('').focus();
	dp1.simulate('keydown', {keyCode: 13});
	equalsDate(dp1.datepicker('getDate'), new Date(), 'Select today');
	dp1.blur();
});
*/
test('noWeekends', function() {
	for (var i = 1; i <= 31; i++) {
		var date = new Date(2001, 1 - 1, i);
		isObj($.datepicker.noWeekends(date), [(i + 1) % 7 >= 2, ''],
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
