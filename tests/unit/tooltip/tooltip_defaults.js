commonWidgetTests( "tooltip", {
	defaults: {
		content: function() {},
		disabled: false,
		hide: true,
		items: "[title]",
		position: {
			my: "left+15 center",
			at: "right center",
			collision: "flip fit"
		},
		show: true,
		tooltipClass: null,

		// callbacks
		close: null,
		create: null,
		open: null
	}
});
