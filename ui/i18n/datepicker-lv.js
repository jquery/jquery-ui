/* Latvian (UTF-8) initialisation for the jQuery UI date picker plugin. */
/* @author Arturas Paleicikas <arturas.paleicikas@metasite.net> */
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

datepicker.regional.lv = {
	closeText: "Aizvērt",
	prevText: "Iepr.",
	nextText: "Nāk.",
	currentText: "Šodien",
	monthNames: [ "Janvāris","Februāris","Marts","Aprīlis","Maijs","Jūnijs",
	"Jūlijs","Augusts","Septembris","Oktobris","Novembris","Decembris" ],
	monthNamesShort: [ "Jan","Feb","Mar","Apr","Mai","Jūn",
	"Jūl","Aug","Sep","Okt","Nov","Dec" ],
	dayNames: [
		"svētdiena",
		"pirmdiena",
		"otrdiena",
		"trešdiena",
		"ceturtdiena",
		"piektdiena",
		"sestdiena"
	],
	dayNamesShort: [ "svt","prm","otr","tre","ctr","pkt","sst" ],
	dayNamesMin: [ "Sv","Pr","Ot","Tr","Ct","Pk","Ss" ],
	weekHeader: "Ned.",
	dateFormat: "dd.mm.yy",
	firstDay: 1,
	isRTL: false,
	showMonthAfterYear: false,
	yearSuffix: "" };
datepicker.setDefaults( datepicker.regional.lv );

return datepicker.regional.lv;

},
	typeof global !== "undefined" ? global :
	typeof self !== "undefined" ? self :
	typeof window !== "undefined" ? window :
	{}
) );
