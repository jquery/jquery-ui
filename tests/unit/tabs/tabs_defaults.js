/*
 * tabs_defaults.js
 */

var tabs_defaults = {
	beforeload: null,
	collapsible: false,
	cookie: null,
	disabled: false,
	event: "click",
	fx: null,
	load: null,
	select: null,
	show: null
};

// FAIL: falsy values break the cookie option
commonWidgetTests( "tabs", { defaults: tabs_defaults } );
