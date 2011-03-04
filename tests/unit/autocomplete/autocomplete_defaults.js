/*
 * autocomplete_defaults.js
 */

var autocomplete_defaults = {
	appendTo: "body",
	delay: 300,
	disabled: false,
	minLength: 1,
	position: {
		my: "left top",
		at: "left bottom",
		collision: "none"
	},
	source: null
};

commonWidgetTests('autocomplete', { defaults: autocomplete_defaults });
