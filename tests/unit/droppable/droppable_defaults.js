/*
 * droppable_defaults.js
 */

var droppable_defaults = {
	addClasses: true,
	accept: '*',
	activeClass: false,
	disabled: false,
	greedy: false,
	hoverClass: false,
	scope: "default",
	tolerance: "intersect"
};

commonWidgetTests('droppable', { defaults: droppable_defaults });
