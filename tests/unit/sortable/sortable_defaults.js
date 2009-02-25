/*
 * sortable_defaults.js
 */

var sortable_defaults = {
	appendTo: "parent",
	axis: false,
	cancel: ":input,option",
	connectWith: false,
	containment: false,
	cursor: 'auto',
	cursorAt: false,
	delay: 0,
	disabled: false,
	distance: 1,
	dropOnEmpty: true,
	forcePlaceholderSize: false,
	forceHelperSize: false,
	grid: false,
	handle: false,
	helper: "original",
	items: "> *",
	opacity: false,
	placeholder: false,
	revert: false,
	scroll: true,
	scrollSensitivity: 20,
	scrollSpeed: 20,
	scope: "default",
	tolerance: "intersect",
	zIndex: 1000
};

commonWidgetTests('sortable', { defaults: sortable_defaults });
