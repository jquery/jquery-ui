define( [
	"qunit",
	"jquery",
	"qunit-assert-classes",
	"qunit-assert-close",
	"lib/qunit-assert-domequal",
	"phantom-bridge"
], function( QUnit, $ ) {
"use strict";

QUnit.config.autostart = false;
QUnit.config.requireExpects = true;

QUnit.config.urlConfig.push( {
	id: "jquery",
	label: "jQuery version",
	value: [
		"1.8.0", "1.8.1", "1.8.2", "1.8.3",
		"1.9.0", "1.9.1",
		"1.10.0", "1.10.1", "1.10.2",
		"1.11.0", "1.11.1", "1.11.2", "1.11.3",
		"1.12.0", "1.12.1", "1.12.2", "1.12.3", "1.12.4",
		"2.0.0", "2.0.1", "2.0.2", "2.0.3",
		"2.1.0", "2.1.1", "2.1.2", "2.1.3", "2.1.4",
		"2.2.0", "2.2.1", "2.2.2", "2.2.3", "2.2.4",
		"3.0.0",
		"3.1.0", "3.1.1",
		"3.2.0", "3.2.1",
		"3.3.0", "3.3.1",
		"3.4.0", "3.4.1",
		"3.5.0", "3.5.1",
		"3.6.0",
		"3.x-git", "git", "custom"
	],
	tooltip: "Which jQuery Core version to test against"
} );

QUnit.config.urlConfig.push( {
	id: "migrate",
	label: "Enable jquery-migrate"
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
