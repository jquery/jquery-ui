/*
 * droppable_defaults.js
 */

var droppable_defaults = {
	accept: '*',
	activeClass: false,
	cssNamespace: "ui",
	disabled: false,
	greedy: false,
	hoverClass: false,
	scope: "default",
	tolerance: "intersect"
};

commonWidgetTests('droppable', { defaults: droppable_defaults });
