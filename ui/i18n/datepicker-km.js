/* Khmer initialisation for the jQuery calendar extension. */
/* Written by Chandara Om (chandara.teacher@gmail.com). */
( function( factory, global ) {
	if (
		typeof require === "function" &&
		typeof exports === "object" &&
		typeof module === "object" ) {

		// CommonJS or Node
		factory( require( "../widgets/datepicker" ) );
	} else if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [ "../widgets/datepicker" ], factory );
	} else {

		// Globals
		factory( global.jQuery.datepicker );
	}
}( function( datepicker ) {

datepicker.regional.km = {
	closeText: "ធ្វើ​រួច",
	prevText: "មុន",
	nextText: "បន្ទាប់",
	currentText: "ថ្ងៃ​នេះ",
	monthNames: [ "មករា","កុម្ភៈ","មីនា","មេសា","ឧសភា","មិថុនា",
	"កក្កដា","សីហា","កញ្ញា","តុលា","វិច្ឆិកា","ធ្នូ" ],
	monthNamesShort: [ "មករា","កុម្ភៈ","មីនា","មេសា","ឧសភា","មិថុនា",
	"កក្កដា","សីហា","កញ្ញា","តុលា","វិច្ឆិកា","ធ្នូ" ],
	dayNames: [ "អាទិត្យ", "ចន្ទ", "អង្គារ", "ពុធ", "ព្រហស្បតិ៍", "សុក្រ", "សៅរ៍" ],
	dayNamesShort: [ "អា", "ច", "អ", "ពុ", "ព្រហ", "សុ", "សៅ" ],
	dayNamesMin: [ "អា", "ច", "អ", "ពុ", "ព្រហ", "សុ", "សៅ" ],
	weekHeader: "សប្ដាហ៍",
	dateFormat: "dd-mm-yy",
	firstDay: 1,
	isRTL: false,
	showMonthAfterYear: false,
	yearSuffix: "" };
datepicker.setDefaults( datepicker.regional.km );

return datepicker.regional.km;

},
	typeof global !== "undefined" ? global :
	typeof self !== "undefined" ? self :
	typeof window !== "undefined" ? window :
	{}
) );
