define( [
	"qunit",
	"jquery",
	"qunit-assert-classes",
	"qunit-assert-close",
	"lib/qunit-assert-domequal",
	"phantom-bridge"
], function( QUnit, $ ) {

QUnit.config.autostart = false;
QUnit.config.requireExpects = true;

QUnit.config.urlConfig.push( {
	id: "nojshint",
	label: "Skip JSHint",
	tooltip: "Skip running JSHint, e.g., within TestSwarm, where Jenkins runs it already"
} );

QUnit.config.urlConfig.push( {
	id: "jquery",
	label: "jQuery version",
	value: [
		"1.7.0", "1.7.1", "1.7.2",
		"1.8.0", "1.8.1", "1.8.2", "1.8.3",
		"1.9.0", "1.9.1",
		"1.10.0", "1.10.1", "1.10.2",
		"1.11.0", "1.11.1", "1.11.2", "1.11.3",
		"2.0.0", "2.0.1", "2.0.2", "2.0.3",
		"2.1.0", "2.1.1", "2.1.2", "2.1.3",
		"compat-git", "git", "custom"
	],
	tooltip: "Which jQuery Core version to test against"
} );

QUnit.reset = ( function( reset ) {
	return function() {

		// Ensure jQuery events and data on the fixture are properly removed
		$( "#qunit-fixture" ).empty();

		// Let QUnit reset the fixture
		reset.apply( this, arguments );
	};
} )( QUnit.reset );

return QUnit;

} );
