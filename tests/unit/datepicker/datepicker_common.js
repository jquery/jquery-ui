TestHelpers.commonWidgetTests( "datepicker", {
	defaults: {
		appendTo: null,
		buttons: [],
		dateFormat: { date: "short" },
		disabled: false,
		eachDay: $.noop,
		max: null,
		min: null,
		numberOfMonths: 1,
		position: {
			my: "left top",
			at: "left bottom"
		},
		showWeek: false,
		show: true,
		hide: true,

		// callbacks
		beforeOpen: null,
		close: null,
		create: null,
		open: null,
		select: null
	}
});
