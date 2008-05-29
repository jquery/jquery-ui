/* Swedish initialisation for the jQuery UI date picker plugin. */
/* Written by Anders Ekdahl ( anders@nomadiz.se). */
jQuery(function($){
    $.datepicker.regional['sv'] = {clearText: 'Rensa', clearStatus: '',
		closeText: 'Stäng', closeStatus: '',
        prevText: '&laquo;Förra',  prevStatus: '',
		nextText: 'Nästa&raquo;', nextStatus: '',
		currentText: 'Idag', currentStatus: '',
        monthNames: ['Januari','Februari','Mars','April','Maj','Juni', 
        'Juli','Augusti','September','Oktober','November','December'],
        monthNamesShort: ['Jan','Feb','Mar','Apr','Maj','Jun', 
        'Jul','Aug','Sep','Okt','Nov','Dec'],
		monthStatus: '', yearStatus: '',
		weekHeader: 'Ve', weekStatus: '',
		dayNamesShort: ['Sön','Mån','Tis','Ons','Tor','Fre','Lör'],
		dayNames: ['Söndag','Måndag','Tisdag','Onsdag','Torsdag','Fredag','Lördag'],
		dayNamesMin: ['Sö','Må','Ti','On','To','Fr','Lö'],
		dayStatus: 'DD', dateStatus: 'D, M d',
        dateFormat: 'yy-mm-dd', firstDay: 0, 
		initStatus: '', isRTL: false};
    $.datepicker.setDefaults($.datepicker.regional['sv']); 
});
