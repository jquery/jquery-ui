/* Armenian initialisation for the jQuery UI date picker plugin. */
/* Written by Kostanyan Karen web-armenia.ru),
			  Kostanyan Karen (karenkostanyan89@gmail.com),
			  Kostanyan Karen <karenkostanyan89@gmail.com> */
( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [ "../widgets/datepicker" ], factory );
	} else {

		// Browser globals
		factory( jQuery.datepicker );
	}
}( function( datepicker ) {

datepicker.regional.arm = {
	closeText: "Սերտ",
	prevText: "Նախորդ",
	nextText: "Հաջորդ",
	currentText: "Այս օր",
	monthNames: [ "Հունվար", "Փետրվար", "Մարտ", "Ապրիլ", "Մայիս", "Հունիս",
		"Հուլիս", "Օգոստոս", "Սեպտեմբեր", "Հոկտեմբեր", "Նոյեմբեր", "Դեկտեմբեր" ],
	monthNamesShort: [ "Հուն.", "Փետ.", "Մարտ", "Ապ.", "Մայ.", "Հուն.",
		"Հուլ.", "Օգոս", "Սեպ.", "Հոկ.", "Նոյ.", "եկ." ],
	dayNames: [ "Կիրակի", "Երկուշաբթի", "Երեքշաբթի", "Չորեքշաբթի", "Հինգշաբթի", "Ուրբաթ", "Շաբաթ" ],
	dayNamesShort: [ "Կիր.", "Երկու.", "Երեք.", "Չոր.", "Հինգ.", "Ուրբ.", "Շաբ." ],
	dayNamesMin: [ "Կ","Ե","Ե","Չ","Հ","Ու","Շ" ],
	weekHeader: "Սեպ.",
	dateFormat: "yy-mm-dd",
	firstDay: 1,
	isRTL: false,
	showMonthAfterYear: false,
	yearSuffix: "" };
datepicker.setDefaults( datepicker.regional.arm );

return datepicker.regional.arm;

} ) );
