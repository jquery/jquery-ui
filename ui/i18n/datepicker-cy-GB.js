/* Welsh/UK initialisation for the jQuery UI date picker plugin. */
/* Written by William Griffiths. */
( function( factory, global ) {
	if (
		typeof require === "function" &&
		typeof exports === "object" &&
		typeof module === "object" ) {

		// CommonJS or Node
		factory( require( "../widgets/datepicker" ) );
	} else if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [ "../widgets/datepicker" ], factory );
	} else {

		// Globals
		factory( global.jQuery.datepicker );
	}
}( function( datepicker ) {

datepicker.regional[ "cy-GB" ] = {
	closeText: "Done",
	prevText: "Prev",
	nextText: "Next",
	currentText: "Today",
	monthNames: [ "Ionawr","Chwefror","Mawrth","Ebrill","Mai","Mehefin",
	"Gorffennaf","Awst","Medi","Hydref","Tachwedd","Rhagfyr" ],
	monthNamesShort: [ "Ion", "Chw", "Maw", "Ebr", "Mai", "Meh",
	"Gor", "Aws", "Med", "Hyd", "Tac", "Rha" ],
	dayNames: [
		"Dydd Sul",
		"Dydd Llun",
		"Dydd Mawrth",
		"Dydd Mercher",
		"Dydd Iau",
		"Dydd Gwener",
		"Dydd Sadwrn"
	],
	dayNamesShort: [ "Sul", "Llu", "Maw", "Mer", "Iau", "Gwe", "Sad" ],
	dayNamesMin: [ "Su","Ll","Ma","Me","Ia","Gw","Sa" ],
	weekHeader: "Wy",
	dateFormat: "dd/mm/yy",
	firstDay: 1,
	isRTL: false,
	showMonthAfterYear: false,
	yearSuffix: "" };
datepicker.setDefaults( datepicker.regional[ "cy-GB" ] );

return datepicker.regional[ "cy-GB" ];

},
	typeof global !== "undefined" ? global :
	typeof self !== "undefined" ? self :
	typeof window !== "undefined" ? window :
	{}
) );
