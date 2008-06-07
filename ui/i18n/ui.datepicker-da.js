/* Danish initialisation for the jQuery UI date picker plugin. */
/* Written by Jan Christensen ( deletestuff@gmail.com). */
jQuery(function($){
    $.datepicker.regional['da'] = {clearText: 'Nulstil', clearStatus: 'Nulstil den aktuelle dato',
		closeText: 'Luk', closeStatus: 'Luk uden ændringer',
        prevText: '&#x3c;Forrige', prevStatus: 'Vis forrige måned',
		nextText: 'Næste&#x3e;', nextStatus: 'Vis næste måned',
		currentText: 'Idag', currentStatus: 'Vis aktuel måned',
        monthNames: ['Januar','Februar','Marts','April','Maj','Juni', 
        'Juli','August','September','Oktober','November','December'],
        monthNamesShort: ['Jan','Feb','Mar','Apr','Maj','Jun', 
        'Jul','Aug','Sep','Okt','Nov','Dec'],
		monthStatus: 'Vis en anden måned', yearStatus: 'Vis et andet år',
		weekHeader: 'Uge', weekStatus: 'Årets uge',
		dayNames: ['Søndag','Mandag','Tirsdag','Onsdag','Torsdag','Fredag','Lørdag'],
		dayNamesShort: ['Søn','Man','Tir','Ons','Tor','Fre','Lør'],
		dayNamesMin: ['Sø','Ma','Ti','On','To','Fr','Lø'],
		dayStatus: 'Sæt DD som første ugedag', dateStatus: 'Vælg D, M d',
        dateFormat: 'dd-mm-yy', firstDay: 0, 
		initStatus: 'Vælg en dato', isRTL: false};
    $.datepicker.setDefaults($.datepicker.regional['da']); 
});
