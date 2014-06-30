(function( $ ) {

module( "draggable: options" );

// TODO: This doesn't actually test whether append happened, possibly remove
test( "{ appendTo: 'parent' }, default, no clone", function() {
	expect( 4 );
	var element = $( "#draggable2" ).draggable({ appendTo: "parent" });
	TestHelpers.draggable.shouldMove( element, "absolute appendTo: parent" );

	element = $( "#draggable1" ).draggable({ appendTo: "parent" });
	TestHelpers.draggable.shouldMove( element, "relative appendTo: parent" );
});

// TODO: This doesn't actually test whether append happened, possibly remove
test( "{ appendTo: Element }, no clone", function() {
	expect( 4 );
	var element = $( "#draggable2" ).draggable({ appendTo: $( "#draggable2" ).parent()[ 0 ] });

	TestHelpers.draggable.shouldMove( element, "absolute appendTo: Element" );

	element = $( "#draggable1" ).draggable({ appendTo: $( "#draggable2" ).parent()[ 0 ] });
	TestHelpers.draggable.shouldMove( element, "relative appendTo: Element" );
});

// TODO: This doesn't actually test whether append happened, possibly remove
test( "{ appendTo: Selector }, no clone", function() {
	expect( 4 );
	var element = $( "#draggable2" ).draggable({ appendTo: "#main" });
	TestHelpers.draggable.shouldMove( element, "absolute appendTo: Selector" );

	element = $( "#draggable1" ).draggable({ appendTo: "#main" });
	TestHelpers.draggable.shouldMove( element, "relative appendTo: Selector" );
});

test( "{ appendTo: 'parent' }, default", function() {
	expect( 2 );

	var element = $( "#draggable1" ).draggable();

	TestHelpers.draggable.trackAppendedParent( element );

	equal( element.draggable( "option", "appendTo" ), "parent" );

	TestHelpers.draggable.move( element, 1, 1 );
	equal( element.data( "last_dragged_parent" ), $( "#main" )[ 0 ] );
});

test( "{ appendTo: Element }", function() {
	expect( 1 );

	var appendTo = $( "#draggable2" ).parent()[ 0 ],
		element = $( "#draggable1" ).draggable({ appendTo: appendTo });

	TestHelpers.draggable.trackAppendedParent( element );

	TestHelpers.draggable.move( element, 1, 1 );
	equal( element.data( "last_dragged_parent" ), appendTo );
});

test( "{ appendTo: jQuery }", function() {
	expect( 1 );

	var appendTo = $( "#draggable2" ).parent(),
		element = $( "#draggable1" ).draggable({ appendTo: appendTo });

	TestHelpers.draggable.trackAppendedParent( element );

	TestHelpers.draggable.move( element, 1, 1 );
	equal( element.data( "last_dragged_parent" ), appendTo[ 0 ] );
});

test( "{ appendTo: Selector }", function() {
	expect( 1 );

	var appendTo = "#main",
		element = $( "#draggable1" ).draggable({ appendTo: appendTo });

	TestHelpers.draggable.trackAppendedParent( element );

	TestHelpers.draggable.move( element, 1, 1 );
	equal( element.data( "last_dragged_parent" ), $(appendTo)[ 0 ] );
});

test( "appendTo, default, switching after initialization", function() {
	expect( 2 );

	var element = $( "#draggable1" ).draggable({ helper: "clone" });

	TestHelpers.draggable.trackAppendedParent( element );

	// Move and make sure element was appended to fixture
	TestHelpers.draggable.move( element, 1, 1 );
	equal( element.data( "last_dragged_parent" ), $( "#main" )[ 0 ] );

	// Move and make sure element was appended to main
	element.draggable( "option", "appendTo", $( "#qunit-fixture" ) );
	TestHelpers.draggable.move( element, 2, 2 );
	equal( element.data( "last_dragged_parent" ), $( "#qunit-fixture" )[ 0 ] );
});

test( "{ axis: false }, default", function() {
	expect( 2 );
	var element = $( "#draggable2" ).draggable({ axis: false });
	TestHelpers.draggable.shouldMove( element, "axis: false" );
});

test( "{ axis: 'x' }", function() {
	expect( 2 );
	var element = $( "#draggable2" ).draggable({ axis: "x" });
	TestHelpers.draggable.testDrag( element, element, 50, 50, 50, 0, "axis: x" );
});

test( "{ axis: 'y' }", function() {
	expect( 2 );
	var element = $( "#draggable2" ).draggable({ axis: "y" });
	TestHelpers.draggable.testDrag( element, element, 50, 50, 0, 50, "axis: y" );
});

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

	$.each(unexpected, function(key, val) {
		element = $( "#draggable2" ).draggable({ axis: val });
		TestHelpers.draggable.shouldMove( element, "axis: " + key );
		element.draggable( "destroy" );
	});
});

test( "axis, default, switching after initialization", function() {
	expect( 6 );

	var element = $( "#draggable1" ).draggable({ axis: false });

	// Any Direction
	TestHelpers.draggable.shouldMove( element, "axis: default" );

	// Only horizontal
	element.draggable( "option", "axis", "x" );
	TestHelpers.draggable.testDrag( element, element, 50, 50, 50, 0, "axis: x as option" );

	// Vertical only
	element.draggable( "option", "axis", "y" );
	TestHelpers.draggable.testDrag( element, element, 50, 50, 0, 50, "axis: y as option" );

});

test( "{ cancel: 'input,textarea,button,select,option' }, default", function() {
	expect( 2 );

	$( "<div id='draggable-option-cancel-default'><input type='text'></div>" ).appendTo( "#qunit-fixture" );

	var element = $( "#draggable-option-cancel-default" ).draggable({ cancel: "input,textarea,button,select,option" });
	TestHelpers.draggable.shouldMove( element, "cancel: default, element dragged" );

	element.draggable( "destroy" );

	element = $( "#draggable-option-cancel-default" ).draggable({ cancel: "input,textarea,button,select,option" });
	TestHelpers.draggable.shouldNotDrag( element, "cancel: default, input dragged", "#draggable-option-cancel-default input" );
	element.draggable( "destroy" );
});

test( "{ cancel: 'span' }", function() {
	expect( 2 );

	var element = $( "#draggable2" ).draggable();
	TestHelpers.draggable.shouldMove( element, "cancel: default, span dragged", "#draggable2 span" );

	element.draggable( "destroy" );

	element = $( "#draggable2" ).draggable({ cancel: "span" });
	TestHelpers.draggable.shouldNotDrag( element, "cancel: span, span dragged","#draggable2 span" );
});

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
		element = $( "#draggable2" ).draggable({ cancel: val });
		TestHelpers.draggable.shouldMove( element, "cancel: " + key );
		element.draggable( "destroy" );
	});
});

/*
test( "{ cancel: Selectors }, matching parent selector", function() {

	expect( 4 );

	var element = $( "#draggable2" ).draggable({ cancel: "span a" });

	$( "#qunit-fixture" ).append( "<span id='wrapping'><a></a></span>" );

	element.find( "span" ).append( "<a>" );

	$( "#wrapping a" ).append( element );

	TestHelpers.draggable.shouldMove( element, "drag span child", "#draggable2 span" );
	TestHelpers.draggable.shouldNotDrag( $( "#draggable2 span a" ), "drag span a" );
	TestHelpers.draggable.shouldNotDrag( $( "#wrapping a" ), "drag wrapping a" );

	$( "#draggable2" ).draggable( "option", "cancel", "span > a" );
	$( "#draggable2" ).find( "a" ).append( "<a>" );

	TestHelpers.draggable.shouldMove( element, "drag span child", $( "#draggable2 span a" ).last() );
	TestHelpers.draggable.shouldNotDrag( $( "#draggable2 span a" ).first(), "drag span a first child" );
});
*/

test( "cancelement, default, switching after initialization", function() {
	expect( 2 );

	$( "<div id='draggable-option-cancel-default'><input type='text'></div>" ).appendTo( "#qunit-fixture" );

	var input = $( "#draggable-option-cancel-default input" ),
		element = $( "#draggable-option-cancel-default" ).draggable();

	TestHelpers.draggable.shouldNotDrag( element, "cancel: default, input dragged", input );

	element.draggable( "option", "cancel", "textarea" );
	TestHelpers.draggable.shouldMove( element, "cancel: textarea, input dragged", input );

	element.draggable( "option", "cancel", "input" );
	TestHelpers.draggable.shouldNotDrag( element, "cancel: input, input dragged", input );
});

/*
test( "{ connectToSortable: selector }, default", function() {
	expect( 1 );

	ok(false, "missing test - untested code is broken code" );
});
*/

test( "{ containment: Element }", function() {
	expect( 1 );

	var offsetAfter,
		element = $( "#draggable1" ).draggable({ containment: $( "#draggable1" ).parent()[ 0 ] }),
		p = element.parent(),
		po = p.offset(),
		expected = {
			left: po.left + TestHelpers.draggable.border( p, "left" ) + TestHelpers.draggable.margin( element, "left" ),
			top: po.top + TestHelpers.draggable.border( p, "top" ) + TestHelpers.draggable.margin( element, "top" )
		};

	element.simulate( "drag", {
		dx: -100,
		dy: -100
	});
	offsetAfter = element.offset();
	deepEqual( offsetAfter, expected, "compare offset to parent" );
});

test( "{ containment: Selector }", function() {
	expect( 1 );

	var offsetAfter,
		element = $( "#draggable1" ).draggable({ containment: $( "#qunit-fixture" ) }),
		p = element.parent(),
		po = p.offset(),
		expected = {
			left: po.left + TestHelpers.draggable.border( p, "left" ) + TestHelpers.draggable.margin( element, "left" ),
			top: po.top + TestHelpers.draggable.border( p, "top" ) + TestHelpers.draggable.margin( element, "top" )
		};

	element.simulate( "drag", {
		dx: -100,
		dy: -100
	});
	offsetAfter = element.offset();
	deepEqual( offsetAfter, expected, "compare offset to parent" );
});

test( "{ containment: [x1, y1, x2, y2] }", function() {
	expect( 2 );

	var element = $( "#draggable1" ).draggable(),
		eo = element.offset();

	element.draggable( "option", "containment", [ eo.left, eo.top, eo.left + element.width() + 5, eo.top + element.height() + 5 ] );

	TestHelpers.draggable.testDrag( element, element, -100, -100, 0, 0, "containment: [x1, y1, x2, y2]" );
});

test( "{ containment: 'parent' }, relative", function() {
	expect( 1 );

	var offsetAfter,
		element = $( "#draggable1" ).draggable({ containment: "parent" }),
		p = element.parent(),
		po = p.offset(),
		expected = {
			left: po.left + TestHelpers.draggable.border( p, "left" ) + TestHelpers.draggable.margin( element, "left" ),
			top: po.top + TestHelpers.draggable.border( p, "top" ) + TestHelpers.draggable.margin( element, "top" )
		};

	element.simulate( "drag", {
		dx: -100,
		dy: -100
	});
	offsetAfter = element.offset();
	deepEqual( offsetAfter, expected, "compare offset to parent" );
});

test( "{ containment: 'parent' }, absolute", function() {
	expect( 1 );

	var offsetAfter,
		element = $( "#draggable2" ).draggable({ containment: "parent" }),
		p = element.parent(),
		po = p.offset(),
		expected = {
			left: po.left + TestHelpers.draggable.border( p, "left" ) + TestHelpers.draggable.margin( element, "left" ),
			top: po.top + TestHelpers.draggable.border( p, "top" ) + TestHelpers.draggable.margin( element, "top" )
		};

	element.simulate( "drag", {
		dx: -100,
		dy: -100
	});
	offsetAfter = element.offset();
	deepEqual( offsetAfter, expected, "compare offset to parent" );
});

test( "containment, account for border", function() {
	expect( 2 );

	var el = $( "#draggable1" ).appendTo( "#scrollParent" ),
		parent = el.parent().css({
			height: "100px",
			width: "100px",
			borderStyle: "solid",
			borderWidth: "5px 10px 15px 20px"
		}),
		parentBottom = parent.offset().top + parent.outerHeight(),
		parentRight = parent.offset().left + parent.outerWidth(),
		parentBorderBottom = TestHelpers.draggable.border( parent, "bottom" ),
		parentBorderRight = TestHelpers.draggable.border( parent, "right" );

	el.css({
		height: "5px",
		width: "5px"
	}).draggable({ containment: "parent" });

	el.simulate( "drag", {
		dx: 100,
		dy: 100
	});

	closeEnough( el.offset().top, parentBottom - parentBorderBottom - el.height(), 1,
		"The draggable should be on top of its parent's bottom border" );
	closeEnough( el.offset().left, parentRight - parentBorderRight - el.width(), 1,
		"The draggable should be to the right of its parent's right border" );
});

test( "containment, default, switching after initialization", function() {
	expect( 8 );

	var element = $( "#draggable1" ).draggable({ containment: false, scroll: false }),
		po = element.parent().offset(),
		containment = [ po.left - 100, po.top - 100, po.left + 500, po.top + 500 ];

	TestHelpers.draggable.testDrag( element, element, -100, -100, -100, -100, "containment: default" );

	element.draggable( "option", "containment", "parent" ).css({ top: 0, left: 0 });
	TestHelpers.draggable.testDrag( element, element, -100, -100, 0, 0, "containment: parent as option" );

	element.draggable( "option", "containment", containment ).css({ top: 0, left: 0 });
	TestHelpers.draggable.testDrag( element, element, -100, -100, -100, -100, "containment: array as option" );

	element.draggable( "option", "containment", false );
	TestHelpers.draggable.testDrag( element, element, -100, -100, -100, -100, "containment: false as option" );
});

test( "{ cursor: 'auto' }, default", function() {
	function getCursor() {
		return $( "#draggable2" ).css( "cursor" );
	}

	expect( 2 );

	var actual, after,
		expected = "auto",
		element = $( "#draggable2" ).draggable({
			cursor: expected,
			start: function() {
				actual = getCursor();
			}
		}),
		before = getCursor();

	element.simulate( "drag", {
		dx: -1,
		dy: -1
	});
	after = getCursor();

	equal( actual, expected, "start callback: cursor '" + expected + "'" );
	equal( after, before, "after drag: cursor restored" );
});

test( "{ cursor: 'move' }", function() {
	function getCursor() {
		return $( "body" ).css( "cursor" );
	}

	expect( 2 );

	var actual, after,
		expected = "move",
		element = $( "#draggable2" ).draggable({
			cursor: expected,
			start: function() {
				actual = getCursor();
			}
		}),
		before = getCursor();

	element.simulate( "drag", {
		dx: -1,
		dy: -1
	});
	after = getCursor();

	equal( actual, expected, "start callback: cursor '" + expected + "'" );
	equal( after, before, "after drag: cursor restored" );
});

test( "#6889: Cursor doesn't revert to pre-dragging state after revert action when original element is removed", function() {
	function getCursor() {
		return $( "body" ).css( "cursor" );
	}

	expect( 2 );

	var element = $( "#draggable1" ).wrap( "<div id='wrapper' />" ).draggable({
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
		}),
		expected = getCursor();

	if ( TestHelpers.draggable.unreliableContains ) {
		ok( true, "Opera <12.14 and Safari <6.0 report wrong values for $.contains in jQuery < 1.8" );
		ok( true, "Opera <12.14 and Safari <6.0 report wrong values for $.contains in jQuery < 1.8" );
	} else {
		element.simulate( "drag", {
			dx: -1,
			dy: -1
		});
	}
});

test( "cursor, default, switching after initialization", function() {
	expect( 3 );

	var element = $( "#draggable1" ).draggable();

	TestHelpers.draggable.trackMouseCss( element );

	TestHelpers.draggable.move( element, 1, 1 );
	equal( element.data( "last_dragged_cursor" ), "auto" );

	element.draggable( "option", "cursor", "move" );
	TestHelpers.draggable.move( element, 1, 1 );
	equal( element.data( "last_dragged_cursor" ), "move" );

	element.draggable( "option", "cursor", "ns-resize" );
	TestHelpers.draggable.move( element, 1, 1 );
	equal( element.data( "last_dragged_cursor" ), "ns-resize" );
});

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
			var element = $( "#draggable" + ( i + 1 ) ).draggable({
					cursorAt: testData.cursorAt,
					drag: function( event, ui ) {
						if ( !testData.cursorAt ) {
							equal( ui.position.left - ui.originalPosition.left, deltaX, testName + " " + position + " left" );
							equal( ui.position.top - ui.originalPosition.top, deltaY, testName + " " + position + " top" );
						} else if ( testData.cursorAt.right ) {
							equal( ui.helper.width() - ( event.clientX - ui.offset.left ), testData.x - TestHelpers.draggable.unreliableOffset, testName + " " + position + " left" );
							equal( ui.helper.height() - ( event.clientY - ui.offset.top ), testData.y - TestHelpers.draggable.unreliableOffset, testName + " " +position + " top" );
						} else {
							equal( event.clientX - ui.offset.left, testData.x + TestHelpers.draggable.unreliableOffset, testName + " " + position + " left" );
							equal( event.clientY - ui.offset.top, testData.y + TestHelpers.draggable.unreliableOffset, testName + " " + position + " top" );
						}
					}
			});

			element.simulate( "drag", {
				moves: 1,
				dx: deltaX,
				dy: deltaY
			});
		});
	});
});

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

			element.draggable({
					drag: function( event, ui ) {
						if ( !testData.cursorAt ) {
							equal( ui.position.left - ui.originalPosition.left, deltaX, testName + " " + position + " left" );
							equal( ui.position.top - ui.originalPosition.top, deltaY, testName + " " + position + " top" );
						} else if ( testData.cursorAt.right ) {
							equal( ui.helper.width() - ( event.clientX - ui.offset.left ), testData.x - TestHelpers.draggable.unreliableOffset, testName + " " + position + " left" );
							equal( ui.helper.height() - ( event.clientY - ui.offset.top ), testData.y - TestHelpers.draggable.unreliableOffset, testName + " " +position + " top" );
						} else {
							equal( event.clientX - ui.offset.left, testData.x + TestHelpers.draggable.unreliableOffset, testName + " " + position + " left" );
							equal( event.clientY - ui.offset.top, testData.y + TestHelpers.draggable.unreliableOffset, testName + " " + position + " top" );
						}
					}
			});

			element.draggable( "option", "cursorAt", false );
			element.draggable( "option", "cursorAt", testData.cursorAt );

			element.simulate( "drag", {
				moves: 1,
				dx: deltaX,
				dy: deltaY
			});
		});
	});
});

test( "disabled", function() {
	expect( 4 );

	var element = $( "#draggable1" ).draggable();

	TestHelpers.draggable.shouldMove( element, "disabled: default" );

	element.draggable( "option", "disabled", true );
	TestHelpers.draggable.shouldNotDrag( element, "option: disabled true" );

	element.draggable( "option", "disabled", false );
	TestHelpers.draggable.shouldMove( element, "option: disabled false" );
});

test( "{ grid: [50, 50] }, relative", function() {
	expect( 4 );

	var element = $( "#draggable1" ).draggable({ grid: [ 50, 50 ] });
	TestHelpers.draggable.testDrag( element, element, 24, 24, 0, 0, "grid: [50, 50] relative" );
	TestHelpers.draggable.testDrag( element, element, 26, 25, 50, 50, "grid: [50, 50] relative" );
});

test( "{ grid: [50, 50] }, absolute", function() {
	expect( 4 );

	var element = $( "#draggable2" ).draggable({ grid: [ 50, 50 ] });
	TestHelpers.draggable.testDrag( element, element, 24, 24, 0, 0, "grid: [50, 50] absolute" );
	TestHelpers.draggable.testDrag( element, element, 26, 25, 50, 50, "grid: [50, 50] absolute" );
});

test( "grid, switching after initialization", function() {
	expect( 8 );

	var element = $( "#draggable1" ).draggable();

	// Forward
	TestHelpers.draggable.testDrag( element, element, 24, 24, 24, 24, "grid: default" );
	TestHelpers.draggable.testDrag( element, element, 0, 0, 0, 0, "grid: default" );

	element.draggable( "option", "grid", [ 50,50 ] );

	TestHelpers.draggable.testDrag( element, element, 24, 24, 0, 0, "grid: [50, 50] as option" );
	TestHelpers.draggable.testDrag( element, element, 26, 25, 50, 50, "grid: [50, 50] as option" );
});

test( "{ handle: 'span' }", function() {
	expect( 4 );

	var element = $( "#draggable2" ).draggable({ handle: "span" });

	TestHelpers.draggable.shouldMove( element, "handle: span", "#draggable2 span");
	TestHelpers.draggable.shouldMove( element, "handle: span child", "#draggable2 span em" );
	TestHelpers.draggable.shouldNotDrag( element, "handle: span element" );
});

test( "handle, default, switching after initialization", function() {
	expect( 10 );

	var element = $( "#draggable2" ).draggable();

	TestHelpers.draggable.shouldMove( element, "handle: default, element dragged" );
	TestHelpers.draggable.shouldMove( element, "handle: default, span dragged", "#draggable2 span" );

	// Switch
	element.draggable( "option", "handle", "span" );
	TestHelpers.draggable.shouldNotDrag( element, "handle: span as option, element dragged" );
	TestHelpers.draggable.shouldMove( element, "handle: span as option, span dragged", "#draggable2 span" );

	// And back
	element.draggable( "option", "handle", false );
	TestHelpers.draggable.shouldMove( element, "handle: false as option, element dragged" );
	TestHelpers.draggable.shouldMove( element, "handle: false as option, span dragged", "#draggable2 span" );
});

test( "helper, default, switching after initialization", function() {
	expect( 6 );

	var element = $( "#draggable1" ).draggable();
	TestHelpers.draggable.shouldMove( element, "helper: default" );

	element.draggable( "option", "helper", "clone" );
	TestHelpers.draggable.shouldMove( element, "helper: clone" );

	element.draggable( "option", "helper", "original" );
	TestHelpers.draggable.shouldMove( element, "helper: original" );
});

/* jshint loopfunc: true */
(function() {
	var k, l, m,
		scrollElements = {
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

	for ( m = 0 ; m < helpers.length; m++ ) {
		for ( l = 0; l < positions.length; l++ ) {
			for ( k in scrollElements ) {
				(function( position, helper, scrollElements, scrollElementsTitle ) {
					test( "{ helper: '" + helper + "' }, " + position + ", with scroll offset on " + scrollElementsTitle, function() {
						expect( scrollPositions.length * 2 );

						var i, j,
							element = $( "#draggable1" ).css({ position: position, top: 0, left: 0 }).draggable({
								helper: helper,
								scroll: false
							});

						if ( scrollElements.length === 1 && scrollElements[ 0 ] === "#scrollParent" ) {
							TestHelpers.draggable.setScrollable( "#main", false );
							TestHelpers.draggable.setScrollable( "#scrollParent", true );
						}

						for ( j = 0; j < scrollPositions.length; j++ ) {
							for ( i = 0; i < scrollElements.length; i++ ) {
								TestHelpers.draggable.setScroll( scrollElements[ i ] );
							}

							TestHelpers.draggable.testScroll( element, scrollPositions[ j ] );

							for ( i = 0; i < scrollElements.length; i++ ) {
								TestHelpers.draggable.restoreScroll( scrollElements[ i ] );
							}
						}

						if ( scrollElements.length === 1 && scrollElements[ 1 ] === "#scrollParent" ) {
							TestHelpers.draggable.setScrollable( "#main", true );
							TestHelpers.draggable.setScrollable( "#scrollParent", false );
						}
					});
				})( positions[ l ], helpers[ m ], scrollElements[ k ], k );
			}
		}
	}
})();
/* jshint loopfunc: false */

test( "{ opacity: 0.5 }", function() {
	expect( 1 );

	var opacity = null,
		element = $( "#draggable2" ).draggable({
			opacity: 0.5,
			start: function() {
				opacity = $(this).css( "opacity" );
			}
		});

	element.simulate( "drag", {
		dx: -1,
		dy: -1
	});

	equal( opacity, 0.5, "start callback: opacity is" );
});

test( "opacity, default, switching after initialization", function() {
	expect( 3 );

	var opacity = null,
		element = $( "#draggable2" ).draggable({
			start: function() {
				opacity = $(this).css( "opacity" );
			}
		});

	TestHelpers.draggable.move( element, 1, 1 );
	equal( opacity, 1 );

	element.draggable( "option", "opacity", 0.5 );
	TestHelpers.draggable.move( element, 2, 1 );
	equal( opacity, 0.5 );

	element.draggable( "option", "opacity", false );
	TestHelpers.draggable.move( element, 3, 1 );
	equal( opacity, 1 );
});

asyncTest( "revert and revertDuration", function() {
	expect( 7 );

	var element = $( "#draggable2" ).draggable({
		revert: true,
		revertDuration: 0
	});
	TestHelpers.draggable.shouldMovePositionButNotOffset( element, "revert: true, revertDuration: 0 should revert immediately" );

	$( "#draggable2" ).draggable( "option", "revert", "invalid" );
	TestHelpers.draggable.shouldMovePositionButNotOffset( element, "revert: invalid, revertDuration: 0 should revert immediately" );

	$( "#draggable2" ).draggable( "option", "revert", false );
	TestHelpers.draggable.shouldMove( element, "revert: false should allow movement" );

	$( "#draggable2" ).draggable( "option", {
		revert: true,
		revertDuration: 200,
		stop: function() {
			start();
		}
	});

	// animation are async, so test for it asynchronously
	TestHelpers.draggable.move( element, 50, 50 );
	setTimeout( function() {
		ok( $( "#draggable2" ).is( ":animated" ), "revert: true with revertDuration should animate" );
	});
});

test( "revert: valid", function() {
	expect( 2 );

	var element = $( "#draggable2" ).draggable({
			revert: "valid",
			revertDuration: 0
		});

	$( "#droppable" ).droppable();

	TestHelpers.draggable.shouldMovePositionButNotOffset( element, "revert: valid reverts when dropped on a droppable" );
});

test( "scope", function() {
	expect( 4 );

	var element = $( "#draggable2" ).draggable({
		scope: "tasks",
		revert: "valid",
		revertDuration: 0
	});

	$( "#droppable" ).droppable({ scope: "tasks" });

	TestHelpers.draggable.shouldMovePositionButNotOffset( element, "revert: valid reverts when dropped on a droppable in scope" );

	$( "#droppable" ).droppable( "destroy" ).droppable({ scope: "nottasks" });

	TestHelpers.draggable.shouldMove( element, "revert: valid reverts when dropped on a droppable out of scope" );
});

test( "scroll, scrollSensitivity, and scrollSpeed", function() {
	expect( 2 );

	TestHelpers.draggable.setScrollable( "#main", false );

	var currentScrollTop,
		viewportHeight = $( window ).height(),
		element = $( "#draggable1" ).draggable({ scroll: true }).appendTo( "#qunit-fixture" ),
		scrollSensitivity = element.draggable( "option", "scrollSensitivity" ),
		scrollSpeed = element.draggable( "option", "scrollSpeed" );

	element.offset({
		top: viewportHeight - scrollSensitivity - 1,
		left: 1
	});

	$( element ).one( "drag", function() {
		equal( $( window ).scrollTop(), 0, "scroll: true doesn't scroll when the element is dragged outside of scrollSensitivity" );
	});

	element.simulate( "drag", {
		dx: 1,
		y: viewportHeight - scrollSensitivity - 1,
		moves: 1
	});

	element.draggable( "option", "scrollSensitivity", scrollSensitivity + 10 );

	element.offset({
		top: viewportHeight - scrollSensitivity - 1,
		left: 1
	});

	currentScrollTop = $( window ).scrollTop();

	$( element ).one( "drag", function() {
		ok( $( window ).scrollTop() - currentScrollTop, scrollSpeed, "scroll: true scrolls when the element is dragged within scrollSensitivity" );
	});

	element.simulate( "drag", {
		dx: 1,
		y: viewportHeight - scrollSensitivity - 1,
		moves: 1
	});

	TestHelpers.draggable.restoreScroll( document );
});

test( "#6817: auto scroll goes double distance when dragging", function() {
	expect( 2 );

	TestHelpers.draggable.restoreScroll( document );

	var offsetBefore,
		distance = 10,
		viewportHeight = $( window ).height(),
		element = $( "#draggable1" ).draggable({
			scroll: true,
			stop: function( e, ui ) {
				equal( ui.offset.top, newY, "offset of item matches pointer position after scroll" );
				// TODO: fix IE8 testswarm IFRAME positioning bug so closeEnough can be turned back to equal
				closeEnough( ui.offset.top - offsetBefore.top, distance, 1, "offset of item only moves expected distance after scroll" );
			}
		}),
		scrollSensitivity = element.draggable( "option", "scrollSensitivity" ),
		oldY = viewportHeight - scrollSensitivity,
		newY = oldY + distance;

	element.offset({
		top: oldY,
		left: 1
	});

	offsetBefore = element.offset();

	element.simulate( "drag", {
		handle: "corner",
		dx: 1,
		y: newY,
		moves: 1
	});

	TestHelpers.draggable.restoreScroll( document );
});

test( "snap, snapMode, and snapTolerance", function() {
	expect( 10 );

	var newX, newY,
		snapTolerance = 15,
		element = $( "#draggable1" ).draggable({
			snap: true,
			scroll: false,
			snapMode: "both",
			snapTolerance: snapTolerance
		}),
		element2 = $( "#draggable2" ).draggable();

	element.offset({
		top: 1,
		left: 1
	});

	newX = element2.offset().left - element.outerWidth() - snapTolerance - 2;
	newY = element2.offset().top;

	element.simulate( "drag", {
		handle: "corner",
		x: newX,
		y: newY,
		moves: 1
	});

	// TODO: fix IE8 testswarm IFRAME positioning bug so closeEnough can be turned back to equal
	closeEnough( element.offset().left, newX, 1, "doesn't snap outside the snapTolerance" );
	closeEnough( element.offset().top, newY, 1, "doesn't snap outside the snapTolerance" );

	newX += 3;

	element.simulate( "drag", {
		handle: "corner",
		x: newX,
		y: newY,
		moves: 1
	});

	notDeepEqual( element.offset(), { top: newY, left: newX }, "snaps inside the snapTolerance" );

	element.draggable( "option", "snap", "#draggable2" );

	element.simulate( "drag", {
		handle: "corner",
		x: newX,
		y: newY,
		moves: 1
	});

	notDeepEqual( element.offset(), { top: newY, left: newX }, "snaps based on selector" );

	element.draggable( "option", "snap", "#draggable3" );

	element.simulate( "drag", {
		handle: "corner",
		x: newX,
		y: newY,
		moves: 1
	});

	deepEqual( element.offset(), { top: newY, left: newX }, "doesn't snap based on invalid selector" );

	element.draggable( "option", "snap", true );
	element.draggable( "option", "snapTolerance", snapTolerance - 2 );
	element.simulate( "drag", {
		handle: "corner",
		x: newX,
		y: newY,
		moves: 1
	});

	deepEqual( element.offset(), { top: newY, left: newX }, "doesn't snap outside the modified snapTolerance" );

	element.draggable( "option", "snapTolerance", snapTolerance );
	element.draggable( "option", "snapMode", "inner" );

	element.simulate( "drag", {
		handle: "corner",
		x: newX,
		y: newY,
		moves: 1
	});

	deepEqual( element.offset(), { top: newY, left: newX }, "doesn't snap inside the outer snapTolerance area when snapMode is inner" );

	newX = element2.offset().left - snapTolerance - 1;
	newY = element2.offset().top;

	element.simulate( "drag", {
		handle: "corner",
		x: newX,
		y: newY,
		moves: 1
	});

	deepEqual( element.offset(), { top: newY, left: newX }, "doesn't snap inside the outer snapTolerance area when snapMode is inner" );

	newX++;

	element.simulate( "drag", {
		handle: "corner",
		x: newX,
		y: newY,
		moves: 1
	});

	notDeepEqual( element.offset(), { top: newY, left: newX }, "snaps inside the inner snapTolerance area when snapMode is inner" );

	element.draggable( "option", "snapMode", "outer" );

	element.simulate( "drag", {
		handle: "corner",
		x: newX,
		y: newY,
		moves: 1
	});

	deepEqual( element.offset(), { top: newY, left: newX }, "doesn't snap on the inner snapTolerance area when snapMode is outer" );
});

test( "#8459: element can snap to an element that was removed during drag", function() {
	expect( 2 );

	var newX, newY,
		snapTolerance = 15,
		element = $( "#draggable1" ).draggable({
			snap: true,
			scroll: false,
			snapMode: "both",
			snapTolerance: snapTolerance,
			start: function() {
				element2.remove();
			}
		}),
		element2 = $( "#draggable2" ).draggable();

	element.offset({
		top: 1,
		left: 1
	});

	newX = element2.offset().left - element.outerWidth() - snapTolerance + 1;
	newY = element2.offset().top;

	element.simulate( "drag", {
		handle: "corner",
		x: newX,
		y: newY,
		moves: 1
	});

	// Support: Opera 12.10, Safari 5.1, jQuery <1.8
	if ( TestHelpers.draggable.unreliableContains ) {
		ok( true, "Opera <12.14 and Safari <6.0 report wrong values for $.contains in jQuery < 1.8" );
		ok( true, "Opera <12.14 and Safari <6.0 report wrong values for $.contains in jQuery < 1.8" );
	} else {
		// TODO: fix IE8 testswarm IFRAME positioning bug so closeEnough can be turned back to equal
		closeEnough( element.offset().left, newX, 1, "doesn't snap to a removed element" );
		closeEnough( element.offset().top, newY, 1, "doesn't snap to a removed element" );
	}
});

test( "#8165: Snapping large rectangles to small rectangles doesn't snap properly", function() {
	expect( 1 );

	var snapTolerance = 20,
		y = 1,
		element = $( "#draggable1" )
			.css({
				width: "50px",
				height: "200px"
			}).offset({
				top: y,
				left: 1
			}),
		element2 = $( "#draggable2" )
			.css({
				width: "50px",
				height: "50px"
			}).offset({
				top: y + snapTolerance + 1,
				left: 200
			}),
		newX = element2.offset().left - element.outerWidth() - snapTolerance + 1;

	$( "#draggable1, #draggable2" ).draggable({
		snap: true,
		snapTolerance: snapTolerance
	});

	element.simulate( "drag", {
		handle: "corner",
		x: newX,
		moves: 1
	});

	notDeepEqual( element.offset(), { top: y, left: newX }, "snaps even if only a side (not a corner) is inside the snapTolerance" );
});

test( "stack", function() {
	expect( 2 );

	var element = $( "#draggable1" ).draggable({
			stack: "#draggable1, #draggable2"
		}),
		element2 = $( "#draggable2" ).draggable({
			stack: "#draggable1, #draggable2"
		});

	TestHelpers.draggable.move( element, 1, 1 );
	equal( element.css( "zIndex" ), "2", "stack increments zIndex correctly" );

	TestHelpers.draggable.move( element2, 1, 1 );
	equal( element2.css( "zIndex" ), "3", "stack increments zIndex correctly" );
});

test( "{ zIndex: 10 }", function() {
	expect( 1 );

	var actual,
		expected = 10,
		element = $( "#draggable2" ).draggable({
			zIndex: expected,
			start: function() {
				actual = $(this).css( "zIndex" );
			}
		});

	element.simulate( "drag", {
		dx: -1,
		dy: -1
	});

	equal( actual, expected, "start callback: zIndex is" );

});

test( "zIndex, default, switching after initialization", function() {

	expect( 3 );

	var zindex = null,
		element = $( "#draggable2" ).draggable({
			start: function() {
				zindex = $(this).css( "z-index" );
			}
		});

	element.css( "z-index", 1 );

	TestHelpers.draggable.move( element, 1, 1 );
	equal( zindex, 1 );

	element.draggable( "option", "zIndex", 5 );
	TestHelpers.draggable.move( element, 2, 1 );
	equal( zindex, 5 );

	element.draggable( "option", "zIndex", false );
	TestHelpers.draggable.move( element, 3, 1 );
	equal( zindex, 1 );

});

})( jQuery );
