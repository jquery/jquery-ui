/* Swiss-French initialisation for the jQuery UI date picker plugin. */
/* Written Martin Voelkle (martin.voelkle@e-tc.ch). */
jQuery(function($){
	$.datepicker.regional['fr-CH'] =
		$.extend({}, $.datepicker.regional['fr'], {dateFormat: 'dd.mm.yy'});
	$.datepicker.setDefaults($.datepicker.regional['fr-CH']);
});