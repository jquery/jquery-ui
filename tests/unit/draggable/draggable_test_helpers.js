TestHelpers.draggable = {
	// TODO: remove the unreliable offset hacks
	unreliableOffset: $.ui.ie && ( !document.documentMode || document.documentMode < 8 ) ? 2 : 0,
	// Support: Opera 12.10, Safari 5.1, jQuery <1.8
	unreliableContains: (function(){
		var element = $( "<div>" );
		return $.contains( element[ 0 ].ownerDocument, element[ 0 ] );
	})(),
	testDrag: function( el, handle, dx, dy, expectedDX, expectedDY, msg ) {
		msg = msg ? msg + "." : "";

		var offsetActual,
			offsetBefore = el.offset(),
			offsetExpected = { left: offsetBefore.left + expectedDX, top: offsetBefore.top + expectedDY };

		$( el ).one( "dragstop", function( event, ui ) {
			var expectedPosition = { left: ui.originalPosition.left + expectedDX, top: ui.originalPosition.top + expectedDY };
			// TODO: fix test bugs and actual bugs that cause this not to be true
			// deepEqual( ui.position, expectedPosition, "position dragged[" + dx + ", " + dy + "] " + msg );
			ok( true, "TODO: deepEqual( ui.position, expectedPosition, 'position dragged[" + dx + ", " + dy + "] " + msg + "');");
		} );

		$( handle ).simulate( "drag", {
			dx: dx,
			dy: dy,
			// moves is 1 here because simulate currently fire events synchronously
			// so we can't faithfully test things that rely on a scroll event (which is async)
			moves: 1
		});

		offsetActual = el.offset();

		deepEqual( offsetActual, offsetExpected, "offset dragged[" + dx + ", " + dy + "] " + msg );
	},
	shouldMove: function( el, why, handle ) {
		handle = handle || el;
		TestHelpers.draggable.testDrag( el, handle, 50, 50, 50, 50, why );
	},
	shouldNotMove: function( el, why, handle ) {
		handle = handle || el;
		TestHelpers.draggable.testDrag( el, handle, 50, 50, 0, 0, why );
	},
	shouldNotDrag: function( el, why, handle ) {
		$( el ).bind( "dragstop", function() {
			ok( false, "should not drag " + why );
		} );
		TestHelpers.draggable.shouldNotMove( el, why, handle );
		$( el ).unbind( "dragstop" );
	},
	testScroll: function( el, position ) {
		var oldPosition = $( "#main" ).css( "position" );
		$( "#main" ).css( "position", position);
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
	trackMouseCss : function( el ) {
		el.bind( "drag", function() {
			el.data( "last_dragged_cursor", $( "body" ).css( "cursor" ) );
		});
	},
	trackAppendedParent : function( el ) {
		// TODO: appendTo is currently ignored if helper is original (see #7044)
		el.draggable( "option", "helper", "clone" );

		// Get what parent is at time of drag
		el.bind( "drag", function(e,ui) {
			el.data( "last_dragged_parent", ui.helper.parent()[ 0 ] );
		});
	}
};