TestHelpers.commonWidgetTests( "menu", {
	defaults: {
		classes: {
			"ui-menu": "ui-corner-all",
			"ui-menu-icons": null,
			"ui-menu-icon": null,
			"ui-menu-item": null,
			"ui-menu-divider": null
		},
		disabled: false,
		icons: {
			submenu: "ui-icon-carat-1-e"
		},
		items: "> *",
		menus: "ul",
		position: {
			my: "left-1 top",
			at: "right top"
		},
		role: "menu",

		// callbacks
		blur: null,
		create: null,
		focus: null,
		select: null
	}
});
