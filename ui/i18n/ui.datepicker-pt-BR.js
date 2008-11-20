/* Brazilian initialisation for the jQuery UI date picker plugin. */
/* Written by Leonildo Costa Silva (leocsilva@gmail.com). */
jQuery(function($){
	$.datepicker.regional['pt-BR'] = {
		clearText: 'Limpar', clearStatus: '',
		closeText: 'Fechar', closeStatus: '',
		prevText: '&#x3c;Anterior', prevStatus: '',
		prevBigText: '&#x3c;&#x3c;', prevBigStatus: '',
		nextText: 'Pr&oacute;ximo&#x3e;', nextStatus: '',
		nextBigText: '&#x3e;&#x3e;', nextBigStatus: '',
		currentText: 'Hoje', currentStatus: '',
		monthNames: ['Janeiro','Fevereiro','Mar&ccedil;o','Abril','Maio','Junho',
		'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
		monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun',
		'Jul','Ago','Set','Out','Nov','Dez'],
		monthStatus: '', yearStatus: '',
		weekHeader: 'Sm', weekStatus: '',
		dayNames: ['Domingo','Segunda-feira','Ter&ccedil;a-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sabado'],
		dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sab'],
		dayNamesMin: ['Dom','Seg','Ter','Qua','Qui','Sex','Sab'],
		dayStatus: 'DD', dateStatus: 'D, M d',
		dateFormat: 'dd/mm/yy', firstDay: 0,
		initStatus: '', isRTL: false};
	$.datepicker.setDefaults($.datepicker.regional['pt-BR']);
});