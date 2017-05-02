/* Norwegian Nynorsk initialisation for the jQuery UI date picker plugin. */
/* Written by Bjørn Johansen (post@bjornjohansen.no). */
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

datepicker.regional.nn = {
	closeText: "Lukk",
	prevText: "&#xAB;Førre",
	nextText: "Neste&#xBB;",
	currentText: "I dag",
	monthNames: [
		"januar",
		"februar",
		"mars",
		"april",
		"mai",
		"juni",
		"juli",
		"august",
		"september",
		"oktober",
		"november",
		"desember"
	],
	monthNamesShort: [ "jan","feb","mar","apr","mai","jun","jul","aug","sep","okt","nov","des" ],
	dayNamesShort: [ "sun","mån","tys","ons","tor","fre","lau" ],
	dayNames: [ "sundag","måndag","tysdag","onsdag","torsdag","fredag","laurdag" ],
	dayNamesMin: [ "su","må","ty","on","to","fr","la" ],
	weekHeader: "Veke",
	dateFormat: "dd.mm.yy",
	firstDay: 1,
	isRTL: false,
	showMonthAfterYear: false,
	yearSuffix: ""
};
datepicker.setDefaults( datepicker.regional.nn );

return datepicker.regional.nn;

},
	typeof global !== "undefined" ? global :
	typeof self !== "undefined" ? self :
	typeof window !== "undefined" ? window :
	{}
) );
