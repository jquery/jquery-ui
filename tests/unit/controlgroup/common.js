define( [
	"lib/common",
	"ui/controlgroup",
	"ui/checkboxradio",
	"ui/selectmenu",
	"ui/button"
], function( common ) {

common.testWidget( "controlgroup", {
	defaults: {
		disabled: null,
		items: {
			"button": "input[type=button], input[type=submit], input[type=reset], button, a",
			"checkboxradio": "input[type='checkbox'], input[type='radio']",
			"selectmenu": "select"
		},
		direction: "horizontal",
		excludeInvisible: true,
		classes: {},

		// Callbacks
		create: null
	}
});

} );
