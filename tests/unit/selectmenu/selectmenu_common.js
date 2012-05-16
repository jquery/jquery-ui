TestHelpers.commonWidgetTests( "selectmenu", {
	defaults: {
		appendTo: "body",
		disabled: false,
		dropdown: true,
		position: {
			my: "left top",
			at: "left bottom",
			collision: "none"
		},
		// callbacks,
		create: null,
		open: null,
		focus: null,
		select: null,
		close: null,
		change: null
	}
});
