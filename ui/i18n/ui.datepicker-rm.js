/* Romansh initialisation for the jQuery UI date picker plugin. */
/* Written by Yvonne Gienal (yvonne.gienal@educa.ch). */
jQuery(function($){
	$.datepicker.regional['rm'] = {
		clearText: 'Stizzar',
    clearStatus: 'Stizzar l’indicaziun da la data',
		closeText: 'Serrar',
    closeStatus: 'Serrar senza midadas',
		prevText: '&#x3c;Suandant',
    prevStatus: 'Guada il mais precedent',
		prevBigText: '&#x3c;&#x3c;',
    prevBigStatus: '',
		nextText: 'Precedent&#x3e;',
    nextStatus: 'Guarda il mais suandant',
		nextBigText: '&#x3e;&#x3e;',
    nextBigStatus: '',
		currentText: 'Actual',
    currentStatus: 'Guarda il mais actual',
		monthNames: ['Schaner','Favrer','Mars','Avrigl','Matg','Zercladur', 'Fanadur','Avust','Settember','October','November','December'],
		monthNamesShort: ['Scha','Fev','Mar','Avr','Matg','Zer', 'Fan','Avu','Sett','Oct','Nov','Dec'],
		monthStatus: 'Guarda in auter mais',
    yearStatus: 'Guarda in auter onn',
		weekHeader: 'emna',
    weekStatus: 'emna actuala',
		dayNames: ['Dumengia','Glindesdi','Mardi','Mesemna','Gievgia','Venderdi','Sonda'],
		dayNamesShort: ['Dum','Gli','Mar','Mes','Gie','Ven','Som'],
		dayNamesMin: ['Du','Gl','Ma','Me','Gi','Ve','So'],
		dayStatus: 'Utilisar DD sco emprim di da l’emna',
    dateStatus: '\'Eleger\' le DD d MM',
		dateFormat: 'dd/mm/yy',
    firstDay: 1,
		initStatus: 'Eleger la data', 
    isRTL: false,
    showMonthAfterYear: false,
    yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['rm']);
});