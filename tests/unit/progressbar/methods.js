define( [
	"qunit",
	"jquery",
	"lib/helper",
	"ui/widgets/progressbar"
], function( QUnit, $, helper ) {
"use strict";

QUnit.module( "progressbar: methods", { afterEach: helper.moduleAfterEach }  );

QUnit.test( "destroy", function( assert ) {
	assert.expect( 1 );
	assert.domEqual( "#progressbar", function() {
		$( "#progressbar" ).progressbar().progressbar( "destroy" );
	} );
} );

QUnit.test( "disable", function( assert ) {
	assert.expect( 3 );

	var element = $( "#progressbar" ).progressbar().progressbar( "disable" );

	assert.hasClasses( element.progressbar( "widget" ), "ui-state-disabled" );
	assert.ok( element.progressbar( "widget" ).attr( "aria-disabled" ), "element gets aria-disabled" );
	assert.hasClasses( element.progressbar( "widget" ), "ui-progressbar-disabled" );
} );

QUnit.test( "value", function( assert ) {
	assert.expect( 3 );

	var element = $( "<div>" ).progressbar( { value: 20 } );
	assert.equal( element.progressbar( "value" ), 20, "correct value as getter" );
	assert.strictEqual( element.progressbar( "value", 30 ), element, "chainable as setter" );
	assert.equal( element.progressbar( "option", "value" ), 30, "correct value after setter" );
} );

QUnit.test( "widget", function( assert ) {
	assert.expect( 2 );
	var element = $( "#progressbar" ).progressbar(),
		widgetElement = element.progressbar( "widget" );
	assert.equal( widgetElement.length, 1, "one element" );
	assert.strictEqual( widgetElement[ 0 ], element[ 0 ], "same element" );
} );

} );
