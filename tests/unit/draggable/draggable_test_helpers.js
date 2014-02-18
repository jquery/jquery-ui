TestHelpers.draggable = {
	// TODO: remove the unreliable offset hacks
	unreliableOffset: $.ui.ie && ( !document.documentMode || document.documentMode < 8 ) ? 2 : 0,
	// Support: Opera 12.10, Safari 5.1, jQuery <1.8
	unreliableContains: (function() {
		var element = $( "<div>" );
		return $.contains( element[ 0 ].ownerDocument, element[ 0 ] );
	})(),
	testDragPosition: function( el, dx, dy, expectedDX, expectedDY, msg ) {
		msg = msg ? msg + "." : "";

		$( el ).one( "dragstop", function( event, ui ) {
			var positionExpected = { left: ui.originalPosition.left + expectedDX, top: ui.originalPosition.top + expectedDY };
			deepEqual( ui.position, positionExpected, "position dragged[" + dx + ", " + dy + "] " + msg );
		});
	},
	testDragOffset: function( el, dx, dy, expectedDX, expectedDY, msg ) {
		msg = msg ? msg + "." : "";

		var offsetBefore = el.offset(),
			offsetExpected = { left: offsetBefore.left + expectedDX, top: offsetBefore.top + expectedDY };

		$( el ).one( "dragstop", function( event, ui ) {
			deepEqual( ui.offset, offsetExpected, "offset dragged[" + dx + ", " + dy + "] " + msg );
		});
	},
	testDragHelperOffset: function( el, dx, dy, expectedDX, expectedDY, msg ) {
		msg = msg ? msg + "." : "";

		var offsetBefore = el.offset(),
			offsetExpected = { left: offsetBefore.left + expectedDX, top: offsetBefore.top + expectedDY };

		$( el ).one( "dragstop", function( event, ui ) {
			deepEqual( ui.helper.offset(), offsetExpected, "offset dragged[" + dx + ", " + dy + "] " + msg );
		});
	},
	testDrag: function( el, handle, dx, dy, expectedDX, expectedDY, msg ) {
		TestHelpers.draggable.testDragPosition( el, dx, dy, expectedDX, expectedDY, msg );
		TestHelpers.draggable.testDragOffset( el, dx, dy, expectedDX, expectedDY, msg );

		$( handle ).simulate( "drag", {
			dx: dx,
			dy: dy
		});
	},
	shouldMovePositionButNotOffset: function( el, msg, handle ) {
		handle = handle || el;
		TestHelpers.draggable.testDragPosition( el, 100, 100, 100, 100, msg );
		TestHelpers.draggable.testDragHelperOffset( el, 100, 100, 0, 0, msg );

		$( handle ).simulate( "drag", {
			dx: 100,
			dy: 100
		});
	},
	shouldMove: function( el, msg, handle ) {
		handle = handle || el;
		TestHelpers.draggable.testDrag( el, handle, 100, 100, 100, 100, msg );
	},
	shouldNotMove: function( el, msg, handle ) {
		handle = handle || el;
		TestHelpers.draggable.testDrag( el, handle, 100, 100, 0, 0, msg );
	},
	shouldNotDrag: function( el, msg, handle ) {
		handle = handle || el;
		$( el ).bind( "dragstop", function() {
			ok( false, "should not drag " + msg );
		});
		$( handle ).simulate( "drag", {
			dx: 100,
			dy: 100
		});
		$( el ).unbind( "dragstop" );
	},
	setScrollable: function( what, isScrollable ) {
		var overflow = isScrollable ? "scroll" : "hidden";
		$( what ).css({ overflow: overflow, overflowX: overflow, overflowY: overflow });
	},
	testScroll: function( el, position ) {
		var oldPosition = $( "#main" ).css( "position" );
		$( "#main" ).css({ position: position, top: "0px", left: "0px" });
		TestHelpers.draggable.shouldMove( el, position + " parent" );
		$( "#main" ).css( "position", oldPosition );
	},
	restoreScroll: function( what ) {
		$( what ).scrollTop( 0 ).scrollLeft( 0 );
	},
	setScroll: function( what ) {
		$( what ).scrollTop( 100 ).scrollLeft( 100 );
	},
	border: function( el, side ) {
		return parseInt( el.css( "border-" + side + "-width" ), 10 ) || 0;
	},
	margin: function( el, side ) {
		return parseInt( el.css( "margin-" + side ), 10 ) || 0;
	},
	move: function( el, x, y ) {
		$( el ).simulate( "drag", {
			dx: x,
			dy: y
		});
	},
	trackMouseCss: function( el ) {
		el.bind( "drag", function() {
			el.data( "last_dragged_cursor", $( "body" ).css( "cursor" ) );
		});
	},
	trackAppendedParent: function( el ) {
		// TODO: appendTo is currently ignored if helper is original (see #7044)
		el.draggable( "option", "helper", "clone" );

		// Get what parent is at time of drag
		el.bind( "drag", function(e,ui) {
			el.data( "last_dragged_parent", ui.helper.parent()[ 0 ] );
		});
	}
};
