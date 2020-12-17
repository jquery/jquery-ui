define( [
	"qunit",
	"jquery",
	"lib/helper",
	"ui/widgets/draggable"
], function( QUnit, $, helper ) {

return $.extend( helper, {

	// TODO: remove the unreliable offset hacks
	unreliableOffset: $.ui.ie && ( !document.documentMode || document.documentMode < 8 ) ? 2 : 0,

	// Support: Opera 12.10, Safari 5.1, jQuery <1.8

	unreliableContains: ( function() {
		var element = $( "<div>" );
		return $.contains( element[ 0 ].ownerDocument, element[ 0 ] );
	} )(),

	testDragPosition: function( assert, el, dx, dy, expectedDX, expectedDY, msg ) {
		msg = msg ? msg + "." : "";

		$( el ).one( "dragstop", function( event, ui ) {
			var positionExpected = { left: ui.originalPosition.left + expectedDX, top: ui.originalPosition.top + expectedDY };
			assert.deepEqual( ui.position, positionExpected, "position dragged[" + dx + ", " + dy + "] " + msg );
		} );
	},

	testDragOffset: function( assert, el, dx, dy, expectedDX, expectedDY, msg ) {
		msg = msg ? msg + "." : "";

		var offsetBefore = el.offset(),
			offsetExpected = { left: offsetBefore.left + expectedDX, top: offsetBefore.top + expectedDY };

		$( el ).one( "dragstop", function( event, ui ) {
			assert.deepEqual( ui.offset, offsetExpected, "offset dragged[" + dx + ", " + dy + "] " + msg );
		} );
	},

	testDragHelperOffset: function( assert, el, dx, dy, expectedDX, expectedDY, msg ) {
		msg = msg ? msg + "." : "";

		var offsetBefore = el.offset(),
			offsetExpected = { left: offsetBefore.left + expectedDX, top: offsetBefore.top + expectedDY };

		$( el ).one( "dragstop", function( event, ui ) {
			assert.deepEqual( ui.helper.offset(), offsetExpected, "offset dragged[" + dx + ", " + dy + "] " + msg );
		} );
	},

	testDrag: function( assert, el, handle, dx, dy, expectedDX, expectedDY, msg ) {
		this.testDragPosition( assert, el, dx, dy, expectedDX, expectedDY, msg );
		this.testDragOffset( assert, el, dx, dy, expectedDX, expectedDY, msg );

		$( handle ).simulate( "drag", {
			dx: dx,
			dy: dy
		} );
	},

	shouldMovePositionButNotOffset: function( assert, el, msg, handle ) {
		handle = handle || el;
		this.testDragPosition( assert, el, 100, 100, 100, 100, msg );
		this.testDragHelperOffset( assert, el, 100, 100, 0, 0, msg );

		$( handle ).simulate( "drag", {
			dx: 100,
			dy: 100
		} );
	},

	shouldMove: function( assert, el, msg, handle ) {
		handle = handle || el;
		this.testDrag( assert, el, handle, 100, 100, 100, 100, msg );
	},

	shouldNotMove: function( assert, el, msg, handle ) {
		handle = handle || el;
		this.testDrag( assert, el, handle, 100, 100, 0, 0, msg );
	},

	shouldNotDrag: function( assert, el, msg, handle ) {
		handle = handle || el;

		var newOffset,
			element = $( el ),
			beginOffset = element.offset();

		element.on( "dragstop", function() {
			assert.ok( false, "should not drag " + msg );
		} );

		$( handle ).simulate( "drag", {
			dx: 100,
			dy: 100
		} );

		newOffset = element.offset();

		// Also assert that draggable did not move, to ensure it isn't just
		// that drag did not fire and draggable still somehow moved
		assert.equal( newOffset.left, beginOffset.left, "Offset left should not be different" );
		assert.equal( newOffset.top, beginOffset.top, "Offset top should not be different" );

		element.off( "dragstop" );
	},

	setScrollable: function( what, isScrollable ) {
		var overflow = isScrollable ? "scroll" : "hidden";
		$( what ).css( { overflow: overflow, overflowX: overflow, overflowY: overflow } );
	},

	testScroll: function( assert, el, position ) {
		var oldPosition = $( "#main" ).css( "position" );
		$( "#main" ).css( { position: position, top: "0px", left: "0px" } );
		this.shouldMove( assert, el, position + " parent" );
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
		} );
	},

	trackMouseCss: function( el ) {
		el.on( "drag", function() {
			el.data( "last_dragged_cursor", $( "body" ).css( "cursor" ) );
		} );
	},

	trackAppendedParent: function( el ) {

		// TODO: appendTo is currently ignored if helper is original (see #7044)
		el.draggable( "option", "helper", "clone" );

		// Get what parent is at time of drag
		el.on( "drag", function( e, ui ) {
			el.data( "last_dragged_parent", ui.helper.parent()[ 0 ] );
		} );
	}
} );

} );
