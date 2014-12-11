TestHelpers.commonWidgetTests( "slider", {
	defaults: {
		animate: false,
		classes: {
			"ui-slider": "ui-corner-all",
			"ui-slider-handle": "ui-corner-all",
			"ui-slider-range": "ui-corner-all",
			"ui-slider-range-min": "",
			"ui-slider-range-max": "",
			"ui-slider-horizontal": "",
			"ui-slider-vertical": ""
		},
		cancel: "input,textarea,button,select,option",
		delay: 0,
		disabled: false,
		distance: 0,
		max: 100,
		min: 0,
		orientation: "horizontal",
		range: false,
		step: 1,
		value: 0,
		values: null,

		// callbacks
		create: null,
		change: null,
		slide: null,
		start: null,
		stop: null
	}
});
