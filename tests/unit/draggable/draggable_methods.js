/*
 * draggable_methods.js
 */
(function($) {

module("draggable: methods");

test("init", function() {
	expect(5);

	$("<div></div>").appendTo("body").draggable().remove();
	ok(true, ".draggable() called on element");

	$([]).draggable();
	ok(true, ".draggable() called on empty collection");

	$("<div></div>").draggable();
	ok(true, ".draggable() called on disconnected DOMElement");

	$("<div></div>").draggable().draggable("option", "foo");
	ok(true, "arbitrary option getter after init");

	$("<div></div>").draggable().draggable("option", "foo", "bar");
	ok(true, "arbitrary option setter after init");
});

test("destroy", function() {
	expect(4);
	$("<div></div>").appendTo("body").draggable().draggable("destroy").remove();
	ok(true, ".draggable('destroy') called on element");

	$([]).draggable().draggable("destroy");
	ok(true, ".draggable('destroy') called on empty collection");

	$("<div></div>").draggable().draggable("destroy");
	ok(true, ".draggable('destroy') called on disconnected DOMElement");

	var expected = $("<div></div>").draggable(),
		actual = expected.draggable("destroy");
	equal(actual, expected, "destroy is chainable");
});

test("enable", function() {
	expect(7);

	var expected, actual, el;

	el = $("#draggable2").draggable({ disabled: true });
	TestHelpers.draggable.shouldNotMove(el, ".draggable({ disabled: true })");

	el.draggable("enable");
	TestHelpers.draggable.shouldMove(el, ".draggable('enable')");
	equal(el.draggable("option", "disabled"), false, "disabled option getter");

	el.draggable("destroy");
	el.draggable({ disabled: true });
	TestHelpers.draggable.shouldNotMove(el, ".draggable({ disabled: true })");

	el.draggable("option", "disabled", false);
	equal(el.draggable("option", "disabled"), false, "disabled option setter");
	TestHelpers.draggable.shouldMove(el, ".draggable('option', 'disabled', false)");

	expected = $("<div></div>").draggable(),
	actual = expected.draggable("enable");
	equal(actual, expected, "enable is chainable");
});

test("disable", function() {
	expect(7);

	var expected, actual, el;

	el = $("#draggable2").draggable({ disabled: false });
	TestHelpers.draggable.shouldMove(el, ".draggable({ disabled: false })");

	el.draggable("disable");
	TestHelpers.draggable.shouldNotMove(el, ".draggable('disable')");
	equal(el.draggable("option", "disabled"), true, "disabled option getter");

	el.draggable("destroy");

	el.draggable({ disabled: false });
	TestHelpers.draggable.shouldMove(el, ".draggable({ disabled: false })");

	el.draggable("option", "disabled", true);
	equal(el.draggable("option", "disabled"), true, "disabled option setter");
	TestHelpers.draggable.shouldNotMove(el, ".draggable('option', 'disabled', true)");

	expected = $("<div></div>").draggable(),
	actual = expected.draggable("disable");
	equal(actual, expected, "disable is chainable");
});

})(jQuery);
