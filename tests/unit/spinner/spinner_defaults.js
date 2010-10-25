/*
 * spinner_defaults.js
 */

var spinner_defaults = {
	dir: 'ltr',
	disabled: false,
	incremental: true,
	max: null,
	min: null,
	mouseWheel: true,
	numberformat: "n",
	page: 5,
	step: null,
	value: null
};

commonWidgetTests('spinner', { defaults: spinner_defaults });
