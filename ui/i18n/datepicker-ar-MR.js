/* Arabic Translation for jQuery UI date picker plugin. */
/* Based on Common Locale Data Repository (CLDR) data v25 by unicode.org. */
/* Written by Mohammed Alshehri -- m@dralshehri.com */

(function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define([ "../datepicker" ], factory );
	} else {

		// Browser globals
		factory( jQuery.datepicker );
	}
}(function( datepicker ) {

datepicker.regional['ar-MR'] = {
	closeText: 'إغلاق',
	prevText: '&#x3C;السابق',
	nextText: 'التالي&#x3E;',
	currentText: 'اليوم',
	monthNames: ['يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو',
	'يوليو', 'أغشت', 'شتمبر', 'أكتوبر', 'نوفمبر', 'دجمبر'],
	monthNamesShort: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
	dayNames: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
	dayNamesShort: ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'],
	dayNamesMin: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
	weekHeader: 'أسبوع',
	dateFormat: 'dd/mm/yyyy',
	firstDay: 0,
		isRTL: true,
	showMonthAfterYear: false,
	yearSuffix: ''};
datepicker.setDefaults(datepicker.regional['ar-MR']);

return datepicker.regional['ar-MR'];

}));
