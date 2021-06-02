/* Bosnian i18n for the jQuery UI date picker plugin. */
/* Written by Kenan Konjo. */
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

datepicker.regional.bs = {
	closeText: "Zatvori",
	prevText: "&#x3C;",
	nextText: "&#x3E;",
	currentText: "Danas",
	monthNames: [ "Januar", "Februar", "Mart", "April", "Maj", "Juni",
	"Juli", "August", "Septembar", "Oktobar", "Novembar", "Decembar" ],
	monthNamesShort: [ "Jan", "Feb", "Mar", "Apr", "Maj", "Jun",
	"Jul", "Aug", "Sep", "Okt", "Nov", "Dec" ],
	dayNames: [ "Nedelja", "Ponedeljak", "Utorak", "Srijeda", "Četvrtak", "Petak", "Subota" ],
	dayNamesShort: [ "Ned", "Pon", "Uto", "Sri", "Čet", "Pet", "Sub" ],
	dayNamesMin: [ "Ne", "Po", "Ut", "Sr", "Če", "Pe", "Su" ],
	weekHeader: "Wk",
	dateFormat: "dd.mm.yy",
	firstDay: 1,
	isRTL: false,
	showMonthAfterYear: false,
	yearSuffix: "" };
datepicker.setDefaults( datepicker.regional.bs );

return datepicker.regional.bs;

} );
