define( [
	"qunit",
	"jquery",
	"qunit-assert-classes",
	"qunit-assert-close",
	"lib/qunit-assert-domequal"
], function( QUnit, $ ) {
"use strict";

var ajaxSettings = $.ajaxSettings;

QUnit.config.autostart = false;
QUnit.config.requireExpects = true;

QUnit.config.urlConfig.push( {
	id: "jquery",
	label: "jQuery version",
	value: [
		"1.12.4",
		"2.2.4",
		"3.0.0",
		"3.1.0", "3.1.1",
		"3.2.0", "3.2.1",
		"3.3.0", "3.3.1",
		"3.4.0", "3.4.1",
		"3.5.0", "3.5.1",
		"3.6.0", "3.6.1", "3.6.2", "3.6.3", "3.6.4",
		"3.7.0", "3.7.1",
		"4.0.0",
		"3.x-git", "git", "custom"
	],
	tooltip: "Which jQuery Core version to test against"
} );

QUnit.config.urlConfig.push( {
	id: "migrate",
	label: "Enable jquery-migrate"
} );

QUnit.testDone( function() {

	// Ensure jQuery events and data on the fixture are properly removed
	$( "#qunit-fixture" ).empty();

	// Remove the iframe fixture
	$( "#qunit-fixture-iframe" ).remove();

	// Reset internal $ state
	if ( ajaxSettings ) {
		$.ajaxSettings = $.extend( true, {}, ajaxSettings );
	} else {
		delete $.ajaxSettings;
	}
} );

return QUnit;

} );
