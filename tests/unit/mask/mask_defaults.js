commonWidgetTests( "mask", {
	defaults: {
		definitions: {
			'9': /[0-9]/,
			'a': /[A-Za-z]/,
			'*': /[A-Za-z0-9]/
		},
		disabled: false,
		mask: null,
		placeholder: "_",

		// callbacks
		create: null
	}
});
