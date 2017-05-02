// This file is deprecated in 1.12.0 to be removed in 1.13
( function() {
	if (
		typeof require === "function" &&
		typeof exports === "object" &&
		typeof module === "object" ) {

		// CommonJS or Node
		require( "jquery" );
		require( "./data" );
		require( "./disable-selection" );
		require( "./focusable" );
		require( "./form" );
		require( "./ie" );
		require( "./keycode" );
		require( "./labels" );
		require( "./jquery-1-7" );
		require( "./plugin" );
		require( "./safe-active-element" );
		require( "./safe-blur" );
		require( "./scroll-parent" );
		require( "./tabbable" );
		require( "./unique-id" );
		require( "./version" );
	} else if ( typeof define === "function" && define.amd ) {

		// AMD
		define( [
			"jquery",
			"./data",
			"./disable-selection",
			"./focusable",
			"./form",
			"./ie",
			"./keycode",
			"./labels",
			"./jquery-1-7",
			"./plugin",
			"./safe-active-element",
			"./safe-blur",
			"./scroll-parent",
			"./tabbable",
			"./unique-id",
			"./version"
		] );
	}
} )();
