/* Myanmar initialisation for the jQuery UI date picker plugin. */
/* Written by Thura Aung (thura.ucsy@gmail.com). */
( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [ "../widgets/datepicker" ], factory );
	} else {

		// Browser globals
		factory( jQuery.datepicker );
	}
}( function( datepicker ) {

datepicker.regional.ja = {
	closeText: "ပိတ်ပါ",
	prevText: "&#x3C;အရှေ့",
	nextText: "အနောက်&#x3E;",
	currentText: "ယခုလ",
	monthNames: [ "1လပိုင်း","2လပိုင်း","3လပိုင်း","4လပိုင်း","5လပိုင်း","6လပိုင်း",
	"7လပိုင်း","8လပိုင်း","9လပိုင်း","10လပိုင်း","11လပိုင်း","12လပိုင်း" ],
	monthNamesShort: [ "1လပိုင်း","2လပိုင်း","3လပိုင်း","4လပိုင်း","5လပိုင်း","6လပိုင်း",
	"7လပိုင်း","8လပိုင်း","9လပိုင်း","10လပိုင်း","11လပိုင်း","12လပိုင်း" ],
	dayNames: [ "တနင်္ဂနွေ","တနင်္လာ","အင်္ဂါ","ဗုဒ္ဓဟူး","ကြာသပတေး","သောကြာ","စနေ" ],
	dayNamesShort: [ "နွေ","လာ","ဂါ","ဟူး","တေး","ကြာ","နေ" ],
	dayNamesShort: [ "နွေ","လာ","ဂါ","ဟူး","တေး","ကြာ","နေ" ],
	weekHeader: "အပတ်",
	dateFormat: "dd/mm/yy",
	firstDay: 0,
	isRTL: false,
	showMonthAfterYear: true,
	yearSuffix: "နှစ်" };
datepicker.setDefaults( datepicker.regional.ma );

return datepicker.regional.ma;

} ) );
