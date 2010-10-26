/*
 * spinner_defaults.js
 */

var spinner_defaults = {
	disabled: false,
	incremental: true,
	max: Number.MAX_VALUE,
	min: -Number.MAX_VALUE,
	numberformat: null,
	step: 1,
	value: null
};

commonWidgetTests('spinner', { defaults: spinner_defaults });
