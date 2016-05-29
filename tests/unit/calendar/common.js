define( [
	"lib/common",
	"ui/widgets/calendar",
	"globalize-locales"
], function( common ) {

common.testWidget( "calendar", {
	defaults: {
		buttons: [],
		classes: {
			"ui-calendar": "ui-corner-all",
			"ui-calendar-header-first": "ui-corner-left",
			"ui-calendar-header-last": "ui-corner-right",
			"ui-calendar-prev": "ui-corner-all",
			"ui-calendar-next": "ui-corner-all"
		},
		disabled: false,
		dateFormat: { date: "short" },
		eachDay: $.noop,
		icons: {
			prevButton: "ui-icon-circle-triangle-w",
			nextButton: "ui-icon-circle-triangle-e"
		},
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
		change: null,
		create: null,
		select: null
	}
} );

} );
