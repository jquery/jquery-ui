/* Austrian initialisation for the jQuery UI date picker plugin. */
/* Written by Michael Stieler (github.com/stieler-it), only slightly adapted from
   the German version by Milian Wolff (mail@milianw.de). */
( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [ "../widgets/datepicker" ], factory );
	} else {

		// Browser globals
		factory( jQuery.datepicker );
	}
}( function( datepicker ) {

datepicker.regional["de-at"] = {
	closeText: "Schließen",
	prevText: "&#x3C;Zurück",
	nextText: "Vor&#x3E;",
	currentText: "Heute",
	monthNames: [ "Jänner","Februar","März","April","Mai","Juni",
	"Juli","August","September","Oktober","November","Dezember" ],
	monthNamesShort: [ "Jän","Feb","Mär","Apr","Mai","Jun",
	"Jul","Aug","Sep","Okt","Nov","Dez" ],
	dayNames: [ "Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag" ],
	dayNamesShort: [ "So","Mo","Di","Mi","Do","Fr","Sa" ],
	dayNamesMin: [ "So","Mo","Di","Mi","Do","Fr","Sa" ],
	weekHeader: "KW",
	dateFormat: "dd.mm.yy",
	firstDay: 1,
	isRTL: false,
	showMonthAfterYear: false,
	yearSuffix: "" };
datepicker.setDefaults( datepicker.regional["de-at"] );

return datepicker.regional["de-at"];

} ) );
