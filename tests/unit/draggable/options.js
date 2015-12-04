define( [
	"jquery",
	"./helper",
	"ui/widgets/draggable",
	"ui/widgets/droppable",
	"ui/widgets/sortable"
], function( $, testHelper ) {

module( "draggable: options" );

// TODO: This doesn't actually test whether append happened, possibly remove
test( "{ appendTo: 'parent' }, default, no clone", function() {
	expect( 4 );
	var element = $( "#draggable2" ).draggable( { appendTo: "parent" } );
	testHelper.shouldMove( element, "absolute appendTo: parent" );

	element = $( "#draggable1" ).draggable( { appendTo: "parent" } );
	testHelper.shouldMove( element, "relative appendTo: parent" );
} );

// TODO: This doesn't actually test whether append happened, possibly remove
test( "{ appendTo: Element }, no clone", function() {
	expect( 4 );
	var element = $( "#draggable2" ).draggable( { appendTo: $( "#draggable2" ).parent()[ 0 ] } );

	testHelper.shouldMove( element, "absolute appendTo: Element" );

	element = $( "#draggable1" ).draggable( { appendTo: $( "#draggable2" ).parent()[ 0 ] } );
	testHelper.shouldMove( element, "relative appendTo: Element" );
} );

// TODO: This doesn't actually test whether append happened, possibly remove
test( "{ appendTo: Selector }, no clone", function() {
	expect( 4 );
	var element = $( "#draggable2" ).draggable( { appendTo: "#main" } );
	testHelper.shouldMove( element, "absolute appendTo: Selector" );

	element = $( "#draggable1" ).draggable( { appendTo: "#main" } );
	testHelper.shouldMove( element, "relative appendTo: Selector" );
} );

test( "{ appendTo: 'parent' }, default", function() {
	expect( 2 );

	var element = $( "#draggable1" ).draggable();

	testHelper.trackAppendedParent( element );

	equal( element.draggable( "option", "appendTo" ), "parent" );

	testHelper.move( element, 1, 1 );
	equal( element.data( "last_dragged_parent" ), $( "#main" )[ 0 ] );
} );

test( "{ appendTo: Element }", function() {
	expect( 1 );

	var appendTo = $( "#draggable2" ).parent()[ 0 ],
		element = $( "#draggable1" ).draggable( { appendTo: appendTo } );

	testHelper.trackAppendedParent( element );

	testHelper.move( element, 1, 1 );
	equal( element.data( "last_dragged_parent" ), appendTo );
} );

test( "{ appendTo: jQuery }", function() {
	expect( 1 );

	var appendTo = $( "#draggable2" ).parent(),
		element = $( "#draggable1" ).draggable( { appendTo: appendTo } );

	testHelper.trackAppendedParent( element );

	testHelper.move( element, 1, 1 );
	equal( element.data( "last_dragged_parent" ), appendTo[ 0 ] );
} );

test( "{ appendTo: Selector }", function() {
	expect( 1 );

	var appendTo = "#main",
		element = $( "#draggable1" ).draggable( { appendTo: appendTo } );

	testHelper.trackAppendedParent( element );

	testHelper.move( element, 1, 1 );
	equal( element.data( "last_dragged_parent" ), $( appendTo )[ 0 ] );
} );

test( "appendTo, default, switching after initialization", function() {
	expect( 2 );

	var element = $( "#draggable1" ).draggable( { helper: "clone" } );

	testHelper.trackAppendedParent( element );

	// Move and make sure element was appended to fixture
	testHelper.move( element, 1, 1 );
	equal( element.data( "last_dragged_parent" ), $( "#main" )[ 0 ] );

	// Move and make sure element was appended to main
	element.draggable( "option", "appendTo", $( "#qunit-fixture" ) );
	testHelper.move( element, 2, 2 );
	equal( element.data( "last_dragged_parent" ), $( "#qunit-fixture" )[ 0 ] );
} );

test( "{ axis: false }, default", function() {
	expect( 2 );
	var element = $( "#draggable2" ).draggable( { axis: false } );
	testHelper.shouldMove( element, "axis: false" );
} );

test( "{ axis: 'x' }", function() {
	expect( 2 );
	var element = $( "#draggable2" ).draggable( { axis: "x" } );
	testHelper.testDrag( element, element, 50, 50, 50, 0, "axis: x" );
} );

test( "{ axis: 'y' }", function() {
	expect( 2 );
	var element = $( "#draggable2" ).draggable( { axis: "y" } );
	testHelper.testDrag( element, element, 50, 50, 0, 50, "axis: y" );
} );

test( "{ axis: ? }, unexpected", function() {
	var element,
		unexpected = {
			"true": true,
			"{}": {},
			"[]": [],
			"null": null,
			"undefined": undefined,
			"function() {}": function() {}
		};

	expect( 12 );

	$.each( unexpected, function( key, val ) {
		element = $( "#draggable2" ).draggable( { axis: val } );
		testHelper.shouldMove( element, "axis: " + key );
		element.draggable( "destroy" );
	} );
} );

test( "axis, default, switching after initialization", function() {
	expect( 6 );

	var element = $( "#draggable1" ).draggable( { axis: false } );

	// Any Direction
	testHelper.shouldMove( element, "axis: default" );

	// Only horizontal
	element.draggable( "option", "axis", "x" );
	testHelper.testDrag( element, element, 50, 50, 50, 0, "axis: x as option" );

	// Vertical only
	element.draggable( "option", "axis", "y" );
	testHelper.testDrag( element, element, 50, 50, 0, 50, "axis: y as option" );

} );

test( "{ cancel: 'input,textarea,button,select,option' }, default", function() {
	expect( 4 );

	$( "<div id='draggable-option-cancel-default'><input type='text'></div>" ).appendTo( "#qunit-fixture" );

	var element = $( "#draggable-option-cancel-default" ).draggable( { cancel: "input,textarea,button,select,option" } );
	testHelper.shouldMove( element, "cancel: default, element dragged" );

	element.draggable( "destroy" );

	element = $( "#draggable-option-cancel-default" ).draggable( { cancel: "input,textarea,button,select,option" } );
	testHelper.shouldNotDrag( element, "cancel: default, input dragged", "#draggable-option-cancel-default input" );
	element.draggable( "destroy" );
} );

test( "{ cancel: 'span' }", function() {
	expect( 4 );

	var element = $( "#draggable2" ).draggable();
	testHelper.shouldMove( element, "cancel: default, span dragged", "#draggable2 span" );

	element.draggable( "destroy" );

	element = $( "#draggable2" ).draggable( { cancel: "span" } );
	testHelper.shouldNotDrag( element, "cancel: span, span dragged", "#draggable2 span" );
} );

test( "{ cancel: ? }, unexpected", function() {
	expect( 12 );

	var element,
		unexpected = {
			"true": true,
			"false": false,
			"{}": {},
			"[]": [],
			"null": null,
			"undefined": undefined
		};

	$.each( unexpected, function( key, val ) {
		element = $( "#draggable2" ).draggable( { cancel: val } );
		testHelper.shouldMove( element, "cancel: " + key );
		element.draggable( "destroy" );
	} );
} );

/*
test( "{ cancel: Selectors }, matching parent selector", function() {

	expect( 4 );

	var element = $( "#draggable2" ).draggable({ cancel: "span a" });

	$( "#qunit-fixture" ).append( "<span id='wrapping'><a></a></span>" );

	element.find( "span" ).append( "<a>" );

	$( "#wrapping a" ).append( element );

	testHelper.shouldMove( element, "drag span child", "#draggable2 span" );
	testHelper.shouldNotDrag( $( "#draggable2 span a" ), "drag span a" );
	testHelper.shouldNotDrag( $( "#wrapping a" ), "drag wrapping a" );

	$( "#draggable2" ).draggable( "option", "cancel", "span > a" );
	$( "#draggable2" ).find( "a" ).append( "<a>" );

	testHelper.shouldMove( element, "drag span child", $( "#draggable2 span a" ).last() );
	testHelper.shouldNotDrag( $( "#draggable2 span a" ).first(), "drag span a first child" );
});
*/

test( "cancelement, default, switching after initialization", function() {
	expect( 6 );

	$( "<div id='draggable-option-cancel-default'><input type='text'></div>" ).appendTo( "#qunit-fixture" );

	var input = $( "#draggable-option-cancel-default input" ),
		element = $( "#draggable-option-cancel-default" ).draggable();

	testHelper.shouldNotDrag( element, "cancel: default, input dragged", input );

	element.draggable( "option", "cancel", "textarea" );
	testHelper.shouldMove( element, "cancel: textarea, input dragged", input );

	element.draggable( "option", "cancel", "input" );
	testHelper.shouldNotDrag( element, "cancel: input, input dragged", input );
} );

test( "connectToSortable, dragging out of a sortable", function() {
	expect( 4 );

	var sortItem, dragHelper,
		element = $( "#draggableSortable" ).draggable( {
			scroll: false,
			connectToSortable: "#sortable"
		} ),
		sortable = $( "#sortable" ).sortable( { revert: 100 } ),
		dx = 50,
		dy = 50,
		offsetBefore = element.offset(),
		offsetExpected = {
			left: offsetBefore.left + dx,
			top: offsetBefore.top + dy
		};

	$( sortable ).one( "sortstart", function( event, ui ) {
		sortItem = ui.item;
	} );

	$( element ).one( "drag", function( event, ui ) {
		dragHelper = ui.helper;
	} );

	$( element ).one( "dragstop", function( event, ui ) {

		// http://bugs.jqueryui.com/ticket/8809
		// Position issue when connected to sortable
		deepEqual( ui.helper.offset(), offsetExpected, "draggable offset is correct" );

		// Http://bugs.jqueryui.com/ticket/7734
		// HTML IDs are removed when dragging to a Sortable
		equal( sortItem[ 0 ], dragHelper[ 0 ], "both have the same helper" );
		equal( sortItem.attr( "id" ), dragHelper.attr( "id" ), "both have the same id" );

		// Http://bugs.jqueryui.com/ticket/9481
		// connectToSortable causes sortable revert to fail on second attempt
		equal( sortable.sortable( "option", "revert" ), 100, "sortable revert behavior is preserved" );
	} );

	element.simulate( "drag", {
		dx: dx,
		dy: dy
	} );
} );

asyncTest( "connectToSortable, dragging clone into sortable", function() {
	expect( 3 );

	var offsetPlaceholder,
		element = $( "#draggableSortableClone" ).draggable( {
			scroll: false,
			connectToSortable: "#sortable",
			helper: "clone"
		} ),
		sortable = $( "#sortable" ).sortable( { revert: 100 } ),
		offsetSortable = sortable.offset();

	$( sortable ).one( "sort", function( event, ui ) {
		offsetPlaceholder = ui.placeholder.offset();

		// http://bugs.jqueryui.com/ticket/8809
		// Position issue when connected to sortable
		deepEqual( ui.helper.offset(), offsetSortable, "sortable offset is correct" );
		notDeepEqual( ui.helper.offset(), offsetPlaceholder, "offset not equal to placeholder" );
	} );

	$( sortable ).one( "sortstop", function( event, ui ) {

		// http://bugs.jqueryui.com/ticket/9675
		// Animation issue with revert and connectToSortable
		deepEqual( ui.item.offset(), offsetPlaceholder, "offset eventually equals placeholder" );
		start();
	} );

	element.simulate( "drag", {
		x: offsetSortable.left + 1,
		y: offsetSortable.top + 1,
		moves: 1
	} );
} );

test( "connectToSortable, dragging multiple elements in and out of sortable", function() {
	expect( 1 );

	var element = $( "#draggableSortableClone" ).draggable( {
			scroll: false,
			connectToSortable: "#sortable",
			helper: "clone"
		} ),
		element2 = $( "#draggableSortable" ).draggable( {
			scroll: false,
			connectToSortable: "#sortable"
		} ),
		sortable = $( "#sortable" ).sortable( { revert: false } ),
		sortableOffset = sortable.offset();

	// Move element into sortable
	element.simulate( "drag", {
		x: sortableOffset.left + 1,
		y: sortableOffset.top + 1,
		moves: 10
	} );

	// Move element in sortable out
	element2.simulate( "drag", {
		dx: 200,
		dy: 200,
		moves: 10
	} );

	// Http://bugs.jqueryui.com/ticket/9675
	// Animation issue with revert and connectToSortable
	sortable.one( "sortstop", function( event, ui ) {
		ok( !$.contains( document, ui.placeholder[ 0 ] ), "placeholder was removed" );
	} );

	// Move the clone of the first element back out
	$( "#sortable .sortable2Item" ).simulate( "drag", {
		dx: 200,
		dy: 200,
		moves: 10
	} );
} );

test( "connectToSortable, dragging through one sortable to a second", function() {
	expect( 2 );

	var overCount = 0,
		element = $( "#draggableSortable" ).draggable( {
			scroll: false,
			connectToSortable: ".sortable"
		} ),
		delta = 200,
		sortable = $( "#sortable" ).sortable( { revert: false } ),
		sortable2 = $( "#sortable2" ).sortable( { revert: false } ),
		sortable2Offset = sortable2.offset(),
		dragParams = {
			x: sortable2Offset.left + 25,
			y: sortable2Offset.top + sortable.outerHeight() + delta,
			moves: 10
		};

	$( sortable ).one( "sortover", function() {
		overCount++;
		sortable2.css( "top", "+=" + delta );
	} );

	$( sortable2 ).on( "sortupdate", function() {
		ok( true, "second sortable is updated" );
	} );

	$( sortable2 ).one( "sortover", function() {
		overCount++;
	} );

	$( sortable2 ).one( "sortstop", function() {
		equal( overCount, 2, "went over both sortables" );
	} );

	element.simulate( "drag", dragParams );
} );

test( "connectToSortable, dragging through a sortable", function() {
	expect( 1 );

	var draggable = $( "#draggableSortable" ).draggable( {
			scroll: false,
			connectToSortable: "#sortable2"
		} ),
		sortable = $( "#sortable2" ).sortable(),
		sortableOffset = sortable.offset();

	// Http://bugs.jqueryui.com/ticket/10669
	// Draggable: Position issue with connectToSortable
	draggable.one( "dragstop", function() {
		equal( draggable.parent().attr( "id" ), "sortable", "restored draggable to original parent" );
	} );

	draggable.simulate( "drag", {
		x: sortableOffset.left + 25,
		y: sortableOffset.top + sortable.outerHeight() + 400,
		moves: 20
	} );
} );

test( "{ containment: Element }", function() {
	expect( 1 );

	var offsetAfter,
		element = $( "#draggable1" ).draggable( { containment: $( "#draggable1" ).parent()[ 0 ] } ),
		p = element.parent(),
		po = p.offset(),
		expected = {
			left: po.left + testHelper.border( p, "left" ) + testHelper.margin( element, "left" ),
			top: po.top + testHelper.border( p, "top" ) + testHelper.margin( element, "top" )
		};

	element.simulate( "drag", {
		dx: -100,
		dy: -100
	} );
	offsetAfter = element.offset();
	deepEqual( offsetAfter, expected, "compare offset to parent" );
} );

test( "{ containment: Selector }", function() {
	expect( 1 );

	var offsetAfter,
		element = $( "#draggable1" ).draggable( { containment: $( "#qunit-fixture" ) } ),
		p = element.parent(),
		po = p.offset(),
		expected = {
			left: po.left + testHelper.border( p, "left" ) + testHelper.margin( element, "left" ),
			top: po.top + testHelper.border( p, "top" ) + testHelper.margin( element, "top" )
		};

	element.simulate( "drag", {
		dx: -100,
		dy: -100
	} );
	offsetAfter = element.offset();
	deepEqual( offsetAfter, expected, "compare offset to parent" );
} );

test( "{ containment: [x1, y1, x2, y2] }", function() {
	expect( 2 );

	var element = $( "#draggable1" ).draggable(),
		eo = element.offset();

	element.draggable( "option", "containment", [ eo.left, eo.top, eo.left + element.width() + 5, eo.top + element.height() + 5 ] );

	testHelper.testDrag( element, element, -100, -100, 0, 0, "containment: [x1, y1, x2, y2]" );
} );

test( "{ containment: 'parent' }, relative", function() {
	expect( 1 );

	var offsetAfter,
		element = $( "#draggable1" ).draggable( { containment: "parent" } ),
		p = element.parent(),
		po = p.offset(),
		expected = {
			left: po.left + testHelper.border( p, "left" ) + testHelper.margin( element, "left" ),
			top: po.top + testHelper.border( p, "top" ) + testHelper.margin( element, "top" )
		};

	element.simulate( "drag", {
		dx: -100,
		dy: -100
	} );
	offsetAfter = element.offset();
	deepEqual( offsetAfter, expected, "compare offset to parent" );
} );

test( "{ containment: 'parent' }, absolute", function() {
	expect( 1 );

	var offsetAfter,
		element = $( "#draggable2" ).draggable( { containment: "parent" } ),
		p = element.parent(),
		po = p.offset(),
		expected = {
			left: po.left + testHelper.border( p, "left" ) + testHelper.margin( element, "left" ),
			top: po.top + testHelper.border( p, "top" ) + testHelper.margin( element, "top" )
		};

	element.simulate( "drag", {
		dx: -100,
		dy: -100
	} );
	offsetAfter = element.offset();
	deepEqual( offsetAfter, expected, "compare offset to parent" );
} );

test( "containment, account for border", function( assert ) {
	expect( 2 );

	var el = $( "#draggable1" ).appendTo( "#scrollParent" ),
		parent = el.parent().css( {
			height: "100px",
			width: "100px",
			borderStyle: "solid",
			borderWidth: "5px 10px 15px 20px"
		} ),
		parentBottom = parent.offset().top + parent.outerHeight(),
		parentRight = parent.offset().left + parent.outerWidth(),
		parentBorderBottom = testHelper.border( parent, "bottom" ),
		parentBorderRight = testHelper.border( parent, "right" );

	el.css( {
		height: "5px",
		width: "5px"
	} ).draggable( { containment: "parent", scroll: false } );

	el.simulate( "drag", {
		dx: 100,
		dy: 100
	} );

	assert.close( el.offset().top, parentBottom - parentBorderBottom - el.height(), 1,
		"The draggable should be on top of its parent's bottom border" );
	assert.close( el.offset().left, parentRight - parentBorderRight - el.width(), 1,
		"The draggable should be to the right of its parent's right border" );
} );

// http://bugs.jqueryui.com/ticket/7016
// draggable can be pulled out of containment in Chrome and IE8
test( "containment, element cant be pulled out of container", function() {
	expect( 1 );

	var offsetBefore,
		parent = $( "<div>" ).css( { width: 200, height: 200 } ).appendTo( "#qunit-fixture" ),
		element = $( "#draggable1" ).appendTo( parent );

	element
		.css( {
			height: "5px",
			width: "5px"
		} )
		.draggable( { containment: "parent" } )
		.simulate( "drag", {
			dx: 500,
			dy: 500
		} );

	offsetBefore = element.offset();

	element.simulate( "drag", {
		dx: 200,
		dy: 200
	} );

	deepEqual( element.offset(), offsetBefore, "The draggable should not move past bottom right edge" );
} );

test( "containment, default, switching after initialization", function() {
	expect( 8 );

	var element = $( "#draggable1" ).draggable( { containment: false, scroll: false } ),
		po = element.parent().offset(),
		containment = [ po.left - 100, po.top - 100, po.left + 500, po.top + 500 ];

	testHelper.testDrag( element, element, -100, -100, -100, -100, "containment: default" );

	element.draggable( "option", "containment", "parent" ).css( { top: 0, left: 0 } );
	testHelper.testDrag( element, element, -100, -100, 0, 0, "containment: parent as option" );

	element.draggable( "option", "containment", containment ).css( { top: 0, left: 0 } );
	testHelper.testDrag( element, element, -100, -100, -100, -100, "containment: array as option" );

	element.draggable( "option", "containment", false );
	testHelper.testDrag( element, element, -100, -100, -100, -100, "containment: false as option" );
} );

test( "{ cursor: 'auto' }, default", function() {
	function getCursor() {
		return $( "#draggable2" ).css( "cursor" );
	}

	expect( 2 );

	var actual, after,
		expected = "auto",
		element = $( "#draggable2" ).draggable( {
			cursor: expected,
			start: function() {
				actual = getCursor();
			}
		} ),
		before = getCursor();

	element.simulate( "drag", {
		dx: -1,
		dy: -1
	} );
	after = getCursor();

	equal( actual, expected, "start callback: cursor '" + expected + "'" );
	equal( after, before, "after drag: cursor restored" );
} );

test( "{ cursor: 'move' }", function() {
	function getCursor() {
		return $( "body" ).css( "cursor" );
	}

	expect( 2 );

	var actual, after,
		expected = "move",
		element = $( "#draggable2" ).draggable( {
			cursor: expected,
			start: function() {
				actual = getCursor();
			}
		} ),
		before = getCursor();

	element.simulate( "drag", {
		dx: -1,
		dy: -1
	} );
	after = getCursor();

	equal( actual, expected, "start callback: cursor '" + expected + "'" );
	equal( after, before, "after drag: cursor restored" );
} );

test( "#6889: Cursor doesn't revert to pre-dragging state after revert action when original element is removed", function() {
	function getCursor() {
		return $( "body" ).css( "cursor" );
	}

	expect( 2 );

	var element = $( "#draggable1" ).wrap( "<div id='wrapper' />" ).draggable( {
			cursor: "move",
			revert: true,
			revertDuration: 0,
			start: function() {
				notEqual( getCursor(), expected, "start callback: cursor '" + expected + "'" );
				$( "#wrapper" ).remove();
			},
			stop: function() {
				equal( getCursor(), expected, "after drag: cursor restored" );
			}
		} ),
		expected = getCursor();

	if ( testHelper.unreliableContains ) {
		ok( true, "Opera <12.14 and Safari <6.0 report wrong values for $.contains in jQuery < 1.8" );
		ok( true, "Opera <12.14 and Safari <6.0 report wrong values for $.contains in jQuery < 1.8" );
	} else {
		element.simulate( "drag", {
			dx: -1,
			dy: -1
		} );
	}
} );

test( "cursor, default, switching after initialization", function() {
	expect( 3 );

	var element = $( "#draggable1" ).draggable();

	testHelper.trackMouseCss( element );

	testHelper.move( element, 1, 1 );
	equal( element.data( "last_dragged_cursor" ), "auto" );

	element.draggable( "option", "cursor", "move" );
	testHelper.move( element, 1, 1 );
	equal( element.data( "last_dragged_cursor" ), "move" );

	element.draggable( "option", "cursor", "ns-resize" );
	testHelper.move( element, 1, 1 );
	equal( element.data( "last_dragged_cursor" ), "ns-resize" );
} );

test( "cursorAt", function() {
	expect( 24 );

	var deltaX = -3,
		deltaY = -3,
		tests = {
			"false": { cursorAt: false },
			"{ left: -5, top: -5 }": { x: -5, y: -5, cursorAt: { left: -5, top: -5 } },
			"[ 10, 20 ]": { x: 10, y: 20, cursorAt: [ 10, 20 ] },
			"'10 20'": { x: 10, y: 20, cursorAt: "10 20" },
			"{ left: 20, top: 40 }": { x: 20, y: 40, cursorAt: { left: 20, top: 40 } },
			"{ right: 10, bottom: 20 }": { x: 10, y: 20, cursorAt: { right: 10, bottom: 20 } }
		};

	$.each( tests, function( testName, testData ) {
		$.each( [ "relative", "absolute" ], function( i, position ) {
			var element = $( "#draggable" + ( i + 1 ) ).draggable( {
					cursorAt: testData.cursorAt,
					drag: function( event, ui ) {
						if ( !testData.cursorAt ) {
							equal( ui.position.left - ui.originalPosition.left, deltaX, testName + " " + position + " left" );
							equal( ui.position.top - ui.originalPosition.top, deltaY, testName + " " + position + " top" );
						} else if ( testData.cursorAt.right ) {
							equal( ui.helper.width() - ( event.clientX - ui.offset.left ), testData.x - testHelper.unreliableOffset, testName + " " + position + " left" );
							equal( ui.helper.height() - ( event.clientY - ui.offset.top ), testData.y - testHelper.unreliableOffset, testName + " " + position + " top" );
						} else {
							equal( event.clientX - ui.offset.left, testData.x + testHelper.unreliableOffset, testName + " " + position + " left" );
							equal( event.clientY - ui.offset.top, testData.y + testHelper.unreliableOffset, testName + " " + position + " top" );
						}
					}
			} );

			element.simulate( "drag", {
				moves: 1,
				dx: deltaX,
				dy: deltaY
			} );
		} );
	} );
} );

test( "cursorAt, switching after initialization", function() {
	expect( 24 );

	var deltaX = -3,
		deltaY = -3,
		tests = {
			"false": { cursorAt: false },
			"{ left: -5, top: -5 }": { x: -5, y: -5, cursorAt: { left: -5, top: -5 } },
			"[ 10, 20 ]": { x: 10, y: 20, cursorAt: [ 10, 20 ] },
			"'10 20'": { x: 10, y: 20, cursorAt: "10 20" },
			"{ left: 20, top: 40 }": { x: 20, y: 40, cursorAt: { left: 20, top: 40 } },
			"{ right: 10, bottom: 20 }": { x: 10, y: 20, cursorAt: { right: 10, bottom: 20 } }
		};

	$.each( tests, function( testName, testData ) {
		$.each( [ "relative", "absolute" ], function( i, position ) {
			var element = $( "#draggable" + ( i + 1 ) );

			element.draggable( {
					drag: function( event, ui ) {
						if ( !testData.cursorAt ) {
							equal( ui.position.left - ui.originalPosition.left, deltaX, testName + " " + position + " left" );
							equal( ui.position.top - ui.originalPosition.top, deltaY, testName + " " + position + " top" );
						} else if ( testData.cursorAt.right ) {
							equal( ui.helper.width() - ( event.clientX - ui.offset.left ), testData.x - testHelper.unreliableOffset, testName + " " + position + " left" );
							equal( ui.helper.height() - ( event.clientY - ui.offset.top ), testData.y - testHelper.unreliableOffset, testName + " " + position + " top" );
						} else {
							equal( event.clientX - ui.offset.left, testData.x + testHelper.unreliableOffset, testName + " " + position + " left" );
							equal( event.clientY - ui.offset.top, testData.y + testHelper.unreliableOffset, testName + " " + position + " top" );
						}
					}
			} );

			element.draggable( "option", "cursorAt", false );
			element.draggable( "option", "cursorAt", testData.cursorAt );

			element.simulate( "drag", {
				moves: 1,
				dx: deltaX,
				dy: deltaY
			} );
		} );
	} );
} );

test( "disabled", function() {
	expect( 6 );

	var element = $( "#draggable1" ).draggable();

	testHelper.shouldMove( element, "disabled: default" );

	element.draggable( "option", "disabled", true );
	testHelper.shouldNotDrag( element, "option: disabled true" );

	element.draggable( "option", "disabled", false );
	testHelper.shouldMove( element, "option: disabled false" );
} );

test( "{ grid: [50, 50] }, relative", function() {
	expect( 4 );

	var element = $( "#draggable1" ).draggable( { grid: [ 50, 50 ] } );
	testHelper.testDrag( element, element, 24, 24, 0, 0, "grid: [50, 50] relative" );
	testHelper.testDrag( element, element, 26, 25, 50, 50, "grid: [50, 50] relative" );
} );

test( "{ grid: [50, 50] }, absolute", function() {
	expect( 4 );

	var element = $( "#draggable2" ).draggable( { grid: [ 50, 50 ] } );
	testHelper.testDrag( element, element, 24, 24, 0, 0, "grid: [50, 50] absolute" );
	testHelper.testDrag( element, element, 26, 25, 50, 50, "grid: [50, 50] absolute" );
} );

test( "grid, switching after initialization", function() {
	expect( 8 );

	var element = $( "#draggable1" ).draggable();

	// Forward
	testHelper.testDrag( element, element, 24, 24, 24, 24, "grid: default" );
	testHelper.testDrag( element, element, 0, 0, 0, 0, "grid: default" );

	element.draggable( "option", "grid", [ 50, 50 ] );

	testHelper.testDrag( element, element, 24, 24, 0, 0, "grid: [50, 50] as option" );
	testHelper.testDrag( element, element, 26, 25, 50, 50, "grid: [50, 50] as option" );
} );

test( "{ handle: 'span' }", function() {
	expect( 6 );

	var element = $( "#draggable2" ).draggable( { handle: "span" } );

	testHelper.shouldMove( element, "handle: span", "#draggable2 span" );
	testHelper.shouldMove( element, "handle: span child", "#draggable2 span em" );
	testHelper.shouldNotDrag( element, "handle: span element" );
} );

test( "handle, default, switching after initialization", function() {
	expect( 12 );

	var element = $( "#draggable2" ).draggable();

	testHelper.shouldMove( element, "handle: default, element dragged" );
	testHelper.shouldMove( element, "handle: default, span dragged", "#draggable2 span" );

	// Switch
	element.draggable( "option", "handle", "span" );
	testHelper.shouldNotDrag( element, "handle: span as option, element dragged" );
	testHelper.shouldMove( element, "handle: span as option, span dragged", "#draggable2 span" );

	// And back
	element.draggable( "option", "handle", false );
	testHelper.shouldMove( element, "handle: false as option, element dragged" );
	testHelper.shouldMove( element, "handle: false as option, span dragged", "#draggable2 span" );
} );

test( "helper, default, switching after initialization", function() {
	expect( 6 );

	var element = $( "#draggable1" ).draggable();
	testHelper.shouldMove( element, "helper: default" );

	element.draggable( "option", "helper", "clone" );
	testHelper.shouldMove( element, "helper: clone" );

	element.draggable( "option", "helper", "original" );
	testHelper.shouldMove( element, "helper: original" );
} );

// http://bugs.jqueryui.com/ticket/9446
// Draggable: helper function cannot emulate default behavior
test( "helper, function returning original element", function() {
	expect( 1 );

	var element = $( "#draggable1" ).css( "position", "static" ).draggable( {
		helper: function() {
			return this;
		}
	} );

	testHelper.testDragHelperOffset( element, 100, 100, 100, 100, "original element is draggable" );

	element.simulate( "drag", {
		dx: 100,
		dy: 100
	} );
} );

function testHelperPosition( scrollPositions, position, helper, scrollElements, scrollElementsTitle ) {
	test( "{ helper: '" + helper + "' }, " + position + ", with scroll offset on " + scrollElementsTitle, function() {
		expect( scrollPositions.length * 2 );

		var i, j,
			element = $( "#draggable1" ).css( { position: position, top: 0, left: 0 } ).draggable( {
				helper: helper,
				scroll: false
			} );

		if ( scrollElements.length === 1 && scrollElements[ 0 ] === "#scrollParent" ) {
			testHelper.setScrollable( "#main", false );
			testHelper.setScrollable( "#scrollParent", true );
		}

		for ( j = 0; j < scrollPositions.length; j++ ) {
			for ( i = 0; i < scrollElements.length; i++ ) {
				testHelper.setScroll( scrollElements[ i ] );
			}

			testHelper.testScroll( element, scrollPositions[ j ] );

			for ( i = 0; i < scrollElements.length; i++ ) {
				testHelper.restoreScroll( scrollElements[ i ] );
			}
		}

		if ( scrollElements.length === 1 && scrollElements[ 1 ] === "#scrollParent" ) {
			testHelper.setScrollable( "#main", true );
			testHelper.setScrollable( "#scrollParent", false );
		}
	} );
}

( function() {
	var scrollElementsMap = {
			"no elements": [],
			"parent": [ "#main" ],
			"root": [ document ],
			"parent and root": [ "#main", document ],
			"grandparent": [ "#scrollParent" ]
		},
		positions = [ "absolute", "fixed", "relative", "static" ],
		helpers = [ "original", "clone" ],

		// static is not an option here since the fixture is in an absolute container
		scrollPositions = [ "relative", "absolute", "fixed" ];

	$.each( helpers, function() {
		var helper = this;
		$.each( positions, function() {
			var position = this;
			$.each( scrollElementsMap, function( scrollElementsTitle, scrollElements ) {
				testHelperPosition( scrollPositions, position, helper, scrollElements, scrollElementsTitle );
			} );
		} );
	} );
} )();

test( "{ opacity: 0.5 }", function() {
	expect( 1 );

	var opacity = null,
		element = $( "#draggable2" ).draggable( {
			opacity: 0.5,
			start: function() {
				opacity = $( this ).css( "opacity" );
			}
		} );

	element.simulate( "drag", {
		dx: -1,
		dy: -1
	} );

	equal( opacity, 0.5, "start callback: opacity is" );
} );

test( "opacity, default, switching after initialization", function() {
	expect( 3 );

	var opacity = null,
		element = $( "#draggable2" ).draggable( {
			start: function() {
				opacity = $( this ).css( "opacity" );
			}
		} );

	testHelper.move( element, 1, 1 );
	equal( opacity, 1 );

	element.draggable( "option", "opacity", 0.5 );
	testHelper.move( element, 2, 1 );
	equal( opacity, 0.5 );

	element.draggable( "option", "opacity", false );
	testHelper.move( element, 3, 1 );
	equal( opacity, 1 );
} );

asyncTest( "revert and revertDuration", function() {
	expect( 7 );

	var element = $( "#draggable2" ).draggable( {
		revert: true,
		revertDuration: 0
	} );
	testHelper.shouldMovePositionButNotOffset( element, "revert: true, revertDuration: 0 should revert immediately" );

	$( "#draggable2" ).draggable( "option", "revert", "invalid" );
	testHelper.shouldMovePositionButNotOffset( element, "revert: invalid, revertDuration: 0 should revert immediately" );

	$( "#draggable2" ).draggable( "option", "revert", false );
	testHelper.shouldMove( element, "revert: false should allow movement" );

	$( "#draggable2" ).draggable( "option", {
		revert: true,
		revertDuration: 200,
		stop: function() {
			start();
		}
	} );

	// Animation are async, so test for it asynchronously
	testHelper.move( element, 50, 50 );
	setTimeout( function() {
		ok( $( "#draggable2" ).is( ":animated" ), "revert: true with revertDuration should animate" );
	} );
} );

test( "revert: valid", function() {
	expect( 2 );

	var element = $( "#draggable2" ).draggable( {
			revert: "valid",
			revertDuration: 0
		} );

	$( "#droppable" ).droppable();

	testHelper.shouldMovePositionButNotOffset( element, "revert: valid reverts when dropped on a droppable" );
} );

test( "scope", function() {
	expect( 4 );

	var element = $( "#draggable2" ).draggable( {
		scope: "tasks",
		revert: "valid",
		revertDuration: 0
	} );

	$( "#droppable" ).droppable( { scope: "tasks" } );

	testHelper.shouldMovePositionButNotOffset( element, "revert: valid reverts when dropped on a droppable in scope" );

	$( "#droppable" ).droppable( "destroy" ).droppable( { scope: "nottasks" } );

	testHelper.shouldMove( element, "revert: valid reverts when dropped on a droppable out of scope" );
} );

test( "scroll, scrollSensitivity, and scrollSpeed", function() {
	expect( 2 );

	testHelper.setScrollable( "#main", false );

	var currentScrollTop,
		viewportHeight = $( window ).height(),
		element = $( "#draggable1" ).draggable( { scroll: true } ).appendTo( "#qunit-fixture" ),
		scrollSensitivity = element.draggable( "option", "scrollSensitivity" ),
		scrollSpeed = element.draggable( "option", "scrollSpeed" );

	element.offset( {
		top: viewportHeight - scrollSensitivity - 1,
		left: 1
	} );

	$( element ).one( "drag", function() {
		equal( $( window ).scrollTop(), 0, "scroll: true doesn't scroll when the element is dragged outside of scrollSensitivity" );
	} );

	element.simulate( "drag", {
		dx: 1,
		y: viewportHeight - scrollSensitivity - 1,
		moves: 1
	} );

	element.draggable( "option", "scrollSensitivity", scrollSensitivity + 10 );

	element.offset( {
		top: viewportHeight - scrollSensitivity - 1,
		left: 1
	} );

	currentScrollTop = $( window ).scrollTop();

	$( element ).one( "drag", function() {
		ok( $( window ).scrollTop() - currentScrollTop, scrollSpeed, "scroll: true scrolls when the element is dragged within scrollSensitivity" );
	} );

	element.simulate( "drag", {
		dx: 1,
		y: viewportHeight - scrollSensitivity - 1,
		moves: 1
	} );

	testHelper.restoreScroll( document );
} );

test( "scroll ignores containers that are overflow: hidden", function() {
	expect( 2 );

	var scrollParent = $( "#scrollParent" ),
		element = $( "#draggable1" ).draggable().appendTo( scrollParent );

	element.draggable( "option", "scroll", false );

	element.simulate( "drag", {
		dx: 1300,
		dy: 1300
	} );

	// IE8 natively scrolls when dragging an element inside a overflow:hidden
	// container, so skip this test if native scroll occurs.
	// Support: IE <9
	if ( scrollParent.scrollTop() > 0 ) {
		ok( true, "overflow:hidden container natively scrolls" );
		ok( true, "overflow:hidden container natively scrolls" );
		return;
	}

	element.css( { top: 0, left: 0 } ).draggable( "option", "scroll", true );

	element.simulate( "drag", {
		dx: 1300,
		dy: 1300
	} );

	equal( scrollParent.scrollTop(), 0, "container doesn't scroll vertically" );
	equal( scrollParent.scrollLeft(), 0, "container doesn't scroll horizontally" );
} );

test( "#6817: auto scroll goes double distance when dragging", function( assert ) {
	expect( 2 );

	testHelper.restoreScroll( document );

	var offsetBefore,
		distance = 10,
		viewportHeight = $( window ).height(),
		element = $( "#draggable1" ).draggable( {
			scroll: true,
			stop: function( e, ui ) {
				equal( ui.offset.top, newY, "offset of item matches pointer position after scroll" );

				// TODO: fix IE8 testswarm IFRAME positioning bug so assert.close can be turned back to equal
				assert.close( ui.offset.top - offsetBefore.top, distance, 1, "offset of item only moves expected distance after scroll" );
			}
		} ),
		scrollSensitivity = element.draggable( "option", "scrollSensitivity" ),
		oldY = viewportHeight - scrollSensitivity,
		newY = oldY + distance;

	element.offset( {
		top: oldY,
		left: 1
	} );

	offsetBefore = element.offset();

	element.simulate( "drag", {
		handle: "corner",
		dx: 1,
		y: newY,
		moves: 1
	} );

	testHelper.restoreScroll( document );
} );

test( "snap, snapMode, and snapTolerance", function( assert ) {
	expect( 10 );

	var newX, newY,
		snapTolerance = 15,
		element = $( "#draggable1" ).draggable( {
			snap: true,
			scroll: false,
			snapMode: "both",
			snapTolerance: snapTolerance
		} ),
		element2 = $( "#draggable2" ).draggable();

	// Http://bugs.jqueryui.com/ticket/9724
	// Draggable: Snapping coordinates thrown off by margin on draggable
	element.css( "margin", "3px" );

	element.offset( {
		top: 1,
		left: 1
	} );

	newX = element2.offset().left - element.outerWidth() - snapTolerance - 2;
	newY = element2.offset().top;

	element.simulate( "drag", {
		handle: "corner",
		x: newX,
		y: newY,
		moves: 1
	} );

	// TODO: fix IE8 testswarm IFRAME positioning bug so assert.close can be turned back to equal
	assert.close( element.offset().left, newX, 1, "doesn't snap outside the snapTolerance" );
	assert.close( element.offset().top, newY, 1, "doesn't snap outside the snapTolerance" );

	newX += 3;

	element.simulate( "drag", {
		handle: "corner",
		x: newX,
		y: newY,
		moves: 1
	} );

	notDeepEqual( element.offset(), { top: newY, left: newX }, "snaps inside the snapTolerance" );

	element.draggable( "option", "snap", "#draggable2" );

	element.simulate( "drag", {
		handle: "corner",
		x: newX,
		y: newY,
		moves: 1
	} );

	notDeepEqual( element.offset(), { top: newY, left: newX }, "snaps based on selector" );

	element.draggable( "option", "snap", "#draggable3" );

	element.simulate( "drag", {
		handle: "corner",
		x: newX,
		y: newY,
		moves: 1
	} );

	deepEqual( element.offset(), { top: newY, left: newX }, "doesn't snap based on invalid selector" );

	element.draggable( "option", "snap", true );
	element.draggable( "option", "snapTolerance", snapTolerance - 2 );
	element.simulate( "drag", {
		handle: "corner",
		x: newX,
		y: newY,
		moves: 1
	} );

	deepEqual( element.offset(), { top: newY, left: newX }, "doesn't snap outside the modified snapTolerance" );

	element.draggable( "option", "snapTolerance", snapTolerance );
	element.draggable( "option", "snapMode", "inner" );

	element.simulate( "drag", {
		handle: "corner",
		x: newX,
		y: newY,
		moves: 1
	} );

	deepEqual( element.offset(), { top: newY, left: newX }, "doesn't snap inside the outer snapTolerance area when snapMode is inner" );

	newX = element2.offset().left - snapTolerance - 1;
	newY = element2.offset().top;

	element.simulate( "drag", {
		handle: "corner",
		x: newX,
		y: newY,
		moves: 1
	} );

	deepEqual( element.offset(), { top: newY, left: newX }, "doesn't snap inside the outer snapTolerance area when snapMode is inner" );

	newX++;

	element.simulate( "drag", {
		handle: "corner",
		x: newX,
		y: newY,
		moves: 1
	} );

	notDeepEqual( element.offset(), { top: newY, left: newX }, "snaps inside the inner snapTolerance area when snapMode is inner" );

	element.draggable( "option", "snapMode", "outer" );

	element.simulate( "drag", {
		handle: "corner",
		x: newX,
		y: newY,
		moves: 1
	} );

	deepEqual( element.offset(), { top: newY, left: newX }, "doesn't snap on the inner snapTolerance area when snapMode is outer" );
} );

test( "#8459: element can snap to an element that was removed during drag", function( assert ) {
	expect( 2 );

	var newX, newY,
		snapTolerance = 15,
		element = $( "#draggable1" ).draggable( {
			snap: true,
			scroll: false,
			snapMode: "both",
			snapTolerance: snapTolerance,
			start: function() {
				element2.remove();
			}
		} ),
		element2 = $( "#draggable2" ).draggable();

	element.offset( {
		top: 1,
		left: 1
	} );

	newX = element2.offset().left - element.outerWidth() - snapTolerance + 1;
	newY = element2.offset().top;

	element.simulate( "drag", {
		handle: "corner",
		x: newX,
		y: newY,
		moves: 1
	} );

	// Support: Opera 12.10, Safari 5.1, jQuery <1.8
	if ( testHelper.unreliableContains ) {
		ok( true, "Opera <12.14 and Safari <6.0 report wrong values for $.contains in jQuery < 1.8" );
		ok( true, "Opera <12.14 and Safari <6.0 report wrong values for $.contains in jQuery < 1.8" );
	} else {

		// TODO: fix IE8 testswarm IFRAME positioning bug so assert.close can be turned back to equal
		assert.close( element.offset().left, newX, 1, "doesn't snap to a removed element" );
		assert.close( element.offset().top, newY, 1, "doesn't snap to a removed element" );
	}
} );

test( "#8165: Snapping large rectangles to small rectangles doesn't snap properly", function() {
	expect( 1 );

	var snapTolerance = 20,
		y = 1,
		element = $( "#draggable1" )
			.css( {
				width: "50px",
				height: "200px"
			} ).offset( {
				top: y,
				left: 1
			} ),
		element2 = $( "#draggable2" )
			.css( {
				width: "50px",
				height: "50px"
			} ).offset( {
				top: y + snapTolerance + 1,
				left: 200
			} ),
		newX = element2.offset().left - element.outerWidth() - snapTolerance + 1;

	$( "#draggable1, #draggable2" ).draggable( {
		snap: true,
		snapTolerance: snapTolerance
	} );

	element.simulate( "drag", {
		handle: "corner",
		x: newX,
		moves: 1
	} );

	notDeepEqual( element.offset(), { top: y, left: newX }, "snaps even if only a side (not a corner) is inside the snapTolerance" );
} );

test( "stack", function() {
	expect( 2 );

	var element = $( "#draggable1" ).draggable( {
			stack: "#draggable1, #draggable2"
		} ),
		element2 = $( "#draggable2" ).draggable( {
			stack: "#draggable1, #draggable2"
		} );

	testHelper.move( element, 1, 1 );
	equal( element.css( "zIndex" ), "2", "stack increments zIndex correctly" );

	testHelper.move( element2, 1, 1 );
	equal( element2.css( "zIndex" ), "3", "stack increments zIndex correctly" );
} );

test( "{ zIndex: 10 }", function() {
	expect( 1 );

	var actual,
		expected = 10,
		element = $( "#draggable2" ).draggable( {
			zIndex: expected,
			start: function() {
				actual = $( this ).css( "zIndex" );
			}
		} );

	element.simulate( "drag", {
		dx: -1,
		dy: -1
	} );

	equal( actual, expected, "start callback: zIndex is" );

} );

test( "zIndex, default, switching after initialization", function() {

	expect( 3 );

	var zindex = null,
		element = $( "#draggable2" ).draggable( {
			start: function() {
				zindex = $( this ).css( "z-index" );
			}
		} );

	element.css( "z-index", 1 );

	testHelper.move( element, 1, 1 );
	equal( zindex, 1 );

	element.draggable( "option", "zIndex", 5 );
	testHelper.move( element, 2, 1 );
	equal( zindex, 5 );

	element.draggable( "option", "zIndex", false );
	testHelper.move( element, 3, 1 );
	equal( zindex, 1 );

} );

test( "iframeFix", function() {
	expect( 5 );

	var element = $( "<div>" ).appendTo( "#qunit-fixture" ).draggable( { iframeFix: true } ),
		element2 = $( "<div>" ).appendTo( "#qunit-fixture" ).draggable( { iframeFix: ".iframe" } ),
		iframe = $( "<iframe>" ).appendTo( element );

	element2
		.append( "<iframe class='iframe'></iframe>" )
		.append( "<iframe>" );

	iframe.css( {
		width: 1,
		height: 1
	} );

	element.one( "drag", function() {
		var div = $( this ).children().not( "iframe" );

		// http://bugs.jqueryui.com/ticket/9671
		// iframeFix doesn't handle iframes that move
		equal( div.length, 1, "blocking div added as sibling" );
		equal( div.outerWidth(), iframe.outerWidth(), "blocking div is wide enough" );
		equal( div.outerHeight(), iframe.outerHeight(), "blocking div is tall enough" );
		deepEqual( div.offset(), iframe.offset(), "blocking div is tall enough" );
	} );

	element.simulate( "drag", {
		dx: 1,
		dy: 1
	} );

	element2.one( "drag", function() {
		var div = $( this ).children().not( "iframe" );
		equal( div.length, 1, "blocking div added as sibling only to matching selector" );
	} );

	element2.simulate( "drag", {
		dx: 1,
		dy: 1
	} );
} );

} );
