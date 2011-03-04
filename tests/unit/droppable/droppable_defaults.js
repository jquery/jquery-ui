/*
 * droppable_defaults.js
 */

var droppable_defaults = {
	accept: '*',
	activeClass: false,
	addClasses: true,
	disabled: false,
	greedy: false,
	hoverClass: false,
	scope: "default",
	tolerance: "intersect"
};

commonWidgetTests('droppable', { defaults: droppable_defaults });
