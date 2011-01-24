
var accordion_defaults = {
	active: 0,
	animated: false,
	collapsible: false,
	disabled: false,
	event: "click",
	header: "> li > :first-child,> :not(li):even",
	heightStyle: "auto",
	icons: {
		"activeHeader": "ui-icon-triangle-1-s",
		"header": "ui-icon-triangle-1-e"
	}
};

commonWidgetTests( "accordion", { defaults: accordion_defaults } );
