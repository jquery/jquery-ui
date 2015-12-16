/* Ukrainian (UTF-8) initialisation for the jQuery UI date picker plugin. */
/* Written by Oleg Bulatovsky (olegbul1@gmail.com). */
(function (factory) {
	if (typeof define === "function" && define.amd) {

		// AMD. Register as an anonymous module.
		define(["../widgets/datepicker"], factory);
	} else {

		// Browser globals
		factory(jQuery.datepicker);
	}
}(function (datepicker) {

	datepicker.regional.ua = {
		closeText: "Закрити",
		prevText: "&#x3C;<<",
		nextText: ">>&#x3E;",
		currentText: "Сьогодні",
		monthNames: ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень",
		"Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"],
		monthNamesShort: ["Січ", "Лют", "Бер", "Кві", "Тра", "Чер",
		"Лип", "Сер", "Вер", "Жов", "Лис", "Гру"],
		dayNames: ["неділя", "понеділок", "вівторок", "середа", "четвер", "пятниця", "субота"],
		dayNamesShort: ["нед", "пон", "вів", "сер", "чет", "пят", "суб"],
		dayNamesMin: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
		weekHeader: "Пон",
		dateFormat: "dd.mm.yy",
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ""
	};
	datepicker.setDefaults(datepicker.regional.ua);

	return datepicker.regional.ua;
}));
