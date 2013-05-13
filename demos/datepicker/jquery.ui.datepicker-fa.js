/* Persian (Farsi) Translation for the jQuery UI date picker plugin. */
/* Mohammad Hasani Eghtedar -- m.h.eghtedar@gmail.com */
/* Jalali calendar supported */
jQuery(function($) {
	$.datepicker.regional['fa'] = {
		calendar: JalaliDate,
		closeText: 'بستن',
		prevText: 'قبلی',
		nextText: 'بعدی',
		currentText: 'امروز',
		monthNames: [
			'فروردين',
			'ارديبهشت',
			'خرداد',
			'تير',
			'مرداد',
			'شهريور',
			'مهر',
			'آبان',
			'آذر',
			'دی',
			'بهمن',
			'اسفند'
		],
		monthNamesShort: ['1','2','3','4','5','6','7','8','9','10','11','12'],
		dayNames: [
			'يکشنبه',
			'دوشنبه',
			'سه‌شنبه',
			'چهارشنبه',
			'پنجشنبه',
			'جمعه',
			'شنبه'
		],
		dayNamesShort: [
			'ی',
			'د',
			'س',
			'چ',
			'پ',
			'ج',
			'ش'
		],
		dayNamesMin: [
			'ی',
			'د',
			'س',
			'چ',
			'پ',
			'ج',
			'ش'
		],
		weekHeader: 'هف',
		dateFormat: 'yy/mm/dd',
		firstDay: 6,
		isRTL: true,
		showMonthAfterYear: false,
		yearSuffix: '',
		calculateWeek: function(date) {
			var checkDate = new JalaliDate(date.getFullYear(), date.getMonth(), date.getDate() + (date.getDay() || 7) - 3);
			return Math.floor(Math.round((checkDate.getTime() - new JalaliDate(checkDate.getFullYear(), 0, 1).getTime()) / 86400000) / 7) + 1;
		}};
	$.datepicker.setDefaults($.datepicker.regional['fa']);
});

function JalaliDate(p0, p1, p2) {
	var gregorianDate;
	var jalaliDate;

	if (!isNaN(parseInt(p0)) && !isNaN(parseInt(p1)) && !isNaN(parseInt(p2))) {
		var g = jalali_to_gregorian([parseInt(p0, 10), parseInt(p1, 10), parseInt(p2, 10)]);
		setFullDate(new Date(g[0], g[1], g[2]));
	} else {
		setFullDate(p0);
	}

	function jalali_to_gregorian(d) {
		var adjustDay = 0;
		if(d[1]<0){
			adjustDay = leap_persian(d[0]-1)? 30: 29;
			d[1]++;
		}
		var gregorian = jd_to_gregorian(persian_to_jd(d[0], d[1] + 1, d[2])-adjustDay);
		gregorian[1]--;
		return gregorian;
	}

	function gregorian_to_jalali(d) {
		var jalali = jd_to_persian(gregorian_to_jd(d[0], d[1] + 1, d[2]));
		jalali[1]--;
		return jalali;
	}

	function setFullDate(date) {
		if (date && date.getGregorianDate) date = date.getGregorianDate();
		gregorianDate = new Date(date);
		gregorianDate.setHours(gregorianDate.getHours() > 12 ? gregorianDate.getHours() + 2 : 0)
		if (!gregorianDate || gregorianDate == 'Invalid Date' || isNaN(gregorianDate || !gregorianDate.getDate())) {
			gregorianDate = new Date();
		}
		jalaliDate = gregorian_to_jalali([
			gregorianDate.getFullYear(),
			gregorianDate.getMonth(),
			gregorianDate.getDate()]);
		return this;
	}

	this.getGregorianDate = function() { return gregorianDate; }

	this.setFullDate = setFullDate;

	this.setMonth = function(e) {
		jalaliDate[1] = e;
		var g = jalali_to_gregorian(jalaliDate);
		gregorianDate = new Date(g[0], g[1], g[2]);
		jalaliDate = gregorian_to_jalali([g[0], g[1], g[2]]);
	}

	this.setDate = function(e) {
		jalaliDate[2] = e;
		var g = jalali_to_gregorian(jalaliDate);
		gregorianDate = new Date(g[0], g[1], g[2]);
		jalaliDate = gregorian_to_jalali([g[0], g[1], g[2]]);
	};

	this.getFullYear = function() { return jalaliDate[0]; };
	this.getMonth = function() { return jalaliDate[1]; };
	this.getDate = function() { return jalaliDate[2]; };
	this.toString = function() { return jalaliDate.join(',').toString(); };
	this.getDay = function() { return gregorianDate.getDay(); };
	this.getHours = function() { return gregorianDate.getHours(); };
	this.getMinutes = function() { return gregorianDate.getMinutes(); };
	this.getSeconds = function() { return gregorianDate.getSeconds(); };
	this.getTime = function() { return gregorianDate.getTime(); };
	this.getTimeZoneOffset = function() { return gregorianDate.getTimeZoneOffset(); };
	this.getYear = function() { return jalaliDate[0] % 100; };

	this.setHours = function(e) { gregorianDate.setHours(e) };
	this.setMinutes = function(e) { gregorianDate.setMinutes(e) };
	this.setSeconds = function(e) { gregorianDate.setSeconds(e) };
	this.setMilliseconds = function(e) { gregorianDate.setMilliseconds(e) };
}