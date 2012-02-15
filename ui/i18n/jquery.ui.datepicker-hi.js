/* Hindi initialisation for the jQuery UI date picker plugin. */
/* Written by Michael Dawart. */
jQuery(function($){
	$.datepicker.regional['hi'] = {
		closeText: 'होकर',
		prevText: 'अगला',
		nextText: 'नेक्स्ट',
		currentText: 'आज',
		monthNames: ['जनवरी ','फरवरी','मार्च','अप्रेल','मै','जून',
		'जूलाई','अगस्त ','सितम्बर','आक्टोबर','नवम्बर','दिसम्बर'],
		monthNamesShort: ['जन', 'फर', 'मार्च', 'अप्रेल', 'मै', 'जून',
		'जूलाई', 'अग', 'सित', 'आक्ट', 'नव', 'िद'],
		dayNames: ['रविवासर', 'सोमवासर', 'मंगलवासर', 'बुधवासर', 'गुरुवासर', 'शुक्रवासर', 'शनिवासर'],
		dayNamesShort: ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'],
		dayNamesMin: ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'],
		weekHeader: 'हफ्ता',
		dateFormat: 'mm/dd/yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['hi']);
});
