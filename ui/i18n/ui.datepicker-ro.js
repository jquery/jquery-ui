/* Romanian initialisation for the jQuery UI date picker plugin. */
/* Written by Edmond L. (ll_edmond@walla.com). */
jQuery(function($){
	$.datepicker.regional['ro'] = {clearText: 'Curat', clearStatus: 'Sterge data curenta',
		closeText: 'Inchide', closeStatus: 'Inchide fara schimbare',
		prevText: '&#x3c;Anterior', prevStatus: 'Arata luna trecuta',
		nextText: 'Urmator&#x3e;', nextStatus: 'Arata luna urmatoare',
		currentText: 'Azi', currentStatus: 'Arata luna curenta',
		monthNames: ['Ianuarie','Februarie','Martie','Aprilie','Mai','Junie',
		'Julie','August','Septembrie','Octobrie','Noiembrie','Decembrie'],
		monthNamesShort: ['Ian', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun',
		'Jul', 'Aug', 'Sep', 'Oct', 'Noi', 'Dec'],
		monthStatus: 'Arata o luna diferita', yearStatus: 'Arat un an diferit',
		weekHeader: 'Sapt', weekStatus: 'Saptamana anului',
		dayNames: ['Duminica', 'Luni', 'Marti', 'Miercuri', 'Joi', 'Vineri', 'Sambata'],
		dayNamesShort: ['Dum', 'Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sam'],
		dayNamesMin: ['Du','Lu','Ma','Mi','Jo','Vi','Sa'],
		dayStatus: 'Seteaza DD ca prima saptamana zi', dateStatus: 'Selecteaza D, M d',
		dateFormat: 'mm/dd/yy', firstDay: 0, 
		initStatus: 'Selecteaza o data', isRTL: false};
	$.datepicker.setDefaults($.datepicker.regional['ro']);
});
