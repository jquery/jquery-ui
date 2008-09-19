/* Czech initialisation for the jQuery UI date picker plugin. */
/* Written by Tomas Muller (tomas@tomas-muller.net). */
jQuery(function($){
	$.datepicker.regional['cs'] = {
		clearText: 'Vymazat', clearStatus: 'Vymaže zadané datum',
		closeText: 'Zavřít',  closeStatus: 'Zavře kalendář beze změny',
		prevText: '&#x3c;Dříve', prevStatus: 'Přejít na předchozí měsí',
		prevBigText: '&#x3c;&#x3c;', prevBigStatus: '',
		nextText: 'Později&#x3e;', nextStatus: 'Přejít na další měsíc',
		nextBigText: '&#x3e;&#x3e;', nextBigStatus: '',
		currentText: 'Nyní', currentStatus: 'Přejde na aktuální měsíc',
		monthNames: ['leden','únor','březen','duben','květen','červen',
        'červenec','srpen','září','říjen','listopad','prosinec'],
		monthNamesShort: ['led','úno','bře','dub','kvě','čer',
		'čvc','srp','zář','říj','lis','pro'],
		monthStatus: 'Přejít na jiný měsíc', yearStatus: 'Přejít na jiný rok',
		weekHeader: 'Týd', weekStatus: 'Týden v roce',
		dayNames: ['neděle', 'pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek', 'sobota'],
		dayNamesShort: ['ne', 'po', 'út', 'st', 'čt', 'pá', 'so'],
		dayNamesMin: ['ne','po','út','st','čt','pá','so'],
		dayStatus: 'Nastavit DD jako první den v týdnu', dateStatus: '\'Vyber\' DD, M d',
		dateFormat: 'dd.mm.yy', firstDay: 1, 
		initStatus: 'Vyberte datum', isRTL: false};
	$.datepicker.setDefaults($.datepicker.regional['cs']);
});
