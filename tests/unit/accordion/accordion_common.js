TestHelpers.commonWidgetTests( "accordion", {
	defaults: {
		active: 0,
		animate: {},
		classes: {
			"ui-accordion": null,
			"ui-accordion-header": "ui-corner-top",
			"ui-accordion-header-active": null,
			"ui-accordion-header-collapsed": "ui-corner-all",
			"ui-accordion-content": "ui-corner-bottom",
			"ui-accordion-content-active": null,
			"ui-accordion-header-icon": null,
			"ui-accordion-icons": null
		},
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
		create: null
	}
});
