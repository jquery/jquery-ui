define( [
	"lib/common",
	"ui/widgets/controlgroup",
	"ui/widgets/checkboxradio",
	"ui/widgets/selectmenu",
	"ui/widgets/button"
], function( common ) {

common.testWidget( "controlgroup", {
	defaults: {
		disabled: null,
		items: {
			"button": "input[type=button], input[type=submit], input[type=reset], button, a",
			"checkboxradio": "input[type='checkbox'], input[type='radio']",
			"selectmenu": "select",
			"spinner": ".ui-spinner-input",
			"controlgroupLabel": ".ui-controlgroup-label"
		},
		direction: "horizontal",
		excludeInvisible: true,
		classes: {},

		// Callbacks
		create: null
	}
});

} );
