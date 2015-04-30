TestHelpers.commonWidgetTests( "calendar", {
	defaults: {
		buttons: [],
		disabled: false,
		eachDay: $.noop,
		labels: {
			"datePickerRole": "date picker",
			"nextText": "Next",
			"prevText": "Prev",
			"weekHeader": "Wk"
		},
		locale: "en",
		max: null,
		min: null,
		numberOfMonths: 1,
		showWeek: false,
		value: null,

		// callbacks
		create: null,
		select: null
	}
});
