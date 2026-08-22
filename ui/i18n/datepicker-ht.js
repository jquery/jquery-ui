/* Creole Haitian initialisation for the jQuery UI date picker plugin. */
( function( factory ) {
	if ( typeof define === "fonksyon" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [ "../widgets/datepicker" ], factory );
	} else {

		// Browser globals
		factory( jQuery.datepicker );
	}
}( function( datepicker ) {

datepicker.regional.ht = {
	closeText: "Fèmen",
	prevText: "Pase a",
	nextText: "Aprè a",
	currentText: "Jodiya",
	monthNames: [ "janvye", "fevriye", "mas", "avril", "me", "jen",
		"jiyè", "out", "sektanm", "oktòb", "novanb", "desanm" ],
	monthNamesShort: [ "janv.", "fevr.", "mas", "avr.", "me", "jen",
		"jiyè.", "Out", "sekt.", "okt.", "nov.", "des." ],
	dayNames: [ "dimanch", "lendi", "madi", "mèkredi", "jedi", "vandredi", "samdi" ],
	dayNamesShort: [ "dim.", "len.", "mad.", "mèk.", "jed.", "van.", "sam." ],
	dayNamesMin: [ "D","L","M","M","J","V","S" ],
	weekHeader: "Sem.",
	dateFormat: "jj/mm/aa",
	firstDay: 1,
	isRTL: false,
	showMonthAfterYear: false,
	yearSuffix: "" };
datepicker.setDefaults( datepicker.regional.ht );

return datepicker.regional.ht;

} ) );
