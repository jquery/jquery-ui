commonWidgetTests( "mask", {
	defaults: {
		definitions: {
			'9': /[0-9]/,
			'a': /[A-Za-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]/,
			'*': /[A-Za-z0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]/
		},
		disabled: false,
		mask: null,
		placeholder: "_",

		// callbacks
		create: null
	}
});
