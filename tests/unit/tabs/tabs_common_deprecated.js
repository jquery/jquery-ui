TestHelpers.commonWidgetTests( "tabs", {
	defaults: {
		active: null,
		collapsible: false,
		disabled: false,
		event: "click",
		heightStyle: "content",
		hide: null,
		idPrefix: "ui-tabs-",
		panelTemplate: "<div></div>",
		show: null,
		tabTemplate: "<li><a href='#{href}'><span>#{label}</span></a></li>",

		// callbacks
		activate: null,
		add: null,
		beforeActivate: null,
		beforeLoad: null,
		create: null,
		load: null,
		remove: null
	}
});
