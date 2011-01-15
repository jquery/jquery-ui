/*
 * spinner_defaults.js
 */

var spinner_defaults = {
	disabled: false,
	incremental: true,
	max: null,
	min: null,
	numberformat: null,
	page: 10,
	step: null,
	value: null
};

commonWidgetTests('spinner', { defaults: spinner_defaults });
