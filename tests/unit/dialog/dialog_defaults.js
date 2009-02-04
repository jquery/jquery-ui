/*
 * dialog_defaults.js
 */

var dialog_defaults = {
	autoOpen: true,
	bgiframe: false,
	buttons: {},
	closeOnEscape: true,
	closeText: 'close',
	disabled: false,
	dialogClass: '',
	draggable: true,
	height: 'auto',
	maxHeight: undefined,
	maxWidth: undefined,
	minHeight: 150,
	minWidth: 150,
	modal: false,
	position: 'center',
	resizable: true,
	shadow: false,
	stack: true,
	title: '',
	width: 300,
	zIndex: 1000
};

commonWidgetTests('dialog', { defaults: dialog_defaults });
