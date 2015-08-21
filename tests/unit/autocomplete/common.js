define( [
	"lib/common",
	"ui/widgets/autocomplete"
], function( common ) {

common.testWidget( "autocomplete", {
	defaults: {
		appendTo: null,
		autoFocus: false,
		classes: {},
		delay: 300,
		disabled: false,
		messages: {
			noResults: "No search results.",
			results: $.ui.autocomplete.prototype.options.messages.results
		},
		minLength: 1,
		position: {
			my: "left top",
			at: "left bottom",
			collision: "none"
		},
		source: null,

		// Callbacks
		change: null,
		close: null,
		create: null,
		focus: null,
		open: null,
		response: null,
		search: null,
		select: null
	}
} );

} );
