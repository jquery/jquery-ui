/* Malaysian initialisation for the jQuery UI date picker plugin. */
/* Written by Mohd Nawawi Mohamad Jamili (nawawi@ronggeng.net). */
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

datepicker.regional.ms = {
	closeText: "Tutup",
	prevText: "&#x3C;Sebelum",
	nextText: "Selepas&#x3E;",
	currentText: "hari ini",
	monthNames: [ "Januari","Februari","Mac","April","Mei","Jun",
	"Julai","Ogos","September","Oktober","November","Disember" ],
	monthNamesShort: [ "Jan","Feb","Mac","Apr","Mei","Jun",
	"Jul","Ogo","Sep","Okt","Nov","Dis" ],
	dayNames: [ "Ahad","Isnin","Selasa","Rabu","Khamis","Jumaat","Sabtu" ],
	dayNamesShort: [ "Aha","Isn","Sel","Rab","kha","Jum","Sab" ],
	dayNamesMin: [ "Ah","Is","Se","Ra","Kh","Ju","Sa" ],
	weekHeader: "Mg",
	dateFormat: "dd/mm/yy",
	firstDay: 0,
	isRTL: false,
	showMonthAfterYear: false,
	yearSuffix: "" };
datepicker.setDefaults( datepicker.regional.ms );

return datepicker.regional.ms;

},
	typeof global !== "undefined" ? global :
	typeof self !== "undefined" ? self :
	typeof window !== "undefined" ? window :
	{}
) );
