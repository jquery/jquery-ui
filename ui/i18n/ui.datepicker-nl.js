/* Dutch (UTF-8) initialisation for the jQuery UI date picker plugin. */
/* Written by ??? */
jQuery(function($){
	$.datepicker.regional['nl'] = {
		clearText: 'Wissen', clearStatus: 'Wis de huidige datum',
		closeText: 'Sluiten', closeStatus: 'Sluit zonder verandering',
		prevText: '&#x3c;Terug', prevStatus: 'Laat de voorgaande maand zien',
		prevBigText: '&#x3c;&#x3c;', prevBigStatus: '',
		nextText: 'Volgende&#x3e;', nextStatus: 'Laat de volgende maand zien',
		nextBigText: '&#x3e;&#x3e;', nextBigStatus: '',
		currentText: 'Vandaag', currentStatus: 'Laat de huidige maand zien',
		monthNames: ['Januari','Februari','Maart','April','Mei','Juni',
		'Juli','Augustus','September','Oktober','November','December'],
		monthNamesShort: ['Jan','Feb','Mrt','Apr','Mei','Jun',
		'Jul','Aug','Sep','Okt','Nov','Dec'],
		monthStatus: 'Laat een andere maand zien', yearStatus: 'Laat een ander jaar zien',
		weekHeader: 'Wk', weekStatus: 'Week van het jaar',
		dayNames: ['Zondag','Maandag','Dinsdag','Woensdag','Donderdag','Vrijdag','Zaterdag'],
		dayNamesShort: ['Zon','Maa','Din','Woe','Don','Vri','Zat'],
		dayNamesMin: ['Zo','Ma','Di','Wo','Do','Vr','Za'],
		dayStatus: 'DD', dateStatus: 'D, M d',
		dateFormat: 'dd.mm.yy', firstDay: 1, 
		initStatus: 'Kies een datum', isRTL: false};
	$.datepicker.setDefaults($.datepicker.regional['nl']);
});