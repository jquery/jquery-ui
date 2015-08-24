define( [
	"lib/common",
	"ui/widgets/tooltip"
], function( common ) {

common.testWidget( "tooltip", {
	defaults: {
		classes: {
			"ui-tooltip": "ui-corner-all ui-widget-shadow"
		},
		content: function() {},
		disabled: false,
		hide: true,
		items: "[title]:not([disabled])",
		position: {
			my: "left top+15",
			at: "left bottom",
			collision: "flipfit flip"
		},
		show: true,
		track: false,

		// Callbacks
		close: null,
		create: null,
		open: null
	}
} );

} );
