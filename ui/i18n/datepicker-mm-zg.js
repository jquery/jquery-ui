/*
 * Myanmar/ZAWGYI initialisation for the jQuery UI date picker plugin.
 * Author: Thiha Thit | github/thihathit
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

datepicker.regional[ "mm-ZG" ] = {
	closeText: "ပိတ္ပါ",
	prevText: "ေရွ႕သို႔",
	nextText: "ေနာက္သို႔",
	currentText: "ယေန့",
	monthNames: ["ဇန္နဝါရီလ","ေဖေဖာ္ဝါရီလ","မတ္လ","ဧျပီလ","ေမလ","ဇြန္္လ","ဇူလိုင္လ","ဩဂုတ္လ","စက္တင္ဘာလ","ေအာက္တိုဘာလ","နိုဝင္ဘာလ","ဒီဇင္ဘာလ"],
	monthNamesShort: ["ဇန္နဝါရီ","ေဖေဖာ္ဝါရီ","မတ္","ဧျပီ","ေမ","ဇြန္္","ဇူလိုင္","ဩဂုတ္","စက္တင္ဘာ","ေအာက္တိုဘာ","နိုဝင္ဘာ","ဒီဇင္ဘာ"],
	dayNames: ["တနဂၤေႏြေန႔","တနလၤာေန႔","အဂၤါေန႔","ဗုဒၶဟူးေန႔","ၾကာသာပေတးေန႔","ေသာၾကာေန႔","စေနေန႔"],
	dayNamesShort: ["တနဂၤေႏြ","တနလၤာ","အဂၤါ","ဗုဒၶဟူး","ၾကာသာပေတး","ေသာၾကာ","စေန"],
	dayNamesMin: ["တနဂၤေႏြ","တနလၤာ","အဂၤါ","ဗုဒၶဟူး","ၾကာသာပေတး","ေသာၾကာ","စေန"],
	weekHeader: "အပတ္",
	dateFormat: "နေ့/လ/ႏွစ္",
	firstDay: 2,
	isRTL: false,
	showMonthAfterYear: false,
	yearSuffix: "" };
datepicker.setDefaults( datepicker.regional[ "mm-ZG" ] );

return datepicker.regional[ "mm-ZG" ];

} ) );
