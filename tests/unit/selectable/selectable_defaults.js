/*
 * selectable_defaults.js
 */

var selectable_defaults = {
	appendTo: 'body',
	autoRefresh: true,
	cancel: ':input,option',
	delay: 0,
	disabled: false,
	distance: 0,
	filter: '*',
	tolerance: 'touch'
};

commonWidgetTests('selectable', { defaults: selectable_defaults });
