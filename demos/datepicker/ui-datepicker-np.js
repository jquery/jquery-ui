/* Nepali initialisation for the jQuery UI date picker plugin. */
/* Written by Pradeep Paneru (pradeep.paneru@gmail.com) */
jQuery(function($){
	$.datepicker.regional['np'] = {clearText: 'खाली', clearStatus: 'खाली गर्नुहोस',
		closeText: 'बन्द्द', closeStatus: 'बन्द्द गर्नुहोस',
		prevText: '<पहिलो', prevStatus: 'पहिलो महिना',
		nextText: 'पछिको>', nextStatus: 'पछिको महिना',
		currentText: 'आज', currentStatus: 'यो महिना',
		monthNames: ['जनवरी','फेबुबरी','मार्च','अप्रिल','मे','जून',
		'जुलाई','अगष्ट','सेप्टेम्बर','अक्टोबर','नोवेम्बर','डिसेम्बर'],
		monthNamesShort: ['जनवरी','फेबुबरी','मार्च','अप्रिल','मे','जून',
		'जुलाई','अगष्ट','सेप्टेम्बर','अक्टोबर','नोवेम्बर','डिसेम्बर'],
		monthStatus: 'भिन्दै महिना हेरौ ', yearStatus: 'भिन्दै वर्ष हेरौ ',
		weekHeader: 'ह', weekStatus: 'वर्षको हफ्ता',
		dayNames: ['आइतबार','सोमबार','मंगलबार','बुधबार','बिहिबार','सूक्रबार','सनिबार'],
		dayNamesShort: ['आइ','सोम','मंगल','बुध','बिहि','सूक्र','सनि'],
		dayNamesMin: ['आ','सो','मं','बु','बि','सू','स'],
		dayStatus: 'हप्ताको पहिलो दिन DD जस्तै सेव गर्नुहोस', dateStatus: 'प्रयोग गर्नुहोस DD, MM d',
		dateFormat: 'dd/mm/yy', firstDay: 0, 
		initStatus: 'गते छान्नुहोस्', isRTL: false};
	$.datepicker.setDefaults($.datepicker.regional['np']);
});
