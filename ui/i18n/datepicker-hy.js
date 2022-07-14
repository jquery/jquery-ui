/* Armenian(UTF-8) initialisation for the jQuery UI date picker plugin. */
/* Written by Levon Zakaryan (levon.zakaryan@gmail.com)*/
( function( factory ) {
	"use strict";

	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [ "../widgets/datepicker" ], factory );
	} else {

		// Browser globals
		factory( jQuery.datepicker );
	}
} )( function( datepicker ) {
"use strict";

datepicker.regional.hy = {
	closeText: "Փակել",
	prevText: "Նախ.",
	nextText: "Հաջ.",
	currentText: "Այսօր",
	monthNames: [ "Հունվար", "Փետրվար", "Մարտ", "Ապրիլ", "Մայիս", "Հունիս",
	"Հուլիս", "Օգոստոս", "Սեպտեմբեր", "Հոկտեմբեր", "Նոյեմբեր", "Դեկտեմբեր" ],
	monthNamesShort: [ "Հունվ", "Փետր", "Մարտ", "Ապր", "Մայիս", "Հունիս",
	"Հուլ", "Օգս", "Սեպ", "Հոկ", "Նոյ", "Դեկ" ],
	dayNames: [ "կիրակի", "եկուշաբթի", "երեքշաբթի", "չորեքշաբթի", "հինգշաբթի", "ուրբաթ", "շաբաթ" ],
	dayNamesShort: [ "կիր", "երկ", "երք", "չրք", "հնգ", "ուրբ", "շբթ" ],
	dayNamesMin: [ "կիր", "երկ", "երք", "չրք", "հնգ", "ուրբ", "շբթ" ],
	weekHeader: "ՇԲՏ",
	dateFormat: "dd.mm.yy",
	firstDay: 1,
	isRTL: false,
	showMonthAfterYear: false,
	yearSuffix: "" };
datepicker.setDefaults( datepicker.regional.hy );

return datepicker.regional.hy;

} );
