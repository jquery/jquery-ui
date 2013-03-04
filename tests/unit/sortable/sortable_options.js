/*
 * sortable_options.js
 */
(function($) {

module("sortable: options");

// this is here to make JSHint pass "unused", and we don't want to
// remove the parameter for when we finally implement
$.noop();

/*
test("{ appendTo: 'parent' }, default", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ appendTo: Selector }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ axis: false }, default", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ axis: 'x' }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ axis: 'y' }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ axis: ? }, unexpected", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ cancel: 'input,textarea,button,select,option' }, default", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ cancel: Selector }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ connectWith: false }, default", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ connectWith: Selector }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ containment: false }, default", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ containment: Element }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ containment: 'document' }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ containment: 'parent' }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ containment: 'window' }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ containment: Selector }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ cursor: 'auto' }, default", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ cursor: 'move' }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ cursorAt: false }, default", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ cursorAt: true }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ delay: 0 }, default", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ delay: 100 }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ distance: 1 }, default", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ distance: 10 }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ dropOnEmpty: true }, default", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ dropOnEmpty: false }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ forcePlaceholderSize: false }, default", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ forcePlaceholderSize: true }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ forceHelperSize: false }, default", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ forceHelperSize: true }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ grid: false }, default", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ grid: [17, 3] }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ grid: [3, 7] }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ handle: false }, default", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ handle: Element }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ handle: Selector }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ helper: 'original' }, default", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ helper: Function }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ items: '> *' }, default", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ items: Selector }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ opacity: false }, default", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ opacity: .37 }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ opacity: 1 }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ placeholder: false }, default", function() {
	ok(false, "missing test - untested code is broken code.");
});
*/
test( "{ placeholder: String }", function() {
	expect( 1 );

	var element = $( "#sortable" ).sortable({
		placeholder: "test",
		start: function( event, ui ) {
			ok( ui.placeholder.hasClass( "test" ), "placeholder has class" );
		}
	});

	element.find( "li" ).eq( 0 ).simulate( "drag", {
		dy: 1
	});
});

test( "{ placholder: String } tr", function() {
	expect( 3 );

	var element = $( "#sortable-table tbody" ).sortable({
		placeholder: "test",
		start: function( event, ui ) {
			ok( ui.placeholder.hasClass( "test" ), "placeholder has class" );
			equal( ui.placeholder.children().length, 1, "placeholder tr contains a td" );
			equal( ui.placeholder.children().html(), $( "<span>&#160;</span>" ).html(),
				"placeholder td has content for forced dimensions" );
		}
	});

	element.find( "tr" ).eq( 0 ).simulate( "drag", {
		dy: 1
	});
});

/*
test("{ revert: false }, default", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ revert: true }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ scroll: true }, default", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ scroll: false }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ scrollSensitivity: 20 }, default", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ scrollSensitivity: 2 }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ scrollSensitivity: 200 }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ scrollSpeed: 20 }, default", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ scrollSpeed: 2 }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ scrollSpeed: 200 }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ scope: 'default' }, default", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ scope: ??? }, unexpected", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ tolerance: 'intersect' }, default", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ tolerance: 'pointer' }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ zIndex: 1000 }, default", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ zIndex: 1 }", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("{ zIndex: false }", function() {
	ok(false, "missing test - untested code is broken code.");
});
*/
})(jQuery);
