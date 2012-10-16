TestHelpers.commonWidgetTests( "tooltip", {
	defaults: {
		content: function() {},
		disabled: false,
		hide: true,
		items: "[title]:not([disabled])",
		position: {
			my: "left+15 center",
			at: "right center",
			collision: "flipfit flipfit"
		},
		show: true,
		tooltipClass: null,
		track: false,

		// callbacks
		close: null,
		create: null,
		open: null
	}
});
