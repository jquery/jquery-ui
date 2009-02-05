/*
 * accordion_defaults.js
 */

var accordion_defaults = {
	active: null,
	animated: false,
	autoHeight: true,
	clearStyle: false,
	collapsible: false,
	disabled: false,
	event: "click",
	fillSpace: false,
	header: "> li > :first-child,> :not(li):even",
	icons: { "header": "ui-icon-triangle-1-e", "headerSelected": "ui-icon-triangle-1-s" },
	navigation: false,
	navigationFilter: function() {
      return this.href.toLowerCase() == location.href.toLowerCase();
    }
};

commonWidgetTests('accordion', { defaults: accordion_defaults });
