/* http://keith-wood.name/localisation.html
   Localisation assistance for jQuery v1.0.2.
   Written by Keith Wood (kbwood@iprimus.com.au) June 2007. 
   Under the Creative Commons Licence http://creativecommons.org/licenses/by/3.0/
   Share or Remix it but please Attribute the author. */

(function($) { // Hide scope, no $ conflict

/* Load applicable localisation package(s) for one or more jQuery packages.
   Assumes that the localisations are named <base>-<lang>.js
   and loads them in order from least to most specific.
   For example, $.localise('jquery-calendar');
   with the browser set to 'en-US' would attempt to load
   jquery-calendar-en.js and jquery-calendar-en-US.js.
   Also accepts an array of package names to process.
   Optionally specify whether or not to include the base file,
   the desired language, and/or the timeout period, e.g.
   $.localise(['jquery-calendar', 'jquery-timeentry'], 
      {loadBase: true; language: 'en-AU', timeout: 300}); */
$.localise = function(pkg, settings) {
	var saveSettings = {async: $.ajaxSettings.async, timeout: $.ajaxSettings.timeout};
	$.ajaxSetup({async: false, timeout: (settings && settings.timeout ? settings.timeout : 500)});
	var localiseOne = function(pkg, lang) {
		if (settings && settings.loadBase) {
			$.getScript(pkg + '.js');
		}
		if (lang.length >= 2) {
			$.getScript(pkg + '-' + lang.substring(0, 2) + '.js');
		}
		if (lang.length >= 5) {
			$.getScript(pkg + '-' + lang.substring(0, 5) + '.js');
		}
	};
	var lang = normaliseLang(settings && settings.language ? settings.language : $.defaultLanguage);
	if (isArray(pkg)) {
		for (i = 0; i < pkg.length; i++) {
			localiseOne(pkg[i], lang);
		}
	}
	else {
		localiseOne(pkg, lang);
	}
	$.ajaxSetup(saveSettings);
};

/* Retrieve the default language set for the browser. */
$.defaultLanguage = normaliseLang(navigator.language ? navigator.language /* Mozilla */ :
	navigator.userLanguage /* IE */);

/* Ensure language code is in the format aa-AA. */
function normaliseLang(lang) {
	lang = lang.replace(/_/, '-').toLowerCase();
	if (lang.length > 3) {
		lang = lang.substring(0, 3) + lang.substring(3).toUpperCase();
	}
	return lang;
}

/* Determine whether an object is an array. */
function isArray(a) {
	return (a.constructor && a.constructor.toString().match(/\Array\(\)/));
}

})(jQuery);
