TestHelpers.commonWidgetTests( "dialog", {
	defaults: {
		appendTo: "body",
		autoOpen: true,
		buttons: [],
		classes: {
			"ui-dialog": "ui-corner-all",
			"ui-dialog-content": "",
			"ui-dialog-titlebar": "ui-corner-all",
			"ui-dialog-titlebar-close": "",
			"ui-dialog-title": "",
			"ui-dialog-buttons": "",
			"ui-dialog-buttonpane": "",
			"ui-dialog-buttonset": "",
			"ui-dialog-dragging": "",
			"ui-dialog-resizing": "",
			"ui-widget-overlay": ""
		},
		closeOnEscape: true,
		closeText: "close",
		dialogClass: "",
		disabled: false,
		draggable: true,
		height: "auto",
		hide: null,
		maxHeight: null,
		maxWidth: null,
		minHeight: 150,
		minWidth: 150,
		modal: false,
		position: {
			my: "center",
			at: "center",
			of: window,
			collision: "fit",
			using: $.ui.dialog.prototype.options.position.using
		},
		resizable: true,
		show: null,
		title: null,
		width: 300,

		// callbacks
		beforeClose: null,
		close: null,
		create: null,
		drag: null,
		dragStart: null,
		dragStop: null,
		focus: null,
		open: null,
		resize: null,
		resizeStart: null,
		resizeStop: null
	}
});
