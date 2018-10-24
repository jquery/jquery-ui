/* Pashto Translation for the jQuery UI date picker plugin. */
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
	closeText: "بندول",
	prevText: "&#x3C;پخوانۍ",
	nextText: "بل&#x3E;",
	currentText: "نن",
	monthNames: [
		"جنوری",
		"فبروری",
		"مارچ",
		"اپریل",
		"می",
		"جون",
		"جولای",
		"آګست",
		"سپتمبر",
		"آکتبر",
		"نومبر",
		"دیسمبر"
	],
	monthNamesShort: [ "1","2","3","4","5","6","7","8","9","10","11","12" ],
	dayNames: [
		"يکشنبه",
		"دوشنبه",
		"سه‌شنبه",
		"چارشنبه",
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
	weekHeader: "او",
	dateFormat: "yy/mm/dd",
	firstDay: 6,
	isRTL: true,
	showMonthAfterYear: false,
	yearSuffix: "" };
datepicker.setDefaults( datepicker.regional.ps );

return datepicker.regional.ps;

} ) );
