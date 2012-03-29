/* Hebrew initialisation for the UI Datepicker extension. */
/* Written by Amir Hardon (ahardon at gmail dot com). */
jQuery(function($){
	$.datepicker.regional['he'] = {
		closeText: 'סגירה',
		prevText: '&#x3C;הקודם',
		nextText: 'הבא&#x3E;',
		currentText: 'היום',
		monthNames: [
			'ינואר',
			'פברואר',
			'מרץ',
			'אפריל',
			'מאי',
			'יוני',
			'יולי',
			'אוגוסט',
			'ספטמבר',
			'אוקטובר',
			'נובמבר',
			'דצמבר'
		],
		monthNamesShort: [
			'ינו\'',
			'פבר\'',
			'מרץ\'',
			'אפר\'',
			'מאי\'',
			'יוני',
			'יולי',
			'אוג\'',
			'ספט\'',
			'אוק\'',
			'נוב\'',
			'דצמ\''
		],
		dayNames: [
			'יום ראשון',
			'יום שני',
			'יום שלישי',
			'יום רביעי',
			'יום חמישי',
			'יום שישי',
			'שבת'
		],
		dayNamesShort: [
			'א\'',
			'ב\'',
			'ג\'',
			'ד\'',
			'ה\'',
			'ו\'',
			'ש\''
		],
		dayNamesMin: [
			'א\'',
			'ב\'',
			'ג\'',
			'ד\'',
			'ה\'',
			'ו\'',
			'ש\''
		],
		weekHeader: 'שבוע',
		dateFormat: 'dd/mm/yy',
		firstDay: 0,
		isRTL: true,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['he']);
});
