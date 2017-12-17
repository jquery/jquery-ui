/* Kabyle initialisation for the jQuery UI date picker plugin. */
/* Written by Nabil SEMAOUNE (nabil509@gmail.com). */
( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [ "../widgets/datepicker" ], factory );
	} else {

		// Browser globals
		factory( jQuery.datepicker );
	}
}( function( datepicker ) {

datepicker.regional.kab = {
	closeText: "Immed",
	prevText: "Uɣal",
	nextText: "Aẓ",
	currentText: "Ass-a",
	monthNames: [ "Yennayer","Fuṛaṛ","Maɣres","Yebrir","Mayu","Yunyu",
	"Yulyu","Γuct","Ctembeṛ", "Tubeṛ", "Nwembeṛ", "Dujembeṛ" ],
	monthNamesShort: [ "Yen", "Fuṛ", "Maɣ", "Yeb", "May", "Yun",
	"Yul", "Γuc", "Cte", "Tub", "Nwe", "Duj" ],
	dayNames: [ "Acer", "Arim", "Aram", "Ahad", "Amhad", "Sem", "Sed" ],
	dayNamesShort: [ "Ace", "Ari", "Ara", "Aha", "Amh", "Sem", "Sed" ],
	dayNamesMin: [ "C","R","R","H","M","S","S" ],
	weekHeader: "Dṛt",
	dateFormat: "dd/mm/yy",
	firstDay: 0,
	isRTL: false,
	showMonthAfterYear: false,
	yearSuffix: "" };
datepicker.setDefaults( datepicker.regional.kab );

return datepicker.regional.kab;

} ) );
