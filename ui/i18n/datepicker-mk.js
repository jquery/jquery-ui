/* Macedonian i18n for the jQuery UI date picker plugin. */
/* Written by Stojce Slavkovski. */
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

datepicker.regional.mk = {
	closeText: "Затвори",
	prevText: "&#x3C;",
	nextText: "&#x3E;",
	currentText: "Денес",
	monthNames: [ "Јануари","Февруари","Март","Април","Мај","Јуни",
	"Јули","Август","Септември","Октомври","Ноември","Декември" ],
	monthNamesShort: [ "Јан","Фев","Мар","Апр","Мај","Јун",
	"Јул","Авг","Сеп","Окт","Ное","Дек" ],
	dayNames: [ "Недела","Понеделник","Вторник","Среда","Четврток","Петок","Сабота" ],
	dayNamesShort: [ "Нед","Пон","Вто","Сре","Чет","Пет","Саб" ],
	dayNamesMin: [ "Не","По","Вт","Ср","Че","Пе","Са" ],
	weekHeader: "Сед",
	dateFormat: "dd.mm.yy",
	firstDay: 1,
	isRTL: false,
	showMonthAfterYear: false,
	yearSuffix: "" };
datepicker.setDefaults( datepicker.regional.mk );

return datepicker.regional.mk;

},
	typeof global !== "undefined" ? global :
	typeof self !== "undefined" ? self :
	typeof window !== "undefined" ? window :
	{}
) );
