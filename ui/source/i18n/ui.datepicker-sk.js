/* Slovak initialisation for the jQuery UI date picker plugin. */
/* Written by Vojtech Rinik (vojto@hmm.sk). */
jQuery(function($){
	$.datepicker.regional['sk'] = {clearText: 'Zmazať', clearStatus: '',
		closeText: 'Zavrieť', closeStatus: '',
		prevText: '&lt;Predchádzajúci',  prevStatus: '',
		nextText: 'Nasledujúci&gt;', nextStatus: '',
		currentText: 'Dnes', currentStatus: '',
		monthNames: ['Január','Február','Marec','Apríl','Máj','Jún',
		'Júl','August','September','Október','November','December'],
		monthNamesShort: ['Jan','Feb','Mar','Apr','Máj','Jún',
		'Júl','Aug','Sep','Okt','Nov','Dec'],
		monthStatus: '', yearStatus: '',
		weekHeader: 'Ty', weekStatus: '',
		dayNames: ['Nedel\'a','Pondelok','Utorok','Streda','Štvrtok','Piatok','Sobota'],
		dayNamesShort: ['Ned','Pon','Uto','Str','Štv','Pia','Sob'],
		dayNamesMin: ['Ne','Po','Ut','St','Št','Pia','So'],
		dayStatus: 'DD', dateStatus: 'D, M d',
		dateFormat: 'dd.mm.yy', firstDay: 0, 
		initStatus: '', isRTL: false};
	$.datepicker.setDefaults($.datepicker.regional['sk']);
});
