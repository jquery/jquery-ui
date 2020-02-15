/* Bulgarian initialisation for the jQuery UI date picker plugin. */
/* Written by Stoyan Kyosev (http://svest.org). */
( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [ "../widgets/datepicker" ], factory );
	} else {

		// Browser globals
		factory( jQuery.datepicker );
	}
}( function( datepicker ) {

datepicker.regional.bg = {
	closeText: "Затвори",
	prevText: "&#x3C;Назад",
	nextText: "Напред&#x3E;",
	nextBigText: "&#x3E;&#x3E;",
	currentText: "Днес",
	monthNames: [
        "Януари",
        "Февруари",
        "Март",
        "Април",
        "Май",
        "Юни",
	    "Юли",
        "Август",
        "Септември",
        "Октомври",
        "Ноември",
        "Декември"
    ],
	monthNamesShort: [
        "Ян.",
        "Февр.",
        "Март",
        "Апр.",
        "Май",
        "Юни",
	    "Юли",
        "Авг.",
        "Септ.",
        "Окт.",
        "Ноем.",
        "Дек."
    ],
	dayNames: [
        "Неделя",
        "Понеделник",
        "Вторник",
        "Сряда",
        "Четвъртък",
        "Петък",
        "Събота"
    ],
	dayNamesShort: [
        "Нед.",
        "Пон.",
        "Втор.",
        "Ср.",
        "Четв.",
        "Пет.",
        "Съб."
    ],
	dayNamesMin: [
        "Нд",
        "Пн",
        "Вт",
        "Ср",
        "Чт",
        "Пт",
        "Сб"
    ],
	weekHeader: "Wk",
	dateFormat: "dd.mm.yy",
	firstDay: 1,
	isRTL: false,
	showMonthAfterYear: false,
	yearSuffix: "г." 
};

datepicker.setDefaults( datepicker.regional.bg );

return datepicker.regional.bg;

} ) );
