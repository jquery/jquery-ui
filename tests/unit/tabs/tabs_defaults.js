/*
 * tabs_defaults.js
 */

var tabs_defaults = {
	activate: null,
	beforeload: null,
	beforeActivate: null,
	collapsible: false,
	disabled: false,
	event: "click",
	fx: null,
	load: null
};

// FAIL: falsy values break the cookie option
commonWidgetTests( "tabs", { defaults: tabs_defaults } );
