define( [
	"qunit",
	"jquery",
	"lib/helper",
	"./helper",
	"ui/widgets/resizable"
], function( QUnit, $, helper, testHelper ) {

QUnit.module( "resizable: events", { afterEach: helper.moduleAfterEach }  );

QUnit.test( "start", function( assert ) {

	assert.expect( 5 );

	var count = 0,
		handle = ".ui-resizable-se";

	$( "#resizable1" ).resizable( {
		handles: "all",
		start: function( event, ui ) {
			assert.equal( ui.size.width, 100, "compare width" );
			assert.equal( ui.size.height, 100, "compare height" );
			assert.equal( ui.originalSize.width, 100, "compare original width" );
			assert.equal( ui.originalSize.height, 100, "compare original height" );
			count++;
		}
	} );

	testHelper.drag( handle, 50, 50 );

	assert.equal( count, 1, "start callback should happen exactly once" );

} );

QUnit.test( "resize", function( assert ) {

	assert.expect( 9 );

	var count = 0,
		handle = ".ui-resizable-se";

	$( "#resizable1" ).resizable( {
		handles: "all",
		resize: function( event, ui ) {
			if ( count === 0 ) {
				assert.equal( ui.size.width, 125, "compare width" );
				assert.equal( ui.size.height, 125, "compare height" );
				assert.equal( ui.originalSize.width, 100, "compare original width" );
				assert.equal( ui.originalSize.height, 100, "compare original height" );
			} else {
				assert.equal( ui.size.width, 150, "compare width" );
				assert.equal( ui.size.height, 150, "compare height" );
				assert.equal( ui.originalSize.width, 100, "compare original width" );
				assert.equal( ui.originalSize.height, 100, "compare original height" );
			}
			count++;
		}
	} );

	testHelper.drag( handle, 50, 50 );

	assert.equal( count, 2, "resize callback should happen exactly once per size adjustment" );

} );

QUnit.test( "resize (min/max dimensions)", function( assert ) {

	assert.expect( 5 );

	var count = 0,
		handle = ".ui-resizable-se";

	$( "#resizable1" ).resizable( {
		handles: "all",
		minWidth: 60,
		minHeight: 60,
		maxWidth: 100,
		maxHeight: 100,
		resize: function( event, ui ) {
			assert.equal( ui.size.width, 60, "compare width" );
			assert.equal( ui.size.height, 60, "compare height" );
			assert.equal( ui.originalSize.width, 100, "compare original width" );
			assert.equal( ui.originalSize.height, 100, "compare original height" );
			count++;
		}
	} );

	testHelper.drag( handle, -200, -200 );

	assert.equal( count, 1, "resize callback should happen exactly once per size adjustment" );

} );

QUnit.test( "resize (containment)", function( assert ) {

	assert.expect( 5 );

	var count = 0,
		handle = ".ui-resizable-se",
		container = $( "#resizable1" ).wrap( "<div>" ).parent().css( {
			height: "100px",
			width: "100px"
		} );

	$( "#resizable1" ).resizable( {
		handles: "all",
		containment: container,
		resize: function( event, ui ) {
			assert.equal( ui.size.width, 10, "compare width" );
			assert.equal( ui.size.height, 10, "compare height" );
			assert.equal( ui.originalSize.width, 100, "compare original width" );
			assert.equal( ui.originalSize.height, 100, "compare original height" );
			count++;
		}
	} );

	// Prove you can't resize outside containment by dragging southeast corner southeast
	testHelper.drag( handle, 100, 100 );

	// Prove you can't resize outside containment by dragging southeast corner northwest
	testHelper.drag( handle, -200, -200 );

	assert.equal( count, 1, "resize callback should happen exactly once per size adjustment" );

} );

QUnit.test( "resize (grid)", function( assert ) {

	assert.expect( 5 );

	var count = 0,
		handle = ".ui-resizable-se";

	$( "#resizable1" ).resizable( {
		handles: "all",
		grid: 50,
		resize: function( event, ui ) {
			assert.equal( ui.size.width, 150, "compare width" );
			assert.equal( ui.size.height, 150, "compare height" );
			assert.equal( ui.originalSize.width, 100, "compare original width" );
			assert.equal( ui.originalSize.height, 100, "compare original height" );
			count++;
		}
	} );

	testHelper.drag( handle, 50, 50 );

	assert.equal( count, 1, "resize callback should happen exactly once per grid-unit size adjustment" );

} );

QUnit.test( "resize, custom adjustment", function( assert ) {
	assert.expect( 4 );

	var handle = ".ui-resizable-se",
		element = $( "#resizable1" ).resizable( {
			resize: function( event, ui ) {
				ui.size.width = 100;
				ui.size.height = 200;
				ui.position.left = 300;
				ui.position.top = 400;
			}
		} );

	testHelper.drag( handle, 50, 50 );

	assert.equal( element.width(), 100, "resize event can control width" );
	assert.equal( element.height(), 200, "resize event can control height" );
	assert.equal( element.position().left, 300, "resize event can control left" );
	assert.equal( element.position().top, 400, "resize event can control top" );
} );

QUnit.test( "stop", function( assert ) {

	assert.expect( 5 );

	var count = 0,
		handle = ".ui-resizable-se";

	$( "#resizable1" ).resizable( {
		handles: "all",
		stop: function( event, ui ) {
			assert.equal( ui.size.width, 150, "compare width" );
			assert.equal( ui.size.height, 150, "compare height" );
			assert.equal( ui.originalSize.width, 100, "compare original width" );
			assert.equal( ui.originalSize.height, 100, "compare original height" );
			count++;
		}
	} );

	testHelper.drag( handle, 50, 50 );

	assert.equal( count, 1, "stop callback should happen exactly once" );

} );

QUnit.test( "resize (containment) works with parent with negative offset", function( assert ) {

	assert.expect( 1 );

	var widthBefore, widthAfter,
		handle = ".ui-resizable-e",
		target = $( "#resizable1" ),
		absoluteContainer = target.wrap( "<div />" ).parent(),
		fixedContainer = absoluteContainer.wrap( "<div />" ).parent(),
		increaseWidthBy = 50;

	// Position fixed container in window top left
	fixedContainer.css( {
		width: 400,
		height: 100,
		position: "fixed",
		top: 0,
		left: 0
	} );

	// Position absolute container within fixed on slightly outside window
	absoluteContainer.css( {
		width: 400,
		height: 100,
		position: "absolute",
		top: 0,
		left: -50
	} );

	// Set up resizable to be contained within absolute container
	target.resizable( {
		handles: "all",
		containment: "parent"
	} ).css( {
		width: 300
	} );

	widthBefore = target.width();

	testHelper.drag( handle, increaseWidthBy, 0 );

	widthAfter = target.width();

	assert.equal( widthAfter, ( widthBefore + increaseWidthBy ), "resizable width should be increased by the value dragged" );

} );

} );
