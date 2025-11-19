/* Bengali initialisation for the jQuery UI date picker plugin. */
/* Written by Fathma Siddique */
( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [ "../widgets/datepicker" ], factory );
	} else {

		// Browser globals
		factory( jQuery.datepicker );
	}
}( function( datepicker ) {

datepicker.regional.bn = {
	closeText: "সমাপ্ত",
	prevText: "পূর্ববর্তী",
	nextText: "পরবর্তী",
	currentText: "আজ",
	monthNames: [ "জানুয়ারী","ফেব্রুয়ারী","মার্চ","এপ্রিল","মে","জুন",
	"জুলাই","অগাস্ট","সেপ্টেম্বর","অক্টোবর","নভেম্বর","ডিসেম্বর" ],
	monthNamesShort: [ "জান", "ফেব", "মার্চ", "এপ্রি", "মে", "জুন",
	"জুল", "আগ", "সেপ্ট", "অক্টো", "নভে", "ডিসে" ],
	dayNames: [ "রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহষ্পতিবার", "শুক্রবার", "শনিবার" ],
	dayNamesShort: [ "রবি", "সোম", "মঙ্গল", "বুধ", "বৃহঃ", "শুক্র", "শনি" ],
	dayNamesMin: [ "র","সো","ম","বু","বৃ","শু","শ" ],
	weekHeader: "সপ্তাহ",
	dateFormat: "dd/mm/yy",
	firstDay: 1,
	isRTL: false,
	showMonthAfterYear: false,
	yearSuffix: "" };
datepicker.setDefaults( datepicker.regional.bn );

return datepicker.regional.bn;

} ) );
