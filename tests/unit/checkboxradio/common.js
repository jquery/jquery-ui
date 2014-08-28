define( [
	"lib/common",
	"ui/checkboxradio"
], function( common ) {

common.testWidget( "checkboxradio", {
	noDefaultElement: true,
	defaults: {
		disabled: null,
		label: null,
		icon: true,
		classes: {
			"ui-checkboxradio-label": "ui-corner-all",
			"ui-checkboxradio-icon": "ui-corner-all"
		},

		// Callbacks
		create: null
	}
});

} );
