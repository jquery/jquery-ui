/*
 * accordion_options.js
 */
(function($) {

module("accordion: options");

test("{ active: first child }, default", function() {
	var ac = $("#list1").accordion();
	equals( ac.accordion('option', 'active'), 0);
	state(ac, 1, 0, 0)
});

test("{ active: Selector }", function() {
	var ac = $("#list1").accordion({
		active: "a:last"
	});
	state(ac, 0, 0, 1);
	ac.accordion('option', 'active', "a:eq(1)");
	state(ac, 0, 1, 0);
});

test("{ active: Element }", function() {
	var ac = $("#list1").accordion({
		active: $("#list1 a:last")[0]
	});
	state(ac, 0, 0, 1);
	ac.accordion('option', 'active', $("#list1 a:eq(1)")[0]);
	state(ac, 0, 1, 0);
});

test("{ active: jQuery Object }", function() {
	var ac = $("#list1").accordion({
		active: $("#list1 a:last")
	});
	state(ac, 0, 0, 1);
	ac.accordion('option', 'active', $("#list1 a:eq(1)"));
	state(ac, 0, 1, 0);
});

test("{ active: false }", function() {
	var ac = $("#list1").accordion({
		active: false,
		collapsible: true
	});
	state(ac, 0, 0, 0);
	equals( $("#list1 .ui-accordion-header.ui-state-active").size(), 0, "no headers selected" );
	equals( $("#list1").accordion('option', 'active'), false);
});

test("{ active: Number }", function() {
	expect(4);
	$("#list1").accordion({
		active: 0
	});
	equals( $("#list1").accordion('option', 'active'), 0);

	$("#list1").accordion('option', 'active', 1);
	equals( $("#list1").accordion('option', 'active'), 1);

	$('.ui-accordion-header:eq(2)', '#list1').click();
	equals( $("#list1").accordion('option', 'active'), 2);

	$("#list1").accordion('activate', 0);
	equals( $("#list1").accordion('option', 'active'), 0);
});

test("{ autoHeight: true }, default", function() {
	equalHeights($('#navigation').accordion({ autoHeight: true }), 95, 130);
});

test("{ autoHeight: false }", function() {
	var accordion = $('#navigation').accordion({ autoHeight: false });
	var sizes = [];
	accordion.find(".ui-accordion-content").each(function() {
		sizes.push($(this).height());
	});
	ok( sizes[0] >= 70 && sizes[0] <= 90, "was " + sizes[0] );
	ok( sizes[1] >= 98 && sizes[1] <= 126, "was " + sizes[1] );
	ok( sizes[2] >= 42 && sizes[2] <= 54, "was " + sizes[2] );
});

test("{ collapsible: false }, default", function() {
	var ac = $("#list1").accordion();
	ac.accordion("activate", false);
	state(ac, 1, 0, 0);
});

test("{ collapsible: true }", function() {
	var ac = $("#list1").accordion({
		active: 1,
		collapsible: true
	});
	var header = $('#list1 .ui-accordion-header:eq(1)').click();
	equals( $("#list1").accordion('option', 'active'), false);
	state(ac, 0, 0, 0);
});

// fillSpace: false == autoHeight: true, covered above
test("{ fillSpace: true }", function() {
	$("#navigationWrapper").height(500);
	equalHeights($('#navigation').accordion({ fillSpace: true }), 446, 458);
});

test("{ header: '> li > :first-child,> :not(li):even' }, default", function() {
	state($("#list1").accordion(), 1, 0, 0);
	state($("#navigation").accordion(), 1, 0, 0);
});

test("{ icons: false }", function() {
	var list = $("#list1");
	function icons(on) {
		same($("span.ui-icon", list).length, on ? 3 : 0);
		same( list.hasClass("ui-accordion-icons"), on );
	}
	list.accordion();
	icons(true);
	list.accordion("destroy").accordion({
		icons: false
	});
	icons(false);
	list.accordion("option", "icons", $.ui.accordion.prototype.options.icons);
	icons(true);
	list.accordion("option", "icons", false);
	icons(false);
});

test("{ navigation: true, navigationFilter: header }", function() {
	$("#navigation").accordion({
		navigation: true,
		navigationFilter: function() {
			return /\?p=1\.1\.3$/.test(this.href);
		}
	});
	equals( $("#navigation .ui-accordion-content:eq(2)").size(), 1, "third content active" );
});

test("{ navigation: true, navigationFilter: content }", function() {
	$("#navigation").accordion({
		navigation: true,
		navigationFilter: function() {
			return /\?p=1\.1\.3\.2$/.test(this.href);
		}
	});
	equals( $("#navigation .ui-accordion-content:eq(2)").size(), 1, "third content active" );
});

})(jQuery);
