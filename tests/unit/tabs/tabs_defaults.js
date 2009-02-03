/*
 * tabs_defaults.js
 */

var tabs_defaults = {
	ajaxOptions: null,
	cache: false,
	cookie: null,
	collapsible: false,
	disabled: [],
	event: 'click',
	fx: null,
	idPrefix: 'ui-tabs-',
	panelTemplate: '<div></div>',
	spinner: 'Loading&#8230;',
	tabTemplate: '<li><a href="#{href}"><span>#{label}</span></a></li>'
};

commonWidgetTests('tabs', { defaults: tabs_defaults });
