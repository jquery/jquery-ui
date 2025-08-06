/* Mongolian initialisation for the jQuery UI date picker plugin.
 *
 * Written by Mark Knutsen (mark.knutsen@cru.org)
 */
( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [ "../widgets/datepicker" ], factory );
	} else {

		// Browser globals
		factory( jQuery.datepicker );
	}
}( function( datepicker ) {

datepicker.regional.mn = {
	closeText: "Дууссан", // Done
	prevText: "Өмнөх", // Previous
	nextText: "Дараагийн", // Next
	currentText: "Өнөөдөр", // Today
	monthNames: [ "1 сар","2 сар","3 сар","4 сар","5 сар","6 сар",
	"7 сар","8 сар","9 сар","10 сар","11 сар","12 сар" ],
	monthNamesShort: [ "1 сар","2 сар","3 сар","4 сар","5 сар","6 сар",
	"7 сар","8 сар","9 сар","10 сар","11 сар","12 сар" ],
	dayNames: [ "Ням","Даваа","Мягмар","Лхагва","Пүрэв","Баасан","Бямба" ],
	dayNamesShort: [ "Ням","Дав","Мяг","Лха","Пүр","Баа","Бям" ],
	dayNamesMin: [ "Ня","Да","Мя","Лх","Пү","Ба","Бя" ],
	weekHeader: "Wk", // not translated
	dateFormat: "yy-mm-dd",
	firstDay: 1,
	isRTL: false,
	showMonthAfterYear: true,
	yearSuffix: "" };
datepicker.setDefaults( datepicker.regional.mn );

return datepicker.regional.mn;

} ) );
