TestHelpers.commonWidgetTests( "menu", {
	defaults: {
		disabled: false,
		menus: "ul",
		position: {
			my: "left top",
			at: "right top"
		},
		role: "menu",
		icon: "ui-icon-carat-1-e",

		// callbacks
		blur: null,
		create: null,
		focus: null,
		select: null
	}
});
