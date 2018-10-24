/* Persian (Dari) Translation for the jQuery UI date picker plugin. */
/* This is an edit from the copy for datepicker-fa done for Farsi */
/* Hamid Safdari - hamidsafdari22@gmail.com */
( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [ "../widgets/datepicker" ], factory );
	} else {

		// Browser globals
		factory( jQuery.datepicker );
	}
}( function( datepicker ) {

datepicker.regional.fa = {
	closeText: "بستن",
	prevText: "&#x3C;قبلی",
	nextText: "بعدی&#x3E;",
	currentText: "امروز",
	monthNames: [
		"جنوری",
		"فبروری",
		"مارچ",
		"اپریل",
		"می",
		"جون",
		"جولای",
		"آگست",
		"سپتمبر",
		"آکتوبر",
		"نومبر",
		"دیسمبر"
	],
	monthNamesShort: [ "1","2","3","4","5","6","7","8","9","10","11","12" ],
	dayNames: [
		"يکشنبه",
		"دوشنبه",
		"سه‌شنبه",
		"چهارشنبه",
		"پنجشنبه",
		"جمعه",
		"شنبه"
	],
	dayNamesShort: [
		"ی",
		"د",
		"س",
		"چ",
		"پ",
		"ج",
		"ش"
	],
	dayNamesMin: [
		"ی",
		"د",
		"س",
		"چ",
		"پ",
		"ج",
		"ش"
	],
	weekHeader: "هف",
	dateFormat: "yy/mm/dd",
	firstDay: 6,
	isRTL: true,
	showMonthAfterYear: false,
	yearSuffix: "" };
datepicker.setDefaults( datepicker.regional[ "fa-AF" ] );

return datepicker.regional[ "fa-AF" ];

} ) );
