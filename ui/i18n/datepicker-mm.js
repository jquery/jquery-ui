/* ဗမာ/မြန်မာ/Myanmar/Burmese initialisation for the jQuery UI date picker plugin. */
/* Written by Kevin Kyaw -- kthiha3@gmail.com*/
( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [ "../widgets/datepicker" ], factory );
	} else {

		// Browser globals
		factory( jQuery.datepicker );
	}
}( function( datepicker ) {

datepicker.regional.mm = {
	closeText: "ပိတ်ပါ",
	prevText: "နောက်သို့",
	nextText: "ရှေ့သို့",
	currentText: "ယနေ့",
	monthNames: [ "ဇန်နဝါရီလ","ဖေဖော်ဝါရီလ","မတ်လ","ဧပြီလ","မေလ","ဇွန်လ",
	"ဇူလိုင်လ","သြဂုတ်လ","စက်တင်ဘာလ","အောက်တိုဘာလ","နိုဝင်ဘာလ","ဒီဇင်ဘာလ" ],
	monthNamesShort: [ "ဇန်","ဖေ","မတ်","ပြီ","မေ","ဇွန်",
	"ဇူ","ဂုတ်","စက်","အောက်","နို","ဒီ" ],
	dayNames: [
		"တနင်္ဂနွေနေ့",
		"တနင်္လာနေ့",
		"အင်္ဂါနေ့",
		"ဗုဒ္ဓဟူးနေ့",
		"ကြာသပတေးနေ့",
		"သောကြာနေ့",
		"စနေနေ့"
	],
	dayNamesShort: [
		"တနင်္ဂနွေ",
		"တနင်္လာ",
		"အင်္ဂါ",
		"ဗုဒ္ဓဟူး",
		"ကြာသပတေး",
		"သောကြာ",
		"စနေ"
	],
	dayNamesMin: [ "နွေ","လာ","ဂါ","ဟူး","ကြာ","သော","နေ" ],
	weekHeader: "အပတ်",
	dateFormat: "dd/mm/yy",
	firstDay: 1,
	isRTL: false,
	showMonthAfterYear: false,
	yearSuffix: "" };
datepicker.setDefaults( datepicker.regional.mm );

return datepicker.regional.mm;
} ) );
