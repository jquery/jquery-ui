/* Arabic Translation for jQuery UI date picker plugin. */
/* Mohammad Hasani Eghtedar -- m.h.eghtedar@gmail.com */
/* Hijri calender supported */
jQuery(function($){
	$.datepicker.regional['ar'] = {
		calendar: HijriDate,
		closeText: 'إغلاق',
		prevText: 'السابق',
		nextText: 'التالي',
		currentText: 'اليوم',
		monthNames: ['محرّم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'],
		monthNamesShort: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
		dayNames: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
		dayNamesShort: ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'],
		dayNamesMin: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
		weekHeader: 'س',
		dateFormat: 'dd/mm/yy',
		firstDay: 6,
		isRTL: true,
		showMonthAfterYear: false,
		yearSuffix: '',
		calculateWeek: function(date) {
			var checkDate = new HijriDate(date.getFullYear(), date.getMonth(), date.getDate() + (date.getDay() || 7) - 3);
			return Math.floor(Math.round((checkDate.getTime() - new HijriDate(checkDate.getFullYear(), 0, 1).getTime()) / 86400000) / 7) + 1;
		}};
	$.datepicker.setDefaults($.datepicker.regional['ar']);
});

function HijriDate(p0, p1, p2) {
	var gregorianDate;
	var hijriDate;

	if (!isNaN(parseInt(p0)) && !isNaN(parseInt(p1)) && !isNaN(parseInt(p2))) {
		var g = hijri_to_gregorian([parseInt(p0, 10), parseInt(p1, 10), parseInt(p2, 10)]);
		setFullDate(new Date(g[0], g[1], g[2]));
	} else {
		setFullDate(p0);
	}

	function hijri_to_gregorian(d) {
		var gregorian = jd_to_gregorian(islamic_to_jd(d[0], d[1] + 1, d[2]));
		gregorian[1]--;
		return gregorian;
	}

	function gregorian_to_hijri(d) {
		var hijri = jd_to_islamic(gregorian_to_jd(d[0], d[1] + 1, d[2]));
		hijri[1]--;
		return hijri;
    }

	function setFullDate(date) {
		if (date && date.getGregorianDate) date = date.getGregorianDate();
		gregorianDate = new Date(date);
		gregorianDate.setHours(gregorianDate.getHours() > 12 ? gregorianDate.getHours() + 2 : 0)
		if (!gregorianDate || gregorianDate == 'Invalid Date' || isNaN(gregorianDate || !gregorianDate.getDate())) {
			gregorianDate = new Date();
		}
		hijriDate = gregorian_to_hijri([
			gregorianDate.getFullYear(),
			gregorianDate.getMonth(),
			gregorianDate.getDate()]);
		return this;
	}

	this.getGregorianDate = function() { return gregorianDate; }

	this.setFullDate = setFullDate;

	this.setMonth = function(e) {
		hijriDate[1] = e;
		var g = hijri_to_gregorian(hijriDate);
		gregorianDate = new Date(g[0], g[1], g[2]);
		hijriDate = gregorian_to_hijri([g[0], g[1], g[2]]);
	}

	this.setDate = function(e) {
		hijriDate[2] = e;
		var g = hijri_to_gregorian(hijriDate);
		gregorianDate = new Date(g[0], g[1], g[2]);
		hijriDate = gregorian_to_hijri([g[0], g[1], g[2]]);
	};

	this.getFullYear = function() { return hijriDate[0]; };
	this.getMonth = function() { return hijriDate[1]; };
	this.getDate = function() { return hijriDate[2]; };
	this.toString = function() { return hijriDate.join(',').toString(); };
	this.getDay = function() { return gregorianDate.getDay(); };
	this.getHours = function() { return gregorianDate.getHours(); };
	this.getMinutes = function() { return gregorianDate.getMinutes(); };
	this.getSeconds = function() { return gregorianDate.getSeconds(); };
	this.getTime = function() { return gregorianDate.getTime(); };
	this.getTimeZoneOffset = function() { return gregorianDate.getTimeZoneOffset(); };
	this.getYear = function() { return hijriDate[0] % 100; };

	this.setHours = function(e) { gregorianDate.setHours(e) };
	this.setMinutes = function(e) { gregorianDate.setMinutes(e) };
	this.setSeconds = function(e) { gregorianDate.setSeconds(e) };
	this.setMilliseconds = function(e) { gregorianDate.setMilliseconds(e) };
}
