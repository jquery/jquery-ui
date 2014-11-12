TestHelpers.commonWidgetTests( "button", {
	defaults: {
		disabled: null,
		showLabel: true,
		label: null,
		icon: null,
		iconPosition: "beginning",
		text: true,
		icons: {
			primary: null,
			secondary: null
		},
		classes: {
			"ui-button": "ui-corner-all",
			"ui-button-icon-only": "",
			"ui-button-icon": ""
		},

		// Callbacks
		create: null
	}
});
