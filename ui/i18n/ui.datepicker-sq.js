/* Albanian initialisation for the jQuery UI date picker plugin. */
/* Written by Flakron Bytyqi (flakron@gmail.com). */
jQuery(function($){
	$.datepicker.regional['sq'] = {
		clearText: 'fshije', clearStatus: 'fshije datën aktuale',
		closeText: 'mbylle', closeStatus: 'mbylle pa ndryshime',
		prevText: '&#x3c;mbrapa', prevStatus: 'trego muajin e fundit',
		prevBigText: '&#x3c;&#x3c;', prevBigStatus: '',
		nextText: 'Përpara&#x3e;', nextStatus: 'trego muajin tjetër',
		nextBigText: '&#x3e;&#x3e;', nextBigStatus: '',
		currentText: 'sot', currentStatus: '',
		monthNames: ['Janar','Shkurt','Mars','Pril','Maj','Qershor',
		'Korrik','Gusht','Shtator','Tetor','Nëntor','Dhjetor'],
		monthNamesShort: ['Jan','Shk','Mar','Pri','Maj','Qer',
		'Kor','Gus','Sht','Tet','Nën','Dhj'],
		monthStatus: 'trego muajin tjetër', yearStatus: 'trego tjetër vit',
		weekHeader: 'Ja', weekStatus: 'Java e muajit',
		dayNames: ['E Diel','E Hënë','E Martë','E Mërkurë','E Enjte','E Premte','E Shtune'],
		dayNamesShort: ['Di','Hë','Ma','Më','En','Pr','Sh'],
		dayNamesMin: ['Di','Hë','Ma','Më','En','Pr','Sh'],
		dayStatus: 'Vendose DD si ditë të parë të javës', dateStatus: '\'Zgjedh\' D, M d',
		dateFormat: 'dd.mm.yy', firstDay: 1,
		initStatus: 'Zgjedhe një datë', isRTL: false};
	$.datepicker.setDefaults($.datepicker.regional['sq']);
});
