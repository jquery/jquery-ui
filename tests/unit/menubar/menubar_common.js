TestHelpers.commonWidgetTests( "menubar", {
	defaults: {
		buttons: false,
		items: "li",
		menuElement: "ul",
		menuIcon: false,
		position: {
			my: "left top",
			at: "left bottom"
		},
		disabled: false,

		// callbacks
		create: null
	}
});