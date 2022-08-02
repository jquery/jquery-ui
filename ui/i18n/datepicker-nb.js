/* Norwegian Bokmål initialisation for the jQuery UI date picker plugin. */
/* Written by Bjørn Johansen (post@bjornjohansen.no). */
( function( factory ) {
	"use strict";

	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [ "../widgets/datepicker" ], factory );
	} else {

		// Browser globals
		factory( jQuery.datepicker );
	}
} )( function( datepicker ) {
"use strict";

datepicker.regional.nb = {
	closeText: "Lukk",
	prevText: "Forrige",
	nextText: "Neste",
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
	monthNamesShort: [ "jan", "feb", "mar", "apr", "mai", "jun", "jul", "aug", "sep", "okt", "nov", "des" ],
	dayNamesShort: [ "søn", "man", "tir", "ons", "tor", "fre", "lør" ],
	dayNames: [ "søndag", "mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag" ],
	dayNamesMin: [ "sø", "ma", "ti", "on", "to", "fr", "lø" ],
	weekHeader: "Uke",
	dateFormat: "dd.mm.yy",
	firstDay: 1,
	isRTL: false,
	showMonthAfterYear: false,
	yearSuffix: ""
};
datepicker.setDefaults( datepicker.regional.nb );

return datepicker.regional.nb;

} );
