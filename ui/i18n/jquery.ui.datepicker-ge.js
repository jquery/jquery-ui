/* Georgian (UTF-8) initialisation for the jQuery UI date picker plugin. */
/* Written by Lado Lomidze (lado.lomidze@gmail.com). */
jQuery(function($){
	$.datepicker.regional['ge'] = {
		closeText: 'დახურვა',
		prevText: '&#x3c; წინა',
		nextText: 'შემდეგი &#x3e;',
		currentText: 'დღეს',
		monthNames: ['იანვარი','თებერვალი','მარტი','აპრილი','მაისი','ივნისი', 'ივლისი','აგვისტო','სექტემბერი','ოქტომბერი','ნოემბერი','დეკემბერი'],
		monthNamesShort: ['იან','თებ','მარ','აპრ','მაი','ივნ', 'ივლ','აგვ','სექ','ოქტ','ნოე','დეკ'],
		dayNames: ['კვირა','ორშაბათი','სამშაბათი','ოთხშაბათი','ხუთშაბათი','პარასკევი','შაბათი'],
		dayNamesShort: ['კვ','ორშ','სამ','ოთხ','ხუთ','პარ','შაბ'],
		dayNamesMin: ['კვ','ორშ','სამ','ოთხ','ხუთ','პარ','შაბ'],
		weekHeader: 'კვირა',
		dateFormat: 'dd-mm-yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['ge']);
	
	$.timepicker.regional['ge'] = {
		timeOnlyTitle: 'აირჩიეთ დრო',
		timeText: 'დრო',
		hourText: 'საათი',
		minuteText: 'წუთი',
		secondText: 'წამი',
		millisecText: 'მილიწამი',
		currentText: 'ახლა',
		closeText: 'დახურვა',
		ampm: false
	};
	$.timepicker.setDefaults($.timepicker.regional['ge']);
	
});