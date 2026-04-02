/* Mongolian (UTF-8) initialisation for the jQuery UI date picker plugin. */
/* Written by jQuery UI contributors. */
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

datepicker.regional.mn = {
	closeText: "Хаах",
	prevText: "Өмнөх",
	nextText: "Дараах",
	currentText: "Өнөөдөр",
	monthNames: [ "Нэгдүгээр сар", "Хоёрдугаар сар", "Гуравдугаар сар", "Дөрөвдүгээр сар", "Тавдугаар сар", "Зургаадугаар сар",
	"Долоодугаар сар", "Наймдугаар сар", "Есдүгээр сар", "Аравдугаар сар", "Арваннэгдүгээр сар", "Арванхоёрдугаар сар" ],
	monthNamesShort: [ "1-р сар", "2-р сар", "3-р сар", "4-р сар", "5-р сар", "6-р сар",
	"7-р сар", "8-р сар", "9-р сар", "10-р сар", "11-р сар", "12-р сар" ],
	dayNames: [ "ням", "даваа", "мягмар", "лхагва", "пүрэв", "баасан", "бямба" ],
	dayNamesShort: [ "Ня", "Да", "Мя", "Лх", "Пү", "Ба", "Бя" ],
	dayNamesMin: [ "Ня", "Да", "Мя", "Лх", "Пү", "Ба", "Бя" ],
	weekHeader: "7х",
	dateFormat: "yy-mm-dd",
	firstDay: 1,
	isRTL: false,
	showMonthAfterYear: false,
	yearSuffix: "" };
datepicker.setDefaults( datepicker.regional.mn );

return datepicker.regional.mn;

} );
