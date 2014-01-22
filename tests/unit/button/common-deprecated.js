define( [
	"lib/common",
	"ui/button"
], function( common ) {

common.testWidget( "button", {
	defaults: {
		classes: {
			"ui-button": "ui-corner-all"
		},
		disabled: null,
		icon: null,
		iconPosition: "beginning",
		icons: {
			primary: null,
			secondary: null
		},
		label: null,
		showLabel: true,
		text: true,

		// Callbacks
		create: null
	}
} );

} );
