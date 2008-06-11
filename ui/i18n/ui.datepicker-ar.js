/* Arabic Translation for jQuery UI date picker plugin. */
/* Khaled Al Horani -- koko.dw@gmail.com */
/* خالد الحوراني -- koko.dw@gmail.com */
/* NOTE: monthNames are the original months names and thez are the Arabic names, not the new months name فبراير - يناير and there isnät any Arabic roots for these months */
jQuery(function($){
	$.datepicker.regional['ar'] = {
		clearText: 'مسح', clearStatus: 'امسح التاريخ الحالي',
		closeText: 'إغلاق', closeStatus: 'إغلاق بدون حفظ',
		prevText: '<السابق', prevStatus: 'عرض الشهر السابق',
		nextText: 'التالي>', nextStatus: 'عرض الشهر القادم',
		currentText: 'اليوم', currentStatus: 'عرض الشهر الحالي',
		monthNames: ['كانون الثاني', 'شباط', 'آذار', 'نيسان', 'آذار', 'حزيران', 'تموز', 'آب', 'أيلول',	'تشرين الأول', 'تشرين الثاني', 'كانون الأول'],
		monthNamesShort: ['1','2','3','4','5','6','7','8','9','10','11','12'],
		monthStatus: 'عرض شهر آخر', yearStatus: 'عرض سنة آخرى',
		weekHeader: 'أسبوع', weekStatus: 'أسبوع السنة',
		dayNames: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
		dayNamesShort: ['سبت', 'أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة'],
		dayNamesMin: ['سبت', 'أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة'],
		dayStatus: 'اختر DD لليوم الأول من الأسبوع', dateStatus: 'اختر D, M d',
		dateFormat: 'dd/mm/yy', firstDay: 0, 
		initStatus: 'اختر يوم', isRTL: true};
	$.datepicker.setDefaults($.datepicker.regional['ar']);
});