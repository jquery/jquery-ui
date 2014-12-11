TestHelpers.commonWidgetTests( "tabs", {
	defaults: {
		active: null,
		classes: {
			"ui-tabs": "ui-corner-all",
			"ui-tabs-collapsible": "",
			"ui-tabs-active": "",
			"ui-tabs-nav": "ui-corner-all",
			"ui-tab": "ui-corner-top",
			"ui-tabs-anchor": "",
			"ui-tabs-panel": "ui-corner-bottom",
			"ui-tabs-loading": ""
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
