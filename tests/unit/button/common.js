define( [
	"lib/common",
	"ui/widgets/button"
], function( common ) {

common.testWidget( "button", {
	defaults: {
		classes: {
			"ui-button": "ui-corner-all"
		},
		disabled: null,
		icon: null,
		iconPosition: "beginning",
		label: null,
		showLabel: true,

		// Callbacks
		create: null
	}
} );

} );
