/*
 * accordion unit tests
 */
(function($) {

module("accordion");

jQuery.ui.accordion.defaults.animated = false;

function state(accordion) {
	var args = $.makeArray(arguments).slice(1);
	$.each(args, function(i, n) {
		equals(accordion.find("div").eq(i).is(":visible"), n);
	});
}

$.fn.triggerEvent = function(type, target) {
	return this.triggerHandler(type, [jQuery.event.fix({ type: type, target: target })]);
}

test("basics", function() {
	state($('#list1').accordion(), 1, 0, 0);
});

test("autoheight", function() {
	$('#navigation').accordion({ header: '.head', autoHeight: false });
	equals( 90, $('#navigation ul:first').height() );
	equals( 126, $('#navigation ul:eq(1)').height() );
	equals( 54, $('#navigation ul:last').height() );
	$('#navigation').accordion("destroy").accordion({ header: '.head', autoHeight: true });
	equals( 126, $('#navigation ul:first').height() );
	equals( 126, $('#navigation ul:eq(1)').height() );
	equals( 126, $('#navigation ul:last').height() );
});

test("activate, numeric", function() {
	var ac = $('#list1').accordion({ active: 1 });
	state(ac, 0, 1, 0);
	ac.accordion("activate", 2);
	state(ac, 0, 0, 1);
	ac.accordion("activate", 0);
	state(ac, 1, 0, 0);
	ac.accordion("activate", 1);
	state(ac, 0, 1, 0);
	ac.accordion("activate", 2);
	state(ac, 0, 0, 1);
	ac.accordion("activate", -1);
	state(ac, 0, 0, 1);
});

test("activate, boolean and numeric, alwaysOpen:false", function() {
	var ac = $('#list1').accordion({alwaysOpen: false}).accordion("activate", 2);
	state(ac, 0, 0, 1);
	ok("x", "----");
	ac.accordion("activate", 0);
	state(ac, 1, 0, 0);
	ok("x", "----");
	ac.accordion("activate", -1);
	state(ac, 0, 0, 0);
});

test("activate, boolean, alwaysOpen:true", function() {
	var ac = $('#list1').accordion().accordion("activate", 2);
	state(ac, 0, 0, 1);
	ac.accordion("activate", -1);
	state(ac, 0, 0, 1);
});

test("activate, string expression", function() {
	var ac = $('#list1').accordion({ active: ":last" });
	state(ac, 0, 0, 1);
	ac.accordion("activate", ":first");
	state(ac, 1, 0, 0);
	ac.accordion("activate", ":eq(1)");
	state(ac, 0, 1, 0);
	ac.accordion("activate", ":last");
	state(ac, 0, 0, 1);
});

test("activate, jQuery or DOM element", function() {
	var ac = $('#list1').accordion({ active: $("#list1 a:last") });
	state(ac, 0, 0, 1);
	ac.accordion("activate", $("#list1 a:first"));
	state(ac, 1, 0, 0);
	ac.accordion("activate", $("#list1 a")[1]);
	state(ac, 0, 1, 0);
});

function state2(accordion) {
	var args = $.makeArray(arguments).slice(1);
	$.each(args, function(i, n) {
		equals(accordion.find("ul").eq(i).is(":visible"), n);
	});
}

test("handle click on header-descendant", function() {
	var ac = $('#navigation').accordion({ header: '.head', autoHeight: false })
	ac.triggerEvent("click", $('#navigation span:contains(Bass)')[0]);
	state2(ac, 0, 1, 0);
});

test("active:false", function() {
	$("#list1").accordion({
		active: false,
		alwaysOpen: false
	});
	equals( $("#list1 a.selected").size(), 0, "no headers selected" );
});

test("accordionchange event, open closed and close again", function() {
	expect(8);
	$("#list1").accordion({
		active: false,
		alwaysOpen: false
	})
	.one("accordionchange", function(event, ui) {
		equals( ui.oldHeader.size(), 0 )
		equals( ui.oldContent.size(), 0 )
		equals( ui.newHeader.size(), 1 )
		equals( ui.newContent.size(), 1 )
	})
	.accordion("activate", 0)
	.one("accordionchange", function(event, ui) {
		equals( ui.oldHeader.size(), 1 )
		equals( ui.oldContent.size(), 1 )
		equals( ui.newHeader.size(), 0 )
		equals( ui.newContent.size(), 0 )
	})
	.accordion("activate", 0);
});

test("accessibility", function () {
	expect(9);
	var ac = $('#list1').accordion().accordion("activate", 1);
	var headers = $(".ui-accordion-header");

	equals( headers.eq(1).attr("tabindex"), "0", "active header should have tabindex=0");
	equals( headers.eq(0).attr("tabindex"), "-1", "inactive header should have tabindex=-1");
	equals( ac.attr("role"), "tablist", "main role");
	equals( headers.attr("role"), "tab", "tab roles");
	equals( headers.next().attr("role"), "tabpanel", "tabpanel roles");
	equals( headers.eq(1).attr("aria-expanded"), "true", "active tab has aria-expanded");
	equals( headers.eq(0).attr("aria-expanded"), "false", "inactive tab has aria-expanded");
	ac.accordion("activate", 0);
	equals( headers.eq(0).attr("aria-expanded"), "true", "newly active tab has aria-expanded");
	equals( headers.eq(1).attr("aria-expanded"), "false", "newly inactive tab has aria-expanded");
});


})(jQuery);
