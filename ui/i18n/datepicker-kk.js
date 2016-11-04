/* Kazakh (UTF-8) initialisation for the jQuery UI date picker plugin. */
/* Written by Dmitriy Karasyov (dmitriy.karasyov@gmail.com). */
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

datepicker.regional.kk = {
	closeText: "Жабу",
	prevText: "&#x3C;Алдыңғы",
	nextText: "Келесі&#x3E;",
	currentText: "Бүгін",
	monthNames: [ "Қаңтар","Ақпан","Наурыз","Сәуір","Мамыр","Маусым",
	"Шілде","Тамыз","Қыркүйек","Қазан","Қараша","Желтоқсан" ],
	monthNamesShort: [ "Қаң","Ақп","Нау","Сәу","Мам","Мау",
	"Шіл","Там","Қыр","Қаз","Қар","Жел" ],
	dayNames: [ "Жексенбі","Дүйсенбі","Сейсенбі","Сәрсенбі","Бейсенбі","Жұма","Сенбі" ],
	dayNamesShort: [ "жкс","дсн","ссн","срс","бсн","жма","снб" ],
	dayNamesMin: [ "Жк","Дс","Сс","Ср","Бс","Жм","Сн" ],
	weekHeader: "Не",
	dateFormat: "dd.mm.yy",
	firstDay: 1,
	isRTL: false,
	showMonthAfterYear: false,
	yearSuffix: "" };
datepicker.setDefaults( datepicker.regional.kk );

return datepicker.regional.kk;

},
	typeof global !== "undefined" ? global :
	typeof self !== "undefined" ? self :
	typeof window !== "undefined" ? window :
	{}
) );
