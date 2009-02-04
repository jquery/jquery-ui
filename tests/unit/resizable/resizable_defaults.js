/*
 * resizable_defaults.js
 */

var resizable_defaults = {
	animate: false,
	animateDuration: 'slow',
	animateEasing: 'swing',
	alsoResize: false,
	aspectRatio: false,
	autoHide: false,
	cancel: ':input,option',
	containment: false,
	delay: 0,
	disabled: false,
	disableSelection: true,
	distance: 1,
	ghost: false,
	grid: false,
	handles: 'e,s,se',
	helper: false,
	maxHeight: null,
	maxWidth: null,
	minHeight: 10,
	minWidth: 10,
	preserveCursor: true,
	preventDefault: true,
	proportionallyResize: false,
	transparent: false,
	zIndex: 1001
};

commonWidgetTests('resizable', { defaults: resizable_defaults });
