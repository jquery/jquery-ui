define( [
	"lib/common",
	"ui/widgets/tabs"
], function( common ) {

common.testWidget( "tabs", {
	defaults: {
		active: null,
		classes: {
			"ui-tabs": "ui-corner-all",
			"ui-tabs-nav": "ui-corner-all",
			"ui-tab": "ui-corner-top",
			"ui-tabs-panel": "ui-corner-bottom"
		},
		collapsible: false,
		disabled: false,
		event: "click",
		heightStyle: "content",
		hide: null,
		show: null,

		// callbacks
		activate: null,
		beforeActivate: null,
		beforeLoad: null,
		create: null,
		load: null
	}
});

} );
