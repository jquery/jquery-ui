/*
 * droppable unit tests
 */
(function($) {
//
// Droppable Test Helper Functions
//

var defaults = {
	accept: null,
	activeClass: null,
	cssNamespace: "ui",
	disabled: false,
	greedy: false,
	hoverClass: null,
	scope: "default",
	tolerance: "intersect"
};

var el, drg;

function shouldBeDroppable() {
	ok(false, "missing test - should be droppable");
}

function shouldNotBeDroppable() {
	ok(false, "missing test - should not be droppable");
}

// Droppable Tests
module("droppable");

test("init", function() {
	expect(6);

	$("<div></div>").appendTo('body').droppable().remove();
	ok(true, '.droppable() called on element');

	$([]).droppable();
	ok(true, '.droppable() called on empty collection');

	$("<div></div>").droppable();
	ok(true, '.droppable() called on disconnected DOMElement');

	$("<div></div>").droppable().droppable("foo");
	ok(true, 'arbitrary method called after init');

	$("<div></div>").droppable().data("foo.droppable");
	ok(true, 'arbitrary option getter after init');

	$("<div></div>").droppable().data("foo.droppable", "bar");
	ok(true, 'arbitrary option setter after init');
});

test("destroy", function() {
	expect(6);

	$("<div></div>").appendTo('body').droppable().droppable("destroy").remove();
	ok(true, '.droppable("destroy") called on element');

	$([]).droppable().droppable("destroy");
	ok(true, '.droppable("destroy") called on empty collection');

	$("<div></div>").droppable().droppable("destroy");
	ok(true, '.droppable("destroy") called on disconnected DOMElement');

	$("<div></div>").droppable().droppable("destroy").droppable("foo");
	ok(true, 'arbitrary method called after destroy');

	$("<div></div>").droppable().droppable("destroy").data("foo.droppable");
	ok(true, 'arbitrary option getter after destroy');

	$("<div></div>").droppable().droppable("destroy").data("foo.droppable", "bar");
	ok(true, 'arbitrary option setter after destroy');
});

test("enable", function() {
	expect(6);
	el = $("#droppable1").droppable({ disabled: true });
	shouldNotBeDroppable();
	el.droppable("enable");
	shouldBeDroppable();
	equals(el.data("disabled.droppable"), false, "disabled.droppable getter");
	el.droppable("destroy");
	el.droppable({ disabled: true });
	shouldNotBeDroppable();
	el.data("disabled.droppable", false);
	equals(el.data("disabled.droppable"), false, "disabled.droppable setter");
	shouldBeDroppable();
});

test("disable", function() {
	expect(6);
	el = $("#droppable1").droppable({ disabled: false });
	shouldBeDroppable();
	el.droppable("disable");
	shouldNotBeDroppable();
	equals(el.data("disabled.droppable"), true, "disabled.droppable getter");
	el.droppable("destroy");
	el.droppable({ disabled: false });
	shouldBeDroppable();
	el.data("disabled.droppable", true);
	equals(el.data("disabled.droppable"), true, "disabled.droppable setter");
	shouldNotBeDroppable();
});

test("element types", function() {
	var typeNames = ('p,h1,h2,h3,h4,h5,h6,blockquote,ol,ul,dl,div,form'
		+ ',table,fieldset,address,ins,del,em,strong,q,cite,dfn,abbr'
		+ ',acronym,code,samp,kbd,var,img,object,hr'
		+ ',input,button,label,select,iframe').split(',');

	$.each(typeNames, function(i) {
		var typeName = typeNames[i];
		el = $(document.createElement(typeName)).appendTo('body');
		(typeName == 'table' && el.append("<tr><td>content</td></tr>"));
		el.droppable();
		shouldBeDroppable();
		el.droppable("destroy");
		el.remove();
	});
});

test("defaults", function() {
	el = $("<div></div>").droppable();
	$.each(defaults, function(key, val) {
		var actual = el.data(key + ".droppable"), expected = val;
		same(actual, expected, key);
	});
	el.remove();
});

test("option setting", function() {
	// The plugin shouldn't modify an option value set by the user
	$.each(defaults, function(key, val) {
		el = $("<div></div>").droppable();
		el.data(key + ".droppable", val);
		var actual = el.data(key + ".droppable"), expected = val;
		same(actual, expected, key);
		el.remove();
	});
});

module("droppable: Options");

test("accept, selector", function() {
	ok(false, "missing test");
});

test("accept, fn", function() {
	ok(false, "missing test");
});

test("activeClass", function() {
	ok(false, "missing test");
});

test("cssNamespace", function() {
	//cssNamespace should be appended with '-droppable' and added as className
	el = $("<div></div>").droppable({ cssNamespace: "ui" });
	equals(el[0].className, "ui-droppable");
	el.droppable("destroy");

	//no className should be added if cssNamepsace is null
	el = $("<div></div>").droppable({ cssNamespace: null });
	equals(el[0].className, "");
	el.droppable("destroy");
});

test("greedy", function() {
	ok(false, "missing test");
});

test("hoverClass", function() {
	ok(false, "missing test");
});

test("scope", function() {
	ok(false, "missing test");
});

test("tolerance, fit", function() {
	ok(false, "missing test");
});

test("tolerance, intersect", function() {
	ok(false, "missing test");
});

test("tolerance, pointer", function() {
	ok(false, "missing test");
});

test("tolerance, touch", function() {
	ok(false, "missing test");
});

module("droppable: Callbacks");

test("activate", function() {
	ok(false, "missing test");
});

test("deactivate", function() {
	ok(false, "missing test");
});

test("over", function() {
	ok(false, "missing test");
});

test("out", function() {
	ok(false, "missing test");
});

test("drop", function() {
	ok(false, "missing test");
});

module("droppable: Tickets");


})(jQuery);
