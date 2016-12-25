/* Swiss Standard German initialisation for the jQuery UI date picker plugin. */
/* Based on German version by Milian Wolff (mail@milianw.de). */
/* Adapted to Swiss Standard German (use "ss" instead of "ß") by MartinGantenbein */
( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [ "../widgets/datepicker" ], factory );
	} else {

		// Browser globals
		factory( jQuery.datepicker );
	}
}( function( datepicker ) {

datepicker.regional[ "de-CH" ] = {
	closeText: "Schliessen",
	prevText: "&#x3C;Zurück",
	nextText: "Vor&#x3E;",
	currentText: "Heute",
	monthNames: [ "Januar","Februar","März","April","Mai","Juni",
	"Juli","August","September","Oktober","November","Dezember" ],
	monthNamesShort: [ "Jan","Feb","Mär","Apr","Mai","Jun",
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
datepicker.setDefaults( datepicker.regional[ "de-CH" ] );

return datepicker.regional[ "de-CH" ];

} ) );
