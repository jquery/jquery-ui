/*
 * accordion_core.js
 */

jQuery.ui.accordion.defaults.animated = false;

function state(accordion) {
	var args = $.makeArray(arguments).slice(1);
	$.each(args, function(i, n) {
		equals(accordion.find(".ui-accordion-content").eq(i).is(":visible"), n);
	});
}

function state2(accordion) {
	var args = $.makeArray(arguments).slice(1);
	$.each(args, function(i, n) {
		equals(accordion.find("div").eq(i).is(":visible"), n);
	});
}

$.fn.triggerEvent = function(type, target) {
	return this.triggerHandler(type, [jQuery.event.fix({ type: type, target: target })]);
};

(function($) {

module("accordion: core");

test("handle click on header-descendant", function() {
	var ac = $('#navigation').accordion({ autoHeight: false });
	ac.triggerEvent("click", $('#navigation span:contains(Bass)')[0]);
	state2(ac, 0, 1, 0);
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
