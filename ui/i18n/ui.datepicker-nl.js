/* Dutch (UTF-8) initialisation for the jQuery UI date picker plugin. */
/* Written by Mathias Bynens <http://mathiasbynens.be/> */
jQuery(function($){
	$.datepicker.regional.nl = {
		clearText: 'Wissen', clearStatus: 'Wis de huidige datum',
		closeText: 'Sluiten', closeStatus: 'Sluit zonder verandering',
		prevText: '←', prevStatus: 'Bekijk de vorige maand',
		prevBigText: '«', nextBigStatus: 'Bekijk het vorige jaar',
		nextText: '→', nextStatus: 'Bekijk de volgende maand',
		nextBigText: '»', nextBigStatus: 'Bekijk het volgende jaar',
		currentText: 'Vandaag', currentStatus: 'Bekijk de huidige maand',
		monthNames: ['januari', 'februari', 'maart', 'april', 'mei', 'juni',
		'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
		monthNamesShort: ['jan', 'feb', 'maa', 'apr', 'mei', 'jun',
		'jul', 'aug', 'sep', 'okt', 'nov', 'dec'],
		monthStatus: 'Bekijk een andere maand', yearStatus: 'Bekijk een ander jaar',
		weekHeader: 'Wk', weekStatus: 'Week van het jaar',
		dayNames: ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'],
		dayNamesShort: ['zon', 'maa', 'din', 'woe', 'don', 'vri', 'zat'],
		dayNamesMin: ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'],
		dayStatus: 'Stel DD in als eerste dag van de week', dateStatus: 'dd/mm/yy',
		dateFormat: 'dd/mm/yy', firstDay: 1,
		initStatus: 'Kies een datum', isRTL: false};
	$.datepicker.setDefaults($.datepicker.regional.nl);
});