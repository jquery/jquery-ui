TestHelpers.commonWidgetTests( "calendar", {
	defaults: {
		dateFormat: { date: "short" },
		disabled: false,
		eachDay: $.noop,
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
