/*
 * sortable_events.js
 */
(function($) {

module("sortable: events");

test("start", function() {
	expect( 7 );

	var hash;
	$("#sortable").sortable({
		start: function( e, ui ) {
			hash = ui;
		}
	}).find("li:eq(0)").simulate( "drag", {
		dy: 10
	});

	ok(hash, "start event triggered");
	ok(hash.helper, "UI hash includes: helper");
	ok(hash.placeholder, "UI hash includes: placeholder");
	ok(hash.item, "UI hash includes: item");
	ok(!hash.sender, "UI hash does not include: sender");

	// todo: see if these events should actually have sane values in them
	ok("position" in hash, "UI hash includes: position");
	ok("offset" in hash, "UI hash includes: offset");


});

test("sort", function() {
	expect( 7 );

	var hash;
	$("#sortable").sortable({
		sort: function( e, ui ) {
			hash = ui;
		}
	}).find("li:eq(0)").simulate( "drag", {
		dy: 10
	});

	ok(hash, "sort event triggered");
	ok(hash.helper, "UI hash includes: helper");
	ok(hash.placeholder, "UI hash includes: placeholder");
	ok(hash.position && ("top" in hash.position && "left" in hash.position), "UI hash includes: position");
	ok(hash.offset && (hash.offset.top && hash.offset.left), "UI hash includes: offset");
	ok(hash.item, "UI hash includes: item");
	ok(!hash.sender, "UI hash does not include: sender");

});

test("change", function() {
	expect( 8 );

	var hash;
	$("#sortable").sortable({
		change: function( e, ui ) {
			hash = ui;
		}
	}).find("li:eq(0)").simulate( "drag", {
		dx: 1,
		dy: 1
	});

	ok(!hash, "1px drag, change event should not be triggered");

	$("#sortable").sortable({
		change: function( e, ui ) {
			hash = ui;
		}
	}).find("li:eq(0)").simulate( "drag", {
		dy: 22
	});

	ok(hash, "change event triggered");
	ok(hash.helper, "UI hash includes: helper");
	ok(hash.placeholder, "UI hash includes: placeholder");
	ok(hash.position && ("top" in hash.position && "left" in hash.position), "UI hash includes: position");
	ok(hash.offset && (hash.offset.top && hash.offset.left), "UI hash includes: offset");
	ok(hash.item, "UI hash includes: item");
	ok(!hash.sender, "UI hash does not include: sender");

});

test("beforeStop", function() {
	expect( 7 );

	var hash;
	$("#sortable").sortable({
		beforeStop: function( e, ui ) {
			hash = ui;
		}
	}).find("li:eq(0)").simulate( "drag", {
		dy: 20
	});

	ok(hash, "beforeStop event triggered");
	ok(hash.helper, "UI hash includes: helper");
	ok(hash.placeholder, "UI hash includes: placeholder");
	ok(hash.position && ("top" in hash.position && "left" in hash.position), "UI hash includes: position");
	ok(hash.offset && (hash.offset.top && hash.offset.left), "UI hash includes: offset");
	ok(hash.item, "UI hash includes: item");
	ok(!hash.sender, "UI hash does not include: sender");

});

test("stop", function() {
	expect( 7 );

	var hash;
	$("#sortable").sortable({
		stop: function( e, ui ) {
			hash = ui;
		}
	}).find("li:eq(0)").simulate( "drag", {
		dy: 20
	});

	ok(hash, "stop event triggered");
	ok(!hash.helper, "UI should not include: helper");
	ok(hash.placeholder, "UI hash includes: placeholder");
	ok(hash.position && ("top" in hash.position && "left" in hash.position), "UI hash includes: position");
	ok(hash.offset && (hash.offset.top && hash.offset.left), "UI hash includes: offset");
	ok(hash.item, "UI hash includes: item");
	ok(!hash.sender, "UI hash does not include: sender");

});

test("update", function() {
	expect( 8 );

	var hash;
	$("#sortable").sortable({
		update: function( e, ui ) {
			hash = ui;
		}
	}).find("li:eq(0)").simulate( "drag", {
		dx: 1,
		dy: 1
	});

	ok(!hash, "1px drag, update event should not be triggered");

	$("#sortable").sortable({
		update: function( e, ui ) {
			hash = ui;
		}
	}).find("li:eq(0)").simulate( "drag", {
		dy: 22
	});

	ok(hash, "update event triggered");
	ok(!hash.helper, "UI hash should not include: helper");
	ok(hash.placeholder, "UI hash includes: placeholder");
	ok(hash.position && ("top" in hash.position && "left" in hash.position), "UI hash includes: position");
	ok(hash.offset && (hash.offset.top && hash.offset.left), "UI hash includes: offset");
	ok(hash.item, "UI hash includes: item");
	ok(!hash.sender, "UI hash does not include: sender");

});

test("#3019: Stop fires too early", function() {
	expect(2);

	var helper = null,
		el = $("#sortable").sortable({
			stop: function(event, ui) {
				helper = ui.helper;
			}
		});

	TestHelpers.sortable.sort($("li", el)[0], 0, 44, 2, "Dragging the sortable");
	equal(helper, null, "helper should be false");

});

test("#4752: link event firing on sortable with connect list", function () {
	expect( 10 );

	var fired = {},
		hasFired = function (type) { return (type in fired) && (true === fired[type]); };

	$("#sortable").clone().attr("id", "sortable2").insertAfter("#sortable");

	$("#qunit-fixture ul").sortable({
		connectWith: "#qunit-fixture ul",
		change: function () {
			fired.change = true;
		},
		receive: function () {
			fired.receive = true;
		},
		remove: function () {
			fired.remove = true;
		}
	});

	$("#qunit-fixture ul").bind("click.ui-sortable-test", function () {
		fired.click = true;
	});

	$("#sortable li:eq(0)").simulate("click");
	ok(!hasFired("change"), "Click only, change event should not have fired");
	ok(hasFired("click"), "Click event should have fired");

	// Drag an item within the first list
	fired = {};
	$("#sortable li:eq(0)").simulate("drag", { dx: 0, dy: 40 });
	ok(hasFired("change"), "40px drag, change event should have fired");
	ok(!hasFired("receive"), "Receive event should not have fired");
	ok(!hasFired("remove"), "Remove event should not have fired");
	ok(!hasFired("click"), "Click event should not have fired");

	// Drag an item from the first list to the second, connected list
	fired = {};
	$("#sortable li:eq(0)").simulate("drag", { dx: 0, dy: 150 });
	ok(hasFired("change"), "150px drag, change event should have fired");
	ok(hasFired("receive"), "Receive event should have fired");
	ok(hasFired("remove"), "Remove event should have fired");
	ok(!hasFired("click"), "Click event should not have fired");
});

/*
test("receive", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("remove", function() {
	ok(false, "missing test - untested code is broken code.");
});
*/

test( "over", function() {
	expect( 8 );

	var hash,
		overCount = 0;

	$( "#sortable" ).sortable({
		over: function( e, ui ) {
			hash = ui;
			overCount++;
		}
	}).find( "li:eq(0)" ).simulate( "drag", {
		dy: 20
	});

	ok( hash, "over event triggered" );
	ok( hash.helper, "UI includes: helper" );
	ok( hash.placeholder, "UI hash includes: placeholder" );
	ok( hash.position && ( "top" in hash.position && "left" in hash.position ), "UI hash includes: position" );
	ok( hash.offset && ( hash.offset.top && hash.offset.left ), "UI hash includes: offset" );
	ok( hash.item, "UI hash includes: item" );
	ok( hash.sender, "UI hash includes: sender" );
	equal( overCount, 1, "over fires only once" );
});

test( "out", function() {
	expect( 8 );

	var hash,
		outCount = 0;

	$("#sortableoutover").sortable({
		out: function( e, ui ) {
			hash = ui;
			outCount++;
		}
	}).find( "li:eq(0)" ).simulate( "drag", {
		dy: 150
	});

	ok( hash, "out event triggered" );
	ok( hash.helper, "UI should not include: helper" );
	ok( hash.placeholder, "UI hash includes: placeholder" );
	ok( hash.position && ( "top" in hash.position && "left" in hash.position ), "UI hash includes: position" );
	ok( hash.offset && ( hash.offset.top && hash.offset.left ), "UI hash includes: offset" );
	ok( hash.item, "UI hash includes: item" );
	ok( hash.sender, "UI hash does not include: sender" );
	equal( outCount, 1, "out fires only once" );
});

test("#9335: over and out firing, including with connectWith and a draggable", function() {
	expect(24);
	
	/*
	 * The fixture structure is: 
	 *   - a UL with 5 * LI of 20px height each (total height 100px) to be made sortable
	 *   - a DIV of height 100px
	 *   - a UL with 1 * LI of 20px height (total height fixed at 20px) with the LI to be made draggable
	 *   - a UL with 5 * LI of 20px height each (total height 100px) to be made sortable
	 */
	
	var fired = {},
		firedCount = function (id,type) { var key=id + "-" + type; return (key in fired) ? fired[key] : 0; },
		fire = function (sortable,type) { var key=$(sortable).attr("id") + "-" + type; fired[key] = ((key in fired) ? fired[key] : 0) + 1; },
		sortable_ul=$("#sortableoutover"),
		drag_el = sortable_ul.find( "li:eq(0)" ),
		draggable_container=$("#sortableoutoverdraggablelist"),
		draggable=draggable_container.find("li:eq(0)");

	// Initialise with hooks to count how often out and over events fire
	$("#qunit-fixture ul.sortableoutover").sortable({
		connectWith: "#qunit-fixture ul.sortableoutover",
		out: function () {
			fire(this,"out");
		},
		over: function () {
			fire(this,"over");
		}
	});
	draggable.draggable({
		connectToSortable: "#qunit-fixture ul.sortableoutover",
		revert:"invalid"
	});
	
	// Test that after dragging out (but keeping the mouse down)
	// registers an initial over and then an out against the main sortable
	fired = {};
	TestHelpers.sortable.dragBegin(drag_el, {
		dy: 150
	});
	equal( firedCount( "sortableoutover", "over" ), 1, "Drag outside sortable fires over once initially" );
	equal( firedCount( "sortableoutover", "out" ), 1, "Drag outside sortable fires out once" );
	
	// Release the mouse button while not over the sortable triggers no 'out' event
	fired = {};
	TestHelpers.sortable.dragEnd(drag_el, { });
	equal( firedCount( "sortableoutover", "over" ), 0, "Completion of drag outside sortable fires no over" );
	equal( firedCount( "sortableoutover", "out" ), 0, "Completion of drag outside sortable fires no out" );

	// NB: because the above drag may well have resulted in the drag element being repositioned in the
	// list we get the current first element again
	drag_el = sortable_ul.find( "li:eq(0)" );
	
	// Test that dragging out and then back over fires an initial over, the out, and then another over
	fired = {};
	TestHelpers.sortable.dragBegin(drag_el, {
		dy: 150
	});
	TestHelpers.sortable.dragContinue(drag_el, {
		dy: -150
	});
	equal( firedCount( "sortableoutover", "over" ), 2, "Drag outside and then back over sortable fires over once initially and then a second on return" );
	equal( firedCount( "sortableoutover", "out" ), 1, "Drag outside and then back over sortable fires out once" );
	
	// Releasing the mouse button while 'over' triggers an 'out'
	fired = {};
	TestHelpers.sortable.dragEnd(drag_el, { });
	equal( firedCount( "sortableoutover", "over" ), 0, "Releasing the mouse button after a drag out and then back over triggers no further over" );
	equal( firedCount( "sortableoutover", "out" ), 1, "Releasing the mouse button after a drag out and then back over triggers a final out" );
	
	// Test that dragging out and then over second sortable fires initial over and out on the first
	// and then an over on the second
	fired = {};
	TestHelpers.sortable.dragBegin(drag_el, {
		dy: 150
	});
	TestHelpers.sortable.dragContinue(drag_el, {
		dy: 100
	});
	equal( firedCount( "sortableoutover", "over" ), 1, "Drag outside first and then over second sortable fires over on first sortable" );
	equal( firedCount( "sortableoutover", "out" ), 1, "Drag outside first and then over second sortable fires out on first sortable" );
	equal( firedCount( "sortableoutover2", "over" ), 1, "Drag outside first and then over second sortable fires over on second sortable" );
	equal( firedCount( "sortableoutover2", "out" ), 0, "Drag outside first and then over second sortable fires no out on second sortable" );
	
	// Releasing the mouse button while 'over' triggers an 'out' - this time it should be on the second sortable, not the first
	fired = {};
	TestHelpers.sortable.dragEnd(drag_el, { });
	equal( firedCount( "sortableoutover", "out" ), 0, "Releasing the mouse button after a drag out and over the second sortable shouldn't trigger an out on the first" );
	equal( firedCount( "sortableoutover2", "out" ), 1, "Releasing the mouse button after a drag out and over the second sortable should trigger an out on the second" );
	
	// Dragging draggable over one sorted list and then out and then over another sorted list and then out
	// should trigger one over and one out on each
	fired = {};
	TestHelpers.sortable.dragBegin(draggable, {
		dy: 70 // Over second sortable
	});
	TestHelpers.sortable.dragContinue(draggable, {
		dy: -120 // Over space div
	});
	TestHelpers.sortable.dragContinue(draggable, {
		dy: -100 // Over first sortable
	});
	TestHelpers.sortable.dragContinue(draggable, {
		dy: 100 // Over space div
	});
	equal( firedCount( "sortableoutover", "over" ), 1, "Dragging over both sortables and then back out should trigger over on first" );
	equal( firedCount( "sortableoutover", "out" ), 1, "Dragging over both sortables and then back out should trigger out on first" );
	equal( firedCount( "sortableoutover2", "over" ), 1, "Dragging over both sortables and then back out should trigger over on second" );
	equal( firedCount( "sortableoutover2", "out" ), 1, "Dragging over both sortables and then back out should trigger out on second" );

	// Release the mouse button while outside both sortables shouldn't trigger any further out events
	fired = {};
	TestHelpers.sortable.dragEnd(draggable, { });
	equal( firedCount( "sortableoutover", "out" ), 0, "Dragging over both sortables and then back out shouldn't trigger any further out event on first on mouseup" );
	equal( firedCount( "sortableoutover2", "out" ), 0, "Dragging over both sortables and then back out shouldn't trigger any further out event on second on mouseup" );

	// At the time of writing this test if you drop a draggable outside of a sortable but it was
	// over a sortable at some point during the drag then it ends up in the sortable (i.e. it doesn't revert), so reset
	// the draggable back to being in its container before the next test
	draggable
		.draggable("destroy")
		.appendTo(draggable_container)
		.draggable({
			connectToSortable: "#qunit-fixture ul.sortableoutover",
			revert:"invalid"
		});
	
	// Test dragging draggable over connected sortable
	// registers an initial over and then an out against the main sortable
	fired = {};
	TestHelpers.sortable.dragBegin(draggable, {
		dy: 50
	});
	equal( firedCount( "sortableoutover2", "over" ), 1, "Dragging draggable over sortable should trigger over" );
	equal( firedCount( "sortableoutover2", "out" ), 0, "Dragging draggable over sortable shouldn't trigger out until mouseup" );
	
	// Release the mouse button while over the sortable should trigger out
	// NB: this will have dropped drag_el on to this second list
	fired = {};
	TestHelpers.sortable.dragEnd(draggable, { });
	equal( firedCount( "sortableoutover2", "over" ), 0, "Completion of drag of draggable over sortable shouldn't trigger over" );
	equal( firedCount( "sortableoutover2", "out" ), 1, "Completion of drag of draggable over sortable should trigger out" );

});

/*
test("activate", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("deactivate", function() {
	ok(false, "missing test - untested code is broken code.");
});
*/

})(jQuery);
