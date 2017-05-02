/* Swedish initialisation for the jQuery UI date picker plugin. */
/* Written by Anders Ekdahl ( anders@nomadiz.se). */
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

datepicker.regional.sv = {
	closeText: "Stäng",
	prevText: "&#xAB;Förra",
	nextText: "Nästa&#xBB;",
	currentText: "Idag",
	monthNames: [ "januari","februari","mars","april","maj","juni",
	"juli","augusti","september","oktober","november","december" ],
	monthNamesShort: [ "jan.","feb.","mars","apr.","maj","juni",
	"juli","aug.","sep.","okt.","nov.","dec." ],
	dayNamesShort: [ "sön","mån","tis","ons","tor","fre","lör" ],
	dayNames: [ "söndag","måndag","tisdag","onsdag","torsdag","fredag","lördag" ],
	dayNamesMin: [ "sö","må","ti","on","to","fr","lö" ],
	weekHeader: "Ve",
	dateFormat: "yy-mm-dd",
	firstDay: 1,
	isRTL: false,
	showMonthAfterYear: false,
	yearSuffix: "" };
datepicker.setDefaults( datepicker.regional.sv );

return datepicker.regional.sv;

},
	typeof global !== "undefined" ? global :
	typeof self !== "undefined" ? self :
	typeof window !== "undefined" ? window :
	{}
) );
