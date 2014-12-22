/* Russian (UTF-8) initialisation for the jQuery UI date picker plugin. */
/* Written by Anatoly Mironov (@mirontoli). */
(function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define([ "../datepicker" ], factory );
	} else {

		// Browser globals
		factory( jQuery.datepicker );
	}
}(function( datepicker ) {

datepicker.regional['cv'] = {
	closeText: 'Хуп',
	prevText: '&#x3C;Хыҫа',
	nextText: 'Мала&#x3E;',
	currentText: 'Паян',
	monthNames: ['Кӑрлач','Нарӑс','Пуш','Ака','Ҫу','Ҫӗртме',
	'Утӑ','Ҫурла','Авӑн','Юпа','Чӳк','Раштав'],
	monthNamesShort: ['Кӑр','Нар','Пуш','Ака','Ҫу','Ҫӗр',
	'Утӑ','Ҫур','Авн','Юпа','Чӳк','Раш'],
	dayNames: ['вырсарникун','тунтикун','ытларикун','юнкун','кӗҫнерникун','эрнекун','шӑматкун'],
	dayNamesShort: ['выр','тун','ытл','юнк','кӗҫ','эрн','шӑм'],
	dayNamesMin: ['Вр','Тн','Ыт','Юн','Кҫ','Эр','Шм'],
	weekHeader: 'Эрне',
	dateFormat: 'dd.mm.yy',
	firstDay: 1,
	isRTL: false,
	showMonthAfterYear: false,
	yearSuffix: ''};
datepicker.setDefaults(datepicker.regional['cv']);

return datepicker.regional['cv'];

}));
