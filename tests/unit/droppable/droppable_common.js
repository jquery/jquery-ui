TestHelpers.commonWidgetTests( "droppable", {
	defaults: {
		accept: "*",
		addClasses: true,
		classes: {},
		disabled: false,
		greedy: false,
		scope: "default",
		tolerance: "intersect",

		// callbacks
		activate: null,
		create: null,
		deactivate: null,
		drop: null,
		out: null,
		over: null
	}
});
