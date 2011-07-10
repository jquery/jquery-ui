/*
 * selector unit tests
 */
(function($) {

module("core - selectors");

function isFocusable(selector, msg) {
	ok($(selector).is(':focusable'), msg + " - selector " + selector + " is focusable");
}

function isNotFocusable(selector, msg) {
	ok($(selector).length && !$(selector).is(':focusable'), msg + " - selector " + selector + " is not focusable");
}

function isTabbable(selector, msg) {
	ok($(selector).is(':tabbable'), msg + " - selector " + selector + " is tabbable");
}

function isNotTabbable(selector, msg) {
	ok($(selector).length && !$(selector).is(':tabbable'), msg + " - selector " + selector + " is not tabbable");
}

test("data", function() {
	expect(15);
	
	var el;
	function shouldHaveData(msg) {
		ok(el.is(':data(test)'), msg);
	}
	function shouldNotHaveData(msg) {
		ok(!el.is(':data(test)'), msg);
	}
	
	el = $('<div/>');
	shouldNotHaveData('data never set');
	
	el = $('<div/>').data('test', null);
	shouldNotHaveData('data is null');
	
	el = $('<div/>').data('test', true);
	shouldHaveData('data set to true');
	
	el = $('<div/>').data('test', false);
	shouldNotHaveData('data set to false');
	
	el = $('<div/>').data('test', 0);
	shouldNotHaveData('data set to 0');
	
	el = $('<div/>').data('test', 1);
	shouldHaveData('data set to 1');
	
	el = $('<div/>').data('test', '');
	shouldNotHaveData('data set to empty string');
	
	el = $('<div/>').data('test', 'foo');
	shouldHaveData('data set to string');
	
	el = $('<div/>').data('test', []);
	shouldHaveData('data set to empty array');
	
	el = $('<div/>').data('test', [1]);
	shouldHaveData('data set to array');
	
	el = $('<div/>').data('test', {});
	shouldHaveData('data set to empty object');
	
	el = $('<div/>').data('test', {foo: 'bar'});
	shouldHaveData('data set to object');
	
	el = $('<div/>').data('test', new Date());
	shouldHaveData('data set to date');
	
	el = $('<div/>').data('test', /test/);
	shouldHaveData('data set to regexp');
	
	el = $('<div/>').data('test', function() {});
	shouldHaveData('data set to function');
});

test("focusable - visible, enabled elements", function() {
	expect(16);
	
	isFocusable('#visibleAncestor-inputTypeNone', 'input, no type');
	isFocusable('#visibleAncestor-inputTypeText', 'input, type text');
	isFocusable('#visibleAncestor-inputTypeCheckbox', 'input, type checkbox');
	isFocusable('#visibleAncestor-inputTypeRadio', 'input, type radio');
	isFocusable('#visibleAncestor-inputTypeButton', 'input, type button');
	isNotFocusable('#visibleAncestor-inputTypeHidden', 'input, type hidden');
	isFocusable('#visibleAncestor-button', 'button');
	isFocusable('#visibleAncestor-select', 'select');
	isFocusable('#visibleAncestor-textarea', 'textarea');
	isFocusable('#visibleAncestor-object', 'object');
	isFocusable('#visibleAncestor-anchorWithHref', 'anchor with href');
	isNotFocusable('#visibleAncestor-anchorWithoutHref', 'anchor without href');
	isNotFocusable('#visibleAncestor-span', 'span');
	isNotFocusable('#visibleAncestor-div', 'div');
	isFocusable("#visibleAncestor-spanWithTabindex", 'span with tabindex');
	isFocusable("#visibleAncestor-divWithNegativeTabindex", 'div with tabindex');
});

test("focusable - disabled elements", function() {
	expect(9);
	
	isNotFocusable('#disabledElement-inputTypeNone', 'input, no type');
	isNotFocusable('#disabledElement-inputTypeText', 'input, type text');
	isNotFocusable('#disabledElement-inputTypeCheckbox', 'input, type checkbox');
	isNotFocusable('#disabledElement-inputTypeRadio', 'input, type radio');
	isNotFocusable('#disabledElement-inputTypeButton', 'input, type button');
	isNotFocusable('#disabledElement-inputTypeHidden', 'input, type hidden');
	isNotFocusable('#disabledElement-button', 'button');
	isNotFocusable('#disabledElement-select', 'select');
	isNotFocusable('#disabledElement-textarea', 'textarea');
});

test("focusable - hidden styles", function() {
	expect(8);
	
	isNotFocusable('#displayNoneAncestor-input', 'input, display: none parent');
	isNotFocusable('#displayNoneAncestor-span', 'span with tabindex, display: none parent');
	
	isNotFocusable('#visibilityHiddenAncestor-input', 'input, visibility: hidden parent');
	isNotFocusable('#visibilityHiddenAncestor-span', 'span with tabindex, visibility: hidden parent');
	
	isNotFocusable('#displayNone-input', 'input, display: none');
	isNotFocusable('#visibilityHidden-input', 'input, visibility: hidden');
	
	isNotFocusable('#displayNone-span', 'span with tabindex, display: none');
	isNotFocusable('#visibilityHidden-span', 'span with tabindex, visibility: hidden');
});

test("focusable - natively focusable with various tabindex", function() {
	expect(4);
	
	isFocusable('#inputTabindex0', 'input, tabindex 0');
	isFocusable('#inputTabindex10', 'input, tabindex 10');
	isFocusable('#inputTabindex-1', 'input, tabindex -1');
	isFocusable('#inputTabindex-50', 'input, tabindex -50');
});

test("focusable - not natively focusable with various tabindex", function() {
	expect(4);
	
	isFocusable('#spanTabindex0', 'span, tabindex 0');
	isFocusable('#spanTabindex10', 'span, tabindex 10');
	isFocusable('#spanTabindex-1', 'span, tabindex -1');
	isFocusable('#spanTabindex-50', 'span, tabindex -50');
});

test("focusable - invalid tabindex", function() {
	expect(4);
	
	isFocusable('#inputTabindexfoo', 'input, tabindex foo');
	isFocusable('#inputTabindex3foo', 'input, tabindex 3foo');
	isNotFocusable('#spanTabindexfoo', 'span tabindex foo');
	isNotFocusable('#spanTabindex3foo', 'span, tabindex 3foo');
});

test("focusable - area elements", function() {
	isNotFocusable('#areaCoordsNoHref', 'coords but no href');
	isFocusable('#areaCoordsHref', 'coords and href');
	isFocusable('#areaCoordsNoSizeHref', 'coords of zero px and href');
	isFocusable('#areaNoCoordsHref', 'href but no coords');
	isNotFocusable('#areaNoImg', 'not associated with an image');
});

test("tabbable - visible, enabled elements", function() {
	expect(16);
	
	isTabbable('#visibleAncestor-inputTypeNone', 'input, no type');
	isTabbable('#visibleAncestor-inputTypeText', 'input, type text');
	isTabbable('#visibleAncestor-inputTypeCheckbox', 'input, type checkbox');
	isTabbable('#visibleAncestor-inputTypeRadio', 'input, type radio');
	isTabbable('#visibleAncestor-inputTypeButton', 'input, type button');
	isNotTabbable('#visibleAncestor-inputTypeHidden', 'input, type hidden');
	isTabbable('#visibleAncestor-button', 'button');
	isTabbable('#visibleAncestor-select', 'select');
	isTabbable('#visibleAncestor-textarea', 'textarea');
	isTabbable('#visibleAncestor-object', 'object');
	isTabbable('#visibleAncestor-anchorWithHref', 'anchor with href');
	isNotTabbable('#visibleAncestor-anchorWithoutHref', 'anchor without href');
	isNotTabbable('#visibleAncestor-span', 'span');
	isNotTabbable('#visibleAncestor-div', 'div');
	isTabbable("#visibleAncestor-spanWithTabindex", 'span with tabindex');
	isNotTabbable("#visibleAncestor-divWithNegativeTabindex", 'div with tabindex');
});

test("tabbable - disabled elements", function() {
	expect(9);
	
	isNotTabbable('#disabledElement-inputTypeNone', 'input, no type');
	isNotTabbable('#disabledElement-inputTypeText', 'input, type text');
	isNotTabbable('#disabledElement-inputTypeCheckbox', 'input, type checkbox');
	isNotTabbable('#disabledElement-inputTypeRadio', 'input, type radio');
	isNotTabbable('#disabledElement-inputTypeButton', 'input, type button');
	isNotTabbable('#disabledElement-inputTypeHidden', 'input, type hidden');
	isNotTabbable('#disabledElement-button', 'button');
	isNotTabbable('#disabledElement-select', 'select');
	isNotTabbable('#disabledElement-textarea', 'textarea');
});

test("tabbable - hidden styles", function() {
	expect(8);
	
	isNotTabbable('#displayNoneAncestor-input', 'input, display: none parent');
	isNotTabbable('#displayNoneAncestor-span', 'span with tabindex, display: none parent');
	
	isNotTabbable('#visibilityHiddenAncestor-input', 'input, visibility: hidden parent');
	isNotTabbable('#visibilityHiddenAncestor-span', 'span with tabindex, visibility: hidden parent');
	
	isNotTabbable('#displayNone-input', 'input, display: none');
	isNotTabbable('#visibilityHidden-input', 'input, visibility: hidden');
	
	isNotTabbable('#displayNone-span', 'span with tabindex, display: none');
	isNotTabbable('#visibilityHidden-span', 'span with tabindex, visibility: hidden');
});

test("tabbable -  natively tabbable with various tabindex", function() {
	expect(4);
	
	isTabbable('#inputTabindex0', 'input, tabindex 0');
	isTabbable('#inputTabindex10', 'input, tabindex 10');
	isNotTabbable('#inputTabindex-1', 'input, tabindex -1');
	isNotTabbable('#inputTabindex-50', 'input, tabindex -50');
});

test("tabbable -  not natively tabbable with various tabindex", function() {
	expect(4);
	
	isTabbable('#spanTabindex0', 'span, tabindex 0');
	isTabbable('#spanTabindex10', 'span, tabindex 10');
	isNotTabbable('#spanTabindex-1', 'span, tabindex -1');
	isNotTabbable('#spanTabindex-50', 'span, tabindex -50');
});

test("tabbable - invalid tabindex", function() {
	expect(4);
	
	isTabbable('#inputTabindexfoo', 'input, tabindex foo');
	isTabbable('#inputTabindex3foo', 'input, tabindex 3foo');
	isNotTabbable('#spanTabindexfoo', 'span tabindex foo');
	isNotTabbable('#spanTabindex3foo', 'span, tabindex 3foo');
});

test("tabbable - area elements", function() {
	isNotTabbable('#areaCoordsNoHref', 'coords but no href');
	isTabbable('#areaCoordsHref', 'coords and href');
	isTabbable('#areaCoordsNoSizeHref', 'coords of zero px and href');
	isTabbable('#areaNoCoordsHref', 'href but no coords');
	isNotTabbable('#areaNoImg', 'not associated with an image');
});

})(jQuery);
