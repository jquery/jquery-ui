define( [
	"qunit",
	"jquery",
	"ui/widgets/sortable"
], function( QUnit, $ ) {

QUnit.module( "sortable: options" );

/*
Test("{ appendTo: 'parent' }, default", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ appendTo: Selector }", function() {
	ok(false, "missing test - untested code is broken code.");
});
*/

QUnit.test( "{ axis: false }, default", function( assert ) {
	assert.expect( 2 );

	var offsetAfter,
		element = $( "#sortable" ).sortable( {
			axis: false,
			change: function() {
				offsetAfter = item.offset();
				assert.notEqual( offsetAfter.left, offsetBefore.left, "x axis not constrained when axis: false" );
				assert.notEqual( offsetAfter.top, offsetBefore.top, "y axis not constrained when axis: false" );
			}
		} ),
		item = element.find( "li" ).eq( 0 ),
		offsetBefore = item.offset();

	item.simulate( "drag", {
		dx: 50,
		dy: 25,
		moves: 1
	} );
} );

QUnit.test( "{ axis: 'x' }", function( assert ) {
	assert.expect( 2 );

	var offsetAfter,
		element = $( "#sortable" ).sortable( {
			axis: "x",
			change: function() {
				offsetAfter = item.offset();
				assert.notEqual( offsetAfter.left, offsetBefore.left, "x axis not constrained when axis: x" );
				assert.equal( offsetAfter.top, offsetBefore.top, "y axis constrained when axis: x" );
			}
		} ),
		item = element.find( "li" ).eq( 0 ),
		offsetBefore = item.offset();

	item.simulate( "drag", {
		dx: 50,
		dy: 25,
		moves: 1
	} );
} );

QUnit.test( "{ axis: 'y' }", function( assert ) {
	assert.expect( 2 );

	var offsetAfter,
		element = $( "#sortable" ).sortable( {
			axis: "y",
			change: function() {
				offsetAfter = item.offset();
				assert.equal( offsetAfter.left, offsetBefore.left, "x axis constrained when axis: y" );
				assert.notEqual( offsetAfter.top, offsetBefore.top, "y axis not constrained when axis: y" );
			}
		} ),
		item = element.find( "li" ).eq( 0 ),
		offsetBefore = item.offset();

	item.simulate( "drag", {
		dx: 50,
		dy: 25,
		moves: 1
	} );
} );

QUnit.test( "#7415: Incorrect revert animation with axis: 'y'", function( assert ) {
	var ready = assert.async();
	assert.expect( 2 );
	var expectedLeft,
		element = $( "#sortable" ).sortable( {
			axis: "y",
			revert: true,
			sort: function() {
				expectedLeft = item.css( "left" );
			}
		} ),
		item = element.find( "li" ).eq( 0 );

	item.simulate( "drag", {
		dy: 300,
		dx: 50
	} );

	setTimeout( function() {
		var top = parseFloat( item.css( "top" ) );
		assert.equal( item.css( "left" ), expectedLeft, "left not animated" );
		assert.ok( top > 0 && top < 300, "top is animated" );
		ready();
	}, 100 );
} );

/*
Test("{ cancel: 'input,textarea,button,select,option' }, default", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ cancel: Selector }", function() {
	ok(false, "missing test - untested code is broken code.");
});
*/

QUnit.test( "#8792: issues with floated items in connected lists", function( assert ) {
	assert.expect( 2 );

	var element,
		changeCount = 0;

	$( "#qunit-fixture" )
		.html( "<ul class='c'><li>a</li><li>a</li></ul><ul class='c'><li>a</li><li>a</li></ul>" )
		.find( "ul" ).css( { "float": "left", width: "100px" } ).end()
		.find( "li" ).css( { "float": "left", width: "50px", height: "50px" } );

	$( "#qunit-fixture .c" ).sortable( {
		connectWith: "#qunit-fixture .c",
		change: function() {
			changeCount++;
		}
	} );

	element = $( "#qunit-fixture li:eq(0)" );

	// Move the first li to the right of the second li in the first ul
	element.simulate( "drag", {
		dx: 55,
		moves: 15
	} );

	assert.equal( changeCount, 1, "change fired only once (no jitters) when dragging a floated sortable in it's own container" );

	// Move the first li ( which is now in the second spot )
	// through the first spot in the second ul to the second spot in the second ul
	element.simulate( "drag", {
		dx: 100,
		moves: 15
	} );

	assert.equal( changeCount, 3, "change fired once for each expected change when dragging a floated sortable to a connected container" );
} );

QUnit.test( "#8301: single axis with connected list", function( assert ) {
	assert.expect( 1 );

	var element = $( "#sortable" ).sortable( {
		axis: "y",
		tolerance: "pointer",
		connectWith: ".connected"
	} );

	$( "<ul class='connected'><li>Item 7</li><li>Item 8</li></ul>" )
		.sortable( {
			axis: "y",
			tolerance: "pointer",
			connectWith: "#sortable",
			receive: function() {
				assert.ok( true, "connected list received item" );
			}
		} )
		.insertAfter( element );

	element.find( "li" ).eq( 0 ).simulate( "drag", {
		handle: "corner",
		dy: 120,
		moves: 1
	} );
} );

/*
Test("{ connectWith: false }, default", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ connectWith: Selector }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ containment: false }, default", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ containment: Element }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ containment: 'document' }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ containment: 'parent' }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ containment: 'window' }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ containment: Selector }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ cursor: 'auto' }, default", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ cursor: 'move' }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ cursorAt: false }, default", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ cursorAt: true }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ delay: 0 }, default", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ delay: 100 }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ distance: 1 }, default", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ distance: 10 }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ dropOnEmpty: true }, default", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ dropOnEmpty: false }", function() {
	ok(false, "missing test - untested code is broken code.");
});
*/

QUnit.test( "{ forcePlaceholderSize: false } table rows", function( assert ) {
	assert.expect( 1 );

	var element = $( "#sortable-table2 tbody" );

	element.sortable( {
		placeholder: "test",
		forcePlaceholderSize: false,
		start: function( event, ui ) {
			assert.notEqual( ui.placeholder.height(), ui.item.height(),
				"placeholder is same height as item" );
		}
	} );

	// This row has a non-standard height
	$( "tr", element ).eq( 0 ).simulate( "drag", {
		dy: 1
	} );
} );

QUnit.test( "{ forcePlaceholderSize: true } table rows", function( assert ) {
	assert.expect( 2 );

	// Table should have the placeholder's height set the same as the row we're dragging
	var element = $( "#sortable-table2 tbody" );

	element.sortable( {
		placeholder: "test",
		forcePlaceholderSize: true,
		start: function( event, ui ) {
			assert.equal( ui.placeholder.height(), ui.item.height(),
				"placeholder is same height as item" );
		}
	} );

	// First row has a non-standard height
	$( "tr", element ).eq( 0 ).simulate( "drag", {
		dy: 1
	} );

	// Second row's height is normal
	$( "tr", element ).eq( 1 ).simulate( "drag", {
		dy: 1
	} );
} );

/*
test("{ forceHelperSize: false }, default", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ forceHelperSize: true }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ grid: false }, default", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ grid: [17, 3] }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ grid: [3, 7] }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ handle: false }, default", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ handle: Element }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ handle: Selector }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ helper: 'original' }, default", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ helper: Function }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ items: '> *' }, default", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ items: Selector }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ opacity: false }, default", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ opacity: .37 }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ opacity: 1 }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ placeholder: false }, default", function() {
	ok(false, "missing test - untested code is broken code.");
});
*/

QUnit.test( "{ placeholder: false } img", function( assert ) {
	assert.expect( 3 );

	var element = $( "#sortable-images" ).sortable( {
		start: function( event, ui ) {
			assert.ok( ui.placeholder.attr( "src" ).indexOf( "images/jqueryui_32x32.png" ) > 0, "placeholder img has correct src" );
			assert.equal( ui.placeholder.height(), 32, "placeholder has correct height" );
			assert.equal( ui.placeholder.width(), 32, "placeholder has correct width" );
		}
	} );

	element.find( "img" ).eq( 0 ).simulate( "drag", {
		dy: 1
	} );
} );

QUnit.test( "{ placeholder: String }", function( assert ) {
	assert.expect( 1 );

	var element = $( "#sortable" ).sortable( {
		placeholder: "test",
		start: function( event, ui ) {
			assert.hasClasses( ui.placeholder, "test" );
		}
	} );

	element.find( "li" ).eq( 0 ).simulate( "drag", {
		dy: 1
	} );
} );

QUnit.test( "{ placholder: String } tr", function( assert ) {
	assert.expect( 4 );

	var originalWidths,
		element = $( "#sortable-table tbody" ).sortable( {
			placeholder: "test",
			start: function( event, ui ) {
				var currentWidths = otherRow.children().map( function() {
					return $( this ).width();
				} ).get();
				assert.hasClasses( ui.placeholder, "test" );
				assert.deepEqual( currentWidths, originalWidths, "table cells maintian size" );
				assert.equal( ui.placeholder.children().length, dragRow.children().length,
					"placeholder has correct number of cells" );
				assert.equal( ui.placeholder.children().html(), $( "<span>&#160;</span>" ).html(),
					"placeholder td has content for forced dimensions" );
			}
		} ),
		rows = element.children( "tr" ),
		dragRow = rows.eq( 0 ),
		otherRow = rows.eq( 1 );

	originalWidths = otherRow.children().map( function() {
		return $( this ).width();
	} ).get();
	dragRow.simulate( "drag", {
		dy: 1
	} );
} );

QUnit.test( "{ placholder: String } tbody", function( assert ) {
	assert.expect( 6 );

	var originalWidths,
		element = $( "#sortable-table" ).sortable( {
			placeholder: "test",
			start: function( event, ui ) {
				var currentWidths = otherBody.children().map( function() {
					return $( this ).width();
				} ).get();
				assert.ok( ui.placeholder.hasClass( "test" ), "placeholder has class" );
				assert.deepEqual( currentWidths, originalWidths, "table cells maintain size" );
				assert.equal( ui.placeholder.children().length, 1,
					"placeholder has one child" );
				assert.equal( ui.placeholder.children( "tr" ).length, 1,
					"placeholder's child is tr" );
				assert.equal( ui.placeholder.find( "> tr" ).children().length,
					dragBody.find( "> tr:first" ).children().length,
					"placeholder's tr has correct number of cells" );
				assert.equal( ui.placeholder.find( "> tr" ).children().html(),
					$( "<span>&#160;</span>" ).html(),
					"placeholder td has content for forced dimensions" );
			}
		} ),
		bodies = element.children( "tbody" ),
		dragBody = bodies.eq( 0 ),
		otherBody = bodies.eq( 1 );

	originalWidths = otherBody.children().map( function() {
		return $( this ).width();
	} ).get();
	dragBody.simulate( "drag", {
		dy: 1
	} );
} );

/*
Test("{ revert: false }, default", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ revert: true }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ scroll: true }, default", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ scroll: false }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ scrollSensitivity: 20 }, default", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ scrollSensitivity: 2 }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ scrollSensitivity: 200 }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ scrollSpeed: 20 }, default", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ scrollSpeed: 2 }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ scrollSpeed: 200 }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ scope: 'default' }, default", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ scope: ??? }, unexpected", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ tolerance: 'intersect' }, default", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ tolerance: 'pointer' }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ zIndex: 1000 }, default", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ zIndex: 1 }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ zIndex: false }", function() {
	ok(false, "missing test - untested code is broken code.");
});
*/
} );
