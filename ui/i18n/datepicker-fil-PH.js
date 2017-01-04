/* Filipino/Philippines initialisation for the jQuery UI date picker plugin. */
/* Based from en-GB initialisation, revised by Marilou A. Ranoy */
( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [ "../widgets/datepicker" ], factory );
	} else {

		// Browser globals
		factory( jQuery.datepicker );
	}
}( function( datepicker ) {

datepicker.regional[ "fil-PH" ] = {
	closeText: "Tapos Na",
	prevText: "Nakaraan",
	nextText: "Susunod",
	currentText: "Ngayon",
	monthNames: [ "Enero","Pebrero","Marso","Abril","Mayo","Hunyo",
	"Hulyo","Agosto","Setyembre","Oktubre","Nobyembre","Disyembre" ],
	monthNamesShort: [ "Ene", "Peb", "Mar", "Abr", "May", "Hun",
	"Hul", "Ago", "Set", "Okt", "Nob", "Dis" ],
	dayNames: [ "Linggo", "Lunes", "Martes", "Miyerkules", "Huwebes", "Biyernes", "Sabado" ],
	dayNamesShort: [ "Lin", "Lun", "Mar", "Miy", "Huw", "Biy", "Sab" ],
	dayNamesMin: [ "Li","Lu","Ma","Mi","Hu","Bi","Sa" ],
	weekHeader: "Li",
	dateFormat: "mm/dd/yy",
	firstDay: 1,
	isRTL: false,
	showMonthAfterYear: false,
	yearSuffix: "" };
datepicker.setDefaults( datepicker.regional[ "fil-PH" ] );

return datepicker.regional["fil-PH"];

} ) );
