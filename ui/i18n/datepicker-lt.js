/* Lithuanian (UTF-8) initialisation for the jQuery UI date picker plugin. */
/* @author Arturas Paleicikas <arturas@avalon.lt> */
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

datepicker.regional.lt = {
	closeText: "Uždaryti",
	prevText: "&#x3C;Atgal",
	nextText: "Pirmyn&#x3E;",
	currentText: "Šiandien",
	monthNames: [ "Sausis","Vasaris","Kovas","Balandis","Gegužė","Birželis",
	"Liepa","Rugpjūtis","Rugsėjis","Spalis","Lapkritis","Gruodis" ],
	monthNamesShort: [ "Sau","Vas","Kov","Bal","Geg","Bir",
	"Lie","Rugp","Rugs","Spa","Lap","Gru" ],
	dayNames: [
		"sekmadienis",
		"pirmadienis",
		"antradienis",
		"trečiadienis",
		"ketvirtadienis",
		"penktadienis",
		"šeštadienis"
	],
	dayNamesShort: [ "sek","pir","ant","tre","ket","pen","šeš" ],
	dayNamesMin: [ "Se","Pr","An","Tr","Ke","Pe","Še" ],
	weekHeader: "SAV",
	dateFormat: "yy-mm-dd",
	firstDay: 1,
	isRTL: false,
	showMonthAfterYear: true,
	yearSuffix: "" };
datepicker.setDefaults( datepicker.regional.lt );

return datepicker.regional.lt;

},
	typeof global !== "undefined" ? global :
	typeof self !== "undefined" ? self :
	typeof window !== "undefined" ? window :
	{}
) );
