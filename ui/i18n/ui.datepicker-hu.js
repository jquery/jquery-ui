/* Hungarian initialisation for the jQuery UI date picker plugin. */
/* Written by Istvan Karaszi (jquerycalendar@spam.raszi.hu). */
jQuery(function($){
	$.datepicker.regional['hu'] = {
		closeText: 'bezárás',
		prevText: '&laquo;&nbsp;vissza',
		nextText: 'előre&nbsp;&raquo;',
		currentText: 'ma',
		monthNames: ['Január', 'Február', 'Március', 'Április', 'Május', 'Június',
		'Július', 'Augusztus', 'Szeptember', 'Október', 'November', 'December'],
		monthNamesShort: ['Jan', 'Feb', 'Már', 'Ápr', 'Máj', 'Jún',
		'Júl', 'Aug', 'Szep', 'Okt', 'Nov', 'Dec'],
		dayNames: ['Vasámap', 'Hétfö', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat'],
		dayNamesShort: ['Vas', 'Hét', 'Ked', 'Sze', 'Csü', 'Pén', 'Szo'],
		dayNamesMin: ['V', 'H', 'K', 'Sze', 'Cs', 'P', 'Szo'],
		dateFormat: 'yy-mm-dd', firstDay: 1,
		isRTL: false};
	$.datepicker.setDefaults($.datepicker.regional['hu']);
});
