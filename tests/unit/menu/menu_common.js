define( [
	"lib/common",
	"ui/menu"
], function( common ) {

common.testWidget( "menu", {
	defaults: {
		classes: {},
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

} );
