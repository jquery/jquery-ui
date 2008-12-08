/* Japanese initialisation for the jQuery UI date picker plugin. */
/* Written by Kentaro SATO (kentaro@ranvis.com). */
jQuery(function($){
	$.datepicker.regional['ja'] = {
		clearText: 'クリア', clearStatus: '日付をクリアします',
		closeText: '閉じる', closeStatus: '変更せずに閉じます',
		prevText: '&#x3c;前', prevStatus: '前月を表示します',
		prevBigText: '&#x3c;&#x3c;', prevBigStatus: '前年を表示します',
		nextText: '次&#x3e;', nextStatus: '翌月を表示します',
		nextBigText: '&#x3e;&#x3e;', nextBigStatus: '翌年を表示します',
		currentText: '今日', currentStatus: '今月を表示します',
		monthNames: ['1月','2月','3月','4月','5月','6月',
		'7月','8月','9月','10月','11月','12月'],
		monthNamesShort: ['1月','2月','3月','4月','5月','6月',
		'7月','8月','9月','10月','11月','12月'],
		monthStatus: '表示する月を変更します', yearStatus: '表示する年を変更します',
		weekHeader: '週', weekStatus: '暦週で第何週目かを表します',
		dayNames: ['日曜日','月曜日','火曜日','水曜日','木曜日','金曜日','土曜日'],
		dayNamesShort: ['日','月','火','水','木','金','土'],
		dayNamesMin: ['日','月','火','水','木','金','土'],
		dayStatus: '週の始まりをDDにします', dateStatus: 'Md日(D)',
		dateFormat: 'yy/mm/dd', firstDay: 0,
		initStatus: '日付を選択します', isRTL: false,
		showMonthAfterYear: true};
	$.datepicker.setDefaults($.datepicker.regional['ja']);
});