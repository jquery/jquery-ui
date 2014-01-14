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

// http://bugs.jqueryui.com/ticket/9335
// Sortable: over & out events does not consistently fire
test( "over, fires with draggable connected to sortable", function() {
	expect( 3 );

	var hash,
		overCount = 0,
		item = $( "<div></div>" ).text( "6" ).insertAfter( "#sortable" );

	item.draggable({
		connectToSortable: "#sortable"
	});
	$( ".connectWith" ).sortable({
		connectWith: ".connectWith",
		over: function( event, ui ) {
			hash = ui;
			overCount++;
		}
	});

	item.simulate( "drag", {
		dy: -20
	});

	ok( hash, "over event triggered" );
	ok( !hash.sender, "UI should not include: sender" );
	equal( overCount, 1, "over fires only once" );
});

test( "over, with connected sortable", function() {
	expect( 3 );

	var hash,
		overCount = 0;

	$( ".connectWith" ).sortable({
		connectWith: ".connectWith"
	});
	$( "#sortable2" ).on( "sortover", function( event, ui ) {
		hash = ui;
		overCount++;
	});
	$( "#sortable" ).find( "li:eq(0)" ).simulate( "drag", {
		dy: 102
	});

	ok( hash, "over event triggered" );
	equal( hash.sender[ 0 ], $(" #sortable" )[ 0 ], "UI includes: sender" );
	equal( overCount, 1, "over fires only once" );
});

/*
test("out", function() {
	ok(false, "missing test - untested code is broken code.");
});
*/

test( "out, with connected sortable", function() {
	expect( 2 );

	var hash,
		outCount = 0;

	$( ".connectWith" ).sortable({
		connectWith: ".connectWith"
	});
	$( "#sortable" ).on( "sortout", function( event, ui ) {
		hash = ui;
		outCount++;
	});
	$( "#sortable" ).find( "li:last" ).simulate( "drag", {
		dy: 40
	});

	ok( hash, "out event triggered" );
	equal( outCount, 1, "out fires only once" );
});

test( "repeated out & over between connected sortables", function() {
	expect( 2 );

	var outCount = 0,
		overCount = 0;

	$( ".connectWith" ).sortable({
		connectWith: ".connectWith",
		over: function() {
			overCount++;
		},
		out: function( event, ui ) {
			// Ignore events that trigger when an item has dropped
			// checking for the presence of the helper.
			if ( !ui.helper ) {
				outCount++;
			}
		}
	});
	$( "#sortable" ).find( "li:last" ).simulate( "drag", {
		dy: 40
	}).simulate( "drag", {
		dy: -40
	});

	equal( outCount, 2, "out fires twice" );
	equal( overCount, 4, "over fires four times" );
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
