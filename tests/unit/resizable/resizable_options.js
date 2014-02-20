/*
 * resizable_options.js
 */
(function($) {

module("resizable: options");

test( "alsoResize", function() {
	expect( 2 );

	var other = $( "<div>" )
			.css({
				width: 50,
				height: 50
			})
			.appendTo( "body" ),
		element = $( "#resizable1" ).resizable({
			alsoResize: other
		}),
		handle = ".ui-resizable-e";

	TestHelpers.resizable.drag( handle, 80 );
	equal( element.width(), 180, "resizable width" );
	equal( other.width(), 130, "alsoResize width" );
});


test("aspectRatio: 'preserve' (e)", function() {
	expect(4);

	var handle = ".ui-resizable-e", target = $("#resizable1").resizable({ aspectRatio: "preserve", handles: "all", minWidth: 70, minHeight: 50, maxWidth: 150, maxHeight: 130 });

	TestHelpers.resizable.drag(handle, 80);
	equal( target.width(), 130, "compare maxWidth");
	equal( target.height(), 130, "compare maxHeight");

	TestHelpers.resizable.drag(handle, -130);
	equal( target.width(), 70, "compare minWidth");
	equal( target.height(), 70, "compare minHeight");
});

test("aspectRatio: 'preserve' (w)", function() {
	expect(4);

	var handle = ".ui-resizable-w", target = $("#resizable1").resizable({ aspectRatio: "preserve", handles: "all", minWidth: 70, minHeight: 50, maxWidth: 150, maxHeight: 130 });

	TestHelpers.resizable.drag(handle, -80);
	equal( target.width(), 130, "compare maxWidth");
	equal( target.height(), 130, "compare maxHeight");

	TestHelpers.resizable.drag(handle, 130);
	equal( target.width(), 70, "compare minWidth");
	equal( target.height(), 70, "compare minHeight");
});

test("aspectRatio: 'preserve' (n)", function() {
	expect(4);

	var handle = ".ui-resizable-n", target = $("#resizable1").resizable({ aspectRatio: "preserve", handles: "all", minWidth: 70, minHeight: 50, maxWidth: 150, maxHeight: 130 });

	TestHelpers.resizable.drag(handle, 0, -80);
	equal( target.width(), 130, "compare maxWidth");
	equal( target.height(), 130, "compare maxHeight");

	TestHelpers.resizable.drag(handle, 0, 80);
	equal( target.width(), 70, "compare minWidth");
	equal( target.height(), 70, "compare minHeight");
});

test("aspectRatio: 'preserve' (s)", function() {
	expect(4);

	var handle = ".ui-resizable-s", target = $("#resizable1").resizable({ aspectRatio: "preserve", handles: "all", minWidth: 70, minHeight: 50, maxWidth: 150, maxHeight: 130 });

	TestHelpers.resizable.drag(handle, 0, 80);
	equal( target.width(), 130, "compare maxWidth");
	equal( target.height(), 130, "compare maxHeight");

	TestHelpers.resizable.drag(handle, 0, -80);
	equal( target.width(), 70, "compare minWidth");
	equal( target.height(), 70, "compare minHeight");
});

test("aspectRatio: 'preserve' (se)", function() {
	expect(4);

	var handle = ".ui-resizable-se", target = $("#resizable1").resizable({ aspectRatio: "preserve", handles: "all", minWidth: 70, minHeight: 50, maxWidth: 150, maxHeight: 130 });

	TestHelpers.resizable.drag(handle, 80, 80);
	equal( target.width(), 130, "compare maxWidth");
	equal( target.height(), 130, "compare maxHeight");

	TestHelpers.resizable.drag(handle, -80, -80);
	equal( target.width(), 70, "compare minWidth");
	equal( target.height(), 70, "compare minHeight");
});

test("aspectRatio: 'preserve' (sw)", function() {
	expect(4);

	var handle = ".ui-resizable-sw", target = $("#resizable1").resizable({ aspectRatio: "preserve", handles: "all", minWidth: 70, minHeight: 50, maxWidth: 150, maxHeight: 130 });

	TestHelpers.resizable.drag(handle, -80, 80);
	equal( target.width(), 130, "compare maxWidth");
	equal( target.height(), 130, "compare maxHeight");

	TestHelpers.resizable.drag(handle, 80, -80);
	equal( target.width(), 70, "compare minWidth");
	equal( target.height(), 70, "compare minHeight");
});

test("aspectRatio: 'preserve' (ne)", function() {
	expect(4);

	var handle = ".ui-resizable-ne", target = $("#resizable1").resizable({ aspectRatio: "preserve", handles: "all", minWidth: 70, minHeight: 50, maxWidth: 150, maxHeight: 130 });

	TestHelpers.resizable.drag(handle, 80, -80);
	equal( target.width(), 130, "compare maxWidth");
	equal( target.height(), 130, "compare maxHeight");

	TestHelpers.resizable.drag(handle, -80, 80);
	equal( target.width(), 70, "compare minWidth");
	equal( target.height(), 70, "compare minHeight");
});

test( "aspectRatio: Resizing can move objects", function() {
	expect( 7 );

	// http://bugs.jqueryui.com/ticket/7018 - Resizing can move objects
	var handleW = ".ui-resizable-w",
		handleNW = ".ui-resizable-nw",
		target = $( "#resizable1" ).resizable({
			aspectRatio: true,
			handles: "all",
			containment: "parent"
		});

	$( "#container" ).css({ width: 200, height: 300 });
	$( "#resizable1" ).css({ width: 100, height: 100, left: 75, top: 200 });

	TestHelpers.resizable.drag( handleW, -20 );
	equal( target.width(), 100, "compare width - no size change" );
	equal( target.height(), 100, "compare height - no size change" );
	equal( target.position().left, 75, "compare left - no movement" );

	// http://bugs.jqueryui.com/ticket/9107 - aspectRatio and containment not handled correctly
	$( "#container" ).css({ width: 200, height: 300, position: "absolute", left: 100, top: 100 });
	$( "#resizable1" ).css({ width: 100, height: 100, left: 0, top: 0 });

	TestHelpers.resizable.drag( handleNW, -20, -20 );
	equal( target.width(), 100, "compare width - no size change" );
	equal( target.height(), 100, "compare height - no size change" );
	equal( target.position().left, 0, "compare left - no movement" );
	equal( target.position().top, 0, "compare top - no movement" );
});

test( "containment", function() {
	expect( 6 );
	var element = $( "#resizable1" ).resizable({
		containment: "#container"
	});

	TestHelpers.resizable.drag( ".ui-resizable-se", 20, 30 );
	equal( element.width(), 120, "unconstrained width within container" );
	equal( element.height(), 130, "unconstrained height within container" );

	TestHelpers.resizable.drag( ".ui-resizable-se", 400, 400 );
	equal( element.width(), 300, "constrained width at containment edge" );
	equal( element.height(), 200, "constrained height at containment edge" );

	// http://bugs.jqueryui.com/ticket/7485 - Resizable: Containment calculation is wrong
	// when containment element is not the immediate parent
	element = $( "#child" ).resizable({
		containment: "#container2",
		handles: "all"
	});

	TestHelpers.resizable.drag( ".ui-resizable-e", 300, 0 );
	equal( element.width(), 400, "element able to resize itself to max allowable width within container" );

	TestHelpers.resizable.drag( ".ui-resizable-s", 0, 300 );
	equal( element.height(), 400, "element able to resize itself to max allowable height within container" );
});

test("grid", function() {
	expect(4);

	var handle = ".ui-resizable-se", target = $("#resizable1").resizable({ handles: "all", grid: [0, 20] });

	TestHelpers.resizable.drag(handle, 3, 9);
	equal( target.width(), 103, "compare width");
	equal( target.height(), 100, "compare height");

	TestHelpers.resizable.drag(handle, 15, 11);
	equal( target.width(), 118, "compare width");
	equal( target.height(), 120, "compare height");
});

test("grid (min/max dimensions)", function() {
	expect(4);

	var handle = ".ui-resizable-se", target = $("#resizable1").resizable({ handles: "all", grid: 20, minWidth: 65, minHeight: 65, maxWidth: 135, maxHeight: 135 });

	TestHelpers.resizable.drag(handle, 50, 50);
	equal( target.width(), 120, "grid should respect maxWidth");
	equal( target.height(), 120, "grid should respect maxHeight");

	TestHelpers.resizable.drag(handle, -100, -100);
	equal( target.width(), 80, "grid should respect minWidth");
	equal( target.height(), 80, "grid should respect minHeight");
});

test("grid (wrapped)", function() {
	expect(4);

	var handle = ".ui-resizable-se", target = $("#resizable2").resizable({ handles: "all", grid: [0, 20] });

	TestHelpers.resizable.drag(handle, 3, 9);
	equal( target.width(), 103, "compare width");
	equal( target.height(), 100, "compare height");

	TestHelpers.resizable.drag(handle, 15, 11);
	equal( target.width(), 118, "compare width");
	equal( target.height(), 120, "compare height");
});

test( "grid - Resizable: can be moved when grid option is set (#9611)", function() {
	expect( 6 );

	var oldPosition,
		handle = ".ui-resizable-nw",
		target = $( "#resizable1" ).resizable({
			handles: "all",
			grid: 50
		});

	TestHelpers.resizable.drag( handle, 50, 50 );
	equal( target.width(), 50, "compare width" );
	equal( target.height(), 50, "compare height" );

	oldPosition = target.position();

	TestHelpers.resizable.drag( handle, 50, 50 );
	equal( target.width(), 50, "compare width" );
	equal( target.height(), 50, "compare height" );
	equal( target.position().top, oldPosition.top, "compare top" );
	equal( target.position().left, oldPosition.left, "compare left" );
});

test("ui-resizable-se { handles: 'all', minWidth: 60, minHeight: 60, maxWidth: 100, maxHeight: 100 }", function() {
	expect(4);

	var handle = ".ui-resizable-se", target = $("#resizable1").resizable({ handles: "all", minWidth: 60, minHeight: 60, maxWidth: 100, maxHeight: 100 });

	TestHelpers.resizable.drag(handle, -50, -50);
	equal( target.width(), 60, "compare minWidth" );
	equal( target.height(), 60, "compare minHeight" );

	TestHelpers.resizable.drag(handle, 70, 70);
	equal( target.width(), 100, "compare maxWidth" );
	equal( target.height(), 100, "compare maxHeight" );
});

test("ui-resizable-sw { handles: 'all', minWidth: 60, minHeight: 60, maxWidth: 100, maxHeight: 100 }", function() {
	expect(4);

	var handle = ".ui-resizable-sw", target = $("#resizable1").resizable({ handles: "all", minWidth: 60, minHeight: 60, maxWidth: 100, maxHeight: 100 });

	TestHelpers.resizable.drag(handle, 50, -50);
	equal( target.width(), 60, "compare minWidth" );
	equal( target.height(), 60, "compare minHeight" );

	TestHelpers.resizable.drag(handle, -70, 70);
	equal( target.width(), 100, "compare maxWidth" );
	equal( target.height(), 100, "compare maxHeight" );
});

test("ui-resizable-ne { handles: 'all', minWidth: 60, minHeight: 60, maxWidth: 100, maxHeight: 100 }", function() {
	expect(4);

	var handle = ".ui-resizable-ne", target = $("#resizable1").resizable({ handles: "all", minWidth: 60, minHeight: 60, maxWidth: 100, maxHeight: 100 });

	TestHelpers.resizable.drag(handle, -50, 50);
	equal( target.width(), 60, "compare minWidth" );
	equal( target.height(), 60, "compare minHeight" );

	TestHelpers.resizable.drag(handle, 70, -70);
	equal( target.width(), 100, "compare maxWidth" );
	equal( target.height(), 100, "compare maxHeight" );
});

test("ui-resizable-nw { handles: 'all', minWidth: 60, minHeight: 60, maxWidth: 100, maxHeight: 100 }", function() {
	expect(4);

	var handle = ".ui-resizable-nw", target = $("#resizable1").resizable({ handles: "all", minWidth: 60, minHeight: 60, maxWidth: 100, maxHeight: 100 });

	TestHelpers.resizable.drag(handle, 70, 70);
	equal( target.width(), 60, "compare minWidth" );
	equal( target.height(), 60, "compare minHeight" );

	TestHelpers.resizable.drag(handle, -70, -70);
	equal( target.width(), 100, "compare maxWidth" );
	equal( target.height(), 100, "compare maxHeight" );
});

test("zIndex, applied to all handles", function() {
	expect(8);

	var target = $("<div></div>").resizable({ handles: "all", zIndex: 100 });
	target.children( ".ui-resizable-handle" ).each( function( index, handle ) {
		equal( $( handle ).css( "zIndex" ), 100, "compare zIndex" );
	});
});

test( "alsoResize + containment", function() {
	expect( 4 );
	var other = $( "<div>" )
			.css({
				width: 50,
				height: 50
			})
			.appendTo( "body" ),
		element = $( "#resizable1" ).resizable({
			alsoResize: other,
			containment: "#container"
		});

	TestHelpers.resizable.drag( ".ui-resizable-se", 400, 400 );
	equal( element.width(), 300, "resizable constrained width at containment edge" );
	equal( element.height(), 200, "resizable constrained height at containment edge" );
	equal( other.width(), 250, "alsoResize constrained width at containment edge" );
	equal( other.height(), 150, "alsoResize constrained height at containment edge" );
});

})(jQuery);
