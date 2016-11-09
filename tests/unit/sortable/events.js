define( [
	"qunit",
	"jquery",
	"./helper",
	"ui/widgets/sortable",
	"ui/widgets/draggable"
], function( QUnit, $, testHelper ) {

QUnit.module( "sortable: events" );

QUnit.test( "start", function( assert ) {
	assert.expect( 7 );

	var hash;
	$( "#sortable" ).sortable( {
		start: function( e, ui ) {
			hash = ui;
		}
	} ).find( "li:eq(0)" ).simulate( "drag", {
		dy: 10
	} );

	assert.ok( hash, "start event triggered" );
	assert.ok( hash.helper, "UI hash includes: helper" );
	assert.ok( hash.placeholder, "UI hash includes: placeholder" );
	assert.ok( hash.item, "UI hash includes: item" );
	assert.ok( !hash.sender, "UI hash does not include: sender" );

	// Todo: see if these events should actually have sane values in them
	assert.ok( "position" in hash, "UI hash includes: position" );
	assert.ok( "offset" in hash, "UI hash includes: offset" );
} );

QUnit.test( "sort", function( assert ) {
	assert.expect( 7 );

	var hash;
	$( "#sortable" ).sortable( {
		sort: function( e, ui ) {
			hash = ui;
		}
	} ).find( "li:eq(0)" ).simulate( "drag", {
		dy: 10
	} );

	assert.ok( hash, "sort event triggered" );
	assert.ok( hash.helper, "UI hash includes: helper" );
	assert.ok( hash.placeholder, "UI hash includes: placeholder" );
	assert.ok( hash.position && ( "top" in hash.position && "left" in hash.position ), "UI hash includes: position" );
	assert.ok( hash.offset && ( hash.offset.top && hash.offset.left ), "UI hash includes: offset" );
	assert.ok( hash.item, "UI hash includes: item" );
	assert.ok( !hash.sender, "UI hash does not include: sender" );

} );

QUnit.test( "change", function( assert ) {
	assert.expect( 8 );

	var hash;
	$( "#sortable" ).sortable( {
		change: function( e, ui ) {
			hash = ui;
		}
	} ).find( "li:eq(0)" ).simulate( "drag", {
		dx: 1,
		dy: 1
	} );

	assert.ok( !hash, "1px drag, change event should not be triggered" );

	$( "#sortable" ).sortable( {
		change: function( e, ui ) {
			hash = ui;
		}
	} ).find( "li:eq(0)" ).simulate( "drag", {
		dy: 22
	} );

	assert.ok( hash, "change event triggered" );
	assert.ok( hash.helper, "UI hash includes: helper" );
	assert.ok( hash.placeholder, "UI hash includes: placeholder" );
	assert.ok( hash.position && ( "top" in hash.position && "left" in hash.position ), "UI hash includes: position" );
	assert.ok( hash.offset && ( hash.offset.top && hash.offset.left ), "UI hash includes: offset" );
	assert.ok( hash.item, "UI hash includes: item" );
	assert.ok( !hash.sender, "UI hash does not include: sender" );

} );

QUnit.test( "beforeStop", function( assert ) {
	assert.expect( 7 );

	var hash;
	$( "#sortable" ).sortable( {
		beforeStop: function( e, ui ) {
			hash = ui;
		}
	} ).find( "li:eq(0)" ).simulate( "drag", {
		dy: 20
	} );

	assert.ok( hash, "beforeStop event triggered" );
	assert.ok( hash.helper, "UI hash includes: helper" );
	assert.ok( hash.placeholder, "UI hash includes: placeholder" );
	assert.ok( hash.position && ( "top" in hash.position && "left" in hash.position ), "UI hash includes: position" );
	assert.ok( hash.offset && ( hash.offset.top && hash.offset.left ), "UI hash includes: offset" );
	assert.ok( hash.item, "UI hash includes: item" );
	assert.ok( !hash.sender, "UI hash does not include: sender" );

} );

QUnit.test( "stop", function( assert ) {
	assert.expect( 7 );

	var hash;
	$( "#sortable" ).sortable( {
		stop: function( e, ui ) {
			hash = ui;
		}
	} ).find( "li:eq(0)" ).simulate( "drag", {
		dy: 20
	} );

	assert.ok( hash, "stop event triggered" );
	assert.ok( !hash.helper, "UI should not include: helper" );
	assert.ok( hash.placeholder, "UI hash includes: placeholder" );
	assert.ok( hash.position && ( "top" in hash.position && "left" in hash.position ), "UI hash includes: position" );
	assert.ok( hash.offset && ( hash.offset.top && hash.offset.left ), "UI hash includes: offset" );
	assert.ok( hash.item, "UI hash includes: item" );
	assert.ok( !hash.sender, "UI hash does not include: sender" );

} );

QUnit.test( "update", function( assert ) {
	assert.expect( 8 );

	var hash;
	$( "#sortable" ).sortable( {
		update: function( e, ui ) {
			hash = ui;
		}
	} ).find( "li:eq(0)" ).simulate( "drag", {
		dx: 1,
		dy: 1
	} );

	assert.ok( !hash, "1px drag, update event should not be triggered" );

	$( "#sortable" ).sortable( {
		update: function( e, ui ) {
			hash = ui;
		}
	} ).find( "li:eq(0)" ).simulate( "drag", {
		dy: 22
	} );

	assert.ok( hash, "update event triggered" );
	assert.ok( !hash.helper, "UI hash should not include: helper" );
	assert.ok( hash.placeholder, "UI hash includes: placeholder" );
	assert.ok( hash.position && ( "top" in hash.position && "left" in hash.position ), "UI hash includes: position" );
	assert.ok( hash.offset && ( hash.offset.top && hash.offset.left ), "UI hash includes: offset" );
	assert.ok( hash.item, "UI hash includes: item" );
	assert.ok( !hash.sender, "UI hash does not include: sender" );

} );

QUnit.test( "#3019: Stop fires too early", function( assert ) {
	assert.expect( 2 );

	var helper = null,
		el = $( "#sortable" ).sortable( {
			stop: function( event, ui ) {
				helper = ui.helper;
			}
		} );

	testHelper.sort( assert, $( "li", el )[ 0 ], 0, 44, 2, "Dragging the sortable" );
	assert.equal( helper, null, "helper should be false" );

} );

QUnit.test( "#4752: link event firing on sortable with connect list", function( assert ) {
	assert.expect( 10 );

	var fired = {},
		hasFired = function( type ) { return ( type in fired ) && ( true === fired[ type ] ); };

	$( "#sortable" ).clone().attr( "id", "sortable2" ).insertAfter( "#sortable" );

	$( "#qunit-fixture ul" ).sortable( {
		connectWith: "#qunit-fixture ul",
		change: function() {
			fired.change = true;
		},
		receive: function() {
			fired.receive = true;
		},
		remove: function() {
			fired.remove = true;
		}
	} );

	$( "#qunit-fixture ul" ).on( "click.ui-sortable-test", function() {
		fired.click = true;
	} );

	$( "#sortable li:eq(0)" ).simulate( "click" );
	assert.ok( !hasFired( "change" ), "Click only, change event should not have fired" );
	assert.ok( hasFired( "click" ), "Click event should have fired" );

	// Drag an item within the first list
	fired = {};
	$( "#sortable li:eq(0)" ).simulate( "drag", { dx: 0, dy: 40 } );
	assert.ok( hasFired( "change" ), "40px drag, change event should have fired" );
	assert.ok( !hasFired( "receive" ), "Receive event should not have fired" );
	assert.ok( !hasFired( "remove" ), "Remove event should not have fired" );
	assert.ok( !hasFired( "click" ), "Click event should not have fired" );

	// Drag an item from the first list to the second, connected list
	fired = {};
	$( "#sortable li:eq(0)" ).simulate( "drag", { dx: 0, dy: 150 } );
	assert.ok( hasFired( "change" ), "150px drag, change event should have fired" );
	assert.ok( hasFired( "receive" ), "Receive event should have fired" );
	assert.ok( hasFired( "remove" ), "Remove event should have fired" );
	assert.ok( !hasFired( "click" ), "Click event should not have fired" );
} );

/*
Test("receive", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("remove", function() {
	ok(false, "missing test - untested code is broken code.");
});
*/

QUnit.test( "over", function( assert ) {
	assert.expect( 8 );

	var hash,
		overCount = 0;

	$( "#sortable" ).sortable( {
		over: function( e, ui ) {
			hash = ui;
			overCount++;
		}
	} ).find( "li:eq(0)" ).simulate( "drag", {
		dy: 20
	} );

	assert.ok( hash, "over event triggered" );
	assert.ok( hash.helper, "UI includes: helper" );
	assert.ok( hash.placeholder, "UI hash includes: placeholder" );
	assert.ok( hash.position && ( "top" in hash.position && "left" in hash.position ), "UI hash includes: position" );
	assert.ok( hash.offset && ( hash.offset.top && hash.offset.left ), "UI hash includes: offset" );
	assert.ok( hash.item, "UI hash includes: item" );
	assert.ok( hash.sender, "UI hash includes: sender" );
	assert.equal( overCount, 1, "over fires only once" );
} );

// http://bugs.jqueryui.com/ticket/9335
// Sortable: over & out events does not consistently fire
QUnit.test( "over, fires with draggable connected to sortable", function( assert ) {
	assert.expect( 3 );

	var hash,
		overCount = 0,
		item = $( "<div></div>" ).text( "6" ).insertAfter( "#sortable" );

	item.draggable( {
		connectToSortable: "#sortable"
	} );
	$( ".connectWith" ).sortable( {
		connectWith: ".connectWith",
		over: function( event, ui ) {
			hash = ui;
			overCount++;
		}
	} );

	item.simulate( "drag", {
		dy: -20
	} );

	assert.ok( hash, "over event triggered" );
	assert.ok( !hash.sender, "UI should not include: sender" );
	assert.equal( overCount, 1, "over fires only once" );
} );

QUnit.test( "over, with connected sortable", function( assert ) {
	assert.expect( 3 );

	var hash,
		overCount = 0;

	$( ".connectWith" ).sortable( {
		connectWith: ".connectWith"
	} );
	$( "#sortable2" ).on( "sortover", function( event, ui ) {
		hash = ui;
		overCount++;
	} );
	$( "#sortable" ).find( "li:eq(0)" ).simulate( "drag", {
		dy: 102
	} );

	assert.ok( hash, "over event triggered" );
	assert.equal( hash.sender[ 0 ], $( " #sortable" )[ 0 ], "UI includes: sender" );
	assert.equal( overCount, 1, "over fires only once" );
} );

/*
Test("out", function() {
	ok(false, "missing test - untested code is broken code.");
});
*/

QUnit.test( "out, with connected sortable", function( assert ) {
	assert.expect( 2 );

	var hash,
		outCount = 0;

	$( ".connectWith" ).sortable( {
		connectWith: ".connectWith"
	} );
	$( "#sortable" ).on( "sortout", function( event, ui ) {
		hash = ui;
		outCount++;
	} );
	$( "#sortable" ).find( "li:last" ).simulate( "drag", {
		dy: 40
	} );

	assert.ok( hash, "out event triggered" );
	assert.equal( outCount, 1, "out fires only once" );
} );

QUnit.test( "repeated out & over between connected sortables", function( assert ) {
	assert.expect( 2 );

	var outCount = 0,
		overCount = 0;

	$( ".connectWith" ).sortable( {
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
	} );
	$( "#sortable" ).find( "li:last" ).simulate( "drag", {
		dy: 40
	} ).simulate( "drag", {
		dy: -40
	} );

	assert.equal( outCount, 2, "out fires twice" );
	assert.equal( overCount, 4, "over fires four times" );
} );

/*
Test("activate", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("deactivate", function() {
	ok(false, "missing test - untested code is broken code.");
});
*/

} );
