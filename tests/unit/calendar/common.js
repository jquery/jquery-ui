define( [
	"lib/common",
	"ui/calendar",
	"globalize-locales"
], function( common ) {

common.testWidget( "calendar", {
	defaults: {
		buttons: [],
		classes: {},
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

} );
