define( [
	"lib/common",
	"ui/widgets/controlgroup",
	"ui/widgets/checkboxradio",
	"ui/widgets/selectmenu",
	"ui/widgets/button",
	"ui/widgets/spinner"
], function( common ) {

common.testWidget( "controlgroup", {
	defaults: {
		classes: {},
		direction: "horizontal",
		disabled: null,
		items: {
			"button": "input[type=button], input[type=submit], input[type=reset], button, a",
			"checkboxradio": "input[type='checkbox'], input[type='radio']",
			"selectmenu": "select",
			"spinner": ".ui-spinner-input",
			"controlgroupLabel": ".ui-controlgroup-label"
		},
		onlyVisible: true,

		// Callbacks
		create: null
	}
} );

} );
