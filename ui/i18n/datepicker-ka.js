/* Georgian (UTF-8) initialisation for the jQuery UI date picker plugin. */
/* Written by Lado Lomidze (lado.lomidze@gmail.com). */
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

datepicker.regional.ka = {
	closeText: "დახურვა",
	prevText: "&#x3c; წინა",
	nextText: "შემდეგი &#x3e;",
	currentText: "დღეს",
	monthNames: [
		"იანვარი",
		"თებერვალი",
		"მარტი",
		"აპრილი",
		"მაისი",
		"ივნისი",
		"ივლისი",
		"აგვისტო",
		"სექტემბერი",
		"ოქტომბერი",
		"ნოემბერი",
		"დეკემბერი"
	],
	monthNamesShort: [ "იან","თებ","მარ","აპრ","მაი","ივნ", "ივლ","აგვ","სექ","ოქტ","ნოე","დეკ" ],
	dayNames: [ "კვირა","ორშაბათი","სამშაბათი","ოთხშაბათი","ხუთშაბათი","პარასკევი","შაბათი" ],
	dayNamesShort: [ "კვ","ორშ","სამ","ოთხ","ხუთ","პარ","შაბ" ],
	dayNamesMin: [ "კვ","ორშ","სამ","ოთხ","ხუთ","პარ","შაბ" ],
	weekHeader: "კვირა",
	dateFormat: "dd-mm-yy",
	firstDay: 1,
	isRTL: false,
	showMonthAfterYear: false,
	yearSuffix: "" };
datepicker.setDefaults( datepicker.regional.ka );

return datepicker.regional.ka;

},
	typeof global !== "undefined" ? global :
	typeof self !== "undefined" ? self :
	typeof window !== "undefined" ? window :
	{}
) );
