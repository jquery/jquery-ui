define( [
	"lib/common",
	"ui/widgets/selectable"
], function( common ) {

common.testWidget( "selectable", {
	defaults: {
		appendTo: "body",
		autoRefresh: true,
		cancel: "input, textarea, button, select, option",
		classes: {},
		delay: 0,
		disabled: false,
		distance: 0,
		filter: "*",
		tolerance: "touch",

		// Callbacks
		create: null,
		selected: null,
		selecting: null,
		start: null,
		stop: null,
		unselected: null,
		unselecting: null
	}
} );

} );
