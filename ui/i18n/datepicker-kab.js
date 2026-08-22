/* Kabyle initialisation for the jQuery UI date picker plugin. */
/* Written by Belkacem Mohammed <belkacem77@gmail.com>),
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

datepicker.regional.kab = {
	closeText: "Mdel",
	prevText: "Ar deffir",
	nextText: "Ar zdat",
	currentText: "Ass-a",
	monthNames: [ "yennayer", "fuṛar", "meɣres", "yebrir", "mayyu", "yunyu",
		"yulyu", "ɣuct", "ctember", "tuber", "wamber", "dujember" ],
	monthNamesShort: [ "yen.", "fur.", "meɣ.", "yeb.", "may.", "yun.",
		"yul.", "ɣuc.", "cte.", "tub.", "wam.", "duj." ],
	dayNames: [ "acer", "arim", "aram", "ahad", "amhad", "sem", "sed" ],
	dayNamesShort: [ "ace.", "ari.", "ara.", "aha.", "amh.", "sem.", "sed." ],
	dayNamesMin: [ "C","R","A","H","M","S","D" ],
	weekHeader: "Amls.",
	dateFormat: "dd/mm/yy",
	firstDay: 1,
	isRTL: false,
	showMonthAfterYear: false,
	yearSuffix: "" };
datepicker.setDefaults( datepicker.regional.kab );

return datepicker.regional.kab;

} ) );
