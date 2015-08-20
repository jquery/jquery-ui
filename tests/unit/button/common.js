define( [
	"lib/common",
	"ui/widgets/button"
], function( common ) {

common.testWidget( "button", {
	defaults: {
		classes: {},
		disabled: null,
		icons: {
			primary: null,
			secondary: null
		},
		label: null,
		text: true,

		// callbacks
		create: null
	}
});

} );
