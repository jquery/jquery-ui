/* Japanese (UTF-8) initialisation for the jQuery UI date picker plugin. */
/* Written by Milly. */
jQuery(function($){
	$.datepicker.regional['ja'] = {
		clearText: '&#21066;&#38500;', clearStatus: '',
		closeText: '&#38281;&#12376;&#12427;', closeStatus: '',
		prevText: '&#x3c;&#21069;&#26376;', prevStatus: '',
		prevBigText: '&#x3c;&#x3c;', prevBigStatus: '',
		nextText: '&#27425;&#26376;&#x3e;', nextStatus: '',
		nextBigText: '&#x3e;&#x3e;', nextBigStatus: '',
		currentText: '&#20170;&#26085;', currentStatus: '',
		monthNames: ['1&#26376;','2&#26376;','3&#26376;','4&#26376;','5&#26376;','6&#26376;',
		'7&#26376;','8&#26376;','9&#26376;','10&#26376;','11&#26376;','12&#26376;'],
		monthNamesShort: ['1&#26376;','2&#26376;','3&#26376;','4&#26376;','5&#26376;','6&#26376;',
		'7&#26376;','8&#26376;','9&#26376;','10&#26376;','11&#26376;','12&#26376;'],
		monthStatus: '', yearStatus: '',
		weekHeader: 'Wk', weekStatus: '',
		dayNames: ['&#26085;','&#26376;','&#28779;','&#27700;','&#26408;','&#37329;','&#22303;'],
		dayNamesShort: ['&#26085;','&#26376;','&#28779;','&#27700;','&#26408;','&#37329;','&#22303;'],
		dayNamesMin: ['&#26085;','&#26376;','&#28779;','&#27700;','&#26408;','&#37329;','&#22303;'],
		dayStatus: 'DD', dateStatus: 'D, M d',
		dateFormat: 'yy/mm/dd', firstDay: 0, 
		initStatus: '', isRTL: false};
	$.datepicker.setDefaults($.datepicker.regional['ja']);
});