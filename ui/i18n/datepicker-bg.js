/* Bulgarian initialisation for the jQuery UI date picker plugin. */
/* Written by Stoyan Kyosev (http://svest.org). */
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

datepicker.regional.bg = {
	closeText: "затвори",
	prevText: "&#x3C;назад",
	nextText: "напред&#x3E;",
	nextBigText: "&#x3E;&#x3E;",
	currentText: "днес",
	monthNames: [ "Януари","Февруари","Март","Април","Май","Юни",
	"Юли","Август","Септември","Октомври","Ноември","Декември" ],
	monthNamesShort: [ "Яну","Фев","Мар","Апр","Май","Юни",
	"Юли","Авг","Сеп","Окт","Нов","Дек" ],
	dayNames: [ "Неделя","Понеделник","Вторник","Сряда","Четвъртък","Петък","Събота" ],
	dayNamesShort: [ "Нед","Пон","Вто","Сря","Чет","Пет","Съб" ],
	dayNamesMin: [ "Не","По","Вт","Ср","Че","Пе","Съ" ],
	weekHeader: "Wk",
	dateFormat: "dd.mm.yy",
	firstDay: 1,
	isRTL: false,
	showMonthAfterYear: false,
	yearSuffix: "" };
datepicker.setDefaults( datepicker.regional.bg );

return datepicker.regional.bg;

},
	typeof global !== "undefined" ? global :
	typeof self !== "undefined" ? self :
	typeof window !== "undefined" ? window :
	{}
) );
