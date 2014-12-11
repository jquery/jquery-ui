TestHelpers.commonWidgetTests( "menu", {
	defaults: {
		classes: {
			"ui-menu": "",
			"ui-menu-icons": "",
			"ui-menu-icon": "",
			"ui-menu-item": "",
			"ui-menu-item-wrapper": "",
			"ui-menu-divider": ""
		},
		disabled: false,
		icons: {
			submenu: "ui-icon-caret-1-e"
		},
		items: "> *",
		menus: "ul",
		position: {
			my: "left top",
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
