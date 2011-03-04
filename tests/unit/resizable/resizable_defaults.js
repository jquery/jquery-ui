/*
 * resizable_defaults.js
 */

var resizable_defaults = {
	alsoResize: false,
	animate: false,
	animateDuration: 'slow',
	animateEasing: 'swing',
	aspectRatio: false,
	autoHide: false,
	cancel: ':input,option',
	containment: false,
	delay: 0,
	disabled: false,
	distance: 1,
	ghost: false,
	grid: false,
	handles: 'e,s,se',
	helper: false,
	maxHeight: null,
	maxWidth: null,
	minHeight: 10,
	minWidth: 10,
	zIndex: 1000
};

commonWidgetTests('resizable', { defaults: resizable_defaults });
