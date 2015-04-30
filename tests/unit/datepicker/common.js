define( [
	"lib/common",
	"ui/datepicker",
	"globalize-locales"
], function( common ) {

common.testWidget( "datepicker", {
	defaults: {
		appendTo: null,
		buttons: [],
		classes: {},
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
		position: {
			my: "left top",
			at: "left bottom"
		},
		show: true,
		showWeek: false,
		hide: true,

		// callbacks
		beforeOpen: null,
		close: null,
		create: null,
		open: null,
		select: null
	}
});

} );
