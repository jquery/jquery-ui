TestHelpers.commonWidgetTests( "selectmenu", {
	defaults: {
		appendTo: null,
		disabled: false,
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
		create: null,
		change: null,
		close: null,
		focus: null,
		open: null,
		select: null
	}
});
