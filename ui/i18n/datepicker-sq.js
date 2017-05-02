/* Albanian initialisation for the jQuery UI date picker plugin. */
/* Written by Flakron Bytyqi (flakron@gmail.com). */
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

datepicker.regional.sq = {
	closeText: "mbylle",
	prevText: "&#x3C;mbrapa",
	nextText: "Përpara&#x3E;",
	currentText: "sot",
	monthNames: [ "Janar","Shkurt","Mars","Prill","Maj","Qershor",
	"Korrik","Gusht","Shtator","Tetor","Nëntor","Dhjetor" ],
	monthNamesShort: [ "Jan","Shk","Mar","Pri","Maj","Qer",
	"Kor","Gus","Sht","Tet","Nën","Dhj" ],
	dayNames: [ "E Diel","E Hënë","E Martë","E Mërkurë","E Enjte","E Premte","E Shtune" ],
	dayNamesShort: [ "Di","Hë","Ma","Më","En","Pr","Sh" ],
	dayNamesMin: [ "Di","Hë","Ma","Më","En","Pr","Sh" ],
	weekHeader: "Ja",
	dateFormat: "dd.mm.yy",
	firstDay: 1,
	isRTL: false,
	showMonthAfterYear: false,
	yearSuffix: "" };
datepicker.setDefaults( datepicker.regional.sq );

return datepicker.regional.sq;

},
	typeof global !== "undefined" ? global :
	typeof self !== "undefined" ? self :
	typeof window !== "undefined" ? window :
	{}
) );
