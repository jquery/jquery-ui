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
			"activeHeader": null,
			"header": "ui-icon-triangle-1-e",
			"headerSelected": "ui-icon-triangle-1-s"
		},

		// callbacks
		activate: null,
		beforeActivate: null,
		change: null,
		changestart: null,
		create: null
	}
});
