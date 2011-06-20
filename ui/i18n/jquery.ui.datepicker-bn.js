/* English/UK initialisation for the jQuery UI date picker plugin. */
/* Written by Rajib Ahmed  */
/* http://github.com/rajibahmed */
jQuery(function($){
	$.datepicker.regional['bn'] = {
          closeText: 'েশষ',
          prevText: 'পূর্ববর্তী',
          nextText: 'পরবর্তী',
          currentText: 'আজ',
          monthNames: ['জানুয়ারী','ফেব্রুয়ারী','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর'],
          monthNamesShort: ['জানু', 'ফেব্রু', 'মার্চ', 'এপ্রি', 'মে', 'জুন','জুলা', 'আগ', 'সেপ', 'অক্টো', 'নভে', 'ডিসে'],
          dayNames: ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'],
          dayNamesShort: ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহস্পতি', 'শুক্র', 'শনি'],
          dayNamesMin: ['র','সো','ম','বু','বৃ','শু','শ'],
          weekHeader: 'সপ্তা',
          dateFormat: 'দিিন/মাস/সাল্',
          firstDay: 1,
          isRTL: false,
          showMonthAfterYear: false,
          yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['bn']);
});

