/* Polish initialisation for the jQuery UI date picker plugin. */
/* Written by Jacek Wysocki (jacek.wysocki@gmail.com). */
jQuery(function($){
	$.datepicker.regional['pl'] = {
		clearText: 'Wyczyść', clearStatus: 'Wyczyść obecną datę',
		closeText: 'Zamknij', closeStatus: 'Zamknij bez zapisywania',
		prevText: '&#x3c;Poprzedni', prevStatus: 'Pokaż poprzedni miesiąc',
		prevBigText: '&#x3c;&#x3c;', prevBigStatus: '',
		nextText: 'Następny&#x3e;', nextStatus: 'Pokaż następny miesiąc',
		nextBigText: '&#x3e;&#x3e;', nextBigStatus: '',
		currentText: 'Dziś', currentStatus: 'Pokaż aktualny miesiąc',
		monthNames: ['Styczeń','Luty','Marzec','Kwiecień','Maj','Czerwiec',
		'Lipiec','Sierpień','Wrzesień','Październik','Listopad','Grudzień'],
		monthNamesShort: ['Sty','Lu','Mar','Kw','Maj','Cze',
		'Lip','Sie','Wrz','Pa','Lis','Gru'],
		monthStatus: 'Pokaż inny miesiąc', yearStatus: 'Pokaż inny rok',
		weekHeader: 'Tydz', weekStatus: 'Tydzień roku',
		dayNames: ['Niedziela','Poniedzialek','Wtorek','Środa','Czwartek','Piątek','Sobota'],
		dayNamesShort: ['Nie','Pn','Wt','Śr','Czw','Pt','So'],
		dayNamesMin: ['N','Pn','Wt','Śr','Cz','Pt','So'],
		dayStatus: 'Ustaw DD jako pierwszy dzień tygodnia', dateStatus: '\'Wybierz\' D, M d',
		dateFormat: 'yy-mm-dd', firstDay: 1,
		initStatus: 'Wybierz datę', isRTL: false};
	$.datepicker.setDefaults($.datepicker.regional['pl']);
});
