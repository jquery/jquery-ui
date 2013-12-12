define([
	"jquery"
], function( $ ) {

var reset, jshintLoaded;

window.TestHelpers = {};

reset = QUnit.reset;
QUnit.reset = function() {
	// Ensure jQuery events and data on the fixture are properly removed
	jQuery("#qunit-fixture").empty();
	// Let QUnit reset the fixture
	reset.apply( this, arguments );
};


QUnit.config.requireExpects = true;

/*
// TODO: Add back the ability to test against minified files
// see QUnit.urlParams.min usage below
QUnit.config.urlConfig.push({
	id: "min",
	label: "Minified source",
	tooltip: "Load minified source files instead of the regular unminified ones."
});
*/

QUnit.config.urlConfig.push({
	id: "nojshint",
	label: "Skip JSHint",
	tooltip: "Skip running JSHint, e.g. within TestSwarm, where Jenkins runs it already"
});

QUnit.config.urlConfig.push({
	id: "jquery",
	label: "jQuery version",
	value: [
		"1.6", "1.6.1", "1.6.2", "1.6.3", "1.6.4", "1.7", "1.7.1", "1.7.2",
		"1.8.0", "1.8.1", "1.8.2", "1.8.3", "1.9.0", "1.9.1", "1.10.0",
		"1.10.1", "1.10.2", "2.0.0", "2.0.1", "2.0.2", "2.0.3", "git"
	],
	tooltip: "Which jQuery Core version to test against"
});

TestHelpers.onFocus= function( element, onFocus ) {
	var fn = function( event ){
		if( !event.originalEvent ) {
			return;
		}
		element.unbind( "focus", fn );
		onFocus();
	};

	element.bind( "focus", fn )[ 0 ].focus();
};

TestHelpers.forceScrollableWindow = function( appendTo ) {
	// The main testable area is 10000x10000 so to enforce scrolling,
	// this DIV must be greater than 10000 to work
	return $( "<div>" ).css({
		height: "11000px",
		width: "11000px"
	}).appendTo( appendTo || "#qunit-fixture" );
};

/*
 * Taken from https://github.com/jquery/qunit/tree/master/addons/close-enough
 */
window.closeEnough = function( actual, expected, maxDifference, message ) {
	var passes = (actual === expected) || Math.abs(actual - expected) <= maxDifference;
	QUnit.push(passes, actual, expected, message);
};

});
