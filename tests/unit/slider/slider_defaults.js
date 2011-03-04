/*
 * slider_defaults.js
 */

var slider_defaults = {
	animate: false,
	cancel: function() {},
	delay: 0,
	disabled: false,
	distance: 0,
	max: 100,
	min: 0,
	orientation: 'horizontal',
	range: false,
	step: 1,
	value: 0,
	values: null
};

commonWidgetTests('slider', { defaults: slider_defaults });
