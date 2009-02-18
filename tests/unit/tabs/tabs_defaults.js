/*
 * tabs_defaults.js
 */

var tabs_defaults = {
	ajaxOptions: null,
	cache: false,
	collapsible: false,
	cookie: null,
	disabled: [],
	event: 'click',
	fx: null,
	idPrefix: 'ui-tabs-',
	panelTemplate: '<div></div>',
	spinner: '<em>Loading&#8230;</em>',
	tabTemplate: '<li><a href="#{href}"><span>#{label}</span></a></li>'
};

commonWidgetTests('tabs', { defaults: tabs_defaults });
