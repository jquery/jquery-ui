// Initialise the date picker demonstrations
$(document).ready(function () {
	// initialize tab interface
	tabs.init();
	// reset defaults to English
	$.datepicker.setDefaults($.datepicker.regional['']);
	// replace script tags with HTML code
	$(".demojs").each(function () {
		$(this).before( '<pre style="padding-top:0 !important"><code class="javascript">' +
			$(this).html().replace(/</g, '&lt;') + "</code></pre>" );
		eval( $(this).html() );
	});
	// Localization
	if ($.browser.safari)
		$('.languageSelect,.l10nDatepicker,#frFullFormat').attr({ disabled: 'disabled' });
	else
		$('.languageSelect').change(localise);
	// Stylesheets
	$('#altStyle').datepicker({buttonImage: 'demo/img/calendar2.gif',
		prevText: '<img src="demo/img/prev.gif" style="vertical-align: middle;"/> Prev',
		nextText: 'Next <img src="demo/img/next.gif" style="vertical-align: middle;"/>'});
	$('#button3').click(function() { 
		$(this).datepicker('dialog', $('#altDialog').val(),
		setAltDateFromDialog, {prompt: 'Choose a date', speed: '',
		prevText: '<img src="demo/img/prev.gif" style="vertical-align: middle;"/> Prev',
		nextText: 'Next <img src="demo/img/next.gif" style="vertical-align: middle;"/>'});
	});
});

// Load and apply a localisation package for the date picker
function localise() {
	var input = $('input', this.parentNode.parentNode);
	var date = $(input).datepicker('getDate');
	var language = $(this).val();
	$.localise('i18n/ui.datepicker', {language: language});
	$(input).datepicker('change', $.datepicker.regional[language]);
	$.datepicker.setDefaults($.datepicker.regional['']); // Reset for general usage
	if (date) {
		$(input).datepicker('setDate', date);
		input.val($.datepicker.formatDate(
			$.datepicker.regional[language].dateFormat, date));
	}
}

// Demonstrate a callback from inline configuration
function showDay(input) {
	var date = $(input).datepicker('getDate');
	$('#inlineDay').html(date ? $.datepicker.formatDate('DD', date) : 'blank');
}

// Display a date selected in a "dialog"
function setAltDateFromDialog(date) {
	$('#altDialog').val(date);
}

// Custom Tabs written by Marc Grabanski
var tabs = 
{
	init : function () 
	{
		// Setup tabs
		$("div[@class^=tab_group]").hide();
		$("div[@class^=tab_group]:first").show().id;
		$("ul[@id^=tab_menu] a:eq(0)").addClass('over');

		// Slide visible up and clicked one down
		$("ul[@id^=tab_menu] a").each(function(i){
			$(this).click(function () {
				$("ul[@id^=tab_menu] a.over").removeClass('over');
				$(this).addClass('over');
				$("div[@class^=tab_group]:visible").hide();
				$( $(this).attr("href") ).fadeIn();
				tabs.stylesheet = $(this).attr("href") == "#styles" ? 'alt' : 'default';
				$('link').each(function() {
					this.disabled = (this.title != '' && this.title != tabs.stylesheet);
				});
				return false;
			});
		});
	}
}
