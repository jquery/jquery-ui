define( [
	"qunit",
	"jquery",
	"./helper",
	"ui/widgets/accordion"
], function( QUnit, $, testHelper ) {

var equalHeight = testHelper.equalHeight,
	setupTeardown = testHelper.setupTeardown,
	state = testHelper.state;

QUnit.module( "accordion: methods", setupTeardown() );

QUnit.test( "destroy", function( assert ) {
	assert.expect( 1 );
	assert.domEqual( "#list1", function() {
		$( "#list1" ).accordion().accordion( "destroy" );
	} );
} );

QUnit.test( "enable/disable", function( assert ) {
	assert.expect( 7 );
	var element = $( "#list1" ).accordion();
	state( assert, element, 1, 0, 0 );
	element.accordion( "disable" );

	assert.hasClasses( element, "ui-state-disabled" );

	assert.equal( element.attr( "aria-disabled" ), "true", "element gets aria-disabled" );
	assert.hasClasses( element, "ui-accordion-disabled" );

	// Event does nothing
	element.find( ".ui-accordion-header" ).eq( 1 ).trigger( "click" );
	state( assert, element, 1, 0, 0 );

	// Option still works
	element.accordion( "option", "active", 1 );
	state( assert, element, 0, 1, 0 );
	element.accordion( "enable" );
	element.accordion( "option", "active", 2 );
	state( assert, element, 0, 0, 1 );
} );

QUnit.test( "refresh", function( assert ) {
	assert.expect( 19 );
	var element = $( "#navigation" )
		.parent()
			.height( 300 )
		.end()
		.accordion( {
			heightStyle: "fill"
		} );
	equalHeight( assert, element, 255 );

	element.parent().height( 500 );
	element.accordion( "refresh" );
	equalHeight( assert, element, 455 );

	element = $( "#list1" );
	element.accordion();
	state( assert, element, 1, 0, 0 );

	// Disable panel via markup
	element.find( "h3.bar" ).eq( 1 ).addClass( "ui-state-disabled" );
	element.accordion( "refresh" );
	state( assert, element, 1, 0, 0 );

	// Don't add multiple icons
	element.accordion( "refresh" );
	assert.equal( element.find( ".ui-accordion-header-icon" ).length, 3 );

	// Add a panel
	element
		.append( "<h3 class='bar' id='new_1'>new 1</h3>" )
		.append( "<div class='foo' id='new_1_panel'>new 1</div>" );
	element.accordion( "refresh" );
	state( assert, element, 1, 0, 0, 0 );

	// Remove all tabs
	element.find( "h3.bar, div.foo" ).remove();
	element.accordion( "refresh" );
	state( assert, element );
	assert.equal( element.accordion( "option", "active" ), false, "no active accordion panel" );

	// Add panels
	element
		.append( "<h3 class='bar' id='new_2'>new 2</h3>" )
		.append( "<div class='foo' id='new_2_panel'>new 2</div>" )
		.append( "<h3 class='bar' id='new_3'>new 3</h3>" )
		.append( "<div class='foo' id='new_3_panel'>new 3</div>" )
		.append( "<h3 class='bar' id='new_4'>new 4</h3>" )
		.append( "<div class='foo' id='new_4_panel'>new 4</div>" )
		.append( "<h3 class='bar' id='new_5'>new 5</h3>" )
		.append( "<div class='foo' id='new_5_panel'>new 5</div>" );
	element.accordion( "refresh" );
	state( assert, element, 1, 0, 0, 0 );

	// Activate third tab
	element.accordion( "option", "active", 2 );
	state( assert, element, 0, 0, 1, 0 );

	// Remove fourth panel, third panel should stay active
	element.find( "h3.bar" ).eq( 3 ).remove();
	element.find( "div.foo" ).eq( 3 ).remove();
	element.accordion( "refresh" );
	state( assert, element, 0, 0, 1 );

	// Remove third (active) panel, second panel should become active
	element.find( "h3.bar" ).eq( 2 ).remove();
	element.find( "div.foo" ).eq( 2 ).remove();
	element.accordion( "refresh" );
	state( assert, element, 0, 1 );

	// Remove first panel, previously active panel (now first) should stay active
	element.find( "h3.bar" ).eq( 0 ).remove();
	element.find( "div.foo" ).eq( 0 ).remove();
	element.accordion( "refresh" );
	state( assert, element, 1 );

	// Collapse all panels
	element.accordion( "option", {
		collapsible: true,
		active: false
	} );
	state( assert, element, 0 );
	element.accordion( "refresh" );
	state( assert, element, 0 );
} );

QUnit.test( "widget", function( assert ) {
	assert.expect( 2 );
	var element = $( "#list1" ).accordion(),
		widgetElement = element.accordion( "widget" );
	assert.equal( widgetElement.length, 1, "one element" );
	assert.strictEqual( widgetElement[ 0 ], element[ 0 ], "same element" );
} );

} );
