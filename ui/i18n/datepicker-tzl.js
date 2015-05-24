/* Talossan (UTF-8) initialisation for the jQuery UI date picker plugin. */
/* Written by Robin van der Vliet <http://robinvandervliet.com/> */
(function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define([ "../datepicker" ], factory );
	} else {

		// Browser globals
		factory( jQuery.datepicker );
	}
}(function( datepicker ) {

datepicker.regional.tzl = {
	closeText: 'Fermarh',
	prevText: 'Previös',
	nextText: 'Próxim',
	currentText: 'Oxhi',
	monthNames: ['Januar', 'Fevraglh', 'Marta', 'Avríu', 'Mai', 'Gün',
	'Julia', 'Guscht', 'Setemvar', 'Listopäts', 'Noemvar', 'Zecemvar'],
	monthNamesShort: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Gün',
	'Jul', 'Gus', 'Set', 'Lis', 'Noe', 'Zec'],
	dayNames: ['Súladi', 'Lúneçi', 'Maitzi', 'Márcuri', 'Xhúadi', 'Viénerçi', 'Sáturi'],
	dayNamesShort: ['Súl', 'Lún', 'Mai', 'Már', 'Xhú', 'Vié', 'Sát'],
	dayNamesMin: ['Sú', 'Lú', 'Ma', 'Má', 'Xh', 'Vi', 'Sá'],
	weekHeader: 'Sz',
	dateFormat: 'dd.mm.yy',
	firstDay: 1,
	isRTL: false,
	showMonthAfterYear: false,
	yearSuffix: ''};
datepicker.setDefaults(datepicker.regional.tzl);

return datepicker.regional.tzl;

}));
