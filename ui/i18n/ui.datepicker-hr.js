/* Croatian i18n for the jQuery UI date picker plugin. */
/* Written by Vjekoslav Nesek. */
jQuery(function($){
	$.datepicker.regional['hr'] = {
		clearText: 'izbriši', clearStatus: 'Izbriši trenutni datum',
		closeText: 'Zatvori', closeStatus: 'Zatvori kalendar',
		prevText: '&#x3c;', prevStatus: 'Prikaži prethodni mjesec',
		prevBigText: '&#x3c;&#x3c;', prevBigStatus: '',
		nextText: '&#x3e;', nextStatus: 'Prikaži slijedeći mjesec',
		nextBigText: '&#x3e;&#x3e;', nextBigStatus: '',
		currentText: 'Danas', currentStatus: 'Današnji datum',
		monthNames: ['Siječanj','Veljača','Ožujak','Travanj','Svibanj','Lipani',
		'Srpanj','Kolovoz','Rujan','Listopad','Studeni','Prosinac'],
		monthNamesShort: ['Sij','Velj','Ožu','Tra','Svi','Lip',
		'Srp','Kol','Ruj','Lis','Stu','Pro'],
		monthStatus: 'Prikaži mjesece', yearStatus: 'Prikaži godine',
		weekHeader: 'Tje', weekStatus: 'Tjedan',
		dayNames: ['Nedjalja','Ponedjeljak','Utorak','Srijeda','Četvrtak','Petak','Subota'],
		dayNamesShort: ['Ned','Pon','Uto','Sri','Čet','Pet','Sub'],
		dayNamesMin: ['Ne','Po','Ut','Sr','Če','Pe','Su'],
		dayStatus: 'Odaber DD za prvi dan tjedna', dateStatus: '\'Datum\' D, M d',
		dateFormat: 'dd.mm.yy.', firstDay: 1,
		initStatus: 'Odaberi datum', isRTL: false};
	$.datepicker.setDefaults($.datepicker.regional['hr']);
});