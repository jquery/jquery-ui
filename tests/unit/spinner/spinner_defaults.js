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
	spinnerClass: null,
	step: null,
	value: 0
};

commonWidgetTests('spinner', { defaults: spinner_defaults });
