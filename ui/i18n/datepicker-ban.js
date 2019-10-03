/* Bangla initialisation for the jQuery UI date picker plugin. */
/* Written by Fathma <siddiquefathma@gmail.com> */
( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [ "../widgets/datepicker" ], factory );
	} else {

		// Browser globals
		factory( jQuery.datepicker );
	}
}( function( datepicker ) {

datepicker.regional[ "ban" ] = {
	closeText: "সম্পন্ন",
	prevText:"পূর্ববর্তী",
	nextText: "পরবর্তী",
	currentText: "আজ",
	monthNames: [ "জানুয়ারী","ফেব্রুয়ারী","মার্চ","এপ্রিল","মে","জুন",
	"জুলাই","আগস্ট ","সেপ্টেম্বর","অক্টোবর","নভেম্বর","ডিসেম্বর" ],
	monthNamesShort: [ "জান", "ফেব", "মার্চ", "এপ্রি", "মে", "জুন",
	"জুল", "আগ", "সেপ্ট", "অক্ট", "নভ", "ডিস" ],
	dayNames: [ "রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার" ],
	dayNamesShort: [ "রবি", "সোম", "মঙ্গল", "বুধ", "বৃহস্পতি", "শুক্র", "শনি" ],
	dayNamesMin: [ "রবি","সোম","মঙ্গল","বুধ","বৃহ","শুক্র","শনি" ],
	weekHeader: "সপ্তাহ",
	dateFormat: "dd/mm/yy",
	firstDay: 1,
	isRTL: false,
	showMonthAfterYear: false,
	yearSuffix: "" };
datepicker.setDefaults( datepicker.regional[ "ban" ] );

return datepicker.regional[ "ban" ];

} ) );