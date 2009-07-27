/*
 * dialog_defaults.js
 */

var dialog_defaults = {
	autoOpen: true,
	buttons: {},
	closeOnEscape: true,
	closeText: 'close',
	disabled: false,
	dialogClass: '',
	draggable: true,
	height: 'auto',
	hide: null,
	maxHeight: false,
	maxWidth: false,
	minHeight: 150,
	minWidth: 150,
	modal: false,
	position: 'center',
	resizable: true,
	show: null,
	stack: true,
	stackfix: false,
	title: '',
	width: 300,
	zIndex: 1000
};

commonWidgetTests('dialog', { defaults: dialog_defaults });
