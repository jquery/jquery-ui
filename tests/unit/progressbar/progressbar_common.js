TestHelpers.commonWidgetTests( "progressbar", {
	defaults: {
		classes: {
			"ui-progressbar": "ui-corner-all",
			"ui-progressbar-value": "ui-corner-left",
			"ui-progressbar-complete": "ui-corner-right"
		},
		disabled: false,
		max: 100,
		value: 0,

		//callbacks
		change: null,
		complete: null,
		create: null
	}
});
