TestHelpers.commonWidgetTests( "accordion", {
	defaults: {
		active: 0,
		animate: null,
		animated: "slide",
		collapsible: false,
		disabled: false,
		event: "click",
		header: "> li > :first-child,> :not(li):even",
		heightStyle: "auto",
		icons: {
			"activeHeader": "ui-icon-triangle-1-s",
			"header": "ui-icon-triangle-1-e"
		},

		// callbacks
		activate: null,
		beforeActivate: null,
		change: null,
		changestart: null,
		create: null
	}
});
