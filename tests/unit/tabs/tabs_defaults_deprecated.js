/*
 * tabs_defaults.js
 */

var tabs_defaults = {
	activate: null,
	add: null,
	ajaxOptions: null,
	beforeload: null,
	beforeActivate: null,
	cache: false,
	collapsible: false,
	cookie: null,
	disable: null,
	disabled: false,
	enable: null,
	event: "click",
	fx: null,
	idPrefix: "ui-tabs-",
	load: null,
	panelTemplate: "<div></div>",
	remove: null,
	select: null,
	show: null,
	spinner: "<em>Loading&#8230;</em>",
	tabTemplate: "<li><a href='#{href}'><span>#{label}</span></a></li>"
};

// FAIL: falsy values break the cookie option
commonWidgetTests( "tabs", { defaults: tabs_defaults } );
