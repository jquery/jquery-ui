define( [
	"lib/common",
	"ui/widgets/resizable"
], function( common ) {

common.testWidget( "resizable", {
	defaults: {
		alsoResize: false,
		animate: false,
		animateDuration: "slow",
		animateEasing: "swing",
		aspectRatio: false,
		autoHide: false,
		cancel: "input, textarea, button, select, option",
		classes: {
			"ui-resizable-se": "ui-icon ui-icon-gripsmall-diagonal-se"
		},
		containment: false,
		delay: 0,
		disabled: false,
		distance: 1,
		ghost: false,
		grid: false,
		handles: "e,s,se",
		helper: false,
		maxHeight: null,
		maxWidth: null,
		minHeight: 10,
		minWidth: 10,
		zIndex: 90,

		// Callbacks
		create: null,
		resize: null,
		start: null,
		stop: null
	}
} );

} );
