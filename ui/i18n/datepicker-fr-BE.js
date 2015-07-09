/* Belgium-french initialisation for the jQuery UI date picker plugin. */
/* Written by Yevhenii Puzyrenko (puzyrenkoev{at}gmail.com) */
(function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define([ "../datepicker" ], factory );
	} else {

		// Browser globals
		factory( jQuery.datepicker );
	}
}(function( datepicker ) {

	datepicker.regional['fr-BE'] = {
		closeText: 'Fermer',
		prevText: 'Précédent',
		nextText: 'Suivant',
		currentText: 'Aujourd\'hui',
		monthNames: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
			'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
		monthNamesShort: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
			'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
		dayNames: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
		dayNamesShort: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
		dayNamesMin: ['Di', 'Lu', 'Ma', 'Mer', 'Jeu', 'Ve', 'Sa'],
		weekHeader: 'Sem.',
		dateFormat: 'dd/mm/yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	datepicker.setDefaults(datepicker.regional['fr-BE']);

	return datepicker.regional['fr-BE'];

}));
