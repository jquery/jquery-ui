commonWidgetTests( "selectmenu", {
	defaults: {
		appendTo: "body",
		disabled: false,
		dropdown: true,
		position: {
			my: "left top",
			at: "left bottom",
			collision: "none"
		},
		value: null,
		// callbacks
		open: null,
		focus: null,
		select: null,
		close: null,
		change: null
	}
});
