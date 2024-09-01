/* Punjabi initialisation for the jQuery UI date picker plugin. */
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

datepicker.regional[ "pa" ] = {
	closeText: "ਬੰਦ",
	prevText: "ਪਿਛਲਾ",
	nextText: "ਅਗਲਾ",
	currentText: "ਅੱਜ",
	monthNames: [ "ਜਨਵਰੀ", "ਫਰਵਰੀ", "ਮਾਰਚ", "ਅਪ੍ਰੈਲ", "ਮਈ", "ਜੂਨ",
	"ਜੁਲਾਈ", "ਅਗਸਤ", "ਸਤੰਬਰ", "ਅਕਤੂਬਰ", "ਨਵੰਬਰ", "ਦਸੰਬਰ" ],
	monthNamesShort: [ "ਜਨ", "ਫ਼ਰ", "ਮਾਰ", "ਅਪ੍ਰੈ", "ਮਈ", "ਜੂਨ",
	"ਜੁਲਾ", "ਅਗ", "ਸਤੰ", "ਅਕਤੂ", "ਨਵੰ", "ਦਸੰ" ],
	dayNames: [ "ਐਤਵਾਰ", "ਸੋਮਵਾਰ", "ਮੰਗਲਵਾਰ", "ਬੁੱਧਵਾਰ", "ਵੀਰਵਾਰ", "ਸ਼ੁੱਕਰਵਾਰ", "ਸ਼ਨੀਚਰਵਾਰ" ],
	dayNamesShort: [ "ਐਤ", "ਸੋਮ", "ਮੰਗਲ", "ਬੁੱਧ", "ਵੀਰ", "ਸ਼ੁੱਕਰ", "ਸ਼ਨੀ" ],
	dayNamesMin: [ "ਐ", "ਸੋ", "ਮੰ", "ਬੁੱ", "ਵੀ", "ਸ਼ੁੱ", "ਸ਼" ],
	weekHeader: "ਹਫ਼ਤਾ",
	dateFormat: "dd/mm/yy",
	firstDay: 1,
	isRTL: false,
	showMonthAfterYear: false,
	yearSuffix: "" };
datepicker.setDefaults( datepicker.regional[ "pa" ] );

return datepicker.regional[ "pa" ];

} );
