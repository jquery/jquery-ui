/* Azerbaijani (UTF-8) initialisation for the jQuery UI date picker plugin. */
/* Written by Jamil Najafov (necefov33@gmail.com). */
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

datepicker.regional.az = {
	closeText: "Bağla",
	prevText: "Geri",
	nextText: "İrəli",
	currentText: "Bugün",
	monthNames: [ "Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun",
	"İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr" ],
	monthNamesShort: [ "Yan", "Fev", "Mar", "Apr", "May", "İyun",
	"İyul", "Avq", "Sen", "Okt", "Noy", "Dek" ],
	dayNames: [ "Bazar", "Bazar ertəsi", "Çərşənbə axşamı", "Çərşənbə", "Cümə axşamı", "Cümə", "Şənbə" ],
	dayNamesShort: [ "B", "Be", "Ça", "Ç", "Ca", "C", "Ş" ],
	dayNamesMin: [ "B", "B", "Ç", "С", "Ç", "C", "Ş" ],
	weekHeader: "Hf",
	dateFormat: "dd.mm.yy",
	firstDay: 1,
	isRTL: false,
	showMonthAfterYear: false,
	yearSuffix: "" };
datepicker.setDefaults( datepicker.regional.az );

return datepicker.regional.az;

} );
