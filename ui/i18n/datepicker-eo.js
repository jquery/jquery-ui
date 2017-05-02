/* Esperanto initialisation for the jQuery UI date picker plugin. */
/* Written by Olivier M. (olivierweb@ifrance.com). */
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

datepicker.regional.eo = {
	closeText: "Fermi",
	prevText: "&#x3C;Anta",
	nextText: "Sekv&#x3E;",
	currentText: "Nuna",
	monthNames: [ "Januaro","Februaro","Marto","Aprilo","Majo","Junio",
	"Julio","Aŭgusto","Septembro","Oktobro","Novembro","Decembro" ],
	monthNamesShort: [ "Jan","Feb","Mar","Apr","Maj","Jun",
	"Jul","Aŭg","Sep","Okt","Nov","Dec" ],
	dayNames: [ "Dimanĉo","Lundo","Mardo","Merkredo","Ĵaŭdo","Vendredo","Sabato" ],
	dayNamesShort: [ "Dim","Lun","Mar","Mer","Ĵaŭ","Ven","Sab" ],
	dayNamesMin: [ "Di","Lu","Ma","Me","Ĵa","Ve","Sa" ],
	weekHeader: "Sb",
	dateFormat: "dd/mm/yy",
	firstDay: 0,
	isRTL: false,
	showMonthAfterYear: false,
	yearSuffix: "" };
datepicker.setDefaults( datepicker.regional.eo );

return datepicker.regional.eo;

},
	typeof global !== "undefined" ? global :
	typeof self !== "undefined" ? self :
	typeof window !== "undefined" ? window :
	{}
) );
