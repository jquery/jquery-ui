/* Tagalog Phillipines initialization for the jQuery UI date picker plugin. */
/* Written by Richard Guan (github: richguan) */
(function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define([ "../datepicker" ], factory );
	} else {

		// Browser globals
		factory( jQuery.datepicker );
	}
}(function( datepicker ) {

datepicker.regional['tl'] = {
	closeText: 'Tapos',
	prevText: 'Nakaraan',
	nextText: 'Susunod;',
	currentText: 'Ngayon',
	monthNames: ['Enero','Pebrero','Marso','Abril','Mayo','Hunyo',
	'Hulyo','Agosto','Septiyembre','Oktubre','Nobiyembre','Disyembre'],
	monthNamesShort: ['Ene','Peb','Mar','Abr','May','Hun',
	'Hul','Ago','Sep','Okt','Nob','Dis'],
	dayNamesShort: ['Lin','Lun','Mar','Miy','Huw','Biy','Sab'],
	dayNames: ['Linggo','Lunes','Martes','Miyerkoles','Huwebes','Biyernes','Sabado'],
	dayNamesMin: ['Li','Lu','Ma','Mi','Hu','Bi','Sa'],
	weekHeader: 'lg',
	dateFormat: 'mm/dd/yy',
	firstDay: 1,
	isRTL: false,
	showMonthAfterYear: false,
	yearSuffix: ''
};
datepicker.setDefaults(datepicker.regional['tl']);

return datepicker.regional['tl'];

}));
