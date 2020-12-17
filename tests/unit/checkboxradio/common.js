define( [
	"lib/common",
	"ui/widgets/checkboxradio"
], function( common ) {

common.testWidget( "checkboxradio", {
	noDefaultElement: true,
	defaults: {
		classes: {
			"ui-checkboxradio-label": "ui-corner-all",
			"ui-checkboxradio-icon": "ui-corner-all"
		},
		disabled: null,
		icon: true,
		label: null,

		// Callbacks
		create: null
	}
} );

} );
