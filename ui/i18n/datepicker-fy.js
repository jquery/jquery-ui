/* Frisian (UTF-8) initialisation for the jQuery UI date picker plugin. */
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

datepicker.regional.fy = {
	closeText: 'Slute',
	prevText: 'Foarige',
	nextText: 'Folgjende',
	currentText: 'Hjoed',
	monthNames: ['jannewaris', 'febrewaris', 'maart', 'april', 'maaie', 'juny',
	'july', 'augustus', 'septimber', 'oktober', 'novimber', 'desimber'],
	monthNamesShort: ['jan', 'feb', 'mrt', 'apr', 'mai', 'jun',
	'jul', 'aug', 'sep', 'okt', 'nov', 'des'],
	dayNames: ['snein', 'moandei', 'tiisdei', 'woansdei', 'tongersdei', 'freed', 'sneon'],
	dayNamesShort: ['sni', 'moa', 'tii', 'woa', 'ton', 'fre', 'sno'],
	dayNamesMin: ['si', 'mo', 'ti', 'wo', 'to', 'fr', 'so'],
	weekHeader: 'Wk',
	dateFormat: 'dd-mm-yy',
	firstDay: 1,
	isRTL: false,
	showMonthAfterYear: false,
	yearSuffix: ''};
datepicker.setDefaults(datepicker.regional.fy);

return datepicker.regional.fy;

}));
