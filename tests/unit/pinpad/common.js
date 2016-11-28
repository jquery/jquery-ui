define( [
	"lib/common",
	"ui/widgets/pinpad"
], function( common ) {

	common.testWidget( "pinpad", {
		defaults: {
			appendTo: null,
			autoComplete: false,
			classes: {
				"ui-pinpad": "ui-corner-all"
			},
			clear: false,
			commands: [
				{
					position: 0,
					name: "cancel",
					options: { icon: "ui-icon-close", iconPosition: "end" }
				},
				{
					position: 1,
					name: "correct",
					options: { icon: "ui-icon-caret-1-w", iconPosition: "end" }
				},
				{
					position: 2,
					name: "confirm",
					options: { icon: "ui-icon-radio-off", iconPosition: "end" }
				}
			],
			digitOnly: false,
			disabled: false,
			display: {
				decPoint: ".",
				cancel: "Cancel",
				correct: "Correct",
				confirm: "Confirm"
			},
			hide: true,
			keys: [
				"1 2 3",
				"4 5 6",
				"7 8 9",
				"{empty} 0 {dec}"
			],
			minLength: 0,
			maxLength: Number.POSITIVE_INFINITY,
			show: true,

			// Callbacks
			cancel: null,
			change: null,
			close: null,
			confirm: null,
			create: null,
			keypress: null,
			open: null
		}
	} );

} );
