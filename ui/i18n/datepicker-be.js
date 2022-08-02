/* Belarusian initialisation for the jQuery UI date picker plugin. */
/* Written by Pavel Selitskas <p.selitskas@gmail.com> */
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

datepicker.regional.be = {
	closeText: "Зачыніць",
	prevText: "Папяр.",
	nextText: "Наст.",
	currentText: "Сёньня",
	monthNames: [ "Студзень", "Люты", "Сакавік", "Красавік", "Травень", "Чэрвень",
	"Ліпень", "Жнівень", "Верасень", "Кастрычнік", "Лістапад", "Сьнежань" ],
	monthNamesShort: [ "Сту", "Лют", "Сак", "Кра", "Тра", "Чэр",
	"Ліп", "Жні", "Вер", "Кас", "Ліс", "Сьн" ],
	dayNames: [ "нядзеля", "панядзелак", "аўторак", "серада", "чацьвер", "пятніца", "субота" ],
	dayNamesShort: [ "ндз", "пнд", "аўт", "срд", "чцв", "птн", "сбт" ],
	dayNamesMin: [ "Нд", "Пн", "Аў", "Ср", "Чц", "Пт", "Сб" ],
	weekHeader: "Тд",
	dateFormat: "dd.mm.yy",
	firstDay: 1,
	isRTL: false,
	showMonthAfterYear: false,
	yearSuffix: "" };
datepicker.setDefaults( datepicker.regional.be );

return datepicker.regional.be;

} );
