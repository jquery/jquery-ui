/* Inicialització en català per a l'extenció 'calendar' per jQuery. */
/* Writers: (joan.leon@gmail.com). */
jQuery(function($){
	$.datepicker.regional['ca'] = {
		clearText: 'Netejar', clearStatus: '',
		closeText: 'Tancar', closeStatus: '',
		prevText: '&#x3c;Ant', prevStatus: '',
		prevBigText: '&#x3c;&#x3c;', prevBigStatus: '',
		nextText: 'Seg&#x3e;', nextStatus: '',
		nextBigText: '&#x3e;&#x3e;', nextBigStatus: '',
		currentText: 'Avui', currentStatus: '',
		monthNames: ['Gener','Febrer','Mar&ccedil;','Abril','Maig','Juny',
		'Juliol','Agost','Setembre','Octubre','Novembre','Desembre'],
		monthNamesShort: ['Gen','Feb','Mar','Abr','Mai','Jun',
		'Jul','Ago','Set','Oct','Nov','Des'],
		monthStatus: '', yearStatus: '',
		weekHeader: 'Sm', weekStatus: '',
		dayNames: ['Diumenge','Dilluns','Dimarts','Dimecres','Dijous','Divendres','Dissabte'],
		dayNamesShort: ['Dug','Dln','Dmt','Dmc','Djs','Dvn','Dsb'],
		dayNamesMin: ['Dg','Dl','Dt','Dc','Dj','Dv','Ds'],
		dayStatus: 'DD', dateStatus: 'D, M d',
		dateFormat: 'mm/dd/yy', firstDay: 0,
		initStatus: '', isRTL: false};
	$.datepicker.setDefaults($.datepicker.regional['ca']);
});