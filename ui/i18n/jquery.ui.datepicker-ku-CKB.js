/* Kurdish Sorani Translation for jQuery UI date picker plugin. (can be used for Kurdish from Iraq and Iran)*/
/* Hozha Koyi -- hozhan@gmail.com */

jQuery(function($){
	$.datepicker.regional['ku-CKB'] = {
		closeText: 'دابخە',
		prevText: '&#x3C;پێشتر',
		nextText: 'داهاتوو&#x3E;',
		currentText: 'ئەمڕۆ',
		monthNames: ['ڕێبەندان', 'ڕەشەمێ', ' نەورۆز', 'گوڵان', 'جۆزەردان', 'پووشپەڕ',
		'خەرمانان', 'گەلاوێژ', 'ڕەزبەر','گەڵارێزان', 'سەرماوەز', 'بەفرانبار'],
		monthNamesShort: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
		dayNames: ['یەکشەممە', 'دووشەممە', 'سێشەممە', 'چوارشەممە', 'پێنجشەممە', 'هەینی', 'شەممە'],
		dayNamesShort: ['یەکشەم', 'دووشەم', 'سێشەم', 'چوارشەم', 'پێنجشەم', 'هەینی', 'شەممە'],
		dayNamesMin: ['یەکشەم', 'دووشەم', 'سێشەم', 'چوارشەم', 'پێنجشەم', 'هەینی', 'شەممە],
		weekHeader: 'حەفتە',
		dateFormat: 'dd/mm/yy',
		firstDay: 6,
  		isRTL: true,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['ku-CKB']);
});
