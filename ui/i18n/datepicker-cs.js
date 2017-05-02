/* Czech initialisation for the jQuery UI date picker plugin. */
/* Written by Tomas Muller (tomas@tomas-muller.net). */
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

datepicker.regional.cs = {
	closeText: "Zavřít",
	prevText: "&#x3C;Dříve",
	nextText: "Později&#x3E;",
	currentText: "Nyní",
	monthNames: [ "leden","únor","březen","duben","květen","červen",
	"červenec","srpen","září","říjen","listopad","prosinec" ],
	monthNamesShort: [ "led","úno","bře","dub","kvě","čer",
	"čvc","srp","zář","říj","lis","pro" ],
	dayNames: [ "neděle", "pondělí", "úterý", "středa", "čtvrtek", "pátek", "sobota" ],
	dayNamesShort: [ "ne", "po", "út", "st", "čt", "pá", "so" ],
	dayNamesMin: [ "ne","po","út","st","čt","pá","so" ],
	weekHeader: "Týd",
	dateFormat: "dd.mm.yy",
	firstDay: 1,
	isRTL: false,
	showMonthAfterYear: false,
	yearSuffix: "" };
datepicker.setDefaults( datepicker.regional.cs );

return datepicker.regional.cs;

},
	typeof global !== "undefined" ? global :
	typeof self !== "undefined" ? self :
	typeof window !== "undefined" ? window :
	{}
) );
