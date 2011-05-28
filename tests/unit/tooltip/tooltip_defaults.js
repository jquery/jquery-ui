commonWidgetTests( "tooltip", {
	defaults: {
		disabled: false,
		items: "[title]",
		content: function() {},
		position: {
			my: "left+15 center",
			at: "right center"
		},
		tooltipClass: null,

		// callbacks
		create: null
	}
});
