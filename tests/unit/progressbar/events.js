define( [
	"qunit",
	"jquery",
	"lib/helper",
	"ui/widgets/progressbar"
], function( QUnit, $, helper ) {
"use strict";

QUnit.module( "progressbar: events", { afterEach: helper.moduleAfterEach }  );

QUnit.test( "create", function( assert ) {
	assert.expect( 1 );
	$( "#progressbar" ).progressbar( {
		value: 5,
		create: function() {
			assert.equal( $( this ).progressbar( "value" ), 5, "Correct value at create" );
		},
		change: function() {
			assert.ok( false, "create has triggered change()" );
		}
	} );
} );

QUnit.test( "change", function( assert ) {
	assert.expect( 2 );
	var element = $( "#progressbar" ).progressbar();

	element.one( "progressbarchange", function() {
		assert.equal( element.progressbar( "value" ), 5, "change triggered for middle value" );
	} );
	element.progressbar( "value", 5 );
	element.one( "progressbarchange", function() {
		assert.equal( element.progressbar( "value" ), 100, "change triggered for final value" );
	} );
	element.progressbar( "value", 100 );
} );

QUnit.test( "complete", function( assert ) {
	assert.expect( 5 );
	var value,
		changes = 0,
		element = $( "#progressbar" ).progressbar( {
			change: function() {
				changes++;
				assert.equal( element.progressbar( "value" ), value, "change at " + value );
			},
			complete: function() {
				assert.equal( changes, 3, "complete triggered after change and not on indeterminate" );
				assert.equal( element.progressbar( "value" ), 100, "value is 100" );
			}
		} );

	value = 5;
	element.progressbar( "value", value );
	value = false;
	element.progressbar( "value", value );
	value = 100;
	element.progressbar( "value", value );
} );

} );
