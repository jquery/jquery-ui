TestHelpers.commonWidgetTests( "selectmenu", {
	defaults: {
		appendTo: null,
		classes: {},
		disabled: null,
		icons: {
			button: "ui-icon-triangle-1-s"
		},
		position: {
			my: "left top",
			at: "left bottom",
			collision: "none"
		},
		width: false,

		// callbacks
		change: null,
		close: null,
		create: null,
		focus: null,
		open: null,
		select: null
	}
});
