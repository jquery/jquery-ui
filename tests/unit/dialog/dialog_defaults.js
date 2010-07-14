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
	position: {
		my: 'center',
		at: 'center',
		of: window,
		collision: 'fit',
		// ensure that the titlebar is never outside the document
		using: function(pos) {
			var topOffset = $(this).css(pos).offset().top;
			if (topOffset < 0) {
				$(this).css('top', pos.top - topOffset);
			}
		}
	},
	resizable: true,
	show: null,
	stack: true,
	title: '',
	width: 300,
	zIndex: 1000
};

commonWidgetTests('dialog', { defaults: dialog_defaults });
