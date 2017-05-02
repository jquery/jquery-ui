/* Serbian i18n for the jQuery UI date picker plugin. */
/* Written by Dejan Dimić. */
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

datepicker.regional.sr = {
	closeText: "Затвори",
	prevText: "&#x3C;",
	nextText: "&#x3E;",
	currentText: "Данас",
	monthNames: [ "Јануар","Фебруар","Март","Април","Мај","Јун",
	"Јул","Август","Септембар","Октобар","Новембар","Децембар" ],
	monthNamesShort: [ "Јан","Феб","Мар","Апр","Мај","Јун",
	"Јул","Авг","Сеп","Окт","Нов","Дец" ],
	dayNames: [ "Недеља","Понедељак","Уторак","Среда","Четвртак","Петак","Субота" ],
	dayNamesShort: [ "Нед","Пон","Уто","Сре","Чет","Пет","Суб" ],
	dayNamesMin: [ "Не","По","Ут","Ср","Че","Пе","Су" ],
	weekHeader: "Сед",
	dateFormat: "dd.mm.yy",
	firstDay: 1,
	isRTL: false,
	showMonthAfterYear: false,
	yearSuffix: "" };
datepicker.setDefaults( datepicker.regional.sr );

return datepicker.regional.sr;

},
	typeof global !== "undefined" ? global :
	typeof self !== "undefined" ? self :
	typeof window !== "undefined" ? window :
	{}
) );
