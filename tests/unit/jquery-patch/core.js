define( [
	"qunit",
	"jquery",
	"lib/helper",
	"ui/jquery-patch"
], function( QUnit, $, helper ) {
"use strict";

QUnit.module( "jquery-patch: core", { afterEach: helper.moduleAfterEach }  );

QUnit.test( "jQuery.escapeSelector", function( assert ) {
	assert.expect( 58 );

	// Edge cases
	assert.equal( jQuery.escapeSelector(), "undefined", "Converts undefined to string" );
	assert.equal( jQuery.escapeSelector( "-" ), "\\-", "Escapes standalone dash" );
	assert.equal( jQuery.escapeSelector( "-a" ), "-a", "Doesn't escape leading dash followed by non-number" );
	assert.equal( jQuery.escapeSelector( "--" ), "--", "Doesn't escape standalone double dash" );
	assert.equal( jQuery.escapeSelector( "\uFFFD" ), "\uFFFD",
		"Doesn't escape standalone replacement character" );
	assert.equal( jQuery.escapeSelector( "a\uFFFD" ), "a\uFFFD",
		"Doesn't escape trailing replacement character" );
	assert.equal( jQuery.escapeSelector( "\uFFFDb" ), "\uFFFDb",
		"Doesn't escape leading replacement character" );
	assert.equal( jQuery.escapeSelector( "a\uFFFDb" ), "a\uFFFDb",
		"Doesn't escape embedded replacement character" );

	// Derived from CSSOM tests
	// https://test.csswg.org/harness/test/cssom-1_dev/section/7.1/

	// String conversion
	assert.equal( jQuery.escapeSelector( true ), "true", "Converts boolean true to string" );
	assert.equal( jQuery.escapeSelector( false ), "false", "Converts boolean true to string" );
	assert.equal( jQuery.escapeSelector( null ), "null", "Converts null to string" );
	assert.equal( jQuery.escapeSelector( "" ), "", "Doesn't modify empty string" );

	// Null bytes
	assert.equal( jQuery.escapeSelector( "\0" ), "\uFFFD",
		"Escapes null-character input as replacement character" );
	assert.equal( jQuery.escapeSelector( "a\0" ), "a\uFFFD",
		"Escapes trailing-null input as replacement character" );
	assert.equal( jQuery.escapeSelector( "\0b" ), "\uFFFDb",
		"Escapes leading-null input as replacement character" );
	assert.equal( jQuery.escapeSelector( "a\0b" ), "a\uFFFDb",
		"Escapes embedded-null input as replacement character" );

	// Number prefix
	assert.equal( jQuery.escapeSelector( "0a" ), "\\30 a", "Escapes leading 0" );
	assert.equal( jQuery.escapeSelector( "1a" ), "\\31 a", "Escapes leading 1" );
	assert.equal( jQuery.escapeSelector( "2a" ), "\\32 a", "Escapes leading 2" );
	assert.equal( jQuery.escapeSelector( "3a" ), "\\33 a", "Escapes leading 3" );
	assert.equal( jQuery.escapeSelector( "4a" ), "\\34 a", "Escapes leading 4" );
	assert.equal( jQuery.escapeSelector( "5a" ), "\\35 a", "Escapes leading 5" );
	assert.equal( jQuery.escapeSelector( "6a" ), "\\36 a", "Escapes leading 6" );
	assert.equal( jQuery.escapeSelector( "7a" ), "\\37 a", "Escapes leading 7" );
	assert.equal( jQuery.escapeSelector( "8a" ), "\\38 a", "Escapes leading 8" );
	assert.equal( jQuery.escapeSelector( "9a" ), "\\39 a", "Escapes leading 9" );

	// Letter-number prefix
	assert.equal( jQuery.escapeSelector( "a0b" ), "a0b", "Doesn't escape embedded 0" );
	assert.equal( jQuery.escapeSelector( "a1b" ), "a1b", "Doesn't escape embedded 1" );
	assert.equal( jQuery.escapeSelector( "a2b" ), "a2b", "Doesn't escape embedded 2" );
	assert.equal( jQuery.escapeSelector( "a3b" ), "a3b", "Doesn't escape embedded 3" );
	assert.equal( jQuery.escapeSelector( "a4b" ), "a4b", "Doesn't escape embedded 4" );
	assert.equal( jQuery.escapeSelector( "a5b" ), "a5b", "Doesn't escape embedded 5" );
	assert.equal( jQuery.escapeSelector( "a6b" ), "a6b", "Doesn't escape embedded 6" );
	assert.equal( jQuery.escapeSelector( "a7b" ), "a7b", "Doesn't escape embedded 7" );
	assert.equal( jQuery.escapeSelector( "a8b" ), "a8b", "Doesn't escape embedded 8" );
	assert.equal( jQuery.escapeSelector( "a9b" ), "a9b", "Doesn't escape embedded 9" );

	// Dash-number prefix
	assert.equal( jQuery.escapeSelector( "-0a" ), "-\\30 a", "Escapes 0 after leading dash" );
	assert.equal( jQuery.escapeSelector( "-1a" ), "-\\31 a", "Escapes 1 after leading dash" );
	assert.equal( jQuery.escapeSelector( "-2a" ), "-\\32 a", "Escapes 2 after leading dash" );
	assert.equal( jQuery.escapeSelector( "-3a" ), "-\\33 a", "Escapes 3 after leading dash" );
	assert.equal( jQuery.escapeSelector( "-4a" ), "-\\34 a", "Escapes 4 after leading dash" );
	assert.equal( jQuery.escapeSelector( "-5a" ), "-\\35 a", "Escapes 5 after leading dash" );
	assert.equal( jQuery.escapeSelector( "-6a" ), "-\\36 a", "Escapes 6 after leading dash" );
	assert.equal( jQuery.escapeSelector( "-7a" ), "-\\37 a", "Escapes 7 after leading dash" );
	assert.equal( jQuery.escapeSelector( "-8a" ), "-\\38 a", "Escapes 8 after leading dash" );
	assert.equal( jQuery.escapeSelector( "-9a" ), "-\\39 a", "Escapes 9 after leading dash" );

	// Double dash prefix
	assert.equal( jQuery.escapeSelector( "--a" ), "--a", "Doesn't escape leading double dash" );

	// Miscellany
	assert.equal( jQuery.escapeSelector( "\x01\x02\x1E\x1F" ), "\\1 \\2 \\1e \\1f ",
		"Escapes C0 control characters" );
	assert.equal( jQuery.escapeSelector( "\x80\x2D\x5F\xA9" ), "\x80\x2D\x5F\xA9",
		"Doesn't escape general punctuation or non-ASCII ISO-8859-1 characters" );
	assert.equal(
		jQuery.escapeSelector( "\x7F\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90" +
			"\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F" ),
		"\\7f \x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90" +
		"\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F",
		"Escapes DEL control character"
	);
	assert.equal( jQuery.escapeSelector( "\xA0\xA1\xA2" ), "\xA0\xA1\xA2",
		"Doesn't escape non-ASCII ISO-8859-1 characters" );
	assert.equal( jQuery.escapeSelector( "a0123456789b" ), "a0123456789b",
		"Doesn't escape embedded numbers" );
	assert.equal( jQuery.escapeSelector( "abcdefghijklmnopqrstuvwxyz" ), "abcdefghijklmnopqrstuvwxyz",
		"Doesn't escape lowercase ASCII letters" );
	assert.equal( jQuery.escapeSelector( "ABCDEFGHIJKLMNOPQRSTUVWXYZ" ), "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
		"Doesn't escape uppercase ASCII letters" );
	assert.equal( jQuery.escapeSelector( "\x20\x21\x78\x79" ), "\\ \\!xy",
		"Escapes non-word ASCII characters" );

	// Astral symbol (U+1D306 TETRAGRAM FOR CENTRE)
	assert.equal( jQuery.escapeSelector( "\uD834\uDF06" ), "\uD834\uDF06",
		"Doesn't escape astral characters" );

	// Lone surrogates
	assert.equal( jQuery.escapeSelector( "\uDF06" ), "\uDF06", "Doesn't escape lone low surrogate" );
	assert.equal( jQuery.escapeSelector( "\uD834" ), "\uD834", "Doesn't escape lone high surrogate" );
} );

QUnit.test( "even()/odd()", function( assert ) {
	assert.expect( 8 );

	var lis,
		ul = jQuery( "<ul><li>One</li><li>Two</li><li>Three</li><li>Four</li></ul>" ),
		none = jQuery();

	ul.appendTo( "#qunit-fixture" );

	lis = ul.find( "li" );

	assert.strictEqual( lis.even().length, 2, "even() length" );
	assert.strictEqual( lis.even().eq( 0 ).text(), "One", "even(): 1st" );
	assert.strictEqual( lis.even().eq( 1 ).text(), "Three", "even(): 2nd" );

	assert.strictEqual( lis.odd().length, 2, "odd() length" );
	assert.strictEqual( lis.odd().eq( 0 ).text(), "Two", "odd(): 1st" );
	assert.strictEqual( lis.odd().eq( 1 ).text(), "Four", "odd(): 2nd" );

	assert.deepEqual( none.even().get(), [], "even() none" );
	assert.deepEqual( none.odd().get(), [], "odd() none" );
} );

} );
