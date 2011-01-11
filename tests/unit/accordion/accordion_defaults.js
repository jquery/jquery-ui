/*
 * accordion_defaults.js
 */

var accordion_defaults = {
	active: 0,
	animated: false,
	autoHeight: true,
	clearStyle: false,
	collapsible: false,
	disabled: false,
	event: "click",
	fillSpace: false,
	header: "> li > :first-child,> :not(li):even",
	heightStyle: null,
	icons: { "header": "ui-icon-triangle-1-e", 
			"activeHeader": null,
			"headerSelected": "ui-icon-triangle-1-s" },
	navigation: false,
	navigationFilter: function() {}
};

commonWidgetTests('accordion', { defaults: accordion_defaults });
