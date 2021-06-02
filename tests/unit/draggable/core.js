define( [
	"qunit",
	"jquery",
	"lib/helper",
	"./helper",
	"ui/widgets/draggable",
	"ui/widgets/droppable",
	"ui/widgets/resizable"
], function( QUnit, $, helper, testHelper ) {
"use strict";

QUnit.module( "draggable: core", { afterEach: helper.moduleAfterEach }  );

QUnit.test( "element types", function( assert ) {
	var typeNames = (
			"p,h1,h2,h3,h4,h5,h6,blockquote,ol,ul,dl,div,form" +
			",table,fieldset,address,ins,del,em,strong,q,cite,dfn,abbr" +
			",acronym,code,samp,kbd,var,img,hr" +
			",input,button,label,select,iframe"
		).split( "," );

	assert.expect( typeNames.length * 2 );

	$.each( typeNames, function( i ) {
		var offsetBefore, offsetAfter,
			typeName = typeNames[ i ],
			el = $( document.createElement( typeName ) ).appendTo( "#qunit-fixture" );

		if ( typeName === "table" ) {
			el.append( "<tr><td>content</td></tr>" );
		}

		el.draggable( { cancel: "" } );
		offsetBefore = el.offset();
		el.simulate( "drag", {
			dx: 50,
			dy: 50
		} );
		offsetAfter = el.offset();

		// Support: FF, Chrome, and IE9,
		// there are some rounding errors in so we can't say equal, we have to settle for close enough
		assert.close( offsetBefore.left, offsetAfter.left - 50, 1, "dragged[50, 50] " + "<" + typeName + "> left" );
		assert.close( offsetBefore.top, offsetAfter.top - 50, 1, "dragged[50, 50] " + "<" + typeName + "> top" );
		el.draggable( "destroy" );
		el.remove();
	} );
} );

QUnit.test( "No options, relative", function( assert ) {
	assert.expect( 2 );
	testHelper.shouldMove( assert, $( "#draggable1" ).draggable(), "no options, relative" );
} );

QUnit.test( "No options, absolute", function( assert ) {
	assert.expect( 2 );
	testHelper.shouldMove( assert, $( "#draggable2" ).draggable(), "no options, absolute" );
} );

QUnit.test( "resizable handle with complex markup (#8756 / #8757)", function( assert ) {
	assert.expect( 2 );

	$( "#draggable1" )
		.append(
			$( "<div>" )
				.addClass( "ui-resizable-handle ui-resizable-w" )
				.append( $( "<div>" ) )
		);

	var handle = $( ".ui-resizable-w div" ),
		target = $( "#draggable1" ).draggable().resizable( { handles: "all" } );

	// Todo: fix resizable so it doesn't require a mouseover
	handle.simulate( "mouseover" ).simulate( "drag", { dx: -50 } );
	assert.equal( target.width(), 250, "compare width" );

	// Todo: fix resizable so it doesn't require a mouseover
	handle.simulate( "mouseover" ).simulate( "drag", { dx: 50 } );
	assert.equal( target.width(), 200, "compare width" );
} );

QUnit.test( "#8269: Removing draggable element on drop", function( assert ) {
	assert.expect( 2 );

	var element = $( "#draggable1" ).wrap( "<div id='wrapper' />" ).draggable( {
			stop: function() {
				assert.ok( true, "stop still called despite element being removed from DOM on drop" );
			}
		} ),
		dropOffset = $( "#droppable" ).offset();

	$( "#droppable" ).droppable( {
		drop: function() {
			$( "#wrapper" ).remove();
			assert.ok( true, "element removed from DOM on drop" );
		}
	} );

	// Support: Opera 12.10, Safari 5.1, jQuery <1.8
	if ( testHelper.unreliableContains ) {
		assert.ok( true, "Opera <12.14 and Safari <6.0 report wrong values for $.contains in jQuery < 1.8" );
		assert.ok( true, "Opera <12.14 and Safari <6.0 report wrong values for $.contains in jQuery < 1.8" );
	} else {
		element.simulate( "drag", {
			handle: "corner",
			x: dropOffset.left,
			y: dropOffset.top
		} );
	}
} );

// http://bugs.jqueryui.com/ticket/7778
// drag element breaks in IE8 when its content is replaced onmousedown
QUnit.test( "Stray mousemove after mousedown still drags", function( assert ) {
	assert.expect( 2 );

	var element = $( "#draggable1" ).draggable( { scroll: false } );

	// In IE8, when content is placed under the mouse (e.g. when draggable content is replaced
	// on mousedown), mousemove is triggered on those elements even though the mouse hasn't moved.
	// Support: IE <9
	element.on( "mousedown", function() {
		$( document ).simulate( "mousemove", { button: -1 } );
	} );

	testHelper.shouldMove( assert, element, "element is draggable" );
} );

QUnit.test( "#6258: not following mouse when scrolled and using overflow-y: scroll", function( assert ) {
	assert.expect( 2 );

	var element = $( "#draggable1" ).draggable( {
			stop: function( event, ui ) {
				assert.equal( ui.position.left, 1, "left position is correct despite overflow on HTML" );
				assert.equal( ui.position.top, 1, "top position is correct despite overflow on HTML" );
				$( "html" )
					.css( "overflow-y", oldOverflowY )
					.css( "overflow-x", oldOverflowX )
					.scrollTop( 0 )
					.scrollLeft( 0 );
			}
		} ),
		oldOverflowY = $( "html" ).css( "overflow-y" ),
		oldOverflowX = $( "html" ).css( "overflow-x" );

		testHelper.forceScrollableWindow();

		$( "html" )
			.css( "overflow-y", "scroll" )
			.css( "overflow-x", "scroll" )
			.scrollTop( 300 )
			.scrollLeft( 300 );

		element.simulate( "drag", {
			dx: 1,
			dy: 1,
			moves: 1
		} );
} );

QUnit.test( "#9315: jumps down with offset of scrollbar", function( assert ) {
	assert.expect( 2 );

	var element = $( "#draggable2" ).draggable( {
			stop: function( event, ui ) {
				assert.equal( ui.position.left, 11, "left position is correct when position is absolute" );
				assert.equal( ui.position.top, 11, "top position is correct when position is absolute" );
				$( "html" ).scrollTop( 0 ).scrollLeft( 0 );
			}
		} );

		testHelper.forceScrollableWindow();

		$( "html" ).scrollTop( 300 ).scrollLeft( 300 );

		element.simulate( "drag", {
			dx: 1,
			dy: 1,
			moves: 1
		} );
} );

QUnit.test( "scroll offset with fixed ancestors", function( assert ) {
	assert.expect( 2 );

	var startValue = 300,
		element = $( "#draggable1" )

			// http://bugs.jqueryui.com/ticket/5009
			// scroll not working with parent's position fixed
			.wrap( "<div id='wrapper' />" )

			// http://bugs.jqueryui.com/ticket/9612
			// abspos elements inside of fixed elements moving away from the mouse when scrolling
			.wrap( "<div id='wrapper2' />" )
			.draggable( {
				drag: function() {
					startValue += 100;
					$( document ).scrollTop( startValue ).scrollLeft( startValue );
				},
				stop: function( event, ui ) {
					assert.equal( ui.position.left, 10, "left position is correct when parent position is fixed" );
					assert.equal( ui.position.top, 10, "top position is correct when parent position is fixed" );
					$( document ).scrollTop( 0 ).scrollLeft( 0 );
				}
			} );

	testHelper.forceScrollableWindow();

	$( "#wrapper" ).css( "position", "fixed" );
	$( "#wrapper2" ).css( "position", "absolute" );

	element.simulate( "drag", {
		dx: 10,
		dy: 10,
		moves: 3
	} );
} );

$( [ "hidden", "auto", "scroll" ] ).each( function() {
	var overflow = this;

	// Http://bugs.jqueryui.com/ticket/9379 - position bug in scrollable div
	// http://bugs.jqueryui.com/ticket/10147 - Wrong position in a parent with "overflow: hidden"
	QUnit.test( "position in scrollable parent with overflow: " + overflow, function( assert ) {
		assert.expect( 2 );

		$( "#qunit-fixture" ).html( "<div id='outer'><div id='inner'></div><div id='dragged'>a</div></div>" );
		$( "#inner" ).css( { position: "absolute", width: "500px", height: "500px" } );
		$( "#outer" ).css( { position: "absolute", width: "300px", height: "300px" } );
		$( "#dragged" ).css( { width: "10px", height: "10px" } );

		var moves = 3,
			startValue = 0,
			dragDelta = 20,
			delta = 100,

			// We scroll after each drag event, so subtract 1 from number of moves for expected
			expected = delta + ( ( moves - 1 ) * dragDelta ),
			element = $( "#dragged" ).draggable( {
				drag: function() {
					startValue += dragDelta;
					$( "#outer" ).scrollTop( startValue ).scrollLeft( startValue );
				},
				stop: function( event, ui ) {
					assert.equal( ui.position.left, expected, "left position is correct when grandparent is scrolled" );
					assert.equal( ui.position.top, expected, "top position is correct when grandparent is scrolled" );
				}
			} );

		$( "#outer" ).css( "overflow", overflow );

		element.simulate( "drag", {
			dy: delta,
			dx: delta,
			moves: moves
		} );
	} );
} );

QUnit.test( "#5727: draggable from iframe", function( assert ) {
	assert.expect( 1 );

	var iframeBody, draggable1,
		iframe = $( "<iframe />" ).appendTo( "#qunit-fixture" ),
		iframeDoc = ( iframe[ 0 ].contentWindow || iframe[ 0 ].contentDocument ).document;

	iframeDoc.write( "<!doctype html><html><body>" );
	iframeDoc.close();

	iframeBody = $( iframeDoc.body ).append( "<div style='width: 2px; height: 2px;' />" );
	draggable1 = iframeBody.find( "div" );

	draggable1.draggable();

	assert.equal( draggable1.closest( iframeBody ).length, 1 );

	// TODO: fix draggable within an IFRAME to fire events on the element properly
	// and these testHelper.shouldMove relies on events for testing
	//testHelper.shouldMove( assert, draggable1, "draggable from an iframe" );
} );

QUnit.test( "#8399: A draggable should become the active element after you are finished interacting with it, but not before.", function( assert ) {
	assert.expect( 2 );

	var element = $( "<a href='#'>link</a>" ).appendTo( "#qunit-fixture" ).draggable();

	$( document ).one( "mousemove", function() {
		assert.notStrictEqual( document.activeElement, element.get( 0 ), "moving a draggable anchor did not make it the active element" );
	} );

	testHelper.move( element, 50, 50 );

	assert.strictEqual( document.activeElement, element.get( 0 ), "finishing moving a draggable anchor made it the active element" );
} );

QUnit.test( "blur behavior - handle is main element", function( assert ) {
	var ready = assert.async();
	assert.expect( 3 );

	var element = $( "#draggable1" ).draggable(),
		focusElement = $( "<div tabindex='1'></div>" ).appendTo( element );

	testHelper.onFocus( focusElement, function() {
		assert.strictEqual( document.activeElement, focusElement.get( 0 ), "test element is focused before mousing down on a draggable" );

		testHelper.move( focusElement, 1, 1 );

		// Http://bugs.jqueryui.com/ticket/10527
		// Draggable: Can't select option in modal dialog (IE8)
		assert.strictEqual( document.activeElement, focusElement.get( 0 ), "test element is focused after mousing down on itself" );

		testHelper.move( element, 50, 50 );

		// Http://bugs.jqueryui.com/ticket/4261
		// active element should blur when mousing down on a draggable
		assert.notStrictEqual( document.activeElement, focusElement.get( 0 ), "test element is no longer focused after mousing down on a draggable" );
		ready();
	} );
} );

QUnit.test( "blur behavior - descendant of handle", function( assert ) {
	var ready = assert.async();
	assert.expect( 2 );

	var element = $( "#draggable2" ).draggable( { handle: "span" } ),

		// The handle is a descendant, but we also want to grab a descendant of the handle
		handle = element.find( "span em" ),
		focusElement = $( "<div tabindex='1'></div>" ).appendTo( element );

	testHelper.onFocus( focusElement, function() {
		assert.strictEqual( document.activeElement, focusElement.get( 0 ), "test element is focused before mousing down on a draggable" );

		testHelper.move( handle, 50, 50 );

		// Elements outside of the handle should blur (#12472, #14905)
		assert.notStrictEqual( document.activeElement, focusElement.get( 0 ), "test element is no longer focused after mousing down on a draggable" );
		ready();
	} );
} );

QUnit.test( "blur behavior - off handle", function( assert ) {
	var ready = assert.async();
	assert.expect( 3 );

	var element = $( "#draggable2" ).draggable( { handle: "span" } ),
		focusElement = $( "<div tabindex='1'></div>" ).appendTo( element );

	// Mock $.ui.safeBlur with a spy
	var _safeBlur = $.ui.safeBlur;
	var blurCalledCount = 0;
	$.ui.safeBlur = function() {
		blurCalledCount++;
	};

	testHelper.onFocus( focusElement, function() {
		assert.strictEqual( document.activeElement, focusElement.get( 0 ), "test element is focused before mousing down on a draggable" );

		testHelper.move( element, 1, 1 );
		assert.strictEqual( blurCalledCount, 0, "draggable doesn't blur when mousing down off handle" );

		testHelper.move( element.find( "span" ), 1, 1 );
		assert.strictEqual( blurCalledCount, 1, "draggable blurs when mousing down on handle" );

		// Restore safeBlur
		$.ui.safeBlur = _safeBlur;

		ready();
	} );
} );

QUnit.test( "ui-draggable-handle assigned to appropriate element", function( assert ) {
	assert.expect( 5 );

	var p = $( "<p>" ).appendTo( "#qunit-fixture" ),
		element = $( "<div><p></p></div>" ).appendTo( "#qunit-fixture" ).draggable();
	assert.hasClasses( element, "ui-draggable-handle" );

	element.draggable( "option", "handle", "p" );
	assert.lacksClasses( element, "ui-draggable-handle" );
	assert.hasClasses( element.find( "p" ), "ui-draggable-handle",
		"ensure handle class name is constrained within the draggble (#10212)" );
	assert.lacksClasses( p, "ui-draggable-handle" );

	element.draggable( "destroy" );
	assert.lacksClasses( element.find( "p" ), "ui-draggable-handle" );
} );

QUnit.test( "ui-draggable-handle managed correctly in nested draggables", function( assert ) {
	assert.expect( 4 );
	var parent = $( "<div><div></div></div>" ).draggable().appendTo( "#qunit-fixture" ),
		child = parent.find( "div" ).draggable();

	assert.hasClasses( parent, "ui-draggable-handle", "parent has class name on init" );
	assert.hasClasses( child, "ui-draggable-handle", "child has class name on init" );

	parent.draggable( "destroy" );
	assert.lacksClasses( parent, "ui-draggable-handle", "parent loses class name on destroy" );
	assert.hasClasses( child, "ui-draggable-handle", "child retains class name on destroy" );
} );

// Support: IE 8 only
// IE 8 implements DOM Level 2 Events which only has events bubble up to the document.
// We skip this test since it would be impossible for it to pass in such an environment.
QUnit[ document.documentMode === 8 ? "skip" : "test" ](
	"does not stop propagation to window",
	function( assert ) {
		assert.expect( 1 );
		var element = $( "#draggable1" ).draggable();

		var handler = function() {
			assert.ok( true, "mouseup propagates to window" );
		};
		$( window ).on( "mouseup", handler );

		element.simulate( "drag", {
			dx: 10,
			dy: 10
		} );

		$( window ).off( "mouseup", handler );
	}
);

} );
