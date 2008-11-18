/*
 * core unit tests
 */
(function($) {

module("selectors");

test("tabbable - enabled elements", function() {
	expect(10);

	ok( $('#input1-1').is(':tabbable'), 'input, no type');
	ok( $('#input1-2').is(':tabbable'), 'input, type text');
	ok( $('#input1-3').is(':tabbable'), 'input, type checkbox');
	ok( $('#input1-4').is(':tabbable'), 'input, type radio');
	ok( $('#input1-5').is(':tabbable'), 'input, type button');
	ok(!$('#input1-6').is(':tabbable'), 'input, type hidden');
	ok( $('#input1-7').is(':tabbable'), 'select');
	ok( $('#input1-8').is(':tabbable'), 'textarea');
	ok( $('#anchor1-1').is(':tabbable'), 'anchor with href');
	ok(!$('#anchor1-2').is(':tabbable'), 'anchor without href');
});

test("tabbable - disabled elements", function() {
	expect(8);

	ok(!$('#input2-1').is(':tabbable'), 'input, no type');
	ok(!$('#input2-2').is(':tabbable'), 'input, type text');
	ok(!$('#input2-3').is(':tabbable'), 'input, type checkbox');
	ok(!$('#input2-4').is(':tabbable'), 'input, type radio');
	ok(!$('#input2-5').is(':tabbable'), 'input, type button');
	ok(!$('#input2-6').is(':tabbable'), 'input, type hidden');
	ok(!$('#input2-7').is(':tabbable'), 'select');
	ok(!$('#input2-8').is(':tabbable'), 'textarea');
});

test("tabbable - hidden styles", function() {
	expect(6);

	ok(!$('#input3-1').is(':tabbable'), 'input, hidden wrapper - display: none');
	ok(!$('#anchor3-1').is(':tabbable'), 'anchor, hidden wrapper - display: none');
	ok(!$('#input3-2').is(':tabbable'), 'input, hidden wrapper - visibility: hidden');
	ok(!$('#anchor3-2').is(':tabbable'), 'anchor, hidden wrapper - visibility: hidden');
	ok(!$('#input3-3').is(':tabbable'), 'input, display: none');
	ok(!$('#input3-4').is(':tabbable'), 'input, visibility: hidden');
});

test("tabbable - tabindex", function() {
	expect(4);

	ok( $('#input4-1').is(':tabbable'), 'input, tabindex 0');
	ok( $('#input4-2').is(':tabbable'), 'input, tabindex 10');
	ok(!$('#input4-3').is(':tabbable'), 'input, tabindex -1');
	ok(!$('#input4-4').is(':tabbable'), 'input, tabindex -50');
});

module('jQuery extensions');

test("attr - aria", function() {
	expect(6);

	var el = $('#aria');

	ok(!el.attr('role'), 'role is empty via attr');
	equals(el.attr('role', 'tablist').attr('role'), 'tablist', 'role is tablist');

	equals(el.attr('aria-expanded'), undefined, 'aria expanded is undefined');

	el.attr('aria-expanded', true);
	equals(el.attr('aria-expanded'), 'true', 'aria expanded is true');

	el.removeAttr('aria-expanded');
	equals(el.attr('aria-expanded'), undefined, 'aria expanded is undefined after removing');

	el.attr('aria-expanded', false);
	equals(el.attr('aria-expanded'), 'false', 'aria expanded is false');
});

})(jQuery);
