define( [
	"lib/common",
	"ui/selectmenu"
], function( common ) {

common.testWidget( "selectmenu", {
	defaults: {
		appendTo: null,
		classes: {
			"ui-selectmenu-button-open": "ui-corner-top",
			"ui-selectmenu-button-closed": "ui-corner-all"
		},
		disabled: null,
		icons: {
			button: "ui-icon-triangle-1-s"
		},
		position: {
			my: "left top",
			at: "left bottom",
			collision: "none"
		},
		width: false,

		// callbacks
		change: null,
		close: null,
		create: null,
		focus: null,
		open: null,
		select: null
	}
});

} );
