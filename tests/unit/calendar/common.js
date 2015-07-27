define( [
	"lib/common",
	"ui/calendar",
	"globalize-locales"
], function( common ) {

common.testWidget( "calendar", {
	defaults: {
		buttons: [],
		classes: {},
		disabled: false,
		dateFormat: { date: "short" },
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

} );
