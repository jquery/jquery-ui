/* Swiss Standard German initialisation for the jQuery UI date picker plugin. */
/* Written by Fomafix <fomafix@googlemail.com> and Siebrand Mazeland <siebrand@kitano.nl>. */
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
	closeText: "schliessen",
	prevText: "&#x3C;zurück",
	nextText: "Vor&#x3E;",
	currentText: "heute",
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
