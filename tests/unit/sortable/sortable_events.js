/*
 * sortable_events.js
 */
(function($) {

module("sortable: events");

test("start", function() {
	
	var hash;
	$("#sortable")
		.sortable({ start: function(e, ui) { hash = ui; } })
		.find('li:eq(0)').simulate("drag", { dx: 0, dy: 10 });
	
	ok(hash, 'start event triggered');	
	ok(hash.helper, 'UI hash includes: helper');
	ok(hash.placeholder, 'UI hash includes: placeholder');
	ok(hash.position && (hash.position.top && hash.position.left), 'UI hash includes: position');
	ok(hash.offset && (hash.offset.top && hash.offset.left), 'UI hash includes: offset');
	ok(hash.item, 'UI hash includes: item');
	ok(!hash.sender, 'UI hash does not include: sender');

			
});

test("sort", function() {
	
	var hash;
	$("#sortable")
		.sortable({ sort: function(e, ui) { hash = ui; } })
		.find('li:eq(0)').simulate("drag", { dx: 0, dy: 10 });
	
	ok(hash, 'sort event triggered');	
	ok(hash.helper, 'UI hash includes: helper');
	ok(hash.placeholder, 'UI hash includes: placeholder');
	ok(hash.position && (hash.position.top && hash.position.left), 'UI hash includes: position');
	ok(hash.offset && (hash.offset.top && hash.offset.left), 'UI hash includes: offset');
	ok(hash.item, 'UI hash includes: item');
	ok(!hash.sender, 'UI hash does not include: sender');
	
});

test("change", function() {
	
	var hash;
	$("#sortable")
		.sortable({ change: function(e, ui) { hash = ui; } })
		.find('li:eq(0)').simulate("drag", { dx: 1, dy: 1 });
	
	ok(!hash, '1px drag, change event should not be triggered');
	
	$("#sortable")
		.sortable({ change: function(e, ui) { hash = ui; } })
		.find('li:eq(0)').simulate("drag", { dx: 0, dy: 20 });	
		
	ok(hash, 'change event triggered');	
	ok(hash.helper, 'UI hash includes: helper');
	ok(hash.placeholder, 'UI hash includes: placeholder');
	ok(hash.position && (hash.position.top && hash.position.left), 'UI hash includes: position');
	ok(hash.offset && (hash.offset.top && hash.offset.left), 'UI hash includes: offset');
	ok(hash.item, 'UI hash includes: item');
	ok(!hash.sender, 'UI hash does not include: sender');
	
});

test("beforeStop", function() {
	
	var hash;
	$("#sortable")
		.sortable({ beforeStop: function(e, ui) { hash = ui; } })
		.find('li:eq(0)').simulate("drag", { dx: 0, dy: 20 });	
		
	ok(hash, 'beforeStop event triggered');	
	ok(hash.helper, 'UI hash includes: helper');
	ok(hash.placeholder, 'UI hash includes: placeholder');
	ok(hash.position && (hash.position.top && hash.position.left), 'UI hash includes: position');
	ok(hash.offset && (hash.offset.top && hash.offset.left), 'UI hash includes: offset');
	ok(hash.item, 'UI hash includes: item');
	ok(!hash.sender, 'UI hash does not include: sender');
	
});

test("stop", function() {
	
	var hash;
	$("#sortable")
		.sortable({ stop: function(e, ui) { hash = ui; } })
		.find('li:eq(0)').simulate("drag", { dx: 0, dy: 20 });	
		
	ok(hash, 'stop event triggered');	
	ok(!hash.helper, 'UI should not include: helper');
	ok(hash.placeholder, 'UI hash includes: placeholder');
	ok(hash.position && (hash.position.top && hash.position.left), 'UI hash includes: position');
	ok(hash.offset && (hash.offset.top && hash.offset.left), 'UI hash includes: offset');
	ok(hash.item, 'UI hash includes: item');
	ok(!hash.sender, 'UI hash does not include: sender');
	
});

test("update", function() {
	
	var hash;
	$("#sortable")
		.sortable({ update: function(e, ui) { hash = ui; } })
		.find('li:eq(0)').simulate("drag", { dx: 1, dy: 1 });
	
	ok(!hash, '1px drag, update event should not be triggered');
	
	$("#sortable")
		.sortable({ update: function(e, ui) { hash = ui; } })
		.find('li:eq(0)').simulate("drag", { dx: 0, dy: 20 });	
		
	ok(hash, 'update event triggered');	
	ok(!hash.helper, 'UI hash should not include: helper');
	ok(hash.placeholder, 'UI hash includes: placeholder');
	ok(hash.position && (hash.position.top && hash.position.left), 'UI hash includes: position');
	ok(hash.offset && (hash.offset.top && hash.offset.left), 'UI hash includes: offset');
	ok(hash.item, 'UI hash includes: item');
	ok(!hash.sender, 'UI hash does not include: sender');
	
});

test("receive", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("remove", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("over", function() {
	var hash;

	$("#sortable")
		.sortable({ over: function(e, ui) { hash = ui; } })
		.find('li:eq(0)')
		.simulate("dragStart");

	ok(!hash, '1px drag without drop, over event should not be triggered');

	$("#sortable li:eq(0)").simulate("dragStop");

	$("#sortable").find('li:eq(0)')
		.simulate("dragStart")
		.simulate("dragRelative", { dy: 1000 })
		.simulate("dragRelative", { dy: -1000 });

	ok(hash, 'Moving out then back should trigger an over event');
	ok(hash.helper, 'UI hash should include: helper');
	ok(hash.placeholder, 'UI should hash include: placeholder');
	ok(hash.position && (hash.position.top && hash.position.left), 'UI hash should include: position');
	ok(hash.offset && (hash.offset.top && hash.offset.left), 'UI hash should include: offset');
	ok(hash.item, 'UI hash should include: item');
	ok(hash.sender, 'UI hash should include: sender');

	$("#sortable li:eq(0)").simulate("dragStop");
	hash = undefined;

	$(".sortable")
		.sortable({
			over: function(e, ui) { hash = ui; },
			connectWith: '.sortable'
		});
	$("#sortable li:eq(0)")
		.simulate("dragStart")
		.simulate("dragToElement", { element: $('#sortable2') });
	ok(hash, 'Moving an element over a connected list should trigger an over event');
	equals(hash.sender[0].id, $('#sortable')[0].id, "UI hash's sender should be the source list");
});

test("out", function() {
	var hash;

	$("#sortable")
		.sortable({ out: function(e, ui) { hash = ui; } })
		.find('li:eq(0)').simulate("dragStart");

	ok(!hash, '1px drag without drop, out event should not be triggered');

	$("#sortable li:eq(0)").simulate("dragStop");

	hash = undefined;

	$("#sortable li:eq(0)")
			.simulate("dragStart")
			.simulate("dragRelative", { dx: 1, dy: 1000 });
	ok(hash, 'out event should be triggered when item is moved off the sortable');
	ok(hash.helper, 'UI hash should include: helper');
	ok(hash.placeholder, 'UI should hash include: placeholder');
	ok(hash.position && (hash.position.top && hash.position.left), 'UI hash should include: position');
	ok(hash.offset && (hash.offset.top && hash.offset.left), 'UI hash should include: offset');
	ok(hash.item, 'UI hash should include: item');
	ok(hash.sender, 'UI hash should include: sender');

	$("#sortable li:eq(0)").simulate("dragStop");

	$(".sortable")
		.sortable({
			out: function(e, ui) { hash = ui; },
			connectWith: '.sortable'
		});
	$("#sortable li:eq(0)")
		.simulate("dragStart")
		.simulate("dragToElement", { element: $('#sortable2') });

	hash = undefined;
	$("#sortable li:eq(0)")
		.simulate("dragRelative", { dy: 300 })

	ok(hash, 'Moving an element over a connected list, than off should trigger an out event');
});

test("activate", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("deactivate", function() {
	ok(false, "missing test - untested code is broken code.");
});

})(jQuery);
