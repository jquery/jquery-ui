/*
 * spinner_defaults.js
 */

var spinner_defaults = {
	buttons: 'show',
	currency: false,
	dir: 'ltr',
	disabled: false,
	groupSeparator: '',
	incremental: true,
	max: null,
	min: null,
	mouseWheel: true,
	padding: 0,
	page: 5,
	precision: 0,
	radix: 10,
	radixPoint: '.',
	spinnerClass: null,
	step: null,
	value: 0,
	width: false
};

commonWidgetTests('spinner', { defaults: spinner_defaults });
