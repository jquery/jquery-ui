define( [
	"lib/common",
	"ui/widgets/droppable"
], function( common ) {

common.testWidget( "droppable", {
	defaults: {
		accept: "*",
		activeClass: false,
		addClasses: true,
		classes: {},
		disabled: false,
		greedy: false,
		hoverClass: false,
		scope: "default",
		tolerance: "intersect",

		// Callbacks
		activate: null,
		create: null,
		deactivate: null,
		drop: null,
		out: null,
		over: null
	}
} );

} );
