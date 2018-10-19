/* Tamil (UTF-8) initialisation for the jQuery UI date picker plugin. */
/* Written by S A Sureshkumar (saskumar@live.com). */

/* 

Ticket: #8523 https://bugs.jqueryui.com/ticket/8523 is closed

## Ticket was fixed by M Pitchaimuthu (pitchaimuthu2050 AT GMAIL DOT COM). 
## English Montha Janaury != Thai month. Tamil Calendar is totally different. So English month should be traslated to tamil only  correct translation. English month corresponding Translations were given

*/
( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [ "../widgets/datepicker" ], factory );
	} else {

		// Browser globals
		factory( jQuery.datepicker );
	}
}( function( datepicker ) {

datepicker.regional.ta = {
	closeText: "மூடு",
	prevText: "முன்னையது",
	nextText: "அடுத்தது",
	currentText: "இன்று",
	monthNames: [ "சனவரி","பிப்ரவரி","மார்ச்சு","ஏப்ரல்","மே","சூன்",
	"சூலை","ஆகத்து","செப்டம்பர்","அக்டோபர்","நவம்பர்","திசம்பர்" ],
	monthNamesShort: [ "சன","பிப்","மார்","ஏப்","மே","சூன்",
	"சூலை","ஆக","செப்","அக்","நவ","திச" ],
	dayNames: [
		"ஞாயிற்றுக்கிழமை",
		"திங்கட்கிழமை",
		"செவ்வாய்க்கிழமை",
		"புதன்கிழமை",
		"வியாழக்கிழமை",
		"வெள்ளிக்கிழமை",
		"சனிக்கிழமை"
	],
	dayNamesShort: [
		"ஞாயிறு",
		"திங்கள்",
		"செவ்வாய்",
		"புதன்",
		"வியாழன்",
		"வெள்ளி",
		"சனி"
	],
	dayNamesMin: [ "ஞா","தி","செ","பு","வி","வெ","ச" ],
	weekHeader: "Не",
	dateFormat: "dd/mm/yy",
	firstDay: 1,
	isRTL: false,
	showMonthAfterYear: false,
	yearSuffix: "" };
datepicker.setDefaults( datepicker.regional.ta );

return datepicker.regional.ta;

} ) );
