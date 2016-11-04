/* Estonian initialisation for the jQuery UI date picker plugin. */
/* Written by Mart Sõmermaa (mrts.pydev at gmail com). */
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

datepicker.regional.et = {
	closeText: "Sulge",
	prevText: "Eelnev",
	nextText: "Järgnev",
	currentText: "Täna",
	monthNames: [ "Jaanuar","Veebruar","Märts","Aprill","Mai","Juuni",
	"Juuli","August","September","Oktoober","November","Detsember" ],
	monthNamesShort: [ "Jaan", "Veebr", "Märts", "Apr", "Mai", "Juuni",
	"Juuli", "Aug", "Sept", "Okt", "Nov", "Dets" ],
	dayNames: [
		"Pühapäev",
		"Esmaspäev",
		"Teisipäev",
		"Kolmapäev",
		"Neljapäev",
		"Reede",
		"Laupäev"
	],
	dayNamesShort: [ "Pühap", "Esmasp", "Teisip", "Kolmap", "Neljap", "Reede", "Laup" ],
	dayNamesMin: [ "P","E","T","K","N","R","L" ],
	weekHeader: "näd",
	dateFormat: "dd.mm.yy",
	firstDay: 1,
	isRTL: false,
	showMonthAfterYear: false,
	yearSuffix: "" };
datepicker.setDefaults( datepicker.regional.et );

return datepicker.regional.et;

},
	typeof global !== "undefined" ? global :
	typeof self !== "undefined" ? self :
	typeof window !== "undefined" ? window :
	{}
) );
