commonWidgetTests( "tooltip", {
	defaults: {
		disabled: false,
		items: "[title]",
		content: $.ui.tooltip.prototype.options.content,
		position: {
			my: "left+15 center",
			at: "right center"
		},
		tooltipClass: null,

		// callbacks
		create: null
	}
});
