/* Norwegian initialisation for the jQuery UI date picker plugin. */
/* Written by Naimdjon Takhirov (naimdjon@gmail.com). */
jQuery(function($){
    $.datepicker.regional['no'] = {
		closeText: 'Lukk',
        prevText: '&laquo;Forrige',
		nextText: 'Neste&raquo;',
		currentText: 'I dag',
        monthNames: ['Januar','Februar','Mars','April','Mai','Juni',
        'Juli','August','September','Oktober','November','Desember'],
        monthNamesShort: ['Jan','Feb','Mar','Apr','Mai','Jun',
        'Jul','Aug','Sep','Okt','Nov','Des'],
		dayNamesShort: ['Søn','Man','Tir','Ons','Tor','Fre','Lør'],
		dayNames: ['Søndag','Mandag','Tirsdag','Onsdag','Torsdag','Fredag','Lørdag'],
		dayNamesMin: ['Sø','Ma','Ti','On','To','Fr','Lø'],
        dateFormat: 'yy-mm-dd', firstDay: 0,
		isRTL: false};
    $.datepicker.setDefaults($.datepicker.regional['no']);
});
