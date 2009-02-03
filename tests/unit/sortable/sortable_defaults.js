/*
 * sortable_defaults.js
 */

var sortable_defaults = {
	appendTo: "parent",
	cancel: ":input,option",
	connectWith: false,
	cssNamespace: "ui",
	cursor: 'default',
	cursorAt: false,
	delay: 0,
	disabled: false,
	distance: 1,
	dropOnEmpty: true,
	forcePlaceholderSize: false,
	forceHelperSize: false,
	handle: false,
	helper: "original",
	items: "> *",
	opacity: false,
	placeholder: false,
	scope: "default",
	scroll: true,
	scrollSensitivity: 20,
	scrollSpeed: 20,
	sortIndicator: "???",
	tolerance: "intersect",
	zIndex: 1000
};

commonWidgetTests('sortable', { defaults: sortable_defaults });
