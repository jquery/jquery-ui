TestHelpers.draggable = {
	// todo: remove the unreliable offset hacks
	unreliableOffset: $.ui.ie && ( !document.documentMode || document.documentMode < 8 ) ? 2 : 0,
	testDrag: function(el, handle, dx, dy, expectedDX, expectedDY, msg) {
		var positionAfter, actual, expected,
			// Using offset rather than position, would break for fixed position elements
			positionBefore = el.position();

		$( handle ).simulate( "drag", {
			dx: dx,
			dy: dy,
			// MUST be one move since scroll events are async, things will not calculate properly
			moves: 1
		});
		positionAfter = el.position();


		actual = { left: positionAfter.left, top: positionAfter.top };
		expected = { left: positionBefore.left + expectedDX, top: positionBefore.top + expectedDY };

		msg = msg ? msg + "." : "";
		deepEqual(actual, expected, "dragged[" + dx + ", " + dy + "] " + msg);
	},
	shouldMove: function(el, why) {
		TestHelpers.draggable.testDrag(el, el, 50, 50, 50, 50, why);
	},
	shouldNotMove: function(el, why) {
		TestHelpers.draggable.testDrag(el, el, 50, 50, 0, 0, why);
	},
	testScroll: function(el, position ) {
		var oldPosition = $("#main").css("position");
		$("#main").css("position", position);

		// Make sure draggable is in viewport for test
		$('#qunit-fixture').css({
		  top: "0px",
			left: "0px"
		});

		// Draggalbe should now be in top left, partially in viewport
		// See that it drags to top-left properly
		TestHelpers.draggable.testDrag(el, el, -50, -50, -50, -50, position+" parent");

		// Reset fixture
		$('#qunit-fixture').css({
		  top: "",
			left: ""
		});
		$("#main").css("position", oldPosition);
	},
	restoreScroll: function( what ) {
		if( what ) {
			$(document).scrollTop(0);
			$(document).scrollLeft(0);
		} else {
			$("#main").scrollTop(0);
			$("#main").scrollLeft(0);
		}

		$('.force-scroll').remove();

	},
	setScroll: function( what, scrollLeftAmount, scrollTopAmount ) {

		// Defaults to slightly less than half the size of dragable1, since simulate picks up by center by default
		// This ensures that simulate will pick up the draggable in the viewport
		scrollLeftAmount = scrollLeftAmount || 95;
		scrollTopAmount = scrollTopAmount || 45;

		$(document.body).append( "<div class='force-scroll'>" );


		if(what) {
			$(document).scrollTop(scrollTopAmount);
			$(document).scrollLeft(scrollLeftAmount);
		} else {
			$("#main").scrollTop(scrollTopAmount);
			$("#main").scrollLeft(scrollLeftAmount);
		}
	},
	border: function(el, side) {
		return parseInt(el.css("border-" + side + "-width"), 10) || 0;
	},
	margin: function(el, side) {
		return parseInt(el.css("margin-" + side), 10) || 0;
	},
	move: function( el, x, y ) {
		$( el ).simulate( "drag", {
			dx: x,
			dy: y
		});
	},
	trackMouseCss : function( el ) {
		el.on( "drag", function() {
			el.data( "last_dragged_cursor", $("body").css("cursor") );
		});
	},
	trackAppendedParent : function( el ) {
		// appendTo ignored without being clone
		el.draggable( "option", "helper", "clone" );

		el.on( "drag", function(e,ui) {
			// Get what parent is at time of drag
			el.data( "last_dragged_parent", ui.helper.parent()[0] );
		});
	}
};