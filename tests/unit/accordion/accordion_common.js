TestHelpers.commonWidgetTests( "accordion", {
	defaults: {
		active: 0,
		animate: {},
		classes: {
			"ui-accordion": "",
			"ui-accordion-header": "ui-corner-top",
			"ui-accordion-header-active": "",
			"ui-accordion-header-collapsed": "ui-corner-all",
			"ui-accordion-content": "ui-corner-bottom",
			"ui-accordion-content-active": "",
			"ui-accordion-header-icon": "",
			"ui-accordion-icons": ""
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
