TestHelpers.commonWidgetTests( "menubar", {
	defaults: {
		autoExpand: false,
		buttons: false,
		items: "li",
		menuElement: "ul",
		menuIcon: false,
		position: {
			my: "left top",
			at: "left bottom"
		},
		disabled: false,
		orientation: "horizontal",

		// callbacks
		create: null
	}
});
