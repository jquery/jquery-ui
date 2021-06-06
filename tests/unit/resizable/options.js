define( [
	"qunit",
	"jquery",
	"lib/helper",
	"./helper",
	"ui/widgets/resizable"
], function( QUnit, $, helper, testHelper ) {
"use strict";

QUnit.module( "resizable: options", { afterEach: helper.moduleAfterEach }  );

QUnit.test( "alsoResize", function( assert ) {
	assert.expect( 2 );

	var other = $( "<div>" )
			.css( {
				width: 50,
				height: 50
			} )
			.appendTo( "body" ),
		element = $( "#resizable1" ).resizable( {
			alsoResize: other
		} ),
		handle = ".ui-resizable-e";

	testHelper.drag( handle, 80 );
	assert.equal( element.width(), 180, "resizable width" );
	assert.equal( other.width(), 130, "alsoResize width" );
} );

QUnit.test( "aspectRatio: 'preserve' (e)", function( assert ) {
	assert.expect( 4 );

	var handle = ".ui-resizable-e", target = $( "#resizable1" ).resizable( { aspectRatio: "preserve", handles: "all", minWidth: 70, minHeight: 50, maxWidth: 150, maxHeight: 130 } );

	testHelper.drag( handle, 80 );
	assert.equal( target.width(), 130, "compare maxWidth" );
	assert.equal( target.height(), 130, "compare maxHeight" );

	testHelper.drag( handle, -130 );
	assert.equal( target.width(), 70, "compare minWidth" );
	assert.equal( target.height(), 70, "compare minHeight" );
} );

QUnit.test( "aspectRatio: 'preserve' (w)", function( assert ) {
	assert.expect( 4 );

	var handle = ".ui-resizable-w", target = $( "#resizable1" ).resizable( { aspectRatio: "preserve", handles: "all", minWidth: 70, minHeight: 50, maxWidth: 150, maxHeight: 130 } );

	testHelper.drag( handle, -80 );
	assert.equal( target.width(), 130, "compare maxWidth" );
	assert.equal( target.height(), 130, "compare maxHeight" );

	testHelper.drag( handle, 130 );
	assert.equal( target.width(), 70, "compare minWidth" );
	assert.equal( target.height(), 70, "compare minHeight" );
} );

QUnit.test( "aspectRatio: 'preserve' (n)", function( assert ) {
	assert.expect( 4 );

	var handle = ".ui-resizable-n", target = $( "#resizable1" ).resizable( { aspectRatio: "preserve", handles: "all", minWidth: 70, minHeight: 50, maxWidth: 150, maxHeight: 130 } );

	testHelper.drag( handle, 0, -80 );
	assert.equal( target.width(), 130, "compare maxWidth" );
	assert.equal( target.height(), 130, "compare maxHeight" );

	testHelper.drag( handle, 0, 80 );
	assert.equal( target.width(), 70, "compare minWidth" );
	assert.equal( target.height(), 70, "compare minHeight" );
} );

QUnit.test( "aspectRatio: 'preserve' (s)", function( assert ) {
	assert.expect( 4 );

	var handle = ".ui-resizable-s", target = $( "#resizable1" ).resizable( { aspectRatio: "preserve", handles: "all", minWidth: 70, minHeight: 50, maxWidth: 150, maxHeight: 130 } );

	testHelper.drag( handle, 0, 80 );
	assert.equal( target.width(), 130, "compare maxWidth" );
	assert.equal( target.height(), 130, "compare maxHeight" );

	testHelper.drag( handle, 0, -80 );
	assert.equal( target.width(), 70, "compare minWidth" );
	assert.equal( target.height(), 70, "compare minHeight" );
} );

QUnit.test( "aspectRatio: 'preserve' (se)", function( assert ) {
	assert.expect( 4 );

	var handle = ".ui-resizable-se", target = $( "#resizable1" ).resizable( { aspectRatio: "preserve", handles: "all", minWidth: 70, minHeight: 50, maxWidth: 150, maxHeight: 130 } );

	testHelper.drag( handle, 80, 80 );
	assert.equal( target.width(), 130, "compare maxWidth" );
	assert.equal( target.height(), 130, "compare maxHeight" );

	testHelper.drag( handle, -80, -80 );
	assert.equal( target.width(), 70, "compare minWidth" );
	assert.equal( target.height(), 70, "compare minHeight" );
} );

QUnit.test( "aspectRatio: 'preserve' (sw)", function( assert ) {
	assert.expect( 4 );

	var handle = ".ui-resizable-sw", target = $( "#resizable1" ).resizable( { aspectRatio: "preserve", handles: "all", minWidth: 70, minHeight: 50, maxWidth: 150, maxHeight: 130 } );

	testHelper.drag( handle, -80, 80 );
	assert.equal( target.width(), 130, "compare maxWidth" );
	assert.equal( target.height(), 130, "compare maxHeight" );

	testHelper.drag( handle, 80, -80 );
	assert.equal( target.width(), 70, "compare minWidth" );
	assert.equal( target.height(), 70, "compare minHeight" );
} );

QUnit.test( "aspectRatio: 'preserve' (ne)", function( assert ) {
	assert.expect( 4 );

	var handle = ".ui-resizable-ne", target = $( "#resizable1" ).resizable( { aspectRatio: "preserve", handles: "all", minWidth: 70, minHeight: 50, maxWidth: 150, maxHeight: 130 } );

	testHelper.drag( handle, 80, -80 );
	assert.equal( target.width(), 130, "compare maxWidth" );
	assert.equal( target.height(), 130, "compare maxHeight" );

	testHelper.drag( handle, -80, 80 );
	assert.equal( target.width(), 70, "compare minWidth" );
	assert.equal( target.height(), 70, "compare minHeight" );
} );

QUnit.test( "aspectRatio: Resizing can move objects", function( assert ) {
	assert.expect( 7 );

	// Http://bugs.jqueryui.com/ticket/7018 - Resizing can move objects
	var handleW = ".ui-resizable-w",
		handleNW = ".ui-resizable-nw",
		target = $( "#resizable1" ).resizable( {
			aspectRatio: true,
			handles: "all",
			containment: "parent"
		} );

	$( "#container" ).css( { width: 200, height: 300 } );
	$( "#resizable1" ).css( { width: 100, height: 100, left: 75, top: 200 } );

	testHelper.drag( handleW, -20 );
	assert.equal( target.width(), 100, "compare width - no size change" );
	assert.equal( target.height(), 100, "compare height - no size change" );
	assert.equal( target.position().left, 75, "compare left - no movement" );

	// Http://bugs.jqueryui.com/ticket/9107 - aspectRatio and containment not handled correctly
	$( "#container" ).css( { width: 200, height: 300, position: "absolute", left: 100, top: 100 } );
	$( "#resizable1" ).css( { width: 100, height: 100, left: 0, top: 0 } );

	testHelper.drag( handleNW, -20, -20 );
	assert.equal( target.width(), 100, "compare width - no size change" );
	assert.equal( target.height(), 100, "compare height - no size change" );
	assert.equal( target.position().left, 0, "compare left - no movement" );
	assert.equal( target.position().top, 0, "compare top - no movement" );
} );

QUnit.test( "aspectRatio: aspectRatio can be changed after initialization", function( assert ) {
	assert.expect( 4 );

	var target = $( "#resizable1" )
		.resizable( { aspectRatio: 1 } )
		.resizable( "option", "aspectRatio", false );

	var handle = ".ui-resizable-e";

	testHelper.drag( handle, 80 );

	assert.equal( target.width(), 180, "compare width - size change" );
	assert.equal( target.height(), 100, "compare height - no size change" );

	target.resizable( "option", "aspectRatio", 2 );

	testHelper.drag( handle, -40 );

	assert.equal( target.width(), 140, "compare width - size change" );
	assert.equal( target.height(), 70, "compare height - size change in proper relation" );
} );

QUnit.test( "containment", function( assert ) {
	assert.expect( 4 );

	var element = $( "#resizable1" ).resizable( {
		containment: "#container"
	} );

	testHelper.drag( ".ui-resizable-se", 20, 30 );
	assert.equal( element.width(), 120, "unconstrained width within container" );
	assert.equal( element.height(), 130, "unconstrained height within container" );

	testHelper.drag( ".ui-resizable-se", 400, 400 );
	assert.equal( element.width(), 300, "constrained width at containment edge" );
	assert.equal( element.height(), 200, "constrained height at containment edge" );
} );

QUnit.test( "containment - not immediate parent", function( assert ) {
	assert.expect( 4 );

	// Http://bugs.jqueryui.com/ticket/7485 - Resizable: Containment calculation is wrong
	// when containment element is not the immediate parent
	var element = $( "#child" ).resizable( {
		containment: "#container2",
		handles: "all"
	} );

	testHelper.drag( ".ui-resizable-e", 300, 0 );
	assert.equal( element.width(), 400, "Relative, contained within container width" );

	testHelper.drag( ".ui-resizable-s", 0, 300 );
	assert.equal( element.height(), 400, "Relative, contained within container height" );

	$( "#child" ).css( { left: 50, top: 50 } );
	$( "#parent" ).css( { left: 50, top: 50 } );
	$( "#container2" ).css( { left: 50, top: 50 } );

	element = $( "#child" ).resizable( {
		containment: "#container2",
		handles: "all"
	} );

	testHelper.drag( ".ui-resizable-e", 400, 0 );
	assert.equal( element.width(), 300, "Relative with Left, contained within container width" );

	testHelper.drag( ".ui-resizable-s", 0, 400 );
	assert.equal( element.height(), 300, "Relative with Top, contained within container height" );
} );

QUnit.test( "containment - immediate parent", function( assert ) {
	assert.expect( 4 );

	// Http://bugs.jqueryui.com/ticket/10140 - Resizable: Width calculation is wrong when containment element is "position: relative"
	// when containment element is  immediate parent
	var element = $( "#child" ).resizable( {
		containment: "parent",
		handles: "all"
	} );

	testHelper.drag( ".ui-resizable-e", 400, 0 );
	assert.equal( element.width(), 300, "Relative, contained within container width" );

	testHelper.drag( ".ui-resizable-s", 0, 400 );
	assert.equal( element.height(), 300, "Relative, contained within container height" );

	$( "#child" ).css( { left: 50, top: 50 } );
	$( "#parent" ).css( { left: 50, top: 50 } );
	$( "#container2" ).css( { left: 50, top: 50 } );

	element = $( "#child" ).resizable( {
		containment: "parent",
		handles: "all"
	} );

	testHelper.drag( ".ui-resizable-e", 400, 0 );
	assert.equal( element.width(), 250, "Relative with Left, contained within container width" );

	testHelper.drag( ".ui-resizable-s", 0, 400 );
	assert.equal( element.height(), 250, "Relative with Top, contained within container height" );
} );

QUnit.test( "grid", function( assert ) {
	assert.expect( 4 );

	var handle = ".ui-resizable-se", target = $( "#resizable1" ).resizable( { handles: "all", grid: [ 0, 20 ] } );

	testHelper.drag( handle, 3, 9 );
	assert.equal( target.width(), 103, "compare width" );
	assert.equal( target.height(), 100, "compare height" );

	testHelper.drag( handle, 15, 11 );
	assert.equal( target.width(), 118, "compare width" );
	assert.equal( target.height(), 120, "compare height" );
} );

QUnit.test( "grid (min/max dimensions)", function( assert ) {
	assert.expect( 4 );

	var handle = ".ui-resizable-se", target = $( "#resizable1" ).resizable( { handles: "all", grid: 20, minWidth: 65, minHeight: 65, maxWidth: 135, maxHeight: 135 } );

	testHelper.drag( handle, 50, 50 );
	assert.equal( target.width(), 120, "grid should respect maxWidth" );
	assert.equal( target.height(), 120, "grid should respect maxHeight" );

	testHelper.drag( handle, -100, -100 );
	assert.equal( target.width(), 80, "grid should respect minWidth" );
	assert.equal( target.height(), 80, "grid should respect minHeight" );
} );

QUnit.test( "grid (wrapped)", function( assert ) {
	assert.expect( 4 );

	var handle = ".ui-resizable-se", target = $( "#resizable2" ).resizable( { handles: "all", grid: [ 0, 20 ] } );

	testHelper.drag( handle, 3, 9 );
	assert.equal( target.width(), 103, "compare width" );
	assert.equal( target.height(), 100, "compare height" );

	testHelper.drag( handle, 15, 11 );
	assert.equal( target.width(), 118, "compare width" );
	assert.equal( target.height(), 120, "compare height" );
} );

QUnit.test( "grid - Resizable: can be moved when grid option is set (#9611)", function( assert ) {
	assert.expect( 6 );

	var oldPosition,
		handle = ".ui-resizable-nw",
		target = $( "#resizable1" ).resizable( {
			handles: "all",
			grid: 50
		} );

	testHelper.drag( handle, 50, 50 );
	assert.equal( target.width(), 50, "compare width" );
	assert.equal( target.height(), 50, "compare height" );

	oldPosition = target.position();

	testHelper.drag( handle, 50, 50 );
	assert.equal( target.width(), 50, "compare width" );
	assert.equal( target.height(), 50, "compare height" );
	assert.equal( target.position().top, oldPosition.top, "compare top" );
	assert.equal( target.position().left, oldPosition.left, "compare left" );
} );

QUnit.test( "grid - maintains grid with padding and border when approaching no dimensions", function( assert ) {
	assert.expect( 2 );

	// Http://bugs.jqueryui.com/ticket/10437 - Resizable: border with grid option working wrong
	var handle = ".ui-resizable-nw",
		target = $( "#resizable1" ).css( {
			padding: 5,
			border: "5px solid black",
			width: 80,
			height: 80
		} ).resizable( {
			handles: "all",
			grid: [ 50, 12 ]
		} );

	testHelper.drag( handle, 50, 50 );
	assert.equal( target.outerWidth(), 50, "compare width" );
	assert.equal( target.outerHeight(), 52, "compare height" );
} );

QUnit.test( "ui-resizable-se { handles: 'all', minWidth: 60, minHeight: 60, maxWidth: 100, maxHeight: 100 }", function( assert ) {
	assert.expect( 4 );

	var handle = ".ui-resizable-se", target = $( "#resizable1" ).resizable( { handles: "all", minWidth: 60, minHeight: 60, maxWidth: 100, maxHeight: 100 } );

	testHelper.drag( handle, -50, -50 );
	assert.equal( target.width(), 60, "compare minWidth" );
	assert.equal( target.height(), 60, "compare minHeight" );

	testHelper.drag( handle, 70, 70 );
	assert.equal( target.width(), 100, "compare maxWidth" );
	assert.equal( target.height(), 100, "compare maxHeight" );
} );

QUnit.test( "ui-resizable-sw { handles: 'all', minWidth: 60, minHeight: 60, maxWidth: 100, maxHeight: 100 }", function( assert ) {
	assert.expect( 4 );

	var handle = ".ui-resizable-sw", target = $( "#resizable1" ).resizable( { handles: "all", minWidth: 60, minHeight: 60, maxWidth: 100, maxHeight: 100 } );

	testHelper.drag( handle, 50, -50 );
	assert.equal( target.width(), 60, "compare minWidth" );
	assert.equal( target.height(), 60, "compare minHeight" );

	testHelper.drag( handle, -70, 70 );
	assert.equal( target.width(), 100, "compare maxWidth" );
	assert.equal( target.height(), 100, "compare maxHeight" );
} );

QUnit.test( "ui-resizable-ne { handles: 'all', minWidth: 60, minHeight: 60, maxWidth: 100, maxHeight: 100 }", function( assert ) {
	assert.expect( 4 );

	var handle = ".ui-resizable-ne", target = $( "#resizable1" ).resizable( { handles: "all", minWidth: 60, minHeight: 60, maxWidth: 100, maxHeight: 100 } );

	testHelper.drag( handle, -50, 50 );
	assert.equal( target.width(), 60, "compare minWidth" );
	assert.equal( target.height(), 60, "compare minHeight" );

	testHelper.drag( handle, 70, -70 );
	assert.equal( target.width(), 100, "compare maxWidth" );
	assert.equal( target.height(), 100, "compare maxHeight" );
} );

QUnit.test( "ui-resizable-nw { handles: 'all', minWidth: 60, minHeight: 60, maxWidth: 100, maxHeight: 100 }", function( assert ) {
	assert.expect( 4 );

	var handle = ".ui-resizable-nw", target = $( "#resizable1" ).resizable( { handles: "all", minWidth: 60, minHeight: 60, maxWidth: 100, maxHeight: 100 } );

	testHelper.drag( handle, 70, 70 );
	assert.equal( target.width(), 60, "compare minWidth" );
	assert.equal( target.height(), 60, "compare minHeight" );

	testHelper.drag( handle, -70, -70 );
	assert.equal( target.width(), 100, "compare maxWidth" );
	assert.equal( target.height(), 100, "compare maxHeight" );
} );

QUnit.test( "custom handles { handles: { 's': $('#resizer1'), containment: 'parent' }", function( assert ) {
	assert.expect( 2 );

	var handle = "#resizer1",
		target = $( "#resizable1" ).resizable( { handles: { "s": $( "#resizer1" ) }, containment: "parent" } );

	testHelper.drag( handle, 0, 70 );
	assert.equal( target.height(), 170, "compare height" );

	testHelper.drag( handle, 0, -70 );
	assert.equal( target.height(), 100, "compare height" );
} );

QUnit.test( "custom handles { handles: { 's': $('#resizer1')[0], containment: 'parent' }", function( assert ) {
	assert.expect( 2 );

	var handle = "#resizer1",
		target = $( "#resizable1" ).resizable( { handles: { "s": $( "#resizer1" )[ 0 ] }, containment: "parent" } );

	testHelper.drag( handle, 0, 70 );
	assert.equal( target.height(), 170, "compare height" );

	testHelper.drag( handle, 0, -70 );
	assert.equal( target.height(), 100, "compare height" );
} );

QUnit.test( "zIndex, applied to all handles", function( assert ) {
	assert.expect( 8 );

	var target = $( "<div></div>" ).resizable( { handles: "all", zIndex: 100 } );
	target.children( ".ui-resizable-handle" ).each( function( index, handle ) {
		assert.equal( $( handle ).css( "zIndex" ), 100, "compare zIndex" );
	} );
} );

QUnit.test( "setOption handles", function( assert ) {
	assert.expect( 19 );

	// https://bugs.jqueryui.com/ticket/3423
	// https://bugs.jqueryui.com/ticket/15084
	var target = $( "<div></div>" ).resizable(),
		target2 = $( "<div>" +
					"<div class='ui-resizable-handle ui-resizable-e'></div>" +
					"<div class='ui-resizable-handle ui-resizable-w'></div>" +
					"</div>" ).resizable( {
						handles: {
							"e": "ui-resizable-e",
							"w": "ui-resizable-w"
						}
					} );

	function checkHandles( target, expectedHandles ) {
		expectedHandles = $.map( expectedHandles, function( value ) {
			return ".ui-resizable-" + value;
		} );

		var handles = target.find( ".ui-resizable-handle" );

		assert.equal( handles.length, expectedHandles.length, "Correct number of handles found" );
		$.each( expectedHandles, function( index, handleClass ) {
			assert.equal( handles.filter( handleClass ).length, 1, "Found " + handleClass );
		} );
	}

	checkHandles( target, [ "e", "s", "se" ] );

	target.resizable( "option", "handles", "n, w, nw" );
	checkHandles( target, [ "n", "w", "nw" ] );

	target.resizable( "option", "handles", "s, w" );
	checkHandles( target, [ "s", "w" ] );

	target2.resizable( "option", "handles", "e, s, w" );
	checkHandles( target2, [ "e", "s", "w" ] );

	target.resizable( "destroy" );
	checkHandles( target, [ ] );

	target2.resizable( "destroy" );
	checkHandles( target2, [ "e", "w" ] );
} );

QUnit.test( "alsoResize + containment", function( assert ) {
	assert.expect( 4 );
	var other = $( "<div>" )
			.css( {
				width: 50,
				height: 50
			} )
			.appendTo( "body" ),
		element = $( "#resizable1" ).resizable( {
			alsoResize: other,
			containment: "#container"
		} );

	testHelper.drag( ".ui-resizable-se", 400, 400 );
	assert.equal( element.width(), 300, "resizable constrained width at containment edge" );
	assert.equal( element.height(), 200, "resizable constrained height at containment edge" );
	assert.equal( other.width(), 250, "alsoResize constrained width at containment edge" );
	assert.equal( other.height(), 150, "alsoResize constrained height at containment edge" );
} );

QUnit.test( "alsoResize + multiple selection", function( assert ) {
	assert.expect( 6 );
	var other1 = $( "<div>" )
			.addClass( "other" )
			.css( {
				width: 50,
				height: 50
			} )
			.appendTo( "body" ),
		other2 = $( "<div>" )
			.addClass( "other" )
			.css( {
				width: 50,
				height: 50
			} )
			.appendTo( "body" ),
		element = $( "#resizable1" ).resizable( {
			alsoResize: other1.add( other2 ),
			containment: "#container"
		} );

	testHelper.drag( ".ui-resizable-se", 400, 400 );
	assert.equal( element.width(), 300, "resizable constrained width at containment edge" );
	assert.equal( element.height(), 200, "resizable constrained height at containment edge" );
	assert.equal( other1.width(), 250, "alsoResize o1 constrained width at containment edge" );
	assert.equal( other1.height(), 150, "alsoResize o1 constrained height at containment edge" );
	assert.equal( other2.width(), 250, "alsoResize o2 constrained width at containment edge" );
	assert.equal( other2.height(), 150, "alsoResize o2 constrained height at containment edge" );
} );

} );
