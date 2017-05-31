/* Sinhala - Sri Lanka initialisation for the jQuery UI date picker plugin. */
/* Written by Dilusha Gonagala - @andrewdex. */
(function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define([ "../datepicker" ], factory );
	} else {

		// Browser globals
		factory( jQuery.datepicker );
	}
}(function( datepicker ) {

datepicker.regional['sh'] = {
	closeText: 'ඉවරයි',
	prevText: 'පෙර',
	nextText: 'ඊලග',
	currentText: 'අද',
	monthNames: ['ජනවාරි','පෙබරවාරි','මාර්තු','අප්‍රේල්','මැයි','ජුනි',
	'ජුලි','අගෝස්තු','සැප්තැම්බර්','ඔක්තෝම්බර්','නොවැම්බර්','දෙසැම්බර්'],
	monthNamesShort: ['ජන', 'පෙබර', 'මාර්තු', 'අප්‍', 'මැයි', 'ජුනි',
	'ජුලි', 'අගෝ', 'සැප්', 'ඔක්', 'නොවැ', 'දෙසැ'],
	dayNames: ['ඉරිදා', 'සදුදා', 'අගහරුවාදා', 'බදාදා', 'බ්‍රහස්පතින්දා', 'සිකුරාදා', 'සෙනසුරාදා'],
	dayNamesShort: ['ඉරි', 'සදු', 'අගහ', 'බදාදා', 'බ්‍රහස්', 'සිකුරා', 'සෙනස'],
	dayNamesMin: ['ඉරි','සදු','අග','බදා','බ්‍රහ','සිකු','සෙන'],
	weekHeader: 'සති',
	dateFormat: 'yy/mm/dd',
	firstDay: 1,
	isRTL: false,
	showMonthAfterYear: false,
	yearSuffix: ''};
datepicker.setDefaults(datepicker.regional['sh']);

return datepicker.regional['sh'];

}));
