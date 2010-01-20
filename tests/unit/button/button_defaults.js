/*
 * button_defaults.js
 */

var button_defaults = {
	disabled: false,
	text: true,
	label: null,
	icons: {
		primary: null,
		secondary: null
	}
};

commonWidgetTests('button', { defaults: button_defaults });
