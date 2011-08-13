commonWidgetTests( "spinner", {
	defaults: {
		disabled: false,
		incremental: true,
		max: Number.MAX_VALUE,
		min: -Number.MAX_VALUE,
		numberFormat: null,
		page: 10,
		step: 1,

		// callbacks
		change: null,
		create: null,
		spin: null,
		start: null,
		stop: null
	}
});
