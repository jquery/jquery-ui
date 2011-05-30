commonWidgetTests( "tooltip", {
	defaults: {
		content: function() {},
		disabled: false,
		items: "[title]",
		position: {
			my: "left+15 center",
			at: "right center",
			collision: "flip fit"
		},
		tooltipClass: null,

		// callbacks
		create: null
	}
});
