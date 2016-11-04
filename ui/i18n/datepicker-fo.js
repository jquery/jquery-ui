/* Faroese initialisation for the jQuery UI date picker plugin */
/* Written by Sverri Mohr Olsen, sverrimo@gmail.com */
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

datepicker.regional.fo = {
	closeText: "Lat aftur",
	prevText: "&#x3C;Fyrra",
	nextText: "Næsta&#x3E;",
	currentText: "Í dag",
	monthNames: [ "Januar","Februar","Mars","Apríl","Mei","Juni",
	"Juli","August","September","Oktober","November","Desember" ],
	monthNamesShort: [ "Jan","Feb","Mar","Apr","Mei","Jun",
	"Jul","Aug","Sep","Okt","Nov","Des" ],
	dayNames: [
		"Sunnudagur",
		"Mánadagur",
		"Týsdagur",
		"Mikudagur",
		"Hósdagur",
		"Fríggjadagur",
		"Leyardagur"
	],
	dayNamesShort: [ "Sun","Mán","Týs","Mik","Hós","Frí","Ley" ],
	dayNamesMin: [ "Su","Má","Tý","Mi","Hó","Fr","Le" ],
	weekHeader: "Vk",
	dateFormat: "dd-mm-yy",
	firstDay: 1,
	isRTL: false,
	showMonthAfterYear: false,
	yearSuffix: "" };
datepicker.setDefaults( datepicker.regional.fo );

return datepicker.regional.fo;

},
	typeof global !== "undefined" ? global :
	typeof self !== "undefined" ? self :
	typeof window !== "undefined" ? window :
	{}
) );
