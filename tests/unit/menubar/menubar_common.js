TestHelpers.commonWidgetTests( "menubar", {
	defaults: {
		items: "li",
		menus: "ul",
		icons: {
			dropdown: "ui-icon-triangle-1-s"
		},
		position: {
			my: "left top",
			at: "left bottom"
		},
		disabled: false,

		// callbacks
		create: null,
		select: null
	}
});