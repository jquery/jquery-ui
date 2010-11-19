/*
 * tooltip_defaults.js
 */

var tooltip_defaults = {
	disabled: false,
	items: "[title]",
	content: $.ui.tooltip.prototype.options.content,
	position: {
		my: "left center",
		at: "right center",
		offset: "15 0"
	}
};

commonWidgetTests('tooltip', { defaults: tooltip_defaults });
