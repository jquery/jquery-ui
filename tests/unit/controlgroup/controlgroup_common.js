TestHelpers.commonWidgetTests( "controlgroup", {
	defaults: {
		disabled: null,
		items: {
			"button": "input[type=button], input[type=submit], input[type=reset], button, a",
			"checkboxradio": "input[type='checkbox'], input[type='radio']",
			"selectmenu": "select"
		},
		direction: "horizontal",
		excludeInvisible: true,
		classes: {
			"ui-controlgroup": null,
			"ui-controlgroup-horizontal": null,
			"ui-controlgroup-vertical": null
		},

		// Callbacks
		create: null
	}
});
