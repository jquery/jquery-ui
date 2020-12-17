define( [
	"qunit",
	"jquery",
	"lib/helper",
	"./helper",
	"ui/widgets/spinner"
], function( QUnit, $, helper, testHelper ) {

var simulateKeyDownUp = testHelper.simulateKeyDownUp;

QUnit.module( "spinner: methods", { afterEach: helper.moduleAfterEach }  );

QUnit.test( "destroy", function( assert ) {
	assert.expect( 1 );
	assert.domEqual( "#spin", function() {
		$( "#spin" ).spinner().spinner( "destroy" );
	} );
} );

QUnit.test( "disable", function( assert ) {
	assert.expect( 15 );
	var element = $( "#spin" ).val( 2 ).spinner(),
		wrapper = $( "#spin" ).spinner( "widget" );

	assert.lacksClasses( wrapper, "ui-spinner-disabled" );
	assert.ok( !element.is( ":disabled" ), "before: input does not have disabled attribute" );

	element.spinner( "disable" );
	assert.hasClasses( wrapper, "ui-state-disabled ui-spinner-disabled" );
	assert.ok( !wrapper.attr( "aria-disabled" ), "after: wrapper does not have aria-disabled attr" );
	assert.ok( element.is( ":disabled" ), "after: input has disabled attribute" );

	simulateKeyDownUp( element, $.ui.keyCode.UP );
	assert.equal( 2, element.val(), "keyboard - value does not change on key UP" );

	simulateKeyDownUp( element, $.ui.keyCode.DOWN );
	assert.equal( 2, element.val(), "keyboard - value does not change on key DOWN" );

	simulateKeyDownUp( element, $.ui.keyCode.PAGE_UP );
	assert.equal( 2, element.val(), "keyboard - value does not change on key PGUP" );

	simulateKeyDownUp( element, $.ui.keyCode.PAGE_DOWN );
	assert.equal( 2, element.val(), "keyboard - value does not change on key PGDN" );

	wrapper.find( ".ui-spinner-up" ).trigger( "mousedown" ).trigger( "mouseup" );
	assert.equal( 2, element.val(), "mouse - value does not change on clicking up button" );

	wrapper.find( ".ui-spinner-down" ).trigger( "mousedown" ).trigger( "mouseup" );
	assert.equal( 2, element.val(), "mouse - value does not change on clicking down button" );

	element.spinner( "stepUp", 6 );
	assert.equal( 8, element.val(), "script - stepUp 6 steps changes value" );

	element.spinner( "stepDown" );
	assert.equal( 7, element.val(), "script - stepDown 1 step changes value" );

	element.spinner( "pageUp" );
	assert.equal( 17, element.val(), "script - pageUp 1 page changes value" );

	element.spinner( "pageDown" );
	assert.equal( 7, element.val(), "script - pageDown 1 page changes value" );
} );

QUnit.test( "enable", function( assert ) {
	assert.expect( 5 );
	var element = $( "#spin" ).val( 1 ).spinner( { disabled: true } ),
		wrapper = element.spinner( "widget" );

	assert.hasClasses( wrapper, "ui-spinner-disabled" );
	assert.ok( element.is( ":disabled" ), "before: input has disabled attribute" );

	element.spinner( "enable" );

	assert.lacksClasses( wrapper, "ui-spinner-disabled" );
	assert.ok( !element.is( ":disabled" ), "after: input does not have disabled attribute" );

	simulateKeyDownUp( element, $.ui.keyCode.UP );
	assert.equal( 2, element.val(), "keyboard - value changes on key UP" );
} );

QUnit.test( "isValid", function( assert ) {
	assert.expect( 8 );
	var element = $( "#spin" ).spinner( {
			min: 0,
			max: 10,
			step: 2
		} ),
		spinner = element.spinner( "instance" );
	assert.ok( !spinner.isValid(), "initial state is invalid" );

	element.val( "this is not a number" );
	assert.ok( !spinner.isValid(), "text string is not valid" );

	element.val( "0" );
	assert.ok( spinner.isValid(), "min value is valid" );

	element.val( "10" );
	assert.ok( spinner.isValid(), "max value is valid" );

	element.val( "4" );
	assert.ok( spinner.isValid(), "inbetween step is valid" );

	element.val( "-1" );
	assert.ok( !spinner.isValid(), "below min is invalid" );

	element.val( "11" );
	assert.ok( !spinner.isValid(), "above max is invalid" );

	element.val( "1" );
	assert.ok( !spinner.isValid(), "step mismatch is invalid" );
} );

QUnit.test( "pageDown", function( assert ) {
	assert.expect( 4 );
	var element = $( "#spin" ).val( -12 ).spinner( {
		page: 20,
		min: -100
	} );

	element.spinner( "pageDown" );
	assert.equal( element.val(), -32, "pageDown 1 page" );

	element.spinner( "pageDown", 3 );
	assert.equal( element.val(), -92, "pageDown 3 pages" );

	element.spinner( "pageDown" );
	assert.equal( element.val(), -100, "value close to min and pageDown 1 page" );

	element.spinner( "pageDown", 10 );
	assert.equal( element.val(), -100, "value at min and pageDown 10 pages" );
} );

QUnit.test( "pageUp", function( assert ) {
	assert.expect( 4 );
	var element = $( "#spin" ).val( 12 ).spinner( {
		page: 20,
		max: 100
	} );

	element.spinner( "pageUp" );
	assert.equal( element.val(), 32, "pageUp 1 page" );

	element.spinner( "pageUp", 3 );
	assert.equal( element.val(), 92, "pageUp 3 pages" );

	element.spinner( "pageUp" );
	assert.equal( element.val(), 100, "value close to max and pageUp 1 page" );

	element.spinner( "pageUp", 10 );
	assert.equal( element.val(), 100, "value at max and pageUp 10 pages" );
} );

QUnit.test( "stepDown", function( assert ) {
	assert.expect( 4 );
	var element = $( "#spin" ).val( 0 ).spinner( {
		step: 2,
		min: -15
	} );

	element.spinner( "stepDown" );
	assert.equal( element.val(), "-1", "stepDown 1 step" );

	element.spinner( "stepDown", 5 );
	assert.equal( element.val(), "-11", "stepDown 5 steps" );

	element.spinner( "stepDown", 4 );
	assert.equal( element.val(), "-15", "close to min and stepDown 4 steps" );

	element.spinner( "stepDown" );
	assert.equal( element.val(), "-15", "at min and stepDown 1 step" );
} );

QUnit.test( "stepUp", function( assert ) {
	assert.expect( 4 );
	var element = $( "#spin" ).val( 0 ).spinner( {
		step: 2,
		max: 16
	} );

	element.spinner( "stepUp" );
	assert.equal( element.val(), 2, "stepUp 1 step" );

	element.spinner( "stepUp", 5 );
	assert.equal( element.val(), 12, "stepUp 5 steps" );

	element.spinner( "stepUp", 4 );
	assert.equal( element.val(), 16, "close to max and stepUp 4 steps" );

	element.spinner( "stepUp" );
	assert.equal( element.val(), 16, "at max and stepUp 1 step" );
} );

QUnit.test( "value", function( assert ) {
	assert.expect( 2 );
	var element = $( "#spin" ).val( 0 ).spinner( {
		step: 3
	} );

	element.spinner( "value", 10 );
	assert.equal( element.val(), 9, "change value via value method" );

	assert.equal( element.spinner( "value" ), 9, "get value via value method" );
} );

QUnit.test( "widget", function( assert ) {
	assert.expect( 2 );
	var element = $( "#spin" ).spinner(),
		widgetElement = element.spinner( "widget" );
	assert.equal( widgetElement.length, 1, "one element" );
	assert.strictEqual( widgetElement[ 0 ], element.parent()[ 0 ], "parent element" );
} );

} );
