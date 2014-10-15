TestHelpers.commonWidgetTests( "menu", {
	defaults: {
		classes: {
			"ui-menu": "ui-corner-all",
			"ui-menu-icons": "",
			"ui-menu-icon": "",
			"ui-menu-item": "",
			"ui-menu-divider": ""
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
