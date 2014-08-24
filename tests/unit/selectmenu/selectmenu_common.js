TestHelpers.commonWidgetTests( "selectmenu", {
	defaults: {
		appendTo: null,
		classes: {
			"ui-selectmenu-button": "",
			"ui-selectmenu-button-open": "ui-corner-top",
			"ui-selectmenu-button-closed": "ui-corner-all",
			"ui-selectmenu-text": null,
			"ui-selectmenu-menu": null,
			"ui-selectmenu-optgroup": null,
			"ui-selectmenu-open": null
		},
		disabled: null,
		icons: {
			button: "ui-icon-triangle-1-s"
		},
		position: {
			my: "left top",
			at: "left bottom",
			collision: "none"
		},
		width: null,

		// callbacks
		change: null,
		close: null,
		create: null,
		focus: null,
		open: null,
		select: null
	}
});
