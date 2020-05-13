define( [
	"qunit",
	"jquery",
	"lib/helper",
	"ui/widgets/progressbar"
], function( QUnit, $, helper ) {

QUnit.module( "progressbar: core", { afterEach: helper.moduleAfterEach }  );

QUnit.test( "markup structure", function( assert ) {
	assert.expect( 7 );
	var element = $( "#progressbar" ).progressbar(),
		value = element.children().eq( 0 );

	assert.hasClasses( element, "ui-progressbar ui-widget ui-widget-content" );
	assert.hasClasses( value, "ui-progressbar-value ui-widget-header" );
	assert.lacksClasses( value, "ui-progressbar-complete" );
	assert.lacksClasses( element, "ui-progressbar-indeterminate" );
	assert.equal( element.children().length, 1, "Main element contains one child" );

	element.progressbar( "option", "value", 100 );
	assert.hasClasses( value, "ui-progressbar-complete ui-widget-header ui-progressbar-value" );
	assert.equal( element.children().children().length, 0, "no overlay div" );
} );

QUnit.test( "markup structure - indeterminate", function( assert ) {
	assert.expect( 5 );
	var element = $( "#progressbar" ).progressbar( { value: false } ),
		children = element.children();

	assert.hasClasses( element, "ui-progressbar ui-progressbar-indeterminate ui-widget ui-widget-content" );
	assert.hasClasses( children[ 0 ], "ui-progressbar-value ui-widget-header" );
	assert.equal( children.length, 1, "Main element contains one child" );
	assert.hasClasses( children[ 0 ], "ui-progressbar-value" );
	assert.equal( children.children( ".ui-progressbar-overlay" ).length, 1,
		"Value has class ui-progressbar-overlay" );
} );

QUnit.test( "accessibility", function( assert ) {
	assert.expect( 11 );
	var element = $( "#progressbar" ).progressbar();

	assert.equal( element.attr( "role" ), "progressbar", "aria role" );
	assert.equal( element.attr( "aria-valuemin" ), 0, "aria-valuemin" );
	assert.equal( element.attr( "aria-valuemax" ), 100, "aria-valuemax" );
	assert.equal( element.attr( "aria-valuenow" ), 0, "aria-valuenow initially" );

	element.progressbar( "value", 77 );
	assert.equal( element.attr( "aria-valuenow" ), 77, "aria-valuenow" );

	element.progressbar( "option", "max", 150 );
	assert.equal( element.attr( "aria-valuemax" ), 150, "aria-valuemax" );

	element.progressbar( "disable" );
	assert.equal( element.attr( "aria-disabled" ), "true", "aria-disabled on" );

	element.progressbar( "enable" );
	assert.equal( element.attr( "aria-disabled" ), "false", "aria-disabled off" );

	element.progressbar( "option", "value", false );
	assert.equal( element.attr( "aria-valuemin" ), 0, "aria-valuemin" );
	assert.equal( element.attr( "aria-valuemax" ), 150, "aria-valuemax" );
	assert.equal( element.attr( "aria-valuenow" ), null, "aria-valuenow" );
} );

} );
