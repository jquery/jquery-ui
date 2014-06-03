TestHelpers.commonWidgetTests( "calendar", {
	defaults: {
		dateFormat: { date: "short" },
		disabled: false,
		eachDay: $.noop,
		numberOfMonths: 1,
		showWeek: false,
		value: null,

		// callbacks
		create: null,
		select: null
	}
});
