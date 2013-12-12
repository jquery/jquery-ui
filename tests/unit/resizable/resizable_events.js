/*
 * resizable_events.js
 */
(function($) {

module("resizable: events");

test("start", function() {

	expect(5);

	var count = 0,
		handle = ".ui-resizable-se";

	$("#resizable1").resizable({
		handles: "all",
		start: function(event, ui) {
			equal( ui.size.width, 100, "compare width" );
			equal( ui.size.height, 100, "compare height" );
			equal( ui.originalSize.width, 100, "compare original width" );
			equal( ui.originalSize.height, 100, "compare original height" );
			count++;
		}
	});

	TestHelpers.resizable.drag(handle, 50, 50);

	equal(count, 1, "start callback should happen exactly once");

});

test( "resize", function() {

	expect( 9 );

	var count = 0,
		handle = ".ui-resizable-se";

	$("#resizable1").resizable({
		handles: "all",
		resize: function( event, ui ) {
			if ( count === 0 ) {
				equal( ui.size.width, 125, "compare width" );
				equal( ui.size.height, 125, "compare height" );
				equal( ui.originalSize.width, 100, "compare original width" );
				equal( ui.originalSize.height, 100, "compare original height" );
			} else {
				equal( ui.size.width, 150, "compare width" );
				equal( ui.size.height, 150, "compare height" );
				equal( ui.originalSize.width, 100, "compare original width" );
				equal( ui.originalSize.height, 100, "compare original height" );
			}
			count++;
		}
	});

	TestHelpers.resizable.drag( handle, 50, 50 );

	equal( count, 2, "resize callback should happen exactly once per size adjustment" );

});

test( "resize (min/max dimensions)", function() {

	expect( 5 );

	var count = 0,
		handle = ".ui-resizable-se";

	$("#resizable1").resizable({
		handles: "all",
		minWidth: 60,
		minHeight: 60,
		maxWidth: 100,
		maxHeight: 100,
		resize: function( event, ui ) {
			equal( ui.size.width, 60, "compare width" );
			equal( ui.size.height, 60, "compare height" );
			equal( ui.originalSize.width, 100, "compare original width" );
			equal( ui.originalSize.height, 100, "compare original height" );
			count++;
		}
	});

	TestHelpers.resizable.drag( handle, -200, -200 );

	equal( count, 1, "resize callback should happen exactly once per size adjustment" );

});

test( "resize (containment)", function() {

	expect( 5 );

	var count = 0,
		handle = ".ui-resizable-se",
		container = $("#resizable1").wrap("<div>").parent().css({
			height: "100px",
			width: "100px"
		});

	$("#resizable1").resizable({
		handles: "all",
		containment: container,
		resize: function( event, ui ) {
			equal( ui.size.width, 10, "compare width" );
			equal( ui.size.height, 10, "compare height" );
			equal( ui.originalSize.width, 100, "compare original width" );
			equal( ui.originalSize.height, 100, "compare original height" );
			count++;
		}
	});

	// Prove you can't resize outside containment by dragging southeast corner southeast
	TestHelpers.resizable.drag( handle, 100, 100 );

	// Prove you can't resize outside containment by dragging southeast corner northwest
	TestHelpers.resizable.drag( handle, -200, -200 );

	equal( count, 1, "resize callback should happen exactly once per size adjustment" );

});

test("resize (grid)", function() {

	expect(5);

	var count = 0,
		handle = ".ui-resizable-se";

	$("#resizable1").resizable({
		handles: "all",
		grid: 50,
		resize: function(event, ui) {
			equal( ui.size.width, 150, "compare width" );
			equal( ui.size.height, 150, "compare height" );
			equal( ui.originalSize.width, 100, "compare original width" );
			equal( ui.originalSize.height, 100, "compare original height" );
			count++;
		}
	});

	TestHelpers.resizable.drag(handle, 50, 50);

	equal(count, 1, "resize callback should happen exactly once per grid-unit size adjustment");

});

test("stop", function() {

	expect(5);

	var count = 0,
		handle = ".ui-resizable-se";

	$("#resizable1").resizable({
		handles: "all",
		stop: function(event, ui) {
			equal( ui.size.width, 150, "compare width" );
			equal( ui.size.height, 150, "compare height" );
			equal( ui.originalSize.width, 100, "compare original width" );
			equal( ui.originalSize.height, 100, "compare original height" );
			count++;
		}
	});

	TestHelpers.resizable.drag(handle, 50, 50);

	equal(count, 1, "stop callback should happen exactly once");

});

test( "resize (containment) works with parent with negative offset", function() {

	expect( 1 );

	var widthBefore, widthAfter,
		handle = ".ui-resizable-e",
		target = $( "#resizable1" ),
		absoluteContainer = target.wrap( "<div />" ).parent(),
		fixedContainer = absoluteContainer.wrap( "<div />" ).parent(),
		increaseWidthBy = 50;

	// position fixed container in window top left
	fixedContainer.css({
		width: 400,
		height: 100,
		position: "fixed",
		top: 0,
		left: 0
	});

	// position absolute container within fixed on slightly outside window
	absoluteContainer.css({
		width: 400,
		height: 100,
		position: "absolute",
		top: 0,
		left: -50
	});

	// set up resizable to be contained within absolute container
	target.resizable({
		handles: "all",
		containment: "parent"
	}).css({
		width: 300
	});

	widthBefore = target.width();

	TestHelpers.resizable.drag( handle, increaseWidthBy, 0 );

	widthAfter = target.width();

	equal( widthAfter, ( widthBefore + increaseWidthBy ), "resizable width should be increased by the value dragged" );

});

test( "resize (nested) inner created first", function() {

	expect( 2 );

	var widthInnerBefore, widthInnerAfter,
		widthOuterBefore, widthOuterAfter,
		handle = ".ui-resizable-e",
		targetInner = $( "#inner" ).resizable({ handles: "e" }),
		targetOuter = $( "#outer" ).resizable({ handles: "e" }),
		increaseWidthBy = 50;

	widthInnerBefore = targetInner.width();
	widthOuterBefore = targetOuter.width();

	TestHelpers.resizable.drag( handle, increaseWidthBy, 0 );

	widthInnerAfter = targetInner.width();
	widthOuterAfter = targetOuter.width();

	equal(widthInnerAfter, (widthInnerBefore + increaseWidthBy), "resizable width should be increased by the value dragged");
	equal(widthOuterAfter, (widthOuterBefore + increaseWidthBy), "resizable width should be increased by the value dragged");

});

test( "resize (nested) outer created first", function() {

	expect( 2 );

	var widthInnerBefore, widthInnerAfter,
		widthOuterBefore, widthOuterAfter,
		handle = ".ui-resizable-e",
		targetOuter = $( "#outer" ).resizable({ handles: "e" }),
		targetInner = $( "#inner" ).resizable({ handles: "e" }),
		increaseWidthBy = 50;

	widthInnerBefore = targetInner.width();
	widthOuterBefore = targetOuter.width();

	TestHelpers.resizable.drag( handle, increaseWidthBy, 0 );

	widthInnerAfter = targetInner.width();
	widthOuterAfter = targetOuter.width();

	equal(widthInnerAfter, (widthInnerBefore + increaseWidthBy), "resizable width should be increased by the value dragged");
	equal(widthOuterAfter, (widthOuterBefore + increaseWidthBy), "resizable width should be increased by the value dragged");

});

})(jQuery);
