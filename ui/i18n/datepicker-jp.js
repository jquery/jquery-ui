/* Japanese initialisation for the jQuery UI date picker plugin. */
/* Translated by Nguyen Kha Nam (khanamdev@gmail.com). */
( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [ "../widgets/datepicker" ], factory );
	} else {

		// Browser globals
		factory( jQuery.datepicker );
	}
}( function( datepicker ) {

datepicker.regional.jp = {
	closeText: "閉じる",
	prevText: "&#x3C;前",
	nextText: "次&#x3E;",
	currentText: "今日",
	monthNames: [ " 一月", "二月", "三月", "四月", "五月", "六月",
	"七月", "八月", "九月", "十月", "十一月", "十二月" ],
	monthNamesShort: [ "1月", "2月", "3月", "4月", "5月", "6月",
	"7月", "8月", "9月", "10月", "11月", "12月" ],
	dayNames: [ "日曜日", "月曜", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日", "日曜日" ],
	dayNamesShort: [ "日", "月", "火", "水", "木", "金", "土", "日" ],
	dayNamesMin: [ "日", "月", "火", "水", "木", "金", "土", "日" ],
	weekHeader: "週間",
	dateFormat: "dd/mm/yy",
	firstDay: 0,
	isRTL: false,
	showMonthAfterYear: false,
	yearSuffix: "" };
datepicker.setDefaults( datepicker.regional.jp );

return datepicker.regional.jp;

} ) );
